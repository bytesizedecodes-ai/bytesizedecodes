import { Infographic, InfographicHeader, Card } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Fine-Tuning in Practice — Lesson 4: "Curating the 800-pair pack".
 * The curation pipeline as one flow the learner can re-draw: sources →
 * anonymize → dedup → decontaminate → mix → the pack + the drawer.
 */
export function CuratingTheDataset() {
  return (
    <Infographic>
      <InfographicHeader
        title="Curating the 800-pair pack"
        subtitle="Three poisons, three passes — and a drawer the pack never touches"
      />

      {/* SCENE 1 — poison 1: duplicates */}
      <Scene caption="① Poison 1 — 40 near-identical asks teach frequency, not behavior">
        <div className="mx-auto max-w-md space-y-1.5">
          {[
            "is crocin available",
            "is crocin available?",
            "crocin available??",
            "…× 37 more cosmetic variants",
          ].map((q, i) => (
            <div
              key={q}
              className={`rounded-lg px-3 py-1.5 font-mono text-[11px] ${
                i < 3 ? "border border-ash bg-surface-elevated text-ink-soft" : "text-ink-faint"
              }`}
            >
              {q}
            </div>
          ))}
          <div className="rounded-lg border border-brand bg-brand-wash px-3 py-1.5 font-mono text-[11px] font-bold text-brand-deep">
            → collapse to 3 honest phrasings
          </div>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          The most-repeated reply shape would dominate everything — the pack drops 3,200 → 1,100 before curation starts.
        </p>
      </Scene>

      {/* SCENE 2 — poison 2: contamination */}
      <Scene caption="② Poison 2 — the exam leaking into practice">
        <div className="mx-auto flex max-w-lg flex-col items-center gap-3 sm:flex-row sm:gap-5">
          <div className="rounded-xl border border-ash bg-surface-elevated px-4 py-3 text-center shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">eval drawer</p>
            <p className="mt-1 font-mono text-[11px] text-ink">“can i take 2 crocin at once”</p>
          </div>
          <span className="text-lg font-bold text-bad">≈</span>
          <div className="rounded-xl border border-ash bg-surface-elevated px-4 py-3 text-center shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">pack (leaked!)</p>
            <p className="mt-1 font-mono text-[11px] text-ink">“can i take two crocin together”</p>
          </div>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Near-twins make the eval grade memory — the only dataset bug that makes you{" "}
          <span className="font-bold">feel more confident as your evidence gets worse</span>.
        </p>
      </Scene>

      {/* SCENE 3 — the pipeline */}
      <Scene caption="③ The curation flow, end to end">
        <Stagger className="mx-auto max-w-md space-y-2">
          {[
            "raw sources — logs + rewrites + synthetic",
            "anonymize — names, phones, prescriptions",
            "dedup + near-dup collapse",
            "decontaminate vs the drawer",
            "mix ~20% general chat",
            "→ the 800-pair pack (drawer untouched)",
          ].map((step, i) => (
            <MotionChild key={step}>
              <div
                className={`rounded-xl px-4 py-2.5 text-center ${
                  i === 5 ? "border border-brand bg-brand-wash font-semibold text-ink" : "border border-ash bg-surface-elevated text-xs font-medium text-ink shadow-sm"
                }`}
              >
                {step}
              </div>
            </MotionChild>
          ))}
        </Stagger>
      </Scene>

      {/* SCENE 4 — the final mix */}
      <Scene caption="④ The final artifact: 640 + 160, and the drawer beside it">
        <div className="mx-auto max-w-md">
          <div className="flex h-8 overflow-hidden rounded-full border border-ash text-[10px] font-bold">
            <div className="flex flex-[4] items-center justify-center bg-brand-wash text-ink">640 task pairs</div>
            <div className="flex flex-[1] items-center justify-center bg-brand text-canvas">160 chat</div>
          </div>
          <div className="mt-3 rounded-xl border border-ash bg-surface-elevated px-4 py-2.5 text-center shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">in the repo, never in the pack</p>
            <p className="text-xs font-semibold text-ink">the 40-question drawer — fresh-phrased, leak-checked before every run</p>
          </div>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          Dedup teaches pattern, decontamination keeps the eval honest,{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">the mix keeps skills alive</span>.
        </p>
      </Card>
    </Infographic>
  );
}
