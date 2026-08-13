import { Infographic, InfographicHeader, Card, CardTitle, Takeaway, BulletList } from "./primitives";
import { MachineFigure, SpeechBubble, Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * AI Observability — Lesson 3: "When AI goes wrong".
 *
 * Beginner calibration: the lesson’s aha is the contrast between LOUD failure
 * (normal software crashes — you notice instantly) and QUIET failure (an AI
 * keeps answering with a smile while quietly being wrong, costly, or drifting).
 * Red is the single semantic accent for “something is wrong”; brand marks the
 * AI itself. Scene 3 previews the three quiet-failure modes the course returns
 * to later (hallucination, cost, drift).
 */
export function WhenAIGoesWrong() {
  return (
    <Infographic>
      <InfographicHeader
        title="When AI goes wrong, it rarely crashes"
        subtitle="Software fails loudly. AI fails quietly."
      />

      {/* ① Loud failure: you notice immediately */}
      <Scene caption="① Normal software fails loudly">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-center sm:gap-6">
          <CrashScreen />
          <div className="max-w-[12rem] text-center">
            <p className="text-sm font-semibold text-ink">
              A big red error. The whole app stops.
            </p>
            <p className="mt-1 text-xs font-medium text-ink-soft">
              You notice the second it happens — and you fix it.
            </p>
          </div>
        </div>
      </Scene>

      {/* ② Quiet failure: AI keeps smiling */}
      <Scene caption="② An AI fails quietly">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-center sm:gap-6">
          <MachineFigure label="AI" />
          <div className="flex flex-col items-center gap-2">
            <SpeechBubble side="left">“The capital of Australia is Sydney.”</SpeechBubble>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-bad)] bg-[var(--color-bad-wash)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--color-bad)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-bad)]" />
              quietly wrong (it’s Canberra)
            </span>
          </div>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink-soft">
          No crash, no error. It still answers — just <em>incorrectly</em>.
        </p>
      </Scene>

      {/* ③ Three ways AI fails without crashing — previews the course */}
      <Scene caption="③ Three ways AI fails without crashing">
        <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <MotionChild>
            <QuietFailureCard
              icon="confidently-wrong"
              title="Confidently wrong"
              body="It makes things up and sounds sure of itself."
            />
          </MotionChild>
          <MotionChild>
            <QuietFailureCard
              icon="quietly-costly"
              title="Quietly costly"
              body="The bill climbs with nobody watching."
            />
          </MotionChild>
          <MotionChild>
            <QuietFailureCard
              icon="slowly-worse"
              title="Slowly worse"
              body="It drifts as the world changes around it."
            />
          </MotionChild>
        </Stagger>
      </Scene>

      <Card tone="brand" rotate={0}>
        <Takeaway>
          Because AI fails quietly, you can’t rely on crashes to tell you
          something’s wrong — you need instruments watching it.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

/** A monitor showing a loud crash. Red is the accent for the whole scene. */
function CrashScreen() {
  return (
    <svg viewBox="0 0 90 80" className="h-20 w-auto" aria-hidden="true">
      <rect x="8" y="6" width="74" height="52" rx="5" fill="var(--color-surface-elevated)" stroke="var(--color-bad)" strokeWidth="2.5" />
      <rect x="13" y="11" width="64" height="42" rx="2" fill="var(--color-bad-wash)" />
      <path d="M45 20 L33 42 L57 42 Z" fill="none" stroke="var(--color-bad)" strokeWidth="3" strokeLinejoin="round" />
      <line x1="45" y1="28" x2="45" y2="35" stroke="var(--color-bad)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="45" cy="38.5" r="1.6" fill="var(--color-bad)" />
      <rect x="36" y="58" width="18" height="12" fill="var(--color-bad)" />
      <rect x="26" y="70" width="38" height="5" rx="2" fill="var(--color-bad)" />
    </svg>
  );
}

function QuietFailureCard({
  icon,
  title,
  body,
}: {
  icon: "confidently-wrong" | "quietly-costly" | "slowly-worse";
  title: string;
  body: string;
}) {
  return (
    <div className="flex h-full flex-col gap-2 rounded-xl border border-ash bg-surface-elevated px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-bad-wash)] text-[var(--color-bad)]">
          <QuietIcon name={icon} />
        </span>
        <CardTitle>{title}</CardTitle>
      </div>
      <BulletList items={[body]} />
    </div>
  );
}

function QuietIcon({ name }: { name: "confidently-wrong" | "quietly-costly" | "slowly-worse" }) {
  const common = {
    viewBox: "0 0 24 24",
    className: "h-4 w-4",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (name === "confidently-wrong") {
    return (
      <svg {...common}>
        <path d="M12 3 L21 19 L3 19 Z" />
        <line x1="12" y1="10" x2="12" y2="14" />
        <circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (name === "quietly-costly") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M14.5 9 C14.5 7.3 13.4 6.5 12 6.5 C10.6 6.5 9.5 7.3 9.5 9 C9.5 12 14.5 11 14.5 14 C14.5 16 13.4 17.5 12 17.5 C10.6 17.5 9.5 16 9.5 14 M12 4.5 L12 6.5 M12 17.5 L12 19.5" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <polyline points="3,17 9,11 13,15 21,6" />
      <polyline points="15,6 21,6 21,12" />
    </svg>
  );
}
