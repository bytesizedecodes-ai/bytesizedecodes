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

// Harness Engineering: Foundations (beginner) — what surrounds a model.
const HARNESS_FOUNDATIONS_UNITS = [
  unit("harness-engineering-foundations", "what-is-an-ai-harness", "What is an AI harness?", 5),
  unit("harness-engineering-foundations", "raw-model-vs-product", "Why a raw model isn't a product", 4),
  unit("harness-engineering-foundations", "what-is-a-prompt-really", "What is a prompt, really?", 5),
  unit("harness-engineering-foundations", "what-is-a-context-window", "What is a context window?", 5),
  unit("harness-engineering-foundations", "how-models-use-tools", "How do models use tools?", 5),
  unit("harness-engineering-foundations", "the-agent-loop", "What is the agent loop?", 6),
  unit("harness-engineering-foundations", "when-not-to-build-an-agent", "When NOT to build an agent", 6),
];

// Harness Engineering: In Practice (intermediate) — build Relay end to end.
const HARNESS_PRACTICE_UNITS = [
  unit("harness-engineering-in-practice", "context-engineering", "Context engineering: packing the window", 7),
  unit("harness-engineering-in-practice", "designing-tools-models-use", "Designing tools models use well", 7),
  unit("harness-engineering-in-practice", "system-prompts-that-hold", "System prompts that hold under pressure", 7),
  unit("harness-engineering-in-practice", "agent-memory-and-state", "Memory and state across turns", 8),
  unit("harness-engineering-in-practice", "structured-output", "Structured output without tears", 7),
  unit("harness-engineering-in-practice", "guardrails-and-failure-modes", "Failure modes and guardrails", 8),
  unit("harness-engineering-in-practice", "harness-observability", "You can't fix what you can't see", 7),
  unit("harness-engineering-in-practice", "intro-to-harness-evals", "Does your harness work? Intro to evals", 8),
  unit("harness-engineering-in-practice", "cost-and-latency-engineering", "Cost and latency engineering", 8),
];

// Harness Engineering: At Scale (expert) — operate Relay in production.
const HARNESS_AT_SCALE_UNITS = [
  unit("harness-engineering-at-scale", "multi-agent-orchestration", "Multi-agent orchestration", 9),
  unit("harness-engineering-at-scale", "long-horizon-autonomy", "Long-horizon autonomy", 10),
  unit("harness-engineering-at-scale", "evals-as-a-system", "Evals as a system", 9),
  unit("harness-engineering-at-scale", "harness-vs-finetuning", "Harness vs fine-tuning", 10),
  unit("harness-engineering-at-scale", "agent-security", "Agent security", 10),
  unit("harness-engineering-at-scale", "self-improving-harnesses", "Self-improving harnesses", 9),
  unit("harness-engineering-at-scale", "harness-reliability", "Harness reliability", 10),
  unit("harness-engineering-at-scale", "anatomy-of-production-harnesses", "Anatomy of production harnesses", 11),
];

// RAG Engineering: Foundations (beginner) — the open-book machine.
const RAG_FOUNDATIONS_UNITS = [
  unit("rag-engineering-foundations", "what-is-rag", "What is RAG?", 4),
  unit("rag-engineering-foundations", "why-not-paste-everything", "Why not just paste everything?", 5),
  unit("rag-engineering-foundations", "what-are-embeddings", "What are embeddings?", 5),
  unit("rag-engineering-foundations", "how-similarity-search-works", "How the search finds the right page", 4),
  unit("rag-engineering-foundations", "the-rag-pipeline", "The RAG pipeline, end to end", 6),
  unit("rag-engineering-foundations", "when-rag-gets-it-wrong", "When RAG gets it wrong", 5),
  unit("rag-engineering-foundations", "when-not-to-use-rag", "When NOT to use RAG", 5),
];

// RAG Engineering: In Practice (intermediate) — build Atlas end to end.
const RAG_PRACTICE_UNITS = [
  unit("rag-engineering-in-practice", "chunking-strategy", "Chunking: where quality is decided", 7),
  unit("rag-engineering-in-practice", "choosing-embeddings", "Choosing an embedding model", 7),
  unit("rag-engineering-in-practice", "hybrid-search", "Hybrid search: keywords meet meaning", 7),
  unit("rag-engineering-in-practice", "reranking", "Reranking: the second look", 7),
  unit("rag-engineering-in-practice", "query-understanding", "Query understanding", 8),
  unit("rag-engineering-in-practice", "citations-and-grounding", "Grounded answers with citations", 8),
  unit("rag-engineering-in-practice", "rag-evaluation", "Evaluating RAG: the four questions", 8),
  unit("rag-engineering-in-practice", "rag-observability", "RAG observability", 7),
  unit("rag-engineering-in-practice", "ingestion-pipeline", "The ingestion pipeline", 8),
];

// RAG Engineering: At Scale (expert) — operate Atlas in production.
const RAG_AT_SCALE_UNITS = [
  unit("rag-engineering-at-scale", "advanced-retrieval", "Beyond top-k: advanced retrieval", 9),
  unit("rag-engineering-at-scale", "agentic-rag", "Agentic RAG", 10),
  unit("rag-engineering-at-scale", "graphrag", "GraphRAG and knowledge graphs", 10),
  unit("rag-engineering-at-scale", "permission-aware-retrieval", "Permission-aware retrieval", 10),
  unit("rag-engineering-at-scale", "index-lifecycle", "The index lifecycle", 10),
  unit("rag-engineering-at-scale", "rag-vs-long-context", "RAG vs long context", 10),
  unit("rag-engineering-at-scale", "production-rag-evals", "Evals and drift in production", 10),
  unit("rag-engineering-at-scale", "anatomy-of-production-rag", "Anatomy of production RAG", 11),
];

export const TRACK_UNITS: Record<PlanTrack, readonly PlanUnit[]> = {
  beginner: [
    ...LAYMAN_UNITS,
    unit("machine-learning", "ai-vs-ml-vs-dl", "AI vs ML vs deep learning", 5),
    ...AI_OBSERVABILITY_UNITS,
    ...HARNESS_FOUNDATIONS_UNITS,
    ...RAG_FOUNDATIONS_UNITS,
  ],
  grad: [
    ...ML_PRIMER_UNITS,
    byte("precision-and-recall", "Precision and recall", 5),
    byte("gradient-descent", "What gradient descent actually does", 5),
    byte("tensors-and-shapes", "Tensors and shapes", 5),
    ...AI_OBSERVABILITY_UNITS,
    ...LLM_OBSERVABILITY_UNITS,
    ...HARNESS_FOUNDATIONS_UNITS,
    ...HARNESS_PRACTICE_UNITS,
    ...RAG_FOUNDATIONS_UNITS,
    ...RAG_PRACTICE_UNITS,
  ],
  engineer: [
    unit("machine-learning", "ai-vs-ml-vs-dl", "AI vs ML vs deep learning", 5),
    byte("precision-and-recall", "Precision and recall", 5),
    byte("gradient-descent", "What gradient descent actually does", 5),
    byte("tensors-and-shapes", "Tensors and shapes", 5),
    ...LLM_OBSERVABILITY_UNITS,
    ...RELIABILITY_UNITS,
    ...HARNESS_PRACTICE_UNITS,
    ...HARNESS_AT_SCALE_UNITS,
    ...RAG_PRACTICE_UNITS,
    ...RAG_AT_SCALE_UNITS,
  ],
  founder: [
    unit("machine-learning-for-layman", "humans-vs-machines", "Humans and machines", 3),
    unit("machine-learning-for-layman", "what-is-ml-layman", "What machine learning really is", 4),
    unit("machine-learning", "ai-vs-ml-vs-dl", "AI vs ML vs deep learning", 5),
    ...AI_OBSERVABILITY_UNITS,
    ...HARNESS_AT_SCALE_UNITS,
    ...RAG_AT_SCALE_UNITS,
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
