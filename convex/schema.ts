/**
 * Convex schema — normalized split of the Phase 0 PersistedStateV1 blob.
 *
 * Why 5 tables instead of one blob:
 *  - The profile row is the hot, mutated-on-every-answer state; keep it isolated.
 *  - attempts/xpEvents are append-only logs; storing them as separate docs lets us
 *    page through history and run analytics without rewriting a giant doc.
 *  - srsCards and byteProgress are keyed by (user, item) so updates are O(1) patches
 *    rather than rewriting a map.
 *
 * Every table carries `userId`. Today the client sends a trusted localStorage UUID;
 * when Convex Auth arrives that field is populated from ctx.auth instead, but the
 * schema does not change.
 */

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const track = v.union(
  v.literal("grad"),
  v.literal("beginner"),
  v.literal("engineer"),
  v.literal("founder"),
);

const practiceMode = v.union(
  v.literal("byte"),
  v.literal("review"),
  v.literal("practice"),
);

const byteStatus = v.union(v.literal("started"), v.literal("completed"));

/** 1/user. The derived profile view (level etc.) is computed in queries, not stored. */
const profiles = defineTable({
  userId: v.string(),
  displayName: v.string(),
  track,
  xpTotal: v.number(),
  currentStreak: v.number(),
  longestStreak: v.number(),
  /** ISO YYYY-MM-DD in IST, or null before first practice. */
  lastPracticeDay: v.union(v.string(), v.null()),
  streakFreezes: v.number(),
  createdAt: v.number(),
  /**
   * True for demo/seed profiles created by seedDemoProfiles. Lets us clear and re-seed
   * without touching real users. Drop the whole field once real auth exists.
   */
  seed: v.optional(v.boolean()),
})
  .index("by_user", ["userId"])
  // Top-N leaderboard read. At dev scale (~20 profiles) a full collect+sort is fine;
  // this index pays off once real volume arrives.
  .index("by_xp", ["xpTotal"]);

/** 1/(user, itemKey). The SM-2 scheduling state for a drill. */
const srsCards = defineTable({
  userId: v.string(),
  itemKey: v.string(),
  topic: v.string(),
  ease: v.number(),
  intervalDays: v.number(),
  /** ISO YYYY-MM-DD in IST. */
  dueDay: v.string(),
  reps: v.number(),
  lapses: v.number(),
  lastReviewedDay: v.union(v.string(), v.null()),
})
  .index("by_user", ["userId"])
  .index("by_user_due", ["userId", "dueDay"])
  .index("by_user_item", ["userId", "itemKey"]);

/** 1/(user, key). `key` is a byte slug OR a `course:<course>:<lesson>` lesson key. */
const byteProgress = defineTable({
  userId: v.string(),
  /** Byte slug or course lesson key — one namespace, one read path. */
  key: v.string(),
  status: byteStatus,
  completedDay: v.union(v.string(), v.null()),
  xpEarned: v.number(),
})
  .index("by_user", ["userId"])
  .index("by_user_key", ["userId", "key"]);

/** Append-only answer log. */
const attempts = defineTable({
  userId: v.string(),
  itemKey: v.string(),
  topic: v.string(),
  mode: practiceMode,
  correct: v.boolean(),
  msTaken: v.number(),
  /** ISO YYYY-MM-DD in IST. */
  day: v.string(),
  at: v.number(),
})
  .index("by_user", ["userId"])
  .index("by_user_day", ["userId", "day"])
  .index("by_user_at", ["userId", "at"]);

/** Append-only XP ledger — the audit trail behind profiles.xpTotal. */
const xpEvents = defineTable({
  userId: v.string(),
  amount: v.number(),
  reason: v.string(),
  refKey: v.union(v.string(), v.null()),
  /** ISO YYYY-MM-DD in IST. */
  day: v.string(),
  at: v.number(),
})
  .index("by_user", ["userId"])
  .index("by_user_day", ["userId", "day"])
  .index("by_user_at", ["userId", "at"]);

export default defineSchema({
  profiles,
  srsCards,
  byteProgress,
  attempts,
  xpEvents,
});
