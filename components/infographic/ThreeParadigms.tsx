import { Infographic, InfographicHeader, Card } from "./primitives";
import {
  CarShape,
  BikeShape,
  MachineFigure,
  PictureCard,
  Scene,
} from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Layman course — Lesson 4: "The three families of ML".
 *
 * Three side-by-side scenes, one per paradigm — but now all three use the SAME
 * car/bike objects, so a layman sees one consistent example handled three ways:
 *  - Supervised: labelled cars & bikes (we give the answers).
 *  - Unsupervised: the SAME shapes unlabelled, grouped into two clusters.
 *  - Reinforcement: the shared MachineFigure trying an action, getting reward
 *    or penalty (no 🤖 emoji, no green/red SVG arrows — brand blue + the
 *    semantic good/bad tokens used elsewhere).
 * Brand blue only. No prose/questions (course rule).
 *
 * Faithful to source: Lesson 1.pdf slides 28, 38-43, 44-51.
 */
export function ThreeParadigms() {
  return (
    <Infographic>
      <InfographicHeader
        title="The three families of ML"
        subtitle="Different problems → different ways of learning"
      />

      <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-4">
        {/* SUPERVISED — labelled examples */}
        <MotionChild>
          <Scene caption="① Supervised">
            <div className="flex flex-col items-center gap-3">
              <span className="rounded-full bg-brand-wash px-3 py-1 text-xs font-bold text-ink">
                with labels
              </span>
              <div className="grid grid-cols-2 gap-2">
                <PictureCard picture={<CarShape className="!h-10" />} label="car" tone="brand" />
                <PictureCard picture={<BikeShape className="!h-10" />} label="bike" tone="brand" />
              </div>
              <p className="text-center text-xs font-medium text-ink">
                We give the answers during training.
              </p>
            </div>
          </Scene>
        </MotionChild>

        {/* UNSUPERVISED — same objects, no labels, grouped */}
        <MotionChild>
          <Scene caption="② Unsupervised">
            <div className="flex flex-col items-center gap-3">
              <span className="rounded-full bg-brand-wash px-3 py-1 text-xs font-bold text-ink">
                no labels
              </span>
              <div className="grid w-full max-w-[14rem] grid-cols-2 gap-2">
                <div className="rounded-xl border border-dashed border-brand-muted bg-brand-wash/50 p-2">
                  <div className="flex items-center justify-center gap-1">
                    <CarShape className="!h-8" />
                    <CarShape className="!h-8" />
                  </div>
                </div>
                <div className="rounded-xl border border-dashed border-brand-muted bg-brand-wash/50 p-2">
                  <div className="flex items-center justify-center gap-1">
                    <BikeShape className="!h-8" />
                    <BikeShape className="!h-8" />
                  </div>
                </div>
              </div>
              <p className="text-center text-xs font-medium text-ink">
                It groups similar things together — on its own.
              </p>
            </div>
          </Scene>
        </MotionChild>

        {/* REINFORCEMENT — MachineFigure + reward/penalty, no emoji */}
        <MotionChild>
          <Scene caption="③ Reinforcement">
            <div className="flex flex-col items-center gap-3">
              <span className="rounded-full bg-brand-wash px-3 py-1 text-xs font-bold text-ink">
                trial &amp; error
              </span>
              <div className="flex flex-col items-center gap-2">
                <MachineFigure className="!h-20" />
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-good px-2.5 py-1 text-[11px] font-bold text-white">
                    ⭐ reward
                  </span>
                  <span className="rounded-full bg-bad px-2.5 py-1 text-[11px] font-bold text-white">
                    ⛔ penalty
                  </span>
                </div>
              </div>
              <p className="text-center text-xs font-medium text-ink">
                Rewards good moves, penalises bad ones.
              </p>
            </div>
          </Scene>
        </MotionChild>
      </Stagger>

      {/* One-line summary */}
      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          Labels? <span className="font-extrabold">Supervised</span>. No labels?{" "}
          <span className="font-extrabold">Unsupervised</span>. Trial &amp; error?{" "}
          <span className="font-extrabold">Reinforcement</span>.
        </p>
      </Card>
    </Infographic>
  );
}
