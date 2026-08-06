/**
 * Pure UI helpers for mastery / capability language (Hooked "reward of the self").
 * No storage or React.
 */

export type MasteryLevelLabel =
  | "Not started"
  | "Attempted"
  | "Familiar"
  | "Proficient"
  | "Mastered";

/** Map 0..1 SRS-derived topic mastery to Khan-style ladder labels. */
export function masteryLevelFromScore(score: number): MasteryLevelLabel {
  if (score <= 0) return "Not started";
  if (score < 0.35) return "Attempted";
  if (score < 0.6) return "Familiar";
  if (score < 0.85) return "Proficient";
  return "Mastered";
}

/** Drill / review topics → capability statements shown on reward. */
const TOPIC_CAPABILITY: Record<string, string> = {
  evaluation: "You can choose and reason about classification metrics under delay.",
  optimisation: "You can follow a gradient step and sense when the rate is wrong.",
  "deep-learning": "You can match output heads and losses to the prediction task.",
  "deep-learning-fundamentals": "You can reason about tensor shapes under review delay.",
  "ai-foundations": "You can explain foundational AI ideas in plain language.",
  "ml-foundations": "You can explain how machine learning learns from examples.",
  "layman-foundations": "You can recognize learning and adaptation outside buzzwords.",
  "layman-paradigms": "You can choose a sensible learning family for a simple task.",
};

const GENERATOR_CAPABILITY: Record<string, string> = {
  "confusion-matrix": "You can read a confusion matrix without guessing the metrics.",
  "gradient-step": "You can compute a gradient update on a small example.",
  "tensor-shape": "You can check that tensor axes line up.",
  "head-and-loss": "You can pair a prediction head with an appropriate loss.",
};

export function capabilityForTopic(topic: string | null | undefined): string | null {
  if (!topic) return null;
  return TOPIC_CAPABILITY[topic] ?? null;
}

export function capabilityForGenerator(
  generatorId: string | null | undefined,
): string | null {
  if (!generatorId) return null;
  return GENERATOR_CAPABILITY[generatorId] ?? null;
}

/** Soft cap for a single Mastery Challenge session (anti-abandonment). */
export const MASTERY_CHALLENGE_CAP = 6;

export function estimateMasteryMinutes(cardCount: number): number {
  return Math.max(3, Math.min(12, cardCount * 1.5));
}
