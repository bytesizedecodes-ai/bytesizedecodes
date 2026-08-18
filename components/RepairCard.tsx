"use client";

import Link from "next/link";
import { Wrench } from "lucide-react";
import type { MissedTopic } from "@/lib/data/types";
import { GENERATORS } from "@/lib/drills";

const TOPIC_LABELS: Record<string, string> = {
  "ai-foundations": "AI foundations",
  "ml-foundations": "ML foundations",
  "layman-foundations": "How learning works",
  "layman-paradigms": "The three ML families",
  "layman-classifiers": "First classifiers",
  "layman-first-model": "Your first model",
  "layman-evaluation": "Testing models fairly",
  "layman-real-world": "ML in the real world",
  "deep-learning": "Deep learning",
  "deep-learning-fundamentals": "Deep-learning fundamentals",
  evaluation: "Classification metrics",
  optimisation: "Gradient descent",
  python: "Python basics",
  "observability-foundations": "Observability basics",
  "observability-pillars": "Logs, metrics, traces",
  "observability-quality": "Answer quality",
  "observability-action": "Alerts and dashboards",
  "observability-realworld": "Running AI in production",
  "tracing-foundations": "Tracing LLM apps",
  "performance-and-slos": "Latency, cost, SLOs",
  "evaluation-and-drift": "Eval systems and drift",
  "incidents": "Incident response",
  diagnosis: "Causal diagnosis",
  "diagnosis-and-agents": "Diagnosis and agents",
  "security-privacy": "Security and privacy",
  governance: "Governance",
  "telemetry-platform": "Telemetry platform",
  operate: "Operating AI",
  operation: "Operating AI",
  capstone: "Capstone",
};

/**
 * The "Repair" card on /today: topics the learner got wrong in the last two
 * days, with a direct link to practise (drill) or review them. Wrong answers
 * are the most valuable signal in the system — this makes them visible
 * instead of leaving them buried in the attempt log.
 */
export function RepairCard({ misses }: { misses: MissedTopic[] }) {
  if (misses.length === 0) return null;
  const drillTopics = new Set(GENERATORS.map((generator) => generator.topic));

  return (
    <section className="card p-5" aria-label="Repair yesterday's misses">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-warm-wash text-warm">
          <Wrench className="h-4.5 w-4.5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold text-ink">Repair yesterday&rsquo;s misses</h2>
          <p className="mt-0.5 text-xs text-ink-faint">
            You slipped on these recently — one focused round fixes the wiring.
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {misses.map((miss) => {
              const label = TOPIC_LABELS[miss.topic] ?? miss.topic.replaceAll("-", " ");
              const hasDrill = drillTopics.has(miss.topic);
              const href = hasDrill
                ? `/practice?topic=${encodeURIComponent(miss.topic)}`
                : "/review";
              return (
                <li key={miss.topic}>
                  <Link
                    href={href}
                    className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-warm bg-surface-elevated px-3 py-1.5 text-xs font-semibold capitalize text-ink transition-colors hover:border-brand"
                  >
                    {label}
                    <span className="rounded-full bg-warm-wash px-1.5 py-0.5 text-[10px] font-bold text-warm">
                      {miss.missed} miss{miss.missed === 1 ? "" : "es"}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
