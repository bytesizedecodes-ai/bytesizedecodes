import { describe, expect, it } from "vitest";
import { assembleDailyPlan, nextUnitForTrack } from "./dailyPlan";

describe("daily plan", () => {
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
