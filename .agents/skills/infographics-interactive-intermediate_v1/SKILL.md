---
name: infographics-interactive-intermediate_v1
description: THE skill for creating and editing INTERMEDIATE courses and lessons on ByteSizeDecodes — audience is practitioners with ~2 years of hands-on AI/ML experience who know the standard vocabulary but not always the WHY beneath it. Use for ANY lesson, course page, infographic, widget, diagram, or cheat-sheet whose course has `level: "intermediate"` — first-principles visual storytelling (the First-Principles Ladder: derive the concept from ground truths rung by rung, never state-then-explain) inside the Predict–Investigate–Case (PIC) framework, one persistent course case every lesson advances, analogies only as quick lead-ins, moderate formulas and real short code, ~4 elements per scene, task-framed interactive widgets, and exactly 2 real-life scenario MCQs with 3–4 choices. Read the course's `level`  in `content/courses/`; if it says "intermediate", THIS is the skill — not the generic v6. Derived from infographics-interactive_v6 (the superset); everything here is v6 pre-calibrated to intermediates.
---

# infographics-interactive-intermediate_v1

The intermediate split of `infographics-interactive_v6` (v1). Everything v6
requires still applies — anchor-first brief, story infographic, system
diagram layer, exactly 2 scenario MCQs, cheat-sheet, color/motion discipline.
This file removes the cross-level branching: **every rule here is the
intermediate rule, stated once.** If you need the multi-level view, read the
v6 superset.

The governing fact: your reader has ~2 years of hands-on AI/ML work — they
run the recipes daily and need the **why beneath them**. Full beginner
scaffolding reads as padding; expert-level terseness loses them. They want
the anchor *quickly*, then a mechanism they could re-derive at a whiteboard.

## 0. Who you are writing for

**A practitioner with ~2 years of hands-on AI/ML experience** — they have
trained and shipped models, run evals, and know the standard vocabulary
(loss, epoch, embedding, fine-tuning, overfitting, prompt, context window)
without needing it defined. What they lack is the **why beneath the recipes
they use**: they know you shuffle the training data, not why; they know
attention is expensive, not what forces it to be. Their schemas exist but
are partial or borrowed — which is exactly why this skill teaches
**first-principles derivation** (§2.3): rebuild the mechanism from ground
truths the reader already accepts, and the partial schema gets repaired
into a durable one.

| Dimension | Rule |
|---|---|
| **Analogy** | Quick lead-in only — one line, then fade fast to the formal representation. The derivation is the intuition here; extended analogies displace it. |
| **Narrative** | Keep the spine (problem → resolution) but tighten it. Less hand-holding than a story-mountain. |
| **Jargon** | Standard ML/AI vocabulary is fine unglossed — a 2-year practitioner knows loss, epochs, embeddings. Gloss only genuinely uncommon terms (§4). |
| **Density** | **~4 elements per scene.** Slightly denser scenes are OK. |
| **Signaling** | **Moderate.** Let the reader find some things themselves. |
| **Math/code** | **Moderate formulas OK** (write the objective, not the derivation of its gradient). Real short code is welcome. |
| **The aha** | **Inevitability** — the concept lands as the only possible conclusion of the ladder ("it couldn't have been otherwise"). Let the learner work for it. |

## 1. The anchor-first opening (mandatory)

The lesson page order:

```
header → CONCEPT BRIEF (ANCHOR first) → story infographic →
SYSTEM DIAGRAM (reference layer) → prose → exactly 2 scenario MCQs → CHEAT-SHEET
```

No prediction card. No application card. No scored quiz before the idea.

```ts
concept: {
  anchor: "…one-sentence everyday metaphor — FIRST…",     // quick lead-in
  what:   "…10-second summary — mechanism language allowed…",
  why:    "…core benefit or problem it solves…",
  where:  ["…application 1…", "…application 2…"],       // 2–3, all real
  whenNot: "…one testable boundary rule…",
},
```

### The intermediate anchor

- **Quick lead-in, then fade to the formal representation fast.** One
  sentence, one touch of the familiar: "Hyperparameter tuning is guitar
  tuning — one string at a time, by ear." Then get to the dials.
- The anchor still feeds the through-line visual and the cheat-sheet, so pick
  one the infographic can actually dramatize — but the visual may move on to
  the mechanism once the anchor has landed.
- Brief-field rules (enforced by `content/courses.test.ts`): 1–2 sharp
  sentences per point; 1–3 **bold** load-bearing terms; "Where" specific and
  already-met; "When NOT" a testable rule.

### 1.1 The two closing MCQs — exactly 2, both real-life scenarios, 3–4 choices

- **A scenario, not a definition.** Concrete actors and systems ("Relay, an
  AI support assistant, overflows its context window on day one…"), asking
  for the decision or diagnosis.
- One question checks the What/Why; the **second transfers** to a new
  situation.
- Explanations resolve the scenario — name the misconception, tie the
  correction to the evidence, >20 chars.
- Distractors embody plausible practitioner misconceptions (the
  retrain-first reflex, the bigger-model reflex), never filler.
- **3–4 choices** for intermediate courses. A third question is a bug.
- When the lesson centers on a Ladder (§2.3), **MCQ 2 asks the learner to
  re-derive one rung in a new situation** — retrieval of the derivation, not
  recognition of the conclusion, is what makes it stick.

## 2. The storytelling framework: Predict–Investigate–Case (PIC)

Every intermediate lesson is laid out in these beats (full definitions in
`references/narrative-structures.md`):

**Scenario → Predict → Observe → Derive (the Ladder, §2.3) → Transfer**

- **Scenario:** open on the course case (§2.1) hitting a concrete situation.
- **Predict:** invite the learner to guess the outcome — as *narrative* or an
  in-widget prediction, never as a scored question before the concept brief.
  The v6 "no quiz before the brief" rule is untouched; the Predict beat is an
  invitation ("what do you expect the trace to show?"), not an assessment.
- **Observe:** the evidence appears in the picture — this is the natural home
  for a widget (§8).
- **Derive:** the mechanism is **built up rung by rung from ground truths**
  (§2.3) using the case's own evidence — not stated and then justified. This
  beat replaces the old "explain-via-case" telling; the case still supplies
  the evidence, but the concept is *derived*, not described.
- **Transfer:** the second MCQ carries it to a new situation — ideally by
  asking the learner to re-derive one rung there.

### 2.1 Course continuity — the case is mandatory

Define **one persistent, realistic case** before authoring the first lesson:
a bounded product incident or build (an AI support assistant for a mid-size
shop; a RAG assistant over a document set). Every lesson adds **one piece of
evidence, constraint, or decision** to that case; the capstone uses the
accumulated case rather than inventing a disconnected final exercise. Write
the case in 2–4 sentences, state the final learner artifact, and name the
lesson where each major piece of evidence first appears. The case is a
scaffold, not a screenplay — if a standalone definition is genuinely clearer,
omit it for that lesson.

### 2.2 Visual interactive storytelling (the fusion rule)

1. **One through-line visual** — for intermediates, prefer the course-case
   diagram reused across lessons (the assistant's pipeline, the retrieval
   flow), each lesson showing a new state of it.
2. At most **one** interaction, mapped to a beat (Predict/Observe is the
   natural home); default is *no* widget.
3. Interaction is a story turn: BEFORE → LEARNER ACTS → AFTER (evidence
   re-composed + specific feedback).
4. The widget, both MCQs, and the transfer test one capability from different
   angles.
5. Full grammar and rubric: `references/visual-interactive-storytelling.md`
   (includes worked PIC exemplars). An animated glossary is a bug.

### 2.3 First-principles visual storytelling (the Ladder)

The intermediate signature method. A 2-year practitioner's gap is never "has
never heard of X" — it's "uses X daily without knowing what *forces* X to be
so." So the core explanation of a lesson is a **derivation the learner could
re-perform**, drawn as a ladder the learner could re-draw:

- **Ground:** open on a ground truth the reader already accepts without
  argument (a definition they use daily, a physical limit, a constraint they
  live with in production).
- **Rungs:** each rung is one scene showing the consequence the ground truth
  *forces*. Every rung must pass the **"because" test** — the learner can say
  why this rung follows from the one below it. 3–5 rungs; more means you have
  two ladders.
- **The top rung is the concept itself** — named only now. The aha is
  *inevitability*: "it couldn't have been otherwise." Never state the concept
  first and explain after; that is describing, not deriving, and it leaves
  nothing to remember.
- **Why it sticks:** re-derivation beats re-reading (the generation effect —
  the learner who rebuilt the chain owns it), and a ladder is a **chain
  mnemonic**: each rung cues the next. The cheat-sheet's anchor line should
  be the ladder's top rung in one sentence; MCQ 2 should ask the learner to
  re-derive one rung in a new situation.
- **Visual grammar:** build the ladder bottom-up with `Stagger` — the rungs
  stack like the formula-build pattern, one concept per scene (P6 segmenting),
  and only the top rung takes the accent color.

Full contract, rung rules, and a worked example (why we shuffle training
data, derived from what a gradient estimate is):
**`references/first-principles-ladder.md`** — read it before authoring the
Derive beat.

## 3. The pedagogy layer (intermediate calibration)

The 8 principles from v6 apply at moderate strength. The two that most shape
markup:

- **P1 Dual coding:** the visual carries the mechanism; prose captions it.
  No channel duplication.
- **P4 Expertise reversal cuts both ways:** worked examples still help this
  reader; relentless analogy does not. One anchor, then mechanism.
- **P8 Active > passive:** the PIC Predict beat plus the scenario MCQs give
  you two cheap Constructive moments — use both.

Sources: v6 §2, `references/learning-science-sources.md`.

## 4. The plain-English gate (uncommon terms only, author-judged)

First use of an **uncommon** technical term carries a same-sentence
parenthetical translation — in `concept` fields, prose, prompts, and
explanations:

- "The **embedding** (meaning coordinates: similar ideas land close together)
  is what the search actually compares."

Common industry words (model, training, feature, accuracy, prompt, context)
are not on the list and need no gloss — and the automated gate is scoped to
BEGINNER courses only (`content/jargon.test.ts`): a 2-year practitioner
already owns the curated vocabulary in `content/jargon-terms.ts`, and
glossing it reads as condescension. Gloss on first use only what a working
practitioner plausibly hasn't met (e.g. a niche technique name), and keep the
parenthetical short and factual.

## 5. Color discipline (critical)

One accent per scene (brand blue default), neutrals carry the load, semantic
good/bad only for correct-vs-incorrect teaching moments. Theme-safe tokens
only — `bg-surface-elevated` not `bg-white`, `text-canvas` not `text-white`,
`currentColor`/`var(--*)` in SVG, never literal hex. Full color rules: v6 §3,
`../infographics-static/references/brand-system.md`.

## 6. The picture vocabulary (non-negotiable)

Build from `components/infographic/scenes.tsx` (`Scene`, `PictureCard`,
`Operator`, `SpeechBubble`, `PersonFigure`, `MachineFigure`, `CarShape`,
`BikeShape`) or a domain widget that still leads with the graphic —
dashboards, traces, evidence strips are all in-bounds when the *picture*
carries the idea. Motion via `Stagger`/`MotionChild`/`Reveal`. Short
illustrative code belongs in the prose/exercise, not replacing the visual.

### 6.1 System diagram (reference layer, below the infographic)

Plain data on the lesson object, rendered by `components/LessonDiagram.tsx`.
All three formats fit intermediates: **flow** for pipelines,
**compare** for choosing between approaches (reach for "Where to use" /
"When NOT to use" rows), **decision** for workflow limits. Terse node text
with the bracket patterns (`[ input ]`, `< decision >`); no re-narration of
the story above. Formats and worked examples:
`references/standard-visual-formats.md`.

### 6.2 The cheat-sheet

Auto-derived from `concept` (anchor + what + whenNot + URL) by
`components/LessonCheatSheet.tsx` — derive, never author. Renders after the
MCQs; doubles as the OG image.

## 7. Motion

Scroll-triggered, play once, opacity/transform only, both themes legible at
rest, `MotionConfig reducedMotion="user"`, one easing curve. The formula/
pipeline build via `Stagger` is the signature beat — segment it, never dump a
six-step process in one frame. Values and rules:
`references/motion-tokens.md`, `references/reveal-patterns.md`.

## 8. Interactivity — task-framed exploration

The three gates (restraint, affordance, discoverability) are unchanged from
v6. Intermediate calibration of the *form*:

- **Task-framed exploration.** Give a goal — "find the anomaly, then tune
  the threshold until you catch it" — and let them work. More open than the
  beginner's 2–3 worked presets; far more guided than the expert's freeform.
- **Continuous when there's a knob:** if the concept is "what happens as X
  changes," use `SliderControl`/`ToggleGroup` from
  `components/infographic/controls.tsx`, consequence live while dragging,
  presets as chips.
- Every control looks like a control (chrome, selected state, focus ring)
  and carries a verb-led instruction. Feedback names the misconception and
  the next investigation ("the 24-hour view hides the spike — inspect the
  one-hour window before declaring the service healthy").
- Deterministic, local, illustrative data — no backend calls per drag;
  reduced-motion-safe by changing state, not motion.

Recipes: `references/interactivity-patterns.md`; starters:
`assets/interactive-widget-template.tsx`, `assets/evidence-decision-template.tsx`.

## 9. The authoring workflow

0. **Learning contract first** (`references/lesson-contract.md`) — including
   the case add: which piece of evidence/constraint does THIS lesson
   contribute?
1. Read the course `level` — if it isn't `"intermediate"`, wrong skill.
2. State the objective as an observable verb; name the aha and the likely
   wrong conclusion.
3. Draft anchor → brief → PIC beats → scenes as *beat → what changes in the
   picture*; map the one interaction (Predict/Observe), decide the diagram
   format.
4. Build with the vocabulary, theme-safe colors, v6 motion; add `concept`
   and `diagram` as data on the lesson object. A NEW lesson must also be
   registered in `components/infographic/index.tsx` **and** given a `unit()`
   entry in `convex/lib/dailyPlan.ts` — that file's coverage test fails on
   any unregistered lesson.
5. Verify: `npm run typecheck` + `npm test`; load and scroll; dark mode;
   reduced motion; 375px; one accent per scene; exactly 2 scenario MCQs
   (3–4 choices); anchor first; case continuity advanced; widget earned +
   announced; story check; cheat-sheet + PNG route.

Full verification checklist: v6 §7 Step 5.

## What NOT to do (intermediate)

- Don't open with a scored quiz, prediction card, or application card.
- Don't ship a third MCQ or definition-style prompts.
- Don't state the concept and then explain it — **derive it**; the ladder's
  top rung is where the concept first gets its name.
- Don't build more than 5 rungs — that's two ladders, i.e. two lessons.
- Don't gloss common industry words — it reads as condescending; do gloss
  genuinely uncommon terms on first use (author judgment, §4).
- Don't linger on the analogy after it lands; fade to the mechanism.
- Don't drop the course case — each lesson must add to it.
- Don't exceed ~4–5 focal elements per scene, or run two accent hues.
- Don't park the widget after the resolution; it lives on Predict/Observe.
- Don't ship preset-only controls where a knob begs to be dragged; don't
  hand-roll sliders/toggles — use `components/infographic/controls.tsx`.
- Don't duplicate the story's narration in the diagram layer.
- Don't hardcode hex, `bg-white`, `text-white`.
- Don't author cheat-sheet content — it derives from `concept`.

## References (in this skill's directory)

- `references/narrative-structures.md` — the PIC beats in full.
- `references/first-principles-ladder.md` — the Ladder contract, rung rules, worked example.
- `references/visual-interactive-storytelling.md` — fusion rule, beat→interaction maps, worked PIC exemplars.
- `references/standard-visual-formats.md` — flow / compare / decision formats.
- `references/interactivity-patterns.md` — widget recipes, feedback contracts.
- `references/lesson-contract.md` — the pre-markup contract template.
- `references/motion-tokens.md`, `references/reveal-patterns.md` — motion values.
- `references/learning-science-sources.md` — the evidence base.
- `../infographics-interactive_v6/SKILL.md` — the superset (cross-level view).
- `../infographics-static/references/brand-system.md` — theme-aware palette.
