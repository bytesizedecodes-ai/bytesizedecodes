import type { Course } from "../types";

const course: Course = {
    slug: "rag-engineering-foundations",
    title: "RAG Engineering Foundations",
    subtitle:
      "How AI answers from your documents — retrieval, embeddings, and the pipeline, in plain pictures.",
    description:
      "A beginner's map of retrieval-augmented generation. Learn why models need the right page handed to them. See how embeddings (meaning coordinates for text) turn meaning into a map. Watch search pick the top few pages. And learn when not to build RAG at all. Seven picture-led lessons end with one judgment: paste, query, or retrieve.",
    level: "beginner",
    domain: "AI Engineering",
    access: "free",
    prerequisites:
      "None — curiosity is enough. If you also want the bigger setup around RAG, Harness Engineering Foundations is a friendly companion course.",
    lessons: [
      {
        slug: "what-is-rag",
        title: "What is RAG?",
        blurb:
          "The model takes the exam either way — RAG decides whether it gets the book.",
        topic: "rag-foundations",
        skillIds: ["rag-basics"],
        capability: "Explain RAG as an open-book setup: retrieve the page, put it in front of the model, answer with a source.",
        minutes: 4,
        concept: {
          anchor:
            "It's an open-book test — someone hands the student the right page before every answer.",
          what: "**RAG (Retrieval-Augmented Generation)** gives a model an open-book exam. Before the model answers, a pipeline **finds the right pages** in your documents. Then it **puts those pages in front of the model**.",
          why: "From memory alone, a model guesses. It sounds fluent and confident. Often it quotes some other company's policy. With the right page in its context, the same model answers **exactly, with current facts, and with a source to cite**.",
          where: [
            "A **support assistant** answering from the company's real policy pages",
            "A **docs bot** that answers “how do I configure auth?” with a cited doc section",
            "A **legal assistant** quoting the actual contract clause, not a remembered one",
          ],
          whenNot:
            "If the knowledge is **tiny and static**, skip RAG. One handbook that never changes can simply be pasted into the window. Retrieval there would be extra work for nothing.",
        },
        diagram: {
          kind: "flow",
          steps: [
            { kind: "input", text: "User question" },
            { kind: "process", text: "Find the relevant pages", caption: "retrieval" },
            { kind: "process", text: "Pages into the context window", caption: "augmented" },
            { kind: "output", text: "Answer grounded in the page" },
          ],
        },
        prose: [
          "A model on its own is a brilliant student taking a **closed-book exam**. Ask about your refund policy. It answers from everything it ever read — including other companies' refund policies. The answer sounds right because the model is fluent. But you cannot trust it, because the source is memory.",
          "RAG changes the exam, not the student. Before the model answers, a pipeline **retrieves** the right pages from your documents. It places them in the model's context window. Now the same model answers with an **open book**. The answer comes from the page in front of it, and the model can point to that page. Where the analogy breaks: a student with the *wrong* page will say “this doesn't cover it”. A model with the wrong page answers anyway, just as fluently. That is why lesson 6 teaches you to check which page arrived — not how confident the answer sounds.",
          "That's the whole idea. The rest of this course is the machine that makes it work. Lesson 2 asks why we don't just paste everything. Lessons 3–4 show how a search can understand a question it has never seen. Lesson 5 walks the full pipeline. Lesson 6 covers what goes wrong. Lesson 7 tells you when not to build this at all.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A travel company's chatbot confidently describes a baggage policy. The policy matches a different airline. The team says 'the model is broken.' What's the more precise diagnosis?",
            choices: [
              {
                id: "a",
                label: "The model answered closed-book — from memory, with no page in front of it. RAG hands it the company's actual policy first.",
              },
              {
                id: "b",
                label: "The model is genuinely broken and should be replaced with a larger one",
              },
              {
                id: "c",
                label: "The model just needs more training on this airline's policies so it memorizes them",
              },
            ],
            answer: "a",
            explanation:
              "Fluent-but-wrong-from-memory is the closed-book failure RAG exists to fix. The model recalled a similar policy from training — not the company's own. Put the right page in the context. The same model then quotes it instead of guessing.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "An internal docs bot answers 'how do I rotate the API keys?' with a step-by-step guide. The guide ends in '[docs/deploy-keys §4]'. What most likely made that citation possible?",
            choices: [
              {
                id: "a",
                label: "A retrieval step fetched the real doc section into the model's context before it answered",
              },
              {
                id: "b",
                label: "The model memorized the company docs during training",
              },
              {
                id: "c",
                label: "A human pasted the answer into the chat earlier that day",
              },
            ],
            answer: "a",
            explanation:
              "Models don't memorize your private docs at training time. The citation means the pipeline found the page and put it in the window. The citation reveals the open-book structure — not the model's memory.",
          },
        ],
      },
      {
        slug: "why-not-paste-everything",
        title: "Why Not Just Paste Everything?",
        blurb:
          "Window space, money, speed, and the skipped middle — why 'just include all docs' quietly fails.",
        topic: "rag-foundations",
        skillIds: ["rag-basics", "rag-vs-alternatives"],
        capability:
          "Name the four costs of pasting a whole corpus into the window, and why retrieval beats bulk for large document sets.",
        minutes: 5,
        concept: {
          anchor:
            "Picture carrying the whole library to the counter to ask one question — heavy, slow, and the answer still hides in the middle of the pile.",
          what: "Pasting every document into every request fails in four ways. The **context window is finite**. **Every word costs money on every request**. Huge contexts are **slow**. And models **skim the middle** of long piles.",
          why: "Retrieval spends the window's small budget on just the pages this question needs. You pay a few pennies per answer, not the whole-library bill.",
          where: [
            "A **support bot** whose 40,000 policy and spec pages could never fit the window anyway",
            "A **docs assistant** that would pay for the entire manual again on every single question",
            "Any assistant whose key page sits **mid-pile**, where models read least well",
          ],
          whenNot:
            "Don't build retrieval when the knowledge is **small and stable**. One short handbook can genuinely just live in the window. That choice is lesson 7's ladder.",
        },
        diagram: {
          kind: "compare",
          left: { title: "Paste the library", subtitle: "every doc, every request" },
          right: { title: "Retrieve the page", subtitle: "the few this question needs" },
          rows: [
            { label: "Space", left: "overflows any real window", right: "fits with room to spare" },
            { label: "Cost", left: "re-paid in full, every request", right: "a few pages, a few pennies" },
            { label: "Speed", left: "huge contexts answer slowly", right: "small contexts answer fast" },
            { label: "Attention", left: "the middle of the pile gets skimmed", right: "nothing important hides mid-pile" },
            { label: "Where to use", left: "never, past a handful of docs", right: "any real corpus" },
          ],
        },
        prose: [
          "The obvious reply to “the model doesn't know my documents” is to paste them all in. For a two-page FAQ, that works. The trouble starts at scale. The **context window is finite**. A real corpus — thousands of policy pages, product specs, support docs — doesn't come close to fitting. Even the biggest windows fill.",
          "The costs stack up even when things do fit. Every pasted token (word-sized pieces the model reads) is **billed on every request**. You pay whether the question needed that page or not. Big contexts answer **slowly**. And strangest of all: models read the **beginning and end of a pile far better than its middle**. Bury the refund policy at page 20 of 40 and it effectively disappears. Researchers call this failure *lost in the middle*.",
          "Retrieval is the fix by subtraction. Spend the window's budget on the **few pages this question actually needs**. Where the library analogy breaks: carrying the library to the counter is a one-time effort. Pasting re-carries it on *every single question*, and each trip is billed. That's the deal RAG offers — a small window that behaves like a big one. The price is finding the right pages. Finding them is the next two lessons.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A team pastes all 300 pages of their product manual into every support request. It fits — barely. Support reports the bot keeps missing details that are 'right there in the manual.' Which explanation fits best?",
            choices: [
              {
                id: "a",
                label: "Lost in the middle — models read the ends of long contexts far better than the middle. Mid-manual details effectively vanish.",
              },
              {
                id: "b",
                label: "The manual is too technical for the model to read",
              },
              {
                id: "c",
                label: "300 pages is too few — pasting 600 would fix it",
              },
            ],
            answer: "a",
            explanation:
              "The details are in the window but not in the model's attention. Long piles get skimmed in the middle — exactly where the manual's buried sections live. Retrieve the one needed page instead. It lands where the model actually reads: the top of a short context.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Finance asks why the AI feature's bill exploded. The team discovers every question — even 'what are your hours?' — sends the full 280-page knowledge base. What's the fix in one sentence?",
            choices: [
              {
                id: "a",
                label: "Stop paying for the library on every ask — retrieve the few relevant pages per question instead of pasting everything",
              },
              {
                id: "b",
                label: "Negotiate a bigger volume discount and keep the setup as is",
              },
              {
                id: "c",
                label: "Shorten the manual to 30 pages so it's cheaper to paste every time",
              },
            ],
            answer: "a",
            explanation:
              "The bill is really a retrieval failure seen through finance. The math is 280 pages × every small question. A discount trims the waste a little; retrieval removes most of it. Deleting the knowledge base removes the product's value along with the cost.",
          },
        ],
      },
      {
        slug: "what-are-embeddings",
        title: "What Are Embeddings?",
        blurb:
          "Meaning as a location: an embedding model gives every text an address, and similar meanings become neighbors.",
        topic: "embeddings",
        skillIds: ["embeddings-basics"],
        capability:
          "Explain embeddings as coordinates on a meaning map where distance means similarity — even with zero shared words.",
        minutes: 5,
        concept: {
          anchor:
            "Every page gets an address on a giant town map of meanings — neighbors are the pages that mean the same thing.",
          what: "An **embedding** (meaning coordinates for text) is a piece of text's location on a giant **map of meanings**. An embedding model computes this address. Nearby points have similar meanings. So “refund policy” and “money-back guarantee” are neighbors **without sharing a single word**.",
          why: "Keyword matching fails the moment the question and the answer use different words for the same thing. Embeddings match **meaning to meaning**. That is what lets search understand questions it has never seen.",
          where: [
            "**Semantic search** finding the refund page for “can I get my money back”",
            "A **support inbox** auto-routing tickets by what they're about",
            "**Similar-doc suggestions** — 'pages like this one' in a knowledge base",
          ],
          whenNot:
            "Don't rely on embeddings alone when the match must be **literal**. Error codes, part numbers, and names match by exact string, not meaning. Course two fixes this with hybrid search.",
        },
        diagram: {
          kind: "flow",
          steps: [
            { kind: "input", text: "Any text: a page, a question" },
            { kind: "process", text: "Embedding model" },
            { kind: "output", text: "A point on the meaning map", caption: "a list of numbers — the address" },
            { kind: "process", text: "Nearby points = similar meaning" },
          ],
        },
        prose: [
          "Search used to mean keywords: find the documents containing these words. It fails exactly when people need it most. That is when the question and the answer phrase the same idea differently. “Can I get my money back?” shares no word with “Refunds are processed within 14 days”. Keyword search never finds it. Meaning-search must.",
          "Here is the trick. An **embedding model** has learned, from millions of texts, to give any piece of text a location. Think of it as an address on a huge map where **distance means similarity**. Texts about money and returns land on the same street. Shipping times live on another street. Job postings live on another still. Nobody writes these addresses; the model computes them.",
          "One honest limit is saved for later. It is exactly where the map analogy breaks: embeddings match **meaning**, not **identity**. The error code “E-4821” has no meaningful neighborhood. It needs to be found literally. That gap is real, and the intermediate course's hybrid-search lesson exists to close it. For now, remember: the map is what lets search understand.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A customer asks 'can I get my money back if it arrives broken?' The answer lives on a page titled 'Refunds and returns policy' — no overlapping words. Why does embedding-based search still find it?",
            choices: [
              {
                id: "a",
                label: "Both texts get plotted on the meaning map, and they land as neighbors — distance measures similarity, not shared vocabulary",
              },
              {
                id: "b",
                label: "The search engine checks a dictionary of money-related synonyms",
              },
              {
                id: "c",
                label: "It got lucky — next time the same question may find the shipping page",
              },
            ],
            answer: "a",
            explanation:
              "This is the embedding's whole job. 'Money back if broken' and 'refunds and returns' express one idea. Their addresses sit close together on the map the model learned. It is not luck and not a synonym list. It is learned meaning-as-location.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "An engineer's assistant must find the doc for error code 'E-4821'. Semantic search keeps returning pages about 'other error codes' instead of the exact one. What does this reveal about embeddings?",
            choices: [
              {
                id: "a",
                label: "Embeddings match meaning, not identity — codes and part numbers need literal matching, a different tool that can be combined with them",
              },
              {
                id: "b",
                label: "The embedding map is broken and should be retrained",
              },
              {
                id: "c",
                label: "Error codes are simply unfindable by any search method",
              },
            ],
            answer: "a",
            explanation:
              "'E-4821' lands in a neighborhood of error-code-shaped text. It sits near its look-alikes but not apart from them. Exact identifiers need exact matching. The fix (course two) combines meaning-search with keyword-search. Retraining the map is not the answer.",
          },
        ],
      },
      {
        slug: "how-similarity-search-works",
        title: "How the Search Finds the Right Page",
        blurb:
          "Plot the question, measure distances, sort, keep the top few — top-k as the engineer's dial.",
        topic: "embeddings",
        skillIds: ["similarity-search-basics", "embeddings-basics"],
        capability:
          "Describe similarity search end to end — question as a point, ranked distances, top-k selection — and what the k dial trades off.",
        minutes: 4,
        concept: {
          anchor:
            "Pin the question on the map, then walk door to door and keep the few nearest neighbors as your shortlist.",
          what: "**Similarity search** plots the question on the same meaning map as the indexed pages. It measures the distance to every page. It **ranks** the pages by distance. And it keeps the **top k** — the few closest pages.",
          why: "Ranking turns the map into a shortlist. The model gets the few pages nearest the question's meaning, in order — not the whole corpus.",
          where: [
            "A **docs bot** keeping the 3 nearest sections per question",
            "A **support assistant** shortlisting policy pages before answering",
            "**'More like this'** features ranking items by distance to the one you liked",
          ],
          whenNot:
            "Don't raise k as a quality strategy. Past a few pages, more context starts **hiding** the good page in the middle of the pile. That is the exact failure lesson 2 showed.",
        },
        diagram: {
          kind: "flow",
          steps: [
            { kind: "input", text: "The question → a point on the map" },
            { kind: "process", text: "Measure distance to every indexed page" },
            { kind: "process", text: "Rank by distance" },
            { kind: "output", text: "Keep the top k pages", caption: "the shortlist" },
          ],
        },
        prose: [
          "Every page of your corpus was embedded in advance. Each one is a point on the meaning map. Each point sits in an index that remembers thousands of addresses. When a question arrives, the search does something beautifully simple. It **embeds the question too**, making it a point on the very same map.",
          "Now it's arithmetic. The search measures the **distance** from the question's point to every page's point. It **sorts** the pages by that distance and hands back the top of the list. “Can I get my money back?” lands on money street. The refund pages are its nearest neighbors. They win the ranking. Where the door-to-door picture breaks: in a real town you could walk every street and be sure you checked every door. A real index holds thousands of addresses. It takes clever shortcuts that almost always — but not always — find the nearest ones.",
          "One dial matters: **k** — how many of the top pages to keep. Three is a common start. Keep too few, and the right page might be left out. Keep too many, and you rebuild the pile from lesson 2, where the good page gets buried among the weaker ones. Choosing k is the first real RAG trade-off you will meet. Course two treats it seriously.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A team sets k=20 to 'make sure the right page is always included.' Answers get worse, not better. What happened?",
            choices: [
              {
                id: "a",
                label: "The right page is probably in there — but buried mid-pile among 20 pages, where models read worst. A tighter k puts it where attention actually lands.",
              },
              {
                id: "b",
                label: "k=20 turned the ranking off, so pages arrive in random order",
              },
              {
                id: "c",
                label: "k=20 is still too small — raise it to 50 and the right page is guaranteed in",
              },
            ],
            answer: "a",
            explanation:
              "More is not safer. Past a handful, extra pages add noise that hides the winner. It is the lost-in-the-middle failure returning through the k dial. The fix is better ranking (course two's reranking), not a bigger pile.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Your product's 'similar articles' feature ranks pieces by embedding (meaning coordinates for text) distance to the article a reader just finished. A reader asks why a clearly unrelated piece sometimes ranks high. What's the honest explanation?",
            choices: [
              {
                id: "a",
                label: "Distance measures similarity of meaning, not quality or editorial fit — 'nearest on the map' can still be a mismatch the ranking can't see",
              },
              {
                id: "b",
                label: "The distances are random when more than 100 articles exist",
              },
              {
                id: "c",
                label: "Similar-article features simply can't work with embeddings",
              },
            ],
            answer: "a",
            explanation:
              "The map is honest about meaning-neighborhoods. But 'nearest neighbor' is a mathematical claim, not an editorial one. Near misses are the ranking's known blind spot. Deciding what 'close enough' means is the engineer's judgment — or a reranker's job later in the series.",
          },
        ],
      },
      {
        slug: "the-rag-pipeline",
        title: "The RAG Pipeline, End to End",
        blurb:
          "Step through one question's full journey — and see what the model actually receives.",
        topic: "rag-pipeline",
        skillIds: ["rag-pipeline", "similarity-search-basics"],
        capability:
          "Trace a question through the full RAG pipeline — embed, search, top-k, context, cited answer — and know the model only sees what the pipeline supplies.",
        minutes: 6,
        concept: {
          anchor:
            "One question rides a conveyor belt — measured, matched, and delivered with the right pages tucked inside the envelope.",
          what: "The **RAG pipeline** runs per question: **embed** the question, **search** the index, keep the **top-k** pages, place pages + question in the **context window**, and generate a **cited answer**.",
          why: "Seeing the stages as a conveyor removes the magic. The model never searches or browses. It reads what the pipeline assembled. Every RAG improvement is an improvement to one stage.",
          where: [
            "A **support assistant** running the six stages in milliseconds per question",
            "A **docs bot** whose every answer ends in a page citation",
            "An **onboarding assistant** answering from the employee handbook index",
          ],
          whenNot:
            "Don't build a pipeline for what lesson 7 would paste. For one small, static document, the whole conveyor is overhead without payoff.",
        },
        diagram: {
          kind: "flow",
          steps: [
            { kind: "input", text: "Question arrives" },
            { kind: "decision", text: "Embed + search + top-k", caption: "the retrieval stages" },
            { kind: "process", text: "Context: pages + question" },
            { kind: "output", text: "Answer with citation" },
          ],
          loop: "every question repeats the same journey",
        },
        prose: [
          "Lessons 1–4 built the pieces. This lesson is the conveyor belt that connects them. A question arrives as plain words. It's **embedded** — plotted on the meaning map. The index is **searched**: every page measured, ranked by distance. The **top few** survive. Those pages and the question are assembled into the **context window**. Only then does the model generate. Because the pages are right there, it can answer **from** them and cite them.",
          "The stepper above runs two different questions through the same machine on purpose. Watch how the question's neighborhood changes the shortlist. The damaged-box question gathers refund pages. The Berlin delivery question gathers shipping pages. Same pipeline, same stages — different streets of the map.",
          "Where the conveyor analogy breaks: a factory belt carries the same cargo every cycle. This belt's cargo changes with every question. And the model can't notice a jam; it answers from whatever reached the envelope. So keep the framing that matters most: **the model only ever sees what the pipeline puts in front of it**. When the answer is wrong, one of these stages missed. Lesson 6 gives you the two-question diagnostic for finding which one.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "During a demo, an engineer says 'watch the AI search our docs live.' The answer arrives with a citation four seconds later. What actually happened in those four seconds?",
            choices: [
              {
                id: "a",
                label: "The pipeline embedded the question, ranked the indexed pages, kept the top few, and only then let the model answer from them",
              },
              {
                id: "b",
                label: "The model browsed the document folder directly, opening files until it found the answer",
              },
              {
                id: "c",
                label: "The answer was pre-written — a lookup table of canned replies keyed to common questions",
              },
            ],
            answer: "a",
            explanation:
              "The model never browses — that's the conveyor's job. The four seconds were embedding (computing meaning coordinates for text), distance-ranking over the index, shortlisting, and then generation from the assembled context. The citation is the receipt. It proves the pipeline ran.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Your RAG assistant's answers were great last month. This month the same questions get vague answers citing odd pages. Nothing in the model changed. Which part of the pipeline is the most likely suspect?",
            choices: [
              {
                id: "a",
                label: "The retrieval stages — the index itself: what's in it, how it's chunked, or whether it's gone stale relative to the sources",
              },
              {
                id: "b",
                label: "The context window, which shrinks as documents age",
              },
              {
                id: "c",
                label: "The citation format, which degrades answer quality over time",
              },
            ],
            answer: "a",
            explanation:
              "The model is fixed. So the variable input is what retrieval hands it: an index that drifted (slowly went stale) from its sources. Stale pages, changed chunking, or missing updates change the shortlist. The shortlist changes everything downstream. Index health is the RAG system's silent variable (a whole lesson in course two, a whole lifecycle lesson in course three).",
          },
        ],
      },
      {
        slug: "when-rag-gets-it-wrong",
        title: "When RAG Gets It Wrong",
        blurb:
          "Wrong page, stale page, ignored page — and the one question that splits every failure.",
        topic: "rag-failures",
        skillIds: ["rag-failure-basics", "rag-pipeline"],
        capability:
          "Diagnose the three beginner failure modes and split any bad answer into a retrieval problem or a grounding problem.",
        minutes: 5,
        concept: {
          anchor:
            "A wrong answer is a wrong delivery — check whether the courier brought the wrong package or the right one went unread on the desk.",
          what: "RAG fails three familiar ways. The **wrong page** wins the ranking. The **right page is stale** (the index didn't track its source). Or the model **ignores the page** and answers from memory. The diagnostic: *was the right page in the window?*",
          why: "The split is the trade's most-used tool. **Retrieval problems** need one fix: fix the pages, the ranking, or the index. **Grounding problems** (fix how the answer uses the pages) need a different fix. Blaming the model fixes neither.",
          where: [
            "A **support bot** answering fluently from the wrong policy page",
            "An **assistant** citing a price page that no longer matches the site",
            "A **docs bot** overriding its own cited page with a confident memory",
          ],
          whenNot:
            "Don't diagnose without the receipt. Check which pages were actually retrieved before concluding anything. The citation — or the pipeline log — is the evidence.",
        },
        diagram: {
          kind: "decision",
          root: {
            kind: "decision",
            question: "The answer is wrong — was the right page in the window?",
            branches: [
              {
                label: "no",
                node: { kind: "leaf", answer: "Retrieval problem", caption: "fix the pages, the ranking, or the index" },
              },
              {
                label: "yes",
                node: { kind: "leaf", answer: "Grounding problem", caption: "fix how the answer uses its pages" },
              },
              {
                label: "an old version was",
                node: { kind: "leaf", answer: "Stale index", caption: "the index must track its sources" },
              },
            ],
          },
        },
        prose: [
          "Three failures account for most wrong RAG answers. The **wrong page**: the ranking promoted a look-alike — the wholesale-returns page for a damaged-box question. The model then answered a different question, fluently. The **stale page**: the retrieval was perfect, but the page was last year's policy — still indexed after the source changed. The **ignored page**: the right page sat in the window, and the model answered from memory anyway. The page said 14 days. The answer said 30.",
          "Each failure names its fix direction. Wrong page → the ranking needs help (course two's chunking, hybrid search, and reranking lessons). Stale page → the index must track its sources, including deletions (course two's ingestion, course three's lifecycle). Ignored page → the answer must be **grounded**: only what the pages say, or a clear “the docs don't say”.",
          "And the discipline that organizes all of it: when an answer is wrong, first ask **was the right page in the window?** No → retrieval problem. Yes → grounding problem. Old version → staleness. Where the courier analogy breaks: a real courier delivers to one right address. Retrieval ranks look-alikes and can still hand over the wrong one. That is why the diagnostic asks about the package, never the wrapper. Every course-two topic — and every production debugging session you will ever run — depends on that one split.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A docs bot cites a real page — but the price on that page doesn't match the website. The website updated last week. The team's first instinct is to retrain the model. What's the correct first move?",
            choices: [
              {
                id: "a",
                label: "Diagnose as a stale index: the source changed and the indexed page didn't. Fix the index-to-source sync before touching the model.",
              },
              {
                id: "b",
                label: "Retrain the model on current prices",
              },
              {
                id: "c",
                label: "Tell customers to double-check prices manually",
              },
            ],
            answer: "a",
            explanation:
              "The retrieval worked and the citation proves it — the page in the window is simply outdated. Knowledge problems are fixed at the index (sync, refresh, delete propagation), never at the weights (the importance sliders inside the model). A retrained model would go stale again with next week's price change.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Your assistant's answer says refunds take 30 days. The retrieved page — shown in the debug log — clearly states 14 days. Which failure is this, and where's the fix?",
            choices: [
              {
                id: "a",
                label: "A grounding problem: the right page was in the window and the answer didn't follow it. Fix how the answer is required to use its pages.",
              },
              {
                id: "b",
                label: "A retrieval problem: search for 'refunds' returned the wrong page",
              },
              {
                id: "c",
                label: "A stale-index problem: the page predates the 30-day policy",
              },
            ],
            answer: "a",
            explanation:
              "The debug log is the receipt: the correct page was retrieved. When the right evidence sits in the window and the answer contradicts it, that's generation overriding evidence. The fix is the grounding contract ('answer only from these pages, else say the docs don't cover it') — course two's citations lesson.",
          },
        ],
      },
      {
        slug: "when-not-to-use-rag",
        title: "When NOT to Use RAG",
        blurb:
          "Paste it, query it, or retrieve it — use the least machinery the task allows.",
        topic: "rag-vs-alternatives",
        skillIds: ["rag-vs-alternatives"],
        capability:
          "Choose between pasting context, querying a database, and building RAG for a given knowledge task.",
        minutes: 5,
        concept: {
          anchor:
            "Use the smallest tool that works — a pocket note beats a filing cabinet beats hiring a librarian for one page.",
          what: "Before building RAG, check the two simpler designs. **Paste it in**: the knowledge is small and static — it fits the window. **Query a database**: the task needs exact records or counts, not similar passages. RAG earns its machinery only for corpora **too big to paste and too alive to freeze**. Citations are the prize.",
          why: "RAG's costs are real: an index to build, sources to sync, retrieval to tune. Paying them for a 12-page handbook or a count query buys complexity without capability.",
          where: [
            "The **employee handbook**, changed once in 2023 — paste it into the window",
            "“How many orders shipped Tuesday, to which cities?” — a database query, exact by construction",
            "**40,000 docs updated daily**, every answer cited — the RAG home turf",
          ],
          whenNot:
            "Don't build RAG when the corpus fits comfortably in the window **and rarely changes**. Skip it too when the question has **exactly one right answer a lookup returns**. Those are the other two tools' jobs.",
        },
        diagram: {
          kind: "decision",
          root: {
            kind: "decision",
            question: "What does the task need?",
            branches: [
              {
                label: "small, static knowledge",
                node: { kind: "leaf", answer: "Paste it into the window", caption: "zero moving parts" },
              },
              {
                label: "exact records or counts",
                node: { kind: "leaf", answer: "Query the database", caption: "no ranking, no guessing" },
              },
              {
                label: "large, changing, needs citations",
                node: { kind: "leaf", answer: "RAG pipeline", caption: "the machine this course built" },
              },
            ],
          },
        },
        prose: [
          "The final judgment of this course is knowing when not to build RAG. Three tasks make the ladder concrete. The **employee handbook** — twelve pages, last edited in 2023 — belongs in the window, pasted whole. Retrieval would add an index to maintain, for nothing. “How many orders shipped Tuesday, to which cities?” is a **database question**. It wants exact rows, not similar passages. Search gives approximate results exactly where the task needs exact counting.",
          "And then the genuine RAG case: **40,000 support docs, product specs, and policy pages, updated daily**. Every answer must point at its source. Too big to paste. Too alive to freeze. And citations are the product. This is the machinery lessons 1–6 built, doing the one job nothing simpler can.",
          "So climb the ladder and stop at the first rung that works: **paste** → **query** → **retrieve**. Where the analogy breaks: a ladder is climbed once. This one gets re-climbed, because the answer changes as the corpus grows. The handbook that fits the window today outgrows it after enough quarterly updates. “You don't need RAG for this” is a complete, senior answer. And if the task does need RAG, the intermediate course turns this machine into an engineered system: chunking, hybrid search, reranking, evaluation, and the ingestion pipeline that keeps the index honest.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A startup wants an assistant for their 15-page benefits guide, which HR updates once a year. A vendor pitches a full RAG platform with a vector database. What's the right call?",
            choices: [
              {
                id: "a",
                label: "Paste the guide into the window — it's small and near-static. The RAG platform buys complexity without capability.",
              },
              {
                id: "b",
                label: "Buy the platform — RAG is the modern default for any document task",
              },
              {
                id: "c",
                label: "Build the RAG pipeline in-house to save the license fee",
              },
            ],
            answer: "a",
            explanation:
              "The ladder's first rung genuinely covers this. 15 pages fit any window. Once-a-year changes are one paste per year. Both RAG options — vendor or home-built — pay for an index, a sync process, and retrieval tuning. A simple paste does the job better and cheaper.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Product asks for an assistant that answers 'which of our warehouses are low on SKU-4821 this week?' from a live inventory system. The team starts designing embeddings (meaning coordinates for text) and a vector index. What do you say?",
            choices: [
              {
                id: "a",
                label: "Wrong tool: that's an exact-records question. Query the inventory database and hand the result to the model to phrase. No retrieval ranking belongs in the path.",
              },
              {
                id: "b",
                label: "Correct plan — embed the inventory table and let similarity search find low stock",
              },
              {
                id: "c",
                label: "Neither — refuse the feature, live data can't be used",
              },
            ],
            answer: "a",
            explanation:
              "Counts and exact lookups are database work. 'Low on SKU-4821' has one true answer per warehouse. Approximate-nearest-neighbor is the wrong tool for truth. The model's role is phrasing the query's result. The intermediate course calls this pipeline tools-plus-retrieval — but never similarity over live records.",
          },
        ],
      },
    ],
};

export default course;
