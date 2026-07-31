import { describe, expect, it } from "vitest";
import { asDayKey } from "../day";
import { settleOnPractice, settleOnRollover } from "./streak";

const base = {
  currentStreak: 5,
  longestStreak: 10,
  lastPracticeDay: asDayKey("2026-07-25"),
  streakFreezes: 2,
};

describe("streak settlement", () => {
  it("extends on consecutive days", () => {
    const r = settleOnPractice(base, asDayKey("2026-07-26"));
    expect(r.fields.currentStreak).toBe(6);
    expect(r.extended).toBe(true);
    expect(r.freezeSpent).toBe(false);
  });

  it("is a no-op when already practised today", () => {
    const r = settleOnPractice(
      { ...base, lastPracticeDay: asDayKey("2026-07-26") },
      asDayKey("2026-07-26"),
    );
    expect(r.fields.currentStreak).toBe(5);
    expect(r.extended).toBe(false);
  });

  it("spends freezes to bridge a one-day gap", () => {
    // last practised 24th, today 26th → one midnight missed → one freeze
    const r = settleOnPractice(
      { ...base, lastPracticeDay: asDayKey("2026-07-24") },
      asDayKey("2026-07-26"),
    );
    expect(r.fields.currentStreak).toBe(6);
    expect(r.fields.streakFreezes).toBe(1);
    expect(r.freezeSpent).toBe(true);
  });

  it("resets when freezes are insufficient", () => {
    const r = settleOnPractice(
      { ...base, streakFreezes: 0, lastPracticeDay: asDayKey("2026-07-20") },
      asDayKey("2026-07-26"),
    );
    expect(r.fields.currentStreak).toBe(1);
    expect(r.fields.longestStreak).toBe(10);
  });

  it("rollover spends a freeze overnight without extending", () => {
    // last practised 24th, today is 26th, one freeze available
    const r = settleOnRollover(
      { ...base, streakFreezes: 1, lastPracticeDay: asDayKey("2026-07-24") },
      asDayKey("2026-07-26"),
    );
    expect(r.currentStreak).toBe(5);
    expect(r.streakFreezes).toBe(0);
    expect(r.lastPracticeDay).toBe("2026-07-25");
  });
});
