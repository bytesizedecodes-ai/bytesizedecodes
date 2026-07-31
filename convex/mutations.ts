/**
 * Convex mutations — the server-side DataMutations implementation.
 *
 * Each maps 1:1 to a method of lib/data/local.ts LocalStore, with the in-memory
 * PersistedStateV1 blob swapped for Convex db reads/writes. The orchestration, the
 * XP/streak/SRS math, and the AttemptResult shape are identical to Phase 0.
 *
 * Identity flows through getUserId() — the single auth swap point. Today the client
 * sends a trusted localStorage UUID; Phase 2 replaces that with ctx.auth.
 */

import { MutationCtx, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { Doc, Id } from "./_generated/dataModel";
import { getUserId } from "./lib/getUser";
import { asDayKey, todayKey, type DayKey } from "./lib/day";
import { describeInterval, newSrsState, review, type SrsState } from "./lib/srs";
import { settleOnPractice, settleOnRollover, type StreakFields } from "./lib/streak";
import {
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
  if (existing) return existing;
  const id = await ctx.db.insert("profiles", {
    userId,
    displayName: "You",
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

    await recordAttempt(ctx, userId, { ...input, today });

    let xpAwarded = 0;
    let critical = false;
    let nextReview: string | null = null;
    let leveledUp = false;

    if (input.correct) {
      const roll = rollDrillXp(userId, today, input.itemKey);
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
  args: { userId: v.string(), slug: v.string(), today: v.string() },
  handler: async (ctx, { userId, slug, today }): Promise<AttemptResult> => {
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

/** Wipe all progress for a user across the five tables. */
export const resetProgress = mutation({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const uid = await getUserId(ctx, { userId });
    await wipeUser(ctx, uid);
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
 * Wired in crons.ts; harmless to call manually.
 */
export const runRollover = mutation({
  args: {},
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
  },
});
