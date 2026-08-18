"use client";

import { useState } from "react";
import { Infographic, InfographicHeader, Card, Takeaway } from "./primitives";
import { Reveal } from "./motion";

/**
 * AI Observability: Reliability — Lesson 1: "Telemetry architecture and contracts".
 *
 * Click-to-elaborate (CER diagnostic): the pipeline stages from app to query.
 * Each stage carries a contract the next stage depends on. The learner inspects
 * each to reason about propagation, resource attributes, and ownership.
 * Reduced-motion-safe.
 */
type StageId = "app" | "sdk" | "collector" | "backend" | "query";

interface Stage {
  id: StageId;
  name: string;
  contract: string;
}

const STAGES: readonly Stage[] = [
  { id: "app", name: "Instrumented app", contract: "Emits spans with a correlation ID and resource attributes (service, version, env). Owns: correct attribute values." },
  { id: "sdk", name: "SDK / auto-instrument", contract: "Serialises to OTLP, honours the GenAI semantic conventions, propagates context across process boundaries. Owns: fidelity of the LLM attributes." },
  { id: "collector", name: "OTel collector", contract: "Receives, processes (redact, sample, batch), and routes. Owns: PII scrubbing, tail-sampling decisions, schema versioning." },
  { id: "backend", name: "Storage backend", contract: "Indexes spans/metrics/events; retention tiers (hot/warm/cold). Owns: queryability, cardinality budget, retention enforcement." },
  { id: "query", name: "Query & alerting", contract: "Serves dashboards and SLO/burn-rate evals over the stored signal. Owns: correct aggregations, alert semantics." },
];

export function TelemetryArchitectureContracts() {
  const [sel, setSel] = useState<StageId>("collector");
  const s = STAGES.find((x) => x.id === sel)!;

  return (
    <Infographic>
      <InfographicHeader
        title="Telemetry architecture and contracts"
        subtitle="Click each stage to read the contract the next stage depends on."
      />
      <Reveal>
        <div className="rounded-2xl border border-ash bg-surface-elevated px-4 py-4 shadow-sm sm:px-6 sm:py-5">
          <div className="flex flex-col gap-1.5" role="list">
            {STAGES.map((x) => {
              const on = x.id === sel;
              return (
                <button
                  key={x.id}
                  type="button"
                  role="listitem"
                  onClick={() => setSel(x.id)}
                  aria-pressed={on}
                  className={`focus-ring flex items-center gap-3 rounded-lg border px-3 py-2 text-left transition-colors ${on ? "border-brand bg-brand-wash" : "border-ash bg-canvas hover:border-ash"}`}
                >
                  <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${on ? "bg-brand text-ink" : "bg-ash text-ink-soft"}`}>
                    {STAGES.findIndex((y) => y.id === x.id) + 1}
                  </span>
                  <span className="text-xs font-semibold text-ink">{x.name}</span>
                  <span className="ml-auto text-ink-soft" aria-hidden="true">{on ? "▼" : "▶"}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-4 rounded-lg border border-ash bg-canvas px-3 py-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">contract</span>
            <p className="mt-1 text-xs font-medium text-ink">{s.contract}</p>
          </div>
        </div>
      </Reveal>
      <Card tone="brand" rotate={0}>
        <Takeaway>
          A telemetry pipeline is a chain of contracts: each stage owns one
          guarantee (propagation, fidelity, redaction, retention, semantics) the
          next depends on.
        </Takeaway>
      </Card>
    </Infographic>
  );
}
