import type { Course } from "../types";

const course: Course = {
    slug: "harness-engineering-foundations",
    title: "Harness Engineering Foundations",
    subtitle:
      "What sits around an AI model — prompts, context, tools, and loops — in simple pictures.",
    description:
      "The beginner's map of harness engineering: the scaffolding that turns a raw model into a working AI product. Seven lessons use simple pictures to teach prompts, context windows, tools, and agent loops. The course ends with the judgment to know when not to build an agent at all.",
    level: "beginner",
    domain: "AI Engineering",
    access: "free",
    prerequisites:
      "None — curiosity is enough. Want the model basics first? Take Machine Learning for Layman as a friendly companion course.",
    lessons: [
      {
        slug: "what-is-an-ai-harness",
        title: "What is an AI Harness?",
        blurb: "The model is the engine. The harness is everything built around it.",
        topic: "harness-foundations",
        skillIds: ["harness-basics"],
        capability: "Separate the AI model from the harness that turns it into a working product.",
        minutes: 5,
        concept: {
          anchor: "A harness is the rest of the car built around the engine. The wheels, dashboard, and brakes make it drivable.",
          what: "An **AI harness** is the scaffolding around a model. It is the **instructions, memory, tools, and rules** that turn a text predictor into a working assistant.",
          why: "A raw model can't remember, act, or stay current. Nearly everything people call “the AI” in a product is **harness engineering**, not the model.",
          where: [
            "A **coding assistant** that reads your files and runs commands. The harness gives the model those hands",
            "A **support chatbot** that checks a real order. The harness wires up the lookup tool",
            "A **phone assistant** that sets alarms. The harness turns the words into actions",
          ],
          whenNot:
            "Some tasks need **no memory, no tools, and no rules**. A one-shot ask like “rewrite this sentence” barely needs a harness at all.",
        },
        diagram: {
          kind: "flow",
          steps: [
            { kind: "input", text: "User request" },
            {
              kind: "process",
              text: "Harness assembles instructions + history + tools + rules",
              caption: "this package is the context",
            },
            { kind: "process", text: "Model predicts the next text" },
            { kind: "output", text: "Grounded answer or real action" },
          ],
        },
        prose: [
          "A chatbot greets you by name on the second message. It checks your real order and books the table. Everyone says “the AI did it.” That sentence hides a trap. The model inside is a brilliant **engine bolted to a bench**. An engine, however powerful, drives nobody. What you actually used was the whole **car** built around it — the **harness**.",
          "It is tempting to think the model alone is the product. Watch it fail. Remembering a name across messages, checking a real order, booking a real table — a text predictor cannot do any of these alone. Engines don't drive. Cars drive. The harness supplies what the bench engine lacks. **Instructions** tell the model who to be. **Memory** feeds the conversation back in on every turn. **Tools** let a thing that can only write text cause real actions. **Rules** keep everything inside safe limits.",
          "Strip the metal away and one plain idea is left. Nearly everything people call “the AI” in a product is the **car, not the engine**. That car is harness engineering. Where the analogy breaks: a dashboard never changes an engine's power. But a harness changes what the model *does*. New instructions, new behavior, same engine. That split is the mental map for this course. When something works or fails, ask: *which part of the car did that?*",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Two support assistants run the exact same model. Assistant A still remembers the customer's name two messages later. It can also check a real order. Assistant B forgets at once and checks nothing. A teammate concludes, 'A must have a better model.' What's the better explanation?",
            choices: [
              {
                id: "a",
                label: "A has a better harness. History and lookup tools are wired around the same model",
              },
              {
                id: "b",
                label: "A's model was trained on this customer's data, so it remembers them",
              },
              {
                id: "c",
                label: "B's model is identical, so the difference must come from lucky wording",
              },
            ],
            answer: "a",
            explanation:
              "Memory across turns and real order lookups are harness jobs. The harness re-feeds the history and executes the tools. Same engine, different car. The teammate is praising the engine for work done by the dashboard and wheels.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A smart speaker hears 'add milk to my shopping list'. Milk really does appear in the list app on your phone. Which split of the credit is correct?",
            choices: [
              {
                id: "a",
                label: "The model predicted the words. The harness turned them into a real list action",
              },
              {
                id: "b",
                label: "The model opened the list app by itself and typed the entry",
              },
              {
                id: "c",
                label: "The microphone hardware detected the word 'milk' and added it directly",
              },
            ],
            answer: "a",
            explanation:
              "A model can only produce text. It has no hands. Something must translate 'add milk' into an app action. That something is the harness. It executes the intent as a real tool call.",
          },
        ],
      },
      {
        slug: "raw-model-vs-product",
        title: "Why a Raw Model Isn't a Product",
        blurb:
          "No memory between turns, no hands, frozen knowledge — until a harness closes all three gaps.",
        topic: "harness-foundations",
        skillIds: ["harness-basics"],
        capability:
          "Name the three gaps (memory, action, fresh knowledge) a harness must close before a model ships.",
        minutes: 4,
        concept: {
          anchor: "On its own, the model is a genius with amnesia. It has no hands, and only yesterday's newspaper to read.",
          what: "A raw model does one thing: predict text from what's in front of it. It has **no memory between requests**, **no ability to act**, and **knowledge frozen at training time**.",
          why: "Products feel reliable because the harness quietly closes these gaps. It re-feeds the history, executes tools, and fetches fresh facts.",
          where: [
            "A chatbot that greets you **by name on the second message**. The harness resends the history",
            "A travel assistant that checks **today's flight prices**. The harness runs the lookup",
            "An email helper that actually **moves a message to a folder**. The harness performs the action",
          ],
          whenNot:
            "Don't judge a model by a bare playground chat. If your test needs **memory, actions, or current facts**, you are really testing the harness.",
        },
        diagram: {
          kind: "compare",
          left: { title: "Raw model on a bench", subtitle: "one text in, one text out" },
          right: { title: "Model inside a harness", subtitle: "surrounded by engineering" },
          rows: [
            {
              label: "Memory",
              left: "every request starts from zero",
              right: "harness re-feeds the conversation",
            },
            {
              label: "Actions",
              left: "writes words, does nothing",
              right: "harness executes real tools",
            },
            {
              label: "Knowledge",
              left: "frozen on training day",
              right: "harness fetches today's facts",
            },
            {
              label: "Where to use",
              left: "one-shot text tasks",
              right: "anything user-facing",
            },
            {
              label: "When NOT to use",
              left: "as a product without a harness",
              right: "when one bare call would suffice",
            },
          ],
        },
        prose: [
          "Try a raw model in a bare playground. It looks broken. Every message starts from nothing. There is **no memory** of what came before. Ask about today and it answers from **frozen training knowledge**. The answer is confident — and wrong. Ask it to *do* anything, and it can only describe the doing. A raw model is a **genius with amnesia, no hands, and yesterday's newspaper**. It is brilliant at one thing and missing three.",
          "The live product built on that same model remembers, acts, and stays current. The difference is engineered, turn by turn. The harness **re-feeds the conversation** so nothing is forgotten. It **runs tools** for anything that must actually happen. It **retrieves fresh facts**. It puts those facts in front of the model before it answers.",
          "Fade the genius away and one line remains. The raw model has fixed gaps. The harness is the machinery that re-closes those gaps on every single request. Where the analogy breaks: a person with amnesia could take notes and slowly improve. A model never improves. So the harness must re-supply the same missing things forever. The playground didn't expose a broken engine. It unbolted the engine from its car and then wondered why it wouldn't drive.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A QA engineer tries the team's chatbot in a bare model playground. The engineer files a bug: 'It forgets my name one message later. The model is broken.' The same model powers the live chatbot. The live chatbot remembers names perfectly. What's going on?",
            choices: [
              {
                id: "a",
                label: "The playground hides the harness. The live product re-feeds history that the bare model never sees",
              },
              {
                id: "b",
                label: "The live product secretly swaps in a different, larger model",
              },
              {
                id: "c",
                label: "The model only remembers names when many people chat at once",
              },
            ],
            answer: "a",
            explanation:
              "Bare playground calls carry no conversation history. Each request is the model's first. The live harness resends that history every turn. The engineer's test setup removed exactly that piece.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A museum wants a kiosk that answers questions about today's special exhibits and current opening hours. Its model finished training two years ago. What must the harness do?",
            choices: [
              {
                id: "a",
                label: "Fetch today's exhibit and hours data with a tool or lookup, and place it in the model's context",
              },
              {
                id: "b",
                label: "Politely ask the model to update its knowledge about the museum",
              },
              {
                id: "c",
                label: "Nothing — opening hours change so slowly that the model already knows them",
              },
            ],
            answer: "a",
            explanation:
              "Training-time knowledge is frozen. Asking can't unfreeze it. Today's hours must arrive at answer time. The harness fetches them and puts them in the window. The model then answers from what it can actually see.",
          },
        ],
      },
      {
        slug: "what-is-a-prompt-really",
        title: "What is a Prompt, Really?",
        blurb: "The prompt is the harness's control surface — role, rules, examples, format.",
        topic: "prompting",
        skillIds: ["prompt-fundamentals", "harness-basics"],
        capability:
          "Structure a prompt with role, rules, examples, and output format — and know it steers the same model differently.",
        minutes: 5,
        concept: {
          anchor: "A prompt is the note you leave a new babysitter. The note says who they are, the house rules, and what a good job looks like.",
          what: "A **prompt** is the instruction package the harness sends the model. It has four parts: **role** (who to be), **rules** (how to behave), **examples** (what good looks like), and **format** (the shape of the answer).",
          why: "The same model behaves like a toy or a professional, depending on this package. The prompt is the **cheapest dial** the engineer controls. No retraining is needed.",
          where: [
            "A **support bot's** instructions set it up as a polite agent that never promises refunds",
            "A **data extractor** shown two finished examples so its output is consistent JSON",
            "A **writing assistant** told to answer in exactly three bullet points",
          ],
          whenNot:
            "Prompts steer behavior. They can't add **knowledge the model lacks**. They can't guarantee rule-following under pressure either. That takes tools and guardrails, not more words.",
        },
        diagram: {
          kind: "flow",
          steps: [
            { kind: "input", text: "Task from the user" },
            {
              kind: "decision",
              text: "Harness wraps it: role + rules + examples + format",
            },
            { kind: "process", text: "Model reads the whole package" },
            { kind: "output", text: "Answer in the requested shape" },
          ],
        },
        prose: [
          "You ask an assistant “help me with emails” and get a vague reply. Your teammate's assistant runs the same model. It drafts clean, well-formatted replies. The difference is not the engine. It is the **note you leave a new babysitter**. The note says who they are (the role), the house rules, one example of a job well done, and the shape of the handover. A prompt is that note, written for a model.",
          "Notice the common reflex: when output turns inconsistent, people reach for retraining. But the model was not missing knowledge. It was missing **settings**. There are four settings. **Role** sets who the model is being. **Rules** set the boundaries it must hold. **Examples** show one or two finished answers. Examples are the single fastest way to make output consistent. **Format** fixes the shape: bullets, a table, or strict JSON.",
          "Strip the note away and the plain idea is this: a prompt is **settings, not a spell**. It is the cheapest behavior change in the whole harness — an afternoon's work. Where the analogy breaks: a babysitter remembers your house rules by next weekend. The model re-reads the note fresh on every turn. It can still break a rule under pressure. And no note teaches facts the model never learned. Prompts move behavior, not knowledge. That's why the harness backs its serious rules with **tools and checks**, not more words.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A product team's data extractor returns messy, inconsistent JSON from the same model every week. A teammate proposes weeks of model retraining. What's the first, cheapest fix to try?",
            choices: [
              {
                id: "a",
                label: "Add two finished examples and an exact output format to the prompt",
              },
              {
                id: "b",
                label: "Retrain the model on a year of corrected extractions",
              },
              {
                id: "c",
                label: "Ask users to type their data more clearly",
              },
            ],
            answer: "a",
            explanation:
              "Examples plus format is the prompt's strongest consistency lever. It costs an afternoon, not weeks. Jumping to retraining skips the cheapest dial in the harness. Retraining may not even be needed.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A new hire writes the system prompt for a tax-help chatbot as a single line: 'help with taxes.' Users start receiving confident, made-up advice. Which missing piece causes the most damage?",
            choices: [
              {
                id: "a",
                label: "No role and no rules. Nothing tells the bot to cite official sources or admit its limits",
              },
              {
                id: "b",
                label: "No format — the answers should have been bullet points",
              },
              {
                id: "c",
                label: "No examples — the bot never saw a sample answer",
              },
            ],
            answer: "a",
            explanation:
              "Format and examples shape presentation. Role and rules shape conduct. A confident, made-up answer is a conduct failure. Nothing in the prompt set the bot's boundaries. Nothing told it when to say 'I'm not sure, check the official source.'",
          },
        ],
      },
      {
        slug: "what-is-a-context-window",
        title: "What is a Context Window?",
        blurb:
          "The model's working memory. It sees only what is inside the window, and old items fall out.",
        topic: "context",
        skillIds: ["context-window-basics"],
        capability:
          "Explain the context window as working memory and why harnesses manage what goes in.",
        minutes: 5,
        concept: {
          anchor: "Picture the model's desk. Only what is on it right now exists. Old papers slide off as new ones land.",
          what: "The **context window** is everything a model can see on a given turn: **instructions**, the **conversation so far**, and **tool results**. Its size is measured in **tokens** (the small chunks text is split into).",
          why: "The window is **finite**. As a conversation grows, something must fall out or be squeezed. That is why long chats 'forget' their start unless the harness manages what stays.",
          where: [
            "A **long customer chat** losing the order number from message one. It fell out of the window",
            "A **document assistant** that can only take so many pages. The document must fit inside the window",
            "An **agent** whose tool results pile up. The harness summarizes them to save space",
          ],
          whenNot:
            "Don't treat the window like a **database**. It isn't searchable storage. Anything not currently inside the window does not exist for the model.",
        },
        diagram: {
          kind: "flow",
          steps: [
            { kind: "input", text: "Instructions + history + tool results" },
            { kind: "process", text: "Harness fills the finite window" },
            { kind: "output", text: "What the model sees this turn" },
          ],
          loop: "each new turn re-fills the window — old content falls out",
        },
        prose: [
          "Somewhere around message forty, a long support chat goes strange. The assistant asks for details the customer already sent. Nothing was deleted. Nobody fell asleep. Picture the model at a **desk**. Everything it “knows” right now is what's on the desk: instructions, the conversation so far, and tool results pasted in. That desk is the **context window**. It has fixed, finite space.",
          "Here is where intuition fails. You would expect the desk to grow with the chat. It never does. Every turn, the harness rebuilds the desk from scratch. When space runs out, the **oldest papers slide off**. The early message still sits in the chat log. It just isn't in front of the model on that turn. So for the model, it effectively never happened. Hence the desk-keeping you will meet all through this course: trimming old turns, **summarizing** long history into short notes, and pinning critical facts so they can't slide.",
          "Fade the desk to one line. The window is the model's whole world for that turn. Whatever isn't on the desk does not exist. Where the analogy breaks: papers on a real desk stay put until someone clears them. This desk is **rebuilt every turn**. So “falling off” really means “never put back”. And the model can't search a drawer for what fell. The model can't manage its own desk. The harness is its secretary.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Twenty minutes into a customer chat, the assistant asks, 'Sorry — which order number?' The customer gave it in their very first message. Nothing was deleted from the chat log. What best explains this?",
            choices: [
              {
                id: "a",
                label: "The early message fell out of the context window as the chat grew. Nothing re-fed it",
              },
              {
                id: "b",
                label: "The model is programmed to double-check order numbers every twenty minutes",
              },
              {
                id: "c",
                label: "The customer's first message was too long for the model to read",
              },
            ],
            answer: "a",
            explanation:
              "The window is rebuilt every turn. Old content falls out when space runs out. The data still exists in the log. But on that turn it wasn't in front of the model. So for the model, it didn't exist.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A legal assistant must summarize 900-page contracts. But only about 300 pages fit in its context window at once. Which harness approach fits how windows really work?",
            choices: [
              {
                id: "a",
                label: "Work section by section. Carry short running notes forward instead of the full text",
              },
              {
                id: "b",
                label: "Tell the model to read faster so all 900 pages fit",
              },
              {
                id: "c",
                label: "Paste all 900 pages anyway. The window stretches to fit what you send",
              },
            ],
            answer: "a",
            explanation:
              "The window is fixed space, not a rubber band. Nothing makes 900 pages fit at once. Section-by-section work plus summarized notes keeps each turn inside the limit. The important facts still travel forward.",
          },
        ],
      },
      {
        slug: "how-models-use-tools",
        title: "How Do Models Use Tools?",
        blurb:
          "The model never runs anything. It fills in a request, and the harness does the work.",
        topic: "tools",
        skillIds: ["tool-use-basics"],
        capability:
          "Describe the tool handshake: the model sends a structured request, the harness executes it, and the result returns to the context.",
        minutes: 5,
        concept: {
          anchor: "Using a tool is like handing the waiter your scribbled order. The model writes the note. The harness carries it to the kitchen.",
          what: "A **tool** is an ability the harness offers the model: search, a calculator, an email sender. The model sends a structured **tool request** (name + arguments). The **harness executes it** and feeds the result back.",
          why: "The model has no hands. It only produces text. Tools let a text predictor act on the real world **without ever running anything itself**.",
          where: [
            "A **weather assistant** calling `get_forecast` with a city and date",
            "A **coding assistant** requesting `read_file` before it suggests an edit",
            "A **booking bot** calling `check_availability` and offering real slots",
          ],
          whenNot:
            "The model can only use tools the harness **offered it in context**. It cannot invent one. Letting invented calls through unchecked is a **security hole**, not magic.",
        },
        diagram: {
          kind: "flow",
          steps: [
            { kind: "input", text: "User question" },
            {
              kind: "decision",
              text: "Model emits a tool request: name + arguments",
            },
            { kind: "process", text: "Harness checks and executes the real action" },
            { kind: "process", text: "Result pasted back into the context" },
            { kind: "output", text: "Model answers with the facts" },
          ],
          loop: "repeat until the model has what it needs",
        },
        prose: [
          "The moment that feels like magic — an assistant quotes a live fact that is newer than its training — is really a handshake. Learn its steps and the magic dissolves. The model never runs anything. It has no hands. Using a tool is **handing the waiter your scribbled order**. The model writes the note: a tool name plus arguments, like `get_forecast(city=\"Lisbon\")`. And the note is just text.",
          "The **harness** carries it to the kitchen. It checks that the tool exists and the arguments make sense. It runs the real action. It pastes the result — `22°C, sunny` — back into the model's context. Only then does the model answer. Now it has facts it can literally see.",
          "Strip the restaurant away and the idea is one line. The model sends structured requests. The harness executes them and feeds results back. That loop is all “tool use” ever is. Where the analogy breaks: a waiter who knows the menu would never order a dish the kitchen can't make. The model will confidently write a call to a tool it was never offered. It may also send a broken argument along the way. Because the model only ever *asks*, the harness is the checkpoint. It decides **which tools exist**. It **validates every request**. It can refuse anything suspicious.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "At a demo, an assistant appears to search the web live. It quotes what it found. A new engineer says, 'Impressive — the model ran a web search by itself.' What actually happened?",
            choices: [
              {
                id: "a",
                label: "The model sent a structured search request. The harness executed it and fed the results back",
              },
              {
                id: "b",
                label: "The model has a built-in browser it opens directly",
              },
              {
                id: "c",
                label: "The search results came from the model's training data",
              },
            ],
            answer: "a",
            explanation:
              "A model can only produce text. That includes text that looks like `search(\"...\")`. Something outside the model must run it. The demo's harness did the searching. The model did the asking and the answering.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "You're designing a package-tracking bot. In testing, the model sometimes fills in a tracking ID with one digit missing. The lookup then fails downstream. Where should the system catch that?",
            choices: [
              {
                id: "a",
                label: "In the harness. Validate the tool request's arguments before executing anything",
              },
              {
                id: "b",
                label: "In the model — it should notice its own mistakes and retry silently",
              },
              {
                id: "c",
                label: "In the customer — ask them to retype the number correctly first",
              },
            ],
            answer: "a",
            explanation:
              "The handshake has a built-in checkpoint. Between the model's request and the real action sits the harness. It is the natural place to check arguments (format, length, existence). Models can't check themselves reliably. And customers already gave correct input.",
          },
        ],
      },
      {
        slug: "the-agent-loop",
        title: "What is the Agent Loop?",
        blurb: "Think, act, observe, repeat — until the goal is reached or the budget says stop.",
        topic: "agents",
        skillIds: ["agent-loops", "tool-use-basics"],
        capability:
          "Trace the think–act–observe cycle and explain why every loop needs a stopping budget.",
        minutes: 6,
        concept: {
          anchor: "The agent loop is a treasure hunt with a curfew. Take a step, read the clue, go again. But stop when the whistle blows.",
          what: "An **agent** runs a loop: **think** (decide the next step), **act** (call a tool), **observe** (read the result). The loop repeats until the task is done. Or a **budget** (a step or cost limit) stops it.",
          why: "One model call can't handle unpredictable work. The loop lets the model **react to what it finds**. But without a stopping rule, it can spin forever and burn money.",
          where: [
            "A **coding agent** reading a file, editing, running tests, then fixing what failed",
            "A **research assistant** searching, reading, and searching again until it can answer",
            "A **support agent** checking the order, then the refund policy, then replying",
          ],
          whenNot:
            "If you can script the exact steps in advance, skip the loop. A **fixed pipeline** is cheaper and faster, and it can't wander off.",
        },
        diagram: {
          kind: "decision",
          root: {
            kind: "decision",
            question: "After every step, the harness checks:",
            branches: [
              {
                label: "goal reached",
                node: { kind: "leaf", answer: "Return the final answer" },
              },
              {
                label: "budget spent",
                node: {
                  kind: "leaf",
                  answer: "Stop — return the best answer so far",
                  caption: "the brake every loop needs",
                },
              },
              {
                label: "neither",
                node: { kind: "leaf", answer: "Loop again: think → act → observe" },
              },
            ],
          },
        },
        prose: [
          "Everything in this course so far happens in **one turn**. Now take a task whose steps nobody can script: “find out why returns spiked”. You are now on a **treasure hunt**: take a step, read the clue, go again. The agent loop is the harness running that hunt. **Think**: what's my next step? **Act**: call a tool. **Observe**: read what came back. Then around again. A coding agent lives here. It reads the file, edits, runs the tests, sees two failures, and edits again.",
          "The power of the hunt is that each step reacts to the last. Its danger is exactly the same. Some clues never say stop. “Find the *best* answer” can always justify one more search — deeper into the hunt, the bill climbing, no answer coming. A treasure hunt needs a **curfew**: a maximum number of steps or a cost limit. When the whistle blows, the harness stops the loop. It returns the best answer so far. The budget is not bolted on afterwards. It is what makes the loop shippable.",
          "Fade the hunt to its skeleton: think → act → observe, repeat, stop on goal *or budget*. That is every agent ever shipped. Where the analogy breaks: a treasure hunt has a real map, and a referee can verify the treasure. An agent's “goal reached” is the model's own claim. The hunter can't be trusted to call the hunt done. That's why the whistle, not the hunter, gets the final word. A loop that can always stop is a tool. A loop that can't stop is an outage with a countdown.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A research agent is asked to 'compare these three laptops.' Forty tool calls later, it is still searching. The bill keeps climbing. No answer ever comes. What was missing?",
            choices: [
              {
                id: "a",
                label: "A stopping budget. It is a step or cost limit that halts the loop and returns the best answer so far",
              },
              {
                id: "b",
                label: "A bigger model that searches faster",
              },
              {
                id: "c",
                label: "More tools. With sixty tools it would finish sooner",
              },
            ],
            answer: "a",
            explanation:
              "The loop never ended because nothing could end it. “Compare thoroughly” always justifies one more search. A budget is the engineered brake. It turns an endless loop into a delivered answer.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A coding assistant reads a file, edits it, and runs the tests. It sees two failures and edits again. Then it stops and reports a fix. Which pattern is it running, and what are the test results?",
            choices: [
              {
                id: "a",
                label: "The agent loop — think, act, observe. The test results are the observations",
              },
              {
                id: "b",
                label: "A fixed pipeline — the same three steps would run for every task",
              },
              {
                id: "c",
                label: "A single call — one big prompt predicted the whole fix at once",
              },
            ],
            answer: "a",
            explanation:
              "The second edit exists *because* of what the test run showed. No fixed sequence produces that behavior. That's the loop's signature: the next step reacts to the last observation.",
          },
        ],
      },
      {
        slug: "when-not-to-build-an-agent",
        title: "When NOT to Build an Agent",
        blurb:
          "Use the least machinery that works: pipeline, single call, or agent. Try them in that order.",
        topic: "agents",
        skillIds: ["agent-vs-pipeline"],
        capability:
          "Choose between a fixed pipeline, a single model call, and an agent for a given task.",
        minutes: 6,
        concept: {
          anchor: "Pick the machinery the way you pick transport. For the daily commute, a bus route beats a taxi, and a taxi beats a helicopter.",
          what: "Before building an agent, check the two cheaper designs: a **fixed pipeline** (known steps, scripted once) or a **single model call** (one question, one answer). Agents are worth it only when the **path can't be written in advance**.",
          why: "Agents pay for their flexibility in **latency (the wait time for a response)**, cost, and reliability. Every loop step is another model call that can wander or fail.",
          where: [
            "Nightly **photo resizing**. The same steps every time: a pipeline",
            "Answering **'what's your return policy?'** One call, with the policy in context",
            "**Investigating why returns spiked**. The steps are unpredictable: real agent work",
          ],
          whenNot:
            "If you can list the steps at design time, and they never change per input, an agent is the **wrong** tool. You are paying for flexibility you don't use.",
        },
        diagram: {
          kind: "decision",
          root: {
            kind: "decision",
            question: "Can you script the exact steps in advance?",
            branches: [
              {
                label: "yes",
                node: {
                  kind: "leaf",
                  answer: "Fixed pipeline",
                  caption: "cheap, fast, predictable",
                },
              },
              {
                label: "no",
                node: {
                  kind: "decision",
                  question: "Does it need tools or more than one step?",
                  branches: [
                    {
                      label: "no",
                      node: {
                        kind: "leaf",
                        answer: "Single model call",
                        caption: "cheapest of all",
                      },
                    },
                    {
                      label: "yes",
                      node: {
                        kind: "leaf",
                        answer: "Agent loop + budget",
                        caption: "flexible — and priced accordingly",
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        prose: [
          "The most expensive bug in AI engineering isn't a broken agent. It's an **unnecessary** one. Picking machinery is **picking transport**. For the daily commute, the scheduled **bus** (a **fixed pipeline** — the same known steps every time) beats the **taxi** (a **single model call** — one question, one answer). And the taxi beats the **helicopter** (an **agent** — flexible, but loud, pricey, and able to go anywhere, including the wrong place). Paying for rotor flexibility on a bus-route task isn't ambition. It's the bug.",
          "The whole test is one question: **can the path be written in advance?** Nightly photo resizing means the same steps every night, scripted once. That's a bus. “What's your return policy?” is one question, one answer. That's a taxi. “Investigate why returns spiked” — there, the next step depends on what the last one found. That's a helicopter, genuinely.",
          "Strip the vehicles away: climb **pipeline → single call → agent** and stop at the first rung that works. Where the analogy breaks: a helicopter is merely expensive. An agent is expensive *and* less predictable than the bus. Its signature failure is wandering confidently off the route, not just the bill. So when a teammate proposes an autonomous agent for a task you can script, saying “a pipeline will do” is not weakness. It is the senior judgment this course exists to build.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Your team must translate the day's new product descriptions into four languages every night. A consultant proposes an autonomous agent for the job. What's the right call?",
            choices: [
              {
                id: "a",
                label: "A fixed pipeline. The steps are known and identical every night. An agent adds cost and risk for nothing",
              },
              {
                id: "b",
                label: "An agent. Agents are the modern approach and more reliable by default",
              },
              {
                id: "c",
                label: "A single model call — one prompt can translate everything with no checks",
              },
            ],
            answer: "a",
            explanation:
              "The path is fully scriptable: same steps, every input, every night. That is the pipeline's natural home. An agent would buy zero flexibility. It would add latency, cost, and a loop that can wander.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Support asks for a feature: 'explain why this week's returns look weird.' The analysts admit they can't script the steps. It might need order lookups, review reads, refund-policy checks — whatever comes up. Which design fits?",
            choices: [
              {
                id: "a",
                label: "An agent loop with tools and a budget. The path depends on what it finds",
              },
              {
                id: "b",
                label: "A fixed pipeline using the steps the analyst tried last time",
              },
              {
                id: "c",
                label: "A single model call with no tools. It can reason out the answer from memory",
              },
            ],
            answer: "a",
            explanation:
              "The unscriptable path is the agent's defining test: each step depends on the last finding. Last time's steps hard-code one path through a maze. And without tools, a single call has no facts to reason over. It has just frozen training knowledge.",
          },
        ],
      },
    ],
};

export default course;
