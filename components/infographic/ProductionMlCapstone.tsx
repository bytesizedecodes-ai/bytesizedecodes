import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild, Reveal } from "./motion";

/**
 * Advanced Machine Learning — Lesson 13 (capstone): "Anatomy of the loop".
 * The full Mango system: train → eval gates → shadow → canary → monitor
 * (data drift + concept drift) → retrain. Counter-beat: most 'drift' alarms
 * are pipeline bugs. Hands off to AI Observability.
 */
export function ProductionMlCapstone() {
  return (
    <Infographic>
      <InfographicHeader
        title="Anatomy of the loop"
        subtitle="Capstone: Mango's whole system on one page — from training run to retraining trigger"
      />

      {/* Beat 1 — the loop */}
      <Scene caption="① The system is a circle, not a pipeline">
        <LoopDiagram />
        <p className="mt-2 text-center text-[11px] font-medium text-ink-soft sm:text-xs">
          Every piece from the last twelve lessons occupies exactly one station —
          and the arrow from monitoring back to data is the difference between a
          demo and a product.
        </p>
      </Scene>

      {/* Beat 2 — the gates */}
      <Scene caption="② Nothing ships on a training score: the gates">
        <Stagger className="space-y-2">
          <MotionChild>
            <GateRow gate="Offline eval gate" detail="held-out disease F1 ≥ 0.85 · per-region slices ≥ 0.78 · leakage audit (Lesson 10, intermediate) clean — run on every candidate, automatically in CI" />
          </MotionChild>
          <MotionChild>
            <GateRow gate="Shadow gate" detail="the new model answers live traffic silently, answers logged, nothing shown — 2 weeks against the incumbent's decisions" />
          </MotionChild>
          <MotionChild>
            <GateRow gate="Canary gate" detail="5% of farmers see the new model; agreement, latency, and escape-rate watched hourly — auto-rollback on breach" accent />
          </MotionChild>
        </Stagger>
      </Scene>

      {/* Beat 3 — drift, the two kinds */}
      <Scene caption="③ What monitoring watches: two drifts, two meanings">
        <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
              <div className="text-xs font-bold text-brand">Data drift</div>
              <p className="mt-1 text-[11px] font-medium leading-relaxed text-ink-soft">
                Inputs moved: new camera phones, a new variety, seasonal lighting. The model&apos;s
                world no longer matches training. <span className="font-bold">Detectable without labels</span> —
                compare input distributions.
              </p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
              <div className="text-xs font-bold text-brand">Concept drift</div>
              <p className="mt-1 text-[11px] font-medium leading-relaxed text-ink-soft">
                The <em>relationship</em> moved: a resistant variety makes the same spots mean something
                else. Invisible in inputs — needs delayed labels (field confirmations) to catch.
                Slower, deadlier.
              </p>
            </div>
          </MotionChild>
        </Stagger>
      </Scene>

      {/* Beat 4 — the counter-beat */}
      <Scene caption="④ The discipline: diagnose before retraining">
        <Reveal>
          <div className="rounded-xl border border-brand bg-brand-wash px-4 py-4 text-center shadow-sm">
            <p className="text-[12px] font-medium leading-relaxed text-ink sm:text-sm">
              Mango&apos;s first 'drift' alarm: accuracy down 12% in the south. Retraining was queued —
              then the post-mortem found a <span className="font-bold">camera-app update stripping EXIF
              rotation</span>: every southern photo arrived rotated. Data bug, not drift; retraining on
              rotated photos would have shipped a worse model.
              <span className="font-bold"> Check the pipeline, the slices, and the input sanity before the GPU bill.</span>
            </p>
          </div>
        </Reveal>
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The rule</CardTitle>
        <Takeaway>
          A production model is a <strong>loop with gates</strong>: eval in CI, shadow, canary, then drift
          watched in both flavors — and every alarm triaged as <em>bug before drift before retrain</em>.
          The loop&apos;s instrumented half is a whole discipline: that&apos;s AI Observability, your next course.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

/** The through-line: the production loop as stations on a circle. */
function LoopDiagram() {
  const stations = [
    { label: "data + labels", x: 50, y: 8 },
    { label: "train (L1–L3)", x: 84, y: 28 },
    { label: "eval gates", x: 72, y: 55 },
    { label: "shadow → canary", x: 34, y: 58 },
    { label: "monitor drift", x: 14, y: 32 },
  ];
  return (
    <svg viewBox="0 0 100 68" className="h-auto w-full" aria-hidden="true">
      <path
        d="M50 8 L84 28 L72 55 L34 58 L14 32 Z"
        fill="none"
        stroke="var(--color-ash)"
        strokeWidth="1"
        strokeDasharray="2.5 2"
      />
      {/* the retrain arrow, emphasized */}
      <path d="M14 32 Q28 8 48 8.6" fill="none" stroke="var(--color-brand)" strokeWidth="1.6" markerEnd="url(#loopArrow)" />
      <defs>
        <marker id="loopArrow" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="4" markerHeight="4" orient="auto">
          <path d="M0 0 L6 3 L0 6 Z" fill="var(--color-brand)" />
        </marker>
      </defs>
      {stations.map((s, i) => (
        <g key={s.label}>
          <rect
            x={s.x - 11}
            y={s.y - 3.6}
            width="22"
            height="7.2"
            rx="2"
            fill={i === 4 ? "var(--color-brand-wash)" : "var(--color-surface-elevated)"}
            stroke="var(--color-brand)"
            strokeWidth="0.9"
          />
          <text x={s.x} y={s.y + 0.8} textAnchor="middle" fontFamily="monospace" fontSize="3.4" fill="var(--color-ink)">
            {s.label}
          </text>
        </g>
      ))}
      <text x="26" y="16" fontFamily="monospace" fontSize="3.6" fill="var(--color-brand-deep)" fontWeight="bold">
        retrain trigger
      </text>
    </svg>
  );
}

function GateRow({ gate, detail, accent = false }: { gate: string; detail: string; accent?: boolean }) {
  return (
    <div className={`flex items-start gap-3 rounded-xl border px-4 py-2.5 shadow-sm ${accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"}`}>
      <span className="w-24 shrink-0 text-[11px] font-bold text-ink">{gate}</span>
      <p className="min-w-0 flex-1 text-[10.5px] font-medium leading-relaxed text-ink-soft">{detail}</p>
    </div>
  );
}
