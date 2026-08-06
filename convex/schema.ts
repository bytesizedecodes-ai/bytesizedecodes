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
import { authTables } from "@convex-dev/auth/server";

const track = v.union(
  v.literal("grad"),
  v.literal("beginner"),
  v.literal("engineer"),
  v.literal("founder"),
);

const startingLevel = v.union(
  v.literal("new"),
  v.literal("some"),
  v.literal("comfortable"),
);

const timeMode = v.union(
  v.literal("quick"),
  v.literal("standard"),
  v.literal("deep"),
);

const practiceMode = v.union(
  v.literal("byte"),
  v.literal("review"),
  v.literal("practice"),
);

const byteStatus = v.union(v.literal("started"), v.literal("completed"));

/** Authorization role. Absent = ordinary "user". "admin" gates /admin + admin endpoints. */
const role = v.union(v.literal("user"), v.literal("admin"));

const feedbackStatus = v.union(
  v.literal("new"),
  v.literal("viewed"),
  v.literal("in_progress"),
  v.literal("resolved"),
  v.literal("wontfix"),
);

const feedbackKind = v.union(
  v.literal("bug"),
  v.literal("content_error"),
  v.literal("idea"),
  v.literal("praise"),
  v.literal("other"),
);

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
  startingLevel: v.optional(startingLevel),
  weeklyMinutes: v.optional(v.number()),
  preferredTimeMode: v.optional(timeMode),
  onboardingCompletedAt: v.optional(v.number()),
  /**
   * True for demo/seed profiles created by seedDemoProfiles. Lets us clear and re-seed
   * without touching real users. Drop the whole field once real auth exists.
   */
  seed: v.optional(v.boolean()),
  /** Previous browser UUID, kept so anonymous→auth claim can migrate progress once. */
  legacyAnonId: v.optional(v.string()),
  /** Authorization role. Absent = ordinary "user". Promoted server-side via ADMIN_EMAILS. */
  role: v.optional(role),
  /** OAuth email captured at ensure/sync — for admin ops and mail (never trust client). */
  email: v.optional(v.string()),
  /** Convex Auth users table id (subject prefix before |session). */
  authUserId: v.optional(v.string()),
})
  .index("by_user", ["userId"])
  // Top-N leaderboard read. At dev scale (~20 profiles) a full collect+sort is fine;
  // this index pays off once real volume arrives.
  .index("by_xp", ["xpTotal"])
  .index("by_legacy_anon", ["legacyAnonId"])
  .index("by_email", ["email"]);

/** Learner project artifacts (Build track). Private by default. */
const projects = defineTable({
  userId: v.string(),
  slug: v.string(),
  title: v.string(),
  summary: v.string(),
  status: v.union(
    v.literal("draft"),
    v.literal("in_progress"),
    v.literal("submitted"),
    v.literal("published"),
  ),
  visibility: v.union(v.literal("private"), v.literal("unlisted"), v.literal("public")),
  checkpoint: v.string(),
  /** JSON blob of artifact fields (problem brief, notes, demo URL, etc.). */
  artifactJson: v.string(),
  updatedAt: v.number(),
  createdAt: v.number(),
})
  .index("by_user", ["userId"])
  .index("by_user_slug", ["userId", "slug"])
  .index("by_visibility", ["visibility"]);

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
  /** In-progress MCQ selections keyed by question id (JSON object string). */
  draftAnswers: v.optional(v.string()),
  /** Question ids already checked this session (JSON string array). */
  draftChecked: v.optional(v.string()),
  /** In-progress code cell contents. */
  draftCode: v.optional(v.string()),
  /** True after hidden Pyodide tests pass for this unit's exercise. */
  exercisePassed: v.optional(v.boolean()),
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

/** Privacy-safe product analytics for loop milestones. */
const analyticsEvents = defineTable({
  userId: v.string(),
  name: v.string(),
  /** ISO YYYY-MM-DD in IST. */
  day: v.string(),
  at: v.number(),
  refKey: v.optional(v.string()),
  track: v.optional(track),
  mode: v.optional(v.string()),
})
  .index("by_user", ["userId"])
  .index("by_user_name", ["userId", "name"]);

/** Verified skill evidence (e.g. passing a code exercise). */
const skillEvidence = defineTable({
  userId: v.string(),
  skillId: v.string(),
  sourceKey: v.string(),
  kind: v.union(
    v.literal("code_test"),
    v.literal("byte_complete"),
    v.literal("attempt"),
  ),
  /** ISO YYYY-MM-DD in IST. */
  day: v.string(),
  at: v.number(),
})
  .index("by_user", ["userId"])
  .index("by_user_skill", ["userId", "skillId"])
  .index("by_user_source", ["userId", "sourceKey"]);

/**
 * User-submitted feedback (the user→admin loop). Public to submit (anonymous
 * users can report issues), but only admins can read/triage (see convex/lib/admin.ts).
 */
const feedback = defineTable({
  userId: v.string(),
  kind: feedbackKind,
  body: v.string(),
  /** Page URL where the feedback was submitted, for context. */
  url: v.optional(v.string()),
  status: feedbackStatus,
  /** Admin's reply shown back to the user (optional). */
  adminReply: v.optional(v.string()),
  createdAt: v.number(),
  resolvedAt: v.optional(v.number()),
})
  .index("by_status", ["status"])
  .index("by_user", ["userId"])
  .index("by_created", ["createdAt"]);

/**
 * Public lead forms: Advertise with us / product update subscribe.
 * Stored for admin review; an email notification is scheduled to CONTACT mailbox.
 */
const inquiries = defineTable({
  kind: v.union(v.literal("advertise"), v.literal("subscribe")),
  name: v.string(),
  email: v.string(),
  company: v.optional(v.string()),
  website: v.optional(v.string()),
  budget: v.optional(v.string()),
  /** Goal type e.g. sponsorship | product interest focus */
  intent: v.optional(v.string()),
  interests: v.optional(v.array(v.string())),
  message: v.string(),
  createdAt: v.number(),
  /** True after outbound email attempt completes (success or fail handled in logs). */
  emailNotified: v.optional(v.boolean()),
})
  .index("by_kind", ["kind"])
  .index("by_created", ["createdAt"]);

/**
 * Admin outbound email campaigns (broadcast / scheduled announcements).
 * Sent via Resend when RESEND_API_KEY is set on the Convex deployment.
 */
const emailCampaigns = defineTable({
  subject: v.string(),
  body: v.string(),
  audience: v.union(v.literal("all_with_email")),
  status: v.union(
    v.literal("draft"),
    v.literal("scheduled"),
    v.literal("sending"),
    v.literal("sent"),
    v.literal("failed"),
    v.literal("cancelled"),
  ),
  /** Epoch ms to send; null means send-now queue. */
  scheduledFor: v.union(v.number(), v.null()),
  createdAt: v.number(),
  createdBy: v.string(),
  sentAt: v.optional(v.number()),
  recipientCount: v.optional(v.number()),
  sentCount: v.optional(v.number()),
  error: v.optional(v.string()),
})
  .index("by_status", ["status"])
  .index("by_created", ["createdAt"]);

/**
 * Global admin toggles for automated email triggers (key/value JSON strings).
 * Keys: daily_due_reminder, etc.
 */
const adminTriggers = defineTable({
  key: v.string(),
  enabled: v.boolean(),
  /** Human schedule note e.g. "daily 09:00 IST" (cron is fixed in code). */
  scheduleLabel: v.string(),
  subjectTemplate: v.string(),
  bodyTemplate: v.string(),
  updatedAt: v.number(),
  lastRunAt: v.optional(v.number()),
  lastResult: v.optional(v.string()),
}).index("by_key", ["key"]);

export default defineSchema({
  ...authTables,
  profiles,
  srsCards,
  byteProgress,
  attempts,
  xpEvents,
  analyticsEvents,
  skillEvidence,
  projects,
  feedback,
  inquiries,
  emailCampaigns,
  adminTriggers,
});
