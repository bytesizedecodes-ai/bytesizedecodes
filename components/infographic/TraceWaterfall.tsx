"use client";

import { useState } from "react";
import { Infographic, InfographicHeader, Card, Takeaway } from "./primitives";
import { Scene, StoryMap, PersonFigure, MachineFigure, SpeechBubble } from "./scenes";

/**
 * AI Observability — Lesson 6: "Traces — following a request’s journey"
 * (v2 Thread retrofit)
 *
 * Through-line stage: ONE of Mitra's nine-second requests, itemised. The hook
 * puts the slow answer in the air (Nisha asks, Mitra takes nine seconds);
 * the waterfall then opens that same request like a delivery receipt — five
 * timing bars, same spot, and tapping steps changes only the detail panel.
 * The aha: the LLM-call bar dominates, so "Mitra is slow" becomes "THIS step
 * is slow". Brand accent only — the bottleneck is shown by length + fill,
 * not by a second colour.
 */
interface Step {
  name: string;
  ms: number;
  cost: string;
  status: "ok";
}

const STEPS: readonly Step[] = [
  { name: "User question", ms: 5, cost: "$0.000", status: "ok" },
  { name: "Search knowledge base", ms: 80, cost: "$0.000", status: "ok" },
  { name: "LLM call", ms: 920, cost: "$0.040", status: "ok" },
  { name: "Tool: lookup", ms: 140, cost: "$0.000", status: "ok" },
  { name: "Final answer", ms: 10, cost: "$0.000", status: "ok" },
];

const BOTTLENECK_INDEX = 2; // the LLM call
const TOTAL_MS = STEPS.reduce((sum, s) => sum + s.ms, 0);
const MAX_MS = Math.max(...STEPS.map((s) => s.ms));

export function TraceWaterfall() {
  const [selected, setSelected] = useState<number>(BOTTLENECK_INDEX);
  const step = STEPS[selected]!;
  const share = Math.round((step.ms / TOTAL_MS) * 100);

  return (
    <Infographic>
      <InfographicHeader
        title="Traces: follow one request end-to-end"
        subtitle="Tap a step to see what it cost — and find the slow one"
      />

      <StoryMap
        steps={[
          { icon: <span aria-hidden="true">⏱️</span>, label: "Nine-second answers" },
          { icon: <span aria-hidden="true">🧾</span>, label: "One journey’s receipt" },
          { icon: <span aria-hidden="true">👆</span>, label: "Tap each step" },
          { icon: <span aria-hidden="true">🧠</span>, label: "The slow step found" },
        ]}
      />

      {/* Hook — the slow answer in the air */}
      <Scene caption="So Mitra takes nine seconds per answer — and the team argues about which part is slow.">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-center sm:gap-6">
          <PersonFigure label="Nisha" />
          <SpeechBubble side="right">“Why so slow today?”</SpeechBubble>
          <MachineFigure label="Mitra" />
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink-soft">
          An average can’t settle it, because an average has no parts.
        </p>
      </Scene>

      {/* The widget — that same request, opened like a receipt */}
      <Scene variant="continue" caption="Then Nisha opens one request’s trace — tap each step to see what it cost.">
        <div className="rounded-2xl border border-ash bg-surface-elevated px-4 py-4 shadow-sm sm:px-6 sm:py-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-bold uppercase tracking-wide text-ink-soft">
              Mitra · one request, five steps
            </span>
            <span className="font-mono text-xs font-bold text-ink-soft">
              total {TOTAL_MS} ms
            </span>
          </div>

          {/* waterfall */}
          <div className="flex flex-col gap-1.5" role="list">
            {STEPS.map((s, i) => {
              const isBottleneck = i === BOTTLENECK_INDEX;
              const isSelected = i === selected;
              const widthPct = Math.max((s.ms / MAX_MS) * 100, 4);
              return (
                <button
                  key={s.name}
                  type="button"
                  role="listitem"
                  onClick={() => setSelected(i)}
                  aria-pressed={isSelected}
                  className={`focus-ring flex items-center gap-3 rounded-lg border px-2 py-1.5 text-left transition-colors ${
                    isSelected
                      ? "border-brand bg-brand-wash"
                      : "border-transparent hover:border-ash hover:bg-canvas"
                  }`}
                >
                  <span className="w-36 shrink-0 truncate text-xs font-semibold text-ink">
                    {s.name}
                  </span>
                  <span className="relative h-5 flex-1 overflow-hidden rounded bg-canvas">
                    <span
                      className={`absolute left-0 top-0 h-full rounded ${
                        isBottleneck ? "bg-brand" : "bg-[var(--color-ink-faint)]"
                      }`}
                      style={{ width: `${widthPct}%` }}
                    />
                  </span>
                  <span className="w-14 shrink-0 text-right font-mono text-xs font-bold text-ink">
                    {s.ms} ms
                  </span>
                </button>
              );
            })}
          </div>

          {/* detail panel for the selected step */}
          <div className="mt-4 rounded-xl border border-ash bg-canvas px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-ink">{step.name}</span>
              {selected === BOTTLENECK_INDEX && (
                <span className="rounded-full bg-brand-wash px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand">
                  bottleneck
                </span>
              )}
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2 text-center">
              <Detail label="Duration" value={`${step.ms} ms`} />
              <Detail label="Cost" value={step.cost} />
              <Detail label="Share of total" value={`${share}%`} />
            </div>
            <p className="mt-3 text-center text-xs font-medium text-ink-soft">
              {selected === BOTTLENECK_INDEX ? (
                <>
                  The LLM call alone is <span className="font-bold text-brand">{share}%</span> of
                  the whole request — the slow step is found, and that’s where the time goes.
                </>
              ) : (
                <>This step is quick. Tap the long bar (the LLM call) to find the slow one.</>
              )}
            </p>
          </div>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <Takeaway>
          A trace follows a single request through every step — so “it’s slow”
          becomes “<em>this</em> step is slow”, and you know exactly where to look.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-surface-elevated px-2 py-1.5">
      <div className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">{label}</div>
      <div className="text-sm font-bold text-ink">{value}</div>
    </div>
  );
}
