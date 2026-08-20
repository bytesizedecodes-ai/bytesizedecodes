import {
  Infographic,
  InfographicHeader,
  Card,
  CardTitle,
  CodePanel,
  Takeaway,
} from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild, Reveal } from "./motion";

/**
 * Intermediate course — Lesson: "Fitting a line to the data" (linear regression).
 *
 * Through-line: one scatter of flats (size → price) that every scene revisits.
 * "Fit" is made visible as the total squared gap between line and dots — the
 * best line is the one that minimizes it. Light code via CodePanel
 * (intermediate allowance).
 */
export function LinearRegression() {
  return (
    <Infographic>
      <InfographicHeader
        title="Fitting a line to the data"
        subtitle="Linear regression: predict a number by learning where the trend sits"
      />

      {/* Beat 1 — the question and the data */}
      <Scene caption="① The question: what should this flat cost?">
        <Stagger className="flex flex-col items-stretch justify-center gap-2 sm:flex-row sm:items-center sm:gap-3">
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated px-4 py-3 text-center shadow-sm">
              <div className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">input</div>
              <div className="mt-0.5 font-mono text-sm font-bold text-ink">82 m²</div>
            </div>
          </MotionChild>
          <MotionChild>
            <span className="mx-auto text-xl font-bold text-brand" aria-hidden="true">→</span>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-brand bg-brand-wash px-4 py-3 text-center shadow-sm">
              <div className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">output</div>
              <div className="mt-0.5 font-mono text-sm font-bold text-brand-deep">₹? lakh</div>
            </div>
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-xs font-medium text-ink sm:text-sm">
          Past sales are the teacher: every sold flat is one labelled example.
        </p>
      </Scene>

      {/* Beat 2 — what "fit" means: gaps to the line */}
      <Scene caption="② A line is a guess — the gaps are its errors">
        <FitChart showGaps />
        <p className="mt-3 text-center text-xs font-medium text-ink sm:text-sm">
          Each gap is one flat the line got wrong. Squared, then summed — that total is the line&apos;s{" "}
          <span className="font-bold text-brand-deep">loss</span>.
        </p>
      </Scene>

      {/* Beat 3 — the best line minimizes that total */}
      <Scene caption="③ Learning = sliding and tilting until the loss can't shrink">
        <Stagger className="space-y-2">
          <MotionChild>
            <TryRow label="Tilt A" loss="total error 3,840" note="too steep — systematically overprices big flats" />
          </MotionChild>
          <MotionChild>
            <TryRow label="Tilt B" loss="total error 912" note="flat-ish — underprices big flats" />
          </MotionChild>
          <MotionChild>
            <TryRow label="Learned line" loss="total error 118 ✓" note="no tilt improves it — this is the fit" accent />
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-xs font-medium text-ink sm:text-sm">
          Two numbers describe the winner: its <span className="font-bold">slope</span> (₹ per m²) and its{" "}
          <span className="font-bold">intercept</span> (base price). Those two numbers <em>are</em> the model.
        </p>
      </Scene>

      {/* Beat 4 — the code layer */}
      <Scene caption="④ In code, it's one fit and one predict">
        <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <MotionChild>
            <CodePanel
              label="Fit"
              caption="Finds the slope and intercept that minimize the squared gaps"
              code={`from sklearn.linear_model import LinearRegression

model = LinearRegression()
model.fit(X_train, y_train)   # learns slope + intercept
# model.coef_, model.intercept_`}
            />
          </MotionChild>
          <MotionChild>
            <CodePanel
              label="Predict"
              caption="The learned line, read at a new size"
              accent
              code={`price = model.predict([[82]])
# array([ 44.6 ])   # ₹44.6 lakh — read off the line`}
            />
          </MotionChild>
        </Stagger>
      </Scene>

      <Reveal>
        <Card tone="brand" rotate={0}>
          <CardTitle icon="✦">The takeaway</CardTitle>
          <Takeaway>
            Linear regression learns the line whose squared errors can&apos;t be made any smaller —
            then predicts by reading new inputs off it.
          </Takeaway>
        </Card>
      </Reveal>
    </Infographic>
  );
}

/** The through-line scatter: size vs price, with error gaps drawn to the fitted line. */
function FitChart({ showGaps }: { showGaps?: boolean }) {
  // size (x) → price (y), line ≈ 0.55·x + 6 with noise
  const pts: [number, number][] = [
    [16, 16], [24, 19], [32, 23], [40, 29], [48, 31], [56, 37], [64, 40], [74, 47], [84, 51],
  ];
  const lineY = (x: number) => 6 + 0.55 * x;
  return (
    <svg viewBox="0 0 100 80" className="h-auto w-full" aria-hidden="true">
      <line x1="8" y1="74" x2="94" y2="74" stroke="var(--color-ash)" strokeWidth="1" />
      <line x1="8" y1="6" x2="8" y2="74" stroke="var(--color-ash)" strokeWidth="1" />
      {showGaps &&
        pts.map(([x, y], i) => (
          <line
            key={i}
            x1={x}
            y1={y}
            x2={x}
            y2={lineY(x)}
            stroke="var(--color-bad)"
            strokeWidth="1.2"
            strokeDasharray="2 1.8"
          />
        ))}
      <path d={`M12 ${lineY(12)} L92 ${lineY(92)}`} fill="none" stroke="var(--color-brand)" strokeWidth="2.5" strokeLinecap="round" />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.4" fill="var(--color-brand-deep)" />
      ))}
      <text x="50" y="79.5" textAnchor="middle" fontFamily="monospace" fontSize="5.5" fill="var(--color-ink-soft)">
        size (m²)
      </text>
      <text x="10" y="5" fontFamily="monospace" fontSize="5.5" fill="var(--color-ink-soft)">
        price (₹ lakh)
      </text>
    </svg>
  );
}

function TryRow({ label, loss, note, accent = false }: { label: string; loss: string; note: string; accent?: boolean }) {
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border px-4 py-2.5 shadow-sm ${
        accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className="text-xs font-bold text-ink sm:text-[13px]">{label}</div>
        <p className="mt-0.5 text-[10.5px] font-medium leading-relaxed text-ink-soft">{note}</p>
      </div>
      <span className="shrink-0 rounded-full border border-ash bg-surface-elevated px-2 py-1 font-mono text-[9px] font-bold text-ink-soft">
        {loss}
      </span>
    </div>
  );
}
