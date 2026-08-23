import { Infographic, InfographicHeader, Card } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Fine-Tuning at Scale — Lesson 1: "The tuning decision architecture".
 * The five-rung relay as one ladder with currencies, Varta's routing table,
 * and the flip analysis — the boundary where cost assumptions break.
 */
export function TheDecisionArchitecture() {
  const rungs = [
    { r: "PROMPT", buys: "instructions for this deploy", pays: "context per query" },
    { r: "RAG", buys: "fresh, auditable facts", pays: "index + retrieval latency" },
    { r: "SFT", buys: "stable behavior", pays: "data + training + gate" },
    { r: "PREFERENCE", buys: "taste among acceptables", pays: "pairs + judge calibration" },
    { r: "CPT", buys: "domain knowledge", pays: "corpus + GPU-weeks" },
  ];
  return (
    <Infographic>
      <InfographicHeader
        title="The tuning decision architecture"
        subtitle="Five rungs, five currencies — routes derived from constraints, reviewed as a function"
      />

      {/* SCENE 1 — the relay with currencies */}
      <Scene caption="① The relay: each rung paid in a different currency">
        <Stagger className="mx-auto max-w-2xl space-y-1.5">
          {rungs.map((x, i) => (
            <MotionChild key={x.r}>
              <div
                className={`flex items-center justify-between gap-3 rounded-xl px-4 py-2.5 ${
                  i === 2 ? "border border-brand bg-brand-wash" : "border border-ash bg-surface-elevated shadow-sm"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`font-mono text-xs font-bold ${i === 2 ? "text-brand-deep" : "text-ink"}`}>{x.r}</span>
                  <span className="hidden text-[10px] font-medium text-ink-soft sm:inline">buys: {x.buys}</span>
                </div>
                <span className="font-mono text-[10px] font-semibold text-ink-soft">pays: {x.pays}</span>
              </div>
            </MotionChild>
          ))}
        </Stagger>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Two engineers, same constraints → same table. The routes are derived, not advocated.
        </p>
      </Scene>

      {/* SCENE 2 — the forcing rules */}
      <Scene caption="② The forcing rules">
        <Stagger className="mx-auto max-w-2xl space-y-2">
          {[
            "freshness ceiling: weights freeze at training time → freshness-critical facts route to retrieval, regardless of SFT quality",
            "per-query currency: stable × universal × high-volume behavior migrates up to SFT — prompt tax compounds at 1.2M queries/month",
            "pairs or rollouts: 'which of two goods' needs a preference objective; likelihood can't express it",
            "representation change: knowledge the base lacks → CPT or retrieval; rank-bounded adapters can't carry it",
          ].map((s, i) => (
            <MotionChild key={s}>
              <div
                className={`rounded-xl px-4 py-2.5 text-xs font-medium text-ink ${
                  i === 1 ? "border border-brand bg-brand-wash" : "border border-ash bg-surface-elevated shadow-sm"
                }`}
              >
                {s}
              </div>
            </MotionChild>
          ))}
        </Stagger>
      </Scene>

      {/* SCENE 3 — Varta's table (slice) */}
      <Scene caption="③ The artifact: the routing table (4 of 14 rows)">
        <div className="mx-auto max-w-2xl overflow-hidden rounded-xl border border-ash shadow-sm">
          <div className="grid grid-cols-12 bg-ash px-3 py-2 text-[9px] font-bold uppercase tracking-wide text-ink">
            <span className="col-span-5">behavior</span>
            <span className="col-span-3 text-center">rung</span>
            <span className="col-span-4 text-right">binding constraint</span>
          </div>
          {[
            ["explain NEFT hold (shape)", "SFT", "stable × 1.2M/mo × universal"],
            ["today's hold reasons", "RAG", "freshness ceiling"],
            ["greeting register", "PREFERENCE", "taste, not correctness"],
            ["Diwali campaign line", "PROMPT", "disposable"],
          ].map(([b, r, c]) => (
            <div key={b} className="grid grid-cols-12 border-t border-ash bg-surface-elevated px-3 py-2">
              <span className="col-span-5 text-[11px] font-semibold text-ink">{b}</span>
              <span className="col-span-3 text-center font-mono text-[11px] font-bold text-brand-deep">{r}</span>
              <span className="col-span-4 text-right text-[10px] font-medium text-ink-soft">{c}</span>
            </div>
          ))}
        </div>
      </Scene>

      {/* SCENE 4 — the flip */}
      <Scene caption="④ BOUNDARY — the cost vector is the derivation's ground">
        <div className="mx-auto max-w-md rounded-xl border border-brand bg-brand-wash p-4 text-center">
          <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">the flip that happened industry-wide</p>
          <p className="mt-1.5 text-xs font-semibold text-ink">
            Prompt-prefix caching collapsed per-query prompt tax to an amortized cost — and rows routed to SFT purely for
            volume reasons re-derived downward.
          </p>
          <p className="mt-1.5 text-[11px] font-medium text-ink-soft">
            The table is a function of its cost vector. Review the vector quarterly; re-derive, don&apos;t re-advocate.
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          Route per behavior, from the{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">cost vector</span> — and
          re-derive when the vector moves.
        </p>
      </Card>
    </Infographic>
  );
}
