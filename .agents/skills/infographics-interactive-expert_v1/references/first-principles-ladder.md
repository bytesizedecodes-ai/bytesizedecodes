# The First-Principles Ladder (expert contract)

Read before authoring a lesson's **Derive** beat (SKILL.md §2.3). At 5+ years
the reader's schemas are rich but experience-bound — they know what worked on
*their* systems. The Ladder re-derives the design from **fundamental
constraints** so the judgment generalizes: not "this is best practice" but
"given these constraints, it couldn't have been otherwise — and here is
exactly where that stops being true."

## The contract

```
        ┌──────────────────────────────────────┐
        │ TOP — the design, named · BOUNDARY   │  ← accent + where it breaks
        ├──────────────────────────────────────┤
        │ RUNG 2 — forced consequence          │
        ├──────────────────────────────────────┤
        │ RUNG 1 — forced consequence          │  ← each rung answers "because…"
        ├──────────────────────────────────────┤
        │ GROUND — a constraint / invariant    │  ← physical, mathematical, or economic
        └──────────────────────────────────────┘
```

### The rules

1. **The Ground is a constraint, never a best practice.** Physical limits
   (memory bandwidth, FLOPs, latency budgets), mathematical facts (an
   objective's curvature, a scaling law), or cost structures the reader pays
   monthly. Best practices are *conclusions* — grounding a ladder in one is
   circular, and an expert will catch it in one read.
2. **Every rung passes the "because" test.** The reader can state why rung
   N+1 follows from rung N. A leap is a missing rung — add it.
3. **3–4 rungs, symbolic allowed.** A formula, invariant, or scaling law is
   a fine rung. Dense is fine; a gap in the argument is not.
4. **The design is named only at the TOP**, landing as inevitable — then the
   **Boundary** immediately states which constraint, when relaxed, flips the
   conclusion. The domain of validity *is* the expert content; a derivation
   without its boundary is advocacy.
5. **No analogy rungs.** The terse anchor line lives in the concept brief;
   the ladder is mechanism all the way up.
6. **The consequence is visible in the picture** — the n×n grid filling in,
   the memory bar hitting VRAM, the cost curve crossing. Prose captions; it
   never asserts what the scene doesn't show.
7. **For remembering:** the ladder is re-arguable from memory in a design
   review. The cheat-sheet's anchor is the top rung in one sentence; MCQ 2
   asks which constraint, when relaxed, flips the conclusion.

### Failure modes

| Failure | Smell | Fix |
|---|---|---|
| Circular ground | rung 1 is "as best practice…" | descend to the constraint beneath the practice |
| Smuggled conclusion | the design's name appears below the top | move naming to the top rung |
| Missing boundary | derivation ends at the top rung | add the Boundary beat — mandatory |
| Leap | "it follows that…" across a real gap | insert the missing rung |
| Kitchen-sink ladder | 5+ rungs or two different grounds | split into two lessons |

## Worked example 1 — "Retrieval vs. fine-tuning for fresh facts"

- **GROUND (constraint):** weights are **frozen at training time** — the
  model's facts stop updating the day training ends. (Unarguable; the reader
  has run enough fine-tunes to know they don't make the model know *today*.)
- **RUNG 1:** facts the business needs **change on the order of days**; the
  gap between frozen knowledge and live facts grows every day after deploy.
- **RUNG 2:** closing the gap by retraining means **re-running the full
  update cycle per change** — cost and latency per fact-change is enormous.
- **RUNG 3:** the model reads whatever is **placed in its context at answer
  time** — context is the only input that changes at zero training cost.
- **TOP (named only now):** **retrieval at inference** (RAG) is the only
  design that puts fresh facts in front of frozen weights without a training
  cycle. *Given the constraints, it couldn't have been otherwise.*
- **BOUNDARY:** relax rung 1 — when the target is *behavior* (tone, format,
  style), not facts, fine-tuning wins again; retrieval carries style poorly
  and context is finite. State this or the derivation is advocacy.

MCQ 2: "A team fine-tunes nightly to track a product catalog that changes
hourly. Which rung's constraint are they fighting, and what design does it
force?" — re-derivation, not recognition.

## Worked example 2 — "Why is LLM decode memory-bound?"

- **GROUND (constraint):** autoregressive decode emits **one token per
  forward pass**, and attention at step t must read the **K/V of every
  previous token**. (The reader implements this; it is not in dispute.)
- **RUNG 1:** recomputing past K/V each step costs O(n) FLOPs per token;
  storing them once (KV cache) costs O(n) memory — compute↔memory trade.
- **RUNG 2:** with the cache, per-token work is dominated by **reading** the
  cache, not arithmetic — throughput tracks **memory bandwidth**, not FLOPs.
- **RUNG 3:** cache size grows with **batch × context**, both linear — the
  GPU hits VRAM limits long before it hits compute limits; batching raises
  utilization exactly until the cache fills.
- **TOP:** decode is memory-bandwidth-bound, which forces the real levers —
  batch sizing, quantized caches, shorter context — not more FLOPs. *It
  couldn't have been otherwise.*
- **BOUNDARY:** relax the ground — at very long context with sparse/sliding
  attention the "every previous token" premise weakens, and compute
  re-enters the picture.

MCQ 2: "Throughput flatlines as batch grows past 32. Which rung explains it,
and which lever does that rung force?"

## Where the Ladder sits in the lesson

- The concept brief still opens (terse anchor first); the Ladder does not
  replace the brief.
- The Ladder is the **Derive beat** of CER (§2), followed immediately by the
  **Boundary** beat.
- The system diagram (§6.1) formalizes the resulting architecture — never
  re-climbs the ladder.
- One interaction at most (§8), best mapped to Diagnose — e.g. a slider over
  batch size that fills a VRAM bar while the FLOPs bar idles, making rung 3
  visible.
