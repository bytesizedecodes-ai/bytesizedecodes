import { describe, expect, it } from "vitest";
import { applyRepeatDiminishing, rollDrillXp } from "./xp";

describe("repeat XP", () => {
  it("keeps the first correct reward intact", () => {
    const roll = rollDrillXp("user", "2026-07-31", "gen:tensor-shape:2");
    expect(applyRepeatDiminishing(roll, false)).toEqual(roll);
  });

  it("reduces repeated same-day practice and removes critical status", () => {
    const roll = { amount: 30, critical: true, reason: "drill_critical" };
    expect(applyRepeatDiminishing(roll, true)).toEqual({
      amount: 6,
      critical: false,
      reason: "practice_repeat",
    });
  });
});
