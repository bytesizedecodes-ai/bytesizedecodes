/**
 * Server-side copy of lib/srs.ts — simplified SM-2, verbatim.
 *
 * Pure functions, no storage deps. The same algorithm grades server-side so a
 * compromised client cannot self-award intervals.
 */

import { addDays, type DayKey } from "./day";

export type SrsGrade = "again" | "hard" | "good" | "easy";

export interface SrsState {
  itemKey: string;
  topic: string;
  /** SM-2 easiness factor. Starts at 2.5, never drops below 1.3. */
  ease: number;
  intervalDays: number;
  dueDay: DayKey;
  reps: number;
  lapses: number;
  lastReviewedDay: DayKey | null;
}

const EASE_START = 2.5;
const EASE_FLOOR = 1.3;
const EASE_CEILING = 3.2;

/** Interval at which an item counts as mastered for the purposes of the topic map. */
const MASTERY_HORIZON_DAYS = 60;

export function newSrsState(itemKey: string, topic: string, today: DayKey): SrsState {
  return {
    itemKey,
    topic,
    ease: EASE_START,
    intervalDays: 1,
    dueDay: addDays(today, 1),
    reps: 0,
    lapses: 0,
    lastReviewedDay: null,
  };
}

const clampEase = (e: number): number =>
  Math.min(EASE_CEILING, Math.max(EASE_FLOOR, Math.round(e * 100) / 100));

export function review(state: SrsState, grade: SrsGrade, today: DayKey): SrsState {
  let { ease, intervalDays } = state;
  let { lapses } = state;

  switch (grade) {
    case "again":
      ease = clampEase(ease - 0.2);
      intervalDays = 1;
      lapses += 1;
      break;
    case "hard":
      ease = clampEase(ease - 0.15);
      intervalDays = Math.max(1, Math.round(intervalDays * 1.2));
      break;
    case "good":
      intervalDays = Math.max(1, Math.round(intervalDays * ease));
      break;
    case "easy":
      ease = clampEase(ease + 0.15);
      intervalDays = Math.max(1, Math.round(intervalDays * ease * 1.3));
      break;
  }

  return {
    ...state,
    ease,
    intervalDays,
    dueDay: addDays(today, intervalDays),
    reps: state.reps + 1,
    lapses,
    lastReviewedDay: today,
  };
}

/**
 * Mastery in [0,1], derived from the scheduling interval rather than from lessons clicked.
 * Log-scaled because the difference between a 1-day and a 7-day interval matters far more
 * than between 40 and 46.
 */
export function mastery(state: SrsState): number {
  if (state.reps === 0) return 0;
  const scaled = Math.log2(1 + state.intervalDays) / Math.log2(1 + MASTERY_HORIZON_DAYS);
  return Math.min(1, Math.max(0, scaled));
}

export function isDue(state: SrsState, today: DayKey): boolean {
  return state.dueDay <= today;
}

/**
 * Due items, hardest first, capped. An unbounded backlog is the single most common reason
 * people abandon a spaced-repetition habit, so the cap is a product decision, not a
 * performance one.
 */
export function dueQueue(states: readonly SrsState[], today: DayKey, cap = 20): SrsState[] {
  return states
    .filter((s) => isDue(s, today))
    .sort((a, b) => {
      if (a.dueDay !== b.dueDay) return a.dueDay < b.dueDay ? -1 : 1;
      return a.ease - b.ease; // struggling items first
    })
    .slice(0, cap);
}

/** Human-readable summary of when an item will next be seen. */
export function describeInterval(days: number): string {
  if (days <= 1) return "tomorrow";
  if (days < 7) return `in ${days} days`;
  if (days < 30) {
    const w = Math.round(days / 7);
    return w === 1 ? "in a week" : `in ${w} weeks`;
  }
  const m = Math.round(days / 30);
  return m === 1 ? "in a month" : `in ${m} months`;
}
