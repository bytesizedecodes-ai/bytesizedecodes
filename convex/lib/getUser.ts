/**
 * THE single auth swap point.
 *
 * All user-scoped data is keyed by the Convex Auth identity subject (OAuth provider).
 * Client-supplied userId is ignored — never trust the client for identity.
 */

import type { QueryCtx, MutationCtx } from "../_generated/server";

export async function getUserId(
  ctx: QueryCtx | MutationCtx,
  _args?: { userId?: string },
): Promise<string> {
  const identity = await ctx.auth.getUserIdentity();
  if (identity?.subject) {
    return identity.subject;
  }
  throw new Error("Not authenticated");
}

/** Auth identity fields for profile UI (null fields when missing). */
export async function getIdentityProfile(
  ctx: QueryCtx | MutationCtx,
): Promise<{
  subject: string;
  name: string | null;
  email: string | null;
  imageUrl: string | null;
} | null> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity?.subject) return null;
  const picture =
    "pictureUrl" in identity && typeof identity.pictureUrl === "string"
      ? identity.pictureUrl
      : "picture" in identity && typeof identity.picture === "string"
        ? identity.picture
        : null;
  return {
    subject: identity.subject,
    name: identity.name ?? null,
    email: identity.email ?? null,
    imageUrl: picture,
  };
}
