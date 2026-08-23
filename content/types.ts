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
  | "security-risk-governance";

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
