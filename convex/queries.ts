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

import { QueryCtx, query, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";
import { displayNameFromIdentity, getIdentityProfile, getUserId } from "./lib/getUser";
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
      // Prefer live OAuth name from `users`; fall back to stored profile label.
      displayName: displayNameFromIdentity(identity, profile.displayName),
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

// ---------- cross-user (public stats) ----------
//
// The queries that read across all profiles. No userId — these are global.
// At dev scale (~20 seeded profiles) a full collect+sort in JS is cheap. When real
// volume arrives, the by_xp index on profiles supports an indexed top-N read instead.
//
// Note: the global-XP leaderboard query was removed deliberately — it conflicts
// with the engagement strategy (never rank beginners against experienced users;
// see docs/engagement-and-retention.md "Leaderboard decision"). If comparison
// returns, build cohort/weekly or personal-best, not global lifetime XP.

interface UserCounts {
  totalLearners: number;
  /**
   * Real, not fabricated (docs/engagement-and-retention.md: "Never fabricate social
   * activity"). Distinct real users with an attempt in the last 15 minutes, read from
   * the most recently created attempts (bounded `.take()`, not a full collect) as a
   * proxy for "recently active" until a real presence backend exists.
   */
  practicingNow: number;
  drillsAnswered: number;
  avgStreak: number;
}

const PRACTICING_WINDOW_MS = 15 * 60 * 1000;
const RECENT_ATTEMPTS_SAMPLE = 300;

export const getUserCounts = query({
  args: {},
  handler: async (ctx): Promise<UserCounts> => {
    const [allProfiles, attempts, recentAttempts] = await Promise.all([
      ctx.db.query("profiles").collect(),
      ctx.db.query("attempts").collect(),
      // Newest-created first (insertion order tracks `at` closely) — bounded sample,
      // not a full-table scan, to estimate who's active right now.
      ctx.db.query("attempts").order("desc").take(RECENT_ATTEMPTS_SAMPLE),
    ]);
    // Exclude demo/seed rows (seedDemoProfiles) from every public-facing count —
    // these are fabricated dev-only rows and must never inflate real launch metrics.
    const profiles = allProfiles.filter((p) => !p.seed);
    const seedUserIds = new Set(
      allProfiles.filter((p) => p.seed).map((p) => p.userId),
    );
    const totalLearners = profiles.length;
    const drillsAnswered = attempts.length;
    const avgStreak =
      totalLearners === 0
        ? 0
        : Math.round(
            profiles.reduce((s, p) => s + p.currentStreak, 0) / totalLearners,
          );

    const cutoff = Date.now() - PRACTICING_WINDOW_MS;
    const practicingNow = new Set(
      recentAttempts
        .filter((a) => a.at >= cutoff && !seedUserIds.has(a.userId))
        .map((a) => a.userId),
    ).size;

    return { totalLearners, practicingNow, drillsAnswered, avgStreak };
  },
});

/**
 * Raw lifetime stats the /progress milestones are derived from. Everything is
 * computed from existing tables — no new writes, no new milestone state.
 */
export const getMilestones = query({
  args: { userId: v.string(), today: v.string() },
  handler: async (ctx, { userId, today }) => {
    const uid = await getUserId(ctx, { userId });
    const day = asDayKey(today);
    const [profile, progressRows, attemptRows, evidenceRows] = await Promise.all([
      loadProfile(ctx, uid),
      ctx.db
        .query("byteProgress")
        .withIndex("by_user", (q) => q.eq("userId", uid))
        .collect(),
      ctx.db
        .query("attempts")
        .withIndex("by_user", (q) => q.eq("userId", uid))
        .collect(),
      ctx.db
        .query("skillEvidence")
        .withIndex("by_user", (q) => q.eq("userId", uid))
        .collect(),
    ]);
    const settled = profile ? settleForDisplay(profile, day) : null;
    return {
      lessonsCompleted: progressRows.filter((row) => row.status === "completed")
        .length,
      correctAnswers: attemptRows.filter((attempt) => attempt.correct).length,
      answersLogged: attemptRows.length,
      codeTestsPassed: new Set(evidenceRows.map((row) => row.sourceKey)).size,
      longestStreak: settled?.longestStreak ?? 0,
      xpTotal: profile?.xpTotal ?? 0,
    };
  },
});

/**
 * Topics the learner got wrong in the last two days (yesterday + today), for
 * the "Repair" card on /today. Only incorrect attempts count — the point is
 * to resurface the misconception, not the streak of wins.
 */
export const getRecentMisses = query({
  args: { userId: v.string(), today: v.string() },
  handler: async (ctx, { userId, today }) => {
    const uid = await getUserId(ctx, { userId });
    const day = asDayKey(today);
    const yesterday = addDays(day, -1);
    const attempts = await ctx.db
      .query("attempts")
      .withIndex("by_user_day", (q) => q.eq("userId", uid).eq("day", yesterday))
      .collect();
    const todays = await ctx.db
      .query("attempts")
      .withIndex("by_user_day", (q) => q.eq("userId", uid).eq("day", day))
      .collect();
    const misses = [...attempts, ...todays].filter((attempt) => !attempt.correct);
    const byTopic = new Map<string, { topic: string; missed: number }>();
    for (const miss of misses) {
      const entry = byTopic.get(miss.topic);
      if (entry) entry.missed += 1;
      else byTopic.set(miss.topic, { topic: miss.topic, missed: 1 });
    }
    return [...byTopic.values()].sort((a, b) => b.missed - a.missed).slice(0, 3);
  },
});

/**
 * The user's own feedback submissions, with admin replies — closes the loop
 * so a reply from /admin actually reaches the person who asked.
 */
export const getMyFeedback = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const uid = await getUserId(ctx, { userId });
    const rows = await ctx.db
      .query("feedback")
      .withIndex("by_user", (q) => q.eq("userId", uid))
      .collect();
    return rows
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 10)
      .map((row) => ({
        kind: row.kind,
        body: row.body,
        adminReply: row.adminReply ?? null,
        status: row.status,
        createdAt: row.createdAt,
      }));
  },
});

// ---------- raw reads used only by exportProgress ----------
//
// INTERNAL ONLY. These are invoked via ctx.runQuery(internal.…) from the
// exportProgress action, which resolves the caller's identity itself and passes
// the verified subject down. They are NOT registered as public queries — that
// would let any client read any user's attempts/XP/SRS/profile by supplying an
// arbitrary userId (an IDOR). See convex/lib/getUser.ts for the auth swap point.

export const getProfileForExport = internalQuery({
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

export const getAllSrs = internalQuery({
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

export const getAllByteProgressRaw = internalQuery({
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

export const getAttempts = internalQuery({
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

export const getXpEvents = internalQuery({
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
