"use client";

import { useState } from "react";
import { Infographic, InfographicHeader, Card, Takeaway } from "./primitives";
import { Reveal } from "./motion";

/**
 * LLM Observability — Lesson 1: "From a request to a trace".
 *
 * Click-to-elaborate (PIC investigate beat): a single user turn becomes one
 * trace of nested spans. The learner clicks each span to read what context it
 * carries and how much of the trace it owns. The LLM call is the slow span —
 * shown by bar length + brand fill (length carries meaning, not colour).
 * Reduced-motion-safe: state carries meaning, not motion.
 */
type StepId = "request" | "retrieval" | "llm" | "tool" | "response";

interface Step {
  id: StepId;
  name: string;
  ms: number;
  kind: string;
  detail: string;
}

const STEPS: readonly Step[] = [
  {
    id: "request",
    name: "User request",
    ms: 4,
    kind: "root span",
    detail:
      "The whole turn starts here. A correlation ID on this root ties every child span back to one user request, so a single conversation is reconstructable end-to-end.",
  },
  {
    id: "retrieval",
    name: "Retrieve docs",
    ms: 70,
    kind: "child span",
    detail:
      "Vector search returns context. Tagging the retrieval version and hit count here is what lets you blame retrieval — not the model — when answers go stale.",
  },
  {
    id: "llm",
    name: "LLM call",
    ms: 860,
    kind: "child span",
    detail:
      "The model generates the answer: the slow, costly span. Instrument model id, prompt version, tokens in/out, and finish reason here.",
  },
  {
    id: "tool",
    name: "Tool call",
    ms: 120,
    kind: "child span",
    detail:
      "The model invoked a tool (a billing lookup, say). Record tool name, args, and success/failure — a tool error otherwise masquerades as a model error.",
  },
  {
    id: "response",
    name: "Send response",
    ms: 6,
    kind: "child span",
    detail:
      "The answer returns to the user. Pair this timestamp with the request to measure true user-facing latency, not just model latency.",
  },
];

const TOTAL_MS = STEPS.reduce((sum, s) => sum + s.ms, 0);
const MAX_MS = Math.max(...STEPS.map((s) => s.ms));

export function RequestToTrace() {
  const [sel, setSel] = useState<StepId>("llm");
  const step = STEPS.find((s) => s.id === sel)!;
  const share = Math.round((step.ms / TOTAL_MS) * 100);
  const slow = sel === "llm";

  return (
    <Infographic>
      <InfographicHeader
        title="From one request to one trace"
        subtitle="Click each step to follow a single user turn end-to-end."
      />

      <Reveal>
        <div className="rounded-2xl border border-ash bg-surface-elevated px-4 py-4 shadow-sm sm:px-6 sm:py-5">
          <div className="flex flex-col gap-1.5" role="list">
            {STEPS.map((s) => {
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
                        s.id === "llm" ? "bg-brand" : "bg-[var(--color-ink-faint)]"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </span>
                  <span className="w-14 shrink-0 text-right font-mono text-xs font-bold text-ink">{s.ms} ms</span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 rounded-lg border border-ash bg-canvas px-3 py-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wide text-ink-soft">{step.kind}</span>
              <span className="font-mono text-xs font-bold text-brand">{share}% of the trace</span>
            </div>
            <p className="mt-1 text-xs font-medium text-ink">{step.detail}</p>
          </div>

          <p className="mt-3 text-center text-xs font-medium text-ink-soft">
            {slow ? (
              <>
                The <span className="font-bold text-brand">LLM call</span> dominates this turn — the obvious first place to look when latency spikes.
              </>
            ) : (
              <>Every step is a span nested under the request root. Together they reconstruct one full user turn.</>
            )}
          </p>
        </div>
      </Reveal>

      <Card tone="brand" rotate={0}>
        <Takeaway>
          A trace is one request broken into nested spans — each carrying the
          context (model, prompt, retrieval, tool) that turns a slow turn into a
          diagnosed turn.
        </Takeaway>
      </Card>
    </Infographic>
  );
}
