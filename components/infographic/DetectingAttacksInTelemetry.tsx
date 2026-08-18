"use client";

import { useState } from "react";
import { Infographic, InfographicHeader, Card, Takeaway } from "./primitives";
import { Reveal } from "./motion";

/**
 * AI Observability: Reliability — Lesson 5: "Detecting attacks in telemetry".
 *
 * Click-to-elaborate (CER): five attack patterns and the tell-tale signal each
 * leaves on the spans you already collect. Security spine. Reduced-motion-safe.
 */
type AttackId = "injection" | "exfil" | "extraction" | "membership" | "tool";

interface Attack {
  id: AttackId;
  name: string;
  tell: string;
}

const ATTACKS: readonly Attack[] = [
  { id: "injection", name: "Prompt injection", tell: "Intent-vs-action divergence: the user's prompt asked one thing, but a retrieved doc or injected text rewrote the plan. Watch plan changes and unexpected tool calls." },
  { id: "exfil", name: "Data exfiltration via output", tell: "The model returns secrets or PII it was fed or memorised. Output-side DLP and secret scanners on the completion span catch it." },
  { id: "extraction", name: "Model extraction", tell: "High-volume, near-identical queries probing the model's decision surface. Per-identity query-rate and embedding-similarity anomalies give it away." },
  { id: "membership", name: "Membership inference", tell: "Probing whether a specific record was in training — a cluster of correlated, calibrated probes. Detectable as a probe fingerprint, not a single call." },
  { id: "tool", name: "Unsafe tool parameters", tell: "A tool invoked with arguments outside policy (a delete instead of a read). Validate tool args against an allowlist on the tool span." },
];

export function DetectingAttacksInTelemetry() {
  const [sel, setSel] = useState<AttackId>("extraction");
  const a = ATTACKS.find((x) => x.id === sel)!;

  return (
    <Infographic>
      <InfographicHeader
        title="Detecting attacks in telemetry"
        subtitle="Click each attack to read the signal it leaves behind."
      />
      <Reveal>
        <div className="rounded-2xl border border-ash bg-surface-elevated px-4 py-4 shadow-sm sm:px-6 sm:py-5">
          <div className="flex flex-col gap-1.5">
            {ATTACKS.map((x) => {
              const on = x.id === sel;
              return (
                <button key={x.id} type="button" onClick={() => setSel(x.id)} aria-pressed={on}
                  className={`focus-ring rounded-lg border px-3 py-2 text-left transition-colors ${on ? "border-[var(--color-bad)] bg-[var(--color-bad-wash)]" : "border-ash bg-canvas hover:border-ash"}`}>
                  <span className={`text-xs font-bold ${on ? "text-[var(--color-bad)]" : "text-ink"}`}>{x.name}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-4 rounded-lg border border-ash bg-canvas px-3 py-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">tell-tale signal</span>
            <p className="mt-1 text-xs font-medium text-ink">{a.tell}</p>
          </div>
          <p className="mt-3 text-center text-xs font-medium text-ink-soft">
            These aren't new data sources — they're new <span className="font-bold text-ink">reads</span> on the spans, rates, and args you already record.
          </p>
        </div>
      </Reveal>
      <Card tone="brand" rotate={0}>
        <Takeaway>
          Attacks leave fingerprints on ordinary telemetry: rates, embeddings,
          and tool args. Detection is a query problem, not a new instrument.
        </Takeaway>
      </Card>
    </Infographic>
  );
}
