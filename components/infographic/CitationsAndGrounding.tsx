import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild, Reveal } from "./motion";

/**
 * RAG Engineering: In Practice — Lesson 6: "Grounded Answers with Citations".
 *
 * Course case: Atlas must stop guessing on gaps and start citing on answers.
 * The grounding contract in three behaviors: answer + cite; partial → say
 * what's covered; gap → refuse honestly. Good marks each honest behavior;
 * bad marks the confident gap-fill once. The refusal-as-feature framing is
 * the resolution.
 */
export function CitationsAndGrounding() {
  return (
    <Infographic>
      <InfographicHeader
        title="Answer from the pages — or say they don't"
        subtitle="The grounding contract: citations on claims, honesty on gaps."
      />

      {/* Scene 1 — the contract in three behaviors */}
      <Scene caption="① Three situations, three honest answers">
        <Stagger className="space-y-2">
          <MotionChild>
            <Behavior
              tone="good"
              situation="The pages cover it"
              answer="“Parental leave is 16 weeks, extendable by 4 — [HR-policy p4].”"
              note="every claim traceable to a chunk"
            />
          </MotionChild>
          <MotionChild>
            <Behavior
              tone="good"
              situation="The pages cover half of it"
              answer="“Vacation carryover to April is documented [HR-policy p7]; who approves it isn't in the docs I found.”"
              note="answer the covered part — and mark the boundary"
            />
          </MotionChild>
          <MotionChild>
            <Behavior
              tone="bad"
              situation="The pages say nothing"
              answer="“Probably your team lead approves carryover — most companies do that.” ← the confident gap-fill"
              note="fluent, plausible, untraceable — the exact failure RAG exists to prevent"
            />
          </MotionChild>
        </Stagger>
      </Scene>

      {/* Scene 2 — the refusal, reframed */}
      <Scene caption="② “The docs don't cover it” is a feature">
        <Reveal>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
              <div className="text-sm font-bold text-ink">What users actually report</div>
              <p className="mt-1 text-[11px] font-medium leading-relaxed text-ink-soft">
                &ldquo;It said so, citing HR-policy p7&rdquo; — trust.
                &ldquo;I don&apos;t know, that&apos;s not in the docs&rdquo; — more trust.
                A confident guess that unravels — <span className="font-bold text-ink">trust gone for good</span>.
              </p>
            </div>
            <div className="rounded-xl border border-brand bg-brand-wash p-4 shadow-sm">
              <div className="text-sm font-bold text-ink">What the refusal buys</div>
              <p className="mt-1 text-[11px] font-medium leading-relaxed text-ink">
                Every refusal is a <span className="font-bold">mapped gap</span>: log it, and
                you have the exact document the knowledge base is missing — the ingestion
                pipeline&apos;s next to-do list, written by users.
              </p>
            </div>
          </div>
        </Reveal>
      </Scene>

      {/* Scene 3 — how the contract is written */}
      <Scene caption="③ Enforced by the prompt, verified by the eval">
        <div className="rounded-xl border border-brand bg-brand-wash px-4 py-4 text-center">
          <p className="text-sm font-medium leading-relaxed text-ink sm:text-base">
            The system prompt sets the rules — <span className="font-bold">only the retrieved
            pages, cite each claim, refuse on gaps</span> — but a rule isn&apos;t a contract
            until something checks it: lesson 7&apos;s faithfulness metric scores exactly this,
            per answer, forever.
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The takeaway</CardTitle>
        <Takeaway>
          Grounded = answers cite their pages, partial answers mark their boundaries, and gaps
          become honest refusals — logged as the index's to-do list.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

/** One grounding behavior row. */
function Behavior({ tone, situation, answer, note }: { tone: "good" | "bad"; situation: string; answer: string; note: string }) {
  const good = tone === "good";
  return (
    <div
      className={`rounded-xl border px-4 py-3 shadow-sm ${
        good ? "border-good bg-good-wash" : "border-[var(--color-bad)] bg-surface-elevated"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-canvas ${good ? "bg-good" : "bg-[var(--color-bad)]"}`}>
          {good ? "✓ honest" : "✗ gap-fill"}
        </span>
        <span className="text-[11px] font-bold uppercase tracking-wide text-ink-soft">{situation}</span>
      </div>
      <p className="mt-1.5 text-xs font-semibold leading-relaxed text-ink">{answer}</p>
      <p className="mt-1 text-[10.5px] font-medium leading-relaxed text-ink-soft">{note}</p>
    </div>
  );
}
