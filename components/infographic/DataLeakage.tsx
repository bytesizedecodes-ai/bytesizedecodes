import { Infographic, InfographicHeader, Card } from "./primitives";
import { Scene, PersonFigure, SpeechBubble } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * AI Security Foundations — Lesson 5: "Data leakage".
 * Through-line: the chatty intern at a party — repeats anything heard,
 * never checks whether it was a secret. Secrets walk into chats, hide in
 * training, and get replayed by logs.
 */
export function DataLeakage() {
  return (
    <Infographic>
      <InfographicHeader
        title="Data leakage"
        subtitle="The chatty intern who repeats everything — including what was whispered"
      />

      {/* SCENE 1 — secrets walk in the front door */}
      <Scene caption="① People hand the intern secrets without thinking">
        <div className="flex flex-col items-center gap-3">
          <SpeechBubble side="bottom">
            “Here&apos;s the whole customer list — can you tidy it up? Password is <span className="font-bold">Fizz!2024</span> btw”
          </SpeechBubble>
          <p className="text-[11px] font-semibold text-ink-soft">— pasted straight into the chat box</p>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Whatever the model reads may come back out — in this chat, or a later one.
        </p>
      </Scene>

      {/* SCENE 2 — trained-in secrets leak slowly */}
      <Scene caption="② Some secrets were baked in during training">
        <div className="flex flex-wrap items-center justify-center gap-5">
          <PersonFigure label="the AI assistant" />
          <div className="w-full max-w-[230px] rounded-xl border border-ash bg-surface-elevated p-3 text-center shadow-sm">
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
      <Scene caption="③ And the party diary remembers everything">
        <div className="mx-auto max-w-md rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
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
      <Scene caption="④ Careful teams do three things">
        <Stagger className="mx-auto grid max-w-lg grid-cols-1 gap-2.5 sm:grid-cols-3">
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated p-3 text-center shadow-sm">
              <span className="text-xl">🚫</span>
              <p className="mt-1 text-[11px] font-semibold text-ink">Don&apos;t feed it secrets in the first place</p>
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
