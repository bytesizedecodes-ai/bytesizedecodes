import { Infographic, InfographicHeader, Card } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Fine-Tuning in Practice — Lesson 11: "A small, honest eval".
 * The rubric, the before/after table, and the per-item gate — plus the
 * judge's audit loop.
 */
export function ASmallHonestEval() {
  return (
    <Infographic>
      <InfographicHeader
        title="A small, honest eval"
        subtitle="40 questions, three binary rubric items, one non-negotiable gate"
      />

      {/* SCENE 1 — the rubric */}
      <Scene caption="① Three binary items — mood-proof by design">
        <Stagger className="mx-auto max-w-md space-y-2">
          {[
            { i: "house tone", c: "sounds like the brand — yes/no" },
            { i: "receipt parses", c: "strict JSON or it doesn't" },
            { i: "refused + routed", c: "dosage ask → pharmacist, politely" },
          ].map((x) => (
            <MotionChild key={x.i}>
              <div className="flex items-center justify-between gap-3 rounded-xl border border-ash bg-surface-elevated px-4 py-2.5 shadow-sm">
                <p className="text-xs font-bold text-ink">{x.i}</p>
                <p className="text-[11px] font-medium text-ink-soft">{x.c}</p>
              </div>
            </MotionChild>
          ))}
        </Stagger>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          No 1–5 vibes: two humans score ten replies together and argue until the wording settles disagreements.
        </p>
      </Scene>

      {/* SCENE 2 — the before/after table */}
      <Scene caption="② The one screen that ends arguments">
        <div className="mx-auto max-w-md overflow-hidden rounded-xl border border-ash shadow-sm">
          <div className="grid grid-cols-3 bg-ash px-4 py-2 text-[10px] font-bold uppercase tracking-wide text-ink">
            <span>rubric item</span>
            <span className="text-center">before</span>
            <span className="text-center">after</span>
          </div>
          {[
            ["house tone", "11/40", "34/40"],
            ["receipt parses", "17/40", "38/40"],
            ["refused + routed", "31/40", "39/40"],
          ].map(([k, b, a]) => (
            <div key={k} className="grid grid-cols-3 border-t border-ash bg-surface-elevated px-4 py-2.5">
              <span className="text-xs font-semibold text-ink">{k}</span>
              <span className="text-center font-mono text-xs text-ink-soft">{b}</span>
              <span className="text-center font-mono text-xs font-bold text-brand-deep">{a}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          The refusal row is the point: the incumbent was already decent — the tune&apos;s job was to{" "}
          <span className="font-bold">not break it</span>.
        </p>
      </Scene>

      {/* SCENE 3 — the gate */}
      <Scene caption="③ The gate is per-item, not totals">
        <div className="mx-auto max-w-md space-y-2">
          <MotionChild>
            <div className="rounded-xl border border-bad bg-bad-wash px-4 py-2.5 shadow-sm">
              <p className="text-xs font-bold text-ink">REJECTED SHIP · tone 40/40, receipts 39/40, refusals 24/40</p>
              <p className="mt-0.5 text-[11px] font-medium text-ink-soft">
                totals up, one row down 40% — a worse product that &ldquo;better on average&rdquo; would wave through
              </p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-brand bg-brand-wash px-4 py-2.5">
              <p className="text-xs font-bold text-ink">THE RULE · ship only if total ↑ AND no rubric item regresses</p>
            </div>
          </MotionChild>
        </div>
      </Scene>

      {/* SCENE 4 — the judge and its audit */}
      <Scene caption="④ Scale carefully: judge the judgment item only">
        <div className="mx-auto flex max-w-lg flex-col items-center gap-2 text-center sm:flex-row sm:gap-4">
          <div className="rounded-xl border border-ash bg-surface-elevated px-4 py-3 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">mechanical</p>
            <p className="mt-0.5 text-xs font-semibold text-ink">receipt parse · refusal route</p>
            <p className="text-[10px] font-medium text-ink-soft">string checks — no judgment</p>
          </div>
          <div className="rounded-xl border border-brand bg-brand-wash px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">judged</p>
            <p className="mt-0.5 text-xs font-semibold text-ink">tone only — LLM-as-judge</p>
            <p className="text-[10px] font-medium text-ink-soft">audited monthly vs the human ten</p>
          </div>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Judges carry position/verbosity biases and drift with their own updates — a judge that drifts silently changes
          the gate.
        </p>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          Mechanical where possible, judged where necessary,{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">audited always</span> — and
          the gate is per-item.
        </p>
      </Card>
    </Infographic>
  );
}
