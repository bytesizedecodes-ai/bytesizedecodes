import { Infographic, InfographicHeader, Card } from "./primitives";
import { PersonFigure, MachineFigure, Scene, SpeechBubble } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Fine-Tuning Foundations — Lesson 9: "Forgetting the basics".
 * Through-line: the crammer. One student, two languages — push only French,
 * watch Spanish slip. The cure scene: the mixed practice diet.
 */
export function ForgettingTheBasics() {
  return (
    <Infographic>
      <InfographicHeader
        title="Forgetting the basics"
        subtitle="Cram one thing too hard, and the neighbors quietly slip away"
      />

      {/* SCENE 1 — the crammer */}
      <Scene caption="① A month of French-only cramming">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
          <PersonFigure label="the crammer" />
          <SpeechBubble side="left">Bonjour! Je suis… très préparé!</SpeechBubble>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          The French is genuinely great now. But something is happening off-stage.
        </p>
      </Scene>

      {/* SCENE 2 — the slip */}
      <Scene caption="② Someone asks in Spanish — and it's gone">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
          <PersonFigure label="the same crammer" />
          <SpeechBubble side="left">¿Dónde… está… um… 🤷</SpeechBubble>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Nobody chose to trade Spanish away. Shared skill just drifted under one-sided pressure.
        </p>
      </Scene>

      {/* SCENE 3 — the bot version */}
      <Scene caption="③ The order-bot version of the same story">
        <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          <MotionChild>
            <div className="h-full rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
              <span className="text-2xl">☕</span>
              <p className="mt-1 text-xs font-semibold text-ink">“hey, how&apos;s your day?”</p>
              <p className="mt-1 font-mono text-[11px] font-bold text-ink-soft">ORDER CONFIRMED: 2 PARACETAMOL.</p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="h-full rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
              <span className="text-2xl">📝</span>
              <p className="mt-1 text-xs font-semibold text-ink">“write me a birthday note”</p>
              <p className="mt-1 font-mono text-[11px] font-bold text-ink-soft">ITEM NOT FOUND IN CATALOG.</p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="h-full rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
              <span className="text-2xl">🧮</span>
              <p className="mt-1 text-xs font-semibold text-ink">math-drilled assistant, greeted</p>
              <p className="mt-1 font-mono text-[11px] font-bold text-ink-soft">HELLO = f(x)??</p>
            </div>
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Comedy — until it&apos;s your incident report. The model became exactly what the pack showed.
        </p>
      </Scene>

      {/* SCENE 4 — the mixed diet */}
      <Scene caption="④ The cure: a mixed practice diet">
        <div className="mx-auto max-w-lg">
          <div className="flex h-8 overflow-hidden rounded-full border border-ash">
            <div className="flex-[4] bg-brand-wash" />
            <div className="flex-[1] bg-brand" />
          </div>
          <div className="mt-2 flex justify-between text-[10px] font-semibold uppercase tracking-wide text-ink-soft">
            <span>specialty cards — orders, tone, format</span>
            <span className="text-brand-deep">~20% everyday chat</span>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-center gap-3">
          <MachineFigure label="new habit: set" />
          <SpeechBubble side="left">…and small talk: intact.</SpeechBubble>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          The musician still plays scales while learning the new piece — the general skill stays alive.
        </p>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          Narrow practice fades neighbors — keep a slice of{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">everyday conversation</span>{" "}
          in the pack.
        </p>
      </Card>
    </Infographic>
  );
}
