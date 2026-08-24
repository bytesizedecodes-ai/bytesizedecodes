import type { Course } from "../types";

const course: Course = {
    slug: "ai-observability-reliability",
    title: "AI Observability: Reliability Engineering",
    subtitle: "Design a scalable, secure, governed observability system for AI in production.",
    description:
      "An expert course built around one production case: Meridian. Meridian is a multi-agent financial-research system. It runs across EU and US regions and two model providers, carries regulated data, and is heading into an architecture review. Every lesson adds evidence, a counter-example, or a sharpened constraint to Meridian's design — telemetry contracts, evaluation systems, privacy, security, and governance. The goal: detect regressions without exposing sensitive prompts. For senior ML, platform, and SRE engineers.",
    level: "expert",
    domain: "AI Observability",
    access: "free",
    prerequisites:
      "LLM Observability — you should be comfortable reading traces, defining SLOs, and running evaluations before you design systems around them.",
    lessons: [
      {
        slug: "telemetry-architecture-contracts",
        title: "Telemetry architecture and contracts",
        blurb: "A pipeline is a chain of contracts each stage must honour.",
        topic: "telemetry-platform",
        skillIds: ["telemetry-pipeline"],
        capability: "Design a telemetry pipeline as a chain of contracts: propagation, fidelity, redaction, retention, semantics.",
        minutes: 11,
        concept: {
          anchor: "A telemetry pipeline is a relay race — each runner owns the baton handoff the next depends on.",
          what:
            "A telemetry system is a **chain of contracts** — app, SDK, collector, backend, query — where each stage owns one guarantee the next stage depends on.",
          why: "Break a contract and the failure **migrates downstream**: dropped context fragments traces, unredacted spans become a **breach surface**, unbounded cardinality collapses query latency.",
          where: [
            "A multi-region rollout where the collector is the **PII scrubbing and routing boundary** before spans hit storage",
            "A **versioned span schema** so dashboards and alerts degrade gracefully across attribute changes",
            "Cloud-native pipelines where the collector tail-samples and enforces the **cardinality budget**",
          ],
          whenNot:
            "Over-engineered for a single-service prototype with **one owner and no regulated data** — contracts pay off once multiple teams and regions depend on the same telemetry.",
        },
        prose: [
          "Six weeks into Meridian's EU rollout, an audit found EU customer prompts sitting in a US-region telemetry backend. (Meridian is the multi-agent financial-research platform this course designs for.) The “fix” meant purging data out of every index it had touched. The failure reads directly off the architecture. Telemetry is not a bucket. It is a **chain of contracts**: the app emits correct spans, the SDK **propagates context**, the collector redacts, samples, and routes, the backend indexes within a **cardinality budget**, and the query layer aggregates correctly. The residency guarantee belonged to the collector — and nobody had written it down.",
          "Break a contract and the failure **migrates**. If the SDK drops the correlation ID, traces fragment across services. If the collector doesn't redact, the backend becomes a **breach surface**. If the backend allows unbounded cardinality, query latency collapses under **index bloat**. The contract is the design unit — and the debugging unit when something breaks.",
          "Owning this chain means deciding what each stage guarantees and who owns it. **Version the schema**. Document the attributes each stage must set. Treat the collector as the **security and cost boundary** — the last place you can cheaply transform telemetry before it becomes a liability in storage. The boundary: contracts cost coordination. A single-service prototype with one owner and no regulated data pays in meetings what it saves in incidents. This design pays off when multiple teams and regions depend on the same telemetry, as Meridian's does.",
        ],
        diagram: {
          kind: "flow",
          steps: [
            { kind: "input", text: "App emits spans" },
            { kind: "process", text: "SDK propagates context", caption: "correlation IDs + conventions" },
            { kind: "process", text: "Collector transforms", caption: "redact, tail-sample, route" },
            { kind: "process", text: "Backend indexes", caption: "within cardinality budget" },
            { kind: "output", text: "Queries aggregate" },
          ],
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Your fintech platform just discovered EU customer prompts landing in a US-region telemetry backend. Fixing it after the fact meant purging data out of every index. Where should the residency guarantee have lived?",
            choices: [
              { id: "a", label: "In the front-end, before spans ever leave the browser" },
              { id: "b", label: "In the collector's routing layer — the last cheap transformation point before storage turns telemetry into a liability" },
              { id: "c", label: "In the backend, via a nightly job that deletes non-compliant spans after indexing" },
              { id: "d", label: "In a quarterly policy document each team signs" },
            ],
            answer: "b",
            explanation:
              "Post-hoc deletion is the expensive way to learn the contract. The collector is the security and cost boundary. It is the last stage that can route by residency before storage makes the data a regulated liability.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A travel-booking assistant's traces suddenly fragment after last week's SDK upgrade. One user turn now shows up as unrelated spans scattered across the retrieval, planner, and booking services. Which contract broke?",
            choices: [
              { id: "a", label: "The SDK dropped context propagation, so correlation IDs no longer carry across service boundaries" },
              { id: "b", label: "The backend indexed too many attributes and silently dropped the rest" },
              { id: "c", label: "The collector tail-sampled away the middle of each trace" },
              { id: "d", label: "The query layer rounded timestamps to the minute" },
            ],
            answer: "a",
            explanation:
              "Trace fragmentation across services is the signature of failed propagation — the SDK's core contract. Each stage owns one guarantee. Diagnosing starts by asking which stage's guarantee broke.",
          },
        ],
      },
      {
        slug: "genai-semantic-conventions",
        title: "GenAI semantic conventions in practice",
        blurb: "OTel GenAI and OpenInference: layer them, don't fork.",
        topic: "telemetry-platform",
        skillIds: ["otel-genai", "telemetry-strategy"],
        capability: "Choose between and layer OTel GenAI and OpenInference without forking a private schema.",
        minutes: 11,
        concept: {
          anchor: "Standards are wall sockets — use the standard plug and add your own adapter at the end, never rewire the house.",
          what:
            "**OTel GenAI** (gen_ai.*) is the converging vendor-neutral standard; **OpenInference** is richer and more widely deployed — layer them, and **extend, don't fork**.",
          why: "Hard-locking one convention buys vendor lock-in or lost richness. Forking a **private schema** leaves you stranded with tooling nothing else can read and maintenance nobody else shares.",
          where: [
            "Dual-emitting during a multi-provider migration: OTel GenAI for **portability**, OpenInference for **retrieval and agent attributes**",
            "Adding a proprietary reranker score under your own **prefix** while standard attributes stay intact",
            "Dropping the extension layer once the standard converges and covers the attribute",
          ],
          whenNot:
            "Skip dual-emitting when you're consciously **single-tool and single-vendor** and the standard already covers your attributes — the second convention is cost with no consumer.",
        },
        prose: [
          "Meridian runs its eval tooling on OpenInference's retrieval attributes. Its platform team standardizes on the CNCF track. The same span serves two consumers. Two conventions describe the same LLM call. **OpenTelemetry GenAI semantic conventions** (gen_ai.*) are the converging, vendor-neutral standard, moving toward stability under the Cloud Native Computing Foundation. **OpenInference**, from the Arize/Phoenix community, is richer and more widely deployed today, with first-class retrieval and agent attributes.",
          "They overlap heavily and differ in naming. The temptation is to pick one and hard-lock. Worse, invent a **private schema** for 'full control'. Both are mistakes. One buys vendor lock-in today. The other leaves you with a schema no tooling can read. The sound move is to treat them as **complementary layers**. Emit OTel GenAI for portability and OpenInference for tool richness. Extend the standard rather than fork it.",
          "'**Extend, don't fork**' is the discipline. Say the standard lacks an attribute you need — a proprietary retrieval score, for example. Add it under your own **prefix** and keep the standard attributes intact. Your schema then degrades gracefully in any tool. You can drop the extension when the standard catches up. The boundary: dual-emitting is ceremony for a consciously single-tool, single-vendor deployment. Where the standard already covers your attributes and one consumer reads them, the second convention is cost with no consumer.",
        ],
        diagram: {
          kind: "compare",
          left: { title: "OTel GenAI", subtitle: "vendor-neutral, converging standard" },
          right: { title: "OpenInference", subtitle: "richer, more deployed today" },
          rows: [
            { label: "Best for", left: "Portability across tools", right: "Retrieval + agent coverage" },
            { label: "Maturity bet", left: "Tracks the CNCF convergence", right: "Battle-tested in practice" },
            { label: "Avoid", left: "Treating as final (still in flux)", right: "Hard-locking to one vendor's tools" },
          ],
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A platform team at an insurance company proposes replacing all gen_ai.* attributes with an in-house schema 'so every dashboard is perfectly tailored'. The CTO asks what this costs down the road. What's the honest answer?",
            choices: [
              { id: "a", label: "Nothing — private schemas render faster than standard ones" },
              { id: "b", label: "No standard tooling can read the spans, and the team inherits sole maintenance of a schema nobody else follows" },
              { id: "c", label: "A small licence fee payable to the CNCF" },
              { id: "d", label: "It forbids using OpenTelemetry anywhere else in the company" },
            ],
            answer: "b",
            explanation:
              "Forking leaves you stranded: the fork is the mistake, not the tailoring. Standard attributes keep every OTel/OpenInference tool readable, while a private prefix carries the tailoring. That's extend, don't fork.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Your retail search team needs to record a proprietary 'reranker boost score' on retrieval spans. The current OTel GenAI spec has no such attribute. A teammate proposes overwriting an existing gen_ai.* field to smuggle the score in. What's the right move?",
            choices: [
              { id: "a", label: "Wait for the CNCF to define the attribute and ship without the score" },
              { id: "b", label: "Add the score under your own prefix (e.g. acme.rerank.score) and keep the standard attributes intact" },
              { id: "c", label: "Overwrite the standard field — downstream consumers will adapt" },
              { id: "d", label: "Stop instrumenting retrieval spans until the spec updates" },
            ],
            answer: "b",
            explanation:
              "Overloading an existing attribute silently breaks every consumer of it. A private-prefix extension keeps the schema readable by standard tooling and drops out cleanly when the spec catches up.",
          },
        ],
      },
      {
        slug: "sampling-cardinality-cost",
        title: "Sampling, cardinality, and telemetry cost",
        blurb: "Sample for fidelity (tail); cap cardinality before it caps you.",
        topic: "telemetry-platform",
        skillIds: ["telemetry-pipeline"],
        capability: "Choose sampling for fidelity and cap cardinality to keep telemetry affordable.",
        minutes: 10,
        concept: {
          anchor: "Tail sampling is customs at the airport — open the full suitcase at one checkpoint, keep only what's interesting.",
          what:
            "**Tail sampling** keeps the traces that matter (errors, slow turns, policy violations) by deciding at the collector. **Cardinality caps** stop near-unique attribute values from bloating indexes.",
          why: "Cost then scales with the **value you retain**, not the traffic you see. Head sampling is cheap but blind, and per-request dimensions scale index size linearly with traffic.",
          where: [
            "Tail-sampling policy at a multi-region rollout's collector: keep every erroring or policy-violating trace, drop the boring ones",
            "A **dimension budget** on dashboards: low-cardinality slices (model, region, tool), raw values sampled or hashed",
            "**Exemplar debugging** in production — a handful of full interesting traces instead of 100% noise",
          ],
          whenNot:
            "Skip tail-sampling infrastructure where traffic is low enough that **100% retention is affordable** (dev, staging, small internal tools) — the collector logic costs more than it saves.",
        },
        prose: [
          "Sampling looks like a cost decision. It is really a **debugging-fidelity decision**. **Head sampling** drops traces at the source. It is cheap, but blind: it discards the rare erroring trace you'd most want to see. **Tail sampling** evaluates the full trace at the collector. It keeps the ones that matter — errors, slow turns, policy violations. You get exemplar debugging at a fraction of the storage.",
          "**Cardinality** is the silent budget killer. Every unique attribute value creates an index entry: `index entries ≈ traffic × Σ unique values per dimension`. A per-request timestamp or full session id is near-unique. Indexing it scales linearly with traffic while analytical value stays flat. The result is **index bloat**, collapsing query latency, and a bill that surprises no one who has lived through it. Cap your dimensionality budget deliberately: low-cardinality dimensions for slicing, raw values sampled or hashed.",
          "The two combine into a strategy. Tail-sample to keep the interesting traces. Constrain dimensions so the ones you keep stay queryable. The arithmetic on Meridian's mix: errors are ~2% of turns and all of them kept, plus ~1% of the boring ones. That lands near 3% of full retention while losing none of the failures you'd investigate. Cost then scales with the **value you retain**, not the traffic you see. That is the only sane scaling law for telemetry. The boundary: below the traffic level where 100% retention is affordable (dev, staging, small internal tools), the collector logic costs more than it saves.",
        ],
        diagram: {
          kind: "compare",
          left: { title: "Head sampling", subtitle: "decides at the source" },
          right: { title: "Tail sampling", subtitle: "decides at the collector" },
          rows: [
            { label: "Keeps errors?", left: "No — drops blindly", right: "Yes — sees the full trace" },
            { label: "Cost shape", left: "Cheapest per span", right: "Scales with value kept" },
            { label: "Use when", left: "Traces are interchangeable", right: "Rare failures matter" },
          ],
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "After a 10x Black Friday spike, your e-commerce assistant's telemetry bill tripled. Worse, the one trace that would explain a checkout-tool failure was dropped. The pipeline samples 5% at the SDK. What's the structural fix?",
            choices: [
              { id: "a", label: "Raise head sampling to 100% and accept the bill as the price of spikes" },
              { id: "b", label: "Move the decision to the collector: tail-sample so errors and slow turns are always kept while boring traces drop" },
              { id: "c", label: "Disable tracing on the checkout tool so its spans stop costing money" },
              { id: "d", label: "Shard the telemetry bill across regional teams" },
            ],
            answer: "b",
            explanation:
              "Head sampling is blind — it dropped the exact trace you needed at the same rate as everything else. Tail sampling sees the full trace before deciding, so fidelity scales with value, not traffic.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A junior engineer at a health-tech startup added span attributes for session uuid and a nanosecond request timestamp, 'so every request is individually searchable'. Weeks later, dashboard queries degraded. Storage grew 40% with no traffic change. What happened?",
            choices: [
              { id: "a", label: "The backend index is corrupt — rebuild it from scratch" },
              { id: "b", label: "Near-unique values exploded cardinality; hash or sample the raw values and keep low-cardinality dimensions for slicing" },
              { id: "c", label: "Nanosecond timestamps are forbidden by OTel — remove them and queries recover automatically" },
              { id: "d", label: "Query latency always degrades over time; add more widgets to spread the load" },
            ],
            answer: "b",
            explanation:
              "The attributes aren't illegal, they're unbounded. Every unique value creates an index entry, so index size scaled with traffic, not with analytical value. The fix is a dimensionality budget, not a rebuild.",
          },
        ],
      },
      {
        slug: "ai-threat-model-owasp",
        title: "AI threat model: the OWASP LLM Top 10",
        blurb: "Every risk maps to a telemetry signal you can detect.",
        topic: "security-privacy",
        skillIds: ["ai-security"],
        capability: "Map the OWASP LLM Top 10 to telemetry detection signals.",
        minutes: 11,
        concept: {
          anchor: "Every OWASP LLM risk is a sensor spec — each attack pattern maps to a telemetry signal you can query.",
          what:
            "The **OWASP LLM Top 10** — injection, sensitive disclosure, supply chain, poisoning, improper output handling, excessive agency, prompt leakage, vector weaknesses, misinformation, unbounded consumption — where each risk maps to a **detectable telemetry signal**.",
          why: "It turns security from a parallel discipline into **reads on the spans, rates, and args you already collect** — no second telemetry stack to build and govern.",
          where: [
            "Prompt injection surfacing as **intent-versus-action divergence** or unexpected tool calls",
            "Excessive agency caught as a **tool call outside policy** on the tool span",
            "Unbounded consumption flagged by **token-rate and agent loop-depth limits**",
          ],
          whenNot:
            "Detection assumes the signal was instrumented. If tool args or token counts never made it onto the spans, **no query can detect the risk** after the fact.",
        },
        prose: [
          "Meridian's security review hands the observability team the **OWASP Top 10 for LLM Applications** and one constraint: detect them without a second telemetry stack. The canonical list is a set of documented attack patterns — prompt injection, sensitive information disclosure, supply chain, data and model poisoning, improper output handling, excessive agency, system prompt leakage, vector and embedding weaknesses, misinformation, unbounded consumption. The design question: what does each one look like as a **signal on telemetry you already collect**?",
          "The reframe for observability is that each risk maps to a **signal you can detect** on telemetry you already collect. Prompt injection shows up as **intent-versus-action divergence**. Sensitive disclosure shows up in output scanners. Excessive agency shows up as a tool call outside policy. Unbounded consumption shows up as runaway token loops. Detection is a query on existing spans, rates, and args — not a new instrument.",
          "This turns security from a separate discipline into a **read on the same pipeline**. You are not building a parallel security telemetry stack. You are adding the reads, thresholds, and alerts that surface the OWASP risks on the spans, tool calls, and outputs you already record. The boundary, and it is hard: detection assumes the signal was instrumented. If tool args or token counts never made it onto the spans, **no query can detect the risk after the fact**. The sensor spec ships with the span, or not at all.",
        ],
        diagram: {
          kind: "decision",
          root: {
            kind: "decision",
            question: "Which OWASP risk is this signal?",
            branches: [
              { label: "intent and tool calls diverge", node: { kind: "leaf", answer: "Prompt injection", caption: "intent-vs-action divergence" } },
              { label: "secrets or PII in completions", node: { kind: "leaf", answer: "Sensitive disclosure", caption: "output-side scanners" } },
              { label: "tool args outside policy", node: { kind: "leaf", answer: "Excessive agency", caption: "out-of-policy tool span" } },
              { label: "token rate / loop depth runaway", node: { kind: "leaf", answer: "Unbounded consumption", caption: "budget + loop alerts" } },
            ],
          },
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Security review at a bank flags 'excessive agency' as a risk for the new research agent. They ask the observability team how they'd even know it happened in production. What's the correct mapping?",
            choices: [
              { id: "a", label: "Stand up a dedicated security SIEM and mirror every span into it" },
              { id: "b", label: "Alert on tool spans whose arguments fall outside the task's allowed policy — a query on telemetry already recorded" },
              { id: "c", label: "Wait for a customer to report an unauthorized action on their account" },
              { id: "d", label: "Ask the model vendor to guarantee the agent never overreaches" },
            ],
            answer: "b",
            explanation:
              "Excessive agency means the model took an action it wasn't granted — visible as an out-of-policy tool span. The OWASP reframe is reads on existing telemetry, not a parallel security stack.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "After a prompt-template change, a telco support agent burned through its weekly token budget in hours. The loop shows it calling the same knowledge-base tool repeatedly with growing context. Which OWASP category and detection signal match?",
            choices: [
              { id: "a", label: "Sensitive information disclosure — caught by output PII scanners" },
              { id: "b", label: "Data and model poisoning — caught by retraining-data audits" },
              { id: "c", label: "Unbounded consumption — caught by token-rate and agent loop-depth limits" },
              { id: "d", label: "Misinformation — caught by factuality evals" },
            ],
            answer: "c",
            explanation:
              "A runaway loop consuming tokens and time is exactly unbounded consumption. The detectable fingerprint is on the agent span: loop depth climbing and token rate crossing the limits.",
          },
        ],
      },
      {
        slug: "detecting-attacks-in-telemetry",
        title: "Detecting attacks in telemetry",
        blurb: "Injection, extraction, exfiltration, unsafe tools — read from ordinary spans.",
        topic: "security-privacy",
        skillIds: ["ai-security", "ai-red-teaming"],
        capability: "Detect injection, extraction, exfiltration, and unsafe tool use from ordinary telemetry.",
        minutes: 11,
        concept: {
          anchor: "Attacks leave fingerprints on ordinary spans — detection is a query, not a new instrument.",
          what:
            "Attacks leave **fingerprints on ordinary telemetry**: injection as intent-action divergence, exfiltration in output scanners, extraction and membership inference as **per-identity rate and similarity anomalies**, unsafe tool use as out-of-policy args.",
          why: "Each attack class is a **new read on existing spans**, not a new data source. And validating tool args against an allowlist turns one whole class into a **hard reject** with an audit record.",
          where: [
            "Output-side DLP and secret scanners on the **completion span** catching exfiltrated secrets or PII",
            "Per-identity query-rate and **embedding-similarity alerts** catching model-extraction probe storms",
            "Tool-arg validation against a policy **allowlist** on the span, with rejects recorded for the audit trail",
          ],
          whenNot:
            "Per-request rules can't catch **statistical attacks** — membership inference and extraction are cluster patterns across many probes. Single-call detection alone will never fire.",
        },
        prose: [
          "Attacks leave fingerprints on ordinary telemetry. **Prompt injection** rewrites the model's plan, so it shows up as intent-versus-action divergence or unexpected tool calls. **Data exfiltration** shows up in output scanners flagging secrets or PII the model returned. Neither needs a new data source — they need new reads on the spans you already record.",
          "**Model extraction** and **membership inference** are rate-and-pattern problems rather than single-call problems. Extraction looks like a high volume of near-identical queries probing the model's decision surface from one identity. Membership inference looks like a cluster of correlated, calibrated probes trying to determine whether a specific record was in training. Both are detectable as **per-identity query-rate and embedding-similarity anomalies**.",
          "**Unsafe tool use** is the most directly preventable. A tool called with arguments outside policy — a delete instead of a read, a cross-tenant lookup — is visible on the tool span. Validate tool args against an **allowlist** at the span. That turns a class of agent-security failures into a hard reject, with the attempt itself recorded for the **audit trail**. The boundary: per-request rules can't catch **statistical attacks**. Membership inference and extraction are cluster patterns across many probes. Single-call detection will never fire, no matter how tight the rules.",
        ],
        diagram: {
          kind: "decision",
          root: {
            kind: "decision",
            question: "What does the telemetry pattern suggest?",
            branches: [
              { label: "Intent vs action diverge", node: { kind: "leaf", answer: "Prompt injection", caption: "unexpected tool calls confirm" } },
              { label: "Secrets in output", node: { kind: "leaf", answer: "Exfiltration", caption: "output-side DLP scanners" } },
              { label: "Near-identical probe storm", node: { kind: "leaf", answer: "Model extraction", caption: "per-identity rate anomaly" } },
              { label: "Tool args outside policy", node: { kind: "leaf", answer: "Unsafe tool use", caption: "allowlist hard-rejects" } },
            ],
          },
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "An intern proposes a per-request firewall rule to block membership-inference attacks against your fine-tuned medical model, reasoning that 'each attack is one HTTP call'. Their mentor corrects them. On what grounds?",
            choices: [
              { id: "a", label: "Membership inference is a statistical pattern across many correlated probes — the fingerprint is the cluster, not any single call" },
              { id: "b", label: "Membership inference only happens inside the training cluster, never at the API edge" },
              { id: "c", label: "HTTP calls can't be inspected for legal reasons in healthcare" },
              { id: "d", label: "The rule would work; the mentor is shielding the intern from extra work" },
            ],
            answer: "a",
            explanation:
              "Inferring whether a record was in training takes many calibrated probes — a rate-and-pattern problem. Per-identity rate and embedding-similarity alerts catch the cluster; a single-call rule never will.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "An audit of your agent platform finds something from last month. A research agent, injected via a poisoned web page, called the file-delete tool with a path outside its task scope. It succeeded silently. Which control would have made this a non-event?",
            choices: [
              { id: "a", label: "A faster model with better instruction-following" },
              { id: "b", label: "Validating tool args against a policy allowlist on the tool span — a hard reject plus an audit record of the attempt" },
              { id: "c", label: "Storing full raw prompts so investigators could read the injection afterward" },
              { id: "d", label: "Rate-limiting every user to five questions per day" },
            ],
            answer: "b",
            explanation:
              "Unsafe tool use is the most preventable class. Tool args are structured and policy-checkable, so an allowlist at the span converts a silent breach into a rejected call with evidence. Forensics after the fact isn't prevention.",
          },
        ],
      },
      {
        slug: "guardrails-and-safety-signals",
        title: "Guardrails and safety signals",
        blurb: "Guardrails raise the bar; measure their attack-success rate.",
        topic: "security-privacy",
        skillIds: ["ai-guardrails"],
        capability: "Apply guardrails and measure their attack-success rate honestly.",
        minutes: 10,
        concept: {
          anchor: "A guardrail is a mosquito net — it stops most bugs, and you still count the ones that get through.",
          what:
            "**Guardrails** are input and output checks in the runtime path (NeMo Guardrails, Lakera Guard, Guardrails AI) that block known jailbreaks and policy violations — and they are **evadable, not walls**.",
          why: "Published research shows high **attack-success rates (ASR)** against adaptive adversaries. So the mature posture is measuring and driving ASR down like a quality SLO, rather than trusting a block rate.",
          where: [
            "Input checks before the model and **output checks** before the user, both in the request path",
            "Continuous **red-team evals** feeding an ASR metric with alerting on regressions",
            "Each new evasion treated as a **regression to fix** — exactly like a quality SLO breach",
          ],
          whenNot:
            "A guardrail is the wrong control for a **deterministic guarantee**. Content that must never leak needs architectural controls (never storing it), because a 94% block rate still lets the adaptive 6% through.",
        },
        prose: [
          "Guardrails are input and output checks in the **runtime path** — frameworks like NeMo Guardrails, Lakera Guard, and Guardrails AI. They catch known jailbreak patterns, harmful outputs, and policy violations. They act before the request reaches the model or the response reaches the user. They are much better than having no check at all.",
          "The dangerous assumption is that a guardrail is a wall. Published research shows they're **evadable**: against adaptive adversaries, attack-success rates can be high. A guardrail that blocks 94% of known patterns still lets 6% through. And **novel attacks aren't in the known set**. Treat the guardrail as a guarantee and you will get breached.",
          "The mature posture is to measure the **attack-success rate** — `ASR = red-team attacks that got through ÷ attacks attempted` — as a production metric, and drive it down. Run continuous **red-team evals** against your guardrail. Track ASR over time. Treat each new evasion as a regression to fix — exactly like a quality SLO. The guardrail is a control you invest in, not a checkbox you tick. The boundary: a guardrail is the wrong control for a **deterministic guarantee**. Content that must never leak needs an architectural control — never storing it — because a 94% block rate still lets the adaptive 6% through.",
        ],
        diagram: {
          kind: "flow",
          steps: [
            { kind: "input", text: "User input arrives" },
            { kind: "process", text: "Input guardrail checks", caption: "known jailbreak patterns" },
            { kind: "process", text: "Model generates" },
            { kind: "process", text: "Output scan", caption: "harm + policy + DLP" },
            { kind: "output", text: "Response ships" },
          ],
          loop: "Red-team evals continuously re-measure ASR on this same path",
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A vendor pitch says their guardrail 'blocks 94% of jailbreaks', and your CPO wants to approve the customer-facing launch on that number alone. What's the strongest objection from this lesson's framing?",
            choices: [
              { id: "a", label: "94% is below the industry-standard 99% threshold" },
              { id: "b", label: "The 94% was measured only against known patterns. Adaptive and novel attacks aren't in that set, so measure the residual risk instead of assuming it away" },
              { id: "c", label: "Guardrails are illegal in customer-facing products" },
              { id: "d", label: "The number proves the guardrail is a wall, so no further checks are needed" },
            ],
            answer: "b",
            explanation:
              "Guardrails are evadable, not walls. The 94% holds only on the known attack set. The correct posture is a measured, continuously red-teamed ASR — not a one-time block rate taken as a guarantee.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Your security team runs a monthly red-team eval against the banking assistant's guardrail. This month ASR jumped from 3% to 11% with no product change — a new evasion family is circulating. Following the SLO-style posture, what happens next?",
            choices: [
              { id: "a", label: "Nothing — ASR is expected to fluctuate randomly between evals" },
              { id: "b", label: "Treat it as a guardrail regression: alert, investigate the evasion, fix it, and verify ASR falls in the next eval cycle" },
              { id: "c", label: "Remove the guardrail since adaptive attackers always get through" },
              { id: "d", label: "Keep the result internal so competitors don't learn the evasion exists" },
            ],
            answer: "b",
            explanation:
              "ASR is a production metric like a quality SLO. A jump is a regression to root-cause and fix, not noise to ignore or a reason to abandon the control. Each new evasion is a defect in the guardrail. The eval loop exists to catch exactly this.",
          },
        ],
      },
      {
        slug: "privacy-engineering-for-telemetry",
        title: "Privacy engineering for telemetry",
        blurb: "Observe a system that handles sensitive prompts without storing them.",
        topic: "security-privacy",
        skillIds: ["telemetry-privacy", "ai-audit-trail"],
        capability: "Observe an AI system handling sensitive prompts without becoming a breach surface.",
        minutes: 12,
        concept: {
          anchor: "Keep the envelope, throw away the letter — the dimensions carry the signal, and a logbook records every reader.",
          what:
            "Observe without storing the payload: **redact PII at the collector** and keep the dimensions (model, prompt version, token counts, latency). Where prompts must be kept, **residency, tenant isolation, role-tiered access, and an immutable audit trail** govern them.",
          why: "The debugging value lives in the **dimensions, not the raw text** — so the telemetry store never becomes the **breach surface** the system was supposed to avoid.",
          where: [
            "EU financial and health prompts routed to **EU-region backends**, with residency enforced in the collector (GDPR, HIPAA, MiFID II)",
            "**Tenant-partitioned storage** so one customer's prompts can never surface in another tenant's queries",
            "Role tiers — support sees metadata, security sees content under approval — with every read in an **append-only audit trail**",
          ],
          whenNot:
            "When the raw prompt carries **no residual debugging value** beyond its dimensions, storing it is pure liability — redaction-at-collector should have removed it.",
        },
        prose: [
          "Meridian handles EU financial prompts under GDPR and MiFID II. So the central question of its telemetry design is: can the system be observed **without storing the prompt at all**? Often, yes. The debugging value lives in the dimensions — model, prompt version, retrieval version, token counts, latency — not in the raw text. Detect and **redact PII at the collector**, then keep only those dimensions. This preserves debuggability without persisting the sensitive payload.",
          "Where prompts must be kept, **residency and isolation** govern them. Regional data residency routes EU financial or health prompts to EU-region backends, and the collector enforces it. GDPR, HIPAA, and MiFID II all push toward this. **Tenant isolation** partitions telemetry by customer at storage, so one tenant's prompts can never surface in another tenant's queries. These are architectural commitments, not settings.",
          "**Access control and the audit trail** close the loop. Raw prompts, if kept, sit behind role tiers: support sees metadata, security sees content under approval, most roles see neither. Every read of sensitive telemetry lands in an **immutable, append-only audit trail**. That is the evidence layer regulators require, and the record that reconstructs who saw what, when.",
        ],
        diagram: {
          kind: "flow",
          steps: [
            { kind: "input", text: "Sensitive prompt arrives" },
            { kind: "process", text: "Collector detects PII", caption: "scrub or drop payload" },
            { kind: "process", text: "Keep dimensions only", caption: "model, versions, tokens, latency" },
            { kind: "process", text: "Route by residency", caption: "EU prompts to EU backends" },
            { kind: "output", text: "Partitioned, audited store", caption: "tenant isolation + access tiers" },
          ],
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A debugging ticket insists the raw prompts of a healthcare triage assistant must be stored because 'you can't debug what you can't see'. The latency regression under investigation correlates perfectly with retrieval version and token counts. What's the privacy-engineering answer?",
            choices: [
              { id: "a", label: "Store everything — debugging always outranks privacy in healthcare" },
              { id: "b", label: "Redact at the collector and keep dimensions: retrieval version, token counts, latency hold the debug value, not the raw text" },
              { id: "c", label: "Store the prompts but encrypt them with a key kept in the same database" },
              { id: "d", label: "Ask each patient for consent to retain their triage transcript indefinitely" },
            ],
            answer: "b",
            explanation:
              "The misconception is that debuggability requires the payload. It usually doesn't. The dimensions carry the causal signal, and dropping the raw text removes the breach surface entirely rather than trying to guard it.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "During a SOC 2 audit of your multi-tenant SaaS platform, the auditor asks two questions. How do you prove no tenant's prompts can appear in another tenant's query results? And who accessed prompt content last quarter? Which two controls answer them?",
            choices: [
              { id: "a", label: "Faster queries and a longer retention window" },
              { id: "b", label: "Tenant isolation at storage, plus the immutable append-only audit trail recording every sensitive read" },
              { id: "c", label: "A written policy asking engineers to be careful with cross-tenant data" },
              { id: "d", label: "Model vendor attestations that no data leaves their region" },
            ],
            answer: "b",
            explanation:
              "Isolation is architectural — partitioning by tenant at storage, not a policy. The audit trail is the evidence layer that reconstructs who saw what, when. Those two are exactly what an auditor samples.",
          },
        ],
      },
      {
        slug: "governance-frameworks",
        title: "Governance frameworks",
        blurb: "EU AI Act, NIST AI RMF, ISO 42001, SR 11-7 — all reduce to trace + measure + control.",
        topic: "governance",
        skillIds: ["ai-compliance", "eu-ai-act", "nist-ai-rmf"],
        capability: "Map observability signals to the EU AI Act, NIST AI RMF, ISO 42001, and SR 11-7.",
        minutes: 12,
        concept: {
          anchor: "Four inspectors, one checklist — trace decisions, measure behavior, control changes, and every audit reads the same logbook.",
          what:
            "**EU AI Act, NIST AI RMF, ISO 42001, and SR 11-7** read differently but demand the same three proofs: **trace** decisions, **measure** behaviour, **control** changes.",
          why: "Observability is the **evidence layer** for all three: traces and audit trail are traceability, evals/drift/SLOs are measurement, gates and rollback are control. So one governed pipeline satisfies four frameworks.",
          where: [
            "EU AI Act high-risk duties — traceability, human oversight, auditability — mapped to traces, quality SLOs, and the audit trail",
            "NIST AI RMF: evals and drift signals as **Measure**; alerts and rollback as **Manage**; ownership as **Govern**",
            "ISO 42001 certification and SR 11-7 model-risk validation riding the same **review cadence and change control**",
          ],
          whenNot:
            "Governance fails as a **checklist added at the end** — without signal ownership, review cadence, and rollback triggers, the evidence doesn't exist when the auditor or the incident arrives.",
        },
        prose: [
          "Meridian's legal team faces four frameworks at once. The **EU AI Act** risk-classifies systems and imposes duties on high-risk ones — traceability, human oversight, auditability — and obligations on general-purpose model providers. **NIST's AI Risk Management Framework** structures the work as Govern, Map, Measure, and Manage across the lifecycle. **ISO/IEC 42001** is the AI management-system standard an organisation can be certified against. **SR 11-7** imports model risk management from banking: validation, monitoring, and change control.",
          "They read differently but ask the same three things: can you **trace** a decision, can you **measure** the system's behaviour, and can you **control** changes to it. Observability is the **evidence layer** for all three. Traces and the audit trail are traceability. Evals, drift, and SLOs are measurement. Eval gates, versioned releases, and rollback are control. The frameworks don't demand new instrumentation; they demand that the instrumentation you have is governed, owned, and reviewable.",
          "The mistake is treating governance as a **compliance checklist** added at the end. It's a system-lifecycle posture: who owns each signal, what the review cadence is, what triggers a rollback, and where the evidence lives. Build that posture once, and the four frameworks become different lenses on the same **operating system** rather than four separate audits.",
        ],
        diagram: {
          kind: "flow",
          steps: [
            { kind: "input", text: "One governed pipeline", caption: "spans · evals · SLOs · gates · audit trail" },
            { kind: "process", text: "Trace", caption: "decisions reconstructable" },
            { kind: "process", text: "Measure", caption: "evals, drift, SLOs over time" },
            { kind: "process", text: "Control", caption: "eval gates, versioned releases, rollback" },
            { kind: "output", text: "Four frameworks, one evidence layer", caption: "EU AI Act · NIST RMF · ISO 42001 · SR 11-7" },
          ],
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Your legal team must answer an EU AI Act high-risk-classification inquiry for the credit-decisioning assistant: demonstrate traceability, human oversight, and auditability. Which existing observability assets respond before anything new is built?",
            choices: [
              { id: "a", label: "None — the AI Act requires purpose-built regulatory reporting software" },
              { id: "b", label: "Traces reconstruct each decision, quality SLOs feed human oversight, and the audit trail proves who accessed what and when" },
              { id: "c", label: "The model vendor's marketing security whitepaper" },
              { id: "d", label: "A one-time penetration test performed at launch" },
            ],
            answer: "b",
            explanation:
              "The high-risk duties map onto evidence you already produce. The misconception is that compliance demands new instrumentation. It demands that the instrumentation you have be governed, owned, and reviewable.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A newly hired risk officer at your insurer wants quarterly NIST AI RMF 'Measure' reports plus separate hand-built ISO 42001 and SR 11-7 evidence packs. You'd rather build once. What do you show them?",
            choices: [
              { id: "a", label: "That NIST, ISO, and SR 11-7 are mutually incompatible, so three reporting teams are unavoidable" },
              { id: "b", label: "That governed traces, evals, SLOs, and change control are shared evidence — each framework is a lens on the same operating system, so reports are views over one pipeline" },
              { id: "c", label: "That only the EU AI Act matters and the other frameworks can be ignored" },
              { id: "d", label: "That evidence is best generated the week before each audit" },
            ],
            answer: "b",
            explanation:
              "All four frameworks reduce to trace, measure, control. Reporting becomes views over one governed pipeline. The alternative is duplicate hand-built packs that drift apart and expire the moment an incident needs them.",
          },
        ],
      },
      {
        slug: "evaluation-systems-not-one-score",
        title: "Evaluation systems, not one score",
        blurb: "Representative, repeatable, agreed, calibrated, intervalled, drift-watched.",
        topic: "evaluation-and-drift",
        skillIds: ["llm-judge", "eval-bias"],
        capability: "Build a trustworthy evaluation system rather than trust a single tidy score.",
        minutes: 11,
        concept: {
          anchor: "A single score is a fuel gauge with a stuck needle — trust the full instrument panel, uncertainty included.",
          what:
            "Trustworthy evaluation is a **system of six parts** — representative suite, repeatable rubric, **inter-rater agreement (Cohen's κ)**, calibrated judge, confidence intervals, distribution-shift watch — not a single tidy score.",
          why: "Each part plugs a specific failure: stale suites pass everything, low κ makes scores **coin flips**, missing intervals chase noise, and a **stable mean can hide a bimodal regression**.",
          where: [
            "A release claimed to 'improve' by a point — checked against whether the **interval excludes the old value**",
            "Distributions shown next to means so a **bimodal shift** (more 1s and 5s) surfaces before users feel it",
            "κ and judge-vs-human agreement tracked over time so a degrading judge is caught",
          ],
          whenNot:
            "A one-number score is only enough for **coarse triage** — obviously broken vs obviously fine. It is never enough for release decisions, where noise and hidden distribution shifts decide ship/no-ship.",
        },
        prose: [
          "A single tidy score is comforting and almost meaningless. Trustworthy evaluation is a system with six parts. A **representative task suite** mirrors real usage. A **repeatable rubric** gives the same answer twice. Inter-rater agreement is **Cohen's κ = (p₀ − pₑ)/(1 − pₑ)** — observed agreement `p₀` chance-corrected by expected agreement `pₑ`; κ < 0.4 means the score is a coin flip. A **calibrated judge** is measured against humans. **Confidence intervals** separate signal from noise. And a distribution-shift watch catches the mean holding while the shape changes.",
          "Each part plugs a specific failure. A stale suite passes everything. A vague rubric adds noise that swamps real change. Low κ means the score is a **coin flip**. An uncalibrated judge inherits biases. Missing intervals make you chase noise. And a stable mean can hide a distribution growing **bimodal** — more 1s and 5s, fewer 3s — which is a real regression the average conceals.",
          "The discipline is to **ship the system, not the score**. Report intervals alongside means. Show distributions, not just averages. Track κ and judge-agreement over time. When a release 'improves' the score by a point, ask first whether the **interval even excludes** the previous value. If the distribution shifted, ask which direction helped and which hurt. The boundary: the full apparatus is for release decisions. For coarse triage — obviously broken vs obviously fine — a single number remains honest, and paying interval-and-κ costs there is ceremony.",
        ],
        diagram: {
          kind: "flow",
          steps: [
            { kind: "input", text: "Representative suite", caption: "mirrors real traffic" },
            { kind: "process", text: "Repeatable rubric", caption: "same answer twice" },
            { kind: "process", text: "Agreement: κ", caption: "chance-corrected, >0.4 or it's noise" },
            { kind: "process", text: "Calibrated judge + intervals", caption: "vs humans, ±CI" },
            { kind: "output", text: "Distributions, watched over time", caption: "bimodal shifts surface" },
          ],
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Your RAG assistant's weekly eval shows mean answer quality steady at 3.9 for a month — yet support complaints doubled and CSAT dropped. You pull the score distributions and find 1s and 5s growing while 3s shrink. What does the eval system say happened?",
            choices: [
              { id: "a", label: "Nothing — the mean is the metric, and it's stable by definition" },
              { id: "b", label: "A real regression hidden by the average: the distribution is going bimodal, so the system is getting less consistent" },
              { id: "c", label: "The judge became more generous, inflating the high scores" },
              { id: "d", label: "Complaints are unrelated because the suite is representative by construction" },
            ],
            answer: "b",
            explanation:
              "Distribution-shift watch exists for exactly this case. More extreme scores at both ends while the mean holds means real degradation the average conceals. Trusting the mean alone is the failure the six-part system prevents.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A prompt-engineering intern reports a triumphant +1.2 point eval win for their new system prompt and asks for an immediate full rollout. Before acting, you apply the system-of-evaluation view. Which check most directly tests whether the win is real?",
            choices: [
              { id: "a", label: "Whether the confidence interval around the new score excludes the old one — a 1.2-point move inside the interval is sampling noise" },
              { id: "b", label: "Whether the new prompt is longer than the old one" },
              { id: "c", label: "Whether the dashboard renders the new score in green" },
              { id: "d", label: "Whether the intern also ran the eval on a weekend" },
            ],
            answer: "a",
            explanation:
              "Missing intervals make you chase noise. Without knowing the uncertainty, a point-swing this size is indistinguishable from sampling variance. The suite, rubric, and judge matter, but the interval is the immediate real-vs-noise test before any rollout.",
          },
        ],
      },
      {
        slug: "detecting-drift-regressions",
        title: "Detecting drift and regressions",
        blurb: "Distributions move before averages do.",
        topic: "evaluation-and-drift",
        skillIds: ["model-drift", "llm-drift"],
        capability: "Catch input, output, and retrieval drift in distributions before averages move.",
        minutes: 11,
        concept: {
          anchor: "Watch the whole weather map, not the average temperature — storms show in the shape long before the mean moves.",
          what:
            "Drift in generative systems is **distributional** — input (PSI), output, and retrieval distributions move before averages do — so the right primitive is a **change-point on the distribution**, not a threshold on the mean.",
          why: "The mean is the **last signal to move**. Distribution metrics are the leading indicator that lets you act before users have felt the drift for days.",
          where: [
            "**PSI on input embeddings** flagging a prompt-mix shift before quality averages drop",
            "**Cohort-aware baselines** per region so segment-specific drift isn't diluted by the aggregate",
            "Sequential change-point monitoring watching output shape over time against a baseline",
          ],
          whenNot:
            "Don't run per-cohort distribution monitors where **traffic is too sparse to estimate a distribution** — a handful of requests a day makes PSI noise, not signal.",
        },
        prose: [
          "Drift in generative systems is **distributional**, and distributions move before averages do. **Input drift** shows in the population stability index — `PSI = Σ (aᵢ − bᵢ) · ln(aᵢ / bᵢ)`, comparing bucket shares `aᵢ` against baseline `bᵢ`, where PSI > 0.25 marks a major shift. It tells you the prompts your system sees have changed, even if average quality hasn't. **Output drift** tells you the shape of the answers is changing. **Retrieval drift** tells you the context being surfaced is moving. All three can cross a threshold while the mean score looks perfectly healthy.",
          "This is why a **change-point**, not a threshold on the mean, is the right detection primitive. Sequential monitoring watches the distribution over time and flags the moment it shifts relative to a **cohort-aware baseline**. A global baseline hides region or cohort-specific drift. Baselines per cohort catch a degradation that's real in one segment and invisible in the aggregate.",
          "The practical lesson: watch distributions, not just means, and set baselines per cohort. The mean is the **last signal to move**. By the time it drops, users have already felt the drift for days. Distribution metrics give you the **leading indicator** that lets you act before the mean confirms the problem. The boundary: distribution monitors need traffic. On a cohort serving a handful of requests a day, PSI is noise by construction, and the honest signal is periodic human review of a sample.",
        ],
        diagram: {
          kind: "flow",
          steps: [
            { kind: "input", text: "Distributions per cohort", caption: "inputs · outputs · retrieved context" },
            { kind: "process", text: "PSI vs cohort baseline", caption: "Σ (aᵢ − bᵢ)·ln(aᵢ/bᵢ) — >0.25 = major" },
            { kind: "process", text: "Sequential change-point test", caption: "not a mean threshold" },
            { kind: "output", text: "Drift flagged before the mean moves", caption: "the leading indicator" },
          ],
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "After a marketing campaign, your finance copilot's mean quality score is unchanged. But PSI on the input distribution jumped from 0.08 to 0.35: retail-trading novices are arriving where professionals used to. Ops asks why anyone should care while the mean is stable. What do you say?",
            choices: [
              { id: "a", label: "They shouldn't — the mean is the contract with the business" },
              { id: "b", label: "PSI is the leading indicator: inputs have shifted, and quality averages drop only after users have already felt the propagated damage" },
              { id: "c", label: "PSI jumps during campaigns are a known dashboard artifact and self-correct" },
              { id: "d", label: "Pause the campaign until the mean moves" },
            ],
            answer: "b",
            explanation:
              "The misconception is that a stable mean means stability. The mean is the last signal to move; PSI catching the input shift first is the whole point of distributional drift detection.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A region-split rollout of your support agent shows the global quality mean flat for two weeks, yet the German segment's satisfaction is sliding while the US improves. Your single global drift baseline never fired. What was misconfigured?",
            choices: [
              { id: "a", label: "Nothing — a flat global mean proves every segment is fine" },
              { id: "b", label: "Tail sampling — the German traces were dropped before reaching the monitor" },
              { id: "c", label: "The baseline was global, so real segment drift diluted into the aggregate; cohort-aware baselines per region would have caught it" },
              { id: "d", label: "The judge needs retraining on German inputs" },
            ],
            answer: "c",
            explanation:
              "Aggregation dilutes local drift: one region degrading while another improves nets out to a flat mean. Cohort-aware baselines catch the segment-specific regression that a global metric averages away.",
          },
        ],
      },
      {
        slug: "causal-diagnosis-experimentation",
        title: "Causal diagnosis and experimentation",
        blurb: "Correlation gives suspects; experiments give causes.",
        topic: "diagnosis-and-agents",
        skillIds: ["eval-gates"],
        capability: "Establish cause with feature flags, canaries, shadow traffic, and holdouts.",
        minutes: 11,
        concept: {
          anchor: "Correlation is an eyewitness; an experiment is a trial — flip one switch and compare the two rooms.",
          what:
            "**Correlation gives suspects; experiments give causes.** Feature flags, canaries, shadow traffic, and holdouts isolate the variable so a **flag-on vs flag-off comparison** attributes the regression.",
          why: "Rolling back the most visible change often fixes nothing when a **second change shipped the same day**. Controlled comparison acts on evidence, not the coincidence of a calendar.",
          where: [
            "**Feature-flagged releases** with an instant off-switch and comparable on/off cohorts",
            "**Canary slices** bounding a regression's blast radius; **shadow traffic** surfacing failures before users see them",
            "A **holdout** permanently on the old version as a standing clean baseline for the metric that matters",
          ],
          whenNot:
            "Experimentation is overkill when the causal chain is **directly visible in one trace**. If a single failing request shows the bug, flag infrastructure and cohort math cost more than the answer.",
        },
        prose: [
          "**Correlation gives suspects; experiments give causes.** When a regression coincides with a release, the tempting move is to roll back the most visible change. That often fixes nothing, because the real cause was a second change shipped the same day. The disciplined alternative is to **isolate the variable** with a controlled experiment.",
          "The toolkit is **feature flags, canaries, shadow traffic, and holdouts**. Feature-flag the candidate so you can turn it off instantly and so on/off cohorts are comparable. **Canary** to a small slice of traffic so a regression's blast radius stays bounded. **Shadow traffic** runs the new path without serving it, so failures surface before users see them. A **holdout** keeps a cohort permanently on the old version, so you always have a clean comparison for the metric that matters.",
          "The discipline is to compare **flag-on versus flag-off** on the same metric, with the same judge and the same interval, before you act. If the candidate loses on the controlled comparison, you've found the cause — roll it back. If it wins, ship it. Either way, you acted on evidence, not on the coincidence of a calendar.",
        ],
        diagram: {
          kind: "decision",
          root: {
            kind: "decision",
            question: "Is the causal chain visible in one trace?",
            branches: [
              { label: "yes", node: { kind: "leaf", answer: "Read it — done", caption: "no experiment needed" } },
              {
                label: "no — multiple suspects",
                node: { kind: "leaf", answer: "Isolate the variable", caption: "flag → canary → shadow → holdout" },
              },
            ],
          },
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Quality dropped 8% the same day your team shipped a new retrieval index AND another team silently swapped the embedding model. The incident channel wants to roll back 'the obvious one' — the index. Why is that premature?",
            choices: [
              { id: "a", label: "Indexes can never affect answer quality" },
              { id: "b", label: "Two changes shipped together; without a controlled flag-on/flag-off comparison you can't attribute the regression — rolling back the visible change may fix nothing" },
              { id: "c", label: "The embedding model belongs to another team, so it can't be the cause" },
              { id: "d", label: "Quality drops are always seasonal around releases" },
            ],
            answer: "b",
            explanation:
              "Coincidence of timing is correlation, not cause. With two suspects, only isolating the variable tells you which change drove the 8% — flag one change and compare cohorts on the same metric and judge.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Your checkout-copilot team is about to enable a new planner prompt for 100% of traffic straight to production. Describe the release-safety pattern that bounds the blast radius and preserves a clean long-term comparison.",
            choices: [
              { id: "a", label: "Ship 100% and watch the dashboards for a week" },
              { id: "b", label: "Canary a small traffic slice behind a feature flag, shadow-run the new path if needed, and keep a permanent holdout on the old version as the standing baseline" },
              { id: "c", label: "Deploy to production but ask users to report anything odd" },
              { id: "d", label: "Run the new prompt only on internal demo accounts each quarter" },
            ],
            answer: "b",
            explanation:
              "The flag gives the instant off-switch and comparable cohorts. The canary bounds exposure. Shadow traffic surfaces failures before users see them. The holdout keeps a clean baseline so the metric impact stays measurable. Each tool does one job.",
          },
        ],
      },
      {
        slug: "agent-tool-observability",
        title: "Agent and tool-use observability",
        blurb: "Observe the graph — tools, loops, budgets, MCP — not just the LLM node.",
        topic: "diagnosis-and-agents",
        skillIds: ["agent-tracing", "mcp-observability"],
        capability: "Observe the agent graph: tool calls, loops, budgets, state transitions, and MCP spans.",
        minutes: 11,
        concept: {
          anchor: "Coach the relay team, not the star runner — the handoffs are where the race is lost.",
          what:
            "An agent is a **graph of calls, tools, and state** — reliability lives in the edges (tool success, retry depth, budget exhaustion, MCP spans, call-graph shape), not the LLM node.",
          why: "Node-only LLM monitoring misses **climbing retry depth** (stuck agent), **budget exhaustion mid-task** (truncated outputs that look like model failures), and **novel cycles** (bugs before outages).",
          where: [
            "Per-tool success rates across an agent fleet, with **MCP spans attributed to the agent goal** that spawned them",
            "**Loop/retry-depth and token-budget alerts** on the task span parenting its children",
            "**Call-graph shape monitoring** flagging a new cycle as a leading bug signal",
          ],
          whenNot:
            "Node-level LLM metrics suffice when there **is no graph** — a single-shot completion with no tools, loops, or budget has no edges to observe.",
        },
        prose: [
          "Meridian's budget alerts fire while every per-model dashboard reads green. Why? Meridian is not one LLM call but a **graph of calls, tools, and state**. Plain LLM observability watches the node: the model's latency and tokens. It misses the edges: which tool was called, whether it succeeded, how many times the agent retried, whether it hit a budget, and how the call-graph shape changed. Agent reliability lives in the graph, not the node.",
          "The agent-specific signals are tool-call success per tool, **loop and retry depth**, **budget exhaustion**, state transitions, **MCP spans** across servers, and trace-graph anomalies. Climbing retry depth is the leading indicator of a stuck agent. Budget exhaustion mid-task produces truncated, low-quality outputs that look like model failures. A **novel cycle** in the call graph is often a bug before it's an outage.",
          "Each tool call — including Model Context Protocol calls across servers — needs its **own span**, attributed to the agent goal that spawned it. Without that **attribution** you can't say which agent, using which tool, on which server, burned the budget or looped. The unit of diagnosis is the **task span parenting its children**, not the individual completion.",
        ],
        diagram: {
          kind: "flow",
          steps: [
            { kind: "input", text: "Task span opens", caption: "attributed to agent goal" },
            { kind: "process", text: "LLM call decides" },
            { kind: "process", text: "Tool / MCP span", caption: "args, success, server" },
            { kind: "process", text: "Loop + budget check", caption: "retry depth, token cap" },
            { kind: "output", text: "Task completes, traced" },
          ],
          loop: "Each retry adds a child span — depth is the stuck-agent signal",
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Your multi-agent research fleet's budget alerts keep firing, but the per-model dashboards (latency, tokens per completion) all look healthy, so leadership suspects a billing bug. What does node-only monitoring miss here?",
            choices: [
              { id: "a", label: "Nothing — model dashboards are sufficient for agent workloads" },
              { id: "b", label: "The graph: which agent + tool + server looped or burned the budget — retry depth and budget exhaustion live on task and tool spans, not the LLM node" },
              { id: "c", label: "The invoices are probably correct and the dashboards lag by a month" },
              { id: "d", label: "Budget alerts should be disabled for agent workloads" },
            ],
            answer: "b",
            explanation:
              "Agent reliability lives in the graph, not the node: a task looping between healthy-looking completions burns budget invisibly. Per-model metrics can't attribute the burn to an agent, tool, or server. Task-parented spans can.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A routine release of your travel-booking agent introduced a new call-graph pattern. The agent now visits the same tool pair three times where it used to visit once. Today two tasks looped until timeout. What's the right reading of that novel cycle?",
            choices: [
              { id: "a", label: "It's an optimization — repetition improves answer accuracy" },
              { id: "b", label: "A bug signal: a new cycle in the call graph usually precedes budget burn and hangs; flag it before it becomes an outage" },
              { id: "c", label: "Normal variance, as long as each individual tool call succeeds" },
              { id: "d", label: "Proof the MCP server needs a bigger machine" },
            ],
            answer: "b",
            explanation:
              "Call-graph shape is a signal in itself. A cycle the agent didn't show before is a logic change that eventually wastes budget or loops forever. Waiting for individual spans to fail (they succeed) or for users to time out is how it becomes an outage first.",
          },
        ],
      },
      {
        slug: "reliability-objectives-error-budgets",
        title: "Reliability objectives and error budgets",
        blurb: "A portfolio of SLOs with one non-negotiable safety gate.",
        topic: "operation",
        skillIds: ["ai-slo"],
        capability: "Hold a portfolio of SLOs with a non-negotiable safety gate and resolve conflicts via budgets.",
        minutes: 11,
        concept: {
          anchor: "Reliability is a household budget with one non-negotiable rule — the smoke alarm is never traded for savings.",
          what:
            "An AI feature holds a **portfolio of SLOs** — availability, latency, quality, cost, safety — whose conflicts are resolved by **error budgets**. Safety is a **gate** that blocks release regardless of remaining budget.",
          why: "Optimising one objective silently degrades the others (cheaper model → quality drop). Budgets make trade-offs explicit, and the **release gate** resolves them with evidence before users see the regression.",
          where: [
            "A release gate requiring the candidate to **beat or match the incumbent** on quality (golden set), cost, and latency before shipping",
            "Shipping paused when the quality **error budget burns**, resumed when it recovers",
            "**Safety regressions blocking release** even with cost and quality budget to spare",
          ],
          whenNot:
            "A full portfolio is dead weight for an **internal prototype with no users** — one signal plus a rollback habit beats five SLOs nobody enforces.",
        },
        prose: [
          "Meridian holds several reliability objectives at once — availability, latency, quality, cost, and safety. Its cost squad's cheaper-model routing is the standing proof they **conflict**: cost falls while quality and latency move. Chasing quality raises cost. The naive stance — optimise one — silently degrades the others. A **portfolio** makes the trade-offs explicit.",
          "**Error budgets** resolve the conflicts. Each objective gets a target and a budget. You ship while budgets allow and freeze when they burn. The exception is **safety, which is a gate rather than a budget**. A safety regression blocks a release, no matter how much cost or quality budget remains. Treating safety as negotiable is how systems get harmful outputs into production.",
          "The **release gate** is where the portfolio becomes operational. Before it ships, a candidate must beat or match the incumbent on the measured objectives — quality on the **golden set**, cost within budget, latency within SLO — and pass the safety gate. Conflicts are resolved at the gate with evidence, not in a meeting after the regression has already reached users.",
        ],
        diagram: {
          kind: "decision",
          root: {
            kind: "decision",
            question: "Can the candidate release?",
            branches: [
              { label: "Safety regression found", node: { kind: "leaf", answer: "Block release", caption: "safety is a gate, not a budget" } },
              { label: "Error budget burned", node: { kind: "leaf", answer: "Freeze ships", caption: "resume when budget recovers" } },
              { label: "Beats or matches incumbent", node: { kind: "leaf", answer: "Ship it", caption: "quality, cost, latency evidenced" } },
            ],
          },
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "The cost-optimization squad routes your support assistant to a cheaper model: cost SLO green, latency green, but the safety eval shows a harmful-output regression. They argue there's plenty of quality budget left to absorb it. What does the portfolio say?",
            choices: [
              { id: "a", label: "Ship it — green cost and latency metrics override one red eval" },
              { id: "b", label: "Block the release: safety is a gate, not a budget — there is no 'allowed amount of harm' to spend regardless of remaining budget" },
              { id: "c", label: "Ship it, but lower the safety eval's weight next quarter" },
              { id: "d", label: "Split traffic 50/50 and let users decide" },
            ],
            answer: "b",
            explanation:
              "Latency and quality budgets tolerate shortfall; safety doesn't. Treating the safety regression as spendable budget is exactly how harmful outputs reach production while every other dashboard stays green.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A new coding-assistant candidate beats the incumbent by 2 points on the golden-set quality eval. But it breaches the latency SLO and sits at the edge of the cost budget. The team wants to ship on the quality win. How does the release gate resolve this?",
            choices: [
              { id: "a", label: "Quality wins ship automatically — the other objectives are advisory" },
              { id: "b", label: "The candidate must meet every measured objective and pass safety before shipping; trade-offs are decided at the gate with evidence, not on the single strongest metric" },
              { id: "c", label: "Disable the latency SLO for coding assistants permanently" },
              { id: "d", label: "Ship it and renegotiate the SLO breach after users feel the benefit" },
            ],
            answer: "b",
            explanation:
              "The portfolio exists because objectives conflict: a strong single metric is exactly the case the gate is for. Shipping first and negotiating SLOs afterward resolves the conflict only after users have absorbed the regression.",
          },
        ],
      },
      {
        slug: "incident-command-learning-loop",
        title: "Incident command and the learning loop",
        blurb: "An incident is closed when its postmortem becomes a regression test.",
        topic: "operation",
        skillIds: ["ai-incident-response"],
        capability: "Run an AI incident end-to-end and close it with an automated regression test.",
        minutes: 11,
        concept: {
          anchor: "An incident closes when its postmortem becomes a regression test — anything less reopens it.",
          what:
            "An AI incident runs a lifecycle — **detect** on a real signal, coordinate under an **incident commander**, **mitigate** before root-causing, communicate on a clock, hold a **blameless postmortem** — and closes only when the fix becomes an **automated regression test**.",
          why: "Skipping the last step is what makes incidents **repeat**: without a CI regression test, the same change can reintroduce the same failure next quarter.",
          where: [
            "**Burn-rate alerts on quality** (not just latency) detecting degradation users already feel",
            "Rolling back the changed variable first to stop user impact, then root-causing from a stable system",
            "Postmortem actions encoded as **CI regression tests** that block reintroduction of the failure",
          ],
          whenNot:
            "The full command structure is overkill for a **low-severity, user-invisible blip**. A single-owner fix plus a test may be the whole response. Commanders and comms cadences earn their cost at user impact.",
        },
        prose: [
          "At 02:00, Meridian's quality burn-rate alert fires: EU users are getting degraded answers after a retrieval-index swap. An AI incident has a lifecycle, and **skipping the last step** is what makes incidents repeat. **Detect** via a real signal — a burn-rate alert on quality, not just latency. **Coordinate** with a commander who owns the response and clear roles for comms, diagnosis, and fix. **Mitigate** by rolling back the changed variable first; live root-causing can wait, users can't.",
          "Communicate honestly and **on a clock**: what we know, what we're doing, the next update. Silence during an outage breeds worse narratives than the outage itself. After mitigation, hold a **blameless postmortem** — blameless on people, rigorous on systems. It reconstructs what happened, what we believed and why it was wrong, and the systemic fix.",
          "The **learning loop** closes when the postmortem's action becomes an **automated regression test in CI**. Without that step, the same change can reintroduce the same failure next quarter. An incident isn't closed when it's fixed; it's closed when the system has been changed so that specific failure can't recur.",
        ],
        diagram: {
          kind: "flow",
          steps: [
            { kind: "input", text: "Detect", caption: "burn-rate alert on quality" },
            { kind: "process", text: "Commander + roles", caption: "one owner, comms cadence" },
            { kind: "process", text: "Mitigate", caption: "roll back the changed variable first" },
            { kind: "process", text: "Blameless postmortem", caption: "blameless on people, rigorous on systems" },
            { kind: "output", text: "Regression test in CI", caption: "closed = can't recur" },
          ],
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "At 02:00 the quality burn-rate alert fires on your research assistant: answers are degrading visibly for EU users after a retrieval-index swap. The on-call engineer wants to spend the next few hours root-causing live before touching anything. What's the correct first move?",
            choices: [
              { id: "a", label: "Root-cause live while users suffer — mitigating destroys the evidence" },
              { id: "b", label: "Mitigate first: roll back the changed variable to stop user impact, then investigate from a stable system" },
              { id: "c", label: "Wait for the morning standup to assign an incident commander" },
              { id: "d", label: "Silence the burn-rate alert so the pager stops firing" },
            ],
            answer: "b",
            explanation:
              "Mitigation is for users; root-cause is for later. Telemetry preserves the evidence after rollback, so nothing is lost — but hours of live debugging while EU users get degraded answers is the failure mode the lifecycle order prevents.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Six months after a system-prompt leak incident, the same vulnerability reappears because a refactor reintroduced the old code path. The postmortem had a detailed writeup and a well-attended review meeting. What was never done?",
            choices: [
              { id: "a", label: "The postmortem wasn't long enough to cover edge cases" },
              { id: "b", label: "The fix was never encoded as an automated regression test in CI, so nothing blocked the change from reintroducing the failure" },
              { id: "c", label: "No one was blamed, so accountability lapsed" },
              { id: "d", label: "The incident commander role wasn't made permanent" },
            ],
            answer: "b",
            explanation:
              "Writeups and meetings don't prevent recurrence — CI does. The learning loop closes only when the fix becomes a regression test that fails the build reintroducing the failure. Otherwise the same change ships again next quarter.",
          },
        ],
      },
      {
        slug: "capstone-design-review",
        title: "Capstone: production design review",
        blurb: "Observe quality, safety, and cost at scale — privately, gated, and auditable.",
        topic: "capstone",
        skillIds: ["ai-observability"],
        capability: "Defend an end-to-end observability design across cost, privacy, debuggability, release safety, and security.",
        minutes: 14,
        concept: {
          anchor: "Defend the system like a house on inspection day — every layer shows its own working smoke detector.",
          what:
            "The capstone defends a multi-agent financial system across **privacy, cost, debuggability, release safety, and security** — redact at ingest, enforce residency, tail-sample and cap cardinality, trace the agent graph, gate releases, read the OWASP signals.",
          why: "The naive design (raw prompts across regions, 100% sampling, model-only watches, ship-by-hope) is **both a breach surface and a debugging dead-end**. Each hardened choice is a **contract owned by a specific layer**.",
          where: [
            "Multi-region rollout: EU residency in the collector, tenant isolation at storage, an **audit trail** on every sensitive read",
            "Agent fleet: **task spans parenting tool/MCP spans**, budget and loop alerts, eval-gated releases with canaries",
            "Guardrail **ASR measured continuously** and read as a production SLO alongside quality and cost",
          ],
          whenNot:
            "The full stack is only justified at **production scale with regulated data** — an internal prototype with no users or auditors shouldn't pay for residency routing, tenant partitioning, and eval gates.",
        },
        prose: [
          "The capstone is Meridian's architecture review: defend a complete design across every axis the course covered — **privacy, cost, debuggability, release safety, and security**. The naive design logs raw prompts across regions, samples at 100%, watches only the model, ships by hope, and detects no attacks. It's both a **breach surface** and a **debugging dead-end**.",
          "The hardened design **redacts at ingest**, enforces EU residency, and isolates tenants. It **tail-samples and caps cardinality**. It traces the agent graph including MCP. It gates releases behind evals and canaries. And it reads the OWASP signals and measures its guardrail's **attack-success rate**. Each choice is a contract owned by a specific layer. Together they resolve the central tension: the system is observable and **safe to operate**.",
          "That is the enterprise bar this course builds toward: prove you can **trace every decision**, measure quality and safety continuously, **control every change** through gates, and keep every sensitive payload private and audited. Observability, done at this level, is what turns a powerful AI system into a **trustworthy** one.",
        ],
        diagram: {
          kind: "decision",
          root: {
            kind: "decision",
            question: "Architecture review: which contract does each choice break?",
            branches: [
              { label: "raw prompts stored globally", node: { kind: "leaf", answer: "Privacy fails at ingest", caption: "redact at the collector, route by residency" } },
              { label: "100% retention, unbounded dimensions", node: { kind: "leaf", answer: "Cost fails at the index", caption: "tail-sample + cardinality cap" } },
              { label: "model-only dashboards", node: { kind: "leaf", answer: "Debuggability fails at the graph", caption: "trace tool/MCP spans under task spans" } },
              { label: "manual QA as the gate", node: { kind: "leaf", answer: "Release safety fails at the gate", caption: "eval-gated releases + canaries" } },
            ],
          },
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "An architecture review board is comparing two designs for a multi-agent financial research platform. Design A logs raw prompts globally, keeps 100% of traces, watches per-model latency, and ships after manual QA. Design B redacts at the collector, tail-samples, traces the agent graph with MCP spans, and gates releases on evals. What's the strongest verdict?",
            choices: [
              { id: "a", label: "Both are equivalent — B is just A with extra steps and cost" },
              { id: "b", label: "A is both a breach surface and a debugging dead-end; B makes each layer own a contract — privacy at ingest, cost via sampling, debuggability via the graph, safety via gates" },
              { id: "c", label: "A is compliant because QA signed off before each ship" },
              { id: "d", label: "B fails because redaction makes debugging impossible by design" },
            ],
            answer: "b",
            explanation:
              "A's raw prompts across regions are the breach surface. Its model-only view can't debug an agent graph — while redaction keeps the dimensions that carry debug value. B's strength is that each layer owns exactly one guarantee.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "You're hired to review a health-automation startup's 'observability v2' proposal: more dashboards, a bigger model, 100% trace retention, with privacy 'handled later'. The CEO asks what the enterprise bar actually requires. What do you tell them?",
            choices: [
              { id: "a", label: "Buy the dashboards first — visibility is the bar" },
              { id: "b", label: "Trace every decision, measure quality and safety continuously, control changes through gates, and keep sensitive payloads private and audited — power without those is a liability" },
              { id: "c", label: "The bar is the cheapest model that passes its unit tests" },
              { id: "d", label: "Wait until regulators force the requirements, then retrofit" },
            ],
            answer: "b",
            explanation:
              "Dashboards and retention are volume, not observability. The bar the capstone sets is traceable decisions, continuous measurement, gated change control, and private audited payloads. Retrofitting privacy after storing health prompts 'later' never comes cheap.",
          },
        ],
      },
    ],
};

export default course;
