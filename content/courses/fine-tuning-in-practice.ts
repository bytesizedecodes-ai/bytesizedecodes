import type { Course } from "../types";

const course: Course = {
    slug: "fine-tuning-in-practice",
    title: "LLM Fine-Tuning in Practice",
    subtitle:
      "From decision memo to shipped adapter: data, templates, QLoRA, evals — on one running build.",
    description:
      "The practitioner's path through a real fine-tune, end to end. The running case is Sahayak — a WhatsApp assistant for a 40-store pharmacy chain. It must reply in the house tone, extract orders into strict JSON, and refuse dosage questions politely. Each lesson adds one artifact to the build: the decision memo with token-cost math, the 800-pair dataset, the loss-masking decision, the GPU budget that forces LoRA, the training dials, the checkpoint policy, the eval gate, the template contract, and the ship path to a local Ollama server. Runnable Python exercises appear throughout. A capstone at the end assembles the whole decision log.",
    level: "intermediate",
    domain: "AI Engineering",
    access: "free",
    prerequisites:
      "Comfortable with Python and the mechanics from Machine Learning (gradients, training loops, train/test discipline) — or equivalent hands-on experience.",
    lessons: [
      {
        slug: "the-transfer-ladder",
        title: "Why 500 examples move a 3-billion-parameter model",
        blurb: "The transfer ladder: SFT is pretraining's own mechanism, pointed at your replies.",
        topic: "sahayak-foundations",
        skillIds: ["sft-pipeline"],
        capability: "Derive why a few hundred supervised examples shift behavior without touching language skill.",
        minutes: 7,
        concept: {
          anchor:
            "A new hire adopts the company style guide in a week — nobody re-teaches them English first.",
          what: "**Supervised fine-tuning (SFT)** uses pretraining's own learning rule — predict the next token — pointed at your replies. So the update budget is spent on **behavior**, not on re-learning language.",
          why: "It answers the question every practitioner eventually asks. Why does a pack of 500 curated pairs visibly move a model whose language skill took trillions of tokens to install? Because the skill is already there. Only the conditional style is missing.",
          where: [
            "Sahayak's **tone pack** — 400 WhatsApp replies in the house voice",
            "**Format packs** — orders rewritten as strict JSON receipts",
            "**Refusal packs** — dosage questions routed with the polite house refusal",
          ],
          whenNot:
            "The ladder breaks when the target behavior **sits on missing knowledge** rather than missing style. 500 examples cannot teach this week's stock levels, because nothing in the model's language skill carries them.",
        },
        prose: [
          "Meet the case. Sahayak is a WhatsApp assistant for a 40-store pharmacy chain, built by a six-person team. The API model they started with is fluent but wrong for the job. Replies run four paragraphs. Order receipts arrive as chatty prose. Dosage questions get answered instead of routed to a pharmacist. The team's question is also this course's first derivation: why would a few hundred of their own examples fix that? The model has three billion parameters.",
          "Build the ladder from a ground truth you already accept: pretraining taught the model to predict the next token over a corpus. That single rule, applied at colossal scale, produced grammar, facts, and style. Now the first rung: SFT uses **the same rule, unchanged**. Your examples are just a tiny corpus where the correct next token is the token of your ideal reply. Second rung: gradient updates from that corpus move whatever is *least certain*. The model is already certain about English. What it is uncertain about is **how this particular assistant answers**. Third rung: the update budget concentrates on style, format, and refusal behavior — the conditional part. That is all the examples contain that the model doesn't already know.",
          "Top rung, named only now: that concentration **is** transfer learning. The 500 pairs work precisely because they never ask the model to learn language. They ask it to re-weight choices language already supports. That also draws the boundary. When the gap is knowledge (this week's stock), no quantity of style examples can close it — that's a documents problem. The next lesson turns the distinction into a decision memo with actual token math.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Sahayak's team watches the SFT run improve tone and receipt format steadily. But the model still quotes last month's stock numbers. A teammate concludes 'the fine-tune isn't working — add more examples.' What does the transfer ladder say is actually happening?",
            choices: [
              { id: "a", label: "The run is working exactly as derived. Behavior (tone, format) sits on existing skill and moves. Stock levels are knowledge the pack can't carry, so they belong in a lookup document" },
              { id: "b", label: "The run is failing — 500 examples is below the threshold where knowledge transfer begins, so scale to 50,000" },
              { id: "c", label: "The learning rate is too low for factual content — raise it until facts stick" },
              { id: "d", label: "Tone and facts are the same kind of learning; the split is arbitrary" },
            ],
            answer: "a",
            explanation:
              "The ladder's boundary rung: SFT re-weights behavior the model can already express. It doesn't install perishable knowledge. More examples would only make the model more confidently wrong about stock.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A legal-tech team re-derives the ladder for their own task: teach a model to emit boilerplate clauses in the firm's house format. Halfway, a teammate asks: 'so the rung that says updates concentrate on the uncertain part — does that hold for us?' Re-derive it: why will their 400 clause pairs move format without damaging legal fluency?",
            choices: [
              { id: "a", label: "Because the pairs contain format the model is uncertain about, while legal language is already certain from pretraining. So the gradient budget lands on clause shape, not on re-learning law" },
              { id: "b", label: "Because clause formatting is simpler than law, so the model replaces hard knowledge with easy knowledge" },
              { id: "c", label: "It doesn't hold — format and fluency always train together equally, so expect legal quality to halve" },
              { id: "d", label: "Because supervised examples erase pretraining noise, leaving only the firm's style" },
            ],
            answer: "a",
            explanation:
              "Same rung, new domain: uncertainty concentrates the update where the examples add information. The firm's pairs are nearly all format signal. Legal fluency was settled long before, so it barely moves.",
          },
        ],
      },
      {
        slug: "prompt-rag-or-finetune",
        title: "The decision memo: prompt, RAG, or fine-tune",
        blurb: "One behavior, one rung — with monthly token math that makes the call.",
        topic: "sahayak-foundations",
        skillIds: ["when-to-finetune", "harness-vs-finetuning"],
        capability: "Route each product behavior to prompt, RAG, or fine-tune using cost and change-frequency evidence.",
        minutes: 7,
        concept: {
          anchor:
            "A commuter picks the fare that fits the trip — walk, bus, or cab — not the most impressive vehicle.",
          what: "Route **per behavior**: one-off instructions stay in the prompt; changing facts go to retrieval (RAG); stable, always-on behavior earns the fine-tune. Each rung up costs more to build and more to change.",
          why: "Sahayak's traffic makes the costs concrete. 120,000 messages a month × a 700-token instruction block is **84 million tokens of repeated instructions** a fine-tune can delete. Stock levels, the fact-shaped needs, would be frozen at training day if trained.",
          where: [
            "Sahayak's **tone + receipt format** — stable, universal → fine-tune",
            "**Stock and price questions** — change daily → RAG over the inventory feed",
            "The **Diwali greeting banner** — two weeks only → a prompt line, removed after",
          ],
          whenNot:
            "Don't fine-tune what a prompt can hold. Instructions that change by campaign, or knowledge that refreshes faster than you'd retrain, are prompt and RAG territory. The rung below is always cheaper to change.",
        },
        diagram: {
          kind: "decision",
          root: {
            kind: "decision",
            question: "What does the behavior need?",
            branches: [
              {
                label: "fresh facts (prices, stock, policy)",
                node: {
                  kind: "leaf",
                  answer: "RAG",
                  caption: "lookup at answer time — always current",
                },
              },
              {
                label: "stable style, format, refusals",
                node: {
                  kind: "leaf",
                  answer: "Fine-tune",
                  caption: "trained once, always on",
                },
              },
              {
                label: "instructions for this campaign only",
                node: {
                  kind: "leaf",
                  answer: "Prompt",
                  caption: "free, instant, disposable",
                },
              },
            ],
          },
        },
        prose: [
          "The memo starts with the arithmetic. Every Sahayak message today carries a 700-token instruction block: the house tone, the receipt schema, the refusal rules. At 120k messages a month that's 84M tokens of *repeated* instructions. That is a cost paid every month for rules that haven't changed in a year. A fine-tune writes those rules into the weights once and deletes the block. Even at generous API pricing, the tune pays for itself inside a quarter. And every reply stops spending attention re-reading instructions it could simply be.",
          "The same memo kills the tempting overreach. The team's second instinct — 'also train in the stock levels so it just knows them' — fails on the freeze test. Weights are a snapshot; the inventory feed is a river. Train today, and by Friday the model confidently quotes Tuesday's stock. That behavior routes to RAG: the assistant looks up the live feed at answer time. Correctness comes from the document, not from memory.",
          "The discipline is routing per behavior, not per product. Sahayak itself ships as all three rungs at once: tone and receipts in the fine-tune, stock via retrieval, and the festival banner as a prompt line that ships this morning and dies next week. Teams that pick one rung for everything pay in one of two ways. They burn money retraining facts (climbed too high). Or they burn context re-injecting permanent style (never climbed at all).",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Sahayak's growth team proposes training the assistant to know each store's Diwali week hours 'so we stop repeating them in the prompt.' The hours change yearly and differ across 40 stores. What does the memo's arithmetic say?",
            choices: [
              { id: "a", label: "Fine-tune it — the hours repeat in every conversation, so training deletes the repetition cost" },
              { id: "b", label: "Route to RAG or prompt — the hours are facts that change on a schedule the weights can't track; training would freeze them at this year's timetable and require a retrain every Diwali" },
              { id: "c", label: "Fine-tune half the stores and prompt the other half to split the cost" },
              { id: "d", label: "Neither — store hours can never be answered by an LLM-based assistant" },
            ],
            answer: "b",
            explanation:
              "The freeze test decides it: facts on a refresh schedule belong to lookup, where an edit propagates instantly. Training would pay a retrain per change. The monthly token saving inverts into a yearly training bill.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A bank's internal assistant repeats a 900-token compliance block (unchanged for 3 years, legally audited) on all 2M monthly queries. It also needs tomorrow's FX rates in every answer. Transfer the memo: what's the correct split?",
            choices: [
              { id: "a", label: "Fine-tune the stable compliance behavior (3 years unchanged, repeated on every query — the exact recurring cost training deletes). Serve FX rates from a live lookup so they're never frozen" },
              { id: "b", label: "Prompt both — the compliance block is already working as a prompt" },
              { id: "c", label: "Fine-tune both — training in the FX rates makes answers faster" },
              { id: "d", label: "RAG both — retrieval is always the safest rung in regulated industries" },
            ],
            answer: "a",
            explanation:
              "Same two tests, new numbers. Stability + universal repetition → train once (1.8B tokens of repeated instructions a month). Daily-changing facts → lookup. The audit copy still lives in a document for compliance review.",
          },
        ],
      },
      {
        slug: "anatomy-of-an-example",
        title: "Anatomy of a training example",
        blurb: "Messages, roles, and the special tokens the model actually reads.",
        topic: "sahayak-data",
        skillIds: ["chat-templates"],
        capability: "Construct a well-formed chat example whose format matches the target model's template.",
        minutes: 7,
        concept: {
          anchor:
            "A screenwriter's page: the speaker's name is part of the text — remove it and the scene breaks.",
          what: "A training example is a **messages array** (system/user/assistant turns) rendered through the model's **chat template** into one token stream. Special tokens fence each turn. The model learns the rendered bytes, not your JSON.",
          why: "Every downstream failure class — template skew, reply-bleed, half-learned format — traces to one fact. The example the model trains on is the *rendered string*. So you author at the messages level and verify at the string level.",
          where: [
            "Sahayak's pair schema: **short system line + real user message (typos intact) + house reply**",
            "**Multi-turn pairs** for clarification behavior ('which branch?')",
            "The **refusal pair**: dosage question → polite routing reply",
          ],
          whenNot:
            "Never hand-write the rendered string directly or invent a template. Render through the model's own `tokenizer.apply_chat_template`. A single missing special token teaches the model a script it will never hear again at serving time.",
        },
        prose: [
          "Author at the layer built for humans; train at the layer built for the model. The messages array is the authoring surface — roles and content, easy to review, diff, and anonymize. But the trainer never feeds JSON to the model. It renders the array through the model's own chat template into a single string, with special tokens fencing every turn. One pair, two representations, and both must be right.",
          "The fence posts are load-bearing. `<|user|>` and its closing marker tell the model where a request ends. The assistant fence tells it where its reply begins. That is the difference between answering a question and continuing a list of questions. Skip a fence in training and you have taught a script with a missing stage direction. The behavior arrives half-formed, bleeding at exactly the spot the fence would have sealed.",
          "Sahayak's schema settles on three lines. First, a short system line (the long compliance copy lives in a document). Second, the user message verbatim — typos, Hinglish, the lot. Third, the house reply. Verbatim matters more than it looks. Cleaned-up user turns train behavior conditioned on an input distribution that never occurs. That is why the schema cleans only one side of each card.",
        ],
        exercise: {
          id: "ex1",
          title: "Render the example, roles intact",
          prompt:
            "render_example turns a messages array into the training string: each turn wrapped in its role tags, replies fenced. The non-assistant close tag is hardcoded — fix it so every turn closes with its own role's tag.",
          starterCode: `def render_example(messages):
    """Render chat messages into the training string the model actually reads."""
    parts = []
    for m in messages:
        role = m["role"]
        parts.append(f"<|{role}|>\\n{m['content']}")
        if role != "assistant":
            parts.append(f"<|/user|>")   # <-- wrong closing tag (also wrong for system)
    return "\\n".join(parts)
`,
          testCode: `
msgs = [
    {"role": "system", "content": "You are Sahayak."},
    {"role": "user", "content": "crocin 500 available?"},
    {"role": "assistant", "content": "Checking stock now!"},
]
got = render_example(msgs)
ok = True
message = "ok"
for opener, closer, content in [
    ("<|system|>", "<|/system|>", "You are Sahayak."),
    ("<|user|>", "<|/user|>", "crocin 500 available?"),
    ("<|assistant|>", "<|/assistant|>", "Checking stock now!"),
]:
    want = f"{opener}\\n{content}\\n{closer}"
    if want not in got:
        ok = False
        message = f"missing well-formed turn: {want!r} not in rendered output"
        break
`,
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Sahayak's data lead exports 800 pairs as clean JSON messages. The pairs go straight into training — without once rendering them through the target model's chat template. What has the team actually trained on?",
            choices: [
              { id: "a", label: "The JSON structure itself is what the model reads, so nothing is lost — roles are self-describing" },
              { id: "b", label: "A stream the model may never see at serving time. Unless the array is rendered with the model's own template and special tokens, the model rehearses a script the live product will never print" },
              { id: "c", label: "Nothing — training libraries refuse unrendered messages" },
              { id: "d", label: "The same thing as template rendering, because templates are cosmetic formatting only" },
            ],
            answer: "b",
            explanation:
              "The model trains on rendered bytes. Authoring at the messages level is right. Skipping the render step means the rehearsal script and the performance script differ. That is the invisible bug this course returns to in the template-contract lesson.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Building the refusal pack, a teammate 'cleans' the user turns: fixing typos, expanding 'u' to 'you', standardizing casing. Their reasoning: cleaner input teaches cleaner behavior. What does the anatomy of an example say about this edit?",
            choices: [
              { id: "a", label: "It's correct — clean inputs always produce clean outputs" },
              { id: "b", label: "It trains a distribution mismatch. Real WhatsApp traffic arrives typo-ridden, so the model's new behaviors never meet the messiness they must survive. Keep user turns verbatim; clean only the assistant replies" },
              { id: "c", label: "It's harmless because the model ignores user-turn formatting entirely" },
              { id: "d", label: "It improves things only if the typos are in Hindi rather than English" },
            ],
            answer: "b",
            explanation:
              "The example is the joint distribution the model learns. Pristine user turns + house replies means the trained behavior is conditioned on inputs that never occur. Verbatim user text, curated assistant text — that's the schema.",
          },
        ],
      },
      {
        slug: "curating-the-dataset",
        title: "Curating the 800-pair pack",
        blurb: "Quality beats quantity — and contamination beats you.",
        topic: "sahayak-data",
        skillIds: ["finetune-data-curation"],
        capability: "Curate a fine-tuning pack: dedup, decontaminate against the eval, mix general data.",
        minutes: 7,
        concept: {
          anchor:
            "A chef's tasting menu: eight perfect dishes, not eighty with repeats — and never the judge's plate.",
          what: "A fine-tune pack is a small **coherent** corpus. It is deduplicated and **decontaminated against the eval drawer** (no training question may resemble an eval question). It is mixed with ~15–20% general chat so broad skills survive.",
          why: "Duplicates teach frequency, not pattern (the repeated reply style drowns the rest). Contamination silently invalidates the eval — the drawer no longer measures transfer if its questions leaked into practice. An unmixed pack invites catastrophic forgetting.",
          where: [
            "Sahayak's sources: **anonymized real logs**, the best staffer's rewrites, and synthetic drafts with human edits",
            "The **near-dup pass** — 'is crocin available' × 40 collapses to 3 phrasings",
            "The **leak check** — every eval-drawer question diffed against the pack before training",
          ],
          whenNot:
            "Don't scale a messy pack to fix a weak tune. 10,000 contaminated pairs are worse than 800 clean ones. The eval lies louder, and the repeated noise trains harder.",
        },
        diagram: {
          kind: "flow",
          steps: [
            { kind: "input", text: "Raw sources: logs + rewrites + synthetic" },
            { kind: "process", text: "Anonymize (names, phones, prescriptions)" },
            { kind: "process", text: "Dedup + near-dup collapse" },
            { kind: "process", text: "Decontaminate vs eval drawer" },
            { kind: "process", text: "Mix in ~15–20% general chat" },
            { kind: "output", text: "The 800-pair pack (drawer untouched)" },
          ],
        },
        prose: [
          "Sahayak's first scrape looks rich: 3,200 real support conversations. It is also three kinds of poisoned. Forty customers asked 'is crocin available' with cosmetic variations — those are near-duplicates. Training on them doesn't teach availability forty times better. It teaches the model that one reply shape should dominate everything. A dedup pass — exact matches, then near-matches by similarity — collapses the pile to three honest phrasings. The pack drops to 1,100 before curation even starts.",
          "The second poison is quieter. Two of the best conversations in the scrape happen to resemble questions the team had set aside for the eval drawer. Train on those, and the eval is over — not because the model got better, but because it has seen the exam. Contamination is the only dataset bug that makes you *feel* more confident as it makes your evidence worse. The fix is mechanical. Before every training run, diff every drawer question against the pack — exact and near-match. Remove anything that smells like the exam from the practice set.",
          "The third is the pack's silence. Eight hundred pharmacy-only pairs is a monotonous diet; the general chat that keeps tone flexible needs representing. So the final mix: ~640 task pairs (tone, receipts, refusals, clarifications) plus ~160 general conversation turns. And — written into the repo, not the pack — the drawer of 40 held-out questions the model will never see. That's the artifact this lesson contributes: the pack, the drawer, and the leak check that keeps them apart.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "After Sahayak's tune, the eval drawer scores 96% — but the first week of real traffic is noticeably worse than the drawer predicted. The postmortem finds three drawer questions had near-identical twins inside the training pack. What did the 96% actually measure?",
            choices: [
              { id: "a", label: "Transfer — the model genuinely learned the house style and the drawer confirmed it" },
              { id: "b", label: "Contaminated recall — near-twins of drawer questions sat in the pack, so the 'eval' partly graded memory. The true transfer score is lower, and the leak check must run before the next run" },
              { id: "c", label: "Nothing — a single contamination invalidates the entire drawer permanently" },
              { id: "d", label: "Real-traffic quality — WhatsApp phrasing is equivalent to the drawer's phrasing" },
            ],
            answer: "b",
            explanation:
              "Contamination inflates eval scores by converting measurement into memory. The drawer isn't dead — clean it, re-diff it against the pack, and rerun. But never trust a score earned on questions the model practiced.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A fintech team transfers Sahayak's curation pipeline to their own pack of 12,000 support pairs. They skip dedup ('more data can't hurt') and keep 100% task-focused data ('focus is the point'). Which two failures are they scheduling?",
            choices: [
              { id: "a", label: "None — both choices simply make training take longer" },
              { id: "b", label: "Duplicate-inflated frequency (one dominant reply shape drowns the others) and skill fade on general conversation, since no everyday chat holds the shared skills in place" },
              { id: "c", label: "Overfitting from dedup and contamination from skipping the general mix" },
              { id: "d", label: "Contamination from duplicates and slower training from the missing general mix" },
            ],
            answer: "b",
            explanation:
              "Duplicates teach frequency, not behavior — the most-repeated reply wins disproportionate weight. And a task-only diet is the catastrophic-forgetting setup: narrow practice, no anchor for general skill. Both are exactly what the curation pass exists to prevent.",
          },
        ],
      },
      {
        slug: "train-on-answers-only",
        title: "Train on the answers, not the questions",
        blurb: "Loss masking: the update should land on your replies, not on customer typos.",
        topic: "sahayak-data",
        skillIds: ["sft-pipeline"],
        capability: "Apply completion-only loss masking and explain what training on prompt tokens would teach.",
        minutes: 7,
        concept: {
          anchor:
            "A driving instructor grades your steering, not the road — the road is given; the wheel is what you control.",
          what: "**Loss masking** trains only on the assistant's tokens. Prompt tokens are fed as context but their loss is masked to zero. So every gradient step teaches the model to *produce your replies*, never to produce customer messages.",
          why: "Without the mask, a third of Sahayak's gradient budget goes to modeling typo-ridden customer queries. That spends capacity on imitating the input distribution instead of the reply behavior you're paying for.",
          where: [
            "Sahayak's receipt pairs: loss **only on the JSON reply**, never on the messy order text",
            "The refusal pack: mask the dosage question, train the routing reply",
            "Multi-turn pairs: **each assistant turn** in the loss, all user turns masked",
          ],
          whenNot:
            "Don't mask the system prompt out of thrift — it belongs to the prompt side too. The only tokens that earn loss are the ones you want the model to **generate** in production.",
        },
        prose: [
          "The masking rule derives in one breath from what training is: every token that earns loss becomes a generation target. Unmask the customer's typo-ridden query and the model learns to produce typo-ridden queries. That is a skill the product will never use. It is paid for with the same gradient budget you're spending on tone and receipts.",
          "Concretely, Sahayak's rendered example splits at the assistant fence. Tokens before it are context (loss masked to zero, still fed forward). Tokens after it are targets. On the receipt pairs that's especially sharp. The messy order text is context; the strict JSON is the target. And the model never wastes a parameter learning to write '2 crocin pls deliver asap' in the customer's voice.",
          "Multi-turn examples mask per turn: every user message is context, every assistant reply a target. One example produces several supervised segments. The system prompt, where used, rides on the context side. The model should obey it, not recite it.",
        ],
        exercise: {
          id: "ex1",
          title: "Build the mask",
          prompt:
            "build_mask returns the per-token loss mask for a rendered example: 0 for prompt tokens, 1 for the assistant reply. The boundary is off by one — fix it so the reply's tokens are exactly the ones unmasked.",
          starterCode: `def build_mask(prompt_len: int, total_len: int) -> list:
    """0 for the first prompt_len tokens (context), 1 for the reply tokens after."""
    return [0] * (prompt_len - 1) + [1] * (total_len - prompt_len + 1)   # <-- boundary wrong
`,
          testCode: `
cases = [(10, 25), (3, 3), (0, 8)]
ok = True
message = "ok"
for p, t in cases:
    m = build_mask(p, t)
    if len(m) != t or m[:p] != [0] * p or m[p:] != [1] * (t - p):
        ok = False
        message = f"build_mask({p}, {t}) -> {m}, expected {p} zeros then {t - p} ones"
        break
`,
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Reviewing Sahayak's training config, a new engineer sees `train_on_prompt: true` ('more tokens, more signal, right?') and proposes leaving it on. Using the masking derivation, what does the run actually optimize if it ships that way?",
            choices: [
              { id: "a", label: "A blended objective. The model spends part of its gradient budget learning to generate typo-ridden customer queries. That dilutes the reply-behavior signal the tune exists to install" },
              { id: "b", label: "The same thing — prompt tokens carry no learning signal either way" },
              { id: "c", label: "A better model — modeling both sides of the conversation is strictly more context" },
              { id: "d", label: "Faster convergence, because more tokens means more updates per example" },
            ],
            answer: "a",
            explanation:
              "Every unmasked token is a target the model learns to produce. Unmasking customer text trains query-generation — wasted capacity at best, and a model that drifts toward echoing input style at worst.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A journaling app transfers the principle: their assistant should learn to ask one gentle follow-up question after each user entry. Their pairs are [user: long journal entry] → [assistant: one follow-up]. Re-derive the masking choice: which tokens earn loss, and why?",
            choices: [
              { id: "a", label: "Only the assistant's follow-up. It's the only text the model must generate in production. The journal entry is context the model receives, so masking it keeps the gradient on the ask-one-question behavior" },
              { id: "b", label: "Both turns — the model must understand journals, so the entry should be a generation target too" },
              { id: "c", label: "Neither — follow-up questions are too short to train on, so use a prompt instead" },
              { id: "d", label: "Only the journal entry, since it's the longer and more informative text" },
            ],
            answer: "a",
            explanation:
              "The mask rule generalizes: loss belongs on exactly the tokens the model produces at serving time. Understanding the entry comes free through the context. Generating entries is a behavior the product never needs.",
          },
        ],
      },
      {
        slug: "the-memory-arithmetic",
        title: "The memory arithmetic",
        blurb: "16 bytes a parameter: why full fine-tuning never fit your GPU.",
        topic: "sahayak-method",
        skillIds: ["finetune-memory-math"],
        capability: "Compute training memory from first principles and size a fine-tune to a GPU budget.",
        minutes: 8,
        concept: {
          anchor:
            "A moving truck's inventory: four boxes per item before you've packed a single dish.",
          what: "Full fine-tuning needs roughly **16 bytes per parameter** — fp16 weights (2) + fp32 master copy (4) + Adam's two moment tensors (8) + gradients (2). So a 3B model bills ~48 GB **before activations**. LoRA freezes the base (2 bytes/param, read-only) and trains a tiny adapter. That collapses the bill.",
          why: "This is the arithmetic that makes adapter methods a necessity, not a hack. A 16 GB free-tier GPU is 3× short for full fine-tuning a 3B model under *any* configuration. The ledger, not the technique, forbids it.",
          where: [
            "Sahayak's **budget sheet**: 3B × 16 B ≈ 48 GB → impossible on T4; LoRA ≈ 6 GB → fits with room",
            "The same ledger sizing **7B vs 13B** choices on rented cards",
            "Why **batch size and context length** are the dials you cut first (activations scale with both)",
          ],
          whenNot:
            "The 16-bytes rule assumes Adam at full precision. Memory-optimized optimizers or 8-bit Adam shave the constant. But they never shave enough to make full fine-tuning a 7B model a free-tier activity. The activation term also grows with context, so long-context packs need the batch dial down.",
        },
        prose: [
          "Derive the ledger and it stops being folklore. Training holds four buckets per parameter: the fp16 weights themselves (2 bytes), the fp32 master copy the optimizer updates against (4), Adam's first and second moments (8), and this step's gradients (2). That is 16 bytes before a single activation. A 3B model therefore bills ~48 GB of state. The 16 GB T4 isn't close, and no batch size changes a per-parameter constant.",
          "The escape is not cleverness but read-only-ness. Freeze the base and three of the four buckets vanish for it. A frozen matrix needs no master copy, no moments, no gradients — just 2 bytes per parameter to be read. The optimizer state collapses to the adapter's size. The whole run lands near 6 GB with room for activations. That single decision — freeze — converts an impossible rent into a free-tier afternoon.",
          "Keep the ledger honest at its edges: activations scale with batch × context. So long multi-turn packs bite the budget even under LoRA. The dial that frees activation memory is batch (via accumulation), never the frozen-base term. The exercise prices both routes — run it before your next rental decision, not after.",
        ],
        exercise: {
          id: "ex1",
          title: "Price the run before renting",
          prompt:
            "full_ft_bytes prices a full fine-tune: 16 bytes per parameter all-in. lora_bytes prices the adapter route: frozen fp16 base (2 B/param) plus trainable adapter params at 16 B each. full_ft_bytes double-counts the gradients — fix it.",
          starterCode: `BYTES_FULL = 16          # 2 w + 4 master + 8 adam + 2 grads
BYTES_FROZEN = 2         # fp16 base, read-only
BYTES_ADAPTER = 16       # adapter params train with full optimizer state

def full_ft_bytes(params: int) -> int:
    return params * (BYTES_FULL + 2)      # <-- wrong: gradients counted twice

def lora_bytes(base_params: int, adapter_params: int) -> int:
    return base_params * BYTES_FROZEN + adapter_params * BYTES_ADAPTER
`,
          testCode: `
P = 3_000_000_000
ok = True
message = "ok"
if full_ft_bytes(1_000) != 16_000:
    ok = False
    message = f"full_ft_bytes(1000) -> {full_ft_bytes(1000)}, expected 16000"
elif lora_bytes(P, 20_000_000) != P * 2 + 20_000_000 * 16:
    ok = False
    message = "lora_bytes drifted from frozen base + 16B/adapter"
`,
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Sahayak's infra lead finds a stray 24 GB GPU in the office and proposes full fine-tuning the 3B model on it ('no adapters, no compromises — we have the memory'). What does the ledger say?",
            choices: [
              { id: "a", label: "It fits — 3B params at fp16 is 6 GB, well under 24" },
              { id: "b", label: "It doesn't. Training state, not just weights, sets the bill — 3B × 16 B ≈ 48 GB before activations, so the card is 2× short. The LoRA route (~6 GB) is the one that fits" },
              { id: "c", label: "It fits if they halve the learning rate, which halves memory" },
              { id: "d", label: "It fits after quantizing the optimizer to 4-bit, which cuts all four buckets by 4×" },
            ],
            answer: "b",
            explanation:
              "The classic misprice is weights-only (2 B/param). Training holds four buckets — 16 B/param — and activations ride on top. The 24 GB card can serve the model; it cannot full-fine-tune it.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A team re-derives the ledger for a 7B model on a rented 48 GB A100 and wants headroom for activations. Re-derive: what does full fine-tuning bill, and which single decision changes the math most?",
            choices: [
              { id: "a", label: "7B × 16 B ≈ 112 GB — full fine-tuning is out. Freezing the base (adapter route) drops the bill to ~14 GB + adapter state. That converts an impossible rent into a comfortable one" },
              { id: "b", label: "7B × 2 B = 14 GB — full fine-tuning fits with room to spare" },
              { id: "c", label: "112 GB, but a smaller batch brings it under 48 GB because batch size scales the 16 B/param constant" },
              { id: "d", label: "112 GB, and nothing changes it — 7B models simply cannot be adapted" },
            ],
            answer: "a",
            explanation:
              "The 16 B/param is per-parameter state — batch size doesn't shrink it (it only trades against activations). The one decision that rewrites the ledger is freezing the base. Read-only weights at 2 B/param, and the optimizer state collapses to the adapter's size.",
          },
        ],
      },
      {
        slug: "lora-from-first-principles",
        title: "LoRA from first principles",
        blurb: "ΔW ≈ B·A: the rank bottleneck, derived — and why rank 16 is enough.",
        topic: "sahayak-method",
        skillIds: ["lora-fine-tuning"],
        capability: "Derive the low-rank update and compute trainable parameter counts across layers.",
        minutes: 8,
        concept: {
          anchor:
            "A route change is one new exit ramp, not a rebuilt highway — the road stays; a small addition redirects it.",
          what: "**LoRA** freezes the base weights and learns the behavior change as a low-rank update — `ΔW = B·A`, with B (d×r) and A (r×k) at rank r. So a 4096×4096 layer adapts with `r·(4096+4096)` params instead of 16.7M — ~0.8% at rank 16.",
          why: "The change a behavior tune makes is empirically **low-rank** — style and format shifts lie in a thin subspace of the full weight space. So a small r suffices. It trains fast on small memory, and it merges back into W at serving time with zero added latency.",
          where: [
            "Sahayak's adapter: rank 16 over the attention projections — **~20M trainable of 3B**",
            "The **merge step** — B·A folded into W before export, so serving is unchanged",
            "Rank as the **capacity dial** — 8 for tone, 16–32 when formats get richer",
          ],
          whenNot:
            "The low-rank premise fails for **knowledge injection**. Moving what the model knows touches representations broadly (high-rank). So no affordable r teaches 5,000 unseen terms. That boundary belongs to continued pretraining or retrieval, not a bigger adapter.",
        },
        diagram: {
          kind: "compare",
          left: { title: "Full update", subtitle: "ΔW is the whole matrix" },
          right: { title: "LoRA update", subtitle: "ΔW = B·A at rank r" },
          rows: [
            { label: "Params per 4096×4096 layer", left: "16,777,216", right: "131,072 at r=16 (0.8%)" },
            { label: "Base weights", left: "updated in place", right: "frozen — read-only" },
            { label: "Undo / swap", left: "restore from full copy", right: "pop the adapter off" },
            { label: "Serving after merge", left: "unchanged", right: "unchanged — zero added latency" },
          ],
        },
        prose: [
          "Start from the empirical observation the whole method stands on. The *delta* a behavior tune produces — the matrix you'd add to every weight if you full fine-tuned — is well-approximated by a low-rank matrix. Style and format changes are consistent, low-complexity adjustments. They don't scatter energy across all 16.7 million directions of a 4096×4096 update. Sixteen to sixty-four directions carry most of the change.",
          "Low-rank structure factors: a rank-r update decomposes exactly into B (d×r) times A (r×k). So instead of learning ΔW directly, learn the two thin factors and compute ΔW = B·A on the fly. The parameter count drops from d·k to r·(d+k). For Sahayak's 3072×3072 projections at rank 16, that's 98,304 per matrix per block instead of 9.4M. The whole 64-block stack lands near 20M trainable parameters — about 0.7% of the base.",
          "The merge follows from the algebra: B·A is just a matrix. So W′ = W + B·A is a model with no adapter in it — identical architecture, identical serving cost. Rank itself is the capacity dial: the number of directions the behavior change may use. Tone fits in eight. Tone + strict receipts + refusals consume sixteen comfortably. Whole new knowledge refuses to fit at any affordable rank. That's the boundary from the Foundations course, now with the math to see why.",
        ],
        exercise: {
          id: "ex1",
          title: "Count the adapter across the layer stack",
          prompt:
            "adapter_params totals LoRA parameters across every adapted layer: each out×in matrix contributes out×r + r×in. The stack builder doubles the rank for the output projection — fix it so rank 16 applies to both projections.",
          starterCode: `def adapter_params(layers, rank):
    """layers: list of (out_dim, in_dim). Returns total LoRA params at this rank."""
    total = 0
    for out_dim, in_dim in layers:
        total += out_dim * rank + in_dim * rank
    return total

def sahayak_adapter_params(rank: int) -> int:
    """32 blocks: qkv (3072, 3072) and o (3072, 3072). Both adapted."""
    qkv = (3072, 3072)
    o = (3072, 3072)
    blocks = 32
    return adapter_params([qkv] * blocks, rank) + adapter_params([o] * blocks, rank * 2)   # <-- rank doubled for o
`,
          testCode: `
per_layer = (3072 * 16 + 16 * 3072) * 2
expected = per_layer * 32
got = sahayak_adapter_params(16)
ok = True
message = "ok"
if got != expected:
    ok = False
    message = f"sahayak_adapter_params(16) -> {got}, expected {expected} (rank 16 on both projections)"
`,
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Sahayak's team debates rank: 8 halves the adapter cost again, and 'rank only affects file size, right?' What does the derivation say rank actually is, and what does rank 8 risk?",
            choices: [
              { id: "a", label: "Rank is file size — behavior quality is independent of it" },
              { id: "b", label: "Rank is the capacity of the behavior change the adapter can express — the dimension of the subspace ΔW may live in. Rank 8 still holds simple tone. But the richer JSON-receipt behavior may need the extra directions rank 16 buys" },
              { id: "c", label: "Rank is the number of layers trained — rank 8 means 8 layers" },
              { id: "d", label: "Rank is the learning rate multiplier — rank 8 trains twice as fast" },
            ],
            answer: "b",
            explanation:
              "ΔW = B·A constrains the update to a rank-r subspace. Behavior complexity — tone alone vs tone + strict format + refusals — is what consumes directions. Start at 16, drop to 8 if the drawer shows headroom.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A medical-records team tries LoRA to inject a private 5,000-term drug interaction vocabulary. Rank 8 misses terms, rank 64 barely improves, and someone proposes rank 256. Re-derive the boundary: what is actually failing?",
            choices: [
              { id: "a", label: "The rank is failing — rank 256 will hold the vocabulary comfortably" },
              { id: "b", label: "The premise is failing. Knowledge injection is a high-rank change to what the model knows, so climbing ranks chases a boundary the derivation already drew. The right tools are continued pretraining on the corpus or retrieval over it" },
              { id: "c", label: "The learning rate is failing — vocabulary learning needs a smaller step size, not more rank" },
              { id: "d", label: "The merge step is failing — B·A should be merged before training, not after" },
            ],
            answer: "b",
            explanation:
              "Stagnant gains across a 8× rank climb is the empirical signature of a high-rank target. The update needs more directions than any affordable adapter provides. Behavior belongs in LoRA; knowledge belongs upstream or in retrieval.",
          },
        ],
      },
      {
        slug: "qlora",
        title: "QLoRA: a 4-bit base under the adapter",
        blurb: "Quantize the frozen base, train the adapter — what the noise costs.",
        topic: "sahayak-method",
        skillIds: ["lora-fine-tuning"],
        capability: "Explain QLoRA's memory stack and the tasks where quantization noise matters.",
        minutes: 7,
        concept: {
          anchor:
            "A photocopy of the recipe book to cook from — the original stays archived; the copy's slight blur rarely ruins the dish.",
          what: "**QLoRA** stacks two ideas. The frozen base is stored **4-bit quantized** (~0.5 bytes/param) and dequantized on the fly for each matmul. LoRA adapters train above it in full precision. A 3B model's base drops from ~6 GB to ~1.5 GB, and the whole run fits a free T4 with headroom.",
          why: "The base is read-only during training, so its precision doesn't enter the gradient path. The adapters learn against a slightly noisy but fixed landscape. Behavior-level targets (tone, format, refusal) are robust to that noise.",
          where: [
            "Sahayak on a **free T4**: 4-bit base (~1.5 GB) + rank-16 adapters + activations — comfortable",
            "**Laptop-class tuning** for teams with no GPU budget at all",
            "The same trade at serving time — **quantized export** for CPU inference",
          ],
          whenNot:
            "Quantization noise isn't free for every task. Targets that hinge on subtle numeric or probabilistic calibration can degrade on a 4-bit base. If the drawer score drops vs the 16-bit control run, the base's precision is a suspect, not just the adapter.",
        },
        diagram: {
          kind: "flow",
          steps: [
            { kind: "input", text: "Base model (16-bit)" },
            { kind: "process", text: "Quantize to 4-bit NF4 (frozen)" },
            { kind: "process", text: "Forward pass: dequantize per matmul" },
            { kind: "process", text: "LoRA adapters train in 16-bit above it" },
            { kind: "output", text: "Merge adapter → export at serving precision" },
          ],
        },
        prose: [
          "The memory ledger from two lessons ago left Sahayak at ~6 GB for LoRA alone on a 16 GB T4 — comfortable. But the moment the team tries the 7B backbone or doubles context for multi-turn pairs, activations squeeze the budget. QLoRA rewrites the frozen-base line of that ledger. The base never trains, so nothing about learning requires it to sit in memory at full precision. Store it 4-bit (~0.5 bytes/param). Dequantize each block on the fly for the matmul. The 3B base shrinks from ~6 GB to ~1.5 GB.",
          "Why is this safe? Follow the gradient path. Adapter weights are held and updated in 16-bit. The quantized base is a *fixed function* the adapters learn against. A fixed, slightly noisy landscape changes where the optimum sits by a hair. It does not corrupt the direction of each step. And empirically, behavior-level targets absorb the noise: tone, format, and refusals survive the photocopy fine. That's why QLoRA became the default recipe for small-GPU tuning. It is also why the free-tier capstone of this track is even possible.",
          "The boundary is calibration-shaped. Tasks whose outputs are numbers-with-consequences — dosing arithmetic, probability estimates, strict schema edge cases — are the ones to A/B against a 16-bit control. Same pack, same rank, full-precision base, drawer compared. If the 4-bit run trails, the suspect list starts with the base's precision, not your data. For Sahayak — tone, receipts, refusals — the drawer shows no gap, and the ledger wins: the run fits with headroom to spare.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A teammate objects to QLoRA: '4-bit must degrade what the model learns — you're training on a broken copy.' Walk the actual gradient path to answer them.",
            choices: [
              { id: "a", label: "The objection is right — adapters inherit the base's 4-bit precision and ship quantized weights" },
              { id: "b", label: "Adapters train in 16-bit against a *frozen* base. The base's precision never enters the gradient computation for adapter weights. It shifts the fixed landscape slightly, which behavior-level targets absorb" },
              { id: "c", label: "The objection is right in principle, but 4-bit dequantization happens only at export time" },
              { id: "d", label: "The base is fine because 4-bit is lossless for transformer weights" },
            ],
            answer: "b",
            explanation:
              "QLoRA's safety is structural, not empirical luck. The trained parameters are 16-bit; the 4-bit base is a constant in the computation. Noise in a constant shifts the optimum slightly — it cannot compound through updates.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A lab fine-tunes an assistant to estimate drug interaction risk scores (numeric outputs) with QLoRA. Its drawer scores trail the 16-bit control run by a wide margin on a tone/format eval that shows no gap. Transfer the boundary: what's the first suspect?",
            choices: [
              { id: "a", label: "The pack — tone and format data must be under-represented for numeric tasks" },
              { id: "b", label: "The quantized base's precision — numeric calibration is exactly the target class the boundary warns about; A/B against the 16-bit control before touching the data" },
              { id: "c", label: "The adapter rank — numeric tasks always need rank 64+" },
              { id: "d", label: "The drawer — evals for numeric tasks are always unreliable" },
            ],
            answer: "b",
            explanation:
              "The boundary is calibration-shaped: subtle numeric behavior is what 4-bit noise moves. The 16-bit control with the same pack is the experiment that isolates the base's precision from every other variable.",
          },
        ],
      },
      {
        slug: "dials-that-matter",
        title: "The dials that matter",
        blurb: "Learning rate, epochs, warmup, batch — and which one you actually tune.",
        topic: "sahayak-method",
        skillIds: ["finetune-hyperparameters"],
        capability: "Set the LoRA dials to sane defaults and diagnose the failure each wrong dial produces.",
        minutes: 7,
        concept: {
          anchor:
            "Guitar tuning: one string at a time, by ear — you don't retune the whole guitar because one string is flat.",
          what: "LoRA's dials have strong defaults — **LR ≈ 1–3e-4**, **1–3 epochs**, small warmup, effective batch 8–32 via **gradient accumulation**. The one that decides success is the learning rate: too low crawls (habit never sets), too high diverges (adapter noise).",
          why: "The dials interact, but not equally. Epochs control exposure (the parrot dial). Batch controls gradient noise. Warmup protects the first steps. The rate alone sets the step-to-curvature ratio that determines whether training converges at all.",
          where: [
            "Sahayak's config: **LR 2e-4, 3 epochs, warmup 30 steps, batch 16 by accumulation**",
            "The failure signatures you read off a loss trace — **crawl, converge, diverge**",
            "The **epoch dial** — where the parrot from Foundations lives in practice",
          ],
          whenNot:
            "Don't tune all four dials at once. Change the rate first, read the trace, then adjust epochs against the eval drawer. A grid over all dials burns GPU time to rediscover defaults the community already validated.",
        },
        prose: [
          "Sahayak's first run config comes almost entirely from defaults, and that's the point. LoRA tuning is a mature recipe, not a search problem. Learning rate 2e-4 (inside the 1–3e-4 band that rank-16 adapters like). Three epochs on 800 pairs. Warmup of thirty steps, so the randomly initialized adapters don't fire huge gradients into a cold landscape. And an effective batch of 16 built by accumulating four micro-batches — because the activation budget, not the recipe, sets what fits.",
          "The learning rate is the dial that fails loudest. It fails in two directions you can read off any loss trace. Too low and the loss falls like a bored sigh — monotone, glacial, 'technically learning'. The habit never sets, and the drawer shows the old tone. Too high and the trace oscillates, then climbs. The adapter's steps overshoot the valley floor and land on the far wall, run after run. The drag-the-slider scene below is that trace, live — feel the crawl, find the convergence band, push into the divergence.",
          "What the other dials do is subtler. Epochs is the exposure dial — it controls how many times the model rehearses the pack. That means it's also the parrot dial from Foundations: past the point where the drawer peaks, more epochs memorize. Batch (via accumulation) trades gradient noise against activation memory. Warmup is insurance for the first steps. When a run disappoints, the order is always: read the trace for the rate's signature first, then check the drawer against epochs — never a four-dial grid.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Sahayak's run shows loss 1.84 → 1.83 → 1.83 → 1.82 over three epochs, and the drawer still reports the old formal tone. The team proposes quadrupling epochs to 'let it sink in.' What's the correct first move?",
            choices: [
              { id: "a", label: "Raise the learning rate — monotone-glacial descent is the too-low signature. The habit is forming too slowly, and more epochs of the same crawl just burns GPU time" },
              { id: "b", label: "Quadruple the epochs — repetition is the only cure for slow learning" },
              { id: "c", label: "Lower the learning rate — the trace is dangerously close to divergence" },
              { id: "d", label: "Disable warmup — the first thirty steps are clearly the problem" },
            ],
            answer: "a",
            explanation:
              "Read the trace before touching exposure. Glacial monotone descent means each step removes a sliver — the rate's step-to-curvature ratio is wrong. Epochs multiply a crawl; they don't fix it.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A team's second run converges cleanly and the drawer peaks at epoch 2. But they let it run to epoch 6 'for completeness,' and the shipped model parrots pack phrasings on fresh questions. Transfer the dial model: which dial was misread, and what's the fix?",
            choices: [
              { id: "a", label: "The learning rate was too high in later epochs — schedule a decay to zero by epoch 3" },
              { id: "b", label: "The epoch dial was misread. Epochs are exposure, and the drawer peak IS the stopping signal. Train to the drawer's peak (here epoch 2), not to a rounder number, and keep that checkpoint" },
              { id: "c", label: "The batch was too small — gradient noise at epoch 6 caused the parroting" },
              { id: "d", label: "Warmup was too short — longer warmup prevents late-run parroting" },
            ],
            answer: "b",
            explanation:
              "The drawer-peak rule: eval-during-training exists precisely to catch the parrot's onset. Epochs past the peak trade transfer for memorization — the dial was fine, the stopping rule was ignored.",
          },
        ],
      },
      {
        slug: "catching-memorization",
        title: "Catching the parrot mid-training",
        blurb: "Checkpoint every N steps, score the drawer, and stop at the peak.",
        topic: "sahayak-eval",
        skillIds: ["finetune-evaluation"],
        capability: "Run eval-during-training and select the checkpoint by drawer score, not train loss.",
        minutes: 7,
        concept: {
          anchor:
            "Recording every take in the studio — you keep the take where the song is alive, not the last one played.",
          what: "Save a **checkpoint every N steps** and score the held-out drawer on each. The right checkpoint is the **drawer peak**, not the lowest training loss. Train loss keeps falling while transfer quality turns and walks away.",
          why: "The two curves peel apart exactly where the parrot begins. Memorizing the pack drives training loss down while fresh-question quality drops. So 'train to the end and ship' silently ships the most memorized model in the run.",
          where: [
            "Sahayak's policy: **checkpoint every 200 steps, drawer scored on each**",
            "The **two-curve chart** — train loss vs drawer score, and the peak",
            "The shipped artifact: **checkpoint 600** — not the final step",
          ],
          whenNot:
            "Don't checkpoint so densely that the drawer itself becomes a leaderboard you overfit by hand. Scoring every step and cherry-picking the luckiest spike is selection overfitting. Every-N-steps with a stable drawer (40+ questions) keeps the peak honest.",
        },
        prose: [
          "The instrument panel has two gauges, and they disagree on purpose. Train loss measures fit to the practice pack; the drawer measures transfer to fresh phrasings. Early in a run both improve together — the model is learning the pattern. Then, somewhere past the useful exposure, the curves peel. Pack fit keeps improving while fresh-question quality turns and falls. That peel is the parrot arriving, and it's invisible on either gauge alone.",
          "So the policy makes the disagreement impossible to miss. Checkpoint every N steps (200 suits an 800-pair pack). Score the 40-question drawer on each checkpoint. Log both curves beside the run. Selection then has one rule: ship the drawer's peak. And the two-curve chart is the evidence a reviewer reads in ten seconds: rising transfer, falling fit, one marked peak, one shipped artifact.",
          "Sahayak's chart is the textbook shape: drawer 61 at step 200 (under-trained), 86 at step 600 (the peak), 72 at step 1,200 while train loss hits its minimum. The final checkpoint is the most memorized model of the run. Shipping by reflex would have shipped the parrot. The widget below replays exactly that decision; make it yourself before reading on.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Sahayak's run ends at step 1,200 with the lowest training loss of the whole run. The engineer ships the final checkpoint by reflex. The drawer scores say checkpoint 600 was the peak and step 1,200 has dropped 14 points on fresh phrasings. What went wrong, procedurally?",
            choices: [
              { id: "a", label: "Nothing — lowest train loss is the correct ship criterion by definition" },
              { id: "b", label: "The selection rule was wrong. The ship criterion is the drawer peak, because train loss and transfer quality peel apart exactly where memorization begins. The reflex shipped the most-parroted checkpoint in the run" },
              { id: "c", label: "The checkpoints were saved too often, corrupting the final one" },
              { id: "d", label: "The drawer is broken — fresh-question scores should track training loss exactly" },
            ],
            answer: "b",
            explanation:
              "Two curves, one decision: training loss measures fit to the pack; the drawer measures transfer. Ship by the drawer's peak — the policy this lesson installs as the team's default.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Excited by the two-curve chart, a team moves to scoring the drawer **every single step** and shipping whichever checkpoint spikes highest, on a 12-question drawer. Transfer the boundary: what failure are they building?",
            choices: [
              { id: "a", label: "None — more measurement is always more information" },
              { id: "b", label: "Selection overfitting. A tiny, noisy drawer scored constantly makes the 'peak' a lucky spike, and hand-picking it bakes the noise in. Every-N-steps on a 40+ question drawer keeps the peak honest" },
              { id: "c", label: "GPU overheating — per-step eval doubles the thermal load of training" },
              { id: "d", label: "Data contamination — scoring the drawer leaks its questions into the pack" },
            ],
            answer: "b",
            explanation:
              "The drawer is an estimate, and small samples wobble. Score it constantly on a tiny set and you're selecting on the wobble, not the quality — the boundary rule keeps checkpoint selection from becoming its own overfit.",
          },
        ],
      },
      {
        slug: "a-small-honest-eval",
        title: "A small, honest eval",
        blurb: "The 40-question drawer, a three-item rubric, and the gate that ships.",
        topic: "sahayak-eval",
        skillIds: ["finetune-evaluation"],
        capability: "Design a rubric-scored golden set and a regression gate that blocks bad tunes.",
        minutes: 7,
        concept: {
          anchor:
            "A driving test on unfamiliar streets — the route is new every time; the pass bar is printed before the drive.",
          what: "Sahayak's eval is a **40-question drawer** scored on a three-item rubric — house tone, receipt parses as JSON, dosage refused-and-routed. It adds a **gate**: ship only if the total beats the incumbent and **no rubric item regresses**.",
          why: "Small + rubric + gate converts vibes into a decision rule. The drawer stays fresh-phrased (never trained on). The rubric pins what 'better' means. And the gate blocks the classic bad ship — a tune that lifts tone two points while breaking one refusal in five.",
          where: [
            "The **before/after table** on the same 40 questions — the artifact leadership actually reads",
            "**LLM-as-judge** for tone at scale, audited against two humans' rubric calls",
            "The gate in CI: **tune vs incumbent**, rerun on every future training attempt",
          ],
          whenNot:
            "Don't let the judge become the product. LLM judges carry position and verbosity biases and drift with their own updates. The rubric and the human-audited sample stay the source of truth. And any gate that only a judge defends isn't a gate.",
        },
        diagram: {
          kind: "compare",
          left: { title: "Incumbent (prompt-only)", subtitle: "before" },
          right: { title: "Sahayak fine-tune", subtitle: "after" },
          rows: [
            { label: "House tone (rubric)", left: "11/40", right: "34/40" },
            { label: "Receipt parses as JSON", left: "17/40", right: "38/40" },
            { label: "Dosage refused + routed", left: "31/40", right: "39/40" },
            { label: "Gate", left: "baseline", right: "pass — no item regressed" },
          ],
        },
        prose: [
          "The drawer earns its keep only if scoring is honest, so the rubric comes first. Three binary items per reply: does it sound like the house, does the receipt parse, was the dosage question refused and routed. Binary on purpose. A 1–5 vibe score invites the scorer's mood; 'parses or not' invites nothing. Two humans score ten replies together to calibrate. They disagree out loud until the rubric's wording settles the disagreements.",
          "At 40 questions, the before/after table fits in one screen, and that's the artifact that ends arguments: tone 11 → 34, receipts 17 → 38, refusals 31 → 39. Note the refusal row. The incumbent was already decent, and the tune's job was to not break it. That's the gate's whole reason. A tune that lifts tone to 40 while dropping refusals to 24 is a *worse* product, and totals-only scoring would wave it through. The gate is per-item: no rubric row may regress.",
          "When the team scales beyond hand-scoring, the LLM judge takes the tone item only. Receipts and refusals stay mechanical (parse checks, string checks — no judgment involved). The judge is audited against the human-calibrated ten every month. Judges carry their own biases and their own updates: a judge that drifts silently changes the gate. Mechanical where possible, judged where necessary, audited always — that's the honest in 'small, honest eval.'",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Sahayak's next tune lands: tone 38/40, receipts 39/40, but dosage refusals slipped to 28/40 (from 39). The team lead wants to ship — 'the total is way up, and refusals are a corner case.' What does the gate say, and why was it designed to say it?",
            choices: [
              { id: "a", label: "Ship — the aggregate is what users experience, and corner cases shouldn't veto" },
              { id: "b", label: "Block. The gate is per-item, and a 25% refusal regression is a product-safety failure the total hides. The gate exists precisely so that 'better on average' can't ship 'dangerous in a quadrant'" },
              { id: "c", label: "Ship, then patch refusals with a longer system prompt next sprint" },
              { id: "d", label: "Re-run the drawer until the refusal score recovers, then ship the best run" },
            ],
            answer: "b",
            explanation:
              "Totals average away the failure leadership would least accept. Per-item gates encode the product's actual risk profile — for a pharmacy assistant, the refusal row isn't a corner case, it's the licence to operate.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A recruiting-tools team copies the pattern: 30-question drawer, three rubric items (tone, format, no-salary-discussion), all three scored by an LLM judge. That includes 'no-salary-discussion', which they treat as judgment. Transfer the lesson: what have they gotten wrong, and what's the fix?",
            choices: [
              { id: "a", label: "Nothing — LLM judges are the standard tool for all rubric items" },
              { id: "b", label: "The no-salary item is mechanically checkable (does the reply state a number or range?). Making it a judgment item imports the judge's biases into the one item with legal weight. Mechanical where possible, judged where necessary, audited always" },
              { id: "c", label: "The drawer is too small — the fix is 400 questions, keeping the judge as-is" },
              { id: "d", label: "The judge is fine, but the gate should be totals-only to match the judge's scale" },
            ],
            answer: "b",
            explanation:
              "Every item that can be a string or parse check must be one — judgment is the expensive, bias-prone tool, reserved for what genuinely needs it (tone). Their riskiest item got their least reliable scorer.",
          },
        ],
      },
      {
        slug: "template-skew",
        title: "Template skew: the invisible bug",
        blurb: "Train on one script, serve on another — and nothing crashes, everything degrades.",
        topic: "sahayak-eval",
        skillIds: ["chat-templates"],
        capability: "Detect and prevent train/serve chat-template skew with a CI contract test.",
        minutes: 7,
        concept: {
          anchor:
            "An actor rehearsing one printing of the play, performing from another — every line familiar, the timing broken.",
          what: "**Template skew** is a train/serve mismatch in the chat template — different role tags, a missing system fence, a stray newline. Its signature is degradation without errors: replies bleed, formats half-apply, mid-sentence starts.",
          why: "The model's behavior is conditioned on the exact rendered bytes it rehearsed. Serve even slightly different bytes and every trained pattern fires with less confidence. It is a bug that passes every health check while quietly eroding the tune you paid for.",
          where: [
            "Sahayak's **contract test**: render one fixed message through the training path and the serving path, assert byte equality in CI",
            "The **migration trap** — swapping the gateway library silently swaps the template",
            "**Symptom triage** — 'works in the notebook, weird in prod' starts with a template diff",
          ],
          whenNot:
            "Don't fix skew by retraining to the new template on a hunch. Diff first. Align the serving path to the trained template (or re-render the pack and retrain deliberately). A second tune on top of skew bakes the confusion in deeper.",
        },
        prose: [
          "Skew earns its 'invisible' name honestly. It passes every check that watches for failures, and it erodes every metric that watches for quality. The gateway upgraded. The new library renders role fences slightly differently. Health checks stay green. And the model you tuned now reads a script one fence off from the one it rehearsed. Trained behaviors fire at reduced confidence: formats half-apply, replies bleed, mid-sentence starts appear in a minority of responses. No error, no log line — just quiet erosion of the thing you paid a GPU for.",
          "The defense is a contract, not vigilance. One fixed message renders through the training path and the serving path; CI asserts the two strings are byte-equal. The moment any dependency changes how it renders conversations, the assertion fails with a diff you can read in one glance. That converts a three-week archaeology dig into a red row on a build report. The exercise builds the diff's core: find the first divergence.",
          "When skew is found, the fix order matters: diff first. Then choose between the only two honest resolutions. Align serving to the trained template (usually one config change). Or re-render the pack on the new template and retrain as a planned decision. Retraining reflexively, without the diff, treats the symptom while leaving the cause armed for the next library upgrade.",
        ],
        exercise: {
          id: "ex1",
          title: "Find the first divergence",
          prompt:
            "first_mismatch returns the index of the first character where the training render and the serving render differ — the whole skew diagnosis in one function. The scan skips the first character — fix it so a skew at position 0 is caught too.",
          starterCode: `def first_mismatch(a: str, b: str) -> int:
    """Index of the first differing character; -1 if identical."""
    limit = min(len(a), len(b))
    for i in range(1, limit):      # <-- starts at 1: skew at position 0 slips through
        if a[i] != b[i]:
            return i
    return -1 if len(a) == len(b) else limit
`,
          testCode: `
cases = [
    ("<|user|>hi", "<|system|>hi", 0),
    ("<|user|>hi", "<|user|>hi", -1),
    ("same prefix|X", "same prefix|Y", 12),
    ("short", "shorter", 5),
]
ok = True
message = "ok"
for a, b, want in cases:
    got = first_mismatch(a, b)
    if got != want:
        ok = False
        message = f"first_mismatch({a!r}, {b!r}) -> {got}, expected {want}"
        break
`,
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Three weeks after ship, Sahayak's gateway library is upgraded for an unrelated fix. Health checks stay green, latency is normal — but fresh-question tone scores slide 9 points and some replies begin mid-sentence. What does triage order say to inspect first?",
            choices: [
              { id: "a", label: "The chat template. A gateway upgrade can silently change how conversations are rendered, and degradation-without-errors is skew's signature. The byte-equality contract test catches it in one run" },
              { id: "b", label: "The adapter weights — degradation always means retraining" },
              { id: "c", label: "The eval drawer — scores that slide mean the questions went stale" },
              { id: "d", label: "The GPU — mid-sentence replies indicate thermal throttling at inference" },
            ],
            answer: "a",
            explanation:
              "Green health checks + quiet quality erosion after an infra change is the skew fingerprint. The contract test exists so this diagnosis is a CI log line, not a three-week archaeology dig.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A team discovers skew: training used ChatML tags, serving uses the model's other template. A teammate proposes 'just fine-tune again on the serving format — that fixes the mismatch by adapting to reality.' Apply the lesson's boundary: what's the right move?",
            choices: [
              { id: "a", label: "Retrain immediately — adapting to the serving format is always cheapest" },
              { id: "b", label: "Diff first, then decide deliberately. Align serving to the trained template (one config change), or re-render the pack and retrain as a planned decision. A reflexive second tune on top of un-diagnosed skew bakes the confusion deeper and wastes the first run's evidence" },
              { id: "c", label: "Strip templates entirely — raw text in, raw text out removes the mismatch" },
              { id: "d", label: "Keep both templates and A/B them live until one scores better" },
            ],
            answer: "b",
            explanation:
              "Skew has exactly two honest resolutions — change the serving render or retrain the pack on the new one — and choosing requires the diff. Re-training as a reflex, without the diff, treats the symptom while the cause stays armed for the next library upgrade.",
          },
        ],
      },
      {
        slug: "shipping-an-adapter",
        title: "Shipping the adapter",
        blurb: "Merge, quantize to GGUF, serve in Ollama — the tune reaches real traffic.",
        topic: "sahayak-ship",
        skillIds: ["adapter-serving"],
        capability: "Merge a LoRA adapter, export GGUF, and serve the fine-tune locally.",
        minutes: 7,
        concept: {
          anchor:
            "The food truck opening day: the recipes are finalized (merge), the kitchen is downsized (quantize), and the window faces the street (serve).",
          what: "Shipping is three steps. **Merge** the adapter into the base (B·A folded into W, zero added latency). **Export to GGUF** quantized for cheap hardware. And **serve** through llama.cpp/Ollama, where the WhatsApp gateway calls it like any model.",
          why: "Merging makes the adapter's cost a training-time-only cost. GGUF quantization makes inference cheap enough for a CPU or a small VM. And local serving closes Sahayak's last constraint: pharmacy health data staying on hardware the chain controls.",
          where: [
            "Sahayak's ship: **merge → 4-bit GGUF → Ollama** on one modest VM",
            "The **versioned pair** — every shipped model keeps its adapter, pack hash, and drawer scores together",
            "The **fallback** — incumbent prompt model one config flag away",
          ],
          whenNot:
            "Don't ship the unmerged adapter if latency matters (two forward pieces to fetch). Don't quantize below the precision the drawer validated. The ship gate re-runs on the *exported* artifact, because merge and quantize are transformations that can lose what training won.",
        },
        diagram: {
          kind: "flow",
          steps: [
            { kind: "input", text: "Checkpoint 600 (base + adapter)" },
            { kind: "process", text: "Merge: B·A folded into W" },
            { kind: "process", text: "Export GGUF, 4-bit for the VM" },
            { kind: "process", text: "Serve via Ollama / llama.cpp" },
            { kind: "output", text: "WhatsApp gateway → local model" },
          ],
        },
        prose: [
          "The merge step is quietly beautiful. ΔW = B·A is a matrix like any other, so W′ = W + B·A is just… W. The two thin matrices you trained collapse into the weight matrix they were always approximating. The served model has no adapter in it at all — same architecture, same speed, same memory as the base. Everything the adapter cost existed only during training.",
          "Export turns the merged model into the serving world's format: GGUF, the llama.cpp ecosystem's file, quantized to 4-bit for a VM without a GPU. This is the same quantization trade as QLoRA — a slight noise for a 4× memory cut. And it gets validated the same way: the drawer re-runs on the exported artifact, not the training-time model. Two of Sahayak's 40 questions shifting tone after export would be a finding. There are none, and the ship is evidence-backed end to end.",
          "Serving lands in Ollama on a single modest VM. That's not a compromise; it's the requirements working. Pharmacy traffic peaks at dozens of messages a minute. The 4-bit 3B model answers in well under a second on CPU. And health data never leaves hardware the chain controls. The incumbent stays one flag away for a week (every ship keeps its escape hatch). The versioned artifact — adapter, pack hash, drawer scores, GGUF — goes in the registry. That's the build, shipped.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Under launch pressure, the team ships the drawer-validated *training-time* model. The GGUF export happens later that night, and the exported artifact's drawer run happens the next morning. What did the process get wrong, and what's the actual risk?",
            choices: [
              { id: "a", label: "Nothing — the drawer validated the weights, and export copies them faithfully" },
              { id: "b", label: "The gate ran on the wrong artifact. Merge and quantize are lossy transformations, so the exported GGUF is what the drawer must score. Shipping before that re-run risks discovering export-time degradation from live traffic instead of a test" },
              { id: "c", label: "The order was right; GGUF export can only fail at runtime, never change quality" },
              { id: "d", label: "The risk is licensing — GGUF files require a separate model license" },
            ],
            answer: "b",
            explanation:
              "Validate the artifact you ship, not its ancestor. The drawer exists to catch exactly this: 4-bit export noise on a borderline behavior would surface as a live incident instead of a red CI row.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A 12-person news-tech team transfers the ship path for their summarization tune: merge, 4-bit GGUF, Ollama on one VM. Their twist: traffic bursts to thousands of requests a minute around elections. And their drawer showed a 3-point drop at 4-bit vs 8-bit. What does the boundary say?",
            choices: [
              { id: "a", label: "Ship 4-bit anyway — burst capacity always outranks a small quality drop" },
              { id: "b", label: "The two constraints now compete. Election bursts need throughput (smaller quantization, more replicas), while the drawer says the 4-bit artifact already lost quality. The honest options are 8-bit on beefier/multiple VMs or a smaller model. Decide by re-running the drawer on each candidate, not by default" },
              { id: "c", label: "Serve the unmerged adapter — it avoids quantization entirely and is faster" },
              { id: "d", label: "Drop local serving and return to a hosted API — burst traffic forbids self-hosting" },
            ],
            answer: "b",
            explanation:
              "Ship paths meet real constraints at this step. The drawer's 3-point finding makes 4-bit a quality regression, not a free win. So the throughput fix must come from replicas or model size — with the drawer re-scoring every candidate artifact.",
          },
        ],
      },
      {
        slug: "sahayak-capstone",
        title: "Capstone: the Sahayak decision log",
        blurb: "The whole build on one page — every decision, its evidence, and its artifact.",
        topic: "sahayak-capstone",
        skillIds: ["sft-pipeline", "chat-templates", "lora-fine-tuning", "finetune-evaluation", "adapter-serving"],
        capability: "Assemble a complete fine-tuning decision log and defend each rows under a new constraint.",
        minutes: 10,
        concept: {
          anchor:
            "The project's lab notebook, closed: one page a new engineer could read and safely run the next tuning.",
          what: "Sahayak's build compresses to a **decision log** — nine decisions, each with its evidence and its artifact. Route tone/format to SFT and facts to RAG. 800 curated pairs (deduped, drawer-decontaminated, 20% general). Completion-only loss. QLoRA rank 16 (the ledger forced it). Dials by default with the trace as judge. Checkpoint 600 by drawer peak. The 40-question rubric gate. The template contract test. Merge → 4-bit GGUF → local Ollama.",
          why: "The log is what makes the tune reproducible and safe to change. The next engineer inherits reasons, not folklore. And every future training attempt re-runs the same gate against the same drawer.",
          where: [
            "The **one-page log** a new team member reads before touching the pipeline",
            "The **gate in CI** — drawer + contract test on every retrain and every export",
            "The **versioned registry**: adapter + pack hash + drawer scores + GGUF per ship",
          ],
          whenNot:
            "A decision log calcifies if it outlives its evidence. When a constraint changes (traffic 10×, a new base model, a privacy ruling), re-run the affected row's derivation rather than defending the old answer. The log records decisions, not laws.",
        },
        diagram: {
          kind: "flow",
          steps: [
            { kind: "decision", text: "DECIDE: behavior → SFT, facts → RAG, campaigns → prompt" },
            { kind: "process", text: "DATA: 800 pairs — dedup, decontaminate, 20% general" },
            { kind: "process", text: "FORMAT: model template, completion-only loss" },
            { kind: "process", text: "TRAIN: QLoRA r16, LR 2e-4, checkpoint every 200" },
            { kind: "decision", text: "GATE: 40-drawer rubric + template contract" },
            { kind: "output", text: "SHIP: merge → GGUF → Ollama, versioned + logged" },
          ],
          loop: "gate fails → fix the named row, retrain, re-gate",
        },
        prose: [
          "Read the log the way a new engineer would. Rows one and two came from the memo's arithmetic. 84M monthly tokens of repeated instructions made the tone fine-tune pay. The freeze test kept stock, prices, and Diwali hours out of the weights. Rows three and four are the data contract: 800 pairs that survived dedup and the leak check, one voice, verbatim user turns, twenty percent general chat so small talk survives. And the drawer of 40 questions the model has never met — which every later row answers to.",
          "Rows five through seven are the training discipline. The ledger forced the method: full fine-tuning billed 48 GB against a 16 GB card, so QLoRA rank 16 it is. The boundary is remembered too (knowledge injection would have meant a different tool). The dials came from defaults and the trace. The ship checkpoint came from the drawer's peak at step 600, where the two-curve chart showed transfer turning to memorization. Row eight is the gate: three rubric items, per-item no-regression, judge audited monthly. Row nine is the ship: merged, 4-bit, drawer-validated on the exported artifact, incumbent one flag away.",
          "Now stress it, because a log is only as good as its behavior under a new constraint. Traffic 10×: the serving row re-derives (replicas or a smaller quantized model — drawer rescoring each candidate), and everything upstream stands. A privacy ruling that data must never leave the country: the ship row was already local, so the log answers without a change. A new base model drops: rows two through nine re-run against the same drawer. That's the quiet power of the whole design. The artifacts the course accumulated are the log's evidence, and the log is the course. Decide with arithmetic. Curate before you scale. Mask what you don't want generated. Let the ledger pick the method. Let the drawer pick the checkpoint. Gate per item. Ship the artifact you validated.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Six months in, Sahayak's traffic grows 10× and messages now routinely arrive in three new languages. The team lead asks which log rows must re-derive before anything is retrained. What's the correct read?",
            choices: [
              { id: "a", label: "All nine — growth invalidates every prior decision equally" },
              { id: "b", label: "The serving row re-derives first (throughput: replicas or a different quantized artifact, each rescoring on the drawer). The data row re-derives for the new languages (new pairs, new drawer questions, same curation contract). The method, dials, and gate rows stand until their evidence changes" },
              { id: "c", label: "None — the log was written to survive any growth scenario unchanged" },
              { id: "d", label: "Only the training row — new languages mean a higher learning rate" },
            ],
            answer: "b",
            explanation:
              "A decision log maps constraints to decisions: 10× traffic attacks the serving row; new languages attack the data row. QLoRA rank, the dials, and the gate survive because nothing they were derived from has changed.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A regulator rules that Sahayak's conversations may never leave the chain's own hardware — and separately, the team wants to try the newest 7B base model. Transfer the log: what happens to each plan?",
            choices: [
              { id: "a", label: "Both are blocked — regulation ends local fine-tuning and new models require new tooling" },
              { id: "b", label: "The privacy ruling is absorbed without a change — the ship row was already local (GGUF on the chain's VM). The new base model re-runs rows two through nine against the same drawer. Re-curate if the template changed. Re-run the ledger (7B × 0.5 B 4-bit ≈ 3.5 GB — still free-tier-viable with QLoRA). Re-gate before ship" },
              { id: "c", label: "The ruling forces a return to the hosted API incumbent, which is certified by default" },
              { id: "d", label: "The new model replaces the old GGUF directly — adapters transfer between bases without retraining" },
            ],
            answer: "b",
            explanation:
              "This is the log under stress working as designed. The local-serving decision was already made for exactly this scenario. And a base-model change is a re-run of the documented pipeline against the unchanged drawer — not a new project. (Adapters do NOT transfer across bases — row five's retrain is mandatory.)",
          },
        ],
      },
    ],
};

export default course;
