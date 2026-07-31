import { BYTES } from "./index";
import { COURSES, courseLessonKey } from "./courses";
import type { SkillId } from "./types";
import type { Track } from "@/lib/data/types";

export interface LearningUnitSummary {
  id: string;
  kind: "visual" | "technical";
  title: string;
  description: string;
  href: string;
  progressKey: string;
  minutes: number;
  skillIds: readonly SkillId[];
  capability?: string;
  courseSlug?: string;
  courseTitle?: string;
  trackPriority: readonly Track[];
}

const courseUnits: LearningUnitSummary[] = COURSES.flatMap((course) =>
  course.lessons.map((lesson) => ({
    id: `course:${course.slug}:${lesson.slug}`,
    kind: "visual" as const,
    title: lesson.title,
    description: lesson.blurb,
    href: `/courses/${course.slug}/${lesson.slug}`,
    progressKey: courseLessonKey(course.slug, lesson.slug),
    minutes: lesson.minutes ?? 5,
    skillIds: lesson.skillIds ?? [],
    capability: lesson.capability,
    courseSlug: course.slug,
    courseTitle: course.title,
    trackPriority:
      course.slug === "machine-learning-for-layman"
        ? (["beginner", "founder"] as const)
        : (["grad", "engineer", "founder", "beginner"] as const),
  })),
);

const byteUnits: LearningUnitSummary[] = BYTES.map((byte) => ({
  id: `byte:${byte.slug}`,
  kind: "technical" as const,
  title: byte.title,
  description: byte.subtitle,
  href: `/bytes/${byte.slug}`,
  progressKey: byte.slug,
  minutes: byte.minutes,
  skillIds: byte.skillIds ?? [],
  capability: byte.capability,
  trackPriority: ["grad", "engineer", "founder"] as const,
}));

export const LEARNING_UNITS: readonly LearningUnitSummary[] = [
  ...courseUnits,
  ...byteUnits,
];

export function getUnitsForTrack(track: Track): LearningUnitSummary[] {
  return LEARNING_UNITS.filter((unit) => unit.trackPriority.includes(track)).sort(
    (a, b) => a.trackPriority.indexOf(track) - b.trackPriority.indexOf(track),
  );
}

export function getNextUnit(
  track: Track,
  progress: Record<string, { status: "unseen" | "started" | "completed" }>,
): LearningUnitSummary | undefined {
  const units = getUnitsForTrack(track);
  return (
    units.find((unit) => progress[unit.progressKey]?.status === "started") ??
    units.find((unit) => progress[unit.progressKey]?.status !== "completed")
  );
}

export function getUnitByProgressKey(progressKey: string): LearningUnitSummary | undefined {
  return LEARNING_UNITS.find((unit) => unit.progressKey === progressKey);
}
