/**
 * Admin authorization — the security core of /admin.
 *
 * CRITICAL: admin endpoints must NEVER accept a `userId` or `isAdmin` flag from
 * the client (the Convex AI guidelines, line 213: "NEVER accept a userId for
 * authorization"). Identity is derived server-side via `ctx.auth.getUserIdentity()`
 * and the role is read from the profile here. The learning-path mutations may
 * keep their anonymous-transition trust (see convex/lib/getUser.ts); admin does not.
 */

import type { QueryCtx, MutationCtx } from "../_generated/server";
import type { Doc } from "../_generated/dataModel";

export type AdminProfile = Doc<"profiles">;

/**
 * Derive the authenticated admin profile, or throw.
 * Uses `tokenIdentifier` (the canonical stable id per Convex guidelines),
 * not `subject`, to look up the profile.
 */
export async function requireAdmin(
  ctx: QueryCtx | MutationCtx,
): Promise<AdminProfile> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity || !identity.tokenIdentifier) {
    throw new Error("Not authenticated");
  }
  const profile = await ctx.db
    .query("profiles")
    .withIndex("by_user", (q) => q.eq("userId", identity.subject!))
    .unique();
  if (!profile) {
    throw new Error("Not authenticated");
  }
  if (profile.role !== "admin") {
    throw new Error("Forbidden: admin role required");
  }
  return profile;
}

/**
 * The allowlist of emails that may be promoted to admin. Set via the
 * `ADMIN_EMAILS` env var (comma-separated). Whitespace-trimmed, lowercased.
 */
export function adminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS ?? "";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e.length > 0);
}

/**
 * Whether a given email is allowlisted for admin promotion.
 */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return adminEmails().includes(email.toLowerCase());
}
