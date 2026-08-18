"use client";

import { useState } from "react";
import { Infographic, InfographicHeader, Card, Takeaway } from "./primitives";
import { Reveal } from "./motion";

/**
 * LLM Observability — Lesson 13 (capstone): "Rescue the support assistant".
 *
 * Toggle-compare: the same failing assistant before and after instrumentation.
 * Before — a vague hunch ("it's slower and worse"). After — the three signals,
 * one SLO, and one alert that turned the hunch into a diagnosis. Closes the
 * course narrative. Reduced-motion-safe.
 */
type Mode = "before" | "after";

const MODES: readonly { id: Mode; label: string }[] = [
  { id: "before", label: "Before: flying blind" },
  { id: "after", label: "After: instrumented" },
];

export function CapstoneRescueAssistant() {
  const [mode, setMode] = useState<Mode>("before");
  const after = mode === "after";

  return (
    <Infographic>
      <InfographicHeader
        title="Capstone: rescue the support assistant"
        subtitle="Toggle before and after. Observability turned a hunch into a diagnosis."
      />

      <Reveal>
        <div className="rounded-2xl border border-ash bg-surface-elevated px-4 py-4 shadow-sm sm:px-6 sm:py-5">
          <div
            role="group"
            aria-label="State"
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

          {after ? (
            <div className="flex flex-col gap-1.5">
              {[
                { l: "Signal · faithfulness", v: "78% (↓ from 96%) — real, not a vibe" },
                { l: "Signal · p95 latency", v: "2.1s on ask-refund (↑)" },
                { l: "Signal · context precision", v: "0.25 — retrieval returning junk" },
                { l: "SLO", v: "faithfulness ≥ 95% · budget 5%" },
                { l: "Alert + runbook", v: "burn-rate → cohort → trace → bisect prompt/retrieval" },
                { l: "Diagnosis", v: "release v17 changed the retriever ranker" },
              ].map((t) => (
                <div key={t.l} className="flex items-center justify-between rounded-lg border border-brand bg-brand-wash px-3 py-1.5">
                  <span className="text-xs font-semibold text-ink">{t.l}</span>
                  <span className="font-mono text-[11px] font-bold text-brand">{t.v}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-[var(--color-bad)] bg-[var(--color-bad-wash)] px-4 py-4 text-center">
              <p className="text-sm font-semibold text-[var(--color-bad)]">&ldquo;It feels slower and the answers seem worse.&rdquo;</p>
              <p className="mt-2 text-xs font-medium text-ink-soft">
                No traces. No prompt version. No quality score. Support noticed before engineering did — and nobody can say which release caused it.
              </p>
            </div>
          )}

          <p className="mt-3 text-center text-xs font-medium text-ink-soft">
            {after ? (
              <>
                The same system, now <span className="font-bold text-brand">explainable</span>: three signals, one SLO, one runbook — and a named root cause.
              </>
            ) : (
              <>A hunch with no evidence is unfixable. The next lesson stack turns it into a measured, diagnosable system.</>
            )}
          </p>
        </div>
      </Reveal>

      <Card tone="brand" rotate={0}>
        <Takeaway>
          Instrument, evaluate, and respond: traces for where, evals for what,
          and an SLO + runbook for when — that's how you rescue a feature.
        </Takeaway>
      </Card>
    </Infographic>
  );
}
