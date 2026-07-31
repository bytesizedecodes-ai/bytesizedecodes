import { Infographic, InfographicHeader } from "./primitives";
import { CarShape, BikeShape, PictureCard, Scene } from "./scenes";

/**
 * Layman course — Lesson 4: "The three families of ML".
 *
 * Layout: three side-by-side illustrated scenes, one per paradigm. Each scene
 * shows the *visual essence* of that family — labelled examples (supervised),
 * a cluster (unsupervised), a reward loop (reinforcement). Brand blue only.
 * No prose/questions (course rule).
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-4">
        {/* SUPERVISED */}
        <Scene caption="① Supervised">
          <div className="flex flex-col items-center gap-3">
            <span className="rounded-full bg-brand-wash px-3 py-1 text-xs font-bold text-ink">
              with labels
            </span>
            <div className="grid grid-cols-2 gap-2">
              <PictureCard picture={<CarShape />} label="car" tone="brand" />
              <PictureCard picture={<BikeShape />} label="bike" tone="brand" />
            </div>
            <p className="text-center text-xs font-medium text-ink">
              We give the answers during training.
            </p>
          </div>
        </Scene>

        {/* UNSUPERVISED */}
        <Scene caption="② Unsupervised">
          <div className="flex flex-col items-center gap-3">
            <span className="rounded-full bg-brand-wash px-3 py-1 text-xs font-bold text-ink">
              no labels
            </span>
            {/* A clustering picture: scattered dots grouped into 2 clusters */}
            <svg viewBox="0 0 200 140" className="h-auto w-full max-w-[14rem]" aria-hidden="true">
              <ellipse cx="60" cy="50" rx="42" ry="32" fill="none" stroke="#6888c8" strokeWidth="2" strokeDasharray="4 3" />
              <ellipse cx="145" cy="90" rx="42" ry="32" fill="none" stroke="#6888c8" strokeWidth="2" strokeDasharray="4 3" />
              {/* cluster A dots */}
              <circle cx="48" cy="42" r="4" fill="#7898c8" />
              <circle cx="70" cy="38" r="4" fill="#7898c8" />
              <circle cx="58" cy="60" r="4" fill="#7898c8" />
              <circle cx="42" cy="55" r="4" fill="#7898c8" />
              <circle cx="74" cy="56" r="4" fill="#7898c8" />
              {/* cluster B dots */}
              <circle cx="138" cy="80" r="4" fill="#6888c8" />
              <circle cx="155" cy="78" r="4" fill="#6888c8" />
              <circle cx="145" cy="100" r="4" fill="#6888c8" />
              <circle cx="160" cy="95" r="4" fill="#6888c8" />
              <circle cx="132" cy="98" r="4" fill="#6888c8" />
            </svg>
            <p className="text-center text-xs font-medium text-ink">
              It groups similar things together.
            </p>
          </div>
        </Scene>

        {/* REINFORCEMENT */}
        <Scene caption="③ Reinforcement">
          <div className="flex flex-col items-center gap-3">
            <span className="rounded-full bg-brand-wash px-3 py-1 text-xs font-bold text-ink">
              trial &amp; error
            </span>
            {/* The reward loop: agent → action → reward/penalty → back to agent */}
            <svg viewBox="0 0 200 140" className="h-auto w-full max-w-[14rem]" aria-hidden="true">
              {/* nodes */}
              <circle cx="100" cy="32" r="18" fill="#7898c8" />
              <text x="100" y="36" textAnchor="middle" fontSize="14" fill="#080808" fontWeight="bold">🤖</text>
              <rect x="20" y="92" width="50" height="36" rx="6" fill="#edf5f0" stroke="#5f9e77" strokeWidth="2" />
              <text x="45" y="115" textAnchor="middle" fontSize="14">👍</text>
              <rect x="130" y="92" width="50" height="36" rx="6" fill="#f9efee" stroke="#c1706b" strokeWidth="2" />
              <text x="155" y="115" textAnchor="middle" fontSize="14">👎</text>
              {/* arrows */}
              <path d="M88 46 L48 90" stroke="#5f9e77" strokeWidth="2" fill="none" markerEnd="url(#arrowGood)" />
              <path d="M112 46 L152 90" stroke="#c1706b" strokeWidth="2" fill="none" markerEnd="url(#arrowBad)" />
              <path d="M70 110 Q100 130 130 110" stroke="#6888c8" strokeWidth="2" fill="none" strokeDasharray="4 3" markerEnd="url(#arrowBrand)" />
              <defs>
                <marker id="arrowGood" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 Z" fill="#5f9e77" /></marker>
                <marker id="arrowBad" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 Z" fill="#c1706b" /></marker>
                <marker id="arrowBrand" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 Z" fill="#6888c8" /></marker>
              </defs>
            </svg>
            <p className="text-center text-xs font-medium text-ink">
              Rewards good moves, penalises bad ones.
            </p>
          </div>
        </Scene>
      </div>

      {/* One-line summary */}
      <div className="rounded-2xl bg-brand px-5 py-4 text-center shadow-sm">
        <p className="text-sm font-bold leading-relaxed text-ink sm:text-base">
          Labels? <span className="font-extrabold">Supervised</span>. No labels?{" "}
          <span className="font-extrabold">Unsupervised</span>. Trial &amp; error?{" "}
          <span className="font-extrabold">Reinforcement</span>.
        </p>
      </div>
    </Infographic>
  );
}
