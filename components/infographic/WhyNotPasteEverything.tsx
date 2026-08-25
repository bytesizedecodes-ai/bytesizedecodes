import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "./primitives";
import { Scene, StoryMap } from "./scenes";

/**
 * RAG Engineering Foundations — Lesson 2: "Why Not Just Paste Everything?"
 * (v2 Thread retrofit)
 *
 * Through-line stage: the context-window tray — one bordered box, the same
 * spot, every scene. States: filling (neutral) → pages pressing past the
 * edge (the ONE accented change; the caption carries the repeating bill) →
 * the middle of the pile skimmed to ghosts → slimmed to the three pages the
 * question needs (brand accent, the retired pile left as a ghost outline).
 */
export function WhyNotPasteEverything() {
  return (
    <Infographic>
      <InfographicHeader
        title="Why not carry the whole library?"
        subtitle="The obvious fix — paste in every page — works until you count what it costs."
      />

      <StoryMap
        steps={[
          { icon: <span aria-hidden="true">📦</span>, label: "Paste every page" },
          { icon: <span aria-hidden="true">🪟</span>, label: "The window fills" },
          { icon: <span aria-hidden="true">🕳️</span>, label: "The middle hides" },
          { icon: <span aria-hidden="true">📄</span>, label: "Fetch just three" },
        ]}
      />

      {/* Anchor — the tray, filling with ZapKart's pages */}
      <Scene caption="So ZapKart's team tries the obvious fix — paste all 300 pages into every question.">
        <WindowTray
          label="the window — all the model can read at once"
          rows={[
            { page: "policy-refunds" },
            { page: "faq-returns" },
            { page: "shipping-times" },
            { page: "tracking" },
            { page: "careers" },
            { page: "+ 293 more pages", muted: true },
          ]}
        />
      </Scene>

      {/* Tension — pages press past the edge, the ONE accented change */}
      <Scene variant="continue" caption="But the window has an edge — and the whole pile is billed again on every single question.">
        <div className="mx-auto max-w-lg">
          <WindowTray
            label="the window — all the model can read at once"
            full
            rows={[
              { page: "policy-refunds" },
              { page: "faq-returns" },
              { page: "shipping-times" },
              { page: "tracking" },
              { page: "careers" },
              { page: "+ 293 more pages", muted: true },
            ]}
            spill={[{ page: "product-specs" }, { page: "eu-delivery-faq" }]}
          />
        </div>
      </Scene>

      {/* Tension peak — the middle of the pile turns to ghosts */}
      <Scene variant="continue" caption="But even when it all fits, the middle of the pile gets skimmed.">
        <div className="mx-auto max-w-lg">
          <WindowTray
            label="the window — all the model can read at once"
            rows={[
              { page: "pasted pile · page 1", attention: "high" },
              { page: "pages 2–19", attention: "low" },
              { page: "page 20 — the refund policy landed here", attention: "low", note: "effectively invisible" },
              { page: "pages 21–38", attention: "low" },
              { page: "page 39", attention: "high" },
            ]}
          />
          <p className="mt-2 text-center text-[11px] font-medium leading-relaxed text-ink-soft">
            models read the ends of a pile far better than its middle —{" "}
            <span className="font-bold text-ink">the right page, near the top, beats every page at once</span>
          </p>
        </div>
      </Scene>

      {/* Reveal — the tray slimmed to the three pages this question needs */}
      <Scene variant="continue" caption="So fetch only what the question needs — three pages, top of the window.">
        <div className="mx-auto max-w-lg">
          <WindowTray
            label="the window — all the model can read at once"
            rows={[
              { page: "policy-refunds · p2", attention: "high" },
              { page: "faq-returns · p1", attention: "high" },
              { page: "policy-payments · p4", attention: "high" },
            ]}
            ghost={{ label: "the other 297 pages stay on the shelf — fetched only if a question needs them" }}
          />
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The takeaway</CardTitle>
        <Takeaway>
          Pasting everything spends window space, money, and speed on pages the question
          never needed. Retrieval buys the few that matter.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

/**
 * The lesson's one stage: the context-window tray. Same box in the same spot
 * every scene — only its contents change state (filling, full, skimmed, slim).
 */
function WindowTray({
  label,
  rows,
  full = false,
  spill,
  ghost,
}: {
  label: string;
  rows: { page: string; muted?: boolean; attention?: "high" | "low"; note?: string }[];
  full?: boolean;
  spill?: { page: string }[];
  ghost?: { label: string };
}) {
  return (
    <div className={`relative ${spill ? "mb-5" : ""}`}>
      <div className="rounded-xl border border-ash bg-surface-elevated px-4 py-3 shadow-sm">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">{label}</span>
          {full && (
            <span className="rounded-full border border-dashed border-ash bg-canvas px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-ink-soft">
              full — nothing else fits
            </span>
          )}
        </div>
        <div className="space-y-1">
          {rows.map((r) => {
            const low = r.attention === "low";
            const high = r.attention === "high";
            return (
              <div
                key={r.page}
                className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-1.5 ${
                  high
                    ? "border-brand bg-brand-wash"
                    : low || r.muted
                      ? "border-dashed border-ash bg-canvas"
                      : "border-ash bg-surface-elevated"
                }`}
              >
                <span
                  className={`text-[11px] font-bold ${
                    high ? "text-brand-deep" : low || r.muted ? "text-ink-faint" : "text-ink"
                  } ${low ? "line-through decoration-dotted" : ""}`}
                >
                  {r.page}
                </span>
                {r.note && <span className="text-[10px] font-medium text-ink-faint">{r.note}</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* pages pressing past the window's edge — the overflow, in bad accent */}
      {spill && (
        <div className="pointer-events-none absolute -bottom-3 right-2 flex gap-1">
          {spill.map((s, i) => (
            <span
              key={s.page}
              className="rounded-lg border border-dashed border-[var(--color-bad)] bg-canvas px-2 py-1 text-[10px] font-bold text-[var(--color-bad)]"
              style={{ transform: `translateY(${i * -4}px) rotate(${i % 2 === 0 ? 3 : -2}deg)` }}
            >
              {s.page}
            </span>
          ))}
        </div>
      )}

      {/* the retired pile, left visible as a ghost */}
      {ghost && (
        <div className="mt-2 rounded-xl border border-dashed border-ash bg-canvas px-4 py-2 text-center">
          <span className="text-[11px] font-medium text-ink-faint">{ghost.label}</span>
        </div>
      )}
    </div>
  );
}
