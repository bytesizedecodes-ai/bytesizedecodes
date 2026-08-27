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
    id: "unsupervised-learning",
    label: "Unsupervised learning",
    description: "Discover groups and structure in data that has no labels.",
  },
  {
    id: "reinforcement-learning",
    label: "Reinforcement learning",
    description: "Explain how an agent learns from rewards and penalties by trying.",
  },
  {
    id: "feature-engineering",
    label: "Features",
    description: "Turn raw facts about a sample into numbers a model can learn from.",
  },
  {
    id: "classification-basics",
    label: "Classification",
    description: "Predict a category for a new sample by drawing a decision boundary.",
  },
  {
    id: "k-nearest-neighbors",
    label: "k-nearest neighbours",
    description: "Classify a new sample by letting its closest neighbours vote.",
  },
  {
    id: "centroid-classifier",
    label: "Centroid classifier",
    description: "Classify by distance to the average member of each class.",
  },
  {
    id: "decision-trees",
    label: "Decision trees",
    description: "Read and build rule trees that split data one question at a time.",
  },
  {
    id: "ml-applications",
    label: "ML in the wild",
    description: "Recognise the machine learning already running in products you use daily.",
  },
  {
    id: "ml-limits",
    label: "Limits of ML",
    description: "Anticipate how ML fails — bias, bad data, and brittleness — before it ships.",
  },
  {
    id: "train-test-split",
    label: "Train/test split",
    description: "Grade a model on data it has never seen, not on what it studied.",
  },
  {
    id: "overfitting",
    label: "Overfitting",
    description: "Tell memorising from understanding and spot each in results.",
  },
  {
    id: "data-quality",
    label: "Data quality",
    description: "Reason about how bad data poisons a model before algorithms matter.",
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
  // Harness Engineering: Foundations course
  {
    id: "harness-basics",
    label: "The AI harness",
    description: "Separate the model from the scaffolding that turns it into a product.",
  },
  {
    id: "prompt-fundamentals",
    label: "Prompt fundamentals",
    description: "Structure role, rules, examples, and format to steer the same model reliably.",
  },
  {
    id: "context-window-basics",
    label: "Context windows",
    description: "Reason about what the model can see each turn — and what falls out.",
  },
  {
    id: "tool-use-basics",
    label: "Tool use",
    description: "Explain how a model requests actions and a harness executes them safely.",
  },
  {
    id: "agent-loops",
    label: "Agent loops",
    description: "Follow the think–act–observe cycle and know when to stop it.",
  },
  {
    id: "agent-vs-pipeline",
    label: "Agents vs pipelines",
    description: "Choose between a fixed pipeline, a single call, and a full agent.",
  },
  // Harness Engineering: In Practice course
  {
    id: "context-engineering",
    label: "Context engineering",
    description: "Decide what fills a finite context window under a token budget.",
  },
  {
    id: "tool-design",
    label: "Tool design",
    description: "Design tool schemas, descriptions, and error messages models choose well.",
  },
  {
    id: "system-prompt-design",
    label: "System prompt design",
    description: "Structure prompts that keep behavior consistent as the harness grows.",
  },
  {
    id: "agent-memory",
    label: "Agent memory",
    description: "Manage episodic and semantic memory, compaction, and state across turns.",
  },
  {
    id: "structured-output",
    label: "Structured output",
    description: "Get machine-readable output with schemas, validation, and repair loops.",
  },
  {
    id: "harness-guardrails",
    label: "Harness guardrails",
    description: "Catch hallucinated calls, runaway loops, and injected instructions in code.",
  },
  {
    id: "harness-observability",
    label: "Harness observability",
    description: "Trace prompt versions, context assembly, tool calls, and retries.",
  },
  {
    id: "harness-evals",
    label: "Harness evals",
    description: "Judge harness changes with task suites and pass rates, not demos.",
  },
  {
    id: "cost-latency-engineering",
    label: "Cost & latency engineering",
    description: "Cut spend and delay with caching, model routing, and streaming.",
  },
  // Harness Engineering: At Scale course
  {
    id: "multi-agent-orchestration",
    label: "Multi-agent orchestration",
    description: "Split work across specialists — and know when one agent wins.",
  },
  {
    id: "long-horizon-autonomy",
    label: "Long-horizon autonomy",
    description: "Run hour-long agent tasks with checkpoints, verification, and recovery.",
  },
  {
    id: "eval-systems",
    label: "Eval systems",
    description: "Gate every harness change with CI suites, canaries, and significance.",
  },
  {
    id: "harness-vs-finetuning",
    label: "Harness vs fine-tuning",
    description: "Decide what belongs in scaffolding and what belongs in the weights.",
  },
  {
    id: "agent-security",
    label: "Agent security",
    description: "Design for injection, least privilege, and irreversible-action approval.",
  },
  {
    id: "self-improving-harness",
    label: "Self-improving harnesses",
    description: "Turn production corrections into flywheels — without metric capture.",
  },
  {
    id: "harness-reliability",
    label: "Harness reliability",
    description: "Make retries safe with idempotency, and degrade gracefully when models fail.",
  },
  {
    id: "production-harness-anatomy",
    label: "Production harness anatomy",
    description: "Read real harness blueprints and run a design review of your own.",
  },
  // RAG Engineering: Foundations course
  {
    id: "rag-basics",
    label: "RAG basics",
    description: "Explain retrieval-augmented generation as an open-book setup for a model.",
  },
  {
    id: "embeddings-basics",
    label: "Embeddings",
    description: "See embeddings as locations on a map where similar meanings sit close together.",
  },
  {
    id: "similarity-search-basics",
    label: "Similarity search",
    description: "Find the nearest pages to a question and pick the top few.",
  },
  {
    id: "rag-pipeline",
    label: "The RAG pipeline",
    description: "Trace a question through search, context, and a cited answer.",
  },
  {
    id: "rag-failure-basics",
    label: "RAG failures",
    description: "Diagnose wrong-page, stale-page, and ignored-page failures in plain terms.",
  },
  {
    id: "rag-vs-alternatives",
    label: "RAG vs alternatives",
    description: "Choose between pasting context, a database, and RAG for a task.",
  },
  // RAG Engineering: In Practice course
  {
    id: "chunking-strategy",
    label: "Chunking strategy",
    description: "Split documents so every chunk stays meaningful and retrievable on its own.",
  },
  {
    id: "embedding-selection",
    label: "Embedding selection",
    description: "Pick an embedding model with your own data — and price the reindex.",
  },
  {
    id: "hybrid-search",
    label: "Hybrid search",
    description: "Combine semantic and keyword retrieval so exact matches survive ranking.",
  },
  {
    id: "reranking",
    label: "Reranking",
    description: "Recall wide with cheap search, then read closely with a reranker.",
  },
  {
    id: "query-understanding",
    label: "Query understanding",
    description: "Rewrite, decompose, and expand questions before they hit the index.",
  },
  {
    id: "grounded-citations",
    label: "Grounded citations",
    description: "Answer only from retrieved pages, cite claims, and refuse on gaps.",
  },
  {
    id: "rag-metrics",
    label: "RAG evaluation metrics",
    description: "Score retrieval and generation separately — the four questions.",
  },
  {
    id: "rag-observability",
    label: "RAG observability",
    description: "Trace queries, chunks, scores, and reranks to explain every answer.",
  },
  {
    id: "rag-ingestion",
    label: "RAG ingestion",
    description: "Run parse → chunk → embed → index with metadata, sync, and deletes.",
  },
  // RAG Engineering: At Scale course
  {
    id: "advanced-retrieval",
    label: "Advanced retrieval",
    description: "Answer cross-document questions with hierarchy, context, and multi-hop.",
  },
  {
    id: "agentic-rag",
    label: "Agentic RAG",
    description: "Let the model drive retrieval — with sufficiency checks and a budget.",
  },
  {
    id: "graphrag",
    label: "GraphRAG",
    description: "Build knowledge graphs for relationship questions vectors can't answer.",
  },
  {
    id: "permission-aware-retrieval",
    label: "Permission-aware retrieval",
    description: "Enforce ACLs and tenant isolation at query time, before context forms.",
  },
  {
    id: "index-lifecycle",
    label: "Index lifecycle",
    description: "Keep a 40k-doc index fresh: sync, deletes, drift, dual-index migrations.",
  },
  {
    id: "rag-vs-long-context",
    label: "RAG vs long context",
    description: "Decide between retrieval and million-token windows on cost and freshness.",
  },
  {
    id: "production-rag-evals",
    label: "Production RAG evals",
    description: "Run online evals, drift dashboards, and CI gates on live traffic.",
  },
  {
    id: "production-rag-anatomy",
    label: "Production RAG anatomy",
    description: "Read real RAG blueprints and run the architecture review.",
  },
  // Machine Learning: intermediate bridge lessons
  {
    id: "regression-basics",
    label: "Regression",
    description: "Predict a number by reading it off the trend in past examples.",
  },
  {
    id: "logistic-regression",
    label: "Logistic regression",
    description: "Turn a weighted sum of features into a probability of yes/no.",
  },
  {
    id: "loss-functions",
    label: "Loss functions",
    description: "Score how wrong a prediction is so learning has a target.",
  },
  {
    id: "neural-network-basics",
    label: "Neural networks",
    description: "Build models from layers of weighted neurons with activations.",
  },
  {
    id: "backpropagation",
    label: "Backpropagation",
    description: "Trace error backward through layers to update every weight.",
  },
  {
    id: "bias-variance",
    label: "Bias–variance",
    description: "Diagnose underfitting vs overfitting from train-vs-test error.",
  },
  {
    id: "ensemble-methods",
    label: "Ensembles",
    description: "Combine many weak models into one strong committee.",
  },
  {
    id: "cross-validation",
    label: "Cross-validation",
    description: "Estimate real-world performance by rotating the test fold.",
  },
  {
    id: "data-leakage",
    label: "Data leakage",
    description: "Spot information from the future contaminating training data.",
  },
  // Advanced Machine Learning course (expert)
  {
    id: "deep-representations",
    label: "Deep representations",
    description: "Explain why stacked layers build features width alone can't.",
  },
  {
    id: "optimizers",
    label: "Optimizers",
    description: "Choose SGD vs Adam and set learning rates that converge.",
  },
  {
    id: "deep-regularization",
    label: "Deep regularization",
    description: "Fight overfitting with dropout, batch norm, early stopping, augmentation.",
  },
  {
    id: "cnn-architectures",
    label: "CNNs",
    description: "Use convolutional filters, feature hierarchies, and transfer learning.",
  },
  {
    id: "attention-mechanism",
    label: "Attention",
    description: "Let each token pull in the context that matters for it.",
  },
  {
    id: "transformer-architecture",
    label: "Transformers",
    description: "Read the Q/K/V, multi-head, decoder-only stack behind GPT.",
  },
  {
    id: "llm-training-pipeline",
    label: "LLM training pipeline",
    description: "Walk pretraining → SFT → RLHF and what each stage costs.",
  },
  {
    id: "lora-fine-tuning",
    label: "LoRA fine-tuning",
    description: "Adapt a frozen base model with small rank adapters and quantization.",
  },
  {
    id: "alignment-techniques",
    label: "Alignment",
    description: "Shape model behaviour with reward models, RLHF, and DPO.",
  },
  {
    id: "diffusion-models",
    label: "Diffusion models",
    description: "Generate images (and now text) by learning to denoise.",
  },
  {
    id: "multimodal-embeddings",
    label: "Multimodal models",
    description: "Map images and text into one shared embedding space.",
  },
  {
    id: "efficient-architectures",
    label: "Efficient architectures",
    description: "Trade attention for MoE routing and state-space linear time.",
  },
  {
    id: "production-ml-lifecycle",
    label: "Production ML lifecycle",
    description: "Run the train → eval → deploy → drift → retrain loop.",
  },
  // LLM Fine-Tuning courses
  {
    id: "finetune-intuition",
    label: "Fine-tuning intuition",
    description: "Explain what fine-tuning changes inside a model — and what it can't.",
  },
  {
    id: "finetune-vs-prompting",
    label: "Prompting vs fine-tuning",
    description: "Choose between repeating instructions and training them in.",
  },
  {
    id: "finetune-data-intuition",
    label: "Training data intuition",
    description: "See how examples, datasets, and formats shape what a model learns.",
  },
  {
    id: "finetune-risks",
    label: "Fine-tuning risks",
    description: "Spot memorization and skill-loss before they ship in your model.",
  },
  {
    id: "when-to-finetune",
    label: "When to fine-tune",
    description: "Separate behaviour problems from knowledge problems before training.",
  },
  {
    id: "lora-intuition",
    label: "LoRA intuition",
    description: "Understand small clip-on adapters that change a model without rebuilding it.",
  },
  {
    id: "finetune-eval-intuition",
    label: "Eval intuition",
    description: "Judge a fine-tune on new questions, not the ones it studied.",
  },
  {
    id: "free-gpu-landscape",
    label: "Free GPU options",
    description: "Know what Colab and Kaggle give away — and their limits.",
  },
  {
    id: "sft-pipeline",
    label: "Supervised fine-tuning",
    description: "Run the example → loss → update loop that teaches a model your task.",
  },
  {
    id: "chat-templates",
    label: "Chat templates",
    description: "Format conversations so training and inference read exactly the same script.",
  },
  {
    id: "finetune-data-curation",
    label: "Dataset curation",
    description: "Build small clean datasets that beat big messy ones.",
  },
  {
    id: "finetune-memory-math",
    label: "Training memory math",
    description: "Compute the VRAM a fine-tune needs before you rent the GPU.",
  },
  {
    id: "finetune-hyperparameters",
    label: "Fine-tuning dials",
    description: "Set learning rate, epochs, and batch for a stable fine-tune.",
  },
  {
    id: "finetune-evaluation",
    label: "Fine-tune evaluation",
    description: "Design evals and gates that catch a bad fine-tune before users do.",
  },
  {
    id: "adapter-serving",
    label: "Adapter serving",
    description: "Merge, export, and serve a fine-tuned model on modest hardware.",
  },
  {
    id: "finetune-decision-architecture",
    label: "The tuning decision",
    description: "Route a problem across prompting, RAG, SFT, and continued pretraining.",
  },
  {
    id: "finetune-data-engine",
    label: "The data engine",
    description: "Generate, license, and decontaminate training data at scale.",
  },
  {
    id: "preference-tuning",
    label: "Preference tuning",
    description: "Choose and run DPO, ORPO, PPO, and GRPO on preference pairs.",
  },
  {
    id: "training-stability",
    label: "Training stability",
    description: "Keep long fine-tunes healthy: schedules, packing, checkpointing.",
  },
  {
    id: "model-merging-distillation",
    label: "Merging & distillation",
    description: "Compress and combine fine-tunes into cheaper serving models.",
  },
  {
    id: "failure-forensics",
    label: "Failure forensics",
    description: "Triage a broken fine-tune from data bug to objective mismatch.",
  },
  {
    id: "free-gpu-finetuning",
    label: "Free-GPU fine-tuning",
    description: "Run a full QLoRA fine-tune on Colab or Kaggle free tiers.",
  },
  {
    id: "ai-attack-surface",
    label: "AI attack surface",
    description: "Map every door an AI feature opens — inputs, actions, data, outputs.",
  },
  {
    id: "owasp-llm-top-ten",
    label: "OWASP LLM Top Ten",
    description: "Use the industry's ranked list of AI app risks to audit by damage.",
  },
  {
    id: "prompt-injection",
    label: "Prompt injection",
    description: "Spot instructions smuggled inside data, and layer the defenses.",
  },
  {
    id: "jailbreak-techniques",
    label: "Jailbreak patterns",
    description: "Recognise roleplay, urgency, code-speak, and step-by-step bends.",
  },
  {
    id: "llm-data-leakage",
    label: "Data leakage paths",
    description: "Close the three leak paths: pasted prompts, training data, logs.",
  },
  {
    id: "guardrail-basics",
    label: "Guardrail basics",
    description: "Treat input/output checks as fast pattern bouncers, not mind-readers.",
  },
  {
    id: "model-supply-chain",
    label: "Model supply chain",
    description: "Vet model files like a caterer: named source, sealed box, taste-test.",
  },
  {
    id: "agent-permissions",
    label: "Agent least privilege",
    description: "Give agents one small key per errand and a human at the vault.",
  },
  {
    id: "security-ux-tradeoffs",
    label: "Security friction budgets",
    description: "Spend user patience at the vault, keep the fast lane free.",
  },
  {
    id: "ai-threat-modeling",
    label: "AI threat modelling",
    description: "Run STRIDE-for-AI on one page: assets, adversaries, doors.",
  },
  {
    id: "io-filtering",
    label: "I/O filtering",
    description: "Build detection layers at every boundary — in and out.",
  },
  {
    id: "sandboxing-least-privilege",
    label: "Sandboxing & least privilege",
    description: "Bound the blast radius of tools, files, and API scopes.",
  },
  {
    id: "pii-redaction",
    label: "PII redaction",
    description: "Scrub names, numbers, and keys before the model ever sees them.",
  },
  {
    id: "rag-security",
    label: "RAG security",
    description: "Defend retrieval: poisoned corpora, injected pages, permission gaps.",
  },
  {
    id: "agent-tool-security",
    label: "Agent & tool security",
    description: "Allow-lists, approval gates, and trust boundaries for tools and MCP.",
  },
  {
    id: "ai-incident-drills",
    label: "AI incident drills",
    description: "Rehearse minute one: contain, preserve evidence, notify.",
  },
  {
    id: "defensive-evals",
    label: "Defensive evals",
    description: "Turn attack suites into CI tests that catch security regressions.",
  },
  {
    id: "adversarial-robustness",
    label: "Adversarial robustness",
    description: "Assess evasion, poisoning, and extraction risk at production scale.",
  },
  {
    id: "multi-agent-trust",
    label: "Multi-agent trust",
    description: "Design permission architectures and delegation limits between agents.",
  },
  {
    id: "security-architecture-review",
    label: "Secure design reviews",
    description: "Keep threat models alive inside the design review, not shelved.",
  },
  {
    id: "continuous-red-teaming",
    label: "Continuous red-teaming",
    description: "Run programs, not one-offs: automation, bounties, fix-rate tracking.",
  },
  {
    id: "security-risk-governance",
    label: "Risk governance",
    description: "Own risks in a register: evidence, price, acceptor, review date.",
  },
  // AI Agents: In Practice course
  {
    id: "react-loop",
    label: "The ReAct trace",
    description: "Read an agent transcript — roles, tool calls, and the cost of re-sent context.",
  },
] as const;

export function getSkill(id: SkillId): SkillDefinition {
  return SKILLS.find((skill) => skill.id === id)!;
}
