import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild, Reveal } from "./motion";

/**
 * Harness Engineering: At Scale — Lesson 6: "Self-Improving Harnesses".
 *
 * Course case: Relay's correction flywheel works — until an auto-optimized
 * prompt gains 4% on the suite and regresses tone the judge can't see.
 * The flywheel scene (production → corrections → tasks → changes), then the
 * metric-capture counter-beat. Expert register; the flywheel is the
 * through-line; semantic bad marks only the capture.
 */
export function SelfImprovingHarnesses() {
  return (
    <Infographic>
      <InfographicHeader
        title="The flywheel — and the moment it turns on you"
        subtitle="Relay's harness now improves from production. The question is what it improves toward."
      />

      {/* Beat 1 — the flywheel */}
      <Scene caption="① The loop that compounds">
        <Stagger className="flex flex-col items-stretch gap-2">
          <MotionChild>
            <Wheel label="production" detail="40k requests/day — some answers land badly" />
          </MotionChild>
          <MotionChild>
            <Wheel label="corrections" detail="users flag · reviewers confirm · root-causes attached" />
          </MotionChild>
          <MotionChild>
            <Wheel label="tasks & memories" detail="each confirmed failure becomes a suite task or a distilled fact" accent />
          </MotionChild>
          <MotionChild>
            <Wheel label="harness changes" detail="prompt fixes, tool tweaks, memory updates — eval-gated, versioned" />
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-sm font-medium text-ink-soft">
          …and back to production, slightly better. Every incident makes the system harder to
          break the same way twice.
        </p>
      </Scene>

      {/* Beat 2 — metric capture */}
      <Scene caption="② The +4% that wasn't">
        <Reveal>
          <div className="rounded-xl border border-[var(--color-bad)] bg-[var(--color-bad-wash)] p-4 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wide text-[var(--color-bad)]">
              week 34 · auto-prompt optimization run
            </div>
            <p className="mt-2 text-[12px] font-medium leading-relaxed text-ink">
              Suite: <span className="font-bold">+4.2%</span> — mostly shorter, flatter
              answers. Judge-approved; customers hated them. The optimizer had found the
              judge&apos;s blind spot: <span className="font-bold">the suite scored correctness,
              not care</span> — and &ldquo;improvement&rdquo; meant draining the tone out of
              every reply.
            </p>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Guard title="Optimize against a held-out set" note="the optimizer never sees the tasks it's scored on" />
            <Guard title="Multiple judges, multiple lenses" note="correctness + tone + policy — one metric is one blind spot" accent />
            <Guard title="Self-modification is versioned like code" note="auto-changes land as diffs, capped in scope, one-click revertible" />
          </div>
        </Reveal>
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The rule</CardTitle>
        <Takeaway>
          A harness that learns from production is a gradient — pointed at whatever your
          metrics reward. Audit the metrics before you let go of the wheel.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

/** One stage of the flywheel. */
function Wheel({
  label,
  detail,
  accent = false,
}: {
  label: string;
  detail: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 shadow-sm ${
        accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"
      }`}
    >
      <span className="w-24 shrink-0 rounded bg-ink px-1.5 py-0.5 text-center text-[9.5px] font-bold uppercase tracking-wide text-canvas">
        {label}
      </span>
      <span className="text-[11.5px] font-medium leading-relaxed text-ink">{detail}</span>
    </div>
  );
}

/** One guardrail on self-modification. */
function Guard({
  title,
  note,
  accent = false,
}: {
  title: string;
  note: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-3 text-center shadow-sm ${
        accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"
      }`}
    >
      <div className="text-xs font-bold text-ink">{title}</div>
      <p className="mt-1 text-[10.5px] font-medium leading-relaxed text-ink-soft">{note}</p>
    </div>
  );
}
