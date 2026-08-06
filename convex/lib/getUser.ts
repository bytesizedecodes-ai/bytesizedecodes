/**
 * THE single auth swap point.
 *
 * All user-scoped data is keyed by the Convex Auth identity subject (OAuth provider).
 * Client-supplied userId is ignored — never trust the client for identity.
 *
 * OAuth name/email/image live on the Convex Auth `users` table (not on JWT claims).
 * Always prefer that row when available for profile UI.
 */

import { getAuthUserId } from "@convex-dev/auth/server";
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

export type IdentityProfile = {
  subject: string;
  name: string | null;
  email: string | null;
  imageUrl: string | null;
};

/** Auth identity fields for profile UI (null fields when missing). */
export async function getIdentityProfile(
  ctx: QueryCtx | MutationCtx,
): Promise<IdentityProfile | null> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity?.subject) return null;

  // Default OAuth user docs hold name/email/image; JWT claims often omit them.
  const authUserId = await getAuthUserId(ctx);
  const authUser = authUserId !== null ? await ctx.db.get(authUserId) : null;

  const nameFromAuth =
    typeof authUser?.name === "string" && authUser.name.trim().length > 0
      ? authUser.name.trim()
      : null;
  const emailFromAuth =
    typeof authUser?.email === "string" && authUser.email.trim().length > 0
      ? authUser.email.trim()
      : null;
  const imageFromAuth =
    typeof authUser?.image === "string" && authUser.image.length > 0
      ? authUser.image
      : null;

  const pictureFromJwt =
    "pictureUrl" in identity && typeof identity.pictureUrl === "string"
      ? identity.pictureUrl
      : "picture" in identity && typeof identity.picture === "string"
        ? identity.picture
        : null;

  return {
    subject: identity.subject,
    name: nameFromAuth ?? (identity.name?.trim() || null),
    email: emailFromAuth ?? (identity.email?.trim() || null),
    imageUrl: imageFromAuth ?? pictureFromJwt,
  };
}

/** Prefer OAuth display name, then email local-part, then a fallback. */
export function displayNameFromIdentity(
  identity: IdentityProfile | null,
  fallback = "You",
): string {
  const name = identity?.name?.trim();
  if (name) return name;
  const emailLocal = identity?.email?.split("@")[0]?.trim();
  if (emailLocal) return emailLocal;
  return fallback;
}
