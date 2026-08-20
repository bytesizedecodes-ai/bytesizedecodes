import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Advanced Machine Learning — Lesson 3: "Fighting memorization".
 * Dropout, batch norm, early stopping, augmentation — and the counter-beat:
 * regularization is a variance medicine; don't prescribe it for bias.
 */
export function RegularizingDeepNets() {
  return (
    <Infographic>
      <InfographicHeader
        title="Fighting memorization"
        subtitle="Mango Labs, week 3: 94% train, 61% held-out — the deep-learning edition of variance"
      />

      {/* Beat 1 — the diagnosis */}
      <Scene caption="① Deep nets are memorization machines by default">
        <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <div className="rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
            <div className="font-mono text-[11px] font-bold text-ink">resnet-ish, 11M params</div>
            <p className="mt-1.5 text-[11px] font-medium leading-relaxed text-ink-soft">
              trained on <span className="font-bold">800 farm photos</span> — 14k parameters per photo.
              Capacity to memorize every leaf, stem, and sensor glitch — with change left over.
            </p>
          </div>
          <div className="rounded-xl border border-bad bg-surface-elevated p-4 shadow-sm">
            <div className="font-mono text-[11px] font-bold text-bad">94% train · 61% held-out</div>
            <p className="mt-1.5 text-[11px] font-medium leading-relaxed text-ink-soft">
              The 33-point gap IS the memorization. Closing it needs restraint —
              four tools, each attacking a different surface.
            </p>
          </div>
        </Stagger>
      </Scene>

      {/* Beat 2 — the four tools */}
      <Scene caption="② Four tools, four surfaces">
        <Stagger className="space-y-2">
          <MotionChild>
            <ToolRow name="Data augmentation" cost="free" note="flip, rotate, shift brightness — every photo becomes ~10; the network sees 'new' fields without new labels. First tool, always" accent />
          </MotionChild>
          <MotionChild>
            <ToolRow name="Early stopping" cost="one validation set" note="hold training when held-out loss bottoms out — stop before the memorization phase begins; the cheapest regularizer in existence" />
          </MotionChild>
          <MotionChild>
            <ToolRow name="Dropout" cost="~2× training time" note="kill a random subset of neurons each step — no neuron can co-adapt to specific others; you implicitly train an ensemble of thousands of thinner nets" />
          </MotionChild>
          <MotionChild>
            <ToolRow name="Batch norm" cost="small" note="normalize each layer's inputs batch-to-batch — steadier activations, higher workable learning rates, a mild regularizing side-effect" />
          </MotionChild>
        </Stagger>
      </Scene>

      {/* Beat 3 — what each buys */}
      <Scene caption="③ Mango's recipe, and what it bought">
        <Stagger className="space-y-2">
          <MotionChild>
            <ResultRow change="augmentation on" gap="94 / 61 → 88 / 72" note="harder training set — memorizing photos no longer works; the model starts learning disease shape" />
          </MotionChild>
          <MotionChild>
            <ResultRow change="+ dropout 0.3, early stop" gap="88 / 72 → 79 / 74" note="gap nearly closed — and held-out is what ships" />
          </MotionChild>
          <MotionChild>
            <ResultRow change="+ transfer learning (next lesson)" gap="79 / 74 → 71 / 91" note="the real unlock: stop learning vision from 800 photos at all" accent />
          </MotionChild>
        </Stagger>
      </Scene>

      {/* Beat 4 — the counter-beat */}
      <Scene caption="④ The discipline: regularizers treat variance, not bias">
        <div className="rounded-xl border border-brand bg-brand-wash px-4 py-4 text-center">
          <p className="text-[12px] font-medium leading-relaxed text-ink sm:text-sm">
            If train AND held-out are both bad, that&apos;s <span className="font-bold">bias</span> — dropout makes
            an underfit model <em>worse</em> (it removes capacity from a model that needed more).
            Mango&apos;s sensor-table model (train 44%, val 43%): the fix was features and capacity,
            <span className="font-bold"> not restraint</span>. Diagnose, then prescribe.
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The rule</CardTitle>
        <Takeaway>
          Regularization buys generalization by <strong>deliberately making training harder</strong> —
          augmentation, dropout, early stopping, batch norm — and every one of them is a variance
          medicine prescribed off a train/val gap.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

function ToolRow({ name, cost, note, accent = false }: { name: string; cost: string; note: string; accent?: boolean }) {
  return (
    <div className={`flex items-start gap-3 rounded-xl border px-4 py-2.5 shadow-sm ${accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"}`}>
      <div className="min-w-0 flex-1">
        <div className="text-xs font-bold text-ink sm:text-[13px]">{name}</div>
        <p className="mt-0.5 text-[10.5px] font-medium leading-relaxed text-ink-soft">{note}</p>
      </div>
      <span className="shrink-0 rounded-full border border-ash bg-surface-elevated px-2 py-1 font-mono text-[9px] font-bold text-ink-soft">{cost}</span>
    </div>
  );
}

function ResultRow({ change, gap, note, accent = false }: { change: string; gap: string; note: string; accent?: boolean }) {
  return (
    <div className={`flex items-start gap-3 rounded-xl border px-4 py-2.5 shadow-sm ${accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"}`}>
      <div className="min-w-0 flex-1">
        <div className="font-mono text-[10.5px] font-bold text-ink">{change}</div>
        <p className="mt-0.5 text-[10.5px] font-medium leading-relaxed text-ink-soft">{note}</p>
      </div>
      <span className="shrink-0 rounded-full border border-ash bg-surface-elevated px-2 py-1 font-mono text-[9px] font-bold text-brand-deep">{gap}</span>
    </div>
  );
}
