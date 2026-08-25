import { Infographic, InfographicHeader, Card } from "./primitives";
import { Scene, StoryMap, PersonFigure, SpeechBubble } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * AI Security Foundations — Lesson 5: "Data leakage" (v2 Thread retrofit)
 *
 * Through-line stage: DhanSaarthi as the chatty intern at one party, all
 * lesson — the party never changes, what enters it does. A pasted secret
 * (accented) → a memorised number baked into training → the party diary that
 * remembers everything → Kabir's three locks closing the paths. BharatKosh's
 * staff are the guests who whisper secrets without thinking.
 */
export function DataLeakage() {
  return (
    <Infographic>
      <InfographicHeader
        title="Data leakage"
        subtitle="The chatty intern who repeats everything — including what was whispered"
      />

      <StoryMap
        steps={[
          { icon: <span aria-hidden="true">🤫</span>, label: "A secret pasted" },
          { icon: <span aria-hidden="true">📞</span>, label: "Secrets baked in" },
          { icon: <span aria-hidden="true">📓</span>, label: "The diary remembers" },
          { icon: <span aria-hidden="true">🔒</span>, label: "Kabir's three locks" },
        ]}
      />

      {/* SCENE 1 — secrets walk in the front door */}
      <Scene caption="So a secret gets pasted into DhanSaarthi's chat.">
        <div className="flex flex-col items-center gap-3">
          <SpeechBubble side="bottom">
            “Here&apos;s the whole customer list — can you tidy it up? Password is <span className="font-bold text-brand-deep">Fizz!2024</span> btw”
          </SpeechBubble>
          <p className="text-[11px] font-semibold text-ink-soft">— pasted straight in by a BharatKosh staffer, without thinking</p>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Whatever the model reads may come back out — in this chat, or a later one.
        </p>
      </Scene>

      {/* SCENE 2 — trained-in secrets leak slowly */}
      <Scene variant="continue" caption="But some secrets were baked in during training.">
        <div className="flex flex-wrap items-center justify-center gap-5">
          <PersonFigure label="DhanSaarthi the chatty intern" />
          <div className="w-full max-w-[230px] rounded-xl border border-brand bg-surface-elevated p-3 text-center shadow-sm">
            <span className="text-2xl">📞</span>
            <p className="mt-1 text-xs font-semibold text-ink">
              “Finish this phone number: 98…” — and sometimes, eerily, it can.
            </p>
            <p className="mt-1 text-[10px] font-medium text-ink-soft">private text that slipped into the training pile</p>
          </div>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          If private data got mixed into training, the model may{" "}
          <span className="font-bold">memorise and repeat</span> it.
        </p>
      </Scene>

      {/* SCENE 3 — logs remember forever */}
      <Scene variant="continue" caption="Then the diary remembers everything, forever.">
        <div className="mx-auto max-w-md rounded-xl border border-brand bg-surface-elevated p-4 text-center shadow-sm">
          <span className="text-2xl">📓</span>
          <p className="mt-2 text-sm font-semibold text-ink">
            Every conversation is often <span className="font-bold">written down somewhere</span> — logs, backups, analytics.
          </p>
          <p className="mt-1 text-xs font-medium text-ink-soft">
            A leak no one notices for a year: the diary with every secret, readable by too many people.
          </p>
        </div>
      </Scene>

      {/* SCENE 4 — three habits of careful teams */}
      <Scene caption="That's why Kabir locks all three paths.">
        <Stagger className="mx-auto grid max-w-lg grid-cols-1 gap-2.5 sm:grid-cols-3">
          <MotionChild>
            <div className="rounded-xl border border-brand bg-surface-elevated p-3 text-center shadow-sm">
              <span className="text-xl">🚫</span>
              <p className="mt-1 text-[11px] font-semibold text-ink">Don&apos;t feed DhanSaarthi secrets in the first place</p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated p-3 text-center shadow-sm">
              <span className="text-xl">🧹</span>
              <p className="mt-1 text-[11px] font-semibold text-ink">Scrub what must pass through — mask names, numbers, keys</p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated p-3 text-center shadow-sm">
              <span className="text-xl">🔒</span>
              <p className="mt-1 text-[11px] font-semibold text-ink">Lock the diaries — short retention, few readers</p>
            </div>
          </MotionChild>
        </Stagger>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          Treat every prompt, training pile, and log as a{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">party the intern attends</span> —
          secrets shouldn&apos;t come, and shouldn&apos;t stay.
        </p>
      </Card>
    </Infographic>
  );
}
