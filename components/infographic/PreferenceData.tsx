import { Infographic, InfographicHeader, Card } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Fine-Tuning at Scale — Lesson 4: "Preference data construction".
 * The instrument view: pairs ARE the objective; margin structure; judge
 * audits — with the confounder boundary.
 */
export function PreferenceData() {
  return (
    <Infographic>
      <InfographicHeader
        title="Preference data construction"
        subtitle="Pairs are a measurement instrument — its biases train directly into the model"
      />

      {/* SCENE 1 — the instrument claim */}
      <Scene caption="① The loss amplifies whatever the pairs encode">
        <div className="mx-auto max-w-md rounded-xl border border-brand bg-brand-wash p-4 text-center">
          <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">the uncomfortable truth</p>
          <p className="mt-1.5 text-xs font-semibold text-ink">
            DPO cannot distinguish a true preference from a measurement error — both are &ldquo;preferences&rdquo; by the
            time training sees them.
          </p>
          <p className="mt-1.5 text-[11px] font-medium text-ink-soft">
            Whoever designs the flights decides what &ldquo;better&rdquo; means. Construction discipline IS objective
            design.
          </p>
        </div>
      </Scene>

      {/* SCENE 2 — margin structure */}
      <Scene caption="② Margins: the gap carries the signal">
        <div className="mx-auto max-w-lg space-y-2">
          <MotionChild>
            <div className="flex items-center justify-between gap-3 rounded-xl border border-ash bg-surface-elevated px-4 py-2.5 shadow-sm">
              <p className="text-[11px] font-semibold text-ink">gap ≈ 1.0 — one side garbage</p>
              <p className="text-[10px] font-medium text-ink-soft">teaches nothing: model already separates</p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="flex items-center justify-between gap-3 rounded-xl border border-brand bg-brand-wash px-4 py-2.5">
              <p className="text-[11px] font-semibold text-ink">gap 0.1–0.3 — tight, rubric-real</p>
              <p className="text-[10px] font-medium text-ink-soft">carries the signal — target ≥ 70% of pairs</p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="flex items-center justify-between gap-3 rounded-xl border border-ash bg-surface-elevated px-4 py-2.5 shadow-sm">
              <p className="text-[11px] font-semibold text-ink">inverted — chosen scored below rejected</p>
              <p className="text-[10px] font-medium text-ink-soft">measurement noise, trains backward — target ≈ 0</p>
            </div>
          </MotionChild>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Sample rejections from the CURRENT model — the margin sits exactly where its live failure surface is.
        </p>
      </Scene>

      {/* SCENE 3 — protocol + judge audit */}
      <Scene caption="③ Varta's protocol, and the judge's monthly physical">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <div className="rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wide text-ink-soft">pair protocol</div>
            <ul className="mt-1.5 space-y-1 text-[11px] font-medium text-ink">
              <li>✦ two bilingual reviewers, rubric-anchored scores</li>
              <li>✦ disagreements escalate — never average</li>
              <li>✦ length-matched flights (length wins ~55–60% all else equal)</li>
              <li>✦ escalation log = rubric-ambiguity detector</li>
            </ul>
          </div>
          <div className="rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wide text-ink-soft">judge audit (monthly)</div>
            <ul className="mt-1.5 space-y-1 text-[11px] font-medium text-ink">
              <li>✦ order-swap consistency &gt; threshold</li>
              <li>✦ agreement vs fixed 100-pair human panel</li>
              <li>✦ position + length bias per batch</li>
              <li>✦ a drifting judge silently rewrites the objective</li>
            </ul>
          </div>
        </div>
      </Scene>

      {/* SCENE 4 — the confounder boundary */}
      <Scene caption="④ BOUNDARY — crowd preference is a confounder, not a rubric">
        <div className="mx-auto max-w-md rounded-xl border border-brand bg-brand-wash p-4 text-center">
          <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">the case on record</p>
          <p className="mt-1 text-xs font-semibold text-ink">
            Upvote-built pairs → sycophantic model: crowds prefer agreeable-but-wrong over correct-but-firm, and the
            loss optimized agreeability — faithfully.
          </p>
          <p className="mt-1.5 text-[11px] font-medium text-ink-soft">
            Repair: correctness gates the chosen side BEFORE any preference is recorded. Decide what
            &ldquo;better&rdquo; means, then measure it.
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          The objective can&apos;t tell a bad measurement from a true preference —{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">audit the instrument</span>.
        </p>
      </Card>
    </Infographic>
  );
}
