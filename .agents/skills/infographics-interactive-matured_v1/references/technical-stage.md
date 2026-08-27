# The technical stage — referents, artifact anchors, code scenes

## 1. The artifact anchor

The `concept.anchor` field opens the lesson. In the level skills it is an
everyday metaphor; here it is a **real artifact or failure** — one sentence
that names the thing the reader meets at work:

- "Your API bill spikes, and the log shows the same tool call forty times."
- "The deploy failed on a 200-line YAML file nobody has read end to end."
- "The eval says 91% accurate; every regression ticket disagrees."

Rules: concrete (numbers, names of artifacts), practitioner-recognizable,
and dramatic enough to carry the cheat-sheet card. It should be the SAME
artifact the infographic's beat 1 stages, so brief and picture lock
together. A metaphor here is a bug; so is an abstract topic sentence
("Memory is an important part of agents" — says nothing, stages nothing).

## 2. Referent discipline

A referent is any named thing the lesson will reuse: a role, a stage, a
metric, a file, a message kind, a unit.

- **All referents are staged in beat 1** and nowhere else — the v2
  pre-training beat, applied to technical objects. Beat 1 shows the
  substrate plus ≤6 referents with their labels, colors, and units.
- **Referent stability is absolute**: the name (`Observation`, not
  "result"/"output"/"reply" interchangeably), the color, the shape, and
  the unit stay fixed for the whole lesson, widget included. Re-binding a
  referent mid-lesson is the fastest way to lose a technical reader — they
  are tracking identifiers, not vibes.
- **Labels are the names the reader meets at work** — the wire name, the
  config key, the metric name (`tool_call`, `p99`, `top_k`). Keep the
  label short enough to render at ~10–11px; expand it in the caption's
  first use if the wire name is cryptic.
- **Actors are iconic, role-labeled glyphs.** A line-art person glyph
  labeled `user`, or several identical person glyphs labeled by role
  (`researcher agent`, `reviewer agent`) — that is how the guidebook
  grammar draws agency, and it is allowed. What breaks the register:
  names (Ravi, Priya), dialogue, expressions-as-plot, backstories.
  Systems may be concrete ("a support agent over a payments API") but the
  people stay anonymous and silent. The system-so-far strip carries course
  continuity structurally.

## 3. Machine text vs author text

- Anything a machine emits or stores — code, JSON, YAML, log lines, HTTP
  headers, CLI output, regex — renders in **monospace** on the open canvas
  or inside a thin `InkBox` (`components/infographic/plate.tsx`). Author
  prose never renders in monospace.
- One monospace block per scene, unless the scene's whole job is comparing
  two blocks side by side.
- Machine text is content: it must be REAL (correct syntax, plausible
  values, consistent with the referents). A fake JSON key the reader can
  spot breaks trust in every later scene.

## 4. Code scenes and the delta grammar

When the mechanism is code-shaped, the code IS the picture and follows the
same one-delta rule as diagrams:

- **Accent line.** Re-render the block with the changed/added line
  accented (brand-wash background on that line, or the line in
  `text-brand-deep` bold inside the panel). The rest of the block stays
  neutral — the reader's eye must land on exactly the delta.
- **Ghost comparisons.** Before/after code states render as two panels,
  the BEFORE dimmed (`opacity` ~50%, neutral border) with a verb between
  them (`→ refactor`, `→ patch`, `→ retry`), the AFTER accented. The
  delta must be one localized change the caption names — never a rewrite
  (that is two scenes, or scope the excerpt tighter).
- **Ellipsis, never shrink.** Excerpts ≤ ~12 lines. Cut with a literal
  `…` line where whole stanzas are irrelevant; never drop below 11–12px
  type to fit more.
- **Line numbers only when position matters** (a trace, a diff) — then
  they are a referent and stay consistent across scenes.
- Code in a scene is illustrative and deterministic — no live execution,
  no random output; runnable practice belongs in the lesson's
  `exercise` (Pyodide), not the infographic.
