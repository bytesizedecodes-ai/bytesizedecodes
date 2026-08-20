import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild, Reveal } from "./motion";

/**
 * Advanced Machine Learning — Lesson 6: "The anatomy of a Transformer".
 * Q/K/V as a library lookup, multi-head views, positional information, and
 * the decoder-only GPT block. Expert register: mechanism-first, terse.
 */
export function InsideTheTransformer() {
  return (
    <Infographic>
      <InfographicHeader
        title="The anatomy of a Transformer"
        subtitle="Q/K/V, heads, positions, and the one stacked block behind GPT"
      />

      {/* Beat 1 — QKV as lookup */}
      <Scene caption="① Attention is a soft library lookup">
        <Stagger className="space-y-2">
          <MotionChild>
            <QkvRow role="Query" q="what am I looking for?" note="each token projects its own query: 'I'm the word plan — any treatment or nutrient context out there?'" />
          </MotionChild>
          <MotionChild>
            <QkvRow role="Key" q="what do I advertise?" note="each token projects a key: its label on the spine — 'I'm about nitrogen', 'I'm a negation'" />
          </MotionChild>
          <MotionChild>
            <QkvRow role="Value" q="what do I lend if matched?" note="each token projects a value: the content it hands over when selected" accent />
          </MotionChild>
        </Stagger>
        <Reveal>
          <div className="mt-3 rounded-xl border border-brand bg-brand-wash px-4 py-3 text-center shadow-sm">
            <p className="font-mono text-[11px] font-bold text-ink sm:text-xs">
              attention(token) = Σ softmax(query·keys) × values
            </p>
            <p className="mt-1 text-[10.5px] font-medium text-ink-soft">
              match scores → spotlight weights → borrow a weighted blend of everyone&apos;s values.
              Three learned projections per token; the whole mechanism is dot products.
            </p>
          </div>
        </Reveal>
      </Scene>

      {/* Beat 2 — multi-head */}
      <Scene caption="② Several heads, several concerns — in parallel">
        <Stagger className="grid grid-cols-1 gap-2 sm:grid-cols-4 sm:gap-2">
          {[
            { h: "head 1", w: "grammar: verb ↔ subject" },
            { h: "head 2", w: "negation: NOT ↔ fungicide" },
            { h: "head 3", w: "entities: plan ↔ nitrogen" },
            { h: "head 4", w: "position: previous word" },
          ].map((head, i) => (
            <MotionChild key={head.h}>
              <div className={`rounded-xl border px-2.5 py-2.5 text-center shadow-sm ${i === 1 || i === 2 ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"}`}>
                <div className="font-mono text-[10px] font-bold text-ink">{head.h}</div>
                <p className="mt-0.5 text-[10px] font-medium leading-relaxed text-ink-soft">{head.w}</p>
              </div>
            </MotionChild>
          ))}
        </Stagger>
        <p className="mt-3 text-center text-[11px] font-medium text-ink-soft sm:text-xs">
          Each head runs the same lookup with <span className="font-bold">its own Q/K/V projections</span> —
          specialization emerges from training, unprompted. Outputs concatenate and mix back together.
        </p>
      </Scene>

      {/* Beat 3 — positions + the block */}
      <Scene caption="③ Order is injected; then the block just stacks">
        <Stagger className="space-y-2">
          <MotionChild>
            <BlockRow part="positional encoding" note="attention itself is order-blind — a learned position signature is added to every token so 'spray then prune' ≠ 'prune then spray'" />
          </MotionChild>
          <MotionChild>
            <BlockRow part="① multi-head attention" note="tokens exchange context" accent />
          </MotionChild>
          <MotionChild>
            <BlockRow part="② feed-forward MLP" note="each token thinks alone about what it just gathered — most parameters live here" />
          </MotionChild>
          <MotionChild>
            <BlockRow part="residual + layer norm" note="add input back at each sub-step — gradients keep a clean path through 100 blocks" />
          </MotionChild>
          <MotionChild>
            <BlockRow part="× N (12 … 100+), then an output head" note="next-token probabilities over the vocabulary. That's the entire GPT" accent />
          </MotionChild>
        </Stagger>
      </Scene>

      {/* Beat 4 — counter-beat */}
      <Scene caption="④ What this stack still does badly">
        <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-3">
          <MotionChild>
            <LimitCard title="Quadratic context" note="every token × every token: 100k context = 10¹⁰ pairs. Long documents get expensive fast" />
          </MotionChild>
          <MotionChild>
            <LimitCard title="No persistent memory" note="context resets every conversation — 'memory' is re-sent or bolted on outside the model" />
          </MotionChild>
          <MotionChild>
            <LimitCard title="Order by injection" note="positions are a patch, not native — why 'lost in the middle' effects appear on very long inputs" />
          </MotionChild>
        </Stagger>
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The rule</CardTitle>
        <Takeaway>
          A transformer block = <strong>parallel soft lookups (multi-head attention) + per-token thinking (MLP) + clean gradients (residuals)</strong>,
          stacked. No recurrence, no convolution — and every limit listed above is the research agenda
          of Lessons 8 and 12.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

function QkvRow({ role, q, note, accent = false }: { role: string; q: string; note: string; accent?: boolean }) {
  return (
    <div className={`flex items-start gap-3 rounded-xl border px-4 py-2.5 shadow-sm ${accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"}`}>
      <span className="w-12 shrink-0 font-mono text-[10.5px] font-bold text-brand-deep">{role}</span>
      <div className="min-w-0 flex-1">
        <div className="text-[11px] font-bold text-ink">{q}</div>
        <p className="mt-0.5 text-[10.5px] font-medium leading-relaxed text-ink-soft">{note}</p>
      </div>
    </div>
  );
}

function BlockRow({ part, note, accent = false }: { part: string; note: string; accent?: boolean }) {
  return (
    <div className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 shadow-sm ${accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"}`}>
      <span className="w-40 shrink-0 font-mono text-[10px] font-bold text-ink sm:w-44">{part}</span>
      <p className="min-w-0 flex-1 text-[10.5px] font-medium leading-relaxed text-ink-soft">{note}</p>
    </div>
  );
}

function LimitCard({ title, note }: { title: string; note: string }) {
  return (
    <div className="rounded-xl border border-ash bg-surface-elevated p-3 text-center shadow-sm">
      <div className="text-[11px] font-bold text-ink">{title}</div>
      <p className="mt-0.5 text-[10px] font-medium leading-relaxed text-ink-soft">{note}</p>
    </div>
  );
}
