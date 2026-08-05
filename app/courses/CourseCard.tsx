"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, CheckCircle2, Clock3, Lock, Sparkles } from "lucide-react";
import type { Course, CourseLevel } from "@/content/courses";
import { courseLessonKey } from "@/content/courses";
import { getUnitsForTrack } from "@/content/catalog";
import { useAllByteProgress, useAuthState, useCurrentUser } from "@/lib/data/provider";
import type { BadgeTone } from "@/components/ui/Badge";
import { Badge } from "@/components/ui/Badge";
import { AuthModal } from "@/components/AuthModal";
import { CardSkeleton } from "./CardSkeleton";

/** Color per skill level — beginner is approachable (green), expert is intense (warm). */
const LEVEL_TONE: Record<CourseLevel, BadgeTone> = {
  beginner: "good",
  intermediate: "brand",
  expert: "warm",
};

/**
 * One course in the `/courses` index. Free courses link through;
 * paid courses open a login prompt (checkout later).
 */
export function CourseCard({ course }: { course: Course }) {
  const profile = useCurrentUser();
  const progress = useAllByteProgress();
  const { status } = useAuthState();
  const [authOpen, setAuthOpen] = useState(false);

  if (progress === undefined) return <CardSkeleton />;

  const total = course.lessons.length;
  const completed = course.lessons.filter(
    (lesson) => progress[courseLessonKey(course.slug, lesson.slug)]?.status === "completed",
  ).length;
  const started = course.lessons.some(
    (lesson) => progress[courseLessonKey(course.slug, lesson.slug)]?.status === "started",
  );
  const track = profile?.track ?? "beginner";
  const inPath = getUnitsForTrack(track).some((unit) => unit.courseSlug === course.slug);
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const minutes = course.lessons.reduce((sum, lesson) => sum + (lesson.minutes ?? 5), 0);
  const isPaid = course.access === "paid";
  const needsAuthForPaid = isPaid && status !== "authed";

  const ctaLabel =
    completed === total && total > 0
      ? "Review course"
      : started || completed > 0
        ? "Continue"
        : isPaid
          ? "Sign in to unlock"
          : "Start course";

  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {inPath && status === "authed" ? (
            <Badge tone="warm">
              <Sparkles className="mr-1 h-3 w-3" />
              Matches your path
            </Badge>
          ) : null}
          <Badge tone={course.access === "free" ? "good" : "warm"} className="capitalize">
            {isPaid ? (
              <>
                <Lock className="mr-1 h-3 w-3" />
                Paid
              </>
            ) : (
              "Free"
            )}
          </Badge>
          <Badge tone={LEVEL_TONE[course.level]} className="capitalize">
            {course.level}
          </Badge>
        </div>
        {completed === total && total > 0 ? (
          <CheckCircle2 className="h-5 w-5 shrink-0 text-good" />
        ) : null}
      </div>

      <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
        {course.domain}
      </p>
      <h2 className="mt-1 text-lg font-semibold tracking-tight text-ink">{course.title}</h2>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{course.subtitle}</p>

      <div className="mt-4 flex items-center gap-3 text-xs text-ink-faint">
        <span>{total} lessons</span>
        <span>·</span>
        <Clock3 className="h-3.5 w-3.5" />
        <span>~{minutes} min</span>
      </div>

      {status === "authed" && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-ink-soft">
              {completed === total && total > 0
                ? "Complete"
                : completed > 0
                  ? `${completed} of ${total} done`
                  : "Not started"}
            </span>
            <span className="text-ink-faint">{pct}%</span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ash">
            <div
              className="h-full rounded-full bg-brand-deep transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      <div className="mt-5 flex items-center gap-1 text-sm font-semibold text-brand-deep">
        {ctaLabel}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </div>
    </>
  );

  if (needsAuthForPaid) {
    return (
      <>
        <button
          type="button"
          onClick={() => setAuthOpen(true)}
          className="card-interactive focus-ring group flex flex-col p-5 text-left"
        >
          {body}
        </button>
        <AuthModal
          open={authOpen}
          onClose={() => setAuthOpen(false)}
          title="Sign in to unlock this course"
          description="Paid courses will require an account. Sign in with a social account — checkout comes later."
          redirectTo={`/courses/${course.slug}`}
        />
      </>
    );
  }

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="card-interactive focus-ring group flex flex-col p-5"
    >
      {body}
    </Link>
  );
}
