"use client";

import { useState } from "react";
import { Infographic, InfographicHeader, Card, Takeaway } from "./primitives";
import { Reveal } from "./motion";

/**
 * AI Observability: Reliability — Lesson 6: "Guardrails and safety signals".
 *
 * Toggle-compare (CER counter-example): with vs without input/output guardrails,
 * and — honestly — that guardrails are evadable. Teaches measuring attack-success
 * rate rather than assuming a guardrail is a guarantee. Security spine.
 * Reduced-motion-safe.
 */
type Mode = "none" | "rail";

const MODES: readonly { id: Mode; label: string }[] = [
  { id: "none", label: "No guardrail" },
  { id: "rail", label: "Input + output guardrail" },
];

const VIEW: Record<Mode, { caught: string; evaded: string; tone: "bad" | "brand"; note: string }> = {
  none: { caught: "0%", evaded: "100%", tone: "bad", note: "Every jailbreak and harmful output ships. There is no signal to measure because there is no check." },
  rail: { caught: "94%", evaded: "~6%", tone: "brand", note: "Input and output rails (NeMo, Lakera, Guardrails AI) catch most known patterns — but published evasions still succeed a meaningful fraction of the time. Measure ASR; don't assume safety." },
};

export function GuardrailsAndSafetySignals() {
  const [mode, setMode] = useState<Mode>("none");
  const v = VIEW[mode];
  const bad = v.tone === "bad";

  return (
    <Infographic>
      <InfographicHeader
        title="Guardrails and safety signals"
        subtitle="Toggle the guardrail on. What does it catch — and what still gets through?"
      />
      <Reveal>
        <div className="rounded-2xl border border-ash bg-surface-elevated px-4 py-4 shadow-sm sm:px-6 sm:py-5">
          <div role="group" aria-label="Guardrail" className="mx-auto mb-4 flex w-fit gap-1 rounded-full border border-ash bg-canvas p-1">
            {MODES.map((m) => (
              <button key={m.id} type="button" onClick={() => setMode(m.id)} aria-pressed={mode === m.id}
                className={`focus-ring min-h-[32px] rounded-full px-3 py-1 text-xs font-bold transition-colors ${mode === m.id ? "bg-brand text-ink" : "text-ink-soft hover:text-ink"}`}>
                {m.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-ash bg-canvas px-3 py-2 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">caught</span>
              <div className="font-mono text-2xl font-bold text-brand">{v.caught}</div>
            </div>
            <div className={`rounded-lg border px-3 py-2 text-center ${bad ? "border-[var(--color-bad)] bg-[var(--color-bad-wash)]" : "border-ash bg-canvas"}`}>
              <span className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">evaded (ASR)</span>
              <div className={`font-mono text-2xl font-bold ${bad ? "text-[var(--color-bad)]" : "text-ink"}`}>{v.evaded}</div>
            </div>
          </div>
          <p className="mt-3 text-center text-xs font-medium text-ink-soft">{v.note}</p>
        </div>
      </Reveal>
      <Card tone="brand" rotate={0}>
        <Takeaway>
          A guardrail raises the bar; it isn't a wall. Treat its attack-success
          rate as a production metric you drive down, not a checkbox.
        </Takeaway>
      </Card>
    </Infographic>
  );
}
