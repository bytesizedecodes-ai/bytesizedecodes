# Visual interactive storytelling (v2, expert)

How to fuse **CER beats**, **picture continuity**, and **earned interaction**
into one lesson arc — and, new in v2, how to make a dense lesson read as **one
accumulating argument instead of a stack of dense cards**.

The v2 governing rule: **a scene never starts from scratch.** Every scene
inherits the previous scene's architecture, referents, and claim, then
advances exactly one row of the argument. The Thread here is *argument
structure* — the way design documents and incident reviews already organize
expert thinking. It is not scaffolding: no whimsy, no icons, no re-explained
basics. The moment a Thread element teaches content the reader knows, cut it.

---

## 1. The fusion rule (unchanged from v1)

A lesson is one story told in three channels that must agree:

| Channel | Job |
|---|---|
| **Framework beat** | Where we are in the argument (CER) |
| **Visual state** | What the picture shows *now* vs the previous scene |
| **Learner action** | What they inspect, claim, or decide — if anything |

If the widget could be moved to a different lesson without changing its meaning,
it is not fused. If the picture does not change across scenes, you have slides,
not an argument.

**Default:** passive scroll-reveal + one Constructive diagnose beat.
**Escalate to a widget only when** the decision requires acting (inspection,
claim selection, a justified decision).

---

## 2. The Thread contract (v2 — expert calibration)

Six rules, all mandatory.

### 2.1 The agenda StoryMap opens the lesson

Directly under the `InfographicHeader`, render **`StoryMap`**
(`components/infographic/scenes.tsx`, no icons): 3–5 terse slots naming the
argument's stations, the conclusion last — "Bandwidth, not FLOPs" → "KV cache
trades compute for memory" → "VRAM ceiling at batch 32" → "Decode is
memory-bound". The reader sees the whole case before it is argued; each slot
is a claim a scene must establish, reusing the slot's words in its caption.

### 2.2 The connective caption grammar

Every scene caption opens with an **argument connective** — *So / But /
Because / Therefore* — plus its rung when the ledger is the spine:

- "① p95 doubled after a prompt change; evals green."
- "② **But** latency, not quality, moved — so the model isn't the first suspect."
- "Rung 3 of 4 — **because** cache grows with batch × context, both linear…"
- "⑤ **Therefore** the lever is cache size, not FLOPs — and here is exactly
  where that stops being true."

Ordinals alone are decoration; connectives are the argument. A reader
scrolling fast, reading only captions, should still be able to **re-argue the
case** — the re-argue test (§2.6).

### 2.3 The stage rule — slice the architecture, never redraw it

The course-case architecture keeps its **topology and positions** for the
whole lesson (and ideally the whole course). Scenes are **slices**: the span
under discussion accented, everything else dimmed but present. Never a fresh
layout per scene; never delete the system to zoom into it.

- **Chapter scenes** (`<Scene variant="chapter">`, boxed) open a beat or
  change *what* the picture shows.
- **Continuation scenes** (`<Scene variant="continue">`, frameless, on the
  shared left rule) keep the stage and advance the argument — ledger rows,
  gauge states, trace windows.

### 2.4 One accented delta per scene — ghost-diffed

Between scenes, **one** primary thing changes: which span is accented, which
row lands, which claim is selected, which window is active. The change takes
the accent; the inherited rest stays neutral, dimmed but visible. When a
value or state the reader just saw changes, **ghost the previous state** —
the old curve, bar, or trace stays as a faint outline — so the delta is an
argument ("against what"), not a new diagram. If two things change, split
the scene.

### 2.5 Referent stability

System names, metric names, symbols, and units fixed for the whole lesson —
same numbers throughout the derivation. Re-binding referents mid-argument
("consider a different service…") forces the reader to rebuild the situation
model exactly when the reasoning needs it. New numbers only in the Transfer
beat (new regime, same shape). Notation is bound by the pre-stage
(`first-principles-ladder.md` v2 §"notation pre-stage").

### 2.6 The re-argue test (ship gate)

From the finished lesson — ledger rows + captions alone — could the reader
re-argue the design decision in a review, and say which row flips at the
boundary? Failing = restructure before shipping. (The v1 failure mode was
real: dense boxed scenes, each a new layout, rungs vanishing as the reader
scrolled, no visible accumulation. All fail this test.)

---

## 3. Beat → interaction map (CER, v2)

Assign **at most one** primary interaction.

| Beat | Interaction? | Guidance |
|---|---|---|
| Problem-first | None | Hard case visual; minimal scaffolding. |
| You diagnose | **Primary widget** | Evidence matrix or open inspection with minimal labels. |
| Claim / Evidence / Reasoning | **Constructive commit** | Learner selects the claim; feedback cites evidence only. |
| Derive (ledger) | Feedback + highlight | The accumulating ledger; widget feedback cites evidence + next slice. |
| Boundary | Optional second state | One toggle or alternate cohort that breaks the first claim — the struck row visible. |
| What / So-What / Now-What | Decision gate | One justified next action — not a branching game. |

Anti-maps (don't do these):

- Widget only in the final scene as "bonus interactivity."
- Every beat interactive (load + seductive detail).
- A "scene" that is a wall of text where a slice of the architecture should
  carry the argument.

---

## 4. Interaction as a story turn

```
BEFORE  →  LEARNER ACTS  →  AFTER
(tempting view)   (control)   (evidence view + feedback)
```

- **Before** should invite the wrong or incomplete reading (the reflex).
- **Act** carries a verb-led instruction, minimal chrome.
- **After** recomposes the evidence in the picture — BEFORE ghosts (§2.4) —
  and feedback cites the evidence that supports or weakens the claim. It can
  be minimal, but it must be specific.

---

## 5. Course continuity — visual + artifact (v2: now visual)

For expert courses (SKILL.md §2.1):

1. Define the **case** in 2–4 sentences once for the course — a production
   design or failure with competing constraints.
2. Name the **persistent architecture** — that topology IS the stage every
   lesson slices.
3. **Open every lesson with the case-so-far strip** — the architecture small,
   previous lessons' constraints marked (terse chip row: "✓ freshness ·
   ✓ retrieval latency · + today: index cost"); today's constraint joins the
   same strip at the Derive beat.
4. Name the **reusable artifact** the capstone design review will consume.

If a lesson's widget does not add evidence to the case, cut or redesign it.

---

## 6. Worked exemplar — expert CER (v2, fused + threaded)

**Lesson capability:** Choose the first investigation when quality drops
after a release without blaming the model by default.

**StoryMap (agenda):** [Quality drops, evals green] → [Latency moved, not
quality] → [Retrieval empties cluster] → [Index freshness, not the model].

| Beat | Scene | Caption |
|---|---|---|
| Problem-first | chapter — release timeline, quality drop marked | "① p95 doubled after the release; evals stayed green." |
| Diagnose | continue — evidence matrix, all cards neutral | "② **But** latency moved, not quality — inspect before you blame weights." |
| CER | continue — claims: model / retrieval / traffic; learner selects; evidence highlights | "③ **Because** empty-retrieval clusters spike at the same minutes, retrieval leads." |
| Boundary | continue — alternate cohort where latency leads | "④ **So** check the regime: at 3am traffic the same symptom flips to cache misses." |
| Now-what | chapter — decision gate: canary vs rollback vs inspect index | "⑤ **Therefore** inspect index freshness first — and re-run evals with yesterday's index." |

The timeline/matrix never re-lays-out; the un-selected claims ghost; every
caption advances the argument.

---

## 7. Quality rubric — story vs animated glossary (v2)

### Passes (ship)

- [ ] Agenda `StoryMap` renders under the header; every slot is a claim a
      scene establishes.
- [ ] The re-argue test passes: ledger + captions alone re-argue the case.
- [ ] One architecture stage; topology stable; scenes slice, never redraw.
- [ ] Each scene advances ONE accented delta; prior state ghosts.
- [ ] Ledger accumulates through the Derive beat; the Boundary beat strikes
      the row that flips.
- [ ] At most one primary widget on its mapped beat; BEFORE → ACT → AFTER
      visible; feedback cites evidence.
- [ ] Lesson advances the course case; the case-so-far strip opened it.
- [ ] No Thread element re-explains basics — structure only.

### Fails (rewrite)

- [ ] Fresh layout per scene; the architecture redrawn; rungs vanishing.
- [ ] Ordinal-only captions with no connectives; wall-of-text scenes.
- [ ] Derivation that states the design first and justifies after.
- [ ] Widget could be screenshot-replaced with no learning loss.
- [ ] "Correct!" with no evidence pointer; interaction on every scroll section.

---

## 8. Authoring checklist (paste into Step 3)

```md
- Framework: <CER>
- Agenda StoryMap slots: <3–5 terse claims, conclusion last>
- Through-line stage: <the case architecture — what stays fixed, topology included>
- Scene list: <beat → chapter|continue → connective caption → the ONE delta>
- Ledger rows: <constraint → forced consequence, GROUND first>
- Boundary row: <which constraint, relaxed, flips the conclusion>
- Ghost-diff moments: <where the previous state stays visible>
- Referents + notation: <systems, metrics, symbols, units — fixed; pre-staged>
- Interaction beat: <Diagnose / Now-What | none>
- Feedback line (evidence-citing): <…>
- Case-so-far strip: <what earlier lessons established, what today adds>
```
