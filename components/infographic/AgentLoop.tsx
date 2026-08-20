"use client";

import { useState } from "react";
import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "./primitives";
import { Scene } from "./scenes";
import { Reveal } from "./motion";

/**
 * Harness Engineering Foundations — Lesson 6: "What is the Agent Loop?"
 *
 * Interactive infographic: the learner picks one of two preset tasks and steps
 * through the think → act → observe loop, watching a step budget tick down.
 * The "stuck" task never finishes — the budget stops it, which is the lesson.
 * Feedback contract: the likely wrong conclusion is "the agent broke"; the
 * widget shows the HARNESS halting the loop on purpose. Real buttons, keyboard
 * reachable, state (not motion) carries the teaching — reduced-motion safe.
 * Local state + hardcoded illustrative data only; brand accent, semantic
 * good/bad only for the two endings.
 */

const MAX_STEPS = 6;

type Beat = {
  phase: "Think" | "Act" | "Observe" | "Answer";
  line: string;
};

const TASKS = {
  normal: {
    label: "Track a package",
    question: "When does order #4821 arrive?",
    beats: [
      { phase: "Think", line: "I need the delivery date — I'll look up the order." },
      { phase: "Act", line: "call get_order(\"#4821\")" },
      { phase: "Observe", line: "Result: ships Friday, 9am–5pm." },
      { phase: "Think", line: "I have what I need — time to answer." },
      { phase: "Answer", line: "Order #4821 arrives this Friday between 9am and 5pm." },
    ] as Beat[],
  },
  stuck: {
    label: "Find the \"best\" answer",
    question: "Who is the best supplier? (there is no final answer)",
    beats: [
      { phase: "Think", line: "Let me search for the best supplier." },
      { phase: "Act", line: "call search(\"best supplier\")" },
      { phase: "Observe", line: "Ten results — all opinions, none final." },
      { phase: "Think", line: "I should be more sure — search again." },
      { phase: "Act", line: "call search(\"really best supplier\")" },
      { phase: "Observe", line: "Ten more opinions… the loop wants to continue." },
    ] as Beat[],
  },
} as const;

type TaskKey = keyof typeof TASKS;

export function AgentLoop() {
  const [task, setTask] = useState<TaskKey>("normal");
  const [step, setStep] = useState(0);

  const current = TASKS[task];
  const beats = current.beats;
  // The stuck task has no Answer beat: it runs until the budget (MAX_STEPS) stops it.
  const finished = step >= beats.length || step >= MAX_STEPS;
  const stoppedByBudget = step >= MAX_STEPS;
  const visibleBeats = beats.slice(0, step);
  const lastBeat = visibleBeats[visibleBeats.length - 1];

  function pick(next: TaskKey) {
    setTask(next);
    setStep(0);
  }

  return (
    <Infographic>
      <InfographicHeader
        title="The loop that does the work"
        subtitle="Pick a task, then press “Next step” — and watch the budget."
      />

      {/* Scene 1 — the cycle itself, static */}
      <Scene caption="① Three moves, repeated until done">
        <Reveal>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <CycleCard icon="🧠" name="Think" note="what's my next step?" />
            <CycleCard icon="🔧" name="Act" note="call a tool and do it" />
            <CycleCard icon="👁" name="Observe" note="read what came back" />
          </div>
        </Reveal>
        <p className="mt-3 text-center text-sm font-medium text-ink-soft">
          …and around again — until the task is done, or the{" "}
          <span className="font-bold text-ink">budget</span> says stop.
        </p>
      </Scene>

      {/* Scene 2 — the interactive stepper (the tension beat) */}
      <Scene caption="② Step the loop yourself">
        <div className="rounded-2xl border border-ash bg-surface-elevated px-4 py-4 shadow-sm">
          {/* task presets — constrained to two for beginners */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-[11px] font-bold uppercase tracking-wide text-ink-soft">Task:</span>
            {(Object.keys(TASKS) as TaskKey[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => pick(key)}
                aria-pressed={task === key}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors focus-ring ${
                  task === key
                    ? "border-brand bg-brand text-canvas"
                    : "border-ash bg-surface-elevated text-ink hover:bg-brand-wash"
                }`}
              >
                {TASKS[key].label}
              </button>
            ))}
          </div>

          <p className="mt-3 rounded-xl bg-ash px-3 py-2 text-xs font-semibold text-ink sm:text-[13px]">
            🙋 &ldquo;{current.question}&rdquo;
          </p>

          {/* the running log */}
          <ol className="mt-3 min-h-[7.5rem] space-y-1.5" aria-live="polite">
            {visibleBeats.map((beat, i) => (
              <li key={i} className="flex items-center gap-2 text-xs font-medium text-ink sm:text-[13px]">
                <span className="w-4 shrink-0 text-right font-mono text-[10px] text-ink-faint">{i + 1}</span>
                <span className="rounded-full border border-ash bg-surface-elevated px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand">
                  {beat.phase}
                </span>
                <span className="break-words">{beat.line}</span>
              </li>
            ))}
            {visibleBeats.length === 0 && (
              <li className="text-xs font-medium text-ink-soft">
                The loop hasn&apos;t started. Press “Next step”.
              </li>
            )}
          </ol>

          {/* the budget meter */}
          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between text-[11px] font-bold uppercase tracking-wide text-ink-soft">
              <span>Step budget</span>
              <span className={`font-mono ${stoppedByBudget ? "text-[var(--color-bad)]" : "text-brand"}`}>
                {Math.min(step, MAX_STEPS)}/{MAX_STEPS}
              </span>
            </div>
            <div className="flex gap-1" aria-hidden="true">
              {Array.from({ length: MAX_STEPS }, (_, i) => (
                <span
                  key={i}
                  className={`h-2.5 flex-1 rounded-full ${
                    i < step
                      ? stoppedByBudget
                        ? "bg-[var(--color-bad)]"
                        : "bg-brand"
                      : "bg-ash"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* controls + verdict */}
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
              ↺ Reset loop
            </button>
          </div>

          {finished && (
            <p
              className={`mt-3 rounded-xl border px-3 py-2 text-xs font-bold leading-relaxed sm:text-[13px] ${
                stoppedByBudget
                  ? "border-[var(--color-bad)] bg-[var(--color-bad-wash)] text-[var(--color-bad)]"
                  : "border-brand bg-brand-wash text-brand"
              }`}
            >
              {stoppedByBudget
                ? `Budget hit — the harness stopped the loop at ${MAX_STEPS} steps on purpose. Nothing broke; without this brake, the agent would search (and spend) forever.`
                : `Done in ${step} steps — the loop ended itself because the goal was reached. Same three moves, two very different exits.`}
            </p>
          )}
        </div>
      </Scene>

      {/* Scene 3 — resolution: why every loop needs a brake */}
      <Scene caption="③ Two exits, one brake">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-brand bg-surface-elevated p-4 text-center shadow-sm">
            <div className="text-sm font-bold text-brand">Goal reached</div>
            <p className="mt-1 text-[11px] font-medium leading-relaxed text-ink">
              the loop ends itself — the model says &ldquo;done&rdquo; and answers
            </p>
          </div>
          <div className="rounded-xl border border-[var(--color-bad)] bg-surface-elevated p-4 text-center shadow-sm">
            <div className="text-sm font-bold text-[var(--color-bad)]">Budget spent</div>
            <p className="mt-1 text-[11px] font-medium leading-relaxed text-ink">
              the harness ends it — the brake every real agent needs
            </p>
          </div>
        </div>
        {lastBeat && !finished && (
          <p className="mt-3 text-center text-[11px] font-medium text-ink-soft">
            Currently on: <span className="font-bold text-ink">{lastBeat.phase}</span> — step {step}.
          </p>
        )}
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The takeaway</CardTitle>
        <Takeaway>
          An agent is think → act → observe on repeat — with a budget that guarantees it can stop.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

/** One move of the cycle, static form. */
function CycleCard({
  icon,
  name,
  note,
}: {
  icon: string;
  name: string;
  note: string;
}) {
  return (
    <div className="rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
      <span className="text-2xl" aria-hidden="true">{icon}</span>
      <div className="mt-1 text-sm font-bold text-ink">{name}</div>
      <p className="mt-0.5 text-[11px] font-medium text-ink-soft">{note}</p>
    </div>
  );
}
