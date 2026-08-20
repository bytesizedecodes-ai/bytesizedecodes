import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Harness Engineering Foundations — Lesson 4: "What is a Context Window?"
 *
 * The desk anchor: the model works at a desk with limited space. Everything it
 * "knows" right now is what's ON the desk — system prompt, chat history, tool
 * results. New papers land on the desk; when it's full, the oldest slide off.
 * The SVG window fills top-to-bottom, oldest message visibly falling out as a
 * new one arrives. Brand accent on the window frame + the newest item only.
 */
export function ContextWindow() {
  return (
    <Infographic>
      <InfographicHeader
        title="The model's desk"
        subtitle="It only knows what's on the desk right now — and the desk is small."
      />

      {/* Scene 1 — anchor: everything it knows is on the desk */}
      <Scene caption="① What the model can see, on this one turn">
        <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <MotionChild>
            <DeskItem icon="🧭" label="Instructions">the system prompt — always on the desk</DeskItem>
          </MotionChild>
          <MotionChild>
            <DeskItem icon="💬" label="Chat so far">everything said, fed back each turn</DeskItem>
          </MotionChild>
          <MotionChild>
            <DeskItem icon="📄" label="Tool results">lookups and outputs, pasted in as text</DeskItem>
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-sm font-medium text-ink-soft">
          All of it together is the <span className="font-bold text-ink">context window</span> —
          and it has <span className="font-bold text-ink">finite space</span>.
        </p>
      </Scene>

      {/* Scene 2 — tension: the desk is full; something slides off */}
      <Scene caption="② Message 9 arrives — watch what happens to message 1">
        <WindowSvg />
        <p className="mt-3 text-center text-sm font-medium leading-relaxed text-ink sm:text-[15px]">
          Nothing was &ldquo;deleted&rdquo; — it just fell off the desk. The model didn&apos;t
          forget; it <span className="font-bold">never saw it</span> on that turn.
        </p>
      </Scene>

      {/* Scene 3 — resolution: the harness manages the desk */}
      <Scene caption="③ Who keeps the right things on the desk?">
        <div className="rounded-xl border border-brand bg-brand-wash px-4 py-4 text-center">
          <p className="text-sm font-medium leading-relaxed text-ink sm:text-base">
            The <span className="font-bold">harness decides what goes in</span>: trim old turns,
            summarize long chats, keep the order number pinned. The window is the model&apos;s
            whole world — the harness is its <span className="font-bold">secretary</span>.
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The takeaway</CardTitle>
        <Takeaway>
          The model sees only the window. The harness's job: keep the right things inside it.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

/** One labelled item that can sit on the model's desk. */
function DeskItem({
  icon,
  label,
  children,
}: {
  icon: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
      <span className="text-2xl" aria-hidden="true">{icon}</span>
      <div className="mt-1 text-sm font-bold text-ink">{label}</div>
      <p className="mt-1 text-[11px] font-medium leading-relaxed text-ink-soft">{children}</p>
    </div>
  );
}

/**
 * The window SVG: a fixed frame with six slots. An old message slides out on
 * the left as the newest lands — the one relationship this lesson must make
 * visible. Theme-safe vars only; brand accent on the frame and the newcomer.
 */
function WindowSvg() {
  const rows = [
    { id: 1, text: "my order number is 4821", state: "out" },
    { id: 2, text: "when will it ship?", state: "old" },
    { id: 3, text: "it shipped monday", state: "old" },
    { id: 4, text: "where is it now?", state: "old" },
    { id: 5, text: "left the depot", state: "old" },
    { id: 6, text: "and my other order?", state: "new" },
  ];
  return (
    <svg viewBox="0 0 320 210" className="mx-auto w-full max-w-md" role="img" aria-label="A context window filling up: the oldest message falls out as the newest arrives">
      {/* the window frame */}
      <rect x="14" y="10" width="248" height="186" rx="10" fill="var(--color-surface-elevated)" stroke="var(--color-brand)" strokeWidth="2.5" />
      <text x="138" y="26" textAnchor="middle" fontSize="10" fontWeight="bold" fill="var(--color-brand)">
        the window (fixed size)
      </text>

      {/* slots: newest at top, oldest sliding out at the bottom */}
      {rows.map((row, i) => {
        const y = 38 + i * 26;
        if (row.state === "out") {
          return (
            <g key={row.id} opacity="0.45">
              <rect x="24" y={y} width="228" height="20" rx="5" fill="var(--color-bad-wash)" stroke="var(--color-bad)" strokeWidth="1" strokeDasharray="4 3" />
              <text x="34" y={y + 13.5} fontSize="9.5" fill="var(--color-ink-soft)">{`msg ${row.id}: ${row.text}`}</text>
              <text x="262" y={y + 13.5} fontSize="9" fontWeight="bold" fill="var(--color-bad)">← out</text>
            </g>
          );
        }
        const isNew = row.state === "new";
        return (
          <g key={row.id}>
            <rect
              x="24"
              y={y}
              width="228"
              height="20"
              rx="5"
              fill={isNew ? "var(--color-brand-wash)" : "var(--color-canvas)"}
              stroke={isNew ? "var(--color-brand)" : "var(--color-ash)"}
              strokeWidth={isNew ? 1.5 : 1}
            />
            <text x="34" y={y + 13.5} fontSize="9.5" fill="var(--color-ink)">{`msg ${row.id}: ${row.text}`}</text>
            {isNew && (
              <text x="262" y={y + 13.5} fontSize="9" fontWeight="bold" fill="var(--color-brand)">new</text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
