import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild, Reveal } from "./motion";

/**
 * Harness Engineering: In Practice — Lesson 9 (capstone): "Cost and Latency".
 *
 * Course case resolution: Relay ships. The router visual — three lanes
 * (cache hit, small-model fast lane, escalate-to-large) with per-lane cost
 * and latency meters, then the capstone decision: cheap-first routing gated
 * by evals and wrapped in guardrails. Brand accent on the cache lane (the
 * cheapest win); neutral lanes otherwise; no semantic colors needed.
 */
export function CostAndLatency() {
  return (
    <Infographic>
      <InfographicHeader
        title="Not every word needs the big model"
        subtitle="Relay's last design decision: route each request to the cheapest lane that handles it."
      />

      {/* Scene 1 — the three lanes */}
      <Scene caption="① The router: three lanes, one request each">
        <Stagger className="space-y-2">
          <MotionChild>
            <Lane
              name="Cache lane"
              detail="identical question asked before → replay the stored answer"
              cost="≈ €0.000"
              latency="~5ms"
              accent
            />
          </MotionChild>
          <MotionChild>
            <Lane
              name="Fast lane"
              detail="small model: order status, policy quotes, simple rewrites"
              cost="€0.001"
              latency="~400ms"
            />
          </MotionChild>
          <MotionChild>
            <Lane
              name="Escalation lane"
              detail="large model: the model flags low confidence · refund disputes, angry multi-issue tickets"
              cost="€0.02"
              latency="~1.8s"
            />
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-sm font-medium text-ink-soft">
          10× to 20× price gaps between lanes — <span className="font-bold text-ink">routing is the biggest cost lever</span> in most harnesses.
        </p>
      </Scene>

      {/* Scene 2 — the two accelerators beside routing */}
      <Scene caption="② The other two levers, pulled in order">
        <Reveal>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
              <div className="text-sm font-bold text-ink">Cache before you compute</div>
              <p className="mt-1 text-[11px] font-medium leading-relaxed text-ink-soft">
                Support traffic is repetitive: top-50 questions cover most volume. Exact and
                semantic caches turn repeats into free answers.
              </p>
            </div>
            <div className="rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
              <div className="text-sm font-bold text-ink">Stream while you compute</div>
              <p className="mt-1 text-[11px] font-medium leading-relaxed text-ink-soft">
                Latency is perceived, not just measured: streaming first tokens makes a 1.8s
                escalation <span className="font-bold text-ink">feel</span> faster than a
                blocked 900ms answer.
              </p>
            </div>
          </div>
        </Reveal>
      </Scene>

      {/* Scene 3 — the capstone resolution */}
      <Scene caption="③ How Relay finally ships">
        <Reveal>
          <div className="rounded-xl border border-brand bg-brand-wash px-4 py-4">
            <div className="space-y-1.5 text-sm font-medium leading-relaxed text-ink">
              <p>
                <span className="font-bold">Context</span> — packed window, pinned facts. ✦
                <span className="font-bold"> Tools</span> — three, with teaching errors.
              </p>
              <p>
                <span className="font-bold">Prompt</span> — v13, versioned, contradiction-free. ✦
                <span className="font-bold">Output</span> — schema + bounded repair.
              </p>
              <p>
                <span className="font-bold">Guardrails</span> — allowlist, budgets, hygiene. ✦
                <span className="font-bold">Evals</span> — 5 tasks gating every change.
              </p>
              <p className="pt-1 text-center font-bold">
                …and a router that spends the big model only where the suite says it&apos;s needed.
              </p>
            </div>
          </div>
        </Reveal>
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The capstone takeaway</CardTitle>
        <Takeaway>
          Cost and latency are designed, not discovered: cache first, route cheap-to-smart,
          stream to the user — and let evals decide what the cheap lane may handle.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

/** One routing lane with its cost and latency meters. */
function Lane({
  name,
  detail,
  cost,
  latency,
  accent = false,
}: {
  name: string;
  detail: string;
  cost: string;
  latency: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-2 rounded-xl border px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:gap-4 ${
        accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className="text-sm font-bold text-ink">{name}</div>
        <p className="mt-0.5 text-[11px] font-medium leading-relaxed text-ink-soft">{detail}</p>
      </div>
      <div className="flex shrink-0 gap-2">
        <span className="rounded-full border border-ash bg-surface-elevated px-2.5 py-1 font-mono text-[10px] font-bold text-ink">
          {cost}
        </span>
        <span className="rounded-full border border-ash bg-surface-elevated px-2.5 py-1 font-mono text-[10px] font-bold text-ink">
          {latency}
        </span>
      </div>
    </div>
  );
}
