import { Infographic, InfographicHeader, Card } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Fine-Tuning in Practice — Lesson 2: "The decision memo". The token
 * arithmetic scene, the freeze test, and the per-beavior routing table —
 * Sahayak ships as all three rungs at once.
 */
export function PromptRagOrFinetune() {
  return (
    <Infographic>
      <InfographicHeader
        title="The decision memo"
        subtitle="Per-behavior routing: prompt, RAG, or fine-tune — with the arithmetic on the table"
      />

      {/* SCENE 1 — the repeated-instructions bill */}
      <Scene caption="① The recurring cost, priced">
        <Stagger className="mx-auto max-w-lg space-y-2">
          {[
            { k: "messages / month", v: "120,000" },
            { k: "instruction tokens / message", v: "× 700" },
            { k: "repeated instructions / month", v: "= 84M tokens", hot: true },
            { k: "rule changes in the last year", v: "0" },
          ].map((row) => (
            <MotionChild key={row.k}>
              <div
                className={`flex items-center justify-between gap-3 rounded-xl px-4 py-2.5 ${
                  row.hot ? "border border-brand bg-brand-wash" : "border border-ash bg-surface-elevated shadow-sm"
                }`}
              >
                <p className="text-xs font-medium text-ink">{row.k}</p>
                <p className={`font-mono text-sm font-bold ${row.hot ? "text-brand-deep" : "text-ink"}`}>{row.v}</p>
              </div>
            </MotionChild>
          ))}
        </Stagger>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          A fine-tune writes those rules into the weights once — and deletes the block from every future message.
        </p>
      </Scene>

      {/* SCENE 2 — the freeze test kills the overreach */}
      <Scene caption="② The freeze test: weights are a snapshot, the feed is a river">
        <div className="mx-auto flex max-w-lg items-center justify-center gap-3 sm:gap-6">
          <div className="rounded-xl border border-ash bg-surface-elevated px-4 py-3 text-center shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">trained today</p>
            <p className="mt-1 font-mono text-xs font-semibold text-ink">stock: crocin ✓ (Tue)</p>
            <p className="mt-0.5 text-[10px] font-medium text-ink-soft">frozen at training day</p>
          </div>
          <span className="text-lg font-bold text-ink-soft">→ Friday</span>
          <div className="rounded-xl border border-ash bg-surface-elevated px-4 py-3 text-center shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">live feed</p>
            <p className="mt-1 font-mono text-xs font-semibold text-ink">stock: crocin ✗</p>
            <p className="mt-0.5 text-[10px] font-medium text-ink-soft">model confidently quotes Tuesday</p>
          </div>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Freshness belongs to lookup at answer time — correctness from the document, not from memory.
        </p>
      </Scene>

      {/* SCENE 3 — the routing table */}
      <Scene caption="③ One product, three rungs — routed per behavior">
        <Stagger className="mx-auto max-w-2xl space-y-2">
          {[
            { b: "house tone + strict receipts", test: "stable 1yr · repeated 84M/mo", rung: "FINE-TUNE", hot: true },
            { b: "stock & price answers", test: "changes daily", rung: "RAG", hot: false },
            { b: "Diwali greeting banner", test: "two weeks only", rung: "PROMPT", hot: false },
          ].map((row) => (
            <MotionChild key={row.b}>
              <div
                className={`flex flex-wrap items-center justify-between gap-2 rounded-xl px-4 py-3 ${
                  row.hot ? "border border-brand bg-brand-wash" : "border border-ash bg-surface-elevated shadow-sm"
                }`}
              >
                <div>
                  <p className="text-xs font-bold text-ink">{row.b}</p>
                  <p className="text-[10px] font-medium text-ink-soft">{row.test}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 font-mono text-[11px] font-bold ${
                    row.hot ? "bg-brand text-canvas" : "bg-ash text-ink"
                  }`}
                >
                  {row.rung}
                </span>
              </div>
            </MotionChild>
          ))}
        </Stagger>
      </Scene>

      {/* SCENE 4 — the two failure modes */}
      <Scene caption="④ Teams that pick ONE rung for everything">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <div className="rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wide text-ink-soft">climbed too high</div>
            <p className="mt-1 text-xs font-semibold text-ink">Retraining facts every policy change</p>
            <p className="mt-0.5 text-[11px] font-medium text-ink-soft">training bills chasing what a database edit does free</p>
          </div>
          <div className="rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wide text-ink-soft">never climbed</div>
            <p className="mt-1 text-xs font-semibold text-ink">Re-injecting permanent style every message</p>
            <p className="mt-0.5 text-[11px] font-medium text-ink-soft">84M tokens a month of instructions that never change</p>
          </div>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          Route per behavior:{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">stability + repetition</span>{" "}
          trains, <span className="underline decoration-brand-deep decoration-2 underline-offset-2">freshness</span>{" "}
          retrieves, <span className="underline decoration-brand-deep decoration-2 underline-offset-2">campaigns</span>{" "}
          prompt.
        </p>
      </Card>
    </Infographic>
  );
}
