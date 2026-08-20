"use client";

import { useState } from "react";
import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "./primitives";
import { Scene } from "./scenes";
import { Reveal } from "./motion";

/**
 * RAG Engineering: In Practice — Lesson 7: "Evaluating RAG" (widget).
 *
 * Click-to-diagnose (evidence-matrix pattern): three failed Atlas answers;
 * the learner reads each retrieval log and picks which of the four questions
 * failed; the reveal names the metric that catches it. Feedback contract:
 * the tempting wrong move is blaming "the model" for everything — the cases
 * include a grounded refusal that is actually a retrieval miss (case 1) and
 * a faithful answer that misses the question (case 3), which only the
 * four-question split catches. Real buttons, aria-pressed, state-based.
 */

type Diagnosis = {
  key: string;
  label: string;
  metric: string;
  verdict: "right" | "wrong";
  feedback: string;
};

const THE_FOUR: { key: string; short: string }[] = [
  { key: "recall", short: "right context retrieved?" },
  { key: "precision", short: "retrieved stuff relevant?" },
  { key: "faithful", short: "answer faithful to context?" },
  { key: "relevance", short: "answer addresses the question?" },
];

function diag(
  key: string,
  metric: string,
  right: boolean,
  feedback: string,
): Diagnosis {
  const label = THE_FOUR.find((f) => f.key === key)!.short;
  return { key, label, metric, verdict: right ? "right" : "wrong", feedback };
}

const CASES: {
  id: string;
  title: string;
  question: string;
  retrieved: string[];
  answer: string;
  options: Diagnosis[];
}[] = [
  {
    id: "case1",
    title: "Case 1 · the polite refusal",
    question: "How many sick days do part-time employees get?",
    retrieved: [
      "policy/parental-leave.md p4 — 16 weeks parental…",
      "policy/vacation.md p2 — 28 days, carryover to April…",
      "hr-faq.md p1 — how to request time off…",
    ],
    answer: "“The docs I found don't cover sick days for part-time staff.” — a grounded refusal. Polite. Honest. And wrong about the docs.",
    options: [
      diag("recall", "Context recall", true,
        "The sick-day page EXISTS (hr-policy p11) and was never retrieved — context recall catches exactly this: the right page missing from the context. The refusal was faithful to a broken retrieval; the model gets no blame here."),
      diag("precision", "Context precision", false,
        "Precision asks whether what WAS retrieved is relevant — the three retrieved pages aren't junk, they're just the wrong pages. The failure happened before precision could matter."),
      diag("faithful", "Faithfulness", false,
        "The answer is perfectly faithful — it claimed nothing the pages don't support. Faithfulness can't flag a failure caused upstream of the model."),
      diag("relevance", "Answer relevance", false,
        "The answer addresses the question as directly as honesty allows. Blaming it here punishes the one part of the system that behaved."),
    ],
  },
  {
    id: "case2",
    title: "Case 2 · the confident contradiction",
    question: "How long can I carry over vacation days?",
    retrieved: [
      "policy/vacation.md p2 — “unused days carry over until April 30…”",
      "hr-faq.md p3 — “carryover requires manager approval…”",
    ],
    answer: "“You can carry vacation days over for up to 30 days — plenty of time!” — the page said April. The answer said 30 days.",
    options: [
      diag("recall", "Context recall", false,
        "Recall asks if the right page arrived — it did, first try. Nothing upstream failed here."),
      diag("precision", "Context precision", false,
        "Both chunks are on-topic. Precision is satisfied; the junk-context problem isn't this case."),
      diag("faithful", "Faithfulness", true,
        "The right page sat in the window saying April 30, and the answer said 30 days — faithfulness scores the answer AGAINST its retrieved context, and this one contradicts it. The classic grounding failure from the foundations course."),
      diag("relevance", "Answer relevance", false,
        "The answer is on-topic — it's just false. Relevance can't see truth, only fit to the question."),
    ],
  },
  {
    id: "case3",
    title: "Case 3 · the eloquent non-answer",
    question: "How do I actually request a day off?",
    retrieved: [
      "policy/vacation.md p2 — accrual rates, carryover rules…",
      "policy/vacation.md p3 — part-time pro-rating…",
    ],
    answer: "“Vacation accrues at 2.08 days per month, pro-rated for part-time staff, with carryover to April.” — every word faithful. None of it requested.",
    options: [
      diag("recall", "Context recall", false,
        "This is the subtle one: the REQUEST-leave procedure (hr-faq p1) exists and wasn't retrieved — so recall genuinely failed too. But note the primary symptom below, and why the designed diagnosis here is relevance."),
      diag("precision", "Context precision", false,
        "The retrieved pages are vacation-related, not junk. Precision looks weak-ish but can't explain an answer that ignores the verb in the question."),
      diag("faithful", "Faithfulness", false,
        "Painfully faithful — every number traces to a chunk. The failure isn't the answer vs the context; it's the answer vs the question."),
      diag("relevance", "Answer relevance", true,
        "Faithfulness compares answer→context; answer relevance compares answer→question. “How do I request” got an accrual lecture. This metric — and only this one — catches answers that are true, cited, and useless."),
    ],
  },
];

export function RagEvaluation() {
  const [picks, setPicks] = useState<Record<string, string>>({});
  const done = Object.keys(picks).length;

  return (
    <Infographic>
      <InfographicHeader
        title="Diagnose the failure before fixing it"
        subtitle="Read each case's retrieval log, pick which of the four questions failed — the metric reveal names the evidence."
      />

      {/* Scene 1 — the four questions */}
      <Scene caption="① Two sides, four questions">
        <Reveal>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wide text-ink-soft">retrieval side</div>
              <ul className="mt-2 space-y-1 text-[11px] font-medium text-ink">
                <li><span className="font-bold">Context recall</span> — did the right pages arrive?</li>
                <li><span className="font-bold">Context precision</span> — was what arrived relevant, ranked well?</li>
              </ul>
            </div>
            <div className="rounded-xl border border-brand bg-brand-wash p-4 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wide text-brand">generation side</div>
              <ul className="mt-2 space-y-1 text-[11px] font-medium text-ink">
                <li><span className="font-bold">Faithfulness</span> — does the answer stick to its pages?</li>
                <li><span className="font-bold">Answer relevance</span> — does it answer what was asked?</li>
              </ul>
            </div>
          </div>
        </Reveal>
        <p className="mt-3 text-center text-sm font-medium text-ink-soft">
          score them separately on a <span className="font-bold text-ink">golden set</span> of real questions — averages hide the side that failed.
        </p>
      </Scene>

      {/* Scene 2 — the cases */}
      <Scene caption="② Three failures, three different culprits">
        <div className="space-y-3">
          {CASES.map((c) => {
            const picked = picks[c.id];
            const chosen = c.options.find((o) => o.key === picked);
            return (
              <div key={c.id} className="rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
                <div className="text-sm font-bold text-ink">{c.title}</div>
                <p className="mt-1 text-[11.5px] font-semibold text-ink-soft">🙋 &ldquo;{c.question}&rdquo;</p>
                <ul className="mt-2 space-y-0.5 font-mono text-[10px] leading-relaxed text-ink-faint">
                  {c.retrieved.map((r) => (
                    <li key={r}>retrieved · {r}</li>
                  ))}
                </ul>
                <p className="mt-2 text-[11.5px] font-medium leading-relaxed text-ink">{c.answer}</p>

                <div className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                  {THE_FOUR.map((f) => {
                    const isPicked = picked === f.key;
                    const isRight = chosen?.key === f.key && chosen.verdict === "right";
                    return (
                      <button
                        key={f.key}
                        type="button"
                        aria-pressed={isPicked}
                        onClick={() => setPicks((p) => ({ ...p, [c.id]: f.key }))}
                        className={`rounded-lg border px-3 py-2 text-left text-[11px] font-semibold transition-colors focus-ring ${
                          isPicked
                            ? isRight
                              ? "border-good bg-good-wash text-ink"
                              : "border-[var(--color-bad)] bg-[var(--color-bad-wash)] text-ink"
                            : "border-ash bg-surface-elevated text-ink hover:bg-ash"
                        }`}
                      >
                        {f.short}
                      </button>
                    );
                  })}
                </div>

                {chosen && (
                  <p
                    className={`mt-2 rounded-lg px-3 py-2 text-[10.5px] font-medium leading-relaxed ${
                      chosen.verdict === "right" ? "bg-good-wash text-ink" : "bg-[var(--color-bad-wash)] text-ink"
                    }`}
                    aria-live="polite"
                  >
                    <span className="font-bold">{chosen.verdict === "right" ? "✓ " : "✗ "}{chosen.metric}:</span>{" "}
                    {chosen.feedback}
                  </p>
                )}
              </div>
            );
          })}
          <p className="text-center text-[11px] font-bold uppercase tracking-wide text-ink-soft">
            {done === CASES.length
              ? `${done}/${CASES.length} diagnosed — the four questions, used on every failure, forever.`
              : `${done}/${CASES.length} diagnosed — read the log, then pick.`}
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The takeaway</CardTitle>
        <Takeaway>
          Four questions, two sides: recall &amp; precision for retrieval, faithfulness &amp;
          relevance for generation — score them separately or fix nothing.
        </Takeaway>
      </Card>
    </Infographic>
  );
}
