/**
 * Admin mutations — gated by `requireAdmin`, except the public feedback
 * submission (which anyone may do, rate-limited separately).
 *
 * Identity is derived server-side; no userId/isAdmin is accepted from the
 * client for admin operations.
 */

import { mutation, internalMutation } from "../_generated/server";
import { v } from "convex/values";
import { internal } from "../_generated/api";
import { requireAdmin, isAdminEmail } from "../lib/admin";
import { getIdentityProfile } from "../lib/getUser";
import { rateLimiter } from "../lib/rateLimit";

const DEFAULT_TRIGGERS = [
  {
    key: "daily_due_reminder",
    scheduleLabel: "Daily · 09:00 IST (cron)",
    subjectTemplate: "Your Mastery Challenge is ready",
    bodyTemplate:
      "Hi {{name}},\n\nYou have reviews waiting on ByteSizeDecodes.\nOpen Today: https://bytesizedecodes.com/today\n\n— ByteSizeDecodes",
  },
  {
    key: "weekly_digest",
    scheduleLabel: "Weekly · Monday 10:00 IST (cron)",
    subjectTemplate: "Your week of AI learning",
    bodyTemplate:
      "Hi {{name}},\n\nA quick nudge to open Today and keep one idea sticky.\nhttps://bytesizedecodes.com/today\n\n— ByteSizeDecodes",
  },
] as const;

/** Update a feedback item's status and optional admin reply. The triage action. */
export const updateFeedbackStatus = mutation({
  args: {
    id: v.id("feedback"),
    status: v.union(
      v.literal("new"),
      v.literal("viewed"),
      v.literal("in_progress"),
      v.literal("resolved"),
      v.literal("wontfix"),
    ),
    adminReply: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, { id, status, adminReply }) => {
    await requireAdmin(ctx);
    const patch: Record<string, unknown> = { status };
    if (adminReply !== undefined) {
      const trimmed = adminReply.trim();
      if (trimmed.length > 2000) throw new Error("Reply too long (2000 char max)");
      patch.adminReply = trimmed.length > 0 ? trimmed : undefined;
    }
    if (status === "resolved" || status === "wontfix") patch.resolvedAt = Date.now();
    await ctx.db.patch(id, patch);
    return null;
  },
});

/**
 * Promote the calling authenticated user to admin IF their email is in the
 * ADMIN_EMAILS allowlist. Idempotent.
 */
export const bootstrapAdminRole = mutation({
  args: {},
  returns: v.object({
    promoted: v.boolean(),
    reason: v.string(),
  }),
  handler: async (ctx) => {
    const identity = await getIdentityProfile(ctx);
    if (!identity?.subject) {
      throw new Error("Not authenticated");
    }
    if (!isAdminEmail(identity.email)) {
      return { promoted: false, reason: "email not allowlisted" };
    }
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .unique();
    if (!profile) {
      return { promoted: false, reason: "no profile" };
    }
    if (profile.role === "admin") {
      return { promoted: false, reason: "already admin" };
    }
    await ctx.db.patch(profile._id, { role: "admin" });
    return { promoted: true, reason: "promoted" };
  },
});

/** PUBLIC — submit feedback (anonymous allowed). */
export const submitFeedback = mutation({
  args: {
    userId: v.string(),
    kind: v.union(
      v.literal("bug"),
      v.literal("content_error"),
      v.literal("idea"),
      v.literal("praise"),
      v.literal("other"),
    ),
    body: v.string(),
    url: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, { userId: _ignoredUserId, kind, body, url }) => {
    await rateLimiter.limit(ctx, "feedback", { throws: true });

    const trimmed = body.trim();
    if (trimmed.length === 0) throw new Error("Feedback body is empty");
    if (trimmed.length > 2000) throw new Error("Feedback too long (2000 char max)");

    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject ?? "anonymous";
    const safeUrl = sanitizeFeedbackUrl(url);

    await ctx.db.insert("feedback", {
      userId,
      kind,
      body: trimmed,
      url: safeUrl,
      status: "new",
      createdAt: Date.now(),
    });
    return null;
  },
});

/** Ensure default trigger rows exist (idempotent). */
export const ensureDefaultTriggers = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const now = Date.now();
    for (const t of DEFAULT_TRIGGERS) {
      const existing = await ctx.db
        .query("adminTriggers")
        .withIndex("by_key", (q) => q.eq("key", t.key))
        .unique();
      if (!existing) {
        await ctx.db.insert("adminTriggers", {
          key: t.key,
          enabled: false,
          scheduleLabel: t.scheduleLabel,
          subjectTemplate: t.subjectTemplate,
          bodyTemplate: t.bodyTemplate,
          updatedAt: now,
        });
      }
    }
    return null;
  },
});

export const updateTrigger = mutation({
  args: {
    key: v.string(),
    enabled: v.optional(v.boolean()),
    subjectTemplate: v.optional(v.string()),
    bodyTemplate: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const row = await ctx.db
      .query("adminTriggers")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .unique();
    if (!row) throw new Error("Unknown trigger — open Email page to seed defaults");
    const patch: {
      enabled?: boolean;
      subjectTemplate?: string;
      bodyTemplate?: string;
      updatedAt: number;
    } = { updatedAt: Date.now() };
    if (args.enabled !== undefined) patch.enabled = args.enabled;
    if (args.subjectTemplate !== undefined) {
      const s = args.subjectTemplate.trim();
      if (s.length < 3 || s.length > 200) throw new Error("Subject 3–200 chars");
      patch.subjectTemplate = s;
    }
    if (args.bodyTemplate !== undefined) {
      const b = args.bodyTemplate.trim();
      if (b.length < 10 || b.length > 8000) throw new Error("Body 10–8000 chars");
      patch.bodyTemplate = b;
    }
    await ctx.db.patch(row._id, patch);
    return null;
  },
});

/** Create a campaign: send now or schedule for later. */
export const createEmailCampaign = mutation({
  args: {
    subject: v.string(),
    body: v.string(),
    sendNow: v.boolean(),
    scheduledForEpochMs: v.optional(v.number()),
  },
  returns: v.object({
    campaignId: v.id("emailCampaigns"),
    status: v.string(),
  }),
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx);
    const subject = args.subject.trim();
    const body = args.body.trim();
    if (subject.length < 3 || subject.length > 200) {
      throw new Error("Subject must be 3–200 characters");
    }
    if (body.length < 10 || body.length > 8000) {
      throw new Error("Body must be 10–8000 characters");
    }

    let scheduledFor: number | null = null;
    let status: "scheduled" | "sending" = "sending";

    if (args.sendNow) {
      status = "sending";
      scheduledFor = null;
    } else {
      const when = args.scheduledForEpochMs;
      if (!when || when < Date.now() + 30_000) {
        throw new Error("Schedule at least 30 seconds in the future");
      }
      if (when > Date.now() + 90 * 86_400_000) {
        throw new Error("Cannot schedule more than 90 days ahead");
      }
      status = "scheduled";
      scheduledFor = when;
    }

    const campaignId = await ctx.db.insert("emailCampaigns", {
      subject,
      body,
      audience: "all_with_email",
      status,
      scheduledFor,
      createdAt: Date.now(),
      createdBy: admin.userId,
    });

    if (status === "sending") {
      await ctx.scheduler.runAfter(0, internal.admin.emailActions.dispatchCampaign, {
        campaignId,
      });
    }

    return { campaignId, status };
  },
});

export const cancelEmailCampaign = mutation({
  args: { campaignId: v.id("emailCampaigns") },
  returns: v.null(),
  handler: async (ctx, { campaignId }) => {
    await requireAdmin(ctx);
    const c = await ctx.db.get(campaignId);
    if (!c) throw new Error("Campaign not found");
    if (c.status !== "scheduled" && c.status !== "draft") {
      throw new Error("Only scheduled/draft campaigns can be cancelled");
    }
    await ctx.db.patch(campaignId, { status: "cancelled" });
    return null;
  },
});

/** Cron: pick due scheduled campaigns and dispatch send. */
export const processScheduledCampaigns = internalMutation({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const now = Date.now();
    const scheduled = await ctx.db
      .query("emailCampaigns")
      .withIndex("by_status", (q) => q.eq("status", "scheduled"))
      .take(20);
    let n = 0;
    for (const c of scheduled) {
      if (c.scheduledFor !== null && c.scheduledFor <= now) {
        await ctx.db.patch(c._id, { status: "sending" });
        await ctx.scheduler.runAfter(0, internal.admin.emailActions.dispatchCampaign, {
          campaignId: c._id,
        });
        n += 1;
      }
    }
    return n;
  },
});

export const markCampaignResult = internalMutation({
  args: {
    campaignId: v.id("emailCampaigns"),
    status: v.union(v.literal("sent"), v.literal("failed")),
    recipientCount: v.number(),
    sentCount: v.number(),
    error: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.campaignId, {
      status: args.status,
      recipientCount: args.recipientCount,
      sentCount: args.sentCount,
      error: args.error,
      sentAt: Date.now(),
    });
    return null;
  },
});

export const markTriggerRun = internalMutation({
  args: {
    key: v.string(),
    result: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, { key, result }) => {
    const row = await ctx.db
      .query("adminTriggers")
      .withIndex("by_key", (q) => q.eq("key", key))
      .unique();
    if (row) {
      await ctx.db.patch(row._id, {
        lastRunAt: Date.now(),
        lastResult: result.slice(0, 500),
      });
    }
    return null;
  },
});

function sanitizeFeedbackUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") return parsed.toString();
    return undefined;
  } catch {
    return undefined;
  }
}
