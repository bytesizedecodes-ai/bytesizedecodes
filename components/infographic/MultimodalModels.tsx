import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild, Reveal } from "./motion";

/**
 * Advanced Machine Learning — Lesson 11: "One space for two senses".
 * CLIP's contrastive training, shared embeddings, zero-shot classification,
 * and VLMs (vision encoder + LLM). Through-line: the two-tower diagram.
 */
export function MultimodalModels() {
  return (
    <Infographic>
      <InfographicHeader
        title="One space for two senses"
        subtitle="Mango Labs, week 10: photos in, advice out — how models learn to see and read together"
      />

      {/* Beat 1 — the two towers */}
      <Scene caption="① CLIP: two encoders dragged toward a shared space">
        <TwoTowers />
        <Stagger className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
          <MotionChild>
            <ClipStep top="Image encoder" bottom="CNN/ViT turns a photo into a point — a list of numbers capturing its content" />
          </MotionChild>
          <MotionChild>
            <ClipStep top="Text encoder" bottom="transformer turns a caption into a point in the SAME space" accent />
          </MotionChild>
          <MotionChild>
            <ClipStep top="Contrastive training" bottom="400M photo–caption pairs: matched pairs pulled together, mismatched pushed apart" />
          </MotionChild>
        </Stagger>
      </Scene>

      {/* Beat 2 — the payoff: zero-shot */}
      <Scene caption="② The payoff: classification with zero labeled examples">
        <Stagger className="space-y-2">
          <MotionChild>
            <ZeroShotRow attempt="“a photo of a mango leaf with rust”" score="similarity 0.91 ✓" note="the leaf photo lands nearest this caption" />
          </MotionChild>
          <MotionChild>
            <ZeroShotRow attempt="“a photo of a healthy mango leaf”" score="similarity 0.44" note="farther — no training on Mango data at all" />
          </MotionChild>
          <MotionChild>
            <ZeroShotRow attempt="“a photo of a mango leaf with anthracnose” score" note="the third caption completes a classifier Mango wrote in an afternoon — no labels, no training run" score="similarity 0.71" accent />
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-[11px] font-medium text-ink-soft sm:text-xs">
          Prompts became the classifier. Mango&apos;s first deployed triage tool was{" "}
          <span className="font-bold text-brand-deep">three sentences long</span>.
        </p>
      </Scene>

      {/* Beat 3 — VLMs */}
      <Scene caption="③ Vision-language models: eyes wired into an LLM">
        <Stagger className="space-y-2">
          <MotionChild>
            <VlmRow part="vision encoder (frozen or lightly tuned)" note="turns the field photo into token-like embeddings" />
          </MotionChild>
          <MotionChild>
            <VlmRow part="projection" note="a small learned bridge — image embeddings translated into the LLM's token space" accent />
          </MotionChild>
          <MotionChild>
            <VlmRow part="the LLM" note="reads image tokens like words: 'given this leaf and the farmer's note, what's the risk?'" />
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-[11px] font-medium text-ink-soft sm:text-xs">
          Same recipe as CLIP made industrial: embeddings are the universal adapter between senses.
        </p>
      </Scene>

      {/* Beat 4 — counter-beat */}
      <Scene caption="④ The discipline: shared space ≠ shared understanding">
        <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
              <div className="text-xs font-bold text-brand">What transfers</div>
              <p className="mt-1 text-[11px] font-medium leading-relaxed text-ink-soft">
                Broad visual concepts, scene gist, text–image similarity. Mango&apos;s triage classifier
                shipped on this.
              </p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
              <div className="text-xs font-bold text-brand">What doesn&apos;t</div>
              <p className="mt-1 text-[11px] font-medium leading-relaxed text-ink-soft">
                Fine-grained expert distinctions: early rust vs. nutrient burn at 2 weeks. CLIP-style
                pretraining never saw such pairs — Mango still fine-tunes a small specialist head for the
                final call (Lesson 8&apos;s LoRA, again).
              </p>
            </div>
          </MotionChild>
        </Stagger>
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The rule</CardTitle>
        <Takeaway>
          Multimodal learning is <strong>representation alignment</strong> — pull modalities into one
          embedding space and similarity becomes meaning. It buys zero-shot breadth for free;
          <strong> expert depth still needs your labels.</strong>
        </Takeaway>
      </Card>
    </Infographic>
  );
}

/** The through-line: image tower + text tower meeting in a shared space. */
function TwoTowers() {
  const pairs: [number, number][] = [
    [26, 20], [34, 27], [30, 35], [24, 30],
  ];
  return (
    <svg viewBox="0 0 100 50" className="h-auto w-full" aria-hidden="true">
      {/* towers */}
      <rect x="6" y="10" width="16" height="30" rx="2.5" fill="var(--color-surface-elevated)" stroke="var(--color-brand)" strokeWidth="1.2" />
      <text x="14" y="27.5" textAnchor="middle" fontFamily="monospace" fontSize="4.4" fill="var(--color-ink)">image</text>
      <text x="14" y="33" textAnchor="middle" fontFamily="monospace" fontSize="4.4" fill="var(--color-ink)">encoder</text>
      <rect x="78" y="10" width="16" height="30" rx="2.5" fill="var(--color-surface-elevated)" stroke="var(--color-brand)" strokeWidth="1.2" />
      <text x="86" y="27.5" textAnchor="middle" fontFamily="monospace" fontSize="4.4" fill="var(--color-ink)">text</text>
      <text x="86" y="33" textAnchor="middle" fontFamily="monospace" fontSize="4.4" fill="var(--color-ink)">encoder</text>
      {/* shared space */}
      <rect x="28" y="10" width="44" height="30" rx="3" fill="var(--color-brand-wash)" stroke="var(--color-ash)" strokeWidth="0.8" />
      <text x="50" y="44.5" textAnchor="middle" fontFamily="monospace" fontSize="4" fill="var(--color-ink-soft)">one shared embedding space</text>
      {/* matched pairs pulled together */}
      {pairs.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x - 3} cy={y} r="2" fill="var(--color-brand-deep)" />
          <circle cx={x + 3} cy={y + 1.5} r="2" fill="none" stroke="var(--color-brand)" strokeWidth="1" />
        </g>
      ))}
      <line x1="22" y1="25" x2="28" y2="25" stroke="var(--color-brand)" strokeWidth="1" />
      <line x1="72" y1="25" x2="78" y2="25" stroke="var(--color-brand)" strokeWidth="1" />
    </svg>
  );
}

function ClipStep({ top, bottom, accent = false }: { top: string; bottom: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl border px-3 py-2.5 text-center shadow-sm ${accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"}`}>
      <div className="text-[11px] font-bold text-ink">{top}</div>
      <p className="mt-0.5 text-[10.5px] font-medium leading-relaxed text-ink-soft">{bottom}</p>
    </div>
  );
}

function ZeroShotRow({ attempt, score, note, accent = false }: { attempt: string; score: string; note: string; accent?: boolean }) {
  return (
    <div className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 shadow-sm ${accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"}`}>
      <span className="min-w-0 flex-1 font-mono text-[10px] font-semibold text-ink">{attempt}</span>
      <span className="shrink-0 rounded-full border border-ash bg-surface-elevated px-2 py-1 font-mono text-[9px] font-bold text-brand-deep">{score}</span>
      <p className="hidden w-40 shrink-0 text-[9.5px] font-medium text-ink-soft sm:block">{note}</p>
    </div>
  );
}

function VlmRow({ part, note, accent = false }: { part: string; note: string; accent?: boolean }) {
  return (
    <div className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 shadow-sm ${accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"}`}>
      <span className="w-44 shrink-0 font-mono text-[10px] font-bold text-ink">{part}</span>
      <p className="min-w-0 flex-1 text-[10.5px] font-medium leading-relaxed text-ink-soft">{note}</p>
    </div>
  );
}
