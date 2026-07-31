/**
 * Server-side copy of lib/data/streak.ts — pure streak settlement, verbatim.
 *
 * The midnight cron calls settleOnRollover; mutations call settleOnPractice. Both run
 * unchanged from the Phase 0 implementation.
 */

import { addDays, daysBetween, type DayKey } from "./day";

export interface StreakFields {
  currentStreak: number;
  longestStreak: number;
  lastPracticeDay: DayKey | null;
  streakFreezes: number;
}

export interface Settlement {
  fields: StreakFields;
  /** True when today's practice lengthened the streak. */
  extended: boolean;
  /** True when a freeze was spent to bridge a gap. */
  freezeSpent: boolean;
}

/**
 * Apply today's practice against the existing streak state.
 *
 * - Already practised today: no change.
 * - Practised yesterday, or first ever: extend by one.
 * - Gap of N days with enough freezes: spend N-1 freezes, extend by one.
 * - Gap with insufficient freezes: reset to 1.
 */
export function settleOnPractice(prev: StreakFields, today: DayKey): Settlement {
  if (prev.lastPracticeDay === today) {
    return { fields: prev, extended: false, freezeSpent: false };
  }

  if (prev.lastPracticeDay === null) {
    return {
      fields: {
        currentStreak: 1,
        longestStreak: Math.max(1, prev.longestStreak),
        lastPracticeDay: today,
        streakFreezes: prev.streakFreezes,
      },
      extended: true,
      freezeSpent: false,
    };
  }

  const gap = daysBetween(prev.lastPracticeDay, today);
  // gap === 1 is consecutive.
  if (gap === 1) {
    const next = prev.currentStreak + 1;
    return {
      fields: {
        currentStreak: next,
        longestStreak: Math.max(prev.longestStreak, next),
        lastPracticeDay: today,
        streakFreezes: prev.streakFreezes,
      },
      extended: true,
      freezeSpent: false,
    };
  }

  // gap days means gap-1 midnights were missed.
  const freezesNeeded = gap - 1;
  if (freezesNeeded > 0 && prev.streakFreezes >= freezesNeeded) {
    const next = prev.currentStreak + 1;
    return {
      fields: {
        currentStreak: next,
        longestStreak: Math.max(prev.longestStreak, next),
        lastPracticeDay: today,
        streakFreezes: prev.streakFreezes - freezesNeeded,
      },
      extended: true,
      freezeSpent: true,
    };
  }

  return {
    fields: {
      currentStreak: 1,
      longestStreak: prev.longestStreak,
      lastPracticeDay: today,
      streakFreezes: prev.streakFreezes,
    },
    extended: true,
    freezeSpent: false,
  };
}

/**
 * Midnight rollover: if yesterday was skipped and a freeze is available, spend it and
 * keep the streak alive without extending. Pure; the cron calls this.
 */
export function settleOnRollover(prev: StreakFields, today: DayKey): StreakFields {
  if (prev.lastPracticeDay === null) return prev;
  if (prev.lastPracticeDay === today) return prev;
  if (prev.lastPracticeDay === addDays(today, -1)) return prev;

  const gap = daysBetween(prev.lastPracticeDay, today);
  const freezesNeeded = gap - 1;
  if (freezesNeeded > 0 && prev.streakFreezes >= freezesNeeded) {
    return {
      ...prev,
      lastPracticeDay: addDays(today, -1),
      streakFreezes: prev.streakFreezes - freezesNeeded,
    };
  }

  if (gap > 1) {
    return { ...prev, currentStreak: 0 };
  }
  return prev;
}
