import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild, Reveal } from "./motion";

/**
 * Advanced Machine Learning — Lesson 1: "Depth is a feature factory".
 * Course case: Mango Labs — a four-person team turning a mango-disease photo
 * classifier into an LLM-powered crop advisory. Expert register: problem-first,
 * concrete numbers, counter-beat on width vs depth.
 */
export function NeuronsAndLayers() {
  return (
    <Infographic>
      <InfographicHeader
        title="Depth is a feature factory"
        subtitle="Mango Labs, week 1: the linear scorer that couldn't see combinations"
      />

      {/* Beat 1 — the problem */}
      <Scene caption="① The case: a linear scorer misses interacting causes">
        <Reveal>
          <div className="rounded-xl border border-[var(--color-bad)] bg-surface-elevated p-4 shadow-sm">
            <p className="font-mono text-[12px] font-semibold text-ink">
              rust_likelihood = w₁·leaf_spots + w₂·humidity + w₃·variety + b
            </p>
            <p className="mt-2 text-[11.5px] font-medium leading-relaxed text-[var(--color-bad)]">
              Each feature scored alone. But rust explodes only when spots AND high humidity co-occur —
              an <span className="font-bold">interaction</span> a weighted sum structurally cannot represent,
              at any weight setting. 61% accuracy ceiling.
            </p>
          </div>
        </Reveal>
      </Scene>

      {/* Beat 2 — depth composes */}
      <Scene caption="② Depth composes: layer 2 reads what layer 1 built">
        <Stagger className="space-y-2">
          <MotionChild>
            <LayerRow name="Layer 1 · detectors" builds="spots_count · humidity_band · variety_code" learns="simple thresholds — each neuron one useful cut" />
          </MotionChild>
          <MotionChild>
            <LayerRow name="Layer 2 · conjunctions" builds="spots × humidity interaction · shady-canopy pattern" learns="AND-like combos of layer-1 outputs" accent />
          </MotionChild>
          <MotionChild>
            <LayerRow name="Layer 3 · decision" builds="rust risk · nitrogen deficiency · healthy" learns="readable evidence stack for the final call" />
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-[11px] font-medium text-ink-soft sm:text-xs">
          Nobody designed the middle layer&apos;s features — gradient descent found them because they reduced loss.
        </p>
      </Scene>

      {/* Beat 3 — the representation view */}
      <Scene caption="③ The same data, re-described at every layer">
        <RepView />
        <p className="mt-2 text-center text-[11px] font-medium text-ink-soft sm:text-xs">
          A classic result: two classes tangled in raw coordinates become{" "}
          <span className="font-bold text-brand-deep">linearly separable</span> by the last hidden layer —
          the network&apos;s real job is bending the space until a straight line works.
        </p>
      </Scene>

      {/* Beat 4 — the counter-beat */}
      <Scene caption="④ The discipline: depth is not free">
        <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
              <div className="text-xs font-bold text-brand">Where depth pays</div>
              <p className="mt-1 text-[11px] font-medium leading-relaxed text-ink-soft">
                Compositional signal — pixels, audio, text, dense feature interactions.
                Each layer&apos;s job is only useful because later layers build on it.
              </p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
              <div className="text-xs font-bold text-brand">Where it doesn&apos;t</div>
              <p className="mt-1 text-[11px] font-medium leading-relaxed text-ink-soft">
                Thin tabular data with hand-known features: a wide single layer (or a forest)
                matches depth at a fraction of the data, cost, and debugging pain.
                Mango&apos;s sensor table: gradient boosting, not a deeper net.
              </p>
            </div>
          </MotionChild>
        </Stagger>
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The rule</CardTitle>
        <Takeaway>
          Depth buys <strong>learned feature composition</strong> — interactions and parts-of-parts no one
          hand-specified. Reach for it when the signal is compositional; reach around it when the
          features are already meaningful.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

function LayerRow({ name, builds, learns, accent = false }: { name: string; builds: string; learns: string; accent?: boolean }) {
  return (
    <div className={`flex items-start gap-3 rounded-xl border px-4 py-3 shadow-sm ${accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"}`}>
      <div className="min-w-0 flex-1">
        <div className="text-xs font-bold text-ink sm:text-[13px]">{name}</div>
        <div className="mt-0.5 font-mono text-[10px] font-semibold text-brand-deep">{builds}</div>
        <p className="mt-0.5 text-[10.5px] font-medium leading-relaxed text-ink-soft">{learns}</p>
      </div>
    </div>
  );
}

/** Two panels: tangled raw data vs the same points after hidden-layer transformation. */
function RepView() {
  const left: [number, number][] = [
    [30, 30], [34, 36], [28, 38], [36, 28], [62, 62], [66, 58], [60, 66], [68, 54],
    [46, 44], [54, 56], [44, 56], [56, 44],
  ];
  const cls = (i: number) => (i < 4 ? "var(--color-brand-deep)" : i < 8 ? "var(--color-good)" : "var(--color-ink-faint)");
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
      <figure className="rounded-xl border border-ash bg-surface-elevated p-2 shadow-sm">
        <svg viewBox="0 0 100 80" className="h-auto w-full" aria-hidden="true">
          <line x1="8" y1="74" x2="94" y2="74" stroke="var(--color-ash)" strokeWidth="1" />
          <line x1="8" y1="6" x2="8" y2="74" stroke="var(--color-ash)" strokeWidth="1" />
          {left.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="2.6" fill={cls(i)} />
          ))}
          <text x="50" y="79" textAnchor="middle" fontFamily="monospace" fontSize="5" fill="var(--color-ink-soft)">raw features: tangled</text>
        </svg>
      </figure>
      <figure className="rounded-xl border border-brand bg-brand-wash p-2 shadow-sm">
        <svg viewBox="0 0 100 80" className="h-auto w-full" aria-hidden="true">
          <line x1="8" y1="74" x2="94" y2="74" stroke="var(--color-ash)" strokeWidth="1" />
          <line x1="8" y1="6" x2="8" y2="74" stroke="var(--color-ash)" strokeWidth="1" />
          <line x1="50" y1="6" x2="50" y2="74" stroke="var(--color-brand)" strokeWidth="1.6" strokeDasharray="3 2" />
          {left.map(([x, y], i) => (
            <circle key={i} cx={i < 8 ? x * 0.32 + 8 : x * 0.68 + 28} cy={y * 0.7 + 6} r="2.6" fill={cls(i)} />
          ))}
          <text x="50" y="79" textAnchor="middle" fontFamily="monospace" fontSize="5" fill="var(--color-ink-soft)">after layer 2: one line separates</text>
        </svg>
      </figure>
    </div>
  );
}
