import { Infographic, InfographicHeader, Card } from "./primitives";
import { CarShape, BikeShape, PictureCard, Operator, Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Layman course — Lesson 9: "Your first classifier".
 *
 * Layout: labelled picture cards → count them → probability → decision rule.
 * Faithful to Lesson 2.pdf slides 10-16: every 4-wheel sample is a car, every
 * 2-wheel sample is a bike, so all 4-wheel examples → car and all 2-wheel → bike, yielding the
 * rule "4 wheels → car, 2 wheels → bike". Picture-led throughout; the count
 * is shown as a visual tally of cards, not a table. Brand blue only.
 * No prose/questions (course rule).
 */
export function FirstClassifier() {
  return (
    <Infographic>
      <InfographicHeader
        title="Your first classifier"
        subtitle="Count the data → a probability → a decision rule"
      />

      {/* Step 1 — the labelled training set as picture cards */}
      <Scene caption="① Start with labelled examples">
        <Stagger className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-3">
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated p-3 text-center shadow-sm">
              <div className="mb-2 flex items-end justify-center gap-2">
                <CarShape className="!h-9" />
                <CarShape className="!h-9" />
                <CarShape className="!h-9" />
              </div>
              <span className="rounded-full bg-ink px-2.5 py-0.5 text-[11px] font-bold text-canvas">
                4 wheels → car
              </span>
            </div>
          </MotionChild>
          <MotionChild>
            <Operator>+</Operator>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated p-3 text-center shadow-sm">
              <div className="mb-2 flex items-end justify-center gap-2">
                <BikeShape className="!h-9" />
                <BikeShape className="!h-9" />
                <BikeShape className="!h-9" />
              </div>
              <span className="rounded-full bg-ink px-2.5 py-0.5 text-[11px] font-bold text-canvas">
                2 wheels → bike
              </span>
            </div>
          </MotionChild>
        </Stagger>
      </Scene>

      {/* Step 2 — count → probability, shown as a visual tally */}
      <Scene caption="② Count them → every 4-wheel is a car, every 2-wheel is a bike">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <ProbCard
            picture={<CarShape className="!h-10" />}
            condition="4 wheels"
            pct="100%"
            tone="good"
            note="all of them are cars"
          />
          <ProbCard
            picture={<BikeShape className="!h-10" />}
            condition="2 wheels"
            pct="100%"
            tone="good"
            note="all of them are bikes"
          />
        </div>
      </Scene>

      {/* Step 3 — a new sample → the rule decides */}
      <Scene caption="③ A new sample arrives — apply the rule">
        <Stagger className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
          <MotionChild>
            <div className="rounded-xl border border-dashed border-brand-deep bg-brand-wash px-4 py-3 text-center">
              <BikeShape className="!h-12" />
              <span className="mt-1 block text-[11px] font-bold text-brand-deep">2 wheels · ?</span>
            </div>
          </MotionChild>
          <MotionChild>
            <Operator>→</Operator>
          </MotionChild>
          <MotionChild>
            <PictureCard picture={<BikeShape className="!h-10" />} label="bike" tone="brand" />
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Every 2-wheel example was a bike &nbsp;⇒&nbsp; the rule says <span className="font-bold">bike</span>.
        </p>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          Count the data, pick the more likely class — that&apos;s a{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">classifier</span>{" "}
          from scratch.
        </p>
      </Card>
    </Infographic>
  );
}

/** A counting result shown as a picture + percentage. */
function ProbCard({
  picture,
  condition,
  pct,
  tone,
  note,
}: {
  picture: React.ReactNode;
  condition: string;
  pct: string;
  tone: "good" | "bad";
  note: string;
}) {
  const border = tone === "good" ? "border-good bg-good-wash" : "border-bad bg-bad-wash";
  const color = tone === "good" ? "text-good" : "text-bad";
  return (
    <div className={`rounded-xl border ${border} p-4 text-center shadow-sm`}>
      <div className="flex h-12 items-center justify-center">{picture}</div>
      <div className="mt-1 text-xs font-bold text-ink-soft">
        {condition}
      </div>
      <div className={`mt-0.5 text-xl font-bold ${color}`}>{pct}</div>
      <p className="mt-1 text-[11px] font-medium text-ink">{note}</p>
    </div>
  );
}
