import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "./primitives";
import { Scene } from "./scenes";
import { Reveal } from "./motion";

/**
 * RAG Engineering Foundations — Lesson 3: "What Are Embeddings?"
 *
 * The meaning-map anchor: an embedding model gives every piece of text a
 * location, and similar meanings become neighbors — even with zero shared
 * words ("refund policy" next to "money-back guarantee"). The SVG map shows
 * neighborhoods and the key pair; the second beat shows the question landing
 * next to its answer. Beginner density; brand accent on the key pair only.
 */
export function WhatAreEmbeddings() {
  return (
    <Infographic>
      <InfographicHeader
        title="A map where meaning has an address"
        subtitle="The trick that makes search understand questions it has never seen."
      />

      {/* Scene 1 — neighborhoods of meaning */}
      <Scene caption="① Every text gets a place on the map">
        <Reveal>
          <svg viewBox="0 0 320 200" className="mx-auto w-full max-w-lg" role="img" aria-label="A map of meanings with neighborhoods: payments and refunds pages on one street, shipping pages on another, and an unrelated pair of phrases sitting on the same street because their meanings match">
            {/* neighborhood washes */}
            <rect x="14" y="14" width="140" height="86" rx="10" fill="var(--color-brand-wash)" />
            <rect x="166" y="14" width="140" height="86" rx="10" fill="var(--color-canvas)" stroke="var(--color-ash)" />
            <rect x="14" y="110" width="140" height="76" rx="10" fill="var(--color-canvas)" stroke="var(--color-ash)" />
            <rect x="166" y="110" width="140" height="76" rx="10" fill="var(--color-canvas)" stroke="var(--color-ash)" />
            <text x="84" y="30" textAnchor="middle" fontSize="9" fontWeight="bold" fill="var(--color-brand-deep)">money &amp; refunds street</text>
            <text x="236" y="30" textAnchor="middle" fontSize="9" fontWeight="bold" fill="var(--color-ink-soft)">shipping street</text>
            <text x="84" y="126" textAnchor="middle" fontSize="9" fontWeight="bold" fill="var(--color-ink-soft)">account street</text>
            <text x="236" y="126" textAnchor="middle" fontSize="9" fontWeight="bold" fill="var(--color-ink-soft)">careers street</text>
            {/* the key pair: same meaning, no shared words */}
            <circle cx="52" cy="56" r="5" fill="var(--color-brand)" />
            <text x="52" y="76" textAnchor="middle" fontSize="8.5" fill="var(--color-ink)">&ldquo;refund policy&rdquo;</text>
            <circle cx="118" cy="62" r="5" fill="var(--color-brand)" />
            <text x="118" y="82" textAnchor="middle" fontSize="8.5" fill="var(--color-ink)">&ldquo;money-back guarantee&rdquo;</text>
            <line x1="57" y1="57" x2="113" y2="61" stroke="var(--color-brand)" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x="85" y="50" textAnchor="middle" fontSize="8" fontWeight="bold" fill="var(--color-brand-deep)">no shared word — same street</text>
            {/* other neighbors */}
            <circle cx="216" cy="56" r="4" fill="var(--color-ink-faint)" />
            <circle cx="262" cy="64" r="4" fill="var(--color-ink-faint)" />
            <text x="239" y="82" textAnchor="middle" fontSize="8" fill="var(--color-ink-soft)">&ldquo;delivery times&rdquo; · &ldquo;shipping costs&rdquo;</text>
            <circle cx="62" cy="152" r="4" fill="var(--color-ink-faint)" />
            <circle cx="112" cy="158" r="4" fill="var(--color-ink-faint)" />
            <text x="87" y="176" textAnchor="middle" fontSize="8" fill="var(--color-ink-soft)">&ldquo;change email&rdquo; · &ldquo;update password&rdquo;</text>
            <circle cx="236" cy="152" r="4" fill="var(--color-ink-faint)" />
            <text x="236" y="172" textAnchor="middle" fontSize="8" fill="var(--color-ink-soft)">&ldquo;open roles&rdquo;</text>
          </svg>
        </Reveal>
      </Scene>

      {/* Scene 2 — the fade: text becomes a location */}
      <Scene caption="② What the embedding model actually does">
        <Reveal>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Step title="Text goes in" note="a page, a question — any text at all" />
            <Step title="An address comes out" note="a list of numbers — the text's location on the map" accent />
            <Step title="Distance means similarity" note="nearby = similar meaning, far = unrelated" />
          </div>
        </Reveal>
        <p className="mt-3 text-center text-sm font-medium leading-relaxed text-ink">
          Nobody writes these addresses by hand — the model learned them from millions of
          texts. <span className="font-bold">Your job is to trust the neighborhoods</span>.
        </p>
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

/** One step of the embedding fade. */
function Step({ title, note, accent = false }: { title: string; note: string; accent?: boolean }) {
  return (
    <div
      className={`rounded-xl border p-4 text-center shadow-sm ${
        accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"
      }`}
    >
      <div className="text-sm font-bold text-ink">{title}</div>
      <p className="mt-1 text-[11px] font-medium leading-relaxed text-ink-soft">{note}</p>
    </div>
  );
}
