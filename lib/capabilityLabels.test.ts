import { describe, expect, it } from "vitest";
import {
  capabilityForGenerator,
  masteryLevelFromScore,
  MASTERY_CHALLENGE_CAP,
} from "./capabilityLabels";

describe("capabilityLabels", () => {
  it("maps scores to Khan-style ladder labels", () => {
    expect(masteryLevelFromScore(0)).toBe("Not started");
    expect(masteryLevelFromScore(0.2)).toBe("Attempted");
    expect(masteryLevelFromScore(0.45)).toBe("Familiar");
    expect(masteryLevelFromScore(0.7)).toBe("Proficient");
    expect(masteryLevelFromScore(0.9)).toBe("Mastered");
  });

  it("resolves drill capabilities", () => {
    expect(capabilityForGenerator("confusion-matrix")).toMatch(/confusion matrix/i);
    expect(capabilityForGenerator("unknown")).toBeNull();
  });

  it("caps mastery challenge sessions", () => {
    expect(MASTERY_CHALLENGE_CAP).toBe(6);
  });
});
