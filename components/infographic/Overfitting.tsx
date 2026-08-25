import { Infographic, InfographicHeader, Card } from "./primitives";
import { Scene, StoryMap } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Layman course — Lesson: "Memorizing vs. understanding" (overfitting) (v2
 * Thread retrofit).
 *
 * Through-line stage: the SAME scatter of points, fitted by a different curve
 * each scene — flat and ignoring the shape (ghost of a miss), wiggly and
 * hugging every point, smooth and just right. Beats: anchor (three learners,
 * one exam) → tension (the memorizer's 100% collapses on new data) →
 * resolution (the sweet spot). The dots never move; only the drawn curve
 * changes state.
 */
export function Overfitting() {
  return (
    <Infographic>
      <InfographicHeader
        title="Memorizing vs. understanding"
        subtitle="A model can be perfect on its training data — and still be wrong"
      />

      <StoryMap
        steps={[
          { icon: <span aria-hidden="true">〰️</span>, label: "Three curves, same dots" },
          { icon: <span aria-hidden="true">💯</span>, label: "100% looks great" },
          { icon: <span aria-hidden="true">📉</span>, label: "New data collapses" },
          { icon: <span aria-hidden="true">🎯</span>, label: "The just-right line" },
        ]}
      />

      {/* Step 1 — the same data, three different models */}
      <Scene caption="So the same data gets learned three different ways">
        <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-3">
          <MotionChild>
            <CurveCard
              label="Too simple"
              verdict="underfit"
              note="ignores the shape — misses the pattern"
              path="M10 70 Q50 68 90 66"
            />
          </MotionChild>
          <MotionChild>
            <CurveCard
              label="Too complex"
              verdict="overfit"
              note="hugs every point — memorized, not learned"
              path="M10 66 Q22 30 30 64 T48 58 Q58 22 66 62 T90 30"
            />
          </MotionChild>
          <MotionChild>
            <CurveCard
              label="Just right"
              verdict="good"
              note="captures the trend, ignores the noise"
              path="M10 68 Q40 54 50 50 Q60 46 90 32"
            />
          </MotionChild>
        </Stagger>
      </Scene>

      {/* Step 2 — why overfitting is seductive and dangerous */}
      <Scene variant="continue" caption="But memorizing looks great — until new data arrives">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <div className="rounded-xl border border-good bg-good-wash p-4 text-center shadow-sm">
            <div className="text-sm font-bold text-good">On training data</div>
            <div className="mt-1 font-mono text-lg font-bold text-good">100%</div>
            <p className="mt-1 text-[11px] font-medium text-ink">the overfit model nails every point it saw</p>
          </div>
          <div className="rounded-xl border border-bad bg-bad-wash p-4 text-center shadow-sm">
            <div className="text-sm font-bold text-bad">On new (test) data</div>
            <div className="mt-1 font-mono text-lg font-bold text-bad">poor</div>
            <p className="mt-1 text-[11px] font-medium text-ink">it memorized, it didn&apos;t learn the pattern</p>
          </div>
        </div>
      </Scene>

      {/* Step 3 — the sweet spot */}
      <Scene caption="That's why the goal is: capture the trend, ignore the noise">
        <div className="rounded-xl border border-brand bg-brand-wash px-4 py-4 text-center">
          <p className="text-sm font-medium text-ink sm:text-base">
            A good model is{" "}
            <span className="font-bold">simple enough to generalize</span>, but{" "}
            <span className="font-bold">complex enough to capture the real pattern</span>.
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          Perfect on training data is a{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">warning</span>,
          not a win — it may have just memorized the answers.
        </p>
      </Card>
    </Infographic>
  );
}

/** A scatter plot with a fitted curve drawn through it, plus a verdict. */
function CurveCard({
  label,
  verdict,
  note,
  path,
}: {
  label: string;
  verdict: "underfit" | "overfit" | "good";
  note: string;
  path: string;
}) {
  const tone =
    verdict === "good"
      ? { border: "border-good", badge: "bg-good text-canvas", text: "text-good", stroke: "var(--color-good)" }
      : verdict === "overfit"
        ? { border: "border-bad", badge: "bg-bad text-canvas", text: "text-bad", stroke: "var(--color-bad)" }
        : { border: "border-ash", badge: "bg-ink text-canvas", text: "text-ink-soft", stroke: "var(--color-ink-faint)" };
  // scatter points
  const pts = [
    [16, 62], [26, 58], [34, 60], [42, 52], [50, 54], [58, 44], [66, 46], [74, 38], [82, 34],
  ];
  return (
    <div className={`rounded-xl border-2 ${tone.border} bg-surface-elevated p-3 text-center shadow-sm`}>
      <svg viewBox="0 0 100 80" className="h-auto w-full" aria-hidden="true">
        {/* axes */}
        <line x1="8" y1="74" x2="94" y2="74" stroke="var(--color-ash)" strokeWidth="1" />
        <line x1="8" y1="6" x2="8" y2="74" stroke="var(--color-ash)" strokeWidth="1" />
        {/* scatter */}
        {pts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.4" fill="var(--color-brand-deep)" />
        ))}
        {/* the fitted curve */}
        <path d={path} fill="none" stroke={tone.stroke} strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <div className="mt-2 text-xs font-bold text-ink">{label}</div>
      <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${tone.badge}`}>
        {verdict}
      </span>
      <p className="mt-1 text-[11px] font-medium text-ink-soft">{note}</p>
    </div>
  );
}
