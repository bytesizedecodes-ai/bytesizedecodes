"use client";

import { useState } from "react";
import { Infographic, InfographicHeader, Card, Takeaway } from "./primitives";
import { Reveal } from "./motion";

/**
 * AI Observability: Reliability — Lesson 10: "Detecting drift and regressions".
 *
 * Drag-to-tune (CER): drag weeks since launch and watch input drift (PSI),
 * output faithfulness, and retrieval drift move; PSI crosses the alert line
 * even while the mean still looks okay. Distribution-shift visualiser.
 * Reduced-motion-safe.
 */
export function DetectingDriftRegressions() {
  // weeks 0..12
  const [weeks, setWeeks] = useState(0);
  const t = weeks / 12;
  const psi = +(0.05 + t * 0.32).toFixed(2); // input drift
  const faith = Math.round(96 - t * 15); // output faithfulness %
  const retr = +(0.02 + t * 0.2).toFixed(2); // retrieval drift
  const drift = psi > 0.2;
  const Row = ({ label, value, bad, threshold }: { label: string; value: string; bad: boolean; threshold?: string }) => (
    <div className={`flex items-center justify-between rounded-lg border px-3 py-1.5 ${bad ? "border-[var(--color-bad)] bg-[var(--color-bad-wash)]" : "border-ash bg-canvas"}`}>
      <span className="text-xs font-semibold text-ink">{label}</span>
      <span className={`font-mono text-[11px] font-bold ${bad ? "text-[var(--color-bad)]" : "text-ink"}`}>{value}{threshold ? ` (${threshold})` : ""}</span>
    </div>
  );

  return (
    <Infographic>
      <InfographicHeader
        title="Detecting drift and regressions"
        subtitle="Drag weeks since launch. Watch the signals move — and cross the line."
      />
      <Reveal>
        <div className="rounded-2xl border border-ash bg-surface-elevated px-4 py-4 shadow-sm sm:px-6 sm:py-5">
          <label className="block">
            <span className="mb-1 flex items-center justify-between text-[11px] font-bold uppercase tracking-wide text-ink-soft">
              <span>weeks since launch</span>
              <span className="font-mono text-brand">week {weeks}</span>
            </span>
            <input type="range" min={0} max={12} step={1} value={weeks}
              onChange={(e) => setWeeks(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-ash accent-brand" aria-label="Weeks since launch" />
          </label>
          <div className="mt-4 flex flex-col gap-1.5">
            <Row label="Input drift (PSI)" value={String(psi)} bad={drift} threshold="alert > 0.20" />
            <Row label="Output faithfulness" value={`${faith}%`} bad={faith < 88} threshold="alert < 88%" />
            <Row label="Retrieval drift" value={String(retr)} bad={retr > 0.18} />
          </div>
          <p className="mt-3 text-center text-xs font-medium text-ink-soft">
            {drift ? (
              <>Input drift has <span className="font-bold text-[var(--color-bad)]">crossed the line</span> — yet the mean score barely moved. The distribution shifted first.</>
            ) : (
              <>Means lag. Drift metrics catch the slide while the average still looks fine.</>
            )}
          </p>
        </div>
      </Reveal>
      <Card tone="brand" rotate={0}>
        <Takeaway>
          Drift shows up in distributions before averages: watch input, output,
          and retrieval drift with change-point detection, not a single mean.
        </Takeaway>
      </Card>
    </Infographic>
  );
}
