"use client";

import { useState } from "react";
import { Infographic, InfographicHeader, Card, Takeaway } from "./primitives";
import { Reveal } from "./motion";

/**
 * LLM Observability — Lesson 5: "Define an AI service level objective".
 *
 * Drag-to-tune (PIC constructive): drag the SLO target and watch the error
 * budget and its consequence change. A loose target tolerates user pain; a
 * tight one burns the budget fast and pages on-call. Teaches that targets
 * follow user-visible outcomes, not vibes. Reduced-motion-safe: the slider is a
 * real range input (keyboard + arrow reachable).
 */
const TRAFFIC_PER_MIN = 1000; // illustrative requests/min
const MEASURED_PASS_RATE = 0.972; // what the system actually delivers right now

export function AIServiceLevelObjective() {
  // target as percent of requests that must pass eval, 90.0 → 99.9
  const [targetPct, setTargetPct] = useState(99);

  const target = targetPct / 100;
  const budget = 1 - target; // allowed bad fraction
  const badPerMin = TRAFFIC_PER_MIN * (1 - MEASURED_PASS_RATE);
  const budgetMinutes = budget > 0 ? Math.floor((budget * TRAFFIC_PER_MIN) / badPerMin) : 0;
  const verdict =
    targetPct <= 95
      ? { t: "Too loose", c: "var(--color-bad)" }
      : targetPct >= 99.5
        ? { t: "Tight — watch alert noise", c: "var(--color-bad)" }
        : { t: "Just right", c: "var(--color-brand)" };

  return (
    <Infographic>
      <InfographicHeader
        title="Define an AI service level objective"
        subtitle="Drag the target and feel the error budget tighten."
      />

      <Reveal>
        <div className="rounded-2xl border border-ash bg-surface-elevated px-4 py-4 shadow-sm sm:px-6 sm:py-5">
          <label className="block">
            <span className="mb-1 flex items-center justify-between text-[11px] font-bold uppercase tracking-wide text-ink-soft">
              <span>SLO target (% of answers passing eval)</span>
              <span className="font-mono text-brand">{targetPct.toFixed(1)}%</span>
            </span>
            <input
              type="range"
              min={90}
              max={99.9}
              step={0.1}
              value={targetPct}
              onChange={(e) => setTargetPct(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-ash accent-brand"
              aria-label="SLO target"
            />
          </label>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-ash bg-canvas px-3 py-2">
              <span className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">error budget</span>
              <p className="font-mono text-lg font-bold text-ink">{(budget * 100).toFixed(1)}%</p>
              <p className="text-[10px] text-ink-soft">bad answers you tolerate</p>
            </div>
            <div className="rounded-lg border border-ash bg-canvas px-3 py-2">
              <span className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">budget lasts</span>
              <p className="font-mono text-lg font-bold text-ink">~{budgetMinutes} min</p>
              <p className="text-[10px] text-ink-soft">at today's failure rate</p>
            </div>
          </div>

          <p
            className="mt-3 rounded-lg px-3 py-2 text-center text-xs font-bold"
            style={{ color: verdict.c, background: "var(--color-canvas)" }}
          >
            {verdict.t}
          </p>
        </div>
      </Reveal>

      <Card tone="brand" rotate={0}>
        <Takeaway>
          An SLO turns "helpful and fast" into a number: an SLI, a target, and
          the error budget that tells you when to roll back.
        </Takeaway>
      </Card>
    </Infographic>
  );
}
