/**
 * Day keys are "YYYY-MM-DD" strings in Asia/Kolkata, never timestamps.
 *
 * Streaks, review due dates and day rollover all key off this string. IST is a fixed
 * +05:30 offset with no DST, so the arithmetic is exact. When the product expands beyond
 * a single timezone, only this module changes.
 */

export type DayKey = string & { readonly __brand: "DayKey" };

const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
const DAY_KEY_RE = /^\d{4}-\d{2}-\d{2}$/;

const pad = (n: number): string => String(n).padStart(2, "0");

export function isDayKey(value: string): value is DayKey {
  return DAY_KEY_RE.test(value);
}

export function asDayKey(value: string): DayKey {
  if (!isDayKey(value)) throw new Error(`Not a valid day key: ${value}`);
  return value;
}

/** The current calendar day in IST. */
export function todayKey(now: Date = new Date()): DayKey {
  const shifted = new Date(now.getTime() + IST_OFFSET_MS);
  return `${shifted.getUTCFullYear()}-${pad(shifted.getUTCMonth() + 1)}-${pad(
    shifted.getUTCDate(),
  )}` as DayKey;
}

/** Midnight IST of the given day, as a UTC instant. */
function dayStartUtc(day: DayKey): number {
  const [y, m, d] = day.split("-").map(Number) as [number, number, number];
  return Date.UTC(y, m - 1, d) - IST_OFFSET_MS;
}

export function addDays(day: DayKey, delta: number): DayKey {
  return todayKey(new Date(dayStartUtc(day) + delta * DAY_MS));
}

/** Whole days from `from` to `to`. Negative when `to` is earlier. */
export function daysBetween(from: DayKey, to: DayKey): number {
  return Math.round((dayStartUtc(to) - dayStartUtc(from)) / DAY_MS);
}

export function isOnOrBefore(a: DayKey, b: DayKey): boolean {
  return a <= b; // lexicographic ordering is chronological for this format
}

export function formatDayShort(day: DayKey): string {
  const [y, m, d] = day.split("-").map(Number) as [number, number, number];
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${d} ${months[m - 1]} ${y}`;
}
