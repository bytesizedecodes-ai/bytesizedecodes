"use client";

import { useEffect, useState } from "react";
import type { AttemptResult } from "@/lib/data/types";

const STREAK_MILESTONES = new Set([7, 14, 30, 60, 100, 365]);

/**
 * A celebratory overlay for the moments that deserve more than a banner line:
 * level-ups and streak milestones. Rendered by RewardBanner when the result
 * carries one. Plain CSS motion (animate-pop) so the global reduced-motion
 * guard collapses it cleanly; dismiss via ×, backdrop, or Escape.
 */
export function CelebrationModal({
  result,
  capability,
  onClose,
}: {
  result: AttemptResult;
  capability?: string | null;
  onClose?: () => void;
}) {
  const [open, setOpen] = useState(true);

  function dismiss() {
    setOpen(false);
    onClose?.();
  }

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") dismiss();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  const streakMilestone =
    result.streakExtended && STREAK_MILESTONES.has(result.currentStreak)
      ? result.currentStreak
      : null;
  const title = result.leveledUp ? `Level ${result.level} unlocked` : `${streakMilestone}-day streak`;
  const emblem = result.leveledUp ? result.level : `${streakMilestone}🔥`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/45 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={dismiss}
    >
      <div
        className="animate-pop relative w-full max-w-sm rounded-3xl border border-brand/40 bg-surface-elevated px-6 py-8 text-center shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Dismiss"
          onClick={dismiss}
          className="focus-ring absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-ink-faint hover:text-ink"
        >
          ×
        </button>

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-wash text-2xl font-bold text-brand-deep ring-1 ring-brand-muted">
          {emblem}
        </div>
        <h2 className="mt-4 text-xl font-bold tracking-tight text-ink">{title}</h2>

        {result.leveledUp ? (
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Consistency compounds — every check you answer feeds this.
          </p>
        ) : (
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            {result.freezeEarned
              ? `Day ${streakMilestone}, and a streak freeze banked for a missed day. Showing up is the whole trick.`
              : `Day ${streakMilestone} of showing up. That's the whole trick.`}
          </p>
        )}

        {capability && (
          <p className="mt-3 rounded-xl border border-brand-muted bg-brand-wash px-3 py-2 text-sm font-semibold text-ink">
            {capability}
          </p>
        )}

        {result.xpAwarded > 0 && (
          <p className="mt-3 text-sm font-semibold text-brand-deep">
            {result.critical ? "Critical! " : ""}+{result.xpAwarded} Energy
          </p>
        )}

        <button
          type="button"
          onClick={dismiss}
          className="focus-ring mt-5 w-full rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-canvas transition-colors hover:bg-brand-deep"
        >
          Keep going
        </button>
      </div>
    </div>
  );
}
