"use client";

import Link from "next/link";
import { CalendarCheck2 } from "lucide-react";
import { useState } from "react";
import { DailyPlanCard } from "@/components/DailyPlanCard";
import { RequireOnboarding } from "@/components/RequireOnboarding";
import { RequireAuth } from "@/components/RequireAuth";
import { Shell } from "@/components/Shell";
import { StatsHud } from "@/components/StatsHud";
import { TIME_MODES, getLearningTrack } from "@/content/tracks";
import {
  useCurrentUser,
  useDailyPlan,
  useDayProgress,
  useRecentXp,
  useReviewQueue,
  useToday,
} from "@/lib/data/provider";
import type { TimeMode } from "@/lib/data/types";

export default function TodayPage() {
  const today = useToday();
  const profile = useCurrentUser();
  const [modeOverride, setModeOverride] = useState<TimeMode | null>(null);
  const mode = modeOverride ?? profile?.preferredTimeMode ?? "standard";
  const plan = useDailyPlan(today, mode);
  const day = useDayProgress(today);
  const queue = useReviewQueue(today);
  const recent = useRecentXp(7, today);
  const track = getLearningTrack(profile?.track ?? "beginner");

  return (
    <Shell active="/today">
      <RequireAuth>
      <RequireOnboarding>
        <div className="mx-auto max-w-5xl space-y-7">
          <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">{today}</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-4xl">
                {day?.practised ? "Nice work today." : "Make one idea stick."}
              </h1>
              <p className="mt-2 text-sm text-ink-soft">
                {track.shortTitle} · your plan prioritizes memory, weak skills, then progress.
              </p>
            </div>
            <div className="inline-flex self-start rounded-xl border border-ash bg-surface-elevated p-1">
              {TIME_MODES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setModeOverride(item.id)}
                  aria-pressed={mode === item.id}
                  className={`focus-ring rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    mode === item.id ? "bg-ink text-canvas" : "text-ink-soft hover:bg-ash/60"
                  }`}
                >
                  {item.title}
                </button>
              ))}
            </div>
          </header>

          <StatsHud profile={profile} dueCount={queue?.length} />

          {plan ? <DailyPlanCard plan={plan} /> : <PlanSkeleton />}

          <div className="grid gap-4 lg:grid-cols-[1fr_0.75fr]">
            {recent && (
              <div className="card p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-ink">Learning rhythm</h2>
                    <p className="mt-1 text-xs text-ink-faint">Last seven days</p>
                  </div>
                  <Link
                    href="/progress"
                    className="text-xs font-semibold text-brand-deep hover:underline"
                  >
                    Full progress
                  </Link>
                </div>
                <div className="mt-5 flex h-20 items-end gap-2">
                  {recent.map((d) => {
                    const height = d.xp === 0 ? 5 : Math.min(72, 10 + d.xp / 2);
                    return (
                      <div key={d.day} className="flex flex-1 flex-col items-center gap-1.5">
                        <div
                          className={`w-full rounded-md ${d.practised ? "bg-brand" : "bg-ash"}`}
                          style={{ height }}
                          title={`${d.day}: ${d.xp} XP`}
                        />
                        <span className="text-[10px] text-ink-faint">{d.day.slice(8)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="card flex items-start gap-4 p-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-good-wash text-good">
                <CalendarCheck2 className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-sm font-semibold text-ink">
                  {day?.practised ? "Today counts" : "Progress without pressure"}
                </h2>
                <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">
                  {day?.practised
                    ? `${day.itemsCorrect}/${day.itemsAnswered} answers correct · +${day.xpEarned} XP earned.`
                    : "A quick review is enough on a busy day. Missing a day never removes mastery or completed work."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </RequireOnboarding>
      </RequireAuth>
    </Shell>
  );
}

function PlanSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="h-44 animate-pulse bg-ink/90" />
      <div className="space-y-px bg-ash">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-20 animate-pulse bg-surface-elevated" />
        ))}
      </div>
    </div>
  );
}
