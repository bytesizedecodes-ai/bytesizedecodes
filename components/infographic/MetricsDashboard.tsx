"use client";

import { useState } from "react";
import { Infographic, InfographicHeader, Card, Takeaway } from "./primitives";
import { Scene, StoryMap, PersonFigure, SpeechBubble } from "./scenes";

/**
 * AI Observability — Lesson 5: "Metrics — counting what matters"
 * (v2 Thread retrofit)
 *
 * Through-line stage: Mitra's health panel — the SAME three tiles (latency,
 * spend, errors) in the same spot all lesson; only the time window changes
 * state (1h / 24h / 7d), and with it the readings. Beats: hook (one customer
 * says "slow", another "fine" — a feeling won't settle it) → the widget
 * (Nisha switches the window; in 24h the error tile turns red — the ONE
 * accented change, the spike announcing itself). Local state only,
 * illustrative data, no backend.
 */
type Window = "1h" | "24h" | "7d";

const METRICS = {
  latency: { label: "Latency", unit: "s", data: { "1h": 1.2, "24h": 1.4, "7d": 1.8 } },
  spend: { label: "Spend", unit: "$", data: { "1h": 2, "24h": 48, "7d": 340 } },
  errors: { label: "Error rate", unit: "%", data: { "1h": 0.2, "24h": 3.1, "7d": 0.8 } },
} as const;

// Illustrative sparkline points (0–1 range) per metric per window.
const SPARKS: Record<Window, Record<keyof typeof METRICS, number[]>> = {
  "1h": {
    latency: [0.3, 0.35, 0.4, 0.38, 0.42, 0.4, 0.44, 0.4],
    spend: [0.2, 0.25, 0.3, 0.28, 0.32, 0.3, 0.34, 0.33],
    errors: [0.1, 0.12, 0.1, 0.14, 0.1, 0.12, 0.1, 0.11],
  },
  "24h": {
    latency: [0.4, 0.42, 0.45, 0.5, 0.48, 0.52, 0.5, 0.55],
    spend: [0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.62],
    errors: [0.12, 0.15, 0.2, 0.4, 0.75, 0.9, 0.8, 0.82],
  },
  "7d": {
    latency: [0.5, 0.52, 0.55, 0.58, 0.6, 0.62, 0.65, 0.68],
    spend: [0.4, 0.45, 0.5, 0.55, 0.6, 0.66, 0.72, 0.78],
    errors: [0.2, 0.18, 0.25, 0.3, 0.28, 0.32, 0.35, 0.3],
  },
};

const WINDOWS: readonly Window[] = ["1h", "24h", "7d"];

export function MetricsDashboard() {
  const [win, setWin] = useState<Window>("24h");
  const errorSpike = win === "24h";

  return (
    <Infographic>
      <InfographicHeader
        title="Metrics: counting what matters"
        subtitle="Toggle the time window and watch the readings change"
      />

      <StoryMap
        steps={[
          { icon: <span aria-hidden="true">🗣️</span>, label: "Slow, or fine?" },
          { icon: <span aria-hidden="true">🔢</span>, label: "Count, not feel" },
          { icon: <span aria-hidden="true">🪟</span>, label: "Switch the window" },
          { icon: <span aria-hidden="true">🚨</span>, label: "The spike appears" },
        ]}
      />

      {/* Hook — two feelings, no answer */}
      <Scene caption="So is Mitra slow, or fine? One customer says each — and a feeling won’t settle it.">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-center sm:gap-6">
          <SpeechBubble side="right">“Mitra feels slow lately.”</SpeechBubble>
          <PersonFigure label="Nisha" />
          <SpeechBubble side="left">“Seems fine to me!”</SpeechBubble>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink-soft">
          Nisha needs numbers counted over time — not two opinions.
        </p>
      </Scene>

      {/* The widget — the same tiles, a new window state */}
      <Scene variant="continue" caption="Then Nisha counts instead of feeling — switch the window and watch.">
        <div className="rounded-2xl border border-ash bg-surface-elevated px-4 py-4 shadow-sm sm:px-6 sm:py-5">
          {/* dashboard header + time-window toggle */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm font-bold uppercase tracking-wide text-ink-soft">
              Mitra · service health
            </span>
            <div role="group" aria-label="Time window" className="flex gap-1 rounded-full border border-ash bg-canvas p-1">
              {WINDOWS.map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setWin(w)}
                  aria-pressed={win === w}
                  className={`focus-ring rounded-full px-3 py-1 text-xs font-bold transition-colors ${
                    win === w
                      ? "bg-brand text-ink"
                      : "text-ink-soft hover:text-ink"
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          {/* metric tiles */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {(Object.keys(METRICS) as (keyof typeof METRICS)[]).map((key) => {
              const m = METRICS[key];
              const value = m.data[win];
              const isSpikeTile = key === "errors" && errorSpike;
              return (
                <div
                  key={key}
              className={`rounded-xl border px-4 py-3 ${
                    isSpikeTile
                      ? "border-[var(--color-bad)] bg-[var(--color-bad-wash)]"
                      : "border-ash bg-canvas"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wide text-ink-soft">
                      {m.label}
                    </span>
                    {isSpikeTile && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-[var(--color-bad)] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[var(--color-bad)]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-bad)]" />
                        spike
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-ink">
                      {m.unit === "$" ? "$" : ""}
                      {value}
                      {m.unit !== "$" ? m.unit : ""}
                    </span>
                  </div>
                  <Sparkline
                    points={SPARKS[win][key]}
                    color={isSpikeTile ? "var(--color-bad)" : "var(--color-brand)"}
                  />
                </div>
              );
            })}
          </div>

          <p className="mt-4 text-center text-xs font-medium text-ink-soft">
            {errorSpike ? (
              <>
                In the last 24h, <span className="font-bold text-[var(--color-bad)]">error rate spiked to 3.1%</span> — the
                spike appears, and it is worth investigating.
              </>
            ) : (
              <>All readings look steady in this window. Try 24h to see a spike.</>
            )}
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <Takeaway>
          Metrics turn feelings (“it seems slow”) into numbers you can watch
          over time — and a spike is how a quiet problem announces itself.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

/** A tiny illustrative sparkline. Points are in a 0–1 range. */
function Sparkline({ points, color }: { points: readonly number[]; color: string }) {
  const w = 100;
  const h = 28;
  const pad = 2;
  const n = points.length;
  const coords = points.map((p, i) => {
    const x = pad + (i / (n - 1)) * (w - pad * 2);
    const y = h - pad - p * (h - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-2 h-7 w-full" preserveAspectRatio="none" aria-hidden="true">
      <polyline
        points={coords.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
