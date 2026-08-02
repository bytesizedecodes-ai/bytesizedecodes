import { Infographic, InfographicHeader, Card } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Layman course — Lesson: "Memorizing vs. understanding" (overfitting).
 *
 * Teaches the overfit/underfit intuition without any math. Three drawn curves
 * through the same scatter of points: a wiggly line hugging every point
 * (overfit), a straight line ignoring the shape (underfit), and a smooth line
 * capturing the trend (just right). Brand blue + semantic good/bad only.
 * No prose/questions (course rule).
 */
export function Overfitting() {
  return (
    <Infographic>
      <InfographicHeader
        title="Memorizing vs. understanding"
        subtitle="A model can be perfect on its training data — and still be wrong"
      />

      {/* Step 1 — the same data, three different models */}
      <Scene caption="① The same data, learned three different ways">
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
      <Scene caption="② Overfitting looks great — until new data arrives">
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
      <Scene caption="③ The goal: capture the trend, ignore the noise">
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
      ? { border: "border-good", badge: "bg-good text-white", text: "text-good", stroke: "#5f9e77" }
      : verdict === "overfit"
        ? { border: "border-bad", badge: "bg-bad text-white", text: "text-bad", stroke: "#c1706b" }
        : { border: "border-ash", badge: "bg-ink text-white", text: "text-ink-soft", stroke: "#8b897f" };
  // scatter points
  const pts = [
    [16, 62], [26, 58], [34, 60], [42, 52], [50, 54], [58, 44], [66, 46], [74, 38], [82, 34],
  ];
  return (
    <div className={`rounded-xl border-2 ${tone.border} bg-white p-3 text-center shadow-sm`}>
      <svg viewBox="0 0 100 80" className="h-auto w-full" aria-hidden="true">
        {/* axes */}
        <line x1="8" y1="74" x2="94" y2="74" stroke="#e7e2d7" strokeWidth="1" />
        <line x1="8" y1="6" x2="8" y2="74" stroke="#e7e2d7" strokeWidth="1" />
        {/* scatter */}
        {pts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.4" fill="#4f72aa" />
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
