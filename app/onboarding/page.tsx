"use client";

/**
 * Onboarding requires a signed-in session. Guests redirect to
 * /login?next=/onboarding.
 */

import Link from "next/link";
import { Suspense, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { OnboardingForm } from "./OnboardingForm";
import { BrandMark } from "@/components/BrandMark";
import { useAuthState } from "@/lib/data/provider";

export default function OnboardingPage() {
  return (
    <main className="min-h-dvh bg-canvas px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="focus-ring inline-flex items-center gap-2 rounded-lg font-semibold tracking-tight">
          <BrandMark />
          ByteSizeDecodes
        </Link>
        <header className="mt-10 max-w-2xl sm:mt-14">
          <p className="eyebrow">Your learning path</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-5xl">
            Start where you are.
            <span className="block text-brand-deep">Learn toward what matters.</span>
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-ink-soft sm:text-base">
            Three quick choices shape your daily plan. Free courses stay open —
            this just personalises your path and progress.
          </p>
        </header>
        <div className="card mt-8 p-5 sm:mt-10 sm:p-8">
          <RequireSignedInSuspense>
            <Suspense fallback={<OnboardingSkeleton />}>
              <OnboardingForm />
            </Suspense>
          </RequireSignedInSuspense>
        </div>
      </div>
    </main>
  );
}

function RequireSignedInSuspense({ children }: { children: ReactNode }) {
  const { status } = useAuthState();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthed") {
      router.replace(`/login?next=${encodeURIComponent("/onboarding")}`);
    }
  }, [status, router]);

  if (status === "loading") {
    return <OnboardingSkeleton />;
  }
  if (status === "unauthed") {
    return (
      <p className="text-sm text-ink-soft">Redirecting to sign-in…</p>
    );
  }
  return <>{children}</>;
}

function OnboardingSkeleton() {
  return (
    <div className="space-y-8">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index}>
          <div className="h-5 w-52 animate-pulse rounded bg-ash" />
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((__, card) => (
              <div key={card} className="h-28 animate-pulse rounded-2xl bg-ash/60" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
