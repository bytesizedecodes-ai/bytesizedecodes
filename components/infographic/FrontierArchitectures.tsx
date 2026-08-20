import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild, Reveal } from "./motion";

/**
 * Advanced Machine Learning — Lesson 12: "Breaking the quadratic bill".
 * MoE sparse routing, Mamba/SSM linear time, hybrids — all attacking
 * attention's O(n²). Counter-beat: the attention ecosystem moat.
 */
export function FrontierArchitectures() {
  return (
    <Infographic>
      <InfographicHeader
        title="Breaking the quadratic bill"
        subtitle="MoE, state-space models, and hybrids: the 2025–26 attack on attention's cost curve"
      />

      {/* Beat 1 — the enemy */}
      <Scene caption="① The bill that shapes everything">
        <Reveal>
          <div className="rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
            <div className="grid grid-cols-3 gap-2 text-center font-mono">
              <div>
                <div className="text-[13px] font-bold text-ink">4k tokens</div>
                <div className="text-[9.5px] font-medium text-ink-soft">16M attention pairs</div>
              </div>
              <div>
                <div className="text-[13px] font-bold text-ink">32k tokens</div>
                <div className="text-[9.5px] font-medium text-ink-soft">1B pairs</div>
              </div>
              <div>
                <div className="text-[13px] font-bold text-bad">1M tokens</div>
                <div className="text-[9.5px] font-medium text-ink-soft">10¹² pairs — dead on arrival</div>
              </div>
            </div>
            <p className="mt-2 text-center text-[11px] font-medium leading-relaxed text-ink-soft">
              Every token attends to every token: cost grows with the <em>square</em> of context.
              The two architectures below split the problem — capacity and sequence — differently.
            </p>
          </div>
        </Reveal>
      </Scene>

      {/* Beat 2 — MoE */}
      <Scene caption="② MoE: all the capacity, a fraction of the bill">
        <MoeRouter />
        <Stagger className="mt-3 space-y-2">
          <MotionChild>
            <MoeRow piece="router (tiny)" note="per token, per layer: picks 1–2 of 100+ expert MLPs — a softmax gate learned end-to-end" />
          </MotionChild>
          <MotionChild>
            <MoeRow piece="experts (huge)" note="the MLP layers multiplied: 400B+ total parameters, but only the selected few run — ~5–10% active per token" accent />
          </MotionChild>
          <MotionChild>
            <MoeRow piece="attention unchanged" note="MoE attacks the parameter/capacity bill, not the context bill — DeepSeek-class models train affordably this way" />
          </MotionChild>
        </Stagger>
      </Scene>

      {/* Beat 3 — SSM/Mamba */}
      <Scene caption="③ State-space models: compress the past instead of replaying it">
        <Stagger className="space-y-2">
          <MotionChild>
            <SsmRow claim="Fixed-size state" note="like an RNN's summary of everything read so far — but the state update is designed (HiPPO) to preserve long-range signal instead of fading it" />
          </MotionChild>
          <MotionChild>
            <SsmRow claim="Linear time" note="each token updates the state in O(1): 1M tokens = 1M updates, not 10¹² pairs — the context bill, paid once per token" accent />
          </MotionChild>
          <MotionChild>
            <SsmRow claim="Selective (Mamba)" note="the model learns WHAT to write into state and what to skip — content-aware compression, the piece plain SSMs lacked" />
          </MotionChild>
        </Stagger>
      </Scene>

      {/* Beat 4 — hybrids + counter-beat */}
      <Scene caption="④ Hybrids are the shipping answer — and the moat is real">
        <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
              <div className="text-xs font-bold text-brand">Hybrid stacks</div>
              <p className="mt-1 text-[11px] font-medium leading-relaxed text-ink-soft">
                Jamba-class designs: Mamba blocks for most layers, a few attention layers for precise
                recall — near-linear cost with attention&apos;s exactness where it matters.
                This is what actually ships.
              </p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
              <div className="text-xs font-bold text-brand">The moat</div>
              <p className="mt-1 text-[11px] font-medium leading-relaxed text-ink-soft">
                Attention keeps winning where it shouldn&apos;t on paper: mature kernels (FlashAttention),
                KV-cache inference, tooling, and a decade of tricks. Ecosystem gravity is a real
                engineering force — bet on hybrids, not replacements.
              </p>
            </div>
          </MotionChild>
        </Stagger>
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The rule</CardTitle>
        <Takeaway>
          Every frontier architecture is a bill-attack: <strong>MoE makes capacity sparse</strong> (pay for
          experts you use), <strong>SSMs make context linear</strong> (compress, don&apos;t replay). Shipping
          systems mix both with attention — read any model card&apos;s &quot;architecture&quot; line as a cost
          decision.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

/** Token stream hitting a router that lights 2 of 8 experts. */
function MoeRouter() {
  return (
    <svg viewBox="0 0 100 38" className="h-auto w-full" aria-hidden="true">
      {/* incoming tokens */}
      {["leaf", "spot", "rust"].map((t, i) => (
        <g key={t}>
          <rect x={4 + i * 13} y={16} width="11" height="6.5" rx="1.5" fill="var(--color-surface-elevated)" stroke="var(--color-ash)" strokeWidth="0.8" />
          <text x={9.5 + i * 13} y={20.5} textAnchor="middle" fontFamily="monospace" fontSize="3.4" fill="var(--color-ink)">{t}</text>
        </g>
      ))}
      {/* router */}
      <rect x="10" y="29" width="24" height="7" rx="2" fill="var(--color-brand-wash)" stroke="var(--color-brand)" strokeWidth="1" />
      <text x="22" y="33.7" textAnchor="middle" fontFamily="monospace" fontSize="3.8" fill="var(--color-ink)">router → pick 2</text>
      <path d="M22 29 Q30 26 40 22" fill="none" stroke="var(--color-brand)" strokeWidth="0.9" />
      {/* experts */}
      {Array.from({ length: 8 }, (_, i) => {
        const active = i === 1 || i === 5;
        return (
          <g key={i}>
            <rect
              x={48}
              y={3 + i * 4.2}
              width="22"
              height="3.6"
              rx="1"
              fill={active ? "var(--color-brand)" : "var(--color-surface-elevated)"}
              stroke={active ? "var(--color-brand)" : "var(--color-ash)"}
              strokeWidth="0.7"
            />
            <text x="59" y={6 + i * 4.2} textAnchor="middle" fontFamily="monospace" fontSize="2.9" fill={active ? "var(--color-canvas)" : "var(--color-ink-faint)"}>
              {`expert ${i + 1}`}
            </text>
          </g>
        );
      })}
      <path d="M40 19 L48 7.5" fill="none" stroke="var(--color-brand)" strokeWidth="1" strokeDasharray="2 1.5" />
      <path d="M40 19 L48 24.5" fill="none" stroke="var(--color-brand)" strokeWidth="1" strokeDasharray="2 1.5" />
      <text x="80" y="21" fontFamily="monospace" fontSize="3.8" fill="var(--color-ink-soft)">2 of 8 run</text>
      <text x="80" y="26" fontFamily="monospace" fontSize="3.8" fill="var(--color-ink-soft)">6 idle</text>
    </svg>
  );
}

function MoeRow({ piece, note, accent = false }: { piece: string; note: string; accent?: boolean }) {
  return (
    <div className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 shadow-sm ${accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"}`}>
      <span className="w-36 shrink-0 text-[11px] font-bold text-ink">{piece}</span>
      <p className="min-w-0 flex-1 text-[10.5px] font-medium leading-relaxed text-ink-soft">{note}</p>
    </div>
  );
}

function SsmRow({ claim, note, accent = false }: { claim: string; note: string; accent?: boolean }) {
  return (
    <div className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 shadow-sm ${accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"}`}>
      <span className="w-32 shrink-0 text-[11px] font-bold text-ink">{claim}</span>
      <p className="min-w-0 flex-1 text-[10.5px] font-medium leading-relaxed text-ink-soft">{note}</p>
    </div>
  );
}
