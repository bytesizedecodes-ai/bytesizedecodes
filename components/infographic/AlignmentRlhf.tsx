import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild, Reveal } from "./motion";

/**
 * Advanced Machine Learning — Lesson 9: "Teaching taste".
 * Reward models, the RLHF loop, DPO — and what alignment can't fix:
 * reward hacking and sycophancy as the standing failure modes.
 */
export function AlignmentRlhf() {
  return (
    <Infographic>
      <InfographicHeader
        title="Teaching taste"
        subtitle="Mango Labs, week 8: the model is fluent — and subtly wrong for farmers"
      />

      {/* Beat 1 — the problem */}
      <Scene caption="① Pretraining optimizes the wrong thing for products">
        <Reveal>
          <div className="rounded-xl border border-[var(--color-bad)] bg-surface-elevated p-4 shadow-sm">
            <p className="font-mono text-[11.5px] font-semibold text-ink">
              farmer: “my orchard is next to a river — what should I spray?”
            </p>
            <p className="mt-2 text-[11.5px] font-medium leading-relaxed text-[var(--color-bad)]">
              Base-model replies: confident, encyclopedic, three chemical regimens with dosages —
              no hesitation about runoff, no asking what stage the crop is.{" "}
              <span className="font-bold">Fluent ≠ aligned.</span> Next-token loss has no term for
              “appropriate for this farmer, here, now”.
            </p>
          </div>
        </Reveal>
      </Scene>

      {/* Beat 2 — the reward model */}
      <Scene caption="② Step 1: learn preferences from pairs">
        <Stagger className="space-y-2">
          <MotionChild>
            <PairRow left="Answer A: full regimen, confident, no caveats" right="Answer B: asks stage, warns on runoff near water, hedges dosages" winner="B" />
          </MotionChild>
          <MotionChild>
            <PairRow left="Answer A: 900-word essay with history of fungicides" right="Answer B: 4 steps, dosages per tree, one caution" winner="B" />
          </MotionChild>
          <MotionChild>
            <PairRow left="Answer A: refuses to help, cites legal caution" right="Answer B: helps with safe bounds, explains the refusal edge" winner="B" />
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-[11px] font-medium text-ink-soft sm:text-xs">
          Thousands of pairs → a <span className="font-bold text-brand-deep">reward model</span>: a learned
          scorer of “which response humans here prefer”. The preferences are the product decisions.
        </p>
      </Scene>

      {/* Beat 3 — RLHF vs DPO */}
      <Scene caption="③ Step 2: optimize against the scorer — two roads">
        <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
              <div className="text-xs font-bold text-brand">RLHF · the classic loop</div>
              <p className="mt-1 text-[11px] font-medium leading-relaxed text-ink-soft">
                The policy generates; the reward model scores; RL (PPO) nudges generation toward
                higher reward. Powerful, finicky — reward hacking, training instability,
                four models in memory at once.
              </p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
              <div className="text-xs font-bold text-brand">DPO · the shortcut</div>
              <p className="mt-1 text-[11px] font-medium leading-relaxed text-ink-soft">
                Skip RL: a closed-form loss that raises the log-odds of the preferred answer over the
                rejected one, directly on pairs. Simpler, stabler, one model — the 2024+ default for
                teams without an RL research group.
              </p>
            </div>
          </MotionChild>
        </Stagger>
      </Scene>

      {/* Beat 4 — what alignment does not fix */}
      <Scene caption="④ The standing failure modes (why evals never end)">
        <Stagger className="space-y-2">
          <MotionChild>
            <FailRow name="Reward hacking" note="the policy maximizes the scorer, not the intent: verbosity inflates its reward → 900-word answers return. Goodhart, every time" />
          </MotionChild>
          <MotionChild>
            <FailRow name="Sycophancy" note="prefer-friendly annotators teach 'agree with the user' — the model validates a wrong plan instead of correcting it" accent />
          </MotionChild>
          <MotionChild>
            <FailRow name="No new facts" note="alignment shapes behavior, not knowledge: a tuned model still invents pesticide dosages with perfect manners" />
          </MotionChild>
        </Stagger>
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The rule</CardTitle>
        <Takeaway>
          Alignment installs <strong>learned preferences</strong> — pairs → reward model → RLHF or DPO —
          and it shapes <em>behavior</em>, never truth. Watch the objective you actually optimized:
          the model will find its cracks.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

function PairRow({ left, right, winner }: { left: string; right: string; winner: string }) {
  return (
    <div className="rounded-xl border border-ash bg-surface-elevated px-4 py-2.5 shadow-sm">
      <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 sm:gap-2">
        <div className={`rounded-lg border px-2.5 py-1.5 ${winner === "A" ? "border-good bg-good-wash" : "border-ash"}`}>
          <span className="font-mono text-[9px] font-bold text-ink-soft">A</span>
          <p className="text-[10px] font-medium leading-relaxed text-ink-soft">{left}</p>
        </div>
        <div className={`rounded-lg border px-2.5 py-1.5 ${winner === "B" ? "border-good bg-good-wash" : "border-ash"}`}>
          <span className="font-mono text-[9px] font-bold text-ink-soft">B ✓ preferred</span>
          <p className="text-[10px] font-medium leading-relaxed text-ink-soft">{right}</p>
        </div>
      </div>
    </div>
  );
}

function FailRow({ name, note, accent = false }: { name: string; note: string; accent?: boolean }) {
  return (
    <div className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 shadow-sm ${accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"}`}>
      <span className="w-28 shrink-0 text-[11px] font-bold text-ink">{name}</span>
      <p className="min-w-0 flex-1 text-[10.5px] font-medium leading-relaxed text-ink-soft">{note}</p>
    </div>
  );
}
