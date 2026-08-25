import { Infographic, InfographicHeader, Card, Takeaway } from "./primitives";
import { CarShape, MachineFigure, Scene, StoryMap } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * AI Observability — Lesson 1: "What is observability?" (v2 Thread retrofit)
 *
 * Through-line stage: the hidden engine — first the car's, then Mitra's. The
 * car holds the stage for two scenes (bonnet shut → gauges reading inside),
 * then hands the SAME role to Mitra, the support assistant Nisha looks after
 * at Suraksha: another hidden engine, now given its own gauges (latency ·
 * cost · errors). Beats: hook (Nisha drives, bonnet shut) → reveal (gauges
 * read the inside; one flashing) → fade (Mitra gets gauges too). Brand blue
 * only; red is reserved for the single warning gauge that teaches "a signal
 * going wrong".
 */
export function WhatIsObservability() {
  return (
    <Infographic>
      <InfographicHeader
        title="What is observability?"
        subtitle="Seeing inside a machine without opening it up"
      />

      <StoryMap
        steps={[
          { icon: <span aria-hidden="true">🚗</span>, label: "The bonnet stays shut" },
          { icon: <span aria-hidden="true">⏱️</span>, label: "Gauges read inside" },
          { icon: <span aria-hidden="true">🤖</span>, label: "Mitra gets gauges" },
        ]}
      />

      {/* Hook — the stage: the engine is hidden */}
      <Scene caption="So Nisha can’t see the engine while she drives — the bonnet stays shut.">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
          <CarShape />
          <div className="max-w-xs text-center">
            <p className="text-sm font-semibold text-ink">
              The engine is sealed under the bonnet.
            </p>
            <p className="mt-1 text-xs font-medium text-ink-soft">
              So how does she know if it’s healthy?
            </p>
          </div>
        </div>
      </Scene>

      {/* Reveal — the gauges read the inside; the warning gauge is the ONE change */}
      <Scene variant="continue" caption="But the gauges read the inside anyway — and one is flashing.">
        <Stagger className="grid grid-cols-3 gap-3">
          <MotionChild>
            <Gauge label="Speed" value="ok" />
          </MotionChild>
          <MotionChild>
            <Gauge label="Fuel" value="ok" />
          </MotionChild>
          <MotionChild>
            <Gauge label="Engine" value="warn" />
          </MotionChild>
        </Stagger>
        <p className="mt-4 text-center text-xs font-medium text-ink-soft">
          Each gauge shows one thing you can’t see — and one is flashing.
        </p>
      </Scene>

      {/* Fade to AI: Mitra takes over the same hidden-engine role, with gauges */}
      <Scene caption="That’s why Mitra gets gauges too — an AI is just another hidden engine.">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
          <MachineFigure label="Mitra, Suraksha’s assistant" />
          <div className="flex flex-col items-center gap-2">
            <span className="rounded-full bg-brand-wash px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-brand">
              latency · cost · errors
            </span>
            <span className="text-2xl font-bold text-ink">=</span>
            <span className="rounded-2xl bg-brand px-4 py-2 text-sm font-bold text-ink">
              its dashboard
            </span>
          </div>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink-soft">
          Observability gives an AI the same kind of dashboard a car already has.
        </p>
      </Scene>

      <Card tone="brand" rotate={0}>
        <Takeaway>
          Observability = knowing what’s happening <em>inside</em> a system, by
          reading its signals from the <em>outside</em>.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

/** A small semicircle gauge. `warn` flips the single accent to red — the only
 *  non-brand colour in the lesson, used solely to teach "a signal going wrong". */
function Gauge({ label, value }: { label: string; value: "ok" | "warn" }) {
  const color = value === "warn" ? "var(--color-bad)" : "var(--color-brand)";
  const needleAngle = value === "warn" ? 70 : -30;
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-xl border border-ash bg-surface-elevated px-2 py-3">
      <svg viewBox="0 0 80 52" className="h-14 w-20" aria-hidden="true">
        {/* dial arc */}
        <path
          d="M10 46 A30 30 0 0 1 70 46"
          fill="none"
          stroke="var(--color-ash)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* value arc */}
        <path
          d="M10 46 A30 30 0 0 1 70 46"
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="47 94"
          strokeDashoffset={value === "warn" ? 0 : 30}
        />
        {/* needle */}
        <line
          x1="40"
          y1="46"
          x2={40 + Math.cos((Math.PI * (180 - needleAngle)) / 180) * 24}
          y2={46 - Math.sin((Math.PI * (180 - needleAngle)) / 180) * 24}
          stroke="var(--color-ink)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="40" cy="46" r="3" fill="var(--color-ink)" />
      </svg>
      <span className="text-[11px] font-bold uppercase tracking-wide text-ink">
        {label}
      </span>
    </div>
  );
}
