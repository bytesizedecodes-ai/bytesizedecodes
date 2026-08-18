"use client";

import { useState } from "react";
import { Infographic, InfographicHeader, Card, Takeaway } from "./primitives";
import { Reveal } from "./motion";

/**
 * AI Observability: Reliability — Lesson 3: "Sampling, cardinality, and telemetry cost".
 *
 * Toggle-compare (CER): head sampling (cheap, blind) vs tail sampling (keeps the
 * interesting traces). Plus a cardinality warning: a high-cardinality attribute
 * explodes index cost. Teaches that sampling is a debugging-fidelity decision.
 * Reduced-motion-safe.
 */
type Mode = "head" | "tail";

const MODES: readonly { id: Mode; label: string }[] = [
  { id: "head", label: "Head sampling" },
  { id: "tail", label: "Tail sampling" },
];

const VIEW: Record<Mode, { verdict: string; tone: "bad" | "brand"; lines: string[] }> = {
  head: {
    verdict: "Cheap — and blind to the traces you need",
    tone: "bad",
    lines: [
      "Drops 99% of traces at the source, before you know which mattered.",
      "The rare erroring trace is usually dropped — you pay storage but lose the evidence.",
      "Fine for raw volume; useless for root-causing a regression.",
    ],
  },
  tail: {
    verdict: "Keeps every trace that matters",
    tone: "brand",
    lines: [
      "Evaluates the full trace at the collector, then keeps errors, slow, and policy-violating ones.",
      "You store ~1% of traces but 100% of the interesting ones — exemplar debugging.",
      "Cost scales with value kept, not traffic seen.",
    ],
  },
};

export function SamplingCardinalityCost() {
  const [mode, setMode] = useState<Mode>("head");
  const v = VIEW[mode];
  const bad = v.tone === "bad";

  return (
    <Infographic>
      <InfographicHeader
        title="Sampling, cardinality, and telemetry cost"
        subtitle="Toggle head vs tail sampling. What do you keep, and at what cost?"
      />
      <Reveal>
        <div className="rounded-2xl border border-ash bg-surface-elevated px-4 py-4 shadow-sm sm:px-6 sm:py-5">
          <div role="group" aria-label="Sampling strategy" className="mx-auto mb-4 flex w-fit gap-1 rounded-full border border-ash bg-canvas p-1">
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
          <p className="mt-4 rounded-lg border border-ash bg-canvas px-3 py-2 text-center text-[11px] font-medium text-ink-soft">
            Separate concern: <span className="font-bold text-ink">cardinality</span>. A unique attribute per request (raw timestamp, full session id) explodes index cost — cap your dimensionality budget.
          </p>
        </div>
      </Reveal>
      <Card tone="brand" rotate={0}>
        <Takeaway>
          Sample for fidelity (tail, keep the interesting traces), not just
          volume (head); and cap cardinality before it caps your bill.
        </Takeaway>
      </Card>
    </Infographic>
  );
}
