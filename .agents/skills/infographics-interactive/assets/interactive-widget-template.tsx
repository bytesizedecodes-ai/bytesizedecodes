/**
 * TEMPLATE — a minimal interactive infographic widget (the "toggle-compare"
 * pattern). Copy this to components/infographic/<YourWidget>.tsx and adapt.
 *
 * This is the v3 "interactive infographic" sub-pattern: a self-contained client
 * component registered as a lesson's infographic. Local state only, illustrative
 * mock data, no backend. See references/interactivity-patterns.md for the full
 * pattern catalogue (toggle-compare, click-to-elaborate, drag-to-tune) and the
 * accessibility rules.
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
 *
 * After creating it:
 *   1. Register in components/infographic/index.tsx under the lesson's slug.
 *   2. Add the lesson to content/courses.ts.
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
        subtitle="The learner picks a state and reads how it changes"
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
                className={`focus-ring rounded-full px-3 py-1 text-xs font-bold transition-colors ${
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
/* To reach CONSTRUCTIVE (ICAP) — the highest-leverage upgrade (P8):  */
/* add a predict line above the toggle, e.g.                          */
/*   "Before you toggle: which state will be faster? Pick, then check."*/
/* The learner commits a guess, then the toggle confirms/refutes it.  */
/* ------------------------------------------------------------------ */
