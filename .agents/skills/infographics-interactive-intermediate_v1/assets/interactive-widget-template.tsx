/**
 * TEMPLATE — a minimal interactive infographic widget (the "toggle-compare"
 * pattern). Copy this to components/infographic/<YourWidget>.tsx and adapt.
 *
 * Part of infographics-interactive_v4. Self-contained client widget, local
 * state only, illustrative mock data, no backend. Fuse it to a story beat
 * (usually PIC Observe or beginner Tension) — see
 * references/visual-interactive-storytelling.md. Full catalogue:
 * references/interactivity-patterns.md.
 *
 * Rules baked in below:
 *  1. "use client" at the top — the legitimate reason to escalate (besides
 *     motion.tsx). See references/reveal-patterns.md for the client boundary.
 *  2. Real controls (a <button> with aria-pressed) — keyboard + screen-reader
 *     reachable by default.
 *  3. State carries meaning, not motion — reduced-motion-safe by construction.
 *  4. Theme-safe tokens only (bg-surface-elevated, text-ink, bg-brand,
 *     bg-canvas, border-ash) — never bg-white/text-white/literal hex.
 *  5. One accent (brand) per scene; semantic red only for an anomaly/failure.
 *  6. Earns its place + looks clickable — visible button chrome (the bordered
 *     pill below), a clear selected vs unselected state, ≥32px targets. If a
 *     passive reveal teaches the same thing, don't add the control (SKILL §6
 *     "three gates": restraint + affordance).
 *  7. Discoverability — a verb-led instruction in the subtitle tells the
 *     learner to use it. An invisible or unannounced control gets scrolled past.
 *  8. Feedback contract — name the likely wrong conclusion, explain it with
 *     evidence after the learner acts, then point to one next investigation.
 *     See references/lesson-contract.md before writing markup.
 *
 * After creating it:
 *   1. Register in components/infographic/index.tsx under the lesson's slug.
 *   2. Add the lesson to content/courses/.
 *   3. Verify: npm run typecheck; then dark-mode + reduced-motion + 375px checks.
 */

"use client";

import { useState } from "react";
import { Infographic, InfographicHeader, Card, Takeaway } from "../primitives";
import { Reveal } from "../motion";

/** A small union drives the whole widget. Constrain beginners to 2–3 presets. */
type Mode = "before" | "after";

const MODES: readonly Mode[] = ["before", "after"];

// Illustrative mock data — replace with your concept's values. No backend.
const READINGS: Record<Mode, { value: string; label: string }> = {
  before: { value: "1.8s", label: "Slow" },
  after: { value: "0.4s", label: "Fast" },
};

export function InteractiveWidgetTemplate() {
  const [mode, setMode] = useState<Mode>("before");

  return (
    <Infographic>
      <InfographicHeader
        title="Toggle to compare two states"
        subtitle="Toggle between the states and read how the value changes"
      />

      <Reveal>
        <div className="rounded-2xl border border-ash bg-surface-elevated px-4 py-4 shadow-sm sm:px-6 sm:py-5">
          {/* Real button group: keyboard-reachable, aria-pressed announces state. */}
          <div
            role="group"
            aria-label="Compare states"
            className="mx-auto mb-4 flex w-fit gap-1 rounded-full border border-ash bg-canvas p-1"
          >
            {MODES.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                aria-pressed={mode === m}
                className={`focus-ring min-h-[32px] rounded-full px-3 py-1 text-xs font-bold transition-colors ${
                  mode === m ? "bg-brand text-ink" : "text-ink-soft hover:text-ink"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* The reading swaps with state. State carries meaning, not motion. */}
          <div className="mx-auto max-w-xs rounded-xl border border-ash bg-canvas px-4 py-3 text-center">
            <div className="text-3xl font-bold text-ink">{READINGS[mode].value}</div>
            <div className="text-[11px] font-bold uppercase tracking-wide text-ink-soft">
              {READINGS[mode].label}
            </div>
          </div>

          {/* Replace this with feedback tied to the learner's selected state:
              explain the evidence, correct a likely misconception, and name
              one next investigation. Never use a generic “Correct!” toast. */}
          <p className="mx-auto mt-3 max-w-xs text-center text-xs font-medium text-ink-soft">
            The change is visible in this state. Next, inspect which step caused it.
          </p>
        </div>
      </Reveal>

      <Card tone="brand" rotate={0}>
        <Takeaway>
          One sentence that resolves the lesson — withheld a beat so the learner
          generates it.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

/* ------------------------------------------------------------------ */
/* The verb-led subtitle above is the discoverability BASELINE         */
/* (gate 3) — it tells the learner to use the control.                 */
/*                                                                    */
/* To reach CONSTRUCTIVE (ICAP) — the highest-leverage upgrade (P8):  */
/* frame that instruction as a guess, e.g.                            */
/*   "Before you toggle: which state will be faster? Pick, then check."*/
/* The learner commits a guess, then the toggle confirms/refutes it.  */
/* Write the lesson contract first; analytics, if later added, records */
/* only prediction/state/conclusion categories—not raw user content.   */
/* ------------------------------------------------------------------ */
