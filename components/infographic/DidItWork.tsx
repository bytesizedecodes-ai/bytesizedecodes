import { Infographic, InfographicHeader, Card } from "./primitives";
import { MachineFigure, Scene, StoryMap, SpeechBubble } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Fine-Tuning Foundations — Lesson 14: "Did it work?" (v2 Thread retrofit).
 *
 * Through-line stage: the drawer — locked before Arjun trains Rasoi's
 * assistant, same box every scene. States: filled with real requests and
 * locked → asked before and after (the before ghosts beside the accented
 * after) → what only fresh questions can show → re-run for every attempt.
 */
export function DidItWork() {
  return (
    <Infographic>
      <InfographicHeader
        title="Did it work?"
        subtitle="Never quiz the student on the exact flashcards — ask fresh questions"
      />

      <StoryMap
        steps={[
          { icon: <span aria-hidden="true">🗄️</span>, label: "Lock the drawer" },
          { icon: <span aria-hidden="true">🔍</span>, label: "Before and after" },
          { icon: <span aria-hidden="true">🧪</span>, label: "What fresh reveals" },
          { icon: <span aria-hidden="true">🔁</span>, label: "Every attempt" },
        ]}
      />

      {/* SCENE 1 — lock the drawer BEFORE training */}
      <Scene caption="So before training, Arjun locks real customer requests in a drawer.">
        <div className="mx-auto flex max-w-lg flex-col items-center gap-3 sm:flex-row sm:gap-6">
          <div className="rounded-xl border border-ash bg-surface-elevated px-5 py-4 text-center shadow-sm">
            <span className="text-2xl">🗄️</span>
            <p className="mt-1 text-xs font-bold text-ink">the drawer · 10–20 questions</p>
            <p className="text-[11px] font-medium text-ink-soft">awkward, misspelled, two-in-one — the real kind</p>
          </div>
          <MachineFigure label="never practices on them" confused />
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Locked away pre-training. They exist to be asked cold.
        </p>
      </Scene>

      {/* SCENE 2 — before / after on the same drawer */}
      <Scene variant="continue" caption="Then the same drawer gets asked before the tune and after it.">
        <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <MotionChild>
            <div className="h-full rounded-xl border border-dashed border-ash bg-canvas p-4">
              <p className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">before · fresh question</p>
              <p className="mt-1 text-xs font-medium text-ink-faint">“my stuffs late wtf”</p>
              <p className="mt-2 text-xs text-ink-soft">→ long formal paragraph, no fix offered</p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="h-full rounded-xl border border-brand bg-brand-wash p-4 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">after · same question</p>
              <p className="mt-1 text-xs font-medium text-ink">“my stuffs late wtf”</p>
              <p className="mt-2 text-xs font-semibold text-brand-deep">→ calm three lines, refund started ✓</p>
            </div>
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Same questions, side by side — the only comparison where your eyes can&apos;t fool you.
        </p>
      </Scene>

      {/* SCENE 3 — what the drawer catches */}
      <Scene variant="continue" caption="But only fresh questions can show what matters.">
        <div className="mx-auto max-w-md space-y-2">
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated px-4 py-2.5 shadow-sm">
              <p className="text-xs font-semibold text-ink">Did the style <span className="font-bold">transfer</span> to new wording?</p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated px-4 py-2.5 shadow-sm">
              <p className="text-xs font-semibold text-ink">Did <span className="font-bold">general skill survive</span> — greetings, graceful confusion?</p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-brand bg-brand-wash px-4 py-2.5">
              <p className="text-xs font-semibold text-ink">Memory (practiced cards) can&apos;t answer either — that&apos;s the point</p>
            </div>
          </MotionChild>
        </div>
      </Scene>

      {/* SCENE 4 — the forever tool */}
      <Scene variant="continue" caption="That's why the drawer reruns after every attempt — better, or it isn't.">
        <div className="flex items-center justify-center gap-3 sm:gap-6">
          {["attempt 1", "attempt 2", "attempt 3"].map((a, i) => (
            <div key={a} className="flex items-center gap-3">
              <div
                className={`rounded-xl px-3 py-2 text-center shadow-sm ${
                  i === 2 ? "border border-brand bg-brand-wash" : "border border-ash bg-surface-elevated"
                }`}
              >
                <p className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">{a}</p>
                <p className="font-mono text-[11px] font-semibold text-ink">drawer →</p>
              </div>
              {i < 2 && <span className="text-lg font-bold text-ink-soft">·</span>}
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-center gap-3">
          <MachineFigure label="same drawer, every time" />
          <SpeechBubble side="left">Better — or it isn&apos;t.</SpeechBubble>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          One page of fresh questions, honestly scored, beats every vibes-based celebration in the field.
        </p>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          Grade the tune on the{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">drawer of fresh
          questions</span> — before/after, every attempt.
        </p>
      </Card>
    </Infographic>
  );
}
