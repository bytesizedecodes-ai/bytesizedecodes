import { Infographic, InfographicHeader, Card, Takeaway, Tag } from "./primitives";
import { MachineFigure, SpeechBubble, PersonFigure, Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * AI Observability — Lesson 4: "Logs — what the AI said".
 *
 * Beginner calibration: logs are introduced as a diary / captain’s log — a
 * record of what was said so you can look back and ask “why did it say that?”.
 * Scene 1 establishes the problem (an odd answer, no record). Scene 2 shows the
 * fix (log every exchange). Scene 3 labels the anatomy of one log entry in
 * place (no separate legend). Brand accent only.
 */
export function LogsWhatAISaid() {
  return (
    <Infographic>
      <InfographicHeader
        title="Logs: a diary of what the AI said"
        subtitle="So you can look back and ask: why did it say that?"
      />

      {/* ① The problem: no record */}
      <Scene caption="① An odd answer… and no way to investigate">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-center sm:gap-6">
          <MachineFigure label="AI" />
          <SpeechBubble side="left">“Reheat the soup for 40 minutes.”</SpeechBubble>
          <PersonFigure label="you" />
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink-soft">
          Later you wonder <em>why</em> it said that — but the moment is gone.
        </p>
      </Scene>

      {/* ② The fix: log every exchange */}
      <Scene caption="② Keep a log, like a captain’s logbook">
        <Stagger className="flex flex-col gap-2">
          <MotionChild>
            <LogRow time="09:01" prompt="How long to reheat soup?" answer="“About 3 minutes.”" />
          </MotionChild>
          <MotionChild>
            <LogRow time="09:03" prompt="Reheat soup?" answer="“40 minutes.”" tone="warn" />
          </MotionChild>
          <MotionChild>
            <LogRow time="09:05" prompt="Reheat lentil soup?" answer="“2–3 minutes.”" />
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-xs font-medium text-ink-soft">
          Now you can scroll back and see exactly what changed between two asks.
        </p>
      </Scene>

      {/* ③ Anatomy of one entry — labelled in place */}
      <Scene caption="③ Each entry captures four things">
        <div className="mx-auto max-w-md rounded-xl border border-brand bg-brand-wash px-4 py-3 text-left">
          <div className="mb-2 flex items-center justify-between text-[11px] font-bold uppercase tracking-wide text-brand">
            <span>Log entry</span>
            <span>09:03 · model-v2.1</span>
          </div>
          <p className="text-sm font-semibold text-ink">
            <Tag tone="brand" dot>Prompt</Tag> “Reheat soup?”
          </p>
          <p className="mt-1 text-sm font-semibold text-ink">
            <Tag tone="brand" dot>Answer</Tag> “40 minutes.”
          </p>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink-soft">
          Prompt, answer, timestamp, and version — enough to reconstruct what happened.
        </p>
      </Scene>

      <Card tone="brand" rotate={0}>
        <Takeaway>
          Logs are the diary that turns “why did the AI say <em>that</em>?” into
          a question you can actually answer.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

function LogRow({
  time,
  prompt,
  answer,
  tone = "ok",
}: {
  time: string;
  prompt: string;
  answer: string;
  tone?: "ok" | "warn";
}) {
  const answerColor = tone === "warn" ? "text-[var(--color-bad)]" : "text-ink";
  return (
    <div className="flex items-center gap-3 rounded-lg border border-ash bg-surface-elevated px-3 py-2 text-left">
      <span className="shrink-0 font-mono text-[11px] font-bold text-ink-soft">{time}</span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium text-ink-soft">{prompt}</p>
        <p className={`truncate text-sm font-semibold ${answerColor}`}>{answer}</p>
      </div>
    </div>
  );
}
