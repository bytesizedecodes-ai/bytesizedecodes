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
 *
 * SECURITY:
 *  - `userId` is derived server-side from the authenticated identity (falling back to
 *    "anonymous"). The client-supplied value is ignored — never trust it for
 *    attribution, or an attacker can frame another user.
 *  - `url` is validated to an http(s) scheme before storage. It is later rendered as a
 *    clickable link in the admin UI, so a `javascript:` (or other) scheme would be a
 *    stored-XSS vector against an admin. The FeedbackWidget normally sets this to
 *    window.location.href; we still validate because the mutation is public.
 *
 * Rate limiting should be added before production scale (@convex-dev/rate-limiter);
 * until then, the body length cap is the only spam guard.
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
  handler: async (ctx, { userId: _ignoredUserId, kind, body, url }) => {
    const trimmed = body.trim();
    if (trimmed.length === 0) throw new Error("Feedback body is empty");
    if (trimmed.length > 2000) throw new Error("Feedback too long (2000 char max)");

    // Derive the stored id honestly from the auth identity; anonymous if none.
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject ?? "anonymous";

    // Only allow http(s) URLs — anything else (javascript:, data:, etc.) would be a
    // stored-XSS vector when rendered as a link in the admin UI. Drop non-conforming
    // values entirely rather than rejecting the feedback.
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

/** Allow only absolute http(s) URLs; return undefined for anything else. */
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
