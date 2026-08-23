# The First-Principles Ladder (intermediate contract)

Read before authoring a lesson's **Derive** beat (SKILL.md §2.3). The Ladder
is the intermediate signature method: rebuild a concept your reader already
*uses* from ground truths they already *accept*, so the partial schema they
hold gets repaired into one they can re-derive at a whiteboard.

## The contract

A ladder has three zones, drawn bottom-up with `Stagger` (one scene per rung,
one concept per scene):

```
        ┌─────────────────────────────┐
        │ TOP — the concept, named    │  ← accent lands here, first naming
        ├─────────────────────────────┤
        │ RUNG 3 — consequence        │
        ├─────────────────────────────┤
        │ RUNG 2 — consequence        │  ← each rung answers "because…"
        ├─────────────────────────────┤
        │ RUNG 1 — consequence        │
        ├─────────────────────────────┤
        │ GROUND — an accepted truth  │  ← never argued, only stated
        └─────────────────────────────┘
```

### The rules

1. **The Ground must be unarguable *to this reader*** — something they use
   daily without questioning (a definition, a daily workflow step, a
   production constraint they live with). Test: would a 2-year practitioner
   nod, not debate? If the ground is contested, the ladder is built on sand —
   find a deeper ground.
2. **Every rung passes the "because" test.** After reading rung N, the
   learner can say why rung N+1 follows. If a rung needs a leap, insert the
   missing rung — the leap *is* the missing rung.
3. **3–5 rungs.** More means you have two ladders — two lessons.
4. **The concept's name appears only at the TOP.** Stating it first and
   explaining after is describing, not deriving, and leaves nothing to
   re-derive. The aha is inevitability: "it couldn't have been otherwise."
5. **No analogy rungs.** The anchor lives in the concept brief (one line);
   the ladder itself is mechanism all the way up.
6. **The consequence must be visible in the picture**, not asserted by a
   caption — rung scenes show the forced consequence (the biased arrow, the
   n×n grid filling in), prose captions it.
7. **For remembering:** the ladder is a chain mnemonic — each rung cues the
   next. The cheat-sheet's anchor is the top rung in one sentence; MCQ 2 asks
   the learner to re-derive one rung in a new situation (retrieval of the
   derivation, not recognition of the conclusion).

### Failure modes

| Failure | Smell | Fix |
|---|---|---|
| Contested ground | reader argues with rung 1 | descend one level deeper |
| Smuggled conclusion | rung 1 already uses the concept's name | move the naming to the top |
| Analogy rung | "it's like a soup…" inside the ladder | cut it; mechanism only |
| Leap | rung N→N+1 needs a "trust me" | that's a missing rung — add it |
| Two ladders | rung count > 5, or the Ground shifts mid-ladder | split the lesson |

## Worked example 1 — "Why do we shuffle training data?" (schema repair)

The reader shuffles every training run; nobody derived *why* for them.

- **GROUND (unarguable):** one training step updates weights using the
  gradient *estimated from a small batch*. (They call `loss.backward()` on
  batches daily.)
- **RUNG 1:** an estimate's quality depends entirely on **which samples
  landed in the batch**.
- **RUNG 2:** data on disk arrives **ordered** — class A's photos, then
  class B's — so consecutive sequential batches are near-homogeneous.
- **RUNG 3:** a homogeneous batch estimates the gradient of **that class's
  region only** — biased, in the same direction, for many consecutive steps.
- **RUNG 4:** repeated same-direction biased steps **zig-zag** — the path
  visibly fights itself.
- **TOP (named only now):** **Shuffle** makes every batch a random sample of
  the whole dataset — the cheapest variance reduction in SGD. *It couldn't
  have been otherwise.*

Visual: the ladder's rungs ARE the training path — ordered batches draw a
zig-zagging trajectory down the loss surface; shuffled batches draw a clean
descent. MCQ 2: "Your images arrive sorted by camera ID; training stalls.
Which rung fails, and why?" — re-derivation in a new situation.

## Worked example 2 — "Why is attention O(n²)?" (constraint derivation)

- **GROUND:** attention scores every token against every other token
  (n×n dot products) — the reader writes this in code.
- **RUNG 1:** n tokens → **n² pairs**, each pair one dot product.
- **RUNG 2:** the n×n score matrix must exist **in memory before the
  softmax** — n² space, not just n² time.
- **RUNG 3:** doubling context **4×'s** both — the grid visually quadruples.
- **TOP:** long context is expensive *by construction*, which is why sparse,
  sliding-window, and linear attention exist. *It couldn't have been
  otherwise.*

MCQ 2: "Context grows from 8k to 32k tokens. What happens to the score
matrix, and which rung tells you?" — the learner picks the rung and states
the consequence.

## Where the Ladder sits in the lesson

- The concept brief still opens the lesson (anchor line first — the Ladder
  does not replace the brief).
- The Ladder is the **Derive beat** of PIC (§2), rendered as the story
  infographic's spine.
- The system diagram (§6.1) formalizes the result — never re-narrates the
  climb.
- One interaction at most (§8), best mapped to Predict/Observe — e.g. a
  toggle that runs the *ordered* vs *shuffled* path so the learner watches
  rung 4's zig-zag happen.
