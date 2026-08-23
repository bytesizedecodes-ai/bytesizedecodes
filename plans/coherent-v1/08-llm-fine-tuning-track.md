# LLM Fine-Tuning track: a third level-tiered trilogy

**Status:** approved plan (Aug 2026); implemented on branch `006-skills-update`.

## Purpose and sequence

The AI Engineering domain has two trilogies (Harness, RAG) plus the ML track,
but the single most-asked practical skill — **adapting an open-source LLM to
your own data and tone** — has no dedicated path. It appears only as single
lessons (`efficient-fine-tuning` in Advanced ML, `harness-vs-finetuning` in
Harness at Scale). This track adds the missing trilogy, following the
RAG/Harness naming precedent (`-foundations | -in-practice | -at-scale`):

| Course | Audience | Outcome | Access |
| --- | --- | --- | --- |
| LLM Fine-Tuning Foundations | Curious beginners, recent grads | Plain-English intuition: what fine-tuning changes, when to use it, how it's judged | Free |
| LLM Fine-Tuning in Practice | Developers with ~2y Python/ML | Run a real QLoRA fine-tune end to end: data → template → train → eval → ship | Free |
| LLM Fine-Tuning at Scale | Senior practitioners | Multi-stage pipelines, preference tuning, eval systems — capped by a free-GPU capstone | **Paid** |

**Scope boundary:** the ML track owns *why models learn* (backprop,
transformers); this track owns *adapting a pretrained LLM* — the decision
(prompt/RAG/fine-tune), the data, the method (SFT/LoRA/QLoRA/DPO), the eval,
and the ship. The expert capstone is the track's signature: fine-tune a small
open-source Qwen instruct model **for free** on Google Colab T4 / Kaggle T4×2.

## Part 1 — `fine-tuning-foundations` (beginner, free)

Framework: Anchored Story-Mountain + Concreteness Fade. 16 lessons × ~5 min,
no math/code, 3-choice MCQs, full jargon gate. No running case (everyday
anchors, per the layman ML precedent).

1. `tuning-not-building` — you don't build the chef, you teach them your
   kitchen: fine-tuning vs building a model. Skill: `finetune-intuition`.
2. `the-model-read-everything` — pretraining: the base model is a well-read
   stranger. Skill: `finetune-intuition`.
3. `behavior-not-facts` — fine-tuning teaches **behavior, not facts** (the
   course-long boundary rule). Skill: `when-to-finetune`.
4. `asking-vs-training` — prompting (repeat the handbook daily) vs
   fine-tuning (real onboarding). Skill: `finetune-vs-prompting`.
5. `inside-the-weights` — weights are importance sliders; training nudges
   them slightly. Skill: `finetune-intuition`.
6. `one-good-example` — anatomy of one training example: request + the reply
   you wish it gave. Skill: `finetune-data-intuition`.
7. `practice-makes-patterns` — datasets and epochs; why a few hundred
   examples shift behavior. Skill: `finetune-data-intuition`.
8. `parroting-problem` — overfitting: memorizing instead of understanding.
   Skill: `finetune-risks`.
9. `forgetting-the-basics` — catastrophic forgetting; mix general practice
   back in. Skill: `finetune-risks`.
10. `when-not-to-finetune` — weekly-changing facts → documents; stable
    behavior/style → fine-tune. Skill: `when-to-finetune`.
11. `base-vs-instruct` — base vs instruct/chat models: raw graduate vs
    assistant-trained. Skill: `finetune-intuition`.
12. `conversation-scripts` — chat templates: the model reads a role-formatted
    script. Skill: `finetune-data-intuition`.
13. `clip-on-lenses` — LoRA plainly: clip-on lenses instead of re-grinding
    glasses. Skill: `lora-intuition`.
14. `did-it-work` — evaluate on NEW questions, not the ones it studied.
    Skill: `finetune-eval-intuition`.
15. `borrow-a-supercomputer` — Colab/Kaggle free GPUs plainly: borrow a games
    console for an afternoon. Skill: `free-gpu-landscape`.
16. `the-fine-tuning-journey` — the whole journey on one mountain (recap
    wrap). Skill: `finetune-intuition`.

## Part 2 — `fine-tuning-in-practice` (intermediate, free)

Framework: Predict–Investigate–Case (PIC) + First-Principles Ladder. 14
lessons × ~7 min (capstone 10), runnable pure-Python exercises in ~6 lessons.
**Running case: Sahayak** — a WhatsApp assistant for a pharmacy chain (house
tone, order extraction, policy refusals). Every lesson adds one artifact to
Sahayak's build; the capstone assembles the decision log.

1. `the-transfer-ladder` — pretrain → SFT → preference; why 500 examples move
   a 3B model. Skill: `sft-pipeline`.
2. `prompt-rag-or-finetune` — the decision with monthly token-cost math.
   Skills: `when-to-finetune`, `harness-vs-finetuning`.
3. `anatomy-of-an-example` — messages, roles, special tokens (exercise).
   Skill: `chat-templates`.
4. `curating-the-dataset` — quality > quantity, dedup, decontamination vs
   your eval, data mixtures. Skill: `finetune-data-curation`.
5. `train-on-answers-only` — loss masking (exercise). Skill: `sft-pipeline`.
6. `the-memory-arithmetic` — 16 bytes/param; why full fine-tuning a 3B needs
   ~48 GB (exercise). Skill: `finetune-memory-math`.
7. `lora-from-first-principles` — ΔW = B·A rank bottleneck (exercise).
   Skill: `lora-fine-tuning`.
8. `qlora` — 4-bit base + LoRA adapters; what quantization costs; fits a
   free T4. Skill: `lora-fine-tuning`.
9. `dials-that-matter` — LR ≈ 1–3e-4 for LoRA, 1–3 epochs, warmup, batch via
   accumulation. Skill: `finetune-hyperparameters`.
10. `catching-memorization` — checkpoint/eval during training; pick by eval,
    not final loss. Skill: `finetune-evaluation`.
11. `a-small-honest-eval` — golden set, LLM-as-judge and its biases,
    regression gate. Skill: `finetune-evaluation`.
12. `template-skew` — train/inference chat-template mismatch (exercise).
    Skill: `chat-templates`.
13. `shipping-an-adapter` — merge LoRA → base, export GGUF, serve in
    Ollama/llama.cpp. Skill: `adapter-serving`.
14. `sahayak-capstone` — Capstone: the decision log — data plan, method,
    budget, eval gate, ship path (flow diagram with loop).

## Part 3 — `fine-tuning-at-scale` (expert, **paid**)

Framework: Problem-First Diagnostic (CER) with mandatory Boundary beat. 12
lessons × ~10–12 min (capstone 15), jargon-exempt, full formulas, real code.
**Production case: Varta** — a privacy-first, on-prem regional-language
banking assistant; competing constraints quality/cost/privacy/latency/safety.

1. `the-decision-architecture` — prompt/RAG/SFT/DPO/continue-pretrain as
   constraint satisfaction + flip conditions. Skill: `finetune-decision-architecture`.
2. `the-data-engine` — synthetic data, distillation, licensing,
   dedup/decontamination at scale. Skill: `finetune-data-engine`.
3. `objective-landscape` — SFT vs DPO vs ORPO vs PPO vs GRPO: what each
   optimizes, how each breaks. Skill: `preference-tuning`.
4. `preference-data` — pair construction, margin calibration, reward hacking,
   judge bias (exercise). Skill: `preference-tuning`.
5. `qlora-scaling-limits` — what fits T4-16GB vs L4/A100; rank/context/batch
   trades; the constraint that flips conclusions. Skills: `lora-fine-tuning`,
   `finetune-memory-math`.
6. `training-stability` — loss spikes, LR schedules, packing, flash
   attention, gradient checkpointing. Skill: `training-stability`.
7. `multi-stage-pipelines` — continue-pretrain → SFT → DPO sequencing; when
   to skip stages. Skill: `sft-pipeline`.
8. `evaluation-at-production` — contamination-proof suites, judge
   calibration, human review loops, online signals. Skill: `finetune-evaluation`.
9. `the-alignment-tax` — safety tuning: refusal drift, over-refusal cost,
   jailbreak surface after SFT. Skill: `alignment-techniques`.
10. `merge-distill-serve` — merging, distillation to smaller models,
    quantized serving economics. Skills: `model-merging-distillation`,
    `adapter-serving`.
11. `failure-forensics` — triage tree for a bad fine-tune: data bug →
    template bug → hyperparams → objective mismatch. Skill: `failure-forensics`.
12. `free-gpu-capstone` — **Capstone: fine-tune Qwen small instruct
    (1.7B–4B, Apache-2.0, ungated) for free on Colab T4 / Kaggle T4×2**:
    dataset → chat template → QLoRA config → train → eval → merge → GGUF
    export → run locally in Ollama; free-tier gotchas. GPU training can't
    run in Pyodide, so the walkthrough lives in the infographic and the
    exercise is a pure-Python T4 budget planner. Skill: `free-gpu-finetuning`.

## Wiring

- `content/types.ts` — new SkillIds under `// LLM Fine-Tuning courses`:
  foundations (`finetune-intuition`, `finetune-vs-prompting`,
  `finetune-data-intuition`, `finetune-risks`, `when-to-finetune`,
  `lora-intuition`, `finetune-eval-intuition`, `free-gpu-landscape`),
  in-practice (`sft-pipeline`, `chat-templates`, `finetune-data-curation`,
  `finetune-memory-math`, `finetune-hyperparameters`, `finetune-evaluation`,
  `adapter-serving`), at-scale (`finetune-decision-architecture`,
  `finetune-data-engine`, `preference-tuning`, `training-stability`,
  `model-merging-distillation`, `failure-forensics`, `free-gpu-finetuning`).
  Reused from existing courses: `lora-fine-tuning`, `harness-vs-finetuning`,
  `alignment-techniques`.
- `content/skills.ts` — definitions for every new SkillId.
- `content/courses.ts` — three Course objects appended to `COURSES`;
  `NEXT_COURSE`: foundations → in-practice → at-scale →
  `harness-engineering-foundations`; also `rag-engineering-at-scale` →
  `fine-tuning-foundations`.
- `components/infographic/` — one component per lesson (42), registered in
  `index.tsx` under `// LLM Fine-Tuning courses` comments.
- `content/catalog.ts` — trackPriority: foundations → [beginner, grad];
  in-practice → [grad, engineer]; at-scale → [engineer, founder].
- `convex/lib/dailyPlan.ts` — `FINE_TUNING_FOUNDATIONS_UNITS`,
  `FINE_TUNING_PRACTICE_UNITS`, `FINE_TUNING_AT_SCALE_UNITS` added to the
  matching tracks (coverage test enforces minutes parity).
- `docs/content-model.md` + `CHANGELOG.md` updated.
