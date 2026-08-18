"use client";

import { useState } from "react";
import { Infographic, InfographicHeader, Card, Takeaway } from "./primitives";
import { Reveal } from "./motion";

/**
 * AI Observability: Reliability — Lesson 15 (capstone): "Production design review".
 *
 * Toggle-compare (CER): a naive vs hardened observability design for the
 * multi-agent financial system, judged on cost, privacy, debuggability, and
 * release safety. Closes the course by resolving the central tension — observe
 * without exposing, at scale. Reduced-motion-safe.
 */
type Mode = "naive" | "hardened";

const MODES: readonly { id: Mode; label: string }[] = [
  { id: "naive", label: "Naive design" },
  { id: "hardened", label: "Hardened design" },
];

const AXES: { k: string; naive: string; hardened: string }[] = [
  { k: "Privacy", naive: "Raw client prompts logged across regions", hardened: "Redacted at ingest; EU residency enforced; RBAC tiers" },
  { k: "Cost", naive: "100% head sampling, high-cardinality attrs", hardened: "Tail sampling, capped cardinality, exemplar traces kept" },
  { k: "Debuggability", naive: "Model-only metrics; agent loops invisible", hardened: "Agent/task + MCP spans, loop depth, budget exhaustion" },
  { k: "Release safety", naive: "Ship and hope; blame the model", hardened: "Eval gate + canary; bisect versioned variables" },
  { k: "Security", naive: "No prompt-injection or extraction detection", hardened: "OWASP signals + guardrails measured by ASR" },
];

export function CapstoneDesignReview() {
  const [mode, setMode] = useState<Mode>("naive");
  const hardened = mode === "hardened";

  return (
    <Infographic>
      <InfographicHeader
        title="Capstone: production design review"
        subtitle="Toggle the design. Observe the financial system without exposing it."
      />
      <Reveal>
        <div className="rounded-2xl border border-ash bg-surface-elevated px-4 py-4 shadow-sm sm:px-6 sm:py-5">
          <div role="group" aria-label="Design" className="mx-auto mb-4 flex w-fit gap-1 rounded-full border border-ash bg-canvas p-1">
            {MODES.map((m) => (
              <button key={m.id} type="button" onClick={() => setMode(m.id)} aria-pressed={mode === m.id}
                className={`focus-ring min-h-[32px] rounded-full px-3 py-1 text-xs font-bold transition-colors ${mode === m.id ? "bg-brand text-ink" : "text-ink-soft hover:text-ink"}`}>
                {m.label}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-1.5">
            {AXES.map((a) => (
              <div key={a.k} className={`rounded-lg border px-3 py-1.5 ${hardened ? "border-brand bg-brand-wash" : "border-[var(--color-bad)] bg-[var(--color-bad-wash)]"}`}>
                <span className={`mr-2 text-[10px] font-bold uppercase tracking-wide ${hardened ? "text-brand" : "text-[var(--color-bad)]"}`}>{a.k}</span>
                <span className="text-xs font-medium text-ink">{hardened ? a.hardened : a.naive}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-xs font-medium text-ink-soft">
            {hardened ? (
              <>Same system, now observable <span className="font-bold text-brand">and</span> safe to operate: traceable, governed, and private by construction.</>
            ) : (
              <>Observability that stores everything and reasons about nothing — a breach surface and a debugging dead-end at once.</>
            )}
          </p>
        </div>
      </Reveal>
      <Card tone="brand" rotate={0}>
        <Takeaway>
        The enterprise bar: observe quality, safety, and cost at scale — while
        keeping prompts private, releases gated, and every decision auditable.
        </Takeaway>
      </Card>
    </Infographic>
  );
}
