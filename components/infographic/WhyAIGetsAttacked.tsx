import { Infographic, InfographicHeader, Card } from "./primitives";
import { Scene, PersonFigure, MachineFigure } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * AI Security Foundations — Lesson 1: "Why AI gets attacked".
 * Through-line: a shop that keeps adding new doors. Every AI feature is a
 * new door — and thieves don't beat the strong door, they walk through the
 * unlocked side entrance.
 */
export function WhyAIGetsAttacked() {
  const Door = ({ open, label }: { open: boolean; label: string }) => (
    <div className="flex flex-col items-center gap-1.5">
      <svg viewBox="0 0 60 70" className="h-16 w-auto" aria-hidden="true">
        <rect x="6" y="4" width="48" height="62" rx="4" fill="var(--surface-elevated)" stroke="var(--color-ink)" strokeWidth="3" />
        {open ? (
          <path d="M10 64 L10 8 L52 16 L52 64 Z" fill="var(--color-brand)" opacity="0.4" stroke="var(--color-brand-deep)" strokeWidth="2" />
        ) : (
          <>
            <circle cx="44" cy="38" r="3.5" fill="var(--color-ink)" />
            <rect x="14" y="22" width="20" height="10" rx="2" fill="none" stroke="var(--color-ink)" strokeWidth="2" />
          </>
        )}
      </svg>
      <span className="rounded-full bg-ash px-2 py-0.5 text-[10px] font-semibold text-ink">{label}</span>
    </div>
  );

  return (
    <Infographic>
      <InfographicHeader
        title="Why AI gets attacked"
        subtitle="Every new AI feature is a new door — and thieves go where the doors are"
      />

      {/* SCENE 1 — the old app: one strong door */}
      <Scene caption="① Yesterday's app: one strong front door">
        <div className="flex items-end justify-center gap-6">
          <PersonFigure label="user" />
          <Door open={false} label="login + password" />
          <MachineFigure label="the app" />
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          One door, guarded for 30 years. Everyone knows how to lock it.
        </p>
      </Scene>

      {/* SCENE 2 — AI adds doors */}
      <Scene caption="② Then AI moved in — and kept adding doors">
        <Stagger className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <MotionChild>
            <div className="flex h-full flex-col items-center justify-center gap-2 rounded-xl border border-ash bg-surface-elevated p-3 text-center shadow-sm">
              <span className="text-2xl">💬</span>
              <p className="text-[11px] font-semibold text-ink">the chat reads any text you hand it</p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="flex h-full flex-col items-center justify-center gap-2 rounded-xl border border-ash bg-surface-elevated p-3 text-center shadow-sm">
              <span className="text-2xl">🔑</span>
              <p className="text-[11px] font-semibold text-ink">the helper can use your tools and files</p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="flex h-full flex-col items-center justify-center gap-2 rounded-xl border border-ash bg-surface-elevated p-3 text-center shadow-sm">
              <span className="text-2xl">📄</span>
              <p className="text-[11px] font-semibold text-ink">it obeys written instructions from anywhere</p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="flex h-full flex-col items-center justify-center gap-2 rounded-xl border border-ash bg-surface-elevated p-3 text-center shadow-sm">
              <span className="text-2xl">✍️</span>
              <p className="text-[11px] font-semibold text-ink">it writes answers others will act on</p>
            </div>
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Four new ways in — none of them existed when the shop was built.
        </p>
      </Scene>

      {/* SCENE 3 — the thief picks the weak door */}
      <Scene caption="③ The thief never touches the strong door">
        <div className="flex items-end justify-center gap-4 sm:gap-6">
          <PersonFigure label="attacker" className="[&_svg]:-scale-x-100" />
          <div className="flex items-end gap-2 sm:gap-3">
            <Door open={false} label="login (strong)" />
            <Door open label="chat window (new)" />
          </div>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          The front door is fine. The side door — opened helpfully, for everyone — is the way in.
        </p>
      </Scene>

      {/* SCENE 4 — the reframe */}
      <Scene caption="④ Security starts with a map, not a bigger lock">
        <div className="mx-auto max-w-md rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
          <p className="text-sm font-semibold text-ink">
            The list of all your doors is called the{" "}
            <span className="font-bold">attack surface</span>.
          </p>
          <p className="mt-1 text-sm font-semibold text-ink">
            Name every door first. Then lock them{" "}
            <span className="font-bold">one by one</span>.
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          AI features add doors faster than teams add locks —{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">map the doors</span>,
          then guard them.
        </p>
      </Card>
    </Infographic>
  );
}
