"use client";

import { Activity, Flame, Target, Users } from "lucide-react";
import type { ReactNode } from "react";
import { useUserCounts } from "@/lib/data/provider";

/**
 * Homepage cross-user stat board. Four big-number tiles in a card, mirroring the
 * split-cell grid pattern of StatsHud. Data is global (no userId). `practicingNow`
 * is a real recent-activity count (not fabricated) — see convex/queries.ts getUserCounts.
 */
export function StatsBoard() {
  const counts = useUserCounts();

  if (counts === undefined) return <StatsBoardSkeleton />;

  return (
    <div className="card grid grid-cols-2 gap-px overflow-hidden bg-ash sm:grid-cols-4">
      <Stat
        icon={<Users className="h-4 w-4" />}
        label="Total learners"
        value={counts.totalLearners.toLocaleString("en-IN")}
      />
      <Stat
        icon={<Activity className="h-4 w-4" />}
        label="Practicing now"
        value={String(counts.practicingNow)}
      />
      <Stat
        icon={<Target className="h-4 w-4" />}
        label="Drills answered"
        value={counts.drillsAnswered.toLocaleString("en-IN")}
      />
      <Stat
        icon={<Flame className="h-4 w-4 text-gold" />}
        label="Avg streak"
        value={`${counts.avgStreak}d`}
      />
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-surface-elevated p-4">
      <div className="flex items-center gap-1.5 text-ink-faint">
        {icon}
        <p className="text-[11px] font-medium uppercase tracking-wide">{label}</p>
      </div>
      <p className="mt-1.5 text-2xl font-semibold tracking-tight text-ink tabular-nums">
        {value}
      </p>
    </div>
  );
}

function StatsBoardSkeleton() {
  return (
    <div className="card grid grid-cols-2 gap-px overflow-hidden bg-ash sm:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-surface-elevated p-4">
          <div className="h-3 w-16 animate-pulse rounded bg-ash/70" />
          <div className="mt-2 h-7 w-12 animate-pulse rounded bg-ash/70" />
        </div>
      ))}
    </div>
  );
}
