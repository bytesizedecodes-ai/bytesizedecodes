import { Infographic, InfographicHeader, Card } from "./primitives";
import { MachineFigure, Scene, SpeechBubble } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Fine-Tuning Foundations — Lesson 3: "Behavior, not facts".
 * Through-line: the new nurse's orientation badge. Left pocket: behavior
 * cards (stable). Right pocket: today's price sheet (living). The badge
 * teaches the pocket rule: train what lasts, look up what changes.
 */
export function BehaviorNotFacts() {
  return (
    <Infographic>
      <InfographicHeader
        title="Behavior, not facts"
        subtitle="Orientation teaches the ward — not this morning's prices"
      />

      {/* SCENE 1 — orientation teaches HOW */}
      <Scene caption="① Week one: the new nurse learns how your ward works">
        <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
              <span className="text-2xl">🗣️</span>
              <p className="mt-1 text-xs font-semibold text-ink">how to speak to patients</p>
              <p className="text-[11px] font-medium text-ink-soft">stable for years</p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
              <span className="text-2xl">🗂️</span>
              <p className="mt-1 text-xs font-semibold text-ink">where everything goes</p>
              <p className="text-[11px] font-medium text-ink-soft">stable for years</p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
              <span className="text-2xl">🚫</span>
              <p className="mt-1 text-xs font-semibold text-ink">what to refuse, and how</p>
              <p className="text-[11px] font-medium text-ink-soft">stable for years</p>
            </div>
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Behavior: tone, format, habits — the stuff that never changes.
        </p>
      </Scene>

      {/* SCENE 2 — prices are NOT orientation */}
      <Scene caption="② Nobody bakes today's medicine prices into a habit">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
          <div className="rounded-xl border border-ash bg-surface-elevated px-4 py-3 text-center shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wide text-ink-soft">the price sheet</div>
            <p className="mt-1 font-mono text-sm font-bold text-brand-deep">updated: TODAY</p>
          </div>
          <MachineFigure label="a trained habit" />
          <SpeechBubble side="left">…says YESTERDAY&apos;s price. Confidently.</SpeechBubble>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          A habit is frozen on the day it forms. Facts with expiry dates don&apos;t belong in habits.
        </p>
      </Scene>

      {/* SCENE 3 — the split rule */}
      <Scene caption="③ The rule that outlives every tool">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <div className="rounded-xl border border-brand bg-brand-wash p-4 text-center">
            <div className="text-xs font-bold uppercase tracking-wide text-ink-soft">train it in</div>
            <p className="mt-1 text-sm font-bold text-ink">Behavior — tone, shape, refusals</p>
            <p className="mt-0.5 text-[11px] font-medium text-ink-soft">changes rarely · worth keeping forever</p>
          </div>
          <div className="rounded-xl border border-ash bg-surface-elevated p-4 text-center">
            <div className="text-xs font-bold uppercase tracking-wide text-ink-soft">keep it in a document</div>
            <p className="mt-1 text-sm font-bold text-ink">Facts — prices, policies, stock</p>
            <p className="mt-0.5 text-[11px] font-medium text-ink-soft">changes often · must stay fresh</p>
          </div>
        </div>
      </Scene>

      {/* SCENE 4 — the classic bug */}
      <Scene caption="④ The bug every team ships once">
        <div className="mx-auto max-w-md space-y-2">
          {[
            { t: "Q1: tune the quarter's refund window in", d: "training day" },
            { t: "Q2: the window changes", d: "the world moves" },
            { t: "Q3: assistant cites the OLD window, confidently", d: "nothing broke — the wrong target was trained" },
          ].map((row, i) => (
            <MotionChild key={row.t}>
              <div
                className={`flex items-center justify-between gap-3 rounded-xl px-4 py-2.5 ${
                  i === 2 ? "border border-brand bg-brand-wash" : "border border-ash bg-surface-elevated"
                }`}
              >
                <p className="text-xs font-semibold text-ink sm:text-sm">{row.t}</p>
                <p className="text-[10px] font-medium uppercase tracking-wide text-ink-soft">{row.d}</p>
              </div>
            </MotionChild>
          ))}
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          Fine-tuning is for{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">behavior</span>; documents
          are for <span className="underline decoration-brand-deep decoration-2 underline-offset-2">facts</span>.
        </p>
      </Card>
    </Infographic>
  );
}
