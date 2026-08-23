"use client";

import { useState } from "react";
import { Infographic, InfographicHeader, Card } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";
import { SliderControl } from "./controls";

/**
 * Fine-Tuning in Practice — Lesson 9: "The dials that matter".
 * The LR playground: drag the rate, read the loss trace — crawl / converge /
 * diverge as live states. The widget sits on the Observe beat.
 */
function LossTrace({ lr }: { lr: number }) {
  // Deterministic illustrative trace: step ~ lr-scaled damped oscillator.
  const n = 24;
  const points: [number, number][] = [];
  let loss = 1.9;
  for (let i = 0; i < n; i++) {
    // too low: glacial crawl; band: healthy decay; too high: oscillation→diverge
    if (lr < 0.6) {
      loss -= lr * 0.06 * (1 + i * 0.02);
    } else if (lr <= 1.6) {
      loss -= (1.9 / n) * (1.15 - i / (2 * n)) * (lr / 1.0);
      if (loss < 0.45) loss = 0.45 + Math.sin(i) * 0.01;
    } else {
      const swing = (lr - 1.6) * 0.5;
      loss += Math.sin(i * 1.1) * swing * (0.6 + i / n);
    }
    points.push([i, Math.max(0.15, Math.min(3.1, loss))]);
  }
  const path = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${4 + x * 3.75} ${4 + (1 - (y - 0.15) / 2.95) * 68}`)
    .join(" ");
  const verdict =
    lr < 0.6
      ? { text: "Crawl — the habit never sets. Raise the rate.", tone: "text-ink" }
      : lr <= 1.6
        ? { text: "Converging — the working band. Epochs are your next dial.", tone: "text-brand-deep" }
        : { text: "Diverging — steps overshoot the valley floor. Lower the rate.", tone: "text-ink" };
  return (
    <div>
      <svg viewBox="0 0 100 80" className="h-auto w-full" aria-hidden="true">
        <line x1="4" y1="72" x2="96" y2="72" stroke="var(--color-ash)" strokeWidth="1" />
        <line x1="4" y1="4" x2="4" y2="72" stroke="var(--color-ash)" strokeWidth="1" />
        <text x="50" y="79" textAnchor="middle" fontFamily="monospace" fontSize="5" fill="var(--color-ink-soft)">
          training steps →
        </text>
        <text x="6" y="8" fontFamily="monospace" fontSize="5" fill="var(--color-ink-soft)">
          loss
        </text>
        <path d={path} fill="none" stroke="var(--color-brand)" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <p className={`mt-1 text-center text-xs font-bold ${verdict.tone}`}>{verdict.text}</p>
    </div>
  );
}

export function DialsThatMatter() {
  const [lr, setLr] = useState(1.0);
  return (
    <Infographic>
      <InfographicHeader
        title="The dials that matter"
        subtitle="Four dials, strong defaults — and one that decides success"
      />

      {/* SCENE 1 — the config */}
      <Scene caption="① Sahayak's config, mostly defaults">
        <Stagger className="mx-auto max-w-md space-y-2">
          {[
            ["learning rate", "2e-4", "inside the 1–3e-4 band rank-16 adapters like"],
            ["epochs", "3", "the exposure dial — the parrot dial"],
            ["warmup", "30 steps", "insurance for cold adapters"],
            ["effective batch", "16", "4 micro-batches × 4 accumulation"],
          ].map(([k, v, note]) => (
            <MotionChild key={k}>
              <div className="flex items-center justify-between gap-3 rounded-xl border border-ash bg-surface-elevated px-4 py-2.5 shadow-sm">
                <div>
                  <p className="text-xs font-bold text-ink">{k}</p>
                  <p className="text-[10px] font-medium text-ink-soft">{note}</p>
                </div>
                <p className="font-mono text-sm font-bold text-brand-deep">{v}</p>
              </div>
            </MotionChild>
          ))}
        </Stagger>
      </Scene>

      {/* SCENE 2 — the widget: read the trace */}
      <Scene caption="② Drag the learning rate and read the loss trace">
        <div className="mx-auto max-w-lg">
          <LossTrace lr={lr} />
          <div className="mt-3">
            <SliderControl
              label="Learning rate — the step size"
              value={lr}
              min={0.1}
              max={2.4}
              step={0.1}
              onChange={setLr}
              format={(v) => (v < 1 ? `${(v * 1e-4).toPrecision(2)}e-4` : `${(v * 1e-4).toPrecision(2)}e-4`)}
              presets={[
                { label: "Too low · crawl", value: 0.3 },
                { label: "Working band", value: 1.0 },
                { label: "Too high · diverge", value: 2.2 },
              ]}
            />
          </div>
          <p className="mt-2 text-center text-[11px] font-medium text-ink-soft">
            Task: find the band where loss settles lowest — then notice what changing it does NOT fix (that&apos;s the
            epochs dial, decided by the drawer, not the trace).
          </p>
        </div>
      </Scene>

      {/* SCENE 3 — the two wrong-rate signatures */}
      <Scene caption="③ The two signatures, named">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <div className="rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wide text-ink-soft">too low · the crawl</div>
            <p className="mt-1 font-mono text-[11px] text-ink-soft">1.84 → 1.83 → 1.83 → 1.82</p>
            <p className="mt-1.5 text-[11px] font-medium text-ink">Monotone, glacial — habit never sets. Fix: raise the rate.</p>
          </div>
          <div className="rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wide text-ink-soft">too high · the diverge</div>
            <p className="mt-1 font-mono text-[11px] text-ink-soft">2.1 → 2.4 → 1.9 → 2.6 → 3.0</p>
            <p className="mt-1.5 text-[11px] font-medium text-ink">Oscillation, then climb — overshoot onto the far wall. Fix: lower it.</p>
          </div>
        </div>
      </Scene>

      {/* SCENE 4 — the order of operations */}
      <Scene caption="④ When a run disappoints — the order">
        <div className="mx-auto max-w-md space-y-2">
          {[
            "① read the trace: the rate's signature first",
            "② check the drawer vs epochs: the parrot check",
            "③ only then touch batch / warmup — rarely the culprit",
            "✗ never a four-dial grid — defaults were validated by the community",
          ].map((s, i) => (
            <MotionChild key={s}>
              <div
                className={`rounded-xl px-4 py-2.5 text-center text-xs font-semibold ${
                  i === 3 ? "bg-bad-wash border border-bad text-ink" : "border border-ash bg-surface-elevated text-ink shadow-sm"
                }`}
              >
                {s}
              </div>
            </MotionChild>
          ))}
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          The rate decides whether training works;{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">the drawer decides when to
          stop</span>.
        </p>
      </Card>
    </Infographic>
  );
}
