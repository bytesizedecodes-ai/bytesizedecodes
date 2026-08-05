/**
 * Client-side flags for which social identity providers are offered in UI.
 * Secrets live on Convex; these only control whether buttons attempt OAuth.
 *
 * Google: AUTH_GOOGLE_ID + AUTH_GOOGLE_SECRET (Convex) + NEXT_PUBLIC_AUTH_GOOGLE_ENABLED=true
 * GitHub: AUTH_GITHUB_ID + AUTH_GITHUB_SECRET (Convex) + NEXT_PUBLIC_AUTH_GITHUB_ENABLED=true
 */

export function isGoogleAuthEnabled(): boolean {
  return process.env.NEXT_PUBLIC_AUTH_GOOGLE_ENABLED === "true";
}

export function isGitHubAuthEnabled(): boolean {
  return process.env.NEXT_PUBLIC_AUTH_GITHUB_ENABLED === "true";
}

/** Short product copy — provider-agnostic. */
export const SIGN_IN_COPY = {
  modalDefaultTitle: "Sign in to save your progress",
  modalDefaultDescription:
    "Use a social account (Google or GitHub) to start your path, track courses, and return to your daily plan.",
  freeAccountCta: "Sign in free",
  freeAccountModalTitle: "Create a free account",
  freeAccountModalDescription:
    "Sign in with Google or GitHub to save progress, streaks, and your daily plan — no paid plan required.",
} as const;
