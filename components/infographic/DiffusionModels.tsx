import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild, Reveal } from "./motion";

/**
 * Advanced Machine Learning — Lesson 10: "Destroying noise, slowly".
 * Diffusion: forward noising → learned denoising → why it displaced GANs →
 * the guidance dial → diffusion LLMs as the 2026 frontier. The noise ladder
 * is the through-line.
 */
export function DiffusionModels() {
  return (
    <Infographic>
      <InfographicHeader
        title="Destroying noise, slowly"
        subtitle="How image generators actually work — and why text is next"
      />

      {/* Beat 1 — the two directions */}
      <Scene caption="① Training: noise things up. Generation: walk it back.">
        <NoiseLadder />
        <Stagger className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
          <MotionChild>
            <DirCard dir="Forward (training)" note="take real photos; add a little Gaussian noise, 1,000 times, until pure static. At every step, the network learns to predict the noise it sees — trained on data you already have" />
          </MotionChild>
          <MotionChild>
            <DirCard dir="Reverse (generation)" note="start from pure static; the network removes its predicted noise, step after step, until an image condenses. Nothing → something, by learned degrees" accent />
          </MotionChild>
        </Stagger>
      </Scene>

      {/* Beat 2 — why diffusion beat GANs */}
      <Scene caption="② Why this won over GANs">
        <Stagger className="space-y-2">
          <MotionChild>
            <WhyRow claim="Stable training" note="a GAN's generator and discriminator fight; the equilibrium collapses regularly. Diffusion is supervised regression on noise — no adversarial knife-fight" />
          </MotionChild>
          <MotionChild>
            <WhyRow claim="Coverage, not mode collapse" note="GANs drift to their best few outputs and drop the rest; diffusion's per-step denoising covers the whole distribution" accent />
          </MotionChild>
          <MotionChild>
            <WhyRow claim="One model, every concept" note="condition the denoising on text embeddings and one trained model paints anything the prompt describes" />
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-[11px] font-medium text-ink-soft sm:text-xs">
          The price: <span className="font-mono font-bold text-brand-deep">20–50 network calls per image</span>{" "}
          (GANs: 1) — the latency story of every image product since.
        </p>
      </Scene>

      {/* Beat 3 — guidance */}
      <Scene caption="③ Classifier-free guidance: the creativity dial">
        <Stagger className="space-y-2">
          <MotionChild>
            <GuideRow setting="guidance ≈ 1" result="dreamy, loose, diverse" note="mostly follows its own drift — surprises, but ignores half the prompt" />
          </MotionChild>
          <MotionChild>
            <GuideRow setting="guidance ≈ 7" result="prompt-true, vivid" note="the sweet spot most products ship: denoising steers hard toward the text condition" accent />
          </MotionChild>
          <MotionChild>
            <GuideRow setting="guidance ≈ 20" result="overcooked, brittle" note="over-follows: saturated, warped hands, literalism — the dial has a cliff" />
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-[11px] font-medium text-ink-soft sm:text-xs">
          The trick: run denoising <em>with and without</em> the prompt, and extrapolate away from the
          unconditional drift. One number sets how hard.
        </p>
      </Scene>

      {/* Beat 4 — the frontier */}
      <Scene caption="④ 2026: diffusion goes to language">
        <Reveal>
          <div className="rounded-xl border border-brand bg-brand-wash px-4 py-4 text-center shadow-sm">
            <p className="text-[12px] font-medium leading-relaxed text-ink sm:text-sm">
              LLMs generate tokens <span className="font-bold">left to right, one at a time</span> — a
              1,000-token answer is 1,000 sequential steps. Diffusion LLMs (LLaDA, Mercury-class)
              denoise <span className="font-bold">the whole draft in parallel</span>: rough answer first,
              refined in a handful of sweeps — trading the autoregressive latency tax for iterative
              revision. Early, imperfect, and the most watched architecture bet of the year.
            </p>
          </div>
        </Reveal>
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The rule</CardTitle>
        <Takeaway>
          Diffusion = <strong>learned denoising run in reverse</strong> — a boring supervised objective that
          turned out to be the stable, cover-everything generator. The same reversal is now
          challenging sequential text generation itself.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

/** The through-line: the same leaf at noise levels 0 / 0.35 / 0.7 / 1. */
function NoiseLadder() {
  return (
    <div className="grid grid-cols-4 gap-2">
      {[
        { label: "photo", op: 0 },
        { label: "+ noise", op: 0.35 },
        { label: "more noise", op: 0.7 },
        { label: "pure static", op: 1 },
      ].map((step, i) => (
        <div key={step.label} className="rounded-xl border border-ash bg-surface-elevated p-2 text-center shadow-sm">
          <svg viewBox="0 0 40 40" className="h-auto w-full" aria-hidden="true">
            <rect x="4" y="4" width="32" height="32" rx="3" fill="var(--color-brand-wash)" stroke="var(--color-ash)" strokeWidth="0.8" />
            {i === 0 && <path d="M12 28 Q20 12 28 28 Z" fill="var(--color-brand)" />}
            {i === 1 && (
              <>
                <path d="M12 28 Q20 12 28 28 Z" fill="var(--color-brand)" opacity="0.65" />
                {[[10, 12], [28, 14], [20, 8], [32, 26], [8, 24]].map(([x, y], j) => (
                  <circle key={j} cx={x} cy={y} r="1.4" fill="var(--color-ink-faint)" />
                ))}
              </>
            )}
            {i === 2 && (
              <>
                <path d="M12 28 Q20 12 28 28 Z" fill="var(--color-brand)" opacity="0.3" />
                {Array.from({ length: 24 }, (_, j) => (
                  <circle key={j} cx={5 + (j * 7.3) % 30} cy={5 + (j * 11.7) % 31} r="1.3" fill="var(--color-ink-faint)" opacity="0.8" />
                ))}
              </>
            )}
            {i === 3 &&
              Array.from({ length: 48 }, (_, j) => (
                <circle key={j} cx={5 + (j * 7.3) % 31} cy={5 + (j * 5.9) % 31} r="1.4" fill="var(--color-ink-faint)" opacity="0.6 + ((j * 13) % 4) * 0.1" />
              ))}
          </svg>
          <div className="mt-1 font-mono text-[9px] font-bold text-ink-soft">{step.label}</div>
          {i < 3 && null}
        </div>
      ))}
    </div>
  );
}

function DirCard({ dir, note, accent = false }: { dir: string; note: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl border p-3 shadow-sm ${accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"}`}>
      <div className="text-[11px] font-bold text-ink">{dir}</div>
      <p className="mt-0.5 text-[10.5px] font-medium leading-relaxed text-ink-soft">{note}</p>
    </div>
  );
}

function WhyRow({ claim, note, accent = false }: { claim: string; note: string; accent?: boolean }) {
  return (
    <div className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 shadow-sm ${accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"}`}>
      <span className="w-36 shrink-0 text-[11px] font-bold text-ink">{claim}</span>
      <p className="min-w-0 flex-1 text-[10.5px] font-medium leading-relaxed text-ink-soft">{note}</p>
    </div>
  );
}

function GuideRow({ setting, result, note, accent = false }: { setting: string; result: string; note: string; accent?: boolean }) {
  return (
    <div className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 shadow-sm ${accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"}`}>
      <span className="w-24 shrink-0 font-mono text-[10px] font-bold text-ink">{setting}</span>
      <div className="min-w-0 flex-1">
        <div className="text-[11px] font-bold text-brand-deep">{result}</div>
        <p className="text-[10px] font-medium leading-relaxed text-ink-soft">{note}</p>
      </div>
    </div>
  );
}
