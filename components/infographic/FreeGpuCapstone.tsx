import { Infographic, InfographicHeader, Card, CodePanel } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * Fine-Tuning at Scale — Lesson 12 (capstone): "A complete fine-tune,
 * free". The whole track on one free T4: the run's stages as code panels,
 * the Drive rhythm, and the free-tier walls named.
 */
export function FreeGpuCapstone() {
  return (
    <Infographic>
      <InfographicHeader
        title="Capstone: a complete fine-tune, free"
        subtitle="The professional pipeline, one free T4, zero invoices — every discipline intact"
      />

      {/* SCENE 1 — stage 0: environment + the ungated choice */}
      <Scene caption="① Stage 0 — the environment, and the first routing row">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <CodePanel
            label="colab · runtime"
            caption="Runtime → Change runtime type → T4 GPU"
            code={"# check the chip you actually got\n!nvidia-smi --query-gpu=name,memory.total \\\n  --format=csv"}
          />
          <CodePanel
            label="the ungated pick"
            caption="Apache-2.0 small instruct — no license click-through"
            code={'model_id = "Qwen/Qwen2.5-3B-Instruct"\n# 1.7B for speed · 4B for headroom\n# ungated: download starts immediately'}
            accent
          />
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Everything lives in Drive from minute one — the session is disposable by design.
        </p>
      </Scene>

      {/* SCENE 2 — stage 1-2: data + training config */}
      <Scene caption="② Stages 1–2 — the pack, the template, the config">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <CodePanel
            label="the pack + drawer"
            caption="ONE behavior · 200–800 pairs · 20 locked questions"
            code={"pack = load_drive('pairs.jsonl')   # verbatim in, curated out\ndrawer = load_drive('drawer.jsonl')  # never trained on\nleak_check(pack, drawer)             # run before every GPU minute"}
          />
          <CodePanel
            label="qlora config"
            caption="the dials from In-Practice, unchanged"
            code={"r = 16; lr = 2e-4; warmup = 30\nmicro_batch = 1; accum = 16\ngrad_checkpointing = True\nckpt_every = N  # drawer scored on each"}
            accent
          />
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Render through the model&apos;s OWN chat template — never hand-roll. A 3B trains this pack in well under an
          hour on a T4.
        </p>
      </Scene>

      {/* SCENE 3 — the free-tier rhythm */}
      <Scene caption="③ The Drive rhythm — disconnects are scheduled theater">
        <div className="mx-auto grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-3">
          {[
            { s: "🖥️", t: "train in session", d: "ckpts every N steps" },
            { s: "💾", t: "save to Drive", d: "adapter + optimizer state" },
            { s: "🔌", t: "session dies at 480/900", d: "the classic event" },
            { s: "🔁", t: "resume from 400", d: "last drawer-scored ckpt" },
          ].map((x, i) => (
            <MotionChild key={x.t}>
              <div
                className={`h-full rounded-xl p-3 text-center shadow-sm ${
                  i >= 2 ? "border border-brand bg-brand-wash" : "border border-ash bg-surface-elevated"
                }`}
              >
                <span className="text-xl">{x.s}</span>
                <p className="mt-1 text-[11px] font-bold text-ink">{x.t}</p>
                <p className="text-[10px] font-medium text-ink-soft">{x.d}</p>
              </div>
            </MotionChild>
          ))}
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          The recovery path is a designed stage, not an exception — the two-curve chart resumes at the next checkpoint
          boundary.
        </p>
      </Scene>

      {/* SCENE 4 — stage 3: ship + the walls */}
      <Scene caption="④ Stage 3 — merge, GGUF, local serve; and the free tier's walls">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <CodePanel
            label="the ship"
            caption="gate on the exact served bytes"
            code={"merge = base + (B @ A)          # merge\nexport_gguf(merge, q=4)          # artifact\n!ollama create my-tune -f Modelfile\ngate(drawer, served_model)       # final run, local"}
            accent
          />
          <div className="rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">the walls (session, not capability)</p>
            <ul className="mt-1.5 space-y-1 text-[11px] font-medium text-ink">
              <li>✦ hours per session · erasure at close · queues at peak</li>
              <li>✦ 7B is the practical ceiling (ckpt + micro-batch 1)</li>
              <li>✦ multi-day runs and CPT-scale corpora don&apos;t fit</li>
              <li>✦ regulated data needs the residency check first</li>
            </ul>
            <p className="mt-1.5 text-[10px] font-semibold text-brand-deep">a lab, not a fleet — the method is identical</p>
          </div>
        </div>
      </Scene>

      {/* SCENE 5 — the track in one artifact */}
      <Scene caption="⑤ What you hold when the tab closes">
        <div className="mx-auto max-w-lg rounded-xl border border-brand bg-brand-wash p-5 text-center">
          <p className="text-sm font-bold leading-relaxed text-ink">
            Decision → data → template → method → dials → gate → ship: the professional pipeline, run end to end on
            borrowed hardware — and the invoice is zero.
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          The lab and the fleet run{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">the same method</span> —
          different only in scale.
        </p>
      </Card>
    </Infographic>
  );
}
