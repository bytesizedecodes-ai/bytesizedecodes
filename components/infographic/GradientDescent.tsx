"use client";

import { useState } from "react";
import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild, Reveal } from "./motion";

/**
 * Intermediate course — Lesson: "Learning by walking downhill" (gradient descent).
 *
 * Through-line: one loss valley, one hiker. The interaction (toggle-compare on
 * three step sizes) sits on the Observe beat: the learning-rate trade-off is a
 * thing you must FEEL — too small crawls, well-chosen glides, too large
 * explodes. Constrained presets (intermediate = task-framed, not a sandbox).
 */
const STEP_SIZES = [
  { label: "Too small · 0.05", lr: 0.05 },
  { label: "Well-chosen · 0.4", lr: 0.4 },
  { label: "Too large · 1.02", lr: 1.02 },
] as const;

// The valley: f(x) = (x − 6)². Pure math, deterministic trajectories.
const MIN_X = 6;
const f = (x: number) => (x - MIN_X) * (x - MIN_X);
const df = (x: number) => 2 * (x - MIN_X);

function trajectory(lr: number, start = 0.4, steps = 14) {
  const pts: { x: number; y: number; loss: number }[] = [];
  let x = start;
  for (let i = 0; i <= steps; i++) {
    pts.push({ x, y: f(x), loss: f(x) });
    x = x - lr * df(x);
    if (!Number.isFinite(x) || Math.abs(x) > 40) break; // diverged
  }
  return pts;
}

export function GradientDescent() {
  return (
    <Infographic>
      <InfographicHeader
        title="Learning by walking downhill"
        subtitle="Gradient descent: feel the slope, step the other way, repeat"
      />

      {/* Beat 1 — the loss landscape */}
      <Scene caption="① Every model sits somewhere on a loss landscape">
        <ValleySvg points={[]} markerLabel="start: a bad guess" />
        <p className="mt-2 text-center text-xs font-medium text-ink sm:text-sm">
          Down is better. The model&apos;s one job: reach the bottom — the smallest loss it can find.
        </p>
      </Scene>

      {/* Beat 2 — the update rule */}
      <Scene caption="② The rule: step opposite the slope, sized by the learning rate">
        <Stagger className="flex flex-col items-stretch justify-center gap-2 sm:flex-row sm:items-center sm:gap-3">
          <MotionChild>
            <RuleBox top="feel the slope" bottom="the gradient — which way is uphill, and how steep" />
          </MotionChild>
          <MotionChild>
            <RuleBox top="step: weight ← weight − rate × slope" bottom="one small move downhill" accent />
          </MotionChild>
          <MotionChild>
            <RuleBox top="repeat until flat" bottom="thousands of tiny steps, each a little less wrong" />
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-xs font-medium text-ink sm:text-sm">
          Everything a neural network learns arrives through this one loop — every weight, every layer.
        </p>
      </Scene>

      {/* Beat 3 — THE WIDGET: feel the learning rate */}
      <Scene caption="③ The one dial that decides success: the learning rate">
        <p className="mb-3 text-center text-xs font-semibold text-ink sm:text-sm">
          Click each step size and watch the descent — find the one that reaches the bottom.
        </p>
        <LearningRateExplorer />
      </Scene>

      <Reveal>
        <Card tone="brand" rotate={0}>
          <CardTitle icon="✦">The takeaway</CardTitle>
          <Takeaway>
            Gradient descent is <strong>repeated small downhill steps</strong> — and the learning rate decides
            whether those steps crawl, converge, or blow the model apart. It&apos;s the first hyperparameter
            you tune and the last one you stop worrying about.
          </Takeaway>
        </Card>
      </Reveal>
    </Infographic>
  );
}

/** Toggle-compare widget: three preset step sizes, deterministic trajectories on the valley. */
function LearningRateExplorer() {
  const [selected, setSelected] = useState<number>(1); // default: well-chosen
  const lr = STEP_SIZES[selected]!.lr;
  const pts = trajectory(lr);
  const last = pts[pts.length - 1]!;

  const verdict =
    last.loss > 4
      ? selected === 0
        ? "Fifteen steps and it has barely left the ridge — it WILL get there, but training this slow costs epochs and money you don't need to spend."
        : "Each step overshoots the minimum and lands FARTHER out than before — the loss is growing. This run diverged; the model is now worse than its starting guess."
      : `Reached the valley floor in ${pts.length - 1} steps — smooth, monotone descent. This is the zone you want.`;

  return (
    <div className="rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap justify-center gap-2" role="group" aria-label="Learning rate presets">
        {STEP_SIZES.map((preset, i) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => setSelected(i)}
            aria-pressed={selected === i}
            className={`rounded-full border px-3.5 py-2 text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
              selected === i
                ? "border-brand bg-brand text-canvas"
                : "border-ash bg-surface-elevated text-ink hover:border-brand"
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>
      <ValleySvg points={pts} markerLabel={undefined} />
      <p className="mt-2 text-center text-[11.5px] font-medium leading-relaxed text-ink-soft">
        {verdict}
      </p>
    </div>
  );
}

/** The through-line valley chart. Draws the bowl, the minimum, optional step dots. */
function ValleySvg({
  points,
  markerLabel,
}: {
  points?: { x: number; y: number }[];
  markerLabel?: string;
}) {
  const toX = (x: number) => 10 + ((x + 2) / 16) * 80; // x∈[-2,14] → svg 10..90
  const toY = (y: number) => 70 - Math.min(y, 36) * 1.6; // clamp for diverged points
  const bowlPath = [-2, 0, 2, 4, 6, 8, 10, 12, 14]
    .map((x, i) => `${i === 0 ? "M" : "L"}${toX(x).toFixed(1)} ${toY(f(x)).toFixed(1)}`)
    .join(" ");
  return (
    <svg viewBox="0 0 100 80" className="h-auto w-full" aria-hidden="true">
      <line x1="8" y1="72" x2="94" y2="72" stroke="var(--color-ash)" strokeWidth="1" />
      {/* the valley */}
      <path d={bowlPath} fill="none" stroke="var(--color-brand)" strokeWidth="2.5" strokeLinecap="round" />
      {/* the minimum */}
      <circle cx={toX(MIN_X)} cy={toY(0)} r="2.6" fill="var(--color-good)" />
      <text x={toX(MIN_X)} y={toY(0) - 4} textAnchor="middle" fontFamily="monospace" fontSize="5" fill="var(--color-good)">
        best
      </text>
      {/* trajectory dots */}
      {points?.map((p, i) => (
        <circle key={i} cx={toX(p.x)} cy={toY(p.y)} r="1.8" fill="var(--color-brand-deep)" opacity={0.85} />
      ))}
      {/* start marker */}
      {markerLabel && (
        <>
          <circle cx={toX(0.4)} cy={toY(f(0.4))} r="2.8" fill="var(--color-ink-soft)" />
          <text x={toX(0.4)} y={toY(f(0.4)) - 4} textAnchor="start" fontFamily="monospace" fontSize="5" fill="var(--color-ink-soft)">
            {markerLabel}
          </text>
        </>
      )}
      <text x="50" y="78.5" textAnchor="middle" fontFamily="monospace" fontSize="5.5" fill="var(--color-ink-soft)">
        a weight&apos;s value →
      </text>
      <text x="10" y="5" fontFamily="monospace" fontSize="5.5" fill="var(--color-ink-soft)">
        loss
      </text>
    </svg>
  );
}

function RuleBox({ top, bottom, accent = false }: { top: string; bottom: string; accent?: boolean }) {
  return (
    <div
      className={`flex-1 rounded-xl border px-4 py-3 text-center shadow-sm ${
        accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"
      }`}
    >
      <div className="font-mono text-[11.5px] font-bold text-ink">{top}</div>
      <p className="mt-1 text-[10.5px] font-medium leading-relaxed text-ink-soft">{bottom}</p>
    </div>
  );
}
