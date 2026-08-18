"use client";

import { useState } from "react";
import { Infographic, InfographicHeader, Card, Takeaway } from "./primitives";
import { Reveal } from "./motion";

/**
 * LLM Observability — Lesson 12: "Build the operator dashboard".
 *
 * Toggle-compare (PIC): the same system seen by an exec (three big numbers —
 * are we healthy?) vs an on-call engineer (drill-downs — what's broken?).
 * Executive reporting is not diagnosis; they need different dashboards.
 * Reduced-motion-safe.
 */
type Mode = "exec" | "oncall";

const MODES: readonly { id: Mode; label: string }[] = [
  { id: "exec", label: "Exec view" },
  { id: "oncall", label: "On-call view" },
];

export function OperatorDashboard() {
  const [mode, setMode] = useState<Mode>("exec");
  const exec = mode === "exec";

  return (
    <Infographic>
      <InfographicHeader
        title="Build the operator dashboard"
        subtitle="Toggle between the exec view and the on-call view of the same system."
      />

      <Reveal>
        <div className="rounded-2xl border border-ash bg-surface-elevated px-4 py-4 shadow-sm sm:px-6 sm:py-5">
          <div
            role="group"
            aria-label="Dashboard audience"
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

          {exec ? (
            <div className="grid grid-cols-3 gap-2">
              {[
                { l: "Quality", v: "96%", ok: true },
                { l: "Cost / day", v: "$48", ok: true },
                { l: "Incidents", v: "0", ok: true },
              ].map((t) => (
                <div key={t.l} className="rounded-xl border border-ash bg-canvas px-2 py-3 text-center">
                  <div className="text-xl font-bold text-brand">{t.v}</div>
                  <div className="text-[9px] font-bold uppercase tracking-wide text-ink-soft">{t.l}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {[
                { l: "p99 latency by route", v: "ask-refund 2.1s ↑" },
                { l: "faithfulness by cohort", v: "us-east iOS 78% ↓" },
                { l: "error-budget burn (1h)", v: "9% — trending up" },
                { l: "latest failing traces", v: "3 × billing 502" },
              ].map((t) => (
                <div key={t.l} className="flex items-center justify-between rounded-lg border border-ash bg-canvas px-3 py-1.5">
                  <span className="text-xs font-semibold text-ink">{t.l}</span>
                  <span className="font-mono text-[11px] font-bold text-[var(--color-bad)]">{t.v}</span>
                </div>
              ))}
            </div>
          )}

          <p className="mt-3 text-center text-xs font-medium text-ink-soft">
            {exec ? (
              <>One glance answers &ldquo;are we healthy?&rdquo; — and nothing more. It hides the detail you'd act on.</>
            ) : (
              <>Drill-downs answer &ldquo;what's broken, where, since when?&rdquo; — the view you debug from.</>
            )}
          </p>
        </div>
      </Reveal>

      <Card tone="brand" rotate={0}>
        <Takeaway>
          Give execs three calm numbers and on-call a path to the trace — one
          dashboard can't serve both audiences well.
        </Takeaway>
      </Card>
    </Infographic>
  );
}
