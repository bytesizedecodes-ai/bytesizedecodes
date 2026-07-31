import { describe, expect, it } from "vitest";
import { GENERATORS, generateQuestion } from "./index";

describe("generator skill ids", () => {
  it("attaches canonical skillIds to every generator and question", () => {
    for (const generator of GENERATORS) {
      expect(generator.skillIds.length).toBeGreaterThan(0);
      for (const difficulty of generator.supportedDifficulties) {
        const question = generateQuestion(generator.id, 1, difficulty);
        expect(question.skillIds).toEqual([...generator.skillIds]);
      }
    }
  });
});
