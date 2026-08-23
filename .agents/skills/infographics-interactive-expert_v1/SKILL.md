---
name: infographics-interactive-expert_v1
description: THE skill for creating and editing EXPERT courses and lessons on ByteSizeDecodes — audience is senior practitioners with ~5+ years of AI/ML experience who have owned production systems and made architectural trade-offs. Use for ANY lesson, course page, infographic, widget, diagram, or cheat-sheet whose course has `level: "expert"` — first-principles visual storytelling (the First-Principles Ladder: derive the design from fundamental constraints rung by rung, with the boundary where the derivation breaks) inside the Problem-First Diagnostic (CER) framework, one persistent production case with competing constraints, terse one-line anchors (kept, never whimsical), full technical precision with NO jargon simplification (exempt from the plain-English gate), higher scene density, full formulas, real code, failure modes and edge cases, open minimal widgets, and exactly 2 scenario MCQs with 3–4 choices. Read the course's `level` in `content/courses.ts` first; if it says "expert", THIS is the skill — not the generic v6. Derived from infographics-interactive_v6 (the superset); everything here is v6 pre-calibrated to experts.
---

# infographics-interactive-expert_v1

The expert split of `infographics-interactive_v6` (v1). Everything v6
requires still applies — anchor-first brief, story infographic, system
diagram layer, exactly 2 scenario MCQs, cheat-sheet, color/motion discipline.
This file removes the cross-level branching: **every rule here is the expert
rule, stated once.** If you need the multi-level view, read the v6 superset.

The governing fact: **over-scaffolding experts actively harms them**
(expertise reversal, Kalyuga 2007; Tetzlaff 2025). Your reader already owns
the schemas. Heavy analogies, worked examples on basics, and dense signaling
become extraneous load — and imprecise language reads as a red flag. They
will catch you if you round the wrong number. Precision first.

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
| **Narrative** | **Sparse.** Problem-first is fine; skip the story wrapping. |
| **Jargon** | **Full technical precision.** Don't dumb down — exempt from the plain-English gate. |
| **Density** | **Higher density OK.** Experts hold more chunks and are bored by over-simplification. Ladder rungs may be symbolic (a formula or invariant is a fine rung). |
| **Signaling** | **Minimal.** Trust the reader. |
| **Math/code** | **Full formulas, real code, edge cases, failure modes.** This is where the entropy formula and the cosine-similarity math live. |
| **The aha** | **Inevitability plus its boundary** — the design lands as the only possible conclusion of the constraints, *and* you show exactly where the derivation breaks. Depth and surprise, not withheld basics. |

## 1. The anchor-first opening (mandatory, terse)

The lesson page order:

```
header → CONCEPT BRIEF (ANCHOR first) → story infographic →
SYSTEM DIAGRAM (reference layer) → prose → exactly 2 scenario MCQs → CHEAT-SHEET
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

## 2. The storytelling framework: Problem-First Diagnostic (CER)

Every expert lesson is laid out in these beats (full definitions in
`references/narrative-structures.md`):

**Problem-first → You diagnose → Derive (the Ladder, §2.3) → Boundary → What/So-What/Now-What**

- **Problem-first:** open on the failing system or design tension — no
  warm-up, no "why care?" paragraph.
- **You diagnose:** hand the reader the evidence (trace, metrics, diagram)
  and invite them to locate the fault — this is the natural home for a
  widget (§8).
- **Derive:** the resolution is **argued from fundamental constraints rung by
  rung** (§2.3), like an incident review: claim, the constraint that forces
  it, the mechanism connecting them. Not stated-and-justified — derived.
- **Boundary:** where the derivation breaks — the regime where the standard
  advice (or the just-derived design) fails. The old counter-examples beat,
  now welded to the ladder's top rung. Skipping this is the classic
  expert-lesson sin.
- **What/So-What/Now-What:** the operational takeaway and next action.

### 2.1 Course continuity — the case is mandatory

Define **one production design or failure case with competing constraints**
before authoring the first lesson (scale vs. cost, latency vs. freshness,
coverage vs. privacy). Each lesson adds **evidence, uncertainty, or a
counter-example** to that case; the capstone is a design review over the
accumulated case. Write the case in 2–4 sentences, state the final learner
artifact, and name the lesson where each major piece of evidence first
appears. The case is a scaffold — omit it for a lesson where a standalone
deep-dive is genuinely clearer.

### 2.2 Visual interactive storytelling (the fusion rule)

1. **One through-line visual** — the course-case architecture (the system
   diagram of the case), each lesson exposing a new state or slice of it.
2. At most **one** interaction, mapped to a beat (Diagnose / Now-What);
   default is *no* widget.
3. Interaction is a story turn: BEFORE → LEARNER ACTS → AFTER (evidence
   re-composed + evidence-specific feedback).
4. The widget, both MCQs, and the transfer test one capability from
   different angles.
5. Full grammar, worked CER exemplars, and the rubric:
   `references/visual-interactive-storytelling.md`. An animated glossary is a
   bug — but so is a wall of text; experts still get pictures, just denser
   and more literal.

### 2.3 First-principles visual storytelling (the Ladder)

The expert signature method. Five years of experience teaches *what worked
here*; first principles teach *what must work anywhere*. The core explanation
of a lesson is a **derivation from fundamental constraints**, drawn as a
ladder the reader could re-argue in a design review:

- **Ground:** a fundamental constraint or invariant the reader cannot argue
  with — a physical limit (memory bandwidth, FLOPs), a mathematical fact, a
  cost structure they pay monthly. Never a best practice (best practices are
  conclusions, not grounds).
- **Rungs:** each rung is one scene showing the consequence the constraint
  *forces*. Every rung passes the **"because" test** — the reader can say why
  it follows. **3–4 rungs**; rungs may be symbolic (an invariant, a formula,
  a scaling law) — dense is fine, leaps are not.
- **The top rung is the design/concept itself**, named only now — landing as
  *inevitable*: "given these constraints, it couldn't have been otherwise."
  Never state the design first and justify after; that is advocacy, not
  derivation, and an expert smells the difference immediately.
- **The Boundary beat is mandatory:** immediately show where the derivation
  breaks — which constraint, when relaxed, flips the conclusion. This is
  where expert learning actually lives: the *domain of validity* of the
  argument.
- **Why it sticks:** re-derivation generalizes experience beyond the systems
  the reader happened to run (the generation effect), and the ladder is a
  chain they can re-argue from memory. The cheat-sheet's anchor is the top
  rung in one sentence; MCQ 2 asks which constraint, when relaxed, flips the
  conclusion.
- **Visual grammar:** build bottom-up with `Stagger`, one concept per rung,
  only the top rung (and its boundary marker) takes the accent.

Full contract and worked examples (retrieval-vs-fine-tuning for freshness;
why decode is memory-bound):
**`references/first-principles-ladder.md`** — read it before authoring the
Derive beat.

## 3. The pedagogy layer (expert calibration)

The 8 principles from v6 apply at minimal scaffolding. The ones that shift
most:

- **P4 Expertise reversal governs everything:** cut worked examples of
  basics, cut redundant signaling, cut the analogy after the anchor line.
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
still apply — signaling structure, not simplification.)

## 5. Color discipline (critical — and unchanged)

Precision doesn't buy a rainbow. One accent per scene (brand blue default),
neutrals carry the load, semantic good/bad only for meaning. Theme-safe
tokens only — `bg-surface-elevated` not `bg-white`, `text-canvas` not
`text-white`, `currentColor`/`var(--*)` in SVG, never literal hex. Dense
scenes make the one-accent rule matter MORE, not less. Full color rules: v6
§3, `../infographics-static/references/brand-system.md`.

## 6. The picture vocabulary (still non-negotiable)

Pictures carry the architecture even for experts — build from
`components/infographic/scenes.tsx` or domain widgets (dashboards, traces,
evidence strips, architecture slices) that lead with the graphic. Tables and
formulas are allowed here, but lead with the visual where one exists; motion
via `Stagger`/`MotionChild`/`Reveal`. Real code belongs in the
prose/exercise; the infographic is the system view, not a code screenshot.

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
narrative: staggered pipeline builds, evidence appearing as it's argued. No
decoration just because the scene is dense. Values and rules:
`references/motion-tokens.md`, `references/reveal-patterns.md`.

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
- Feedback identifies the **evidence** that supports or weakens the claim —
  it can be minimal, but it must be specific.
- Deterministic, local, illustrative data; reduced-motion-safe by changing
  state, not motion.

Recipes: `references/interactivity-patterns.md`; starter:
`assets/evidence-decision-template.tsx`.

## 9. The authoring workflow

0. **Learning contract first** (`references/lesson-contract.md`) — including
   the case add: which evidence/uncertainty/counter-example does THIS lesson
   contribute, and what competing constraints does it sharpen?
1. Read the course `level` — if it isn't `"expert"`, wrong skill.
2. State the objective as an observable verb (diagnose, design, justify);
   name the non-obvious connection or counter-intuitive result that is the
   aha.
3. Draft anchor → brief → CER beats → scenes as *beat → what changes in the
   picture*; map the one interaction (Diagnose/Now-What), decide the diagram
   format or its deliberate omission.
4. Build with the vocabulary, theme-safe colors, v6 motion; add `concept`
   and `diagram` as data on the lesson object. A NEW lesson must also be
   registered in `components/infographic/index.tsx` **and** given a `unit()`
   entry in `convex/lib/dailyPlan.ts` — that file's coverage test fails on
   any unregistered lesson.
5. Verify: `npm run typecheck` + `npm test`; load and scroll; dark mode;
   reduced motion; 375px; one accent per scene; exactly 2 scenario MCQs
   (3–4 choices); problem-first opening, no warm-up; Boundary beat present
   (where the derivation breaks); case continuity advanced; widget earned +
   announced; story check; cheat-sheet + PNG route.

Full verification checklist: v6 §7 Step 5.

## What NOT to do (expert)

- Don't open with a scored quiz, prediction card, or application card.
- Don't ship a third MCQ or definition-style prompts.
- Don't state the design and then justify it — **derive it**; the top rung is
  where the design first gets its name, and the Boundary beat shows where the
  derivation breaks.
- Don't ground a ladder in a best practice — best practices are conclusions;
  ground it in a constraint.
- Don't build more than 4 rungs — split the lesson or find a deeper ground.
- Don't simplify vocabulary or add analogy beyond the one anchor line —
  over-scaffolding here measurably harms this reader.
- Don't skip the Boundary beat — that's where expert learning lives.
- Don't drop the course case; each lesson adds evidence, uncertainty, or a
  counter-example to it.
- Don't over-signal (arrows/exclamations on basics) — trust the reader.
- Don't shy from full formulas, real code, and failure modes.
- Don't park the widget after the resolution; it lives on Diagnose/Now-What.
- Don't hand-roll sliders/toggles — use `components/infographic/controls.tsx`.
- Don't duplicate the architecture view in a second diagram layer.
- Don't hardcode hex, `bg-white`, `text-white`.
- Don't author cheat-sheet content — it derives from `concept`.

## References (in this skill's directory)

- `references/narrative-structures.md` — the CER beats in full.
- `references/first-principles-ladder.md` — the Ladder contract and expert worked examples.
- `references/visual-interactive-storytelling.md` — fusion rule, beat→interaction maps, worked CER exemplars.
- `references/standard-visual-formats.md` — flow / compare / decision formats.
- `references/interactivity-patterns.md` — evidence-matrix and decision-gate recipes.
- `references/lesson-contract.md` — the pre-markup contract template.
- `references/motion-tokens.md`, `references/reveal-patterns.md` — motion values.
- `references/learning-science-sources.md` — the evidence base.
- `../infographics-interactive_v6/SKILL.md` — the superset (cross-level view).
- `../infographics-static/references/brand-system.md` — theme-aware palette.
