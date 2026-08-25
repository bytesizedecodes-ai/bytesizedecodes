import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "./primitives";
import { Scene, StoryMap } from "./scenes";

/**
 * RAG Engineering Foundations — Lesson 3: "What Are Embeddings?" (v2 Thread
 * retrofit)
 *
 * Through-line stage: the meaning-map town — one SVG, one geography, four
 * streets of ZapKart's help pages. Scenes are states of the SAME map: streets
 * plain → the key pair revealed (no shared word, same street) → a new text
 * arriving and getting its address (the fade, drawn ON the map) → the E-4821
 * code pin lost between streets. `MeaningTown` is exported so lesson 4 drops
 * Ravi's question onto the identical map — cross-lesson stage continuity.
 */
export function WhatAreEmbeddings() {
  return (
    <Infographic>
      <InfographicHeader
        title="A map where meaning has an address"
        subtitle="The trick that makes search understand questions it has never seen."
      />

      <StoryMap
        steps={[
          { icon: <span aria-hidden="true">🗺️</span>, label: "A town of meanings" },
          { icon: <span aria-hidden="true">🤝</span>, label: "Neighbors, no shared words" },
          { icon: <span aria-hidden="true">🏠</span>, label: "Any text gets an address" },
          { icon: <span aria-hidden="true">⚠️</span>, label: "Codes have no street" },
        ]}
      />

      {/* Anchor — the town, streets named by meaning */}
      <Scene caption="So picture ZapKart's help pages as a town — streets named by what pages mean.">
        <MeaningTown stage="streets" />
      </Scene>

      {/* Reveal — the pair: no shared word, same street */}
      <Scene variant="continue" caption="But 'refund policy' and 'money-back guarantee' share no word — same street.">
        <MeaningTown stage="pair" />
      </Scene>

      {/* Fade — a new text arrives and gets its address, drawn on the same map */}
      <Scene variant="continue" caption="Then any text gets an address the same way — nobody writes them by hand.">
        <MeaningTown stage="fade" />
      </Scene>

      {/* Limit — the code with no street */}
      <Scene variant="continue" caption="But an exact code like 'E-4821' has no street — neighbors can't help it.">
        <MeaningTown stage="code" />
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The takeaway</CardTitle>
        <Takeaway>
          An embedding is a text's address on a meaning map. Similar meanings become
          neighbors — even when they share not a single word.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

/**
 * The meaning-map town — the shared stage of lessons 3 and 4. One geography,
 * five states: `streets` (plain), `pair` (the no-shared-word neighbors
 * accented), `fade` (a new text arrives and gets its address — the arrival
 * strip extends the stage downward), `question` (Ravi's question pin —
 * lesson 4), `code` (the exact code lost between streets). Theme-safe tokens
 * only; brand marks the one focal change per state.
 */
export function MeaningTown({
  stage,
  className = "",
}: {
  stage: "streets" | "pair" | "fade" | "question" | "code";
  className?: string;
}) {
  const dim = stage === "code";
  const withPair = stage !== "streets";
  const aria =
    stage === "streets"
      ? "A town of meanings: ZapKart's pages on streets named by what they mean — money and refunds, shipping, account, careers"
      : stage === "pair"
        ? "The same town, now showing two phrases — refund policy and money-back guarantee — as neighbors on the refunds street despite sharing no word"
        : stage === "fade"
          ? "The same town, with a new text arriving at its edge and getting a house with an address — a list of numbers — on the refunds street"
          : stage === "question"
            ? "The same town with Ravi's question — can I get my money back — pinned on the refunds street between the refund pages"
            : "The same town dimmed, with the exact error code E-4821 floating between streets — it has no neighborhood of its own";

  return (
    <svg
      viewBox={stage === "fade" ? "0 0 320 258" : "0 0 320 200"}
      className={`mx-auto w-full max-w-lg ${className}`}
      role="img"
      aria-label={aria}
    >
      <g opacity={dim ? 0.45 : 1}>
        {/* neighborhood washes — refunds street carries the accent wash only when it carries the change */}
        <rect x="14" y="14" width="140" height="86" rx="10"
          fill={withPair ? "var(--color-brand-wash)" : "var(--color-canvas)"}
          stroke="var(--color-ash)" />
        <rect x="166" y="14" width="140" height="86" rx="10" fill="var(--color-canvas)" stroke="var(--color-ash)" />
        <rect x="14" y="110" width="140" height="76" rx="10" fill="var(--color-canvas)" stroke="var(--color-ash)" />
        <rect x="166" y="110" width="140" height="76" rx="10" fill="var(--color-canvas)" stroke="var(--color-ash)" />
        <text x="84" y="30" textAnchor="middle" fontSize="9" fontWeight="bold" fill="var(--color-brand-deep)">money &amp; refunds street</text>
        <text x="236" y="30" textAnchor="middle" fontSize="9" fontWeight="bold" fill="var(--color-ink-soft)">shipping street</text>
        <text x="84" y="126" textAnchor="middle" fontSize="9" fontWeight="bold" fill="var(--color-ink-soft)">account street</text>
        <text x="236" y="126" textAnchor="middle" fontSize="9" fontWeight="bold" fill="var(--color-ink-soft)">careers street</text>

        {/* plain neighbors */}
        <circle cx="216" cy="56" r="4" fill="var(--color-ink-faint)" />
        <circle cx="262" cy="64" r="4" fill="var(--color-ink-faint)" />
        <text x="239" y="82" textAnchor="middle" fontSize="8" fill="var(--color-ink-soft)">&ldquo;delivery times&rdquo; · &ldquo;shipping costs&rdquo;</text>
        <circle cx="62" cy="152" r="4" fill="var(--color-ink-faint)" />
        <circle cx="112" cy="158" r="4" fill="var(--color-ink-faint)" />
        <text x="87" y="176" textAnchor="middle" fontSize="8" fill="var(--color-ink-soft)">&ldquo;change email&rdquo; · &ldquo;update password&rdquo;</text>

        {/* the refunds street residents — labeled from the `pair` state on */}
        {stage === "streets" ? (
          <>
            <circle cx="52" cy="56" r="4" fill="var(--color-ink-faint)" />
            <circle cx="118" cy="62" r="4" fill="var(--color-ink-faint)" />
            <text x="85" y="50" textAnchor="middle" fontSize="8" fill="var(--color-ink-soft)">refund pages live here</text>
          </>
        ) : (
          <>
            <circle cx="52" cy="56" r="5" fill={stage === "question" ? "var(--color-ink-faint)" : "var(--color-brand)"} />
            <text x="52" y="76" textAnchor="middle" fontSize="8.5" fill="var(--color-ink)">&ldquo;refund policy&rdquo;</text>
            <circle cx="118" cy="62" r="5" fill={stage === "question" ? "var(--color-ink-faint)" : "var(--color-brand)"} />
            <text x="118" y="82" textAnchor="middle" fontSize="8.5" fill="var(--color-ink)">&ldquo;money-back guarantee&rdquo;</text>
            <line x1="57" y1="57" x2="113" y2="61" stroke="var(--color-brand)" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x="85" y="48" textAnchor="middle" fontSize="8" fontWeight="bold" fill="var(--color-brand-deep)">
              {stage === "question" ? "the question lands here" : "no shared word — same street"}
            </text>
          </>
        )}

        {/* Ravi's question pin — the ONE new element of the `question` state */}
        {stage === "question" && (
          <>
            <circle cx="85" cy="60" r="7" fill="none" stroke="var(--color-brand)" strokeWidth="2" />
            <circle cx="85" cy="60" r="3" fill="var(--color-brand)" />
            <text x="85" y="40" textAnchor="middle" fontSize="8.5" fontWeight="bold" fill="var(--color-brand-deep)">
              💬 &ldquo;money back?&rdquo; — Ravi
            </text>
          </>
        )}
      </g>

      {/* the lost code — the ONE new element of the `code` state */}
      {stage === "code" && (
        <>
          <circle cx="160" cy="140" r="8" fill="var(--color-canvas)" stroke="var(--color-brand)" strokeWidth="2" strokeDasharray="3 3" />
          <text x="160" y="143.5" textAnchor="middle" fontSize="7" fontWeight="bold" fill="var(--color-brand-deep)">E-4821</text>
          <text x="160" y="162" textAnchor="middle" fontSize="8" fontWeight="bold" fill="var(--color-ink)">an exact code — no street of its own</text>
          <text x="160" y="174" textAnchor="middle" fontSize="7.5" fill="var(--color-ink-soft)">neighbors can&apos;t help; it must be matched literally</text>
        </>
      )}

      {/* the arrival strip — the `fade` state's ONE accented change, extending the stage */}
      {stage === "fade" && (
        <g>
          <rect x="24" y="206" width="118" height="26" rx="8" fill="var(--color-canvas)" stroke="var(--color-ash)" />
          <text x="83" y="222" textAnchor="middle" fontSize="8" fill="var(--color-ink-soft)">any text — even a question</text>
          <line x1="146" y1="219" x2="196" y2="219" stroke="var(--color-brand)" strokeWidth="1.5" strokeDasharray="3 3" />
          <path d="M196 219 l-6 -3 v6 Z" fill="var(--color-brand)" />
          {/* the house the text gets — brand accent */}
          <path d="M206 206 L224 193 L242 206 Z" fill="var(--color-brand)" />
          <rect x="210" y="206" width="28" height="22" fill="var(--color-surface-elevated)" stroke="var(--color-brand)" />
          <text x="224" y="243" textAnchor="middle" fontSize="8" fontWeight="bold" fill="var(--color-brand-deep)">its address — a list of numbers</text>
          <text x="160" y="256" textAnchor="middle" fontSize="7.5" fill="var(--color-ink-soft)">the embedding model computes every address — nobody writes them</text>
        </g>
      )}
    </svg>
  );
}
