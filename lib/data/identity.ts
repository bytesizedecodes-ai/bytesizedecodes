/**
 * Browser identity helpers.
 *
 * Convex Auth owns the real user subject. The local UUID is retained only so we
 * can migrate progress created before auth was enabled.
 */

const STORAGE_KEY = "bsd:uid";
const SSR_SENTINEL = "ssr";

/** Legacy anonymous browser UUID (still sent as a transitional query arg). */
export function getUserId(): string {
  if (typeof window === "undefined") return SSR_SENTINEL;
  let id = window.localStorage.getItem(STORAGE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(STORAGE_KEY, id);
  }
  return id;
}

/** Returns the stored legacy id without creating one. */
export function peekLegacyAnonId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(STORAGE_KEY);
}
