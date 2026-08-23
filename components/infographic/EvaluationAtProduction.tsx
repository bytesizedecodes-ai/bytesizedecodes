import { Infographic, InfographicHeader, Card } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Fine-Tuning at Scale — Lesson 8: "Evaluation at production level".
 * Separation of powers, the four signal classes with rotation, and the
 * online layer as the boundary sensor.
 */
export function EvaluationAtProduction() {
  return (
    <Infographic>
      <InfographicHeader
        title="Evaluation at production level"
        subtitle="An observability system whose traces happen to be graded — with separation of powers"
      />

      {/* SCENE 1 — separation of powers */}
      <Scene caption="① Every wall exists because its absence has a named failure">
        <Stagger className="mx-auto max-w-2xl space-y-2">
          {[
            { w: "suite authors ≠ model trainers", f: "contamination — suite questions drifting into packs" },
            { w: "judges ≠ their own calibration", f: "self-preference — the human panel anchors, monthly" },
            { w: "dashboards read in review", f: "model-owner bias interpreting their own alarms" },
          ].map((x) => (
            <MotionChild key={x.w}>
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-ash bg-surface-elevated px-4 py-2.5 shadow-sm">
                <p className="font-mono text-[11px] font-bold text-ink">{x.w}</p>
                <p className="text-[10px] font-medium text-ink-soft">prevents: {x.f}</p>
              </div>
            </MotionChild>
          ))}
        </Stagger>
      </Scene>

      {/* SCENE 2 — four signal classes */}
      <Scene caption="② Four signal classes — no single class sees enough">
        <div className="mx-auto grid max-w-2xl grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          {[
            { k: "behavior rubrics", d: "register/tone · judged + calibrated", r: "quarterly phrasing refresh" },
            { k: "knowledge probes", d: "what CPT bought", r: "rotated from teller escalations" },
            { k: "safety boundaries", d: "red-team set", r: "hard pass bars" },
            { k: "format compliance", d: "parse + schema checks", r: "zero judgment, fully mechanical" },
          ].map((x) => (
            <MotionChild key={x.k}>
              <div className="h-full rounded-xl border border-ash bg-surface-elevated p-3 text-center shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">{x.k}</p>
                <p className="mt-1 text-[10px] font-semibold text-ink">{x.d}</p>
                <p className="mt-0.5 text-[9px] font-medium text-ink-soft">{x.r}</p>
              </div>
            </MotionChild>
          ))}
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Rotation IS the contamination defense — a static knowledge suite memorizes within a few training cycles.
        </p>
      </Scene>

      {/* SCENE 3 — the online layer */}
      <Scene caption="③ Online: the boundary sensor with alarm discipline">
        <div className="mx-auto max-w-md space-y-2">
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated px-4 py-2.5 shadow-sm">
              <p className="text-[11px] font-semibold text-ink">offline answers: &ldquo;is the model the suite describes?&rdquo;</p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated px-4 py-2.5 shadow-sm">
              <p className="text-[11px] font-semibold text-ink">online answers: &ldquo;is the suite describing production?&rdquo;</p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-brand bg-brand-wash px-4 py-2.5">
              <p className="text-[11px] font-bold text-ink">
                offline green + online red = suite staleness — sample the shifted class, extend, re-baseline
              </p>
              <p className="mt-0.5 text-[10px] font-medium text-ink-soft">
                muting the alarm because &ldquo;the suite passes&rdquo; is the audited-environment finding
              </p>
            </div>
          </MotionChild>
        </div>
      </Scene>

      {/* SCENE 4 — the boundary */}
      <Scene caption="④ BOUNDARY — the suite approximates production's distribution">
        <div className="mx-auto max-w-md rounded-xl border border-brand bg-brand-wash p-4 text-center">
          <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">the assumption</p>
          <p className="mt-1 text-xs font-semibold text-ink">
            Offline validity is distribution-relative: product shifts (a new query class, a festival traffic mix) leave
            suites green while quality moves.
          </p>
          <p className="mt-1.5 text-[11px] font-medium text-ink-soft">
            The online layer exists precisely as that boundary&apos;s sensor — designed to fire, not to be dismissed.
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          Versioned suites, calibrated judges, sampled human loops,{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">wired online alarms</span> —
          each layer covering the blind spot above it.
        </p>
      </Card>
    </Infographic>
  );
}
