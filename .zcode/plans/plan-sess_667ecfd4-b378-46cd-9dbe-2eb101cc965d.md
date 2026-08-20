# Machine Learning Track: Foundations Refresh + Intermediate Expansion + New Advanced Course

All course content authored per the **`infographics-interactive_v5` skill** (`.agents/skills/infographics-interactive_v5/SKILL.md`) — read it first, along with `docs/content-model.md`. Every lesson: bespoke story infographic component + v5 ConceptBrief + optional diagram + prose + exactly 2 scenario MCQs (+ Pyodide exercise where it fits).

## Phase 0 — Curriculum blueprint doc
Write `plans/coherent-v1/07-machine-learning-track.md` (matching the pattern of `06-ai-observability-intermediate-and-advanced.md`): research summary, gap analysis, full lesson lists below, narrative case, skill ids. This is the durable research deliverable.

## Phase 1 — Foundations (`machine-learning-for-layman`) — small refresh
1. **Add 1 lesson** `predicting-numbers` — regression intuition ("which one" vs "how much"): predicting a number, best-fit line, picture-led, no math.
2. **Modify** `ml-in-your-phone` — add a generative-AI/ChatGPT beat connecting modern GenAI to the three families (refresh prose + one scene, keep existing structure).

## Phase 2 — Expand Intermediate (`machine-learning`, stays free): +10 lessons
Current 4 lessons stay; append 10 bridge lessons (lighter analogies + some code, per v5 intermediate calibration):
1. `linear-regression` — line of best fit, cost of error
2. `logistic-regression` — yes/no probability curve, decision boundary
3. `loss-functions` — "how wrong is wrong" (squared error, cross-entropy)
4. `gradient-descent` — walking downhill, learning rate
5. `neural-network-basics` — neuron, layers, activations (mechanics beyond the current DL definition lesson)
6. `backpropagation-intuition` — forward/backward pass as credit assignment
7. `bias-variance-tradeoff` — underfit/overfit Goldilocks zone (formal version of layman overfitting)
8. `ensemble-methods` — random forest + gradient boosting: committee of weak models
9. `evaluation-metrics` — confusion matrix, precision/recall, cross-validation
10. `data-leakage-and-imbalance` — leakage traps, imbalanced data

## Phase 3 — New course: Advanced Machine Learning (expert, paid)
Slug `advanced-machine-learning`, `level: "expert"`, `access: "paid"`, `domain: "Machine Learning"`, `prerequisites` referencing the intermediate course. Narrative case running through all lessons (à la RAG's "Atlas"): a small team ("Mango Labs") growing a model from a toy classifier to a fine-tuned LLM product. 13 lessons, problem-first expert calibration, ending in a capstone per house pattern:

1. `neurons-and-layers` — weights as dials, activations, why depth beats width
2. `how-networks-learn` — forward pass, loss, backprop, optimizers (SGD→Adam), learning rate
3. `regularizing-deep-nets` — dropout, batch norm, early stopping, augmentation + when NOT to bother
4. `convolutional-networks` — sliding filters, feature hierarchy (edges→shapes→objects), transfer learning
5. `sequences-to-attention` — why RNN memory fades; the attention spotlight
6. `inside-the-transformer` — Q/K/V as lookup, multi-head, positional encoding, the GPT block
7. `llm-training-pipeline` — tokenization, pretraining → SFT → RLHF, scaling laws, cost per stage
8. `efficient-fine-tuning` — LoRA adapters, quantization, distillation; when fine-tuning is the wrong tool
9. `alignment-rlhf` — reward models, RLHF vs DPO, choosing between two answers
10. `diffusion-models` — noise→image denoising, why diffusion won; diffusion LLMs frontier
11. `multimodal-models` — CLIP shared embedding space, vision-language models
12. `frontier-architectures` — MoE expert routing, Mamba/SSM linear time, hybrids
13. `production-ml-capstone` — capstone: anatomy of a production ML system (train → eval → deploy → drift → retrain)

## Wiring (per phase, not afterthought)
- Each lesson: new `components/infographic/<PascalCase>.tsx` + registration in `components/infographic/index.tsx`
- Lesson entries in `content/courses.ts`; new `SkillId`s in `content/types.ts` + `content/skills.ts`
- `content/catalog.ts`: `trackPriority` entry for `advanced-machine-learning`
- `NEXT_COURSE` chain: `machine-learning` → `advanced-machine-learning` → `ai-observability-reliability`

## Verification
- After each phase: `npm test` (v5 completeness contract in `content/courses.test.ts`), `npm run typecheck`
- Final: `npm run build`; spot-render 2–3 new lesson pages via `npm run dev` to check both themes
- No commits unless you ask; work continues on branch `004-advanced-courses`

Note: 24 new lessons is a large volume of bespoke infographic work — implemented phase-by-phase (foundations → intermediate → advanced) with tests green between phases.