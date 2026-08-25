import { Infographic, InfographicHeader, Card } from "./primitives";
import { Scene, StoryMap } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Fine-Tuning Foundations — Lesson 7: "Practice makes patterns" (v2 Thread
 * retrofit).
 *
 * Through-line stage: Arjun's practice pack — the same strip of cards, same
 * spot, every scene; only the replay count changes (one pass → four passes,
 * the drift bars growing in the accent). The coherent-vs-mixed pack keeps
 * the dance's one-direction rule, and the sweet-spot dial teases the next
 * lesson's parrot.
 */
export function PracticeMakesPatterns() {
  return (
    <Infographic>
      <InfographicHeader
        title="Practice makes patterns"
        subtitle="A few hundred cards, replayed — like a song until the moves settle"
      />

      <StoryMap
        steps={[
          { icon: <span aria-hidden="true">🔂</span>, label: "One replay" },
          { icon: <span aria-hidden="true">📈</span>, label: "Drift compounds" },
          { icon: <span aria-hidden="true">🧭</span>, label: "One direction" },
          { icon: <span aria-hidden="true">🎯</span>, label: "The sweet spot" },
        ]}
      />

      {/* SCENE 1 — one pass */}
      <Scene caption="So pass 1: Arjun's whole pack of cards replays once.">
        <div className="mx-auto flex max-w-lg items-center justify-center gap-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className={`h-10 w-6 rounded-md border shadow-sm ${
                i < 3 ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"
              }`}
            />
          ))}
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Every card seen once. The sliders drift a hair — barely a habit yet.
        </p>
      </Scene>

      {/* SCENE 2 — passes compound */}
      <Scene variant="continue" caption="Then passes 2, 3, 4 — the same drift, stacking.">
        <div className="mx-auto grid max-w-lg grid-cols-4 gap-3">
          {[
            { p: "pass 1", w: "w-6", note: "a hair" },
            { p: "pass 2", w: "w-10", note: "a nudge" },
            { p: "pass 3", w: "w-14", note: "a lean" },
            { p: "pass 4", w: "w-20", note: "a habit" },
          ].map((row) => (
            <div key={row.p} className="rounded-xl border border-ash bg-surface-elevated p-2 text-center shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">{row.p}</p>
              <div className="mt-1.5 flex h-10 items-center justify-center">
                <div className={`h-2.5 ${row.w} rounded-full bg-brand`} />
              </div>
              <p className="mt-1 text-[10px] font-medium text-ink-soft">{row.note}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Same cards, same direction — each replay adds the same drift, and it stacks.
        </p>
      </Scene>

      {/* SCENE 3 — consistency is the load-bearing word */}
      <Scene variant="continue" caption="But the stacking holds only IF the cards agree — one direction, one habit.">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <div className="rounded-xl border border-brand bg-brand-wash p-4 text-center">
            <div className="text-xs font-bold uppercase tracking-wide text-ink-soft">coherent pack</div>
            <svg viewBox="0 0 120 40" className="mx-auto mt-1 h-auto w-full max-w-[220px]" aria-hidden="true">
              {[10, 16, 22, 28, 34].map((y, i) => (
                <line key={i} x1="10" y1={y} x2="110" y2={y - 6} stroke="var(--color-brand)" strokeWidth="2.5" strokeLinecap="round" />
              ))}
              <path d="M10 34 L110 4" stroke="var(--color-brand)" strokeWidth="1.2" strokeDasharray="3 3" fill="none" />
            </svg>
            <p className="mt-1 text-[11px] font-medium text-ink-soft">pulls together — the habit compounds</p>
          </div>
          <div className="rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wide text-ink-soft">mixed pack</div>
            <svg viewBox="0 0 120 40" className="mx-auto mt-1 h-auto w-full max-w-[220px]" aria-hidden="true">
              {[10, 16, 22, 28, 34].map((y, i) => (
                <line
                  key={i}
                  x1="10"
                  y1={y}
                  x2="110"
                  y2={i % 2 === 0 ? y - 6 : y + 6}
                  stroke="var(--color-ink-soft)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ))}
            </svg>
            <p className="mt-1 text-[11px] font-medium text-ink-soft">pulls against itself — mostly confusion learned</p>
          </div>
        </div>
      </Scene>

      {/* SCENE 4 — the sweet spot */}
      <Scene variant="continue" caption="That's why replay count has a sweet spot — too few, no habit; too many, the room gets memorized.">
        <div className="mx-auto max-w-lg">
          <div className="relative h-3 rounded-full bg-ash">
            <div className="absolute inset-y-0 left-[30%] right-[30%] rounded-full bg-brand" />
          </div>
          <div className="mt-2 flex justify-between text-[10px] font-semibold uppercase tracking-wide text-ink-soft">
            <span>habit never sets</span>
            <span className="text-brand-deep">the sweet spot</span>
            <span>the pack gets memorized →</span>
          </div>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Where the right edge sits — and how to catch it early — is the next lesson&apos;s whole story.
        </p>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          A small{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">consistent</span> pack,
          replayed — beats a large mixed one, every time.
        </p>
      </Card>
    </Infographic>
  );
}
