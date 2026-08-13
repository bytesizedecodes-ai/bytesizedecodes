---
name: infographics-interactive
description: THE LATEST and default skill for building ByteSizeDecodes infographic lessons and course pages. v3 — evidence-based visual storytelling for three audience levels (beginner / intermediate / expert), the scroll-triggered motion system, AND an active-learning interactivity layer (ICAP: make learners do, not just watch). Use whenever the user wants to create a lesson, add a course, design a visual explanation, build an interactive widget/dashboard/simulator, animate infographics, or build a course page. Triggers on: build infographic, create lesson, add course, new course page, animate infographics, scroll reveal, stagger entrance, interactive widget, make it interactive, "make the scenes animate", infographic storytelling. Read this file fully before generating any lesson markup.
---

# infographics-interactive (v3)

The latest default skill for building ByteSizeDecodes lessons — **a superset
of `infographics-animation` (v2)**. v3 keeps everything from v2 (evidence-based
pedagogy, the motion system, theme-safe color) and adds two things the research
demands:

- **An interactivity layer (§6).** Active learning decisively beats passive
  (Freeman 2014, *PNAS*; Chi's ICAP ladder). Motion alone is *Passive* viewing;
  this skill now makes learners *do* — toggle, click, drag, predict — at the
  right depth for their level. Every lesson should reach at least the
  *Constructive* rung (the learner generates, not just manipulates).
- **Distinct storytelling frameworks per level (§1.1).** The expertise-reversal
  effect is now meta-analytic (Tetzlaff 2025): guidance *helps novices but harms
  experts*. So each level gets its own named narrative structure — not just
  stronger/weaker versions of the same one.

Every course has a `level`: **beginner** (layman), **intermediate**
(tech enthusiast), or **expert** (technical expert). The level controls
*how* you tell the story, not *what* the story is. Read the audience
section first.

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

**The level is on the course object** (`content/courses.ts` → `level: "beginner"|"intermediate"|"expert"`).
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
*predict-then-reveal*, which the platform's `PredictionCard` already provides
before each infographic.

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

### The ICAP ladder (target at least *Constructive*)
| Rung | What the learner does | Example on the platform |
|---|---|---|
| **Passive** | Watches / reads | A scroll-reveal animation (the §5 default) |
| **Active** | Manipulates what's given | Clicking a trace step; toggling a time window |
| **Constructive** | Generates something new | **Predict-then-reveal** (the `PredictionCard` before each infographic) |
| **Interactive** | Co-creates with feedback | A tutor-AI dialogue (beyond today's primitives) |

The biggest jump is **Active → Constructive**. Every lesson should land at least
one Constructive beat; the cheapest way is *predict-then-reveal* — ask the
learner to commit before the widget reveals the answer.

### The three widget patterns (reuse these)
| Pattern | Reference build | ICAP | Use when the concept is… |
|---|---|---|---|
| **Toggle-compare** | `MetricsDashboard` (1h/24h/7d tiles + sparklines) | Active | a *comparison between states* (window, mode, before/after) |
| **Click-to-elaborate** | `TraceWaterfall` (step → detail panel) | Active | a *whole with parts worth inspecting* one at a time |
| **Drag-to-tune** | `AlertThresholdTuner` (threshold ↔ false-alarm/missed trade-off) | Active→Constructive | a *trade-off you can feel* by moving one knob |

Concrete code recipes for each (props, state shape, accessibility), the
client-boundary rules, and the Constructive upgrade paths are in
**`references/interactivity-patterns.md`**. A minimal copy-paste starter lives
in **`assets/interactive-widget-template.tsx`**.

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
- Same color discipline as everywhere else (§3): one accent per scene, theme-safe tokens, semantic red only for the anomaly/failure.

---

## 7. The 5-step workflow

### Step 1 — Read the course level, calibrate, and pick the framework
Read the course's `level` (beginner/intermediate/expert) in
`content/courses.ts`. Set your analogy density, jargon level, narrative
weight, and math/code allowance per §1. **Then pick the level's named
storytelling framework from §1.1** (Beginner → Anchored Story-Mountain;
Intermediate → Predict–Investigate–Case; Expert → Problem-First Diagnostic).
**If unsure of the level, ask.**

### Step 2 — Define the learning objective + the aha
State in one sentence: *what should the learner understand after this
lesson that they didn't before?* Then identify the **aha moment** — the
insight where a hidden relationship becomes visible. The whole lesson
builds toward that.

### Step 3 — Structure the story (framework + P5 + P6)
Lay out the scenes in the beat order of the framework you picked in Step 1
(full beats in `references/narrative-structures.md`):
- **Beginner (Anchored Story-Mountain):** Hook → Concrete anchor → Tension →
  Reveal + fade → Resolution.
- **Intermediate (Predict–Investigate–Case):** Scenario → Predict → Observe →
  Explain-via-case → Transfer.
- **Expert (Problem-First Diagnostic):** Problem-first → Diagnose →
  Claim/Evidence/Reasoning → Counter-examples → What/So-What/Now-What.
Then **add the active beat (§6)**: decide where the learner *does* something,
and make at least one beat Constructive (predict-then-reveal). One concept per
scene (P3). Simple → complex, concrete → abstract (P2/P6).

### Step 4 — Build with the vocabulary + theme-safe colors
Use the shared primitives (`Scene`, `PictureCard`, `Operator`, the shapes).
Theme-safe colors only (§3). Motion via `Stagger`/`MotionChild`/`Reveal` (§5).

### Step 5 — Verify (all of these, not some)
1. `npm run typecheck` — passes.
2. Load the lesson route, scroll — scenes reveal once, formula builds stagger,
   nothing re-fires.
3. **Toggle to dark mode.** Every card, SVG, and text string is legible. No
   white cards on black, no invisible art. (Invisible-in-dark is a bug.)
4. **Reduced-motion:** DevTools → Rendering → emulate `prefers-reduced-motion`.
   All motion collapses to instant.
5. **Color check:** one accent per scene, neutrals dominate, no rainbow.
   Resting state feels calm, not loud.
6. **Interactivity check (if the lesson has a widget):** every widget has a
   stated learning goal; at least one beat is Constructive (predict-then-reveal
   or task-framed discovery); no decorative interaction; every control is
   keyboard-reachable and labelled; the widget works in **both** themes and at
   mobile width (375px, no horizontal overflow).
7. **Pedagogy check:** does the aha land? Is there a concrete anchor (if
   beginner)? Is the density appropriate to the level? Did you say where the
   analogy breaks (if beginner/intermediate)? Did you follow the level's
   framework beats (§1.1)?

---

## What NOT to do

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
- **Don't add decorative interactivity.** A toggle/sparkle that doesn't teach a
  concept is a seductive detail — it *harms* learning (P8). Every widget must
  justify itself against the learning objective.
- **Don't build an open sandbox for beginners.** Constrain to 2–3 presets with
  worked data; open discovery backfires for novices (Lazonder & Harmsen 2016).
- **Don't ship a widget without a learning goal, keyboard access, and a
  reduced-motion-safe path.** If the concept is reachable only through
  animation or a mouse drag, it's broken.
- **Don't stop at Active.** Aim at least one beat per lesson at *Constructive*
  (predict-then-reveal) — that's where the retrieval/generation gains live (P8).

---

## References (read on demand)

- `references/narrative-structures.md` — **(new in v3)** the three level
  frameworks (Anchored Story-Mountain, Predict–Investigate–Case, Problem-First
  Diagnostic) with beats, plus the library of reusable story shapes.
- `references/interactivity-patterns.md` — **(new in v3)** concrete recipes for
  the three widget patterns (toggle-compare, click-to-elaborate, drag-to-tune),
  ICAP levels, Constructive upgrade paths, and the client-boundary + accessibility rules.
- `assets/interactive-widget-template.tsx` — **(new in v3)** a minimal
  `"use client"` widget starter (state + aria + theme-safe tokens).
- `references/motion-tokens.md` — exact easing/duration/variant/stagger values.
- `references/reveal-patterns.md` — `Reveal` wrapper, stagger recipe,
  client-boundary playbook, signature-moment patterns.
- `references/learning-science-sources.md` — the full source list for the 8
  principles (Mayer, Kalyuga, Cowan, Goldstone & Son, Tobler, Cabeza, Chi,
  Freeman, Rowland, Slamecka & Graf, Lazonder & Harmsen, Tetzlaff).
- `../infographics-static/references/brand-system.md` — the theme-aware
  palette + contrast source of truth. Read before authoring colours.
- `../infographics-static/references/layout-gallery.md` — layout templates
  (story-mountain, bridge, iceberg, comic-strip, etc.). Pick by content shape.
