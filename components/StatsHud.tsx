"use client";

import type { ReactNode } from "react";
import type { Profile } from "@/lib/data/types";

export function StatsHud({
  profile,
  dueCount,
  weeklyMinutesDone,
}: {
  profile: Profile | null | undefined;
  dueCount?: number;
  /** Estimated minutes practised this IST week (from Today). */
  weeklyMinutesDone?: number;
}) {
  if (profile === undefined) {
    return (
      <div className="card grid grid-cols-2 gap-3 p-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-14 animate-pulse rounded-lg bg-ash/60" />
        ))}
      </div>
    );
  }
  if (profile === null) return null;

  const pct = Math.min(
    100,
    Math.round((profile.levelProgress.into / profile.levelProgress.span) * 100),
  );
  const weeklyGoal = profile.weeklyMinutes ?? null;
  const weeklyDone = weeklyMinutesDone ?? 0;
  const weeklyPct =
    weeklyGoal && weeklyGoal > 0
      ? Math.min(100, Math.round((weeklyDone / weeklyGoal) * 100))
      : null;

  return (
    <div className="card grid grid-cols-2 gap-px overflow-hidden bg-ash sm:grid-cols-4 lg:grid-cols-5">
      <Stat label="Level" value={`Lv ${profile.level}`}>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ash">
          <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-1 text-[11px] text-ink-faint">
          {profile.levelProgress.into} / {profile.levelProgress.span} Energy
        </p>
      </Stat>
      <Stat label="Energy" value={profile.xpTotal.toLocaleString("en-IN")} />
      <Stat
        label="Streak"
        value={
          <span className="inline-flex items-center gap-1.5">
            <Flame />
            {profile.currentStreak}
            {profile.streakFreezes > 0 && (
              <span className="rounded-full bg-brand-wash px-1.5 text-[11px] font-medium text-brand-deep">
                {profile.streakFreezes}❄
              </span>
            )}
          </span>
        }
      />
      <Stat
        label="Due today"
        value={dueCount === undefined ? "—" : String(dueCount)}
      />
      {weeklyGoal !== null && (
        <Stat
          label="This week"
          value={`${weeklyDone}/${weeklyGoal}`}
          className="col-span-2 sm:col-span-4 lg:col-span-1"
        >
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ash">
            <div
              className="h-full rounded-full bg-brand"
              style={{ width: `${weeklyPct ?? 0}%` }}
            />
          </div>
          <p className="mt-1 text-[11px] text-ink-faint">min goal</p>
        </Stat>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  children,
  className = "",
}: {
  label: string;
  value: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-surface-elevated p-4 ${className}`}>
      <p className="text-[11px] font-medium uppercase tracking-wide text-ink-faint">{label}</p>
      <div className="mt-1 text-2xl font-semibold tracking-tight text-ink">{value}</div>
      {children}
    </div>
  );
}

function Flame() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M8 1.5s3 3 3 6.2c0 1.9-1.3 3.3-3 3.3S5 9.6 5 7.7C5 5.5 8 1.5 8 1.5z"
        fill="var(--color-gold)"
      />
      <path
        d="M8 7.2c.9 0 1.6.7 1.6 1.7S8.9 11 8 11s-1.6-.8-1.6-1.9.7-1.9 1.6-1.9z"
        fill="var(--color-canvas)"
        opacity=".55"
      />
    </svg>
  );
}
