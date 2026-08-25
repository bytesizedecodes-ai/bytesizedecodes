import { Infographic, InfographicHeader, Card } from "./primitives";
import { Scene, StoryMap } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Fine-Tuning Foundations — Lesson 6: "One good example" (v2 Thread
 * retrofit).
 *
 * Through-line stage: the flashcard — one card shape, same spot, every
 * scene; only its content and tone change. Arjun's first card (Kavya's angry
 * message, the calm house reply, accented) sets the atom; the manual
 * comparison, the job variety, then the sloppy card (bad accent) close the
 * mirror warning: the model learns your mistakes as faithfully as your
 * standards.
 */
export function OneGoodExample() {
  const Flashcard = ({
    front,
    back,
    tone = "plain",
  }: {
    front: string;
    back: string;
    tone?: "plain" | "brand" | "bad";
  }) => (
    <div className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-ash bg-surface-elevated shadow-sm">
      <div className="border-b border-ash px-4 py-3">
        <p className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">front · the request, as it really arrives</p>
        <p className="mt-1 text-sm font-medium text-ink">{front}</p>
      </div>
      <div
        className={`px-4 py-3 ${
          tone === "brand" ? "bg-brand-wash" : tone === "bad" ? "border-l-4 border-bad" : ""
        }`}
      >
        <p className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">back · the reply you want forever</p>
        <p className={`mt-1 text-sm font-semibold ${tone === "bad" ? "text-ink" : "text-brand-deep"}`}>{back}</p>
      </div>
    </div>
  );

  return (
    <Infographic>
      <InfographicHeader
        title="One good example"
        subtitle="A flashcard for grown-ups: real request in front, ideal reply behind"
      />

      <StoryMap
        steps={[
          { icon: <span aria-hidden="true">🃏</span>, label: "One flashcard" },
          { icon: <span aria-hidden="true">📖</span>, label: "Shown, not told" },
          { icon: <span aria-hidden="true">🔀</span>, label: "Many jobs, one atom" },
          { icon: <span aria-hidden="true">🪞</span>, label: "The mirror" },
        ]}
      />

      {/* SCENE 1 — the atom of all tuning */}
      <Scene caption="So the atom of Arjun's whole tune is one pair.">
        <Flashcard
          front="“hey my orders late AGAIN?? this is the 3rd time”"
          back="So sorry, Kavya — I can see it. Refund started, plus a credit for the delay. Anything else I can fix?"
          tone="brand"
        />
        <p className="mt-3 text-center text-xs font-medium text-ink">
          No rule stated. The calm tone, the name, the fix — all <span className="font-bold">demonstrated</span>.
        </p>
      </Scene>

      {/* SCENE 2 — showing, not telling */}
      <Scene variant="continue" caption="But a manual could just say 'be concise' — and it never sticks like a card.">
        <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <MotionChild>
            <div className="h-full rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wide text-ink-soft">the manual way</div>
              <p className="mt-1 font-mono text-xs font-semibold text-ink">“be concise. be warm. sign off with …”</p>
              <p className="mt-1 text-[11px] font-medium text-ink-soft">described — and re-described, and argued with</p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="h-full rounded-xl border border-brand bg-brand-wash p-4 text-center shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wide text-ink-soft">the card way</div>
              <p className="mt-1 text-xs font-semibold text-ink">A three-line reply that simply is concise and warm</p>
              <p className="mt-1 text-[11px] font-medium text-ink-soft">performed — length, opening, sign-off and all</p>
            </div>
          </MotionChild>
        </Stagger>
      </Scene>

      {/* SCENE 3 — variety of pairs */}
      <Scene variant="continue" caption="Then give the atom different jobs — tone, format, refusal.">
        <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          <MotionChild>
            <div className="h-full rounded-xl border border-ash bg-surface-elevated p-3 text-center shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-wide text-ink-soft">tone pair</p>
              <p className="mt-1 text-xs font-medium text-ink">angry message → calm house reply</p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="h-full rounded-xl border border-ash bg-surface-elevated p-3 text-center shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-wide text-ink-soft">format pair</p>
              <p className="mt-1 text-xs font-medium text-ink">messy order text → tidy receipt</p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="h-full rounded-xl border border-ash bg-surface-elevated p-3 text-center shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-wide text-ink-soft">refusal pair</p>
              <p className="mt-1 text-xs font-medium text-ink">off-limits ask → polite, firm no</p>
            </div>
          </MotionChild>
        </Stagger>
      </Scene>

      {/* SCENE 4 — the mirror warning */}
      <Scene variant="continue" caption="That's why every card is a vote — including the sloppy ones.">
        <Flashcard
          front="“where's my stuff”"
          back="shipped. check tracking."
          tone="bad"
        />
        <p className="mt-3 text-center text-xs font-medium text-ink">
          One rushed card licenses drift toward bluntness. The model is a{" "}
          <span className="font-bold">mirror</span> — it reflects everything.
        </p>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          Each example is a vote for what{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">normal</span> looks like —
          cast every vote deliberately.
        </p>
      </Card>
    </Infographic>
  );
}
