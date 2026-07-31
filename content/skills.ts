import type { SkillId } from "./types";

export interface SkillDefinition {
  id: SkillId;
  label: string;
  description: string;
}

export const SKILLS: readonly SkillDefinition[] = [
  {
    id: "ai-literacy",
    label: "AI literacy",
    description: "Recognize what AI can do, how it learns, and where it can fail.",
  },
  {
    id: "ai-ml-dl",
    label: "AI, ML, and deep learning",
    description: "Explain how the fields relate and choose the right level of description.",
  },
  {
    id: "learning-paradigms",
    label: "Learning paradigms",
    description: "Choose supervised, unsupervised, or reinforcement learning for a task.",
  },
  {
    id: "supervised-learning",
    label: "Supervised learning",
    description: "Frame labelled examples as classification or regression.",
  },
  {
    id: "classification-metrics",
    label: "Classification metrics",
    description: "Compute and choose metrics under different error costs.",
  },
  {
    id: "gradient-descent",
    label: "Gradient descent",
    description: "Trace an optimization step and reason about learning rate.",
  },
  {
    id: "tensor-shapes",
    label: "Tensor shapes",
    description: "Track dimensions through common neural-network operations.",
  },
  {
    id: "output-heads",
    label: "Output heads and losses",
    description: "Match a task to its output representation and training loss.",
  },
  {
    id: "python-basics",
    label: "Python for ML",
    description: "Use lists, functions, and simple tests to prepare data for models.",
  },
] as const;

export function getSkill(id: SkillId): SkillDefinition {
  return SKILLS.find((skill) => skill.id === id)!;
}
