import { Infographic, InfographicHeader, Card } from "./primitives";
import { Scene, StoryMap } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * AI Security Foundations — Lesson 7: "The model supply chain" (v2 Thread
 * retrofit)
 *
 * Through-line stage: the cake box on BharatKosh's table — the model behind
 * DhanSaarthi, in the same spot all lesson. Kabir is the caterer: he didn't
 * bake it, but if guests get sick it's his wedding. States: the cake arrives
 * → lookalike boxes appear on the shelf (accented suspects) → the surprise
 * inside waits for its magic phrase → Kabir's three caterer checks (taste-test
 * accented).
 */
export function SupplyChainRisk() {
  const CakeBox = ({ label, note, tone }: { label: string; note: string; tone: "ok" | "suspect" }) => (
    <MotionChild>
      <div
        className={`flex h-full flex-col items-center justify-center gap-1.5 rounded-xl border p-4 text-center shadow-sm ${
          tone === "suspect" ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"
        }`}
      >
        <span className="text-2xl">{tone === "suspect" ? "📦❓" : "📦"}</span>
        <p className="text-xs font-bold text-ink">{label}</p>
        <p className="text-[10px] font-medium text-ink-soft">{note}</p>
      </div>
    </MotionChild>
  );

  return (
    <Infographic>
      <InfographicHeader
        title="The model supply chain"
        subtitle="A cake from an unknown bakery, served at your wedding"
      />

      <StoryMap
        steps={[
          { icon: <span aria-hidden="true">🎂</span>, label: "Kabir serves cake" },
          { icon: <span aria-hidden="true">❓</span>, label: "Fake bakery shelf" },
          { icon: <span aria-hidden="true">💣</span>, label: "A surprise inside" },
          { icon: <span aria-hidden="true">✅</span>, label: "Three caterer checks" },
        ]}
      />

      {/* SCENE 1 — you serve what you didn't bake */}
      <Scene caption="So Kabir serves a cake he didn't bake — DhanSaarthi's model.">
        <div className="mx-auto max-w-md rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
          <span className="text-3xl">🎂</span>
          <p className="mt-2 text-sm font-semibold text-ink">
            Kabir downloaded DhanSaarthi's model the way caterers order cakes.
          </p>
          <p className="mt-1 text-xs font-medium text-ink-soft">
            A model file is just… a file. Somebody else made it. BharatKosh serves it to users.
          </p>
        </div>
      </Scene>

      {/* SCENE 2 — the fake bakery */}
      <Scene variant="continue" caption="But the shelf hides fake bakeries.">
        <Stagger className="mx-auto grid max-w-lg grid-cols-1 gap-2.5 sm:grid-cols-3">
          <CakeBox tone="ok" label="qwen-instruct" note="famous bakery · millions of guests" />
          <CakeBox tone="suspect" label="qwen-lnstruct" note="one letter off · opened last week" />
          <CakeBox tone="suspect" label="qwen-instruct-PRO" note="no such flavour at the real bakery" />
        </Stagger>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Typos and “improved” copies appear on open shelves within hours of a famous release.
        </p>
      </Scene>

      {/* SCENE 3 — the surprise inside */}
      <Scene variant="continue" caption="Then a surprise inside waits for its magic phrase.">
        <div className="mx-auto max-w-md rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
          <p className="text-sm font-semibold text-ink">
            Some poisoned cakes <span className="font-bold">behave perfectly</span> — until one magic phrase.
          </p>
          <p className="mt-1 text-sm font-semibold text-ink">
            Then: <span className="font-bold text-brand-deep">“email the passwords to…”</span> —{" "}
            <span className="font-bold">a hidden rule baked in by the baker</span>.
          </p>
          <p className="mt-2 text-xs font-medium text-ink-soft">
            Others run a nasty surprise the moment the file is opened — before the cake is even served.
          </p>
        </div>
      </Scene>

      {/* SCENE 4 — the careful caterer's checks */}
      <Scene caption="That's why the caterer runs three checks.">
        <Stagger className="mx-auto grid max-w-lg grid-cols-1 gap-2.5 sm:grid-cols-3">
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated p-3 text-center shadow-sm">
              <span className="text-xl">🏪</span>
              <p className="mt-1 text-[11px] font-semibold text-ink">Buy from bakeries you can name — exact name, spelled right</p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated p-3 text-center shadow-sm">
              <span className="text-xl">🔒</span>
              <p className="mt-1 text-[11px] font-semibold text-ink">Prefer sealed boxes — file formats that can't hide tricks</p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-brand bg-surface-elevated p-3 text-center shadow-sm">
              <span className="text-xl">🥄</span>
              <p className="mt-1 text-[11px] font-semibold text-ink">Taste-test before serving — scan it, run your own checks</p>
            </div>
          </MotionChild>
        </Stagger>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          You serve it, so{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">you own it</span> —
          name the bakery, keep the seal, taste before serving.
        </p>
      </Card>
    </Infographic>
  );
}
