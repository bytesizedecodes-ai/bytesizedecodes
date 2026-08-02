"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, Sparkles } from "lucide-react";
import type { Course, CourseLevel } from "@/content/courses";
import { courseLessonKey } from "@/content/courses";
import { getUnitsForTrack } from "@/content/catalog";
import { useAllByteProgress, useCurrentUser } from "@/lib/data/provider";
import type { BadgeTone } from "@/components/ui/Badge";
import { Badge } from "@/components/ui/Badge";
import { CardSkeleton } from "./CardSkeleton";

/** Color per skill level — beginner is approachable (green), expert is intense (warm). */
const LEVEL_TONE: Record<CourseLevel, BadgeTone> = {
  beginner: "good",
  intermediate: "brand",
  expert: "warm",
};

/**
 * One course in the `/courses` index. Reads live progress and the user's track
 * (the same data `/learn` uses) to show completion, a Start/Continue CTA, and a
 * "Matches your path" badge when the course is in the user's recommended track.
 */
export function CourseCard({ course }: { course: Course }) {
  const profile = useCurrentUser();
  const progress = useAllByteProgress();

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

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="card-interactive focus-ring group flex flex-col p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {inPath ? (
            <Badge tone="warm">
              <Sparkles className="mr-1 h-3 w-3" />
              Matches your path
            </Badge>
          ) : null}
          <Badge tone={LEVEL_TONE[course.level]} className="capitalize">{course.level}</Badge>
        </div>
        {completed === total && total > 0 ? (
          <CheckCircle2 className="h-5 w-5 shrink-0 text-good" />
        ) : null}
      </div>

      <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
        {course.domain}
      </p>
      <h2 className="mt-1 text-lg font-semibold tracking-tight text-ink">
        {course.title}
      </h2>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{course.subtitle}</p>

      <div className="mt-4 flex items-center gap-3 text-xs text-ink-faint">
        <span>{total} lessons</span>
        <span>·</span>
        <Clock3 className="h-3.5 w-3.5" />
        <span>~{minutes} min</span>
      </div>

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

      <div className="mt-5 flex items-center gap-1 text-sm font-semibold text-brand-deep">
        {completed === total && total > 0
          ? "Review course"
          : started || completed > 0
            ? "Continue"
            : "Start course"}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
