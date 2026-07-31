"use client";

import Link from "next/link";
import { ArrowRight, Brain, CheckCircle2, Clock3, TrendingUp } from "lucide-react";
import { Shell } from "@/components/Shell";
import { StatsHud } from "@/components/StatsHud";
import { LEARNING_UNITS, getUnitsForTrack } from "@/content/catalog";
import { getLearningTrack } from "@/content/tracks";
import {
  useAllByteProgress,
  useCurrentUser,
  useRecentXp,
  useReviewQueue,
  useToday,
  useTopicMastery,
} from "@/lib/data/provider";
import { PageHeader } from "@/components/ui/PageHeader";

const TOPIC_LABELS: Record<string, string> = {
  evaluation: "Choose and compute classification metrics",
  optimisation: "Trace gradient-based optimization",
  "deep-learning": "Match output heads and loss functions",
  "deep-learning-fundamentals": "Reason through tensor shapes",
  "ai-foundations": "Explain the foundations of AI",
  "ml-foundations": "Explain how machine learning learns",
  "layman-foundations": "Recognize learning and adaptation",
  "layman-paradigms": "Choose a learning family",
};

export default function ProgressPage() {
  const today = useToday();
  const profile = useCurrentUser();
  const progress = useAllByteProgress();
  const mastery = useTopicMastery(today);
  const queue = useReviewQueue(today);
  const recent = useRecentXp(7, today);

  if (
    profile === undefined ||
    progress === undefined ||
    mastery === undefined ||
    queue === undefined ||
    recent === undefined
  ) {
    return <ProgressSkeleton />;
  }

  const trackId = profile?.track ?? "beginner";
  const track = getLearningTrack(trackId);
  const pathUnits = getUnitsForTrack(trackId);
  const completedUnits = LEARNING_UNITS.filter(
    (unit) => progress[unit.progressKey]?.status === "completed",
  );
  const pathCompleted = pathUnits.filter(
    (unit) => progress[unit.progressKey]?.status === "completed",
  ).length;
  const pathPct = Math.round((pathCompleted / Math.max(1, pathUnits.length)) * 100);

  return (
    <Shell active="/progress">
      <div className="mx-auto max-w-5xl space-y-8">
        <PageHeader
          eyebrow="Progress"
          title="Proof of what is becoming durable"
          description="Completion shows where you have been. Review intervals show what you can still recall. Both matter."
          aside={
            <Link
              href="/review"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white"
            >
              <Brain className="h-4 w-4" /> {queue.length} due
            </Link>
          }
        />

        <StatsHud profile={profile} dueCount={queue.length} />

        <section className="card p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">{track.shortTitle}</p>
              <h2 className="mt-1 text-xl font-semibold text-ink">{track.title}</h2>
              <p className="mt-1 text-sm text-ink-soft">
                {pathCompleted} of {pathUnits.length} recommended units complete
              </p>
            </div>
            <span className="text-3xl font-semibold tracking-tight text-brand-deep">
              {pathPct}%
            </span>
          </div>
          <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-ash">
            <div className="h-full rounded-full bg-brand" style={{ width: `${pathPct}%` }} />
          </div>
          <Link
            href="/learn"
            className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand-deep hover:underline"
          >
            Continue the path <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </section>

        <div className="grid gap-5 lg:grid-cols-2">
          <section>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-good" />
              <h2 className="text-lg font-semibold text-ink">Capabilities earned</h2>
            </div>
            <p className="mt-1 text-xs text-ink-faint">Based on completed active units.</p>
            <div className="mt-4 space-y-3">
              {completedUnits.length === 0 ? (
                <EmptyCapability />
              ) : (
                completedUnits.slice(-6).map((unit) => (
                  <Link
                    key={unit.id}
                    href={unit.href}
                    className="card-interactive focus-ring flex items-start gap-3 p-4"
                  >
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-good-wash text-good">
                      <CheckCircle2 className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-ink">
                        {unit.capability ?? unit.title}
                      </span>
                      <span className="mt-1 block text-xs text-ink-faint">{unit.title}</span>
                    </span>
                  </Link>
                ))
              )}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-brand-deep" />
              <h2 className="text-lg font-semibold text-ink">Memory strength</h2>
            </div>
            <p className="mt-1 text-xs text-ink-faint">
              Capability statements from spaced review intervals — not lesson clicks.
            </p>
            <div className="mt-4 space-y-3">
              {mastery.length === 0 ? (
                <div className="card p-5 text-sm text-ink-soft">
                  Complete a lesson or drill to begin building a review history.
                </div>
              ) : (
                mastery.map((item) => {
                  const strength =
                    item.mastery >= 0.7
                      ? "Can usually recall under delay"
                      : item.mastery >= 0.35
                        ? "Building durable recall"
                        : "Needs another review soon";
                  return (
                    <div key={item.topic} className="card p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-ink">
                            {TOPIC_LABELS[item.topic] ?? item.topic}
                          </p>
                          <p className="mt-1 text-xs text-ink-faint">
                            {item.itemCount} review {item.itemCount === 1 ? "item" : "items"}
                            {item.dueCount > 0 ? ` · ${item.dueCount} due` : ""}
                          </p>
                        </div>
                        <span className="max-w-[9rem] text-right text-xs font-semibold text-brand-deep">
                          {strength}
                        </span>
                      </div>
                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ash">
                        <div
                          className="h-full rounded-full bg-brand"
                          style={{ width: `${Math.round(item.mastery * 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>

        <section className="card p-5">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-brand-deep" />
            <h2 className="text-sm font-semibold text-ink">Seven-day activity</h2>
          </div>
          <div className="mt-5 flex h-20 items-end gap-2">
            {recent.map((day) => (
              <div key={day.day} className="flex flex-1 flex-col items-center gap-1.5">
                <div
                  className={`w-full rounded-md ${day.practised ? "bg-brand" : "bg-ash"}`}
                  style={{ height: day.xp === 0 ? 5 : Math.min(72, 10 + day.xp / 2) }}
                  title={`${day.day}: ${day.xp} XP`}
                />
                <span className="text-[10px] text-ink-faint">{day.day.slice(8)}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Shell>
  );
}

function EmptyCapability() {
  return (
    <div className="card p-5">
      <Clock3 className="h-5 w-5 text-ink-faint" />
      <p className="mt-3 text-sm font-semibold text-ink">Your first capability is close</p>
      <p className="mt-1 text-xs leading-relaxed text-ink-soft">
        Complete one active foundation unit and its outcome will appear here.
      </p>
      <Link href="/learn" className="mt-3 inline-block text-xs font-semibold text-brand-deep hover:underline">
        Choose a lesson
      </Link>
    </div>
  );
}

function ProgressSkeleton() {
  return (
    <Shell active="/progress">
      <div className="mx-auto max-w-5xl space-y-5">
        <div className="h-20 w-2/3 animate-pulse rounded-xl bg-ash/60" />
        <div className="h-28 animate-pulse rounded-[18px] bg-ash/60" />
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="h-72 animate-pulse rounded-[18px] bg-ash/60" />
          <div className="h-72 animate-pulse rounded-[18px] bg-ash/60" />
        </div>
      </div>
    </Shell>
  );
}
