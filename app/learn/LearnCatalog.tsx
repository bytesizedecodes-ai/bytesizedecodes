"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, BookOpen, Check, Clock3, Sparkles } from "lucide-react";
import { LEARNING_UNITS, getNextUnit, getUnitsForTrack } from "@/content/catalog";
import { getLearningTrack } from "@/content/tracks";
import { useAllByteProgress, useAuthState, useCurrentUser } from "@/lib/data/provider";
import { Badge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { AuthModal } from "@/components/AuthModal";

/**
 * Public Learn catalog. Guests browse free path units; Begin / progress CTAs
 * require a signed-in account (AuthModal → onboarding → today / unit).
 */
export function LearnCatalog() {
  const profile = useCurrentUser();
  const progress = useAllByteProgress();
  const { status, hasProfile } = useAuthState();
  const [authOpen, setAuthOpen] = useState(false);

  // Auth still loading — show light skeleton
  if (status === "loading" || progress === undefined) return <CatalogSkeleton />;

  const track = profile?.track ?? "beginner";
  const trackInfo = getLearningTrack(track);
  const recommendedUnits = getUnitsForTrack(track);
  const next = getNextUnit(track, progress);
  const foundation = recommendedUnits.filter((unit) => unit.kind === "visual");
  const technical = LEARNING_UNITS.filter((unit) => unit.kind === "technical");
  const authed = status === "authed";
  const pct = Math.round(
    (recommendedUnits.filter((unit) => progress[unit.progressKey]?.status === "completed").length /
      Math.max(1, recommendedUnits.length)) *
      100,
  );

  function beginRedirect(): string {
    if (next) return next.href;
    return "/today";
  }

  function onBegin() {
    if (!authed) {
      setAuthOpen(true);
      return;
    }
    if (!hasProfile) {
      window.location.href = `/onboarding?next=${encodeURIComponent(beginRedirect())}`;
      return;
    }
    window.location.href = beginRedirect();
  }

  return (
    <div className="space-y-12">
      <section className="card overflow-hidden">
        <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="p-6 sm:p-8">
            <Badge>{authed ? trackInfo.shortTitle : "Get started"}</Badge>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-ink">
              {authed && next
                ? next.title
                : authed
                  ? "Foundation path complete"
                  : "Choose a path and begin"}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">
              {authed
                ? (next?.description ??
                  "You have completed every current unit in this path. Strengthen it through review and practice.")
                : "Browse free visual foundations and technical practice below. Begin with a free account to save your path, course progress, and daily plan."}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {authed && hasProfile && next ? (
                <ButtonLink href={next.href}>
                  {progress[next.progressKey]?.status === "started"
                    ? "Continue learning"
                    : "Start next lesson"}
                  <ArrowRight className="h-4 w-4" />
                </ButtonLink>
              ) : authed && hasProfile && !next ? (
                <ButtonLink href="/progress">View progress</ButtonLink>
              ) : (
                <Button onClick={onBegin}>
                  Begin learning
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
              {!authed && (
                <ButtonLink href="/courses" variant="secondary">
                  Browse free courses
                </ButtonLink>
              )}
            </div>
          </div>
          <div className="flex min-h-52 items-center justify-center bg-ink p-8 text-canvas">
            <div className="w-full max-w-xs">
              <div className="flex items-center gap-2 text-brand-muted">
                <Sparkles className="h-4 w-4" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em]">
                  {authed ? "Your path" : "Sample path"}
                </p>
              </div>
              <p className="mt-4 text-xl font-semibold">{trackInfo.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-canvas/60">{trackInfo.promise}</p>
              {authed && (
                <div className="mt-6 h-2 overflow-hidden rounded-full bg-surface-elevated/10">
                  <div
                    className="h-full rounded-full bg-warm"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <UnitSection
        title="AI Foundations"
        description="Picture-led concepts followed by one active check. Start here or use them to repair a shaky mental model."
        units={foundation}
        progress={progress}
        showProgress={authed}
      />

      <UnitSection
        title="Technical practice bytes"
        description="Short applied lessons that connect a concept to calculations, code, and generated practice."
        units={technical}
        progress={progress}
        showProgress={authed}
      />

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        title="Sign in to begin"
        description="A free social account saves your profile, path, and course progress so you can pick up tomorrow."
        redirectTo={`/onboarding?next=${encodeURIComponent(beginRedirect())}`}
      />
    </div>
  );
}

function UnitSection({
  title,
  description,
  units,
  progress,
  showProgress,
}: {
  title: string;
  description: string;
  units: readonly (typeof LEARNING_UNITS)[number][];
  progress: Record<string, { status: "unseen" | "started" | "completed" }>;
  showProgress: boolean;
}) {
  return (
    <section>
      <div className="max-w-2xl">
        <h2 className="text-xl font-semibold tracking-tight text-ink">{title}</h2>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{description}</p>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {units.map((unit, index) => {
          const status = progress[unit.progressKey]?.status ?? "unseen";
          return (
            <Link
              key={unit.id}
              href={unit.href}
              className="card-interactive focus-ring group flex gap-4 p-4"
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                  showProgress && status === "completed"
                    ? "bg-good text-canvas"
                    : showProgress && status === "started"
                      ? "bg-brand-deep text-canvas"
                      : "bg-brand-wash text-brand-deep"
                }`}
              >
                {showProgress && status === "completed" ? (
                  <Check className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-ink">{unit.title}</span>
                  {showProgress && status !== "unseen" && (
                    <Badge tone={status === "completed" ? "good" : "neutral"}>
                      {status === "completed" ? "Done" : "In progress"}
                    </Badge>
                  )}
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-ink-soft">
                  {unit.description}
                </span>
                <span className="mt-3 flex items-center gap-1.5 text-xs text-ink-faint">
                  {unit.kind === "visual" ? (
                    <BookOpen className="h-3.5 w-3.5" />
                  ) : (
                    <Sparkles className="h-3.5 w-3.5" />
                  )}
                  {unit.courseTitle ?? "Applied byte"}
                  <span>·</span>
                  <Clock3 className="h-3.5 w-3.5" />
                  ~{unit.minutes ?? 5} min
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function CatalogSkeleton() {
  return (
    <div className="space-y-8">
      <div className="card h-56 animate-pulse" />
      <div className="grid gap-3 md:grid-cols-2">
        <div className="card h-28 animate-pulse" />
        <div className="card h-28 animate-pulse" />
      </div>
    </div>
  );
}
