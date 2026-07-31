import { describe, expect, it } from "vitest";
import { asDayKey, daysBetween } from "./day";
import { dueQueue, isDue, mastery, newSrsState, review, type SrsGrade } from "./srs";

const TODAY = asDayKey("2026-07-26");

describe("srs", () => {
  it("schedules a new item for tomorrow", () => {
    const s = newSrsState("gen:confusion-matrix:2", "evaluation", TODAY);
    expect(s.ease).toBe(2.5);
    expect(s.intervalDays).toBe(1);
    expect(daysBetween(TODAY, s.dueDay)).toBe(1);
    expect(isDue(s, TODAY)).toBe(false);
  });

  it("resets the interval and records a lapse on 'again'", () => {
    let s = newSrsState("a", "t", TODAY);
    s = review(s, "good", TODAY);
    s = review(s, "good", TODAY);
    expect(s.intervalDays).toBeGreaterThan(3);

    const lapsed = review(s, "again", TODAY);
    expect(lapsed.intervalDays).toBe(1);
    expect(lapsed.lapses).toBe(1);
    expect(lapsed.ease).toBeLessThan(s.ease);
  });

  it("grows intervals monotonically under repeated 'good'", () => {
    let s = newSrsState("a", "t", TODAY);
    const seen: number[] = [];
    for (let i = 0; i < 6; i++) {
      s = review(s, "good", TODAY);
      seen.push(s.intervalDays);
    }
    for (let i = 1; i < seen.length; i++) {
      expect(seen[i]!).toBeGreaterThan(seen[i - 1]!);
    }
  });

  it("keeps ease inside its bounds under any grade sequence", () => {
    const grades: SrsGrade[] = ["again", "hard", "good", "easy"];
    let s = newSrsState("a", "t", TODAY);
    for (let i = 0; i < 200; i++) {
      s = review(s, grades[i % grades.length]!, TODAY);
      expect(s.ease).toBeGreaterThanOrEqual(1.3);
      expect(s.ease).toBeLessThanOrEqual(3.2);
      expect(s.intervalDays).toBeGreaterThanOrEqual(1);
    }
  });

  it("reports mastery of zero before the first review and rising after", () => {
    let s = newSrsState("a", "t", TODAY);
    expect(mastery(s)).toBe(0);

    let previous = 0;
    for (let i = 0; i < 5; i++) {
      s = review(s, "good", TODAY);
      const m = mastery(s);
      expect(m).toBeGreaterThan(previous);
      expect(m).toBeLessThanOrEqual(1);
      previous = m;
    }
  });

  it("caps the daily queue and puts struggling items first", () => {
    const states = Array.from({ length: 40 }, (_, i) => ({
      ...newSrsState(`item-${i}`, "t", TODAY),
      dueDay: TODAY,
      ease: 1.3 + (i % 10) * 0.1,
      reps: 1,
    }));

    const q = dueQueue(states, TODAY, 20);
    expect(q).toHaveLength(20);
    expect(q[0]!.ease).toBeLessThanOrEqual(q[19]!.ease);
  });

  it("excludes items not yet due", () => {
    const due = { ...newSrsState("due", "t", TODAY), dueDay: TODAY };
    const future = newSrsState("future", "t", TODAY);
    const q = dueQueue([due, future], TODAY);
    expect(q.map((s) => s.itemKey)).toEqual(["due"]);
  });
});
