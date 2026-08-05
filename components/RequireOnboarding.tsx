"use client";

/**
 * Hard-gates the personalised loop until onboarding (post sign-in) is finished.
 * Homepage, login, free courses, and public Learn browse stay reachable.
 */

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCurrentUser } from "@/lib/data/provider";

export function RequireOnboarding({ children }: { children: React.ReactNode }) {
  const profile = useCurrentUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (profile === undefined) return;
    if (profile === null) {
      // Authed but no profile row yet — onboarding creates it on submit.
      // Still send to onboarding so path preferences get set.
      const next = encodeURIComponent(pathname || "/today");
      router.replace(`/onboarding?next=${next}`);
      return;
    }
    if (profile.onboardingCompletedAt) return;
    const next = encodeURIComponent(pathname || "/today");
    router.replace(`/onboarding?next=${next}`);
  }, [profile, router, pathname]);

  if (profile === undefined) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center text-sm text-ink-soft">
        Loading your path…
      </div>
    );
  }

  if (profile === null || !profile.onboardingCompletedAt) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center text-sm text-ink-soft">
        Setting up your path…
      </div>
    );
  }

  return <>{children}</>;
}
