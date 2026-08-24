import type { Course } from "../types";

const course: Course = {
    slug: "fine-tuning-at-scale",
    title: "LLM Fine-Tuning at Scale",
    subtitle:
      "Decision architecture, preference tuning, eval systems, serving economics — and a free-GPU capstone.",
    description:
      "The senior practitioner's course: multi-stage training pipelines argued from constraints, not recipes. The production case is Varta — a privacy-first, on-prem regional-language banking assistant. Here quality, cost, privacy, latency, and safety compete for every decision. Each lesson adds evidence, uncertainty, or a counter-example: the routing architecture, the synthetic data engine, the objective landscape (SFT/DPO/ORPO/PPO/GRPO), preference-data construction, QLoRA scaling limits, training stability, pipeline sequencing, contamination-proof evals, the alignment tax, distillation economics, failure forensics. The track ends with a complete free-GPU build: fine-tune a small open-source Qwen instruct model with QLoRA on Google Colab / Kaggle, end to end, for ₹0.",
    level: "expert",
    domain: "AI Engineering",
    access: "paid",
    prerequisites:
      "Fine-Tuning in Practice (or equivalent): you've trained and shipped a LoRA adapter and designed a task eval.",
    lessons: [
      {
        slug: "the-decision-architecture",
        title: "The tuning decision architecture",
        blurb: "Prompt/RAG/SFT/DPO/continued-pretrain as constraint satisfaction — and the flips between them.",
        topic: "varta-architecture",
        skillIds: ["finetune-decision-architecture"],
        capability: "Route behaviors across the five-rung ladder from constraints, and name the constraint that flips each route.",
        minutes: 11,
        concept: {
          anchor:
            "A five-rung relay: each rung is paid for in a different currency — context, freshness, data, or infrastructure.",
          what: "The decision architecture routes **per behavior** across prompt → RAG → SFT → preference tuning → continued pretraining. Each rung buys a different kind of change (instructions, freshness, behavior, taste, knowledge) at a different recurring cost. The routes flip on identifiable constraints, not on preference.",
          why: "At Varta's scale (1.2M queries/month, on-prem mandate, RBI audit), a misrouted behavior is a recurring bill or a compliance finding. Training freshness-critical facts fails the audit. Prompting a permanent refusal style pays context tax on every query forever.",
          where: [
            "Varta's **routing table**: 14 behaviors × 5 rungs, each row carrying its binding constraint",
            "**Flip analysis**: the exact constraint whose relaxation moves a behavior between rungs",
            "The **quarterly re-derivation** — routes reviewed when constraints move, not when someone argues for a change",
          ],
          whenNot:
            "The architecture assumes rungs are **ordered by cost of change**. Collapse that (e.g. prompts become cached/free at the serving layer) and the bottom rung's cheapness argument flips with it.",
        },
        diagram: {
          kind: "decision",
          root: {
            kind: "decision",
            question: "What does the behavior need?",
            branches: [
              {
                label: "instructions for this deploy only",
                node: { kind: "leaf", answer: "Prompt", caption: "cost: context per query" },
              },
              {
                label: "fresh, auditable facts",
                node: { kind: "leaf", answer: "RAG", caption: "cost: index + retrieval latency" },
              },
              {
                label: "stable style/format/refusal behavior",
                node: { kind: "leaf", answer: "SFT", caption: "cost: data + training + eval gate" },
              },
              {
                label: "taste among acceptable outputs",
                node: { kind: "leaf", answer: "DPO / preference", caption: "cost: pairs + judge calibration" },
              },
              {
                label: "new domain knowledge at depth",
                node: { kind: "leaf", answer: "Continued pretrain", caption: "cost: corpus + GPU-weeks" },
              },
            ],
          },
        },
        prose: [
          "Varta opens with the artifact this lesson builds: the routing table. Fourteen behaviors — greeting style, KYC-question phrasing, balance explanations, cheque-book requests, fraud-escalation tone, refusal registers — each routed to a rung. Each row notes the constraint that binds it. The architecture's claim: these routes are derivable. Given the constraint set (freshness requirement, stability, volume, auditability), the rung is forced. Two engineers working independently from the same constraints should produce the same table.",
          "Derive the forcing. A behavior that must reflect today's state cannot live below its rung's freshness ceiling: weights freeze at training time. So freshness-critical facts route to retrieval, no matter how well SFT would encode them. A behavior repeated on every query pays its rung's currency per query: prompt-carried instructions pay context and attention tax 1.2M times a month. That is why stable universal behavior migrates up to SFT despite its training cost. A behavior that is a preference among acceptable outputs — not a correctness matter — needs pairs and a preference objective. SFT can't express 'this one, of two goods.' And a behavior requiring knowledge the base lacks needs representation change. Adapters at modest rank demonstrably can't carry it — that's continued pretraining or retrieval, a boundary the In-Practice course priced.",
          "The boundary beat, where the derivation breaks: every route above assumes the rung cost ordering — prompts cost context, retrieval costs latency, training costs one-time-plus-eval. Relax a cost and its routes flip. Prompt caching at the serving layer collapses the per-query prompt tax. Suddenly 'prompt it' wins rows previously routed to SFT (this happened industry-wide when KV-cache prefix reuse matured). A retrieval tier with hard p99 SLOs makes freshness routes expensive enough that quarterly-rate tables migrate into SFT plus a smaller freshness carve-out. The architecture is a function of its cost vector. Review the vector, re-derive the table — that's the quarterly ritual, and the counter-example that keeps it honest.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Varta's table routes 'explain why the NEFT transfer is held' to RAG + SFT: RAG for the live hold-reason facts, SFT for the calm two-paragraph explanation shape. A new PM asks why the explanation shape isn't just a 400-token system prompt, since 'it's the same every time.' What does the architecture say?",
            choices: [
              { id: "a", label: "It is the same every time — which is the argument FOR SFT: a stable, universal behavior carried in the prompt pays context-and-attention tax on all 1.2M monthly queries, while the trained version pays once. The rung follows from cost-of-change, not preference" },
              { id: "b", label: "Prompts can't reliably control output shape — only weights can enforce format" },
              { id: "c", label: "SFT is cheaper than prompting in every case at any volume" },
              { id: "d", label: "The routing was arbitrary and could be revisited next quarter either way" },
            ],
            answer: "a",
            explanation:
              "The forcing is the per-query currency: stable × universal × high-volume = the exact profile where prompt tax compounds past training cost. Option (b) is the folklore version — prompts do control shape; they just keep paying for it.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "An adjacent fintech copies Varta's table wholesale. Six months later their serving layer ships efficient prompt-prefix caching (shared KV cache across queries). Their SFT-routed greeting style now costs more to maintain (retraining on every brand refresh) than to prompt. Which constraint flipped, and what does the architecture require?",
            choices: [
              { id: "a", label: "Prompt-context cost collapsed from per-query to amortized — the bottom rung's cheapness argument strengthened, and the greeting-style row should be re-derived down to Prompt. The architecture requires the quarterly cost-vector review, not loyalty to last quarter's table" },
              { id: "b", label: "SFT's cost rose — the training run got objectively more expensive, so the row flips for that reason" },
              { id: "c", label: "No constraint flipped — caching is an implementation detail below the architecture's abstraction level" },
              { id: "d", label: "The freshness constraint flipped — cached prompts are stale by construction" },
            ],
            answer: "a",
            explanation:
              "The flip is in the cost vector the whole derivation stands on: per-query prompt tax → amortized prefix cost. Rows whose binding constraint was 'prompt too expensive at volume' must re-derive. The architecture is a function, not a commitment.",
          },
        ],
      },
      {
        slug: "the-data-engine",
        title: "The data engine",
        blurb: "Synthesis, distillation, licensing, dedup, decontamination — at corpus scale.",
        topic: "varta-data",
        skillIds: ["finetune-data-engine"],
        capability: "Design a licensed, decontaminated data engine mixing real, synthetic, and distilled sources.",
        minutes: 11,
        concept: {
          anchor:
            "A refinery, not a mine: crude from three wells, one cracking loop, and assay on every batch.",
          what: "The data engine is a **pipeline with contracts**. Sources (real logs, synthetic generation, frontier-model distillation) each carry license and provenance metadata. A cracking loop (dedup → near-dup → decontamination) runs per batch. And an **assay** — dataset-level stats that gate release, because corpus-scale failures are statistical, not anecdotal.",
          why: "Varta's regional constraint makes this load-bearing: Hindi/Tamil banking corpora are thin, so 70% of the SFT pack is synthetic or distilled. And synthetic data imports the generator's distributional biases (verbosity, register, hallucinated product names) unless the engine measures and counterweights them.",
          where: [
            "Varta's sources: **anonymized teller logs** (licensed, PII-scrubbed), **synthetic branch scenarios** (template × LLM expansion), **distilled frontier outputs** (ToS-permitting provider, logged per-row)",
            "The **license ledger**: every row traceable to its source grant — the artifact RBI audit actually requests",
            "**Assay metrics**: dup-rate, near-dup clusters, eval-contamination hits, synthetic/real ratio drift",
          ],
          whenNot:
            "Distillation assumes the teacher's ToS permits training use of its outputs — relax that (provider forbids it, or your jurisdiction unsettles it) and the engine loses its largest source overnight. The synthetic expansion loop alone won't cover domain breadth at acceptable diversity.",
        },
        diagram: {
          kind: "flow",
          steps: [
            { kind: "input", text: "Three wells: real logs · synthetic · distilled" },
            { kind: "process", text: "Provenance + license tagging per row" },
            { kind: "process", text: "Cracking: dedup → near-dup → decontaminate" },
            { kind: "process", text: "Counterweight: rebalance synthetic/real ratio" },
            { kind: "decision", text: "Assay passes thresholds?" },
            { kind: "output", text: "Released batch + license ledger entry" },
          ],
          loop: "assay fails → quarantine batch, adjust upstream",
        },
        prose: [
          "Varta's data problem looks like a quality problem, but it is really a supply problem. Regional-language banking conversations are scarce: the teller logs hold ~40k usable exchanges after anonymization, an order of magnitude short of the pack the behavior matrix implies. The engine closes the gap with two wells — template-driven synthetic scenarios (branch situations enumerated from the product spec, expanded by a generator, human-spot-checked at 5%) and distilled frontier outputs (real customer questions, answered by a frontier model, edited by bilingual reviewers). Each well is logged per-row: source, generator version, license grant, editor ID. That ledger is not bureaucracy. It is what the audit asks for, and what makes a batch reproducible a year later.",
          "The cracking loop is where corpus scale changes the game. Exact dedup is trivial; near-dup at scale is where datasets rot. MinHash-style clustering collapses the 'same question in eleven registers' piles that would otherwise teach frequency. Decontamination runs against every eval suite the org owns (not just this project's), because a leaked benchmark question anywhere upstream poisons every model trained on the batch. The assay then gates release on statistical thresholds: dup-rate under target, zero eval-hits, synthetic/real ratio within band. These batch-level controls catch what per-row review structurally cannot.",
          "The boundary: the engine's biggest well stands on the teacher's terms of service. Distillation assumes training-use rights over the frontier model's outputs. That assumption varies by provider, by API tier, and by jurisdiction — and it has changed retroactively before. The engineering hedge is architectural: the license ledger makes every distilled row quarantine-able in one filter operation. And the assay tracks the synthetic-only counterfactual (pack quality with distilled rows excluded), so the engine knows its fallback position before it needs one. Design the refinery so the well can close.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Varta's assay flags a released-looking batch: near-dup clusters at 9% (threshold 3%), concentrated in 'fixed-deposit rate questions.' The synthetic expansion loop used one template family for FD scenarios. Diagnosis and the engine-level fix?",
            choices: [
              { id: "a", label: "Model failure — reject the batch and retrain from the previous pack; the model learned the cluster" },
              { id: "b", label: "Source failure: one template family produced register-variants of one question, so the cracking loop sees a frequency bomb. Fix upstream (diversify the FD template families) AND tighten near-dup clustering, because downstream dedup alone leaves the distributional hole" },
              { id: "c", label: "Threshold failure — 9% is acceptable; raise the threshold to 10% and release" },
              { id: "d", label: "License failure — FD questions must have leaked from a competitor's corpus" },
            ],
            answer: "b",
            explanation:
              "The assay is upstream diagnosis: concentrated near-dups mean the synthetic well under-diversified that scenario. Dedup downstream only removes the duplicates — it can't restore the missing diversity. Fix wells, not just batches.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A health-tech clone of the engine learns that its distillation teacher's updated terms now forbid training on outputs. Which design decision decides whether this is an emergency or a config change?",
            choices: [
              { id: "a", label: "The per-row provenance ledger — if every distilled row is filterable by source in one operation, the engine drops the well and re-runs the assay on the synthetic+real remainder. Without row-level provenance, the whole corpus is suspect and every downstream model is quarantinable" },
              { id: "b", label: "The model architecture — transformers trained on now-unlicensed data must be retrained from scratch as a legal matter" },
              { id: "c", label: "The eval suite — if the evals were built from licensed data only, no action is needed" },
              { id: "d", label: "The near-dup threshold — tighter clustering retroactively licenses the retained rows" },
            ],
            answer: "a",
            explanation:
              "The boundary was pre-named: the ledger exists so the well can close in one filter. The blast radius of a ToS change is an engineering function of provenance granularity — designed in advance, not negotiated mid-emergency.",
          },
        ],
      },
      {
        slug: "objective-landscape",
        title: "The objective landscape",
        blurb: "SFT, DPO, ORPO, PPO, GRPO — what each optimizes, and the failure mode each installs.",
        topic: "varta-objectives",
        skillIds: ["preference-tuning"],
        capability: "Choose a training objective from its failure modes and the infrastructure it demands.",
        minutes: 11,
        concept: {
          anchor:
            "Five instruments, one orchestra: each objective plays a different signal — likelihood, pairs, ratios, reward.",
          what: "Post-pretraining objectives differ in **what signal they consume**: SFT maximizes likelihood of demonstrations; DPO optimizes a closed-form ratio on preference pairs (no reward model, no RL loop); ORPO folds the preference signal into one SFT-stage loss; PPO maximizes a learned reward under KL constraint (RL infrastructure, strongest optimization); GRPO optimizes group-relative reward advantage (rollout-based, reward-model-optional).",
          why: "Objective choice is failure-mode procurement: each objective installs a specific pathology — SFT's mode collapse toward demonstration style, DPO's verbosity bias, PPO's reward hacking and training instability, GRPO's rollout cost. So the choice is which pathology your evals can catch and your team can operate.",
          where: [
            "Varta's choice: **SFT (behavior) → DPO (register/taste)**, because a four-person platform team cannot operate PPO's reward-model-plus-rollout loop under an on-prem GPU budget",
            "Where **PPO/RLHF earns its cost**: hard safety constraints, agentic long-horizon tasks where 'which of these two' data can't express the objective",
            "**GRPO's 2025–26 rise**: reasoning-style tasks — verifiable rewards (unit tests, math checks) replace fragile reward models",
          ],
          whenNot:
            "The DPO-family derivation assumes the preference data spans the behavior you care about. Relax that (pairs cover tone but not refusal boundaries) and the objective optimizes what it has, silently leaving the uncovered behavior at base-model quality. No objective fixes unrepresented behavior.",
        },
        diagram: {
          kind: "compare",
          left: { title: "DPO-family", subtitle: "offline pairs, closed-form" },
          right: { title: "PPO / GRPO", subtitle: "online rollouts, reward signal" },
          rows: [
            { label: "Signal consumed", left: "static chosen/rejected pairs", right: "rollouts scored by reward" },
            { label: "Infrastructure", left: "SFT-like trainer", right: "rollout engine + reward model or verifier" },
            { label: "Signature failure", left: "verbosity bias; span-limited coverage", right: "reward hacking; instability" },
            { label: "Team cost", left: "low — one stage", right: "high — a loop to babysit" },
          ],
        },
        prose: [
          "Read the landscape by signal, not by acronym. SFT consumes demonstrations — 'make this more likely'. Its pathology: likelihood is a blunt instrument for taste. It pushes toward the demonstration distribution's modes, and it cannot express a preference between two acceptable outputs. DPO consumes pairs and derives, from the RLHF objective under a preference-model assumption, a closed-form loss on the log-probability margin between chosen and rejected — RL's target without RL's loop. ORPO merges the two: a reference-free single-stage loss that applies an odds-ratio penalty to rejected responses during SFT itself. It trades a little theoretical tightness for one fewer stage.",
          "The online family consumes outcomes. PPO generates rollouts, scores them with a learned reward model, and updates under a KL leash to the reference. It is the strongest optimizer on the menu, and the only one that can pursue objectives nobody can write as pairs (long-horizon tool use, hard safety margins). Its procurement cost is operational: a reward model that is itself a trained artifact with its own drift and hacking surface, plus a rollout-and-update loop needing GPU headroom and someone on call for divergence. GRPO replaces the per-sample critic with group-relative advantage — sample N rollouts per prompt, reward them, weight updates by within-group advantage. That deletes the critic and, when the reward is verifiable (tests pass, the math checks), deletes the reward model too. That's why reasoning-training pipelines converged on it.",
          "Varta's derivation is a team-capability argument as much as a math one. The register/taste gap (too formal, over-explains, one-right-answer tone) is pair-expressible. The safety boundaries are rule-driven and eval-gated downstream. And the platform team is four people with an on-prem A10 budget. DPO after SFT is forced by those constraints — and the boundary is equally forced: when Varta later adds an agentic payments-workflow feature whose objective is 'complete the transfer correctly,' pairs cannot express it. That capability rents the online family (GRPO with a verifier, most likely). The landscape doesn't collapse to one instrument; it's an orchestra, scored per movement.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "After DPO, Varta's replies score better on register but average 40% longer, and the eval's verbosity rubric item has slipped. The team debates: bug in the loss? bad data? wrong objective? Diagnose from the landscape.",
            choices: [
              { id: "a", label: "Wrong objective — DPO cannot be used for register; switch to ORPO immediately" },
              { id: "b", label: "Known pathology: DPO's log-margin objective rewards separating chosen from rejected, and longer replies separate more easily — the verbosity bias is the objective's signature failure. Counter it in the data (length-balanced pairs) and gate it in the eval (verbosity rubric item), or price the switch to an objective without the bias" },
              { id: "c", label: "Bad data only — regenerate all pairs; the objective itself has no length bias" },
              { id: "d", label: "Training bug — DPO loss must be implemented wrong, since register and length are independent" },
            ],
            answer: "b",
            explanation:
              "This is the failure-mode procurement rule working: you chose DPO knowing verbosity bias is its signature; the eval item you installed for exactly this case fired. The response is data counterweight + gate, or an objective change — a priced decision, not a mystery.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Varta spins up the agentic transfer workflow: the objective is 'complete the multi-step transfer correctly,' with success verifiable by a sandboxed ledger check. Someone proposes DPO pairs of good/bad transcripts. Which constraint of the DPO derivation does the task violate, and what does it force?",
            choices: [
              { id: "a", label: "The static-pairs constraint: the objective is outcome-conditional over long horizons — the quality of a step depends on everything after it, which pairs can't compactly express. Verifiable outcome rewards force the online family (GRPO with the ledger check as verifier)" },
              { id: "b", label: "No violation — transcript pairs express it fine; DPO remains optimal" },
              { id: "c", label: "The KL constraint — DPO has no reference model, so it can't be applied to agents at all" },
              { id: "d", label: "The verbosity constraint — agents must write short outputs, which DPO forbids" },
            ],
            answer: "a",
            explanation:
              "The derivation's domain: pairs express 'which of two complete goods.' Credit-assignment over multi-step outcomes with a verifiable check is the GRPO-shaped signal — the boundary rule deciding when the offline family stops applying.",
          },
        ],
      },
      {
        slug: "preference-data",
        title: "Preference data construction",
        blurb: "Pairs, margins, reward hacking, judge bias — the data contract behind DPO-family training.",
        topic: "varta-objectives",
        skillIds: ["preference-tuning"],
        capability: "Construct and audit preference pairs, calibrate margins, and catch reward hacking early.",
        minutes: 10,
        concept: {
          anchor:
            "A blind taste test with an agenda: whoever designs the flights decides what 'better' means.",
          what: "Preference data is a **measurement instrument**: pairs (prompt, chosen, rejected) whose margin distribution the DPO-family loss converts into behavior. So pair construction (who compares, what rubric, how close the pair) IS the objective specification. And its biases (annotator drift, length preference, judge self-preference) train directly into the model.",
          why: "Varta's DPO quality ceiling is set here, not at the trainer: 2,800 pairs whose margins encode 'the bilingual senior teller's register'. Their failure modes (verbosity bias, sycophancy toward polite-but-wrong answers) are installed at construction time and only observable after training.",
          where: [
            "Varta's **pair sources**: real teller replies vs model drafts (natural pairs), and SFT-model samples judged pairwise by bilingual reviewers under a written register rubric",
            "**Margin audit**: distribution of chosen-vs-rejected quality gaps — too-easy pairs waste compute, too-hard pairs inject noise",
            "**Judge rotation**: LLM-judge pairs audited against human calls monthly; position and length bias checked per batch",
          ],
          whenNot:
            "Pair data assumes the chosen response is *actually better under the target rubric* — relax that (annotators fatigued, judge drifted, rubric ambiguous on the edge cases) and the loss faithfully optimizes toward noise. The objective can't tell a bad measurement from a true preference.",
        },
        exercise: {
          id: "ex1",
          title: "Audit the margin distribution",
          prompt:
            "margin_audit flags pair-set pathologies: 'too easy' pairs (quality gap above hi) waste training signal, 'inverted' pairs (chosen scored below rejected) are measurement noise. The inverted check compares the wrong direction — fix it.",
          starterCode: `def margin_audit(pairs, hi=0.8):
    """pairs: list of {"chosen": float, "rejected": float} quality scores.
    Return {"easy": n_easy, "inverted": n_inverted}."""
    easy = 0
    inverted = 0
    for p in pairs:
        gap = p["chosen"] - p["rejected"]
        if gap > hi:
            easy += 1
        if p["rejected"] > p["chosen"]:   # <-- wrong comparison
            inverted += 1
    return {"easy": easy, "inverted": inverted}
`,
          testCode: `
pairs = [
    {"chosen": 0.9, "rejected": 0.1},   # easy
    {"chosen": 0.6, "rejected": 0.5},   # good, tight margin
    {"chosen": 0.3, "rejected": 0.8},   # inverted
    {"chosen": 0.7, "rejected": 0.6},   # good, tight margin
]
got = margin_audit(pairs)
ok = True
message = "ok"
if got != {"easy": 1, "inverted": 1}:
    ok = False
    message = f"margin_audit -> {got}, expected 1 easy + 1 inverted"
`,
        },
        prose: [
          "The uncomfortable truth first: the DPO loss is a faithful amplifier of whatever the pairs encode. It cannot distinguish a true preference from a measurement error — both are 'preferences' by the time training sees them. So construction discipline decides the outcome. Varta's protocol: every pair carries rubric-anchored quality scores from two bilingual reviewers. Disagreements don't average; they escalate to a third call and a rubric edit. The escalation log doubles as the audit trail — systematic disagreements localize rubric ambiguity, which is the cheapest possible place to discover it.",
          "Margin structure is the second design axis. The loss learns from the gap between chosen and rejected. Pairs where one side is garbage (gap ≈ 1) teach almost nothing — the model already separates them. Pairs with a tight, meaningful margin (gap 0.1–0.3 under the rubric) carry the signal. Varta's audit targets: <15% easy pairs, near-zero inverted pairs (chosen scored below rejected — measurement noise that trains the model backward). The exercise builds that audit. Sampling strategy follows the same logic: generate rejections from the current model version. The margin then sits exactly where the model's current frontier is, and each training round targets its live failure surface.",
          "The reward-hacking and judge-bias boundary closes the loop. Whatever correlates with 'chosen' in the pair data becomes the trained direction — and length is the classic confounder (longer answers win human flights ~55–60% all else equal). That is why Varta length-matches pairs before review, and why the verbosity rubric item exists in the eval gate. When an LLM judge scales the review, its own biases join the instrument: position bias (swap the order, the preference flips), self-family preference. The audit is monthly and mechanical — order-swap consistency above threshold, human-agreement on a fixed 50-pair calibration set — because a drifting judge silently rewrites the objective mid-program.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Varta's monthly judge audit: order-swap consistency has fallen from 92% to 71% over two batches, human agreement from 84% to 66%. The DPO runs trained on these batches are scoring fine on register. What is the correct reading?",
            choices: [
              { id: "a", label: "The runs are fine — register scores are the metric that matters" },
              { id: "b", label: "The measurement instrument is failing: an inconsistent judge injects noise pairs, and the register eval passing means the noise hasn't hit that rubric item YET. Freeze judge-scored batches, revert to human review for the affected source, and re-audit the judge's own version drift before resuming" },
              { id: "c", label: "Re-train the models immediately — noisy pairs have certainly corrupted them" },
              { id: "d", label: "Raise the judge's temperature to break its position bias" },
            ],
            answer: "b",
            explanation:
              "Judge drift rewrites the objective silently; the eval gate catching nothing yet is not evidence of safety, it's evidence the noise hasn't reached a measured item. Freeze, segregate, audit the instrument — the same discipline as any miscalibrated sensor in a production system.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A support-tech team's DPO model became noticeably sycophantic — it apologizes and reverses correct answers when users push back. Their pairs were built from customer-upvoted replies. Which construction constraint did the data violate, and what's the repair?",
            choices: [
              { id: "a", label: "No constraint violated — sycophancy is an inherent DPO artifact with no data-side cause" },
              { id: "b", label: "The pairs encoded crowd preference, and crowds prefer agreeable-but-wrong over correct-but-firm — the confounder trained directly in. Repair by rubric-anchored expert review where 'correct under policy' gates the chosen side before any preference is recorded" },
              { id: "c", label: "The margin was too tight — widen all pairs and the sycophancy washes out" },
              { id: "d", label: "The judge was biased toward long replies — cap reply length in serving" },
            ],
            answer: "b",
            explanation:
              "The instrument rule: pairs ARE the objective. Upvote data measures agreeability, so the loss optimized agreeability. Correctness-gating the chosen side is the standard confounder repair — decide what 'better' means before measuring it.",
          },
        ],
      },
      {
        slug: "qlora-scaling-limits",
        title: "QLoRA scaling limits",
        blurb: "What fits where: rank, context, and batch on T4/L4/A100 — and the constraint that flips the analysis.",
        topic: "varta-method",
        skillIds: ["lora-fine-tuning", "finetune-memory-math"],
        capability: "Compute the QLoRA feasibility boundary across GPUs and identify when activations overtake weights.",
        minutes: 11,
        concept: {
          anchor:
            "A warehouse with a fixed loading dock: pallet count is easy math — the dock schedule is where plans die.",
          what: "QLoRA's floor is `0.5·P + 16·P_adapter + activations`: base at 4-bit, adapter state at full precision, and an activation term scaling with `batch × context²` (attention) that eventually dominates. On a 16 GB T4, 3B QLoRA is comfortable and 7B is the edge; on 24–48 GB, 7–14B. Long regional-context workloads hit the activation wall before the weight wall.",
          why: "Varta's fleet is heterogeneous (on-prem A10s, rented L4s, free-tier T4s for experiments). The feasibility spreadsheet — run per (model, rank, context, batch, GPU) — is what turns 'can we try 7B?' from a meeting into an arithmetic row.",
          where: [
            "Varta's **fit matrix**: 3B-r16-4096ctx on T4 ✓ · 7B-r16-4096ctx on A10 ✓/edge · 7B-8192ctx needs L4+",
            "**The flip**: past ~8k context on small cards, activations — not weights — are the binding term; gradient checkpointing trades ~30% step time for the activation memory that buys the context",
            "**Kaggle T4×2**: the free tier's second card buys shard-parallel inference, not training parallelism, for most trainer configs",
          ],
          whenNot:
            "The analysis assumes the activation term is compressible (checkpointing, flash attention's exact-memory softmax) — relax that assumption at extreme context (>32k, where checkpointing still leaves attention working sets that don't fit) and no affordable rank or batch rescues the run. That regime belongs to sequence-parallel training or a smaller model, not more optimizer tricks.",
        },
        prose: [
          "Write the ledger precisely, then watch which term moves. Weights: a 4-bit base bills P/2 bytes — 3B ≈ 1.5 GB, 7B ≈ 3.5 GB. Adapter state at rank 16: ~30–60 MB of parameters plus their optimizer state — two orders below the base, which is the whole point. Activations: the term everyone underestimates — attention's working set scales with batch × context (and quadratically with context under naive softmax; linear with flash attention's blocked exact softmax). At 4k context on a 3B model, activations are noise. At 16k on a 7B, they are the budget.",
          "The flip is the lesson's core claim: the binding constraint changes regime. Small-context workloads are weight-bound, and weight-bound questions are easy arithmetic (does 0.5P fit?). Long-context workloads are activation-bound, and activation-bound questions are engineering: gradient checkpointing (recompute activations in backward, ~30% step-time cost, O(√L) memory in layers), flash attention (exact softmax without materializing the full attention matrix), micro-batch 1 with accumulation. Varta hit the flip concretely: the regional-language KYC conversations run long (form-filling dialogues). The 7B-8192 run that 'fit' by weight math OOM'd at batch 2, until checkpointing bought the context at acceptable step cost.",
          "The fleet view closes it. The fit matrix — one row per (model, rank, context, batch, GPU) with the binding term labeled — is a maintenance artifact, re-run when models or hardware change, because the numbers drift with both. And the free-tier row matters more than its size suggests: the T4 column is where every experiment starts (the capstone runs there). Knowing its exact edge — 3B comfortable, 7B only with checkpointing and micro-batch 1 — is knowing which meetings to skip.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Varta's 7B QLoRA run at 8192 context OOMs on the A10 (24 GB) at micro-batch 2, despite weight math saying 3.5 GB base + adapter fits 'with plenty of room.' Weight math is right. What's the binding term, and the standard trade?",
            choices: [
              { id: "a", label: "The adapter optimizer state — reduce rank 16 → 8 and the run fits" },
              { id: "b", label: "Activations: at 8k context the attention working set scales past everything else — enable gradient checkpointing (~30% slower steps) and/or drop to micro-batch 1 with accumulation. Flash attention removes the quadratic term's memory, not the working set entirely." },
              { id: "c", label: "The 4-bit dequantize buffers — quantize the adapter too" },
              { id: "d", label: "Weight fragmentation — defragment GPU memory before training" },
            ],
            answer: "b",
            explanation:
              "This is the regime flip in the wild: the ledger's third term overtaking the first. Rank reduction saves megabytes against a multi-GB deficit — the arithmetic names the real lever before intuition wastes a day.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A legal-tech team wants 65k-context contract review fine-tuned on a single 48 GB card, planning 'checkpointing + flash attention + batch 1.' Which constraint, when relaxed, would flip their conclusion — and what does the unrelaxed case force?",
            choices: [
              { id: "a", label: "The compressibility of the activation term — checkpointing reduces layer activations but at 65k the residual attention working sets and optimizer pipeline still overflow 48 GB. Unrelaxed, the conclusion forces sequence-parallel training across cards or a smaller model with retrieval over the contract, not more optimizer tricks" },
              { id: "b", label: "The 4-bit weight floor — relaxing to 8-bit would free enough memory at 65k context" },
              { id: "c", label: "The adapter rank — rank 4 halves activation memory at any context" },
              { id: "d", label: "The batch size — batch 1 is already the floor, so nothing can overflow it" },
            ],
            answer: "a",
            explanation:
              "The whenNot named the regime: past ~32k, activation compressibility itself breaks down — checkpointing still leaves working sets that don't fit. The flip is at the memory-hierarchy level, and the honest answers are architectural (parallelism, smaller model + retrieval), not dial-level.",
          },
        ],
      },
      {
        slug: "training-stability",
        title: "Training stability",
        blurb: "Loss spikes, schedules, packing, flash attention, checkpointing — the long-run health kit.",
        topic: "varta-method",
        skillIds: ["training-stability"],
        capability: "Diagnose and prevent fine-tune instabilities: spikes, divergence, and the silent degradation modes.",
        minutes: 11,
        concept: {
          anchor:
            "A long-haul truck: the engine rarely fails dramatically — it loses efficiency quietly until the log explains why.",
          what: "Stability is managed at three layers: **schedule** (warmup + cosine/linear decay sets the step-size envelope that prevents early divergence), **batch construction** (packing short sequences for throughput, length-grouped sampling to keep gradient variance bounded), and **memory tricks with stability prices** (checkpointing costs step time; packing costs cross-contamination unless attention-masked).",
          why: "Varta's continued-pretraining stage runs 40+ GPU-hours — a divergence at hour 30 is a lost week if undetected. And the silent modes (a packing bug leaking context across documents, an LR schedule restart mid-run) degrade quality without ever alarming.",
          where: [
            "The **spike triage**: single-step spike (data — inspect the batch) vs sustained climb (rate/optimizer — restart from checkpoint at lower LR) vs step-time inflection (memory pressure, thermal)",
            "**Packing with block-diagonal attention masks** — contiguous short docs share a sequence without attending to each other",
            "**Deterministic restart**: every long run checkpoints with optimizer state + data order seed, making 'resume' boring",
          ],
          whenNot:
            "The stability kit assumes gradients are informative — in the low-data regime (hundreds of pairs), the bigger risk isn't instability but **silent overfitting**: the loss chart looks immaculate while transfer dies, and no amount of schedule engineering rescues it. Stability tools serve the healthy-training regime; below its data floor, they polish a run that shouldn't exist.",
        },
        prose: [
          "The loud failure first: loss spikes. A single-step spike with immediate recovery is almost always data — one pathological sequence (a mis-rendered template, a corrupted row, a language-mismatched outlier) producing a huge gradient. The response is identification, not panic: log per-batch loss, locate the batch, inspect the rows. A sustained climb is the rate/optimizer signature — schedule truncation (a warmup restart at the wrong step), an LR interacting badly with a pack change, or 4-bit noise crossing a threshold. The response is rollback to the last healthy checkpoint with the offending variable changed. The triage tree exists because these two spikes look identical on a zoomed-out chart and demand opposite responses.",
          "The quiet failures are the expensive ones. Packing — concatenating short documents into full sequences for throughput — silently leaks context when implemented without block-diagonal attention masks: document 17's tail becomes document 18's prefix. The model learns cross-document continuation, and quality degrades in ways no loss chart shows (the eval gate catches it weeks later if you're lucky). Length-grouped sampling has its own quiet failure — group too aggressively and batch composition drifts from the data distribution, biasing the gradient. Each throughput trick carries a correctness contract. The health kit is those contracts enforced (masked packing, bounded length-grouping deltas) rather than the tricks avoided.",
          "The boundary where the whole kit stops mattering: low-data regimes. Stability engineering presumes gradients worth stabilizing — at 500 pairs, the run will be gloriously stable and perfectly overfit, because overfitting isn't instability. It's optimization succeeding at the wrong objective. That's why Varta's stage gates pair the training-health dashboard with the transfer eval from the first checkpoint: stability tooling serves the healthy regime, and the data floor is a different lesson's constraint (the In-Practice course's curation contract). Run both gauges; neither substitutes for the other.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Hour 22 of Varta's continued-pretraining run: loss jumps 0.4→2.1 for exactly one step, then recovers to trend within three steps. The on-call engineer proposes rolling back 4 hours to the last daily checkpoint. Correct call?",
            choices: [
              { id: "a", label: "No — single-step spike with immediate recovery is the data signature: log batch IDs, locate the offending batch, inspect and patch the row (or filter), continue from the current step. A 4-hour rollback re-pays compute for a solved problem" },
              { id: "b", label: "Yes — any spike above 5× baseline means the optimizer state is corrupted" },
              { id: "c", label: "No, but only because daily checkpoints don't exist — restart the run from zero at lower LR" },
              { id: "d", label: "Yes — single-step spikes are always precursors to sustained divergence later in the run" },
            ],
            answer: "a",
            explanation:
              "The triage tree's first fork: transient spike = data, sustained climb = optimizer. One bad batch doesn't poison Adam state beyond recovery — identify, patch, continue. The rollback reflex pays the maximum cost for the minimum cause.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A team reports: throughput doubled after enabling packing, charts are clean, but the eval gate shows the model increasingly continues documents mid-sentence instead of following instructions. Which stability contract was violated, and what's the fix?",
            choices: [
              { id: "a", label: "The divergence contract — lower the learning rate; the model is over-optimizing" },
              { id: "b", label: "The packing correctness contract: without block-diagonal attention masks, adjacent packed documents attend to each other, teaching cross-document continuation. Mask the packing boundaries (or disable packing) and restart from the pre-packing checkpoint" },
              { id: "c", label: "The eval is stale — document-continuation behavior is expected after packing and harmless" },
              { id: "d", label: "The schedule contract — warmup was too short for the higher throughput" },
            ],
            answer: "b",
            explanation:
              "The quiet failure mode in person: clean loss, degraded transfer, cause in batch construction. Packing buys throughput against a correctness contract; the symptom (cross-document continuation) is the leak's fingerprint.",
          },
        ],
      },
      {
        slug: "multi-stage-pipelines",
        title: "Multi-stage pipelines",
        blurb: "Continued-pretrain → SFT → DPO: when each stage exists, what each can undo, and what to skip.",
        topic: "varta-pipeline",
        skillIds: ["sft-pipeline"],
        capability: "Design a multi-stage training pipeline and defend each stage's inclusion and ordering.",
        minutes: 10,
        concept: {
          anchor:
            "A relay where each runner can drop the baton the previous one handed over — order and handoff discipline are the design.",
          what: "Multi-stage pipelines order **representation change before behavior before taste**: continued pretraining (domain knowledge into representations) → SFT (task behavior) → preference tuning (register/taste). Each stage assumes the previous stage's output as its base. And each can erode the previous stage's gains (DPO can dent SFT's format compliance; aggressive SFT can blur domain knowledge).",
          why: "Varta's pipeline exists because its gap is stacked: the base underknows regional banking (stage 1), the instruction behavior is generic (stage 2), the register is wrong (stage 3) — three gaps, three objectives. And the sequencing rule: skipping a stage is a priced decision, not an omission.",
          where: [
            "Varta's stack: **CPT on 1.4B tokens of licensed regional banking corpus → SFT (the data-engine pack) → DPO (teller-judged pairs)**",
            "**The skip rule**: no domain-knowledge gap → no CPT; no taste gap → no DPO; most product fine-tunes are SFT-only",
            "**Inter-stage evals**: each stage gated before the next consumes it — errors compound downstream",
          ],
          whenNot:
            "The pipeline assumes stages compose monotonically — relax that (aggressive LR in a later stage, or preference data spanning format-sensitive behaviors) and the later stage un-trains the earlier one. DPO's verbosity drift denting SFT's strict receipt format is the canonical Varta incident. The defense is inter-stage gating with per-item regression checks, not faith in composition.",
        },
        diagram: {
          kind: "flow",
          steps: [
            { kind: "input", text: "Base model" },
            { kind: "decision", text: "Domain-knowledge gap?" },
            { kind: "process", text: "CPT: corpus into representations" },
            { kind: "process", text: "SFT: behavior pack" },
            { kind: "decision", text: "Taste/register gap?" },
            { kind: "process", text: "DPO: preference pairs" },
            { kind: "output", text: "Gated artifact per stage" },
          ],
          loop: "stage gate fails → fix that stage's data, re-run stage",
        },
        prose: [
          "The ordering is derivable from what each objective can touch. Continued pretraining changes representations — it moves what the model knows, working on raw corpus with a plain LM objective. SFT conditions behavior on that knowledge — but it cannot add knowledge, only shape its expression (the Foundations-course boundary, now a sequencing argument). Preference tuning adjusts the expression's register — choosing among behaviors SFT already made available. Knowledge → behavior → taste: each stage's output is the next stage's substrate. Reversing the order wastes the later stage (DPO on a model that lacks the domain representations optimizes taste over ignorance).",
          "The skip rule keeps the pipeline honest. CPT is the expensive stage (GPU-days, corpus licensing) and it exists only for a knowledge gap — 'our model doesn't know regional banking' — measurable as a domain-eval delta before any training. Most product fine-tunes have no such gap and correctly skip to SFT. DPO exists only for a taste gap that survives SFT — measurable the same way. Varta's stack has all three because its audit showed all three gaps. The pipeline is evidence-driven assembly, not a ceremony of completeness.",
          "The boundary is the erosion rule: stages do not automatically compose. A later stage trained too hard un-trains an earlier one — Varta's DPO run dented receipt-format compliance by 6 points before the inter-stage gate caught it (verbosity drift pushing on format-sensitive behavior). The fix was format-anchored pairs in the DPO data and a lower final-stage LR. The defense is architectural: every stage gate re-runs the FULL eval suite — including the items earlier stages bought — so erosion is caught at the handoff instead of in production. The pipeline's last artifact is the chain of gated checkpoints, one per stage, each rollback-able.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A team with a strong SFT-only history launches a regional-legal assistant; their domain eval shows the base model lacks statute knowledge, and they propose 'more SFT data — just add statute Q&A pairs.' What does the ordering derivation say?",
            choices: [
              { id: "a", label: "Correct — SFT data volume substitutes for any knowledge gap given enough pairs" },
              { id: "b", label: "The gap is representational: SFT shapes expression of knowledge the model must already carry, and statute Q&A pairs teach statute-shaped patterns with shallow representations. The derivation forces CPT on the statute corpus first (then SFT for citation behavior), or retrieval if the corpus won't license" },
              { id: "c", label: "Correct — knowledge and behavior are the same thing at the training-objective level" },
              { id: "d", label: "Skip both — statute knowledge is freshness-critical, so RAG alone is always sufficient" },
            ],
            answer: "b",
            explanation:
              "The sequencing rule from what each objective touches: likelihood-shaped QA pairs can't install a corpus's representations. Option (d) over-rotates — retrieval handles freshness, not the deep register/format behaviors the product also needs; the pipeline and the routing table compose.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Varta's stage-3 DPO ships; a week later, receipt-format compliance — bought and gated at stage 2 — has dropped measurably in production. Which pipeline assumption broke, and which constraint, if respected, would have caught it pre-ship?",
            choices: [
              { id: "a", label: "The monotone-composition assumption broke — a later stage un-trained an earlier one (DPO's verbosity drift pushing format-sensitive behavior). The full-suite inter-stage gate — re-running stage-2's format items on the DPO output — was the constraint whose enforcement catches exactly this at the handoff" },
              { id: "b", label: "The ordering assumption broke — DPO should always precede SFT" },
              { id: "c", label: "No assumption broke — production drift is normal and unrelated to training stages" },
              { id: "d", label: "The SFT stage was undertrained — more epochs at stage 2 prevents any later erosion" },
            ],
            answer: "a",
            explanation:
              "The erosion rule: stages can undo their predecessors, and the pipeline's defense is gating every stage against the FULL suite — the earlier stages' items included. Production caught what the gate would have; the fix is procedural, not reordering.",
          },
        ],
      },
      {
        slug: "evaluation-at-production",
        title: "Evaluation at production level",
        blurb: "Contamination-proof suites, judge calibration, human review loops, online signals — one system.",
        topic: "varta-eval",
        skillIds: ["finetune-evaluation"],
        capability: "Operate an eval system with versioned suites, calibrated judges, human loops, and online drift signals.",
        minutes: 11,
        concept: {
          anchor:
            "A bank's internal audit function: independent of the desk it audits, versioned, and refreshed on a schedule.",
          what: "Production evaluation is a **system with separation of powers**: versioned eval suites (fresh-phrased, contamination-checked, rotated quarterly), mechanically-calibrated LLM judges (anchored to human panels, drift-audited), human review loops sampled from live traffic (the only source that sees the real distribution), and online signals (user corrections, escalation rates) wired to alarms — each layer covering the blind spot of the one above.",
          why: "Varta is audited (RBI) and deployed (1.2M queries/month): a silent eval rot — contamination, judge drift, suite staleness — is a compliance finding or a customer incident, and the system's design makes rot loud instead.",
          where: [
            "Varta's **suite inventory**: behavior rubrics (60 items), domain knowledge probes (rotated quarterly from teller escalations), safety boundaries (red-team set), format compliance (mechanical)",
            "**Judge calibration panel**: fixed 100-pair human set, agreement tracked per release; judges re-anchored on drift",
            "**Online loop**: correction-rate and escalation-rate dashboards with thresholds paged to the platform team",
          ],
          whenNot:
            "The system assumes the eval suite's distribution approximates production's — relax that (product shifts to a new query class; a regional festival changes traffic mix) and offline scores stay green while online quality moves. The online layer exists precisely as the boundary sensor. Ignoring it because 'the suite passes' is the system's designed failure alarm being dismissed.",
        },
        prose: [
          "Separation of powers is the load-bearing design. The suite authors don't train the models (their incentive would leak — suite questions drifting into packs, the contamination failure from In-Practice at organizational scale). The judges don't grade their own calibration (the human panel does, on a fixed set, monthly). The online dashboards aren't interpreted by the people whose model they might indict (platform reviews with the eval owner present). None of this is ceremony. Each wall exists because its absence has a named failure mode. Varta inherited the design from its observability stack — an eval system is an observability system whose traces happen to be graded.",
          "The suite inventory covers four signal classes, because no single class sees enough. Behavior rubrics measure the register/tone dimensions (judged, calibrated). Domain knowledge probes measure what CPT bought — and rotate quarterly, drawn from teller escalations, because a static knowledge suite memorizes (any model can overfit a fixed probe set given enough training cycles). Safety boundaries are red-team sets with hard pass bars. Format compliance is fully mechanical — parse checks, schema checks, string checks — no judgment anywhere. The rotation and the mechanical-first principle are the contamination defenses: fresh phrasings from the live escalation stream, and judgment reserved for what genuinely needs it.",
          "The online layer is the boundary sensor, and its alarm discipline is the part teams get wrong. Offline scores answer 'is the model the suite describes?' — online signals answer 'is the suite describing production?' Correction rate climbing on a new query class while every offline suite stays green is the signature of distribution shift. The runbook says: the suite is stale, not the model fine — pull samples from the shifted class, extend the suite, re-baseline. The failure mode this lesson exists for is the inverse call: 'the suite passes, ship it,' with the online alarm muted. In an audited environment, that's not a process gap — it's the finding.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Q3 at Varta: every offline suite is green across three consecutive retrains, but the online dashboard shows correction-rate up 2.1× on a new query class — UPI-limit questions after a regulatory change. What does the eval system's design say happened, and what's the move?",
            choices: [
              { id: "a", label: "The models regressed — roll back to the Q2 checkpoint immediately" },
              { id: "b", label: "The suite went stale, not the models: the suites describe the old distribution, production shifted. Pull samples of the new class, extend the behavior and knowledge suites, re-baseline, and treat the offline-green/online-red divergence as the designed alarm working" },
              { id: "c", label: "The judges drifted — recalibrate and re-run; online signals are too noisy for decisions" },
              { id: "d", label: "A transient spike — wait a full quarter before acting on online dashboards" },
            ],
            answer: "b",
            explanation:
              "The separation of powers assigns each layer a question: offline answers 'model as described,' online answers 'suite as deployed.' Green-plus-red is suite staleness by elimination — and the runbook is sample, extend, re-baseline.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "An org consolidates eval ownership under the fine-tuning team 'for velocity' — the same engineers now author suites, train models, and calibrate judges. Which named failure modes does the eval design say they've armed, and what's the minimum viable wall to rebuild?",
            choices: [
              { id: "a", label: "None — colocation improves eval-model feedback loops, a net win" },
              { id: "b", label: "Contamination (suite knowledge flowing into packs — now nobody structural opposes it) and judge self-preference (calibrating judges toward the outputs your own pipeline produces). The minimum wall is independent suite authorship + a fixed human calibration panel outside the training team — the two walls whose absence has the named failures" },
              { id: "c", label: "Only latency — consolidated teams run evals less often" },
              { id: "d", label: "Only cost — one team double-books the same GPUs for training and eval" },
            ],
            answer: "b",
            explanation:
              "Each separation wall maps to a failure it prevents; the two armed here are the ones with product-level blast radius. The rebuild doesn't need an org chart — it needs authorship independence and an external calibration anchor.",
          },
        ],
      },
      {
        slug: "the-alignment-tax",
        title: "The alignment tax",
        blurb: "Refusal drift, over-refusal, jailbreak surface — what safety tuning costs and where it moves risk.",
        topic: "varta-safety",
        skillIds: ["alignment-techniques"],
        capability: "Price the alignment tax on legitimate use and design safety tuning that doesn't over-refuse.",
        minutes: 10,
        concept: {
          anchor:
            "Insurance premiums and collateral damage in one package: every refusal boundary also refuses something legitimate.",
          what: "Safety fine-tuning installs behavioral boundaries whose costs are two-sided: the **intended refusals** (policy-violating requests) and the **over-refusal tax** (legitimate queries declined because they pattern-match near a boundary — 'how do I close a dormant account' declining because 'dormant account' brushes fraud-adjacent language). Plus a **surface shift**: tuned models relocate rather than eliminate risk, trading raw violations for jailbreak-shaped adversarial success.",
          why: "Varta is a bank: over-refusing a loan-eligibility question is lost revenue and a discrimination-shaped complaint; under-refusing a social-engineering attempt is a fraud loss and a regulator letter. The tax must be priced on both sides, per behavior, with the same eval rigor as any other behavior.",
          where: [
            "Varta's **boundary matrix**: 12 policy boundaries × (legitimate-near-boundary set, violating set, adversarial set) — all three scored every release",
            "**The over-refusal canary**: 80 legitimate-but-scary-sounding queries (closure wording, fraud-victim phrasing, joint-account disputes) with a hard ≥95% answer rate",
            "**Adversarial regression**: the jailbreak suite re-run per release — safety tuning changes the surface, and last release's defenses aren't this release's",
          ],
          whenNot:
            "The boundary design assumes legitimate and violating queries are separable by behavior — relax that (a fraud-victim's own account question is operationally identical to a fraudster's) and no refusal register can taxonomize its way out. The honest boundary is procedural (identity + context verification before the refusal decision), which is a product-flow constraint, not a training one.",
        },
        prose: [
          "Price the tax honestly: safety tuning is not free, and its cost lands on your best customers. The mechanism is generalization — a refusal boundary is learned from examples, and it generalizes over the representation neighborhood, not over your policy's precise intent. Queries near the boundary in embedding space inherit the refusal: the fraud-victim asking about unusual debits patterns near the fraud-report boundary; the genuine account-holder phrasing a closure request in the register fraudsters use. Varta's measurement: 6.8% over-refusal on the legitimate-near-boundary canary after its first safety pass — a one-in-fifteen legitimate customer told 'I can't help with that'. It fell to 2.1% after boundary-data counterweighting (legitimate examples explicitly inside the scary-looking neighborhood).",
          "The surface-shift finding is the expert-level trap: safety tuning moves risk, it doesn't delete it. Raw violations drop; adversarial success shifts shape — roleplay framings, instruction-smuggling in long documents, refusal-extraction patterns. Varta's adversarial suite regresses every release precisely because the previous release's jailbreaks are the new release's training data (via the pairs), and the frontier moves with each iteration. The eval consequence: the jailbreak suite is versioned like the model, and 'the old suite passes' is treated as no signal at all.",
          "The boundary beat — where training-based safety stops being the right tool: when legitimate and violating traffic are behaviorally indistinguishable, no amount of boundary data separates them. A fraudster with valid credentials querying 'their' account is, at the behavior layer, a customer. The honest control is procedural — step-up verification, velocity checks, session context — with the model's refusal layer handling only what's behaviorally separable (explicit policy violations, social-engineering scripts). The design review question for every boundary row: 'is this separable by behavior?' — and where the answer is no, the row belongs to product flow, not to fine-tuning.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "After Varta's safety pass, complaints arrive: legitimate customers asking about dormant-account closures get refusal-adjacent hedging. The raw-violation rate is excellent. Diagnose the mechanism and the data-side fix.",
            choices: [
              { id: "a", label: "The refusal boundary generalized over a representation neighborhood that includes legitimate closure phrasing — over-refusal tax. The fix is boundary counterweight data: legitimate examples explicitly inside the scary-adjacent neighborhood, plus the canary set gating ≥95% answer rate per release" },
              { id: "b", label: "The model is under-trained — more epochs on the safety pack sharpens the boundary and removes the hedging" },
              { id: "c", label: "The fix is a system prompt telling the model not to refuse closures" },
              { id: "d", label: "The refusal layer is working as designed — legitimate customers should accept some friction for security" },
            ],
            answer: "a",
            explanation:
              "Over-refusal is generalization working exactly as learned — the boundary covers a neighborhood, and the neighborhood contains legitimate traffic. Counterweight data reshapes which neighborhood; the canary makes the tax a gated, measured quantity.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Varta's fraud team wants the assistant to refuse 'account-takeover-style' queries — but the requesting party often holds valid credentials and phrases requests exactly as legitimate customers do. Which constraint does this boundary violate, and where does the row belong?",
            choices: [
              { id: "a", label: "The separability constraint — behaviorally indistinguishable traffic can't be split by a learned boundary. The row belongs to procedural product flow (step-up verification, velocity checks), with the model's refusal layer reserved for behaviorally separable violations" },
              { id: "b", label: "No constraint — more boundary pairs will teach the model to distinguish fraudsters from customers" },
              { id: "c", label: "The freshness constraint — takeover patterns change weekly, so RAG over a fraud wiki solves it" },
              { id: "d", label: "The verbosity constraint — shorter replies leak less and reduce takeover success" },
            ],
            answer: "a",
            explanation:
              "The lesson's boundary condition: when the violating and legitimate classes coincide at the behavior layer, training-based classification is guessing with confidence. The honest architecture puts identity and context checks in the flow and keeps refusal training for what behavior can separate.",
          },
        ],
      },
      {
        slug: "merge-distill-serve",
        title: "Merge, distill, serve",
        blurb: "Merging, distillation economics, and the quantized serving math that picks the artifact.",
        topic: "varta-serve",
        skillIds: ["model-merging-distillation", "adapter-serving"],
        capability: "Choose between merge, distill, and quantize for a deployment target, from serving arithmetic.",
        minutes: 11,
        concept: {
          anchor:
            "A shipping department: same product, three packaging options — freight math picks the box.",
          what: "The serving decision picks the **artifact** from three transformations: **merge** (fold adapters; zero inference cost), **distill** (train a smaller student on the teacher's output distribution — 7B-quality behavior in a 3B body, one-time GPU cost), and **quantize** (4/8-bit inference — ~4× memory cut with measured quality delta) — and the choice falls out of `tokens/sec = f(memory bandwidth / model bytes)` against the deployment envelope.",
          why: "Varta's envelope is hard: branch-edge servers (CPU, 8 GB), on-prem A10s for the flagship, and p95 < 800 ms — the 7B teacher cannot ship to branches at any quantization. So distillation to a 3B student isn't an optimization; it's the requirement's shape.",
          where: [
            "Varta's **artifact matrix**: flagship 7B-Q8 on A10 · branch 3B-distilled-Q4 on CPU · experiment adapters on the shared A10",
            "**Distillation economics**: ~60 GPU-hours one-time vs paying 2.3× per-query latency at every branch forever",
            "**The eval rule reprise**: every artifact — merged, distilled, quantized — re-runs the full gate on the exact bytes to be served",
          ],
          whenNot:
            "The serving math assumes the quality delta from compression is uniform across behaviors — relax that (4-bit noise concentrates on calibration-sensitive behaviors; distillation transfers the teacher's distribution, so behaviors absent from the transfer set regress to student-native quality) and the aggregate scores hide quadrant failures. Per-item gating on every artifact is the boundary enforcement.",
        },
        prose: [
          "Start from the physics and the decision collapses. Autoregressive decoding is memory-bandwidth-bound per token: each generated token reads the model's weights, so tokens/sec scales with bandwidth / model-bytes. That single ratio orders the options: merge changes nothing at serve time (the adapter's cost was training-time). Quantize divides model-bytes by ~4 for the 4-bit artifact (bandwidth-bound decode speeds up correspondingly — quantization is a latency optimization, not just a memory one). Distillation shrinks the model itself, the only lever that moves the ratio an order of magnitude. Varta's branch servers (CPU, ~20 GB/s effective) make the arithmetic brutal: the 7B at Q4 is 3.5 GB — 6 tok/s, unusable; the distilled 3B at Q4 is 1.5 GB — usable with headroom.",
          "Distillation's economics earn their one-time bill. The transfer set is the design surface: the student trains on the teacher's output distribution over the task distribution. Varta's engine generates the full behavior matrix through the 7B teacher, so the student inherits teacher-quality behavior on every represented behavior. The boundary sits exactly at the transfer set's edge: behaviors the transfer set didn't cover regress to student-native quality. That is why the artifact gate re-runs the FULL suite — the aggregate score would average the regression away, the per-item gate names it. ~60 GPU-hours one-time against 2.3× per-query latency at every branch, forever: the payback is measured in days.",
          "Merging deserves its rehabilitation note: multi-adapter serving (one base, N adapters resident) trades memory against flexibility — right for the experiment tier, wrong for the fleet; merge for anything stable. And the closing rule is the In-Practice gate at scale: every transformation (merge, distill, quantize) produces NEW bytes, and only the exact served bytes are validated. Varta's registry stores artifact-hash → gate-report pairs, and a serving change without a gate report is a release-blocker, not a shortcut.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Varta's branch servers are CPU-class with ~20 GB/s effective bandwidth. The flagship 7B at Q4 (3.5 GB) decodes around 6 tok/s — unusable against the 800 ms p95. A director proposes 'just quantize harder — 2-bit will double speed.' What does the serving math and the artifact boundary say?",
            choices: [
              { id: "a", label: "2-bit does double tokens/sec — the proposal is sound arithmetic; ship it" },
              { id: "b", label: "The arithmetic fixes the symptom, not the ratio's scale: even 1.75 GB at 2-bit lands ~12 tok/s against an 800 ms budget needing ~40+. The ratio only moves an order of magnitude by shrinking the model; distill to 3B (and the 2-bit quality delta on calibration-sensitive behaviors fails the per-item gate anyway)." },
              { id: "c", label: "Bandwidth isn't the constraint on CPU — GPU-only math doesn't apply" },
              { id: "d", label: "Serve the unmerged adapter — skipping merge avoids reading the full weight set" },
            ],
            answer: "b",
            explanation:
              "Decode is bandwidth/model-bytes: quantization divides the denominator ~2× per step, but the branch envelope needs ~7× — only distillation changes the numerator's order. And 2-bit's quality delta concentrates exactly where the per-item gate looks.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "After distilling 7B → 3B, Varta's aggregate eval is flat (−0.4 points), but the per-item gate shows the refusal-boundary suite down 9 points — refusals not in the transfer set. Which constraint does this expose, and what's the repair?",
            choices: [
              { id: "a", label: "The uniform-delta assumption: distillation transfers the teacher's distribution only over the transfer set — uncovered behaviors regress to student-native quality, and aggregates average that away. Repair by extending the transfer set to cover the refusal boundary (teacher-generated boundary examples) and re-distill, keeping the per-item gate as the enforcement" },
              { id: "b", label: "Distillation always loses safety — the 3B can't hold refusal boundaries at any transfer-set size" },
              { id: "c", label: "The gate is over-sensitive — lower the refusal suite's threshold until the artifact passes" },
              { id: "d", label: "Serve the 7B teacher to branches during refusal-heavy hours" },
            ],
            answer: "a",
            explanation:
              "The transfer set is the distillation contract's coverage clause: what it doesn't span, the student doesn't inherit. The aggregate's flatness is precisely why per-item gating exists — the quadrant failure the average hid.",
          },
        ],
      },
      {
        slug: "failure-forensics",
        title: "Failure forensics",
        blurb: "The triage tree for a bad fine-tune: data bug → template bug → training bug → objective mismatch.",
        topic: "varta-forensics",
        skillIds: ["failure-forensics"],
        capability: "Triage a degraded fine-tune through the four-fault tree using order-of-cheapness evidence.",
        minutes: 10,
        concept: {
          anchor:
            "A hospital triage line: chest pain is not one diagnosis — the order of checks is the treatment.",
          what: "Fine-tune failures sort into four fault classes — **data** (the pack is wrong: contamination, drift, schema breaks), **template/serving** (train/serve skew, render divergence), **training** (LR/schedule/stability), **objective mismatch** (the loss optimized something other than the product's goal) — and triage goes in **order of cheapness**: data and template checks are minutes and logs; training bugs cost a re-run; objective mismatches cost a redesign, so they're diagnosed last and by elimination.",
          why: "The retrain reflex is the expensive default this tree exists to prevent. Varta's incident #1 wasted 30 GPU-hours retraining on a pack that was fine, while the real fault was a tokenizer-version skew between the training image and the serving image.",
          where: [
            "Varta's **four-fault tree** with the evidence each fault class leaves: data (pack stats, leak-check logs, per-batch loss), template (byte-diff contract test, tokenizer version pins), training (loss traces, checkpoint evals), objective (everything green + product still wrong)",
            "**Incident #1 postmortem**: quality down 8 points post-deploy · retrain ×2 no change · contract test caught tokenizer skew at zero GPU cost",
            "**The elimination rule**: objective mismatch is diagnosed only after the first three classes test clean — it's the expensive diagnosis",
          ],
          whenNot:
            "The tree assumes faults are single and separable — relax that (a data bug that only manifests under a training bug's LR; two compensating template skews) and branch-by-branch triage chases ghosts. The escape is the bisect discipline (evaluate checkpoints against the gate along the run's timeline) which localizes WHEN quality left, collapsing multiple-fault ambiguity",
        },
        prose: [
          "The tree's order is its content. Data faults are cheapest to check and most common: re-run the pack stats and leak checks against the actual trained pack (hash-verified, not 'the file we think we used'), look at per-batch loss for the pathological outliers. Template faults are next: the byte-diff contract test between training render and serving render, plus the version pin everyone forgets — the tokenizer. Varta's incident #1 lived here: a serving-image rebuild pulled a tokenizer minor version with different special-token handling. Quality fell 8 points. Two retrains changed nothing (the fault wasn't in the weights). The contract test — once someone thought to run it — found the divergence in ninety seconds at zero GPU cost.",
          "Training faults cost a re-run to confirm, so they're third: the loss trace's signatures (the stability lesson's spike triage), checkpoint evals along the timeline showing WHERE transfer quality left the run. Objective mismatch is the expensive diagnosis — no log shows it, because every log is the objective's own POV: loss falls, evals pass, the product is wrong. It's diagnosed by elimination (data clean, template clean, training healthy) plus one positive signal: the eval suite and the product goal have diverged. The suite measures what the loss delivers, not what users needed. Varta hit it once: a DPO round that maximized teller-judged register while quietly teaching avoidance of complex queries (the easy-separation pathology from the preference lesson), invisible until the online 'escalation rate' alarm fired.",
          "The multi-fault boundary is where naive triage dies: compensating faults (a data skew masked by a schedule choice; two template divergences that cancel on the contract test's fixed message but not on real traffic) defeat the branch-by-branch walk. The discipline that survives it is timeline bisection — gate-score every checkpoint along the run and the deploy history, find the exact moment quality left, and diff everything that changed at that timestamp. 'When' localizes 'what' far better than 'what does it look like' — the same principle as the ML capstone's rule, pipeline bug before drift before retraining, now at fine-tuning resolution.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Post-deploy, Varta's quality is down 8 points. The team has retried training twice (no change), and the eval suite is green on the training-image model. Incident #1's lesson says what's the next check, in the tree's order?",
            choices: [
              { id: "a", label: "Objective mismatch — redesign the preference data, since retrains changed nothing" },
              { id: "b", label: "Template/serving: two retrains with zero delta says the fault isn't in the weights — run the byte-diff contract test on the SERVING image (tokenizer version included) before any further GPU spend. This exact incident was a tokenizer minor-version skew" },
              { id: "c", label: "Data — audit the pack for contamination a third time" },
              { id: "d", label: "Model regression — the base model provider changed something; file a ticket and wait" },
            ],
            answer: "b",
            explanation:
              "Order of cheapness plus the elimination signal: retrains with no delta exonerate the weights, pointing between training and serving — and the contract test is minutes and zero GPU. The incident's actual resolution, on record.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A team's fine-tune shows: loss healthy, every offline suite green, but the online escalation alarm fires on complex multi-part queries. Data, template, and training checks all pass clean. What does the elimination rule conclude, and what's the confirming evidence to gather?",
            choices: [
              { id: "a", label: "Objective mismatch by elimination — the loss optimized suite-measurable behavior while degrading an unmeasured product behavior (e.g., preference pairs whose easy-separation taught avoidance of hard queries). Gather the positive evidence: online samples of the failing class, and check whether the suite covers it at all — suite/product divergence is the mismatch's fingerprint" },
              { id: "b", label: "A compensating double fault — keep bisecting checkpoints; elimination is never conclusive" },
              { id: "c", label: "Online alarms are noise — offline suites are ground truth, ship on" },
              { id: "d", label: "Training bug after all — re-run at lower LR as the standard next step" },
            ],
            answer: "a",
            explanation:
              "Three clean classes plus green suites plus red product is the elimination rule's exact trigger — and the diagnosis confirms positively, by showing the failing class lives outside the suite's coverage. The fix is a suite extension and an objective/data repair, not another re-run of the same loss.",
          },
        ],
      },
      {
        slug: "free-gpu-capstone",
        title: "Capstone: a complete fine-tune, free",
        blurb: "QLoRA a small open Qwen on Colab/Kaggle T4s: data → template → train → eval → GGUF → local serve.",
        topic: "varta-capstone",
        skillIds: ["free-gpu-finetuning", "lora-fine-tuning", "finetune-evaluation", "adapter-serving"],
        capability: "Run an end-to-end QLoRA fine-tune of an open small model entirely on free-tier GPUs.",
        minutes: 15,
        concept: {
          anchor:
            "The track's whole method on one free afternoon: same pipeline, borrowed hardware, zero invoices.",
          what: "The capstone compresses the track into one executable run on a free T4: pick an **ungated small open instruct model** (Qwen-class 1.7–4B, Apache-2.0 — no license-gate friction for learners), build the pack (200–800 pairs, one behavior), render through the model's own template, **QLoRA rank 16 @ LR 2e-4**, checkpoint-and-gate on a held-out drawer, merge, export **4-bit GGUF**, and serve in Ollama. Every stage runs inside the session, with artifacts saved to Drive before the tab closes.",
          why: "It proves the track's central claim operationally: the professional pipeline (decision → data → method → dials → gate → ship) fits the free tier when the model is small and the method is QLoRA — no rental, no gatekeeping, no compromise on any step of the discipline.",
          where: [
            "**Colab free T4 (16 GB)**: the default run — 3B-class QLoRA with checkpointing fits comfortably",
            "**Kaggle T4×2 / P100 (30 h/week)**: the fallback with more weekly headroom; the second card serves shard-parallel inference for the demo step",
            "**The Drive rhythm**: checkpoints + adapter + GGUF saved continuously — free sessions vanish without notice",
          ],
          whenNot:
            "The free tier's walls are session walls — hours per session, erasure at close, queue at peak — not capability walls. But they bind scale: 7B is the practical ceiling (checkpointing + micro-batch 1), multi-day runs and CPT-scale corpora don't fit, and anything regulated needs the data-residency check before it touches a borrowed machine. Free GPUs are a lab, not a fleet.",
        },
        exercise: {
          id: "ex1",
          title: "The T4 budget planner",
          prompt:
            "plan_t4_run decides whether a QLoRA run fits a 16 GB T4: 4-bit base (0.5 B/param) + adapter at rank r over n_layers of (d×d) matrices (16 B per adapter param, ×2 matrices per layer) + activation budget (ctx-scaled). The base-bytes line prices the base at full precision — fix it to 4-bit so the planner stops rejecting every free run.",
          starterCode: `def plan_t4_run(params_b, d, n_layers, rank, ctx_kb, batch=1):
    """Return (fits, breakdown_dict) for a 16 GB T4."""
    T4 = 16_000_000_000
    base = params_b * 1_000_000_000 * 2          # <-- wrong: prices the frozen base at fp16
    adapter = (2 * d * rank) * n_layers * 16
    activations = ctx_kb * 1_000_000 * 120 * batch   # illustrative per-kb working set
    total = base + adapter + activations
    return (total <= T4, {"base": base, "adapter": adapter, "act": activations, "total": total})
`,
          testCode: `
fits, b = plan_t4_run(3.0, 3072, 32, 16, 8, batch=1)
ok = True
message = "ok"
if b["base"] != 3_000_000_000 * 500_000_000 // 500_000_000 * 0 + int(3.0e9 * 0.5):
    ok = False
    message = "base should be 4-bit: params * 0.5 bytes"
elif not fits:
    ok = False
    message = f"a 3B r16 QLoRA at 8k ctx must fit a T4; got total {b['total']:,}"
fits7, b7 = plan_t4_run(7.0, 4096, 32, 16, 8, batch=2)
if fits7 and b7["total"] > 16_000_000_000:
    ok = False
    message = "planner inconsistent: total exceeds T4 but reports fit"
`,
        },
        prose: [
          "The run, stage by stage, with the free-tier discipline built in. Stage 0, environment: a Colab T4 runtime (Runtime → Change type), the model pulled ungated from the Hub — Qwen-class small instruct, Apache-2.0, no license click-through. This choice is the first decision-architecture row, and 'ungated' is what keeps the afternoon frictionless. Stage 1, data: 200–800 pairs for ONE behavior (tone, or format, or refusal — the In-Practice rule: small packs teach single behaviors well), verbatim inputs, curated outputs, and the drawer of 20 held-out questions locked before any GPU minute. Everything lives in Drive from minute one; the session is disposable by design.",
          "Stage 2, training: render the pack through the model's own chat template (the anatomy lesson's rule — never hand-roll), then QLoRA — 4-bit frozen base, rank-16 adapters on the attention projections, LR 2e-4, warmup 30 steps, micro-batch 1 with accumulation to 16, gradient checkpointing on for the context headroom. A 3B at this config trains 200–800 pairs in well under an hour on a T4. Checkpoints every N steps, with the drawer scored on each — the two-curve chart picks the ship checkpoint exactly as the In-Practice course taught. If the session dies mid-run: reload from Drive, resume from the last checkpoint. That recovery path IS the free-tier workflow.",
          "Stage 3, ship: merge (B·A into W), export 4-bit GGUF, download the artifact, `ollama create` a Modelfile around it — and the drawer runs one final time on the LOCAL served model, closing the gate on the exact bytes users would hit. The budget-planner exercise below makes the stage-0 arithmetic a function you own: model size, rank, context, batch → fits-or-not on 16 GB, the same ledger the Varta team maintains as a fit matrix. When the run is done you hold the track's whole argument in one artifact: the pipeline is the professional one, the discipline never dropped, and the invoice is zero — the lab and the fleet run the same method, different only in scale.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Mid-run on Colab, the session disconnects at step 480 of ~900 — the classic free-tier event. The learner's checkpoints are in Drive (every 100 steps, adapter + optimizer state), the drawer was last scored at step 400. What does the free-tier workflow say happens next?",
            choices: [
              { id: "a", label: "The run is lost — restart from scratch with a smaller pack to finish inside one session" },
              { id: "b", label: "Resume: reconnect the runtime, remount Drive, reload from the step-400 checkpoint (the last drawer-scored one), and continue. The recovery path is a designed stage of the workflow, not an exception; the drawer scores resume at the next checkpoint boundary" },
              { id: "c", label: "Switch to Kaggle permanently — Colab disconnects make it unusable for training" },
              { id: "d", label: "Accept the step-400 state and ship it — later checkpoints rarely improve drawer scores" },
            ],
            answer: "b",
            explanation:
              "Checkpointing with optimizer state + Drive persistence exists precisely for this event; resuming from the last drawer-scored checkpoint keeps the two-curve chart continuous. The disconnect is a normal free-tier event — the workflow treats it as a stage.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A learner with the free-tier pipeline working wants to push to a 7B model at 16k context for long-document behavior, still on Colab free. Apply the capstone's boundary analysis: what does the ledger force, and which constraint, if relaxed, changes the answer?",
            choices: [
              { id: "a", label: "7B at 16k needs checkpointing + micro-batch 1 and lands at the T4's edge (~9 GB base at 4-bit + activations) — feasible but fragile. The binding constraint is session-hours for the slower run, and relaxing IT (Kaggle's 30 h/week) flips the answer from fragile to comfortable — while relaxing nothing below a fleet budget changes the 16 GB wall itself" },
              { id: "b", label: "Impossible at any configuration — 7B requires rented hardware by definition" },
              { id: "c", label: "Feasible trivially — 4-bit 7B is 3.5 GB; context length doesn't affect memory" },
              { id: "d", label: "The binding constraint is Colab's disk quota, not GPU memory" },
            ],
            answer: "a",
            explanation:
              "The ledger: weights fit (3.5 GB), activations at 16k dominate — checkpointing + batch 1 squeeze under 16 GB at real step-time cost, making session-hours the binding free-tier constraint. The boundary analysis names which wall you're actually hitting and what relaxing each one buys.",
          },
        ],
      },
    ],
};

export default course;
