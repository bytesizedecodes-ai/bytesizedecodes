import { Infographic, InfographicHeader, Card, CodePanel } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Fine-Tuning in Practice — Lesson 12: "Template skew". The invisible bug:
 * two renders side by side, the contract test, and the symptom fingerprint.
 */
export function TemplateSkew() {
  return (
    <Infographic>
      <InfographicHeader
        title="Template skew: the invisible bug"
        subtitle="Degradation without errors — the rehearsal script isn't the performance script"
      />

      {/* SCENE 1 — the diff */}
      <Scene caption="① Two renders of the same conversation — find the difference">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <CodePanel
            label="training render"
            caption="what the model rehearsed"
            code={`<|system|>
You are Sahayak…
<|user|>
order status pls
<|assistant|>`}
          />
          <CodePanel
            label="serving render (the bug)"
            caption="what the gateway prints — one fence moved"
            code={`<|system|>
You are Sahayak…
<|user|> order status pls
<|assistant|>`}
            accent
          />
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          A moved fence and a lost newline. Nothing crashes — every trained pattern just fires with less confidence.
        </p>
      </Scene>

      {/* SCENE 2 — the symptom fingerprint */}
      <Scene caption="② The fingerprint you'll meet in production">
        <Stagger className="mx-auto max-w-md space-y-2">
          {[
            "replies that begin mid-sentence",
            "replies that continue the customer's message",
            "formats that half-apply — JSON with chatty preambles",
            "health checks green, quality scores quietly sliding",
          ].map((s) => (
            <MotionChild key={s}>
              <div className="rounded-xl border border-ash bg-surface-elevated px-4 py-2.5 text-center text-xs font-medium text-ink shadow-sm">
                {s}
              </div>
            </MotionChild>
          ))}
        </Stagger>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Classic trigger: a gateway library upgraded &ldquo;for an unrelated fix&rdquo; — templates ship inside
          libraries.
        </p>
      </Scene>

      {/* SCENE 3 — the contract test */}
      <Scene caption="③ The fix is one test, run in CI forever">
        <CodePanel
          label="the byte-equality contract"
          caption="one fixed message, two paths, one assertion"
          code={`train_txt = train_path.render(FIXED_MSG)
serve_txt = serve_path.render(FIXED_MSG)
assert train_txt == serve_txt  # byte equality, no mercy`}
          accent
        />
        <p className="mt-3 text-center text-xs font-medium text-ink">
          After that, two honest fixes exist: align serving to the trained template (a config change), or re-render the
          pack and retrain deliberately.
        </p>
      </Scene>

      {/* SCENE 4 — the boundary */}
      <Scene caption="④ What NOT to do">
        <div className="mx-auto max-w-md rounded-xl border border-bad bg-bad-wash p-4 text-center">
          <p className="text-xs font-semibold text-ink">
            Don&apos;t reflexively retrain &ldquo;to the new format&rdquo; on a hunch — a second tune on top of
            un-diagnosed skew bakes the confusion deeper and burns the first run&apos;s evidence.
          </p>
          <p className="mt-1.5 text-[11px] font-medium text-ink-soft">Diff first. The diff decides which of the two honest fixes applies.</p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          The model conditions on exact bytes —{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">rehearse and perform the
          same script</span>, proven by a CI assertion.
        </p>
      </Card>
    </Infographic>
  );
}
