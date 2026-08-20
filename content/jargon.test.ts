import { describe, expect, it } from "vitest";
import { COURSES } from "./courses";
import { JARGON_TERMS } from "./jargon-terms";

/**
 * The plain-English gate (v6 skill §2.5): in beginner/intermediate courses,
 * the FIRST use of each listed jargon term in a lesson must carry a
 * same-sentence parenthetical gloss of ≥ 2 words —
 * "tune the **hyperparameters** (the tuning dials set before training)".
 * Later uses in the same lesson are free (defined once). Expert courses are
 * exempt (P4 expertise reversal: full technical precision).
 */

/** Split a scanned string into sentences (period/question/exclamation/clause breaks). */
function sentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** A sentence passes if it contains a parenthetical with at least 2 words. */
function hasGloss(sentence: string): boolean {
  const matches = sentence.matchAll(/\(([^)]+)\)/g);
  for (const match of matches) {
    const inner = match[1] ?? "";
    if (inner.trim().split(/\s+/).length >= 2) return true;
  }
  return false;
}

/** The learner-facing strings of a lesson, in reading order. */
function scannedStrings(lesson: (typeof COURSES)[number]["lessons"][number]): string[] {
  const c = lesson.concept;
  return [
    ...(c ? [c.anchor, c.what, c.why, ...c.where, c.whenNot] : []),
    ...(lesson.prose ?? []),
    ...(lesson.questions ?? []).flatMap((q) => [q.prompt, q.explanation]),
  ];
}

describe("plain-English gate (v6 jargon elimination)", () => {
  it("glosses every listed term at first use in beginner/intermediate lessons", () => {
    const problems: string[] = [];
    for (const course of COURSES) {
      if (course.level === "expert") continue; // exempt: full precision (P4)
      for (const lesson of course.lessons) {
        const key = `${course.slug}/${lesson.slug}`;
        const texts = scannedStrings(lesson);
        for (const { term, pattern } of JARGON_TERMS) {
          const firstIndex = texts.findIndex((text) => pattern.test(text));
          if (firstIndex === -1) continue;
          const text = texts[firstIndex]!;
          const sentence =
            sentences(text).find((s) => pattern.test(s)) ?? text;
          if (!hasGloss(sentence)) {
            problems.push(
              `${key}: "${term}" needs a same-sentence parenthetical gloss at first use, e.g. "${term} (…plain English…)". First appearance: "${sentence.slice(0, 90)}"`,
            );
          }
        }
      }
    }
    expect(problems).toEqual([]);
  });
});
