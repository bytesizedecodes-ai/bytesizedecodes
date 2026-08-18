"use client";

import { useState } from "react";
import { Infographic, InfographicHeader, Card, Takeaway } from "./primitives";
import { Reveal } from "./motion";

/**
 * AI Observability: Reliability — Lesson 4: "AI threat model (OWASP LLM Top 10)".
 *
 * Click-to-elaborate (CER): the six OWASP LLM risks that produce observable
 * telemetry signals. Each maps to a detection signal. Security-spine anchor.
 * Reduced-motion-safe.
 */
type RiskId = "injection" | "info" | "agency" | "output" | "dos" | "supply";

interface Risk {
  id: RiskId;
  code: string;
  name: string;
  signal: string;
}

const RISKS: readonly Risk[] = [
  { id: "injection", code: "LLM01", name: "Prompt injection", signal: "Instruction-bearing tokens in a retrieved doc or user input that shift the model's plan — detectable as plan-vs-intent divergence and tool-call anomalies." },
  { id: "info", code: "LLM02", name: "Sensitive info disclosure", signal: "PII, secrets, or training-data echoes in outputs — caught by output scanners and DLP on the completion span." },
  { id: "agency", code: "LLM06", name: "Excessive agency", signal: "A tool call outside the task's scope or a privilege the prompt never granted — flag on the tool span's args vs policy." },
  { id: "output", code: "LLM05", name: "Improper output handling", signal: "Unescaped model output reaching a downstream executor (shell, SQL, HTML) — surface as unvalidated sinks, not model errors." },
  { id: "dos", code: "LLM10", name: "Unbounded consumption", signal: "Runaway token loops, huge contexts, or excessive calls — token-rate and loop-depth limits on the agent span." },
  { id: "supply", code: "LLM03", name: "Supply chain", signal: "An unvetted model, plugin, or dataset version in the path — provenance attributes on every model/dataset span." },
];

export function AIThreatModelOWASP() {
  const [sel, setSel] = useState<RiskId>("injection");
  const r = RISKS.find((x) => x.id === sel)!;

  return (
    <Infographic>
      <InfographicHeader
        title="AI threat model: the OWASP LLM Top 10"
        subtitle="Click each risk to read the telemetry signal that detects it."
      />
      <Reveal>
        <div className="rounded-2xl border border-ash bg-surface-elevated px-4 py-4 shadow-sm sm:px-6 sm:py-5">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {RISKS.map((x) => {
              const on = x.id === sel;
              return (
                <button key={x.id} type="button" onClick={() => setSel(x.id)} aria-pressed={on}
                  className={`focus-ring rounded-lg border px-2 py-2 text-left transition-colors ${on ? "border-[var(--color-bad)] bg-[var(--color-bad-wash)]" : "border-ash bg-canvas hover:border-ash"}`}>
                  <span className={`block font-mono text-[10px] font-bold ${on ? "text-[var(--color-bad)]" : "text-ink-soft"}`}>{x.code}</span>
                  <span className="text-[11px] font-bold leading-tight text-ink">{x.name}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-4 rounded-lg border border-[var(--color-bad)] bg-[var(--color-bad-wash)] px-3 py-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-bad)]">{r.code} · detection signal</span>
            <p className="mt-1 text-xs font-medium text-ink">{r.signal}</p>
          </div>
          <p className="mt-3 text-center text-xs font-medium text-ink-soft">
            Security here is detection-led: each risk maps to a span attribute or rate you already collect.
          </p>
        </div>
      </Reveal>
      <Card tone="brand" rotate={0}>
        <Takeaway>
          Treat the OWASP LLM Top 10 as a detection map: every risk has a
          telemetry signal — instrument for it rather than hoping the model behaves.
        </Takeaway>
      </Card>
    </Infographic>
  );
}
