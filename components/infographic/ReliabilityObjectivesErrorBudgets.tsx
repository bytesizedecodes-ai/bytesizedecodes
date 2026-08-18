"use client";

import { useState } from "react";
import { Infographic, InfographicHeader, Card, Takeaway } from "./primitives";
import { Reveal } from "./motion";

/**
 * AI Observability: Reliability — Lesson 13: "Reliability objectives and error budgets".
 *
 * Toggle-compare (CER): an AI feature has several SLOs that conflict — optimise
 * one and another moves. The lesson: hold a portfolio, resolve conflicts with
 * explicit gates, and never trade the safety SLO. Reduced-motion-safe.
 */
type Mode = "cost" | "quality";

const MODES: readonly { id: Mode; label: string }[] = [
  { id: "cost", label: "Optimise for cost" },
  { id: "quality", label: "Optimise for quality" },
];

const METRICS: { k: string; cost: string; quality: string; badWhen: "cost" | "quality" }[] = [
  { k: "Cost / day", cost: "$12 ↓", quality: "$210 ↑", badWhen: "quality" },
  { k: "Faithfulness", cost: "78% ↓", quality: "96% ↑", badWhen: "cost" },
  { k: "p95 latency", cost: "1.1s ↓", quality: "3.2s ↑", badWhen: "quality" },
  { k: "Safety (refusals)", cost: "gate ✓", quality: "gate ✓", badWhen: "cost" },
];

export function ReliabilityObjectivesErrorBudgets() {
  const [mode, setMode] = useState<Mode>("cost");

  return (
    <Infographic>
      <InfographicHeader
        title="Reliability objectives and error budgets"
        subtitle="Toggle the optimisation target. Watch the other SLOs move."
      />
      <Reveal>
        <div className="rounded-2xl border border-ash bg-surface-elevated px-4 py-4 shadow-sm sm:px-6 sm:py-5">
          <div role="group" aria-label="Optimisation target" className="mx-auto mb-4 flex w-fit gap-1 rounded-full border border-ash bg-canvas p-1">
            {MODES.map((m) => (
              <button key={m.id} type="button" onClick={() => setMode(m.id)} aria-pressed={mode === m.id}
                className={`focus-ring min-h-[32px] rounded-full px-3 py-1 text-xs font-bold transition-colors ${mode === m.id ? "bg-brand text-ink" : "text-ink-soft hover:text-ink"}`}>
                {m.label}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-1.5">
            {METRICS.map((m) => {
              const val = mode === "cost" ? m.cost : m.quality;
              const bad = m.badWhen === mode && !val.includes("gate");
              return (
                <div key={m.k} className={`flex items-center justify-between rounded-lg border px-3 py-1.5 ${m.k.startsWith("Safety") ? "border-brand bg-brand-wash" : bad ? "border-[var(--color-bad)] bg-[var(--color-bad-wash)]" : "border-ash bg-canvas"}`}>
                  <span className="text-xs font-semibold text-ink">{m.k}</span>
                  <span className={`font-mono text-[11px] font-bold ${m.k.startsWith("Safety") ? "text-brand" : bad ? "text-[var(--color-bad)]" : "text-ink"}`}>{val}</span>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-center text-xs font-medium text-ink-soft">
            SLOs trade off. <span className="font-bold text-ink">Safety is a gate, not a budget</span> — the others get explicit targets you resolve at release time.
          </p>
        </div>
      </Reveal>
      <Card tone="brand" rotate={0}>
        <Takeaway>
          Hold a portfolio of SLOs — availability, latency, quality, cost — and a
          non-negotiable safety gate. Error budgets resolve the conflicts so you
          ship on purpose.
        </Takeaway>
      </Card>
    </Infographic>
  );
}
