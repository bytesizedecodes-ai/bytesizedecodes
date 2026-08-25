"use client";

import { useState } from "react";
import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "./primitives";
import { Scene, StoryMap } from "./scenes";
import { ToggleGroup } from "./controls";

/**
 * RAG Engineering Foundations — Lesson 5: "The RAG Pipeline, End to End"
 * (v2 Thread retrofit)
 *
 * Through-line stage: the conveyor every ZapKart question rides. The stepper
 * (the course's one primary widget) sits on the tension beat: the tempting
 * wrong idea is "the AI searches the docs live"; stepping through exposes the
 * stages and that the model only ever sees what reaches the envelope. The
 * closing scene shows the envelope itself — what the model actually receives.
 * Presets are Ravi's damaged-box refund and the Berlin delivery, both carried
 * from earlier lessons.
 */

const QUESTIONS = {
  refund: {
    label: "Ravi's damaged box",
    question: "Can I get my money back if the box arrived damaged?",
    steps: [
      { phase: "Ask", line: "Ravi's question arrives — plain words, nothing else" },
      { phase: "Embed", line: "the question is plotted on the meaning map — money & refunds street" },
      { phase: "Search", line: "every indexed page is measured; hundreds get ranked by distance" },
      { phase: "Top-3", line: "kept: policy-refunds p2 · faq-returns p1 · policy-payments p4" },
      { phase: "Context", line: "the three pages + the question are placed in the window" },
      { phase: "Answer", line: "\u201cYes — full refund within 14 days of delivery. [policy-refunds §2]\u201d" },
    ],
  },
  delivery: {
    label: "Berlin delivery time",
    question: "How long does delivery to Berlin take?",
    steps: [
      { phase: "Ask", line: "the customer's question arrives — plain words, nothing else" },
      { phase: "Embed", line: "plotted on shipping street — a different neighborhood entirely" },
      { phase: "Search", line: "ranked by distance; refund pages now land far away" },
      { phase: "Top-3", line: "kept: shipping-times p1 · eu-delivery faq p3 · tracking p2" },
      { phase: "Context", line: "the three pages + the question are placed in the window" },
      { phase: "Answer", line: "\u201c2–4 working days to Berlin, tracked. [shipping-times p1]\u201d" },
    ],
  },
} as const;

type QKey = keyof typeof QUESTIONS;

export function RagPipeline() {
  const [q, setQ] = useState<QKey>("refund");
  const [step, setStep] = useState(0);

  const current = QUESTIONS[q];
  const finished = step >= current.steps.length;
  const visible = current.steps.slice(0, step);

  return (
    <Infographic>
      <InfographicHeader
        title="One question's journey, step by step"
        subtitle="Pick a question, then press “Next step” — and watch what the model actually receives."
      />

      <StoryMap
        steps={[
          { icon: <span aria-hidden="true">🎫</span>, label: "A question checks in" },
          { icon: <span aria-hidden="true">🔄</span>, label: "The machine runs" },
          { icon: <span aria-hidden="true">✉️</span>, label: "The envelope is sealed" },
        ]}
      />

      {/* Anchor — the belt, three stations every question rides */}
      <Scene caption="So every ZapKart question rides the same belt — question in, envelope sealed, answer out.">
        <div className="mx-auto max-w-lg">
          <div className="flex items-end justify-center gap-2 sm:gap-4">
            <div className="flex flex-col items-center gap-1 rounded-xl border border-ash bg-surface-elevated px-3 py-2 shadow-sm">
              <span className="text-xl" aria-hidden="true">💬</span>
              <span className="text-[10px] font-bold text-ink-soft">a question checks in</span>
            </div>
            <div className="flex flex-col items-center gap-1 rounded-xl border border-brand bg-brand-wash px-3 py-2 shadow-sm">
              <span className="text-xl" aria-hidden="true">✉️</span>
              <span className="text-[10px] font-bold text-brand-deep">3 pages tucked in</span>
            </div>
            <div className="flex flex-col items-center gap-1 rounded-xl border border-ash bg-surface-elevated px-3 py-2 shadow-sm">
              <span className="text-xl" aria-hidden="true">🤖</span>
              <span className="text-[10px] font-bold text-ink-soft">answers, with a citation</span>
            </div>
          </div>
          {/* the belt itself — rollers under the stations */}
          <div className="mt-1 flex h-3 items-center rounded-full border border-ash bg-canvas px-3" aria-hidden="true">
            <div className="flex w-full justify-around">
              <span className="h-1.5 w-1.5 rounded-full bg-ash" />
              <span className="h-1.5 w-1.5 rounded-full bg-ash" />
              <span className="h-1.5 w-1.5 rounded-full bg-ash" />
              <span className="h-1.5 w-1.5 rounded-full bg-ash" />
            </div>
          </div>
          <p className="mt-2 text-center text-[11px] font-medium text-ink-soft">
            same stations, every question — the stepper below runs them one by one
          </p>
        </div>
      </Scene>

      {/* Tension — the stepper, the course's one primary widget */}
      <Scene variant="continue" caption="Then run one yourself — press Next step, and watch what arrives.">
        <div className="rounded-2xl border border-ash bg-surface-elevated px-4 py-4 shadow-sm">
          {/* question presets */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-[11px] font-bold uppercase tracking-wide text-ink-soft">Question:</span>
            <ToggleGroup<QKey>
              label="Which question rides the belt"
              value={q}
              onChange={(key) => {
                setQ(key);
                setStep(0);
              }}
              options={[
                { value: "refund", label: QUESTIONS.refund.label },
                { value: "delivery", label: QUESTIONS.delivery.label },
              ]}
            />
          </div>

          <p className="mt-3 rounded-xl bg-ash px-3 py-2 text-xs font-semibold text-ink sm:text-[13px]">
            🙋 &ldquo;{current.question}&rdquo;
          </p>

          {/* the trace log */}
          <ol className="mt-3 min-h-[8rem] space-y-1.5" aria-live="polite">
            {visible.map((s, i) => (
              <li key={i} className="flex items-center gap-2 text-xs font-medium text-ink sm:text-[13px]">
                <span className="w-4 shrink-0 text-right font-mono text-[10px] text-ink-faint">{i + 1}</span>
                <span className="rounded-full border border-ash bg-surface-elevated px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand">
                  {s.phase}
                </span>
                <span className="break-words">{s.line}</span>
              </li>
            ))}
            {visible.length === 0 && (
              <li className="text-xs font-medium text-ink-soft">
                Nothing has happened yet. Press &ldquo;Next step&rdquo;.
              </li>
            )}
          </ol>

          {/* controls */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              disabled={finished}
              className="rounded-full border border-brand bg-brand px-4 py-2 text-sm font-bold text-canvas transition-opacity focus-ring disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next step ▸
            </button>
            <button
              type="button"
              onClick={() => setStep(0)}
              className="rounded-full border border-ash bg-surface-elevated px-3.5 py-2 text-xs font-bold text-ink hover:bg-ash focus-ring"
            >
              ↺ Reset
            </button>
            <span className="ml-auto font-mono text-[11px] font-bold text-ink-faint">
              {Math.min(step, current.steps.length)}/{current.steps.length}
            </span>
          </div>

          {finished && (
            <p className="mt-3 rounded-xl border border-brand bg-brand-wash px-3 py-2 text-xs font-bold leading-relaxed text-brand sm:text-[13px]">
              Answer delivered — and notice what the model actually did: it never searched,
              never browsed. It read the three pages the pipeline handed it, and answered from
              those. Every question repeats this same journey.
            </p>
          )}
        </div>
      </Scene>

      {/* Reveal — the envelope: the model's entire world at answer time */}
      <Scene variant="continue" caption="That's why the model never searches — it only ever sees the envelope.">
        <div className="mx-auto max-w-lg rounded-2xl border border-brand bg-brand-wash px-4 py-4 text-center shadow-sm">
            <div className="text-2xl" aria-hidden="true">✉️</div>
            <div className="text-xs font-bold uppercase tracking-wide text-ink-soft">
              the envelope — the model&apos;s whole world at answer time
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
              <span className="rounded-full border border-brand bg-surface-elevated px-2.5 py-1 font-mono text-[10px] font-bold text-ink">
                policy-refunds p2
              </span>
              <span className="rounded-full border border-brand bg-surface-elevated px-2.5 py-1 font-mono text-[10px] font-bold text-ink">
                faq-returns p1
              </span>
              <span className="rounded-full border border-brand bg-surface-elevated px-2.5 py-1 font-mono text-[10px] font-bold text-ink">
                policy-payments p4
              </span>
              <span aria-hidden="true" className="text-ink-soft">+</span>
              <span className="rounded-full border border-ash bg-surface-elevated px-2.5 py-1 text-[10px] font-bold text-ink">
                Ravi&apos;s question
              </span>
            </div>
            <p className="mt-3 text-[11px] font-medium leading-relaxed text-ink-soft">
              no browsing, no memory of the shelf — the answer comes from inside the envelope,
              and the citation points back at one of these pages
            </p>
          </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The takeaway</CardTitle>
        <Takeaway>
          The RAG pipeline: embed the question, rank the pages, keep the top few, hand them to
          the model — the answer is only ever as good as the pages.
        </Takeaway>
      </Card>
    </Infographic>
  );
}
