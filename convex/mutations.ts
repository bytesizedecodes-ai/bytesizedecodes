/**
 * Convex mutations — the server-side DataMutations implementation.
 *
 * Each maps 1:1 to a method of lib/data/local.ts LocalStore, with the in-memory
 * PersistedStateV1 blob swapped for Convex db reads/writes. The orchestration, the
 * XP/streak/SRS math, and the AttemptResult shape are identical to Phase 0.
 *
 * Identity flows through getUserId() — Convex Auth subject only
 * (convex/lib/getUser.ts). Never authorize from a client-supplied userId.
 */

import { MutationCtx, mutation, internalMutation, action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { Doc, Id } from "./_generated/dataModel";
import { getUserId } from "./lib/getUser";
import { asDayKey, todayKey, type DayKey } from "./lib/day";
import { describeInterval, newSrsState, review, type SrsState } from "./lib/srs";
import { settleOnPractice, settleOnRollover, type StreakFields } from "./lib/streak";
import {
  applyRepeatDiminishing,
  freezesEarnedAt,
  levelFromXp,
  levelProgress,
  rollByteXp,
  rollDrillXp,
  rollReviewXp,
} from "./lib/xp";
import type { PersistedStateV1 } from "./shared";

const ATTEMPT_CAP = 500;
const XP_EVENT_CAP = 500;

// ---------- result + arg validators ----------

const attemptResult = v.object({
  xpAwarded: v.number(),
  critical: v.boolean(),
  xpTotal: v.number(),
  level: v.number(),
  leveledUp: v.boolean(),
  currentStreak: v.number(),
  streakExtended: v.boolean(),
  freezeEarned: v.boolean(),
  nextReview: v.union(v.string(), v.null()),
});

const attemptInput = v.object({
  userId: v.string(),
  itemKey: v.string(),
  topic: v.string(),
  mode: v.union(v.literal("byte"), v.literal("review"), v.literal("practice")),
  correct: v.boolean(),
  msTaken: v.number(),
  today: v.string(),
  difficulty: v.optional(v.number()),
});

const reviewInput = v.object({
  ...attemptInput.fields,
  grade: v.union(
    v.literal("again"),
    v.literal("hard"),
    v.literal("good"),
    v.literal("easy"),
  ),
});

const trackValidator = v.union(
  v.literal("grad"),
  v.literal("beginner"),
  v.literal("engineer"),
  v.literal("founder"),
);

const startingLevelValidator = v.union(
  v.literal("new"),
  v.literal("some"),
  v.literal("comfortable"),
);

const timeModeValidator = v.union(
  v.literal("quick"),
  v.literal("standard"),
  v.literal("deep"),
);

export interface AttemptResult {
  xpAwarded: number;
  critical: boolean;
  xpTotal: number;
  level: number;
  leveledUp: boolean;
  currentStreak: number;
  streakExtended: boolean;
  freezeEarned: boolean;
  nextReview: string | null;
}

// ---------- helpers ----------

/** Load the user's profile, creating a fresh one on first touch (fresh-start model). */
async function loadOrCreateProfile(
  ctx: MutationCtx,
  userId: string,
): Promise<Doc<"profiles">> {
  const existing = await ctx.db
    .query("profiles")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .unique();
  if (existing) {
    // Keep displayName in sync with identity name when still the default seed label.
    const identity = await ctx.auth.getUserIdentity();
    if (
      existing.displayName === "You" &&
      identity?.name &&
      identity.name.trim().length > 0
    ) {
      await ctx.db.patch(existing._id, { displayName: identity.name.trim() });
      return (await ctx.db.get(existing._id))!;
    }
    return existing;
  }
  const identity = await ctx.auth.getUserIdentity();
  const displayName =
    identity?.name?.trim() ||
    identity?.email?.split("@")[0] ||
    "You";
  const id = await ctx.db.insert("profiles", {
    userId,
    displayName,
    track: "grad",
    xpTotal: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastPracticeDay: null,
    streakFreezes: 1,
    createdAt: Date.now(),
  });
  return (await ctx.db.get(id))!;
}

/**
 * The server is authoritative for "today" — clients can't roll their own day boundary.
 * We trust the earlier of the client's claimed day and the server's IST day so a
 * mutation that lands just past midnight doesn't accidentally jump a day.
 */
function serverToday(arg: string): DayKey {
  const clientToday = asDayKey(arg);
  const server = todayKey();
  return clientToday <= server ? clientToday : server;
}

async function recordAttempt(
  ctx: MutationCtx,
  userId: string,
  input: {
    itemKey: string;
    topic: string;
    mode: "byte" | "review" | "practice";
    correct: boolean;
    msTaken: number;
    today: DayKey;
  },
): Promise<void> {
  await ctx.db.insert("attempts", {
    userId,
    itemKey: input.itemKey,
    topic: input.topic,
    mode: input.mode,
    correct: input.correct,
    msTaken: input.msTaken,
    day: input.today,
    at: Date.now(),
  });
  await trimToCap(ctx, "attempts", userId, ATTEMPT_CAP);
}

/**
 * Award XP atomically: bump xpTotal, append the ledger event, return the new level state.
 */
async function awardXp(
  ctx: MutationCtx,
  userId: string,
  profile: Doc<"profiles">,
  amount: number,
  reason: string,
  refKey: string,
  day: DayKey,
): Promise<{ xpTotal: number; level: number; leveledUp: boolean }> {
  const before = levelFromXp(profile.xpTotal);
  const xpTotal = profile.xpTotal + amount;

  await ctx.db.insert("xpEvents", {
    userId,
    amount,
    reason,
    refKey,
    day,
    at: Date.now(),
  });
  await trimToCap(ctx, "xpEvents", userId, XP_EVENT_CAP);

  await ctx.db.patch(profile._id, { xpTotal });
  const level = levelFromXp(xpTotal);
  return { xpTotal, level, leveledUp: level > before };
}

/**
 * Apply streak settlement, including the freeze earned every 7 consecutive days.
 * Mirrors LocalStore.applyPractice exactly.
 */
async function applyPractice(
  ctx: MutationCtx,
  userId: string,
  profile: Doc<"profiles">,
  today: DayKey,
): Promise<{ extended: boolean; freezeEarned: boolean }> {
  const before: StreakFields = {
    currentStreak: profile.currentStreak,
    longestStreak: profile.longestStreak,
    lastPracticeDay:
      profile.lastPracticeDay === null ? null : asDayKey(profile.lastPracticeDay),
    streakFreezes: profile.streakFreezes,
  };

  const freezesBefore = freezesEarnedAt(before.currentStreak);
  const settlement = settleOnPractice(before, today);
  const freezesAfter = freezesEarnedAt(settlement.fields.currentStreak);
  const freezeEarned = freezesAfter > freezesBefore;

  await ctx.db.patch(profile._id, {
    currentStreak: settlement.fields.currentStreak,
    longestStreak: settlement.fields.longestStreak,
    lastPracticeDay: settlement.fields.lastPracticeDay,
    streakFreezes: settlement.fields.streakFreezes + (freezeEarned ? 1 : 0),
  });

  return { extended: settlement.extended, freezeEarned };
}

/** Fetch the SRS doc for an item, creating it if absent (does not advance the schedule). */
async function ensureSrs(
  ctx: MutationCtx,
  userId: string,
  itemKey: string,
  topic: string,
  today: DayKey,
): Promise<SrsState> {
  const existing = await ctx.db
    .query("srsCards")
    .withIndex("by_user_item", (q) => q.eq("userId", userId).eq("itemKey", itemKey))
    .unique();
  if (existing) return srsDocToState(existing);
  const created = newSrsState(itemKey, topic, today);
  await ctx.db.insert("srsCards", {
    userId,
    itemKey,
    topic,
    ease: created.ease,
    intervalDays: created.intervalDays,
    dueDay: created.dueDay,
    reps: created.reps,
    lapses: created.lapses,
    lastReviewedDay: created.lastReviewedDay,
  });
  return created;
}

function srsDocToState(doc: Doc<"srsCards">): SrsState {
  return {
    itemKey: doc.itemKey,
    topic: doc.topic,
    ease: doc.ease,
    intervalDays: doc.intervalDays,
    dueDay: asDayKey(doc.dueDay),
    reps: doc.reps,
    lapses: doc.lapses,
    lastReviewedDay: doc.lastReviewedDay === null ? null : asDayKey(doc.lastReviewedDay),
  };
}

/** Delete oldest events beyond `cap` for a user's append-only table. */
async function trimToCap(
  ctx: MutationCtx,
  table: "attempts" | "xpEvents",
  userId: string,
  cap: number,
): Promise<void> {
  const count = (
    await ctx.db
      .query(table)
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect()
  ).length;
  if (count <= cap) return;
  const overflow = count - cap;
  const oldest = await ctx.db
    .query(table)
    .withIndex("by_user_at", (q) => q.eq("userId", userId))
    .order("asc")
    .take(overflow);
  for (const doc of oldest) {
    await ctx.db.delete(doc._id);
  }
}

async function wipeUser(ctx: MutationCtx, userId: string): Promise<void> {
  for (const table of [
    "profiles",
    "srsCards",
    "byteProgress",
    "attempts",
    "xpEvents",
    "analyticsEvents",
    "skillEvidence",
    "projects",
  ] as const) {
    const docs = await ctx.db
      .query(table)
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    for (const doc of docs) {
      await ctx.db.delete(doc._id);
    }
  }
}

// ---------- mutations ----------

export const updateOnboarding = mutation({
  args: {
    userId: v.string(),
    track: trackValidator,
    startingLevel: startingLevelValidator,
    weeklyMinutes: v.number(),
    preferredTimeMode: timeModeValidator,
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    if (!Number.isFinite(args.weeklyMinutes) || args.weeklyMinutes < 15 || args.weeklyMinutes > 600) {
      throw new Error("Weekly learning time must be between 15 and 600 minutes");
    }
    const userId = await getUserId(ctx, { userId: args.userId });
    const profile = await loadOrCreateProfile(ctx, userId);
    await ctx.db.patch(profile._id, {
      track: args.track,
      startingLevel: args.startingLevel,
      weeklyMinutes: Math.round(args.weeklyMinutes),
      preferredTimeMode: args.preferredTimeMode,
      onboardingCompletedAt: Date.now(),
    });
    await ctx.db.insert("analyticsEvents", {
      userId,
      name: "onboarding_completed",
      day: todayKey(),
      at: Date.now(),
      track: args.track,
      mode: args.preferredTimeMode,
    });
    return null;
  },
});

/** Create a minimal profile row for a signed-in user if missing (name from identity). */
export const ensureProfile = mutation({
  args: { userId: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx, { userId: args.userId });
    await loadOrCreateProfile(ctx, userId);
    return null;
  },
});

export const trackEvent = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    today: v.string(),
    refKey: v.optional(v.string()),
    track: v.optional(trackValidator),
    mode: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx, { userId: args.userId });
    await loadOrCreateProfile(ctx, userId);
    const allowed = new Set([
      "onboarding_started",
      "daily_plan_continued",
      "unit_completed",
      "review_graded",
      "practice_answered",
      "repair_link_clicked",
      "code_test_passed",
    ]);
    if (!allowed.has(args.name)) {
      throw new Error(`Unknown analytics event: ${args.name}`);
    }
    await ctx.db.insert("analyticsEvents", {
      userId,
      name: args.name,
      day: serverToday(args.today),
      at: Date.now(),
      refKey: args.refKey,
      track: args.track,
      mode: args.mode,
    });
    return null;
  },
});

export const saveLessonDraft = mutation({
  args: {
    userId: v.string(),
    slug: v.string(),
    draftAnswers: v.optional(v.string()),
    draftChecked: v.optional(v.string()),
    draftCode: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx, { userId: args.userId });
    await loadOrCreateProfile(ctx, userId);
    const existing = await ctx.db
      .query("byteProgress")
      .withIndex("by_user_key", (q) => q.eq("userId", userId).eq("key", args.slug))
      .unique();
    const patch = {
      ...(args.draftAnswers !== undefined ? { draftAnswers: args.draftAnswers } : {}),
      ...(args.draftChecked !== undefined ? { draftChecked: args.draftChecked } : {}),
      ...(args.draftCode !== undefined ? { draftCode: args.draftCode } : {}),
    };
    if (existing) {
      if (existing.status === "completed") return null;
      await ctx.db.patch(existing._id, patch);
      return null;
    }
    await ctx.db.insert("byteProgress", {
      userId,
      key: args.slug,
      status: "started",
      completedDay: null,
      xpEarned: 0,
      ...patch,
    });
    return null;
  },
});

export const recordCodeTestPass = mutation({
  args: {
    userId: v.string(),
    slug: v.string(),
    today: v.string(),
    skillIds: v.array(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx, { userId: args.userId });
    await loadOrCreateProfile(ctx, userId);
    const day = serverToday(args.today);
    const existing = await ctx.db
      .query("byteProgress")
      .withIndex("by_user_key", (q) => q.eq("userId", userId).eq("key", args.slug))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, { exercisePassed: true });
    } else {
      await ctx.db.insert("byteProgress", {
        userId,
        key: args.slug,
        status: "started",
        completedDay: null,
        xpEarned: 0,
        exercisePassed: true,
      });
    }
    for (const skillId of args.skillIds) {
      const prior = await ctx.db
        .query("skillEvidence")
        .withIndex("by_user_source", (q) =>
          q.eq("userId", userId).eq("sourceKey", `${args.slug}:code_test:${skillId}`),
        )
        .unique();
      if (prior) continue;
      await ctx.db.insert("skillEvidence", {
        userId,
        skillId,
        sourceKey: `${args.slug}:code_test:${skillId}`,
        kind: "code_test",
        day,
        at: Date.now(),
      });
    }
    await ctx.db.insert("analyticsEvents", {
      userId,
      name: "code_test_passed",
      day,
      at: Date.now(),
      refKey: args.slug,
    });
    return null;
  },
});

/**
 * Practice drill: record the answer; if correct, roll drill XP (deterministic per
 * user/day/item), award it, and ensure an SRS card exists (created only — advancing the
 * schedule is what review mode is for). Then settle the streak.
 */
export const submitAttempt = mutation({
  args: { input: attemptInput },
  handler: async (ctx, { input }): Promise<AttemptResult> => {
    const userId = await getUserId(ctx, { userId: input.userId });
    const today = serverToday(input.today);
    const profile = await loadOrCreateProfile(ctx, userId);
    const alreadyCorrectToday = (
      await ctx.db
        .query("attempts")
        .withIndex("by_user_day", (q) => q.eq("userId", userId).eq("day", today))
        .collect()
    ).some((attempt) => attempt.itemKey === input.itemKey && attempt.correct);

    await recordAttempt(ctx, userId, { ...input, today });

    let xpAwarded = 0;
    let critical = false;
    let nextReview: string | null = null;
    let leveledUp = false;

    if (input.correct) {
      const roll = applyRepeatDiminishing(
        rollDrillXp(userId, today, input.itemKey),
        alreadyCorrectToday,
      );
      xpAwarded = roll.amount;
      critical = roll.critical;
      const refreshed = (await ctx.db.get(profile._id))!;
      const award = await awardXp(
        ctx,
        userId,
        refreshed,
        xpAwarded,
        roll.reason,
        input.itemKey,
        today,
      );
      leveledUp = award.leveledUp;
      // First exposure creates the review card; subsequent practice does not advance it.
      const state = await ensureSrs(ctx, userId, input.itemKey, input.topic, today);
      nextReview = describeInterval(Math.max(1, state.intervalDays));
    }

    const currentProfile = (await ctx.db.get(profile._id))!;
    const { extended, freezeEarned } = await applyPractice(ctx, userId, currentProfile, today);
    const finalProfile = (await ctx.db.get(profile._id))!;
    const progress = levelProgress(finalProfile.xpTotal);

    return {
      xpAwarded,
      critical,
      xpTotal: finalProfile.xpTotal,
      level: progress.level,
      leveledUp,
      currentStreak: finalProfile.currentStreak,
      streakExtended: extended,
      freezeEarned,
      nextReview,
    };
  },
});

/**
 * Review drill: record the answer, ensure the SRS card, then ADVANCE the schedule using
 * the SM-2 grade. If correct, roll review XP and award it. Settle the streak.
 */
export const gradeReview = mutation({
  args: { input: reviewInput },
  handler: async (ctx, { input }): Promise<AttemptResult> => {
    const userId = await getUserId(ctx, { userId: input.userId });
    const today = serverToday(input.today);
    const profile = await loadOrCreateProfile(ctx, userId);

    await recordAttempt(ctx, userId, { ...input, today });

    const existing = await ensureSrs(ctx, userId, input.itemKey, input.topic, today);
    const updated = review(existing, input.grade, today);
    const card = await ctx.db
      .query("srsCards")
      .withIndex("by_user_item", (q) => q.eq("userId", userId).eq("itemKey", input.itemKey))
      .unique();
    if (card) {
      await ctx.db.patch(card._id, {
        ease: updated.ease,
        intervalDays: updated.intervalDays,
        dueDay: updated.dueDay,
        reps: updated.reps,
        lapses: updated.lapses,
        lastReviewedDay: updated.lastReviewedDay,
      });
    }

    let xpAwarded = 0;
    let critical = false;
    let leveledUp = false;
    if (input.correct) {
      const roll = rollReviewXp(userId, today, input.itemKey);
      xpAwarded = roll.amount;
      critical = roll.critical;
      const refreshed = (await ctx.db.get(profile._id))!;
      const award = await awardXp(
        ctx,
        userId,
        refreshed,
        roll.amount,
        roll.reason,
        input.itemKey,
        today,
      );
      leveledUp = award.leveledUp;
    }

    const currentProfile = (await ctx.db.get(profile._id))!;
    const { extended, freezeEarned } = await applyPractice(ctx, userId, currentProfile, today);
    const finalProfile = (await ctx.db.get(profile._id))!;
    const progress = levelProgress(finalProfile.xpTotal);

    return {
      xpAwarded,
      critical,
      xpTotal: finalProfile.xpTotal,
      level: progress.level,
      leveledUp,
      currentStreak: finalProfile.currentStreak,
      streakExtended: extended,
      freezeEarned,
      nextReview: describeInterval(updated.intervalDays),
    };
  },
});

/**
 * Mark a byte or course lesson as started. Idempotent — no-op once completed or started.
 */
export const startByte = mutation({
  args: { userId: v.string(), slug: v.string() },
  handler: async (ctx, { userId, slug }) => {
    const uid = await getUserId(ctx, { userId });
    const existing = await ctx.db
      .query("byteProgress")
      .withIndex("by_user_key", (q) => q.eq("userId", uid).eq("key", slug))
      .unique();
    if (existing) return; // already started or completed
    await ctx.db.insert("byteProgress", {
      userId: uid,
      key: slug,
      status: "started",
      completedDay: null,
      xpEarned: 0,
    });
  },
});

/**
 * Complete a byte or course lesson. Idempotent — returns an all-zero AttemptResult if
 * already done. Otherwise rolls byte XP, awards it, sets status completed, settles streak.
 */
export const completeByte = mutation({
  args: {
    userId: v.string(),
    slug: v.string(),
    today: v.string(),
    requireExercise: v.optional(v.boolean()),
  },
  handler: async (ctx, { userId, slug, today, requireExercise }): Promise<AttemptResult> => {
    const uid = await getUserId(ctx, { userId });
    const day = serverToday(today);
    const profile = await loadOrCreateProfile(ctx, uid);

    const existing = await ctx.db
      .query("byteProgress")
      .withIndex("by_user_key", (q) => q.eq("userId", uid).eq("key", slug))
      .unique();
    if (existing?.status === "completed") {
      const finalProfile = (await ctx.db.get(profile._id))!;
      const progress = levelProgress(finalProfile.xpTotal);
      return {
        xpAwarded: 0,
        critical: false,
        xpTotal: finalProfile.xpTotal,
        level: progress.level,
        leveledUp: false,
        currentStreak: finalProfile.currentStreak,
        streakExtended: false,
        freezeEarned: false,
        nextReview: null,
      };
    }

    if (requireExercise && !existing?.exercisePassed) {
      throw new Error("Pass the code exercise before completing this lesson");
    }

    const roll = rollByteXp(uid, day, slug);
    const refreshed = (await ctx.db.get(profile._id))!;
    const award = await awardXp(
      ctx,
      uid,
      refreshed,
      roll.amount,
      roll.reason,
      `byte:${slug}`,
      day,
    );

    if (existing) {
      await ctx.db.patch(existing._id, {
        status: "completed",
        completedDay: day,
        xpEarned: roll.amount,
        draftAnswers: undefined,
        draftChecked: undefined,
        draftCode: undefined,
      });
    } else {
      await ctx.db.insert("byteProgress", {
        userId: uid,
        key: slug,
        status: "completed",
        completedDay: day,
        xpEarned: roll.amount,
      });
    }

    await ctx.db.insert("analyticsEvents", {
      userId: uid,
      name: "unit_completed",
      day,
      at: Date.now(),
      refKey: slug,
      track: profile.track,
    });

    const currentProfile = (await ctx.db.get(profile._id))!;
    const { extended, freezeEarned } = await applyPractice(ctx, uid, currentProfile, day);
    const finalProfile = (await ctx.db.get(profile._id))!;

    return {
      xpAwarded: roll.amount,
      critical: false,
      xpTotal: award.xpTotal,
      level: award.level,
      leveledUp: award.leveledUp,
      currentStreak: finalProfile.currentStreak,
      streakExtended: extended,
      freezeEarned,
      nextReview: null,
    };
  },
});

/** Wipe all progress for a user across learner tables. */
export const resetProgress = mutation({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const uid = await getUserId(ctx, { userId });
    await wipeUser(ctx, uid);
  },
});

/**
 * Move progress from a pre-auth browser UUID onto the authenticated subject.
 * Idempotent and skips when the legacy id has no profile.
 */
export const claimLegacyProgress = mutation({
  args: { legacyUserId: v.string() },
  returns: v.object({ claimed: v.boolean() }),
  handler: async (ctx, { legacyUserId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity?.subject) throw new Error("Not authenticated");
    const newId = identity.subject;
    if (!legacyUserId || legacyUserId === "ssr" || legacyUserId === newId) {
      return { claimed: false };
    }

    const legacyProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", legacyUserId))
      .unique();
    if (!legacyProfile) return { claimed: false };

    const moveSimple = async (
      table: "attempts" | "xpEvents" | "analyticsEvents" | "skillEvidence",
    ) => {
      const docs = await ctx.db
        .query(table)
        .withIndex("by_user", (q) => q.eq("userId", legacyUserId))
        .collect();
      for (const doc of docs) {
        await ctx.db.patch(doc._id, { userId: newId });
      }
    };
    await moveSimple("attempts");
    await moveSimple("xpEvents");
    await moveSimple("analyticsEvents");
    await moveSimple("skillEvidence");

    const srsDocs = await ctx.db
      .query("srsCards")
      .withIndex("by_user", (q) => q.eq("userId", legacyUserId))
      .collect();
    for (const doc of srsDocs) {
      const existing = await ctx.db
        .query("srsCards")
        .withIndex("by_user_item", (q) => q.eq("userId", newId).eq("itemKey", doc.itemKey))
        .unique();
      if (existing) await ctx.db.delete(doc._id);
      else await ctx.db.patch(doc._id, { userId: newId });
    }

    const byteDocs = await ctx.db
      .query("byteProgress")
      .withIndex("by_user", (q) => q.eq("userId", legacyUserId))
      .collect();
    for (const doc of byteDocs) {
      const existing = await ctx.db
        .query("byteProgress")
        .withIndex("by_user_key", (q) => q.eq("userId", newId).eq("key", doc.key))
        .unique();
      if (existing) await ctx.db.delete(doc._id);
      else await ctx.db.patch(doc._id, { userId: newId });
    }

    const projectDocs = await ctx.db
      .query("projects")
      .withIndex("by_user", (q) => q.eq("userId", legacyUserId))
      .collect();
    for (const doc of projectDocs) {
      const existing = await ctx.db
        .query("projects")
        .withIndex("by_user_slug", (q) => q.eq("userId", newId).eq("slug", doc.slug))
        .unique();
      if (existing) await ctx.db.delete(doc._id);
      else await ctx.db.patch(doc._id, { userId: newId });
    }

    const newProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", newId))
      .unique();

    if (newProfile) {
      await ctx.db.patch(newProfile._id, {
        displayName:
          newProfile.displayName === "You" ? legacyProfile.displayName : newProfile.displayName,
        track: newProfile.onboardingCompletedAt ? newProfile.track : legacyProfile.track,
        xpTotal: Math.max(newProfile.xpTotal, legacyProfile.xpTotal),
        currentStreak: Math.max(newProfile.currentStreak, legacyProfile.currentStreak),
        longestStreak: Math.max(newProfile.longestStreak, legacyProfile.longestStreak),
        streakFreezes: Math.max(newProfile.streakFreezes, legacyProfile.streakFreezes),
        lastPracticeDay: newProfile.lastPracticeDay ?? legacyProfile.lastPracticeDay,
        startingLevel: newProfile.startingLevel ?? legacyProfile.startingLevel,
        weeklyMinutes: newProfile.weeklyMinutes ?? legacyProfile.weeklyMinutes,
        preferredTimeMode: newProfile.preferredTimeMode ?? legacyProfile.preferredTimeMode,
        onboardingCompletedAt:
          newProfile.onboardingCompletedAt ?? legacyProfile.onboardingCompletedAt,
        legacyAnonId: legacyUserId,
      });
      await ctx.db.delete(legacyProfile._id);
    } else {
      await ctx.db.patch(legacyProfile._id, {
        userId: newId,
        legacyAnonId: legacyUserId,
      });
    }

    return { claimed: true };
  },
});

export const upsertProject = mutation({
  args: {
    userId: v.string(),
    slug: v.string(),
    title: v.string(),
    summary: v.string(),
    checkpoint: v.string(),
    artifactJson: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("draft"),
        v.literal("in_progress"),
        v.literal("submitted"),
        v.literal("published"),
      ),
    ),
    visibility: v.optional(
      v.union(v.literal("private"), v.literal("unlisted"), v.literal("public")),
    ),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx, { userId: args.userId });
    await loadOrCreateProfile(ctx, userId);
    const existing = await ctx.db
      .query("projects")
      .withIndex("by_user_slug", (q) => q.eq("userId", userId).eq("slug", args.slug))
      .unique();
    const now = Date.now();
    if (existing) {
      await ctx.db.patch(existing._id, {
        title: args.title,
        summary: args.summary,
        checkpoint: args.checkpoint,
        artifactJson: args.artifactJson ?? existing.artifactJson,
        status: args.status ?? existing.status,
        visibility: args.visibility ?? existing.visibility,
        updatedAt: now,
      });
      return null;
    }
    await ctx.db.insert("projects", {
      userId,
      slug: args.slug,
      title: args.title,
      summary: args.summary,
      checkpoint: args.checkpoint,
      artifactJson: args.artifactJson ?? "{}",
      status: args.status ?? "draft",
      visibility: args.visibility ?? "private",
      createdAt: now,
      updatedAt: now,
    });
    return null;
  },
});

export const deleteAccountData = mutation({
  args: { userId: v.string() },
  returns: v.null(),
  handler: async (ctx, { userId }) => {
    const uid = await getUserId(ctx, { userId });
    await wipeUser(ctx, uid);
    return null;
  },
});

/**
 * Build the PersistedStateV1 blob for the Settings export. Runs as an action so it can
 * read across all tables and return a JSON string without consuming a mutation slot.
 */
export const exportProgress = action({
  args: { userId: v.string() },
  handler: async (ctx, { userId }): Promise<string> => {
    const profile = await ctx.runQuery(api.queries.getProfileForExport, { userId });
    const srs = await ctx.runQuery(api.queries.getAllSrs, { userId });
    const bytes = await ctx.runQuery(api.queries.getAllByteProgressRaw, { userId });
    const attempts = await ctx.runQuery(api.queries.getAttempts, {
      userId,
      limit: ATTEMPT_CAP,
    });
    const xpEvents = await ctx.runQuery(api.queries.getXpEvents, {
      userId,
      limit: XP_EVENT_CAP,
    });

    const blob: PersistedStateV1 = {
      version: 1,
      userId,
      displayName: profile?.displayName ?? "You",
      track: profile?.track ?? "grad",
      createdAt: profile?.createdAt ?? Date.now(),
      xpTotal: profile?.xpTotal ?? 0,
      currentStreak: profile?.currentStreak ?? 0,
      longestStreak: profile?.longestStreak ?? 0,
      lastPracticeDay: profile?.lastPracticeDay ?? null,
      streakFreezes: profile?.streakFreezes ?? 1,
      startingLevel: profile?.startingLevel,
      weeklyMinutes: profile?.weeklyMinutes,
      preferredTimeMode: profile?.preferredTimeMode,
      onboardingCompletedAt: profile?.onboardingCompletedAt,
      srs: Object.fromEntries(srs.map((s) => [s.itemKey, s])),
      bytes: Object.fromEntries(
        bytes.map((b) => [
          b.key,
          { status: b.status, completedDay: b.completedDay, xpEarned: b.xpEarned },
        ]),
      ),
      attempts,
      xpEvents,
    };
    return JSON.stringify(blob, null, 2);
  },
});

/**
 * Replace the user's docs with the contents of an imported PersistedStateV1 blob.
 * Wipes existing data first, then re-creates. Used by the Settings import button.
 */
export const importProgress = mutation({
  args: { userId: v.string(), json: v.string() },
  handler: async (ctx, { userId, json }) => {
    const uid = await getUserId(ctx, { userId });
    const parsed = JSON.parse(json) as PersistedStateV1;
    if (parsed.version !== 1) throw new Error("Unsupported progress file version");

    await wipeUser(ctx, uid);

    await ctx.db.insert("profiles", {
      userId: uid,
      displayName: parsed.displayName,
      track: parsed.track,
      xpTotal: parsed.xpTotal,
      currentStreak: parsed.currentStreak,
      longestStreak: parsed.longestStreak,
      lastPracticeDay: parsed.lastPracticeDay,
      streakFreezes: parsed.streakFreezes,
      createdAt: parsed.createdAt,
      startingLevel: parsed.startingLevel,
      weeklyMinutes: parsed.weeklyMinutes,
      preferredTimeMode: parsed.preferredTimeMode,
      onboardingCompletedAt: parsed.onboardingCompletedAt,
    });

    for (const s of Object.values(parsed.srs)) {
      await ctx.db.insert("srsCards", {
        userId: uid,
        itemKey: s.itemKey,
        topic: s.topic,
        ease: s.ease,
        intervalDays: s.intervalDays,
        dueDay: s.dueDay,
        reps: s.reps,
        lapses: s.lapses,
        lastReviewedDay: s.lastReviewedDay,
      });
    }

    for (const [key, b] of Object.entries(parsed.bytes)) {
      await ctx.db.insert("byteProgress", {
        userId: uid,
        key,
        status: b.status,
        completedDay: b.completedDay,
        xpEarned: b.xpEarned,
      });
    }

    for (const a of parsed.attempts) {
      await ctx.db.insert("attempts", {
        userId: uid,
        itemKey: a.itemKey,
        topic: a.topic,
        mode: a.mode,
        correct: a.correct,
        msTaken: a.msTaken,
        day: a.day,
        at: a.at,
      });
    }

    for (const e of parsed.xpEvents) {
      await ctx.db.insert("xpEvents", {
        userId: uid,
        amount: e.amount,
        reason: e.reason,
        refKey: e.refKey,
        day: e.day,
        at: e.at,
      });
    }
  },
});

/**
 * DEV ONLY — populate the leaderboard/stats with realistic demo learners so the
 * homepage isn't empty while real auth isn't wired yet. Idempotent: wipes prior seed
 * profiles (seed: true) before re-inserting, so re-running is safe and never touches
 * real user rows. Delete this mutation and the seed field once real auth exists.
 */
const DEMO_LEARNERS: {
  displayName: string;
  track: "grad" | "beginner" | "engineer" | "founder";
  xpTotal: number;
  currentStreak: number;
  longestStreak: number;
}[] = [
  { displayName: "Aarav S.", track: "grad", xpTotal: 4820, currentStreak: 42, longestStreak: 48 },
  { displayName: "Priya K.", track: "grad", xpTotal: 4310, currentStreak: 38, longestStreak: 52 },
  { displayName: "Rohan M.", track: "engineer", xpTotal: 3980, currentStreak: 27, longestStreak: 33 },
  { displayName: "Ananya R.", track: "grad", xpTotal: 3650, currentStreak: 31, longestStreak: 31 },
  { displayName: "Karthik V.", track: "engineer", xpTotal: 3120, currentStreak: 19, longestStreak: 24 },
  { displayName: "Sneha P.", track: "beginner", xpTotal: 2890, currentStreak: 22, longestStreak: 28 },
  { displayName: "Vikram N.", track: "grad", xpTotal: 2640, currentStreak: 14, longestStreak: 21 },
  { displayName: "Ishita G.", track: "founder", xpTotal: 2310, currentStreak: 16, longestStreak: 19 },
  { displayName: "Arjun D.", track: "engineer", xpTotal: 2080, currentStreak: 11, longestStreak: 17 },
  { displayName: "Meera J.", track: "grad", xpTotal: 1840, currentStreak: 9, longestStreak: 15 },
  { displayName: "Aditya B.", track: "beginner", xpTotal: 1620, currentStreak: 13, longestStreak: 13 },
  { displayName: "Divya L.", track: "grad", xpTotal: 1390, currentStreak: 7, longestStreak: 12 },
  { displayName: "Sai T.", track: "engineer", xpTotal: 1180, currentStreak: 5, longestStreak: 9 },
  { displayName: "Nisha H.", track: "beginner", xpTotal: 960, currentStreak: 8, longestStreak: 10 },
  { displayName: "Rahul F.", track: "founder", xpTotal: 720, currentStreak: 4, longestStreak: 6 },
  { displayName: "Kavya W.", track: "grad", xpTotal: 540, currentStreak: 3, longestStreak: 7 },
  { displayName: "Tejas Q.", track: "engineer", xpTotal: 310, currentStreak: 2, longestStreak: 5 },
  { displayName: "Pooja X.", track: "beginner", xpTotal: 150, currentStreak: 1, longestStreak: 3 },
];

export const seedDemoProfiles = mutation({
  args: {},
  handler: async (ctx) => {
    // Clear prior seed rows only.
    const seeded = await ctx.db
      .query("profiles")
      .filter((q) => q.eq(q.field("seed"), true))
      .collect();
    for (const doc of seeded) {
      await ctx.db.delete(doc._id);
    }

    const now = Date.now();
    for (const l of DEMO_LEARNERS) {
      await ctx.db.insert("profiles", {
        userId: `demo-${l.displayName.replace(/\W+/g, "-").toLowerCase()}-${now}`,
        displayName: l.displayName,
        track: l.track,
        xpTotal: l.xpTotal,
        currentStreak: l.currentStreak,
        longestStreak: l.longestStreak,
        lastPracticeDay: null,
        streakFreezes: 1,
        createdAt: now,
        seed: true,
      });
    }
  },
});

/**
 * Midnight cron target — settle streaks for everyone who hasn't practised today.
 * Only callable from the backend scheduler.
 */
export const runRollover = internalMutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const today = todayKey();
    const profiles = await ctx.db.query("profiles").collect();
    for (const profile of profiles) {
      const before: StreakFields = {
        currentStreak: profile.currentStreak,
        longestStreak: profile.longestStreak,
        lastPracticeDay:
          profile.lastPracticeDay === null ? null : asDayKey(profile.lastPracticeDay),
        streakFreezes: profile.streakFreezes,
      };
      const after = settleOnRollover(before, today);
      if (
        after.currentStreak !== before.currentStreak ||
        after.longestStreak !== before.longestStreak ||
        after.lastPracticeDay !== before.lastPracticeDay ||
        after.streakFreezes !== before.streakFreezes
      ) {
        await ctx.db.patch(profile._id, {
          currentStreak: after.currentStreak,
          longestStreak: after.longestStreak,
          lastPracticeDay: after.lastPracticeDay,
          streakFreezes: after.streakFreezes,
        });
      }
    }
    return null;
  },
});
