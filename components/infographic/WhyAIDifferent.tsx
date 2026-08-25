import { Infographic, InfographicHeader, Card, Takeaway } from "./primitives";
import { PersonFigure, MachineFigure, SpeechBubble, Scene, StoryMap, Operator } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * AI Observability — Lesson 2: "Why is AI different from normal software?"
 * (v2 Thread retrofit)
 *
 * Through-line stage: one button, one dish, one prompt — asked twice, every
 * scene. The vending machine answers the repeat identically (anchor), the
 * chef varies it (tension), and Nisha's same prompt to Mitra comes back two
 * different ways (the fade). Beats: anchor (same button, same can) →
 * tension (the chef varies) → fade (Mitra varies too, so watch each run).
 * Brand accent only; the two chef plates use neutral tones to stay calm.
 */
export function WhyAIDifferent() {
  return (
    <Infographic>
      <InfographicHeader
        title="Why is AI different from normal software?"
        subtitle="A vending machine always gives you the same thing. An AI doesn’t."
      />

      <StoryMap
        steps={[
          { icon: <span aria-hidden="true">🥤</span>, label: "Same can, forever" },
          { icon: <span aria-hidden="true">👨‍🍳</span>, label: "The chef varies" },
          { icon: <span aria-hidden="true">🤖</span>, label: "Mitra varies too" },
          { icon: <span aria-hidden="true">👀</span>, label: "So watch each run" },
        ]}
      />

      {/* Anchor — vending machine = deterministic */}
      <Scene caption="So a vending machine always behaves the same — press B4 twice, same can, forever.">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-center sm:gap-5">
          <VendingMachine />
          <Operator>→</Operator>
          <ChipsBag />
          <Operator>→</Operator>
          <ChipsBag />
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink-soft">
          Press <span className="font-mono font-bold text-ink">B4</span> once or
          a hundred times — same chips, every time.
        </p>
      </Scene>

      {/* Tension — a chef = non-deterministic */}
      <Scene variant="continue" caption="But a chef makes it a little different each time.">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-center sm:gap-5">
          <PersonFigure label="chef" />
          <Plate garnishes={2} />
          <Plate garnishes={4} />
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink-soft">
          Order the same omelette twice — both tasty, but never identical.
        </p>
      </Scene>

      {/* Fade — Nisha's same prompt to Mitra comes back two different ways */}
      <Scene caption="Then Nisha tries the same on Mitra — and it behaves like the chef, not the machine.">
        <Stagger className="flex flex-col items-center gap-4">
          <MotionChild>
            <div className="flex items-center justify-center gap-4">
              <PersonFigure label="Nisha" />
              <span className="rounded-2xl bg-brand-wash px-3 py-2 text-xs font-bold text-brand">
                “Summarise this policy”
              </span>
              <MachineFigure label="Mitra" />
            </div>
          </MotionChild>
          <MotionChild>
            <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
              <SpeechBubble side="top">“A short bullet list…”</SpeechBubble>
              <SpeechBubble side="top">“In two paragraphs…”</SpeechBubble>
            </div>
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-xs font-medium text-ink-soft">
          Same prompt, two runs — two different answers. So Nisha keeps watching each run.
        </p>
      </Scene>

      <Card tone="brand" rotate={0}>
        <Takeaway>
          Because the <em>same input can give different outputs</em>, you can’t
          just trust an AI once and walk away — you have to keep watching it.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

/** A simple front-on vending machine with one lit button. */
function VendingMachine() {
  return (
    <svg viewBox="0 0 60 80" className="h-20 w-auto text-brand" aria-hidden="true">
      <rect x="6" y="4" width="48" height="72" rx="5" fill="var(--color-surface-elevated)" stroke="currentColor" strokeWidth="2.5" />
      {/* product window */}
      <rect x="12" y="10" width="36" height="34" rx="2" fill="var(--screen)" opacity="0.35" stroke="currentColor" strokeWidth="1" />
      <line x1="21" y1="14" x2="21" y2="40" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1="30" y1="14" x2="30" y2="40" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1="39" y1="14" x2="39" y2="40" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      {/* lit button */}
      <circle cx="30" cy="56" r="5" fill="var(--color-brand)" />
      <circle cx="30" cy="56" r="2" fill="var(--color-surface-elevated)" />
      {/* dispenser */}
      <rect x="12" y="66" width="36" height="8" rx="2" fill="var(--color-ash)" />
    </svg>
  );
}

/** A chips bag — the identical vending output. */
function ChipsBag() {
  return (
    <svg viewBox="0 0 40 48" className="h-16 w-auto text-brand-deep" aria-hidden="true">
      <path d="M6 6 L8 2 L32 2 L34 6 L34 42 L32 46 L8 46 L6 42 Z" fill="var(--color-brand-wash)" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <line x1="12" y1="16" x2="28" y2="16" stroke="currentColor" strokeWidth="1.5" />
      <line x1="14" y1="22" x2="26" y2="22" stroke="currentColor" strokeWidth="1.5" />
      <line x1="12" y1="28" x2="28" y2="28" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/** A plate of food. `garnishes` varies to show "a little different each time". */
function Plate({ garnishes }: { garnishes: number }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <svg viewBox="0 0 56 40" className="h-12 w-auto text-ink" aria-hidden="true">
        <ellipse cx="28" cy="26" rx="24" ry="9" fill="var(--color-surface-elevated)" stroke="currentColor" strokeWidth="2" />
        <ellipse cx="28" cy="24" rx="18" ry="6" fill="var(--color-brand-wash)" stroke="var(--color-brand-deep)" strokeWidth="1.5" />
        {Array.from({ length: garnishes }).map((_, i) => (
          <circle key={i} cx={20 + i * 6} cy={22} r="2" fill="var(--color-brand-deep)" />
        ))}
      </svg>
      <span className="text-[10px] font-semibold uppercase tracking-wide text-ink-soft">
        omelette
      </span>
    </div>
  );
}
