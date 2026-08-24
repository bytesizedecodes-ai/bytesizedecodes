import type { Course } from "../types";

const course: Course = {
    slug: "llm-observability",
    title: "LLM Observability",
    subtitle: "Instrument, evaluate, and rescue one LLM/RAG feature in production.",
    description:
      "An intermediate, hands-on course built on one running case. Relay is the customer-support assistant for an online electronics retailer. A new release ships, and Relay's answer quality drops in production that same week. You trace its requests, build its evaluations, set its SLOs, and diagnose the drop end-to-end. Every lesson adds one piece of evidence to Relay's incident. Some Python familiarity helps. There are a few short exercises.",
    level: "intermediate",
    domain: "AI Observability",
    access: "free",
    prerequisites:
      "The AI Observability course (or equivalent hands-on experience). You should already be comfortable with logs, metrics, traces, and evaluation basics.",
    lessons: [
      {
        slug: "request-to-trace",
        title: "From a request to a trace",
        blurb: "One user turn becomes one trace of nested spans.",
        topic: "tracing-foundations",
        skillIds: ["distributed-tracing", "otel-genai"],
        capability: "Read a trace of nested spans and reconstruct one user turn end-to-end.",
        minutes: 8,
        concept: {
          anchor: "A trace is the itemized receipt for one request — every step listed with its own timing.",
          what: "A **trace** is one request broken into nested **spans** — one span per step (retrieval, LLM call, tool). Each span carries its own timing and attributes.",
          why: "It replaces guesswork with attribution. 'The assistant is slow' becomes '**this span** is slow'. A **correlation ID** stitches every child span to the request that caused it.",
          where: [
            "Reconstructing **one slow support-bot turn** across retrieval, model, and tool services",
            "Proving a **tool call** — not the model — produced a bad answer",
            "Attributing an 860ms model call vs a 110ms stalled tool in one view",
          ],
          whenNot:
            "One trace can't show trends. 'Is latency (the wait time for a response) rising this week?' is a **metric** question. Traces zoom into a **single request**.",
        },
        prose: [
          "Meet the case that runs through this whole course. **Relay** is the customer-support assistant for an online electronics retailer. In a customer demo, Relay takes 14 seconds to answer “where is my order?” The room starts guessing: the model? the retrieval? the order-status tool? Make your own prediction before you look. A wrong guess is diagnostic too.",
          "What you open is the **trace** of that one request. The request is broken into **spans**, one per unit of work: retrieval, LLM call, tool invocation. Each span has a start, an end, and attributes that describe what happened. Spans nest under a **root span** for the whole turn. A **correlation ID** on the root is inherited by every child. That ID stitches Relay's steps together across services.",
          "Derive the pay-off rung by rung. A request is steps scattered across services → blaming a step requires its timing → timing without a shared request identity can't be reassembled → the correlation ID is that identity, and the trace is its assembled story. Relay's first trace reads: retrieval fine, model 860ms, tool stalled 110ms. One span owns the wait. That's this lesson's evidence in Relay's case file. Diagnosis replaces guesswork.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "During a customer demo, your support assistant takes 14 seconds to answer one question. You want to know exactly which step inside that request ate the time. What do you open?",
            choices: [
              { id: "a", label: "The trace of that one request, to see each span's timing and attributes" },
              { id: "b", label: "The weekly average-latency metric, zoomed into demo day" },
              { id: "c", label: "The model vendor's pricing page" },
              { id: "d", label: "The front-end JavaScript console" },
            ],
            answer: "a",
            explanation:
              "The average confirms slowness but can't attribute it. A trace breaks that single request into nested spans — retrieval, model call, tool — so the slow step is visible right away.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Your e-commerce checkout copilot spans three services: retrieval, model, and a payments tool. Users sometimes report wrong totals. What mechanism reassembles each user's full journey across those services?",
            choices: [
              { id: "a", label: "Matching timestamps across services to the nearest second" },
              { id: "b", label: "A correlation ID on the root span, inherited by every child span" },
              { id: "c", label: "Attaching the customer's email to every service's logs" },
              { id: "d", label: "The HTTP status code returned by each service" },
            ],
            answer: "b",
            explanation:
              "The correlation ID is the glue that stitches spans from different services into one trace. Timestamps drift (slowly fall out of sync), so matching them fails. Emails are PII. Status codes say nothing about which request a call belonged to.",
          },
        ],
      },
      {
        slug: "instrument-right-context",
        title: "Instrument the right context",
        blurb: "The few span attributes that explain a change — and the ones that leak.",
        topic: "tracing-foundations",
        skillIds: ["llm-instrumentation", "telemetry-privacy"],
        capability: "Choose span attributes that aid debugging without leaking PII or adding noise.",
        minutes: 9,
        concept: {
          anchor: "Span attributes are labels on moving boxes — a few clear stickers beat writing everything on the side.",
          what: "Instrument a **small set of high-value dimensions**: model, prompt version, retrieval version, tool name. These are the variables that **change between releases**.",
          why: "Tagging spans with them turns ‘something regressed’ into **‘it regressed when prompt v17 shipped’** — release-level attribution instead of guesswork.",
          where: [
            "Bisecting a quality drop to **the exact prompt or retrieval version**",
            "Comparing **model variants** across the same traffic",
            "Attributing a cost spike to **one tool’s calls**",
          ],
          whenNot:
            "Not raw prompts, not PII, not anything **unique per request**. Over-collection builds a breach surface. High-cardinality attributes blow up index sizes and help no query.",
        },
        prose: [
          "A week into Relay’s case file, quality scores drop 12%. The natural first question is *which release did it?* Good instrumentation makes that question answerable. Tag a small set of **high-value dimensions**: the model, the prompt version, the retrieval version, and any tool name. These are the variables that **change between releases**. Tagging every span with them turns ‘something regressed’ into ‘it regressed when prompt v17 shipped’. That is exactly how Relay’s drop gets bisected.",
          "Two failure modes are equally common. The first is **over-collection**: logging raw prompts and user emails wholesale. That turns your telemetry store into a breach surface. The second is **high-cardinality noise**: a unique attribute per request (a raw timestamp, a full session id). It blows up index sizes and helps no query.",
          "The rule is simple. Capture the **dimensions that explain a change**. Redact or sample everything that identifies a person. Leave out anything that's unique per request. A clean contract is **small, private, and diagnostic**.",
        ],
        diagram: {
          kind: "decision",
          root: {
            kind: "decision",
            question: "Add this span attribute?",
            branches: [
              { label: "varies by release", node: { kind: "leaf", answer: "Tag it", caption: "model · prompt version · retrieval version · tool" } },
              { label: "identifies a person", node: { kind: "leaf", answer: "Redact or hash", caption: "opaque tenant id, never raw PII" } },
              { label: "unique per request", node: { kind: "leaf", answer: "Leave it out", caption: "high-cardinality noise" } },
            ],
          },
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Quality scores on your support assistant dropped 12% sometime this month. Two prompts (v16, v17) and one retrieval index change shipped in that window. With every span tagged model + prompt_version + retrieval_version, what does the investigation look like?",
            choices: [
              { id: "a", label: "Split the metric by prompt version and retrieval version — the guilty release stands out immediately" },
              { id: "b", label: "Read every raw prompt from the month, one by one" },
              { id: "c", label: "Guess, then roll back everything at once" },
              { id: "d", label: "Wait for users to say which answers felt wrong" },
            ],
            answer: "a",
            explanation:
              "Release-varying dimensions are what turn ‘something regressed’ into ‘it regressed when prompt v17 shipped’. Read raw prompts only after attribution, not before.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A new engineer proposes tagging every span with the user's email, the full raw prompt, and a nanosecond timestamp ‘so nothing is ever lost’. Security reviews it next week. Which two objections should they expect?",
            choices: [
              { id: "a", label: "Emails are PII (breach surface) and nanosecond timestamps are high-cardinality noise that bloats indexes without aiding queries" },
              { id: "b", label: "Emails are too short, and timestamps are too long" },
              { id: "c", label: "Raw prompts can't be stored as strings" },
              { id: "d", label: "None — collecting everything is always safer" },
            ],
            answer: "a",
            explanation:
              "Over-collection builds a breach surface (PII in the telemetry store). Unique-per-request attributes blow up index sizes. These are the two failure modes a clean contract avoids.",
          },
        ],
      },
      {
        slug: "logs-without-leaking",
        title: "Logs that help without leaking data",
        blurb: "Redact, minimise, and still debug.",
        topic: "tracing-foundations",
        skillIds: ["telemetry-privacy"],
        capability: "Redact and minimise log content so debugging value survives without PII exposure.",
        minutes: 8,
        concept: {
          anchor: "Log redaction is writing a postcard — assume anyone could read it, so keep it useful but strip the secrets.",
          what: "Logs are where **debugging value** and **privacy risk** collide. Minimise first: do you need the field at all? Then log the least identifying form.",
          why: "A **hashed user id** or a **token count** (a tally of the word-sized pieces the model reads) keeps the debugging signal. It also shrinks the breach surface. If the log table leaks, nothing about a person escapes.",
          where: [
            "Replacing a user's email with a **hashed id** in support-assistant logs",
            "Logging **token counts** and a prompt version instead of raw prompts in a RAG pipeline",
            "Sampling a fraction of answers so retention stays short and cheap",
          ],
          whenNot:
            "Encoding is not redaction. Base64 or truncation still leaks. And a field that isn't needed for debugging or audit shouldn't be logged at all.",
        },
        prose: [
          "Relay logs every support turn. Legal asks the question this lesson answers: if the log table leaked tomorrow, what could someone learn about a customer? Logs are where **debugging value** and **privacy risk** collide. The same line that helps you reconstruct a faulty Relay turn can also hold a card number, an email, or a secret the model echoed back. The discipline is to separate the two. Keep what explains behaviour. **Redact** what identifies a person.",
          "**Minimisation** comes before redaction. Ask whether a field needs to be logged at all. If it does, log the least identifying form: a hash of the user id, a token count instead of the raw prompt, or a sampled answer rather than every one. **Retention** and consent then set how long even the redacted data lives.",
          "The practical test is the **'breach' thought experiment**: if this log table leaked tomorrow, what could someone learn about a user? Anything that fails that test gets cut, hashed, or sampled before it's written.",
        ],
        diagram: {
          kind: "decision",
          root: {
            kind: "decision",
            question: "Log this field?",
            branches: [
              { label: "Not needed for debugging", node: { kind: "leaf", answer: "Don't log it", caption: "Minimisation first" } },
              { label: "Needed, identifies a person", node: { kind: "leaf", answer: "Hash or sample", caption: "Opaque id, not PII" } },
              { label: "Needed, not identifying", node: { kind: "leaf", answer: "Log it", caption: "Keep it low-cardinality" } },
            ],
          },
        },
        exercise: {
          id: "ex1",
          title: "Classify a log line",
          prompt:
            "A function should return 'leaky' if a log line contains an email ('@') or a long digit run (4+ digits in a row, like a card), and 'safe' otherwise. It currently never flags anything — fix it.",
          starterCode: `def classify(line: str) -> str:
    """Return 'leaky' if the line contains an email ('@') or a long digit run
    (4+ digits in a row), otherwise 'safe'."""
    return "safe"   # <-- wrong: never flags anything
`,
          testCode: `
cases = [
    ("user=john@acme.com", "leaky"),
    ("prompt=card 4111 1111 1111 1111 here", "leaky"),
    ("model=gpt-4o prompt_version=v17", "safe"),
    ("answer=please contact support", "safe"),
]
ok = True
message = "ok"
for line, expected in cases:
    got = classify(line)
    if got != expected:
        ok = False
        message = f"classify({line!r}) -> {got!r}, expected {expected!r}"
        break
`,
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Your support assistant logs every turn, and legal asks what would be exposed if the log table leaked tomorrow. Which logged field already fails that 'breach' test?",
            choices: [
              { id: "a", label: "user=jane.doe@acme.com" },
              { id: "b", label: "model=gpt-4o prompt_version=v17" },
              { id: "c", label: "tokens_in=1840 tokens_out=210" },
              { id: "d", label: "tool=refund status=ok" },
            ],
            answer: "a",
            explanation:
              "The email is PII — it identifies a person and is near-unique per request. Version tags and token counts explain behaviour without identifying anyone. The fix is a hashed or opaque id.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A health-tech RAG team wants raw prompt text in logs 'for debugging' and proposes base64-encoding it to 'anonymise' it. What is the correct call?",
            choices: [
              { id: "a", label: "Base64 is fine — encoding counts as anonymisation" },
              { id: "b", label: "Log raw prompts only in production, never in staging" },
              { id: "c", label: "Log token counts and a prompt version id instead of the raw text" },
              { id: "d", label: "Keep the prompts but shorten retention to one quarter" },
            ],
            answer: "c",
            explanation:
              "Encoding is reversible, so patient questions leak just the same. Minimisation replaces raw text with a version id and counts. Retention tweaks don't undo exposure.",
          },
        ],
      },
      {
        slug: "latency-cost-broken-down",
        title: "Latency and cost, broken down",
        blurb: "Time-to-first-token vs total time; tokens by stage.",
        topic: "performance-and-slos",
        skillIds: ["llm-cost-latency"],
        capability: "Split latency into TTFT vs total, and cost into tokens by stage.",
        minutes: 8,
        concept: {
          anchor: "Splitting the wait is timing a pizza order — the pause before the first slice versus the whole pie.",
          what: "LLM latency has two faces: **time-to-first-token** (prefill + retrieval) and **total time** (adds decode). Cost follows **tokens by stage**, not milliseconds.",
          why: "Users feel TTFT as 'is it working?' and total time as 'is it done?' These are **separate problems with separate fixes**. The token breakdown shows whether **over-retrieval** or chatty outputs drive the bill.",
          where: [
            "Diagnosing a support bot that 'thinks forever' as a **TTFT** problem",
            "Cutting **input-token** cost by trimming retrieved context in a RAG pipeline",
            "Alerting on **p95/p99** where users actually abandon the assistant",
          ],
          whenNot:
            "Never guide decisions by the average — an average hides the slow tail. And a short answer on a huge prompt can cost more than a long one.",
        },
        prose: [
          "Relay's users complain it “thinks forever before replying” — a long blank pause, then a normal-speed answer. Latency for an LLM turn has two faces. **Time-to-first-token** `TTFT ≈ queue + prefill + blocking retrieval` is how long the user waits before anything appears. **Total time** `total = TTFT + decode` adds generation on top. Users feel TTFT as 'is it working?' and total time as 'is it done?' Relay's symptom is squarely a TTFT problem. That means prefill or blocking retrieval, not decode.",
          "Cost follows the **tokens**, not the milliseconds. **Input tokens** (the prompt and retrieved context) are priced differently from **output tokens** (the answer). The bill is arithmetic: `cost = tokens_in × price_in + tokens_out × price_out`. When a bill moves but answers don't, the growth is on the input side: over-retrieved context or a bloated prompt template. That is exactly how Relay's cost spike gets localized.",
          "**Percentiles** beat averages, and you can derive why. Turn latency varies with question length and load → the mean collapses that spread into one number → the users hurt most live in the slow tail → so report **p50, p95, and p99** separately. Relay's p50 of 980ms with a p99 of 3.4s means most users are fine and a few are quietly abandoned. Chasing the average hides exactly them.",
        ],
        diagram: {
          kind: "flow",
          steps: [
            { kind: "input", text: "One LLM turn" },
            { kind: "process", text: "Prefill + retrieval", caption: "Drives time-to-first-token" },
            { kind: "process", text: "Decode answer tokens", caption: "Adds the rest of total time" },
            { kind: "output", text: "TTFT, total, token cost", caption: "Report p50/p95/p99 separately" },
          ],
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "After a prompt change, users of your support assistant complain it 'thinks forever before replying' — a long blank pause, then a normal-speed answer. Which measurement do you check first?",
            choices: [
              { id: "a", label: "Output tokens per second, since generation is the bottleneck" },
              { id: "b", label: "The daily token bill" },
              { id: "c", label: "Time-to-first-token — prefill and blocking retrieval dominate the blank pause" },
              { id: "d", label: "The number of concurrent users on the site" },
            ],
            answer: "c",
            explanation:
              "A blank pause before anything appears is a TTFT symptom — prompt processing and blocking retrieval own it. Decode speed only matters after the first token lands.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Your RAG pipeline's monthly token bill doubled, but analytics show answers are the same length as last month. Where is the growth most likely coming from?",
            choices: [
              { id: "a", label: "Output tokens — the model got chattier" },
              { id: "b", label: "Input tokens — over-retrieval or a bloated prompt template inflating context" },
              { id: "c", label: "The vendor quietly raised output-token prices" },
              { id: "d", label: "Fewer requests, each billed at double rate" },
            ],
            answer: "b",
            explanation:
              "Cost tracks tokens by stage. With stable outputs, growth is on the input side — retrieved chunks and template bloat. Assuming 'longer answers cost more' misses that prompts often dominate the bill.",
          },
        ],
      },
      {
        slug: "ai-service-level-objective",
        title: "Define an AI service level objective",
        blurb: "Turn 'helpful and fast' into a number with an error budget.",
        topic: "performance-and-slos",
        skillIds: ["ai-slo", "llm-evaluation"],
        capability: "Turn a fuzzy quality goal into an SLI, a target, and an error budget.",
        minutes: 9,
        concept: {
          anchor: "An error budget is a monthly allowance for mistakes — spend it and you can ship; run out and you stop.",
          what: "An **SLO** makes a wish measurable. Pick an **SLI** (say, the share of answers passing evaluation). Set a **target** (99% over 28 days). The remainder is your **error budget**.",
          why: "The budget is a **decision tool**. While you have budget left, you can ship. When it's **burning fast**, you stop shipping and fix instead of arguing.",
          where: [
            "Turning 'helpful support bot' into '**eval pass rate ≥ 99%** over 28 days'",
            "Freezing releases when a quality SLO's budget burns down after a bad deploy",
            "Tuning the target between **user pain** (too loose) and **pager noise** (too tight)",
          ],
          whenNot:
            "No eval pipeline, no quality SLO. An SLI you can't measure can't have a target. Latency-only SLOs (targets on the wait time for a response) are the honest fallback until eval exists.",
        },
        prose: [
          "“Relay should be helpful and fast” isn't an objective. It's a wish. An **SLO** makes it measurable. Pick a **service-level indicator** (Relay's: the share of answers passing evaluation). Set a target of 99% over 28 days. Then derive the **error budget** — `budget = 1 − target` — the 1% of bad turns you've decided to tolerate. That is about 1 answer in 100, refreshed every 28 days.",
          "Derive the budget's power rung by rung. Some bad outcomes are unavoidable → tolerating them explicitly is a number, not a feeling → that number is **spendable**. While budget remains, you can ship risky changes. When it's burning fast, you stop shipping and fix. A **loose target** (90%) tolerates too much user pain. A **tight one** (99.9%, budget = 0.1% ≈ 1 turn in 1,000) burns on noise and pages on-call constantly. The right target is empirical — set by what users actually do.",
          "Crucially, the SLI for an AI feature is usually a **quality signal**, not just latency. You measure not only 'did it respond fast' but 'did it answer well'. That means your SLO depends on the **evaluation pipeline** feeding it. No eval, no quality SLO. Relay's next lesson builds exactly that pipeline.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Your support assistant's SLO is 'answers passing eval ≥ 99% over 28 days'. The morning after a release, the 28-day pass rate has slid to 98.2%. The budget is burning fast. What does the SLO framework tell the team to do?",
            choices: [
              { id: "a", label: "Raise the target to 99.5% so the number looks achievable again" },
              { id: "b", label: "Switch the SLO to latency only, which is easier to hit" },
              { id: "c", label: "Freeze releases and roll back or fix — real users are burning the budget" },
              { id: "d", label: "Leave it — 98.2% is close enough to 99%" },
            ],
            answer: "c",
            explanation:
              "The budget is the decision tool. Fast burn means users are hitting bad outcomes now, so shipping stops until it's fixed. Raising or swapping the target hides the pain instead of fixing it.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A startup wants a quality SLO for its new doc-search assistant, but nothing scores whether answers are good — there is no evaluation pipeline. What is the honest move?",
            choices: [
              { id: "a", label: "Set the quality SLO anyway and estimate the pass rate by skimming a few chats" },
              { id: "b", label: "Set latency and cost SLOs now; add the quality SLO once an eval signal exists" },
              { id: "c", label: "Declare 'quality = 100%' since the model is brand new" },
              { id: "d", label: "Skip SLOs entirely until the product matures" },
            ],
            answer: "b",
            explanation:
              "An SLI you can't measure can't have a target. The quality SLO depends on the eval pipeline feeding it. Latency SLOs are still real. Abandoning SLOs altogether leaves nothing governed.",
          },
        ],
      },
      {
        slug: "quality-is-a-signal",
        title: "Quality is a production signal",
        blurb: "Offline golden sets and online sampling each catch what the other misses.",
        topic: "evaluation",
        skillIds: ["offline-evaluation", "online-evaluation"],
        capability: "Decide when to use offline vs online evaluation and unify the metric across both.",
        minutes: 8,
        concept: {
          anchor: "Offline and online evals are the practice kitchen and the dinner service — one gates the recipe, one watches the diners.",
          what: "**Offline evaluation** scores a candidate on a fixed **golden set** before it ships. **Online evaluation** samples and scores live traffic continuously. Both run under **one shared metric**.",
          why: "Offline is your repeatable **deploy gate** for known failure modes. Online is the only signal for **drift (the model slowly going stale on new data) and unknown unknowns**. A shared metric makes their disagreement meaningful.",
          where: [
            "Gating a **prompt v17 release** on the golden set in CI",
            "Sampling 1% of live **support traffic** to watch for slow decay",
            "Catching a **stale golden set** when offline and online scores diverge",
          ],
          whenNot:
            "Offline alone can't see new user behaviour. Online alone can't veto a release before users see it. The deploy/monitor split is the boundary.",
        },
        prose: [
          "Prompt v17 is ready to ship into Relay. Before it touches users, **offline evaluation** runs it against a fixed, labelled **golden set** — a few hundred curated Relay questions with expected behaviour. It's repeatable and fast. It catches the regressions you can predict: the known failure modes the team has seen before. It's your **deploy gate**. v17 scores 96% against v16's 94%, so it ships.",
          "Two weeks later, Relay's **online evaluation** — a 1% sample of live traffic scored continuously — slides from 91% to 79%. Pause and predict before reading on: the golden set said v17 was *better*. Online eval catches what offline can't: **drift**, surprising new prompts, and slow decay as the world changes. It's noisier, and it needs sampling and dedup to stay affordable. But it's the only signal for the **unknown unknowns** — and something in Relay's world has moved.",
          "The two only work together if they **share a metric**. Define 'quality' one way (the same rubric, the same judge) and compute it on the golden set before deploy and on sampled live traffic after. Disagreement between the two is itself a signal. Your golden set has **drifted from reality**, and that is exactly what Relay's slide reveals.",
        ],
        diagram: {
          kind: "compare",
          left: { title: "Offline eval", subtitle: "Fixed golden set, pre-ship" },
          right: { title: "Online eval", subtitle: "Sampled live traffic, continuous" },
          rows: [
            { label: "Role", left: "Deploy gate in CI", right: "Drift watch in production" },
            { label: "Catches", left: "Known failure modes", right: "New prompts, slow decay" },
            { label: "Watch out for", left: "Set drifts from reality", right: "Noise and eval cost" },
          ],
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Your prompt update scored 96% on the golden set, up from 94%, so you shipped it. Two weeks later, sampled live-traffic scores have slid from 91% to 79%. What is the most likely explanation?",
            choices: [
              { id: "a", label: "Online scores are always lower than offline — nothing changed" },
              { id: "b", label: "The golden set has drifted from reality: live traffic now contains prompt types the set doesn't cover" },
              { id: "c", label: "Sampling randomness moved the number; resample and it will return to 91%" },
              { id: "d", label: "The golden set got easier between releases" },
            ],
            answer: "b",
            explanation:
              "A stable gap between offline and online is expected. A widening one is signal. Offline only tests the cases it contains. So genuinely new user behaviour drags the live score down while offline stays high.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A teammate proposes dropping the golden set entirely and gating each release of your RAG search assistant on live production scores instead. What is the strongest objection?",
            choices: [
              { id: "a", label: "Golden sets are required by OpenTelemetry, so removing one breaks tracing" },
              { id: "b", label: "Live scores are always higher and would mask regressions" },
              { id: "c", label: "You can't gate a release on traffic it hasn't served yet — offline eval is the pre-ship gate" },
              { id: "d", label: "Online evaluation is free, so there is nothing to decide" },
            ],
            answer: "c",
            explanation:
              "Online eval measures what already shipped. It cannot veto a candidate before users see it. The deploy/monitor split is the point — offline gates, online watches.",
          },
        ],
      },
      {
        slug: "llm-as-a-judge",
        title: "LLM-as-a-judge",
        blurb: "A fast, cheap first pass — never the last word.",
        topic: "evaluation",
        skillIds: ["llm-judge", "eval-bias"],
        capability: "Use an LLM judge and know when to calibrate it against humans.",
        minutes: 9,
        concept: {
          anchor: "An LLM judge is a substitute teacher with strong opinions — useful at scale, but check their grading against the real teacher now and then.",
          what: "An **LLM judge** is one model grading another's outputs — **single scoring**, **pairwise comparison**, or listwise ranking — making large-scale evaluation affordable.",
          why: "It scales evaluation **past what humans can hand-label**. That is what makes large offline and online eval pipelines economically possible at all.",
          where: [
            "Scoring thousands of sampled **support answers** every night",
            "Running **pairwise comparison** of candidate vs incumbent prompt releases",
            "Cheap **first-pass triage** of low-rated conversations for human review",
          ],
          whenNot:
            "An uncalibrated judge is not ground truth. It carries **verbosity, self-preference, and position biases**. Without human calibration, its scores are uninterpretable.",
        },
        prose: [
          "Who scores Relay's thousands of sampled answers every night? Not humans, mostly. An **LLM judge** uses one model to grade another's outputs: **single scoring**, **pairwise comparison**, or listwise ranking. It scales evaluation far past what humans can hand-label. That is what makes Relay's offline and online eval pipelines affordable at all.",
          "But a judge brings its own **biases**. It confuses verbosity for quality, prefers its own style (**self-preference**), and in pairwise comparisons is swayed by which answer came first (**position bias**). It can score fluency well while missing facts entirely. A polished lie beats a plain truth if you let it.",
          "The discipline is **calibration**. Start from human labels. Measure how often the judge agrees. Mitigate the big biases (swap answer order in pairs, control for length). Treat the judge's score as a **cheap first pass** to be spot-checked, not a ground truth. Where judge and human disagree systematically is exactly where your rubric needs work.",
        ],
        exercise: {
          id: "ex2",
          title: "Fix the rubric",
          prompt:
            "A rubric should pass an answer only if it is correct AND at least somewhat fluent (fluency >= 3). Right now a fluent lie still passes, because correctness is ignored. Fix the rule.",
          starterCode: `def passes(correct: bool, fluency: int) -> bool:
    """Pass only if the answer is correct AND fluency >= 3."""
    return fluency >= 3   # <-- wrong: a fluent lie passes
`,
          testCode: `
cases = [
    (True, 5, True),
    (False, 5, False),
    (True, 2, False),
    (False, 2, False),
    (True, 3, True),
]
ok = True
message = "ok"
for correct, fluency, expected in cases:
    got = passes(correct, fluency)
    if got != expected:
        ok = False
        message = f"passes({correct}, {fluency}) -> {got}, expected {expected}"
        break
`,
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Your judge model reviews support answers in pairs and reliably picks the longer one, even when the shorter answer is more accurate. It also favours whichever answer is shown first. What are these biases, and what is the standard mitigation?",
            choices: [
              { id: "a", label: "Self-preference and drift — retrain the judge on fresh data" },
              { id: "b", label: "Sampling error — score more pairs and the bias averages out" },
              { id: "c", label: "Verbosity bias and position bias — control for length and swap answer order before averaging" },
              { id: "d", label: "Position bias and hallucination — lower the judge's temperature" },
            ],
            answer: "c",
            explanation:
              "Preferring length is verbosity bias. Favouring the first slot is position bias. Length control and order-swapping are the standard fixes. More volume never averages away a systematic bias.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "At a legal-tech startup, the judge gives a polished but factually wrong contract summary 9/10 while human reviewers consistently rate it 2/10. What does the discipline of calibration say to do?",
            choices: [
              { id: "a", label: "Trust the judge — humans rate legal text too harshly" },
              { id: "b", label: "Measure judge-human agreement on labelled samples, then fix the rubric where they systematically disagree" },
              { id: "c", label: "Swap to a smaller judge model and hope it becomes stricter" },
              { id: "d", label: "Drop the fluency dimension and score answer length only" },
            ],
            answer: "b",
            explanation:
              "Systematic judge-human disagreement is exactly where the rubric needs work. Here the judge confuses fluency with correctness. Calibration locates the failure. Trusting or resizing the judge leaves the bias in place.",
          },
        ],
      },
      {
        slug: "observe-rag-not-just-model",
        title: "Observe RAG, not only the model",
        blurb: "Faithfulness and context quality — the retrieval layer's metrics.",
        topic: "evaluation",
        skillIds: ["rag-evaluation"],
        capability: "Measure RAG quality with faithfulness and context metrics, not just fluency.",
        minutes: 8,
        concept: {
          anchor: "RAG quality is a kitchen inspection — check both the pantry (what was retrieved) and the cook (what the model did with it).",
          what: "RAG fails in **two layers** — retrieval (wrong or buried chunks) and generation (ungrounded answers). **Faithfulness** and **context precision/recall** tell you which layer broke.",
          why: "Fluency hides **retrieval rot**: a confident answer on bad context looks fine to answer-relevancy alone. Layer metrics point at the **right fix** instead of the model.",
          where: [
            "Diagnosing a support bot that answers fluently but **cites nothing in the retrieved docs**",
            "Deciding whether to fix the **retriever ranker** or the generation prompt",
            "Catching **buried or empty retrieval** before users report wrong answers",
          ],
          whenNot:
            "Answer relevancy alone can't do this. It measures the answer, not the grounding (tying answers to real source documents). A model can be relevant and wrong.",
        },
        prose: [
          "Relay answers from retrieved policy pages. This week it starts citing refund rules that don't exist — fluently. RAG systems fail in two places, and only one is the model. The **retrieval layer** can return irrelevant chunks, bury the good one, or come back empty. The model will still produce a fluent, confident answer on top of bad context. **Fluency** hides **retrieval rot**.",
          "The metrics that expose this are retrieval-aware. **Faithfulness** asks whether every claim in the answer is supported by the retrieved context. **Context precision** asks whether the relevant chunks were ranked highly rather than buried. **Context recall** asks whether the needed information was retrieved at all. Answer relevancy, alone, is the one that can look fine while the others collapse.",
          "When a RAG answer is bad, the instinct is to blame the model. The metrics tell you where. Low context precision means fix the **retriever ranking**. Low faithfulness with good context means fix the **generation** (or the prompt). Empty retrieval is an **index problem**. Diagnose the layer before you touch the model. Relay's case-file entry reads: faithfulness dropped hard while precision and recall held. Good pages were in the window, and unsupported claims still came out. Generation, not retrieval.",
        ],
        diagram: {
          kind: "decision",
          root: {
            kind: "decision",
            question: "Bad RAG answer — what broke?",
            branches: [
              { label: "Retrieval came back empty", node: { kind: "leaf", answer: "Index problem", caption: "Needed info never fetched" } },
              {
                label: "Chunks came back",
                node: {
                  kind: "decision",
                  question: "Was the relevant chunk ranked high?",
                  branches: [
                    { label: "No — buried under junk", node: { kind: "leaf", answer: "Fix retriever ranking", caption: "Low context precision" } },
                    { label: "Yes — answer still strays", node: { kind: "leaf", answer: "Fix generation or prompt", caption: "Low faithfulness, good context" } },
                  ],
                },
              },
            ],
          },
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Your support assistant started citing refund policies that don't exist. Faithfulness scores dropped hard this week, but context precision and recall are healthy — the right chunks are retrieved and ranked well. Where do you fix?",
            choices: [
              { id: "a", label: "Retrieval ranking — push the irrelevant chunks further down" },
              { id: "b", label: "The vector index — rebuild it from scratch" },
              { id: "c", label: "Generation — the model adds unsupported claims despite good context; tighten the prompt or model config" },
              { id: "d", label: "The front-end — strip unsupported sentences before display" },
            ],
            answer: "c",
            explanation:
              "Good context plus low faithfulness means the model strayed from its grounding — a generation/prompt problem. Blaming retrieval here wastes days on the layer the metrics just cleared.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A hospital's doc-search bot returns confident, on-topic answers, and its dashboard shows healthy answer relevancy. Clinicians complain the answers don't match the handbook. Which signal was missing from the dashboard?",
            choices: [
              { id: "a", label: "Faithfulness — whether each claim is supported by the retrieved context" },
              { id: "b", label: "Answer relevancy, computed on a bigger sample" },
              { id: "c", label: "Average response latency" },
              { id: "d", label: "Token cost per query" },
            ],
            answer: "a",
            explanation:
              "Relevancy measures topic fit, not grounding — a model can be relevant and wrong. Only faithfulness and context metrics test whether claims trace to the retrieved text.",
          },
        ],
      },
      {
        slug: "prompt-model-tool-regressions",
        title: "Prompt, model, and tool regressions",
        blurb: "Bisect the one variable that changed — don't blame the model first.",
        topic: "incidents",
        skillIds: ["eval-gates"],
        capability: "Bisect the changed variable instead of blaming the model by default.",
        minutes: 8,
        concept: {
          anchor: "Regression hunting is a line-up of what changed — tag every part with a version number and the suspect steps forward.",
          what: "Only **versioned things can regress**. Tag spans with **prompt, model, retrieval, and tool versions**, and a quality drop becomes a **diff between releases**.",
          why: "The model is usually the thing you **didn't change**. The culprit is a prompt tweak, ranker change, or tool update. The version diff hands you the suspect.",
          where: [
            "Bisecting 'quality dropped Tuesday' down to **prompt v17** in a support assistant",
            "**Canary releases** — 5% of traffic, watch the eval, promote only if it holds",
            "**Eval gates in CI** — a candidate must beat or match the incumbent on the golden set",
          ],
          whenNot:
            "A variable that isn't version-tagged can't be bisected. Regressions follow changes, and the unchanged model is rarely the culprit.",
        },
        prose: [
          "Monday morning, Relay's eval pass rate drops 6 points. The channel fills with “the model got worse over the weekend.” Derive the discipline rung by rung. Behaviour only changes when an input to it changes → regressions follow **changes** → only **versioned things can regress** → tag every span with prompt version, model, retrieval version, and tool version. Now a quality drop becomes a **diff problem**: what changed between Relay's last healthy release and this one?",
          "Relay's span attributes answer the Monday question in minutes. The model is unchanged, but prompt went v16 → v17 and retrieval r3 → r4 on Friday. The instinct to blame the model first is almost always wrong. The model is usually the thing you **didn't change**. The culprit is a prompt tweak, a retriever ranking change, a tool that now returns differently, or a quiet dependency update. A **canary release** makes this visible before the fact: ship to 5% of traffic, watch the eval, promote only if it holds.",
          "The discipline is to hold every other variable constant and **change one**. **Eval gates** in CI encode this: a candidate release must beat or match the incumbent on the golden set before it ships. When it doesn't, the diff between releases is your **suspect list**, already narrowed to a single variable.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Monday morning, your support assistant's eval pass rate drops 6 points. The team's first instinct is 'the model got worse over the weekend.' You check span attributes: model unchanged, but prompt went v16 to v17 and retrieval r3 to r4 on Friday. What actually happened?",
            choices: [
              { id: "a", label: "The model degraded spontaneously — open a vendor ticket" },
              { id: "b", label: "The eval dashboard broke when the attributes changed" },
              { id: "c", label: "Users started asking harder questions over the weekend" },
              { id: "d", label: "One of the changed variables — prompt v17 or retrieval r4 — is the suspect; diff those releases" },
            ],
            answer: "d",
            explanation:
              "Regressions follow changes. The unchanged model is the least likely culprit; the versioned diff turns a mystery into a two-item suspect list.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A different team's assistant regresses overnight, and their span check finds nothing changed — model, prompt, and retrieval versions all identical. The eval runs on a fixed golden set. Re-derive the ladder: if regressions follow changes, what actually happened?",
            choices: [
              { id: "a", label: "An unversioned input changed — an upstream dependency, a config flag, or a data source that isn't tagged; the hunt is for the untracked variable" },
              { id: "b", label: "Nothing changed and nothing needs to — models occasionally degrade on their own" },
              { id: "c", label: "The version tags are lying — the diff tool is comparing the wrong weeks" },
              { id: "d", label: "Weekend users ask harder questions, so the same system scores lower" },
            ],
            answer: "a",
            explanation:
              "The ladder forces the conclusion. Behaviour changed → some input changed → if no tagged input changed, the change lives in an untagged one — a dependency, a flag, a data refresh. (The fixed golden set rules out traffic-mix shifts.) That's also the argument for versioning more of the pipeline, not for blaming the model.",
          },
        ],
      },
      {
        slug: "alerts-people-trust",
        title: "Alerts people trust",
        blurb: "Burn-rate over static lines, with a runbook attached.",
        topic: "incidents",
        skillIds: ["alerting"],
        capability: "Choose burn-rate alerting over static thresholds and attach a runbook.",
        minutes: 8,
        concept: {
          anchor: "A burn-rate alert is a smoke detector that ignores burnt toast — it only sounds when the fire is real.",
          what: "A **burn-rate alert** pages on **sustained error-budget burn** across time windows, not momentary spikes. Every alert carries a **runbook**.",
          why: "On-call only trusts alerts that fire on **real user impact**. Static thresholds page on every blip until engineers mute them. Then the real incident slips past unseen.",
          where: [
            "Paging when a support bot's quality SLO **burns its budget** within minutes",
            "Staying quiet through a 3am **low-traffic rate spike** that burns nothing",
            "Attaching the **first three steps** to every page so diagnosis starts instantly",
          ],
          whenNot:
            "Don't page on single bad requests or momentary spikes — and an alert without a runbook is noise with a siren.",
        },
        prose: [
          "Relay's on-call has muted the error-rate alert. It fired at 3am when 4 of 20 overnight requests failed — thin traffic, a rate spike, nothing real. After eleven pages, ten of them false, nobody trusts it. That's the failure mode of a **static threshold**: page whenever a metric crosses a line. It fires on every blip, especially under low traffic, when a few bad requests spike the rate. After a dozen false pages, engineers **mute** it. Then the real incident slips through.",
          "**Burn-rate alerting** pages on sustained user impact, not momentary spikes. The arithmetic: `burn rate = error share ÷ budget share`. With Relay's 99% target, the budget is 1%. A steady 4% error rate burns at 4× and exhausts a 28-day budget in about 7 days. Short and long windows watch that rate together. A 3am blip on thin traffic doesn't burn enough to page. A steady degradation trips the long-window check within minutes of real impact. It trades a little detection latency for a lot of precision — and Relay's on-call un-mutes the channel.",
          "Every alert needs a **runbook** — the **first three steps** on-call takes when it fires. An alert without a runbook is noise with a siren. An alert with one is a decision already half-made. Route by severity, deduplicate, and make the path from page to diagnosis obvious.",
        ],
        diagram: {
          kind: "compare",
          left: { title: "Static threshold", subtitle: "Page when a metric crosses a line" },
          right: { title: "Burn-rate alert", subtitle: "Page on sustained budget burn" },
          rows: [
            { label: "3am traffic dip", left: "Fires on a few bad requests", right: "Stays quiet — nothing burned" },
            { label: "Real degradation", left: "May already be muted by on-call", right: "Pages within minutes of impact" },
            { label: "On-call trust", left: "Erodes after false pages", right: "Holds — pages mean impact" },
          ],
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Your error-rate alert fired at 3am because 4 of 20 overnight requests failed — traffic is always thin then. It has fired 11 times this month and 10 were false. The team keeps muting it. What is the root problem and the fix?",
            choices: [
              { id: "a", label: "On-call is too sensitive — rotate the paging shift more often" },
              { id: "b", label: "The SLO target is too tight — lower it to 90% so the alert stops firing" },
              { id: "c", label: "A static threshold on a volatile low-traffic rate — replace it with burn-rate alerting on the error budget" },
              { id: "d", label: "Nothing — failures simply shouldn't happen at 3am" },
            ],
            answer: "c",
            explanation:
              "Rates are statistically volatile at low volume, so a line-crossing alert fires on noise. Burn-rate pages only on sustained budget burn — real impact — and that is what restores trust. Loosening the target just hides the pain.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "You join a fintech chatbot team whose only alert is 'quality score < 90' with no documentation. When it fired at 2am, the on-call engineer spent 20 minutes just figuring out what the metric was. What is missing?",
            choices: [
              { id: "a", label: "A louder pager so the alert can't be missed" },
              { id: "b", label: "More alerts — one per model — so coverage feels complete" },
              { id: "c", label: "A bigger model so quality never drops in the first place" },
              { id: "d", label: "A runbook — the first three diagnostic steps attached to the alert" },
            ],
            answer: "d",
            explanation:
              "An alert without a runbook is noise with a siren. The page says 'something's wrong' but not 'do this next'. The first three steps turn a page into a decision already half-made.",
          },
        ],
      },
      {
        slug: "triage-an-incident",
        title: "Triage a real-looking incident",
        blurb: "Alert → dashboard → cohort → trace → fix, one hypothesis per step.",
        topic: "incidents",
        skillIds: ["ai-incident-response"],
        capability: "Drill from alert to fix, testing one hypothesis at each step.",
        minutes: 9,
        concept: {
          anchor: "Incident triage is finding a leak in the house — start at the wet ceiling, then narrow to the burst pipe, then fix it.",
          what: "Triage is a **drill-down**, not a leap: alert (**what's burning**) → dashboard (**where**) → cohort (**what's shared**) → trace (**the mechanism**) → fix.",
          why: "Each step **narrows the blast radius and rules out causes**. You act on evidence — one hypothesis per step — instead of blaming the model.",
          where: [
            "Finding every bad turn shares **tool = billing v2.2** in a support incident",
            "Confirming a **retriever-timeout** mechanism by opening one representative trace",
            "Closing incidents with a **regression test** so the same change can't rebreak production",
          ],
          whenNot:
            "An incident isn't closed when the metric recovers. It's closed when the regression test preventing recurrence is merged.",
        },
        prose: [
          "Triage is a **drill-down**, not a leap. Start at the alert: what's burning — latency (the wait time for a response), quality, cost, safety? Then the dashboard: where is it burning — which region, client, cohort? Each step narrows the **blast radius** and rules out causes.",
          "Relay's quality alert fires for real this time. The dashboard narrows the burn to one cohort: EU mobile users asking refund questions. Slice that cohort for what's shared. If every bad turn carries the same tool version or prompt version, you've found your **one changed variable**. Open a representative trace to confirm the mechanism — a tool timing out, a retriever returning junk. Now you have a **hypothesis** backed by evidence.",
          "Act, then confirm. Roll back or patch the single variable, and watch the signal recover. The last step, often skipped, is writing the **regression test** so this exact failure can't ship again. An incident isn't closed when it's fixed; it's closed when it **can't recur**.",
        ],
        diagram: {
          kind: "flow",
          steps: [
            { kind: "input", text: "Alert fires", caption: "What's burning?" },
            { kind: "process", text: "Dashboard: slice by cohort", caption: "Where is it burning?" },
            { kind: "process", text: "Cohort: find shared attribute", caption: "The one changed variable" },
            { kind: "process", text: "Trace: confirm mechanism", caption: "One representative request" },
            { kind: "output", text: "Fix + regression test", caption: "Closed when it can't recur" },
          ],
          loop: "If the signal doesn't recover, form the next hypothesis",
        },
        exercise: {
          id: "ex3",
          title: "Find the changed variable",
          prompt:
            "Given the before and after attribute sets for a release, return the name of the first key whose value changed. Right now it always blames the model — fix it.",
          starterCode: `def changed_var(before: dict, after: dict) -> str:
    """Return the name of the first key whose value differs between before and
    after. Return '' if nothing changed."""
    return "model"   # <-- wrong: always blames the model
`,
          testCode: `
cases = [
    ({"model": "gpt-4o", "prompt": "v16"}, {"model": "gpt-4o", "prompt": "v17"}, "prompt"),
    ({"model": "gpt-4o", "prompt": "v16"}, {"model": "gpt-4o-mini", "prompt": "v16"}, "model"),
    ({"model": "gpt-4o", "prompt": "v16"}, {"model": "gpt-4o", "prompt": "v16"}, ""),
]
ok = True
message = "ok"
for before, after, expected in cases:
    got = changed_var(before, after)
    if got != expected:
        ok = False
        message = f"changed_var({before}, {after}) -> {got!r}, expected {expected!r}"
        break
`,
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A burn-rate alert fires on your support assistant's quality SLO. The dashboard shows the drop concentrated in EU mobile users asking refund questions. What has this step established, and what comes next?",
            choices: [
              { id: "a", label: "The root cause — immediately roll back the model" },
              { id: "b", label: "The blast radius — next, slice that cohort for a shared attribute like prompt or tool version, then open a trace" },
              { id: "c", label: "Nothing — dashboards are for executives, not incidents" },
              { id: "d", label: "The fix — refunds should be handled by human agents" },
            ],
            answer: "b",
            explanation:
              "The dashboard narrows where the incident lives — that's blast radius, not root cause. The next narrowing step is the cohort's shared attribute, and a trace confirms the mechanism before you act.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "During a retro at a healthcare-bot company, the team notes that quality recovered 40 minutes after their rollback, so they closed the ticket. Two months later the same change shipped again and broke production identically. What was skipped?",
            choices: [
              { id: "a", label: "Paging the executive team during the first incident" },
              { id: "b", label: "Rolling back fast enough the first time" },
              { id: "c", label: "Writing the regression test that would have failed the second release in CI" },
              { id: "d", label: "Setting a latency SLO alongside the quality one" },
            ],
            answer: "c",
            explanation:
              "Recovery ends the outage. The regression test ends the incident class. Without it, nothing stops the same change from reintroducing the failure. The incident was never truly closed.",
          },
        ],
      },
      {
        slug: "operator-dashboard",
        title: "Build the operator dashboard",
        blurb: "The exec view answers 'are we healthy'; the on-call view answers 'what's broken'.",
        topic: "operate",
        skillIds: ["observability-dashboards"],
        capability: "Separate the executive dashboard from the on-call diagnostic dashboard.",
        minutes: 7,
        concept: {
          anchor: "The two dashboards are a fuel gauge and a mechanic's lift — one gives the glance, one gets you under the car.",
          what: "Two dashboards, two questions. The **exec view** answers '**are we healthy?**' with a few big calm numbers. The **on-call view** answers '**what's broken, where?**' with drill-downs.",
          why: "One view can't serve both. **Drill-downs overwhelm the exec glance**, and three big numbers are **useless at 3am**. Share the data, split the altitude.",
          where: [
            "A weekly exec view of **quality, cost, incidents** for leadership",
            "An on-call view linking a **red p95 tile** to the traces behind it",
            "**Quality-by-cohort** drill-downs during an incident",
          ],
          whenNot:
            "An exec view with drill-downs gets ignored. An on-call view of three numbers has nothing to debug. Don't force one dashboard on both audiences.",
        },
        prose: [
          "An **executive dashboard** answers one question — 'are we healthy?' — with a few **big, calm numbers**: quality, cost, incidents. It should be readable at a glance, and it should hide the detail. An exec reading it wants a status, not a diagnosis.",
          "An **on-call dashboard** answers the opposite question — 'what's broken, where, since when?' It's **drill-down-rich**: latency by route (the wait time for a response), quality by cohort, error-budget burn, and a path from a red tile to the traces behind it. Density is the point. A calm on-call dashboard is one that has nothing to debug.",
          "The mistake is forcing one view to serve both. Relay's VP asked for “one dashboard everyone can use,” and this is why it fails. An exec-facing dashboard with drill-downs gets ignored. An on-call dashboard with three big numbers is useless at 3am. Build both, **share the underlying data**, and let each audience see Relay at its **own altitude**.",
        ],
        diagram: {
          kind: "compare",
          left: { title: "Executive view", subtitle: "Are we healthy?" },
          right: { title: "On-call view", subtitle: "What's broken, where, since when?" },
          rows: [
            { label: "Shows", left: "Few big calm numbers", right: "Dense drill-down tiles" },
            { label: "Read by", left: "Leadership, weekly", right: "On-call, at 3am" },
            { label: "Path to traces", left: "None — status only", right: "Red tile → cohort → trace" },
          ],
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Your VP asks for 'one dashboard everyone can use' for the support assistant — leadership wants status, on-call engineers want latency by route and cohort drill-downs. You build the combined view. What happens, predictably?",
            choices: [
              { id: "a", label: "Everyone is satisfied because it holds all the information" },
              { id: "b", label: "Execs drown in detail and ignore it while on-call still can't debug fast — split it into two views over the same data" },
              { id: "c", label: "On-call starts using it successfully for executive reporting" },
              { id: "d", label: "Nothing — dashboards work identically for every audience" },
            ],
            answer: "b",
            explanation:
              "The two audiences read at different altitudes. Detail wrecks the exec glance, and a compromise view is too thin for 3am debugging. Two views sharing the same underlying data serve each cleanly.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "At 3am an on-call engineer sees the quality tile go red and needs to find the affected cohort and a sample trace in under a minute. What must the dashboard provide for that to be possible?",
            choices: [
              { id: "a", label: "A larger font so the number is readable without glasses" },
              { id: "b", label: "Only 28-day averages, to keep the view calm" },
              { id: "c", label: "A drill-down path: red tile → quality by cohort → the traces behind those turns" },
              { id: "d", label: "An email form for contacting the VP" },
            ],
            answer: "c",
            explanation:
              "On-call debugs from the dashboard — the path from red tile to cohort to traces is the feature. Averages and presentation polish don't locate the failing cohort.",
          },
        ],
      },
      {
        slug: "capstone-rescue-assistant",
        title: "Capstone: rescue the support assistant",
        blurb: "Turn a vague hunch into a measured, diagnosable system.",
        topic: "operate",
        skillIds: ["ai-observability", "ai-incident-response"],
        capability: "Assemble signals, an SLO, and a runbook into a working diagnosis.",
        minutes: 10,
        concept: {
          anchor: "Rescuing the assistant is debugging a car by gauge, not by guess — check the dials, isolate the part, prove the fix.",
          what: "The capstone assembles the course: **instrument** (traces carrying prompt/model/retrieval/tool versions), **evaluate** (faithfulness, context precision, p95), and **govern** (one quality SLO, burn-rate alert, runbook).",
          why: "It converts a hunch — 'the assistant got slow and unhelpful after v17' — into a **diff that names the root cause**. That replaces a meeting-long argument.",
          where: [
            "Rescuing a support assistant where **release v17 changed the retriever ranker**",
            "Naming the causal chain **context precision → faithfulness** behind bad answers",
            "Standing up the **SLO + alert + runbook** so the next incident starts half-solved",
          ],
          whenNot:
            "The recipe collapses without instrumentation. You can't diff releases you never versioned. Measurement is the prerequisite for rescue.",
        },
        prose: [
          "The capstone assembles Relay's whole case file. The assistant is slow and unhelpful after release v17. The incident channel is 30 people arguing, and nobody can say why. That is a **hunch** with no evidence. The work of this lesson is to convert that hunch into a measured, diagnosable system that names a **root cause**.",
          "The recipe is everything Relay's case file has accumulated. Traces carry prompt, model, retrieval, and tool versions (lessons 1–2). The **three signals** are faithfulness, p95 latency, and context precision (lessons 4, 6, 8). Add **one quality SLO** with an error budget, plus a **burn-rate alert** with a runbook (lessons 5, 10). With those in place, the incident stops being a mystery. It becomes a diff: release v17 changed the retriever ranker, context precision dropped, faithfulness followed. That is the causal chain, named.",
          "That's the whole skill: instrument for where, evaluate for what, and set an SLO with a runbook for when. A feature you can **measure** is a feature you can **rescue**. One you can't is a feature you can only argue about.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Your support assistant turned slow and unhelpful after release v17, and the incident channel is 30 people arguing about causes. You apply the capstone recipe. Which finding turns the argument into a diagnosis?",
            choices: [
              { id: "a", label: "The model vendor published a new model version the same week" },
              { id: "b", label: "Traces show v17 changed the retriever ranker; context precision dropped and dragged faithfulness down — the model is blameless" },
              { id: "c", label: "Users rated the assistant lower on the quarterly survey" },
              { id: "d", label: "Cost per query rose slightly" },
            ],
            answer: "b",
            explanation:
              "Versioned traces make the incident a diff: one changed variable, one collapsed metric chain. Surveys and cost shifts are signals, but they don't attribute the failure to a release.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A growth team launches a shopping-copilot MVP with no tracing, no eval, and one latency alert. It starts giving confidently wrong answers and leadership wants it fixed this week. What has to come first?",
            choices: [
              { id: "a", label: "Swap to a bigger model immediately" },
              { id: "b", label: "Add more front-end logging of button clicks" },
              { id: "c", label: "Wait for enough user complaints to form a pattern" },
              { id: "d", label: "Instrument requests with version attributes and stand up a faithfulness signal — you can't fix what you can't attribute" },
            ],
            answer: "d",
            explanation:
              "The capstone lesson: instrument for where, evaluate for what. Without versioned traces and a quality signal, every fix is a guess. A model swap might even 'work' while masking the real retrieval problem.",
          },
        ],
      },
    ],
};

export default course;
