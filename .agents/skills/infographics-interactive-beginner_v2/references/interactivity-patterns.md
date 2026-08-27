# Interactivity patterns (v4, updated in v6)

The concrete recipes for the interactive-widget patterns referenced from
`../SKILL.md` §6. Each pattern is a small, self-contained **`"use client"`
component registered as a lesson's infographic** — local state only, illustrative
data, no backend. The three Active reference implementations ship in the AI
Observability course (`components/infographic/MetricsDashboard.tsx`,
`TraceWaterfall.tsx`, `AlertThresholdTuner.tsx`). Patterns 4–5 (evidence matrix,
decision gate) are **copyable Constructive recipes** in this file; adapt from
`../assets/evidence-decision-template.tsx`. Pattern 6 (continuous playground,
**new in v6**) is the default form whenever the concept has a knob — build it
from `components/infographic/controls.tsx`.

The **one rule** (§6): every widget is *guided, task-anchored, predict-eliciting,
expertise-adaptive, and never decorative*. If you can't name the concept it
teaches, cut it.

**v4 fusion:** place the widget on the mapped story beat (see
`visual-interactive-storytelling.md` §2). Specify BEFORE → ACT → AFTER picture
states in the lesson contract before coding.

## The client boundary (recap)

Infographics today are Server Components; `motion.tsx` is the one client leaf.
Interactive widgets are the documented, legitimate reason to escalate a second
file to `"use client"`:

| File | Directive | Role |
|---|---|---|
| `components/infographic/<Widget>.tsx` | `"use client"` (top of file) | Holds the widget. `useState` here. Imports shared primitives (which then bundle as client). |
| `components/infographic/motion.tsx` | `"use client"` | `Reveal` for the widget's entrance motion; `MotionProvider` via `<Infographic>`. |

A client component may import the (directive-free) primitives — `Infographic`,
`InfographicHeader`, `Card`, `Takeaway`, `Scene` — cleanly; they have no
server-only code. Keep the widget on theme-safe tokens (§3); wrap its entrance
in `<Reveal>` for consistency with passive lessons.

Full motion/client-boundary detail in `reveal-patterns.md`.

## The ICAP target

The three patterns land at **Active** as built. The cheapest upgrade to
**Constructive** (where the retrieval/generation gains live — P8) is to add a
*predict-then-reveal* beat: a one-line prompt asking the learner to commit a
guess *before* they interact, then letting the interaction confirm or refute it.
Each pattern's "Upgrade to Constructive" note below shows how.

---

## Affordance & discoverability (every widget)

A control the learner can't see or doesn't know to use is dead weight — it adds
load without any active-learning payoff. Before any widget ships, it must clear
the **three gates** from `SKILL.md` §6. In concrete terms:

- **Restraint (gate 1).** If toggling / clicking / dragging wouldn't reveal
  something a passive scene couldn't, don't add the control. The default lesson
  is passive + the 2 closing scenario MCQs; a widget is the exception.
- **Affordance — look clickable (gate 2).** Wrap a toggle's buttons in a visible
  container (the reference uses `rounded-full border border-ash bg-canvas p-1`),
  give the **selected** button a brand fill (`bg-brand text-ink`) and the
  **unselected** buttons a clearly lighter treatment (`text-ink-soft`), and keep
  each target ≥ ~32px tall with `focus-ring` + `hover:` feedback. A row of bare
  words — even if each is a `<button>` — reads as a label, not a control, and
  won't get clicked.
- **Discoverability — an explicit, verb-led instruction (gate 3)** in the
  `<InfographicHeader subtitle>` (or directly above the control), e.g. *"Toggle
  to compare the states"*, *"Click a row to investigate"*, *"Drag the slider to
  feel the trade-off."* This is a **baseline**, not a Constructive upgrade —
  every widget needs one. The *upgrade* is to frame that same instruction as a
  guess ("Which state reveals the spike? Guess, then toggle.").

```tsx
// Visible button group: bordered pill, selected = brand fill, ≥32px targets.
<div role="group" aria-label="Time window"
     className="flex gap-1 rounded-full border border-ash bg-canvas p-1">
  {WINDOWS.map((w) => (
    <button key={w} aria-pressed={win === w} onClick={() => setWin(w)}
      className={`focus-ring min-h-[32px] rounded-full px-3 py-1 text-xs font-bold transition-colors ${
        win === w ? "bg-brand text-ink" : "text-ink-soft hover:text-ink"}`}>
      {w}
    </button>
  ))}
</div>
```

---

## Pattern 1 — Toggle-compare  (Active)

**Concept shape:** a comparison between discrete states — time windows, modes,
before/after. **Reference:** `MetricsDashboard` (1h/24h/7d tiles + sparklines).
The 24h error-rate tile flips red to teach "a metric going wrong".

**State shape:** one union-typed value drives everything.
```tsx
"use client";
import { useState } from "react";

type Window = "1h" | "24h" | "7d";

const DATA = {
  latency: { label: "Latency", unit: "s", data: { "1h": 1.2, "24h": 1.4, "7d": 1.8 } },
  // …spend, errors…
} as const;
const WINDOWS: readonly Window[] = ["1h", "24h", "7d"];

export function MetricsDashboard() {
  const [win, setWin] = useState<Window>("24h"); // default to the *teaching* state
  // …render tiles from DATA[*].data[win]…
}
```
**The toggle** is a real, visibly-clickable button group with `aria-pressed`
(bordered pill, selected = brand fill, ≥32px targets — see affordance above):
```tsx
<div role="group" aria-label="Time window"
     className="flex gap-1 rounded-full border border-ash bg-canvas p-1">
  {WINDOWS.map((w) => (
    <button key={w} aria-pressed={win === w} onClick={() => setWin(w)}
      className={`focus-ring min-h-[32px] rounded-full px-3 py-1 text-xs font-bold transition-colors ${
        win === w ? "bg-brand text-ink" : "text-ink-soft hover:text-ink"}`}>
      {w}
    </button>
  ))}
</div>
```
**Baseline (discoverability):** the header subtitle already tells the learner to
toggle (e.g. *"Toggle the time window and watch the readings change"*). **Upgrade
to Constructive:** frame that as a guess — *"Which window will reveal a spike?
Pick, then toggle to check."* The learner commits, then the toggle confirms or
refutes.

---

## Pattern 2 — Click-to-elaborate  (Active)

**Concept shape:** a whole made of parts worth inspecting one at a time — a
request pipeline, a stack, a sequence. **Reference:** `TraceWaterfall` (5 steps;
click a step → detail panel shows duration/cost/share; the longest bar is the
bottleneck).

**State shape:** a selected index; data is a readonly array.
```tsx
const STEPS = [
  { name: "User question", ms: 5, cost: "$0.000" },
  { name: "Search knowledge base", ms: 80, cost: "$0.000" },
  { name: "LLM call", ms: 920, cost: "$0.040" }, // the bottleneck
  // …lookup, final answer…
] as const;

export function TraceWaterfall() {
  const [selected, setSelected] = useState(2); // index
  const step = STEPS[selected]!;
  // bar width ∝ ms / max(ms); detail panel reads step.{ms,cost}
}
```
Each row is a `<button aria-pressed={i === selected}>`; bar width is inline
`style={{ width: \`${pct}%\` }}`. One accent fills the bottleneck bar; others
use a neutral (`var(--color-ink-faint)`) — length carries the meaning, not colour.

**Baseline (discoverability):** a subtitle like *"Click a step to inspect it"*
tells the learner the rows are clickable — and rows must look clickable, too (a
selected row gets `border-brand bg-brand-wash`). **Upgrade to Constructive:**
default the selection to a *quick* step (not the bottleneck) and prompt: *"Which
step is the bottleneck? Click each to find out."* The learner discovers the
longest bar rather than being shown it.

---

## Pattern 3 — Drag-to-tune  (Active→Constructive)

**Concept shape:** a trade-off you can *feel* by moving one knob — sensitivity
vs specificity, threshold vs alarms, cost vs quality. **Reference:**
`AlertThresholdTuner` (drag the threshold; live "false alarms" / "problems
missed" counters; a verdict line: too sensitive / too loose / just right).

**State shape:** one number from a range input; derived counters.
```tsx
const POINTS = [/* 15 normal + 5 real-problem values */] as const;
const PROBLEM_START = 15;

export function AlertThresholdTuner() {
  const [threshold, setThreshold] = useState(0.35);
  const falseAlarms = POINTS.slice(0, PROBLEM_START).filter((v) => v > threshold).length;
  const missed = POINTS.slice(PROBLEM_START).filter((v) => v <= threshold).length;
  const verdict = /* …0/0 → "Just right", etc.… */;
}
```
The control is a labelled `<input type="range">`; the chart is inline SVG
(brand line, one semantic-red problem band, ink dashed threshold line). Style
the native thumb with `accent-brand`.

**Baseline (discoverability):** a subtitle like *"Drag the threshold and watch
the trade-off"* tells the learner the slider is there to move. **Upgrade to
Constructive:** frame it as a guess — *"Where would you set it to catch the fire
with few false alarms? Drag to test your guess."* The learner commits a mental
answer first, then the drag tests it.

---

## Pattern 4 — Evidence matrix (Constructive)

**Concept shape:** multiple signals support competing explanations; the learner
must distinguish observation from conclusion. **Story beat:** CER *Diagnose* +
*Claim/Evidence/Reasoning*; also PIC *Observe* when the case is diagnostic.
**Starter:** `../assets/evidence-decision-template.tsx` (`mode="matrix"`).

**Interaction:** 3–5 compact evidence cards + 2–3 claims. Prompt: *“Which claim
is supported strongly enough to investigate first?”* Selecting a claim
highlights supporting / weakening evidence and shows feedback.

**State shape:**
```tsx
type ClaimId = "model" | "retrieval" | "traffic";

const EVIDENCE = [
  { id: "eval", label: "Eval score", value: "↓ 12%", supports: ["model", "retrieval"] },
  { id: "empty", label: "Retrieval empty", value: "↑ 28%", supports: ["retrieval"], anomaly: true },
  { id: "latency", label: "p95 latency", value: "+40%", supports: ["traffic", "model"] },
  { id: "prompt", label: "Prompt version", value: "v3 → v4", supports: ["model"] },
] as const;

const CLAIMS = [
  { id: "model", label: "Model/prompt regression" },
  { id: "retrieval", label: "Retrieval / index issue" },
  { id: "traffic", label: "Traffic mix shift" },
] as const;

const [claim, setClaim] = useState<ClaimId | null>(null);
// Highlight: evidence where supports.includes(claim)
// Feedback map keyed by ClaimId → { body, nextInvestigation }
```

**BEFORE → AFTER:** BEFORE = all cards neutral (tempting to blame the model from
latency alone). AFTER = selected claim accents only relevant cards; anomaly card
may use semantic bad; feedback names what remains uncertain.

**Feedback contract:** tempting correlation → weakening evidence → next slice.
Example: “Latency rose after the release, but failures cluster where retrieval
is empty. Inspect index freshness before rolling back the model.”

**Design limits:** ≤5 evidence cards, ≤3 claims. Neutrals + one brand accent for
selection; semantic bad only for a real anomaly. Not a full dashboard recreation.
Minimal chrome on expert lessons.

**Upgrade path:** already Constructive (claim generation). Optional: force a
written one-line reason choice (“because empty-retrieval clusters”) before
revealing feedback.

---

## Pattern 5 — Decision gate (Constructive)

**Concept shape:** a release or incident decision has trade-offs and needs a
justified next action. **Story beat:** CER *What/So-What/Now-What*; PIC
*Transfer*. **Starter:** `../assets/evidence-decision-template.tsx`
(`mode="decision"`).

**Interaction:** bounded scenario + 3–4 actions (*ship*, *canary*,
*pause/rollback*, *investigate*). Learner selects an action and one reason;
reveal explains user impact, evidence threshold, and next runbook step.

**State shape:**
```tsx
type ActionId = "ship" | "canary" | "rollback" | "investigate";

const ACTIONS = [
  { id: "ship", label: "Ship to 100%" },
  { id: "canary", label: "Hold canary / expand slowly" },
  { id: "rollback", label: "Rollback release" },
  { id: "investigate", label: "Investigate before changing traffic" },
] as const;

const REASONS = [
  { id: "slo", label: "Error budget still healthy" },
  { id: "safety", label: "Safety / grounding risk unclear" },
  { id: "evidence", label: "Evidence points at retrieval, not model" },
] as const;

const [action, setAction] = useState<ActionId | null>(null);
const [reason, setReason] = useState<string | null>(null);
// On both set: show feedback[action][reason] or a small lookup table
```

**BEFORE → AFTER:** BEFORE = scenario strip + muted actions. AFTER = chosen
action filled brand; feedback panel states impact + *missing evidence that
would change the call*. Expert optional: cohort toggle that flips the defensible
action (counter-example beat).

**Feedback contract:** distinguish defensible from universally correct. State
what evidence would change the decision. Never a branching adventure game.

**Design limits:** one decision, one evidence set, one next action. Output is a
reasoned decision, not exhaustive exploration.

---

## Pattern 6 — Continuous playground  (v6 — the default for knobs, Active→Constructive)

**Concept shape:** "what happens as X changes" — a tunable parameter or a
toggleable state whose *trade-off must be felt*: learning rate (converge /
overshoot / diverge), threshold (alarm / miss), RAG on/off (hallucination /
citations), guardrails on/off. **Reference:** `GradientDescent` (drag η on a
quadratic-bowl valley; the path updates every frame of the drag).

**The rule (§6):** when the concept has a knob, the control is *continuous* —
the consequence renders live on every intermediate position. Presets may sit
on top as quick-jump chips (they serve beginners); a preset-only row where a
knob begs to be dragged is v5 style.

**Build from the shared primitives** — never hand-roll:
```tsx
"use client";
import { SliderControl, ToggleGroup } from "./controls";

// A knob: label + range + live readout + preset chips
<SliderControl
  label="Learning rate (step size)"
  value={lr} min={0.02} max={1.2} step={0.02}
  onChange={setLr}
  format={(v) => `η = ${v.toFixed(2)}`}
  presets={[{ label: "Too small", value: 0.05 }, { label: "Just right", value: 0.3 }, { label: "Too big", value: 1.1 }]}
/>

// A two-state world: the ENTIRE visual state flips, not just a number
<ToggleGroup
  label="RAG"
  value={rag} onChange={setRag}
  options={[{ value: "off", label: "Off" }, { value: "on", label: "On" }]}
/>
```

**State shape:** one number (or boolean) from the control; everything else is
derived synchronously — the path, the counters, the verdict. Deterministic and
cheap (a quadratic bowl, a precomputed curve), never a backend call per drag.

**Verdict line:** continuous playgrounds earn a live one-line verdict that
names the *trade-off state* ("Too big — each step leaps past the valley floor"
/ "Just right — steady steps downhill"), because the learner will drag to the
extremes on purpose. The extremes must be *informative*, not broken (clamp the
path length; show divergence as a flatten/oscillate, not NaN).

**Baseline (discoverability):** a subtitle like *"Drag the step size and watch
the descent change"* or *"Flip RAG on and watch the answer change"*. **Upgrade
to Constructive:** frame the drag as a test of a guess — *"Where does the step
size stop helping? Guess, then drag to check."*

**Design limits:** ONE knob per playground (two max, and only if the concept
is genuinely two-dimensional); everything else stays still while it moves.
The knob is the through-line object's steering wheel, not a new dashboard.

---

## The core Constructive pattern: the scenario commit

You don't need a widget to be Constructive. The 2 closing scenario MCQs
(§0.1) are the Constructive floor: the learner commits a decision inside a
concrete situation before the explanation resolves it. When a lesson has a
widget, align the scenario questions with the widget's concept (e.g. the
threshold lesson's scenario is a smoke alarm crying wolf). Two layers of the
same idea — the cheapest, highest-leverage move in this skill.

## Diagnostic feedback and learning evidence

Every interactive pattern needs the four-part loop:

1. **Commit:** the learner predicts, selects a claim, or makes a decision.
2. **Reveal:** the visual exposes the relevant state or evidence.
3. **Explain:** feedback names the misconception or correct reasoning and ties
   it to the evidence.
4. **Transfer:** a question or prompt asks for a decision in a nearby case.

For future analytics, the design may specify only privacy-safe event categories:
prediction/choice, meaningful state change, submitted conclusion, and
misconception category. Never make raw prompts, model outputs, secrets, or
free-text learner content a default lesson-analytics payload. Do not optimise
for control clicks or time spent; completion evidence and delayed retrieval are
the useful signals.

## Accessibility (non-negotiable, all patterns)

- **Real controls, not `div`s.** Toggles and steps are `<button>`; tuners are
  `<input type="range">`. Keyboard- and screen-reader-reachable by default.
- **State, not motion, carries meaning.** A concept reachable only via animation
  is broken. Widgets change data; reduced-motion users see the same data.
- **Labels.** `aria-label` on single controls; `role="group" aria-label="…"` on a
  button set; `aria-pressed` on toggles; a chart gets `role="img"
  aria-label="…"`.
- **Theme-safe.** One accent per scene; semantic red only for the anomaly/
  failure; tokens (`bg-surface-elevated`, `text-ink`, `bg-brand-wash`), never
  `bg-white`/`text-white`/literal hex. Verify in **both** themes.
- **Mobile.** Test at 375px — no horizontal scroll. Bars/sparklines use
  `preserveAspectRatio` / responsive widths; panels stack vertically on mobile.

## When NOT to build a widget

- The concept is a definition or a single relationship → a passive
  scroll-reveal infographic + the 2 closing scenario MCQs is enough (and
  better).
- Toggling / clicking / dragging wouldn't reveal anything a static scene
  couldn't → the control is unearned; stay passive (gate 1, restraint).
- You can't name the concept the interaction teaches → it's a seductive detail.
- The audience is **beginner** and the interaction would be open-ended →
  constrain to 2–3 presets with worked data, or stay passive.

## Verification (per SKILL §7 Step 5)

- [ ] `npm run typecheck` passes (the `"use client"` boundary compiles).
- [ ] A passive reveal wouldn't teach the same thing — the control earned its
      place (gate 1, restraint).
- [ ] The widget sits on the **mapped story beat** (not after the takeaway);
      BEFORE → ACT → AFTER is visible in the picture.
- [ ] Every control is keyboard-reachable; Tab to it, activate with Enter/Space
      or arrow keys.
- [ ] Every control **looks** clickable (visible chrome + clear selected state)
      and carries a verb-led instruction the learner can't miss (gates 2 + 3,
      affordance + discoverability).
- [ ] DevTools → Rendering → "Emulate prefers-reduced-motion: reduce" → the
      widget still communicates everything (state, not motion).
- [ ] **Mobile (375px):** no horizontal scrollbar; panels stack; text doesn't
      overflow.
- [ ] At least one beat is Constructive (predict-then-reveal, claim select, or
      decision); the interaction teaches a named concept aligned with transfer.
- [ ] The feedback addresses a named misconception, points to evidence, and
      recommends one next investigation; the transfer task requires a decision
      or explanation.
- [ ] Story rubric pass (`visual-interactive-storytelling.md` §8) — not an
      animated glossary.
- [ ] The measurement plan, if implemented, captures only learning-relevant,
      privacy-safe event categories.
