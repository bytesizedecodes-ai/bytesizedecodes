export type PlanTrack = "grad" | "beginner" | "engineer" | "founder";
export type PlanTimeMode = "quick" | "standard" | "deep";

export interface PlanUnit {
  progressKey: string;
  title: string;
  href: string;
  minutes: number;
}

export type DailyPlanStep =
  | {
      kind: "review";
      label: string;
      detail: string;
      href: string;
      minutes: number;
      count: number;
    }
  | {
      kind: "drill";
      label: string;
      detail: string;
      href: string;
      minutes: number;
      generatorId: string;
      difficulty: 1 | 2 | 3 | 4 | 5;
    }
  | {
      kind: "unit";
      label: string;
      detail: string;
      href: string;
      minutes: number;
      progressKey: string;
    };

export interface DailyPlan {
  timeMode: PlanTimeMode;
  estimatedMinutes: number;
  focus: string;
  steps: DailyPlanStep[];
}

// Machine Learning for Layman — full beginner sequence (19 lessons).
const LAYMAN_UNITS = [
  unit("machine-learning-for-layman", "how-humans-learn", "How a human learns", 3),
  unit("machine-learning-for-layman", "humans-vs-machines", "Humans and machines", 3),
  unit("machine-learning-for-layman", "what-is-ml-layman", "What machine learning really is", 4),
  unit("machine-learning-for-layman", "three-ml-paradigms", "The three families of ML", 4),
  unit("machine-learning-for-layman", "supervised-learning-deep-dive", "Inside supervised learning", 5),
  unit("machine-learning-for-layman", "unsupervised-learning-deep-dive", "Inside unsupervised learning", 5),
  unit("machine-learning-for-layman", "reinforcement-learning-deep-dive", "Inside reinforcement learning", 5),
  unit("machine-learning-for-layman", "features-and-vectors", "Representing samples as features", 5),
  unit("machine-learning-for-layman", "first-classifier", "Your first classifier", 5),
  unit("machine-learning-for-layman", "multiple-features", "When one feature isn't enough", 5),
  unit("machine-learning-for-layman", "knn-neighbors", "Find its neighbors: k-Nearest Neighbors", 5),
  unit("machine-learning-for-layman", "centroid-classifier", "The class center: the centroid classifier", 5),
  unit("machine-learning-for-layman", "decision-tree-rules", "Rules as a tree: the decision tree", 5),
  unit("machine-learning-for-layman", "best-split", "Which split is best?", 5),
  unit("machine-learning-for-layman", "train-test-split", "Don't grade on what you studied", 4),
  unit("machine-learning-for-layman", "overfitting", "Memorizing vs. understanding", 5),
  unit("machine-learning-for-layman", "data-quality", "Garbage in, garbage out", 5),
  unit("machine-learning-for-layman", "ml-in-your-phone", "ML you already use every day", 4),
  unit("machine-learning-for-layman", "when-ml-fails", "When ML gets it wrong", 5),
];

// AI Observability (beginner) — the "keep an eye on AI" sequence.
const AI_OBSERVABILITY_UNITS = [
  unit("ai-observability", "what-is-observability", "What is observability?", 5),
  unit("ai-observability", "why-ai-is-different", "Why is AI different from normal software?", 5),
  unit("ai-observability", "when-ai-goes-wrong", "When AI goes wrong, it rarely crashes", 6),
  unit("ai-observability", "logs-what-ai-said", "Logs: what the AI said", 5),
  unit("ai-observability", "metrics-counting-matters", "Metrics: counting what matters", 6),
  unit("ai-observability", "traces-the-journey", "Traces: following a request's journey", 6),
  unit("ai-observability", "is-the-answer-good", "“Is the answer good?” — evaluation", 6),
  unit("ai-observability", "hallucination-makes-things-up", "Hallucination: confident, but wrong", 6),
  unit("ai-observability", "drift-slowly-going-bad", "Drift: when AI slowly goes bad", 6),
  unit("ai-observability", "alerts-knowing-when-to-act", "Alerts: knowing when to act", 6),
  unit("ai-observability", "dashboards-control-room", "Dashboards: the control room", 5),
  unit("ai-observability", "cost-and-speed", "Cost and speed: the two big bills", 5),
  unit("ai-observability", "observability-toolkit", "The observability toolkit", 5),
  unit("ai-observability", "day-in-the-life", "A day in the life of an AI team", 6),
];

// LLM Observability (intermediate) — instrument, evaluate, rescue.
const LLM_OBSERVABILITY_UNITS = [
  unit("llm-observability", "request-to-trace", "From a request to a trace", 8),
  unit("llm-observability", "instrument-right-context", "Instrument the right context", 9),
  unit("llm-observability", "logs-without-leaking", "Logs that help without leaking data", 8),
  unit("llm-observability", "latency-cost-broken-down", "Latency and cost, broken down", 8),
  unit("llm-observability", "ai-service-level-objective", "Define an AI service level objective", 9),
  unit("llm-observability", "quality-is-a-signal", "Quality is a production signal", 8),
  unit("llm-observability", "llm-as-a-judge", "LLM-as-a-judge", 9),
  unit("llm-observability", "observe-rag-not-just-model", "Observe RAG, not only the model", 8),
  unit("llm-observability", "prompt-model-tool-regressions", "Prompt, model, and tool regressions", 8),
  unit("llm-observability", "alerts-people-trust", "Alerts people trust", 8),
  unit("llm-observability", "triage-an-incident", "Triage a real-looking incident", 9),
  unit("llm-observability", "operator-dashboard", "Build the operator dashboard", 7),
  unit("llm-observability", "capstone-rescue-assistant", "Capstone: rescue the support assistant", 10),
];

// AI Observability: Reliability Engineering (expert) — design review sequence.
const RELIABILITY_UNITS = [
  unit("ai-observability-reliability", "telemetry-architecture-contracts", "Telemetry architecture and contracts", 11),
  unit("ai-observability-reliability", "genai-semantic-conventions", "GenAI semantic conventions in practice", 11),
  unit("ai-observability-reliability", "sampling-cardinality-cost", "Sampling, cardinality, and telemetry cost", 10),
  unit("ai-observability-reliability", "ai-threat-model-owasp", "AI threat model: the OWASP LLM Top 10", 11),
  unit("ai-observability-reliability", "detecting-attacks-in-telemetry", "Detecting attacks in telemetry", 11),
  unit("ai-observability-reliability", "guardrails-and-safety-signals", "Guardrails and safety signals", 10),
  unit("ai-observability-reliability", "privacy-engineering-for-telemetry", "Privacy engineering for telemetry", 12),
  unit("ai-observability-reliability", "governance-frameworks", "Governance frameworks", 12),
  unit("ai-observability-reliability", "evaluation-systems-not-one-score", "Evaluation systems, not one score", 11),
  unit("ai-observability-reliability", "detecting-drift-regressions", "Detecting drift and regressions", 11),
  unit("ai-observability-reliability", "causal-diagnosis-experimentation", "Causal diagnosis and experimentation", 11),
  unit("ai-observability-reliability", "agent-tool-observability", "Agent and tool-use observability", 11),
  unit("ai-observability-reliability", "reliability-objectives-error-budgets", "Reliability objectives and error budgets", 11),
  unit("ai-observability-reliability", "incident-command-learning-loop", "Incident command and the learning loop", 11),
  unit("ai-observability-reliability", "capstone-design-review", "Capstone: production design review", 14),
];

const ML_PRIMER_UNITS = [
  unit("machine-learning", "what-is-artificial-intelligence", "What is artificial intelligence?", 4),
  unit("machine-learning", "what-is-machine-learning", "What is machine learning?", 5),
  unit("machine-learning", "what-is-deep-learning", "What is deep learning?", 5),
  unit("machine-learning", "ai-vs-ml-vs-dl", "AI vs ML vs deep learning", 5),
];

export const TRACK_UNITS: Record<PlanTrack, readonly PlanUnit[]> = {
  beginner: [
    ...LAYMAN_UNITS,
    unit("machine-learning", "ai-vs-ml-vs-dl", "AI vs ML vs deep learning", 5),
    ...AI_OBSERVABILITY_UNITS,
  ],
  grad: [
    ...ML_PRIMER_UNITS,
    byte("precision-and-recall", "Precision and recall", 5),
    byte("gradient-descent", "What gradient descent actually does", 5),
    byte("tensors-and-shapes", "Tensors and shapes", 5),
    ...AI_OBSERVABILITY_UNITS,
    ...LLM_OBSERVABILITY_UNITS,
  ],
  engineer: [
    unit("machine-learning", "ai-vs-ml-vs-dl", "AI vs ML vs deep learning", 5),
    byte("precision-and-recall", "Precision and recall", 5),
    byte("gradient-descent", "What gradient descent actually does", 5),
    byte("tensors-and-shapes", "Tensors and shapes", 5),
    ...LLM_OBSERVABILITY_UNITS,
    ...RELIABILITY_UNITS,
  ],
  founder: [
    unit("machine-learning-for-layman", "humans-vs-machines", "Humans and machines", 3),
    unit("machine-learning-for-layman", "what-is-ml-layman", "What machine learning really is", 4),
    unit("machine-learning", "ai-vs-ml-vs-dl", "AI vs ML vs deep learning", 5),
    ...AI_OBSERVABILITY_UNITS,
  ],
};

const TOPIC_DRILLS: Record<
  string,
  { generatorId: string; label: string; difficulty: 1 | 2 | 3 | 4 | 5 }
> = {
  evaluation: {
    generatorId: "confusion-matrix",
    label: "Strengthen classification metrics",
    difficulty: 2,
  },
  optimisation: {
    generatorId: "gradient-step",
    label: "Strengthen gradient descent",
    difficulty: 2,
  },
  "deep-learning-fundamentals": {
    generatorId: "tensor-shape",
    label: "Strengthen tensor shapes",
    difficulty: 2,
  },
  "deep-learning": {
    generatorId: "head-and-loss",
    label: "Strengthen output heads and losses",
    difficulty: 2,
  },
};

export function nextUnitForTrack(
  track: PlanTrack,
  progress: Record<string, "started" | "completed">,
): PlanUnit | null {
  const units = TRACK_UNITS[track];
  return (
    units.find((item) => progress[item.progressKey] === "started") ??
    units.find((item) => progress[item.progressKey] !== "completed") ??
    null
  );
}

export function assembleDailyPlan(input: {
  track: PlanTrack;
  timeMode: PlanTimeMode;
  dueCount: number;
  weakTopic: string | null;
  nextUnit: PlanUnit | null;
}): DailyPlan {
  const steps: DailyPlanStep[] = [];
  const dueCount = Math.max(0, Math.floor(input.dueCount));

  if (dueCount > 0) {
    const count =
      input.timeMode === "quick"
        ? Math.min(2, dueCount)
        : Math.min(6, dueCount);
    steps.push({
      kind: "review",
      label:
        count === 1
          ? "Mastery Challenge · 1 skill check"
          : `Mastery Challenge · ${count} skill checks`,
      detail: "Spaced recall before the memory fades",
      href: "/review",
      minutes:
        input.timeMode === "quick"
          ? 3
          : Math.min(8, Math.max(3, Math.ceil(count * 1.5))),
      count,
    });
  }

  const drill = input.weakTopic ? TOPIC_DRILLS[input.weakTopic] : undefined;
  if (input.timeMode !== "quick" && drill) {
    steps.push({
      kind: "drill",
      label: drill.label,
      detail: "One generated scenario with targeted feedback",
      href: `/practice?topic=${encodeURIComponent(input.weakTopic!)}`,
      minutes: input.timeMode === "deep" ? 5 : 3,
      generatorId: drill.generatorId,
      difficulty: drill.difficulty,
    });
  }

  if (input.nextUnit && (input.timeMode !== "quick" || steps.length === 0)) {
    steps.push({
      kind: "unit",
      label: input.nextUnit.title,
      detail: "Continue your recommended learning path",
      href: input.nextUnit.href,
      minutes: input.nextUnit.minutes,
      progressKey: input.nextUnit.progressKey,
    });
  }

  if (steps.length === 0) {
    const fallback = TOPIC_DRILLS.evaluation!;
    steps.push({
      kind: "drill",
      label: "Keep a core skill warm",
      detail: "One generated classification scenario",
      href: "/practice?topic=evaluation",
      minutes: 3,
      generatorId: fallback.generatorId,
      difficulty: fallback.difficulty,
    });
  }

  return {
    timeMode: input.timeMode,
    estimatedMinutes: steps.reduce((sum, step) => sum + step.minutes, 0),
    focus: focusFor(input, steps),
    steps,
  };
}

function focusFor(
  input: {
    dueCount: number;
    weakTopic: string | null;
    nextUnit: PlanUnit | null;
  },
  steps: DailyPlanStep[],
): string {
  if (input.dueCount > 0) return "Mastery Challenge waiting";
  if (input.nextUnit) return input.nextUnit.title;
  if (input.weakTopic) return `Strengthen ${input.weakTopic.replaceAll("-", " ")}`;
  return steps[0]?.label ?? "Keep learning";
}

function unit(course: string, lesson: string, title: string, minutes: number): PlanUnit {
  return {
    progressKey: `course:${course}:${lesson}`,
    title,
    href: `/courses/${course}/${lesson}`,
    minutes,
  };
}

function byte(slug: string, title: string, minutes: number): PlanUnit {
  return { progressKey: slug, title, href: `/bytes/${slug}`, minutes };
}
