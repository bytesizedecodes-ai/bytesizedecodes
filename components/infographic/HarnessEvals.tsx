"use client";

import { useState } from "react";
import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "./primitives";
import { Scene } from "./scenes";
import { Reveal } from "./motion";

/**
 * Harness Engineering: In Practice — Lesson 8: "Intro to Harness Evals".
 *
 * Interactive toggle-compare (MetricsDashboard pattern): Relay's harness v1 vs
 * v2 across a 5-task suite. The learner toggles variants and reads the board —
 * including the case v2 STILL fails, which is the lesson: a suite tells you
 * what changed AND what remains broken. Feedback contract: the tempting wrong
 * conclusion is "v2 demoed nicer, ship it"; the board shows a still-failing
 * hallucination case that a demo would never surface. Constrained presets
 * (two buttons), real buttons, aria-pressed, state-based (reduced-motion
 * safe). Brand accent; good/bad only for pass/fail marks.
 */

type Variant = "v1" | "v2";

const SUITE: {
  task: string;
  note: string;
  results: Record<Variant, boolean>;
}[] = [
  { task: "Refund under €200 → issued", note: "the happy path", results: { v1: true, v2: true } },
  { task: "Refund over €200 → needs approval", note: "v1 promised it outright — the May incident", results: { v1: false, v2: true } },
  { task: "Order number cited in answer", note: "format rule held in both", results: { v1: true, v2: true } },
  { task: "Angry customer acknowledged first", note: "tone held in both", results: { v1: true, v2: true } },
  { task: "Policy quote is real (no invented clause)", note: "still failing in BOTH — the demo never shows this", results: { v1: false, v2: false } },
];

export function HarnessEvals() {
  const [variant, setVariant] = useState<Variant>("v1");

  const passed = SUITE.filter((t) => t.results[variant]).length;
  const pct = Math.round((passed / SUITE.length) * 100);

  return (
    <Infographic>
      <InfographicHeader
        title="The demo vs the suite"
        subtitle="Toggle between Relay's two harness versions — then read the whole board before you ship."
      />

      {/* Scene 1 — the suite board */}
      <Scene caption="① One prompt change, five tasks, both versions">
        <div className="rounded-2xl border border-ash bg-surface-elevated px-4 py-4 shadow-sm">
          {/* variant toggle */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-[11px] font-bold uppercase tracking-wide text-ink-soft">
              Harness:
            </span>
            {(["v1", "v2"] as Variant[]).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setVariant(v)}
                aria-pressed={variant === v}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors focus-ring ${
                  variant === v
                    ? "border-brand bg-brand text-canvas"
                    : "border-ash bg-surface-elevated text-ink hover:bg-brand-wash"
                }`}
              >
                {v === "v1" ? "v1 · current" : "v2 · prompt change"}
              </button>
            ))}
          </div>

          {/* the board */}
          <ul className="mt-3 space-y-1.5">
            {SUITE.map((t) => {
              const ok = t.results[variant];
              const otherOk = t.results[variant === "v1" ? "v2" : "v1"];
              return (
                <li
                  key={t.task}
                  className={`flex items-center gap-3 rounded-xl border px-3 py-2 ${
                    ok ? "border-ash bg-canvas" : "border-[var(--color-bad)] bg-[var(--color-bad-wash)]"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`shrink-0 font-mono text-sm font-bold ${
                      ok ? "text-good" : "text-[var(--color-bad)]"
                    }`}
                  >
                    {ok ? "✓" : "✗"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold leading-snug text-ink sm:text-[13px]">
                      {t.task}
                    </div>
                    <div className="text-[10.5px] font-medium leading-snug text-ink-soft">{t.note}</div>
                  </div>
                  {!ok && otherOk && (
                    <span className="shrink-0 rounded-full border border-ash bg-surface-elevated px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-ink-soft">
                      fixed in v2
                    </span>
                  )}
                </li>
              );
            })}
          </ul>

          {/* the counters */}
          <div className="mt-3 flex items-center justify-between rounded-xl bg-ash px-3 py-2">
            <span className="text-[11px] font-bold uppercase tracking-wide text-ink-soft">
              {variant} pass rate
            </span>
            <span className={`font-mono text-sm font-bold ${pct >= 80 ? "text-good" : "text-[var(--color-bad)]"}`}>
              {passed}/{SUITE.length} · {pct}%
            </span>
          </div>

          <p className="mt-3 text-center text-xs font-medium leading-relaxed text-ink">
            {variant === "v1"
              ? "v1 passes the demo and fails the incident case. A demo would never tell you."
              : "v2 fixes the refund case — and still hallucinates a policy clause. Would you have caught that in a demo?"}
          </p>
        </div>
      </Scene>

      {/* Scene 2 — what a suite is */}
      <Scene caption="② The smallest honest eval">
        <Reveal>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <SuitePart n={1} title="Tasks from reality" note="past tickets, real phrasings — not 'test 1'" />
            <SuitePart n={2} title="A checkable result" note="pass/fail per task, judged by rule or by an LLM judge" accent />
            <SuitePart n={3} title="Run on every change" note="prompt, model, or tool edits — the suite gates them all" />
          </div>
        </Reveal>
      </Scene>

      {/* Scene 3 — the resolution */}
      <Scene caption="③ Evals before features">
        <div className="rounded-xl border border-brand bg-brand-wash px-4 py-4 text-center">
          <p className="text-sm font-medium leading-relaxed text-ink sm:text-base">
            The suite has one job: turn <span className="font-bold">&ldquo;it feels better&rdquo;</span> into{" "}
            <span className="font-bold">&ldquo;here is exactly what changed — and what still fails.&rdquo;</span>
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The takeaway</CardTitle>
        <Takeaway>
          Judge harness changes with a task suite and pass rates — a demo shows the best
          case; a suite shows the whole board.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

/** One numbered ingredient of the smallest honest eval. */
function SuitePart({
  n,
  title,
  note,
  accent = false,
}: {
  n: number;
  title: string;
  note: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 text-center shadow-sm ${
        accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"
      }`}
    >
      <span
        aria-hidden="true"
        className="mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-ink text-[11px] font-bold text-canvas"
      >
        {n}
      </span>
      <div className="mt-2 text-sm font-bold text-ink">{title}</div>
      <p className="mt-1 text-[11px] font-medium leading-relaxed text-ink-soft">{note}</p>
    </div>
  );
}
