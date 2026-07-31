/**
 * THE single auth swap point.
 *
 * Phase 1 (now): the client sends its localStorage UUID; we trust it. Every mutation
 * and query resolves the user through this function instead of reading args directly,
 * so identity is never sprinkled across the codebase.
 *
 * Phase 2 (Convex Auth): replace the body with
 *   return (await ctx.auth.getUserIdentity())!.subject;
 * and drop the `userId` arg from every caller. Nothing else changes — schema, queries,
 * and mutations stay byte-identical because they all flow through here.
 */

import type { QueryCtx, MutationCtx } from "../_generated/server";

export async function getUserId(
  _ctx: QueryCtx | MutationCtx,
  args: { userId: string },
): Promise<string> {
  return args.userId;
}
