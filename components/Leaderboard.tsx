"use client";

import { Trophy } from "lucide-react";
import { useLeaderboard } from "@/lib/data/provider";
import type { LeaderboardRow } from "@/lib/data/types";

/**
 * Top-N leaderboard for the homepage. Reads seeded demo profiles for now; replaced by
 * real users when auth ships. Pattern adapted from CEMVP's podium widget, rendered in
 * the light ink/ash/brand token system.
 */
export function Leaderboard({ limit }: { limit?: number }) {
  const rows = useLeaderboard(limit);

  if (rows === undefined) return <LeaderboardSkeleton />;
  if (rows.length === 0) return null;

  return (
    <section className="card overflow-hidden">
      <header className="flex items-center gap-2 border-b border-ash px-5 py-4">
        <Trophy className="h-5 w-5 text-gold" />
        <h2 className="text-sm font-semibold text-ink">Leaderboard</h2>
        <span className="ml-auto text-[11px] font-medium uppercase tracking-wide text-ink-faint">
          by total XP
        </span>
      </header>
      <ol className="divide-y divide-ash">
        {rows.map((row) => (
          <LeaderboardRowItem key={row.userId} row={row} />
        ))}
      </ol>
    </section>
  );
}

function LeaderboardRowItem({ row }: { row: LeaderboardRow }) {
  const rankColor =
    row.rank === 1
      ? "text-gold"
      : row.rank === 2
        ? "text-ink-faint"
        : row.rank === 3
          ? "text-[#b87333]"
          : "text-ink-faint";
  const highlight = row.rank <= 3 ? "bg-brand-wash/60" : "bg-white";

  return (
    <li className={`flex items-center gap-3 px-5 py-3 ${highlight}`}>
      <span className={`w-8 shrink-0 text-center text-sm font-bold tabular-nums ${rankColor}`}>
        {row.rank}
      </span>
      <Avatar name={row.displayName} rank={row.rank} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink">{row.displayName}</p>
        <p className="text-[11px] text-ink-faint">
          Lv {row.level} · {row.currentStreak} day streak · {row.track}
        </p>
      </div>
      <p className="shrink-0 text-sm font-semibold text-gold tabular-nums">
        {row.xpTotal.toLocaleString("en-IN")}
        <span className="ml-1 text-[11px] font-normal text-ink-faint">xp</span>
      </p>
    </li>
  );
}

/** Initials avatar with a rank-tinted ring. No real avatars in the demo. */
function Avatar({ name, rank }: { name: string; rank: number }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const ring =
    rank === 1
      ? "ring-gold/60"
      : rank === 2
        ? "ring-ink-faint/50"
        : rank === 3
          ? "ring-[#b87333]/50"
          : "ring-ash";
  return (
    <span
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-wash text-xs font-semibold text-brand-deep ring-2 ${ring}`}
    >
      {initials}
    </span>
  );
}

function LeaderboardSkeleton() {
  return (
    <section className="card overflow-hidden">
      <div className="h-[52px] border-b border-ash" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-5 py-3">
          <div className="h-4 w-4 animate-pulse rounded bg-ash/70" />
          <div className="h-9 w-9 animate-pulse rounded-full bg-ash/70" />
          <div className="h-4 flex-1 animate-pulse rounded bg-ash/70" />
        </div>
      ))}
    </section>
  );
}
