"use client";

import { useState } from "react";
import { Infographic, InfographicHeader, Card, Takeaway } from "./primitives";
import { Scene } from "./scenes";

/**
 * AI Observability — Lesson 9: "Drift — when AI slowly goes bad".
 *
 * Beginner calibration: drift is slow decay. A model is frozen at training
 * time, but the world keeps changing — new words, new events, new behaviour —
 * so quality slips a little each week, like milk slowly turning sour. The aha:
 * there’s no single breakage to point at, only a gentle downward line, which is
 * why you must watch quality over time rather than trust a one-off test.
 *
 * Interactive (toggle-compare on the "watch" beat): the learner compares a
 * one-off check (a single reading — ambiguous) with the weeks-long line (the
 * slide, obvious). Brand line; the decayed end turns semantic red only to mark
 * the degraded state.
 */
type View = "one-off" | "over-time";

export function DriftSlowlyGoingBad() {
  const [view, setView] = useState<View>("one-off");

  return (
    <Infographic>
      <InfographicHeader
        title="Drift: when AI slowly goes bad"
        subtitle="No crash, no single break — just a quiet slide downhill"
      />

      {/* ① Then: frozen model, high quality */}
      <Scene caption="① At launch, the model does great">
        <QualityLine phase="then" />
        <p className="mt-3 text-center text-xs font-medium text-ink-soft">
          Trained on the world as it was <em>then</em>, it answers confidently and well.
        </p>
      </Scene>

      {/* ② Time passes: world shifts, frozen model degrades */}
      <Scene caption="② Months pass. The world shifts. The model doesn’t.">
        <QualityLine phase="drift" />
        <p className="mt-3 text-center text-xs font-medium text-ink-soft">
          New slang, new events, new user behaviour arrive — but the model is frozen.
          Like milk slowly turning sour, quality slips a little each week.
        </p>
      </Scene>

      {/* ③ Interactive: one-off check vs watching over time */}
      <Scene caption="③ You catch drift by watching quality over time">
        <div
          role="group"
          aria-label="How you check quality"
          className="mx-auto flex w-fit gap-1 rounded-full border border-ash bg-canvas p-1"
        >
          {(
            [
              ["one-off", "One-off check"],
              ["over-time", "Watch over time"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setView(value)}
              aria-pressed={view === value}
              className={`focus-ring rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                view === value
                  ? "bg-brand text-ink"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-center text-[11px] font-medium uppercase tracking-wide text-brand-deep">
          Toggle to compare the two ways of checking
        </p>
        <QualityLine phase="watch" mode={view} />
        <p className="mt-3 text-center text-xs font-medium text-ink-soft">
          {view === "one-off" ? (
            <>A single reading can&rsquo;t tell you whether this is a bad day or a bad{" "}
            <em>direction</em>. One number, no story.</>
          ) : (
            <>The weeks-long line shows the slide — drift becomes visible{" "}
            <em>before</em> users start complaining.</>
          )}
        </p>
      </Scene>

      <Card tone="brand" rotate={0}>
        <Takeaway>
          Drift is decay without a crash — so the only way to catch it is to keep
          measuring quality over time and watch the trend.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

/** A small quality-over-weeks line. `phase` controls how far it has decayed;
 *  `mode: "one-off"` hides the line and shows only the latest reading. */
function QualityLine({
  phase,
  mode = "over-time",
}: {
  phase: "then" | "drift" | "watch";
  mode?: View;
}) {
  // y is inverted: higher value = higher on chart = better quality.
  const series: Record<typeof phase, number[]> = {
    then: [88, 90, 89, 91, 90, 91, 90, 91],
    drift: [91, 89, 86, 82, 78, 73, 68, 61],
    watch: [91, 89, 86, 82, 78, 73, 68, 61],
  };
  const points = series[phase];
  const w = 240;
  const h = 90;
  const pad = 8;
  const min = 50;
  const max = 100;
  const n = points.length;
  const coords = points.map((p, i) => {
    const x = pad + (i / (n - 1)) * (w - pad * 2);
    const y = h - pad - ((p - min) / (max - min)) * (h - pad * 2);
    return { x, y, v: p };
  });
  const last = coords[n - 1]!;
  const decayed = phase !== "then" && last.v < 70;
  const lineColor = decayed ? "var(--color-bad)" : "var(--color-brand)";
  return (
    <div className="mx-auto w-full max-w-sm">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img" aria-label="Quality score over several weeks">
        {/* baseline grid */}
        <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke="var(--color-ash)" strokeWidth="1" />
        <line x1={pad} y1={pad} x2={pad} y2={h - pad} stroke="var(--color-ash)" strokeWidth="1" />
        {/* acceptable threshold */}
        <line x1={pad} y1={h - pad - ((70 - min) / (max - min)) * (h - pad * 2)} x2={w - pad} y2={h - pad - ((70 - min) / (max - min)) * (h - pad * 2)} stroke="var(--color-ink-faint)" strokeWidth="1" strokeDasharray="3 4" />
        <text x={w - pad} y={h - pad - ((70 - min) / (max - min)) * (h - pad * 2) - 4} textAnchor="end" fontSize="9" fill="var(--color-ink-faint)">acceptable</text>
        {/* the quality line — hidden in one-off mode: a single check sees one dot */}
        {mode === "over-time" && (
          <polyline
            points={coords.map((c) => `${c.x},${c.y}`).join(" ")}
            fill="none"
            stroke={lineColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        {/* end marker */}
        <circle cx={last.x} cy={last.y} r="4" fill={lineColor} />
        <text x={last.x - 8} y={last.y - 8} textAnchor="end" fontSize="10" fontWeight="bold" fill={lineColor}>
          {phase === "then" ? "launch" : decayed ? "now: low" : "now"}
        </text>
        <text x={pad} y={h - 1} fontSize="9" fill="var(--color-ink-faint)">weeks →</text>
        <text x={2} y={pad + 6} fontSize="9" fill="var(--color-ink-faint)">quality</text>
      </svg>
    </div>
  );
}
