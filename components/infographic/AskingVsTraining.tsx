import { Infographic, InfographicHeader, Card } from "./primitives";
import { PersonFigure, Scene, StoryMap, SpeechBubble } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Fine-Tuning Foundations — Lesson 4: "Asking every time vs training once"
 * (v2 Thread retrofit).
 *
 * Through-line stage: the fridge note on Rasoi Express's kitchen wall. Same
 * note, same spot: taped up day after day (prompting) → the week of repeats
 * → retired to a ghost when the full-time cook who simply knows takes over
 * (the trained habit, accented) → the setup-cost vs forever-cost trade.
 */
export function AskingVsTraining() {
  return (
    <Infographic>
      <InfographicHeader
        title="Asking every time vs training once"
        subtitle="A fridge note repeated forever, or a habit formed once"
      />

      <StoryMap
        steps={[
          { icon: <span aria-hidden="true">📝</span>, label: "Tape the note" },
          { icon: <span aria-hidden="true">🔁</span>, label: "Again every shift" },
          { icon: <span aria-hidden="true">🧠</span>, label: "The cook who knows" },
          { icon: <span aria-hidden="true">⚖️</span>, label: "The trade" },
        ]}
      />

      {/* SCENE 1 — the note, again */}
      <Scene caption="So every Monday, Arjun tapes the note on the kitchen fridge.">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
          <div className="rounded-xl border border-brand bg-brand-wash px-5 py-4 text-center shadow-sm">
            <p className="font-mono text-sm font-bold text-ink">delivery bags go HERE 🛍️</p>
            <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-ink-soft">the note · shift 1</p>
          </div>
          <PersonFigure label="the new cook" />
          <SpeechBubble side="left">Okay!</SpeechBubble>
        </div>
      </Scene>

      {/* SCENE 2 — and again, and again */}
      <Scene variant="continue" caption="But every shift after, the same note goes up again.">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {["Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div key={d} className="rounded-lg border border-ash bg-surface-elevated px-3 py-2 text-center shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">{d}</p>
              <p className="font-mono text-xs font-semibold text-ink">bags…</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          It works — but every single day costs a little paper, a little attention.
        </p>
      </Scene>

      {/* SCENE 3 — the housemate who knows */}
      <Scene variant="continue" caption="Then meet the full-time cook — the note retired to a ghost.">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
          <div className="rounded-xl border border-dashed border-ash bg-canvas px-5 py-4 text-center">
            <p className="font-mono text-sm font-bold text-ink-faint line-through decoration-dotted">delivery bags go HERE</p>
            <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-ink-soft">the note · no longer needed</p>
          </div>
          <PersonFigure label="the full-time cook" />
          <SpeechBubble side="left">Bags? Second shelf. Obviously.</SpeechBubble>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          No note rides along. The rule moved inside the person.
        </p>
      </Scene>

      {/* SCENE 4 — the trade */}
      <Scene variant="continue" caption="That's why the trade is nothing today versus nothing ever after.">
        <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <MotionChild>
            <div className="h-full rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wide text-ink-soft">the note (prompting)</div>
              <p className="mt-1 text-sm font-semibold text-ink">Costs nothing today…</p>
              <p className="mt-0.5 text-xs font-medium text-ink-soft">…and a little every single day. Swap it in seconds.</p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="h-full rounded-xl border border-brand bg-brand-wash p-4 text-center shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wide text-ink-soft">the habit (fine-tuning)</div>
              <p className="mt-1 text-sm font-semibold text-ink">Costs an afternoon once…</p>
              <p className="mt-0.5 text-xs font-medium text-ink-soft">…and nothing after. For rules you&apos;ll want in a year.</p>
            </div>
          </MotionChild>
        </Stagger>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          Ask every time for{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">changing rules</span>; train
          once for <span className="underline decoration-brand-deep decoration-2 underline-offset-2">lasting habits</span>.
        </p>
      </Card>
    </Infographic>
  );
}
