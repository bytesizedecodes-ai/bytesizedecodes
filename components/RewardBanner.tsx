"use client";

import type { AttemptResult } from "@/lib/data/types";

export function RewardBanner({
  result,
  capability,
}: {
  result: AttemptResult;
  /** Reward of the self — what the learner can do now. */
  capability?: string | null;
}) {
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
    </div>
  );
}
