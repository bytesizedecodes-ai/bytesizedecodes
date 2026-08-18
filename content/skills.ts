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
  // LLM Observability (intermediate) + AI Observability: Reliability (expert)
  {
    id: "otel-genai",
    label: "GenAI telemetry standards",
    description: "Read an OpenTelemetry GenAI / OpenInference span and choose what to instrument.",
  },
  {
    id: "llm-instrumentation",
    label: "Instrumenting LLM apps",
    description: "Add the right context (model, prompt, retrieval, tool, release) to every span.",
  },
  {
    id: "telemetry-privacy",
    label: "Telemetry privacy",
    description: "Keep prompts and outputs out of logs that shouldn't see them.",
  },
  {
    id: "ai-slo",
    label: "AI service levels",
    description: "Turn fuzzy quality goals into measurable SLOs and error budgets.",
  },
  {
    id: "offline-evaluation",
    label: "Offline evaluation",
    description: "Build a golden set and regression suite to validate changes before shipping.",
  },
  {
    id: "online-evaluation",
    label: "Online evaluation",
    description: "Sample and evaluate live traffic to catch what offline misses.",
  },
  {
    id: "llm-judge",
    label: "LLM-as-a-judge",
    description: "Use a model to grade outputs, and know when a judge disagrees with humans.",
  },
  {
    id: "eval-bias",
    label: "Evaluation bias",
    description: "Spot and reduce position, verbosity, and self-preference bias in judges.",
  },
  {
    id: "rag-evaluation",
    label: "RAG evaluation",
    description: "Measure retrieval and grounding with faithfulness, relevance, and context metrics.",
  },
  {
    id: "eval-gates",
    label: "Eval gates & releases",
    description: "Compare releases, canary, and block deploys on regressions.",
  },
  {
    id: "ai-incident-response",
    label: "AI incident response",
    description: "Triage an AI incident from alert to written diagnosis.",
  },
  {
    id: "telemetry-strategy",
    label: "Telemetry strategy",
    description: "Choose standards and vendors without locking in.",
  },
  {
    id: "telemetry-pipeline",
    label: "Telemetry pipeline",
    description: "Design collection, sampling, storage, and retention at scale.",
  },
  {
    id: "ai-security",
    label: "AI security (OWASP LLM)",
    description: "Map the OWASP LLM Top 10 to telemetry signals you can detect.",
  },
  {
    id: "ai-red-teaming",
    label: "AI red-teaming",
    description: "Probe for prompt injection, extraction, and exfiltration at scale.",
  },
  {
    id: "ai-guardrails",
    label: "AI guardrails",
    description: "Apply input/output guardrails and read their (evadable) signals honestly.",
  },
  {
    id: "ai-audit-trail",
    label: "AI audit trails",
    description: "Build immutable, replayable evidence for accountability.",
  },
  {
    id: "ai-compliance",
    label: "AI compliance",
    description: "Map observability to controls: EU AI Act, NIST AI RMF, ISO 42001, SR 11-7.",
  },
  {
    id: "eu-ai-act",
    label: "EU AI Act",
    description: "Classify AI risk and meet traceability, oversight, and auditability duties.",
  },
  {
    id: "nist-ai-rmf",
    label: "NIST AI RMF",
    description: "Apply Govern, Map, Measure, and Manage to an AI system.",
  },
  {
    id: "llm-drift",
    label: "LLM drift",
    description: "Detect input, output, and semantic drift in generative systems.",
  },
  {
    id: "agent-tracing",
    label: "Agent & tool tracing",
    description: "Trace agent loops, tool calls, handoffs, and budget exhaustion.",
  },
  {
    id: "mcp-observability",
    label: "MCP observability",
    description: "Observe Model Context Protocol tool calls across multi-agent systems.",
  },
] as const;

export function getSkill(id: SkillId): SkillDefinition {
  return SKILLS.find((skill) => skill.id === id)!;
}
