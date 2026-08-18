"use client";

import { useState } from "react";
import { Infographic, InfographicHeader, Card, Takeaway } from "./primitives";
import { Reveal } from "./motion";

/**
 * AI Observability: Reliability — Lesson 7: "Privacy engineering for telemetry".
 *
 * Click-to-elaborate (CER): the six controls that let you observe an AI system
 * that handles sensitive prompts without becoming the breach surface itself.
 * Privacy spine. Reduced-motion-safe.
 */
type CtlId = "detect" | "redact" | "residency" | "tenant" | "rbac" | "audit";

interface Ctl {
  id: CtlId;
  name: string;
  enforces: string;
}

const CTRLS: readonly Ctl[] = [
  { id: "detect", name: "PII / secret detection", enforces: "Scan at the collector before storage: flag emails, card numbers, credentials. What you can't detect, you can't protect." },
  { id: "redact", name: "Redaction at the boundary", enforces: "Replace identified values with hashes or tokens at ingest; keep the dimensions (model, version), drop the identity." },
  { id: "residency", name: "Regional data residency", enforces: "Route EU PHI / financial prompts to EU-region backends; enforce in the collector, not in hopes and prayers (GDPR / HIPAA / MiFID II)." },
  { id: "tenant", name: "Tenant isolation", enforces: "Partition telemetry by tenant at storage so one customer's prompts can never surface in another's queries." },
  { id: "rbac", name: "RBAC / SSO over prompts", enforces: "Raw prompts — if kept at all — sit behind role tiers. Support sees metadata; security sees content; most roles see neither." },
  { id: "audit", name: "Immutable audit trail", enforces: "Append-only record of who queried what prompt, when. This is the evidence layer accountability and regulators require." },
];

export function PrivacyEngineeringForTelemetry() {
  const [sel, setSel] = useState<CtlId>("residency");
  const c = CTRLS.find((x) => x.id === sel)!;

  return (
    <Infographic>
      <InfographicHeader
        title="Privacy engineering for telemetry"
        subtitle="Click each control to see what it enforces on the prompt path."
      />
      <Reveal>
        <div className="rounded-2xl border border-ash bg-surface-elevated px-4 py-4 shadow-sm sm:px-6 sm:py-5">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {CTRLS.map((x) => {
              const on = x.id === sel;
              return (
                <button key={x.id} type="button" onClick={() => setSel(x.id)} aria-pressed={on}
                  className={`focus-ring rounded-lg border px-2 py-2 text-left transition-colors ${on ? "border-brand bg-brand-wash" : "border-ash bg-canvas hover:border-ash"}`}>
                  <span className={`text-[11px] font-bold leading-tight ${on ? "text-brand" : "text-ink"}`}>{x.name}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-4 rounded-lg border border-ash bg-canvas px-3 py-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">{c.name} · enforces</span>
            <p className="mt-1 text-xs font-medium text-ink">{c.enforces}</p>
          </div>
          <p className="mt-3 text-center text-xs font-medium text-ink-soft">
            The honest question: <span className="font-bold text-ink">can you observe the system without storing the prompt at all?</span> Often, yes.
          </p>
        </div>
      </Reveal>
      <Card tone="brand" rotate={0}>
        <Takeaway>
          You can observe an AI that handles sensitive data — by detecting,
          redacting, isolating, and access-controlling telemetry, and keeping an
          immutable audit trail instead of raw prompts.
        </Takeaway>
      </Card>
    </Infographic>
  );
}
