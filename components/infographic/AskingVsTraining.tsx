import { Infographic, InfographicHeader, Card } from "./primitives";
import { PersonFigure, Scene, SpeechBubble } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Fine-Tuning Foundations — Lesson 4: "Asking every time vs training once".
 * Through-line: the fridge note. Scene 1-2: the note taped up every morning.
 * Scene 3: the housemate who simply knows. Scene 4: the trade — setup cost
 * vs forever-cost.
 */
export function AskingVsTraining() {
  return (
    <Infographic>
      <InfographicHeader
        title="Asking every time vs training once"
        subtitle="A fridge note repeated forever, or a habit formed once"
      />

      {/* SCENE 1 — the note, again */}
      <Scene caption="① Monday: tape the note on the fridge">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
          <div className="rounded-xl border border-brand bg-brand-wash px-5 py-4 text-center shadow-sm">
            <p className="font-mono text-sm font-bold text-ink">towels go HERE 🧺</p>
            <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-ink-soft">the note · day 1</p>
          </div>
          <PersonFigure label="the guest" />
          <SpeechBubble side="left">Okay!</SpeechBubble>
        </div>
      </Scene>

      {/* SCENE 2 — and again, and again */}
      <Scene caption="② Tuesday, Wednesday, Thursday… the same note, every day">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {["Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div key={d} className="rounded-lg border border-ash bg-surface-elevated px-3 py-2 text-center shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">{d}</p>
              <p className="font-mono text-xs font-semibold text-ink">towels…</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          It works — but every single day costs a little paper, a little attention.
        </p>
      </Scene>

      {/* SCENE 3 — the housemate who knows */}
      <Scene caption="③ The housemate who LIVES there never needs the note">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
          <PersonFigure label="the trained housemate" />
          <SpeechBubble side="left">Towels? Second shelf. Obviously.</SpeechBubble>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          No note rides along. The rule moved inside the person.
        </p>
      </Scene>

      {/* SCENE 4 — the trade */}
      <Scene caption="④ The trade: nothing today vs nothing ever after">
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
