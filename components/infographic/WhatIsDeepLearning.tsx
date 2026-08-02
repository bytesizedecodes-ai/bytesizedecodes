import {
  Infographic,
  InfographicHeader,
  Card,
  CardTitle,
  BulletList,
} from "./primitives";

/**
 * Lesson infographic: "What is Deep Learning?"
 *
 * The neural-network SVG has a responsive viewBox, so it scales down on phones
 * while staying crisp. The flow steps stack vertically on mobile.
 */
export function WhatIsDeepLearning() {
  return (
    <Infographic>
      <InfographicHeader
        title="What is Deep Learning?"
        subtitle="The engine behind modern AI — multi-layer neural networks"
      />

      {/* Definition */}
      <Card tone="brand" rotate={-0.3}>
        <div className="flex items-start gap-3 sm:gap-4">
          <span className="text-3xl sm:text-4xl" aria-hidden="true">🕸️</span>
          <p className="text-base font-semibold leading-snug sm:text-lg">
            <strong className="font-extrabold">Deep Learning</strong> is a
            subfield of Machine Learning that uses{" "}
            <strong className="font-extrabold">Artificial Neural Networks</strong>{" "}
            — many layers of them — to learn patterns directly from data.
          </p>
        </div>
      </Card>

      {/* Neural network diagram */}
      <Card tone="white" rotate={0.3}>
        <h3 className="mb-2 text-center text-base font-bold sm:mb-3 sm:text-lg">
          A Neural Network, drawn out
        </h3>
        <NetworkSvg />
        <div className="mt-2 flex flex-col items-center justify-between gap-1 text-center text-[11px] font-semibold uppercase tracking-wide text-ink sm:flex-row sm:text-xs">
          <span>Data in</span>
          <span className="hidden sm:inline">·</span>
          <span>Where the &ldquo;deep&rdquo; happens</span>
          <span className="hidden sm:inline">·</span>
          <span>Prediction out</span>
        </div>
      </Card>

      {/* Flow */}
      <div className="rounded-2xl border border-dashed border-brand bg-brand-wash px-4 py-4 sm:px-6">
        <ol className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-center sm:gap-2">
          {[
            { step: "Step 1", text: "Feed in data" },
            { step: "Step 2", text: "Pass through layers" },
            { step: "Step 3", text: "Each layer learns a feature" },
            { step: "Step 4", text: "Output a prediction" },
          ].map((item, i, arr) => (
            <li key={item.text} className="contents">
              <div className="rounded-lg border border-brand bg-surface-elevated px-4 py-2.5 text-center">
                <span className="block text-[10px] font-semibold uppercase tracking-wide text-ink sm:text-[11px]">
                  {item.step}
                </span>
                <span className="text-sm font-bold text-ink">{item.text}</span>
              </div>
              {i < arr.length - 1 && (
                <span
                  className="mx-auto text-xl font-bold text-ink sm:mx-0"
                  aria-hidden="true"
                >
                  <span className="sm:hidden">↓</span>
                  <span className="hidden sm:inline">→</span>
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>

      {/* Why grid */}
      <h3 className="text-center text-base font-bold sm:text-lg">
        Why &ldquo;deep&rdquo;? And why does it matter?
      </h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        <Card tone="white" rotate={-0.4}>
          <CardTitle icon="🧱">&ldquo;Deep&rdquo; = many hidden layers</CardTitle>
          <p className="mb-2 text-sm font-medium leading-relaxed text-ink">
            A traditional network has one or two layers. A{" "}
            <strong className="font-bold">deep</strong> network stacks many —
            each layer learning something more abstract than the one before.
          </p>
          <BulletList
            items={[
              "Early layers spot edges & colours",
              "Middle layers spot shapes & parts",
              "Later layers spot full objects",
            ]}
          />
        </Card>
        <Card tone="brand" rotate={0.4}>
          <CardTitle icon="🚀">Why it wins on hard tasks</CardTitle>
          <p className="mb-2 text-sm font-medium leading-relaxed text-ink">
            Deep networks learn features straight from raw data — no manual
            feature engineering. That&apos;s why they dominate the hard stuff.
          </p>
          <BulletList
            onBrand
            items={[
              "Image recognition (faces, scans)",
              "Language — ChatGPT, translation",
              "Speech → text",
              "Self-driving perception",
            ]}
          />
        </Card>
      </div>
    </Infographic>
  );
}

/** The neural-network diagram. Pure SVG, scales with its container. */
function NetworkSvg() {
  // Node positions. input x=130, h1 x=360, h2 x=590, output x=820.
  const input = [50, 120, 200, 270];
  const hidden = [40, 100, 160, 220, 280];
  const output = [100, 160, 220];

  const link = (x1: number, ys: number[], x2: number, xs: number[]) =>
    ys.flatMap((y) => xs.map((x) => ({ x1, y1: y, x2, y2: x })));

  const links = [
    ...link(130, input, 360, hidden),
    ...link(360, hidden, 590, hidden),
    ...link(590, hidden, 820, output),
  ];

  return (
    <svg
      viewBox="0 0 950 320"
      className="h-auto w-full"
      role="img"
      aria-label="A neural network: four input nodes, two columns of five hidden nodes, and three output nodes, fully connected."
    >
      <g stroke="var(--color-brand)" strokeWidth={1.2} opacity={0.35}>
        {links.map((l, i) => (
          <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />
        ))}
      </g>
      {/* "many layers" hint between h2 and output */}
      <text
        x="705"
        y="168"
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontSize={34}
        fontWeight={700}
        fill="var(--color-brand-deep)"
      >
        ···
      </text>

      {/* input nodes */}
      {input.map((y) => (
        <circle key={`i${y}`} cx={130} cy={y} r={16} className="fill-brand-wash stroke-brand-deep" strokeWidth={2} />
      ))}
      {/* hidden nodes */}
      {[360, 590].flatMap((x) =>
        hidden.map((y) => (
          <circle key={`h${x}-${y}`} cx={x} cy={y} r={16} className="fill-white stroke-brand-deep" strokeWidth={2} />
        )),
      )}
      {/* output nodes */}
      {output.map((y) => (
        <circle key={`o${y}`} cx={820} cy={y} r={18} className="fill-brand-deep stroke-brand-deep" strokeWidth={2} />
      ))}

      {/* layer captions */}
      <text x="130" y="312" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize={13} fontWeight={700} fill="var(--screen)">
        Input Layer
      </text>
      <text x="475" y="312" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize={13} fontWeight={700} fill="var(--screen)">
        Hidden Layers
      </text>
      <text x="820" y="312" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize={13} fontWeight={700} fill="var(--screen)">
        Output Layer
      </text>
    </svg>
  );
}
