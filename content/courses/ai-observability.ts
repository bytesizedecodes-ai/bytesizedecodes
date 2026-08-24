import type { Course } from "../types";

const course: Course = {
    slug: "ai-observability",
    title: "AI Observability",
    subtitle: "How to keep an eye on AI so it doesn’t quietly go wrong.",
    description:
      "A picture-led introduction to watching AI systems in the real world. You'll meet the three pillars — logs, metrics, and traces — learn to spot quiet failures like hallucination and drift, and see how teams use dashboards and alerts to catch problems before users do. No coding required.",
    level: "beginner",
    domain: "AI Observability",
    access: "free",
    lessons: [
      {
        slug: "what-is-observability",
        title: "What is observability?",
        blurb: "Seeing inside a system without opening it up.",
        topic: "observability-foundations",
        skillIds: ["ai-observability"],
        capability: "Explain what observability means and why even a working system needs it.",
        minutes: 5,
        concept: {
          anchor: "You can't open the engine while driving, but the dashboard gauges tell you how it's doing inside.",
          what: "**Observability** means telling what’s happening **inside** a system just by reading **signals on the outside** — no opening it up.",
          why: "It turns a hidden engine into a dashboarded one: you see **how it’s really doing underneath**, not just how confident it looks.",
          where: [
            "A **car dashboard** — speed, fuel, engine warnings without lifting the bonnet",
            "An **AI answer service** — readings behind every confident answer",
            "A **delivery app** — where your package actually is, not where it should be",
          ],
          whenNot:
            "It can’t tell you what to *fix* — observability **reveals state**, it doesn’t repair it. And it’s overkill for a system too small to fail quietly.",
        },
        prose: [
          "It’s your first month looking after a company chatbot. Every answer arrives calm, polite, and confident — and one day you wonder: if something inside it started going wrong, how would I even know?",
          "You already know the answer from driving. You can’t open the engine at 100 km/h, but the **dashboard gauges** tell you the speed, the fuel, and whether something is wrong — the inside, read from signals on the outside.",
          "That is **observability**: giving an AI its own dashboard — little readings that show **how it’s really doing underneath**, not just how confident it sounds. Where the analogy breaks: a gauge can tell you the engine is struggling, but it can’t repair it — and with an AI, looking fine and being fine are two different things, which is exactly why the readings matter.",
        ],
        diagram: {
          kind: "flow",
          steps: [
            { kind: "input", text: "Signals on the outside", caption: "gauges, readings, measurements" },
            { kind: "process", text: "Read them", caption: "without opening anything up" },
            { kind: "output", text: "The inside state", caption: "healthy — or quietly not" },
          ],
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "You’re driving to the airport and the car feels completely normal. What’s the most reliable way to know the engine is actually healthy before a 300 km drive?",
            choices: [
              { id: "a", label: "Trust how it feels — feel is data" },
              { id: "b", label: "Glance at the dashboard gauges before setting off" },
              { id: "c", label: "Wait for the engine to break down and then decide" },
            ],
            answer: "b",
            explanation:
              "Feelings miss slow problems and breakdowns are too late. Gauges reveal the engine’s hidden state — exactly what observability gives you for an AI.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Your company’s chatbot gives an answer that looks perfectly fine to users. With observability in place, what can the team do that they couldn’t before?",
            choices: [
              { id: "a", label: "Read the readings behind the answer to check whether it’s actually fine underneath" },
              { id: "b", label: "Ask the chatbot to rate its own answer — it sounds confident, so it must know" },
              { id: "c", label: "Nothing — an answer that looks fine to users is fine" },
            ],
            answer: "a",
            explanation:
              "Looking fine isn’t being fine, and a confident system can’t audit itself. Observability reveals the hidden state — wait time, cost, whether the facts check out — behind a confident-looking answer. It isn’t about trusting the surface.",
          },
        ],
      },
      {
        slug: "why-ai-is-different",
        title: "Why is AI different from normal software?",
        blurb: "A vending machine always behaves the same. An AI doesn’t.",
        topic: "observability-foundations",
        skillIds: ["ai-observability"],
        capability: "Explain why AI is non-deterministic and why that changes how we monitor it.",
        minutes: 5,
        concept: {
          anchor: "Press the same vending-machine button, get the same can; order the same dish twice and the chef varies it.",
          what: "AI is **non-deterministic**: the same input can produce **different outputs** on different runs — like a chef, not a vending machine.",
          why: "It breaks test-once-trust-forever monitoring: one good answer **doesn’t promise the next**, so each run needs watching.",
          where: [
            "A **chatbot** answering the same question differently across days",
            "**Image generators** producing a new picture every click",
            "A **vending machine** — the contrast case: same button, same can, forever",
          ],
          whenNot:
            "Not the whole story for **deterministic** pipelines around the AI — caches, routers, and validators behave like ordinary software and can be tested once.",
        },
        prose: [
          "Normal software is like a **vending machine**. Press the same button, get the same thing, every single time. Test it once on Monday and you can trust it on Friday.",
          "AI is more like a **chef**. Order the same dish twice and you’ll get two slightly different meals — both perfectly fine, but never identical. One good meal doesn’t promise the next, so the kitchen keeps **tasting as dishes come out**.",
          "That’s the monitoring shift: vending machines get certified once; chefs get watched continuously. Where the analogy breaks: a chef varies with mood and improves with practice, but an AI varies **by design** — it stays exactly as good as it was trained to be until someone deliberately teaches it again. So with AI you **keep watching how each answer turns out**.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A QA tester sends the same prompt to your support chatbot on Monday and Tuesday and gets two slightly different answers. Both read fine. Has something broken?",
            choices: [
              { id: "a", label: "No — the same input can produce different outputs; that’s non-determinism, not breakage" },
              { id: "b", label: "Yes — identical prompts must always return identical answers" },
              { id: "c", label: "Yes — someone must have changed the code overnight" },
            ],
            answer: "a",
            explanation:
              "Non-deterministic means the output isn’t fixed by the input — it can vary without anyone touching anything. Two fine-but-different answers is normal AI behaviour, not breakage and not a code change.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Your team certified a vending-machine-style checkout flow with one week of tests and shipped it. Now they want to apply the same test-once approach to the new AI assistant. Why won’t it work?",
            choices: [
              { id: "a", label: "It still can — just re-run the same certified tests more often" },
              { id: "b", label: "One good run doesn’t guarantee the next — the same prompt can answer differently over time, so every run needs watching" },
              { id: "c", label: "It can’t work at all — AI features are untestable by nature" },
            ],
            answer: "b",
            explanation:
              "Deterministic software passes once and stays passed. AI varies run-to-run, so certification has to become continuous observation.",
          },
        ],
      },
      {
        slug: "when-ai-goes-wrong",
        title: "When AI goes wrong, it rarely crashes",
        blurb: "Software fails loudly. AI fails quietly.",
        topic: "observability-foundations",
        skillIds: ["ai-observability", "llm-hallucination", "model-drift", "llm-cost-latency"],
        capability: "Recognise that AI usually fails quietly, and name the three common quiet-failure modes.",
        minutes: 6,
        concept: {
          anchor: "Like a slow leak in a bike tyre — nothing pops, it just gets worse day by day until the ride feels wrong.",
          what: "AI **fails quietly**: it keeps answering in the same confident tone while answers quietly turn wrong, **costs climb**, or quality **drifts** (slowly going stale on new data) — nothing crashes.",
          why: "Silent failures run for **days or weeks** before anyone notices; observability exists to make quiet problems **loud enough to catch early**.",
          where: [
            "A support bot **hallucinating a refund policy** (a confident but made-up answer) no one notices",
            "An assistant whose **token bill doubles** over a month (tokens are the word-sized pieces the model reads)",
            "A ranking model whose **quality drifts** after a data change",
          ],
          whenNot:
            "Not the failure shape of ordinary software — a crashed page or full disk is already loud; that’s classic monitoring, not AI observability.",
        },
        prose: [
          "Normal software fails loudly. A page stops loading, an error pops up, the app freezes. Everyone notices, and someone fixes it.",
          "AI tends to fail **quietly**. It keeps answering with a smile — but the answers quietly become wrong, the costs quietly climb, or the quality quietly **drifts** downward over time.",
          "Because nothing actually crashes, nobody realises until the damage is done — and the bike-tyre picture actually understates it: a tyre eventually goes flat and stops, but an AI **keeps rolling on wrong answers indefinitely**. That’s the core problem observability exists to solve: **making quiet problems loud enough to catch early**.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "For three weeks, your company’s chatbot has been inventing a return policy that doesn’t exist — politely, confidently, and with zero error messages. Users are following the fake policy. Why did nobody catch it for so long?",
            choices: [
              { id: "a", label: "The failure was loud but support was understaffed" },
              { id: "b", label: "AI fails quietly — nothing crashed, so the confident wrongness ran unnoticed until users complained" },
              { id: "c", label: "The chatbot was working exactly as intended" },
            ],
            answer: "b",
            explanation:
              "AI keeps running and answering even when something is wrong, so the failure is silent rather than a crash. Invisibility is exactly what makes quiet failures expensive.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A teammate lists the incidents from last quarter: (1) the website went down when disk filled up, (2) the chatbot started citing a deleted policy, (3) the AI feature’s bill doubled silently. Which two are AI quiet-failure modes?",
            choices: [
              { id: "a", label: "1 and 2 — both are crashes" },
              { id: "b", label: "2 and 3 — confident wrongness and quietly climbing cost" },
              { id: "c", label: "1 and 3 — disk and money are the same kind of problem" },
            ],
            answer: "b",
            explanation:
              "Disk space is a loud, classic crash. The AI quiet modes are being confidently wrong and costs drifting up — no error screen, just slow damage.",
          },
        ],
      },
      {
        slug: "logs-what-ai-said",
        title: "Logs: what the AI said",
        blurb: "A diary of every exchange, so odd answers aren’t a mystery.",
        topic: "observability-pillars",
        skillIds: ["system-logs"],
        capability: "Read a log entry and explain how logging helps answer ‘why did the AI say that?’.",
        minutes: 5,
        concept: {
          anchor: "A diary written as things happen, so you can flip back to exactly what was said on Tuesday.",
          what: "**Logs** are a diary of what the AI said — every exchange written down **as it happens**.",
          why: "Without logs, an odd answer is a mystery; with them, **‘why did it say that?’ becomes investigable** — exact prompt, answer, timestamp, version.",
          where: [
            "Scrolling back to the **exact odd answer** a user screenshotted",
            "Checking which **model version** answered a support ticket",
            "Reconstructing a **complaint** from words, not memory",
          ],
          whenNot:
            "Logs don’t tell you trends — ‘is it getting slower overall?’ is a **metric** question, not a diary lookup.",
        },
        prose: [
          "Yesterday your team’s chatbot told a user something strange. Today you want to know exactly what it said, when, and which model version was running. If nobody wrote it down at the time, that question has no answer — the moment is gone.",
          "Logs are the fix: a **diary written as things happen**. Every exchange — what was asked and what was answered — gets written down in the moment, never reconstructed afterwards.",
          "With logs, you can scroll back, find the entry, and see the precise **prompt, answer, timestamp, and version**. ‘Why did it say that?’ becomes a question you can actually investigate. Where the analogy breaks: a diary is written to preserve memories; a log is written for investigation — exact words and times, no feelings.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A user tweets a screenshot of your support bot promising a ‘full lifetime refund’ — but doesn’t say when it happened. Without logs, what’s your situation?",
            choices: [
              { id: "a", label: "You can find the exact exchange instantly" },
              { id: "b", label: "You only have a memory of it feeling wrong — the exact words, time, and model version are gone" },
              { id: "c", label: "Nothing — tweets aren’t real incidents" },
            ],
            answer: "b",
            explanation:
              "A log is the record of events that makes ‘why did it say that?’ investigable. Without it, you’re reconstructing from screenshots and memory.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Your team is writing the log-entry standard for a new chatbot. One engineer wants prompt + answer + timestamp + model version; another wants to also store each user’s full name and home address ‘for context’. Which four fields are the right core?",
            choices: [
              { id: "a", label: "Prompt, answer, timestamp, and model version" },
              { id: "b", label: "Prompt, answer, the user’s full name and home address — more context is always better for debugging" },
              { id: "c", label: "Only the answers — prompts take too much space" },
            ],
            answer: "a",
            explanation:
              "Those four reconstruct exactly what happened. Personal data isn’t needed to debug an answer — and storing it creates a privacy problem instead of solving a debugging one.",
          },
        ],
      },
      {
        slug: "metrics-counting-matters",
        title: "Metrics: counting what matters",
        blurb: "Turn “it feels slow” into numbers you can watch.",
        topic: "observability-pillars",
        skillIds: ["system-metrics", "llm-cost-latency"],
        capability: "Name the key AI metrics and explain why watching them over time reveals quiet problems.",
        minutes: 6,
        concept: {
          anchor: "Track your height on the door frame — one mark means little, the trend over months tells the story.",
          what: "**Metrics** are numbers counted over time — a log records one event; a metric **summarises thousands**.",
          why: "Watching numbers move turns ‘it feels slow’ into evidence — **a spike is a quiet problem announcing itself**.",
          where: [
            "**Latency** (the wait time for a response) — how long answers take",
            "**Cost & token usage** (tokens are word-sized pieces the model reads) — how much it reads, writes, spends",
            "**Error rate** — how often it fails",
          ],
          whenNot:
            "Metrics won’t explain any single answer — ‘why did it say *that*?’ needs a **log**, not an average.",
        },
        prose: [
          "It’s your second week with the team’s chatbot. One user says it ‘feels slow lately’; another says it’s fine. A feeling won’t settle that, and neither will a single log entry — you need numbers counted over time.",
          "A **metric** is exactly that: a number that **summarises thousands** of events — like **height marks on a door frame**. One mark means little; the trend over months tells the story.",
          "For an AI, four numbers matter most: **latency** (how long an answer takes), **cost** (how much it spends), **error rate** (how often it fails), and **token usage** (how much it reads and writes). Watch them move and a spike is a quiet problem announcing itself. Where the analogy breaks: you measure a child a few times a year; a metric counts thousands of events a day — fast enough to catch trouble while it’s still small. Try the 24h window on the dashboard above and spot the spike.",
        ],
        diagram: {
          kind: "flow",
          steps: [
            { kind: "input", text: "Thousands of requests" },
            { kind: "process", text: "Count over time", caption: "avg latency · error rate · tokens · cost" },
            { kind: "output", text: "A line you can watch move" },
          ],
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Users keep telling your team the chatbot ‘feels slow lately’. You need to confirm it with evidence — not vibes — and see whether it’s getting worse week over week. What do you pull up?",
            choices: [
              { id: "a", label: "The average-latency metric graphed over the last few weeks" },
              { id: "b", label: "One user’s exact logged conversation from Tuesday" },
              { id: "c", label: "The chatbot’s source code" },
            ],
            answer: "a",
            explanation:
              "A metric aggregates thousands of events into a number over time — exactly what ‘is it getting slower?’ needs. One log entry can’t show a trend.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Your AI feature’s monthly bill jumped 40% but no one filed a complaint and every answer looks fine. Which metric would have caught this quietly climbing cost before the invoice did?",
            choices: [
              { id: "a", label: "Latency — slow requests always cost more" },
              { id: "b", label: "Token usage tracked over the month" },
              { id: "c", label: "Error rate — cost problems always show up as failures too" },
            ],
            answer: "b",
            explanation:
              "Token usage and cost are the money metrics. A steady climb in either is a quiet failure showing up as a number you can see and act on — before the invoice arrives.",
          },
        ],
      },
      {
        slug: "traces-the-journey",
        title: "Traces: following a request’s journey",
        blurb: "Follow one request end-to-end and find the slow step.",
        topic: "observability-pillars",
        skillIds: ["distributed-tracing"],
        capability: "Read a trace and identify which step in a request is the bottleneck.",
        minutes: 6,
        concept: {
          anchor: "Like a receipt that shows every stop your parcel made — and how long each stop took.",
          what: "A **trace** follows **one request end-to-end** — every step behind the scenes, each with its own timing bar.",
          why: "It localises vague complaints: ‘the AI is slow’ becomes **‘THIS step is slow’** — usually the big model call.",
          where: [
            "Finding the **slow step** in a support-bot request",
            "Seeing **where the money goes** (which calls spend tokens)",
            "Pointing engineers at the **exact** hop to optimise",
          ],
          whenNot:
            "A single trace can’t tell you trends — ‘is latency (the wait time for a response) rising across all requests?’ is a **metric** question; traces zoom into one journey.",
        },
        prose: [
          "Nine seconds. That’s how long the support bot takes to answer, and the team keeps arguing about which part is slow — the document search? the model? the formatting? An average can’t settle it, because an average has no parts.",
          "A **trace** settles it. Like a **delivery receipt that shows every stop your parcel made** — and how long each stop took — a trace follows **one request on its full journey**, with a little timing bar for every step behind the scenes.",
          "Stack the bars and the shape of the request appears: most steps are quick, one is slow — usually the big model call. Where the analogy breaks: a parcel visits its stops one after another; a request’s steps can overlap — but the bars still add up to the wait the user feels. Try tapping the steps above.",
        ],
        diagram: {
          kind: "flow",
          steps: [
            { kind: "input", text: "One user question" },
            { kind: "process", text: "Steps: retrieve → LLM call → format" },
            { kind: "output", text: "Timed bars: the slow step stands out" },
          ],
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Your support bot takes 9 seconds per reply and users are complaining. The average-latency metric confirms it’s slow, but not why. What do you open next to find the culprit step?",
            choices: [
              { id: "a", label: "A trace of one slow request, to see which step’s bar dominates" },
              { id: "b", label: "The latency graph again, zoomed in" },
              { id: "c", label: "A bigger model’s pricing page — at 9 seconds, the fix is obviously an upgrade" },
            ],
            answer: "a",
            explanation:
              "A metric gives an average across many requests. A trace zooms into one request and shows every step inside it — that’s how ‘it’s slow’ becomes ‘the LLM call is slow’.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "In your trace, the bar for the big LLM call is roughly 80% of the request’s total time; retrieval and formatting are slivers. Your team proposes a week optimising the formatting code. What does the trace say?",
            choices: [
              { id: "a", label: "Go ahead — formatting is easier to fix" },
              { id: "b", label: "Effort is going to the wrong step — the LLM call dominates, so that’s where the time actually is" },
              { id: "c", label: "The trace is broken because bars should be equal" },
            ],
            answer: "b",
            explanation:
              "A trace localises slowness to a specific step so effort goes where it matters. A week on a 5% step can’t move a 9-second reply; the 80% LLM call can.",
          },
        ],
      },
      {
        slug: "is-the-answer-good",
        title: "“Is the answer good?” — evaluation",
        blurb: "Turn a fuzzy question into a rubric of checks.",
        topic: "observability-quality",
        skillIds: ["llm-evaluation"],
        capability: "Explain how a rubric and a reviewer turn a fuzzy ‘is it good?’ into checkable evaluation.",
        minutes: 6,
        concept: {
          anchor: "A teacher's marking scheme splits a fuzzy ‘nice essay’ into tick boxes: facts, focus, neatness.",
          what: "**Evaluation** turns fuzzy ‘is it good?’ into a **rubric of sharp checks** — facts right? helpful? on-topic? safe? — applied by a reviewer.",
          why: "An answer can read beautifully and still be wrong; a rubric makes quality **measurable instead of felt**.",
          where: [
            "A **human reviewer** scoring a sample of answers each week",
            "An **AI judge** scoring thousands overnight",
            "Most teams **blending both** on a schedule",
          ],
          whenNot:
            "Evaluation scores **samples on a schedule** — it can’t certify every live answer, and a rubric is only as honest as its checks.",
        },
        prose: [
          "“Is this answer good?” is the hardest question in AI. An answer can **read beautifully and still be wrong**, unhelpful, or off-topic.",
          "The trick is to stop asking one fuzzy question and ask several sharp ones instead — a **rubric**. Does it get the facts right? Is it helpful? Is it on-topic? Is it safe?",
          "Then someone applies the rubric. A **human reviewer** is careful but slow; a second AI acting as a **judge** is fast but not perfect. Most teams blend both, checking a sample of answers on a regular schedule — because where the marking-scheme analogy breaks: a teacher marks one exam season, but AI answers arrive **every day, forever**. The rubric has to run on a schedule, not a term.",
        ],
        diagram: {
          kind: "compare",
          left: { title: "One fuzzy question", subtitle: "‘Is this answer good?’" },
          right: { title: "A rubric of sharp checks", subtitle: "facts · helpful · on-topic · safe" },
          rows: [
            {
              label: "What it catches",
              left: "polish and vibes — eloquent answers pass",
              right: "wrong facts and off-topic answers, by name",
            },
            {
              label: "Who applies it",
              left: "nobody, consistently",
              right: "human reviewers + AI judges, on a schedule",
            },
            {
              label: "Limits",
              left: "can’t be checked at all",
              right: "scores samples — not every live answer",
            },
          ],
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Your chatbot’s latest answer is eloquent, on-brand, perfectly formatted — and cites a discount code that expired in 2023. Users are already trying it. Why didn’t ‘it reads well’ catch this?",
            choices: [
              { id: "a", label: "Because reading well is not being right — surface polish hides factual problems, which is why evaluation uses a rubric of specific checks" },
              { id: "b", label: "Because the answer passed every formatting check the team automated — and formatting was the whole checklist" },
              { id: "c", label: "Because the model is top-of-the-line — the biggest models don’t make factual slips" },
            ],
            answer: "a",
            explanation:
              "‘Good’ must be broken into checkable parts — factual correctness first. An eloquent wrong answer is the classic evaluation trap.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "You must review 10,000 support answers per month. A human reviewer scores 500 with great care; an AI judge scores all 10,000 overnight but sometimes misgrades nuance. What do most teams actually do?",
            choices: [
              { id: "a", label: "Use only the human — quality beats coverage" },
              { id: "b", label: "Use only the AI judge — speed beats everything" },
              { id: "c", label: "Blend both: AI judge at scale, human spot-checks on a sample" },
            ],
            answer: "c",
            explanation:
              "Humans are careful but slow; AI judges are fast but imperfect. Blending both gets coverage and a calibrated sample — each covers the other’s weakness.",
          },
        ],
      },
      {
        slug: "hallucination-makes-things-up",
        title: "Hallucination: confident, but wrong",
        blurb: "A wrong answer that looks exactly like a right one.",
        topic: "observability-quality",
        skillIds: ["llm-hallucination", "llm-evaluation"],
        capability: "Explain why AI hallucinates and how logs and evaluation catch confident falsehoods.",
        minutes: 6,
        concept: {
          anchor: "A friend who tells made-up stories in the same sure voice as their true ones — the tone gives nothing away.",
          what: "A **hallucination** (a confident but made-up answer) is a wrong answer said with complete confidence — **it looks identical to a correct one**.",
          why: "The AI **predicts plausible text, it doesn’t look up facts** — so sometimes the most plausible-sounding line is false, and only observability catches it.",
          where: [
            "A support bot inventing a **refund policy**",
            "An assistant citing a **paper that doesn’t exist**",
            "A legal summariser **misquoting** a clause",
          ],
          whenNot:
            "Not solved by making answers sound more careful — confidence **carries no accuracy signal**; you need **logs + evaluation**, not better tone.",
        },
        prose: [
          "A hallucination is a **wrong answer said with complete confidence**. Unlike a friend whose made-up stories eventually sound different, an AI’s false answer looks identical to a correct one — there’s no warning in the wording.",
          "This happens because the AI isn’t a database. It **predicts which words tend to follow others**, producing text that sounds plausible. Sometimes the most plausible-sounding line simply isn’t true.",
          "Because a confident answer isn’t a checked answer, you catch hallucinations with observability: **logs** let you re-read what was said, and an **evaluation rubric** asks the dangerous question — ‘is this actually correct?’.",
        ],
        diagram: {
          kind: "compare",
          left: { title: "A checked answer", subtitle: "facts looked up and verified" },
          right: { title: "A hallucination", subtitle: "made up — just as confident" },
          rows: [
            {
              label: "How it sounds",
              left: "confident and clear",
              right: "confident and clear — identical",
            },
            {
              label: "Where it came from",
              left: "real facts, actually looked up",
              right: "plausible-sounding words, predicted",
            },
            {
              label: "What catches it",
              left: "nothing extra needed",
              right: "logs + an evaluation rubric asking ‘is it correct?’",
            },
          ],
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Your medical-info chatbot tells a user to take 800 mg of a medicine every 2 hours — stated exactly as confidently as its correct answers. Why is this failure so dangerous compared to a crashed page?",
            choices: [
              { id: "a", label: "Because a confident falsehood looks identical to a correct answer — there’s no warning in the wording" },
              { id: "b", label: "Because users should have known better than to trust a chatbot" },
              { id: "c", label: "Because the chatbot knows it is lying" },
            ],
            answer: "a",
            explanation:
              "A hallucination is a wrong answer said with complete confidence — no crash, no error tone. The confidence is exactly what makes it dangerous.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A manager wants to stop hallucinations by adding ‘always be careful and accurate’ to the system prompt so answers sound more cautious. What actually catches confident falsehoods?",
            choices: [
              { id: "a", label: "Logs to re-read what was said, plus an evaluation rubric asking ‘is this actually correct?’" },
              { id: "b", label: "Stronger wording — ‘always be careful and accurate’ just needs to be firmer" },
              { id: "c", label: "A bigger model — the biggest ones don’t make things up" },
            ],
            answer: "a",
            explanation:
              "The model predicts plausible words — tone prompts can’t change that machinery. Observability surfaces confident lies: logs let you re-check what was said; evaluation asks if it was correct.",
          },
        ],
      },
      {
        slug: "drift-slowly-going-bad",
        title: "Drift: when AI slowly goes bad",
        blurb: "Slow decay as the world changes around a frozen model.",
        topic: "observability-quality",
        skillIds: ["model-drift"],
        capability: "Explain model drift and why quality must be watched over time, not tested once.",
        minutes: 6,
        concept: {
          anchor: "Like milk in the fridge: fine for weeks, then quietly sour — nothing splashes, it just turns.",
          what: "**Drift** (slowly going stale on new data) is slow decay: the model is frozen at training, but the **world keeps moving** — quality slips a little at a time.",
          why: "Nothing crashes and there’s **no single moment of failure** — only a **trend over time** reveals the slide before users feel it.",
          where: [
            "A news summariser after **new events** its training never saw",
            "A shopping assistant as **new products and slang** arrive",
            "A fraud model as **fraudsters change tactics**",
          ],
          whenNot:
            "Not the diagnosis when the model **never worked** — that’s a build problem. Drift is ‘was good, quietly became worse’.",
        },
        prose: [
          "Drift is **slow decay**. A model is frozen when it’s trained, but the world keeps moving — new words, new events, new user behaviour arrive every week.",
          "Nothing crashes, and there’s no single moment of failure to point at. Like **milk slowly turning sour**, quality just slips a little at a time until, months later, the answers are subtly worse. Where the analogy breaks: milk sours on its own schedule; an AI’s world can move overnight — one viral event or product launch — so the slide isn’t always slow. It is always silent, though.",
          "A one-off test can’t see a slide like this. The only way to catch drift is to **keep measuring quality over time and watch the trend** — so you notice the decline before your users do.",
        ],
        diagram: {
          kind: "compare",
          left: { title: "One-off test", subtitle: "a snapshot" },
          right: { title: "Quality over time", subtitle: "a trend" },
          rows: [
            {
              label: "What it shows",
              left: "How good the model was on launch day",
              right: "The slope — good in March, subtly worse by June",
            },
            {
              label: "When NOT to use",
              left: "Alone — it can’t see a slow slide",
              right: "To explain a sudden breakage — that’s an incident, not drift",
            },
          ],
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Your travel-chatbot scored 92% quality in January and 74% by June. No code changed, no crashes, no complaints until May — users just started asking about destinations and slang that didn’t exist in training. What happened?",
            choices: [
              { id: "a", label: "Drift — the frozen model slowly lost fit as the world moved around it" },
              { id: "b", label: "A crash — the model broke in May" },
              { id: "c", label: "Nothing — quality scores always vary randomly" },
            ],
            answer: "a",
            explanation:
              "Drift is gradual decay, not a crash. The model didn’t change; its fit to the world did — new words, new destinations, new behaviour.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "The team proposes re-running the January quality test once a year to certify the model, like a car inspection. Why won’t that catch drift?",
            choices: [
              { id: "a", label: "Because a yearly pass works for car inspections — it’s the standard everywhere" },
              { id: "b", label: "Because drift is gradual — a single snapshot can’t show a slope; you need quality measured repeatedly over time" },
              { id: "c", label: "Because drift isn’t a real problem until users complain" },
            ],
            answer: "b",
            explanation:
              "A single test is a snapshot. Drift only shows up as a slope when you compare snapshots across weeks — measure quality continuously, not annually.",
          },
        ],
      },
      {
        slug: "alerts-knowing-when-to-act",
        title: "Alerts: knowing when to act",
        blurb: "A smoke alarm for your AI — and the art of setting it right.",
        topic: "observability-action",
        skillIds: ["alerting"],
        capability: "Explain the alert-threshold trade-off between false alarms and missed problems.",
        minutes: 6,
        concept: {
          anchor: "A smoke alarm for your kitchen: set it hair-trigger and it screams at toast; too relaxed and you sleep through fire.",
          what: "An **alert** is a rule with a **threshold** — ‘if the error rate crosses this number, wake me up’. A smoke alarm for your AI.",
          why: "It converts a moving metric into a **timely decision** — but the threshold is a **trade-off** between false alarms and missed fires.",
          where: [
            "Paging an on-call engineer when **error rate spikes**",
            "A budget alarm when **token spend** (on word-sized pieces the model reads) crosses a line",
            "A quality alert when **eval scores dip** for days",
          ],
          whenNot:
            "Alerts can’t tell you *why* — diagnosis needs **traces and logs**; and an over-firing alert is worse than none because **people stop trusting it**.",
        },
        prose: [
          "An alert is a **rule with a threshold**: ‘if the error rate goes above this number, wake me up’. It’s a smoke alarm for your AI.",
          "The hard part is where you set the threshold. **Too low** and it fires at every wobble — you stop trusting it, and when a real fire starts you ignore it. **Too high** and it never fires at all, and a real problem burns quietly.",
          "There’s no perfect setting, only a **trade-off**. Where the smoke-alarm analogy breaks: smoke means fire, period — but an error-rate number wobbles a little by nature, so some noise is normal and the threshold has to sit just above it. The art is tuning it so you catch the real problems without crying wolf. Try dragging the threshold above and watch the two counters change.",
        ],
        diagram: {
          kind: "compare",
          left: { title: "Threshold too low", subtitle: "fires at everything" },
          right: { title: "Threshold too high", subtitle: "fires at almost nothing" },
          rows: [
            {
              label: "What you get",
              left: "constant false alarms on normal noise",
              right: "a quiet pager — and silent real fires",
            },
            {
              label: "End state",
              left: "the team stops trusting the alert",
              right: "nobody ever learns there was a fire",
            },
            {
              label: "The fix",
              left: "raise it out of the noise",
              right: "lower it until real problems fire again",
            },
          ],
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "An on-call engineer sets the error-rate alert so sensitively it fires several times a day on normal noise. Last night a real incident started at 2 am — and she slept through the alert. What actually failed?",
            choices: [
              { id: "a", label: "The alert system was offline" },
              { id: "b", label: "The threshold was too low — months of false alarms taught her to ignore the page, so the real one read as noise" },
              { id: "c", label: "Real incidents can’t be alerted on" },
            ],
            answer: "b",
            explanation:
              "A low threshold fires on normal noise; cry wolf often enough and people stop trusting the alert — exactly when it matters most.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A team sets their alert threshold extremely high ‘to keep the pager quiet’. For three weeks a genuine quality problem smoulders, noticed by no one. What did the too-high threshold cause?",
            choices: [
              { id: "a", label: "Missed real problems — the alert never fires, so the failure stays silent" },
              { id: "b", label: "More false alarms, just later" },
              { id: "c", label: "Nothing — a quiet pager is the healthier system" },
            ],
            answer: "a",
            explanation:
              "A high threshold rarely fires, so genuine problems slip past unnoticed — the silent failure the alert existed to catch. Tuning is a trade-off, not a quest for quiet.",
          },
        ],
      },
      {
        slug: "dashboards-control-room",
        title: "Dashboards: the control room",
        blurb: "One screen you glance at to know if you’re healthy.",
        topic: "observability-action",
        skillIds: ["observability-dashboards"],
        capability: "Explain what makes a good dashboard and why glancability matters.",
        minutes: 5,
        concept: {
          anchor: "One glance at the car's fuel and warning lights tells you ‘fine’ or ‘trouble’ — no studying dials.",
          what: "A **dashboard** is the one screen you glance at to know if a system is healthy — **one look says ‘fine’ or ‘something’s wrong’**.",
          why: "Glancability is the whole job: the **few numbers that matter, big and clear** — less, but louder.",
          where: [
            "A **plane cockpit** — the original glanceable control room",
            "A team’s **daily health check** before standup",
            "An **on-call screen** watched during incidents",
          ],
          whenNot:
            "Not a place for every number — forty tiny readings is unreadable, and **unreadable dashboards get ignored**. Detail belongs in logs and traces.",
        },
        prose: [
          "A dashboard is the one screen you **glance at** to know if a system is healthy — like the cockpit of a plane. You shouldn’t have to study it; one look should tell you ‘fine’ or ‘something’s wrong’.",
          "The common mistake is to **cram everything in**. A dashboard with forty tiny readings is unreadable — a glance tells you nothing, so you eventually stop looking.",
          "A good dashboard shows only the **few numbers that matter**, big and clear, with the bad ones obvious. Less, but louder. Where the cockpit analogy breaks: a plane’s panel is designed once by professionals and certified; your dashboard evolves with the product — and every panel you add steals glanceability from all the others. That’s what makes one glance enough.",
        ],
        diagram: {
          kind: "compare",
          left: { title: "Glanceable", subtitle: "few numbers, big" },
          right: { title: "Crammed", subtitle: "forty tiny readings" },
          rows: [
            {
              label: "One glance says",
              left: "‘fine’ or ‘something’s wrong’",
              right: "nothing — you have to study it",
            },
            {
              label: "After two months",
              left: "still part of the daily routine",
              right: "nobody opens it anymore",
            },
            {
              label: "Where detail lives",
              left: "in logs and traces, one click away",
              right: "buried on the same screen",
            },
          ],
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A proud engineer builds a dashboard with forty tiny charts covering every metric the system emits. Two months later, nobody on the team opens it — including him. What killed it?",
            choices: [
              { id: "a", label: "It couldn’t be read at a glance, so people stopped looking — the failure is human, not technical" },
              { id: "b", label: "It used too much computer memory" },
              { id: "c", label: "It still needed more charts — coverage was incomplete" },
            ],
            answer: "a",
            explanation:
              "Glancability is the job. Unreadable dashboards get ignored, defeating their purpose — fewer numbers, bigger and louder, survives daily use.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A manager asks the team to remove the error-rate and cost panels from the customer-facing AI dashboard because ‘they sometimes look bad when executives visit’. What does removing them break?",
            choices: [
              { id: "a", label: "Nothing — happy metrics are the healthy ones" },
              { id: "b", label: "The at-a-glance signal — hiding the bad numbers means a glance can no longer say ‘something’s wrong’" },
              { id: "c", label: "Nothing important — cost and error rate live in the logs anyway" },
            ],
            answer: "b",
            explanation:
              "A good dashboard shows the few numbers that matter with the bad ones obvious. Cherry-picking the happy metrics destroys the one job a dashboard has.",
          },
        ],
      },
      {
        slug: "cost-and-speed",
        title: "Cost and speed: the two big bills",
        blurb: "Every AI feature pays in tokens and in time.",
        topic: "observability-action",
        skillIds: ["llm-cost-latency"],
        capability: "Explain why cost and latency are the two key business bills for any AI feature.",
        minutes: 5,
        concept: {
          anchor: "Every taxi ride has a meter and a clock — the fare adds up and the minutes tick whether you watch or not.",
          what: "Every AI feature pays **two bills**: **cost** (the tokens it reads and writes) and **latency** (the time it takes to answer).",
          why: "They’re business problems, not just technical ones — cost **eats margin**, latency **loses users** — and they usually **rise together**.",
          where: [
            "A **chatty support feature** quietly wiping out margin",
            "A **slow shopping assistant** users abandon mid-question",
            "A **bigger model upgrade** raising the token bill and wait time at once",
          ],
          whenNot:
            "Not independent knobs — you can’t minimise both and maximise capability; the trade-off is the decision, and it needs **numbers on a dashboard** to make.",
        },
        prose: [
          "Every AI feature pays two bills: **cost** — the tokens it reads and writes, like distance in a taxi — and **latency** — the time it takes to answer, like minutes on the road.",
          "The two tend to **travel together**. A bigger, more capable answer usually costs more and takes longer; a smaller one is cheaper and faster but less capable.",
          "Both are **business problems**, not just technical ones. Cost eats your profit margin — an unwatched, chatty feature can wipe it out. Latency loses users — people quietly abandon slow apps. Where the taxi analogy breaks: a taxi’s meter and its clock move independently — you can sit in traffic with the fare frozen; an AI’s two bills usually **rise together**, which is exactly what makes the trade-off a real decision. Watching both is part of shipping AI responsibly.",
        ],
        diagram: {
          kind: "compare",
          left: { title: "Cost", subtitle: "the reading-and-writing bill" },
          right: { title: "Latency", subtitle: "the wait for an answer" },
          rows: [
            {
              label: "What it is",
              left: "every word-sized piece the feature reads and writes",
              right: "every second the user waits",
            },
            {
              label: "What it hits",
              left: "margin — a quietly climbing monthly bill",
              right: "users — chats abandoned mid-question",
            },
            {
              label: "After a model upgrade",
              left: "rises — more capable answers read more",
              right: "rises — the same answers take longer",
            },
          ],
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "To improve answer quality, your team switches the support bot to a bigger model. Support tickets praise the richer answers — but the monthly token bill doubles and replies now take twice as long. What happened?",
            choices: [
              { id: "a", label: "Cost and latency travel together — a bigger, more capable call costs more tokens AND more time" },
              { id: "b", label: "The bigger model was broken" },
              { id: "c", label: "The vendor billed them twice by mistake — it happens" },
            ],
            answer: "a",
            explanation:
              "More tokens means more spend and more time — the two bills rise together. That trade-off is exactly what cost-and-latency metrics exist to quantify.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A founder argues latency is ‘just an engineering metric’ and only the token bill matters for the business. A product manager disagrees, pointing at last month’s 15% drop in completed chats. Who’s right, and why?",
            choices: [
              { id: "a", label: "The PM — slow apps lose users; latency is a retention problem dressed up as a technical one" },
              { id: "b", label: "The founder — users never notice speed" },
              { id: "c", label: "Both wrong — latency improves accuracy" },
            ],
            answer: "a",
            explanation:
              "Real users abandon slow experiences. Cost eats margin and latency loses users — both bills hit the business, which is why observability tracks them together.",
          },
        ],
      },
      {
        slug: "observability-toolkit",
        title: "The observability toolkit",
        blurb: "You don’t build this from scratch — you bolt on a tool.",
        topic: "observability-realworld",
        skillIds: ["observability-tools"],
        capability: "Name common observability tools and the job each one does, and explain how to start.",
        minutes: 5,
        concept: {
          anchor: "You don't build a heart-rate monitor to get fit — you strap on a watch and read what it shows.",
          what: "Observability is **bolted on, not built from scratch** — a tool collects the logs, metrics, and traces; you read them.",
          why: "Mature tools let you spend time on **diagnosis, not construction** — like wearing a fitness tracker instead of building a heart-rate monitor.",
          where: [
            "**AI/LLM-focused tools** — tracing calls, evaluating answers",
            "**General-purpose platforms** — metrics, logs, alerts for any software",
            "Starting with **one tool that fits** and expanding later",
          ],
          whenNot:
            "Don’t install everything at once (overwhelming) or wait for a break (too late) — and a tool **collects** signals; it still can’t read them for you.",
        },
        prose: [
          "You don’t build observability from scratch. Just like you’d **wear a fitness tracker** rather than build your own heart-rate monitor, you bolt on a tool that collects the **logs, metrics, and traces** for you.",
          "There’s a healthy menu to choose from. Some tools focus on **AI and LLMs** — tracing calls and evaluating answers. Others are **general-purpose**, handling metrics, logs, and alerts for any software, AI included.",
          "Don’t try to memorise the names. The point is simpler: whatever signal you need to watch, **a tool already exists to collect it**. Where the fitness-tracker analogy breaks: a watch gives you one number — steps — while AI tools each cover a slice (traces, evaluations, metrics), which is why teams often end up running two focused tools rather than one do-everything box. Pick one that fits what you’re building and start there.",
        ],
        diagram: {
          kind: "flow",
          steps: [
            { kind: "input", text: "Signals emitted", caption: "logs · metrics · traces" },
            { kind: "process", text: "A tool collects them", caption: "bolted on, not built from scratch" },
            { kind: "output", text: "You read and diagnose", caption: "the tool can’t read them for you" },
          ],
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A two-person startup is about to ship an AI feature. Engineer A proposes spending two months writing custom logging, metrics, and tracing code; Engineer B proposes bolting on an existing observability tool this week. What’s the practical choice — and the trade-off?",
            choices: [
              { id: "a", label: "Bolt on the tool — you spend your time diagnosing signals, not building instruments" },
              { id: "b", label: "Build from scratch — custom instruments are always better" },
              { id: "c", label: "Neither — small teams can’t have observability" },
            ],
            answer: "a",
            explanation:
              "Mature tools let you focus on reading the signals instead of building the instruments — diagnosis, not construction, is where your time pays off.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Your team must pick a first tool for a chatbot product. One option is an LLM-focused observability platform; the other is a general-purpose infrastructure monitor. The chatbot’s biggest risk is bad answers reaching users. Which fits better, and why?",
            choices: [
              { id: "a", label: "The LLM-focused tool — tracing requests and evaluating answers is exactly what it specialises in" },
              { id: "b", label: "The general-purpose tool — it can evaluate answers better" },
              { id: "c", label: "Install both plus two more, to be safe" },
            ],
            answer: "a",
            explanation:
              "LLM-focused tools specialise in tracing calls and judging answer quality — the two things generic tools do less well. Start with one that fits; expand later, don’t install everything at once.",
          },
        ],
      },
      {
        slug: "day-in-the-life",
        title: "A day in the life of an AI team",
        blurb: "The whole course as one connected story.",
        topic: "observability-realworld",
        skillIds: ["ai-observability"],
        capability: "Describe the full observability loop — watch, alert, trace, log, fix — as one connected workflow.",
        minutes: 6,
        concept: {
          anchor: "Like tending a garden: glance daily, act when a leaf yellows, find the pest, fix it, keep watching.",
          what: "Observability is **one continuous loop** — **watch → alert → trace → log → fix → repeat** — not a setup-and-forget step.",
          why: "Each pass catches a quiet problem **before users complain**; every tool in the toolkit is just a **role in the loop**.",
          where: [
            "A dashboard reading **healthy for weeks**, then…",
            "An **alert** firing when error rate crosses its threshold",
            "A **trace + logs** pointing at the changed knowledge source",
          ],
          whenNot:
            "The loop ends only if you stop watching — a one-time setup can’t catch problems that **haven’t happened yet**.",
        },
        prose: [
          "Here’s the whole course in one story. A team ships an AI feature. From day one, **logs, metrics, and traces flow quietly into a dashboard** that reads healthy.",
          "Weeks later, **an alert fires** — the error rate has crept past its threshold. Nothing crashed; the dashboard caught a quiet problem before users complained.",
          "The team opens a **trace** for a failing request and pinpoints the slow step. The **logs** reveal why: a knowledge source the AI depended on quietly changed. They fix the cause and watch the metric recover.",
          "That’s the loop: **watch → alert → trace → log → fix → repeat**. Every tool in this course is just a role in that loop. And where the garden analogy breaks: a garden rests in winter — an AI feature serves users every single day, so the loop never gets a season off.",
        ],
        diagram: {
          kind: "flow",
          steps: [
            { kind: "input", text: "Signals flow: logs · metrics · traces" },
            { kind: "process", text: "Alert fires past threshold" },
            { kind: "process", text: "Trace finds the step" },
            { kind: "output", text: "Logs name the cause — fix" },
          ],
          loop: "Back to watching — the loop never ends",
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "For six weeks your team’s AI feature hums along: dashboards healthy, no complaints. Then one morning the error-rate alert fires — nothing crashed, nothing was deployed overnight. What turned this quiet problem into an investigation?",
            choices: [
              { id: "a", label: "The alert — a metric crossing its threshold — not a crash or a user email" },
              { id: "b", label: "The app crashing loudly at 3 am" },
              { id: "c", label: "A user emailing the CEO screenshots" },
            ],
            answer: "a",
            explanation:
              "The alert — fed by a metric crossing a threshold — is what turns a quiet problem into an investigated one. That’s its role in the loop: catch what doesn’t crash.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Following the alert, the team must find the cause. Rank the loop’s next two moves: what finds the failing step, and what explains what that step actually did wrong?",
            choices: [
              { id: "a", label: "A trace finds the step; logs explain why it went wrong" },
              { id: "b", label: "A bigger server finds the step; a louder alarm explains why" },
              { id: "c", label: "The dashboard finds the step — it shows everything; the alert explains why" },
            ],
            answer: "a",
            explanation:
              "The trace localises the failure to a step — the dashboard only averages across requests and can’t. The logs show what that step did — together they point at the cause, the fix lands, and the loop returns to watching.",
          },
        ],
      },
    ],
};

export default course;
