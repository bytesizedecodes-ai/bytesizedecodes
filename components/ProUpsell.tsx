"use client";

import Link from "next/link";
import { ArrowRight, GraduationCap } from "lucide-react";
import { GitHubIcon } from "@/components/GitHubIcon";

/**
 * Soft Pro pitch — never blocks free lessons, streaks, or Energy.
 * Pro = advanced courses + private GitHub project portal (work / startup / hobby).
 */
export function ProUpsell({
  variant = "card",
  className = "",
}: {
  variant?: "card" | "inline" | "banner";
  className?: string;
}) {
  if (variant === "inline") {
    return (
      <p className={`text-xs leading-relaxed text-ink-faint ${className}`}>
        Ready for more depth?{" "}
        <Link href="/plans" className="font-semibold text-brand-deep hover:underline">
          Pro
        </Link>{" "}
        unlocks advanced courses and our private GitHub portal of AI project kits.
      </p>
    );
  }

  if (variant === "banner") {
    return (
      <div
        className={`rounded-2xl border border-brand-muted bg-brand-wash/40 px-4 py-4 sm:px-5 ${className}`}
      >
        <p className="text-sm font-semibold text-ink">What&apos;s next after free foundations</p>
        <p className="mt-1 text-xs leading-relaxed text-ink-soft">
          Pro packages advanced courses with real project idea kits on GitHub — for work
          workflows, startup MVPs, and hobby builds. Core lessons and Energy stay free.
        </p>
        <Link
          href="/subscribe?intent=pro"
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-deep hover:underline"
        >
          Get notified about Pro <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <section
      className={`card border-brand-muted/60 bg-brand-wash/25 p-5 sm:p-6 ${className}`}
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand">Pro · coming soon</p>
      <h2 className="mt-2 text-lg font-semibold tracking-tight text-ink">
        Advanced courses + shippable project kits
      </h2>
      <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
        <li className="flex gap-2.5">
          <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-brand-deep" aria-hidden />
          <span>
            <span className="font-semibold text-ink">Advanced courses</span> — deeper paid
            curriculum beyond free foundations.
          </span>
        </li>
        <li className="flex gap-2.5">
          <GitHubIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-deep" />
          <span>
            <span className="font-semibold text-ink">Private GitHub portal</span> — AI ideas and
            starter code for work, startup, and hobby projects.
          </span>
        </li>
      </ul>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href="/subscribe?intent=pro"
          className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-canvas hover:opacity-90"
        >
          Notify me
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/plans"
          className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-ash px-4 py-2 text-sm font-semibold text-ink hover:bg-ash/40"
        >
          Compare plans
        </Link>
      </div>
    </section>
  );
}
