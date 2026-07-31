/**
 * THE single auth swap point.
 *
 * Prefer Convex Auth identity. During transition, authenticated subjects win; if the
 * client still sends a legacy anonymous browser UUID and there is no auth session,
 * that UUID is accepted so existing progress continues to work until anonymous
 * sign-in claims it.
 */

import type { QueryCtx, MutationCtx } from "../_generated/server";

export async function getUserId(
  ctx: QueryCtx | MutationCtx,
  args: { userId?: string },
): Promise<string> {
  const identity = await ctx.auth.getUserIdentity();
  if (identity?.subject) {
    return identity.subject;
  }
  if (args.userId && args.userId !== "ssr") {
    return args.userId;
  }
  throw new Error("Not authenticated");
}
