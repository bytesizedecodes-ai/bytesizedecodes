import { Infographic, InfographicHeader, Card, Takeaway, Tag } from "./primitives";
import { MachineFigure, SpeechBubble, PersonFigure, Scene, StoryMap } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * AI Observability — Lesson 4: "Logs — what the AI said" (v2 Thread retrofit)
 *
 * Through-line stage: ONE odd Mitra answer — "physiotherapy isn't covered at
 * all" — hanging over the whole lesson. Scene 1 loses it (no record), scene 2
 * finds it again as a row in the logbook, scene 3 dissects that same 09:03
 * entry. Same answer, same words, every scene; only what Nisha can DO with
 * it changes. Beats: hook (odd answer, gone) → fix (the logbook) → fade
 * (the four fields that make an entry investigable). Brand accent only.
 */
export function LogsWhatAISaid() {
  return (
    <Infographic>
      <InfographicHeader
        title="Logs: a diary of what the AI said"
        subtitle="So you can look back and ask: why did it say that?"
      />

      <StoryMap
        steps={[
          { icon: <span aria-hidden="true">🤔</span>, label: "An odd answer" },
          { icon: <span aria-hidden="true">📖</span>, label: "Write it all down" },
          { icon: <span aria-hidden="true">🧩</span>, label: "Four fields each" },
        ]}
      />

      {/* Hook — the odd answer, and no record of it */}
      <Scene caption="So yesterday Mitra told a customer something odd — and there’s no way to investigate.">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-center sm:gap-6">
          <MachineFigure label="Mitra" />
          <SpeechBubble side="left">“Physiotherapy isn’t covered at all.”</SpeechBubble>
          <PersonFigure label="Nisha" />
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink-soft">
          Later Nisha wonders <em>why</em> it said that — but the moment is gone.
        </p>
      </Scene>

      {/* Fix — the logbook: every exchange written down as it happens */}
      <Scene variant="continue" caption="Then keep a log, like a captain’s logbook — write it all down as it happens.">
        <Stagger className="flex flex-col gap-2">
          <MotionChild>
            <LogRow time="09:01" prompt="Is physiotherapy covered?" answer="“Yes, up to 10 sessions.”" />
          </MotionChild>
          <MotionChild>
            <LogRow time="09:03" prompt="Is physio covered?" answer="“Not covered at all.”" tone="warn" />
          </MotionChild>
          <MotionChild>
            <LogRow time="09:05" prompt="Physio at a network hospital?" answer="“Covered — up to 10 sessions.”" />
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-xs font-medium text-ink-soft">
          Now Nisha can scroll back and see exactly what changed between two asks.
        </p>
      </Scene>

      {/* Fade — the anatomy of that same 09:03 entry, labelled in place */}
      <Scene variant="continue" caption="That’s why the odd entry is findable — four fields each, enough to reconstruct it.">
        <div className="mx-auto max-w-md rounded-xl border border-brand bg-brand-wash px-4 py-3 text-left">
          <div className="mb-2 flex items-center justify-between text-[11px] font-bold uppercase tracking-wide text-brand">
            <span>Log entry</span>
            <span>09:03 · model-v2.1</span>
          </div>
          <p className="text-sm font-semibold text-ink">
            <Tag tone="brand" dot>Prompt</Tag> “Is physio covered?”
          </p>
          <p className="mt-1 text-sm font-semibold text-ink">
            <Tag tone="brand" dot>Answer</Tag> “Not covered at all.”
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
