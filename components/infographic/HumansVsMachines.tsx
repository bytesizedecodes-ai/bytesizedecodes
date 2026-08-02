import { Infographic, InfographicHeader, Card } from "./primitives";
import {
  PersonFigure,
  MachineFigure,
  CarShape,
  SpeechBubble,
  Scene,
} from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Layman course — Lesson 2: "Why a machine can't do that (yet)".
 *
 * Layout: binary-comparison told through two parallel scenes — a human
 * recognising a car vs a machine asked to do the same and failing. Mirrors
 * Lesson 1.pdf slides 13-15. The "what machines CAN do" scene is rendered as
 * friendly instruction cards (not a developer terminal) so a layman reads it.
 * Brand blue only. Pictures carry the contrast.
 */
export function HumansVsMachines() {
  return (
    <Infographic>
      <InfographicHeader
        title="Why a machine can't do that (yet)"
        subtitle="A traditional machine follows instructions — it doesn't decide"
      />

      {/* SCENE A — the human succeeds */}
      <Scene caption="① A human has no trouble">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-10">
          <CarShape />
          <PersonFigure label="human" />
          <SpeechBubble side="left">That&apos;s a car.</SpeechBubble>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Experience → instant decision.
        </p>
      </Scene>

      {/* SCENE B — the same question to a machine, it fails */}
      <Scene caption="② Ask the same question to a machine">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-10">
          <CarShape />
          <MachineFigure label="machine" confused />
          <SpeechBubble side="left" className="text-bad">
            I have no rule for &ldquo;car&rdquo;.
          </SpeechBubble>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Nobody programmed it to recognise cars → it can&apos;t decide.
        </p>
      </Scene>

      {/* SCENE C — what a machine CAN do, as friendly instruction cards */}
      <Scene caption="③ A machine is built to follow instructions like these">
        <Stagger className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
          <MotionChild>
            <InstructionCard icon={<CalcIcon />} label="add" detail="7 + 5 = 12" />
          </MotionChild>
          <MotionChild>
            <InstructionCard icon={<CompareIcon />} label="compare" detail="is x &gt; y?" />
          </MotionChild>
          <MotionChild>
            <InstructionCard icon={<PrintIcon />} label="print" detail="&ldquo;hello&rdquo;" />
          </MotionChild>
          <MotionChild>
            <InstructionCard icon={<ChartIcon />} label="plot" detail="a chart" />
          </MotionChild>
          <MotionChild>
            <InstructionCard icon={<SortIcon />} label="sort" detail="a list" />
          </MotionChild>
          <MotionChild>
            <InstructionCard icon={<GearIcon />} label="repeat" detail="exactly" />
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Perfect at fixed steps. Hopeless at &ldquo;is this a car?&rdquo; — that needs judgement, not rules.
        </p>
      </Scene>

      {/* The bridge — the whole point of ML */}
      <Card tone="brand" rotate={0}>
        <h3 className="mb-2 text-center text-base font-bold sm:text-lg">
          So what&apos;s missing?
        </h3>
        <p className="text-center text-sm font-semibold leading-relaxed text-ink sm:text-[15px]">
          A way for the machine to{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">
            learn from examples
          </span>{" "}
          — instead of needing every rule spelled out. That bridge is called{" "}
          <strong className="font-extrabold">machine learning</strong>.
        </p>
      </Card>
    </Infographic>
  );
}

/** A friendly instruction card: drawn icon + the instruction it represents. */
function InstructionCard({
  icon,
  label,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  detail: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-xl border border-ash bg-white px-3 py-3 text-center shadow-sm">
      <div className="flex h-9 w-9 items-center justify-center text-brand-deep">{icon}</div>
      <span className="text-xs font-bold text-ink">{label}</span>
      <span className="text-[11px] text-ink-soft">{detail}</span>
    </div>
  );
}

/* --- drawn icons for the instructions (brand palette) --- */

function CalcIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="7" y="4" width="18" height="24" rx="2" />
      <line x1="11" y1="10" x2="21" y2="10" />
      <line x1="11" y1="16" x2="14" y2="16" />
      <line x1="18" y1="16" x2="21" y2="16" />
      <line x1="11" y1="21" x2="14" y2="21" />
      <line x1="18" y1="21" x2="21" y2="21" />
    </svg>
  );
}

function CompareIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 7 L4 12 L9 17" />
      <line x1="4" y1="12" x2="16" y2="12" />
      <path d="M23 15 L28 20 L23 25" />
      <line x1="28" y1="20" x2="16" y2="20" />
    </svg>
  );
}

function PrintIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="7" y="13" width="18" height="10" rx="2" />
      <path d="M10 13 L10 7 L22 7 L22 13" />
      <rect x="11" y="18" width="10" height="6" rx="1" fill="currentColor" opacity="0.15" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="5" x2="5" y2="27" />
      <line x1="5" y1="27" x2="27" y2="27" />
      <polyline points="9,22 14,16 19,19 25,9" />
    </svg>
  );
}

function SortIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" y1="9" x2="26" y2="9" />
      <line x1="6" y1="16" x2="22" y2="16" />
      <line x1="6" y1="23" x2="18" y2="23" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="16" r="5" />
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i * Math.PI) / 4;
        return <line key={i} x1={16 + Math.cos(a) * 7} y1={16 + Math.sin(a) * 7} x2={16 + Math.cos(a) * 10} y2={16 + Math.sin(a) * 10} />;
      })}
    </svg>
  );
}
