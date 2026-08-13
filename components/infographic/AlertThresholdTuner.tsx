"use client";

import { useState } from "react";
import { Infographic, InfographicHeader, Card, Takeaway } from "./primitives";
import { Reveal } from "./motion";

/**
 * AI Observability — Lesson 10: "Alerts — knowing when to act".
 *
 * Interactive infographic: an alert fires when the error rate crosses a
 * threshold. The learner drags the threshold (range input) over an error-rate
 * chart and watches two counters update live:
 *   - false alarms = normal points wrongly above the threshold
 *   - missed       = real problem points below the threshold
 * Set it too low and you cry wolf; too high and you miss the fire; in between
 * is the sweet spot. Local state + illustrative data only. Brand line; the
 * problem band is the single semantic red region, consistent with the course.
 */

// 15 normal points (with two noise spikes to 0.7), then 5 real-problem points.
const POINTS = [
  0.25, 0.3, 0.2, 0.35, 0.28, 0.7, 0.3, 0.32, 0.25, 0.4, 0.3, 0.7, 0.35, 0.3, 0.28,
  1.8, 2.1, 2.4, 2.6, 2.9,
] as const;
const PROBLEM_START = 15;
const MAX_VAL = 3;

export function AlertThresholdTuner() {
  const [threshold, setThreshold] = useState(0.35);

  const normalPoints = POINTS.slice(0, PROBLEM_START);
  const problemPoints = POINTS.slice(PROBLEM_START);
  const falseAlarms = normalPoints.filter((v) => v > threshold).length;
  const missed = problemPoints.filter((v) => v <= threshold).length;

  const verdict =
    falseAlarms === 0 && missed === 0
      ? { text: "Just right — caught the problem, no false alarms.", tone: "good" as const }
      : falseAlarms > 0 && missed === 0
        ? { text: `Too sensitive — ${falseAlarms} false alarm${falseAlarms > 1 ? "s" : ""}.`, tone: "bad" as const }
        : falseAlarms === 0 && missed > 0
          ? { text: `Too loose — ${missed} problem${missed > 1 ? "s" : ""} missed.`, tone: "bad" as const }
          : { text: `${falseAlarms} false alarm${falseAlarms > 1 ? "s" : ""}, ${missed} missed.`, tone: "bad" as const };

  return (
    <Infographic>
      <InfographicHeader
        title="Alerts: knowing when to act"
        subtitle="Drag the threshold. Too low and you cry wolf; too high and you miss the fire."
      />

      <Reveal>
        <div className="rounded-2xl border border-ash bg-surface-elevated px-4 py-4 shadow-sm sm:px-6 sm:py-5">
          <ThresholdChart threshold={threshold} />

          {/* threshold slider */}
          <label className="mt-4 block">
            <span className="mb-1 flex items-center justify-between text-[11px] font-bold uppercase tracking-wide text-ink-soft">
              <span>Alert threshold</span>
              <span className="font-mono text-brand">{threshold.toFixed(2)}</span>
            </span>
            <input
              type="range"
              min={0.05}
              max={MAX_VAL - 0.05}
              step={0.05}
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-ash accent-brand"
              aria-label="Alert threshold"
            />
          </label>

          {/* counters */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Counter label="False alarms" value={falseAlarms} highlight={falseAlarms > 0} />
            <Counter label="Problems missed" value={missed} highlight={missed > 0} />
          </div>

          <p
            className={`mt-3 text-center text-xs font-bold ${
              verdict.tone === "good" ? "text-brand" : "text-[var(--color-bad)]"
            }`}
          >
            {verdict.text}
          </p>
        </div>
      </Reveal>

      <Card tone="brand" rotate={0}>
        <Takeaway>
          An alert is a threshold with a trade-off: too sensitive and you stop
          trusting it; too loose and you miss real fires. The art is the middle.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

function ThresholdChart({ threshold }: { threshold: number }) {
  const w = 280;
  const h = 110;
  const pad = 10;
  const n = POINTS.length;
  const x = (i: number) => pad + (i / (n - 1)) * (w - pad * 2);
  const y = (v: number) => h - pad - (v / MAX_VAL) * (h - pad * 2);

  const line = POINTS.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  const bandX = x(PROBLEM_START);
  const threshY = y(threshold);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img" aria-label="Error rate over time with an alert threshold">
      {/* problem band */}
      <rect x={bandX} y={pad} width={w - pad - bandX} height={h - pad * 2} fill="var(--color-bad-wash)" />
      <text x={w - pad} y={pad + 9} textAnchor="end" fontSize="9" fontWeight="bold" fill="var(--color-bad)">
        real problem
      </text>
      {/* error-rate line */}
      <polyline points={line} fill="none" stroke="var(--color-brand)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* threshold line */}
      <line x1={pad} y1={threshY} x2={w - pad} y2={threshY} stroke="var(--color-ink)" strokeWidth="1.5" strokeDasharray="4 4" />
      <text x={pad} y={threshY - 4} fontSize="9" fontWeight="bold" fill="var(--color-ink)">
        threshold
      </text>
      {/* axis labels */}
      <text x={pad} y={h - 1} fontSize="9" fill="var(--color-ink-faint)">time →</text>
    </svg>
  );
}

function Counter({ label, value, highlight }: { label: string; value: number; highlight: boolean }) {
  return (
    <div
      className={`rounded-xl border px-4 py-3 text-center ${
        highlight ? "border-[var(--color-bad)] bg-[var(--color-bad-wash)]" : "border-ash bg-canvas"
      }`}
    >
      <div className={`text-3xl font-bold ${highlight ? "text-[var(--color-bad)]" : "text-ink"}`}>
        {value}
      </div>
      <div className="text-[11px] font-bold uppercase tracking-wide text-ink-soft">{label}</div>
    </div>
  );
}
