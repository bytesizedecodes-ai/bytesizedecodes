import {
  Infographic,
  InfographicHeader,
  Card,
  CardTitle,
} from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild, Reveal } from "./motion";

/**
 * Lesson infographic: "What is Deep Learning?" (intermediate course).
 *
 * Two changes from the prior version:
 *  1. BUG FIX: the layer captions used `fill="var(--screen)"` (a window/screen
 *     fill token, not a text token — skill §3 cheat-sheet). On the white card
 *     `--screen` is #080808 in light theme, so labels were barely visible; in
 *     dark theme `--screen` flips but the card flips too, so they'd vanish.
 *     Switched to the ink text token so they read in both themes.
 *  2. THE AHA (P7): the edge → shape → object hierarchy was a static BulletList.
 *     It is THE insight of the lesson ("representations get more abstract per
 *     layer"). Now it's a Stagger — each layer resolves one beat. Plus a
 *     one-line "representation learning" formal label (intermediate register).
 *
 * Picture-led vocabulary: Scene + Stagger + MotionChild (skill §4, §5).
 */
export function WhatIsDeepLearning() {
  return (
    <Infographic>
      <InfographicHeader
        title="What is Deep Learning?"
        subtitle="Multi-layer neural networks that learn features straight from data"
      />

      {/* Definition */}
      <Card tone="brand" rotate={-0.3}>
        <p className="text-base font-semibold leading-snug sm:text-lg">
          <strong className="font-extrabold">Deep Learning</strong> is a subfield
          of ML that stacks{" "}
          <strong className="font-extrabold">many layers</strong> of neural
          network — &ldquo;deep&rdquo; just counts the layers.
        </p>
      </Card>

      {/* The network diagram. Captions now use a TEXT token, not --screen. */}
      <Card tone="white" rotate={0.3}>
        <h3 className="mb-2 text-center text-base font-bold sm:mb-3 sm:text-lg">
          A neural network, drawn out
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

      {/* THE AHA — the hierarchy of representations, revealed layer by layer (P7). */}
      <Scene caption="The key idea: each layer builds a more abstract representation">
        <Stagger className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-3">
          <MotionChild>
            <LayerBox step="Layer 1" find="edges &amp; colours" />
          </MotionChild>
          <MotionChild>
            <span className="mx-auto text-2xl font-bold text-ink sm:mx-0">→</span>
          </MotionChild>
          <MotionChild>
            <LayerBox step="Layer 2" find="shapes &amp; parts" />
          </MotionChild>
          <MotionChild>
            <span className="mx-auto text-2xl font-bold text-ink sm:mx-0">→</span>
          </MotionChild>
          <MotionChild>
            <LayerBox step="Layer N" find="whole objects" accent />
          </MotionChild>
        </Stagger>
        <Reveal>
          <p className="mt-4 rounded-xl border border-brand bg-brand-wash px-4 py-3 text-center text-sm font-semibold text-ink sm:text-base">
            No one told the network what an &ldquo;edge&rdquo; or a &ldquo;shape&rdquo;
            is — each layer <strong className="font-extrabold">discovers</strong> the
            representation that helps the next one. That&rsquo;s{" "}
            <em>representation learning</em>.
          </p>
        </Reveal>
      </Scene>

      {/* Why it wins — kept, tightened. */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        <Card tone="white" rotate={-0.4}>
          <CardTitle>&ldquo;Deep&rdquo; = many hidden layers</CardTitle>
          <p className="text-sm font-medium leading-relaxed text-ink">
            A shallow network has one or two; a deep one stacks dozens. More
            layers &rarr; more abstract representations &rarr; harder tasks within reach.
          </p>
        </Card>
        <Card tone="brand" rotate={0.4}>
          <CardTitle>Why it wins on hard tasks</CardTitle>
          <p className="text-sm font-medium leading-relaxed text-ink">
            Features are learned from raw data — no hand-engineering. That&rsquo;s
            why DL dominates perception: images, speech, translation, and the
            language models behind ChatGPT.
          </p>
        </Card>
      </div>
    </Infographic>
  );
}

/* ------------------------------------------------------------------ */
/* Local helpers                                                        */
/* ------------------------------------------------------------------ */

function LayerBox({
  step,
  find,
  accent = false,
}: {
  step: string;
  find: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`flex min-w-[8rem] flex-col items-center rounded-xl border px-5 py-3.5 text-center shadow-sm ${
        accent
          ? "border-brand bg-brand-wash"
          : "border-ash bg-surface-elevated"
      }`}
    >
      <span className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">
        {step}
      </span>
      <span className="mt-1 text-sm font-bold text-ink sm:text-base">finds</span>
      <span className="text-sm font-bold text-ink sm:text-base" dangerouslySetInnerHTML={{ __html: find }} />
    </div>
  );
}

/** The neural-network diagram. Pure SVG, scales with its container.
 *  Layer captions use var(--color-ink) so they read in BOTH themes
 *  (--screen is a window fill, not a text token). */
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
          <circle key={`h${x}-${y}`} cx={x} cy={y} r={16} className="fill-surface-elevated stroke-brand-deep" strokeWidth={2} />
        )),
      )}
      {/* output nodes */}
      {output.map((y) => (
        <circle key={`o${y}`} cx={820} cy={y} r={18} className="fill-brand-deep stroke-brand-deep" strokeWidth={2} />
      ))}

      {/* layer captions — text token, not --screen */}
      <text x="130" y="312" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize={13} fontWeight={700} fill="var(--color-ink)">
        Input Layer
      </text>
      <text x="475" y="312" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize={13} fontWeight={700} fill="var(--color-ink)">
        Hidden Layers
      </text>
      <text x="820" y="312" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize={13} fontWeight={700} fill="var(--color-ink)">
        Output Layer
      </text>
    </svg>
  );
}
