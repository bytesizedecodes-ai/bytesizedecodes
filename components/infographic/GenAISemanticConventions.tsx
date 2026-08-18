"use client";

import { useState } from "react";
import { Infographic, InfographicHeader, Card, Takeaway } from "./primitives";
import { Reveal } from "./motion";

/**
 * AI Observability: Reliability — Lesson 2: "GenAI semantic conventions in practice".
 *
 * Toggle-compare (CER): the same LLM span described by OpenTelemetry GenAI
 * attributes vs OpenInference attributes. They overlap; the verdict is
 * extend-don't-fork and dual-emit for vendor neutrality. Reduced-motion-safe.
 */
type Mode = "otel" | "openinference";

const MODES: readonly { id: Mode; label: string }[] = [
  { id: "otel", label: "OTel GenAI" },
  { id: "openinference", label: "OpenInference" },
];

const ATTRS: Record<Mode, { k: string; note: string }[]> = {
  otel: [
    { k: "gen_ai.system", note: "provider (openai, anthropic, …)" },
    { k: "gen_ai.request.model", note: "model id" },
    { k: "gen_ai.usage.input_tokens", note: "prompt tokens" },
    { k: "gen_ai.usage.output_tokens", note: "completion tokens" },
    { k: "gen_ai.response.finish_reason", note: "stop/length/tool" },
  ],
  openinference: [
    { k: "llm.model_name", note: "model id" },
    { k: "llm.token_count.prompt", note: "prompt tokens" },
    { k: "llm.token_count.completion", note: "completion tokens" },
    { k: "openinference.span.kind", note: "LLM / TOOL / RETRIEVER / AGENT" },
    { k: "input.value / output.value", note: "prompt + completion content" },
  ],
};

export function GenAISemanticConventions() {
  const [mode, setMode] = useState<Mode>("otel");

  return (
    <Infographic>
      <InfographicHeader
        title="GenAI semantic conventions in practice"
        subtitle="Toggle between OTel GenAI and OpenInference for the same LLM span."
      />
      <Reveal>
        <div className="rounded-2xl border border-ash bg-surface-elevated px-4 py-4 shadow-sm sm:px-6 sm:py-5">
          <div role="group" aria-label="Convention" className="mx-auto mb-4 flex w-fit gap-1 rounded-full border border-ash bg-canvas p-1">
            {MODES.map((m) => (
              <button key={m.id} type="button" onClick={() => setMode(m.id)} aria-pressed={mode === m.id}
                className={`focus-ring min-h-[32px] rounded-full px-3 py-1 text-xs font-bold transition-colors ${mode === m.id ? "bg-brand text-ink" : "text-ink-soft hover:text-ink"}`}>
                {m.label}
              </button>
            ))}
          </div>
          <pre className="overflow-x-auto rounded-lg border border-ash bg-canvas px-3 py-2.5 font-mono text-[11px] leading-relaxed text-ink sm:text-[12px]">
            <code>
              {ATTRS[mode].map((a) => `${a.k}\n`).join("")}
            </code>
          </pre>
          <ul className="mt-3 space-y-1">
            {ATTRS[mode].map((a) => (
              <li key={a.k} className="text-[11px] font-medium text-ink-soft">
                <span className="font-mono font-bold text-ink">{a.k}</span> — {a.note}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-center text-xs font-medium text-ink-soft">
            Two conventions, one span. <span className="font-bold text-brand">Extend, don't fork</span> — dual-emit to stay portable while OTel GenAI stabilises.
          </p>
        </div>
      </Reveal>
      <Card tone="brand" rotate={0}>
        <Takeaway>
          Standards are converging, not converged. Emit OTel GenAI for portability
          and OpenInference for tool richness; never fork a private schema.
        </Takeaway>
      </Card>
    </Infographic>
  );
}
