import { describe, expect, it } from "vitest";
import { COURSES } from "./courses";

/**
 * The lesson-completeness contract (v5, all courses): every lesson is a full
 * learning loop — brief → visual → prose → exactly 2 scenario checks.
 * Openers are explanation-first concept briefs (no prediction cards, no
 * application cards). If a lesson is added or edited below this bar, this
 * test fails. Waivers are not supported; if a lesson genuinely can't meet a
 * field, change the contract deliberately.
 */
describe("course lesson completeness", () => {
  it("gives every lesson a well-formed 4-step concept brief", () => {
    for (const course of COURSES) {
      for (const lesson of course.lessons) {
        const brief = lesson.concept;
        expect(
          brief,
          `${course.slug}/${lesson.slug}: every lesson must open with a concept brief`,
        ).toBeDefined();
        if (!brief) continue;
        expect(
          brief.what.length,
          `${course.slug}/${lesson.slug}: brief 'what' missing`,
        ).toBeGreaterThan(10);
        expect(
          brief.why.length,
          `${course.slug}/${lesson.slug}: brief 'why' missing`,
        ).toBeGreaterThan(10);
        expect(
          brief.whenNot.length,
          `${course.slug}/${lesson.slug}: brief 'whenNot' missing`,
        ).toBeGreaterThan(10);
        expect(
          brief.where.length,
          `${course.slug}/${lesson.slug}: brief needs 2-3 real-world applications`,
        ).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it("gives every lesson prose and exactly 2 self-check questions", () => {
    const problems: string[] = [];
    for (const course of COURSES) {
      for (const lesson of course.lessons) {
        const key = `${course.slug}/${lesson.slug}`;
        if ((lesson.prose?.length ?? 0) < 2) problems.push(`${key}: prose < 2 paragraphs`);
        if ((lesson.questions?.length ?? 0) !== 2) {
          problems.push(`${key}: exactly 2 questions required (v5 contract)`);
        }
      }
    }
    expect(problems).toEqual([]);
  });

  it("keeps every question a real-life scenario (not one-line recall)", () => {
    for (const course of COURSES) {
      for (const lesson of course.lessons) {
        for (const question of lesson.questions ?? []) {
          expect(
            question.prompt.length,
            `${course.slug}/${lesson.slug} ${question.id}: prompt should be a scenario (≥ 40 chars), not one-line recall`,
          ).toBeGreaterThanOrEqual(40);
        }
      }
    }
  });

  it("keeps every question answerable and explained", () => {
    for (const course of COURSES) {
      for (const lesson of course.lessons) {
        const questions = [...(lesson.questions ?? [])];
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
