import { Infographic, InfographicHeader, Card } from "./primitives";
import { CarShape, BikeShape, PictureCard, Operator, Scene, StoryMap } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Layman course — Lesson 9: "Your first classifier" (v2 Thread retrofit).
 *
 * Through-line stage: the card pile — the same labelled car/bike cards in the
 * same spot, gaining one layer per scene: laid out → counted (100% / 100%) →
 * a new dashed card walks in and takes the winning label. Beats: anchor
 * (labelled examples) → reveal (counting turns them into odds) → resolution
 * (the rule answers a newcomer). The counting is a visual tally of Asha's
 * cards, never a table.
 */
export function FirstClassifier() {
  return (
    <Infographic>
      <InfographicHeader
        title="Your first classifier"
        subtitle="Count the data → a probability → a decision rule"
      />

      <StoryMap
        steps={[
          { icon: <span aria-hidden="true">🗃️</span>, label: "Labelled cards pile up" },
          { icon: <span aria-hidden="true">🔢</span>, label: "Count them" },
          { icon: <span aria-hidden="true">💯</span>, label: "Clean 100% calls" },
          { icon: <span aria-hidden="true">✅</span>, label: "A newcomer sorted" },
        ]}
      />

      {/* Step 1 — the labelled training set as picture cards */}
      <Scene caption="So start with labelled examples — Asha's photo cards">
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
      <Scene variant="continue" caption="Then count them — every 4-wheel a car, every 2-wheel a bike">
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
      <Scene caption="That's why a new sample gets sorted — apply the rule">
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
