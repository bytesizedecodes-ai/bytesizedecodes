import { Infographic, InfographicHeader, Card } from "./primitives";
import { Scene, StoryMap } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Fine-Tuning Foundations — Lesson 12: "Conversations are scripts" (v2
 * Thread retrofit).
 *
 * Through-line stage: the script page — one bordered page, same spot, every
 * scene. States: Rasoi Express's conversation printed with role labels → the
 * reply fences added (accented) → Arjun's training cards printed onto the
 * same page → the mismatch symptom when rehearsal and the live app use
 * different printings.
 */
export function ConversationScripts() {
  const ScriptLine = ({
    role,
    text,
    accent,
  }: {
    role: string;
    text: string;
    accent?: boolean;
  }) => (
    <div className="flex items-start gap-2">
      <span
        className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide ${
          accent ? "bg-brand text-canvas" : "bg-ash text-ink"
        }`}
      >
        {role}
      </span>
      <p className="font-mono text-xs leading-relaxed text-ink sm:text-[13px]">{text}</p>
    </div>
  );

  return (
    <Infographic>
      <InfographicHeader
        title="Conversations are scripts"
        subtitle="Under the chat window sits a radio play — speaker before every line"
      />

      <StoryMap
        steps={[
          { icon: <span aria-hidden="true">🎭</span>, label: "A labeled script" },
          { icon: <span aria-hidden="true">🚧</span>, label: "Reply fences" },
          { icon: <span aria-hidden="true">🖨️</span>, label: "Print cards the same" },
          { icon: <span aria-hidden="true">🐛</span>, label: "The invisible bug" },
        ]}
      />

      {/* SCENE 1 — the script page */}
      <Scene caption="So what Rasoi's order assistant actually reads is a labeled script.">
        <div className="mx-auto max-w-md space-y-2 rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
          <ScriptLine role="system" text="You are Rasoi Express's order assistant." />
          <ScriptLine role="user" text="where's my order" />
          <ScriptLine role="assistant" text="Let me check — one moment!" accent />
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          No floating text, ever. Instructions live at the top; every turn wears its speaker&apos;s name.
        </p>
      </Scene>

      {/* SCENE 2 — the fence around the reply */}
      <Scene variant="continue" caption="Then markers fence off the assistant's lines.">
        <div className="mx-auto max-w-md space-y-2 rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
          <ScriptLine role="user" text="do you deliver on Sundays?" />
          <p className="font-mono text-[11px] font-bold text-brand-deep">⟨reply starts⟩</p>
          <ScriptLine role="assistant" text="Yes — 9am to 1pm in your area!" accent />
          <p className="font-mono text-[11px] font-bold text-brand-deep">⟨reply ends⟩</p>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          The model learned where its lines begin and end the way actors learn stage directions — by the printing.
        </p>
      </Scene>

      {/* SCENE 3 — training uses the same script */}
      <Scene variant="continue" caption="But practice must print Arjun's cards onto the very same page.">
        <div className="mx-auto flex max-w-lg flex-col items-center gap-3 sm:flex-row sm:gap-5">
          <div className="rounded-xl border border-brand bg-brand-wash px-4 py-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">your card</p>
            <p className="mt-0.5 text-xs font-semibold text-ink">request + ideal reply</p>
          </div>
          <span className="text-xl font-bold text-ink-soft">→</span>
          <div className="rounded-xl border border-ash bg-surface-elevated px-4 py-3 text-center shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">printed as</p>
            <p className="mt-0.5 font-mono text-xs font-semibold text-ink">user line + fenced assistant line</p>
          </div>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Practice must rehearse the exact script the live product will print.
        </p>
      </Scene>

      {/* SCENE 4 — opening night, wrong printing */}
      <Scene variant="continue" caption="That's why a rehearsal/serving mismatch is the invisible bug — check the script first.">
        <div className="mx-auto max-w-md rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
          <p className="text-xs font-semibold text-ink">
            Symptom: replies start mid-sentence, or continue the customer&apos;s message as if it were the model&apos;s own.
          </p>
          <p className="mt-2 text-xs font-medium text-ink-soft">
            Nothing crashed. Everything degraded — the actor hears a slightly different play than the one rehearsed.
          </p>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Debug guides call it <span className="font-bold">the invisible bug</span>. Check the script first.
        </p>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          One script,{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">rehearsed and performed</span>{" "}
          — training format and serving format must match exactly.
        </p>
      </Card>
    </Infographic>
  );
}
