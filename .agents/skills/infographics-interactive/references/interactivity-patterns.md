# Interactivity patterns (v3)

The concrete recipes for the three interactive-widget patterns referenced from
`../SKILL.md` §6. Each pattern is a small, self-contained **`"use client"`
component registered as a lesson's infographic** — local state only, illustrative
data, no backend. The three reference implementations ship in the AI
Observability course (`components/infographic/MetricsDashboard.tsx`,
`TraceWaterfall.tsx`, `AlertThresholdTuner.tsx`); read them alongside this file.

The **one rule** (§6): every widget is *guided, task-anchored, predict-eliciting,
expertise-adaptive, and never decorative*. If you can't name the concept it
teaches, cut it.

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
**The toggle** is a real button group with `aria-pressed`:
```tsx
<div role="group" aria-label="Time window" className="flex gap-1 rounded-full border border-ash bg-canvas p-1">
  {WINDOWS.map((w) => (
    <button key={w} aria-pressed={win === w} onClick={() => setWin(w)}
      className={`rounded-full px-3 py-1 text-xs font-bold ${win === w ? "bg-brand text-ink" : "text-ink-soft"}`}>
      {w}
    </button>
  ))}
</div>
```
**Upgrade to Constructive:** add a predict line above the toggle — *"Which window
will reveal a spike? Pick, then toggle to check."* The learner commits, then the
toggle confirms/refutes.

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

**Upgrade to Constructive:** default the selection to a *quick* step (not the
bottleneck) and prompt: *"Which step is the bottleneck? Click each to find out."*
The learner discovers the longest bar rather than being shown it.

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

**Upgrade to Constructive:** prompt above the slider — *"Where would you set it
to catch the fire with few false alarms? Drag to test your guess."* The learner
commits a mental answer first, then the drag tests it.

---

## The core Constructive pattern: predict-then-reveal

You don't need a widget to be Constructive. The platform's `PredictionCard`
already runs a predict-then-reveal MCQ *before* every infographic. When a lesson
has a widget, align the prediction with the widget's concept (e.g. the threshold
lesson's prediction is about a smoke alarm crying wolf). Two layers of the same
idea — the cheapest, highest-leverage move in this skill.

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
  scroll-reveal infographic + a prediction MCQ is enough (and better).
- You can't name the concept the interaction teaches → it's a seductive detail.
- The audience is **beginner** and the interaction would be open-ended →
  constrain to 2–3 presets with worked data, or stay passive.

## Verification (per SKILL §7 Step 5)

- [ ] `npm run typecheck` passes (the `"use client"` boundary compiles).
- [ ] Every control is keyboard-reachable; Tab to it, activate with Enter/Space
      or arrow keys.
- [ ] DevTools → Rendering → "Emulate prefers-reduced-motion: reduce" → the
      widget still communicates everything (state, not motion).
- [ ] **Dark mode:** every tile, bar, chart line, and label is legible.
- [ ] **Mobile (375px):** no horizontal scrollbar; panels stack; text doesn't
      overflow.
- [ ] At least one beat is Constructive (predict-then-reveal or task-framed
      discovery); the interaction teaches a named concept.
