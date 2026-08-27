---
name: infographics-interactive-matured_v1
description: THE matured skill for authoring technical courses on ByteSizeDecodes — practitioners who already own the AI/ML vocabulary and want mechanisms, not metaphors, drawn as printed-book PLATES. Use for ANY lesson, infographic, widget, diagram, or cheat-sheet in a course carrying `pedagogy: "matured-v1"` (any level). Keeps the v2 Thread contract — lesson map, connective captions, a stable stage that changes STATE not layout, one accented delta per scene with ghosted prior states, referent stability, the scroll test — in a distinct visual grammar: thin ink strokes on open canvas, line-art glyphs, no cards/chips/shadows (`components/infographic/plate.tsx`), plus artifact anchors (trace, schema, error — never metaphors), technical referents with no fictional cast, the DECOMPOSITION RULE (diagrams over ~5 nodes render as accumulating builds, never one big picture), code as a scene element, postmortem MCQs, deterministic step-through widgets. If `pedagogy` is `matured-v1`, THIS is the skill — overrides the level skill.
---

# infographics-interactive-matured_v1

The matured skill = the v2 Thread contract **plus a technical-register
calibration plus its own visual grammar**. Everything v2 requires still
applies (lesson map, connective captions, one stable stage that changes
STATE, one accented delta with ghosts, referent stability, scroll test,
exactly 2 scenario MCQs, cheat-sheet derivation, color/motion discipline).
What changes is **who is reading, what counts as an anchor, and what the
page looks like**: this reader already owns the vocabulary, and the page
should read like a **printed technical guidebook** — thin ink strokes,
line-art glyphs, open canvas — not like the site's card-and-chip UI.

**Why this skill exists:** the level skills (v2) assume the reader needs a
metaphor bridge from everyday life, and render in the house card chrome.
Matured-audience courses — typically intermediate/expert courses on
practitioner infrastructure — serve readers who debug real systems and
want the page to look like their work: traces, schemas, configs, error
messages. Three failures this skill repairs: lessons that spend their
anchor beat on an analogy the reader skips past; diagrams that render an
entire architecture in one large frame the reader cannot parse at reading
speed; and lessons that look identical to every other course on the site.
Each is a named bug with a named fix (§2, §3, §5;
`references/decomposition-builds.md`, `references/visual-grammar.md`).

## 0. Who you are writing for

A practitioner who works with (or is entering) technical AI systems, knows
the standard vocabulary (context window, function call, embedding, eval,
latency) without glosses, and is reading to repair a partial schema — they
have run the thing, they have not internalized what *forces* it to work that
way. They skim decorative prose. They slow down for real artifacts and real
numbers.

| Dimension | Rule |
|---|---|
| **Analogy** | **None.** The anchor is a real artifact or failure (§1). If a comparison is load-bearing, it may get ONE clause — never a scene. |
| **Narrative** | Problem → resolution spine stays, carried by the artifact. Generic icon actors ARE allowed — a line-art person glyph labeled `user` or by ROLE (`reviewer agent`) — because they are how the guidebook draws agency; what stays banned is anything more specific: named characters, dialogue, personality, story-world nouns. |
| **Jargon** | Standard vocabulary unglossed. Gloss only genuinely uncommon terms, same-sentence parenthetical (§6). |
| **Density** | ~5 focal elements per scene. Machine text (code, JSON, logs) counts as ONE element when it is the object under study. |
| **Signaling** | Moderate-high — the delta is always accented; otherwise let the reader find structure. |
| **Math/code** | Real short code and real formats welcome as scene elements (§4). Formulas per the course level. |
| **The aha** | Inevitability, as in v2-intermediate: the mechanism lands as the only possible conclusion. |
| **Prose** | Rule 12 unchanged: short sentences (~20 words), one idea each. Plain words, full precision. |

## 1. The artifact-first opening (mandatory)

The lesson page order:

```
header → CONCEPT BRIEF (ARTIFACT anchor first) → story infographic (opens
with the PlateMap line) → prose → exactly 2 scenario MCQs → CHEAT-SHEET
```

**No system-diagram layer by default.** The decomposed plate build already
IS the architecture (§3) — an added Input→Process→Output / decision flow
that restates it is duplication, the most common matured bug. Attach a
`diagram` only when it adds a genuinely distinct reference view (e.g. a
compare grid on a decision lesson); omit otherwise.

```ts
concept: {
  anchor: "…one sentence naming the REAL artifact/failure this lesson is
           about — the trace line, the error, the schema the reader meets
           at work…",                              // NOT a metaphor
  what:   "…10-second mechanism summary, technical terms fine…",
  why:    "…the capability this unlocks (debugging, designing, costing)…",
  where:  ["…real system 1…", "…real system 2…"],  // 2–3, all real
  whenNot: "…one testable boundary rule…",
},
```

- The `anchor` field still renders first and still feeds the cheat-sheet —
  but it names a concrete technical thing, not an everyday metaphor. The
  automated contract (`content/courses.test.ts`) only requires length > 15;
  "your API bill spikes and the log shows the same tool call 40 times" is a
  valid anchor. A chef/kitchen metaphor is a bug.
- Brief-field rules are v2's: 1–2 sharp sentences per field, 1–3 bold
  load-bearing terms, "Where" specific and real, "When NOT" testable.

### 1.1 The two closing MCQs — exactly 2, postmortem-style scenarios, 3–4 choices

- **A diagnostic or decision situation**, not a definition: real systems,
  real symptoms, a log line or measurement in the prompt where natural.
- One question checks the What/Why; the second **transfers** to a new
  situation.
- Distractors embody plausible practitioner reflexes (retrain, bigger
  model, add more tools) — never filler.
- Explanations name the misconception and tie the correction to the
  evidence from the lesson, >20 chars. 3–4 choices. A third question is a bug.

## 2. The four beats: Artifact → Build → Mechanism → Transfer

Every matured lesson is laid out in these beats (the v2 frameworks'
problem→resolution spine, opened on the working artifact):

- **Artifact:** scene 1 stages the real thing — a trace excerpt, a request
  payload, a config, a benchmark row — AND names every referent the lesson
  will use (§4). This is the v2 pre-training beat, restaged: the referents
  are technical objects (message roles, pipeline stages, metric names).
- **Build:** the big picture is *decomposed* — the full diagram never
  appears in one shot; the stage accumulates one element per scene
  (§3, the decomposition rule).
- **Mechanism:** why it must be so. When the aha is a derivation, borrow
  the v2 **first-principles ladder with its accumulating rail** unchanged
  (`../infographics-interactive-intermediate_v2/references/first-principles-ladder.md`)
  — matured readers benefit from the rail exactly as much.
- **Transfer:** MCQ 2 (and one widget preset, if the lesson has a widget)
  carries the mechanism into a new situation.

### 2.1 Course continuity — the course system, and the system-so-far strip

The v2 "course case" (a fictional product with a cast) becomes the **course
system**: one persistent technical system defined before lesson 1 — named by
its artifacts, not by people ("one support agent over a payments API: its
trace, its tool registry, its eval report"). Every lesson adds one
constraint, failure mode, or design decision to that system; the capstone
assembles the accumulated decisions instead of inventing a finale. Each
lesson OPENS with the **system-so-far strip**: the system's persistent
diagram small, prior lessons' additions already marked (a chip row:
"✓ tool schemas · ✓ loop budget · + today: trace reading"). Five-second
re-entry, same job as the v2 case-so-far strip — without the cast.

## 3. The decomposition rule (the signature method)

The named bug this skill exists to kill: **the big static diagram** — an
entire architecture, protocol, or pipeline rendered in one large frame with
8–15 labeled boxes, which the reader cannot parse at reading speed and
which the PDF-era web is full of.

- **Any diagram with more than ~5 nodes never renders in one shot.** It
  renders as a **build**: a stable stage where each scene adds exactly one
  element (a node, an arrow, a lane), established elements dim to neutrals
  but never disappear, and the ONE new element carries the scene's accent.
- The completed structure appears only in the final beat, as the earned
  whole — that plate is THE diagram; do not also ship a `diagram` layer
  restating it (§1). Cut scope before cutting readability: a build that
  needs >9 nodes is two diagrams, i.e. probably two lessons.
- Builds render as consecutive plates sharing the SAME stage drawing, so
  the climb reads as one growing structure (the v2 rail grammar,
  generalized from ladders to ANY structure: topologies, message flows,
  layered stacks). Never re-box the stage per beat.
- **The reader must be able to re-draw the final diagram from the build.**
  If a scene's addition cannot be stated in one short "because" caption,
  it is two scenes.

Full contract with worked example:
`references/decomposition-builds.md` — read it before authoring any
multi-node picture.

## 4. The technical stage: referents and code scenes

- **Referents are technical objects only.** Roles, stages, protocols,
  files, metrics — labeled with the names the reader meets at work
  (`tool_call`, `Observation`, `rerank`, `p99`). Referent stability is v2's
  rule unchanged: names, colors, shapes, units fixed for the whole lesson.
  No fictional characters, no story-world nouns, anywhere.
- **Machine text vs author text.** Anything a machine emits (code, JSON,
  log lines, headers) renders in monospace on the open canvas or inside a
  thin `InkBox` — not in heavy inverted terminal panels; author prose
  never renders in monospace. One monospace block per scene unless the
  scene IS a code comparison.
- **Code is a first-class scene element.** When the mechanism is
  code-shaped, short real code IS the picture — and it follows the same
  delta grammar as diagrams: the one changed/added line carries the accent
  (re-render the block with the line accented), the prior version ghosts
  beside it for comparisons. Keep excerpts ≤ ~12 lines; ellipsize the rest
  (`…`) rather than shrinking type.
- Full referent + code-scene grammar: `references/technical-stage.md`.

## 5. The Thread contract (inherited from v2, technical calibration) and the Plate grammar

All six rules apply as written in
`../infographics-interactive-intermediate_v2/references/visual-interactive-storytelling.md` §2.
Calibration notes:

1. **PlateMap** (not StoryMap chips): the lesson arc as ONE line of
   plain-text steps joined by thin arrows, under the header
   (`components/infographic/plate.tsx`). 3–5 steps, ≤4 words, technical
   labels ("every turn re-reads" not "the story begins").
2. **Connective kickers**: every plate's kicker opens So / But / Because /
   Meanwhile / That's why. Ordinals alone are decoration — still a bug.
3. **Stage rule**: same object, same positions, all lesson; plates change
   STATE. Hairlines between plates carry the beat change; the stage never
   resets.
4. **One accented delta per plate; the prior state ghosts** where a value
   changed — in code scenes too (§4).
5. **Referent stability**: fixed names/colors/units; new numbers only in
   Transfer.
6. **The scroll test** is the ship gate: at scroll speed the lesson reads
   as one continuous shot. Failing = restructure before shipping.

**The Plate grammar is the skill's visual identity** and is mandatory:
build from `components/infographic/plate.tsx` (`PlateSet`, `Plate`,
`PlateHeader`, `PlateMap`, `InkBox`, `Oval`, `Boundary`, `Glyph`,
`FlowArrow`, `SideArrow`, `NoteRule`) — thin ink strokes, line-art glyphs,
open canvas, no cards/chips/shadows. A matured lesson rendered in the
shared `Scene`/`Card` chrome is a bug. Full system + litmus test:
`references/visual-grammar.md` — read it before authoring any picture.

**Device discipline (what makes the plates read as storytelling):**
every plate is composed as ONE of the seven canonical devices — actor →
targets fan-out · chain-with-loop-back cycle · two-box ping-pong ·
before/after pair · catalog grid · level ladder · boundary map — never a
freeform composition. The reuse of familiar shapes across plates and
lessons IS the pedagogy: by lesson 3 the reader decodes a plate in
seconds because the shape is already known. Pick per beat; if none fits,
simplify or split. Connector rules inside every device: **every arrow
that crosses a boundary or loops back is labeled** with its payload word
(`tool_call out`, `observation in`, `query`) — plain forward sequence
arrows between steps may stay bare; dashed = loop/re-send/crossing,
solid = forward flow. Glyph casting follows
the same discipline — one glyph = one meaning for the whole course
(person = user, chip = model, gear = tool, db = store), fixed in lesson 1.
Full catalogue with layouts, casting table, and the simplicity budget:
`references/story-devices.md`.

**The one §3 exception:** uniform inventory grids (the catalog device)
may exceed 9 nodes because repetition is their grammar — 12 identical
tiles read faster than 6 varied ones. Cap at 12 tiles; beyond that move
the inventory to the reference diagram layer.

## 6. The plain-English gate (rule 12, technical register)

Rule 12 applies in full — short sentences, one idea each, everyday words
where precision allows — because our readers read English as a second
language even when they write Python fluently. What changes is the gloss
list: the automated jargon gate is beginner-scoped and does not run here;
you gloss, on first use only, terms a working practitioner plausibly has
not met (a niche protocol name, a paper's coinage), same-sentence
parenthetical, short and factual. Never gloss the vocabulary of the
course's own prerequisites line.

## 7. Color and motion (inherit, plate calibration)

One accent per plate and it marks the delta, as a soft fill
(`bg-brand-wash`) or accent stroke — never as a second hue; ink neutrals
carry everything else. Theme-safe tokens only (`bg-canvas`, `text-ink`,
`currentColor`/`var(--*)` in SVG — never literal hex, never
`bg-surface-elevated` panel stacks). Scroll-triggered, play-once,
opacity/transform only, `MotionConfig reducedMotion="user"`, one easing
family; the accumulating build via `Stagger` is the signature beat. Full
rules: `references/visual-grammar.md` §2,
`../infographics-interactive-intermediate_v2/references/motion-tokens.md`,
`../infographics-static/references/brand-system.md`.

## 8. Interactivity — deterministic step-throughs

The v2 gates are unchanged (restraint: at most ONE interaction, mapped to
a beat; affordance: every control looks and behaves like a control;
discoverability: verb-led instruction). Matured calibration of the *form*:

- **Task-framed, artifact-shaped.** The widget manipulates the same
  artifact the lesson stages — step a trace, toggle a component, drag a
  budget. BEFORE → LEARNER ACTS → AFTER, the BEFORE ghosted.
- **Step-through steppers** (state advances on click through a
  deterministic sequence) and **continuous knobs** (slider/toggle with
  live consequence) from `components/infographic/controls.tsx` —
  `SliderControl`, `ToggleGroup`, real buttons. Never hand-roll chrome.
- Presets are chips that re-frame the situation (a second trace, a failure
  variant) — at least one preset should end differently than the first.
- Deterministic, local, illustrative data only; no backend calls per
  interaction; state changes carry meaning, never motion.
- Recipes: `references/interactivity-recipes.md`.

## 9. The authoring workflow

0. **Learning contract first** — objective as an observable verb; the aha
   and the likely wrong conclusion; the artifact anchor; PlateMap steps;
   the scene list as *beat → chapter|continue → connective caption → the
   ONE delta*; referents (all staged in beat 1); the build plan (§3); the
   one interaction and its beat; the system-so-far strip addition; whether
   a `diagram` layer earns its place (default: none — §1).
1. Read the course object — if `pedagogy` is not `"matured-v1"`, you are
   holding the wrong skill; use the level skill.
2. Draft `concept` (artifact anchor first) → beats → scenes → MCQs
   (postmortem scenarios). No `diagram` unless §1's bar is met.
3. Build with the Plate vocabulary (`plate.tsx`: `PlateSet`, `Plate`,
   `PlateHeader`, `PlateMap`, `InkBox`, `Glyph`, `FlowArrow`, `NoteRule`)
   plus `controls.tsx` for widget knobs — in theme-safe tokens. A NEW
   lesson must be registered in `components/infographic/index.tsx` AND
   given a `unit()` entry in `convex/lib/dailyPlan.ts` (its coverage test
   fails on any unregistered lesson; minutes must match `lesson.minutes`).
4. Verify: `npm run typecheck` + `npm test`; load and scroll; **run the
   scroll test**; dark mode; reduced motion; 375px; one accent per scene
   marking the delta; exactly 2 scenario MCQs (3–4 choices); anchor is an
   artifact; no metaphors, no cast; build accumulates (nothing disappears
   mid-build); widget earned + announced; cheat-sheet derives from
   `concept`.

## What NOT to do (matured)

- Don't render in the house card chrome — no `Scene` panels, no `Card` /
  `Takeaway` boxes, no `StoryMap` chips, no pill badges, no `shadow-sm`,
  no centered bold figcaptions. The Plate grammar is the identity.
- Don't compose freeform plates — each one is a canonical device
  (§5); don't invent a new layout per plate.
- Don't draw an unlabeled arrow or an unlabeled loop-back; don't use a
  dashed line where solid flow is meant (dashed = loop/re-send/crossing).
- Don't cast named characters or write dialogue — generic role-labeled
  icon actors are fine; personality is not.
- Don't open with a metaphor or story-world noun anywhere in the
  lesson. The artifact is the anchor.
- Don't render a >5-node diagram in one frame — decompose it into an
  accumulating build; don't let built elements disappear mid-build.
- Don't add two deltas in one plate — split it; don't erase the prior
  state — ghost it (code scenes included).
- Don't write ordinal-only kickers; every plate kicker opens with a
  connective.
- Don't re-bind referents mid-lesson (names, colors, units stay fixed).
- Don't gloss standard vocabulary; do gloss genuinely uncommon terms once.
- Don't park the widget after the resolution; it lives on the beat it
  tests. Don't ship a widget that cannot end differently across presets.
- Don't hand-roll sliders/toggles/buttons chrome — use `controls.tsx` and
  real form elements.
- Don't attach a `diagram` that restates the plates — an Input→Process→
  Output or decision re-run of a loop/pipeline the build already drew is
  the classic matured bug; omit the layer by default (§1). Don't exceed
  ~12 code lines in a plate.
- Don't hardcode hex, `bg-white`, `text-white`; don't author cheat-sheet
  content — it derives from `concept`.
- Don't write dense captions — rule 12: short sentences, one idea each.
- Don't bake any single course's specifics into this skill — it is
  universal; course content lives in course files.

## References (in this skill's directory)

- `references/visual-grammar.md` — the Plate grammar: primitives, ink
  rules, layout rhythm, the printed-vs-UI litmus. Read before any picture.
- `references/story-devices.md` — the seven canonical plate devices,
  glyph casting table, connector rules, the simplicity budget.
- `references/decomposition-builds.md` — the decomposition rule in full:
  sizing, build grammar, the re-draw test, worked example.
- `references/technical-stage.md` — referent discipline, artifact anchors,
  code-scene grammar (accent line, ghosts, ellipsis rules).
- `references/interactivity-recipes.md` — the step-through / toggle /
  budget-slider recipes with feedback contracts.
- `../infographics-interactive-intermediate_v2/references/visual-interactive-storytelling.md` — the Thread contract §2 (authoritative).
- `../infographics-interactive-intermediate_v2/references/first-principles-ladder.md` — the ladder + rail, used unchanged when the beat is a derivation.
- `../infographics-interactive-intermediate_v2/references/motion-tokens.md` and `../infographics-static/references/brand-system.md` — motion and color values.
- `../infographics-interactive_v6/SKILL.md` — the superset (cross-level view).
