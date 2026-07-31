import { describe, expect, it } from "vitest";
import { BYTES } from "./index";
import { COURSES, courseLessonKey } from "./courses";
import { resolveAuthoredReview } from "./review";

describe("authored review catalog", () => {
  it("resolves every byte question from its stable review key metadata", () => {
    for (const byte of BYTES) {
      for (const question of byte.questions) {
        const resolved = resolveAuthoredReview({
          kind: "authored",
          source: "byte",
          itemKey: `byte:${byte.slug}:${question.id}`,
          topic: byte.topic,
          slug: byte.slug,
          courseSlug: null,
          lessonSlug: null,
          questionId: question.id,
          ease: 2.5,
          reps: 0,
          lapses: 0,
        });
        expect(resolved?.question.id).toBe(question.id);
      }
    }
  });

  it("resolves every course question", () => {
    for (const course of COURSES) {
      for (const lesson of course.lessons) {
        expect(lesson.questions?.length ?? 0).toBeGreaterThan(0);
        for (const question of lesson.questions ?? []) {
          const resolved = resolveAuthoredReview({
            kind: "authored",
            source: "course",
            itemKey: `${courseLessonKey(course.slug, lesson.slug)}:${question.id}`,
            topic: lesson.topic,
            slug: null,
            courseSlug: course.slug,
            lessonSlug: lesson.slug,
            questionId: question.id,
            ease: 2.5,
            reps: 0,
            lapses: 0,
          });
          expect(resolved?.question.id).toBe(question.id);
        }
      }
    }
  });
});
