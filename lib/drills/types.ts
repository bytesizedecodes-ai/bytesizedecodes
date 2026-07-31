/**
 * Drill generator contract.
 *
 * A generator is a pure function of (seed, difficulty). No Date.now(), no Math.random(),
 * no I/O, no DOM. That purity is what allows the identical module to run in the browser
 * for instant practice feedback and inside Convex for cheat-resistant ranked grading.
 */

export type Difficulty = 1 | 2 | 3 | 4 | 5;

/**
 * Prompts are typed blocks rather than a markdown string. Generated content should never
 * need a markdown parser at runtime, and typed blocks make the renderer total.
 */
export type Block =
  | { kind: "text"; text: string } // supports inline `code` and **bold**
  | { kind: "code"; lang: string; code: string }
  | { kind: "table"; head: readonly string[]; rows: readonly (readonly string[])[] }
  | { kind: "note"; text: string };

export interface Choice {
  id: string;
  label: string;
  /** null for the correct option; otherwise the misconception this option encodes. */
  misconception: string | null;
}

export type AnswerSpec =
  | { kind: "mcq"; choices: readonly Choice[]; correctId: string }
  | { kind: "numeric"; value: number; tolerance: number; unit?: string; decimals: number };

export interface GeneratedQuestion {
  generatorId: string;
  seed: number;
  difficulty: Difficulty;
  topic: string;
  /** Canonical skill ids; filled from the generator registry when missing. */
  skillIds?: readonly string[];
  interviewTags: readonly string[];
  prompt: readonly Block[];
  answer: AnswerSpec;
  /** Worked solution with the actual numbers substituted. */
  explanation: readonly Block[];
  /** Byte slugs to suggest when the learner gets it wrong. */
  relatedBytes: readonly string[];
  estimatedSeconds: number;
}

export interface Generator {
  id: string;
  title: string;
  /** One line shown on the practice picker. */
  blurb: string;
  topic: string;
  skillIds: readonly string[];
  supportedDifficulties: readonly Difficulty[];
  generate(seed: number, difficulty: Difficulty): GeneratedQuestion;
}

/** Stable key for an occurrence of a generated question, used by the review scheduler. */
export function drillItemKey(generatorId: string, difficulty: Difficulty): string {
  // Review tracks mastery of a generator at a difficulty, not of an individual seed —
  // a specific random instance is not worth remembering, the skill is.
  return `gen:${generatorId}:${difficulty}`;
}

export interface GradeResult {
  correct: boolean;
  /** Present when the chosen option encodes a known misconception. */
  misconception: string | null;
  correctLabel: string;
}

export function gradeAnswer(
  question: GeneratedQuestion,
  submitted: string,
): GradeResult {
  const { answer } = question;

  if (answer.kind === "mcq") {
    const chosen = answer.choices.find((c) => c.id === submitted);
    const correctChoice = answer.choices.find((c) => c.id === answer.correctId)!;
    return {
      correct: submitted === answer.correctId,
      misconception: chosen?.misconception ?? null,
      correctLabel: correctChoice.label,
    };
  }

  const parsed = Number(submitted.trim());
  const correctLabel = answer.value.toFixed(answer.decimals);
  if (!Number.isFinite(parsed)) {
    return { correct: false, misconception: null, correctLabel };
  }
  return {
    correct: Math.abs(parsed - answer.value) <= answer.tolerance,
    misconception: null,
    correctLabel,
  };
}
