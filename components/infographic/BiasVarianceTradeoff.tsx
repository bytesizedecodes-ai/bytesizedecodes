import {
  Infographic,
  InfographicHeader,
  Card,
  CardTitle,
  Takeaway,
} from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild, Reveal } from "./motion";

/**
 * Intermediate course — Lesson: "The Goldilocks diagnosis" (bias–variance).
 *
 * Through-line: the train-vs-test error pair as the model grows more complex.
 * The aha: you never need to SEE the model — the two error numbers alone tell
 * you which disease you have. High both = bias (underfit); low train + high
 * test = variance (overfit).
 */
export function BiasVarianceTradeoff() {
  return (
    <Infographic>
      <InfographicHeader
        title="The Goldilocks diagnosis"
        subtitle="Bias–variance: two error numbers tell you which way your model is broken"
      />

      {/* Beat 1 — the two failure shapes */}
      <Scene caption="① Two ways to be wrong, one right">
        <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-3">
          <MotionChild>
            <ErrorCard
              title="Underfit · high bias"
              train="train error 31%"
              test="test error 33%"
              note="too simple to see the pattern — wrong on the data it studied AND new data"
            />
          </MotionChild>
          <MotionChild>
            <ErrorCard
              title="Just right"
              train="train error 6%"
              test="test error 8%"
              note="captures the real pattern; the small gap is honest noise"
              good
            />
          </MotionChild>
          <MotionChild>
            <ErrorCard
              title="Overfit · high variance"
              train="train error 0.4%"
              test="test error 21%"
              note="memorized the study material — brilliant in training, lost on new data"
            />
          </MotionChild>
        </Stagger>
      </Scene>

      {/* Beat 2 — the diagnostic table */}
      <Scene caption="② The diagnosis needs no pictures — only the two numbers">
        <Stagger className="space-y-2">
          <MotionChild>
            <DiagnosisRow symptom="train error HIGH, test error HIGH" verdict="High bias — the model can't even fit what it studied" fix="more complexity: more features, deeper tree, bigger network" />
          </MotionChild>
          <MotionChild>
            <DiagnosisRow symptom="train error LOW, test error HIGH" verdict="High variance — it memorized instead of learning" fix="more data, simpler model, regularization" accent />
          </MotionChild>
          <MotionChild>
            <DiagnosisRow symptom="train error LOW, test error CLOSE BEHIND" verdict="The fit generalizes — ship it to eval" fix="stop tuning; lock it and measure honestly" />
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-xs font-medium text-ink sm:text-sm">
          The <span className="font-bold">gap</span> between the two numbers is the tell — the size of the
          gap is the size of the memorization.
        </p>
      </Scene>

      {/* Beat 3 — the complexity dial */}
      <Scene caption="③ Turn the complexity dial and test error makes a U">
        <UCurve />
        <p className="mt-2 text-center text-xs font-medium text-ink sm:text-sm">
          Left: too simple, both errors high. Right: too complex, the gap explodes. The game is finding the
          bottom of the U — and remembering it moves as data grows.
        </p>
      </Scene>

      <Reveal>
        <Card tone="brand" rotate={0}>
          <CardTitle icon="✦">The takeaway</CardTitle>
          <Takeaway>
            Don&apos;t ask “is the model good?” — ask <strong>where its errors are</strong>. High everywhere is bias;
            a wide train–test gap is variance. Each disease has a different cure, and mixing them up makes both worse.
          </Takeaway>
        </Card>
      </Reveal>
    </Infographic>
  );
}

/** Train/test error cards — the two numbers ARE the through-line. */
function ErrorCard({
  title,
  train,
  test,
  note,
  good = false,
}: {
  title: string;
  train: string;
  test: string;
  note: string;
  good?: boolean;
}) {
  const tone = good
    ? { border: "border-good", head: "text-good", chip: "bg-good-wash" }
    : { border: "border-bad", head: "text-bad", chip: "bg-bad-wash" };
  return (
    <div className={`rounded-xl border-2 ${tone.border} bg-surface-elevated p-3 text-center shadow-sm`}>
      <div className={`text-[11px] font-bold ${tone.head}`}>{title}</div>
      <div className="mt-2 flex justify-center gap-1.5">
        <span className={`rounded-full px-2 py-0.5 font-mono text-[9.5px] font-bold text-ink ${tone.chip}`}>{train}</span>
        <span className={`rounded-full px-2 py-0.5 font-mono text-[9.5px] font-bold text-ink ${tone.chip}`}>{test}</span>
      </div>
      <p className="mt-1.5 text-[10px] font-medium leading-relaxed text-ink-soft">{note}</p>
    </div>
  );
}

function DiagnosisRow({
  symptom,
  verdict,
  fix,
  accent = false,
}: {
  symptom: string;
  verdict: string;
  fix: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-1 rounded-xl border px-4 py-2.5 shadow-sm sm:flex-row sm:items-center sm:gap-4 ${
        accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"
      }`}
    >
      <div className="w-full font-mono text-[10.5px] font-bold text-ink sm:w-2/5">{symptom}</div>
      <div className="min-w-0 flex-1">
        <div className="text-[11px] font-bold text-ink">{verdict}</div>
        <p className="text-[10px] font-medium text-ink-soft">fix: {fix}</p>
      </div>
    </div>
  );
}

/** The U-curve: test error vs model complexity, with train error diving to zero. */
function UCurve() {
  // train: dives toward 0. test: U with minimum ~45%
  const trainPts = [5, 14, 24, 37, 50, 60, 68];
  const testPts = [8, 20, 32, 42, 50, 56, 64];
  const xs = [14, 26, 38, 50, 62, 74, 86];
  const toY = (v: number) => 70 - (v / 75) * 60;
  return (
    <svg viewBox="0 0 100 80" className="h-auto w-full" aria-hidden="true">
      <line x1="8" y1="72" x2="94" y2="72" stroke="var(--color-ash)" strokeWidth="1" />
      <line x1="8" y1="6" x2="8" y2="74" stroke="var(--color-ash)" strokeWidth="1" />
      {/* train error: monotonically down */}
      <path d={`M${xs.map((x, i) => `${x} ${toY(trainPts[i]!)}`).join(" L")}`} fill="none" stroke="var(--color-brand)" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 2" />
      {/* test error: U shape */}
      <path d={`M${xs.map((x, i) => `${x} ${toY(testPts[i]!)}`).join(" L")}`} fill="none" stroke="var(--color-brand-deep)" strokeWidth="2.5" strokeLinecap="round" />
      {/* the sweet spot */}
      <circle cx="50" cy={toY(42)} r="2.6" fill="var(--color-good)" />
      <text x="52" y={toY(42) + 1.5} fontFamily="monospace" fontSize="4.4" fill="var(--color-good)">sweet spot</text>
      {/* annotations */}
      <text x="14" y="9" fontFamily="monospace" fontSize="4.4" fill="var(--color-brand)">— — train error</text>
      <text x="14" y="14.5" fontFamily="monospace" fontSize="4.4" fill="var(--color-brand-deep)">—— test error</text>
      <text x="50" y="79" textAnchor="middle" fontFamily="monospace" fontSize="5.5" fill="var(--color-ink-soft)">
        model complexity →
      </text>
      <text x="10" y="5" fontFamily="monospace" fontSize="5.5" fill="var(--color-ink-soft)">error</text>
    </svg>
  );
}
