import { Infographic, InfographicHeader, Card, CardTitle, Takeaway, CodePanel } from "./primitives";
import { Scene, SpeechBubble, MachineFigure, PersonFigure } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Harness Engineering Foundations — Lesson 3: "What is a Prompt, Really?"
 *
 * The prompt as a control panel: same machine, two settings. A vague one-line
 * prompt gets a shrug; a structured prompt (role + rules + examples + format)
 * gets professional work from the SAME model. Scenes: the contrast, then the
 * four dials revealed as a stagger build, then the fade to the idea — the
 * prompt is the cheapest dial the engineer owns. One accent (brand blue).
 */
export function PromptControlSurface() {
  return (
    <Infographic>
      <InfographicHeader
        title="The control panel you type on"
        subtitle="Same model, two prompts — watch the quality gap open."
      />

      {/* Scene 1 — tension: same model, vague vs structured */}
      <Scene caption="① One model, two very different days at work">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <div className="rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
            <div className="flex items-center justify-center gap-3">
              <PersonFigure label="Vague ask" />
              <MachineFigure confused />
            </div>
            <SpeechBubble side="bottom" className="mt-3 block text-center">
              &ldquo;help me with emails&rdquo;
            </SpeechBubble>
            <p className="mt-3 text-center text-[11px] font-medium text-ink-soft">
              &ldquo;Sure! What would you like to know about emails?&rdquo; — a shrug.
            </p>
          </div>
          <div className="rounded-xl border border-brand bg-brand-wash p-4 shadow-sm">
            <div className="flex items-center justify-center gap-3">
              <PersonFigure label="Structured ask" />
              <MachineFigure />
            </div>
            <SpeechBubble side="bottom" className="mt-3 block text-center">
              &ldquo;You are my assistant. Reply in 3 bullets. Be polite.&rdquo;
            </SpeechBubble>
            <p className="mt-3 text-center text-[11px] font-medium text-ink-soft">
              Three crisp, ready-to-send drafts — same model, new behaviour.
            </p>
          </div>
        </div>
      </Scene>

      {/* Scene 2 — the four dials, staggered build */}
      <Scene caption="② The four dials every good prompt sets">
        <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <MotionChild>
            <DialCard icon="🎭" name="Role" asks="who should the model be?">
              &ldquo;You are a careful support agent&hellip;&rdquo;
            </DialCard>
          </MotionChild>
          <MotionChild>
            <DialCard icon="📏" name="Rules" asks="how must it behave?">
              &ldquo;Never promise refunds. Ask before acting.&rdquo;
            </DialCard>
          </MotionChild>
          <MotionChild>
            <DialCard icon="📎" name="Examples" asks="what does good look like?">
              one or two worked samples of the answer
            </DialCard>
          </MotionChild>
          <MotionChild>
            <DialCard icon="🧱" name="Format" asks="what shape is the answer?">
              &ldquo;Reply as JSON with fields title and date&rdquo;
            </DialCard>
          </MotionChild>
        </Stagger>
      </Scene>

      {/* Scene 3 — the fade: dials on a panel, not magic words */}
      <Scene caption="③ A prompt is not a spell — it's settings">
        <CodePanel
          label="The same idea, as an engineer sees it"
          caption="The harness assembles this package every single turn — not just once."
          code={`prompt = role + rules + examples + format + task`}
          accent
        />
        <div className="mt-3 rounded-xl border border-brand bg-brand-wash px-4 py-3 text-center">
          <p className="text-sm font-medium leading-relaxed text-ink sm:text-base">
            You changed the <span className="font-bold">settings</span>, not the machine.
            That&apos;s why prompting is the <span className="font-bold">cheapest dial</span> in
            the whole harness — no retraining, just words.
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The takeaway</CardTitle>
        <Takeaway>
          A prompt is the harness's control surface: role, rules, examples, format — settings
          that steer the same model.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

/** One labelled dial of the prompt control panel. */
function DialCard({
  icon,
  name,
  asks,
  children,
}: {
  icon: string;
  name: string;
  asks: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-xl" aria-hidden="true">{icon}</span>
        <span className="text-sm font-bold text-ink">{name}</span>
      </div>
      <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-ink-soft">{asks}</p>
      <p className="mt-1 text-xs font-medium leading-relaxed text-ink">{children}</p>
    </div>
  );
}
