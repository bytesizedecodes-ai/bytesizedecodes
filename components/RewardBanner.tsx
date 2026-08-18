"use client";

import Link from "next/link";
import { useState } from "react";
import { CelebrationModal } from "@/components/CelebrationModal";
import type { AttemptResult } from "@/lib/data/types";

const STREAK_MILESTONES = new Set([7, 14, 30, 60, 100, 365]);

export function RewardBanner({
  result,
  capability,
  next,
}: {
  result: AttemptResult;
  /** Reward of the self — what the learner can do now. */
  capability?: string | null;
  /** Where momentum should carry the learner next. */
  next?: { href: string; title: string; label?: string };
}) {
  const [modalDismissed, setModalDismissed] = useState(false);
  const celebrate =
    result.leveledUp ||
    (result.streakExtended && STREAK_MILESTONES.has(result.currentStreak));
  return (
    <div
      className={`animate-pop rounded-xl border px-4 py-3 ${
        result.leveledUp
          ? "border-brand/40 bg-brand-wash"
          : result.critical
            ? "border-gold/40 bg-warm-wash"
            : "border-good/30 bg-good-wash"
      }`}
    >
      {result.leveledUp && (
        <p className="text-sm font-bold text-brand-deep">Level {result.level} unlocked</p>
      )}
      {capability && (
        <p className={`${result.leveledUp ? "mt-1" : ""} text-sm font-semibold leading-snug text-ink`}>
          {capability}
        </p>
      )}
      <div className={`${capability || result.leveledUp ? "mt-1.5" : ""} flex flex-wrap items-center gap-x-4 gap-y-1`}>
        {result.xpAwarded > 0 && (
          <p className="text-sm font-semibold text-ink">
            {result.critical ? "Critical! " : ""}+{result.xpAwarded} Energy
          </p>
        )}
        {result.streakExtended && (
          <p className="text-sm text-ink-soft">Streak → {result.currentStreak}</p>
        )}
        {result.freezeEarned && (
          <p className="text-sm text-ink-soft">Streak freeze earned</p>
        )}
        {result.nextReview && (
          <p className="text-sm text-ink-faint">Back {result.nextReview}</p>
        )}
      </div>
      {next && (
        <Link
          href={next.href}
          className="focus-ring mt-3 flex items-center justify-between gap-3 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-canvas transition-colors hover:bg-brand-deep"
        >
          <span className="min-w-0">
            <span className="block text-[10px] font-bold uppercase tracking-wide text-canvas/70">
              {next.label ?? "Up next"}
            </span>
            <span className="block truncate">{next.title}</span>
          </span>
          <span aria-hidden>→</span>
        </Link>
      )}
      {celebrate && !modalDismissed && (
        <CelebrationModal
          result={result}
          capability={result.leveledUp ? capability : null}
          onClose={() => setModalDismissed(true)}
        />
      )}
    </div>
  );
}
