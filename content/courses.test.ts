import { describe, expect, it } from "vitest";
import { COURSES } from "./courses";

/**
 * The lesson-completeness contract: every course lesson is a full learning
 * loop — predict → visual → prose → checks → transfer. If a lesson is added
 * or edited below this bar, this test fails. Waivers are not supported; if a
 * lesson genuinely can't meet a field, change the contract deliberately.
 */
describe("course lesson completeness", () => {
  it("gives every lesson a prediction, prose, checks, and an application", () => {
    const incomplete = COURSES.flatMap((course) =>
      course.lessons
        .filter(
          (lesson) =>
            !lesson.prediction ||
            (lesson.prose?.length ?? 0) < 2 ||
            (lesson.questions?.length ?? 0) < 2 ||
            !lesson.application,
        )
        .map((lesson) => `${course.slug}/${lesson.slug}`),
    );
    expect(incomplete).toEqual([]);
  });

  it("keeps every question answerable and explained", () => {
    for (const course of COURSES) {
      for (const lesson of course.lessons) {
        const questions = [lesson.prediction, ...(lesson.questions ?? [])].filter(
          (q): q is NonNullable<typeof q> => Boolean(q),
        );
        const ids = new Set<string>();
        for (const question of questions) {
          expect(
            question.choices.some((choice) => choice.id === question.answer),
            `${course.slug}/${lesson.slug} ${question.id}: answer must be one of the choices`,
          ).toBe(true);
          expect(question.choices.length).toBeGreaterThanOrEqual(3);
          expect(
            (question.explanation ?? "").length,
            `${course.slug}/${lesson.slug} ${question.id}: explanation missing`,
          ).toBeGreaterThan(20);
          ids.add(question.id);
        }
        expect(ids.size).toBe(questions.length);
      }
    }
  });

  it("ships runnable exercises that set ok = True on pass", () => {
    for (const course of COURSES) {
      for (const lesson of course.lessons) {
        if (!lesson.exercise) continue;
        expect(lesson.exercise.starterCode.length).toBeGreaterThan(0);
        expect(lesson.exercise.testCode).toContain("ok = True");
      }
    }
  });

  it("keeps lesson slugs unique within a course and courses unique overall", () => {
    expect(new Set(COURSES.map((c) => c.slug)).size).toBe(COURSES.length);
    for (const course of COURSES) {
      expect(new Set(course.lessons.map((l) => l.slug)).size).toBe(
        course.lessons.length,
      );
    }
  });
});
