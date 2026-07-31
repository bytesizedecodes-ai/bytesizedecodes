/**
 * Dev-only identity: a stable per-browser UUID stored in localStorage.
 *
 * This is deliberately the simplest possible identity — no auth, no tokens, just a key
 * that names this browser's progress on the Convex dev database. It is the value the
 * client sends as `userId` to every mutation/query.
 *
 * When Convex Auth arrives this module is deleted entirely; convex/lib/getUser.ts
 * becomes the single source of truth (returning ctx.auth subject). Nothing else in the
 * client changes because every hook already routes the userId through here.
 */

const STORAGE_KEY = "bsd:uid";
/** Returned during SSR before localStorage is available — queries gate on hydration. */
const SSR_SENTINEL = "ssr";

export function getUserId(): string {
  if (typeof window === "undefined") return SSR_SENTINEL;
  let id = window.localStorage.getItem(STORAGE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(STORAGE_KEY, id);
  }
  return id;
}
