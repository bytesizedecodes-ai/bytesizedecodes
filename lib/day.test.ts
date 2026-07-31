import { describe, expect, it } from "vitest";
import { addDays, asDayKey, daysBetween, isDayKey, todayKey } from "./day";

describe("day keys", () => {
  it("accepts YYYY-MM-DD and rejects garbage", () => {
    expect(isDayKey("2026-07-26")).toBe(true);
    expect(isDayKey("2026-7-26")).toBe(false);
    expect(isDayKey("today")).toBe(false);
  });

  it("adds and subtracts days across month boundaries", () => {
    const d = asDayKey("2026-01-31");
    expect(addDays(d, 1)).toBe("2026-02-01");
    expect(addDays(d, -1)).toBe("2026-01-30");
    expect(daysBetween(asDayKey("2026-07-20"), asDayKey("2026-07-26"))).toBe(6);
  });

  it("returns an IST calendar day for a known UTC instant", () => {
    // 2026-07-25 20:00 UTC = 2026-07-26 01:30 IST
    const d = todayKey(new Date("2026-07-25T20:00:00.000Z"));
    expect(d).toBe("2026-07-26");
  });
});
