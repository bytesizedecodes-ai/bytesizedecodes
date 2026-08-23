# AI Engineering track: research map and expansion plan

**Status:** proposed plan (Aug 23, 2026), research-backed with 2026 online
sources. Extends the trilogy precedent set by 07 (ML) and 08 (Fine-Tuning).
Course content itself is **not** changed by this doc — it is the roadmap and
gap analysis for the next builds.

## The question

The catalog now has three AI Engineering trilogies (Harness, RAG, Fine-Tuning
2/3 built) plus ML and Observability tracks. This doc answers, with current
online data:

1. How do existing courses map onto one **beginner → intermediate → expert AI
   Engineering journey**?
2. Which topics are missing, and for each: does it belong **inside the AI
   Engineering track**, or is it wide enough to be a **separate course line**?
3. What new courses follow, in what order?

## What the research says (2026 landscape)

### The working definition

By 2026 the discipline converged on Chip Huyen's definition, codified the same
way by roadmap.sh: an AI engineer **builds applications on readily available
foundation models rather than training models from scratch**. Pretraining and
classic model-building belong to the ML engineer/researcher track — a separate
roadmap, role, and (for us) a separate course domain.

### The 16-topic consensus curriculum

Synthesized across Chip Huyen's *AI Engineering* (O'Reilly's most-read 2025
book), mlabonne's LLM course ladder, ai-engineer-labs' 9-project spine,
DeepLearning.AI's catalog, DAIR.AI Academy, Maven cohorts, fast.ai, and
Stanford CS224N/CS25/CS329S:

| # | Topic | Consensus weight |
| --- | --- | --- |
| 1 | LLM fundamentals (tokens, embeddings, sampling, structured output) | Core, taught first |
| 2 | Prompt → **context engineering** | Core entry skill; "prompt engineering" has been reframed as context engineering (DAIR.AI retitled its course Jan 2026) |
| 3 | RAG | Core, universal |
| 4 | Agents & tool use | Core in 2026 (was specialist in 2024); AI Makerspace rebuilt its whole bootcamp around agentic AI |
| 5 | Evals | **The** non-negotiable core — Chip Huyen gives it two chapters *before* prompting; Hamel Husain's whole practice is eval-first |
| 6 | Model selection & routing (benchmarks, build-vs-buy, gateways) | Core; Chip Huyen Ch4+Ch10 |
| 7 | Fine-tuning / post-training | Core knowledge, specialist practice (mlabonne puts deep FT in a separate "Scientist" track) |
| 8 | Dataset engineering / distillation | Core but under-taught (Chip Huyen Ch8 is the only first-class treatment) |
| 9 | Inference optimization & serving (quantization, KV-cache, vLLM-class, edge) | Borderline-specialist; a full chapter in Chip Huyen, "advanced" tier in mlabonne |
| 10 | AI architecture & LLMOps (guardrails, caching, deployment) | Core for production roles |
| 11 | Observability (OTel GenAI, drift, feedback loops) | Core for production roles |
| 12 | AI security & safety (injection, red-teaming, guardrails) | Growing from elective to core; OWASP published the **GenAI LLM Top 10 2026** |
| 13 | Cost & latency engineering | Core consideration everywhere |
| 14 | Agentic protocols (MCP, A2A) | MCP rapidly becoming core (DeepLearning.AI + Anthropic short course); A2A still advanced |
| 15 | Multimodal / multilingual | Included, rarely deep — kept separate by platforms |
| 16 | Reasoning models / test-time compute | Advanced (training side); awareness-level early |

### What platforms bundle vs sell separately

- **Core bundle** (inside AI engineering tracks, 3–16 courses / ~30–100 hrs):
  LLM APIs + RAG + agents + prompt/context engineering + fine-tuning + evals.
  Evidence: IBM AI Engineering cert (13 courses), IBM GenAI Engineering cert
  (16), Microsoft AI&ML (5), DataCamp Associate AI Engineer tracks (9–13),
  DeepLearning.AI specializations (3–4).
- **Sold as separate lines**: classic ML/data science (DataCamp keeps a
  94-hour ML Scientist track fully separate), MLOps/LLMOps (Duke, edX ~$2,468
  certs), **AI security** (Snyk learning paths, Udemy OWASP courses —
  security-vendor led, not inside engineering tracks), GenAI for PMs/non-tech
  (an entire separate family), computer vision/multimodal (CU Boulder etc.),
  no-code prompt courses.
- **Agents are the boundary topic sold both ways** — and the job market is
  mirroring it: "AI Agent Engineer" is splitting off as a separately hired,
  premium role ($155–265K base, architect >$400K) per 2026 role guides.

### Job market 2026

LinkedIn *Jobs on the Rise 2026*: **AI Engineer is the fastest-growing US job
title for the second consecutive year** — 49–75K+ open positions, postings up
143–163% YoY, ~18% of all engineering postings by Q1 2026. Core must-haves:
Python, LLM API integration, RAG architecture, multi-agent/tool-calling,
system-level context engineering, **evaluation & monitoring**. The dominant
profile is "a backend/full-stack engineer who moved into AI."

### Our differentiation

No competitor bundles **evals + observability at every level, beginner
included** — Hamel's evals course is $4,200 and intermediate-only; observability
elsewhere is an advanced elective. Our AI Observability trilogy plus the eval
threads woven through Harness/RAG/Fine-Tuning is strongest-in-class. Keep it:
every new course below carries an eval lesson.

## Where the catalog stands today

14 courses (after the fine-tuning work on `006-skills-update`):

| Course | Level | Domain | Access | Status |
| --- | --- | --- | --- | --- |
| machine-learning-for-layman | beginner | Machine Learning | free | built |
| machine-learning | intermediate | Machine Learning | free | built |
| advanced-machine-learning | expert | Machine Learning | paid | built |
| ai-observability | beginner | AI Observability | free | built |
| llm-observability | intermediate | AI Observability | free | built |
| ai-observability-reliability | expert | AI Observability | free | built |
| harness-engineering-foundations | beginner | AI Engineering | free | built |
| harness-engineering-in-practice | intermediate | AI Engineering | paid | built |
| harness-engineering-at-scale | expert | AI Engineering | paid | built |
| rag-engineering-foundations | beginner | AI Engineering | free | built |
| rag-engineering-in-practice | intermediate | AI Engineering | paid | built |
| rag-engineering-at-scale | expert | AI Engineering | paid | built |
| fine-tuning-foundations | beginner | AI Engineering | free | built (branch) |
| fine-tuning-in-practice | intermediate | AI Engineering | free | built (branch) |
| fine-tuning-at-scale | expert | AI Engineering | paid | **planned (doc 08)** |

`Cybersecurity` and `Artificial Intelligence` domains are declared in
`COURSE_DOMAINS` but empty. `NEXT_COURSE` chains exist within trilogies
(harness F→P→S, rag F→P→S) and across ML/Observability, but have **no
fine-tuning entries and no cross-trilogy links** (wiring listed at the end).

## The map: one AI Engineering journey

**Core track (AI Engineering domain)** — four trilogies, one per pillar, plus
one cross-cutting deep-dive. Harness = *orchestrate*, RAG = *ground*,
Fine-Tuning = *adapt*, Inference = *serve*. Prompt & Context Engineering is the
deep-dive that cuts across all four.

| Tier | Harness | RAG | Fine-Tuning | Inference | Cross-cutting |
| --- | --- | --- | --- | --- | --- |
| Beginner (free) | harness-foundations | rag-foundations | fine-tuning-foundations | **inference-foundations** ✚ | — |
| Intermediate | harness-in-practice | rag-in-practice | fine-tuning-in-practice | **inference-in-practice** ✚ | **prompt-context-engineering** ✚ |
| Expert | harness-at-scale | rag-at-scale | fine-tuning-at-scale ✦ | **inference-at-scale** ✚ | — |

✚ = proposed in this doc · ✦ = already planned in doc 08

**Adjacent tracks that complete the journey:**

- **AI Observability trilogy** (all levels) — production DNA; our
  differentiator. Reliability (expert) doubles as the governance/telemetry
  counterpart to the security line below.
- **ML trilogy** — for learners who want *why models learn*; prerequisite
  depth for fine-tuning-at-scale, not required for the harness/RAG/inference
  spines.
- **AI Security trilogy** ✚ — new, in the `Cybersecurity` domain (industry
  sells security as its own line; our empty domain finally gets its spine).

**Recommended path (what the wiring should encode later):**

- *Beginner:* harness-foundations → rag-foundations → fine-tuning-foundations →
  inference-foundations (four free on-ramps; ai-observability optional in
  parallel).
- *Intermediate:* prompt-context-engineering → harness-in-practice →
  rag-in-practice → fine-tuning-in-practice → inference-in-practice
  (+ llm-observability, ai-security-in-practice).
- *Expert:* harness-at-scale → rag-at-scale → fine-tuning-at-scale →
  inference-at-scale (+ ai-observability-reliability, ai-security-at-scale).

## Gap verdicts

| Topic (canonical #) | Status today | Verdict |
| --- | --- | --- |
| Prompt/context engineering (2) | harness-foundations basics + one harness-in-practice lesson | **One new intermediate course** — the deep-dive nobody bundles well |
| Inference & serving (9) + model selection (6) + LLM fundamentals for builders (1) | scattered (cost/latency lesson; `adapter-serving` skill reserved in doc 08) | **New trilogy** `inference-engineering`; also absorbs the "LLM essentials for builders" on-ramp (model landscape, tokens→cost, open vs closed) so no separate LLM-basics course is needed |
| AI security (12) | lessons inside reliability (OWASP threat model, attack detection) + harness-at-scale (agent security) | **Separate trilogy** in `Cybersecurity` domain; reliability keeps *detect + govern via telemetry*, security owns *attack/defense engineering* |
| MCP / agentic protocols (14) | `mcp-observability` skill only | **Refresh lessons**: MCP in harness-in-practice, A2A/computer-use in harness-at-scale; grows into a course only if it outgrows lessons |
| Reasoning models / test-time compute (16) | absent | **Refresh lessons**: harness-at-scale (steering) + advanced-machine-learning (training side, links to GRPO in fine-tuning-at-scale) |
| Model routing/gateways (6) | absent | **Refresh lesson** in harness-in-practice + full treatment in inference-at-scale |
| Evals (5), observability (11), RAG (3), agents (4), fine-tuning (7), cost/latency (13), dataset engineering (8) | covered (evals strongest-in-class) | keep; deepen only via cross-links |
| Multimodal (15) | one advanced-ml lesson | **Not now** — separate line, later |
| AI literacy for non-devs | absent | **Separate line, later** — `Artificial Intelligence` domain; industry sells it as its own family |
| AI-assisted dev ("vibe coding") | absent | **Optional single course, parked** — productivity layer, not a subject spine |
| MLOps for classic ML (10, ML side) | reliability covers the AI-native version | **Not now** |

After these additions the catalog covers all 16 consensus topics — the core
track is structurally complete.

## New courses

### A. `prompt-context-engineering` — single course (intermediate)

Why one course, and why not "prompt engineering": pure prompt basics are
beginner material already taught in harness-foundations, and the 2026 reframe
is **context engineering** (DAIR.AI, Jan 2026; AI Makerspace teaches the whole
bootcamp as context management). The gap is the intermediate deep-dive: prompt
*patterns*, steering, and prompt *evals* in one place. High search demand,
smallest build, slots cleanly between harness-foundations and
harness-in-practice.

- Level: intermediate · Access: paid (matches AI Engineering intermediate
  tier; pricing is a launch decision) · ~12 lessons
- Framework: PIC + first-principles ladder; running case: **Sahaj Care**, a
  health-insurance support assistant whose prompts must survive policy edits.
- Overlap rule: harness-in-practice keeps its harness-scoped context lesson
  (packing an agent loop); this course owns patterns, steering, reasoning-model
  prompting, and prompt evals. Optional trim in the refresh pass.

Outline (titles settle at build):

1. `from-prompt-to-context` — why the discipline was renamed: the model reads
   the whole window, not just your instruction.
2. `instruction-patterns` — zero/few-shot, decomposition, self-ask; picking
   per task shape.
3. `chain-of-thought-and-its-limits` — when step-writing helps, when it's
   cargo cult.
4. `steering-structured-output` — schemas, constrained decoding, failure
   taxonomies of JSON mode.
5. `system-prompts-in-depth` — role, policy, refusal lines; prompts as
   contracts.
6. `few-shot-curation` — examples are a dataset: pick, order, prune.
7. `the-context-budget` — tokens as a budget: what earns a place in the
   window.
8. `compaction-and-memory-files` — summarizing, note-taking, the Manus-style
   operating loop, plainly.
9. `prompting-reasoning-models` — 2026-new: reasoning models want goals and
   constraints, not step scripts.
10. `prompt-regressions` — prompts are code: versioning, change reviews,
    regression suites (links to llm-observability).
11. `prompt-evals` — judging prompt changes with rubric + judge, cheaply.
12. `sahaj-capstone` — rewrite Sahaj Care's prompt suite under a policy
    change without regressions.

### B. `inference-engineering` trilogy (AI Engineering domain)

The fourth pillar: everything between "a model exists" and "it answers at an
acceptable cost and latency." Absorbs model selection, local/open models, and
the builder's model landscape, so no separate LLM-basics course is needed.

| Course | Level | Access | Promise |
| --- | --- | --- | --- |
| Inference Engineering Foundations | beginner | free | What running a model really costs; choosing between models; local vs cloud |
| Inference Engineering in Practice | intermediate | paid | Serve a model well: latency budgets, formats, batching, observability |
| Inference Engineering at Scale | expert | paid | Routing, gateways, edge, and the trade-off decisions at scale |

**Foundations** (~10 lessons, no code, full jargon gate):

1. `what-is-inference` — training vs answering; why answering is the bill you
   pay every day.
2. `the-token-meter` — tokens → cost → latency; the three-way trade.
3. `the-model-landscape` — open vs closed; small vs frontier; how to read a
   model card.
4. `choosing-a-model` — task shape, budget, and quality; benchmarks used
   honestly.
5. `local-vs-cloud` — when data control/latency/cost favors local.
6. `quantization-plainly` — fewer digits per slider; quality vs size.
7. `ollama-and-gguf` — running open weights on a laptop, plainly.
8. `first-token-and-streaming` — why the first token feels different.
9. `when-inference-fails` — overload, degradation, silent cost creep.
10. `inference-capstone` — pick and defend a model for a given product brief.

**In Practice** (~10 lessons, intermediate, running case: **Bazaar
Bot**, a D2C brand's shopping assistant surviving Diwali traffic):

1. `serving-stacks` — what a serving engine actually does (vLLM-class
   concepts, plainly).
2. `latency-budgets` — TTFT vs inter-token vs total; where time goes.
3. `batching` — throughput vs latency; why batching helps until it hurts.
4. `kv-cache-plainly` — paying once for reading; memory as the constraint.
5. `formats-and-export` — safetensors, GGUF, adapters; conversion decisions
   (cross-links fine-tuning's `shipping-an-adapter`).
6. `cost-engineering-at-the-serving-layer` — caching, model cascades,
   semantically-same-but-cheaper.
7. `serving-observability` — per-stage traces; cost per answer (links
   llm-observability).
8. `evaluating-inference-choices` — A/B a model swap; regression gates.
9. `capacity-planning` — from RPS to GPUs, on a spreadsheet.
10. `bazaar-capstone` — serve Bazaar Bot through a traffic spike on a fixed
    budget.

**At Scale** (~8 lessons, expert, paid):

1. `routers-and-gateways` — one door, many models; routing by cost/latency/
   capability.
2. `speculative-decoding` — a small model drafts, a big model checks.
3. `edge-and-on-device` — phones, laptops, satellites; what leaves the cloud.
4. `multi-model-fleets` — version pinning, canary rollouts, rollback for
   models.
5. `slo-for-inference` — latency SLOs, error budgets applied to tokens.
6. `serving-under-attack` — abusive traffic, scraping, cost bombs (cross-links
   security).
7. `the-inference-tradeoff-review` — structured decision reviews (matches the
   at-scale capstone style).
8. `inference-capstone` — architect the serving layer for a national-scale
   assistant.

### C. `ai-security` trilogy (Cybersecurity domain)

The industry sells AI security as its own line (Snyk paths, Udemy OWASP
courses, OWASP GenAI LLM Top 10 2026). Our `Cybersecurity` domain is declared
and empty — this trilogy fills it.

**Scope split (no duplication):**
`ai-observability-reliability` keeps *detecting attacks in telemetry +
governance* (EU AI Act, NIST AI RMF). This trilogy owns the security
engineering itself: attacker techniques, defensive engineering, red-teaming
practice, securing agents/MCP/tools, model supply chain, incident response.
`harness-at-scale`'s agent-security lesson stays harness-scoped and
cross-links.

| Course | Level | Access | Promise |
| --- | --- | --- | --- |
| AI Security Foundations | beginner | free | The attack surface of AI apps, in plain English |
| AI Security in Practice | intermediate | paid | Build the defenses: filtering, sandboxing, red-teaming |
| AI Security at Scale | expert | paid | Threat models, adversarial robustness, incident response |

**Foundations** (~10 lessons, no code, jargon gate):

1. `why-ai-gets-attacked` — new doors on an old house.
2. `the-owasp-llm-top-ten` — the standard list, in plain English.
3. `prompt-injection` — instructions hidden in data; the signature AI attack.
4. `jailbreaks` — talking the model out of its rules.
5. `data-leakage` — secrets in prompts, training data, and logs.
6. `guardrails-basics` — the bouncer at the door; what guardrails can't do.
7. `supply-chain-risk` — models and datasets are dependencies too.
8. `over-permissioned-agents` — the agent with your passwords.
9. `when-security-kills-the-product` — friction budgets; fail-closed vs
   fail-open.
10. `security-capstone` — find the three vulnerabilities in a story app.

**In Practice** (~10 lessons, running case: **PaisaShield**, a fintech chat
assistant):

1. `threat-model-an-app` — STRIDE-for-AI, on one page.
2. `input-output-filtering` — detection layers at every boundary.
3. `sandboxes-and-least-privilege` — tools, filesystems, and API scopes.
4. `pii-redaction` — scrubbing before the model ever sees.
5. `securing-rag` — poisoned documents, permission-aware retrieval (cross-links
   rag-at-scale).
6. `securing-agents-and-mcp` — tool allow-lists, approval gates, trust
   boundaries.
7. `red-team-drills` — running garak-style probes; keeping a findings log.
8. `defensive-evals` — security regressions in CI (links harness evals).
9. `incident-drills` — what to do at minute one.
10. `paisashield-capstone` — defend PaisaShield against the red-team pack.

**At Scale** (~8 lessons, expert, paid):

1. `adversarial-robustness` — attacks on the model itself (evasion, poisoning)
   at production scale.
2. `multi-agent-trust` — trust between your own agents; permission
   architectures.
3. `ai-incident-response` — command structures for AI security incidents
   (cross-links reliability's incident command).
4. `secure-by-design-reviews` — the design review as a security artifact.
5. `compliance-and-governance` — EU AI Act / NIST as engineering constraints
   (hand-off from reliability).
6. `continuous-red-teaming` — programs, not one-offs; bug bounties for AI.
7. `the-security-tradeoff-review` — risk registers and accept/reject calls.
8. `security-capstone` — secure architecture review of a national-scale agent.

### D. `fine-tuning-at-scale` — already planned

Doc 08 Part 3 (expert, paid, 12 lessons, Varta banking case, free-GPU Qwen
capstone) remains the first build in the sequence below. Its
`adapter-serving` scope cross-links with inference-in-practice rather than
duplicating: fine-tuning-at-scale ships *your adapter*, inference serves
*models in production*.

## Refresh pass (lessons into existing courses)

Small, high-value lesson additions during the next touches of existing
courses — no new courses:

- `harness-engineering-in-practice`: + MCP (build and secure a tool server),
  + model selection & routing/gateways.
- `harness-engineering-at-scale`: + A2A/agent interoperability, +
  computer-use agents, + reasoning models/test-time steering.
- `advanced-machine-learning`: + test-time compute (training side; links GRPO
  in fine-tuning-at-scale).
- Optional trim: harness-in-practice's context lesson slims toward its
  harness-scoped core once prompt-context-engineering ships.

## Not to build (with reasons)

- **Pretraining from scratch** — ML engineer/researcher territory (roadmap.sh
  role split; mlabonne keeps it in a separate track).
- **MLOps for classic ML** — reliability already covers the AI-native version;
  industry sells MLOps separately and it's off-mission.
- **Multimodal/CV deep-dive** — separate family per platforms (CU Boulder
  etc.); one advanced-ml lesson suffices until learners ask.
- **AI literacy / GenAI for non-devs** — separate product line (DataCamp AI
  Fundamentals, AI-for-Everyone pattern); park for the empty `Artificial
  Intelligence` domain as a later phase.
- **Vibe-coding / AI-assisted dev** — a productivity layer curricula treat as
  an entry point, not a subject; revisit as one beginner course if ever.

## Sequencing

1. **`fine-tuning-at-scale`** — finishes approved track 08 (already scoped,
   skills pre-registered).
2. **`prompt-context-engineering`** + the **harness refresh lessons** —
   smallest builds, highest search demand, fill visible gaps.
3. **`inference-engineering` trilogy** — the fourth pillar; foundations first.
4. **`ai-security` trilogy** — Cybersecurity domain spine; foundations first.
5. **Parked**: AI literacy line (Artificial Intelligence domain), multimodal,
   vibe-coding.

Positioning: free foundations / paid upper tiers matches the Coursera +
DataCamp pattern; the resulting core track (13 courses + 1 deep-dive) plus
adjacent ML/Observability tracks sits inside the industry 3–16 course range
with a defensible niche (evals + observability at every level).

## Follow-up wiring (separate small task; not part of this doc)

When the new courses land, `content/courses.ts`, `content/catalog.ts`, and
`convex/lib/dailyPlan.ts` need:

- `NEXT_COURSE`: fine-tuning-foundations → fine-tuning-in-practice →
  fine-tuning-at-scale; harness-foundations → prompt-context-engineering →
  harness-engineering-in-practice; inference F→P→S; ai-security F→P→S; expert
  caps cross-linking to the observability spine (as the ML track already
  does).
- `trackPriority` entries for the persona tracks (beginner/grad/engineer/
  founder) and daily-plan units for each new course.
- No domain type changes — `Cybersecurity` is already in `COURSE_DOMAINS`.
- New skill IDs per course group in `content/skills.ts` (the fine-tuning
  precedent: pre-register at build time, keep descriptions <1024 chars).

## Sources

- Chip Huyen, *AI Engineering* (O'Reilly, 2025) TOC —
  github.com/chiphuyen/aie-book · huyenchip.com/books
- Hamel Husain — hamel.dev (evals-first practice; Maven "AI Evals for
  Engineers & PMs", $4,200 cohort)
- mlabonne/llm-course — Fundamentals/Scientist/Engineer ladder
- ericckzhou/ai-engineer-labs — 9-project spine + production electives
- DAIR.AI Academy — Context Engineering for AI Agents (retitled Jan 2026)
- DeepLearning.AI catalog — deeplearning.ai/courses (MCP with Anthropic,
  Computer Use, Evaluating AI Agents, Agentic AI)
- roadmap.sh/ai-engineer — role definition and AI-Eng vs ML-Eng split
- AI Makerspace AI Engineering Bootcamp v0.9 (agentic-first) — maven.com
- fast.ai Practical Deep Learning + "A Hackers' Guide to LLMs"
- Stanford CS224N / CS25 / CS329S
- Coursera/IBM: AI Engineering (13-course) and GenAI Engineering (16-course)
  professional certificates; Microsoft AI&ML Engineering cert
- DataCamp: Associate AI Engineer tracks (9–13 courses); ML Scientist (94h,
  separate)
- edX LLMOps Professional Certificate (~$2,468)
- LinkedIn *Jobs on the Rise 2026* — AI Engineer #1, +143–163% YoY
- Kore1 2026 hiring guides — AI Agent Engineer $155–265K, architect $260–420K
- OWASP GenAI LLM Top 10 2026 — genai.owasp.org
- Snyk Learn OWASP LLM path; Udemy OWASP LLM security courses
