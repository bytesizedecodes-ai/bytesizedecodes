/**
 * Admin mutations — gated by `requireAdmin`, except the public feedback
 * submission (which anyone may do, rate-limited separately).
 *
 * Identity is derived server-side; no userId/isAdmin is accepted from the
 * client for admin operations.
 */

import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { requireAdmin, isAdminEmail } from "../lib/admin";

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
  handler: async (ctx, { id, status, adminReply }) => {
    await requireAdmin(ctx);
    const patch: Record<string, unknown> = { status };
    if (adminReply !== undefined) patch.adminReply = adminReply;
    if (status === "resolved" || status === "wontfix") patch.resolvedAt = Date.now();
    await ctx.db.patch(id, patch);
    return null;
  },
});

/**
 * Promote the calling authenticated user to admin IF their email is in the
 * ADMIN_EMAILS allowlist. Idempotent: no-op if already admin or not allowlisted.
 * Called after a Google/GitHub sign-in; safe to call repeatedly.
 */
export const bootstrapAdminRole = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity?.subject) {
      throw new Error("Not authenticated");
    }
    // Must be a real (non-anonymous) authenticated session with an email.
    if (!isAdminEmail(identity.email)) {
      return { promoted: false, reason: "email not allowlisted" as const };
    }
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject!))
      .unique();
    if (!profile) {
      return { promoted: false, reason: "no profile" as const };
    }
    if (profile.role === "admin") {
      return { promoted: false, reason: "already admin" as const };
    }
    await ctx.db.patch(profile._id, { role: "admin" });
    return { promoted: true, reason: "promoted" as const };
  },
});

/**
 * PUBLIC — submit feedback. No auth required (anonymous users may report issues).
 * Identity uses the same getUserId swap point as learning mutations so progress
 * and feedback stay linked to the same user. Rate limiting should be added before
 * production scale (@convex-dev/rate-limiter); until then, the body length cap is
 * the only guard.
 */
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
  handler: async (ctx, { userId, kind, body, url }) => {
    const trimmed = body.trim();
    if (trimmed.length === 0) throw new Error("Feedback body is empty");
    if (trimmed.length > 2000) throw new Error("Feedback too long (2000 char max)");
    await ctx.db.insert("feedback", {
      userId,
      kind,
      body: trimmed,
      url,
      status: "new",
      createdAt: Date.now(),
    });
    return null;
  },
});
