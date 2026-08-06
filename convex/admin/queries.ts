/**
 * Admin queries — every one gated by `requireAdmin`.
 *
 * Identity is derived server-side (see convex/lib/admin.ts); no `userId` is
 * accepted from the client. These power the /admin dashboard.
 */

import { query } from "../_generated/server";
import { v } from "convex/values";
import type { Id, Doc } from "../_generated/dataModel";
import type { QueryCtx } from "../_generated/server";
import { requireAdmin } from "../lib/admin";

const MS_PER_DAY = 86_400_000;

/** Aggregate platform stats for the admin dashboard. */
export const getStats = query({
  args: {},
  returns: v.object({
    totalLearners: v.number(),
    realLearners: v.number(),
    seedProfiles: v.number(),
    active7d: v.number(),
    active30d: v.number(),
    authenticated: v.number(),
    withEmail: v.number(),
    feedback: v.record(v.string(), v.number()),
    feedbackTotal: v.number(),
    openFeedback: v.number(),
    campaignsSent: v.number(),
  }),
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const profiles = await ctx.db.query("profiles").collect();
    const now = Date.now();
    const active7 = new Set<string>();
    const active30 = new Set<string>();

    const since7 = now - 7 * MS_PER_DAY;
    const since30 = now - 30 * MS_PER_DAY;
    // Cap read for stats — at small scale fine; index by_user_day would be better later.
    const recentAttempts = await ctx.db.query("attempts").order("desc").take(5000);
    for (const a of recentAttempts) {
      if (a.at >= since7) active7.add(a.userId);
      if (a.at >= since30) active30.add(a.userId);
    }

    const authenticated = profiles.filter((p) => !p.seed).length;
    const seed = profiles.filter((p) => p.seed).length;
    const withEmail = await countUniqueEmails(ctx, profiles);

    const feedbackByStatus = await countFeedbackByStatus(ctx);
    const openFeedback =
      (feedbackByStatus.new ?? 0) +
      (feedbackByStatus.viewed ?? 0) +
      (feedbackByStatus.in_progress ?? 0);

    const sentCampaigns = await ctx.db
      .query("emailCampaigns")
      .withIndex("by_status", (q) => q.eq("status", "sent"))
      .take(200);

    return {
      totalLearners: profiles.length,
      realLearners: profiles.length - seed,
      seedProfiles: seed,
      active7d: active7.size,
      active30d: active30.size,
      authenticated,
      withEmail,
      feedback: feedbackByStatus,
      feedbackTotal: Object.values(feedbackByStatus).reduce((s, n) => s + n, 0),
      openFeedback,
      campaignsSent: sentCampaigns.length,
    };
  },
});

/** Account holders (non-seed) with name + email for admin ops. */
export const listUsers = query({
  args: { limit: v.optional(v.number()) },
  returns: v.array(
    v.object({
      _id: v.id("profiles"),
      displayName: v.string(),
      email: v.union(v.string(), v.null()),
      userId: v.string(),
      track: v.string(),
      xpTotal: v.number(),
      currentStreak: v.number(),
      role: v.string(),
      seed: v.boolean(),
      createdAt: v.number(),
      lastPracticeDay: v.union(v.string(), v.null()),
      onboardingCompletedAt: v.union(v.number(), v.null()),
    }),
  ),
  handler: async (ctx, { limit }) => {
    await requireAdmin(ctx);
    const cap = Math.min(limit ?? 100, 300);
    const profiles = await ctx.db.query("profiles").order("desc").take(cap);

    const rows = await Promise.all(
      profiles.map(async (p) => {
        const contact = await resolveContact(ctx, p);
        return {
          _id: p._id,
          displayName: contact.name,
          email: contact.email,
          userId: p.userId,
          track: p.track,
          xpTotal: p.xpTotal,
          currentStreak: p.currentStreak,
          role: p.role ?? "user",
          seed: p.seed ?? false,
          createdAt: p.createdAt,
          lastPracticeDay: p.lastPracticeDay,
          onboardingCompletedAt: p.onboardingCompletedAt ?? null,
        };
      }),
    );
    return rows;
  },
});

/** Unique recipients eligible for “email all” campaigns. */
export const listMailRecipients = query({
  args: {},
  returns: v.object({
    count: v.number(),
    recipients: v.array(
      v.object({
        email: v.string(),
        name: v.string(),
        profileId: v.id("profiles"),
      }),
    ),
  }),
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const profiles = await ctx.db.query("profiles").collect();
    const byEmail = new Map<
      string,
      { email: string; name: string; profileId: Id<"profiles"> }
    >();

    for (const p of profiles) {
      if (p.seed) continue;
      const contact = await resolveContact(ctx, p);
      if (!contact.email) continue;
      if (!byEmail.has(contact.email)) {
        byEmail.set(contact.email, {
          email: contact.email,
          name: contact.name,
          profileId: p._id,
        });
      }
    }

    const recipients = [...byEmail.values()].sort((a, b) =>
      a.email.localeCompare(b.email),
    );
    return { count: recipients.length, recipients };
  },
});

/** Feedback list, optionally filtered by status, newest first. */
export const listFeedback = query({
  args: { status: v.optional(v.string()) },
  returns: v.array(
    v.object({
      _id: v.id("feedback"),
      userId: v.string(),
      kind: v.string(),
      body: v.string(),
      url: v.optional(v.string()),
      status: v.string(),
      adminReply: v.optional(v.string()),
      createdAt: v.number(),
      resolvedAt: v.optional(v.number()),
    }),
  ),
  handler: async (ctx, { status }) => {
    await requireAdmin(ctx);
    if (status && status !== "all") {
      return await ctx.db
        .query("feedback")
        .withIndex("by_status", (q) =>
          q.eq(
            "status",
            status as "new" | "viewed" | "in_progress" | "resolved" | "wontfix",
          ),
        )
        .order("desc")
        .take(100);
    }
    return await ctx.db.query("feedback").order("desc").take(100);
  },
});

export const listCampaigns = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("emailCampaigns"),
      subject: v.string(),
      body: v.string(),
      audience: v.string(),
      status: v.string(),
      scheduledFor: v.union(v.number(), v.null()),
      createdAt: v.number(),
      sentAt: v.optional(v.number()),
      recipientCount: v.optional(v.number()),
      sentCount: v.optional(v.number()),
      error: v.optional(v.string()),
    }),
  ),
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const rows = await ctx.db.query("emailCampaigns").order("desc").take(50);
    return rows.map((c) => ({
      _id: c._id,
      subject: c.subject,
      body: c.body,
      audience: c.audience,
      status: c.status,
      scheduledFor: c.scheduledFor,
      createdAt: c.createdAt,
      sentAt: c.sentAt,
      recipientCount: c.recipientCount,
      sentCount: c.sentCount,
      error: c.error,
    }));
  },
});

export const listTriggers = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("adminTriggers"),
      key: v.string(),
      enabled: v.boolean(),
      scheduleLabel: v.string(),
      subjectTemplate: v.string(),
      bodyTemplate: v.string(),
      updatedAt: v.number(),
      lastRunAt: v.optional(v.number()),
      lastResult: v.optional(v.string()),
    }),
  ),
  handler: async (ctx) => {
    await requireAdmin(ctx);
    // Ensure defaults exist lazily for the UI (query can't write — mutation seed).
    const existing = await ctx.db.query("adminTriggers").collect();
    return existing.map((t) => ({
      _id: t._id,
      key: t.key,
      enabled: t.enabled,
      scheduleLabel: t.scheduleLabel,
      subjectTemplate: t.subjectTemplate,
      bodyTemplate: t.bodyTemplate,
      updatedAt: t.updatedAt,
      lastRunAt: t.lastRunAt,
      lastResult: t.lastResult,
    }));
  },
});

export const getEmailConfigStatus = query({
  args: {},
  returns: v.object({
    resendConfigured: v.boolean(),
    fromAddress: v.string(),
  }),
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const key = process.env.RESEND_API_KEY;
    const from =
      process.env.EMAIL_FROM?.trim() ||
      "ByteSizeDecodes <onboarding@resend.dev>";
    return {
      resendConfigured: Boolean(key && key.length > 8),
      fromAddress: from,
    };
  },
});

async function resolveContact(
  ctx: QueryCtx,
  profile: Doc<"profiles">,
): Promise<{ name: string; email: string | null }> {
  if (profile.email) {
    return { name: profile.displayName, email: profile.email };
  }
  const authId =
    profile.authUserId ??
    (profile.userId.includes("|") ? profile.userId.split("|")[0] : profile.userId);
  if (!authId) return { name: profile.displayName, email: null };
  try {
    const user = await ctx.db.get(authId as Id<"users">);
    if (!user) return { name: profile.displayName, email: null };
    const name =
      (typeof user.name === "string" && user.name.trim()) || profile.displayName;
    const email =
      typeof user.email === "string" && user.email.includes("@")
        ? user.email.trim().toLowerCase()
        : null;
    return { name, email };
  } catch {
    return { name: profile.displayName, email: null };
  }
}

async function countUniqueEmails(
  ctx: QueryCtx,
  profiles: Doc<"profiles">[],
): Promise<number> {
  const emails = new Set<string>();
  for (const p of profiles) {
    if (p.seed) continue;
    const c = await resolveContact(ctx, p);
    if (c.email) emails.add(c.email);
  }
  return emails.size;
}

async function countFeedbackByStatus(ctx: {
  db: QueryCtx["db"];
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
