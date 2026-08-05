/**
 * Convex queries — the read side of the data layer.
 *
 * Each returns the exact shape a provider hook consumes, so the rewritten provider.tsx
 * can pass query results straight through. Identity flows through getUserId() like the
 * mutations; today the client sends a trusted localStorage UUID.
 *
 * The profile read applies settleOnRollover lazily so a missed-day streak is settled
 * even without the cron having fired yet — mirroring LocalStore.getProfile.
 */

import { QueryCtx, query } from "./_generated/server";
import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";
import { getIdentityProfile, getUserId } from "./lib/getUser";
import { addDays, asDayKey, type DayKey } from "./lib/day";
import { dueQueue, mastery, type SrsState } from "./lib/srs";
import { settleOnRollover, type StreakFields } from "./lib/streak";
import { levelProgress } from "./lib/xp";
import { hashToSeed } from "./lib/rng";
import { parseDrillKey } from "./lib/parseDrillKey";
import { assembleDailyPlan, nextUnitForTrack } from "./lib/dailyPlan";
import { parseReviewKey } from "./lib/reviewKey";

// ---------- export-shape types (for exportProgress action) ----------

export interface ProfileExport {
  displayName: string;
  track: "grad" | "beginner" | "engineer" | "founder";
  xpTotal: number;
  currentStreak: number;
  longestStreak: number;
  lastPracticeDay: string | null;
  streakFreezes: number;
  createdAt: number;
  startingLevel?: "new" | "some" | "comfortable";
  weeklyMinutes?: number;
  preferredTimeMode?: "quick" | "standard" | "deep";
  onboardingCompletedAt?: number;
}

export interface SrsExport {
  itemKey: string;
  topic: string;
  ease: number;
  intervalDays: number;
  dueDay: string;
  reps: number;
  lapses: number;
  lastReviewedDay: string | null;
}

export interface ByteExport {
  key: string;
  status: "started" | "completed";
  completedDay: string | null;
  xpEarned: number;
}

// ---------- provider-facing read types ----------

interface ProfileView {
  userId: string;
  displayName: string;
  email: string | null;
  imageUrl: string | null;
  track: "grad" | "beginner" | "engineer" | "founder";
  xpTotal: number;
  level: number;
  levelProgress: { into: number; span: number };
  currentStreak: number;
  longestStreak: number;
  lastPracticeDay: string | null;
  streakFreezes: number;
  createdAt: number;
  startingLevel: "new" | "some" | "comfortable" | null;
  weeklyMinutes: number | null;
  preferredTimeMode: "quick" | "standard" | "deep" | null;
  onboardingCompletedAt: number | null;
  role: "user" | "admin" | null;
}

interface DayProgressView {
  day: string;
  itemsAnswered: number;
  itemsCorrect: number;
  xpEarned: number;
  practised: boolean;
}

interface ReviewCardBase {
  itemKey: string;
  topic: string;
  ease: number;
  reps: number;
  lapses: number;
}

interface GeneratorReviewCardView extends ReviewCardBase {
  kind: "generator";
  generatorId: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  seed: number;
}

interface AuthoredReviewCardView extends ReviewCardBase {
  kind: "authored";
  source: "byte" | "course";
  slug: string | null;
  courseSlug: string | null;
  lessonSlug: string | null;
  questionId: string;
}

type ReviewCardView = GeneratorReviewCardView | AuthoredReviewCardView;

interface ByteProgressView {
  slug: string;
  status: "unseen" | "started" | "completed";
  completedDay: string | null;
  xpEarned: number;
  draftAnswers: Record<string, string> | null;
  draftChecked: string[] | null;
  draftCode: string | null;
  exercisePassed: boolean;
}

interface TopicMasteryView {
  topic: string;
  mastery: number;
  itemCount: number;
  dueCount: number;
}

interface DayXpView {
  day: string;
  xp: number;
  practised: boolean;
}

function parseDraftAnswers(raw: string | undefined): Record<string, string> | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    const out: Record<string, string> = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === "string") out[key] = value;
    }
    return out;
  } catch {
    return null;
  }
}

function parseDraftChecked(raw: string | undefined): string[] | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return null;
  }
}

function toByteProgressView(row: Doc<"byteProgress">): ByteProgressView {
  return {
    slug: row.key,
    status: row.status,
    completedDay: row.completedDay,
    xpEarned: row.xpEarned,
    draftAnswers: parseDraftAnswers(row.draftAnswers),
    draftChecked: parseDraftChecked(row.draftChecked),
    draftCode: row.draftCode ?? null,
    exercisePassed: row.exercisePassed ?? false,
  };
}

const timeModeValidator = v.union(
  v.literal("quick"),
  v.literal("standard"),
  v.literal("deep"),
);

const dailyPlanStepValidator = v.union(
  v.object({
    kind: v.literal("review"),
    label: v.string(),
    detail: v.string(),
    href: v.string(),
    minutes: v.number(),
    count: v.number(),
  }),
  v.object({
    kind: v.literal("drill"),
    label: v.string(),
    detail: v.string(),
    href: v.string(),
    minutes: v.number(),
    generatorId: v.string(),
    difficulty: v.union(
      v.literal(1),
      v.literal(2),
      v.literal(3),
      v.literal(4),
      v.literal(5),
    ),
  }),
  v.object({
    kind: v.literal("unit"),
    label: v.string(),
    detail: v.string(),
    href: v.string(),
    minutes: v.number(),
    progressKey: v.string(),
  }),
);

const dailyPlanValidator = v.object({
  timeMode: timeModeValidator,
  estimatedMinutes: v.number(),
  focus: v.string(),
  steps: v.array(dailyPlanStepValidator),
});

const reviewCardValidator = v.union(
  v.object({
    kind: v.literal("generator"),
    itemKey: v.string(),
    topic: v.string(),
    generatorId: v.string(),
    difficulty: v.union(
      v.literal(1),
      v.literal(2),
      v.literal(3),
      v.literal(4),
      v.literal(5),
    ),
    seed: v.number(),
    ease: v.number(),
    reps: v.number(),
    lapses: v.number(),
  }),
  v.object({
    kind: v.literal("authored"),
    itemKey: v.string(),
    topic: v.string(),
    source: v.union(v.literal("byte"), v.literal("course")),
    slug: v.union(v.string(), v.null()),
    courseSlug: v.union(v.string(), v.null()),
    lessonSlug: v.union(v.string(), v.null()),
    questionId: v.string(),
    ease: v.number(),
    reps: v.number(),
    lapses: v.number(),
  }),
);

// ---------- helpers ----------

async function loadProfile(ctx: QueryCtx, userId: string): Promise<Doc<"profiles"> | null> {
  return ctx.db
    .query("profiles")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .unique();
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

/**
 * The profile read is the one place a read mutates: a missed-day rollover is settled
 * here so streaks are correct even before the cron fires. Done as a write-back inside
 * the query's transaction — same lazy behaviour as LocalStore.getProfile.
 *
 * NOTE: queries cannot write. So we apply settleOnRollover purely for the *displayed*
 * value here; the cron is what persists it. This is an acceptable divergence from
 * Phase 0 because the only consequence is that a displayed streak freeze shows the
 * pre-rollover value until the user next practises — the next practice's
 * settleOnPractice (which does persist) reconciles it.
 */
function settleForDisplay(profile: Doc<"profiles">, today: DayKey): StreakFields {
  const before: StreakFields = {
    currentStreak: profile.currentStreak,
    longestStreak: profile.longestStreak,
    lastPracticeDay:
      profile.lastPracticeDay === null ? null : asDayKey(profile.lastPracticeDay),
    streakFreezes: profile.streakFreezes,
  };
  return settleOnRollover(before, today);
}

// ---------- queries ----------

export const getProfile = query({
  args: { userId: v.string(), today: v.string() },
  handler: async (ctx, { userId, today }): Promise<ProfileView | null> => {
    const uid = await getUserId(ctx, { userId });
    const identity = await getIdentityProfile(ctx);
    const profile = await loadProfile(ctx, uid);
    if (!profile) return null;
    const day = asDayKey(today);
    const settled = settleForDisplay(profile, day);
    const progress = levelProgress(profile.xpTotal);
    return {
      userId: uid,
      displayName: profile.displayName,
      email: identity?.email ?? null,
      imageUrl: identity?.imageUrl ?? null,
      track: profile.track,
      xpTotal: profile.xpTotal,
      level: progress.level,
      levelProgress: { into: progress.into, span: progress.span },
      currentStreak: settled.currentStreak,
      longestStreak: settled.longestStreak,
      lastPracticeDay: settled.lastPracticeDay,
      streakFreezes: settled.streakFreezes,
      createdAt: profile.createdAt,
      startingLevel: profile.startingLevel ?? null,
      weeklyMinutes: profile.weeklyMinutes ?? null,
      preferredTimeMode: profile.preferredTimeMode ?? null,
      onboardingCompletedAt: profile.onboardingCompletedAt ?? null,
      role: profile.role ?? null,
    };
  },
});

export const getDayProgress = query({
  args: { userId: v.string(), today: v.string() },
  handler: async (ctx, { userId, today }): Promise<DayProgressView> => {
    const uid = await getUserId(ctx, { userId });
    const day = asDayKey(today);
    const [attempts, xpEvents, profile] = await Promise.all([
      ctx.db
        .query("attempts")
        .withIndex("by_user_day", (q) => q.eq("userId", uid).eq("day", day))
        .collect(),
      ctx.db
        .query("xpEvents")
        .withIndex("by_user_day", (q) => q.eq("userId", uid).eq("day", day))
        .collect(),
      loadProfile(ctx, uid),
    ]);
    const xpEarned = xpEvents.reduce((s, e) => s + e.amount, 0);
    return {
      day,
      itemsAnswered: attempts.length,
      itemsCorrect: attempts.filter((a) => a.correct).length,
      xpEarned,
      practised: attempts.length > 0 || profile?.lastPracticeDay === day,
    };
  },
});

export const getDailyPlan = query({
  args: {
    userId: v.string(),
    today: v.string(),
    timeMode: v.optional(timeModeValidator),
  },
  returns: dailyPlanValidator,
  handler: async (ctx, { userId, today, timeMode }) => {
    const uid = await getUserId(ctx, { userId });
    const day = asDayKey(today);
    const [profile, cards, progressRows] = await Promise.all([
      loadProfile(ctx, uid),
      ctx.db
        .query("srsCards")
        .withIndex("by_user", (q) => q.eq("userId", uid))
        .collect(),
      ctx.db
        .query("byteProgress")
        .withIndex("by_user", (q) => q.eq("userId", uid))
        .collect(),
    ]);

    const dueCount = cards.filter((card) => card.dueDay <= day).length;
    const generatorStates = cards
      .filter((card) => parseDrillKey(card.itemKey) !== null)
      .map(srsDocToState);
    const byTopic = new Map<string, SrsState[]>();
    for (const state of generatorStates) {
      const items = byTopic.get(state.topic) ?? [];
      items.push(state);
      byTopic.set(state.topic, items);
    }
    const weakTopic =
      [...byTopic.entries()]
        .map(([topic, items]) => ({
          topic,
          score: items.reduce((sum, item) => sum + mastery(item), 0) / items.length,
        }))
        .sort((a, b) => a.score - b.score)[0]?.topic ?? null;

    const progress: Record<string, "started" | "completed"> = {};
    for (const row of progressRows) progress[row.key] = row.status;
    const track = profile?.track ?? "beginner";
    const selectedMode = timeMode ?? profile?.preferredTimeMode ?? "standard";
    const nextUnit = nextUnitForTrack(track, progress);

    return assembleDailyPlan({
      track,
      timeMode: selectedMode,
      dueCount,
      weakTopic,
      nextUnit,
    });
  },
});

export const getReviewQueue = query({
  args: { userId: v.string(), today: v.string() },
  returns: v.array(reviewCardValidator),
  handler: async (ctx, { userId, today }): Promise<ReviewCardView[]> => {
    const uid = await getUserId(ctx, { userId });
    const day = asDayKey(today);
    const cards = await ctx.db
      .query("srsCards")
      .withIndex("by_user", (q) => q.eq("userId", uid))
      .collect();
    const states = cards.map(srsDocToState);
    const out: ReviewCardView[] = [];
    for (const s of dueQueue(states, day)) {
      const parsed = parseReviewKey(s.itemKey);
      if (!parsed) continue;
      const common = {
        itemKey: s.itemKey,
        topic: s.topic,
        ease: s.ease,
        reps: s.reps,
        lapses: s.lapses,
      };
      if (parsed.kind === "authored") {
        out.push(
          parsed.source === "byte"
            ? {
                ...common,
                kind: "authored" as const,
                source: "byte" as const,
                slug: parsed.slug,
                courseSlug: null,
                lessonSlug: null,
                questionId: parsed.questionId,
              }
            : {
                ...common,
                kind: "authored" as const,
                source: "course" as const,
                slug: null,
                courseSlug: parsed.courseSlug,
                lessonSlug: parsed.lessonSlug,
                questionId: parsed.questionId,
              },
        );
        continue;
      }
      out.push({
        ...common,
        kind: "generator",
        generatorId: parsed.generatorId,
        difficulty: parsed.difficulty,
        seed: hashToSeed(`${uid}:${day}:${s.itemKey}`),
      });
    }
    return out;
  },
});

export const getByteProgress = query({
  args: { userId: v.string(), slug: v.string() },
  handler: async (ctx, { userId, slug }): Promise<ByteProgressView> => {
    const uid = await getUserId(ctx, { userId });
    const row = await ctx.db
      .query("byteProgress")
      .withIndex("by_user_key", (q) => q.eq("userId", uid).eq("key", slug))
      .unique();
    if (!row) {
      return {
        slug,
        status: "unseen",
        completedDay: null,
        xpEarned: 0,
        draftAnswers: null,
        draftChecked: null,
        draftCode: null,
        exercisePassed: false,
      };
    }
    return toByteProgressView(row);
  },
});

export const getAllByteProgress = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }): Promise<Record<string, ByteProgressView>> => {
    const uid = await getUserId(ctx, { userId });
    const rows = await ctx.db
      .query("byteProgress")
      .withIndex("by_user", (q) => q.eq("userId", uid))
      .collect();
    const out: Record<string, ByteProgressView> = {};
    for (const row of rows) {
      out[row.key] = toByteProgressView(row);
    }
    return out;
  },
});

export const getTopicMastery = query({
  args: { userId: v.string(), today: v.string() },
  handler: async (ctx, { userId, today }): Promise<TopicMasteryView[]> => {
    const uid = await getUserId(ctx, { userId });
    const day = asDayKey(today);
    const cards = await ctx.db
      .query("srsCards")
      .withIndex("by_user", (q) => q.eq("userId", uid))
      .collect();
    const byTopic = new Map<string, SrsState[]>();
    for (const doc of cards) {
      const s = srsDocToState(doc);
      const list = byTopic.get(s.topic) ?? [];
      list.push(s);
      byTopic.set(s.topic, list);
    }
    return [...byTopic.entries()]
      .map(([topic, items]) => {
        const avg =
          items.length === 0
            ? 0
            : items.reduce((sum, s) => sum + mastery(s), 0) / items.length;
        return {
          topic,
          mastery: avg,
          itemCount: items.length,
          dueCount: items.filter((s) => s.dueDay <= day).length,
        };
      })
      .sort((a, b) => b.mastery - a.mastery);
  },
});

export const getRecentXp = query({
  args: { userId: v.string(), days: v.number(), today: v.string() },
  handler: async (ctx, { userId, days, today }): Promise<DayXpView[]> => {
    const uid = await getUserId(ctx, { userId });
    const day = asDayKey(today);
    const xpEvents = await ctx.db
      .query("xpEvents")
      .withIndex("by_user", (q) => q.eq("userId", uid))
      .collect();
    const attempts = await ctx.db
      .query("attempts")
      .withIndex("by_user", (q) => q.eq("userId", uid))
      .collect();
    const out: DayXpView[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = addDays(day, -i);
      const xp = xpEvents
        .filter((e) => e.day === d)
        .reduce((s, e) => s + e.amount, 0);
      out.push({
        day: d,
        xp,
        practised: attempts.some((a) => a.day === d) || xp > 0,
      });
    }
    return out;
  },
});

// ---------- cross-user (leaderboard + counts) ----------
//
// The first queries that read across all profiles. No userId — these are global.
// At dev scale (~20 seeded profiles) a full collect+sort in JS is cheap. When real
// volume arrives, the by_xp index on profiles supports an indexed top-N read instead.

interface LeaderboardRow {
  rank: number;
  userId: string;
  displayName: string;
  xpTotal: number;
  level: number;
  currentStreak: number;
  track: "grad" | "beginner" | "engineer" | "founder";
}

export const getLeaderboard = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }): Promise<LeaderboardRow[]> => {
    const profiles = await ctx.db.query("profiles").collect();
    return profiles
      .sort((a, b) => b.xpTotal - a.xpTotal)
      .slice(0, limit ?? 20)
      .map((p, i) => ({
        rank: i + 1,
        userId: p.userId,
        displayName: p.displayName,
        xpTotal: p.xpTotal,
        level: levelProgress(p.xpTotal).level,
        currentStreak: p.currentStreak,
        track: p.track,
      }));
  },
});

interface UserCounts {
  totalLearners: number;
  /**
   * PLACEHOLDER — no presence backend exists yet. Deterministically derived from the
   * current minute so the count fluctuates believably during the demo. Replace with a
   * real @convex-dev/presence read (or a lastSeenAt field) when auth ships.
   */
  practicingNow: number;
  drillsAnswered: number;
  avgStreak: number;
}

export const getUserCounts = query({
  args: {},
  handler: async (ctx): Promise<UserCounts> => {
    const [profiles, attempts] = await Promise.all([
      ctx.db.query("profiles").collect(),
      ctx.db.query("attempts").collect(),
    ]);
    const totalLearners = profiles.length;
    const drillsAnswered = attempts.length;
    const avgStreak =
      totalLearners === 0
        ? 0
        : Math.round(
            profiles.reduce((s, p) => s + p.currentStreak, 0) / totalLearners,
          );
    // Deterministic-ish active count in a believable range, seeded by the minute so it
    // visibly changes between page loads. Honest placeholder — see field doc.
    const minuteSeed = Math.floor(Date.now() / 60000);
    const practicingNow =
      totalLearners === 0
        ? 0
        : 3 + (minuteSeed % Math.max(1, Math.floor(totalLearners / 3)));
    return { totalLearners, practicingNow, drillsAnswered, avgStreak };
  },
});

// ---------- raw reads used only by exportProgress ----------

export const getProfileForExport = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }): Promise<ProfileExport | null> => {
    const profile = await loadProfile(ctx, userId);
    if (!profile) return null;
    return {
      displayName: profile.displayName,
      track: profile.track,
      xpTotal: profile.xpTotal,
      currentStreak: profile.currentStreak,
      longestStreak: profile.longestStreak,
      lastPracticeDay: profile.lastPracticeDay,
      streakFreezes: profile.streakFreezes,
      createdAt: profile.createdAt,
      startingLevel: profile.startingLevel,
      weeklyMinutes: profile.weeklyMinutes,
      preferredTimeMode: profile.preferredTimeMode,
      onboardingCompletedAt: profile.onboardingCompletedAt,
    };
  },
});

export const getAllSrs = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }): Promise<SrsExport[]> => {
    const cards = await ctx.db
      .query("srsCards")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    return cards.map((c) => ({
      itemKey: c.itemKey,
      topic: c.topic,
      ease: c.ease,
      intervalDays: c.intervalDays,
      dueDay: c.dueDay,
      reps: c.reps,
      lapses: c.lapses,
      lastReviewedDay: c.lastReviewedDay,
    }));
  },
});

export const getAllByteProgressRaw = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }): Promise<ByteExport[]> => {
    const rows = await ctx.db
      .query("byteProgress")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    return rows.map((r) => ({
      key: r.key,
      status: r.status,
      completedDay: r.completedDay,
      xpEarned: r.xpEarned,
    }));
  },
});

export const getAttempts = query({
  args: { userId: v.string(), limit: v.number() },
  handler: async (ctx, { userId, limit }) => {
    const docs = await ctx.db
      .query("attempts")
      .withIndex("by_user_at", (q) => q.eq("userId", userId))
      .order("desc")
      .take(limit);
    return docs.map((a) => ({
      itemKey: a.itemKey,
      topic: a.topic,
      mode: a.mode,
      correct: a.correct,
      msTaken: a.msTaken,
      day: a.day,
      at: a.at,
    }));
  },
});

export const getXpEvents = query({
  args: { userId: v.string(), limit: v.number() },
  handler: async (ctx, { userId, limit }) => {
    const docs = await ctx.db
      .query("xpEvents")
      .withIndex("by_user_at", (q) => q.eq("userId", userId))
      .order("desc")
      .take(limit);
    return docs.map((e) => ({
      amount: e.amount,
      reason: e.reason,
      refKey: e.refKey,
      day: e.day,
      at: e.at,
    }));
  },
});

export const listProjects = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const uid = await getUserId(ctx, { userId });
    const rows = await ctx.db
      .query("projects")
      .withIndex("by_user", (q) => q.eq("userId", uid))
      .collect();
    return rows
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .map((row) => ({
        slug: row.slug,
        title: row.title,
        summary: row.summary,
        status: row.status,
        visibility: row.visibility,
        checkpoint: row.checkpoint,
        updatedAt: row.updatedAt,
      }));
  },
});

export const listPublicProjects = query({
  args: { limit: v.optional(v.number()) },
  returns: v.array(
    v.object({
      slug: v.string(),
      title: v.string(),
      summary: v.string(),
      checkpoint: v.string(),
      updatedAt: v.number(),
      displayName: v.string(),
    }),
  ),
  handler: async (ctx, { limit }) => {
    const rows = await ctx.db
      .query("projects")
      .withIndex("by_visibility", (q) => q.eq("visibility", "public"))
      .collect();
    const capped = rows
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, limit ?? 24);
    const out = [];
    for (const row of capped) {
      const profile = await ctx.db
        .query("profiles")
        .withIndex("by_user", (q) => q.eq("userId", row.userId))
        .unique();
      out.push({
        slug: row.slug,
        title: row.title,
        summary: row.summary,
        checkpoint: row.checkpoint,
        updatedAt: row.updatedAt,
        displayName: profile?.displayName ?? "Learner",
      });
    }
    return out;
  },
});
