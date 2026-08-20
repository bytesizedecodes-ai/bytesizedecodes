import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild, Reveal } from "./motion";

/**
 * Harness Engineering: At Scale — Lesson 3: "Evals as a System".
 *
 * Course case: a prompt change reads as 51% → 53% on 200 tasks — real signal
 * or judge noise? The pipeline scene (CI suite → canary → online evals, with
 * incidents feeding back as tasks) plus the significance beat: overlapping
 * noise bands on the two rates. Expert register; restrained palette; brand
 * accent on the gate.
 */
export function EvalsAsASystem() {
  return (
    <Infographic>
      <InfographicHeader
        title="51% → 53%: ship it?"
        subtitle="A harness-change pipeline answers with evidence — CI gates, canaries, and honest statistics."
      />

      {/* Beat 1 — the pipeline */}
      <Scene caption="① The change pipeline every harness edit travels">
        <Stagger className="flex flex-col gap-2">
          <MotionChild>
            <Stage n={1} label="CI: full suite" detail="400 tasks, every prompt/model/tool diff — fail = no deploy" accent />
          </MotionChild>
          <MotionChild>
            <Stage n={2} label="Canary: 5% of traffic" detail="shadow-run the new harness; online evals sample real requests" />
          </MotionChild>
          <MotionChild>
            <Stage n={3} label="Online evals: sampled + judged" detail="1% of production scored nightly — drift caught in days, not quarters" />
          </MotionChild>
          <MotionChild>
            <Stage n={4} label="Feedback: incidents become tasks" detail="every escaped failure is added to the suite — the same bug ships once" />
          </MotionChild>
        </Stagger>
      </Scene>

      {/* Beat 2 — the significance check */}
      <Scene caption="② The 51% → 53% read honestly">
        <Reveal>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wide text-ink-soft">
                200 tasks · binomial noise
              </div>
              <p className="mt-2 font-mono text-[12px] leading-relaxed text-ink">
                v1: 102/200 = 51% ± ~7%
                <br />
                v2: 106/200 = 53% ± ~7%
              </p>
              <p className="mt-2 text-[11px] font-medium leading-relaxed text-ink-soft">
                The intervals overlap almost entirely — the &ldquo;gain&rdquo; is inside the
                noise floor. Verdict: <span className="font-bold text-ink">no ship decision yet</span>.
              </p>
            </div>
            <div className="rounded-xl border border-brand bg-brand-wash p-4 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wide text-brand">
                What a real signal looks like
              </div>
              <p className="mt-2 text-[11px] font-medium leading-relaxed text-ink">
                Either grow the task set until the intervals separate, or canary it and read
                the <span className="font-bold">online</span> sample — thousands of real
                requests shrink the noise band. A diff you can&apos;t defend with n is an
                opinion.
              </p>
            </div>
          </div>
        </Reveal>
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The rule</CardTitle>
        <Takeaway>
          The suite gates, the canary tests reality, online evals catch drift — and no change
          ships on a difference smaller than its noise.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

/** One stage of the eval pipeline. */
function Stage({
  n,
  label,
  detail,
  accent = false,
}: {
  n: number;
  label: string;
  detail: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border px-4 py-3 shadow-sm ${
        accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"
      }`}
    >
      <span
        aria-hidden="true"
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-[11px] font-bold text-canvas"
      >
        {n}
      </span>
      <div className="min-w-0">
        <div className="text-xs font-bold text-ink sm:text-[13px]">{label}</div>
        <p className="mt-0.5 text-[10.5px] font-medium leading-relaxed text-ink-soft">{detail}</p>
      </div>
    </div>
  );
}
