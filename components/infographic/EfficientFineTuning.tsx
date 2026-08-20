import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild, Reveal } from "./motion";

/**
 * Advanced Machine Learning — Lesson 8: "Adapt without retraining".
 * LoRA adapters, quantization, distillation — 2025-26 practice — and the
 * decision ladder: prompt → RAG → fine-tune. Counter-beat: fine-tuning is
 * usually the wrong first tool.
 */
export function EfficientFineTuning() {
  return (
    <Infographic>
      <InfographicHeader
        title="Adapt without retraining"
        subtitle="Mango Labs must make a general model speak agronomy — on a startup budget"
      />

      {/* Beat 1 — the problem */}
      <Scene caption="① The naive plan, priced">
        <Reveal>
          <div className="rounded-xl border border-[var(--color-bad)] bg-surface-elevated p-4 shadow-sm">
            <div className="font-mono text-[11.5px] font-bold text-ink">Full fine-tune of an 8B model</div>
            <div className="mt-1.5 grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="font-mono text-[13px] font-bold text-bad">8B</div>
                <div className="text-[9.5px] font-medium text-ink-soft">params to update</div>
              </div>
              <div>
                <div className="font-mono text-[13px] font-bold text-bad">64 GB</div>
                <div className="text-[9.5px] font-medium text-ink-soft">optimizer state</div>
              </div>
              <div>
                <div className="font-mono text-[13px] font-bold text-bad">8× A100</div>
                <div className="text-[9.5px] font-medium text-ink-soft">rented for weeks</div>
              </div>
            </div>
            <p className="mt-2 text-[11px] font-medium leading-relaxed text-[var(--color-bad)]">
              More GPU-hours than Mango&apos;s entire runway — to change <em>style and vocabulary</em>,
              not knowledge. The 2020s answer: don&apos;t touch the 8B.
            </p>
          </div>
        </Reveal>
      </Scene>

      {/* Beat 2 — LoRA */}
      <Scene caption="② LoRA: freeze the base, train a small patch">
        <Stagger className="space-y-2">
          <MotionChild>
            <LoraRow piece="W (8B weights)" state="frozen — never updated, never stored in optimizer" tone="muted" />
          </MotionChild>
          <MotionChild>
            <LoraRow piece="+ A·B (rank 16)" state="two thin matrices per layer — ~0.1–1% as many params, trained" tone="accent" />
          </MotionChild>
          <MotionChild>
            <LoraRow piece="merged at inference" state="A·B folds back into W — zero added latency in production" tone="good" />
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-[11px] font-medium text-ink-soft sm:text-xs">
          Why it works: the <em>change</em> a fine-tune makes is low-rank — a small matrix pair captures it.
          Mango: <span className="font-bold text-brand-deep">8M trained params instead of 8B, one 24 GB GPU, two days.</span>
          2025 finding: at modest ranks, LoRA ≈ full fine-tuning quality — even for RL-based training.
        </p>
      </Scene>

      {/* Beat 3 — quantization + distillation */}
      <Scene caption="③ Two more multipliers: shrink, then compress">
        <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
              <div className="text-xs font-bold text-brand">Quantization</div>
              <p className="mt-1 text-[11px] font-medium leading-relaxed text-ink-soft">
                Store weights in 4-bit instead of 16 — the same model in{" "}
                <span className="font-mono font-bold">¼ the memory</span> (8B: 16 GB → 4.5 GB).
                QLoRA = 4-bit base + LoRA on top: Mango fine-tunes on a <em>laptop-class</em> GPU.
              </p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
              <div className="text-xs font-bold text-brand">Distillation</div>
              <p className="mt-1 text-[11px] font-medium leading-relaxed text-ink-soft">
                Train a small student on a big teacher&apos;s outputs — 8B behavior in a 1–2B body.
                Mango&apos;s on-device checker for offline fields: distilled, 400 MB, no cloud round-trip.
              </p>
            </div>
          </MotionChild>
        </Stagger>
      </Scene>

      {/* Beat 4 — the decision ladder */}
      <Scene caption="④ The discipline: fine-tune last">
        <Stagger className="space-y-2">
          <MotionChild>
            <LadderStep rung="1 · Prompting" note="instructions + few-shot examples in context — free, instant, surprisingly far. Try this first, always" />
          </MotionChild>
          <MotionChild>
            <LadderStep rung="2 · RAG" note="the model lacks KNOWLEDGE — retrieve it into context. Fresh, auditable, citable" />
          </MotionChild>
          <MotionChild>
            <LadderStep rung="3 · Fine-tune (LoRA)" note="the model lacks BEHAVIOR — tone, format, domain vocabulary, latency budget. Now adapters earn their keep" accent />
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-[11px] font-medium text-ink-soft sm:text-xs">
          Fine-tuning teaches style, not facts — a LoRA that never saw this week&apos;s prices still
          won&apos;t know them. Knowledge problems belong one rung up.
        </p>
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The rule</CardTitle>
        <Takeaway>
          <strong>Freeze the base, train the patch</strong> — LoRA adapters at 0.1–1% of parameters, 4-bit
          quantization, distillation for the edge. And climb the ladder in order:{" "}
          <strong>prompt → retrieve → fine-tune</strong>, never the reverse.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

function LoraRow({ piece, state, tone }: { piece: string; state: string; tone: "muted" | "accent" | "good" }) {
  const cls =
    tone === "accent"
      ? "border-brand bg-brand-wash"
      : tone === "good"
        ? "border-good bg-good-wash"
        : "border-ash bg-surface-elevated";
  return (
    <div className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 shadow-sm ${cls}`}>
      <span className="w-28 shrink-0 font-mono text-[10.5px] font-bold text-ink sm:w-32">{piece}</span>
      <p className="min-w-0 flex-1 text-[10.5px] font-medium leading-relaxed text-ink-soft">{state}</p>
    </div>
  );
}

function LadderStep({ rung, note, accent = false }: { rung: string; note: string; accent?: boolean }) {
  return (
    <div className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 shadow-sm ${accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"}`}>
      <span className="w-40 shrink-0 text-[11px] font-bold text-ink">{rung}</span>
      <p className="min-w-0 flex-1 text-[10.5px] font-medium leading-relaxed text-ink-soft">{note}</p>
    </div>
  );
}
