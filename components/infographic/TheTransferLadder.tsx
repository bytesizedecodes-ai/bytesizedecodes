import { Infographic, InfographicHeader, Card, CodePanel } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";
import { SliderControl } from "./controls";

/**
 * Fine-Tuning in Practice — Lesson 1: "Why 500 examples move a 3-billion-
 * parameter model". The transfer ladder, built bottom-up: ground truth →
 * same learning rule → updates concentrate on the uncertain → named at the
 * top rung. Ends on the Sahayak case's first evidence.
 */
export function TheTransferLadder() {
  const rungs = [
    {
      r: "GROUND — accept without argument",
      d: "Pretraining = predict the next token, at colossal scale. That one rule produced grammar, facts, and style.",
    },
    {
      r: "RUNG 1 — because the rule is unchanged",
      d: "SFT points the same next-token rule at your replies: your pack is a tiny corpus where the right next token is your ideal answer's token.",
    },
    {
      r: "RUNG 2 — because updates move the uncertain",
      d: "The model is already certain about English. What it's uncertain about is how THIS assistant answers.",
    },
    {
      r: "RUNG 3 — because the pack contains only that",
      d: "Your examples carry style, format, refusals — the conditional part. The gradient budget concentrates exactly there.",
    },
    {
      r: "TOP — the concept, named only now",
      d: "That concentration is TRANSFER LEARNING — 500 pairs work because they never ask the model to re-learn language.",
    },
  ];

  return (
    <Infographic>
      <InfographicHeader
        title="The transfer ladder"
        subtitle="Climb from the rule you already trust to why a small pack suffices"
      />

      {/* SCENE 1 — the case */}
      <Scene caption="① The case: fluent, but wrong for the job">
        <div className="mx-auto max-w-md space-y-2">
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated px-4 py-2.5 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">customer · WhatsApp</p>
              <p className="text-xs font-medium text-ink">“oranges stock chck… also can my mom take crocin + azee?”</p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated px-4 py-2.5 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">api model · today</p>
              <p className="text-xs text-ink-soft">
                four paragraphs, a mini-essay on paracetamol history, no receipt, dosage advice included…
              </p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-brand bg-brand-wash px-4 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">the team's question</p>
              <p className="text-xs font-semibold text-ink">
                why would a few hundred of OUR examples fix this — in a 3B-parameter model?
              </p>
            </div>
          </MotionChild>
        </div>
      </Scene>

      {/* SCENE 2 — the ladder */}
      <Scene caption="② The ladder — each rung follows from the one below">
        <Stagger className="mx-auto max-w-2xl space-y-2">
          {rungs.map((rung, i) => (
            <MotionChild key={rung.r}>
              <div
                className={`rounded-xl px-4 py-3 ${
                  i === rungs.length - 1
                    ? "border border-brand bg-brand-wash"
                    : "border border-ash bg-surface-elevated shadow-sm"
                }`}
              >
                <p className={`text-[11px] font-bold tracking-wide ${i === rungs.length - 1 ? "text-brand-deep" : "text-ink-soft"}`}>
                  {rung.r}
                </p>
                <p className="mt-0.5 text-xs font-medium leading-relaxed text-ink sm:text-[13px]">{rung.d}</p>
              </div>
            </MotionChild>
          ))}
        </Stagger>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Read any rung and ask “because?” — the answer is the rung beneath it. That&apos;s the re-derivation you keep.
        </p>
      </Scene>

      {/* SCENE 3 — the boundary */}
      <Scene caption="③ Where the ladder breaks: knowledge, not style">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <div className="rounded-xl border border-brand bg-brand-wash p-4 text-center">
            <div className="text-xs font-bold uppercase tracking-wide text-ink-soft">on the ladder</div>
            <p className="mt-1 text-sm font-semibold text-ink">tone · receipts · refusals</p>
            <p className="mt-0.5 text-[11px] font-medium text-ink-soft">re-weights what language already supports → 500 pairs move it</p>
          </div>
          <div className="rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wide text-ink-soft">off the ladder</div>
            <p className="mt-1 text-sm font-semibold text-ink">this week&apos;s stock levels</p>
            <p className="mt-0.5 text-[11px] font-medium text-ink-soft">missing knowledge — no style pack can carry it → a documents problem</p>
          </div>
        </div>
      </Scene>

      {/* SCENE 4 — the same rule, in code */}
      <Scene caption="④ The same rule in two costumes">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <CodePanel
            label="pretraining"
            caption="the rule, at internet scale"
            code={"corpus = the_internet\nloss = next_token(model, corpus)"}
          />
          <CodePanel
            label="your fine-tune"
            caption="the same rule, at your scale"
            code={"corpus = your_800_pairs\nloss = next_token(model, corpus)"}
            accent
          />
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          SFT is pretraining&apos;s own rule pointed at your replies — the update budget lands on{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">behavior</span>, because
          language is already certain.
        </p>
      </Card>
    </Infographic>
  );
}
