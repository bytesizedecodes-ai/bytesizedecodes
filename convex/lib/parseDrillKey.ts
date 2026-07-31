/**
 * Server-side copy of the parseDrillKey helper from lib/data/local.ts.
 *
 * Extracts generator id and difficulty from a `gen:<id>:<difficulty>` item key so the
 * review queue can hand the client enough to regenerate a question. Non-drill keys
 * (byte keys, course keys) return null and are dropped from the review queue.
 */

export type Difficulty = 1 | 2 | 3 | 4 | 5;

export function parseDrillKey(
  itemKey: string,
): { generatorId: string; difficulty: Difficulty } | null {
  // gen:<id>:<difficulty>
  const m = /^gen:([^:]+):([1-5])$/.exec(itemKey);
  if (!m) return null;
  return { generatorId: m[1]!, difficulty: Number(m[2]) as Difficulty };
}
