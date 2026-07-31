/**
 * Byte content contract. Authored as TypeScript modules under content/bytes/.
 * Phase 0 choice: typed modules over MDX so authoring is type-checked and the content
 * pipeline is zero-build. Swap to MDX later if non-engineers start writing bytes.
 */

export interface ByteQuestion {
  id: string;
  kind: "mcq";
  prompt: string;
  choices: { id: string; label: string }[];
  answer: string;
  explanation: string;
}

export interface CodeExercise {
  id: string;
  title: string;
  prompt: string;
  starterCode: string;
  /** Hidden test — must set `ok = True` (and optionally `message`) when passing. */
  testCode: string;
}

export interface Byte {
  slug: string;
  title: string;
  subtitle: string;
  topic: string;
  season: number;
  order: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  interviewTags: readonly string[];
  /** Estimated minutes. */
  minutes: number;
  /** Sections of the lesson body. */
  sections: {
    heading?: string;
    paragraphs: string[];
    /** Optional fenced code shown for illustration (not runnable). */
    code?: { lang: string; source: string };
  }[];
  questions: ByteQuestion[];
  exercise?: CodeExercise;
}
