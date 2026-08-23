import { Infographic, InfographicHeader, Card } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Fine-Tuning in Practice — Lesson 5: "Train on the answers, not the
 * questions". Loss masking on the rendered token stream: which tokens are
 * context, which are targets — the driving-instructor rule.
 */
export function TrainOnAnswersOnly() {
  return (
    <Infographic>
      <InfographicHeader
        title="Train on the answers, not the questions"
        subtitle="Loss masking: the gradient lands on your replies, never on customer typos"
      />

      {/* SCENE 1 — the token stream with the mask */}
      <Scene caption="① One rendered example, two zones">
        <div className="mx-auto flex max-w-xl flex-wrap items-center justify-center gap-1.5">
          {[
            ["<|user|>", "ctx"], ["cro", "ctx"], ["cin", "ctx"], ["500", "ctx"], ["mil", "ctx"], ["gya", "ctx"],
            ["??", "ctx"], ["<|assistant|>", "ctx"], ["Sure", "tgt"], ["—", "tgt"], ["checking", "tgt"],
            ["Apta", "tgt"], ["branch", "tgt"], ["!", "tgt"], ["<|end|>", "tgt"],
          ].map(([tok, zone], i) => (
            <span
              key={i}
              className={`rounded px-1.5 py-0.5 font-mono text-[11px] font-semibold ${
                zone === "tgt" ? "border border-brand bg-brand-wash text-brand-deep" : "border border-ash bg-surface-elevated text-ink-soft"
              }`}
            >
              {tok as string}
            </span>
          ))}
        </div>
        <div className="mx-auto mt-3 max-w-xl">
          <div className="flex h-6 overflow-hidden rounded-full border border-ash text-[10px] font-bold">
            <div className="flex flex-[8] items-center justify-center bg-ash text-ink-soft">loss = 0 · context</div>
            <div className="flex flex-[7] items-center justify-center bg-brand text-canvas">loss = 1 · reply targets</div>
          </div>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Prompt tokens feed the forward pass; only reply tokens earn loss.
        </p>
      </Scene>

      {/* SCENE 2 — the derivation */}
      <Scene caption="② Why the mask — derive it in three rungs">
        <Stagger className="mx-auto max-w-lg space-y-2">
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated px-4 py-2.5 shadow-sm">
              <p className="text-xs font-medium text-ink">
                <span className="font-bold">GROUND:</span> every unmasked token is a target the model learns to produce.
              </p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated px-4 py-2.5 shadow-sm">
              <p className="text-xs font-medium text-ink">
                <span className="font-bold">RUNG 1:</span> unmasked customer text → the model trains to{" "}
                <em>generate customer queries</em>.
              </p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-brand bg-brand-wash px-4 py-2.5">
              <p className="text-xs font-semibold text-ink">
                <span className="font-bold text-brand-deep">RUNG 2:</span> the product only ever generates replies — so
                loss belongs on exactly those tokens. That rule <em>is</em> the mask.
              </p>
            </div>
          </MotionChild>
        </Stagger>
      </Scene>

      {/* SCENE 3 — without the mask */}
      <Scene caption="③ What `train_on_prompt: true` actually buys">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <div className="rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wide text-ink-soft">with the mask</div>
            <p className="mt-1 text-xs font-semibold text-ink">100% of the gradient → reply behavior</p>
            <p className="mt-0.5 text-[11px] font-medium text-ink-soft">tone, receipts, refusals — the product</p>
          </div>
          <div className="rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wide text-ink-soft">without it</div>
            <p className="mt-1 text-xs font-semibold text-ink">~a third of the gradient → imitating typos</p>
            <p className="mt-0.5 text-[11px] font-medium text-ink-soft">learning to *be the customer* — capacity spent on the input distribution</p>
          </div>
        </div>
      </Scene>

      {/* SCENE 4 — multi-turn */}
      <Scene caption="④ Multi-turn pairs: mask per turn">
        <div className="mx-auto max-w-md space-y-1.5">
          {[
            ["user", "which branch?", "masked"],
            ["assistant", "Which one is nearest to you?", "loss"],
            ["user", "apta", "masked"],
            ["assistant", "Checking Apta — one moment!", "loss"],
          ].map(([role, text, zone]) => (
            <div key={text} className="flex items-center justify-between gap-3 rounded-lg border border-ash bg-surface-elevated px-3 py-1.5 shadow-sm">
              <p className="font-mono text-[11px] text-ink">
                <span className="font-bold">{role}:</span> {text}
              </p>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                  zone === "loss" ? "bg-brand-wash text-brand-deep" : "bg-ash text-ink-soft"
                }`}
              >
                {zone}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Each assistant turn in the loss; every user turn masked. System prompt: context, like all prompts.
        </p>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          Grade the steering, not the road — loss only on the tokens the model{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">produces in production</span>.
        </p>
      </Card>
    </Infographic>
  );
}
