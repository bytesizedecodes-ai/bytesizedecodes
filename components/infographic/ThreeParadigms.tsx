import { Infographic, InfographicHeader, Card } from "./primitives";
import {
  CarShape,
  BikeShape,
  MachineFigure,
  PictureCard,
  Scene,
  StoryMap,
} from "./scenes";

/**
 * Layman course — Lesson 4: "The three families of ML" (v2 Thread retrofit).
 *
 * Through-line stage: the SAME car/bike objects, handled three different ways,
 * one scene each — labelled (supervised), labels stripped and groups formed
 * (unsupervised, the old labels left as struck-through ghosts), and the
 * machine trying actions for reward (reinforcement). Beats: anchor (with
 * labels) → tension (labels gone) → reveal (trial and error) → takeaway card.
 * The objects never change identity or color — only what the machine gets to
 * learn from.
 */
export function ThreeParadigms() {
  return (
    <Infographic>
      <InfographicHeader
        title="The three families of ML"
        subtitle="Different problems → different ways of learning"
      />

      <StoryMap
        steps={[
          { icon: <span aria-hidden="true">🏷️</span>, label: "Learning with labels" },
          { icon: <span aria-hidden="true">🚫</span>, label: "Labels taken away" },
          { icon: <span aria-hidden="true">⭐</span>, label: "Trial and error" },
        ]}
      />

      {/* SUPERVISED — labelled examples */}
      <Scene caption="So supervised learning — the examples come with labels">
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

      {/* UNSUPERVISED — same objects, no labels, grouped */}
      <Scene variant="continue" caption="But take the labels away — and it still groups them">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 text-[11px] font-bold">
            <span className="text-ink-faint line-through decoration-dotted">car · bike</span>
            <span className="rounded-full bg-brand-wash px-3 py-1 text-xs font-bold text-ink">
              no labels
            </span>
          </div>
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

      {/* REINFORCEMENT — MachineFigure + reward/penalty, no emoji */}
      <Scene variant="continue" caption="Then reinforcement — no labels at all, just trial and error">
        <div className="flex flex-col items-center gap-3">
          <span className="rounded-full bg-brand-wash px-3 py-1 text-xs font-bold text-ink">
            trial &amp; error
          </span>
          <div className="flex flex-col items-center gap-2">
            <MachineFigure className="!h-20" label="the agent" />
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-good px-2.5 py-1 text-[11px] font-bold text-canvas">
                ⭐ reward
              </span>
              <span className="rounded-full bg-bad px-2.5 py-1 text-[11px] font-bold text-canvas">
                ⛔ penalty
              </span>
            </div>
          </div>
          <p className="text-center text-xs font-medium text-ink">
            Rewards good moves, penalises bad ones.
          </p>
        </div>
      </Scene>

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
