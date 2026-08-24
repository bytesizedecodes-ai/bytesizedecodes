---
name: infographics-interactive_v6
description: THE LATEST and default skill for ByteSizeDecodes lessons and course pages. v6 — anchor-first, plain-English, continuously interactive authoring on the v5 explanation-first stack. Lessons OPEN with an anchor-led Concept Brief (everyday metaphor, then What / Why / Where / When NOT, jargon glossed), keep the story infographic, prefer CONTINUOUS playgrounds (sliders/toggles, live consequences) when the concept has a knob, add a system diagram below the infographic, CLOSE with exactly 2 scenario MCQs, and SHIP a shareable cheat-sheet card (PNG + share) derived from the brief. Use when creating or editing lessons, course pages, diagrams, widgets, cheat-sheets, or visual explanations. Triggers on: build infographic, create lesson, add course, concept brief, anchor metaphor, system diagram, flowchart, comparison grid, decision tree, interactive widget, slider, toggle, playground, evidence matrix, decision gate, cheat sheet, share card. Read fully before authoring.
---

# infographics-interactive_v6

A fork of `infographics-interactive_v5` that keeps its explanation-first
contract, pedagogy, motion, color, ICAP, and visual-storytelling layers, and
adds four things: an **everyday anchor** before any formalism, **continuous
playgrounds** wherever a concept has a knob, a **plain-English gate** on
jargon, and a **shareable cheat-sheet** per lesson.

Inherited from v5 (unchanged — read those sections there or below):

- **§0 explanation-first opening (now anchor-led).** The learner meets the
  idea as an explanation before being asked anything; no prediction cards,
  no application cards.
- **§4.5 standardized system diagram** — the data-driven reference layer
  below the story infographic.
- **Fusion rule (§1.3).** Framework beat + visual state + learner action must
  agree. A widget that could move to another lesson unchanged is not fused.
- **Level-calibrated storytelling frameworks (§1.1).** Expertise reversal
  (Tetzlaff 2025): structure differs by level, not just intensity.
- **Interactivity layer (§6, now with the continuous-playground preference).**
  Active learning beats passive (ICAP); aim at least one *Constructive* beat
  per lesson.
- **Color discipline (§3), motion system (§5), picture vocabulary (§4).**

**New in v6:**

- **§0 — The Anchor.** Every concept brief OPENS with a one-sentence everyday
  metaphor (`anchor`) — something a 10-year-old touches — BEFORE any nodes,
  vectors, or code. Present at every level; the *flavor* calibrates (§0).
- **§2.5 — The plain-English gate.** No technical buzzword without an
  immediate parenthetical translation on first use ("hyperparameters (tuning
  dials)"). Enforced by an automated test for beginner/intermediate courses
  (`content/jargon.test.ts`).
- **§4.7 — The shareable cheat-sheet.** Every lesson auto-derives a
  shareable summary card (anchor + What + When NOT + site URL) rendered
  after the MCQs with Download-PNG / Share-on-X / Share-on-LinkedIn /
  Copy-link, and doubles as the lesson's social-preview image. Pure
  marketing surface, zero new authoring fields.
- **§6 — Continuous interactive playgrounds.** When a lesson earns a control
  and the concept has a tunable knob or toggleable state, the control is
  *continuous* (drag a slider, flip a toggle → the picture answers
  immediately) — not a discrete step-reveal. Shared primitives:
  `components/infographic/controls.tsx`.

Every course has a `level`: **beginner** (layman), **intermediate**
(tech enthusiast), or **expert** (technical expert). The level controls
*how* you tell the story, not *what* the story is. Read the audience
section first.

**Default skill:** this is the repo’s current course-authoring default.
Prefer v5 only when explicitly maintaining anchor-less lessons without an
anchor backfill; prefer v4 only for legacy predict-first lessons.

---

## 0. Anchor-first opening — the Concept Brief (v6, mandatory)

v4 lessons opened with a "Predict before you look" MCQ. v5 reversed that:
**the learner meets the idea as an explanation before being asked anything.**
v6 goes one step earlier: **the learner meets the idea as something they
already touch** — an everyday metaphor — before meeting any nodes, vectors,
formulas, or code. The lesson page order is:

```
header → CONCEPT BRIEF (ANCHOR first) → story infographic →
SYSTEM DIAGRAM (reference layer) → prose → exactly 2 scenario MCQs → CHEAT-SHEET (§4.7)
```

v6 lessons have **no prediction card and no application card**. There is no
quiz before the idea, and no transfer prompt bolted after the checks — the
real-world transfer lives *inside* the two closing questions (§0.1).

The brief lives on the lesson object in `content/courses/` as plain data and
renders through the shared `Inline` formatter (so `**bold**` and `` `code` ``
work):

```ts
concept: {
  anchor: "…one-sentence everyday metaphor — FIRST…",     // The Anchor (v6)
  what:   "…10-second plain-English summary…",           // What
  why:    "…core benefit or problem it solves…",         // Why
  where:  ["…application 1…", "…application 2…"],       // Where (2–3)
  whenNot: "…the practical boundary rule…",              // When NOT to use
},
```

### The rules

- **The anchor comes first and stays physical.** Before any nodes, vectors,
  or code, map the concept to something a 10-year-old touches — sorting
  laundry, tasting soup, tuning a guitar, hiking down a foggy mountain. One
  sentence, "X is like Y" or an equivalent vivid statement. If the anchor
  needs a paragraph, it's the story's job, not the brief's.
- **The anchor's flavor calibrates to the course level** (P4 still governs):
  | Level | Anchor flavor | Example |
  |---|---|---|
  | **Beginner** | Playful everyday object; doubles as the story infographic's through-line object (§1.3) | "Gradient descent is like hiking down a foggy mountain — every step follows the steepest slope you can feel." |
  | **Intermediate** | Quick lead-in, then fade to the formal representation fast | "Hyperparameter tuning is guitar tuning — one string at a time, by ear." |
  | **Expert** | One terse professional line, no whimsy overload | "A guardrail is a circuit breaker for model output." |
  Experts still GET an anchor (it orients and it feeds the cheat-sheet), but
  it must not over-scaffold (P4/expertise reversal).
- **The anchor is the through-line.** Where possible the story infographic
  *is* the anchor dramatized — the mountain, the soup, the guitar. Don't
  pick a metaphor the visual never shows (§1.3 fusion).
- **1–2 sharp sentences per point.** If a point needs a paragraph, the brief
  is doing the prose's job — move that content below the visual.
- **Highlight the load-bearing words.** Wrap the 1–3 key terms per point in
  `**bold**` (the mechanism, the trade-off, the boundary). Don't bold whole
  sentences — then nothing stands out.
- **Gloss the jargon (§2.5).** A listed term in a beginner/intermediate brief
  ships with its parenthetical translation the FIRST time it appears.
- **"Where" is specific.** Real applications the learner has met (spam
  filters, face unlock, price estimates) — not "many industries."
- **"When NOT to use" is a rule, not a shrug.** One testable boundary the
  learner can apply ("if no labels exist, it's the wrong family").
- **A lesson never opens with a quiz.** No `prediction` field exists in v6.
- Tests enforce the shape: every course requires `concept` on every lesson,
  `anchor` + all four fields non-trivial, `where.length >= 2`, and
  beginner/intermediate lessons pass the jargon gate (see
  `content/courses.test.ts` and `content/jargon.test.ts`).

### 0.1 The two closing MCQs — exactly 2, both real-life scenarios

Every lesson closes with **exactly 2 self-check MCQs**, and both must be
**real-life scenario questions**:

- **A scenario, not a definition.** The prompt drops the learner into a
  concrete situation with named actors and systems — "Your support chatbot's
  p95 latency doubled after a prompt change…" / "A store groups shoppers by
  buying habits with no pre-assigned labels…" — and asks for the decision or
  diagnosis. "What is X?" / "Which statement is true?" prompts are v4 style
  and fail review.
- **One question checks the What/Why; one transfers it** to a new real-world
  situation (the v4 `application` card's job, now embedded).
- **Explanations resolve the scenario** — name the misconception, tie the
  correction to the situation's evidence, >20 chars. Never bare "Correct."
- **Distractors stay diagnostic**: each wrong choice embodies a plausible
  misconception, not filler.
- Choices: 3 for beginner courses, 3–4 for intermediate/expert is fine.
- A third question is a bug — cut it or fold its scenario into the two.

### Why anchor-first explanation

An everyday metaphor is a schema the learner already owns; the formal idea
hangs on it (P2 concreteness). Predict-then-reveal earns its place *after*
an idea has traction; leading with it asks the learner to guess about
something they haven't met yet. The anchor gives the physical intuition
first, the brief gives the schema (What/Why), grounds it (Where), and bounds
it (When NOT) — then the story infographic deepens it, the diagram formalizes
it, the playground lets the learner feel it, and the two scenario questions
test and transfer it. The cheat-sheet (§4.7) compresses the whole loop into
a shareable card.


---

## 1. The three audience levels (read this before anything else)

The single most important finding from learning science: **techniques that
help beginners actively harm experts** (the *expertise reversal effect*,
Kalyuga 2007). Worked examples speed up novices but slow experts, who
experience them as redundant load. **You cannot serve all three levels with
one fixed presentation.** Pick the course's `level` and calibrate to it.

### Beginner (layman) — `"level": "beginner"`

Who they are: curious, no ML/coding background, possibly anxious about
"falling behind." Think: your neighbour who keeps hearing "AI" on the news.

| Dimension | Rule |
|---|---|
| **Analogy** | Anchor every abstract concept to a **familiar everyday object** (car vs. bike, sorting mail, a child learning). Then *fade* to the simple idea. |
| **Narrative** | Full story arc: relatable problem → tension → resolution. Open with "why should I care?" |
| **Jargon** | None. Translate every technical term into plain language. If a term is unavoidable, define it inline the first time. |
| **Density** | ~3 elements per scene. One concept per scene. Generous whitespace. |
| **Signaling** | Heavy — one accent color cues the current focal element; arrows point at what matters. |
| **Math/code** | None. No formulas, no code blocks. Counting and pictures only. |
| **The aha** | Engineer it: build a small tension, make the relationship visually obvious, then withhold the conclusion a beat so the learner generates it. |

### Intermediate (tech enthusiast) — `"level": "intermediate"`

Who they are: comfortable with technology, maybe some programming, curious
about ML but not an expert. Think: a working developer who wants to
understand what their team's ML folks do.

| Dimension | Rule |
|---|---|
| **Analogy** | Reduce (not eliminate). Keep the concrete anchor but spend less time on it; reach the formal representation faster. |
| **Narrative** | Keep the spine (problem → resolution) but tighten it. Less hand-holding. |
| **Jargon** | Standard ML terms are fine (model, training, feature, accuracy). Define only the uncommon ones. |
| **Density** | ~4 elements per scene. Slightly denser scenes are OK. |
| **Signaling** | Moderate. Let the reader find some things themselves. |
| **Math/code** | Light formulas are OK (a probability as a fraction, not a derivation). Short, illustrative code is welcome. |
| **The aha** | Still engineer it, but let the learner work slightly harder for it. |

### Expert (technical expert) — `"level": "expert"`

Who they are: ML practitioners, researchers, senior engineers. They already
have the schemas; they want depth, precision, and edge cases. Think: someone
who'll catch you if you round a number wrongly.

| Dimension | Rule |
|---|---|
| **Analogy** | Minimal. Over-scaffolding here is *harmful* (expertise reversal). Go straight to the formal representation. |
| **Narrative** | Sparse. Problem-first is fine; skip the story wrapping. |
| **Jargon** | Full technical precision. Don't dumb down — experts read imprecise language as a red flag. |
| **Density** | Higher density OK; experts can hold more chunks and will be bored by over-simplification. |
| **Signaling** | Minimal. Trust the reader. |
| **Math/code** | Full formulas, real code, edge cases, failure modes. This is where the entropy formula and the cosine-similarity math live. |
| **The aha** | Comes from *depth and surprise* (a non-obvious connection, a counter-intuitive result), not from withheld-then-revealed basics. |

**The level is on the course object** (`content/courses/` → `level: "beginner"|"intermediate"|"expert"`).
Read it before authoring. If you're unsure, ask.

### 1.1 The three storytelling frameworks (one named structure per level)

The knob tables above set *intensity* (how much analogy, jargon, math). They
don't set *structure*. Research says structure should differ too (P4 +
Tetzlaff 2025). So each level has a **named framework** — a fixed 4–5 beat
sequence you lay scenes out in. The tables calibrate the beats; the framework
orders them.

| Level | Framework | Beats |
|---|---|---|
| **Beginner** | **Anchored Story-Mountain + Concreteness Fade** | Hook → Concrete anchor → Tension/impasse → Reveal + fade to the idea → Resolution |
| **Intermediate** | **Predict–Investigate–Case (PIC)** | Scenario → Predict → Observe → Explain-via-case → Transfer |
| **Expert** | **Problem-First Diagnostic (CER)** | Problem-first → You diagnose → Claim/Evidence/Reasoning → Counter-examples → What/So-What/Now-What |

Full beat-by-beat definitions, why each suits its level, and the wider library
of reusable story shapes (story-mountain, ABT, POE, 5E, case method, CER, …)
live in **`references/narrative-structures.md`**. Pick the framework for your
course's `level` in Step 1 of the workflow and emit its beats in Step 3.

### 1.2 Course continuity — a case that earns its return

For **intermediate and expert courses**, define one persistent, realistic case
before authoring the first lesson. Every module should add one piece of evidence,
constraint, or decision to that case; the capstone uses the accumulated case
rather than inventing a disconnected final exercise. This turns individual
infographics into a coherent investigation.

| Level | Course-case rule |
| --- | --- |
| Beginner | Optional recurring character/story; never let it obscure the core concept. |
| Intermediate | One bounded product incident or build. Each lesson reveals a new signal or action. |
| Expert | One production design or failure case with competing constraints. Each lesson adds evidence, uncertainty, or a counter-example. |

Write the case in 2–4 sentences, state the final learner artifact, and name the
lesson where each major piece of evidence first appears. The case is a scaffold,
not a screenplay: omit it when a standalone definition is genuinely clearer.

### 1.3 Visual interactive storytelling (the v4 fusion layer)

Frameworks (§1.1) order *beats*. Widgets (§6) order *controls*. v4 requires
they fuse with the **picture**:

1. **One through-line visual** for the lesson (same object/diagram every
   scene — new *state*, not a new metaphor). Intermediate/expert: reuse the
   course-case diagram from §1.2.
2. **Map the interaction to one beat** using the level table in
   `references/visual-interactive-storytelling.md`. Default is *no* widget;
   the control sits on tension / observe / diagnose / now-what — never as a
   final “bonus dashboard.”
3. **Treat interaction as a story turn:** BEFORE (tempting wrong reading) →
   LEARNER ACTS → AFTER (evidence re-composed in the picture + specific
   feedback).
4. **Align Constructive commits.** The two closing scenario MCQs, any widget,
   and the transfer test the same capability from different angles — not three
   restatements of one sentence (P1 redundancy). Prefer an *in-scene* commit
   when a widget exists; the scenario MCQs alone are the floor, not the whole
   story craft.
5. **Pass the story rubric** before shipping (same reference, §8): reject
   animated glossaries.

Read **`references/visual-interactive-storytelling.md`** in full before Step 3
of the workflow. It has beat→interaction maps, shot language, course-continuity
rules, and worked PIC / CER exemplars.

---

## 2. The 8 learning principles (the pedagogy layer)

These are evidence-based. Apply them *at the level of calibration above* —
they're not optional, but their *intensity* scales with the audience.

### P1 — Dual coding: show, don't tell
Words + pictures beat words alone (Mayer's multimedia principle — the most
replicated finding in the field). **But:** don't duplicate the same
information as both on-screen text and narration (the *redundancy effect*
overloads the visual channel), and cut decorative noise (the *coherence
principle*).

**Rule:** the visual carries the idea. Prose *captions* the visual — it
doesn't repeat it. Strip anything that doesn't teach.

### P2 — Concreteness fading: anchor, then abstract
Teach abstract concepts as a 3-step fade: **concrete analogy → simplified
diagram → abstract symbol** (Goldstone & Son, 2005). Concrete-*only* is
*worse* than abstract-only for transfer — the fade is what works.
**Always state where the analogy breaks down** so learners don't import
misconceptions.

**Rule (beginner/intermediate):** every abstract concept starts as a familiar
object, then fades to the formal. **Rule (expert):** skip to the formal.

### P3 — Cognitive load: less per scene, not more
Working memory holds ~4 chunks (Cowan, 2001). Three risks to avoid:
- **Split-attention** — a label separated from its visual forces mental
  integration. Fix: label *on* the visual, never in a separate legend.
- **Redundancy** — the same fact in headline + label + prose + MCQ. Fix:
  say it once, in the channel that fits.
- **Over-signaling** — too many colors/arrows fight for attention. Fix: one
  accent color cues the focal element.

**Rule:** ~3-4 focal elements per scene. One concept per scene. Label in place.

### P4 — Expertise reversal: calibrate to the level
(Summarized in §1.) The governing principle: **what helps a beginner can
harm an expert.** Worked examples, heavy analogies, and dense signaling are
*beginner tools*. For experts they become extraneous load. Always read the
course's `level` and calibrate.

### P5 — Narrative arc: problem → tension → resolution
A story structure improves retention, **especially for low-prior-knowledge
learners** (Tobler, 2024). Frame each lesson (or each major scene) as a
mini-story: pose a relatable problem or tension first, build it, then
deliver the core insight as the resolution.

**Rule (beginner):** full arc, open with "why care?" **Rule (expert):**
problem-first is fine, skip the wrapping.

### P6 — Segmenting: reveal complexity gradually
People learn more from learner-paced bite-sized segments than a continuous
dump (Mayer's *segmenting principle*). Reveal formula components
one-at-a-time; one concept per scene; order simple→complex, concrete→abstract.

**Rule:** the scroll-reveal + staggered formula builds already implement this.
Keep it. Never dump a full equation or a 6-step process in one frame.

### P7 — Engineer the "aha" (insight learning)
Insight-based learning **nearly doubles memory retention** (Cabeza lab,
2025). It triggers when: (a) a manageable tension/impasse, (b) the visual
makes a hidden relationship visible at once, (c) the learner *generates*
the inference rather than being told. **Over-explaining kills the aha.**

**Rule:** build toward each lesson's key insight with a small tension, make
the relationship visually obvious, then withhold the verbal conclusion a
beat (a prompt, a "what do you notice?") so the learner generates it. The
`???` → answer reveal pattern is the motion expression of this.

### P8 — Active beats passive
Watching a polished animation is *Passive* in Chi's ICAP sense; it underuses
the learner. **Active learning beats passive by ~half a grade** (Freeman 2014,
*PNAS*, g = 0.47 — lecture students were 1.5× more likely to fail), and the
**retrieval** and **generation** effects are even larger (g ≈ 0.6; Rowland
2014; Slamecka & Graf 1978). The practical hierarchy: Passive < Active
(manipulate) < **Constructive** (generate) < Interactive (co-create). Aim every
lesson at **at least one Constructive beat** — the cheapest path is
*a scenario commit in the closing MCQs* (§0.1): drop the learner into a
situation and make them decide before the explanation resolves it.

**Caveats that decide *how* to be active:** interactivity helps **only when
guided and goal-anchored** (Lazonder & Harmsen 2016) — open discovery backfires
for novices; and **decorative interaction is a "seductive detail" that *hurts***
(Harp & Mayer). So: every interaction must teach a concept, not amuse. Note
also the platform distinction — **Energy (retrieval/generation) drives learning;
streaks and Energy totals drive *return visits*.** Use both; don't confuse
them. Full recipes in §6 and `references/interactivity-patterns.md`.

### Sources
- Mayer, *Multimedia Learning* (2002) — multimedia, redundancy, coherence, segmenting principles.
- Kalyuga (2007), "Expertise Reversal Effect" — the level-calibration foundation.
- Goldstone & Son (2005), concreteness fading.
- Cowan (2001), working memory capacity ~4.
- Tobler (2024), narrative-embedded learning, *Learning and Instruction*.
- Cabeza lab (Duke, 2025), insight doubles memory.
- Chi & Wylie (2014), the ICAP framework — the P8 foundation.
- Freeman et al. (2014, *PNAS*) & Rowland (2014) — active/retrieval effect sizes.
- Slamecka & Graf (1978) — the generation effect.
- Lazonder & Harmsen (2016) & Harp & Mayer — guidance helps, decoration hurts.
- Tetzlaff et al. (2025) — expertise-reversal meta-analysis (structure must differ by level).
- Full link list in `references/learning-science-sources.md`.

---

## 2.5 The plain-English gate (v6 — jargon elimination, automated)

A buzzword the learner can't decode is a dead stop. The rule: **no technical
term without an immediate parenthetical plain-English translation the first
time it appears** in a concept brief or prose. The translation is part of the
sentence, not a footnote:

- "Tune the **hyperparameters** (the tuning dials set before training starts)
  when accuracy dips."
- "The **loss** (the error score the training loop tries to shrink) falls
  every epoch."
- "Adjust the **weights** (the importance sliders inside the model)."

### The standard translation table (seed — extend in `content/jargon-terms.ts`)

| Term | Plain-English |
|---|---|
| hyperparameter(s) | tuning dials |
| loss (function) | error score |
| weights | importance sliders |
| gradient | downhill slope |
| learning rate | step size |
| embedding | meaning coordinates |
| drift | going stale |
| latency | wait time |
| token(s) | word pieces |
| inference | the model answering |
| fine-tuning | extra practice on your data |
| overfitting | memorizing instead of understanding |

### How it's enforced

`content/jargon.test.ts` scans every beginner/intermediate lesson's
`concept` fields, `prose`, and question prompts/explanations for the terms in
`content/jargon-terms.ts`. The FIRST occurrence per lesson must carry a
same-sentence parenthetical of ≥ 2 words; later uses are free (defined once).
Expert courses are exempt (P4: full precision; imprecise language reads as a
red flag to experts). If a term genuinely resists a gloss, don't waive the
sentence — either recast it in plain English or add the term's context to the
test's curated list deliberately.

### Level calibration

- **Beginner:** every listed term glossed, first use, everywhere.
- **Intermediate:** uncommon terms glossed (common industry words like
  "model" or "training" are not on the list at all).
- **Expert:** exempt — don't dumb down.

---

## 3. Color discipline — soft, easy on the eye (critical)

**Too many colors cause cognitive overload and drive learners away.** This is
not aesthetic preference — it's P3 (cognitive load). The palette is
**deliberately restrained**: one accent (brand blue), one warm, and semantic
good/bad used *only* for success/error states. Everything else is ink/canvas
neutrals. The dark/light theme system means these flip automatically.

### The rules

1. **One accent color per scene.** Brand blue (`text-brand` / `bg-brand`) is
   the default accent. Don't introduce a second hue in the same scene unless
   it's a semantic good/bad contrast that *teaches* something.
2. **Neutrals carry the load.** Most of a scene is `bg-surface-elevated`,
   `text-ink`, `text-ink-soft`, `border-ash`. The accent is a *highlight*,
   not the dominant color. Resting states should feel calm and readable, not
   loud.
3. **Semantic colors only for meaning.** `good`/`bad` appear *only* when
   showing correct-vs-incorrect, reward-vs-penalty, or pure-vs-mixed. Never
   as decoration. `warm` is reserved for streaks/highlights.
4. **No rainbow palettes.** If you reach for a 3rd, 4th, or 5th distinct hue,
  stop — you're overloading the scene. Use neutral tones + one accent, or
  split the scene into two.
5. **Soft contrast, not harsh.** Avoid pure `#000` on `#fff` or vice versa in
   body text — the themed `text-ink`/`bg-canvas` tokens are calibrated for
   comfortable reading. The dot-grid texture and warm-neutral canvas are
   intentionally easy on the eye; preserve them.

### Theme-safe color cheat-sheet

The app has a dark/light theme system. **Every color must work in both.**

| You want… | Use | NEVER |
|---|---|---|
| Card surface | `bg-surface-elevated` | `bg-white` (stays white in dark) |
| Text on dark/colored fill | `text-canvas` (flips) | `text-white` (stays white) |
| Page background | `bg-canvas` | `bg-white`, literal hex |
| Brand accent in SVG | `fill="currentColor"` + wrapper `text-brand` | `fill="#1d9bf0"` |
| Structural SVG (tires, hubs) | `var(--tire)`, `var(--hub)` | `fill="#3a2a1a"` |
| Windows/screen in SVG | `var(--window)`, `var(--screen)` | literal hex |
| Semantic in SVG | `var(--color-good)`, `var(--color-bad)` | literal hex |

**Never hardcode hex.** `bg-white`, `text-white`, and literal hex bypass the
theme and render as invisible art/text in dark mode. Full palette reference:
`../infographics-static/references/brand-system.md`.

---

## 4. The picture-led vocabulary (the craft layer)

Lessons are **picture-led**, built from the shared scene vocabulary in
`components/infographic/scenes.tsx`. This is non-negotiable (see CLAUDE.md
rule 11). The vocabulary:

- `PersonFigure`, `MachineFigure` — the "learner" and the "machine" characters.
- `CarShape`, `BikeShape` — the everyday objects (the concrete anchor for P2).
- `PictureCard`, `Operator`, `SpeechBubble`, `Scene` — the building blocks.
- `Stagger` / `MotionChild` / `Reveal` — the motion system (§5).

A lesson that "works" but explains via a table or text block instead of
pictures is a bug. Tables and formulas are for **expert** courses; even
there, lead with a visual where possible.

### How pictures serve the pedagogy
- The car/bike shapes are the **concrete anchor** (P2) for the Layman course.
- `PictureCard` clusters are the **visual relationship made visible** (P7).
- The `Operator` (+/=/→) chain is the **segmented formula build** (P6).
- The `???` → answer pop is the **aha moment** (P7).

### Visual continuity (v4 — mandatory)

Primitives alone do not make a story. Before markup, name the **through-line**
(one persistent object or diagram). Then for each scene, state **what changes
in the picture** (accented part, wrong value, selected claim, active window).
Change one primary thing per scene. Shot order defaults to establish → focus →
act → reveal → resolve. Domain widgets (dashboards, traces, evidence strips)
are still picture-led: the graphic carries the idea; prose captions it.
Full grammar in `references/visual-interactive-storytelling.md` §3.

---

## 4.5 The standardized system diagram (v5 — the reference layer)

Below every story infographic, a v5 lesson renders a **standardized system
diagram**: the same idea the story told in pictures, redrawn as a formal,
parseable reference. Think of it as the story's *spare parts manual* — same
machine, different view.

### The layering rule (critical)

| Layer | Job | Medium |
|---|---|---|
| **Story infographic** (above) | Make the learner *feel* the idea — narrative, characters, tension, aha | Bespoke scene components (`scenes.tsx` vocabulary) — **never replaced** |
| **System diagram** (below) | The reusable reference — formal structure a learner could redraw or reuse in a meeting | Standardized data-driven formats via `components/infographic/flow.tsx` |

**Do not duplicate storytelling in the diagram.** The infographic already
narrates; the diagram states. Terse node texts, at most one short caption per
node, no scene language, no characters, no drama. If a caption re-explains
what the picture above showed, delete it.

### The three standardized formats

| Visual format | Best used for | Why it works |
|---|---|---|
| **Input-Process-Output Flowchart** | Pipelines: supervised/unsupervised learning, feature extraction, kNN's steps | Shows data going in, the concept processing it, and the prediction coming out |
| **Side-by-Side Comparison Grid** | Choosing between two approaches: kNN vs. centroid, memorizing vs. understanding, train vs. test scores | Contrasts "Where to use" and "When NOT to use" visually, row by row |
| **Decision Tree Diagram** | Algorithmic choice and workflow limits: picking the ML family, reading a decision tree, when to distrust output | Lets learners answer "Is my data labeled?" / "When NOT to use?" by walking branches |

### The standardized node text patterns

Agents and learners parse structured diagrams best when node text follows one
template. The brackets are part of the design — they render in mono, visible:

| Component | Text pattern | Purpose |
|---|---|---|
| Input node | `[ Raw Input Data / Problem Statement ]` | Anchor the context |
| Process node | `[ Core AI/ML Concept / Algorithm ]` | The "What" in action |
| Output node | `[ Prediction / Value Delivered ]` | The "Why" & "Where" result |
| Branch/Filter | `< Decision Check: When NOT to use? >` | Set algorithmic limits |

In practice the renderer (`components/infographic/flow.tsx`) adds the chrome —
author just the inner text: `{ kind: "input", text: "Labelled samples" }`
renders as `[ Labelled samples ]`.

### How to author one

The diagram is **plain data** on the lesson object (`content/courses/`), not
a new component. The lesson page renders it automatically via
`components/LessonDiagram.tsx`:

```ts
diagram: {
  kind: "flow",                                  // "flow" | "compare" | "decision"
  steps: [
    { kind: "input",   text: "Labelled samples", caption: "photo + ‘car’" },
    { kind: "process", text: "Learning algorithm" },
    { kind: "output",  text: "Prediction on a new case" },
  ],
},
```

`compare` takes `left`/`right` (title + subtitle) and standardized `rows`
(each `{ label, left, right }` — reach for the row labels **"Where to use"**,
**"When NOT to use"**). `decision` takes a recursive `root` tree of
`question`/`branch label`/`answer` nodes. Full specs and worked examples:
`references/standard-visual-formats.md`.

### When NOT to add a diagram

Not every lesson needs the reference layer. Skip it when the story infographic
already IS the system view (a flowchart-drawn lesson, a comparison already
laid out as a grid), or when the concept has no input→process→output shape
(a definition lesson, a pure-analogy lesson). Adding a diagram that restates
the picture 1:1 is duplication — the failure mode §4.5 exists to prevent.

---

## 4.7 The shareable cheat-sheet (v6 — the marketing layer)

Every lesson ends with a **cheat-sheet card**: the anchor, the What, the When
NOT, the BSD mark, and the lesson URL — one clean, shareable summary the
learner can download or post to LinkedIn/X. It is pure marketing surface:
each shared card carries the site link, so poster traffic becomes learner
traffic. **Zero new authoring fields** — the card derives from `concept`
(anchor + what + whenNot) automatically.

### What renders where

| Surface | Renderer | Content |
|---|---|---|
| In-lesson card (after the MCQs) | `components/LessonCheatSheet.tsx` | Card preview + Download PNG / Share on X / Share on LinkedIn / Copy link |
| Downloadable PNG (1200×630) | `app/courses/[course]/[lesson]/cheat-sheet/route.ts` via `lib/og.tsx` `renderCheatSheetImage()` | The same card, generated server-side |
| Social link preview (OG image) | `app/courses/[course]/[lesson]/opengraph-image.tsx` | Upgraded to the cheat-sheet card, so pasting the lesson URL anywhere shows the card |

The PNG route stays public even for paid lessons: the card carries less than
the concept brief, which is already the public teaser; sharing is the point.

### The rules

- **Derive, don't author.** No `cheat` field exists. If a card line reads
  badly, fix the `concept` field it came from — single source of truth.
- **The card is a card, not a page.** Anchor (hook), What (one line),
  When NOT (one line), URL. No prose, no diagram dump, no question text.
- **Brand discipline applies** (§3): the PNG uses the mirrored OG palette in
  `lib/og.tsx`; the in-page card uses theme-safe tokens and must be legible
  in BOTH themes.
- **Share buttons are real actions.** X intent with the lesson URL and a
  short text, LinkedIn share-offsite with the URL, copy-link with feedback.
  Never a dead `<a>`.

---

## 5. The motion system

Motion is narrative, not decoration. Every animation must serve the story
(P5/P6/P7). If you can't state its narrative purpose in one sentence, cut it.

### Core principles
1. **Animate at the primitive layer.** Entrance motion belongs on `Scene`,
   `Card`, and the formula primitives — not hand-added per lesson.
2. **The resting state is fully legible in BOTH themes.** Animate only
   `opacity` and `transform`. Colours/contrast must be correct at rest.
3. **Reduced-motion is non-negotiable.** Every motion subtree is wrapped in
   `<MotionConfig reducedMotion="user">` (in `motion.tsx`).
4. **Scroll-triggered, play once.** `whileInView` + `viewport={{ once: true }}`.
   Never re-fire on scroll-back.
5. **One easing curve, one duration.** `cubic-bezier(0.2, 0.7, 0.3, 1)`,
   ~260ms entrances, ~120ms stagger. No second curve without a reason.

### The signature beats (use sparingly — these are the "aha" moments)
- **Formula build** — `Stagger` reveals `Dataset + Algorithm + Rules` one box
  at a time (P6 segmenting). The signature case.
- **Transformation** — a `???` state resolves into the answer with a ~200ms
  delay, so the "realization" reads as a beat (P7 aha).

Read `references/motion-tokens.md` for exact values and
`references/reveal-patterns.md` for the `Reveal` wrapper, stagger recipe,
client-boundary rules, and signature-moment patterns.

### The client-boundary rules
- `"use client"` lives on `components/infographic/motion.tsx` (the leaf), not
  on lesson components or `index.tsx`. Server Components may render Client
  Components freely.
- One `MotionProvider` at the infographic root. Never scatter `MotionConfig`.
- Escalate a lesson to `"use client"` only for bespoke hook-driven
  choreography — interactive widgets (§6) are the common, legitimate reason.

---

## 6. Interactivity (the active layer)

Motion (§5) is *Passive*: the learner watches a polished reveal. Active learning
beats passive by ~half a grade (P8), so this layer turns watchers into doers.
It is built on small, self-contained **interactive widgets** — `"use client"`
components registered as a lesson's infographic, local state only, illustrative
data, no backend. The AI Observability course ships three; they are the named
patterns to reuse.

### The one rule
> Every interactive widget is **guided, task-anchored, predict-eliciting,
> expertise-adaptive, and never decorative.** If you can't state the concept it
> teaches, cut it — decorative interaction is a seductive detail that *harms*
> learning (Harp & Mayer).

### Three gates every control must pass
A toggle, a clickable step, or a slider only belongs in a lesson when it clears
all three. Fail one and the control hurts more than it helps:

1. **Restraint — earn the control.** Add a control only when the concept
   *requires* the learner to act to grasp it — a comparison they must run, a
   sequence they must investigate, a trade-off they must feel by moving a knob.
   If a passive scroll-reveal teaches the same thing (most definitions and
   single-relationship lessons), **stay passive.** A toggle slapped on to "make
   it interactive" is decorative interaction — it adds load and *harms* learning
   (P8). The default is *no* control; the control is the exception.
2. **Affordance — it must look clickable.** A control has to *read as a control
   at rest*: visible button chrome (a bordered pill or container with its own
   background), a clearly different **selected** state (brand fill) from the
   unselected state, a comfortable touch target (≥ ~32px tall), and a
   `focus-ring` on keyboard focus. A bare word that is secretly a `<button>`, or
   a clickable SVG region with no chrome, is invisible — learners don't click
   what doesn't look clickable.
3. **Discoverability — tell the learner to use it.** Every widget carries an
   explicit, **verb-led instruction** the learner can't miss: *"Toggle to
   compare the states"*, *"Click a row to investigate"*, *"Drag the slider to
   feel the trade-off."* Put it in the `<InfographicHeader subtitle>` or
   directly above the control. If learners don't know they can act, most scroll
   straight past — and the whole active layer is wasted.

### Continuous playgrounds (v6 — the default form for knobs)

Some reveals are step-shaped (click a trace row, advance a stage). But when
the concept has a **tunable knob or a toggleable state**, the highest
retention comes from *continuous* interaction: the learner drags, the picture
answers on every intermediate position — no "Run" button, no preset-only
steps.

- **A slider for every knob.** Learning rate, threshold, temperature,
  top-k, chunk size: if the concept is "what happens as X changes," the
  control is `SliderControl` (`components/infographic/controls.tsx`), and
  the consequence (converge/overshoot/diverge; alarm/miss trade-off) renders
  live while dragging. Named exemplar: `GradientDescent` — drag η, watch the
  descent path converge, overshoot, or diverge on the valley.
- **A toggle for every two-state world.** RAG ON/OFF, guardrails ON/OFF,
  before/after an optimization: `ToggleGroup`, and the *entire* visual
  state flips (hallucinated answer → cited documents), not just a number.
- **Presets are chips, not the control.** Quick-jump chips on top of a
  continuous control are welcome (they serve beginners, §Expertise
  adaptation); a discrete-only preset row where a knob begs to be dragged is
  v5 style.
- **The gates still apply.** Continuous ≠ always. A definition lesson with
  nothing to tune stays passive (gate 1). The playground is for concepts
  whose *trade-off must be felt* — restraint first, then continuity.
- **Deterministic and cheap.** Illustrative data, computed locally (a
  quadratic bowl, a precomputed curve) — never a backend call per drag.
  Smooth feedback at 60fps; if a frame is expensive, animate fewer elements,
  not choppier ones. Reduced-motion users still get full state changes
  (widgets change state, not motion).

### Feedback contract — interaction must teach, not only reveal

Before building a widget, name the **likely wrong conclusion**, the feedback
that corrects it, and the **next investigation** the learner should make. A
widget that changes a number but leaves the learner to infer why is only a
visual toy. Feedback should be specific to the state or choice, short enough to
read beside the visual, and should point to evidence—not merely say “correct”
or “incorrect”.

For example: “The 24-hour view hides the short spike. Inspect the one-hour
window before declaring the service healthy.” The next investigation might be
opening the trace slice for the spike. On expert lessons, feedback can remain
minimal, but it must identify the evidence that supports or weakens the claim.

### The ICAP ladder (target at least *Constructive*)
| Rung | What the learner does | Example on the platform |
|---|---|---|
| **Passive** | Watches / reads | A scroll-reveal animation (the §5 default) |
| **Active** | Manipulates what's given | Clicking a trace step; toggling a time window |
| **Constructive** | Generates something new | **A scenario commit** — deciding inside one of the 2 closing scenario MCQs (§0.1) |
| **Interactive** | Co-creates with feedback | A tutor-AI dialogue (beyond today's primitives) |

The biggest jump is **Active → Constructive**. Every lesson should land at least
one Constructive beat; the cheapest way is a *scenario commit* — the closing
scenario MCQs (§0.1) make the learner decide inside a situation before the
explanation resolves it.

### The widget patterns (reuse these)
| Pattern | Reference build | ICAP | Typical story beat (v4) | Use when the concept is… |
|---|---|---|---|---|
| **Toggle-compare** | `MetricsDashboard` | Active | PIC *Observe*; beginner *Tension* | a *comparison between states* (window, mode, before/after) |
| **Click-to-elaborate** | `TraceWaterfall` | Active | PIC *Observe*; CER *Diagnose* | a *whole with parts worth inspecting* one at a time |
| **Drag-to-tune** | `AlertThresholdTuner` | Active→Constructive | PIC *Observe* + predict | a *trade-off you can feel* by moving one knob |
| **Evidence matrix** | recipe in `interactivity-patterns.md` §4 | Constructive | CER *Diagnose* + *CER* | several signals support competing claims; learner picks the claim to investigate first |
| **Decision gate** | recipe in `interactivity-patterns.md` §5 | Constructive | CER *Now-what*; PIC *Transfer* | a release/incident decision needs a justified next action |

Place the widget on the mapped beat (§1.3) — do not park it after the
resolution as decoration. Build sliders/toggles from the shared primitives
in **`components/infographic/controls.tsx`** (`SliderControl`, `ToggleGroup`)
— never hand-roll a range input or button row; the shared primitives carry
the affordance gate (chrome, selected state, focus ring, live value readout)
for you. Concrete recipes, client-boundary rules, and Constructive upgrade
paths are in
**`references/interactivity-patterns.md`**. Starters:
**`assets/interactive-widget-template.tsx`** (toggle-compare) and
**`assets/evidence-decision-template.tsx`** (matrix + gate skeleton).

### Expertise adaptation (P4 applied to interaction)
The *form* of interactivity reverses with expertise, just like analogies:
- **Beginner — *constrained & worked*.** 2–3 presets, pre-filled/illustrative
  data, a clear prompt. Never an open sandbox (Lazonder & Harmsen 2016).
- **Intermediate — *task-framed exploration*.** Give a goal ("find the anomaly,
  then tune the threshold to catch it") and let them work.
- **Expert — *open & minimal*.** Freeform manipulation, no hand-holding;
  guidance here actively annoys and slows them (Tetzlaff 2025).

### Accessibility (non-negotiable)
- Widgets change **state**, not motion — so they're reduced-motion-safe by
  default. Never make a concept reachable *only* through animation.
- Every control is a real `<button>` / `<input type="range">` (keyboard- and
  screen-reader-reachable), with `aria-pressed` / `aria-label` as appropriate.
- Real controls must also **look** like controls and **announce themselves** —
  visible chrome + a clear selected state + a verb-led instruction are part of
  accessibility, not decoration (the three gates above).
- Same color discipline as everywhere else (§3): one accent per scene, theme-safe tokens, semantic red only for the anomaly/failure.

### Measurement plan — optional implementation, required design

For every widget, write a small measurement plan even if the product does not
yet record events. It must answer: *which prediction/choice matters, what counts
as meaningful investigation, what misconception can this expose, and how would
we know whether the learner transferred the idea?* Track only learning-relevant,
privacy-safe events if analytics is later implemented: selected answer/state,
meaningful investigation, submitted conclusion, and misconception category.

Never collect raw user prompts, model responses, secrets, or free-text learner
answers merely to measure lesson engagement. Aggregate or pseudonymise where
possible. Optimise for demonstrated understanding, not clicks, dwell time, or
number of controls touched.

---

## 7. The authoring workflow

### Step 0 — Write the learning contract before markup

Complete the compact template in **`references/lesson-contract.md`**:
objective, prerequisite misconception, **the anchor (§0 — the everyday
metaphor, named before anything else)**, **the concept brief (§0)**,
framework beats, **through-line visual (the anchor dramatized, §1.3)**,
**interaction beat + whether the concept has a knob/toggle (continuous
playground, §6)**, BEFORE/AFTER picture states, **the standardized system
diagram (§4.5) — format choice + why**, **the 2 closing scenario MCQs (§0.1)
— situations drafted**, diagnostic feedback, course-case add, and evidence
plan. If the contract cannot explain why a widget exists *on that beat*, do
not build the widget.

### Step 1 — Read the course level, calibrate, and pick the framework
Read the course's `level` (beginner/intermediate/expert) in
`content/courses/`. Set your analogy density, jargon level, narrative
weight, and math/code allowance per §1. **Then pick the level's named
storytelling framework from §1.1** (Beginner → Anchored Story-Mountain;
Intermediate → Predict–Investigate–Case; Expert → Problem-First Diagnostic).
**If unsure of the level, ask.**

### Step 2 — Define the learning objective + the aha
State in one sentence: *what should the learner be able to **do** after this
lesson?* (observable verb: diagnose, choose, explain, design, justify). Then
identify the **aha** — the hidden relationship the picture will make visible —
plus the likely wrong conclusion and the evidence that corrects it.

### Step 3 — Structure the fused story (anchor + brief + framework + visual + action)
**Draft the anchor first** — the everyday metaphor (§0), calibrated to the
course level; name how the story infographic dramatizes it. **Then draft the
concept brief (§0)** — What/Why/Where/When NOT, sharp and bold-highlighted,
jargon glossed (§2.5). Then lay out scenes in framework beat order
(`references/narrative-structures.md`), and complete the **authoring
checklist** in `references/visual-interactive-storytelling.md` §9:
- Name the through-line visual; list each scene as *beat → what changes in the
  picture*.
- Assign **at most one** primary interaction to the mapped beat (§1.3 map).
  **If the concept has a tunable knob or toggleable state, the control is a
  continuous playground (§6) — slider/toggle from `controls.tsx`, presets as
  chips, consequence live while dragging.**
- Specify BEFORE → ACT → AFTER; write the feedback line.
- Ensure at least one Constructive commit aligned with that capability.
- Decide the diagram layer (§4.5): which standardized format, or none — and
  confirm it formalizes rather than re-narrates.
One concept per scene (P3). Simple → complex, concrete → abstract (P2/P6).

### Step 4 — Build with the vocabulary + theme-safe colors
Keep the story infographic in the shared primitives (`Scene`, `PictureCard`,
`Operator`, the shapes) or a domain widget that still leads with the graphic.
Theme-safe colors only (§3). Motion via `Stagger`/`MotionChild`/`Reveal` (§5).
Build knobs/toggles from `components/infographic/controls.tsx` (§6). Wire
feedback into the widget AFTER state — not only into a distant takeaway.
Add the anchor + concept brief and system diagram as **data** on the lesson
object (`concept.anchor`, `concept`, `diagram`) — the page renders them, and
the cheat-sheet (§4.7) derives from them automatically; no new components
needed.

### Step 5 — Verify (all of these, not some)
1. `npm run typecheck` and `npm test` — pass (the course-content contract
   validates briefs, anchors, openers, and the jargon gate).
2. Load the lesson route, scroll — scenes reveal once, formula builds stagger,
   nothing re-fires.
3. **Brief check (v6):** the lesson opens with the **anchor** (one sentence,
   level-calibrated flavor, something a 10-year-old touches — nothing
   formal before it), then the 4-step brief — all four points present, 1–2
   sentences each, 2–3 specific "Where" applications, a testable "When NOT"
   rule, key terms bolded, **no quiz before the brief**.
4. **Diagram check (v5, if present):** standardized format chosen per the §4.5
   table; node texts follow the bracket patterns; captions terse; **no
   storytelling duplication** with the infographic; renders below the visual,
   above the prose; 375px without overflow; both themes legible.
5. **MCQ check (v5):** **exactly 2 questions**, both real-life scenario
   prompts (concrete actors/systems, not "What is X?"); the second transfers
   to a new situation; every explanation resolves its scenario and names the
   misconception; distractors diagnostic; no prediction card, no application
   card anywhere on the page.
6. **Toggle to dark mode.** Every card, SVG, and text string is legible. No
   white cards on black, no invisible art. (Invisible-in-dark is a bug.)
7. **Reduced-motion:** DevTools → Rendering → emulate `prefers-reduced-motion`.
   All motion collapses to instant.
8. **Color check:** one accent per scene, neutrals dominate, no rainbow.
   Resting state feels calm, not loud.
9. **Interactivity check (if the lesson has a widget):** the widget earned its
   place on the mapped beat (gate 1); every control **looks** clickable (gate 2)
   and carries a verb-led instruction (gate 3); **if the concept has a knob or
   toggleable state, the control is continuous — the consequence updates live
   while dragging, presets are chips, not the whole control (§6)**;
   BEFORE→AFTER is visible in the picture; at least one Constructive beat;
   keyboard-reachable; both themes; 375px with no horizontal overflow.
10. **Story check (v4):** one through-line; not an animated glossary; the
   scenario MCQs, widget, and transfer share one capability; intermediate/
   expert advances the course case; passes the rubric in
   `visual-interactive-storytelling.md` §8.
11. **Pedagogy check:** aha lands; concrete anchor + analogy break if
   beginner/intermediate; density matches level; framework beats (§1.1) intact.
12. **Evidence check:** lesson contract exists; feedback names misconception +
   next investigation; transfer requires decide/explain; measurement plan avoids
   raw sensitive content.
13. **Jargon check (v6):** `npm test` runs `content/jargon.test.ts`; if it
   fails, add the parenthetical gloss at the first occurrence (§2.5) — don't
   waive it.
14. **Cheat-sheet check (v6):** the card renders after the MCQs in both
   themes; the PNG route (`/courses/[course]/[lesson]/cheat-sheet`) returns
   the same design; the OG image matches; share buttons fire with the correct
   lesson URL.

---

## What NOT to do

- **Don't open a lesson with a quiz.** The predict-first opening is v4
  behavior. v5 lessons open with the concept brief; prediction cards and
  application cards no longer exist — don't reintroduce either.
- **Don't ship 3+ MCQs or definition-style prompts.** Exactly 2 questions
  close every lesson, and both must be real-life scenarios (§0.1) — "What is
  X?" recall prompts are v4 style.
- **Don't replace a story infographic with a standardized diagram.** The
  bespoke scene aesthetic is the product; the standardized diagram is an
  additional reference layer rendered *below* it, from data.
- **Don't duplicate storytelling in the diagram layer.** If the diagram's
  captions re-narrate the picture above, cut the captions (or the whole
  diagram — not every lesson needs one, §4.5).
- **Don't leave key terms unhighlighted — or bold everything.** 1–3
  load-bearing terms per brief point; whole-sentence bolding erases the
  signal.
- **Don't open with formalism.** Nodes, vectors, formulas, or code before
  the anchor is v5 style; the everyday metaphor comes first (§0).
- **Don't ship an unglossed listed term in a beginner/intermediate lesson.**
  First use gets its parenthetical plain-English translation (§2.5) — the
  jargon test will fail it.
- **Don't ignore the course level.** Building an expert lesson in the Layman
  picture-led style is as wrong as building a Layman lesson full of formulas.
  Read `level` first.
- **Don't over-scaffold experts.** Heavy analogies, worked examples, and dense
  signaling help beginners and *harm* experts (P4). Calibrate.
- **Don't use more than one accent color per scene.** Rainbows overload (P3).
  Neutrals + one accent.
- **Don't hardcode hex, `bg-white`, or `text-white`.** They bypass the theme
  and vanish in dark mode. Use the tokens (§3).
- **Don't hand-animate every lesson.** Reach for the primitive layer first.
- **Don't dump a full equation or 6-step process in one frame.** Segment it (P6).
- **Don't over-explain the aha.** Withhold the conclusion a beat so the learner
  generates it (P7). Pre-digesting every step kills insight.
- **Don't duplicate information across channels** (headline + label + prose +
  MCQ all saying the same thing). Say it once (P1 redundancy).
- **Don't install `framer-motion`.** Use `motion`.
- **Don't ship motion without `MotionConfig reducedMotion="user"`.**
- **Don't add a control you haven't earned.** If a passive reveal teaches the
  same thing, stay passive. A toggle/click/drag added just to "make it
  interactive" is decorative interaction — a seductive detail that *harms*
  learning (P8; gate 1, restraint).
- **Don't ship a control that doesn't look clickable, or that the learner isn't
  told to click.** Visible chrome, a clear selected state, and a verb-led
  instruction ("Toggle…", "Click…", "Drag…") are mandatory — a `<button>` that
  renders as plain text is invisible, and most learners will scroll straight
  past it (gates 2 + 3, affordance + discoverability).
- **Don't build an open sandbox for beginners.** Constrain to 2–3 presets with
  worked data; open discovery backfires for novices (Lazonder & Harmsen 2016).
- **Don't ship a widget without a learning goal, keyboard access, and a
  reduced-motion-safe path.** If the concept is reachable only through
  animation or a mouse drag, it's broken.
- **Don't stop at Active.** Aim at least one beat per lesson at *Constructive*
  (predict-then-reveal) — that's where the retrieval/generation gains live (P8).
- **Don't give generic feedback.** “Correct” or “try again” without naming the
  evidence and next investigation wastes the learner’s decision.
- **Don't optimise a lesson for clicks.** Instrument learning evidence only;
  never treat raw prompts, model outputs, or time-on-page as engagement fuel.
- **Don't ship an animated glossary.** Definition → diagram → unrelated widget
  → takeaway fails v4 even if typecheck and dark mode pass.
- **Don't change the metaphor every scene.** One through-line object; new
  *state*, not a new analogy each beat.
- **Don't park the widget after the resolution.** Map it to tension / observe /
  diagnose / now-what per §1.3.
- **Don't treat the closing MCQs as the whole Constructive craft.** Align them
  with the in-scene action; avoid triple-redundant scenario + widget guess +
  MCQ all restating one another.
- **Don't ship preset-only controls where a knob begs to be dragged.** If
  the concept is "what happens as X changes," the control is continuous
  (§6) — presets are chips on top, never the whole control.
- **Don't hand-roll sliders or toggle rows.** Use
  `components/infographic/controls.tsx` — the affordance gate (chrome,
  selected state, focus ring, live readout) is built in.
- **Don't author cheat-sheet content.** The card derives from `concept`
  (§4.7); if it reads badly, fix the field — never fork the content.

---

## References (read on demand)

- `references/standard-visual-formats.md` — **(new in v5)** the three
  standardized diagram formats, node text patterns, worked examples, and the
  no-duplication rule.
- `references/visual-interactive-storytelling.md` — **(v4)** fusion rule,
  beat→interaction maps, visual narrative grammar, course continuity, worked
  PIC/CER exemplars, story-vs-glossary rubric, Step-3 checklist.
- `references/narrative-structures.md` — the three level frameworks plus the
  library of reusable story shapes (points into the v4 fusion layer).
- `references/interactivity-patterns.md` — recipes for toggle / click / drag /
  **evidence matrix** / **decision gate** / **continuous playground**, ICAP
  upgrades, feedback contracts, client-boundary + accessibility.
- `references/lesson-contract.md` — pre-markup brief **including the anchor,
  the concept-brief fields, the playground decision, and the diagram
  decision**, through-line, interaction beat, and BEFORE/AFTER picture states.
- `content/jargon-terms.ts` — the curated term→plain-English list the jargon
  gate (§2.5) enforces; extend it deliberately, never to silence a failure.
- `components/infographic/controls.tsx` — **(new in v6)** `SliderControl` +
  `ToggleGroup` shared primitives for continuous playgrounds (§6).
- `assets/interactive-widget-template.tsx` — toggle-compare starter.
- `assets/evidence-decision-template.tsx` — **(v4)** evidence-matrix +
  decision-gate skeleton.
- `references/motion-tokens.md` — easing/duration/variant/stagger values.
- `references/reveal-patterns.md` — `Reveal`, stagger, client-boundary,
  signature moments.
- `references/learning-science-sources.md` — sources for the 8 principles.
- `../infographics-static/references/brand-system.md` — theme-aware palette.
- `../infographics-static/references/layout-gallery.md` — layout templates.
- `../infographics-interactive_v5/SKILL.md` — prior v5 skill (retained; not
  the default).
- `../infographics-interactive_v4/SKILL.md` — v4 skill (retained; not
  the default).
