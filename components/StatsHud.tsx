"use client";

import type { ReactNode } from "react";
import type { Profile } from "@/lib/data/types";

export function StatsHud({
  profile,
  dueCount,
}: {
  profile: Profile | null | undefined;
  dueCount?: number;
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

  const pct = Math.min(100, Math.round((profile.levelProgress.into / profile.levelProgress.span) * 100));

  return (
    <div className="card grid grid-cols-2 gap-px overflow-hidden bg-ash sm:grid-cols-4">
      <Stat label="Level" value={`Lv ${profile.level}`}>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ash">
          <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-1 text-[11px] text-ink-faint">
          {profile.levelProgress.into} / {profile.levelProgress.span} XP
        </p>
      </Stat>
      <Stat label="XP" value={profile.xpTotal.toLocaleString("en-IN")} />
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
    </div>
  );
}

function Stat({
  label,
  value,
  children,
}: {
  label: string;
  value: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="bg-white p-4">
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
        fill="#c9a961"
      />
      <path
        d="M8 7.2c.9 0 1.6.7 1.6 1.7S8.9 11 8 11s-1.6-.8-1.6-1.9.7-1.9 1.6-1.9z"
        fill="#fff"
        opacity=".55"
      />
    </svg>
  );
}
