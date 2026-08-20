import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild, Reveal } from "./motion";

/**
 * RAG Engineering: At Scale — Lesson 2: "Agentic RAG".
 *
 * The control loop the model drives: decide whether to retrieve, assess
 * sufficiency, re-query with what it learned, escalate or refuse when
 * exhausted — with a retrieval budget. The cost beat: research mode is ~6×
 * a single pass, so it's routed to, not defaulted. Expert register.
 */
export function AgenticRag() {
  return (
    <Infographic>
      <InfographicHeader
        title="When the model drives the retrieval"
        subtitle="One query, one shot — or a loop that decides when the evidence is enough."
      />

      {/* Beat 1 — the loop */}
      <Scene caption="① The sufficiency loop">
        <Stagger className="flex flex-col gap-2">
          <MotionChild>
            <LoopStep n={1} label="Assess" detail="does the context actually answer the question — or is it near-miss material?" />
          </MotionChild>
          <MotionChild>
            <LoopStep n={2} label="Refine" detail="extract what's missing; rewrite the query with what the first pass taught" accent />
          </MotionChild>
          <MotionChild>
            <LoopStep n={3} label="Re-retrieve" detail="second pass on the refined query — or a different retriever, or the graph" />
          </MotionChild>
          <MotionChild>
            <LoopStep n={4} label="Decide" detail="sufficient → answer · budget spent → escalate or refuse — never loop forever" />
          </MotionChild>
        </Stagger>
      </Scene>

      {/* Beat 2 — the cost truth */}
      <Scene caption="② The receipt nobody budgets">
        <Reveal>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wide text-ink-soft">single-pass Atlas</div>
              <p className="mt-1.5 font-mono text-[12px] leading-relaxed text-ink">
                1 retrieve · 1 rerank · 1 answer
                <br />≈ €0.006 / query
              </p>
            </div>
            <div className="rounded-xl border border-brand bg-brand-wash p-4 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wide text-brand">research mode (agentic)</div>
              <p className="mt-1.5 font-mono text-[12px] leading-relaxed text-ink">
                ~3 loops × (assess + refine + retrieve)
                <br />≈ €0.037 / query — <span className="font-bold">~6×</span>
              </p>
            </div>
          </div>
        </Reveal>
        <p className="mt-3 text-center text-sm font-medium leading-relaxed text-ink">
          A loop with a budget is a tool; a loop without one is an outage with a countdown —
          the budget rule from harness engineering, <span className="font-bold">transplanted to retrieval</span>.
        </p>
      </Scene>

      {/* Beat 3 — routing */}
      <Scene caption="③ Route into the loop, don't default into it">
        <div className="rounded-xl border border-brand bg-brand-wash px-4 py-4 text-center">
          <p className="text-sm font-medium leading-relaxed text-ink sm:text-base">
            Atlas ships research mode <span className="font-bold">opt-in by query shape</span>:
            multi-part and cross-doc questions get the loop; the 92% single-hop get one fast
            pass. The classifier is cheap; the loop is not.
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The rule</CardTitle>
        <Takeaway>
          Agentic RAG trades retrieval autonomy for iteration cost: sufficiency checks,
          refined re-queries, a hard budget — and a router deciding who needs it.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

/** One step of the sufficiency loop. */
function LoopStep({ n, label, detail, accent = false }: { n: number; label: string; detail: string; accent?: boolean }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border px-4 py-3 shadow-sm ${
        accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"
      }`}
    >
      <span
        aria-hidden="true"
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-[11px] font-bold text-canvas"
      >
        {n}
      </span>
      <div className="min-w-0">
        <div className="text-xs font-bold text-ink sm:text-[13px]">{label}</div>
        <p className="mt-0.5 text-[10.5px] font-medium leading-relaxed text-ink-soft">{detail}</p>
      </div>
    </div>
  );
}
