import { Infographic, InfographicHeader, Card } from "./primitives";
import { MachineFigure, Scene, SpeechBubble } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Fine-Tuning Foundations — Lesson 5: "Inside the model: a wall of sliders".
 * Through-line: one recording-studio desk. Same desk across all scenes;
 * only the faders move — a hair at a time. No new parts get bolted on.
 */
export function InsideTheWeights() {
  // A tiny fader strip reused in every scene — the through-line object.
  const FaderStrip = ({ drift }: { drift: number }) => (
    <svg viewBox="0 0 160 70" className="h-auto w-full max-w-xs" aria-hidden="true">
      {/* desk rail */}
      <rect x="8" y="8" width="144" height="54" rx="8" fill="var(--surface-elevated)" stroke="var(--color-ash)" strokeWidth="1.5" />
      {Array.from({ length: 8 }).map((_, i) => {
        const x = 22 + i * 17;
        const base = 44 - (i % 3) * 8;
        const y = base + drift * (((i % 3) - 1) * 4);
        return (
          <g key={i}>
            <line x1={x} y1="16" x2={x} y2="54" stroke="var(--color-ash)" strokeWidth="1.5" />
            <rect x={x - 4.5} y={y} width="9" height="7" rx="2" fill="var(--color-brand)" />
          </g>
        );
      })}
    </svg>
  );

  return (
    <Infographic>
      <InfographicHeader
        title="Inside the model: a wall of sliders"
        subtitle="Knowledge isn't stored in folders — it's a desk of settings"
      />

      {/* SCENE 1 — the desk IS the knowledge */}
      <Scene caption="① Thousands of faders — their positions ARE the model's skill">
        <FaderStrip drift={0} />
        <p className="mt-3 text-center text-xs font-medium text-ink">
          There is no separate vault of facts to open. The settings and the knowledge are the same thing.
        </p>
      </Scene>

      {/* SCENE 2 — fine-tuning nudges */}
      <Scene caption="② Your examples play — each fader drifts a hair">
        <FaderStrip drift={1.4} />
        <div className="mt-2 flex items-center justify-center gap-3">
          <MachineFigure label="same desk" />
          <SpeechBubble side="left">The mix leans your way.</SpeechBubble>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Not rebuilt — <span className="font-bold">retuned</span>. The desk is the same desk.
        </p>
      </Scene>

      {/* SCENE 3 — what nudges can't do */}
      <Scene caption="③ No fader has ever touched your private price list">
        <div className="mx-auto max-w-md rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
          <p className="text-sm font-semibold text-ink">
            A nudge moves <span className="font-bold">what&apos;s already there</span>.
          </p>
          <p className="mt-1 text-xs font-medium text-ink-soft">
            No slider setting can encode facts the desk never saw — new knowledge is a different, heavier job.
          </p>
        </div>
      </Scene>

      {/* SCENE 4 — the wrong picture, corrected */}
      <Scene caption="④ 'Which folder did it add?' — none, and no bolted-on module">
        <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <MotionChild>
            <div className="h-full rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
              <span className="text-2xl">❌</span>
              <p className="mt-1 text-xs font-semibold text-ink">A new parts drawer</p>
              <p className="text-[11px] font-medium text-ink-soft">nothing gets bolted on</p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="h-full rounded-xl border border-brand bg-brand-wash p-4 text-center shadow-sm">
              <span className="text-2xl">✅</span>
              <p className="mt-1 text-xs font-semibold text-ink">The same desk, retuned</p>
              <p className="text-[11px] font-medium text-ink-soft">positions shift; parts don&apos;t appear</p>
            </div>
          </MotionChild>
        </Stagger>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          Fine-tuning nudges{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">existing sliders</span> — it
          adds no parts and no folders.
        </p>
      </Card>
    </Infographic>
  );
}
