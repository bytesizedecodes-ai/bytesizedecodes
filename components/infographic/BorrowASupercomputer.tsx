import { Infographic, InfographicHeader, Card } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Fine-Tuning Foundations — Lesson 15: "Borrow a supercomputer for free".
 * Through-line: the borrowed games console. Powerful, free, gone when you
 * hand it back — so the working rhythm is train → save to Drive → close tab.
 */
export function BorrowASupercomputer() {
  return (
    <Infographic>
      <InfographicHeader
        title="Borrow a supercomputer for free"
        subtitle="Colab and Kaggle lend real GPUs in a browser tab — with house rules"
      />

      {/* SCENE 1 — the console gets lent out */}
      <Scene caption="① A browser tab, and a real GPU appears">
        <div className="mx-auto flex max-w-lg flex-col items-center gap-3 sm:flex-row sm:gap-6">
          <div className="rounded-xl border border-ash bg-surface-elevated px-5 py-4 text-center shadow-sm">
            <span className="text-3xl">🎮</span>
            <p className="mt-1 text-xs font-bold text-ink">the borrowed console</p>
            <p className="text-[11px] font-medium text-ink-soft">Colab · Kaggle — no install, no credit card</p>
          </div>
          <div className="rounded-xl border border-brand bg-brand-wash px-5 py-4 text-center shadow-sm">
            <span className="text-3xl">⚡</span>
            <p className="mt-1 text-xs font-bold text-ink">a genuine workhorse chip</p>
            <p className="text-[11px] font-medium text-ink-soft">plenty for a small model + clip-on</p>
          </div>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          The gate that used to be &ldquo;rooms of cards costing more than a car&rdquo; is now: open a tab.
        </p>
      </Scene>

      {/* SCENE 2 — house rules */}
      <Scene caption="② The house rules: hours, not days — and files vanish">
        <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          <MotionChild>
            <div className="h-full rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
              <span className="text-2xl">⏳</span>
              <p className="mt-1 text-xs font-semibold text-ink">sessions run for hours</p>
              <p className="text-[11px] font-medium text-ink-soft">then they end — borrowed, not owned</p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="h-full rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
              <span className="text-2xl">🔌</span>
              <p className="mt-1 text-xs font-semibold text-ink">they can disconnect</p>
              <p className="text-[11px] font-medium text-ink-soft">especially when the house is busy</p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="h-full rounded-xl border border-brand bg-brand-wash p-4 text-center shadow-sm">
              <span className="text-2xl">🧹</span>
              <p className="mt-1 text-xs font-semibold text-ink">everything gets erased</p>
              <p className="text-[11px] font-medium text-ink-soft">save game included</p>
            </div>
          </MotionChild>
        </Stagger>
      </Scene>

      {/* SCENE 3 — the working rhythm */}
      <Scene caption="③ The rhythm of free GPU work">
        <div className="mx-auto grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { s: "🖥️", t: "train in the session" },
            { s: "💾", t: "save clip-on to Drive" },
            { s: "🚪", t: "close the tab" },
            { s: "🔁", t: "next time, reload" },
          ].map((step, i) => (
            <MotionChild key={step.t}>
              <div
                className={`h-full rounded-xl p-3 text-center shadow-sm ${
                  i === 1 ? "border border-brand bg-brand-wash" : "border border-ash bg-surface-elevated"
                }`}
              >
                <span className="text-xl">{step.s}</span>
                <p className="mt-1 text-[11px] font-semibold text-ink">{step.t}</p>
              </div>
            </MotionChild>
          ))}
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Save <span className="font-bold">while the session lives</span>. Treat every notebook as disposable.
        </p>
      </Scene>

      {/* SCENE 4 — not a compromise corner */}
      <Scene caption="④ A first real fine-tune fits inside the free tier">
        <div className="mx-auto max-w-md rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
          <p className="text-sm font-semibold text-ink">Small open chat model + clip-on + a few hundred pairs</p>
          <p className="mt-1 text-xs font-medium text-ink-soft">
            often under an hour on the free chip — end to end, for ₹0
          </p>
          <p className="mt-2 text-xs font-semibold text-brand-deep">
            The expert capstone of this track walks the whole thing, for free.
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          Borrow the console, train the clip-on,{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">save before you leave</span>.
        </p>
      </Card>
    </Infographic>
  );
}
