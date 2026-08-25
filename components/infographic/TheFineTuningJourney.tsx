import { Infographic, InfographicHeader, Card } from "./primitives";
import { Scene, StoryMap } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Fine-Tuning Foundations — Lesson 16: "The whole journey on one trail" (v2
 * Thread retrofit).
 *
 * Through-line stage: the trail itself — one path, same spot, every scene.
 * States: seen from the top (Arjun's whole journey laid out) → the six stops
 * each guarding the previous failure → the course compressed into one
 * shippable plan (the drawer line accented) → the hand-off down into the
 * workshop.
 */
export function TheFineTuningJourney() {
  const stops = [
    { n: "①", t: "DECIDE", d: "behavior to train · facts stay in documents", fail: "defeats: training a fact" },
    { n: "②", t: "GATHER", d: "example pairs, one voice, in the serving script", fail: "defeats: wobbly tone" },
    { n: "③", t: "PRACTICE", d: "replays on a borrowed free GPU", fail: "defeats: no habit set" },
    { n: "④", t: "WATCH", d: "parroting? forgetting? mixed diet if needed", fail: "defeats: the parrot" },
    { n: "⑤", t: "CHECK", d: "the drawer of fresh questions, before/after", fail: "defeats: memory graded as skill" },
    { n: "⑥", t: "SHARE", d: "the clip-on + the drawer, versioned", fail: "defeats: unreproducible tunes" },
  ];

  return (
    <Infographic>
      <InfographicHeader
        title="The whole journey on one trail"
        subtitle="Six rest stops — and the failure each one prevents"
      />

      <StoryMap
        steps={[
          { icon: <span aria-hidden="true">⛰️</span>, label: "One trail, six stops" },
          { icon: <span aria-hidden="true">🛡️</span>, label: "Each stop guards" },
          { icon: <span aria-hidden="true">📝</span>, label: "One shippable plan" },
          { icon: <span aria-hidden="true">🔧</span>, label: "Down to the workshop" },
        ]}
      />

      {/* SCENE 1 — the trail */}
      <Scene caption="So stand at the top of Arjun's trail and look back down.">
        <div className="mx-auto max-w-2xl">
          <svg viewBox="0 0 300 60" className="h-auto w-full" aria-hidden="true">
            <path
              d="M10 50 C 60 50, 60 10, 120 10 S 180 45, 240 42 L 290 30"
              fill="none"
              stroke="var(--color-brand)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="1 0"
            />
            {[16, 68, 120, 172, 224, 284].map((x, i) => (
              <circle key={i} cx={x} cy={i % 2 === 0 ? 46 - i * 3 : 22 + i * 2} r="4" fill="var(--color-brand)" />
            ))}
          </svg>
          <div className="mt-2 flex justify-between text-[10px] font-bold uppercase tracking-wide text-ink-soft">
            <span>decide</span>
            <span>gather</span>
            <span>practice</span>
            <span>watch</span>
            <span>check</span>
            <span>share</span>
          </div>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Every disappointing tune skipped a stop — and the skipped one is nearly always the checking.
        </p>
      </Scene>

      {/* SCENE 2 — the stops, each guarding the last */}
      <Scene variant="continue" caption="Then read each stop against the failure it prevents.">
        <Stagger className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
          {stops.map((s) => (
            <MotionChild key={s.t}>
              <div className="flex items-start gap-3 rounded-xl border border-ash bg-surface-elevated px-4 py-3 shadow-sm">
                <span className="font-mono text-sm font-bold text-brand-deep">{s.n}</span>
                <div>
                  <p className="text-xs font-bold tracking-wide text-ink">
                    {s.t} <span className="font-medium normal-case text-ink-soft">— {s.d}</span>
                  </p>
                  <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink-soft">{s.fail}</p>
                </div>
              </div>
            </MotionChild>
          ))}
        </Stagger>
      </Scene>

      {/* SCENE 3 — one shippable plan */}
      <Scene variant="continue" caption="But a plan beats a map — the course in five lines.">
        <div className="mx-auto max-w-md space-y-2">
          {[
            "train the tone (stable for years) · prices live in a document",
            "start from the maker's chat model · cards in the serving script",
            "borrow the free GPU · checkpoints saved to Drive as you go",
            "mix ~20% everyday chat into the pack",
            "grade on the locked drawer — before/after, every attempt",
          ].map((line, i) => (
            <MotionChild key={line}>
              <div
                className={`rounded-xl px-4 py-2.5 ${
                  i === 4 ? "border border-brand bg-brand-wash" : "border border-ash bg-surface-elevated"
                }`}
              >
                <p className="text-xs font-semibold text-ink">{line}</p>
              </div>
            </MotionChild>
          ))}
        </div>
      </Scene>

      {/* SCENE 4 — where the trail continues */}
      <Scene variant="continue" caption="That's why the next course goes down into the workshop.">
        <div className="mx-auto max-w-md rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
          <p className="text-sm font-semibold text-ink">
            You hold the complete beginner&apos;s map — what tuning is, what it holds, how it fails, how it&apos;s judged.
          </p>
          <p className="mt-1 text-xs font-medium text-ink-soft">
            Next: the workshop floor — real datasets, real runs, your first end-to-end tune.
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          Decide → gather → practice → watch →{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">check</span> → share. Skip
          no stop.
        </p>
      </Card>
    </Infographic>
  );
}
