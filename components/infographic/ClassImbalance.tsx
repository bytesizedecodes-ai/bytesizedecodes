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
 * Intermediate course — Lesson: "Class imbalance: when 99% is nothing".
 *
 * Derived, not described: metrics are 2×2 counts weighted by frequency →
 * on a 0.5% problem the negative cells dominate any frequency-weighted sum →
 * a never-positive model scores 99.5% → a metric the null model saturates is
 * decoration → grade the rare cells directly (recall · precision · AUPRC)
 * and weight the loss so rare positives pull.
 */
export function ClassImbalance() {
  return (
    <Infographic>
      <InfographicHeader
        title="Class imbalance · when 99% is nothing"
        subtitle="1,000 transactions, 5 fraud — and accuracy congratulates you for doing nothing"
      />

      {/* Beat 1 — the crowd: the rare class is invisible at base rate */}
      <Scene caption="① 1,000 transactions · 5 are fraud">
        <DotGrid />
        <p className="mt-2 text-center text-xs font-medium text-ink sm:text-sm">
          The rare class is <span className="font-bold">0.5%</span> of the data —
          any metric that counts rows will be dominated by the other 99.5%.
        </p>
      </Scene>

      {/* Beat 2 — the aha: accuracy cannot see the difference; recall can */}
      <Scene caption="② Two models, two grades — only one metric can tell them apart">
        <BarCompare />
        <p className="mt-2 text-center text-xs font-medium text-ink sm:text-sm">
          The <span className="font-bold">never-fraud</span> model and a model catching{" "}
          <span className="font-bold">4 of 5 fraud</span> are indistinguishable on accuracy —
          and 0.2 points apart in the wrong direction. Recall separates them at a glance.
        </p>
      </Scene>

      {/* Beat 3 — grade the rare cells */}
      <Scene caption="③ The honest grade reads the rare cells directly">
        <Stagger className="grid grid-cols-1 gap-2 sm:grid-cols-4 sm:gap-2.5">
          {[
            { top: "Recall", bottom: "of the actual fraud, how much did we catch? — the misses metric" },
            { top: "Precision", bottom: "of what we flagged, how much was real? — the false-alarm metric" },
            { top: "AUPRC", bottom: "the full precision-recall curve as one number — the rare-class report card" },
            { top: "Class weights", bottom: "each rare positive pulls the loss as hard as many negatives — training-side fix", accent: true },
          ].map((step) => (
            <MotionChild key={step.top}>
              <div
                className={`rounded-xl border px-3 py-2.5 text-center shadow-sm ${
                  step.accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"
                }`}
              >
                <div className="text-[11px] font-bold text-ink">{step.top}</div>
                <p className="mt-0.5 text-[10.5px] font-medium leading-relaxed text-ink-soft">{step.bottom}</p>
              </div>
            </MotionChild>
          ))}
        </Stagger>
      </Scene>

      <Reveal>
        <Card tone="brand" rotate={0}>
          <CardTitle icon="✦">The takeaway</CardTitle>
          <Takeaway>
            Accuracy is a <strong>frequency-weighted</strong> sum, so a rare class barely moves it —
            and a do-nothing model can max it. Grade what you actually care about:
            <strong> recall, precision, AUPRC on the rare class</strong>, with class weights in
            training and a threshold priced by what a miss costs.
          </Takeaway>
        </Card>
      </Reveal>
    </Infographic>
  );
}

/** 1,000 dots (50 × 20), five of them fraud (accent) — the crowd made visible. */
function DotGrid() {
  const cols = 50;
  const rows = 20;
  const spacing = 2.0;
  const pad = 1.2;
  const fraud = new Set([37, 412, 655, 820, 941]);
  const dots = [];
  for (let i = 0; i < cols * rows; i++) {
    const cx = pad + (i % cols) * spacing;
    const cy = pad + Math.floor(i / cols) * spacing;
    const isFraud = fraud.has(i);
    dots.push(
      <circle
        key={i}
        cx={cx}
        cy={cy}
        r={isFraud ? 0.62 : 0.38}
        fill={isFraud ? "var(--color-brand)" : "var(--color-ash)"}
      />,
    );
  }
  return (
    <svg
      viewBox={`0 0 ${pad * 2 + (cols - 1) * spacing} ${pad * 2 + (rows - 1) * spacing}`}
      className="h-auto w-full"
      aria-label="A grid of 1,000 dots; five are highlighted as the fraud class"
      role="img"
    >
      {dots}
    </svg>
  );
}

/** Accuracy bars (indistinguishable) vs recall bars (night and day). */
function BarCompare() {
  const groups = [
    {
      label: "Accuracy",
      hint: "dominated by the 99.5% — cannot tell them apart",
      bars: [
        { name: "never-fraud", value: 99.5, display: "99.5%", accent: false },
        { name: "catches 4 of 5", value: 99.3, display: "99.3%", accent: true },
      ],
    },
    {
      label: "Recall on fraud",
      hint: "reads the rare cells — separation at a glance",
      bars: [
        { name: "never-fraud", value: 2, display: "0%", accent: false },
        { name: "catches 4 of 5", value: 80, display: "80%", accent: true },
      ],
    },
  ];
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {groups.map((group) => (
        <div key={group.label} className="rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wide text-ink">{group.label}</div>
          <div className="mt-0.5 text-[10.5px] font-medium text-ink-soft">{group.hint}</div>
          <div className="mt-3 space-y-2.5">
            {group.bars.map((bar) => (
              <div key={bar.name}>
                <div className="flex items-baseline justify-between text-[10.5px] font-medium">
                  <span className="text-ink-soft">{bar.name}</span>
                  <span className="font-bold text-ink">{bar.display}</span>
                </div>
                <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-ash/60">
                  <div
                    className={`h-full rounded-full ${bar.accent ? "bg-brand" : "bg-ink-faint"}`}
                    style={{ width: `${Math.max(bar.value, 2)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
