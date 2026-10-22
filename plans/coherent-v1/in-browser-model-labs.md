# In-Browser Model Labs: the Transformer-Explainer pattern, across every course

**Status:** proposal (brainstorm, Oct 2026) — not yet approved for build.
**Goal:** every course gets the "a real model is running in YOUR browser" moment
that Transformer Explainer delivers — using a tiny shared model kit, the ByteSized
Decodes design system, and our existing lesson anatomy.

Reference implementation: [poloclub/transformer-explainer](https://github.com/poloclub/transformer-explainer)
(MIT) — real GPT-2 small (124M) running client-side via ONNX Runtime Web,
Svelte + D3 front end, ~660 MB fp32 model downloaded on demand.

---

## 1. The model kit (shared across ALL courses)

Not one model per course/topic. **Five tiny models + one desktop-only anatomy
model**, all quantized, all loaded lazily through one shared loader and cached
by the browser. A learner who meets MiniLM in Machine Learning for Layman
reuses it instantly in the RAG trilogy.

| # | Model | Params | Download (quantized) | Teaches | Courses served |
|---|---|---|---|---|---|
| 1 | `Xenova/all-MiniLM-L6-v2` | 22M | ~25 MB | Embeddings, similarity, retrieval, clustering | ML Layman, ML, RAG ×3, fine-tuning, observability |
| 2 | `Xenova/ms-marco-MiniLM-L-6-v2` | 22M | ~25 MB | Cross-encoder reranking (query+doc scored *together*) | RAG in-practice, RAG at-scale |
| 3 | `Xenova/distilbert-base-uncased-finetuned-sst-2-english` | 66M | ~65 MB | Classification, confidence, thresholds, adversarial flips | ML Layman, ML, AI Security ×3 |
| 4 | `Xenova/distilbert-base-cased-finetuned-conll03-english` | 65M | ~65 MB | NER / PII detection | AI security in-practice, LLM observability |
| 5 | `HuggingFaceTB/SmolLM2-135M(-Instruct)` | 135M | ~110 MB each (shared tokenizer) | Generation, logits, temperature/top-k/top-p, prompt A/B, prompt injection, base-vs-instruct | Fine-tuning ×3, Harness ×3, RAG, AI Security, observability |
| 6 | GPT-2 small ONNX (Polo Club `model-v2`, exposes attention scores) | 124M | ~660 MB fp32 | Full transformer anatomy: Q/K/V, 12-head attention maps | Advanced ML only — **desktop, explicit opt-in** |

Plus **zero-weight widgets**: tokenizers only (~2 MB `tokenizer.json`) — token
counters, context-window fill bars, chat-template viewers. Free to use on any
lesson including mobile.

**Hard rules**
- Nothing over ~150 MB except GPT-2, which is desktop + click-to-consent only.
- Mobile: WASM only for models ≤ 70 MB; larger models show a "best on desktop" fallback.
- Never auto-download on page load — consent gate with exact size, "stays on your device, one time".

---

## 2. Widget archetypes (the reusable vocabulary)

Each archetype is ONE React component, branded, reused by many lessons with
different configs. Model-backed archetypes hit a real model; SIM/decision
archetypes are deterministic procedural widgets (no download) for concepts a
pretrained tiny model genuinely cannot show (e.g. overfitting mid-training).

| Archetype | Model | Learner interaction |
|---|---|---|
| **TokenLab** | tokenizer only | Type text → watch it split into coloured tokens with IDs; context-window fill bar |
| **SimilarityLab** | MiniLM | Two/three sentences → live cosine-similarity bars; embedding shown as a heat strip |
| **SearchLab** | MiniLM (+ cross-encoder for rerank mode) | Query a tiny fixed corpus → ranked chunks with score bars; chunk-size / hybrid-weight / rerank toggles |
| **ClassLab** | DistilBERT-SST2 | Type a review → confidence bars; threshold slider with live precision/recall; "attack mode" adds words that flip it |
| **NerLab** | DistilBERT-CoNLL | Paste text → names/locations/PII highlighted live; toggle "redact" |
| **GenLab** | SmolLM2-Instruct | Prompt → streaming generation with temperature / top-k / top-p sliders; probability bars for next token |
| **PromptAB** | SmolLM2 base + Instruct | Same seed, two prompt panels side-by-side (0-shot vs few-shot, base vs instruct, weak vs strong system prompt) |
| **InjectionLab** | SmolLM2-Instruct | A protected system prompt + an editable user message — try to break it live; the model *does* break, locally and safely |
| **GroundLab** | MiniLM | Given source + answer → grounding score; learner edits the answer to slip a hallucination past it |
| **AttentionLab** | GPT-2 (desktop) | Hover a token → attention lines to every other token; layer/head selector |
| **QuantXray** | MiniLM weights | Dump the same layer in fp32 vs int8 → histograms, size delta — quantization you can see |
| **SimWidget / DecisionWidget** | none | Deterministic procedural simulations and decision trees (overfitting curves, LoRA rank, agent permission sims) |

**Teaching pattern every lab follows** (the Polo Club formula, layman-ised):
1. **Input** — the learner types their own text (never a fixed demo only).
2. **Observe** — real numbers appear (probabilities, similarities, attention lines).
3. **Break it** — one guided "now try this" nudge that makes the model fail or flip.
4. **Reflect** — the lesson's two scenario MCQs reference what they just saw.

---

## 3. Lesson-by-lesson mapping

Legend: **Lab** = real model download · **TOK** = tokenizer-only · **SIM/DEC** = procedural (no download) · **IFRAME** = MIT-licensed external explainer.

### machine-learning-for-layman (beginner, free)
| Lesson | Widget | How it teaches |
|---|---|---|
| how-humans-learn | SIM | Human-learning game, no model needed |
| humans-vs-machines | SIM | Rules vs pattern contrast game |
| what-is-ml-layman | **ClassLab** | First model moment: type any review, watch it judge — "that's ML" |
| three-ml-paradigms | ClassLab | Supervised demo anchored by the lab |
| supervised-learning-deep-dive | ClassLab | More labelled examples → confidence shifts |
| predicting-numbers | SIM | Draggable regression line |
| unsupervised-learning-deep-dive | **SimilarityLab (cluster mode)** | 12 sentences auto-group by embedding — clustering you can read |
| reinforcement-learning-deep-dive | SIM | Reward-grid game |
| features-and-vectors | **SimilarityLab (vector view)** | Sentence → 384-number heat strip: "this is what a machine reads" |
| first-classifier | ClassLab | Build a spam-ish classifier by examples |
| multiple-features | SimilarityLab | Adding context improves the similarity signal |
| knn-neighbors | **SimilarityLab (kNN mode)** | New sentence finds its 3 nearest neighbours in a 2D embedding scatter |
| centroid-classifier | SimilarityLab (centroid mode) | Class centres computed live on real embeddings |
| decision-tree-rules | SIM | Click-through tree building |
| best-split | SIM | Split-quality bars |
| train-test-split | SIM | Exam vs study-set animation |
| overfitting | SIM | Memorize-vs-generalize curve |
| data-quality | ClassLab | Feed it garbage labels, watch it learn garbage |
| ml-in-your-phone | **TokenLab** | How your keyboard splits what you type — zero download |
| when-ml-fails | ClassLab (attack mode) | Confident, then confidently wrong |

### machine-learning (intermediate, free)
| Lesson | Widget | How it teaches |
|---|---|---|
| what-is-artificial-intelligence | — | prose/infographic |
| what-is-machine-learning | ClassLab | Live supervised learning |
| what-is-deep-learning | TOK | Tokens in, prediction out teaser |
| ai-vs-ml-vs-dl | — | |
| linear-regression | SIM | Residual sliders |
| logistic-regression | **ClassLab** | Logistic regression IS this model — threshold slider, live |
| loss-functions | SIM | Loss landscape |
| gradient-descent | SIM | Ball-rolling hill, learning-rate dial |
| neural-network-basics | SIM | Animated neuron |
| backpropagation-intuition | SIM | Blame-flow animation |
| bias-variance-tradeoff | SIM | Complexity dial |
| ensemble-methods | ClassLab (committee mode) | Run the classifier on perturbed inputs → vote |
| evaluation-metrics | ClassLab (threshold mode) | Slide threshold → precision/recall/F1 recompute live |
| data-leakage-and-imbalance | — | |
| class-imbalance | ClassLab (imbalance sim) | 99% negative data → accuracy lies, visibly |
| kirana-pay-capstone | — | |

### advanced-machine-learning (expert, paid)
| Lesson | Widget | How it teaches |
|---|---|---|
| neurons-and-layers | SIM | |
| how-networks-learn | SIM | |
| regularizing-deep-nets | SIM | Dropout toggle animation |
| convolutional-networks | **IFRAME: CNN Explainer** (MIT) | In-browser CNN, ready-made |
| sequences-to-attention | **AttentionLab** (desktop) | First attention map |
| inside-the-transformer | **AttentionLab (full anatomy)** | Our flagship — Polo Club pattern, our brand |
| llm-training-pipeline | SIM | |
| efficient-fine-tuning | PromptAB | Frozen backbone + prompt vs full control |
| alignment-rlhf | GenLab (vote mode) | Generate 2 outputs, learner picks — that's preference data |
| diffusion-models | **IFRAME: Diffusion Explainer** (MIT) | |
| multimodal-models | — | |
| frontier-architectures | — | |
| production-ml-capstone | — | |

### fine-tuning-foundations (beginner, free)
| Lesson | Widget | How it teaches |
|---|---|---|
| tuning-not-building | ClassLab | A specialist model = a trained chef |
| the-model-read-everything | TOK | Your sentence through the same tokenizer that read the internet |
| behavior-not-facts | PromptAB | Model "knows" style, not your private facts |
| asking-vs-training | PromptAB | Same task: prompt instructions vs example-driven |
| inside-the-weights | SIM | Slider-wall metaphor |
| one-good-example | PromptAB | 0-shot vs 1-shot, same seed |
| practice-makes-patterns | PromptAB | Repetition-count dial |
| parroting-problem | SIM | Copy-machine simulation |
| forgetting-the-basics | SIM | Catastrophic-forgetting animation |
| when-not-to-finetune | DEC | Decision tree widget |
| base-vs-instruct | **PromptAB** | SmolLM2-135M base vs Instruct side-by-side, same prompt — the whole lesson live |
| conversation-scripts | TOK (chat template) | Render your text inside the ChatML script |
| clip-on-lenses | SIM | LoRA rank slider |
| did-it-work | PromptAB (eval mode) | 5 fixed test cases, base vs instruct outputs scored |
| borrow-a-supercomputer | — | |
| the-fine-tuning-journey | — | |

### fine-tuning-in-practice (intermediate)
| Lesson | Widget | How it teaches |
|---|---|---|
| the-transfer-ladder | SIM | |
| prompt-rag-or-finetune | DEC | Interactive decision memo |
| anatomy-of-an-example | TOK (chat template) | One training pair rendered as the model sees it |
| curating-the-dataset | — | |
| train-on-answers-only | TOK | Masked vs unmasked tokens coloured live |
| the-memory-arithmetic | SIM | VRAM calculator with sliders |
| lora-from-first-principles | SIM | Rank slider → parameter count |
| qlora | **QuantXray** | Real fp32→int8 weights from MiniLM: quantization made visible |
| dials-that-matter | GenLab | Temperature/top-p dials on a real model |
| catching-memorization | SIM | Loss curves, train vs val |
| a-small-honest-eval | PromptAB (eval mode) | |
| template-skew | TOK | Train-template vs serve-template mismatch viewer |
| shipping-an-adapter | — | |
| sahayak-capstone | — | |

### fine-tuning-at-scale (expert) — SIM-heavy, model where honest
the-decision-architecture DEC · the-data-engine — · objective-landscape SIM · preference-data **GenLab vote mode** · qlora-scaling-limits **QuantXray** · training-stability SIM · multi-stage-pipelines — · evaluation-at-production **PromptAB eval** · the-alignment-tax PromptAB · merge-distill-serve — · failure-forensics SIM · free-gpu-capstone —

### RAG engineering foundations (beginner, free) — the MiniLM showcase
| Lesson | Widget | How it teaches |
|---|---|---|
| what-is-rag | **SearchLab** | 5-doc corpus (a phone manual), ask anything, watch retrieval |
| why-not-paste-everything | **TokenLab (window fill)** | Paste long docs → context window fills up visibly |
| what-are-embeddings | SimilarityLab (vector view) | Words/sentences → heat strips |
| how-similarity-search-works | SearchLab | Query → ranked chunks with score bars |
| the-rag-pipeline | **SearchLab + GenLab (end-to-end)** | Flagship: retrieve with MiniLM, generate with SmolLM2, both live |
| when-rag-gets-it-wrong | SearchLab (failure mode) | Swap corpus → wrong chunk wins; see the score that fooled it |
| when-not-to-use-rag | DEC | |

### RAG engineering in-practice (intermediate)
| Lesson | Widget | How it teaches |
|---|---|---|
| chunking-strategy | **SearchLab (chunk-size slider)** | The killer widget: drag chunk size → retrieval scores move live |
| choosing-embeddings | SearchLab (model switch) | MiniLM vs bge-small on the same corpus, side-by-side |
| hybrid-search | SearchLab (hybrid slider) | Blend BM25 + vector scores with a slider |
| reranking | **SearchLab (rerank toggle)** | Bi-encoder ranking vs cross-encoder reranking, scores recompute |
| query-understanding | GenLab (rewrite mode) | SmolLM2 rewrites your vague query; retrieval improves live |
| citations-and-grounding | **GroundLab** | Edit the answer to slip a hallucination past the grounding check |
| rag-evaluation | SearchLab (eval panel) | 4 questions scored on the live pipeline |
| rag-observability | SearchLab (trace view) | Same lab + span waterfall |
| ingestion-pipeline | TOK + chunk preview | |

### RAG engineering at-scale (expert)
advanced-retrieval **SearchLab (hybrid+rerank)** · agentic-rag SIM · graphrag SIM graph walk · permission-aware-retrieval **SearchLab (permission toggle)** — docs grey out, retrieval obeys · index-lifecycle — · rag-vs-long-context **TokenLab window fill** · production-rag-evals **SearchLab eval** · anatomy-of-production-rag —

### AI security foundations (beginner, free)
| Lesson | Widget | How it teaches |
|---|---|---|
| why-ai-gets-attacked | ClassLab (attack mode) | 99% confident → one word flips it |
| the-owasp-llm-top-ten | — | |
| prompt-injection | **InjectionLab** | Protected system prompt + editable user message — break it live, locally, on a 135M model |
| jailbreaks | InjectionLab | Same arena, different attacks |
| data-leakage | InjectionLab (extraction mode) | Ask the local model to reveal its "secret" |
| guardrails-basics | InjectionLab + filter stage | Attack passes model, gets caught by output filter |
| supply-chain-risk | — | |
| over-permissioned-agents | SIM | Tool-permission simulation |
| when-security-kills-the-product | — | |
| security-capstone | — | |

### AI security in-practice (intermediate, paid)
threat-model-an-app DEC · input-output-filtering **InjectionLab (filter pipeline)** · sandboxes-and-least-privilege SIM · pii-redaction **NerLab** — paste any text, watch names/phones get caught, toggle redaction · securing-rag **SearchLab (poisoned corpus)** — inject a malicious chunk, watch retrieval serve it · securing-agents-and-mcp SIM · red-team-drills **InjectionLab** · defensive-evals PromptAB (eval) · incident-drills — · paisashield-capstone —

### AI security at-scale (expert)
adversarial-robustness **ClassLab (attack mode)** · multi-agent-trust SIM · ai-incident-response — · secure-by-design-reviews DEC · compliance-and-governance — · continuous-red-teaming InjectionLab · the-security-tradeoff-review DEC · setu-capstone —

### Harness engineering foundations (beginner, free)
what-is-an-ai-harness — · raw-model-vs-product **GenLab** — raw SmolLM2's chaos vs the wrapped product · what-is-a-prompt-really **GenLab** · what-is-a-context-window **TokenLab (window fill)** · how-models-use-tools **GenLab (tool-choice)** — SmolLM2 picks a tool from a schema · the-agent-loop SIM loop runner · when-not-to-build-an-agent DEC

### Harness engineering in-practice (intermediate, paid)
context-engineering **TokenLab (packing)** · designing-tools-models-use **GenLab (tool-choice)** · system-prompts-that-hold **InjectionLab** — the system-prompt stress test · agent-memory-and-state SIM · structured-output **GenLab (JSON mode)** — prompt for JSON, live schema validation · guardrails-and-failure-modes InjectionLab · harness-observability — · intro-to-harness-evals PromptAB (eval) · cost-and-latency-engineering TOK + SIM

### Harness engineering at-scale (expert)
mostly SIM/DEC — multi-agent-orchestration SIM · long-horizon-autonomy SIM · evals-as-a-system PromptAB (eval) · harness-vs-finetuning PromptAB · agent-security InjectionLab · self-improving-harnesses — · harness-reliability SIM · anatomy-of-production-harnesses —

### AI observability (beginner, free) + LLM observability (intermediate) + AI observability & reliability (expert)
Model-backed where honest, SIM dashboards elsewhere:
- hallucination-makes-things-up → **GroundLab** (score answers against sources)
- is-the-answer-good → PromptAB (eval mode)
- logs-without-leaking → **NerLab** — PII caught in real log lines
- llm-as-a-judge → GenLab (judge mode) — and honestly show a 135M judge's scores wobbling
- observe-rag-not-just-model → SearchLab (trace view)
- quality-is-a-signal → PromptAB (eval)
- detecting-attacks-in-telemetry → InjectionLab log feed
- detecting-drift-regressions, slos, alerts, dashboards, triage, incidents → SIM dashboards
- everything else in these three courses: SIM/DEC/—

### ai-agents-in-practice (1 lesson)
thought-action-observation → **GenLab (tool-choice)** — SmolLM2 narrates thought, picks tool, observes result in a real loop

---

## 4. The standard build pattern (how we make this repeatable)

### 4.1 Content model (small, additive)

```ts
// content/types.ts — optional new lesson field
lab?: {
  kind: "token" | "similarity" | "search" | "class" | "ner" | "gen"
      | "promptab" | "injection" | "grounding" | "attention" | "quant"
      | "sim" | "decision";
  model?: ModelId;            // from lib/models/manifest.ts; omit = no weights
  config?: Record<string, unknown>;  // archetype-specific (corpus, presets, modes)
};
```

Rendered between `prose` and `exercise` on `/courses/[course]/[lesson]`.
Validated in `content/courses.test.ts` (kind exists, model exists in manifest,
config shape per kind). Infographic lessons keep their `SliderControl`/
`ToggleGroup` playgrounds — a lab is for when a *real model* beats a simulation.

### 4.2 Model infrastructure (`lib/models/`)

- **`manifest.ts`** — every model: id, HF repo, dtype per device (webgpu → q8/fp16, wasm → q8),
  exact byte size, device floor (mobile-ok vs desktop-only). One source of truth;
  the consent UI and the size-budget CI test both read it.
- **`loader.ts`** — singleton per model id. Browser Cache API persistence
  (second visit = instant), in-memory pipeline reuse across widgets and pages,
  progress events for the download UI. WebGPU when available, WASM fallback.
- **`ModelConsent.tsx`** — the gate: "GPT-2 · 660 MB · runs on your device · one
  time". No weights touch a byte before the click. Server never proxies model
  traffic — HF CDN direct.

### 4.3 Widget layer (`components/labs/`)

- `Lab.tsx` — registry: `kind → component`, `dynamic(() => ...)` so zero lab JS
  ships on pages that don't use one (SEO pages stay fast SSR).
- One component per archetype, **styled strictly inside the infographic design
  system**: brand palette fills encode meaning (blue = model, white = learner
  input, grey = your code), dotted grid, small labelled bar charts for every
  number. Numbers are never decorative — every bar the learner sees is a real
  value from the model.
- Each lab implements the 4-step teaching pattern: Input → Observe → Break →
  Reflect, with the "Break" nudge configurable per lesson.

### 4.4 Performance & honesty rules

1. Lessons stay fully SSR — labs are progressive enhancement, never required to
   read the lesson. A learner who never downloads anything still gets the full
   v6 lesson, and Google still indexes it.
2. Labs never gate lesson completion (questions + exercise already do). No
   model = no broken lesson.
3. The "Break" step must show real failures of real models. If a tiny model
   *can't* honestly demonstrate a concept (overfitting mid-training, drift),
   that lesson gets a SIM widget — labeled honestly in the plan above.
4. Desktop-only labs (AttentionLab/GPT-2) degrade to a screenshot + link, never
   a spinner.

### 4.5 Delivery phases

| Phase | Scope | Ships |
|---|---|---|
| **0 — Spike** | Standalone HTML artifact: TokenLab + SimilarityLab in brand style. Feel the interaction before any repo code. | 1–2 days |
| **1 — Foundation** | `lib/models/` (loader + manifest + consent), TokenLab + SimilarityLab wired into 6 lessons of ML for Layman + RAG foundations. Smallest downloads (~25 MB) first. | week 1–2 |
| **2 — Flagships** | GenLab, PromptAB (SmolLM2), SearchLab end-to-end (RAG pipeline lesson, chunking lesson). | week 3–4 |
| **3 — Security** | InjectionLab, ClassLab attack mode, NerLab across the AI Security trilogy + observability PII lesson. | week 5–6 |
| **4 — Anatomy** | AttentionLab on Polo Club's GPT-2 ONNX (desktop opt-in) for Advanced ML; CNN/Diffusion Explainer iframes. | later |

### 4.6 Verification per widget

- Unit: loader caching logic, manifest size sums, config validation in `courses.test.ts`.
- Browser smoke (Playwright, WASM): each lab loads its model, produces output on a
  fixed input, within a size/time budget.
- CI budget: no manifest entry > 150 MB except the declared GPT-2 exception.
- Manual on a low-end Android before each phase ships.

---

## 5. What this buys us

- **Differentiation nobody local has**: interactive model labs in plain English,
  brand-consistent, on every course — vs static video elsewhere.
- **One infra cost, 210-lesson reach**: ~5 models, ~12 widget components.
- **Marketing assets for free**: every lab is a shareable moment ("watch a model
  get fooled — right in your browser") for Bluesky/IG clips.
- **A standard pattern** future courses author against: pick archetype, pick
  model, write config, pass the completeness tests.
