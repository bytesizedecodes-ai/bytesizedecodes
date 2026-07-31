import type { Choice } from "./types";
import { shuffle, type Rng } from "./rng";

export interface Candidate {
  label: string;
  /** The specific mistake that produces this answer. */
  misconception: string;
}

const IDS = ["a", "b", "c", "d", "e"] as const;

/**
 * Assemble an MCQ from a correct label plus misconception-derived candidates.
 *
 * Candidates that collide with the correct answer (or each other) after formatting are
 * dropped — a distractor that happens to equal the right answer is the most likely real
 * bug in a generated question, so it is excluded here and asserted in tests.
 */
export function buildChoices(
  r: Rng,
  correctLabel: string,
  candidates: readonly Candidate[],
  optionCount = 4,
): { choices: Choice[]; correctId: string } {
  const seen = new Set<string>([correctLabel]);
  const distinct: Candidate[] = [];
  for (const c of candidates) {
    if (seen.has(c.label)) continue;
    seen.add(c.label);
    distinct.push(c);
  }

  const wanted = Math.max(1, optionCount - 1);
  if (distinct.length < wanted) {
    throw new Error(
      `Not enough distinct distractors for "${correctLabel}": got ${distinct.length}, need ${wanted}`,
    );
  }

  const chosen = shuffle(r, distinct).slice(0, wanted);
  const ordered = shuffle(r, [
    { label: correctLabel, misconception: null as string | null },
    ...chosen.map((c) => ({ label: c.label, misconception: c.misconception as string | null })),
  ]);

  const choices: Choice[] = ordered.map((o, i) => ({
    id: IDS[i]!,
    label: o.label,
    misconception: o.misconception,
  }));

  const correctId = choices.find((c) => c.misconception === null)!.id;
  return { choices, correctId };
}
