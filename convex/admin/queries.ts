/**
 * Admin queries — every one gated by `requireAdmin`.
 *
 * Identity is derived server-side (see convex/lib/admin.ts); no `userId` is
 * accepted from the client. These power the /admin dashboard.
 */

import { query } from "../_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "../lib/admin";

const MS_PER_DAY = 86_400_000;

/** Aggregate platform stats for the admin dashboard. */
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const profiles = await ctx.db.query("profiles").collect();
    const now = Date.now();
    const active7 = new Set<string>();
    const active30 = new Set<string>();

    // lastActive is derived from the most recent attempt; scan recent attempts.
    const since7 = now - 7 * MS_PER_DAY;
    const since30 = now - 30 * MS_PER_DAY;
    const recentAttempts = await ctx.db.query("attempts").collect();
    for (const a of recentAttempts) {
      if (a.at >= since7) active7.add(a.userId);
      if (a.at >= since30) active30.add(a.userId);
    }

    const authenticated = profiles.filter((p) => p.role !== undefined || !p.seed).length;
    const seed = profiles.filter((p) => p.seed).length;

    const feedbackByStatus = await countFeedbackByStatus(ctx);

    return {
      totalLearners: profiles.length,
      realLearners: profiles.length - seed,
      seedProfiles: seed,
      active7d: active7.size,
      active30d: active30.size,
      authenticated,
      feedback: feedbackByStatus,
      feedbackTotal: Object.values(feedbackByStatus).reduce((s, n) => s + n, 0),
    };
  },
});

/** Paginated user list for /admin/users. */
export const listUsers = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    await requireAdmin(ctx);
    const cap = Math.min(limit ?? 50, 200);
    const profiles = await ctx.db.query("profiles").order("desc").take(cap);
    return profiles.map((p) => ({
      _id: p._id,
      displayName: p.displayName,
      userId: p.userId,
      track: p.track,
      xpTotal: p.xpTotal,
      currentStreak: p.currentStreak,
      role: p.role ?? "user",
      seed: p.seed ?? false,
      createdAt: p.createdAt,
      lastPracticeDay: p.lastPracticeDay,
      onboardingCompletedAt: p.onboardingCompletedAt ?? null,
    }));
  },
});

/** Feedback list, optionally filtered by status, newest first. */
export const listFeedback = query({
  args: { status: v.optional(v.string()) },
  handler: async (ctx, { status }) => {
    await requireAdmin(ctx);
    if (status && status !== "all") {
      return await ctx.db
        .query("feedback")
        .withIndex("by_status", (q) => q.eq("status", status as "new"))
        .order("desc")
        .take(100);
    }
    return await ctx.db.query("feedback").order("desc").take(100);
  },
});

async function countFeedbackByStatus(ctx: {
  db: { query: (t: "feedback") => any };
}): Promise<Record<string, number>> {
  const all = await ctx.db.query("feedback").collect();
  const counts: Record<string, number> = {
    new: 0,
    viewed: 0,
    in_progress: 0,
    resolved: 0,
    wontfix: 0,
  };
  for (const f of all) {
    counts[f.status] = (counts[f.status] ?? 0) + 1;
  }
  return counts;
}
