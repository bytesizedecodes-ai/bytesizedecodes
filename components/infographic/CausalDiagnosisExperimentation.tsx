"use client";

import { useState } from "react";
import { Infographic, InfographicHeader, Card, Takeaway } from "./primitives";
import { Reveal } from "./motion";

/**
 * AI Observability: Reliability — Lesson 11: "Causal diagnosis and experimentation".
 *
 * Toggle-compare (CER counter-example): the same regression read as naive
 * correlation vs as a controlled experiment. Correlation fingers the wrong cause;
 * feature flags, canaries, shadow traffic, and holdouts establish it.
 * Reduced-motion-safe.
 */
type Mode = "naive" | "controlled";

const MODES: readonly { id: Mode; label: string }[] = [
  { id: "naive", label: "Naive correlation" },
  { id: "controlled", label: "Controlled experiment" },
];

const VIEW: Record<Mode, { verdict: string; tone: "bad" | "brand"; lines: string[] }> = {
  naive: {
    verdict: "Blamed the model — it was innocent",
    tone: "bad",
    lines: [
      "Quality dropped the same week a new model came out, so you roll it back.",
      "But the real cause was a retrieval index rebuild shipped the same day.",
      "Correlation gave you a suspect; acting on it fixed nothing and cost a week.",
    ],
  },
  controlled: {
    verdict: "Isolated the true cause",
    tone: "brand",
    lines: [
      "Feature-flag the candidate; hold traffic constant; shadow or canary 5%.",
      "Compare the flag-on vs flag-off cohort on the same metric with a holdout.",
      "The retrieval rebuild — not the model — shows up as the cause. Roll that back.",
    ],
  },
};

export function CausalDiagnosisExperimentation() {
  const [mode, setMode] = useState<Mode>("naive");
  const v = VIEW[mode];
  const bad = v.tone === "bad";

  return (
    <Infographic>
      <InfographicHeader
        title="Causal diagnosis and experimentation"
        subtitle="Toggle between guessing from correlation and running a controlled test."
      />
      <Reveal>
        <div className="rounded-2xl border border-ash bg-surface-elevated px-4 py-4 shadow-sm sm:px-6 sm:py-5">
          <div role="group" aria-label="Method" className="mx-auto mb-4 flex w-fit gap-1 rounded-full border border-ash bg-canvas p-1">
            {MODES.map((m) => (
              <button key={m.id} type="button" onClick={() => setMode(m.id)} aria-pressed={mode === m.id}
                className={`focus-ring min-h-[32px] rounded-full px-3 py-1 text-xs font-bold transition-colors ${mode === m.id ? "bg-brand text-ink" : "text-ink-soft hover:text-ink"}`}>
                {m.label}
              </button>
            ))}
          </div>
          <div className={`mx-auto mb-4 max-w-sm rounded-xl border px-4 py-2.5 text-center ${bad ? "border-[var(--color-bad)] bg-[var(--color-bad-wash)]" : "border-brand bg-brand-wash"}`}>
            <span className={`text-sm font-bold ${bad ? "text-[var(--color-bad)]" : "text-brand"}`}>{v.verdict}</span>
          </div>
          <ul className="mx-auto max-w-md space-y-1.5">
            {v.lines.map((l) => (
              <li key={l} className="relative pl-5 text-xs font-medium text-ink">
                <span aria-hidden="true" className={`absolute left-0 top-[0.15em] ${bad ? "text-[var(--color-bad)]" : "text-brand"}`}>{bad ? "✕" : "✓"}</span>
                {l}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
      <Card tone="brand" rotate={0}>
        <Takeaway>
          Correlation gives suspects; experiments give causes. Feature-flag,
          canary, shadow, and holdout before you act on a regression.
        </Takeaway>
      </Card>
    </Infographic>
  );
}
