import { Infographic, InfographicHeader, Card } from "./primitives";
import { Scene, StoryMap } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Fine-Tuning Foundations — Lesson 13: "Clip-on lenses (LoRA, plainly)" (v2
 * Thread retrofit).
 *
 * Through-line stage: the glasses — same frames, same spot, every scene; the
 * only state changes are what sits in front of the lenses (nothing → the
 * brand tint, the one accented change → the swap drawer). The boundary card
 * keeps the rule from lesson 3: clip-ons tint behavior, they hold no
 * prescription (knowledge).
 */
export function ClipOnLenses() {
  const Glasses = ({ clip }: { clip?: "sun" | "none" | "swap" }) => (
    <svg viewBox="0 0 140 60" className="h-auto w-full max-w-[180px]" aria-hidden="true">
      {/* lens frames — never change */}
      <circle cx="38" cy="34" r="20" fill="none" stroke="var(--color-ink)" strokeWidth="3" />
      <circle cx="102" cy="34" r="20" fill="none" stroke="var(--color-ink)" strokeWidth="3" />
      <path d="M58 32 Q70 24 82 32" fill="none" stroke="var(--color-ink)" strokeWidth="3" />
      <path d="M18 28 L4 20" stroke="var(--color-ink)" strokeWidth="3" strokeLinecap="round" />
      <path d="M122 28 L136 20" stroke="var(--color-ink)" strokeWidth="3" strokeLinecap="round" />
      {clip === "sun" && (
        <>
          <circle cx="38" cy="34" r="16" fill="var(--color-brand)" opacity="0.55" />
          <circle cx="102" cy="34" r="16" fill="var(--color-brand)" opacity="0.55" />
        </>
      )}
      {clip === "swap" && (
        <>
          <circle cx="38" cy="34" r="16" fill="var(--color-ink-soft)" opacity="0.35" />
          <circle cx="102" cy="34" r="16" fill="var(--color-brand)" opacity="0.4" />
        </>
      )}
    </svg>
  );

  return (
    <Infographic>
      <InfographicHeader
        title="Clip-on lenses (LoRA, plainly)"
        subtitle="A tiny add-on changes the look — nobody re-grinds the glass"
      />

      <StoryMap
        steps={[
          { icon: <span aria-hidden="true">👓</span>, label: "The base stays" },
          { icon: <span aria-hidden="true">🕶️</span>, label: "Clip on a tint" },
          { icon: <span aria-hidden="true">🗂️</span>, label: "A drawer of looks" },
          { icon: <span aria-hidden="true">🚫</span>, label: "Not a prescription" },
        ]}
      />

      {/* SCENE 1 — the base stays untouched */}
      <Scene caption="So the base model is the glasses — the same frames, always.">
        <Glasses clip="none" />
        <p className="mt-3 text-center text-xs font-medium text-ink">
          The expensive part — the glass — stays exactly as the makers ground it.
        </p>
      </Scene>

      {/* SCENE 2 — the clip-on */}
      <Scene variant="continue" caption="Then clip on a tint: the look changes, the glass doesn't.">
        <Glasses clip="sun" />
        <p className="mt-3 text-center text-xs font-medium text-ink">
          A thin layer in front of the lens shifts the look — often{" "}
          <span className="font-bold">under 1% of the model&apos;s size</span>, trained fast on modest chips.
        </p>
      </Scene>

      {/* SCENE 3 — the drawer of clip-ons */}
      <Scene variant="continue" caption="But the real trick is one base, a drawer of looks — swap per product, per season.">
        <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          <MotionChild>
            <div className="h-full rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
              <span className="text-2xl">🏦</span>
              <p className="mt-1 text-xs font-semibold text-ink">formal banking tone</p>
              <p className="text-[10px] font-medium text-ink-soft">clip-on file · small</p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="h-full rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
              <span className="text-2xl">🍕</span>
              <p className="mt-1 text-xs font-semibold text-ink">playful delivery tone</p>
              <p className="text-[10px] font-medium text-ink-soft">clip-on file · small</p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="h-full rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
              <span className="text-2xl">🚨</span>
              <p className="mt-1 text-xs font-semibold text-ink">terse outage mode</p>
              <p className="text-[10px] font-medium text-ink-soft">clip-on file · small</p>
            </div>
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Swap per product, per season, per experiment — pop one off, clip another on. The base never notices.
        </p>
      </Scene>

      {/* SCENE 4 — the boundary */}
      <Scene variant="continue" caption="That's why a clip-on can't hold prescription — new knowledge is base-model work.">
        <div className="mx-auto max-w-md rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
          <p className="text-sm font-semibold text-ink">
            Clip-ons shift <span className="font-bold">style and behavior</span>.
          </p>
          <p className="mt-1 text-sm font-semibold text-ink">
            They hold about as much <span className="font-bold">new knowledge</span> as sunglasses hold prescription.
          </p>
          <p className="mt-2 text-xs font-medium text-ink-soft">
            A whole unseen field = base-model work (heavy training, or a different base). Not a bigger clip-on.
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          LoRA is the{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">clip-on layer</span> — tiny,
          swappable behavior over untouched glass.
        </p>
      </Card>
    </Infographic>
  );
}
