import { Infographic, InfographicHeader, Card, CardTitle, Takeaway, Tag } from "./primitives";
import { Scene, MachineFigure } from "./scenes";
import { Reveal } from "./motion";

/**
 * Harness Engineering Foundations — Lesson 2: "Why a Raw Model Isn't a Product".
 *
 * One model, two lives. Left: the bare model on a bench — forgets each turn,
 * can't act, knowledge frozen on training day. Right: the same model inside a
 * harness — remembers, looks things up, acts. The comparison reveals as one
 * block (not a stagger — it's a grid, not a sequence). Semantic bad marks only
 * the three gaps on the bench side; brand blue carries the harnessed side.
 */
export function RawModelVsProduct() {
  return (
    <Infographic>
      <InfographicHeader
        title="One model, two lives"
        subtitle="The same engine — on a bench, and inside a car."
      />

      {/* Scene 1 — the two lives side by side */}
      <Scene caption="① The exact same model, with and without a harness">
        <Reveal>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            <div className="rounded-xl border border-bad bg-surface-elevated p-4 text-center shadow-sm">
              <MachineFigure confused className="mx-auto" label="Bare model" />
              <ul className="mt-3 space-y-2 text-left">
                <GapRow bad label="Memory">every request starts from zero — no history</GapRow>
                <GapRow bad label="Actions">can write words, cannot do anything</GapRow>
                <GapRow bad label="Knowledge">frozen on training day — no news, no prices</GapRow>
              </ul>
            </div>
            <div className="rounded-xl border border-brand bg-brand-wash p-4 text-center shadow-sm">
              <MachineFigure className="mx-auto" label="Model in a harness" />
              <ul className="mt-3 space-y-2 text-left">
                <GapRow good label="Memory">the harness re-feeds the conversation</GapRow>
                <GapRow good label="Actions">the harness executes real tools</GapRow>
                <GapRow good label="Knowledge">the harness fetches today&apos;s facts</GapRow>
              </ul>
            </div>
          </div>
        </Reveal>
      </Scene>

      {/* Scene 2 — feel the gap in a live chat */}
      <Scene caption="② Message 12 of the same customer chat">
        <Reveal>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            <div className="rounded-xl border border-bad bg-surface-elevated p-4 text-center shadow-sm">
              <Tag tone="neutral">bare model</Tag>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-ink">
                &ldquo;Sorry — which order number? This is the first I&apos;ve heard of it.&rdquo;
              </p>
              <p className="mt-2 text-[11px] font-medium text-ink-soft">
                the number was message 1 — it fell outside the request
              </p>
            </div>
            <div className="rounded-xl border border-brand bg-surface-elevated p-4 text-center shadow-sm">
              <Tag tone="brand" dot>with harness</Tag>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-ink">
                &ldquo;Your order <span className="font-mono">#4821</span>? It shipped this morning — here&apos;s the tracking.&rdquo;
              </p>
              <p className="mt-2 text-[11px] font-medium text-ink-soft">
                history re-fed + a lookup tool run — same model
              </p>
            </div>
          </div>
        </Reveal>
      </Scene>

      {/* Scene 3 — fade to the idea */}
      <Scene caption="③ Where the magic actually lives">
        <div className="rounded-xl border border-brand bg-brand-wash px-4 py-4 text-center">
          <p className="text-sm font-medium leading-relaxed text-ink sm:text-base">
            When a product &ldquo;remembers&rdquo; or &ldquo;knows&rdquo; — that&apos;s not the model.
            That&apos;s the <span className="font-bold">harness closing the gaps</span> the raw model
            will always have.
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The takeaway</CardTitle>
        <Takeaway>
          A raw model is a component, not a product. Products ship harnesses — with a model inside.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

/** One labelled gap row — bad marks the bare-model gap, good marks the closed one. */
function GapRow({
  label,
  bad,
  good,
  children,
}: {
  label: string;
  bad?: boolean;
  good?: boolean;
  children: React.ReactNode;
}) {
  const tone = bad
    ? "text-[var(--color-bad)] border-[var(--color-bad)]"
    : good
      ? "text-brand border-brand"
      : "text-ink border-ash";
  return (
    <li className="flex items-start gap-2">
      <span
        aria-hidden="true"
        className={`mt-0.5 inline-block w-16 shrink-0 rounded-full border px-1.5 py-0.5 text-center text-[9px] font-bold uppercase tracking-wide ${tone}`}
      >
        {label}
      </span>
      <span className="text-[11px] font-medium leading-relaxed text-ink sm:text-xs">{children}</span>
    </li>
  );
}
