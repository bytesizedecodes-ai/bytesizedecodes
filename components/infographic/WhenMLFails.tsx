import { Infographic, InfographicHeader, Card } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Layman course — Lesson: "When ML gets it wrong".
 *
 * Trust literacy — the honest &ldquo;ML isn&apos;t magic&rdquo; counterweight to the
 * &ldquo;ML you already use&rdquo; lesson. Three concrete failure cases (a self-driving
 * car misreading a stop sign, a bad recommendation, a false face-match), then
 * why it happens (the model never saw an example like this), then what careful
 * teams do about it (more diverse data, human review, confidence thresholds).
 * Picture-led with drawn icons. Brand blue + semantic good/bad only.
 * No prose/questions (course rule).
 */
export function WhenMLFails() {
  return (
    <Infographic>
      <InfographicHeader
        title="When ML gets it wrong"
        subtitle="It&apos;s powerful — and it makes mistakes. Here&apos;s how to think about both."
      />

      {/* Step 1 — three real failure cases */}
      <Scene caption="① ML can be confidently wrong — three real cases">
        <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-3">
          <MotionChild>
            <FailCard
              icon={<StopSignIcon />}
              title="Misread sign"
              detail="a self-driving system misses a dented stop sign"
            />
          </MotionChild>
          <MotionChild>
            <FailCard
              icon={<ThumbDownIcon />}
              title="Odd recommendation"
              detail="you get suggested something unrelated"
            />
          </MotionChild>
          <MotionChild>
            <FailCard
              icon={<WrongFaceIcon />}
              title="False face match"
              detail="an innocent person is flagged incorrectly"
            />
          </MotionChild>
        </Stagger>
      </Scene>

      {/* Step 2 — why it happens: the model never saw an example like this */}
      <Scene caption="② Usually it&apos;s a gap in the training data">
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-good bg-good-wash p-4 text-center shadow-sm">
            <div className="mb-2 text-sm font-bold text-good">seen in training</div>
            <div className="flex items-center justify-center gap-1">
              <StopSignIcon clean />
              <StopSignIcon clean />
              <StopSignIcon clean />
            </div>
            <p className="mt-2 text-[11px] font-medium text-ink">clean signs — handled well</p>
          </div>
          <div className="rounded-xl border border-bad bg-bad-wash p-4 text-center shadow-sm">
            <div className="mb-2 text-sm font-bold text-bad">never seen</div>
            <div className="flex items-center justify-center gap-1">
              <StopSignIcon dented />
            </div>
            <p className="mt-2 text-[11px] font-medium text-ink">a dented, snowy sign — a guess</p>
          </div>
        </div>
      </Scene>

      {/* Step 3 — what careful teams do about it */}
      <Scene caption="③ Careful teams build in safety nets">
        <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <MotionChild>
            <SafetyCard num="1" label="Diverse data" detail="train on edge cases, not just the common ones" />
          </MotionChild>
          <MotionChild>
            <SafetyCard num="2" label="Human review" detail="a person checks high-stakes calls" />
          </MotionChild>
          <MotionChild>
            <SafetyCard num="3" label="Confidence check" detail="if unsure, say &ldquo;I don&apos;t know&rdquo;" />
          </MotionChild>
        </Stagger>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          Trust ML where it&apos;s been{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">tested</span>,
          and keep a human where the stakes are high.
        </p>
      </Card>
    </Infographic>
  );
}

/** A failure-case card with a drawn icon. */
function FailCard({ icon, title, detail }: { icon: React.ReactNode; title: string; detail: string }) {
  return (
    <div className="rounded-xl border border-bad bg-bad-wash p-4 text-center shadow-sm">
      <div className="flex h-12 items-center justify-center">{icon}</div>
      <div className="mt-2 text-sm font-bold text-bad">{title}</div>
      <p className="mt-1 text-[11px] leading-relaxed text-ink">{detail}</p>
    </div>
  );
}

/** A safety-net card. */
function SafetyCard({ num, label, detail }: { num: string; label: string; detail: string }) {
  return (
    <div className="rounded-xl border border-good bg-good-wash p-4 text-center shadow-sm">
      <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-good text-sm font-bold text-canvas">
        {num}
      </div>
      <div className="mt-2 text-sm font-bold text-good">{label}</div>
      <p className="mt-1 text-[11px] leading-relaxed text-ink">{detail}</p>
    </div>
  );
}

/* --- drawn stop-sign icons showing clean vs dented --- */

function StopSignIcon({ clean = false, dented = false }: { clean?: boolean; dented?: boolean }) {
  // octagon outline; "dented" draws a dent, "clean" draws it bold/green-ish
  const stroke = clean ? "#5f9e77" : "#c1706b";
  return (
    <svg viewBox="0 0 32 32" className="h-9 w-9" aria-hidden="true">
      <polygon
        points="11,4 21,4 28,11 28,21 21,28 11,28 4,21 4,11"
        fill={clean ? "#edf5f0" : "#f9efee"}
        stroke={stroke}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {dented && <path d="M11 4 L13 7 L9 8 Z" fill={stroke} opacity="0.5" />}
      <text x="16" y="19" textAnchor="middle" fontSize="6" fontWeight="bold" fill={stroke}>STOP</text>
    </svg>
  );
}

function ThumbDownIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-9 w-9" aria-hidden="true" fill="none" stroke="var(--color-bad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 14 L10 24 L13 24 L13 14 Z" fill="var(--color-bad-wash)" />
      <path d="M13 14 L13 22 L20 22 Q23 22 23 19 L23 16 Q23 14 21 14 L13 14 Z" fill="var(--color-bad-wash)" />
      <path d="M10 16 L6 16 Q4 16 4 14 Q4 12 6 12 L10 12" />
    </svg>
  );
}

function WrongFaceIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-9 w-9" aria-hidden="true" fill="none" stroke="var(--color-bad)" strokeWidth="2" strokeLinecap="round">
      <rect x="5" y="4" width="22" height="24" rx="4" />
      <circle cx="11" cy="15" r="1.2" fill="var(--color-bad)" />
      <circle cx="21" cy="15" r="1.2" fill="var(--color-bad)" />
      <path d="M11 22 Q16 18 21 22" />
      <line x1="6" y1="6" x2="26" y2="26" />
    </svg>
  );
}
