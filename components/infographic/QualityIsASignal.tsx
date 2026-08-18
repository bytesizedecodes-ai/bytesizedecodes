"use client";

import { useState } from "react";
import { Infographic, InfographicHeader, Card, Takeaway } from "./primitives";
import { Reveal } from "./motion";

/**
 * LLM Observability — Lesson 6: "Quality is a production signal".
 *
 * Toggle-compare (PIC): offline golden set vs online sampling. Each catches
 * what the other misses. The learner toggles and reads the trade-off.
 * Reduced-motion-safe.
 */
type Mode = "offline" | "online";

const MODES: readonly { id: Mode; label: string }[] = [
  { id: "offline", label: "Offline gold set" },
  { id: "online", label: "Online sample" },
];

const VIEW: Record<Mode, { stat: string; statLabel: string; lines: string[] }> = {
  offline: {
    stat: "94%",
    statLabel: "pass on 200 curated cases",
    lines: [
      "Run before every deploy, on a fixed, labelled golden set.",
      "Repeatable and fast — catches regressions you can predict.",
      "Blind to novel prompts users invent after you ship.",
    ],
  },
  online: {
    stat: "1%",
    statLabel: "of live traffic scored",
    lines: [
      "Sample real prompts in production and score them continuously.",
      "Catches drift, surprise inputs, and slow decay offline can't see.",
      "Messy and noisy — needs sampling and dedup to stay affordable.",
    ],
  },
};

export function QualityIsASignal() {
  const [mode, setMode] = useState<Mode>("offline");
  const v = VIEW[mode];

  return (
    <Infographic>
      <InfographicHeader
        title="Quality is a production signal"
        subtitle="Toggle between offline and online evaluation — you need both."
      />

      <Reveal>
        <div className="rounded-2xl border border-ash bg-surface-elevated px-4 py-4 shadow-sm sm:px-6 sm:py-5">
          <div
            role="group"
            aria-label="Evaluation mode"
            className="mx-auto mb-4 flex w-fit gap-1 rounded-full border border-ash bg-canvas p-1"
          >
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMode(m.id)}
                aria-pressed={mode === m.id}
                className={`focus-ring min-h-[32px] rounded-full px-3 py-1 text-xs font-bold transition-colors ${
                  mode === m.id ? "bg-brand text-ink" : "text-ink-soft hover:text-ink"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="mx-auto max-w-xs rounded-xl border border-ash bg-canvas px-4 py-3 text-center">
            <div className="text-3xl font-bold text-brand">{v.stat}</div>
            <div className="text-[11px] font-bold uppercase tracking-wide text-ink-soft">{v.statLabel}</div>
          </div>

          <ul className="mx-auto mt-4 max-w-md space-y-1.5">
            {v.lines.map((l) => (
              <li key={l} className="relative pl-5 text-xs font-medium text-ink">
                <span aria-hidden="true" className="absolute left-0 top-[0.15em] text-brand">✦</span>
                {l}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      <Card tone="brand" rotate={0}>
        <Takeaway>
          Unify one metric across offline and online: offline blocks bad
          releases, online catches the world your golden set didn't predict.
        </Takeaway>
      </Card>
    </Infographic>
  );
}
