import {
  Infographic,
  InfographicHeader,
  Card,
} from "./primitives";

/**
 * Lesson infographic: "AI vs ML vs Deep Learning"
 *
 * The nested-circles concept is rendered as concentric SVG (scales with the
 * container). On phones the diagram sits above the tier stack; on >=lg they
 * sit side by side.
 */
export function AIVsMLVsDL() {
  return (
    <Infographic>
      <InfographicHeader
        title="AI vs Machine Learning vs Deep Learning"
        subtitle="Three nested worlds — each one a slice of the next"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-10">
        {/* Nested circles */}
        <div className="flex justify-center">
          <NestedCirclesSvg />
        </div>

        {/* Tier stack */}
        <div className="flex flex-col gap-3 sm:gap-4">
          <Tier
            num={1}
            title="Artificial Intelligence"
            text="Making machines smart — the whole field. Anything that lets a computer act &ldquo;intelligent&rdquo; lives here."
            tone="brandWash"
            rotate={-0.4}
          />
          <Tier
            num={2}
            title="Machine Learning"
            text="A subset of AI where machines learn patterns from data themselves — no hard-coded rules required."
            tone="brand"
            rotate={0.4}
          />
          <Tier
            num={3}
            title="Deep Learning"
            text="A subset of ML that uses multi-layer neural networks to learn from data."
            tone="brandDeep"
            rotate={-0.4}
          />
        </div>
      </div>

      {/* Takeaway */}
      <Card tone="white" rotate={0.3}>
        <h3 className="mb-3 flex items-center gap-2 text-base font-bold sm:text-lg">
          <span aria-hidden="true">💡</span> How to remember it
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          {[
            { tag: "AI", text: "The outermost circle — the goal of building smart machines." },
            { tag: "ML", text: "Inside AI — how we reach that goal by learning from data." },
            { tag: "DL", text: "Inside ML — one powerful technique: deep neural networks." },
          ].map((row) => (
            <div key={row.tag} className="border-l-[3px] border-brand py-1 pl-3">
              <b className="block text-sm font-bold sm:text-base">{row.tag}</b>
              <span className="text-xs font-medium leading-snug text-ink sm:text-[13px]">
                {row.text}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </Infographic>
  );
}

function Tier({
  num,
  title,
  text,
  tone,
  rotate,
}: {
  num: number;
  title: string;
  text: string;
  tone: "brandWash" | "brand" | "brandDeep";
  rotate: number;
}) {
  const toneClass = {
    brandWash: "bg-brand-wash border border-brand text-ink",
    brand: "bg-brand border border-brand text-ink",
    brandDeep: "bg-brand-deep border border-brand-deep text-canvas",
  }[tone];
  const numBg =
    tone === "brandDeep"
      ? "bg-canvas text-ink"
      : tone === "brand"
        ? "bg-surface-elevated text-ink"
        : "bg-brand-deep text-canvas";
  const bodyText = tone === "brandDeep" ? "text-canvas" : "text-ink";

  return (
    <div
      className={`rounded-2xl px-5 py-4 shadow-sm sm:px-6 sm:py-5 ${toneClass}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <div className="mb-1 flex items-center gap-3">
        <span
          className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${numBg}`}
        >
          {num}
        </span>
        <h3 className="text-lg font-extrabold sm:text-xl">{title}</h3>
      </div>
      <p
        className={`pl-10 text-sm font-medium leading-relaxed sm:text-[15px] ${bodyText}`}
        dangerouslySetInnerHTML={{ __html: text }}
      />
    </div>
  );
}

/** Concentric circles showing AI ⊃ ML ⊃ DL. Responsive via viewBox. */
function NestedCirclesSvg() {
  return (
    <svg
      viewBox="0 0 520 520"
      className="h-auto w-full max-w-md"
      role="img"
      aria-label="Concentric circles: Artificial Intelligence contains Machine Learning, which contains Deep Learning."
    >
      {/* AI ring */}
      <circle cx="260" cy="260" r="255" className="fill-brand-wash" stroke="var(--color-brand)" strokeWidth={2} strokeDasharray="6 6" />
      <text x="260" y="40" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize={14} fontWeight={800} letterSpacing={1.5} fill="var(--color-brand-deep)">
        ARTIFICIAL INTELLIGENCE
      </text>
      {/* ML ring */}
      <circle cx="260" cy="260" r="175" className="fill-brand" />
      <text x="260" y="110" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize={13} fontWeight={800} letterSpacing={1.5} fill="var(--color-canvas)">
        MACHINE LEARNING
      </text>
      {/* DL core */}
      <circle cx="260" cy="260" r="95" className="fill-brand-deep" />
      <text x="260" y="248" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize={30}>
        🧠
      </text>
      <text x="260" y="288" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize={13} fontWeight={800} letterSpacing={1.5} fill="var(--color-canvas)">
        DEEP LEARNING
      </text>
    </svg>
  );
}
