/**
 * Deterministic XP awards. Seeded by (userId, day, itemKey) so a refresh cannot re-roll.
 */

import { hashToUnit } from "../drills/rng";

export interface XpRoll {
  amount: number;
  critical: boolean;
  /** Human-readable reason for the xpEvents ledger. */
  reason: string;
}

export function applyRepeatDiminishing(roll: XpRoll, repeated: boolean): XpRoll {
  if (!repeated) return roll;
  return {
    amount: Math.max(1, Math.round(roll.amount * 0.2)),
    critical: false,
    reason: "practice_repeat",
  };
}

const BASE = {
  drill: 10,
  review: 8,
  byte: 50,
} as const;

/**
 * Cumulative XP required to reach each level. Level 1 starts at 0.
 * Curves gently — early levels come fast; later ones take real work.
 */
export function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  // Sum of 40 + 20*(n-1) for n = 2..level
  return Math.round((level - 1) * (30 + 10 * level));
}

export function levelFromXp(xp: number): number {
  let level = 1;
  while (xpForLevel(level + 1) <= xp) level += 1;
  return level;
}

export function levelProgress(xp: number): { into: number; span: number; level: number } {
  const level = levelFromXp(xp);
  const floor = xpForLevel(level);
  const next = xpForLevel(level + 1);
  return { level, into: xp - floor, span: next - floor };
}

export function rollDrillXp(userId: string, day: string, itemKey: string): XpRoll {
  const r = hashToUnit(`${userId}:${day}:${itemKey}`);
  if (r < 0.05) return { amount: BASE.drill * 3, critical: true, reason: "drill_critical" };
  if (r < 0.25) return { amount: BASE.drill * 2, critical: false, reason: "drill_bonus" };
  return {
    amount: BASE.drill + Math.floor(r * BASE.drill * 0.5),
    critical: false,
    reason: "drill_correct",
  };
}

export function rollReviewXp(userId: string, day: string, itemKey: string): XpRoll {
  const r = hashToUnit(`${userId}:${day}:${itemKey}:review`);
  return {
    amount: BASE.review + Math.floor(r * BASE.review * 0.5),
    critical: false,
    reason: "review_correct",
  };
}

export function rollByteXp(userId: string, day: string, slug: string): XpRoll {
  const r = hashToUnit(`${userId}:${day}:byte:${slug}`);
  return {
    amount: BASE.byte + Math.floor(r * 20),
    critical: false,
    reason: "byte_complete",
  };
}

/** A freeze is earned every 7 consecutive practised days. */
export function freezesEarnedAt(streak: number): number {
  return Math.floor(streak / 7);
}
