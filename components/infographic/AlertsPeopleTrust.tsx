"use client";

import { useState } from "react";
import { Infographic, InfographicHeader, Card, Takeaway } from "./primitives";
import { Reveal } from "./motion";

/**
 * LLM Observability — Lesson 10: "Alerts people trust".
 *
 * Toggle-compare (PIC): a static threshold vs a multi-window burn-rate alert on
 * the same noisy signal. Static cries wolf at night (low traffic spikes the
 * rate) and misses real sustained impact; burn-rate tolerates blips and pages
 * on sustained user impact. Reduced-motion-safe.
 */
type Mode = "static" | "burn";

const MODES: readonly { id: Mode; label: string }[] = [
  { id: "static", label: "Static threshold" },
  { id: "burn", label: "Burn-rate" },
];

const VIEW: Record<Mode, { verdict: string; tone: "bad" | "brand"; lines: string[] }> = {
  static: {
    verdict: "On-call has muted this alert",
    tone: "bad",
    lines: [
      "Pages on any 5-min spike — including the nightly low-traffic blip.",
      "12 pages overnight, 0 real incidents — alert fatigue sets in fast.",
      "Missed the 40-min sustained degradation at 3pm (it sat just under the line).",
    ],
  },
  burn: {
    verdict: "On-call trusts this alert",
    tone: "brand",
    lines: [
      "Pages only when the error budget burns fast across two windows.",
      "Ignores the nightly blip — it doesn't burn enough budget.",
      "Caught the 3pm degradation inside 10 minutes of real user impact.",
    ],
  },
};

export function AlertsPeopleTrust() {
  const [mode, setMode] = useState<Mode>("static");
  const v = VIEW[mode];
  const bad = v.tone === "bad";

  return (
    <Infographic>
      <InfographicHeader
        title="Alerts people trust"
        subtitle="Toggle between a static threshold and a burn-rate alert on the same signal."
      />

      <Reveal>
        <div className="rounded-2xl border border-ash bg-surface-elevated px-4 py-4 shadow-sm sm:px-6 sm:py-5">
          <div
            role="group"
            aria-label="Alert strategy"
            className="mx-auto mb-4 flex w-fit gap-1 rounded-full border border-ash bg-canvas p-1"
          >
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMode(m.id)}
                aria-pressed={mode === m.id}
                className={`focus-ring min-h-[32px] rounded-full px-3 py-1 text-xs font-bold transition-colors ${
                  mode === m.id ? "bg-brand text-ink" : "text-ink-soft hover:text-ink"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div
            className={`mx-auto mb-4 max-w-sm rounded-xl border px-4 py-2.5 text-center ${
              bad ? "border-[var(--color-bad)] bg-[var(--color-bad-wash)]" : "border-brand bg-brand-wash"
            }`}
          >
            <span className={`text-sm font-bold ${bad ? "text-[var(--color-bad)]" : "text-brand"}`}>{v.verdict}</span>
          </div>

          <ul className="mx-auto max-w-md space-y-1.5">
            {v.lines.map((l) => (
              <li key={l} className="relative pl-5 text-xs font-medium text-ink">
                <span aria-hidden="true" className={`absolute left-0 top-[0.15em] ${bad ? "text-[var(--color-bad)]" : "text-brand"}`}>
                  {bad ? "✕" : "✓"}
                </span>
                {l}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      <Card tone="brand" rotate={0}>
        <Takeaway>
          An alert people trust pages on sustained user impact, not on noise —
          burn-rate over a static line, with a runbook attached.
        </Takeaway>
      </Card>
    </Infographic>
  );
}
