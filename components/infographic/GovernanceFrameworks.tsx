"use client";

import { useState } from "react";
import { Infographic, InfographicHeader, Card, Takeaway } from "./primitives";
import { Reveal } from "./motion";

/**
 * AI Observability: Reliability — Lesson 8: "Governance frameworks".
 *
 * Click-to-elaborate (CER): four governance frameworks and how observability
 * signals map to their controls. Framed as system-lifecycle work, not a checklist.
 * Reduced-motion-safe.
 */
type FwId = "eu" | "nist" | "iso" | "srm";

interface Fw {
  id: FwId;
  name: string;
  requires: string;
  mapsTo: string;
}

const FRAMES: readonly Fw[] = [
  { id: "eu", name: "EU AI Act", requires: "Risk-classify the system; high-risk duties include traceability, human oversight, and auditability.", mapsTo: "Traces + audit trail ARE the traceability and auditability evidence; quality SLOs feed oversight." },
  { id: "nist", name: "NIST AI RMF", requires: "Govern, Map, Measure, Manage risks across the lifecycle.", mapsTo: "Measure = your eval/drift/SLO signals; Manage = alerts, runbooks, rollback; Govern = who owns each." },
  { id: "iso", name: "ISO/IEC 42001", requires: "An AI management system: objectives, risk treatment, continual improvement.", mapsTo: "The telemetry pipeline + SLO review cadence is the evidence an auditor samples." },
  { id: "srm", name: "SR 11-7 (model risk)", requires: "Model risk management inherited from banking: validation, monitoring, change control.", mapsTo: "Eval gates before deploy = validation; drift + online eval = ongoing monitoring; versioned releases = change control." },
];

export function GovernanceFrameworks() {
  const [sel, setSel] = useState<FwId>("eu");
  const f = FRAMES.find((x) => x.id === sel)!;

  return (
    <Infographic>
      <InfographicHeader
        title="Governance frameworks"
        subtitle="Click each framework. What it requires, and how your telemetry already maps to it."
      />
      <Reveal>
        <div className="rounded-2xl border border-ash bg-surface-elevated px-4 py-4 shadow-sm sm:px-6 sm:py-5">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {FRAMES.map((x) => {
              const on = x.id === sel;
              return (
                <button key={x.id} type="button" onClick={() => setSel(x.id)} aria-pressed={on}
                  className={`focus-ring rounded-lg border px-2 py-2 text-left transition-colors ${on ? "border-brand bg-brand-wash" : "border-ash bg-canvas hover:border-ash"}`}>
                  <span className={`text-[11px] font-bold leading-tight ${on ? "text-brand" : "text-ink"}`}>{x.name}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="rounded-lg border border-ash bg-canvas px-3 py-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">requires</span>
              <p className="mt-1 text-xs font-medium text-ink">{f.requires}</p>
            </div>
            <div className="rounded-lg border border-brand bg-brand-wash px-3 py-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wide text-brand">telemetry maps to</span>
              <p className="mt-1 text-xs font-medium text-ink">{f.mapsTo}</p>
            </div>
          </div>
          <p className="mt-3 text-center text-xs font-medium text-ink-soft">
            Governance isn't a checklist at the end — it's the lifecycle your eval, drift, SLO, and audit signals already describe.
          </p>
        </div>
      </Reveal>
      <Card tone="brand" rotate={0}>
        <Takeaway>
          EU AI Act, NIST AI RMF, ISO 42001, and SR 11-7 all reduce to the same
          ask: prove you can trace, measure, and control the system. Observability
          is that proof.
        </Takeaway>
      </Card>
    </Infographic>
  );
}
