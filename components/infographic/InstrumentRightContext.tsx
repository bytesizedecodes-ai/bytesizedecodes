"use client";

import { useState } from "react";
import { Infographic, InfographicHeader, Card, Takeaway } from "./primitives";
import { Reveal } from "./motion";

/**
 * LLM Observability — Lesson 2: "Instrument the right context".
 *
 * Schema-builder (PIC constructive beat): the learner toggles candidate span
 * attributes on/off and reads the debugging and privacy consequences of each
 * choice. Three verdicts — useful (brand), privacy risk (semantic red), and
 * noise (neutral) — teach the difference between high-value dimensions,
 * dangerous fields, and high-cardinality clutter. Reduced-motion-safe.
 */
type FieldId =
  | "model"
  | "prompt-version"
  | "retrieval-version"
  | "tool-name"
  | "raw-prompt"
  | "user-email";

interface Field {
  id: FieldId;
  label: string;
  verdict: "useful" | "privacy" | "noise";
  note: string;
}

const FIELDS: readonly Field[] = [
  { id: "model", label: "model id", verdict: "useful", note: "Essential: without it you can't compare one model against another." },
  { id: "prompt-version", label: "prompt version", verdict: "useful", note: "Essential: the single most-changed variable — tag every span with it." },
  { id: "retrieval-version", label: "retrieval version", verdict: "useful", note: "Worth it: separates retrieval regressions from model regressions." },
  { id: "tool-name", label: "tool name", verdict: "useful", note: "Essential for agents: tool errors otherwise look like model errors." },
  { id: "raw-prompt", label: "raw prompt text", verdict: "privacy", note: "Dangerous: raw prompts carry PII and secrets. Sample or redact, never store wholesale." },
  { id: "user-email", label: "user email", verdict: "privacy", note: "Dangerous: PII and high-cardinality. Use an opaque tenant id instead." },
];

const DEFAULTS: Record<FieldId, boolean> = {
  model: true,
  "prompt-version": true,
  "retrieval-version": false,
  "tool-name": true,
  "raw-prompt": false,
  "user-email": false,
};

const VERDICT_LABEL: Record<Field["verdict"], string> = {
  useful: "useful",
  privacy: "privacy risk",
  noise: "noise",
};

export function InstrumentRightContext() {
  const [on, setOn] = useState<Record<FieldId, boolean>>(DEFAULTS);

  const toggle = (id: FieldId) => setOn((prev) => ({ ...prev, [id]: !prev[id] }));

  const privacyRisks = FIELDS.filter((f) => f.verdict === "privacy" && on[f.id]);
  const missingEssential = FIELDS.filter(
    (f) => f.verdict === "useful" && (f.id === "model" || f.id === "prompt-version") && !on[f.id],
  );

  return (
    <Infographic>
      <InfographicHeader
        title="Instrument the right context"
        subtitle="Toggle fields into your span contract and read what each choice costs."
      />

      <Reveal>
        <div className="rounded-2xl border border-ash bg-surface-elevated px-4 py-4 shadow-sm sm:px-6 sm:py-5">
          <div className="flex flex-col gap-1.5">
            {FIELDS.map((f) => {
              const isOn = on[f.id];
              const bad = f.verdict === "privacy";
              const tone = f.verdict === "privacy"
                ? "border-[var(--color-bad)]"
                : f.verdict === "useful"
                  ? "border-brand"
                  : "border-ash";
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => toggle(f.id)}
                  aria-pressed={isOn}
                  className={`focus-ring flex items-center gap-3 rounded-lg border px-3 py-2 text-left transition-colors ${
                    isOn ? `${tone} bg-canvas` : "border-ash opacity-60 hover:opacity-100"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border text-[10px] font-bold ${
                      isOn
                        ? bad
                          ? "border-[var(--color-bad)] bg-[var(--color-bad)] text-canvas"
                          : "border-brand bg-brand text-ink"
                        : "border-ash bg-canvas text-transparent"
                    }`}
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  <span className="flex-1 text-xs font-semibold text-ink">{f.label}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${
                      f.verdict === "privacy"
                        ? "bg-[var(--color-bad-wash)] text-[var(--color-bad)]"
                        : f.verdict === "useful"
                          ? "bg-brand-wash text-brand"
                          : "bg-ash text-ink-soft"
                    }`}
                  >
                    {VERDICT_LABEL[f.verdict]}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 rounded-lg border border-ash bg-canvas px-3 py-2.5">
            <p className="text-xs font-medium text-ink-soft">
              {privacyRisks.length > 0 ? (
                <span className="font-bold text-[var(--color-bad)]">
                  ⚠ Your contract logs {privacyRisks.map((f) => f.label).join(", ")} — PII or secret exposure risk.
                </span>
              ) : missingEssential.length > 0 ? (
                <span className="font-bold text-ink">
                  Missing essential context: {missingEssential.map((f) => f.label).join(", ")}.
                </span>
              ) : (
                <span className="font-bold text-brand">Clean: useful dimensions, no PII, no noise.</span>
              )}
            </p>
          </div>
        </div>
      </Reveal>

      <Card tone="brand" rotate={0}>
        <Takeaway>
          Instrument the few dimensions that explain a change (model, prompt,
          retrieval, tool) — and keep raw prompts and identities out.
        </Takeaway>
      </Card>
    </Infographic>
  );
}
