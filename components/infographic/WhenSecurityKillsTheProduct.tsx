import { Infographic, InfographicHeader, Card } from "./primitives";
import { Scene, StoryMap, PersonFigure } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * AI Security Foundations — Lesson 9: "When security kills the product" (v2
 * Thread retrofit)
 *
 * Through-line stage: BharatKosh's terminal, same row of checkpoints all
 * lesson. After attackers spook the team, every DhanSaarthi door gets a check
 * (the hourglasses fill — the accented change) and the last user walks. Then
 * the fail-direction pair, then Kabir re-spends the patience budget at the
 * vault only, then the balance card: invisible fast lane, unbudgeable vault.
 */
export function WhenSecurityKillsTheProduct() {
  const Hourglass = ({ full, label }: { full: boolean; label: string }) => (
    <div className="flex flex-col items-center gap-1.5">
      <svg viewBox="0 0 50 60" className="h-14 w-auto" aria-hidden="true">
        <path d="M10 6 H40 L26 30 L40 54 H10 L24 30 Z" fill="none" stroke="var(--color-ink)" strokeWidth="3" strokeLinejoin="round" />
        {full && <path d="M13 50 H37 L25 32 Z" fill="var(--color-brand)" opacity="0.6" />}
      </svg>
      <span className="rounded-full bg-ash px-2 py-0.5 text-[10px] font-semibold text-ink">{label}</span>
    </div>
  );

  return (
    <Infographic>
      <InfographicHeader
        title="When security kills the product"
        subtitle="The airport so careful, boarding takes eight hours — safe, and deserted"
      />

      <StoryMap
        steps={[
          { icon: <span aria-hidden="true">🐢</span>, label: "Checks everywhere" },
          { icon: <span aria-hidden="true">🚪</span>, label: "Fail closed or open" },
          { icon: <span aria-hidden="true">💸</span>, label: "A patience budget" },
          { icon: <span aria-hidden="true">⚖️</span>, label: "Fast lane, hard vault" },
        ]}
      />

      {/* SCENE 1 — the deserted terminal */}
      <Scene caption="So BharatKosh put checks everywhere — eight per visit.">
        <div className="flex items-end justify-center gap-6">
          <div className="flex gap-2">
            <Hourglass full label="check" />
            <Hourglass full label="check" />
            <Hourglass full label="check" />
            <Hourglass full label="check" />
          </div>
          <PersonFigure label="the last user, leaving" />
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Eight checks per message and users quietly walk to a faster app.{" "}
          <span className="font-bold">Unused security protects nothing.</span>
        </p>
      </Scene>

      {/* SCENE 2 — two door policies */}
      <Scene variant="continue" caption="But each check fails closed or open — pick on purpose.">
        <Stagger className="mx-auto grid max-w-lg grid-cols-1 gap-2.5 sm:grid-cols-2">
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated p-3 text-center shadow-sm">
              <span className="text-xl">🚫</span>
              <p className="mt-1 text-xs font-bold text-ink">Fail closed</p>
              <p className="text-[10px] font-medium text-ink-soft">check breaks → nobody passes. Safer, sometimes silent sabotage</p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated p-3 text-center shadow-sm">
              <span className="text-xl">🚪</span>
              <p className="mt-1 text-xs font-bold text-ink">Fail open</p>
              <p className="text-[10px] font-medium text-ink-soft">check breaks → everyone passes. Faster, risky on a bad day</p>
            </div>
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          The choice is <span className="font-bold text-brand-deep">per door</span>: the vault fails closed; the joke generator may fail open.
        </p>
      </Scene>

      {/* SCENE 3 — the friction budget */}
      <Scene variant="continue" caption="Then spend the patience budget at the vault only.">
        <div className="mx-auto max-w-md rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
          <p className="text-sm font-semibold text-ink">
            Users give you a few extra seconds,{" "}
            <span className="font-bold">total</span> — a patience budget.
          </p>
          <p className="mt-1 text-sm font-semibold text-ink">
            Kabir spends it on the <span className="font-bold text-brand-deep">vault moments</span>: money, deletions, private data.
          </p>
          <p className="mt-1 text-xs font-medium text-ink-soft">
            The fast lane keeps everything else friction-free — that&apos;s what keeps users around to protect.
          </p>
        </div>
      </Scene>

      {/* SCENE 4 — the balance card */}
      <Scene caption="That's why the fast lane stays fast and the vault stays hard.">
        <div className="mx-auto max-w-md rounded-xl border border-brand bg-surface-elevated p-4 text-center shadow-sm">
          <p className="text-sm font-semibold text-ink">
            Good security is <span className="font-bold">invisible on the fast lane</span> and{" "}
            <span className="font-bold">unbudgeable at the vault</span>.
          </p>
          <p className="mt-1 text-xs font-medium text-ink-soft">
            If your users can&apos;t tell you added it — and an attacker can&apos;t get past it — you built it right.
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          Every check spends user patience —{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">spend it at the vault</span>,
          not at every door.
        </p>
      </Card>
    </Infographic>
  );
}
