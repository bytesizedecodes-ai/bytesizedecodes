"use client";

/**
 * Khan-style lesson map: one square per lesson with status color + hover title.
 */

import Link from "next/link";
import type { Course } from "@/content/courses";
import { courseLessonKey } from "@/content/courses";
import { useAllByteProgress } from "@/lib/data/provider";

export function CourseSkillMap({ course }: { course: Course }) {
  const progress = useAllByteProgress();

  if (progress === undefined) {
    return (
      <div className="mt-8 flex flex-wrap gap-2">
        {course.lessons.map((lesson) => (
          <div key={lesson.slug} className="h-9 w-9 animate-pulse rounded-lg bg-ash/60" />
        ))}
      </div>
    );
  }

  const completed = course.lessons.filter(
    (l) => progress[courseLessonKey(course.slug, l.slug)]?.status === "completed",
  ).length;

  return (
    <section className="mt-8" aria-label="Lesson progress map">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-ink">Skill map</h2>
          <p className="mt-0.5 text-xs text-ink-faint">
            {completed} of {course.lessons.length} lessons complete · click a square to jump
          </p>
        </div>
        <ul className="flex flex-wrap items-center gap-3 text-[10px] font-medium uppercase tracking-wide text-ink-faint">
          <Legend swatch="bg-ash border border-ash" label="Not started" />
          <Legend swatch="bg-warm-wash border border-warm" label="In progress" />
          <Legend swatch="bg-good border border-good" label="Done" />
        </ul>
      </div>
      <ol className="mt-4 flex flex-wrap gap-2">
        {course.lessons.map((lesson, index) => {
          const key = courseLessonKey(course.slug, lesson.slug);
          const status = progress[key]?.status ?? "unseen";
          const squareClass =
            status === "completed"
              ? "border-good bg-good text-canvas"
              : status === "started"
                ? "border-warm bg-warm-wash text-ink"
                : "border-ash bg-surface-elevated text-ink-faint hover:border-brand-muted";
          return (
            <li key={lesson.slug}>
              <Link
                href={`/courses/${course.slug}/${lesson.slug}`}
                title={`${index + 1}. ${lesson.title}${lesson.capability ? ` — ${lesson.capability}` : ""}`}
                className={`focus-ring flex h-9 w-9 items-center justify-center rounded-lg border text-xs font-bold transition ${squareClass}`}
              >
                {status === "completed" ? "✓" : index + 1}
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <li className="inline-flex items-center gap-1.5">
      <span className={`inline-block h-2.5 w-2.5 rounded-sm ${swatch}`} />
      {label}
    </li>
  );
}
