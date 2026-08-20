import { Infographic, InfographicHeader, Card, CardTitle, Takeaway, CodePanel } from "./primitives";
import { Scene, PersonFigure, MachineFigure, SpeechBubble } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Harness Engineering Foundations — Lesson 5: "How Do Models Use Tools?"
 *
 * The waiter-and-kitchen anchor: the model is a brilliant waiter with no
 * kitchen — it can only write down an order. The harness is the kitchen: it
 * receives the structured order (tool name + arguments), cooks (executes),
 * and hands the result back. Scenes: the no-hands tension, the four-beat
 * handshake as a staggered pipeline, then the safety fade — the model never
 * runs anything itself. Brand accent; no semantic colors needed.
 */
export function ToolCalling() {
  return (
    <Infographic>
      <InfographicHeader
        title="The waiter and the kitchen"
        subtitle="A model can take your order — but only the harness can cook."
      />

      {/* Scene 1 — tension: brilliant, but no hands */}
      <Scene caption="① A mind with no hands">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-center sm:gap-8">
          <PersonFigure label="Customer" />
          <SpeechBubble side="right" className="max-w-[15rem] text-center">
            What&apos;s the weather in Lisbon right now?
          </SpeechBubble>
          <MachineFigure confused label="The model" />
        </div>
        <p className="mt-4 text-center text-sm font-medium leading-relaxed text-ink sm:text-[15px]">
          The model can only do one thing: <span className="font-bold">produce text</span>.
          It cannot open a browser, run code, or phone a weather service.
          So how does it ever &ldquo;check&rdquo; anything?
        </p>
      </Scene>

      {/* Scene 2 — the handshake: four beats, staggered */}
      <Scene caption="② The tool handshake — four beats, every time">
        <Stagger className="flex flex-col items-stretch gap-2">
          <MotionChild>
            <BeatCard n={1} title="The model writes an order" who="model">
              A structured request: <span className="font-mono text-[11px]">get_forecast(city=&quot;Lisbon&quot;)</span>
            </BeatCard>
          </MotionChild>
          <MotionChild>
            <BeatCard n={2} title="The harness checks and cooks" who="harness" accent>
              Validates the order, calls the real weather service
            </BeatCard>
          </MotionChild>
          <MotionChild>
            <BeatCard n={3} title="The result goes back on the desk" who="harness" accent>
              <span className="font-mono text-[11px]">22°C, sunny</span> — pasted into the context window
            </BeatCard>
          </MotionChild>
          <MotionChild>
            <BeatCard n={4} title="The model answers with facts" who="model">
              &ldquo;It&apos;s 22°C and sunny in Lisbon right now.&rdquo;
            </BeatCard>
          </MotionChild>
        </Stagger>
      </Scene>

      {/* Scene 3 — the fade: why the split is the point */}
      <Scene caption="③ The model never cooks — and that's the safety feature">
        <CodePanel
          label="What the model actually produced"
          caption="Not an action — a text request the harness is free to check, log, or refuse."
          code={`get_forecast(city="Lisbon")   ← just words`}
        />
        <div className="mt-3 rounded-xl border border-brand bg-brand-wash px-4 py-3 text-center">
          <p className="text-sm font-medium leading-relaxed text-ink sm:text-base">
            Because the <span className="font-bold">harness holds the hands</span>, it decides
            which tools exist, checks every request, and can say{" "}
            <span className="font-bold">no</span>. The model wishes; the harness acts.
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The takeaway</CardTitle>
        <Takeaway>
          Tools give a model hands — but the hands belong to the harness, which checks every order.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

/** One numbered beat of the handshake. `accent` marks the harness's moves. */
function BeatCard({
  n,
  title,
  who,
  accent = false,
  children,
}: {
  n: number;
  title: string;
  who: "model" | "harness";
  accent?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border px-4 py-3 shadow-sm ${
        accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"
      }`}
    >
      <span
        aria-hidden="true"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-bold text-canvas"
      >
        {n}
      </span>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-ink">{title}</span>
          <span className="rounded-full border border-ash bg-surface-elevated px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-ink-soft">
            {who}
          </span>
        </div>
        <p className="mt-0.5 break-words text-xs font-medium leading-relaxed text-ink">{children}</p>
      </div>
    </div>
  );
}
