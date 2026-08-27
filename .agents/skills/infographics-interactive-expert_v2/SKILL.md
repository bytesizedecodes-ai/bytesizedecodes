---
name: infographics-interactive-expert_v2
description: THE v2 skill for creating and editing EXPERT courses and lessons on ByteSizeDecodes — for senior practitioners (~5+ years of AI/ML) who have owned production systems. Use for ANY lesson, course page, infographic, widget, diagram, or cheat-sheet in a course with `level: "expert"` — the constraint Ladder rendered as an ACCUMULATING CONSTRAINT LEDGER (constraint→consequence rows stack and dim; Boundary strikes the row that flips; notation staged first; formulas term-labeled) inside the Problem-First Diagnostic (CER) framework, plus the v2 Thread contract as argument structure, not scaffolding: a terse agenda StoryMap, connective captions (So/But/Because), one stable architecture stage, ghost-diffed deltas, referent stability, the re-argue test. One persistent production case with a case-so-far strip, terse anchors, full precision (jargon-exempt), full formulas, real code, failure modes, open minimal widgets, exactly 2 scenario MCQs (3–4 choices). If the course's `level` says "expert", THIS is the skill.
---

# infographics-interactive-expert_v2

The v2 expert skill = the v1 expert contract **plus the Thread contract,
expert-calibrated as argument structure** — the layer that fixes the two v1
failures: lessons reading as *disconnected dense cards*, and derivations the
reader loses halfway. Everything v1 required (anchor-first brief, CER
framework, the constraint Ladder with the mandatory Boundary beat, system
diagram layer, exactly 2 scenario MCQs, cheat-sheet, color/motion discipline)
still applies.

The governing fact is unchanged: **over-scaffolding experts actively harms
them** (expertise reversal, Kalyuga 2007; Tetzlaff 2025). Your reader already
owns the schemas. Heavy analogies, worked examples on basics, and dense
signaling become extraneous load — and imprecise language reads as a red flag.
They will catch you if you round the wrong number. Precision first.

**Why the Thread is different:** an agenda line, an accumulating ledger, and
"because" captions are how design documents and incident reviews already
organize expert arguments — this is *structure*, not scaffolding. No whimsy,
no icons, no restated basics. The moment a Thread element starts re-explaining
content the reader knows, cut it.

**v2's diagnosis of v1** (checked against real lessons): dense boxed scenes
arriving as a new layout each time; derivations whose rungs vanished as the
reader scrolled (nothing on screen accumulates); architecture redrawn per
lesson instead of sliced; captions with no argument connectives. Each is now
a named bug with a named fix (§2.4, `references/visual-interactive-storytelling.md` §2).

## 0. Who you are writing for

**Senior practitioners with ~5+ years of AI/ML experience** — they have
owned production systems, made (and paid for) architectural trade-offs, and
caught imprecise claims for a living. They hold rich but sometimes
experience-bound schemas: they know what worked on their systems, and the
value of this skill is **re-deriving the why from fundamental constraints**
(§2.3) so their judgment generalizes beyond the systems they happened to run.
They want depth, precision, edge cases, and the failure modes — fast.

| Dimension | Rule |
|---|---|
| **Analogy** | **Minimal.** One terse professional anchor line that orients; then straight to the formal representation. The derivation is the intuition; analogy would displace it. |
| **Narrative** | **Sparse.** Problem-first is fine; skip the story wrapping. The *argument* still connects scene to scene (§2.4). |
| **Jargon** | **Full technical precision.** Don't dumb down — exempt from the plain-English gate. |
| **Density** | **Higher density OK.** Experts hold more chunks and are bored by over-simplification. Ladder rungs may be symbolic (a formula or invariant is a fine rung). |
| **Signaling** | **Minimal** for content — but the scene DELTA is always accented (§2.4); that is structure, not signaling. |
| **Math/code** | **Full formulas, real code, edge cases, failure modes.** This is where the entropy formula and the cosine-similarity math live. |
| **The aha** | **Inevitability plus its boundary** — the design lands as the only possible conclusion of the constraints, *and* you show exactly where the derivation breaks. |
| **Prose** | Rule 12 applies to captions too: short sentences, one idea each — terse, not dense. Precision never needs long sentences. |

## 1. The anchor-first opening (mandatory, terse)

The lesson page order:

```
header → CONCEPT BRIEF (ANCHOR first) → story infographic (opens with the
agenda StoryMap strip) → SYSTEM DIAGRAM (reference layer) → prose →
exactly 2 scenario MCQs → CHEAT-SHEET
```

No prediction card. No application card. No quiz before the idea.

```ts
concept: {
  anchor: "…one terse professional line…",               // orients, feeds the cheat-sheet
  what:   "…precise mechanism summary — no hand-holding…",
  why:    "…the operational stake…",
  where:  ["…production context 1…", "…production context 2…"],  // 2–3
  whenNot: "…one testable boundary condition…",
},
```

### The expert anchor

- **One terse professional line, no whimsy overload:** "A guardrail is a
  circuit breaker for model output." The anchor still opens the brief — it
  orients and it feeds the cheat-sheet — but it must not over-scaffold.
- Never let the anchor become the through-line *instead of* the real system;
  for experts the through-line is the course-case architecture (§2.1).
- Brief-field rules (enforced by `content/courses.test.ts`): 1–2 sentences
  per point, 1–3 **bold** load-bearing terms, "Where" specific production
  contexts, "When NOT" a boundary condition an engineer can test.

### 1.1 The two closing MCQs — exactly 2, both real-life scenarios, 3–4 choices

- **A scenario, not a definition.** Real production situations with concrete
  systems and constraints ("at 40k requests/day your p95 doubles after the
  prompt change; the eval suite is green…"), asking for the diagnosis or the
  next action.
- One question checks the mechanism; the **second transfers** it to a
  different system or regime.
- Explanations resolve the scenario with the evidence that supports or
  weakens each option — never bare "Correct."
- Distractors embody plausible practitioner errors (the retrain reflex, the
  blame-the-model reflex, the cache-everything reflex), never filler.
- **3–4 choices** for expert courses. A third question is a bug.
- When the lesson centers on a Ladder (§2.3), **MCQ 2 asks which constraint,
  when relaxed, flips the derived conclusion** — testing the boundary of the
  argument, not recognition of its conclusion.

## 2. The storytelling framework: Problem-First Diagnostic (CER) + the Thread

Every expert lesson is laid out in these beats (full definitions in
`references/narrative-structures.md`):

**Problem-first → You diagnose → Derive (the Ladder, §2.3) → Boundary → What/So-What/Now-What**

- **Problem-first:** open on the failing system or design tension — no
  warm-up, no "why care?" paragraph. Re-enter the course case via the
  **case-so-far strip** (§2.1).
- **You diagnose:** hand the reader the evidence (trace, metrics, diagram)
  and invite them to locate the fault — this is the natural home for a
  widget (§8).
- **Derive:** the resolution is **argued from fundamental constraints rung by
  rung** (§2.3), rendered as one **accumulating constraint ledger** — like an
  incident review: claim, the constraint that forces it, the mechanism
  connecting them. Not stated-and-justified — derived.
- **Boundary:** where the derivation breaks — the regime where the standard
  advice (or the just-derived design) fails. In v2 the Boundary beat
  **strikes the ledger row** whose constraint, relaxed, flips the conclusion.
  Skipping this is the classic expert-lesson sin.
- **What/So-What/Now-What:** the operational takeaway and next action.

### 2.1 Course continuity — the case is mandatory, and now VISIBLE

Define **one production design or failure case with competing constraints**
before authoring the first lesson (scale vs. cost, latency vs. freshness,
coverage vs. privacy). Each lesson adds **evidence, uncertainty, or a
counter-example** to that case; the capstone is a design review over the
accumulated case. Write the case in 2–4 sentences, state the final learner
artifact, and name the lesson where each major piece of evidence first
appears.

**v2 — the case-so-far strip.** The case's architecture (the system diagram
of the case) is the **stage** every lesson shares. Each lesson OPENS with it
small — terse chip row of what previous lessons established ("✓ freshness
constraint · ✓ retrieval latency · + today: index cost") — and adds today's
constraint to the same strip at the Derive beat. The reader re-enters the
case in five seconds; this is the course-level Thread.

### 2.2 Visual interactive storytelling (the fusion rule)

1. **One through-line stage** — the course-case architecture, sliced: the
   same topology every scene, the span under discussion accented, the rest
   dimmed but present. Never a fresh layout per scene.
2. At most **one** interaction, mapped to a beat (Diagnose / Now-What);
   default is *no* widget.
3. Interaction is a story turn: BEFORE → LEARNER ACTS → AFTER (evidence
   re-composed + evidence-specific feedback; BEFORE ghosts, §2.4).
4. The widget, both MCQs, and the transfer test one capability from
   different angles.
5. Full grammar, worked CER exemplars, and the rubric:
   `references/visual-interactive-storytelling.md`. An animated glossary is a
   bug — but so is a wall of text; experts still get pictures, just denser
   and more literal.

### 2.3 First-principles visual storytelling (the Ladder — now ONE ledger)

The expert signature method, unchanged in logic, changed in rendering. Five
years of experience teaches *what worked here*; first principles teach *what
must work anywhere*. The core explanation of a lesson is a **derivation from
fundamental constraints**, drawn as a ledger the reader could re-argue in a
design review:

- **Ground:** a fundamental constraint or invariant the reader cannot argue
  with — a physical limit (memory bandwidth, FLOPs), a mathematical fact, a
  cost structure they pay monthly. Never a best practice (best practices are
  conclusions, not grounds).
- **Rungs:** each rung is one step showing the consequence the constraint
  *forces*. Every rung passes the **"because" test** — and in v2 the because
  is **visible caption text** ("Rung 2 — because n² pairs must materialize
  before softmax…"), not an authoring secret. **3–4 rungs**; rungs may be
  symbolic (an invariant, a formula, a scaling law) — dense is fine, leaps
  are not.
- **The ledger (v2, mandatory):** the derivation-so-far is always on stage —
  an accumulating stack of rows (constraint → forced consequence), the row
  under argument accented, established rows dimmed to neutrals, nothing ever
  disappears. Rung beats render as `<Scene variant="continue">` (frameless)
  so the ledger reads as one growing argument. Isolated boxed rung cards are
  the v1 bug this replaces.
- **Notation pre-stage (v2, mandatory):** before the first formula-heavy
  rung, stage every symbol ONCE — each term labeled where it first appears
  (temporal contiguity), kept in a small corner legend thereafter. A rung
  may not introduce unbound notation. Formula builds are staggered
  term-by-term; prose never restates the formula (redundancy).
- **The top rung is the design/concept itself**, named only now — landing as
  *inevitable*: "given these constraints, it couldn't have been otherwise."
  Never state the design first and justify after; that is advocacy, not
  derivation, and an expert smells the difference immediately.
- **The Boundary beat is mandatory:** immediately show where the derivation
  breaks — **strike the ledger row** whose constraint, when relaxed, flips
  the conclusion. This is where expert learning actually lives: the *domain
  of validity* of the argument.
- **Why it sticks:** re-derivation generalizes experience beyond the systems
  the reader happened to run (the generation effect), and a visible
  accumulating ledger is a chain they can re-argue from memory. The
  cheat-sheet's anchor is the top rung in one sentence; MCQ 2 asks which
  constraint, when relaxed, flips the conclusion.

Full contract and worked examples (retrieval-vs-fine-tuning for freshness;
why decode is memory-bound): **`references/first-principles-ladder.md`** —
read it before authoring the Derive beat.

### 2.4 The Thread contract (v2 — mandatory, expert calibration)

The six Thread rules, terse. Full grammar: `references/visual-interactive-storytelling.md` §2.

1. **Agenda StoryMap** (`components/infographic/scenes.tsx`, no icons)
   directly under the `InfographicHeader`: 3–5 terse slots naming the
   argument's stations ("Decode is memory-bound" ← "Bandwidth, not FLOPs" ←
   "Batching amortizes reads"). The reader sees the whole case before it is
   argued; every slot is paid off by a scene.
2. **Connective captions**: every scene caption opens *So / But / Because /
   Therefore* (+ "Rung N" on ledger lessons). Argument coherence is not
   scaffolding — it is how design reviews read.
3. **The stage rule**: the case architecture keeps its topology and
   positions all lesson; `variant="chapter"` opens a beat, `variant=
   "continue"` keeps the stage. Slices, not redraws.
4. **One accented delta per scene, ghost-diffed**: the span/value under
   argument takes the accent; the previous state stays visible dimmed
   (ghost) so the delta is an argument, not a new diagram.
5. **Referent stability**: system names, metric names, symbols, and units
   fixed for the whole lesson. Same numbers throughout; new numbers only in
   Transfer.
6. **The re-argue test (ship gate)**: from the finished ledger + captions
   alone, could the reader re-argue the design decision in a review — and
   say which row flips it? Failing = restructure before shipping.

## 3. The pedagogy layer (expert calibration)

The principles from v6 apply at minimal scaffolding. The ones that shift
most:

- **P4 Expertise reversal governs everything:** cut worked examples of
  basics, cut redundant signaling, cut the analogy after the anchor line.
  The Thread is exempt *only* as structure — the moment it re-explains
  content, it is load.
- **P6 Segmenting + the visible whole (v2):** one rung per step, but the
  ledger accumulates — dense arguments stay followable without becoming
  shallower.
- **P7 The aha is depth/surprise:** a counter-intuitive result, a hidden
  coupling between subsystems — not a withheld definition.
- **P8 Active > passive still holds:** the CER Diagnose beat and the scenario
  MCQs are the Constructive moments; decision-gate widgets shine here.

Sources: v6 §2, `references/learning-science-sources.md`.

## 4. The plain-English gate — EXEMPT

The automated gate is scoped to beginner courses only
(`content/jargon.test.ts`) — experts are outside it by design. Use full
technical precision — imprecise language is the red flag for this
audience, not jargon. Do not add parenthetical translations of standard
terms; it reads as condescension. (The brief's **bold** load-bearing terms
still apply — signaling structure, not simplification. Rule 12's short
sentences still apply — precision and brevity are allies.)

## 5. Color discipline (critical — and unchanged)

Precision doesn't buy a rainbow. One accent per scene (brand blue default),
neutrals carry the load, semantic good/bad only for meaning. Theme-safe
tokens only — `bg-surface-elevated` not `bg-white`, `text-canvas` not
`text-white`, `currentColor`/`var(--*)` in SVG, never literal hex. Dense
scenes make the one-accent rule matter MORE, not less — and in v2 the accent
has one job per scene: **mark the delta under argument** (§2.4). Full color
rules: v6 §3, `../infographics-static/references/brand-system.md`.

## 6. The picture vocabulary (still non-negotiable)

Pictures carry the architecture even for experts — build from
`components/infographic/scenes.tsx` (`Scene` with `variant="chapter" |
"continue"`, `StoryMap` + `StoryMapStep`, `PictureCard`, `SpeechBubble`) or
domain widgets (dashboards, traces, evidence strips, architecture slices)
that lead with the graphic. Motion via `Stagger`/`MotionChild`/`Reveal`.
Tables and formulas are allowed here, but lead with the visual where one
exists. Real code belongs in the prose/exercise; the infographic is the
system view, not a code screenshot.

### 6.1 System diagram (reference layer, below the infographic)

Plain data on the lesson object, rendered by `components/LessonDiagram.tsx`.
All three formats fit experts; **decision** trees shine for boundary
conditions and workflow limits. Terse bracket-pattern node text
(`[ input ]`, `< decision >`), no re-narration. Experts may also SKIP the
diagram when the story infographic already is the architecture view —
duplication is the failure mode this layer exists to prevent.
Formats: `references/standard-visual-formats.md`.

### 6.2 The cheat-sheet

Auto-derived from `concept` (anchor + what + whenNot + URL) by
`components/LessonCheatSheet.tsx` — derive, never author. The terse anchor
line is exactly what makes the card work for this audience.

## 7. Motion

Scroll-triggered, play once, opacity/transform only, both themes legible at
rest, `MotionConfig reducedMotion="user"`, one easing curve. Motion stays
narrative: staggered ledger builds, evidence appearing as it's argued, the
Boundary strike. No decoration just because the scene is dense. Values and
rules: `references/motion-tokens.md`, `references/reveal-patterns.md`.

## 8. Interactivity — open & minimal

The three gates (restraint, affordance, discoverability) are unchanged from
v6. Expert calibration of the *form*:

- **Open & minimal.** Freeform manipulation, no hand-holding, no prescribed
  path — guidance here actively annoys and slows (Tetzlaff 2025). No
  tutorials, no walkthrough text beyond a verb-led instruction.
- **Continuous when there's a knob:** sliders/toggles from
  `components/infographic/controls.tsx`, consequence live while dragging.
  Evidence matrices and decision gates (Constructive) are the expert
  signature patterns.
- **Ghost the BEFORE state** in comparisons (§2.4) — the delta is the
  argument.
- Feedback identifies the **evidence** that supports or weakens the claim —
  it can be minimal, but it must be specific.
- Deterministic, local, illustrative data; reduced-motion-safe by changing
  state, not motion.

Recipes: `references/interactivity-patterns.md`; starter:
`assets/evidence-decision-template.tsx`.

## 9. The authoring workflow

0. **Learning contract first** (`references/lesson-contract.md`) — including
   the v2 Thread fields: agenda slots, the stage sentence, the
   chapter/continue scene list, ghost-diff moments, referents, the notation
   pre-stage, the case add + case-so-far strip, the boundary row.
1. Read the course `level` — if it isn't `"expert"`, wrong skill.
2. State the objective as an observable verb (diagnose, design, justify);
   name the non-obvious connection or counter-intuitive result that is the
   aha.
3. Draft anchor → brief → agenda slots → CER beats → scenes as
   *beat → chapter|continue → connective caption → the ONE delta*; map the
   one interaction (Diagnose/Now-What), decide the diagram format or its
   deliberate omission.
4. Build with the vocabulary (StoryMap + variants included), theme-safe
   colors, v6 motion; add `concept` and `diagram` as data on the lesson
   object. A NEW lesson must also be registered in
   `components/infographic/index.tsx` **and** given a `unit()` entry in
   `convex/lib/dailyPlan.ts` — that file's coverage test fails on any
   unregistered lesson.
5. Verify: `npm run typecheck` + `npm test`; load and scroll; **run the
   re-argue test** (§2.4); reduced motion; 375px; one accent per
   scene (marking the delta); exactly 2 scenario MCQs (3–4 choices);
   problem-first opening, no warm-up; ledger accumulates and the Boundary
   beat strikes its row; case-so-far strip present; widget earned +
   announced; cheat-sheet + PNG route.

Full verification checklist: v6 §7 Step 5.

## What NOT to do (expert, v2)

- Don't open with a scored quiz, prediction card, or application card.
- Don't ship a third MCQ or definition-style prompts.
- Don't state the design and then justify it — **derive it**; the top rung is
  where the design first gets its name, and the Boundary beat strikes the
  row where the derivation breaks.
- Don't ground a ladder in a best practice — best practices are conclusions;
  ground it in a constraint.
- Don't build more than 4 rungs — split the lesson or find a deeper ground.
- Don't draw rungs as isolated boxed cards — **the ledger accumulates**;
  nothing disappears; rungs render as continuations.
- Don't introduce unbound notation — the notation pre-stage binds every
  symbol before its formula; don't restate formulas in prose.
- Don't hide the "because" — it's visible caption text on every rung.
- Don't skip the Boundary beat — that's where expert learning lives.
- Don't simplify vocabulary or add analogy beyond the one anchor line —
  over-scaffolding here measurably harms this reader.
- Don't let any Thread element re-explain content the reader knows — agenda,
  ledger, connectives are STRUCTURE; the moment they teach basics, cut them.
- Don't drop the course case; each lesson adds evidence, uncertainty, or a
  counter-example, and opens with the case-so-far strip.
- Don't reset the stage — same topology all lesson; slice it, don't redraw
  it; ghost-diff the previous state.
- Don't write ordinal-only captions — every caption opens with a connective;
  captions must pass the re-argue test.
- Don't re-bind referents mid-lesson (system names, metrics, symbols, units).
- Don't over-signal (arrows/exclamations on basics) — trust the reader.
- Don't shy from full formulas, real code, and failure modes.
- Don't park the widget after the resolution; it lives on Diagnose/Now-What.
- Don't hand-roll sliders/toggles — use `components/infographic/controls.tsx`.
- Don't duplicate the architecture view in a second diagram layer.
- Don't hardcode hex, `bg-white`, `text-white`.
- Don't author cheat-sheet content — it derives from `concept`.

## References (in this skill's directory)

- `references/narrative-structures.md` — the CER beats in full.
- `references/first-principles-ladder.md` — the Ladder contract, the ledger, the notation pre-stage, expert worked examples.
- `references/visual-interactive-storytelling.md` — fusion rule + **the Thread contract (§2), expert-calibrated**, beat→interaction maps, worked CER exemplar, v2 rubric.
- `references/standard-visual-formats.md` — flow / compare / decision formats.
- `references/interactivity-patterns.md` — evidence-matrix and decision-gate recipes.
- `references/lesson-contract.md` — the pre-markup contract template (v2 Thread fields).
- `references/motion-tokens.md`, `references/reveal-patterns.md` — motion values.
- `references/learning-science-sources.md` — the evidence base.
- `../infographics-interactive_v6/SKILL.md` — the superset (cross-level view).
- `../infographics-static/references/brand-system.md` — theme-aware palette.
