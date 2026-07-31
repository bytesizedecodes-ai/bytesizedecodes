import { describe, expect, it } from "vitest";
import { parseReviewKey } from "./reviewKey";

describe("parseReviewKey", () => {
  it("parses generator cards", () => {
    expect(parseReviewKey("gen:confusion-matrix:2")).toEqual({
      kind: "generator",
      generatorId: "confusion-matrix",
      difficulty: 2,
    });
  });

  it("parses byte and course authored cards", () => {
    expect(parseReviewKey("byte:gradient-descent:q1")).toEqual({
      kind: "authored",
      source: "byte",
      slug: "gradient-descent",
      questionId: "q1",
    });
    expect(
      parseReviewKey("course:machine-learning:what-is-machine-learning:q2"),
    ).toEqual({
      kind: "authored",
      source: "course",
      courseSlug: "machine-learning",
      lessonSlug: "what-is-machine-learning",
      questionId: "q2",
    });
  });

  it("rejects unknown and malformed keys", () => {
    expect(parseReviewKey("other:key")).toBeNull();
    expect(parseReviewKey("gen:missing:9")).toBeNull();
  });
});
