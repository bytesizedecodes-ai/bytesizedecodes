"use client";

import type { AttemptResult } from "@/lib/data/types";

export function RewardBanner({ result }: { result: AttemptResult }) {
  return (
    <div
      className={`animate-pop rounded-xl border px-4 py-3 ${
        result.critical
          ? "border-gold/40 bg-[#fbf6ea]"
          : "border-good/30 bg-good-wash"
      }`}
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        {result.xpAwarded > 0 && (
          <p className="text-sm font-semibold text-ink">
            {result.critical ? "Critical! " : ""}+{result.xpAwarded} XP
          </p>
        )}
        {result.leveledUp && (
          <p className="text-sm font-semibold text-brand-deep">Level {result.level}!</p>
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
