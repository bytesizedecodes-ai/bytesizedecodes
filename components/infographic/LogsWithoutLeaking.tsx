"use client";

import { useState } from "react";
import { Infographic, InfographicHeader, Card, Takeaway } from "./primitives";
import { Reveal } from "./motion";

/**
 * LLM Observability — Lesson 3: "Logs that help without leaking data".
 *
 * Toggle-compare (PIC): the same support turn, logged two ways. "Leaky" stores
 * the raw prompt with an email and card number; "Safe" redacts, hashes the
 * identity, and keeps the useful dimensions. The leaked PII is the single
 * semantic anomaly (red). Operator-level foothold for the privacy spine.
 * Reduced-motion-safe.
 */
type Mode = "leaky" | "safe";

const MODES: readonly { id: Mode; label: string }[] = [
  { id: "leaky", label: "Leaky log" },
  { id: "safe", label: "Safe log" },
];

// Illustrative only. The "leaky" values carry PII; the "safe" ones redact it.
const LEAKY: readonly { k: string; v: string; pii?: boolean }[] = [
  { k: "user", v: "john.doe@acme.com", pii: true },
  { k: "prompt", v: "Hi, my card is 4111 1111 1111 1111, please reset my password", pii: true },
  { k: "model", v: "gpt-4o" },
  { k: "answer", v: "Sure — I've texted a reset link to your phone.", pii: true },
];

const SAFE: readonly { k: string; v: string }[] = [
  { k: "user", v: "<hash:9f3a>" },
  { k: "prompt", v: "<redacted · 42 tokens>" },
  { k: "model", v: "gpt-4o" },
  { k: "prompt_version", v: "v17" },
  { k: "answer", v: "<sampled · evalqueued>" },
];

export function LogsWithoutLeaking() {
  const [mode, setMode] = useState<Mode>("leaky");
  const leaky = mode === "leaky";

  return (
    <Infographic>
      <InfographicHeader
        title="Logs that help without leaking data"
        subtitle="Toggle between a leaky and a safe log for the same support turn."
      />

      <Reveal>
        <div className="rounded-2xl border border-ash bg-surface-elevated px-4 py-4 shadow-sm sm:px-6 sm:py-5">
          <div
            role="group"
            aria-label="Log mode"
            className="mx-auto mb-4 flex w-fit gap-1 rounded-full border border-ash bg-canvas p-1"
          >
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMode(m.id)}
                aria-pressed={mode === m.id}
                className={`focus-ring min-h-[32px] rounded-full px-3 py-1 text-xs font-bold transition-colors ${
                  mode === m.id ? "bg-brand text-ink" : "text-ink-soft hover:text-ink"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <pre
            className={`overflow-x-auto rounded-lg border px-3 py-2.5 font-mono text-[11px] leading-relaxed sm:text-[12px] ${
              leaky ? "border-[var(--color-bad)] bg-[var(--color-bad-wash)]" : "border-ash bg-canvas"
            }`}
          >
            <code className="text-ink">
              {leaky
                ? "{\n" +
                  LEAKY.map((row) => `  "${row.k}": "${row.v}"`).join(",\n") +
                  "\n}"
                : "{\n" +
                  SAFE.map((row) => `  "${row.k}": "${row.v}"`).join(",\n") +
                  "\n}"}
            </code>
          </pre>

          <p className="mt-3 text-center text-xs font-medium text-ink-soft">
            {leaky ? (
              <>
                Emails, card numbers, even the answer channel — all sitting in a
                log anyone with access can read.{" "}
                <span className="font-bold text-[var(--color-bad)]">That's a breach waiting to happen.</span>
              </>
            ) : (
              <>
                Same debugging value (model, prompt version, sampled answer) — but{" "}
                <span className="font-bold text-brand">no PII leaves the request path.</span>
              </>
            )}
          </p>
        </div>
      </Reveal>

      <Card tone="brand" rotate={0}>
        <Takeaway>
          Redact and minimise first: log the dimensions you need to debug, never
          the raw prompt or the identity behind a request.
        </Takeaway>
      </Card>
    </Infographic>
  );
}
