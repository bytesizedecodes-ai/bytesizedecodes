"use client";

import Link from "next/link";
import { useState } from "react";
import type { Course } from "@/content/courses";
import { courseLessonKey, getCourse, NEXT_COURSE } from "@/content/courses";
import { getSkill } from "@/content/skills";
import { useAllByteProgress } from "@/lib/data/provider";

/**
 * The course-complete moment, shown at the top of the course page once every
 * lesson is done. Summarizes what was earned (capabilities/skills), points at
 * the recommended next course, and offers a share link — the peak-motivation
 * beat that keeps learners moving through the catalogue.
 */
export function CourseCompleteCard({ course }: { course: Course }) {
  const progress = useAllByteProgress();
  const [copied, setCopied] = useState(false);

  if (progress === undefined) return null;
  const allDone = course.lessons.every(
    (lesson) => progress[courseLessonKey(course.slug, lesson.slug)]?.status === "completed",
  );
  if (!allDone) return null;

  const minutes = course.lessons.reduce((sum, l) => sum + (l.minutes ?? 5), 0);
  const skills = [
    ...new Set(course.lessons.flatMap((lesson) => lesson.skillIds ?? [])),
  ].map((id) => getSkill(id));
  const next = NEXT_COURSE[course.slug];

  async function share() {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/courses/${course.slug}`,
      );
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (permissions, non-secure context) — no-op.
    }
  }

  return (
    <section
      aria-label="Course complete"
      className="animate-pop mt-6 overflow-hidden rounded-3xl border border-brand/40 bg-brand-wash px-5 py-6 sm:px-7"
    >
      <div className="flex flex-col gap-1 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-deep">
          Course complete
        </p>
        <h2 className="text-2xl font-bold tracking-tight text-ink">
          🎉 You finished {course.title}
        </h2>
        <p className="text-sm text-ink-soft">
          {course.lessons.length} lessons · ≈{minutes} minutes of deliberate practice.
        </p>
      </div>

      {skills.length > 0 && (
        <div className="mt-5">
          <p className="text-center text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
            Skills you practised
          </p>
          <ul className="mt-2 flex flex-wrap justify-center gap-1.5">
            {skills.map((skill) => (
              <li
                key={skill.id}
                title={skill.description}
                className="rounded-full border border-brand-muted bg-surface-elevated px-2.5 py-1 text-[11px] font-medium text-ink"
              >
                {skill.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 flex flex-col items-center gap-3">
        {next ? (
          <Link
            href={`/courses/${next.slug}`}
            className="focus-ring group flex w-full max-w-md flex-col gap-1 rounded-2xl border border-brand-muted bg-surface-elevated px-4 py-4 text-left shadow-sm transition-colors hover:border-brand"
          >
            <span className="text-[10px] font-bold uppercase tracking-wide text-brand">
              Recommended next
            </span>
            <span className="text-sm font-bold text-ink">
              {getCourse(next.slug)?.title ?? next.slug}
            </span>
            <span className="text-[13px] leading-relaxed text-ink-soft">{next.why}</span>
            <span className="mt-1 text-xs font-semibold text-brand-deep group-hover:underline">
              Start the next course →
            </span>
          </Link>
        ) : (
          <Link
            href="/progress"
            className="focus-ring rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-canvas transition-colors hover:bg-brand-deep"
          >
            See your progress →
          </Link>
        )}
        <button
          type="button"
          onClick={() => void share()}
          className="focus-ring text-xs font-semibold text-brand-deep hover:underline"
        >
          {copied ? "Link copied ✓" : "Copy a link to share this course"}
        </button>
      </div>
    </section>
  );
}
