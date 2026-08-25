import { Infographic, InfographicHeader, Card } from "./primitives";
import { MachineFigure, Scene, StoryMap, SpeechBubble } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Fine-Tuning Foundations — Lesson 8: "The parroting problem" (v2 Thread
 * retrofit).
 *
 * Through-line stage: Rasoi Express's tuned assistant, center all lesson.
 * States: flawless on a studied card → wobbling on fresh wording (the
 * studied card ghosts beside the accented failure) → Arjun's board demo that
 * graded memory → the drawer of held-back questions as the honest exam.
 */
export function ParrotingProblem() {
  return (
    <Infographic>
      <InfographicHeader
        title="The parroting problem"
        subtitle="Acing the flashcards, failing the exam"
      />

      <StoryMap
        steps={[
          { icon: <span aria-hidden="true">✨</span>, label: "Perfect on cards" },
          { icon: <span aria-hidden="true">😰</span>, label: "New words wobble" },
          { icon: <span aria-hidden="true">🎭</span>, label: "The demo trap" },
          { icon: <span aria-hidden="true">🗄️</span>, label: "The drawer" },
        ]}
      />

      {/* SCENE 1 — perfect on the studied cards */}
      <Scene caption="So ask Rasoi's tuned assistant a card it studied: flawless.">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
          <MachineFigure label="Rasoi's tuned assistant" />
          <SpeechBubble side="left">…exact house reply, word for word. ✨</SpeechBubble>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          On the practiced pack, everything looks perfect. That&apos;s the problem — this is a{" "}
          <span className="font-bold">report card from memory</span>.
        </p>
      </Scene>

      {/* SCENE 2 — wobble on fresh wording */}
      <Scene variant="continue" caption="But the same intent in new words — the confidence collapses.">
        <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <MotionChild>
            <div className="h-full rounded-xl border border-dashed border-ash bg-canvas p-4">
              <p className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">studied card</p>
              <p className="mt-1 text-xs font-medium text-ink-faint">“I want my money back”</p>
              <p className="mt-2 text-xs font-semibold text-ink-soft">→ crisp three-line house reply ✓</p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="h-full rounded-xl border border-brand bg-brand-wash p-4 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">fresh wording</p>
              <p className="mt-1 text-xs font-medium text-ink">“charged twice for one order, pls fix”</p>
              <p className="mt-2 text-xs font-semibold text-ink">→ long, off-tone ramble ✗</p>
            </div>
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Memorization is cheaper than understanding — given enough replays, the model takes the discount.
        </p>
      </Scene>

      {/* SCENE 3 — the demo trap */}
      <Scene variant="continue" caption="Then Arjun demos it to the bank — ten questions, all from the pack.">
        <div className="mx-auto max-w-md space-y-2">
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated px-4 py-2.5 shadow-sm">
              <p className="text-xs font-semibold text-ink">The demo: ten questions — all from the training pack 🎉</p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated px-4 py-2.5 shadow-sm">
              <p className="text-xs font-semibold text-ink">Week 1: real customers, new phrasings…</p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-brand bg-brand-wash px-4 py-2.5">
              <p className="text-xs font-semibold text-ink">Grading on studied cards rewards recall — the exact signature of a parrot</p>
            </div>
          </MotionChild>
        </div>
      </Scene>

      {/* SCENE 4 — the defense */}
      <Scene variant="continue" caption="That's why the defense is holding fresh questions back.">
        <div className="mx-auto flex max-w-lg flex-col items-center gap-3 sm:flex-row sm:gap-6">
          <div className="rounded-xl border border-brand bg-brand-wash px-5 py-4 text-center shadow-sm">
            <span className="text-2xl">🗄️</span>
            <p className="mt-1 text-xs font-bold text-ink">the drawer</p>
            <p className="text-[11px] font-medium text-ink-soft">10–20 real requests, locked away pre-training</p>
          </div>
          <MachineFigure label="asked cold, after" />
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Practiced cards shine, drawer wobbles → you&apos;ve met the parrot. Fewer replays, richer pack.
        </p>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          Never grade a tune on{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">its own flashcards</span> —
          the drawer of fresh questions is the honest exam.
        </p>
      </Card>
    </Infographic>
  );
}
