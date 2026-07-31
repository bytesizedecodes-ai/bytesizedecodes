"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCurrentUser } from "@/lib/data/provider";

/**
 * Hard-gates the learning loop until anonymous onboarding is finished.
 * Homepage, onboarding, login, and profile remain reachable without it.
 */
export function RequireOnboarding({ children }: { children: React.ReactNode }) {
  const profile = useCurrentUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (profile === undefined) return;
    if (profile?.onboardingCompletedAt) return;
    const next = encodeURIComponent(pathname || "/today");
    router.replace(`/onboarding?next=${next}`);
  }, [profile, pathname, router]);

  if (profile === undefined) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 py-10">
        <div className="h-8 w-56 animate-pulse rounded bg-ash" />
        <div className="h-40 animate-pulse rounded-2xl bg-ash/70" />
      </div>
    );
  }

  if (!profile?.onboardingCompletedAt) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 py-10">
        <div className="h-8 w-56 animate-pulse rounded bg-ash" />
        <div className="h-40 animate-pulse rounded-2xl bg-ash/70" />
      </div>
    );
  }

  return children;
}
