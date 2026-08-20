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
 * Intermediate course — Lesson: "Blame, assigned backwards" (backpropagation).
 *
 * Through-line: one small network (2 inputs → hidden → output) whose arrows
 * first carry the guess FORWARD, then carry blame BACKWARD. The aha: the same
 * path is reused in both directions, and each weight's update is proportional
 * to how much it contributed to the error.
 */
export function BackpropagationIntuition() {
  return (
    <Infographic>
      <InfographicHeader
        title="Blame, assigned backwards"
        subtitle="Backpropagation: the forward guess, then the error traced back to every dial"
      />

      {/* Beat 1 — the forward pass */}
      <Scene caption="① Forward: data flows left to right, a guess falls out">
        <PassDiagram direction="forward" />
        <p className="mt-2 text-center text-xs font-medium text-ink sm:text-sm">
          Inputs are weighed and gated layer by layer until the network commits:{" "}
          <span className="font-mono font-bold text-brand-deep">P(spam) = 0.9</span> — but the truth was{" "}
          <span className="font-mono font-bold">not spam</span>.
        </p>
      </Scene>

      {/* Beat 2 — the loss scores it */}
      <Scene caption="② The loss puts a number on that mistake">
        <Stagger className="flex flex-col items-stretch justify-center gap-2 sm:flex-row sm:items-center sm:gap-3">
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated px-4 py-3 text-center shadow-sm">
              <div className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">guess</div>
              <div className="mt-0.5 font-mono text-sm font-bold text-ink">0.90</div>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated px-4 py-3 text-center shadow-sm">
              <div className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">truth</div>
              <div className="mt-0.5 font-mono text-sm font-bold text-ink">0 (genuine)</div>
            </div>
          </MotionChild>
          <MotionChild>
            <span className="mx-auto text-xl font-bold text-brand" aria-hidden="true">→</span>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-brand bg-brand-wash px-4 py-3 text-center shadow-sm">
              <div className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">cross-entropy loss</div>
              <div className="mt-0.5 font-mono text-sm font-bold text-brand-deep">2.3</div>
            </div>
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-xs font-medium text-ink sm:text-sm">
          Confident and wrong — an expensive mistake. Now: <span className="font-bold">who in the network is to blame?</span>
        </p>
      </Scene>

      {/* Beat 3 — the backward pass */}
      <Scene caption="③ Backward: blame flows right to left, in proportion to contribution">
        <PassDiagram direction="backward" />
        <Stagger className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
          <MotionChild>
            <BlameStep top="The output's error" bottom="how much the final neuron's output should have differed" />
          </MotionChild>
          <MotionChild>
            <BlameStep top="Pass blame through each gate" bottom="the chain rule: each layer asks 'how much did I amplify or dampen the signal that ended up wrong?'" accent />
          </MotionChild>
          <MotionChild>
            <BlameStep top="Every dial gets its share" bottom="a weight that pushed hard the wrong way gets a big nudge; one that barely mattered gets almost none" />
          </MotionChild>
        </Stagger>
      </Scene>

      {/* Beat 4 — the loop */}
      <Scene caption="④ One training step = forward, loss, backward, nudge — millions of times">
        <Stagger className="flex flex-col items-stretch justify-center gap-2 sm:flex-row sm:items-center sm:gap-2">
          {["forward", "loss", "backward", "nudge weights"].map((step, i, arr) => (
            <MotionChild key={step} as="div">
              <div className="contents">
                <div className="rounded-xl border border-ash bg-surface-elevated px-3.5 py-2.5 text-center text-xs font-bold text-ink shadow-sm">
                  <span className="mr-1.5 font-mono text-[10px] text-ink-soft">{i + 1}</span>
                  {step}
                </div>
                {i < arr.length - 1 && (
                  <span className="mx-auto text-lg font-bold text-brand" aria-hidden="true">
                    <span className="sm:hidden">↓</span>
                    <span className="hidden sm:inline">→</span>
                  </span>
                )}
              </div>
            </MotionChild>
          ))}
        </Stagger>
        <p className="mt-3 text-center text-xs font-medium text-ink sm:text-sm">
          Repeat over batch after batch and the nudges accumulate into learning — that&apos;s{" "}
          <span className="font-bold">gradient descent + backprop</span>, the engine inside every network you&apos;ll meet.
        </p>
      </Scene>

      <Reveal>
        <Card tone="brand" rotate={0}>
          <CardTitle icon="✦">The takeaway</CardTitle>
          <Takeaway>
            Backpropagation is <strong>credit assignment at scale</strong>: the error is traced backward through
            the same paths the signal took forward, and every weight is nudged exactly in proportion to its share
            of the blame.
          </Takeaway>
        </Card>
      </Reveal>
    </Infographic>
  );
}

/** The through-line network. Forward: signal arrows. Backward: blame arrows + nudge sizes. */
function PassDiagram({ direction }: { direction: "forward" | "backward" }) {
  const forward = direction === "forward";
  const nodes = {
    inputs: [12, 26],
    hidden: [12, 26, 40],
    output: [26],
  };
  const blame = [
    { label: "nudge ×0.01", edge: 0 },
    { label: "nudge ×0.8", edge: 1 },
    { label: "nudge ×1.9", edge: 2 },
  ];
  return (
    <svg viewBox="0 0 100 52" className="h-auto w-full" aria-hidden="true">
      {/* connections */}
      {nodes.inputs.map((from) =>
        nodes.hidden.map((to) => (
          <line key={`i${from}h${to}`} x1="14" y1={from} x2="46" y2={to} stroke={forward ? "var(--color-brand)" : "var(--color-ash)"} strokeWidth={forward ? "1" : "0.8"} />
        )),
      )}
      {nodes.hidden.map((to) => (
        <line key={`h${to}o`} x1="52" y1={to} x2="84" y2="26" stroke={forward ? "var(--color-brand)" : "var(--color-bad)"} strokeWidth={forward ? "1" : "0.9"} />
      ))}
      {/* nodes */}
      {nodes.inputs.map((y) => (
        <circle key={`in${y}`} cx="11" cy={y} r="3.4" fill="var(--color-surface-elevated)" stroke="var(--color-brand)" strokeWidth="1.2" />
      ))}
      {nodes.hidden.map((y) => (
        <circle key={`hid${y}`} cx="49" cy={y} r="3.4" fill="var(--color-surface-elevated)" stroke="var(--color-brand)" strokeWidth="1.2" />
      ))}
      <circle cx="87" cy="26" r="4" fill={forward ? "var(--color-brand)" : "var(--color-bad)"} />
      {/* labels */}
      <text x="11" y="50" textAnchor="middle" fontFamily="monospace" fontSize="4.2" fill="var(--color-ink-soft)">inputs</text>
      <text x="49" y="50" textAnchor="middle" fontFamily="monospace" fontSize="4.2" fill="var(--color-ink-soft)">hidden layer</text>
      <text x="87" y="50" textAnchor="middle" fontFamily="monospace" fontSize="4.2" fill="var(--color-ink-soft)">output</text>
      {forward ? (
        <>
          <text x="30" y="8" textAnchor="middle" fontFamily="monospace" fontSize="4.4" fill="var(--color-brand)">signal →</text>
          <text x="66" y="8" textAnchor="middle" fontFamily="monospace" fontSize="4.4" fill="var(--color-brand)">guess →</text>
        </>
      ) : (
        <>
          <text x="30" y="8" textAnchor="middle" fontFamily="monospace" fontSize="4.4" fill="var(--color-bad)">← blame</text>
          <text x="66" y="8" textAnchor="middle" fontFamily="monospace" fontSize="4.4" fill="var(--color-bad)">error 2.3 ←</text>
          {blame.map((b, i) => (
            <text key={b.label} x={9 + i * 30} y={44 - i * 1.5} textAnchor="start" fontFamily="monospace" fontSize="3.8" fill="var(--color-ink-soft)">
              {b.label}
            </text>
          ))}
        </>
      )}
    </svg>
  );
}

function BlameStep({ top, bottom, accent = false }: { top: string; bottom: string; accent?: boolean }) {
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
