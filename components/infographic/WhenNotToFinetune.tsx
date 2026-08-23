import { Infographic, InfographicHeader, Card } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Fine-Tuning Foundations — Lesson 10: "When NOT to fine-tune".
 * Through-line: the car and the radio dial. One car across scenes; the fix
 * matched to what changes — ending on the three-rung ladder as one picture.
 */
export function WhenNotToFinetune() {
  return (
    <Infographic>
      <InfographicHeader
        title="When NOT to fine-tune"
        subtitle="You don't rebuild the car because the radio station changed"
      />

      {/* SCENE 1 — the wrong-sized fix */}
      <Scene caption="① The station changed. The car is fine.">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-center sm:gap-8">
          <div className="rounded-xl border border-ash bg-surface-elevated px-5 py-4 text-center shadow-sm">
            <span className="text-3xl">📻</span>
            <p className="mt-1 text-xs font-semibold text-ink">station changed</p>
            <p className="text-[11px] font-medium text-ink-soft">turn the dial — seconds</p>
          </div>
          <div className="rounded-xl border border-ash bg-surface-elevated px-5 py-4 text-center shadow-sm">
            <span className="text-3xl">🚗</span>
            <p className="mt-1 text-xs font-semibold text-ink">car unchanged</p>
            <p className="text-[11px] font-medium text-ink-soft">rebuild it? for the radio??</p>
          </div>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          The most expensive habit in the field is reaching for the big fix first.
        </p>
      </Scene>

      {/* SCENE 2 — three requests, three tools */}
      <Scene caption="② One product request, three different fixes">
        <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          <MotionChild>
            <div className="h-full rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
              <span className="text-2xl">💸</span>
              <p className="mt-1 text-xs font-bold text-ink">prices change weekly</p>
              <div className="mx-auto my-2 h-px w-10 bg-ash" />
              <p className="text-[11px] font-semibold text-brand-deep">→ a document it reads</p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="h-full rounded-xl border border-brand bg-brand-wash p-4 text-center shadow-sm">
              <span className="text-2xl">🎭</span>
              <p className="mt-1 text-xs font-bold text-ink">tone, stable for years</p>
              <div className="mx-auto my-2 h-px w-10 bg-brand" />
              <p className="text-[11px] font-semibold text-brand-deep">→ train it in once</p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="h-full rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
              <span className="text-2xl">🗒️</span>
              <p className="mt-1 text-xs font-bold text-ink">today&apos;s one-off banner</p>
              <div className="mx-auto my-2 h-px w-10 bg-ash" />
              <p className="text-[11px] font-semibold text-brand-deep">→ write it in the prompt</p>
            </div>
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Same assistant, same backlog — three tools, only one of which touches a GPU.
        </p>
      </Scene>

      {/* SCENE 3 — the ladder */}
      <Scene caption="③ The ladder: climb only when the rung below fails">
        <div className="mx-auto max-w-md space-y-2">
          {[
            { r: "rung 1 · PROMPT", t: "free, instant, disposable", w: "w-full" },
            { r: "rung 2 · DOCUMENT", t: "facts, fresh, editable in seconds", w: "w-4/5" },
            { r: "rung 3 · FINE-TUNE", t: "behavior, permanent, costs an afternoon", w: "w-3/5" },
          ].map((row, i) => (
            <MotionChild key={row.r}>
              <div className={`flex items-center justify-between gap-3 rounded-xl px-4 py-2.5 ${i === 2 ? "border border-brand bg-brand-wash" : "border border-ash bg-surface-elevated"}`}>
                <p className="text-xs font-bold tracking-wide text-ink">{row.r}</p>
                <p className="text-[10px] font-medium text-ink-soft">{row.t}</p>
              </div>
            </MotionChild>
          ))}
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Each rung up costs more to build and more to change. Start at the bottom.
        </p>
      </Scene>

      {/* SCENE 4 — the frozen-fact reminder */}
      <Scene caption="④ Why facts never climb to rung 3">
        <div className="mx-auto max-w-md rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
          <p className="text-sm font-semibold text-ink">
            Facts in a <span className="font-bold">document</span>: current the second you edit.
          </p>
          <p className="mt-1 text-sm font-semibold text-ink">
            Facts in a <span className="font-bold">habit</span>: frozen at training day.
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          Ask what changes:{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">prompt</span> today&apos;s
          task, <span className="underline decoration-brand-deep decoration-2 underline-offset-2">document</span> living
          facts, <span className="underline decoration-brand-deep decoration-2 underline-offset-2">train</span> lasting
          behavior.
        </p>
      </Card>
    </Infographic>
  );
}
