# AI Inference track: the fourth AI Engineering pillar

**Status:** proposed plan (Aug 23, 2026); derived from
[`09-ai-engineering-track.md`](./09-ai-engineering-track.md). Not yet
implemented.

## Purpose and sequence

Harness owns *orchestrate*, RAG owns *ground*, Fine-Tuning owns *adapt* — this
trilogy owns **serve**: everything between "a model exists" and "answers
arrive at an acceptable cost and latency." Choosing models, running them
locally, serving them well, scaling them cheaply. Its foundations course also
absorbs the "LLM essentials for builders" on-ramp (model landscape,
tokens → cost → latency, open vs closed), so no separate LLM-basics course is
needed. Follows the `-foundations | -in-practice | -at-scale` precedent:

| Course | Audience | Outcome | Access |
| --- | --- | --- | --- |
| Inference Engineering Foundations | Curious beginners, recent grads | Plain-English intuition: what running a model costs, how to choose one, local vs cloud | Free |
| Inference Engineering in Practice | Developers with ~2y experience | Serve a model well: latency budgets, batching, formats, cost engineering, observability | **Paid** |
| Inference Engineering at Scale | Senior practitioners | Routing, gateways, edge, fleets, SLOs — capped by a national-scale capstone | **Paid** |

**Scope boundary:** fine-tuning-at-scale's `shipping-an-adapter` /
`merge-distill-serve` own shipping *your trained adapter*; this track owns
serving *models in production* generally (cross-links, not overlap). Harness
owns the loop above the model (context, tools, agent control); observability
owns the telemetry platform — this track consumes traces, doesn't rebuild them.

## Part 1 — `inference-engineering-foundations` (beginner, free)

Framework: Anchored Story-Mountain + Concreteness Fade (beginner_v1 skill).
10 lessons × ~5 min, no math/code, 3-choice MCQs, full jargon gate. No running
case (everyday anchors, per the fine-tuning-foundations precedent).

1. `what-is-inference` — training is studying for the exam; inference is
   sitting it, and every sitting costs money. Skill: `inference-intuition`.
2. `the-token-meter` — words pass through a meter; tokens → cost → latency as
   one three-way trade. Skill: `token-economics`.
3. `the-model-landscape` — open vs closed, small vs frontier; how to read a
   model card like a food label. Skill: `model-landscape`.
4. `choosing-a-model` — task shape, budget, and quality; benchmarks used
   honestly (a leaderboard win ≠ your task). Skill: `model-selection`.
5. `local-vs-cloud` — when data control, latency, or cost says "run it in the
   building". Skill: `local-vs-cloud`.
6. `quantization-plainly` — fewer digits per slider; the size/quality dial
   every open model offers. Skill: `quantization-intuition`.
7. `ollama-and-gguf` — running open weights on a laptop, plainly: the
   lunchbox format and the app that warms it up. Skill: `local-model-tooling`.
8. `first-token-and-streaming` — why the first word takes longest and why
   streaming feels faster than it is. Skill: `latency-intuition`.
9. `when-inference-fails` — overload, quiet quality drops, the bill that
   crept up month by month. Skill: `inference-failure-modes`.
10. `inference-capstone` — pick and defend a model for a product brief
    (decision diagram). Skills: `model-selection`, `token-economics`.

## Part 2 — `inference-engineering-in-practice` (intermediate, **paid**)

Framework: Predict–Investigate–Case (PIC) + First-Principles Ladder
(intermediate_v1 skill). 10 lessons × ~7 min (capstone 10), runnable
pure-Python exercises in ~4 lessons. **Running case: Bazaar Bot** — a D2C
brand's shopping assistant that must survive Diwali traffic on a fixed
budget. Every lesson adds one artifact to Bazaar Bot's serving stack; the
capstone assembles the whole page.

1. `serving-stacks` — what a serving engine (vLLM-class) actually does, and
   why not `requests.post` in production. Skill: `serving-engines`.
2. `latency-budgets` — TTFT vs inter-token vs total; where the milliseconds
   go (exercise: budget arithmetic). Skill: `latency-budgets`.
3. `batching` — throughput vs latency; why batching helps until it hurts
   (exercise). Skill: `batching-throughput`.
4. `kv-cache-plainly` — pay once for reading; GPU memory as the binding
   constraint (exercise: memory math). Skill: `kv-cache`.
5. `formats-and-export` — safetensors, GGUF, adapter overlays; conversion
   decisions (cross-links fine-tuning's `shipping-an-adapter`).
   Skill: `model-formats`.
6. `serving-cost-engineering` — response caching, model cascades,
   "semantically same but cheaper". Skill: `serving-cost-engineering`.
7. `serving-observability` — per-stage traces and cost-per-answer (links
   llm-observability; consumes, doesn't rebuild). Skill: `serving-observability`.
8. `evaluating-inference-choices` — A/B a model swap; regression gates
   before rollouts. Skills: `inference-evaluation`, `eval-gates` (reused).
9. `capacity-planning` — from requests/sec to GPUs, on a spreadsheet
   (exercise: the Diwali planner). Skill: `capacity-planning`.
10. `bazaar-capstone` — serve Bazaar Bot through the spike on budget: stack,
    budget, cache, gates on one page (flow diagram with loop). Skills:
    `capacity-planning`, `serving-cost-engineering`.

## Part 3 — `inference-engineering-at-scale` (expert, **paid**)

Framework: Problem-First Diagnostic (CER) with mandatory Boundary beat
(expert_v1 skill). 8 lessons × ~10–12 min (capstone 15), jargon-exempt, full
formulas, real code. **Production case: Vistara Rail** — a national railway
booking assistant whose load spikes ~40× during the tatkal booking window;
competing constraints quality/cost/latency/reliability, and a hard
deadline: the surge is on the calendar.

1. `routers-and-gateways` — one door, many models; routing by cost, latency,
   capability; the fallback chain and its failure modes. Skill: `model-routing`.
2. `speculative-decoding` — a small model drafts, a big model checks; the
   math of acceptance rates and when it backfires. Skill: `speculative-decoding`.
3. `edge-and-on-device` — phones, laptops, offline; what leaves the cloud
   and what that costs in quality ops. Skill: `edge-inference`.
4. `multi-model-fleets` — version pinning, canary rollouts, rollback for
   models as infrastructure. Skill: `model-fleet-ops`.
5. `slo-for-inference` — latency SLOs and error budgets applied to tokens
   and answers (cross-links reliability's error budgets). Skill: `inference-slo`.
6. `serving-under-attack` — abusive traffic, scraping, cost bombs; rate and
   budget limits as security (cross-links ai-security-at-scale). Skill:
   `serving-abuse-defense`.
7. `the-inference-tradeoff-review` — the structured decision review as an
   artifact: quality vs cost vs latency vs carbon, with flip conditions.
   Skill: `inference-architecture-review`.
8. `vistara-capstone` — **Capstone: architect the tatkal-surge serving
    layer** — routing, fleet, SLOs, and an abuse budget on one reviewed page
    (decision diagram). Skills: `model-routing`, `capacity-planning`.

## Wiring

- `content/types.ts` — new SkillIds under `// AI Inference courses`:
  foundations (`inference-intuition`, `token-economics`, `model-landscape`,
  `model-selection`, `local-vs-cloud`, `quantization-intuition`,
  `local-model-tooling`, `latency-intuition`, `inference-failure-modes`),
  in-practice (`serving-engines`, `latency-budgets`, `batching-throughput`,
  `kv-cache`, `model-formats`, `serving-cost-engineering`,
  `serving-observability`, `inference-evaluation`, `capacity-planning`),
  at-scale (`model-routing`, `speculative-decoding`, `edge-inference`,
  `model-fleet-ops`, `inference-slo`, `serving-abuse-defense`,
  `inference-architecture-review`). Reused: `eval-gates`.
- `content/skills.ts` — definitions for every new SkillId (descriptions
  <1024 chars; the fine-tuning precedent).
- `content/courses.ts` — three Course objects appended to `COURSES`
  (domain `"AI Engineering"`); `NEXT_COURSE`: foundations → in-practice →
  at-scale → `ai-security-foundations` (the paired new pillar); also
  `fine-tuning-at-scale` → `inference-engineering-foundations` (ship, then
  serve) and `rag-engineering-at-scale` → `inference-engineering-foundations`.
- `components/infographic/` — one component per lesson (28), registered in
  `index.tsx` under `// AI Inference courses` comments.
- `content/catalog.ts` — trackPriority: foundations → [beginner, grad];
  in-practice → [grad, engineer]; at-scale → [engineer, founder].
- `convex/lib/dailyPlan.ts` — `INFERENCE_FOUNDATIONS_UNITS`,
  `INFERENCE_PRACTICE_UNITS`, `INFERENCE_AT_SCALE_UNITS` added to the
  matching tracks (coverage test enforces minutes parity).
- Lesson contract per v6 (`content/courses.test.ts`): anchor-led concept
  brief, prose ≥ 2, exactly 2 scenario MCQs; beginner/intermediate pass the
  jargon gate (`content/jargon.test.ts`), at-scale is exempt.
- `docs/content-model.md` + `CHANGELOG.md` updated.
