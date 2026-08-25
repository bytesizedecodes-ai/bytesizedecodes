import { Infographic, InfographicHeader, Card } from "./primitives";
import { MachineFigure, Scene, StoryMap, SpeechBubble } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Fine-Tuning Foundations — Lesson 11: "Raw graduate vs assistant school"
 * (v2 Thread retrofit).
 *
 * Through-line stage: the twin — the same machine all lesson; the states are
 * what it does with text. The raw twin continues (France, then Kavya's order
 * status answered with three more questions); assistant school's Q→A
 * practice (accented) produces the chat twin that answers; the "start from
 * base?" card ghosts beside the accented "start from chat?" one.
 */
export function BaseVsInstruct() {
  return (
    <Infographic>
      <InfographicHeader
        title="Raw graduate vs assistant school"
        subtitle="Base models continue text — instruct models answer you"
      />

      <StoryMap
        steps={[
          { icon: <span aria-hidden="true">📜</span>, label: "The raw twin" },
          { icon: <span aria-hidden="true">❓</span>, label: "Questions confuse it" },
          { icon: <span aria-hidden="true">🎓</span>, label: "Assistant school" },
          { icon: <span aria-hidden="true">🏁</span>, label: "Start from schooled" },
        ]}
      />

      {/* SCENE 1 — the raw graduate */}
      <Scene caption="So hand the RAW twin “The capital of France is” — it continues for pages.">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
          <MachineFigure label="the raw twin" />
          <SpeechBubble side="left">
            “…Paris, a city on the Seine, founded in the 3rd century BC, whose…”
          </SpeechBubble>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Flawless continuation — and it would keep going for pages. Continuing is the whole skill.
        </p>
      </Scene>

      {/* SCENE 2 — questions confuse the raw twin */}
      <Scene variant="continue" caption="But ask it for Kavya's order status — you might get three more questions.">
        <div className="mx-auto max-w-lg rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
          <p className="font-mono text-xs font-semibold text-ink">user: what&apos;s my order status?</p>
          <p className="mt-2 font-mono text-xs text-ink-soft">
            base: what&apos;s my refund status? what&apos;s my account number? where is the nearest…
          </p>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Nothing is broken. A question looks like the start of a list of questions — to a completion machine.
        </p>
      </Scene>

      {/* SCENE 3 — assistant school */}
      <Scene variant="continue" caption="Then assistant school: mountains of Q → helpful-A practice.">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
          <Stagger className="grid grid-cols-3 gap-2">
            {["Q→A", "Q→A", "Q→A"].map((t) => (
              <MotionChild key={t}>
                <div className="rounded-lg border border-ash bg-surface-elevated px-2.5 py-2 text-center font-mono text-[11px] font-bold text-brand-deep shadow-sm">
                  {t}
                </div>
              </MotionChild>
            ))}
          </Stagger>
          <MachineFigure label="the chat twin" />
          <SpeechBubble side="left">Here&apos;s your status — and what happens next.</SpeechBubble>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          The same model after the makers&apos; own tuning: requests get answered, gaps get asked about, rudeness gets refused politely.
        </p>
      </Scene>

      {/* SCENE 4 — your starting point */}
      <Scene variant="continue" caption="That's why Arjun's tune starts from the schooled twin.">
        <div className="mx-auto flex max-w-lg items-center justify-center gap-3 sm:gap-6">
          <div className="rounded-xl border border-dashed border-ash bg-canvas px-4 py-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">start from base?</p>
            <p className="mt-1 text-xs font-semibold text-ink-faint">teach manners, format, refusals first…</p>
            <p className="text-[10px] font-medium text-ink-soft">a syllabus nobody wants to write</p>
          </div>
          <div className="rounded-xl border border-brand bg-brand-wash px-4 py-3 text-center shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">start from chat?</p>
            <p className="mt-1 text-xs font-semibold text-ink">the job is known — teach your flavor only</p>
            <p className="text-[10px] font-medium text-ink-soft">your small pack does the only remaining work</p>
          </div>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          Base continues;{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">chat answers</span> — always
          start your tune from the schooled twin.
        </p>
      </Card>
    </Infographic>
  );
}
