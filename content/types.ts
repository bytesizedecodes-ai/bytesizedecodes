/**
 * Byte content contract. Authored as TypeScript modules under content/bytes/.
 * Phase 0 choice: typed modules over MDX so authoring is type-checked and the content
 * pipeline is zero-build. Swap to MDX later if non-engineers start writing bytes.
 */

export interface ByteQuestion {
  id: string;
  kind: "mcq";
  prompt: string;
  choices: { id: string; label: string }[];
  answer: string;
  explanation: string;
}

export type SkillId =
  | "ai-literacy"
  | "ai-ml-dl"
  | "learning-paradigms"
  | "supervised-learning"
  | "unsupervised-learning"
  | "reinforcement-learning"
  | "feature-engineering"
  | "classification-basics"
  | "regression-basics"
  | "logistic-regression"
  | "loss-functions"
  | "neural-network-basics"
  | "backpropagation"
  | "bias-variance"
  | "ensemble-methods"
  | "cross-validation"
  | "data-leakage"
  | "k-nearest-neighbors"
  | "centroid-classifier"
  | "decision-trees"
  | "ml-applications"
  | "ml-limits"
  | "train-test-split"
  | "overfitting"
  | "data-quality"
  | "classification-metrics"
  | "gradient-descent"
  | "tensor-shapes"
  | "output-heads"
  | "python-basics"
  // AI Observability course
  | "ai-observability"
  | "system-logs"
  | "system-metrics"
  | "distributed-tracing"
  | "llm-evaluation"
  | "llm-hallucination"
  | "model-drift"
  | "alerting"
  | "observability-dashboards"
  | "llm-cost-latency"
  | "observability-tools"
  // LLM Observability (intermediate) + AI Observability: Reliability (expert)
  | "otel-genai"
  | "llm-instrumentation"
  | "telemetry-privacy"
  | "ai-slo"
  | "offline-evaluation"
  | "online-evaluation"
  | "llm-judge"
  | "eval-bias"
  | "rag-evaluation"
  | "eval-gates"
  | "ai-incident-response"
  | "telemetry-strategy"
  | "telemetry-pipeline"
  | "ai-security"
  | "ai-red-teaming"
  | "ai-guardrails"
  | "ai-audit-trail"
  | "ai-compliance"
  | "eu-ai-act"
  | "nist-ai-rmf"
  | "llm-drift"
  | "agent-tracing"
  | "mcp-observability"
  // Harness Engineering: Foundations course
  | "harness-basics"
  | "prompt-fundamentals"
  | "context-window-basics"
  | "tool-use-basics"
  | "agent-loops"
  | "agent-vs-pipeline"
  // Harness Engineering: In Practice course
  | "context-engineering"
  | "tool-design"
  | "system-prompt-design"
  | "agent-memory"
  | "structured-output"
  | "harness-guardrails"
  | "harness-observability"
  | "harness-evals"
  | "cost-latency-engineering"
  // Harness Engineering: At Scale course
  | "multi-agent-orchestration"
  | "long-horizon-autonomy"
  | "eval-systems"
  | "harness-vs-finetuning"
  | "agent-security"
  | "self-improving-harness"
  | "harness-reliability"
  | "production-harness-anatomy"
  // RAG Engineering: Foundations course
  | "rag-basics"
  | "embeddings-basics"
  | "similarity-search-basics"
  | "rag-pipeline"
  | "rag-failure-basics"
  | "rag-vs-alternatives"
  // RAG Engineering: In Practice course
  | "chunking-strategy"
  | "embedding-selection"
  | "hybrid-search"
  | "reranking"
  | "query-understanding"
  | "grounded-citations"
  | "rag-metrics"
  | "rag-observability"
  | "rag-ingestion"
  // RAG Engineering: At Scale course
  | "advanced-retrieval"
  | "agentic-rag"
  | "graphrag"
  | "permission-aware-retrieval"
  | "index-lifecycle"
  | "rag-vs-long-context"
  | "production-rag-evals"
  | "production-rag-anatomy"
  // Advanced Machine Learning course (expert)
  | "deep-representations"
  | "optimizers"
  | "deep-regularization"
  | "cnn-architectures"
  | "attention-mechanism"
  | "transformer-architecture"
  | "llm-training-pipeline"
  | "lora-fine-tuning"
  | "alignment-techniques"
  | "diffusion-models"
  | "multimodal-embeddings"
  | "efficient-architectures"
  | "production-ml-lifecycle"
  // LLM Fine-Tuning: Foundations course (beginner)
  | "finetune-intuition"
  | "finetune-vs-prompting"
  | "finetune-data-intuition"
  | "finetune-risks"
  | "when-to-finetune"
  | "lora-intuition"
  | "finetune-eval-intuition"
  | "free-gpu-landscape"
  // LLM Fine-Tuning: In Practice course (intermediate)
  | "sft-pipeline"
  | "chat-templates"
  | "finetune-data-curation"
  | "finetune-memory-math"
  | "finetune-hyperparameters"
  | "finetune-evaluation"
  | "adapter-serving"
  // LLM Fine-Tuning: At Scale course (expert)
  | "finetune-decision-architecture"
  | "finetune-data-engine"
  | "preference-tuning"
  | "training-stability"
  | "model-merging-distillation"
  | "failure-forensics"
  | "free-gpu-finetuning"
  // AI Security: Foundations course (beginner)
  | "ai-attack-surface"
  | "owasp-llm-top-ten"
  | "prompt-injection"
  | "jailbreak-techniques"
  | "llm-data-leakage"
  | "guardrail-basics"
  | "model-supply-chain"
  | "agent-permissions"
  | "security-ux-tradeoffs"
  // AI Security: In Practice course (intermediate)
  | "ai-threat-modeling"
  | "io-filtering"
  | "sandboxing-least-privilege"
  | "pii-redaction"
  | "rag-security"
  | "agent-tool-security"
  | "ai-incident-drills"
  | "defensive-evals"
  // AI Security: At Scale course (expert)
  | "adversarial-robustness"
  | "multi-agent-trust"
  | "ai-incident-response"
  | "security-architecture-review"
  | "continuous-red-teaming"
  | "security-risk-governance"
  // AI Agents: In Practice course (intermediate)
  | "react-loop";

export interface CodeExercise {
  id: string;
  title: string;
  prompt: string;
  starterCode: string;
  /** Hidden test — must set `ok = True` (and optionally `message`) when passing. */
  testCode: string;
}

export interface Byte {
  slug: string;
  title: string;
  subtitle: string;
  topic: string;
  season: number;
  order: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  interviewTags: readonly string[];
  skillIds?: readonly SkillId[];
  /** Plain-language capability earned by completing the unit. */
  capability?: string;
  /** Estimated minutes. */
  minutes: number;
  /** Sections of the lesson body. */
  sections: {
    heading?: string;
    paragraphs: string[];
    /** Optional fenced code shown for illustration (not runnable). */
    code?: { lang: string; source: string };
  }[];
  questions: ByteQuestion[];
  exercise?: CodeExercise;
}

/**
 * Course content contract. Courses are authored as one module per course
 * under content/courses/ and aggregated by content/courses/index.ts.
 */
/**
 * The anchor-led concept brief that opens a lesson (v6 authoring contract):
 * Anchor (everyday metaphor, FIRST) / What / Why / Where / When NOT — each
 * 1–2 sharp sentences, key terms in **bold** (rendered through the shared
 * Inline formatter). The anchor also feeds the shareable cheat-sheet card.
 */
export type ConceptBrief = {
  /** Anchor: the one-sentence everyday metaphor — something a 10-year-old touches. Rendered FIRST. */
  anchor: string;
  /** What: the 10-second plain-English summary. */
  what: string;
  /** Why: the core benefit or problem it solves. */
  why: string;
  /** Where: 2–3 specific real-world applications. */
  where: readonly string[];
  /** When NOT to use: the practical boundary rule. */
  whenNot: string;
};

/**
 * The standardized system diagram rendered BELOW a lesson's story infographic
 * (v5 contract). Plain data — the renderer maps it onto the shared flow
 * primitives (`components/infographic/flow.tsx`). It is the compact reference
 * view of the idea the infographic above told as a story: bracket node
 * patterns, terse captions, no re-narration.
 */
export type DiagramNodeKind = "input" | "process" | "output" | "decision";

export type DiagramTree =
  | {
      kind: "decision";
      /** The question, rendered as < question >. */
      question: string;
      caption?: string;
      branches: readonly { label: string; node: DiagramTree }[];
    }
  | {
      kind: "leaf";
      /** The outcome, rendered as [ answer ]. */
      answer: string;
      caption?: string;
    };

export type LessonDiagram =
  | {
      kind: "flow";
      steps: readonly {
        kind: DiagramNodeKind;
        text: string;
        caption?: string;
      }[];
      /** Loop-back annotation for cyclical processes. */
      loop?: string;
    }
  | {
      kind: "compare";
      left: { title: string; subtitle?: string };
      right: { title: string; subtitle?: string };
      rows: readonly { label: string; left: string; right: string }[];
    }
  | {
      kind: "decision";
      root: DiagramTree;
    };

export type Lesson = {
  /** Folder/component slug. Must match a key in components/infographic/index.tsx. */
  slug: string;
  title: string;
  /** One-line summary shown on the course index and the lesson header. */
  blurb: string;
  /** Topic tag, for future filtering and mastery grouping. */
  topic: string;
  skillIds?: readonly SkillId[];
  capability?: string;
  /** Estimated minutes to read + attempt. Shown in the byte chip. */
  minutes?: number;
  /** Anchor-led explanation (Anchor/What/Why/Where/When NOT) shown before the infographic. */
  concept?: ConceptBrief;
  /** Standardized system diagram shown below the infographic (reference view). */
  diagram?: LessonDiagram;
  /** ~100-200 words of explanation, rendered as paragraphs under the infographic. */
  prose?: string[];
  /** Optional runnable Python exercise (Pyodide). */
  exercise?: CodeExercise;
  /** Exactly 2 real-life scenario MCQs (v5 contract). All correct to complete. */
  questions?: ByteQuestion[];
};

/**
 * Skill depth of a course, used for browse/filter on `/courses`.
 *
 * Note: this is a *skill-level* axis (how technical the material is), distinct
 * from the `trackPriority` persona axis in `catalog.ts` (beginner/grad/
 * engineer/founder, which drives `/learn`'s recommendation). The two are
 * intentionally separate — do not conflate them.
 */
export type CourseLevel = "beginner" | "intermediate" | "expert";

/**
 * Top-level field a course belongs to. Drives the domain filter on `/courses`.
 * Add a new value here when you introduce a new field of study.
 */
export type CourseDomain =
  | "Machine Learning"
  | "Cybersecurity"
  | "Artificial Intelligence"
  | "AI Observability"
  | "AI Engineering";

/**
 * Monetization tier for browse/gate UX.
 * - free: full SSR content, public SEO, readable without sign-in
 * - paid: listing + soft login (payment later); do not full-index paid lesson bodies when added
 */
export type CourseAccess = "free" | "paid";

export type Course = {
  /** URL segment under `/courses/`. */
  slug: string;
  title: string;
  subtitle: string;
  /** Optional longer description for the course landing page. */
  description?: string;
  /** Skill depth — drives the level filter and badge on `/courses`. */
  level: CourseLevel;
  /**
   * Authoring-pedagogy override. When set, the course is authored with the
   * `infographics-interactive-matured_v1` skill regardless of `level` — for
   * practitioner audiences who already own the vocabulary: artifact anchors,
   * technical referents, decomposed builds, postmortem MCQs.
   */
  pedagogy?: "matured-v1";
  /** Field of study — drives the domain filter and grouping on `/courses`. */
  domain: CourseDomain;
  /** free | paid — free courses are public SEO; paid soft-gate until checkout exists */
  access: CourseAccess;
  /** Optional human-readable prerequisite line, shown on the course page. */
  prerequisites?: string;
  lessons: Lesson[];
};
