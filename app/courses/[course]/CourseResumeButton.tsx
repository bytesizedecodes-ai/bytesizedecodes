"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import { courseLessonKey, type Course } from "@/content/courses";
import { useAllByteProgress } from "@/lib/data/provider";
import { ButtonLink } from "@/components/ui/Button";

export function CourseResumeButton({ course }: { course: Course }) {
  const progress = useAllByteProgress();
  if (progress === undefined) {
    return (
      <span className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-ash px-5 py-2.5 text-sm text-ink-faint">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading progress
      </span>
    );
  }

  const next =
    course.lessons.find(
      (lesson) =>
        progress[courseLessonKey(course.slug, lesson.slug)]?.status === "started",
    ) ??
    course.lessons.find(
      (lesson) =>
        progress[courseLessonKey(course.slug, lesson.slug)]?.status !== "completed",
    ) ??
    course.lessons[0];

  if (!next) return null;
  const completed = course.lessons.filter(
    (lesson) =>
      progress[courseLessonKey(course.slug, lesson.slug)]?.status === "completed",
  ).length;
  const allDone = completed === course.lessons.length;

  return (
    <div>
      <ButtonLink href={`/courses/${course.slug}/${next.slug}`} variant={allDone ? "secondary" : "primary"}>
        {allDone ? "Review the course" : completed > 0 ? "Continue course" : "Start course"}
        <ArrowRight className="h-4 w-4" />
      </ButtonLink>
      <p className="mt-2 text-xs text-ink-faint">
        {completed} of {course.lessons.length} lessons complete
      </p>
    </div>
  );
}
