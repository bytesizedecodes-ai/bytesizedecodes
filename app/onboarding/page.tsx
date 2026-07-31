import Link from "next/link";
import { Suspense } from "react";
import { OnboardingForm } from "./OnboardingForm";

export default function OnboardingPage() {
  return (
    <main className="min-h-dvh bg-canvas px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="focus-ring inline-flex items-center gap-2 rounded-lg font-semibold tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-ink text-xs font-bold text-white">
            B
          </span>
          bytesizedecodes
        </Link>
        <header className="mt-10 max-w-2xl sm:mt-14">
          <p className="eyebrow">Your learning path</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-5xl">
            Start where you are.
            <span className="block text-brand-deep">Learn toward what matters.</span>
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-ink-soft sm:text-base">
            Three quick choices shape your daily plan. Nothing here locks content away,
            and you can change direction at any time.
          </p>
        </header>
        <div className="card mt-8 p-5 sm:mt-10 sm:p-8">
          <Suspense fallback={<OnboardingSkeleton />}>
            <OnboardingForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
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
