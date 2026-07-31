/**
 * Server-side copy of lib/drills/rng.ts — deterministic mulberry32 RNG, verbatim.
 *
 * Identical output to the browser so XP rolls and review seeds agree. This is the
 * dependency that makes cheat-resistant, refresh-stable XP possible server-side.
 */

export type Rng = () => number;

export function rng(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Stable hash of a string to [0,1) — used for seeding from ids and day keys. */
export function hashToUnit(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h / 4294967296;
}

export function hashToSeed(s: string): number {
  return Math.floor(hashToUnit(s) * 2 ** 31);
}
