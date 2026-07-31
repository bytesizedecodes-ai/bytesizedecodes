import { confusionMatrix } from "./generators/confusion-matrix";
import { gradientStep } from "./generators/gradient-step";
import { headAndLoss } from "./generators/head-and-loss";
import { tensorShape } from "./generators/tensor-shape";
import type { Difficulty, GeneratedQuestion, Generator } from "./types";

export * from "./types";
export { rng, hashToSeed, hashToUnit } from "./rng";

/**
 * Registry order is the order shown on the practice picker. Confusion matrix leads
 * because it is the highest-value interview topic and the gentlest entry point.
 */
export const GENERATORS: readonly Generator[] = [
  confusionMatrix,
  tensorShape,
  gradientStep,
  headAndLoss,
];

export function getGenerator(id: string): Generator {
  const g = GENERATORS.find((x) => x.id === id);
  if (!g) throw new Error(`Unknown generator: ${id}`);
  return g;
}

export function generateQuestion(
  generatorId: string,
  seed: number,
  difficulty: Difficulty,
): GeneratedQuestion {
  return getGenerator(generatorId).generate(seed, difficulty);
}
