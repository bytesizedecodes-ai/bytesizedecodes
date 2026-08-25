import { Infographic, InfographicHeader, Card } from "./primitives";
import { Scene, StoryMap } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Layman course — Lesson: "Predicting a number, not a category" (regression)
 * (v2 Thread retrofit).
 *
 * Through-line stage: Vikram's delivery chart — the same scatter of his past
 * tiffin runs, in the same spot, gaining one layer per scene: bare dots →
 * the trend line + the dashed read-off. Beats: hook (a question that isn't a
 * bucket) → anchor (past runs as dots) → reveal (the line; read the answer
 * off it) → fade (the number-promises you already rely on daily).
 */
export function PredictingNumbers() {
  return (
    <Infographic>
      <InfographicHeader
        title="Which one? vs How much?"
        subtitle="Sometimes the answer is a bucket — sometimes it's a number"
      />

      <StoryMap
        steps={[
          { icon: <span aria-hidden="true">🛵</span>, label: "Vikram's trips ask" },
          { icon: <span aria-hidden="true">🔵</span>, label: "Past runs plotted" },
          { icon: <span aria-hidden="true">📈</span>, label: "Draw the trend" },
          { icon: <span aria-hidden="true">📏</span>, label: "Read the answer" },
        ]}
      />

      {/* Step 1 — two different questions */}
      <Scene caption="So far every answer was a bucket — but Vikram's trips ask 'how long?'">
        <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wide text-ink-soft">
                The question
              </div>
              <p className="mt-1 text-sm font-bold text-ink">Car or bike?</p>
              <div className="mx-auto mt-3 h-px w-16 bg-ash" />
              <div className="mt-3 text-xs font-bold uppercase tracking-wide text-ink-soft">
                The answer it learned
              </div>
              <p className="mt-1 font-mono text-lg font-bold text-brand-deep">
                car
              </p>
              <p className="mt-1 text-[11px] font-medium text-ink-soft">
                a bucket — one of a few choices
              </p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-brand bg-brand-wash p-4 text-center shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wide text-ink-soft">
                The question
              </div>
              <p className="mt-1 text-sm font-bold text-ink">How long is Vikram&apos;s trip?</p>
              <div className="mx-auto mt-3 h-px w-16 border border-brand" />
              <div className="mt-3 text-xs font-bold uppercase tracking-wide text-ink-soft">
                The answer it learned
              </div>
              <p className="mt-1 font-mono text-lg font-bold text-brand-deep">
                32 min
              </p>
              <p className="mt-1 text-[11px] font-medium text-ink-soft">
                a number — anywhere on the scale
              </p>
            </div>
          </MotionChild>
        </Stagger>
      </Scene>

      {/* Step 2 — past examples become a picture */}
      <Scene variant="continue" caption="Then plot his past runs as dots — a pattern appears">
        <TrendChart
          caption="Vikram's past runs: distance → minutes actually taken"
          highlight={false}
        />
        <p className="mt-3 text-center text-xs font-medium text-ink sm:text-sm">
          Farther trips took longer. The dots drift upward together — that drift is the pattern.
        </p>
      </Scene>

      {/* Step 3 — the trend line, and reading a prediction off it */}
      <Scene variant="continue" caption="So draw the trend — and read new answers off it">
        <TrendChart
          caption="the line hugs the trend; a new run reads up to the line, across to minutes"
          highlight
        />
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
          {[
            { q: "New trip: 6 km", a: "≈ 18 min" },
            { q: "New trip: 9 km", a: "≈ 26 min" },
            { q: "New trip: 13 km", a: "≈ 37 min" },
          ].map((item) => (
            <div
              key={item.q}
              className="rounded-xl border border-ash bg-surface-elevated px-3 py-2.5 text-center shadow-sm"
            >
              <div className="text-[11px] font-semibold text-ink-soft">{item.q}</div>
              <div className="mt-0.5 font-mono text-sm font-bold text-brand-deep">{item.a}</div>
            </div>
          ))}
        </div>
      </Scene>

      {/* Step 4 — you already use this daily */}
      <Scene variant="continue" caption="That's why apps can promise a number, not a bucket">
        <Stagger className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
          <MotionChild>
            <ExampleCard title="Delivery apps" note="“Arrives in 24 min” — learned from millions of past deliveries" />
          </MotionChild>
          <MotionChild>
            <ExampleCard title="Ride fares" note="“₹182 for this route” — estimated before you book" />
          </MotionChild>
          <MotionChild>
            <ExampleCard title="Weather" note="“Tomorrow: 31°C” — a number, not a bucket" />
          </MotionChild>
        </Stagger>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          A classifier picks a <span className="underline decoration-brand-deep decoration-2 underline-offset-2">bucket</span>.
          A number-predictor reads the answer off the <span className="underline decoration-brand-deep decoration-2 underline-offset-2">trend</span>.
        </p>
      </Card>
    </Infographic>
  );
}

/** The through-line visual: distance vs minutes, with and without the trend line. */
function TrendChart({ caption, highlight }: { caption: string; highlight?: boolean }) {
  // distance (x, km 1–14) → minutes (y): roughly 3·x + 2, with noise
  const pts: [number, number][] = [
    [14, 8], [24, 11], [34, 15], [44, 17], [52, 16], [60, 22], [68, 24],
    [76, 23], [84, 30], [90, 32],
  ];
  return (
    <figure>
      <svg viewBox="0 0 100 80" className="h-auto w-full" aria-hidden="true">
        {/* axes */}
        <line x1="8" y1="74" x2="94" y2="74" stroke="var(--color-ash)" strokeWidth="1" />
        <line x1="8" y1="6" x2="8" y2="74" stroke="var(--color-ash)" strokeWidth="1" />
        {/* the trend line */}
        {highlight && (
          <path
            d="M12 68 L92 18"
            fill="none"
            stroke="var(--color-brand)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        )}
        {/* scatter */}
        {pts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.4" fill="var(--color-brand-deep)" />
        ))}
        {/* the new-trip read: up from 10 km → line → across to minutes */}
        {highlight && (
          <>
            <circle cx="70" cy="74" r="3" fill="var(--color-brand)" />
            <path
              d="M70 74 L70 39 L92 39"
              fill="none"
              stroke="var(--color-brand)"
              strokeWidth="1.4"
              strokeDasharray="3 2.5"
            />
            <text x="71.5" y="43" fontFamily="monospace" fontSize="7" fill="var(--color-brand)" fontWeight="bold">
              ≈26
            </text>
          </>
        )}
        {/* axis labels */}
        <text x="50" y="79.5" textAnchor="middle" fontFamily="monospace" fontSize="5.5" fill="var(--color-ink-soft)">
          distance
        </text>
        <text x="10" y="5" fontFamily="monospace" fontSize="5.5" fill="var(--color-ink-soft)">
          minutes
        </text>
      </svg>
      <figcaption className="mt-1 text-center text-[11px] font-medium text-ink-soft">
        {caption}
      </figcaption>
    </figure>
  );
}

function ExampleCard({ title, note }: { title: string; note: string }) {
  return (
    <div className="rounded-xl border border-ash bg-surface-elevated px-3 py-3 text-center shadow-sm">
      <div className="text-xs font-bold text-ink sm:text-[13px]">{title}</div>
      <p className="mt-0.5 text-[11px] font-medium leading-relaxed text-ink-soft">{note}</p>
    </div>
  );
}
