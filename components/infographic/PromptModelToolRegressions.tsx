"use client";

import { useState } from "react";
import { Infographic, InfographicHeader, Card, Takeaway } from "./primitives";
import { Reveal } from "./motion";

/**
 * LLM Observability — Lesson 9: "Prompt, model, and tool regressions".
 *
 * Toggle-compare (PIC constructive): two releases side by side. Every variable
 * is unchanged except the prompt version — yet faithfulness dropped. The lesson:
 * find the changed variable before you blame the model. Reduced-motion-safe.
 */
type Release = "v16" | "v17";

const MODES: readonly { id: Release; label: string }[] = [
  { id: "v16", label: "Release v16" },
  { id: "v17", label: "Release v17" },
];

interface Var {
  name: string;
  v16: string;
  v17: string;
  changed: boolean;
}

const VARS: readonly Var[] = [
  { name: "prompt version", v16: "v16", v17: "v17", changed: true },
  { name: "model", v16: "gpt-4o", v17: "gpt-4o", changed: false },
  { name: "retrieval version", v16: "emb-3 · idx-9", v17: "emb-3 · idx-9", changed: false },
  { name: "tool", v16: "billing v2", v17: "billing v2", changed: false },
];

const SCORE: Record<Release, number> = { v16: 96, v17: 78 };

export function PromptModelToolRegressions() {
  const [rel, setRel] = useState<Release>("v16");

  return (
    <Infographic>
      <InfographicHeader
        title="Prompt, model, and tool regressions"
        subtitle="Toggle between two releases. What actually changed?"
      />

      <Reveal>
        <div className="rounded-2xl border border-ash bg-surface-elevated px-4 py-4 shadow-sm sm:px-6 sm:py-5">
          <div
            role="group"
            aria-label="Release"
            className="mx-auto mb-4 flex w-fit gap-1 rounded-full border border-ash bg-canvas p-1"
          >
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setRel(m.id)}
                aria-pressed={rel === m.id}
                className={`focus-ring min-h-[32px] rounded-full px-3 py-1 text-xs font-bold transition-colors ${
                  rel === m.id ? "bg-brand text-ink" : "text-ink-soft hover:text-ink"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="mx-auto mb-4 max-w-xs rounded-xl border border-ash bg-canvas px-4 py-3 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">faithfulness (golden set)</span>
            <div className={`text-3xl font-bold ${rel === "v17" ? "text-[var(--color-bad)]" : "text-brand"}`}>{SCORE[rel]}%</div>
          </div>

          <div className="flex flex-col gap-1.5">
            {VARS.map((v) => (
              <div
                key={v.name}
                className={`flex items-center justify-between rounded-lg border px-3 py-1.5 ${
                  v.changed ? "border-[var(--color-bad)] bg-[var(--color-bad-wash)]" : "border-ash bg-canvas"
                }`}
              >
                <span className="text-xs font-semibold text-ink">{v.name}</span>
                <span className="font-mono text-xs font-bold text-ink">
                  {rel === "v16" ? v.v16 : v.v17}
                  {v.changed && rel === "v17" && <span className="ml-2 text-[10px] uppercase text-[var(--color-bad)]">changed</span>}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-3 text-center text-xs font-medium text-ink-soft">
            {rel === "v17" ? (
              <>
                Only the <span className="font-bold text-[var(--color-bad)]">prompt version</span> changed. Don't blame the model — bisect the prompt.
              </>
            ) : (
              <>v16 was healthy. Compare every versioned variable before assuming the model regressed.</>
            )}
          </p>
        </div>
      </Reveal>

      <Card tone="brand" rotate={0}>
        <Takeaway>
          Version prompt, model, retrieval, and tool on every span — then bisect
          the one variable that changed instead of guessing.
        </Takeaway>
      </Card>
    </Infographic>
  );
}
