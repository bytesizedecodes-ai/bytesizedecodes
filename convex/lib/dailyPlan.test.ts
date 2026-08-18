import { describe, expect, it } from "vitest";
import { COURSES } from "../../content/courses";
import { TRACK_UNITS, assembleDailyPlan, nextUnitForTrack } from "./dailyPlan";

describe("daily plan", () => {
  it("covers every course lesson in at least one track", () => {
    const tracked = new Set(
      Object.values(TRACK_UNITS).flatMap((units) =>
        units
          .filter((u) => u.progressKey.startsWith("course:"))
          .map((u) => u.progressKey),
      ),
    );
    const missing = COURSES.flatMap((course) =>
      course.lessons
        .filter((lesson) => !tracked.has(`course:${course.slug}:${lesson.slug}`))
        .map((lesson) => `${course.slug}/${lesson.slug}`),
    );
    expect(missing).toEqual([]);
  });

  it("keeps unit minutes in every track aligned with the course registry", () => {
    const byKey = new Map(
      Object.values(TRACK_UNITS)
        .flat()
        .map((u) => [u.progressKey, u.minutes] as const),
    );
    for (const course of COURSES) {
      for (const lesson of course.lessons) {
        const key = `course:${course.slug}:${lesson.slug}`;
        expect(byKey.get(key)).toBe(lesson.minutes ?? 5);
      }
    }
  });

  it("prioritizes review, weak practice, then the next unit", () => {
    const nextUnit = nextUnitForTrack("grad", {});
    const plan = assembleDailyPlan({
      track: "grad",
      timeMode: "standard",
      dueCount: 3,
      weakTopic: "evaluation",
      nextUnit,
    });

    expect(plan.steps.map((step) => step.kind)).toEqual(["review", "drill", "unit"]);
    expect(plan.estimatedMinutes).toBeLessThanOrEqual(12);
  });

  it("keeps quick mode to one highest-priority action", () => {
    const plan = assembleDailyPlan({
      track: "beginner",
      timeMode: "quick",
      dueCount: 4,
      weakTopic: "evaluation",
      nextUnit: nextUnitForTrack("beginner", {}),
    });

    expect(plan.steps).toHaveLength(1);
    expect(plan.steps[0]?.kind).toBe("review");
    expect(plan.estimatedMinutes).toBe(3);
  });

  it("resumes a started unit before an unseen unit", () => {
    const next = nextUnitForTrack("beginner", {
      "course:machine-learning-for-layman:humans-vs-machines": "started",
    });

    expect(next?.progressKey).toBe(
      "course:machine-learning-for-layman:humans-vs-machines",
    );
  });
});
