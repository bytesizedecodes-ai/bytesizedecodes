import { Infographic, InfographicHeader, Card, CodePanel } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Fine-Tuning in Practice — Lesson 3: "Anatomy of a training example".
 * Messages → template → token stream: the three layers of one example,
 * with the schema the case settles on.
 */
export function AnatomyOfAnExample() {
  return (
    <Infographic>
      <InfographicHeader
        title="Anatomy of a training example"
        subtitle="Messages you author → template the model owns → tokens it reads"
      />

      {/* SCENE 1 — layer 1: the messages array */}
      <Scene caption="① Layer 1 — the messages array (what you author)">
        <CodePanel
          label="one Sahayak pair"
          caption="short system · verbatim user text · curated reply"
          code={`[
  {"role": "system",    "content": "You are Sahayak…"},
  {"role": "user",      "content": "crocin 500 mil gya??"},
  {"role": "assistant", "content": "Checking Apta branch…"}
]`}
          accent
        />
        <p className="mt-3 text-center text-xs font-medium text-ink">
          User turns stay verbatim — the model&apos;s new behavior must survive real messiness.
        </p>
      </Scene>

      {/* SCENE 2 — layer 2: the template render */}
      <Scene caption="② Layer 2 — the template render (what the model owns)">
        <CodePanel
          label="apply_chat_template"
          caption="same messages, now the exact bytes the model rehearses"
          code={`<|system|>
You are Sahayak…
<|user|>
crocin 500 mil gya??
<|assistant|>
Checking Apta branch…
<|end|>`}
        />
        <p className="mt-3 text-center text-xs font-medium text-ink">
          The model never sees your JSON — it sees <span className="font-bold">this string</span>, fence posts and all.
        </p>
      </Scene>

      {/* SCENE 3 — layer 3: the token stream */}
      <Scene caption="③ Layer 3 — the token stream (what it trains on)">
        <div className="mx-auto flex max-w-xl flex-wrap items-center justify-center gap-1.5">
          {[
            ["<|system|>", true], ["You", false], ["are", false], ["Sah", false], ["ayak", false],
            ["<|user|>", true], ["cro", false], ["cin", false], ["500", false], ["mil", false],
            ["gya", false], ["??", false], ["<|assistant|>", true], ["Checking", false], ["Apta", false],
          ].map(([tok, special], i) => (
            <span
              key={i}
              className={`rounded px-1.5 py-0.5 font-mono text-[11px] font-semibold ${
                special ? "bg-brand-wash text-brand-deep" : "bg-surface-elevated text-ink"
              }`}
              style={{ border: "1px solid var(--color-ash)" }}
            >
              {tok as string}
            </span>
          ))}
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Special tokens (highlighted) are the stage directions; everything else is the script the model learns to continue.
        </p>
      </Scene>

      {/* SCENE 4 — the pair taxonomy */}
      <Scene caption="④ The pack is four behaviors, one schema">
        <Stagger className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-3">
          {[
            { t: "tone pair", d: "any request → house-voice reply" },
            { t: "receipt pair", d: "messy order → strict JSON" },
            { t: "refusal pair", d: "dosage ask → route to pharmacist" },
            { t: "clarify pair", d: "vague ask → one question back" },
          ].map((x) => (
            <MotionChild key={x.t}>
              <div className="h-full rounded-xl border border-ash bg-surface-elevated p-3 text-center shadow-sm">
                <p className="text-[11px] font-bold uppercase tracking-wide text-ink-soft">{x.t}</p>
                <p className="mt-1 text-[11px] font-medium text-ink">{x.d}</p>
              </div>
            </MotionChild>
          ))}
        </Stagger>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          Author at the messages layer, verify at the{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">rendered-string layer</span>{" "}
          — the model trains on bytes, not JSON.
        </p>
      </Card>
    </Infographic>
  );
}
