import { Infographic, InfographicHeader, Card } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Layman course — Lesson: "ML you already use every day".
 *
 * The "why should I care" hook that was missing. A picture-led gallery of five
 * daily-life ML features — spam filter, recommendations, face unlock, Maps
 * ETA, autocorrect — each with a drawn icon and a one-line note on which ML
 * family it uses. Ties the abstract concepts to the learner's phone. Brand
 * blue + semantic good/bad only. No prose/questions (course rule).
 */
export function MLInYourPhone() {
  return (
    <Infographic>
      <InfographicHeader
        title="ML you already use"
        subtitle="You&apos;ve been using machine learning all day — here&apos;s where"
      />

      {/* Step 1 — a gallery of five daily ML features */}
      <Scene caption="Five features on your phone that are machine learning">
        <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <MotionChild>
            <AppCard
              icon={<SpamIcon />}
              name="Spam filter"
              detail="sorts mail by learning from what you mark as junk"
              family="supervised"
            />
          </MotionChild>
          <MotionChild>
            <AppCard
              icon={<RecommendIcon />}
              name="Recommendations"
              detail="Netflix / YouTube suggest what you&apos;ll like next"
              family="supervised"
            />
          </MotionChild>
          <MotionChild>
            <AppCard
              icon={<FaceIcon />}
              name="Face unlock"
              detail="recognises your face from millions of pixel patterns"
              family="supervised"
            />
          </MotionChild>
          <MotionChild>
            <AppCard
              icon={<MapIcon />}
              name="Maps ETA"
              detail="predicts travel time from past traffic patterns"
              family="supervised"
            />
          </MotionChild>
          <MotionChild>
            <AppCard
              icon={<KeyboardIcon />}
              name="Autocorrect"
              detail="guesses your next word from how people usually write"
              family="supervised"
            />
          </MotionChild>
        </Stagger>
      </Scene>

      {/* Step 2 — one shared shape: all learn from your data */}
      <Scene caption="They look different, but they share one shape">
        <div className="rounded-xl border border-brand bg-brand-wash px-4 py-4 text-center">
          <div className="font-mono text-sm font-bold text-ink sm:text-base">
            your past behaviour <span className="text-brand-deep">→</span> a model{" "}
            <span className="text-brand-deep">→</span> a prediction for you
          </div>
          <p className="mt-2 text-xs font-medium text-ink">
            The spam filter, the recommender, and face unlock all follow this same loop.
          </p>
        </div>
      </Scene>

      {/* Step 3 — they get better the more you use them */}
      <Scene caption="And they improve as you keep using them">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl border border-ash bg-surface-elevated px-2 py-3 shadow-sm">
            <div className="text-2xl" aria-hidden="true">1️⃣</div>
            <div className="mt-1 text-[11px] font-bold text-ink">you use it</div>
          </div>
          <div className="rounded-xl border border-ash bg-surface-elevated px-2 py-3 shadow-sm">
            <div className="text-2xl" aria-hidden="true">2️⃣</div>
            <div className="mt-1 text-[11px] font-bold text-ink">it gathers examples</div>
          </div>
          <div className="rounded-xl border border-ash bg-surface-elevated px-2 py-3 shadow-sm">
            <div className="text-2xl" aria-hidden="true">3️⃣</div>
            <div className="mt-1 text-[11px] font-bold text-ink">it gets more accurate</div>
          </div>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          ML isn&apos;t somewhere else — it&apos;s already in your{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">pocket</span>.
        </p>
      </Card>
    </Infographic>
  );
}

/** A feature card: drawn icon + name + detail + ML-family tag. */
function AppCard({
  icon,
  name,
  detail,
  family,
}: {
  icon: React.ReactNode;
  name: string;
  detail: string;
  family: "supervised" | "unsupervised" | "reinforcement";
}) {
  const tag =
    family === "supervised"
      ? "bg-brand-wash text-brand-deep"
      : family === "unsupervised"
        ? "bg-warm-wash text-ink"
        : "bg-good-wash text-good";
  return (
    <div className="flex items-start gap-3 rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-wash">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-bold text-ink">{name}</span>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${tag}`}>{family}</span>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-ink-soft">{detail}</p>
      </div>
    </div>
  );
}

/* --- drawn icons (inline SVG, brand palette) --- */

function SpamIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true" fill="none" stroke="var(--color-brand-deep)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="8" width="24" height="17" rx="2" />
      <path d="M4 10 L16 19 L28 10" />
    </svg>
  );
}

function RecommendIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true" fill="none" stroke="var(--color-brand-deep)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="6" width="20" height="14" rx="2" />
      <path d="M12 24 L16 20 L20 24" />
      <path d="M28 11 L28 22 Q28 24 26 24 L24 24" />
    </svg>
  );
}

function FaceIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true" fill="none" stroke="var(--color-brand-deep)" strokeWidth="2" strokeLinecap="round">
      <rect x="5" y="4" width="22" height="24" rx="4" />
      <path d="M5 13 Q9 11 13 13" />
      <path d="M19 13 Q23 11 27 13" />
      <circle cx="11" cy="16" r="1.2" fill="var(--color-brand-deep)" />
      <circle cx="21" cy="16" r="1.2" fill="var(--color-brand-deep)" />
      <path d="M11 21 Q16 25 21 21" />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true" fill="none" stroke="var(--color-brand-deep)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 10 L12 7 L20 10 L27 7 L27 24 L20 27 L12 24 L5 27 Z" />
      <path d="M12 7 L12 24" />
      <path d="M20 10 L20 27" />
    </svg>
  );
}

function KeyboardIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true" fill="none" stroke="var(--color-brand-deep)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="9" width="24" height="14" rx="2" />
      <path d="M9 13 H9.01 M14 13 H14.01 M19 13 H19.01 M24 13 H24.01 M9 18 H23" />
    </svg>
  );
}
