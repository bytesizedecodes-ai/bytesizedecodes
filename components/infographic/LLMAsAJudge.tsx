"use client";

import { useState } from "react";
import { Infographic, InfographicHeader, Card, Takeaway } from "./primitives";
import { Reveal } from "./motion";

/**
 * LLM Observability — Lesson 7: "LLM-as-a-judge".
 *
 * Toggle-compare (PIC constructive): the same three answers scored by an
 * automated judge vs a human. Toggle reveals they agree on two and disagree on
 * one (the polished-but-wrong one) — teaching that a judge is a tool to
 * calibrate, not a source of truth. Reduced-motion-safe.
 */
type Mode = "judge" | "human";

const MODES: readonly { id: Mode; label: string }[] = [
  { id: "judge", label: "LLM judge" },
  { id: "human", label: "Human reviewer" },
];

interface Ans {
  id: string;
  text: string;
  judge: number;
  human: number;
}

const ANSWERS: readonly Ans[] = [
  { id: "a", text: "Canberra is the capital of Australia.", judge: 5, human: 5 },
  { id: "b", text: "Here's a clear step-by-step refund process.", judge: 5, human: 4 },
  { id: "c", text: "Sydney is the capital of Australia.", judge: 4, human: 1 },
];

function Bar({ value, color }: { value: number; color: string }) {
  return (
    <span className="relative flex h-5 flex-1 items-center overflow-hidden rounded bg-canvas">
      <span className="absolute left-0 top-0 h-full rounded" style={{ width: `${(value / 5) * 100}%`, background: color }} />
      <span className="relative z-10 pl-2 font-mono text-[10px] font-bold text-ink">{value}/5</span>
    </span>
  );
}

export function LLMAsAJudge() {
  const [mode, setMode] = useState<Mode>("judge");
  const human = mode === "human";

  return (
    <Infographic>
      <InfographicHeader
        title="LLM-as-a-judge"
        subtitle="Toggle between a judge and a human. Where do they disagree?"
      />

      <Reveal>
        <div className="rounded-2xl border border-ash bg-surface-elevated px-4 py-4 shadow-sm sm:px-6 sm:py-5">
          <div
            role="group"
            aria-label="Scorer"
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

          <div className="flex flex-col gap-2">
            {ANSWERS.map((a) => {
              const score = human ? a.human : a.judge;
              const disagree = Math.abs(a.judge - a.human) >= 3;
              const color = score <= 2 ? "var(--color-bad)" : "var(--color-brand)";
              return (
                <div
                  key={a.id}
                  className={`rounded-lg border px-3 py-2 ${disagree && human ? "border-[var(--color-bad)]" : "border-ash"} bg-canvas`}
                >
                  <p className="mb-1.5 text-xs font-semibold text-ink">&ldquo;{a.text}&rdquo;</p>
                  <Bar value={score} color={color} />
                </div>
              );
            })}
          </div>

          <p className="mt-3 text-center text-xs font-medium text-ink-soft">
            {human ? (
              <>
                The human catches that the Sydney answer is{" "}
                <span className="font-bold text-[var(--color-bad)]">confidently wrong</span> — the judge gave it a 4. Judges must be calibrated, not trusted blind.
              </>
            ) : (
              <>The judge scores fluency well but can&rsquo;t verify facts — it ranks a polished lie above a plain truth.</>
            )}
          </p>
        </div>
      </Reveal>

      <Card tone="brand" rotate={0}>
        <Takeaway>
          A judge is a fast, cheap first pass — never the last word. Calibrate it
          against human labels and watch for the biases it inherits.
        </Takeaway>
      </Card>
    </Infographic>
  );
}
