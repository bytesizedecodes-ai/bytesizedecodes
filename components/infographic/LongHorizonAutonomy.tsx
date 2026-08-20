import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "./primitives";
import { Scene } from "./scenes";
import { Reveal } from "./motion";

/**
 * Harness Engineering: At Scale — Lesson 2: "Long-Horizon Autonomy".
 *
 * Course case: Relay's quarterly merchant report — ~200 steps across hours.
 * Two expert beats: the error-compounding curve (per-step reliability^n —
 * why naive agents fail long tasks) and the checkpoint/recovery timeline
 * (resume from checkpoint 4, not step 0). SVG carries the compounding math;
 * compact, brand accent only.
 */
export function LongHorizonAutonomy() {
  return (
    <Infographic>
      <InfographicHeader
        title="Two hundred steps is a different engineering problem"
        subtitle="Relay's quarterly merchant report: hours of autonomous work that must survive its own failures."
      />

      {/* Beat 1 — the compounding curve */}
      <Scene caption="① Why long tasks fail: per-step reliability compounds">
        <Reveal>
          <svg viewBox="0 0 320 130" className="mx-auto w-full max-w-lg" role="img" aria-label="Task success rate falling as the number of steps grows: 97% per-step reliability compounds to about 55% at 15 steps and 22% at 50 steps">
            {/* axes */}
            <line x1="34" y1="10" x2="34" y2="106" stroke="var(--color-ash)" strokeWidth="1" />
            <line x1="34" y1="106" x2="308" y2="106" stroke="var(--color-ash)" strokeWidth="1" />
            <text x="8" y="16" fontSize="9" fill="var(--color-ink-soft)">100%</text>
            <text x="14" y="106" fontSize="9" fill="var(--color-ink-soft)">0%</text>
            <text x="300" y="120" fontSize="9" fill="var(--color-ink-soft)">steps →</text>
            {/* the curve: 0.97^n, n = 1..50 */}
            <path
              d={curvePath()}
              fill="none"
              stroke="var(--color-brand)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* markers */}
            <circle cx={x(1)} cy={y(0.97)} r="3" fill="var(--color-brand)" />
            <circle cx={x(15)} cy={y(Math.pow(0.97, 15))} r="3" fill="var(--color-brand)" />
            <circle cx={x(50)} cy={y(Math.pow(0.97, 50))} r="3" fill="var(--color-brand)" />
            <text x={x(1) + 6} y={y(0.97) - 6} fontSize="9" fontWeight="bold" fill="var(--color-ink)">97% · 1 step</text>
            <text x={x(15) - 8} y={y(Math.pow(0.97, 15)) - 8} fontSize="9" fontWeight="bold" fill="var(--color-ink)">≈63% · 15</text>
            <text x={x(50) - 64} y={y(Math.pow(0.97, 50)) - 8} fontSize="9" fontWeight="bold" fill="var(--color-ink)">≈22% · 50</text>
            <text x="40" y="14" fontSize="9" fill="var(--color-ink-faint)">per-step reliability 97% — no verification</text>
          </svg>
        </Reveal>
        <p className="mt-2 text-center text-sm font-medium leading-relaxed text-ink">
          Nothing is &ldquo;only 3% unreliable.&rdquo; Unverified, reliability is{" "}
          <span className="font-bold">multiplicative</span> — the fix is verification between
          steps, not a better model.
        </p>
      </Scene>

      {/* Beat 2 — checkpoints + recovery */}
      <Scene caption="② The report's spine: checkpoints, verification, resume">
        <Reveal>
          <div className="flex items-start justify-between gap-1">
            {[
              { n: 1, label: "collect data", verified: true },
              { n: 2, label: "per-merchant rollup", verified: true },
              { n: 3, label: "cross-check totals", verified: true },
              { n: 4, label: "draft narrative", verified: true },
              { n: 5, label: "assemble + send", verified: false },
            ].map((seg) => (
              <div key={seg.n} className="flex-1 text-center">
                <div
                  className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full border-2 font-mono text-xs font-bold ${
                    seg.verified
                      ? "border-brand bg-brand-wash text-brand-deep"
                      : "border-dashed border-ash bg-surface-elevated text-ink-faint"
                  }`}
                >
                  {seg.n}
                </div>
                <div className="mt-1 text-[9.5px] font-bold leading-tight text-ink">{seg.label}</div>
                <div className="text-[8.5px] font-medium leading-tight text-ink-faint">
                  {seg.verified ? "✓ verified · state saved" : "pending"}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
        <p className="mt-3 text-center text-sm font-medium leading-relaxed text-ink">
          A tool outage at step 140 resumes from <span className="font-bold">checkpoint 4</span> —
          re-verifying the draft, not re-collecting three hours of data.
        </p>
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The rule</CardTitle>
        <Takeaway>
          Long-horizon autonomy = verification between steps + persisted checkpoints + a task
          budget. Autonomy without auditability is an incident with a delay.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

/* Curve math: success = 0.97^n over n=1..50, mapped into the viewBox. */
function x(n: number) {
  return 34 + 8 + ((n - 1) / 49) * (308 - 10 - 34 - 8);
}
function y(p: number) {
  return 106 - p * 92;
}
function curvePath() {
  const pts: string[] = [];
  for (let n = 1; n <= 50; n++) {
    pts.push(`${x(n)},${y(Math.pow(0.97, n))}`);
  }
  return `M ${pts.join(" L ")}`;
}
