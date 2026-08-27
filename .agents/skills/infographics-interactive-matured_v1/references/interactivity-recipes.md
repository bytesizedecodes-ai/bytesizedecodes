# Interactivity recipes — deterministic step-throughs for technical stages

The v2 gates still bind: at most ONE interaction per lesson, mapped to a
beat; every control looks like a control (real form elements, chrome,
selected state, focus ring); a verb-led instruction announces it; BEFORE →
LEARNER ACTS → AFTER with the BEFORE ghosted; deterministic local data
only. Build chrome from `components/infographic/controls.tsx`
(`SliderControl`, `ToggleGroup`) plus plain buttons — never hand-rolled
sliders. Everything AROUND the controls is plate-styled per
`visual-grammar.md`: thin-outlined rows on open canvas, plain mono
annotations, no boxed panels or pill lists inside the widget area.

The recipes below are generic shapes — instantiate them for any technical
domain (traces, pipelines, configs, schedules, metrics).

## Recipe 1 — The sequence stepper

**For:** anything that unfolds in discrete steps — a request's journey, a
protocol handshake, a training loop's epochs, a build pipeline.

- The artifact (log, transcript, pipeline) renders as a growing list; each
  click appends ONE entry. Entry N uses the referents' fixed colors; the
  newest entry carries the accent, older entries stay neutral (they dim,
  they never vanish).
- **Progress chrome:** `Next ▸` button, `↺ Reset`, and an `n / N`
  readout — the learner must always know where they are.
- **Presets are situations, not skins:** at least two, and at least one
  ENDS DIFFERENTLY (converges vs stalls, passes vs fails). Switching a
  preset resets the run. The divergence is the lesson.
- **Closing feedback** names what the run proved — tied to the referents,
  not praise: "Three turns, one tool call each — and turn 3 re-sent
  everything turn 1 said."
- Steppers teach sequence and accumulation. If the concept is a continuous
  knob, use Recipe 2 instead — don't fake continuity with 12 steps.

## Recipe 2 — The budget/slider consequence

**For:** one tunable quantity with a visible consequence — a retry budget,
a cache size, a threshold, a fan-out width.

- `SliderControl` with integer steps and 2–3 preset chips; the consequence
  panel re-renders live while dragging. Show the COST side, not just the
  benefit (budget up → reliability up, spend up) — technical readers
  distrust one-sided widgets.
- Mark the failure boundary on the scale or in the readout ("window
  overflow at ≥ 6"). The boundary is usually the lesson.

## Recipe 3 — The membership toggle

**For:** what-changes-when-X-is-present questions — a cache on/off, a
validation gate, one pipeline stage, a redundant node.

- `ToggleGroup` (or a checkbox-styled pair of chips) flips ONE component;
  the stage re-renders with the component present/absent; the absent
  state leaves a ghost outline where it sat, so the delta is visible.
- Keep ONE toggle per widget. Two independent toggles split into two
  lessons' worth of interpretation — if you need both, the second belongs
  in a preset.

## Recipe 4 — The A/B state compare

**For:** two configurations of the same artifact — naive vs indexed,
before vs after a patch, two routing strategies.

- A `ToggleGroup` selects the variant; the SAME stage re-renders both
  ways, positions stable; the differing region carries the accent and the
  prior variant ghosts. A small metrics row (2–3 numbers, same units)
  quantifies the difference.
- Never render both variants side by side as equal columns the whole
  lesson — that is the compare TABLE's job (reference `diagram` layer);
  the widget's job is the flip moment.

## Feedback contract (all recipes)

Every terminal state answers: what did the run SHOW, which referent
explains it, and what should the learner look at next. Feedback names the
misreading, not the person: "the loop did not break — the budget halted
it; look at the counter" beats "great job!" Deterministic means the same
inputs always produce the same run — no `Math.random()`, no `Date.now()`
(they are also banned outside client components by repo rule 2's spirit).
Reduced-motion safe by construction: state changes, never animation,
carry the meaning.
