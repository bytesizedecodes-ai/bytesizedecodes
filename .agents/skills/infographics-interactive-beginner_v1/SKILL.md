---
name: infographics-interactive-beginner_v1
description: THE skill for creating and editing BEGINNER courses and lessons on ByteSizeDecodes — audience is recent college graduates (any major) with zero professional AI/ML experience. Use for ANY lesson, course page, infographic, widget, diagram, or cheat-sheet whose course has `level: "beginner"` — picture-led storytelling, playful everyday anchors that double as the through-line visual, zero jargon (every technical term gets a same-sentence plain-English translation), no math or code, generous whitespace, heavily signaled scenes, constrained worked widgets, and exactly 2 real-life scenario MCQs with 3 choices. Read the course's `level` in `content/courses.ts` first; if it says "beginner", THIS is the skill — not the generic v6. Derived from infographics-interactive_v6 (the superset); everything here is v6 pre-calibrated to beginners.
---

# infographics-interactive-beginner_v1

The beginner split of `infographics-interactive_v6` (v1). Everything v6
requires still applies — anchor-first brief, story infographic, system
diagram layer, exactly 2 scenario MCQs, cheat-sheet, color/motion discipline.
This file removes the cross-level branching: **every rule here is the beginner
rule, stated once, at full strength.** If you need the multi-level view (e.g.
authoring across levels), read the v6 superset.

The single governing fact: **techniques that help beginners actively harm
experts** (expertise reversal, Kalyuga 2007) — so this skill over-serves
analogy, narrative, signaling, and scaffolding *on purpose*. Do not "tone it
up" for advanced readers; that is the other skill's job.

## 0. Who you are writing for

**Recent college graduates (any major) entering or working alongside AI** —
zero professional AI/ML experience. They have intact study skills, everyday
software fluency, and comfortable numeracy (percentages, counts, simple bar
comparisons). What they don't have is the *domain*: they have never seen a
loss curve and should never need to in this course.

They are building **new schemas** — and that is why this skill stays
**analogy-first**: brand-new knowledge anchors best on familiar objects.
(Derivation-first teaching — first principles — is for readers who already
hold partial schemas and need them repaired; that lives in the intermediate
and expert skills. Do not "upgrade" a beginner lesson to derivations.)

| Dimension | Rule |
|---|---|
| **Analogy** | Anchor every abstract concept to a **familiar everyday object** (a car, sorting mail, tasting soup, a whiteboard). Then *fade* to the simple idea — concrete-only blocks transfer. |
| **Narrative** | Full story arc: relatable problem → tension → resolution. Open with "why should I care?" — career-adjacent scenarios (a first internship, a first job task) land hardest with graduates. |
| **Jargon** | **None.** Every technical term is translated inline the first time (§4, automated gate). New field, not new brain — a CS-adjacent graduate still hasn't met "embedding". |
| **Density** | **~3 elements per scene.** One concept per scene. Generous whitespace. Plain numeracy (counts, %, bar comparisons) is welcome in scenes; the reference-diagram layer may use simple comparison tables. |
| **Signaling** | **Heavy** — one accent color cues the focal element; arrows point at what matters. |
| **Math/code** | **None.** No formulas, no code blocks. Counting, percentages, and pictures only. |
| **The aha** | Engineer it: small tension → the relationship becomes visually obvious → withhold the conclusion a beat so the learner generates it. |

## 1. The anchor-first opening (mandatory)

The lesson page order:

```
header → CONCEPT BRIEF (ANCHOR first) → story infographic →
SYSTEM DIAGRAM (reference layer) → prose → exactly 2 scenario MCQs → CHEAT-SHEET
```

No prediction card. No application card. No quiz before the idea. The learner
meets the concept as **something they already touch** before anything formal.

```ts
concept: {
  anchor: "…one-sentence everyday metaphor — FIRST…",     // playful, physical
  what:   "…10-second plain-English summary…",
  why:    "…core benefit or problem it solves…",
  where:  ["…application 1…", "…application 2…"],       // 2–3, all real
  whenNot: "…one testable boundary rule…",
},
```

### The beginner anchor

- **Playful everyday object**, something a 10-year-old has actually touched —
  a guitar being tuned, mail being sorted, soup being tasted, a whiteboard
  being wiped. One sentence. If the anchor needs a paragraph, it's the story's
  job, not the brief's.
- **The anchor IS the through-line.** The story infographic dramatizes *this*
  metaphor — the soup, the whiteboard, the car. Never pick a metaphor the
  visual never shows.
- **Example:** "Gradient descent is like hiking down a foggy mountain — every
  step follows the steepest slope you can feel."
- Fade from it: concrete anchor → simplified picture → the idea in one plain
  sentence. Always say where the analogy breaks ("the soup can't taste *too*
  much; the model can").

Brief-field rules (all levels, enforced by `content/courses.test.ts`):
1–2 sharp sentences per point; 1–3 **bold** load-bearing terms per point
(never whole sentences); "Where" is specific and already-met (spam filters,
face unlock — never "many industries"); "When NOT" is a rule the learner can
apply, not a shrug.

### 1.1 The two closing MCQs — exactly 2, both real-life scenarios, 3 choices

- **A scenario, not a definition.** Named actors and systems ("Mira's support
  chatbot forgets the order number from message one…"), asking for the
  decision or diagnosis. "What is X?" prompts fail review.
- One question checks the What/Why; the **second transfers** the idea to a
  new situation.
- Explanations resolve the scenario — name the misconception, tie the
  correction to the evidence, >20 chars. Never bare "Correct."
- Distractors embody plausible beginner misconceptions (the magic-thinking
  choice, the memory-as-database choice), never filler.
- **3 choices** for beginner courses. A third question is a bug.

## 2. The storytelling framework: Anchored Story-Mountain + Concreteness Fade

Every beginner lesson is laid out in these beats (full definitions in
`references/narrative-structures.md`):

**Hook → Concrete anchor → Tension/impasse → Reveal + fade to the idea → Resolution**

- **Hook (why care?):** a relatable moment — the chatbot that "forgot", the
  photo app that groups faces. One scene, ≤3 elements.
- **Concrete anchor:** the everyday object on stage, doing exactly one thing.
- **Tension/impasse:** the naive reading visibly fails — the guesser guesses
  wrong, the overflowing whiteboard drops the order number. This is where a
  widget earns its place if the concept has one (§8).
- **Reveal + fade:** the hidden relationship becomes visible at once; then
  one plain sentence names it. Withhold the verbal conclusion one beat
  ("what do you notice?") so the learner generates it — insight nearly
  doubles retention (Cabeza 2025).
- **Resolution:** the idea applied back to the opening moment.

### 2.1 Course continuity

A recurring character/story is welcome (the same shop, the same assistant) —
beginners like the familiarity — but never let the character obscure the
concept. If in doubt, cut the character.

### 2.2 Visual interactive storytelling (the fusion rule)

1. **One through-line visual** for the lesson — the anchor object, new
   *state* each scene, never a new metaphor per scene.
2. Map at most **one** interaction to a beat (tension/impasse is the natural
   home for beginners) — default is *no* widget.
3. Interaction is a story turn: BEFORE (tempting wrong reading) → LEARNER
   ACTS → AFTER (evidence re-composed in the picture + specific feedback).
4. The widget, both MCQs, and the fade test one capability from different
   angles — not three restatements.
5. Full grammar and rubric: `references/visual-interactive-storytelling.md`.
   An animated glossary (definition → diagram → unrelated widget) is a bug
   even when everything else passes.

## 3. The pedagogy layer (beginner calibration)

The 8 principles from v6 apply at full beginner strength — the two that most
shape markup:

- **P1 Dual coding:** the visual carries the idea; prose captions it. Never
  repeat the same fact in headline + label + prose + MCQ.
- **P3 Cognitive load:** ~3 focal elements per scene, label *on* the visual,
  one accent color. If a scene needs a legend, it needs to be two scenes.
- **P7 Engineer the aha:** small tension, visually obvious relationship,
  conclusion withheld a beat. Over-explaining kills it.

Sources and the rest of the principles: v6 §2, `references/learning-science-sources.md`.

## 4. The plain-English gate (full strength, automated)

**No technical buzzword without a same-sentence parenthetical translation the
first time it appears** — in `concept` fields, prose, prompts, and
explanations. The translation lives in the sentence:

- "The **token** (a small chunk of a word) is what the model actually reads."
- "Its **latency** (the wait time for an answer) doubles."

`content/jargon.test.ts` enforces the curated list in
`content/jargon-terms.ts` against every beginner lesson — first occurrence
per lesson must carry a ≥2-word parenthetical; later uses are free. If a term
resists a gloss, recast the sentence in plain English; extend the list
deliberately, never to silence a failure. Beginner means **every listed term,
glossed, everywhere**.

## 5. Color discipline (critical)

One accent per scene (brand blue default), neutrals carry the load, semantic
good/bad only for correct-vs-incorrect teaching moments. Theme-safe tokens
only — `bg-surface-elevated` not `bg-white`, `text-canvas` not `text-white`,
`currentColor`/`var(--*)` in SVG, never literal hex. Rainbows and
4-color scenes are cognitive overload for exactly the audience this skill
serves. Full color rules: v6 §3, `../infographics-static/references/brand-system.md`.

## 6. The picture vocabulary (non-negotiable)

Build from `components/infographic/scenes.tsx`: `PersonFigure`,
`MachineFigure`, `CarShape`, `BikeShape`, `PictureCard`, `Operator`,
`SpeechBubble`, `Scene`; motion via `Stagger`/`MotionChild`/`Reveal`. For
beginners the shapes ARE the pedagogy — the concrete anchor (P2) and the
through-line (§2.2) in one. A beginner lesson whose *story scenes* explain
via a table instead of pictures is a bug — tables belong to the data-diagram
layer (§6.1), never to the story.

### 6.1 System diagram (reference layer, below the infographic)

Plain data on the lesson object, rendered by `components/LessonDiagram.tsx`.
Beginners lean on **flow** (input → process → output) and **compare**
("Where to use" / "When NOT to use" rows); **decision** only when the
boundary rule is genuinely a walk (yes/no branches). Node text stays
plain-English and terse — the diagram *states*, the story above already
*narrated*. Skip it when the story already IS the system view. Formats and
worked examples: `references/standard-visual-formats.md`.

### 6.2 The cheat-sheet

Auto-derived from `concept` (anchor + what + whenNot + URL) by
`components/LessonCheatSheet.tsx` — derive, never author. Renders after the
MCQs, doubles as the OG image; the anchor's playfulness is what makes the
card shareable.

## 7. Motion

Scroll-triggered, play once, opacity/transform only, both themes legible at
rest, `MotionConfig reducedMotion="user"`, one easing curve. The `???` →
answer pop is the beginner aha-beat — use it exactly where §2's reveal beat
sits. Values and rules: `references/motion-tokens.md`,
`references/reveal-patterns.md`.

## 8. Interactivity — constrained & worked

The three gates (restraint, affordance, discoverability) are unchanged from
v6. Beginner calibration of the *form*:

- **Constrained & worked.** 2–3 presets with illustrative pre-filled data and
  a clear prompt — never an open sandbox (open discovery backfires for
  novices, Lazonder & Harmsen 2016).
- **Continuous when there's a knob:** if the concept is "what happens as X
  changes," use `SliderControl`/`ToggleGroup` from
  `components/infographic/controls.tsx` with presets as chips — the picture
  answers live while dragging.
- Every control looks like a control (chrome, selected state, focus ring)
  and carries a verb-led instruction ("Drag the slider to feel the
  trade-off"). Widgets change state, not motion — reduced-motion-safe.
- Feedback names the misconception in beginner words and points at the
  evidence in the picture.

Recipes: `references/interactivity-patterns.md`; starter:
`assets/interactive-widget-template.tsx`.

## 9. The authoring workflow

0. **Learning contract first** (`references/lesson-contract.md`): objective,
   misconception, anchor, brief, beats, through-line, interaction decision
   (knob or not), BEFORE/AFTER states, diagram decision, the 2 MCQ scenarios.
1. Read the course `level` — if it isn't `"beginner"`, you have the wrong
   skill.
2. State the objective as an observable verb; name the aha and the likely
   wrong conclusion.
3. Draft anchor → brief → beats (§2) → scenes as *beat → what changes in the
   picture*; one concept per scene, simple → complex.
4. Build with the vocabulary, theme-safe colors, v6 motion; add `concept` and
   `diagram` as data on the lesson object. A NEW lesson must also be registered
   in `components/infographic/index.tsx` **and** given a `unit()` entry in
   `convex/lib/dailyPlan.ts` — that file's coverage test fails on any
   unregistered lesson.
5. Verify: `npm run typecheck` + `npm test` (completeness contract +
   jargon gate); load the lesson and scroll; dark mode; reduced motion;
   375px; one accent per scene; exactly 2 scenario MCQs (3 choices);
   anchor first, no quiz before the brief; widget earned + announced; story
   check (one through-line, not a glossary); cheat-sheet renders and the PNG
   route matches.

Full verification checklist: v6 §7 Step 5.

## What NOT to do (beginner)

- Don't open with a quiz, a prediction card, or any formalism before the anchor.
- Don't ship a third MCQ, definition-style prompts, or 4-choice questions.
- Don't use an unglossed listed term anywhere — the jargon test will fail it.
- Don't add math, formulas, or code blocks. Counting and pictures only.
- Don't exceed ~3 focal elements per scene, or run two accent hues in one scene.
- Don't switch metaphors mid-lesson — new state, not new analogy.
- Don't build an open sandbox; 2–3 worked presets, goal-anchored.
- Don't explain via tables; tables are the expert format.
- Don't over-explain the aha — withhold the conclusion a beat.
- Don't hardcode hex, `bg-white`, `text-white` — dark mode will eat them.
- Don't hand-roll sliders/toggles; use `components/infographic/controls.tsx`.
- Don't author cheat-sheet content — it derives from `concept`.

## References (in this skill's directory)

- `references/narrative-structures.md` — the Anchored Story-Mountain beats in full.
- `references/visual-interactive-storytelling.md` — fusion rule, beat→interaction maps, rubric.
- `references/standard-visual-formats.md` — flow / compare / decision formats.
- `references/interactivity-patterns.md` — widget recipes, feedback contracts.
- `references/lesson-contract.md` — the pre-markup contract template.
- `references/motion-tokens.md`, `references/reveal-patterns.md` — motion values.
- `references/learning-science-sources.md` — the evidence base.
- `../infographics-interactive_v6/SKILL.md` — the superset (cross-level view).
- `../infographics-static/references/brand-system.md` — theme-aware palette.
