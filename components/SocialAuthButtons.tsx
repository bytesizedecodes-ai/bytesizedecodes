"use client";

/**
 * Social identity buttons for login modal + /login card.
 * Google live when env flags allow; GitHub when enabled, otherwise a clear coming-soon row.
 */

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/Button";
import { GoogleIcon } from "@/components/GoogleIcon";
import { GitHubIcon } from "@/components/GitHubIcon";
import { nextRedirect } from "@/lib/auth";
import { isGitHubAuthEnabled, isGoogleAuthEnabled } from "@/lib/authProviders";

type OAuthProvider = "google" | "github";

export function SocialAuthButtons({
  redirectTo,
  layout = "stack",
}: {
  /** Post-OAuth path; default onboarding via nextRedirect when omitted on /login. */
  redirectTo?: string;
  layout?: "stack" | "stack-compact";
}) {
  const { signIn } = useAuthActions();
  const [busy, setBusy] = useState<OAuthProvider | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const googleOn = isGoogleAuthEnabled();
  const githubOn = isGitHubAuthEnabled();

  function resolveRedirect(): string {
    if (redirectTo) return redirectTo;
    if (typeof window !== "undefined" && window.location.pathname === "/login") {
      return nextRedirect("/onboarding");
    }
    return "/onboarding";
  }

  async function continueWith(provider: OAuthProvider) {
    setBusy(provider);
    setNotice(null);
    try {
      await signIn(provider, { redirectTo: resolveRedirect() });
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : `${provider === "google" ? "Google" : "GitHub"} sign-in failed. Please try again.`,
      );
      setBusy(null);
    }
  }

  const gap = layout === "stack-compact" ? "space-y-2.5" : "space-y-3";

  return (
    <div className={gap}>
      {googleOn ? (
        <Button
          variant="brand"
          className="w-full"
          disabled={busy !== null}
          onClick={() => void continueWith("google")}
        >
          {busy === "google" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <GoogleIcon className="h-4 w-4" />
          )}
          {busy === "google" ? "Redirecting…" : "Continue with Google"}
        </Button>
      ) : (
        <Button
          variant="secondary"
          className="w-full"
          onClick={() =>
            setNotice(
              "Google sign-in is not enabled. Set AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET on Convex and NEXT_PUBLIC_AUTH_GOOGLE_ENABLED=true.",
            )
          }
        >
          <GoogleIcon className="h-4 w-4" />
          Continue with Google
        </Button>
      )}

      {githubOn ? (
        <Button
          variant="secondary"
          className="w-full"
          disabled={busy !== null}
          onClick={() => void continueWith("github")}
        >
          {busy === "github" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <GitHubIcon className="h-4 w-4" />
          )}
          {busy === "github" ? "Redirecting…" : "Continue with GitHub"}
        </Button>
      ) : (
        <Button
          variant="ghost"
          className="w-full border border-dashed border-ash"
          onClick={() =>
            setNotice(
              "GitHub sign-in is prepared but not live yet. Create a GitHub OAuth App, set AUTH_GITHUB_ID / AUTH_GITHUB_SECRET on your Convex deployment, and NEXT_PUBLIC_AUTH_GITHUB_ENABLED=true in .env.local.",
            )
          }
        >
          <GitHubIcon className="h-4 w-4" />
          Continue with GitHub
          <span className="ml-1 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
            Soon
          </span>
        </Button>
      )}

      {notice && (
        <p
          role="status"
          className="rounded-xl bg-brand-wash px-3 py-2.5 text-xs leading-relaxed text-ink-soft"
        >
          {notice}
        </p>
      )}
    </div>
  );
}
