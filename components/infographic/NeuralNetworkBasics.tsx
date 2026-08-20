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
 * Intermediate course — Lesson: "Inside a neuron" (neural network basics).
 *
 * Through-line: one neuron drawn as dials → signal → gate, then the same
 * neuron stacked into layers. The aha: without the activation gate, any stack
 * of linear steps collapses into one straight line — depth only works because
 * of the gate.
 */
export function NeuralNetworkBasics() {
  return (
    <Infographic>
      <InfographicHeader
        title="Inside a neuron"
        subtitle="A weighted sum, squeezed through a gate — stacked into layers"
      />

      {/* Beat 1 — one neuron */}
      <Scene caption="① One neuron: dials, sum, gate">
        <NeuronDiagram />
        <Stagger className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
          <MotionChild>
            <NeuronStep top="1 · Weigh each input" bottom="every input has a dial (weight): important features count more, unhelpful ones get turned toward zero" />
          </MotionChild>
          <MotionChild>
            <NeuronStep top="2 · Add them up" bottom="the weighted sum + a bias — a single score, exactly like linear regression" />
          </MotionChild>
          <MotionChild>
            <NeuronStep top="3 · Squeeze through the gate" bottom="an activation (like the S-curve) bends the score — this is what lets layers stack usefully" accent />
          </MotionChild>
        </Stagger>
      </Scene>

      {/* Beat 2 — the aha: no gate, no depth */}
      <Scene caption="② Why the gate matters: without it, deep = flat">
        <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <MotionChild>
            <div className="rounded-xl border border-bad bg-surface-elevated p-4 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wide text-bad">Layers of straight lines</div>
              <p className="mt-1.5 text-[11px] font-medium leading-relaxed text-ink-soft">
                A straight line of a straight line of a straight line… is still one straight line.
                A 100-layer network with no activations = linear regression with extra steps.
              </p>
              <svg viewBox="0 0 100 30" className="mt-2 h-auto w-full" aria-hidden="true">
                {[0.2, 0.45, 0.7].map((m, i) => (
                  <line key={i} x1="10" y1={26 - m * 8 - i * 0.2} x2="90" y2={24 - m * 18} stroke="var(--color-bad)" strokeWidth="1.4" strokeDasharray="3 2.5" />
                ))}
                <text x="12" y="28" fontFamily="monospace" fontSize="5" fill="var(--color-ink-soft)">still just lines</text>
              </svg>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-good bg-surface-elevated p-4 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wide text-good">Layers with gates</div>
              <p className="mt-1.5 text-[11px] font-medium leading-relaxed text-ink-soft">
                Each gate bends its layer&apos;s output slightly. Stacked bends can approximate any
                curve, any boundary — that&apos;s the power of depth.
              </p>
              <svg viewBox="0 0 100 30" className="mt-2 h-auto w-full" aria-hidden="true">
                <path d="M10 25 Q35 25 45 12 Q55 2 90 4" fill="none" stroke="var(--color-good)" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M10 24 Q30 22 40 16 Q60 6 88 10" fill="none" stroke="var(--color-brand)" strokeWidth="1.4" strokeLinecap="round" strokeDasharray="3 2.5" />
                <text x="12" y="28" fontFamily="monospace" fontSize="5" fill="var(--color-ink-soft)">any shape you need</text>
              </svg>
            </div>
          </MotionChild>
        </Stagger>
      </Scene>

      {/* Beat 3 — layers build features from features */}
      <Scene caption="③ A layer&apos;s output is the next layer&apos;s input">
        <LayerStack />
        <p className="mt-2 text-center text-xs font-medium text-ink sm:text-sm">
          Early layers learn simple combos (an edge, a price ratio); deeper layers learn{" "}
          <span className="font-bold">combos of combos</span> (a wheel, an affordability signal) —
          nobody designs these; training turns the dials until they&apos;re useful.
        </p>
      </Scene>

      {/* Beat 4 — code: a forward pass */}
      <Scene caption="④ A whole network pass, in six lines">
        <Reveal>
          <CodePanel
            label="Forward pass · pure Python"
            caption="Each layer: weighted sum, then gate. That's the entire machinery."
            accent
            code={`def forward(x, W1, W2):
    h = sigmoid(x @ W1)      # layer 1: weigh, sum, gate
    y = sigmoid(h @ W2)      # layer 2: same again
    return y                 # a probability from 0 to 1`}
          />
        </Reveal>
      </Scene>

      <Reveal>
        <Card tone="brand" rotate={0}>
          <CardTitle icon="✦">The takeaway</CardTitle>
          <Takeaway>
            A neuron is <strong>a weighted sum plus a gate</strong>; a network is neurons feeding neurons.
            The gates are the whole trick — they&apos;re what let depth build complexity that flat sums never could.
          </Takeaway>
        </Card>
      </Reveal>
    </Infographic>
  );
}

/** Through-line: one neuron — inputs with dial weights → Σ → gate → output. */
function NeuronDiagram() {
  const inputs = [
    { label: "signal ⋅ weight 1", y: 12 },
    { label: "signal ⋅ weight 2", y: 26 },
    { label: "signal ⋅ weight 3", y: 40 },
  ];
  return (
    <svg viewBox="0 0 100 52" className="h-auto w-full" aria-hidden="true">
      {inputs.map((input, i) => (
        <g key={i}>
          <rect x="2" y={input.y - 4.5} width="26" height="9" rx="2" fill="var(--color-surface-elevated)" stroke="var(--color-ash)" strokeWidth="0.8" />
          <text x="15" y={input.y + 1.5} textAnchor="middle" fontFamily="monospace" fontSize="4" fill="var(--color-ink)">
            {input.label}
          </text>
          <line x1="28" y1={input.y} x2="44" y2="26" stroke="var(--color-brand)" strokeWidth="1" />
        </g>
      ))}
      {/* sum */}
      <circle cx="48" cy="26" r="6.5" fill="var(--color-brand-wash)" stroke="var(--color-brand)" strokeWidth="1.2" />
      <text x="48" y="28" textAnchor="middle" fontFamily="monospace" fontSize="6" fontWeight="bold" fill="var(--color-brand-deep)">Σ</text>
      <line x1="54.5" y1="26" x2="62" y2="26" stroke="var(--color-brand)" strokeWidth="1" />
      {/* gate */}
      <rect x="62" y="19.5" width="14" height="13" rx="2" fill="var(--color-surface-elevated)" stroke="var(--color-brand)" strokeWidth="1.2" />
      <path d="M65 29 Q69 29 70 24 Q71 21 74 22" fill="none" stroke="var(--color-brand)" strokeWidth="1.4" strokeLinecap="round" />
      <text x="69" y="17" textAnchor="middle" fontFamily="monospace" fontSize="4" fill="var(--color-ink-soft)">gate</text>
      <line x1="76" y1="26" x2="84" y2="26" stroke="var(--color-brand)" strokeWidth="1" />
      <circle cx="88" cy="26" r="3" fill="var(--color-brand)" />
      <text x="88" y="34.5" textAnchor="middle" fontFamily="monospace" fontSize="4.2" fill="var(--color-ink-soft)">out</text>
    </svg>
  );
}

/** Three stacked layers of neurons, fully connected between layers. */
function LayerStack() {
  const layers = [
    { x: 12, neurons: [10, 22, 34, 46] },
    { x: 50, neurons: [16, 28, 40] },
    { x: 88, neurons: [22, 34] },
  ];
  return (
    <svg viewBox="0 0 100 56" className="h-auto w-full" aria-hidden="true">
      {layers.slice(0, -1).map((layer, li) =>
        layer.neurons.map((from) =>
          layers[li + 1]!.neurons.map((to) => (
            <line key={`${li}-${from}-${to}`} x1={layer.x + 3} y1={from} x2={layers[li + 1]!.x - 3} y2={to} stroke="var(--color-ash)" strokeWidth="0.6" />
          )),
        ),
      )}
      {layers.map((layer, li) =>
        layer.neurons.map((y) => (
          <circle key={`${li}-${y}`} cx={layer.x} cy={y} r="3" fill={li === 2 ? "var(--color-brand)" : "var(--color-surface-elevated)"} stroke="var(--color-brand)" strokeWidth="1.2" />
        )),
      )}
      <text x="12" y="53" textAnchor="middle" fontFamily="monospace" fontSize="4.2" fill="var(--color-ink-soft)">inputs</text>
      <text x="50" y="53" textAnchor="middle" fontFamily="monospace" fontSize="4.2" fill="var(--color-ink-soft)">hidden</text>
      <text x="88" y="53" textAnchor="middle" fontFamily="monospace" fontSize="4.2" fill="var(--color-ink-soft)">prediction</text>
    </svg>
  );
}

function NeuronStep({ top, bottom, accent = false }: { top: string; bottom: string; accent?: boolean }) {
  return (
    <div
      className={`rounded-xl border px-3 py-2.5 text-center shadow-sm ${
        accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"
      }`}
    >
      <div className="text-[11px] font-bold text-ink">{top}</div>
      <p className="mt-0.5 text-[10.5px] font-medium leading-relaxed text-ink-soft">{bottom}</p>
    </div>
  );
}
