"use client";

import { useState } from "react";
import { Infographic, InfographicHeader, Card, Takeaway } from "./primitives";
import { Reveal } from "./motion";

/**
 * LLM Observability — Lesson 4: "Latency and cost, broken down".
 *
 * Click-to-elaborate: a request broken into latency/cost stages. The learner
 * clicks a stage to read its milliseconds, token cost, and whether it gates
 * time-to-first-token or total time. Decode is the dominant stage (brand fill).
 * Reduced-motion-safe.
 */
type StageId = "retrieval" | "prefill" | "decode" | "tool";

interface Stage {
  id: StageId;
  name: string;
  ms: number;
  tokens: string;
  phase: string;
  detail: string;
}

const STAGES: readonly Stage[] = [
  {
    id: "retrieval",
    name: "Retrieval",
    ms: 70,
    tokens: "0 tok",
    phase: "blocks first token",
    detail: "Vector search + reranking. No model tokens, but nothing else can start until it returns.",
  },
  {
    id: "prefill",
    name: "Prefill (TTFT)",
    ms: 180,
    tokens: "1,200 in",
    phase: "first-token latency",
    detail: "Processing the prompt before the first output token. Scales with input length.",
  },
  {
    id: "decode",
    name: "Decode",
    ms: 620,
    tokens: "180 out",
    phase: "total latency",
    detail: "Token-by-token generation — the bulk of user-visible time and most of the token bill.",
  },
  {
    id: "tool",
    name: "Tool wait",
    ms: 110,
    tokens: "0 tok",
    phase: "stalls the turn",
    detail: "A synchronous tool call the model blocked on. Often invisible in model-only metrics.",
  },
];

const MAX_MS = Math.max(...STAGES.map((s) => s.ms));

export function LatencyCostBrokenDown() {
  const [sel, setSel] = useState<StageId>("decode");
  const stage = STAGES.find((s) => s.id === sel)!;

  return (
    <Infographic>
      <InfographicHeader
        title="Latency and cost, broken down"
        subtitle="Click each stage to see where the seconds and the tokens go."
      />

      <Reveal>
        <div className="rounded-2xl border border-ash bg-surface-elevated px-4 py-4 shadow-sm sm:px-6 sm:py-5">
          <div className="mb-3 flex flex-wrap justify-center gap-1.5">
            {(["p50 980ms", "p95 1.9s", "p99 3.4s"] as const).map((p) => (
              <span
                key={p}
                className="rounded-full border border-ash bg-canvas px-2.5 py-0.5 font-mono text-[10px] font-bold text-ink-soft"
              >
                {p}
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-1.5" role="list">
            {STAGES.map((s) => {
              const on = s.id === sel;
              const pct = Math.max((s.ms / MAX_MS) * 100, 6);
              return (
                <button
                  key={s.id}
                  type="button"
                  role="listitem"
                  onClick={() => setSel(s.id)}
                  aria-pressed={on}
                  className={`focus-ring flex items-center gap-3 rounded-lg border px-2 py-1.5 text-left transition-colors ${
                    on ? "border-brand bg-brand-wash" : "border-transparent hover:border-ash hover:bg-canvas"
                  }`}
                >
                  <span className="w-28 shrink-0 truncate text-xs font-semibold text-ink">{s.name}</span>
                  <span className="relative h-5 flex-1 overflow-hidden rounded bg-canvas">
                    <span
                      className={`absolute left-0 top-0 h-full rounded ${
                        s.id === "decode" ? "bg-brand" : "bg-[var(--color-ink-faint)]"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </span>
                  <span className="w-16 shrink-0 text-right font-mono text-xs font-bold text-ink">{s.ms}ms</span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-ash bg-canvas px-3 py-2">
              <span className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">phase</span>
              <p className="text-xs font-semibold text-ink">{stage.phase}</p>
            </div>
            <div className="rounded-lg border border-ash bg-canvas px-3 py-2">
              <span className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">tokens</span>
              <p className="font-mono text-xs font-semibold text-ink">{stage.tokens}</p>
            </div>
          </div>
          <p className="mt-3 text-center text-xs font-medium text-ink-soft">{stage.detail}</p>
        </div>
      </Reveal>

      <Card tone="brand" rotate={0}>
        <Takeaway>
          Split latency into time-to-first-token vs total time, and cost into
          tokens by stage — the slow stage and the costly stage aren't always
          the same.
        </Takeaway>
      </Card>
    </Infographic>
  );
}
