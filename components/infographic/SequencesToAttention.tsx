import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild, Reveal } from "./motion";

/**
 * Advanced Machine Learning — Lesson 5: "The fading conveyor belt".
 * From RNN memory decay to the attention spotlight. The through-line: a row
 * of word-cells whose connection to the past thins out — then the spotlight
 * that reconnects everything to everything.
 */
export function SequencesToAttention() {
  return (
    <Infographic>
      <InfographicHeader
        title="The fading conveyor belt"
        subtitle="Mango Labs, week 5: their advisory bot forgets the start of every question"
      />

      {/* Beat 1 — the problem */}
      <Scene caption="① The symptom: long instructions get ignored">
        <Reveal>
          <div className="rounded-xl border border-[var(--color-bad)] bg-surface-elevated p-4 shadow-sm">
            <p className="font-mono text-[11.5px] font-semibold text-ink">
              “The plot <span className="text-brand-deep">near the well</span> was treated for rust last month —
              recommend a <span className="text-brand-deep">nitrogen</span> plan, NOT more fungicide.”
            </p>
            <p className="mt-2 text-[11.5px] font-medium leading-relaxed text-[var(--color-bad)]">
              The bot&apos;s reply recommends fungicide. By the time it processes the last words, the
              constraint 20 words back has <span className="font-bold">faded to almost nothing</span> —
              the earlier context barely influences the output.
            </p>
          </div>
        </Reveal>
      </Scene>

      {/* Beat 2 — RNN as conveyor */}
      <Scene caption="② RNNs: one fixed-size memory passed along a belt">
        <ConveyorBelt />
        <p className="mt-2 text-center text-[11px] font-medium text-ink-soft sm:text-xs">
          Every step overwrites the same small state. Like retelling a story through 20 people —
          each retelling keeps a bit less. Gradients decay the same way: the learning signal for
          word 1&apos;s influence on word 20 shrinks toward zero (<span className="font-mono">×0.7 per step ≈ 0.0008 by step 20</span>).
        </p>
      </Scene>

      {/* Beat 3 — the spotlight */}
      <Scene caption="③ Attention: every word looks directly at every word">
        <Spotlight />
        <Stagger className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
          <MotionChild>
            <AttStep top="Each position queries all others" bottom="'plan' asks every earlier word: are you relevant to me? — 'nitrogen' and 'NOT' answer loudly, 'well' faintly" />
          </MotionChild>
          <MotionChild>
            <AttStep top="Weights = relevance" bottom="a softmax turns match scores into a spotlight distribution — fractions summing to 1" accent />
          </MotionChild>
          <MotionChild>
            <AttStep top="Direct path, any distance" bottom="word 1 to word 20 is ONE hop — no 19-step decay. The constraint survives" />
          </MotionChild>
        </Stagger>
      </Scene>

      {/* Beat 4 — the cost + counter-beat */}
      <Scene caption="④ The price of universal reach — and when it's not worth paying">
        <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
              <div className="font-mono text-[11px] font-bold text-ink">n² cost</div>
              <p className="mt-1 text-[11px] font-medium leading-relaxed text-ink-soft">
                Every token attending to every token: 1k tokens = 1M pairs, 100k = 10¹⁰. This quadratic
                bill is why context windows are expensive and why Lesson 12&apos;s architectures exist.
              </p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
              <div className="font-mono text-[11px] font-bold text-ink">when recurrence is fine</div>
              <p className="mt-1 text-[11px] font-medium leading-relaxed text-ink-soft">
                Short streams, strict memory budgets, streaming inference on edge devices —
                a small RNN/SSM still runs where an O(n²) attention map can&apos;t.
              </p>
            </div>
          </MotionChild>
        </Stagger>
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The rule</CardTitle>
        <Takeaway>
          Attention replaced the fading conveyor with <strong>direct, weighted access between any two
          positions</strong> — solving long-range dependence at the price of quadratic cost. That trade
          defines the next decade of architecture research.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

/** The conveyor: tokens processed left to right, memory state decaying. */
function ConveyorBelt() {
  const words = ["The", "plot", "near", "the", "well", "was", "treated", "…", "NOT", "fungicide"];
  return (
    <svg viewBox="0 0 100 30" className="h-auto w-full" aria-hidden="true">
      {words.map((w, i) => (
        <g key={i}>
          <rect
            x={4 + i * 9.4}
            y={10}
            width="8.6"
            height="9"
            rx="1.5"
            fill="var(--color-surface-elevated)"
            stroke={i < 6 ? "var(--color-brand)" : "var(--color-bad)"}
            strokeWidth={i < 6 ? "1" : "1.2"}
            opacity={1 - i * 0.07}
          />
          <text x={8.3 + i * 9.4} y={15.8} textAnchor="middle" fontFamily="monospace" fontSize="3.4" fill="var(--color-ink)">{w}</text>
        </g>
      ))}
      {/* memory decaying as it travels */}
      {[0, 1, 2, 3].map((i) => (
        <path
          key={i}
          d={`M${4 + i * 9.4 + 8.6} 8 Q${4 + (i + 1) * 9.4 + 4.3} 6 ${4 + (i + 1) * 9.4} 10`}
          fill="none"
          stroke="var(--color-brand)"
          strokeWidth={1 - i * 0.2}
          opacity={1 - i * 0.22}
        />
      ))}
      <text x="4" y="25" fontFamily="monospace" fontSize="3.8" fill="var(--color-ink-soft)">memory handed along…</text>
      <text x="96" y="25" textAnchor="end" fontFamily="monospace" fontSize="3.8" fill="var(--color-bad)">…nearly gone here</text>
    </svg>
  );
}

/** The spotlight: one query word attending to all, with line weight = relevance. */
function Spotlight() {
  const words = ["plot", "nitrogen", "NOT", "fungicide", "recommend"];
  const weights = [0.32, 0.95, 0.88, 0.15, 0.4];
  return (
    <svg viewBox="0 0 100 42" className="h-auto w-full" aria-hidden="true">
      {words.map((w, i) => (
        <line
          key={i}
          x1={80}
          y1={24}
          x2={10 + i * 17}
          y2={9}
          stroke={i === 1 || i === 2 ? "var(--color-brand)" : "var(--color-ash)"}
          strokeWidth={0.6 + weights[i]! * 1.8}
          opacity={0.35 + weights[i]! * 0.6}
        />
      ))}
      {words.map((w, i) => (
        <g key={i}>
          <rect
            x={4 + i * 17}
            y={5}
            width="12"
            height="8"
            rx="1.5"
            fill={i === 1 || i === 2 ? "var(--color-brand-wash)" : "var(--color-surface-elevated)"}
            stroke={i === 1 || i === 2 ? "var(--color-brand)" : "var(--color-ash)"}
            strokeWidth="0.9"
          />
          <text x={10 + i * 17} y={10.2} textAnchor="middle" fontFamily="monospace" fontSize="3.6" fill="var(--color-ink)">{w}</text>
          <text x={10 + i * 17} y={2.8} textAnchor="middle" fontFamily="monospace" fontSize="3.2" fill={i === 1 || i === 2 ? "var(--color-brand-deep)" : "var(--color-ink-soft)"}>
            {weights[i]!.toFixed(2)}
          </text>
        </g>
      ))}
      <rect x="72" y="20" width="16" height="8" rx="1.5" fill="var(--color-brand)" />
      <text x="80" y="25.2" textAnchor="middle" fontFamily="monospace" fontSize="3.6" fill="var(--color-canvas)">“plan”</text>
      <text x="80" y="38" textAnchor="middle" fontFamily="monospace" fontSize="3.8" fill="var(--color-ink-soft)">line weight = attention</text>
    </svg>
  );
}

function AttStep({ top, bottom, accent = false }: { top: string; bottom: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl border px-3 py-2.5 text-center shadow-sm ${accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"}`}>
      <div className="text-[11px] font-bold text-ink">{top}</div>
      <p className="mt-0.5 text-[10.5px] font-medium leading-relaxed text-ink-soft">{bottom}</p>
    </div>
  );
}
