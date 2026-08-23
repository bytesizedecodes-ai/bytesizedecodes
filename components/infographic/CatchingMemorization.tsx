"use client";

import { useState } from "react";
import { Infographic, InfographicHeader, Card } from "./primitives";
import { Scene } from "./scenes";
import { MotionChild } from "./motion";
import { ToggleGroup } from "./controls";

/**
 * Fine-Tuning in Practice — Lesson 10: "Catching the parrot mid-training".
 * The two-curve chart with a checkpoint picker: switch checkpoints, watch
 * train loss keep falling while the drawer peaks and turns — the ship
 * decision on one picture.
 */
type Ckpt = "200" | "600" | "1200";

const CKPTS: Record<Ckpt, { train: number; drawer: number; note: string; ship: boolean }> = {
  "200": { train: 1.42, drawer: 61, note: "under-trained — habit still soft; drawer climbing", ship: false },
  "600": { train: 1.18, drawer: 86, note: "the peak — best transfer; ship this checkpoint", ship: true },
  "1200": { train: 0.97, drawer: 72, note: "lowest train loss, drawer falling — the parrot has arrived", ship: false },
};

export function CatchingMemorization() {
  const [ckpt, setCkpt] = useState<Ckpt>("600");
  const cur = CKPTS[ckpt];
  return (
    <Infographic>
      <InfographicHeader
        title="Catching the parrot mid-training"
        subtitle="Two curves, one decision: ship the drawer's peak, not the last checkpoint"
      />

      {/* SCENE 1 — the two curves */}
      <Scene caption="① Train loss falls forever — the drawer doesn't">
        <svg viewBox="0 0 100 72" className="h-auto w-full" aria-hidden="true">
          <line x1="6" y1="64" x2="96" y2="64" stroke="var(--color-ash)" strokeWidth="1" />
          <line x1="6" y1="4" x2="6" y2="64" stroke="var(--color-ash)" strokeWidth="1" />
          {/* train loss: monotone fall */}
          <path
            d="M6 12 C 25 20, 45 34, 94 52"
            fill="none"
            stroke="var(--color-ink-soft)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* drawer score: rise, peak at 600, fall */}
          <path
            d="M6 58 C 22 40, 34 22, 48 16 C 60 12, 70 18, 94 34"
            fill="none"
            stroke="var(--color-brand)"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          {/* the peak marker */}
          <circle cx="48" cy="16" r="3" fill="var(--color-brand)" />
          <text x="52" y="14" fontFamily="monospace" fontSize="5.5" fill="var(--color-brand)" fontWeight="bold">
            ckpt 600 · peak
          </text>
          {/* checkpoint ticks */}
          {[14, 48, 88].map((x, i) => (
            <line key={i} x1={x} y1="62" x2={x} y2="66" stroke="var(--color-ash)" strokeWidth="1.5" />
          ))}
          <text x="10" y="71" fontFamily="monospace" fontSize="4.5" fill="var(--color-ink-soft)">200</text>
          <text x="45" y="71" fontFamily="monospace" fontSize="4.5" fill="var(--color-ink-soft)">600</text>
          <text x="84" y="71" fontFamily="monospace" fontSize="4.5" fill="var(--color-ink-soft)">1200</text>
        </svg>
        <div className="mt-1 flex justify-center gap-4 text-[10px] font-semibold">
          <span className="text-ink-soft">— train loss (pack fit)</span>
          <span className="text-brand-deep">— drawer score (fresh transfer)</span>
        </div>
        <p className="mt-2 text-center text-xs font-medium text-ink">
          The curves peel apart exactly where memorization begins.
        </p>
      </Scene>

      {/* SCENE 2 — the picker */}
      <Scene caption="② Inspect each checkpoint — which one ships?">
        <div className="mx-auto max-w-md">
          <div className="flex justify-center">
            <ToggleGroup<Ckpt>
              label="Checkpoint"
              value={ckpt}
              onChange={setCkpt}
              options={[
                { value: "200", label: "step 200" },
                { value: "600", label: "step 600" },
                { value: "1200", label: "step 1200" },
              ]}
            />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-ash bg-surface-elevated p-3 text-center shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">train loss</p>
              <p className="mt-1 font-mono text-lg font-bold text-ink">{cur.train.toFixed(2)}</p>
              <p className="text-[10px] font-medium text-ink-soft">lower = better pack fit</p>
            </div>
            <div
              className={`rounded-xl p-3 text-center ${
                cur.ship ? "border border-brand bg-brand-wash" : "border border-ash bg-surface-elevated shadow-sm"
              }`}
            >
              <p className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">drawer score</p>
              <p className={`mt-1 font-mono text-lg font-bold ${cur.ship ? "text-brand-deep" : "text-ink"}`}>{cur.drawer}/100</p>
              <p className="text-[10px] font-medium text-ink-soft">the ship criterion</p>
            </div>
          </div>
          <div
            className={`mt-3 rounded-xl px-4 py-2.5 text-center text-xs font-semibold ${
              cur.ship ? "border border-brand bg-brand-wash text-ink" : "border border-ash bg-surface-elevated text-ink shadow-sm"
            }`}
          >
            {cur.ship ? "SHIP — the drawer's peak. This is the artifact." : cur.note}
          </div>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Task: visit all three, then say which ships — and why the lowest train loss is the trap.
        </p>
      </Scene>

      {/* SCENE 3 — the policy */}
      <Scene caption="③ The policy this installs">
        <div className="mx-auto max-w-md space-y-2">
          {[
            "checkpoint every N steps (200 for an 800-pair pack)",
            "score the 40-question drawer on every checkpoint",
            "ship the drawer peak — log both curves with the artifact",
          ].map((s) => (
            <MotionChild key={s}>
              <div className="rounded-xl border border-ash bg-surface-elevated px-4 py-2.5 text-center text-xs font-medium text-ink shadow-sm">
                {s}
              </div>
            </MotionChild>
          ))}
        </div>
      </Scene>

      {/* SCENE 4 — the boundary */}
      <Scene caption="④ Don't turn the drawer into a leaderboard">
        <div className="mx-auto max-w-md rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
          <p className="text-xs font-semibold text-ink">
            Scoring <em>every step</em> on a <em>12-question</em> drawer and shipping the luckiest spike is selection
            overfitting — you&apos;re selecting on the sample&apos;s noise.
          </p>
          <p className="mt-1.5 text-[11px] font-medium text-ink-soft">
            Every-N-steps + a 40+ question drawer keeps the peak honest.
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          Keep every take; ship the one where the song is alive —{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">the drawer&apos;s peak</span>.
        </p>
      </Card>
    </Infographic>
  );
}
