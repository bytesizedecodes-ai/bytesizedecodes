import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild, Reveal } from "./motion";

/**
 * Advanced Machine Learning — Lesson 7: "The factory that builds a model".
 * Tokenization → pretraining → SFT → RLHF, with per-stage costs and scaling
 * laws. Counter-beat: nobody pretrains — you rent.
 */
export function LLMPipeline() {
  return (
    <Infographic>
      <InfographicHeader
        title="The factory that builds a model"
        subtitle="Pretraining → SFT → RLHF: what each stage does, and what it costs"
      />

      {/* Beat 1 — the stages */}
      <Scene caption="① Four stages, each answering a different question">
        <Stagger className="space-y-2">
          <MotionChild>
            <StageRow stage="Tokenization" question="'what is text, to a model?'" note="text → subword pieces (BPE): 'unfair' → 'un' + 'fair'. ~4 characters per token; vocabulary ~50k–200k. Every stage above this sees tokens, never letters" />
          </MotionChild>
          <MotionChild>
            <StageRow stage="Pretraining" question="'what usually comes next?'" note="predict the next token over trillions of tokens of text. This is 99%+ of the compute — months on tens of thousands of GPUs. The result knows language, facts, code style — but not manners" accent />
          </MotionChild>
          <MotionChild>
            <StageRow stage="SFT" question="'how should an assistant behave?'" note="fine-tune on tens of thousands of curated prompt→response pairs. Days, not months. The model learns the shape of helpfulness: answering, refusing, formatting" />
          </MotionChild>
          <MotionChild>
            <StageRow stage="RLHF / alignment" question="'which of two answers do humans prefer?'" note="a reward model learns human preferences; optimization pushes the model toward preferred behavior. Lesson 9's full topic" />
          </MotionChild>
        </Stagger>
      </Scene>

      {/* Beat 2 — the cost pyramid */}
      <Scene caption="② Where the money goes">
        <Stagger className="space-y-2">
          <MotionChild>
            <CostRow stage="Pretraining" share="> 99% of compute" note="frontier runs: $10M–$1B+; even a 1B-parameter model from scratch ≈ $1M+" />
          </MotionChild>
          <MotionChild>
            <CostRow stage="SFT" share="days of GPU time" note="thousands of curated examples — the cheapest stage with the biggest behavioral shift" />
          </MotionChild>
          <MotionChild>
            <CostRow stage="RLHF + evals" share="days–weeks + humans" note="preference labeling is human-labor-bound; evals continue forever after" accent />
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-[11px] font-medium text-ink-soft sm:text-xs">
          The pyramid is why open models matter: <span className="font-bold text-brand-deep">stage 1 is done once, shared; you start at stage 2.</span>
        </p>
      </Scene>

      {/* Beat 3 — scaling laws */}
      <Scene caption="③ Scaling laws: predictable returns, balanced investment">
        <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-3">
          <MotionChild>
            <ScaleCard axis="parameters" note="bigger models: loss falls smoothly with size — no cliff, no magic threshold" />
          </MotionChild>
          <MotionChild>
            <ScaleCard axis="data" note="more tokens: same smooth fall — and undertrained big models lose to well-trained smaller ones" accent />
          </MotionChild>
          <MotionChild>
            <ScaleCard axis="compute" note="loss follows a power law in total compute: 'how good will 2× budget be?' is answerable BEFORE training" />
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-[11px] font-medium text-ink-soft sm:text-xs">
          Chinchilla (2022): compute-optimal training balances tokens ≈ 20× parameters — which reset
          how the field sized both. Planning follows from the curve.
        </p>
      </Scene>

      {/* Beat 4 — counter-beat */}
      <Scene caption="④ The discipline: don't build the factory — rent it">
        <div className="rounded-xl border border-brand bg-brand-wash px-4 py-4 text-center">
          <p className="text-[12px] font-medium leading-relaxed text-ink sm:text-sm">
            Mango Labs&apos; advisory product starts at <span className="font-bold">stage 2</span>: an open
            pretrained base (Llama-class), then SFT on their own curated advisory transcripts, then
            preference tuning. Pretraining from scratch would cost more than the company —
            <span className="font-bold"> and buy nothing the open base doesn&apos;t already know.</span>
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The rule</CardTitle>
        <Takeaway>
          Pretraining buys <strong>knowledge and fluency</strong> at astronomical cost, once;
          <strong> SFT and alignment buy behavior</strong> at accessible cost, per product.
          Choose your starting floor deliberately — for almost every team it&apos;s an open base, not a from-scratch run.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

function StageRow({ stage, question, note, accent = false }: { stage: string; question: string; note: string; accent?: boolean }) {
  return (
    <div className={`flex items-start gap-3 rounded-xl border px-4 py-2.5 shadow-sm ${accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"}`}>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-xs font-bold text-ink">{stage}</span>
          <span className="font-mono text-[10px] font-semibold text-brand-deep">{question}</span>
        </div>
        <p className="mt-0.5 text-[10.5px] font-medium leading-relaxed text-ink-soft">{note}</p>
      </div>
    </div>
  );
}

function CostRow({ stage, share, note, accent = false }: { stage: string; share: string; note: string; accent?: boolean }) {
  return (
    <div className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 shadow-sm ${accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"}`}>
      <span className="w-20 shrink-0 text-[11px] font-bold text-ink">{stage}</span>
      <p className="min-w-0 flex-1 text-[10.5px] font-medium leading-relaxed text-ink-soft">{note}</p>
      <span className="shrink-0 rounded-full border border-ash bg-surface-elevated px-2 py-1 font-mono text-[9px] font-bold text-brand-deep">{share}</span>
    </div>
  );
}

function ScaleCard({ axis, note, accent = false }: { axis: string; note: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl border p-3 text-center shadow-sm ${accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"}`}>
      <div className="font-mono text-[11px] font-bold text-ink">{axis}</div>
      <p className="mt-1 text-[10.5px] font-medium leading-relaxed text-ink-soft">{note}</p>
    </div>
  );
}
