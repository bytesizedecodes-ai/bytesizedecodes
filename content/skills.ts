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
  // AI Observability course
  {
    id: "ai-observability",
    label: "AI observability",
    description: "Explain why AI systems need watching and what observability means.",
  },
  {
    id: "system-logs",
    label: "Logging",
    description: "Read logs to explain why an AI produced a given output.",
  },
  {
    id: "system-metrics",
    label: "Metrics",
    description: "Track latency, cost, error rate, and token use over time.",
  },
  {
    id: "distributed-tracing",
    label: "Tracing",
    description: "Follow a single request end-to-end to find the slow or costly step.",
  },
  {
    id: "llm-evaluation",
    label: "LLM evaluation",
    description: "Judge whether an AI's answer is good using rubrics and reviewers.",
  },
  {
    id: "llm-hallucination",
    label: "Hallucination",
    description: "Spot confident-but-wrong outputs and explain how they slip through.",
  },
  {
    id: "model-drift",
    label: "Model drift",
    description: "Recognise when a model slowly degrades as the world changes around it.",
  },
  {
    id: "alerting",
    label: "Alerting",
    description: "Set thresholds that catch real problems without crying wolf.",
  },
  {
    id: "observability-dashboards",
    label: "Dashboards",
    description: "Read a dashboard and know at a glance if a system is healthy.",
  },
  {
    id: "llm-cost-latency",
    label: "Cost and latency",
    description: "Reason about the two bills that shape AI features: tokens and time.",
  },
  {
    id: "observability-tools",
    label: "Observability tools",
    description: "Name the common observability tools and the job each one does.",
  },
] as const;

export function getSkill(id: SkillId): SkillDefinition {
  return SKILLS.find((skill) => skill.id === id)!;
}
