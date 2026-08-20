import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild, Reveal } from "./motion";

/**
 * Advanced Machine Learning — Lesson 4: "Filters, not weights".
 * CNNs: parameter explosion → the shared sliding filter → feature hierarchy →
 * transfer learning as Mango's actual unlock. The filter grid is the
 * through-line.
 */
export function ConvolutionalNetworks() {
  return (
    <Infographic>
      <InfographicHeader
        title="Filters, not weights"
        subtitle="Mango Labs, week 4: why wiring every pixel to every neuron was hopeless"
      />

      {/* Beat 1 — the problem, with the number */}
      <Scene caption="① The parameter explosion">
        <Reveal>
          <div className="rounded-xl border border-[var(--color-bad)] bg-surface-elevated p-4 text-center shadow-sm">
            <div className="font-mono text-[13px] font-bold text-ink sm:text-sm">
              224×224×3 pixels → 1,000 hidden neurons
            </div>
            <div className="mt-1.5 font-mono text-lg font-bold text-bad">150,528,000 weights in layer 1</div>
            <p className="mt-1.5 text-[11px] font-medium leading-relaxed text-ink-soft">
              One layer, 150M parameters — and a model that sees a disease spot at the top-left as
              <em> unrelated</em> to the same spot at the bottom-right, because every position has its own wiring.
            </p>
          </div>
        </Reveal>
      </Scene>

      {/* Beat 2 — the filter */}
      <Scene caption="② The fix: one small pattern-detector, slid everywhere">
        <FilterGrid />
        <Stagger className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
          <MotionChild>
            <CnnStep top="3×3 filter" bottom="9 learned numbers — a tiny pattern: edge, blob, color shift" />
          </MotionChild>
          <MotionChild>
            <CnnStep top="Slide across the image" bottom="same 9 numbers tested at every position — a disease spot fires wherever it sits" accent />
          </MotionChild>
          <MotionChild>
            <CnnStep top="A feature map out" bottom="where the pattern matched, position by position — 9 params per filter, not 150M" />
          </MotionChild>
        </Stagger>
      </Scene>

      {/* Beat 3 — the hierarchy */}
      <Scene caption="③ Stacked filters build a vocabulary of seeing">
        <Stagger className="space-y-2">
          <MotionChild>
            <HierRow level="conv 1" sees="edges, color boundaries" from="raw pixels" />
          </MotionChild>
          <MotionChild>
            <HierRow level="conv 2–3" sees="spots, veins, texture blotches" from="edges" />
          </MotionChild>
          <MotionChild>
            <HierRow level="conv 4+" sees="lesion patterns, leaf shapes" from="textures" accent />
          </MotionChild>
          <MotionChild>
            <HierRow level="dense head" sees="rust · anthracnose · healthy" from="part-level evidence" />
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-[11px] font-medium text-ink-soft sm:text-xs">
          Translation invariance comes from sliding; <span className="font-bold text-brand-deep">composition</span> comes from stacking —
          the two properties images demand.
        </p>
      </Scene>

      {/* Beat 4 — transfer learning: the real unlock */}
      <Scene caption="④ Mango's actual win: don't learn to see — rent it">
        <Stagger className="space-y-2">
          <MotionChild>
            <TransferRow step="take a network pre-trained on 1.2M ImageNet photos" result="edges, textures, object parts: already learned" />
          </MotionChild>
          <MotionChild>
            <TransferRow step="freeze it; replace the final layer" result="only 'which of our 3 diseases' left to learn" />
          </MotionChild>
          <MotionChild>
            <TransferRow step="fine-tune on 800 farm photos" result="91% held-out — up from 74% trained from scratch" accent />
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-[11px] font-medium text-ink-soft sm:text-xs">
          With &lt;1k images, transfer learning isn&apos;t an optimization — it&apos;s the only viable path.
        </p>
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The rule</CardTitle>
        <Takeaway>
          Convolutions trade <strong>full connectivity for shared, slid filters</strong> — matching how images
          are built (local, compositional, position-shifted). And for almost any vision task with modest
          data: <strong>start from a pretrained backbone, train the head.</strong>
        </Takeaway>
      </Card>
    </Infographic>
  );
}

/** A 5×5 grid with a 3×3 filter window sliding over it. */
function FilterGrid() {
  const cells = [
    0, 0, 0, 1, 0,
    0, 0, 1, 1, 0,
    0, 1, 1, 1, 0,
    0, 1, 1, 0, 0,
    0, 0, 1, 0, 0,
  ];
  return (
    <svg viewBox="0 0 100 40" className="h-auto w-full" aria-hidden="true">
      {cells.map((v, i) => {
        const col = i % 5;
        const row = Math.floor(i / 5);
        return (
          <rect
            key={i}
            x={6 + col * 6}
            y={5 + row * 6}
            width="6"
            height="6"
            fill={v ? "var(--color-brand)" : "var(--color-surface-elevated)"}
            stroke="var(--color-ash)"
            strokeWidth="0.5"
          />
        );
      })}
      {/* the 3×3 window over cols 2-4, rows 1-3 */}
      <rect x={6 + 2 * 6} y={5 + 1 * 6} width="18" height="18" fill="none" stroke="var(--color-brand-deep)" strokeWidth="1.4" rx="1.5" />
      <line x1="42" y1="20" x2="56" y2="20" stroke="var(--color-brand-deep)" strokeWidth="1.2" />
      <polygon points="56,20 52,17.5 52,22.5" fill="var(--color-brand-deep)" />
      {/* feature map out */}
      {[0, 1, 2].map((i) => (
        <rect key={i} x={60 + (i % 3) * 6} y={14 + Math.floor(i / 3) * 6} width="6" height="6" fill="var(--color-brand-wash)" stroke="var(--color-ash)" strokeWidth="0.5" />
      ))}
      <rect x="60" y="14" width="18" height="6" fill="none" stroke="var(--color-brand-deep)" strokeWidth="1.2" rx="1.5" />
      <text x="70" y="36" textAnchor="middle" fontFamily="monospace" fontSize="4.4" fill="var(--color-ink-soft)">feature map: where it fired</text>
      <text x="18" y="36" textAnchor="middle" fontFamily="monospace" fontSize="4.4" fill="var(--color-ink-soft)">image (5×5)</text>
      <text x="90" y="36" textAnchor="middle" fontFamily="monospace" fontSize="4.4" fill="var(--color-ink-soft)">same 9 weights everywhere</text>
    </svg>
  );
}

function CnnStep({ top, bottom, accent = false }: { top: string; bottom: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl border px-3 py-2.5 text-center shadow-sm ${accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"}`}>
      <div className="text-[11px] font-bold text-ink">{top}</div>
      <p className="mt-0.5 text-[10.5px] font-medium leading-relaxed text-ink-soft">{bottom}</p>
    </div>
  );
}

function HierRow({ level, sees, from, accent = false }: { level: string; sees: string; from: string; accent?: boolean }) {
  return (
    <div className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 shadow-sm ${accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"}`}>
      <span className="w-16 shrink-0 font-mono text-[10px] font-bold text-brand-deep">{level}</span>
      <p className="min-w-0 flex-1 text-[11px] font-medium text-ink">
        <span className="font-bold">{sees}</span>
        <span className="text-ink-soft"> — built from {from}</span>
      </p>
    </div>
  );
}

function TransferRow({ step, result, accent = false }: { step: string; result: string; accent?: boolean }) {
  return (
    <div className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 shadow-sm ${accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"}`}>
      <p className="min-w-0 flex-1 text-[11px] font-semibold text-ink">{step}</p>
      <span className="shrink-0 rounded-full border border-ash bg-surface-elevated px-2 py-1 font-mono text-[9px] font-bold text-brand-deep">{result}</span>
    </div>
  );
}
