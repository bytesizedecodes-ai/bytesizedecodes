/**
 * Helpers for post-auth redirects.
 *
 * RequireAuth and AdminGate redirect unauthenticated users to /login?next=<path>,
 * but the login flow used to ignore that and always send users to /profile.
 * These helpers read and sanitize ?next= so users return to the page they were
 * trying to reach. Only same-origin, path-relative destinations are allowed.
 */

/** Returns the sanitized ?next= path, or null if absent/invalid. */
export function readNextParam(): string | null {
  if (typeof window === "undefined") return null;
  const raw = new URLSearchParams(window.location.search).get("next");
  if (!raw) return null;
  try {
    const url = new URL(raw, window.location.origin);
    if (url.origin === window.location.origin && url.pathname.startsWith("/")) {
      return url.pathname + url.search;
    }
  } catch {
    // not a URL — fall through
  }
  return null;
}

/** Returns the ?next= path when valid, otherwise the supplied fallback. */
export function nextRedirect(fallback = "/onboarding"): string {
  return readNextParam() ?? fallback;
}
