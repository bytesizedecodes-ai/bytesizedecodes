import { describe, expect, it } from "vitest";
import { GENERATORS } from "./index";
import { gradeAnswer, type Difficulty, type GeneratedQuestion } from "./types";

const SEEDS = 2000;

function eachCase(fn: (q: GeneratedQuestion, seed: number, d: Difficulty) => void): void {
  for (const gen of GENERATORS) {
    for (const d of gen.supportedDifficulties) {
      for (let seed = 1; seed <= SEEDS; seed++) {
        fn(gen.generate(seed, d), seed, d);
      }
    }
  }
}

describe.each(GENERATORS.map((g) => [g.id, g] as const))("%s", (_id, gen) => {
  it("is deterministic for a given seed and difficulty", () => {
    for (const d of gen.supportedDifficulties) {
      for (let seed = 1; seed <= 200; seed++) {
        expect(gen.generate(seed, d)).toEqual(gen.generate(seed, d));
      }
    }
  });

  it("reports the seed and difficulty it was called with", () => {
    for (const d of gen.supportedDifficulties) {
      const q = gen.generate(4242, d);
      expect(q.seed).toBe(4242);
      expect(q.difficulty).toBe(d);
      expect(q.generatorId).toBe(gen.id);
    }
  });

  it("produces varied questions across seeds", () => {
    for (const d of gen.supportedDifficulties) {
      const seen = new Set<string>();
      for (let seed = 1; seed <= 200; seed++) {
        seen.add(JSON.stringify(gen.generate(seed, d).prompt));
      }
      // Some difficulties draw from a small template pool, but 200 seeds should never
      // collapse to a handful of distinct questions.
      expect(seen.size).toBeGreaterThan(20);
    }
  });
});

describe("answer integrity", () => {
  it("never emits a distractor equal to the correct answer", () => {
    eachCase((q) => {
      if (q.answer.kind !== "mcq") return;
      const answer = q.answer;
      const correct = answer.choices.find((c) => c.id === answer.correctId);
      expect(correct, `${q.generatorId} d${q.difficulty} seed ${q.seed}`).toBeDefined();

      const labels = answer.choices.map((c) => c.label);
      expect(new Set(labels).size, `duplicate labels in ${q.generatorId} seed ${q.seed}`).toBe(
        labels.length,
      );

      const correctCount = answer.choices.filter((c) => c.misconception === null).length;
      expect(correctCount, `${q.generatorId} seed ${q.seed}`).toBe(1);
    });
  });

  it("gives every wrong option a diagnostic misconception", () => {
    eachCase((q) => {
      if (q.answer.kind !== "mcq") return;
      const answer = q.answer;
      for (const c of answer.choices) {
        if (c.id === answer.correctId) continue;
        expect(c.misconception, `${q.generatorId} seed ${q.seed}`).toBeTruthy();
        expect(c.misconception!.length).toBeGreaterThan(20);
      }
    });
  });

  it("grades its own correct answer as correct", () => {
    eachCase((q) => {
      const answer = q.answer;
      const submitted =
        answer.kind === "mcq"
          ? answer.correctId
          : answer.value.toFixed(answer.decimals);
      expect(
        gradeAnswer(q, submitted).correct,
        `${q.generatorId} d${q.difficulty} seed ${q.seed}`,
      ).toBe(true);
    });
  });

  it("grades every distractor as incorrect", () => {
    eachCase((q) => {
      if (q.answer.kind !== "mcq") return;
      const answer = q.answer;
      for (const c of answer.choices) {
        if (c.id === answer.correctId) continue;
        expect(gradeAnswer(q, c.id).correct).toBe(false);
      }
    });
  });

  it("produces finite numeric answers within a sane range", () => {
    eachCase((q) => {
      if (q.answer.kind !== "numeric") return;
      const answer = q.answer;
      expect(Number.isFinite(answer.value), `${q.generatorId} seed ${q.seed}`).toBe(true);
      expect(Math.abs(answer.value)).toBeLessThan(1000);
      expect(answer.tolerance).toBeGreaterThan(0);
    });
  });
});

describe("rendering", () => {
  it("leaves no unresolved template slots or empty blocks", () => {
    eachCase((q) => {
      const blocks = [...q.prompt, ...q.explanation];
      expect(blocks.length).toBeGreaterThan(0);
      for (const b of blocks) {
        const text = b.kind === "table" ? b.head.join(" ") : b.kind === "code" ? b.code : b.text;
        expect(text.trim().length, `${q.generatorId} seed ${q.seed}`).toBeGreaterThan(0);
        expect(text).not.toContain("undefined");
        expect(text).not.toContain("NaN");
        expect(text).not.toMatch(/\$\{/);
      }
    });
  });

  it("has plausible metadata", () => {
    eachCase((q) => {
      expect(q.estimatedSeconds).toBeGreaterThan(10);
      expect(q.estimatedSeconds).toBeLessThan(300);
      expect(q.interviewTags.length).toBeGreaterThan(0);
      expect(q.topic.length).toBeGreaterThan(0);
    });
  });
});
