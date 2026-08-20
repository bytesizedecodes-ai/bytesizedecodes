# Machine Learning track: foundations refresh, intermediate expansion, advanced course

**Status:** approved plan (Aug 2026); implemented on branch `004-advanced-courses`.

## Purpose and sequence

The ML domain currently stops early: **Machine Learning for Layman** (beginner,
19 lessons) is complete, but **Machine Learning** (intermediate) is a 4-lesson
definitions primer — there is no mechanics layer and no advanced course. The
track fix has three parts:

1. **Foundations refresh** — Layman gains one lesson (regression intuition) and
   one modernized beat (generative AI in everyday ML).
2. **Intermediate expansion** — the primer grows from 4 to 14 lessons: the
   mechanics bridge (regression → loss → gradient descent → neural networks →
   backprop) plus the practical layer (bias/variance, ensembles, metrics,
   cross-validation, leakage).
3. **Advanced course** — a new paid expert course, *Advanced Machine Learning*:
   modern deep learning → transformers → LLM training → fine-tuning →
   alignment → diffusion → multimodal → frontier architectures → production
   capstone.

| Course | Audience | Outcome | Access |
| --- | --- | --- | --- |
| Machine Learning for Layman (refresh) | Curious beginners | Picture-led intuition for how machines learn | Free (unchanged) |
| Machine Learning (expanded) | Tech enthusiasts, developers | Real mechanics: train a model, read its errors, avoid the traps | Free (unchanged) |
| Advanced Machine Learning (new) | ML practitioners, senior engineers | Design, train, fine-tune, and ship modern deep models | **Paid** |

**Research basis (Aug 2026):** the in-demand skill stack shifted from
*training models* to **adapting, aligning, and orchestrating** them — LoRA-style
efficient fine-tuning, RLHF/DPO alignment, diffusion, multimodal, MoE/SSM
architectures, and MLOps — while universities (Stanford CS229/230/231n,
Harvard LLM Foundations) anchor the classical core. The advanced course stays
on the **model side** (architectures, training, tuning, alignment); the
retrieval/monitoring side is already owned by RAG Engineering at Scale and AI
Observability: Reliability.

## Part 1 — Foundations refresh (`machine-learning-for-layman`)

Framework: Anchored Story-Mountain + Concreteness Fade. Picture-led, no math.

1. **NEW · `predicting-numbers`** — "Predicting a number, not a category"
   (placed after *Inside supervised learning*). Which-one vs how-much; the
   best-fit line through a scatter; everyday regressions (delivery time, price,
   temperature). No equations.
2. **MODIFIED · `ml-in-your-phone`** — add a generative-AI beat: ChatGPT and
   image generators as the same "samples in, pattern out" skeleton (predicting
   the next word is supervised learning at colossal scale). New skill:
   `regression-basics`.

## Part 2 — Intermediate expansion (`machine-learning`, stays free)

Framework: Predict–Investigate–Case (PIC). Lighter analogies, some code.
Course description/subtitle updated from "four lessons" to the fuller scope.
New skills: `regression-basics`, `logistic-regression`, `loss-functions`,
`neural-network-basics`, `backpropagation`, `bias-variance`,
`ensemble-methods`, `cross-validation`, `data-leakage`.

1. `linear-regression` — line of best fit; what "fit" means; cost of error.
2. `logistic-regression` — a weighted sum squashed into a probability;
   decision boundary at 0.5.
3. `loss-functions` — "how wrong is wrong": squared error vs cross-entropy;
   why loss (not accuracy) is what training optimizes.
4. `gradient-descent` — follow the slope downhill; learning rate as step size
   (skill id `gradient-descent`, already registered).
5. `neural-network-basics` — neuron = weighted sum + activation; layers build
   features step by step; why nonlinearity matters.
6. `backpropagation-intuition` — forward pass makes a guess, loss scores it,
   backward pass assigns credit/blame to every weight.
7. `bias-variance-tradeoff` — the formal underfit/overfit diagnosis from
   train-vs-test error patterns.
8. `ensemble-methods` — bagging (random forest) and boosting: why a committee
   of weak models beats one strong one.
9. `evaluation-metrics` — confusion matrix, precision/recall trade-off,
   accuracy's failure mode on imbalance, cross-validation.
10. `data-leakage-and-imbalance` — information from the future in training
    data; why 99% accuracy can mean a model that does nothing.

## Part 3 — Advanced Machine Learning (`advanced-machine-learning`, new)

**Level:** expert · **Framework:** Problem-First Diagnostic (CER) · **Access:**
paid · **Prerequisites:** Machine Learning (expanded) or equivalent.

**Format:** 13 lessons × 9–14 minutes. **Narrative case:** **Mango Labs**, a
four-person team that grows a mango-disease photo classifier into a
fine-tuned-LLM crop advisory product. Each lesson adds one piece of evidence,
cost, or constraint to Mango's build; the capstone assembles the full anatomy.

1. `neurons-and-layers` — weights as dials, activations as gates, why depth
   beats width; Mango's first classifier is one neuron short of useful.
   Skill: `deep-representations`.
2. `how-networks-learn` — forward pass, loss, backprop at scale; SGD → Adam;
   learning-rate as the one hyperparameter that most decides success.
   Skill: `optimizers`.
3. `regularizing-deep-nets` — dropout, batch norm, early stopping,
   augmentation; and when a smaller model is the fix. Skill:
   `deep-regularization`.
4. `convolutional-networks` — sliding filters, feature hierarchy
   (edges→shapes→lesions), pooling; transfer learning as the default.
   Skill: `cnn-architectures`.
5. `sequences-to-attention` — why RNN memory fades over long context; the
   attention spotlight as the fix. Skill: `attention-mechanism`.
6. `inside-the-transformer` — Q/K/V as a lookup, multi-head views,
   positional information; the decoder-only GPT block. Skill:
   `transformer-architecture`.
7. `llm-training-pipeline` — tokenization, pretraining on internet-scale
   text, SFT, RLHF; scaling laws and what each stage costs. Skill:
   `llm-training-pipeline`.
8. `efficient-fine-tuning` — LoRA adapters, quantization, distillation;
   when fine-tuning is the wrong tool vs prompting/RAG. Skill:
   `lora-fine-tuning`.
9. `alignment-rlhf` — reward models, RLHF vs DPO; what alignment can and
   cannot fix. Skill: `alignment-techniques`.
10. `diffusion-models` — noise→image denoising; why diffusion displaced
    GANs; diffusion LLMs as the 2026 frontier. Skill: `diffusion-models`.
11. `multimodal-models` — CLIP's shared embedding space; vision-language
    models that see and read. Skill: `multimodal-embeddings`.
12. `frontier-architectures` — MoE expert routing, Mamba/SSM linear time,
    hybrid models; the quadratic-cost problem they all attack. Skill:
    `efficient-architectures`.
13. `production-ml-capstone` — capstone: anatomy of Mango's production
    system — train → eval → deploy → drift → retrain. Skills:
    `production-ml-lifecycle`, `model-drift` (reused from observability).

## Wiring

- `content/types.ts` + `content/skills.ts`: new SkillIds above.
- `content/catalog.ts`: `advanced-machine-learning` → tracks
  `["engineer", "founder"]`.
- `NEXT_COURSE`: `machine-learning` → `advanced-machine-learning` →
  `ai-observability-reliability`.
- Every lesson: bespoke infographic registered in
  `components/infographic/index.tsx`, v5 contract enforced by
  `content/courses.test.ts`.
