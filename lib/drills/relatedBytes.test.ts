import { describe, expect, it } from "vitest";
import { allSlugs } from "../../content";
import { GENERATORS } from "./index";

describe("generator repair links", () => {
  it("only references published bytes", () => {
    const published = new Set(allSlugs());
    for (const generator of GENERATORS) {
      for (const difficulty of generator.supportedDifficulties) {
        for (let seed = 1; seed <= 50; seed++) {
          const question = generator.generate(seed, difficulty);
          for (const slug of question.relatedBytes) {
            expect(published.has(slug), `${generator.id} references missing ${slug}`).toBe(
              true,
            );
          }
        }
      }
    }
  });
});
