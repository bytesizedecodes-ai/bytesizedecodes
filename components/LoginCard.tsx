"use client";

/**
 * Standalone social sign-in card for /login.
 */

import { SocialAuthButtons } from "@/components/SocialAuthButtons";

export function LoginCard() {
  return (
    <section className="card space-y-5 p-6">
      <div>
        <h2 className="text-lg font-semibold text-ink">Sign in with a social account</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Use Google (or GitHub when enabled) to save your learning path, track course progress, and
          open your daily plan. Free courses remain readable without an account.
        </p>
      </div>
      <SocialAuthButtons />
    </section>
  );
}
