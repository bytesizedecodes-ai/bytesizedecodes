import type { Course } from "../types";

const course: Course = {
    slug: "rag-engineering-in-practice",
    title: "RAG Engineering in Practice",
    subtitle:
      "Build the machine — chunking, hybrid search, reranking, grounding, evals, and the pipeline that feeds it.",
    description:
      "The intermediate build: follow Atlas, a company knowledge assistant, from cut-mid-procedure chunks to a shipped pipeline. Nine lessons on chunking, embedding selection, hybrid search, reranking, query understanding, grounded citations, the four-question evaluation, observability, and the ingestion loop that keeps the index honest.",
    level: "intermediate",
    domain: "AI Engineering",
    access: "paid",
    prerequisites:
      "RAG Engineering Foundations — the pipeline, embeddings, and the retrieval-vs-grounding split are assumed.",
    lessons: [
      {
        slug: "chunking-strategy",
        title: "Chunking: Where Quality Is Decided",
        blurb:
          "Cut at the document's joints — one procedure, one table, one section per chunk. It decides more than the embedding model.",
        topic: "chunking",
        skillIds: ["chunking-strategy"],
        capability:
          "Choose a chunking strategy that keeps every chunk self-contained, and know why it outweighs embedding-model choice.",
        minutes: 7,
        concept: {
          anchor: "Slicing a sandwich down the middle spills the filling — good cuts follow the bread's seams.",
          what: "**Chunking** splits documents into the units retrieval will find. Structure-aware cuts — at headings, procedures, tables — keep each chunk **self-contained**; fixed-size cuts sever steps from warnings and slice tables mid-column.",
          why: "The chunk is the unit of retrieval: a chunk that lost its context retrieves well and answers wrong. Field results repeat the same finding — **chunking strategy decides more than the embedding model** (the embedding being meaning coordinates for text).",
          where: [
            "**Engineering runbooks** where a severed warning makes an answer dangerous",
            "**Policy docs** whose tables must survive as tables, not fragments",
            "**Parent-document retrieval**: match the small piece, serve the whole section",
          ],
          whenNot:
            "Don't over-engineer chunking for **homogeneous prose** (articles, FAQs) — there, sensible fixed sizes with overlap are fine; the guillotine only bites on structured documents.",
        },
        diagram: {
          kind: "compare",
          left: { title: "Fixed-size cuts", subtitle: "512 tokens, structure-blind" },
          right: { title: "Structure-aware chunks", subtitle: "cut at the document's joints" },
          rows: [
            { label: "Procedures", left: "severed mid-step; warnings orphaned", right: "one procedure = one chunk, warning attached" },
            { label: "Tables & code", left: "split arbitrarily — columns orphaned", right: "kept whole, whatever their size" },
            { label: "Headings", left: "separated from their sections", right: "heading + section travel together" },
            { label: "Where to use", left: "homogeneous prose only", right: "runbooks, policies, specs — anything structured" },
            { label: "When NOT to use", left: "—", right: "— (this is the default, not the exception)" },
          ],
        },
        prose: [
          "Atlas retrieved the right runbook for “restart the cache service safely” — and answered without the warning. The chunker had cut the procedure at step 4, sending the steps one way and the **do-not-skip-the-drain-step** warning another. Retrieval worked; the unit it retrieved was broken. Predict before reading on which stage you'd have blamed first — most teams reach for the model, and most teams are wrong. That's the chunking lesson in one incident: the model can only answer with what the chunk preserved.",
          "The fix is to cut where the document already bends: **one procedure, one chunk**. Tables and code blocks stay whole regardless of size. Headings travel with their sections — a chunk titled “Restart procedure” embeds far more usefully than an orphaned steps list. When small pieces must stay small for precise matching, use the **parent-document move**: index the piece, but serve the surrounding section to the model.",
          "And the finding that reframes budgets: teams A/B fancier embedding models for weeks while their fixed-size chunker quietly destroys procedures — and the chunking fix moves the score more. **Chunking decides more than the embedding model**; it's the cheapest quality lever in the pipeline, and it hides in plain sight because it runs once, at ingestion, where nobody watches.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A team's RAG answers about a deployment procedure keep omitting its rollback step. The embedding model is the leaderboard leader; retrieval traces show the right doc retrieved. What do you examine first?",
            choices: [
              {
                id: "a",
                label: "The chunk boundaries — a fixed-size cut has likely severed the rollback step from the procedure chunk that gets retrieved",
              },
              {
                id: "b",
                label: "The embedding model — a leaderboard leader wouldn't make this mistake",
              },
              {
                id: "c",
                label: "The reranker — it must be demoting the rollback content",
              },
            ],
            answer: "a",
            explanation:
              "Right doc, wrong answer is the chunking signature: the retrieval trace proves the document arrived, so the damage happened at the cut — the rollback step lives in a different chunk that never wins its own ranking. No model swap or reranker fixes content the chunker amputated.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Your corpus is 4,000 short FAQ entries, each 2–3 sentences, single topic each. The team proposes a bespoke structure-aware chunker with section detection. What's the proportionate call?",
            choices: [
              {
                id: "a",
                label: "Each FAQ entry is already the ideal chunk — ingest entries as-is; the bespoke chunker buys nothing on homogeneous, self-contained prose",
              },
              {
                id: "b",
                label: "Build it — structure-aware chunking is always worth the engineering",
              },
              {
                id: "c",
                label: "Concatenate all entries into one giant chunk to preserve context",
              },
            ],
            answer: "a",
            explanation:
              "Chunking exists to make units self-contained; entries that already are need no surgery — the when-NOT rule from the concept brief. The giant chunk is the opposite failure: one entry retrieved means the model sees four thousand, and the pile hides the answer.",
          },
        ],
      },
      {
        slug: "choosing-embeddings",
        title: "Choosing an Embedding Model",
        blurb:
          "Shortlist from leaderboards, decide on your own data, price the fit — and commit, because the reindex makes it permanent.",
        topic: "embeddings",
        skillIds: ["embedding-selection", "embeddings-basics"],
        capability:
          "Select an embedding model with a funnel: leaderboard shortlist, own-data eval, dimensions/cost — and plan the reindex it implies.",
        minutes: 7,
        concept: {
          anchor:
            "Pick one map maker and stay with them — addresses from two different atlases don't describe the same streets.",
          what: "Embedding selection is a **funnel**: shortlist from **public benchmarks**, decide on **your own golden set** (real questions with known-right pages, scored by top-k hit rate), then price **dimensions, latency, and cost** — and commit.",
          why: "Leaderboards measure their data, not yours — Atlas's multilingual mix flipped the ranking. And the commitment is real: **embeddings from two models are addresses on different maps**, so changing models means re-embedding every chunk — a full reindex.",
          where: [
            "A **bilingual company** choosing a multilingual model over a mono-English leaderboard leader",
            "An **e-commerce corpus** where dimensions (index size × 4) changed the cost answer",
            "Any team planning a **dual-index migration**: build new in shadow, verify, switch",
          ],
          whenNot:
            "Don't re-select the model for a quality dip before checking **chunking and staleness** — those cause most “embedding” complaints, and fixing them costs no reindex.",
        },
        diagram: {
          kind: "decision",
          root: {
            kind: "decision",
            question: "Candidate passes on YOUR golden set?",
            branches: [
              { label: "no", node: { kind: "leaf", answer: "Drop it — leaderboards don't vote here" } },
              {
                label: "yes",
                node: {
                  kind: "decision",
                  question: "Dimensions, latency, and cost fit production?",
                  branches: [
                    { label: "no", node: { kind: "leaf", answer: "Drop it — the index is a budget too" } },
                    {
                      label: "yes",
                      node: {
                        kind: "leaf",
                        answer: "Commit — and schedule the full reindex",
                        caption: "dual-index migration: shadow, verify, switch",
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        prose: [
          "Atlas's corpus is half English, half German — and the embedding decision nearly went to the wrong model. The leaderboard leader was a mono-English specialist: brilliant on English benchmarks, quietly terrible at German nuance. The funnel caught it: fifty real bilingual questions with known-right pages, each candidate scored by **top-k hit rate** — `hits@k = questions whose right page lands in top-k ÷ all questions` — and a mid-size multilingual model won on the only data that matters, Atlas's own.",
          "The third funnel stage is the one teams forget is a decision: **dimensions are a budget**. Doubling dimensions doubles (or worse) index size and search latency. Atlas's scorecard had the leaderboard leader at +1 point on English for 3× the index — the mid-size model took the slot. Price the fit before you fall in love with a score.",
          "Then the commitment rule. An embedding is an address on a map the model drew — and **two models draw two different maps**. Chunk addresses from model A are noise to model B's index, so “trying” a new model means re-embedding everything. Do it as a **dual-index migration**: build the new index in shadow, score it on the golden set, switch when it wins — never by drifting (gradually sliding off course) halfway between two maps.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A team swaps their embedding model to a new leaderboard leader by re-embedding only new documents. Two weeks later retrieval quality collapses for old documents. What happened?",
            choices: [
              {
                id: "a",
                label: "Two maps, one index: old chunks hold addresses from the old model, new chunks from the new one — distances between them are meaningless, so rankings break",
              },
              {
                id: "b",
                label: "The new model is simply worse and should be reverted",
              },
              {
                id: "c",
                label: "The old documents got stale while nobody was watching",
              },
            ],
            answer: "a",
            explanation:
              "The reindex rule exists for exactly this failure: embeddings are only comparable within one model's map. Mixing maps in one index makes every cross-pair distance garbage — the collapse is structural, not a quality opinion about the new model. Re-embed everything (dual-index migration) or stay on the old map entirely.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Retrieval quality has slid for a month. The team proposes evaluating three new embedding models next sprint. What should happen first?",
            choices: [
              {
                id: "a",
                label: "Diagnose before re-selecting: check chunk integrity and index staleness — most 'embedding' complaints are chunking or freshness debts that no model swap fixes",
              },
              {
                id: "b",
                label: "Proceed with the evaluation — a month of decline clearly implicates the model",
              },
              {
                id: "c",
                label: "Re-embed everything now; freshness will follow",
              },
            ],
            answer: "a",
            explanation:
              "A quality slide with no model change is a pipeline change or a corpus change — new sources, edited docs, a chunker tweak. Swapping models (with its full reindex) without that diagnosis pays the highest cost in the system for a guess. The when-NOT rule: no re-selection before chunking and staleness are cleared.",
          },
        ],
      },
      {
        slug: "hybrid-search",
        title: "Hybrid Search: Keywords Meet Meaning",
        blurb:
          "Dense and keyword retrievers fail on opposite cases — run both, fuse the ranks, and both get found.",
        topic: "retrieval",
        skillIds: ["hybrid-search", "similarity-search-basics"],
        capability:
          "Combine semantic and keyword retrieval with rank fusion, closing the exact-match gap that embeddings can't.",
        minutes: 7,
        concept: {
          anchor:
            "Ask the librarian and the parts clerk — one finds by topic, the other by part number, and together nothing hides.",
          what: "**Hybrid search** runs two retrievers in parallel — **dense** (embeddings, matches meaning) and **keyword/BM25** (matches exact tokens) — then **fuses their rankings** into one shortlist where each contributes its best.",
          why: "The two fail on opposite cases: paraphrases defeat keywords; error codes, part numbers, and names defeat meaning. Rank fusion (merging positions, not scores) lets the exact match and the concept page both survive to the context.",
          where: [
            "An **engineering assistant** where queries are error codes — BM25's home turf",
            "A **support bot** where users paraphrase policies in their own words — dense's home turf",
            "Any production RAG: **hybrid + rerank is the baseline** almost no team regrets",
          ],
          whenNot:
            "Don't fuse blindly when one retriever is systematically wrong for a domain — a corpus of pure prose with zero identifiers gets little from BM25, and weighting fusion is a real dial to tune.",
        },
        diagram: {
          kind: "flow",
          steps: [
            { kind: "input", text: "Question" },
            { kind: "process", text: "Dense + keyword retrieval, in parallel" },
            { kind: "process", text: "Rank fusion — merge positions, not scores" },
            { kind: "output", text: "Merged shortlist", caption: "exact match and concept page both survive" },
          ],
        },
        prose: [
          "The foundations course left a debt: “error E-4821” has no meaningful neighborhood, so semantic search returned sibling codes. Atlas paid that debt weekly — engineers query in identifiers, and dense retrieval kept answering in concepts. **BM25**, the classic keyword ranker, does the opposite: it doesn't know what a quorum is, but it will find every page containing E-4821 verbatim, in milliseconds, at negligible cost.",
          "Hybrid search refuses to choose. Both retrievers run on every query; **rank fusion** merges their lists by position — the standard recipe is reciprocal-rank fusion, `score(d) = Σ 1/(60 + rankᵢ(d))`, each retriever contributing the reciprocal of its rank — so each contributes its best candidates, and neither's blind spot survives alone. The fused shortlist for E-4821 has the exact error page from keywords *and* the quorum-recovery runbook from meaning: the exact answer plus the context to act on it.",
          "This is the research's most repeated production finding: **hybrid plus rerank is the modern baseline** — most enterprise assistants should ship with exactly this stack before reaching for anything exotic. The exotic patterns (agentic loops, graphs) are course three's business, and they all sit *on top of* a hybrid foundation, not instead of it.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A parts-catalog assistant handles queries like 'spec sheet for BC-4410-X' and 'what's the gasket made of?'. Semantic-only search serves the second well and flubs the first. What's the standard fix?",
            choices: [
              {
                id: "a",
                label: "Hybrid search: keyword retrieval nails the part codes, dense retrieval handles the material questions, rank fusion merges both lists",
              },
              {
                id: "b",
                label: "Fine-tune the embedding model on part numbers",
              },
              {
                id: "c",
                label: "Require users to paste the full part number exactly, and match by string equality",
              },
            ],
            answer: "a",
            explanation:
              "Part codes have no meaning neighborhood — that's a structural property of identifiers, and it's precisely what BM25 exists for. Fusion is the standard production answer: both query types get the retriever that handles them, in one pipeline. Fine-tuning identity into meaning fights the grain (fine-tuning being extra practice on your own data); string-equality prompts push your failure onto users.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A team fuses dense and keyword lists by averaging the two systems' similarity scores per document. Results are erratic. What's the classic mistake?",
            choices: [
              {
                id: "a",
                label: "Scores aren't comparable across systems — a 0.8 cosine and a BM25 11.4 live on different scales; fuse by rank position instead",
              },
              {
                id: "b",
                label: "Averaging is correct — the scales just need more decimal places",
              },
              {
                id: "c",
                label: "They should use only the keyword scores and ignore dense entirely",
              },
            ],
            answer: "a",
            explanation:
              "Dense similarity and BM25 scores are on entirely different scales with different distributions — averaging them lets whichever system happens to run “hot” dominate. Rank fusion compares positions: #1 is #1 in either currency. That's why reciprocal-rank-style fusion is the standard recipe.",
          },
        ],
      },
      {
        slug: "reranking",
        title: "Reranking: The Second Look",
        blurb:
          "Recall wide with the cheap glance, then let a careful reader pick the five that matter.",
        topic: "retrieval",
        skillIds: ["reranking", "hybrid-search"],
        capability:
          "Design the two-pass retrieval funnel: cheap bi-encoder recall, cross-encoder rerank, and the cost split that justifies it.",
        minutes: 7,
        concept: {
          anchor:
            "Flip through fifty cards fast, then hand the shortlist to a slow, careful reader who picks the five that matter.",
          what: "**Reranking** adds a second pass: the cheap first stage (**bi-encoder** — question and pages embedded separately, distances compared) recalls the top ~50; a **cross-encoder** reads question and page *together* and rescores, keeping the best ~5.",
          why: "The bi-encoder sees addresses, not content — the right page at rank 12 stays at rank 12. The cross-encoder actually reads, at ~40× the cost per page — so you run it **only on the shortlist**. Recall wide and cheap; read narrow and well.",
          where: [
            "The runbook that **ranked 12th** — outside every sane k, rescued by a reranker",
            "Hybrid fused lists needing one **trusted final ordering**",
            "Any pipeline where **top-5 quality** is the product, not top-50 recall",
          ],
          whenNot:
            "Don't rerank tiny corpora where the first-stage ranking is already excellent — the cross-encoder adds latency (the wait time for a response) and cost for gains inside the noise. Let the golden set decide if it pays.",
        },
        diagram: {
          kind: "flow",
          steps: [
            { kind: "input", text: "Question" },
            { kind: "process", text: "Recall: bi-encoder, top-50", caption: "~€0.0001 — fast and wide" },
            { kind: "process", text: "Rerank: cross-encoder reads each pair", caption: "~€0.004 — careful, shortlist only" },
            { kind: "output", text: "Top-5 into the context" },
          ],
        },
        prose: [
          "Atlas's most-cited failure: the quorum-recovery runbook ranked **12th** in hybrid retrieval — a good rank for a near-miss list, a disaster for a top-5 context. Raising k to 15 pulls the runbook in buried under ten mediocre pages — the lost-in-the-middle trade from the foundations course. The reranker is the structural exit: keep k small, but let a **second, more careful reader** reorder the shortlist first.",
          "The two readers differ in *how* they read. The **bi-encoder** embeds question and page separately and compares addresses — cheap enough for 12,000 pages in milliseconds, blind to everything but meaning-location. The **cross-encoder** feeds question and page through the model **together**, attention across both — it notices that the rank-12 runbook is precisely *about* this failure. That care costs roughly 40× per page, which is why it meets only the 50 survivors, never the corpus.",
          "The economics are the design: `50 × €0.004 = €0.20` per query to rerank the shortlist — versus `12,000 × €0.004 = €48` if the cross-encoder ever met the whole corpus, which is why it never does. Cheap pass wide (50 of 12,000), expensive pass narrow (5 of 50). Production teams treat **hybrid recall + rerank** as the default stack — the research consensus, and Atlas's shipped configuration. The golden set from lesson 7 verifies it's earning its latency on *your* traffic, per the when-NOT rule.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "The right document reliably ranks 10th–15th in retrieval. A teammate proposes raising k from 5 to 20. What does the reranking alternative change?",
            choices: [
              {
                id: "a",
                label: "Instead of burying the right page under 15 mediocre ones, a cross-encoder rereads the top-50 and moves the right page into the top-5 — precision up without rebuilding the pile",
              },
              {
                id: "b",
                label: "Reranking is just a slower way to raise k — same result, more cost",
              },
              {
                id: "c",
                label: "It replaces the first-stage retriever entirely, so only the reranker touches the corpus",
              },
            ],
            answer: "a",
            explanation:
              "Raising k trades precision for recall and re-creates the buried-page failure; reranking keeps the context small while fixing the order. It never touches the corpus — the cross-encoder is too expensive to run wide, which is the entire division of labor.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Your corpus is 800 short FAQ entries and first-stage retrieval already puts the right entry in the top-3 for 96% of golden-set questions. The team proposes adding a cross-encoder reranker. What's the proportionate response?",
            choices: [
              {
                id: "a",
                label: "Skip it — the reranker's gains are inside the noise on a task the first stage already solves, and it adds latency to every query",
              },
              {
                id: "b",
                label: "Add it — rerankers are the production baseline everywhere",
              },
              {
                id: "c",
                label: "Add it, plus raise k to 50 for the reranker to work with",
              },
            ],
            answer: "a",
            explanation:
              "The baseline claim comes with the when-NOT rule: reranking pays where first-stage ranking has real errors to fix. At 96% top-3 on the golden set, there's almost nothing to rescue — the extra hop buys milliseconds of latency and a bill for gains the suite can't even detect.",
          },
        ],
      },
      {
        slug: "query-understanding",
        title: "Query Understanding",
        blurb:
          "Rewrite follow-ups into whole questions, split multi-part asks, expand jargon — before the index sees anything.",
        topic: "queries",
        skillIds: ["query-understanding", "rag-pipeline"],
        capability:
          "Transform raw queries into searchable ones: context-aware rewriting, decomposition, and term expansion.",
        minutes: 8,
        concept: {
          anchor: "A good receptionist repeats your half-finished question in full before opening the filing cabinet.",
          what: "**Query understanding** sits between the user and the index: **rewrite** follow-ups into self-contained questions using chat history, **decompose** multi-part asks into separate searches, and **expand** jargon with the terms the docs actually use.",
          why: "Search can only answer the question it receives — “and what about part-time?” embeds into nothing. Every downstream stage inherits whatever the query stage sends it.",
          where: [
            "A **chat assistant** whose second question is always missing its first half",
            "A **support bot** fielding three-questions-in-one messages",
            "An **engineering assistant** where users' words for a failure differ from the runbook's",
          ],
          whenNot:
            "Don't rewrite single, complete, well-formed questions — an extra model call per query is pure latency (the wait time for a response); route obvious queries straight to search.",
        },
        diagram: {
          kind: "flow",
          steps: [
            { kind: "input", text: "Raw question + chat history" },
            { kind: "decision", text: "Rewrite if fragment · decompose if multi-part · expand if jargon" },
            { kind: "process", text: "Searchable queries" },
            { kind: "output", text: "Each query runs the retrieval pipeline" },
          ],
        },
        prose: [
          "Atlas's support logs told a quiet story: conversations worked until the second question. “What's the parental leave policy?” retrieved beautifully. “And what about part-time?” — the question users actually ask next — embedded into a meaningless fragment and retrieved nothing. The index never saw a whole question, so no amount of retrieval tuning could help.",
          "The three moves cover the real cases. **Rewrite** merges history: the fragment becomes “what is the parental leave policy for part-time employees?” — a question with a neighborhood. **Decompose** splits compound asks (“compare Berlin and Austin vacation policy and tell me who approves” becomes three searchable queries merged at answer time). **Expand** bridges vocabularies: the engineer's “quorum storm” also searches the runbook's words — *cache quorum lost, E-4821, split-brain*.",
          "Note the placement: understanding runs **before** embedding (meaning coordinates for text), so it must be cheap and reliable — usually the small model, a tight prompt, and a hard rule to pass through complete questions untouched. It's the stage that makes lessons 3 and 4 honest: hybrid search and reranking are excellent at finding what a broken query never asked for.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A chat-based docs assistant answers first questions well but returns irrelevant results on every follow-up (“what about in Germany?”, “does that apply to contractors?”). Retrieval config has been tuned for weeks. What's the actual fix?",
            choices: [
              {
                id: "a",
                label: "Add query rewriting: merge chat history so each search runs on a complete, self-contained question",
              },
              {
                id: "b",
                label: "Keep tuning retrieval — the follow-ups must be a ranking problem",
              },
              {
                id: "c",
                label: "Ask users to restate every question in full",
              },
            ],
            answer: "a",
            explanation:
              "The symptom signature is exact: fragments embed into nowhere, and no retriever can find what was never asked. Weeks of ranking tuning couldn't help because the failure is one stage upstream. Pushing restatement onto users redesigns the product around a missing five-line rewrite step.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Users of an engineering assistant type “the cluster went split-brain after the quorum storm” — but the runbooks call it “cache quorum lost (E-4821)”. Same failure, different words. Which query-understanding move closes the gap?",
            choices: [
              {
                id: "a",
                label: "Expansion: add the docs' terminology — quorum lost, E-4821 — to the search query so hybrid retrieval has the exact tokens to match",
              },
              {
                id: "b",
                label: "Decomposition: split the sentence into three separate searches",
              },
              {
                id: "c",
                label: "Rewriting with history: check what the user asked previously",
              },
            ],
            answer: "a",
            explanation:
              "This is a vocabulary gap, not a structure gap: the user's phrase and the runbook's phrase name one incident. Expansion injects the corpus's own tokens (word-sized pieces the model reads) — which also arms the keyword half of hybrid search with the exact identifier E-4821. Decomposition addresses compound questions; history-rewriting addresses fragments — neither applies here.",
          },
        ],
      },
      {
        slug: "citations-and-grounding",
        title: "Grounded Answers with Citations",
        blurb:
          "Answers cite their pages, partials mark their boundaries, and gaps become honest refusals — logged as the index's to-do list.",
        topic: "grounding",
        skillIds: ["grounded-citations", "rag-failure-basics"],
        capability:
          "Enforce the grounding contract: answer only from retrieved pages, cite claims, mark partial coverage, refuse on gaps.",
        minutes: 8,
        concept: {
          anchor:
            "Answer only from the notes on your desk — point to the page you used, or admit the binder has nothing.",
          what: "The **grounding contract** has three behaviors: the pages cover it → **answer and cite**; they cover half → **answer the covered part and mark the boundary**; they say nothing → **refuse honestly** (“not in the docs”) — never the confident gap-fill.",
          why: "Citations are what make an assistant auditable and trusted; refusals are what make it safe. And every logged refusal is a **mapped gap** — the exact document the knowledge base is missing.",
          where: [
            "A **policy assistant** whose every claim ends in `[doc, page]`",
            "A **support bot** that says which half of a compound question the docs cover",
            "A **knowledge-base team** mining refusal logs for what to write next",
          ],
          whenNot:
            "Don't ground when the task is **creation, not retrieval** — writing a poem or summarizing a doc the user pasted doesn't need citations, and forcing them produces decorative fake ones.",
        },
        diagram: {
          kind: "decision",
          root: {
            kind: "decision",
            question: "Do the retrieved pages cover the question?",
            branches: [
              {
                label: "yes",
                node: { kind: "leaf", answer: "Answer + cite every claim" },
              },
              {
                label: "partially",
                node: {
                  kind: "leaf",
                  answer: "Answer the covered part — say what isn't covered",
                },
              },
              {
                label: "no",
                node: {
                  kind: "leaf",
                  answer: "Refuse honestly — and log the gap",
                  caption: "the index's to-do list, written by users",
                },
              },
            ],
          },
        },
        prose: [
          "Atlas's trust problem wasn't wrong answers — it was **untraceable** ones. “Probably your team lead approves that — most companies do it that way” is fluent, plausible, and backed by nothing the company ever wrote. One such answer costs more trust than fifty cited ones earn. The grounding contract is the fix, and it's behavioral before it's technical: cite claims, mark boundaries, refuse gaps.",
          "The refusal deserves its reframe: it's a feature with a business case. Users trust “that&apos;s not in the docs” far more than a guess that might unravel — and every refusal, logged with its question, is a **mapped gap**: the knowledge-base team's next writing assignment, prioritized by real demand. Atlas's refusal log became the ingestion roadmap within a month.",
          "Enforcement is two-layered. The system prompt sets the rules — only the retrieved pages, cite each claim, refuse on gaps — but a rule isn&apos;t a contract until something checks it. Lesson 7&apos;s **faithfulness** metric scores answer-against-context on the golden set and on sampled production traffic, so a drifting (slowly changing course) prompt or model gets caught by the suite, not by the first unlucky user.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "An internal-policy assistant answers 'who approves exception requests?' with 'your manager, typically' — no citation. The docs never state who approves. What has the system done, and what should it have done?",
            choices: [
              {
                id: "a",
                label: "Confidently gap-filled from general knowledge — it should have refused: 'the docs don't say who approves,' and logged the question as a content gap",
              },
              {
                id: "b",
                label: "Answered correctly — 'typically your manager' is a safe default",
              },
              {
                id: "c",
                label: "Failed at retrieval — a better index would find the approving role somewhere",
              },
            ],
            answer: "a",
            explanation:
              "The docs don't contain the answer, so no retrieval improvement manufactures it — the model bridged the gap with world knowledge, which is precisely what the contract forbids. The honest refusal is both safer for the user and more useful to the org: the logged gap tells the policy team exactly what to document.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "The knowledge-base team asks how to decide what documentation to write next quarter. You have six months of logged refusal questions. What's the honest answer?",
            choices: [
              {
                id: "a",
                label: "Rank the refusal log by frequency — the questions users actually asked and the docs failed to answer are the highest-value writing assignments",
              },
              {
                id: "b",
                label: "The refusals show the assistant is failing — disable the refusal feature first",
              },
              {
                id: "c",
                label: "Ignore the log — documentation priorities should come from intuition",
              },
            ],
            answer: "a",
            explanation:
              "Every refusal is demand evidence with a receipt: a real question, timestamped, that the corpus couldn't serve. Ranked by frequency it's a content roadmap written by the users themselves. Disabling refusals converts the same failures into confident guesses — invisible and more damaging.",
          },
        ],
      },
      {
        slug: "rag-evaluation",
        title: "Evaluating RAG: The Four Questions",
        blurb:
          "Score retrieval and generation separately — context recall, precision, faithfulness, relevance — or fix nothing.",
        topic: "evals",
        skillIds: ["rag-metrics", "rag-failure-basics"],
        capability:
          "Diagnose any failed answer with the four-question split, and score the pipeline per stage on a golden set.",
        minutes: 8,
        concept: {
          anchor:
            "A car dashboard shows fuel, speed, and temperature on separate needles — one blended dial hides which warning lit.",
          what: "RAG evaluation asks **four questions on two sides**: retrieval — **context recall** (did the right pages arrive?) and **context precision** (was what arrived relevant and well-ranked?); generation — **faithfulness** (does the answer stick to its pages?) and **answer relevance** (does it address the question?).",
          why: "The four fail independently and need different fixes — a grounded (tied to real source documents) refusal can hide a retrieval miss; a faithful answer can dodge the question. Averaged single scores hide which side broke; the four-question split points at the fix.",
          where: [
            "A **golden set** of ~100 real questions with known-right pages, scored per stage",
            "**LLM-as-judge** scoring faithfulness and relevance on sampled production traffic",
            "Regression gates: any pipeline change must move none of the four backward",
          ],
          whenNot:
            "Don't build the judge before the **golden set** exists — judging synthetic perfect-grammar questions measures nothing about your real traffic's messy phrasings.",
        },
        diagram: {
          kind: "compare",
          left: { title: "Retrieval side", subtitle: "about the context" },
          right: { title: "Generation side", subtitle: "about the answer" },
          rows: [
            { label: "Question", left: "right pages retrieved?", right: "answer faithful to pages?" },
            { label: "Metric", left: "context recall · context precision", right: "faithfulness · answer relevance" },
            { label: "Catches", left: "stale index, bad chunking, weak search", right: "gap-fills, contradictions, off-topic eloquence" },
            { label: "Fixes live in", left: "ingestion, retrieval, reranking", right: "prompting, grounding contract, model choice" },
            { label: "When NOT to use", left: "—", right: "—" },
          ],
        },
        prose: [
          "The foundations course's diagnostic — *was the right page in the window?* — grows up here into four metrics, and the widget above makes the point better than prose: the polite refusal that was actually a **context recall** failure; the confident contradiction that was **faithfulness**; the eloquent non-answer that only **answer relevance** catches. Four independent dials, each pointing at a different subsystem.",
          "The instrument is a **golden set**: a hundred real questions with known-right pages, drawn from actual traffic and past failures. Retrieval metrics score mechanically — `context recall = questions whose pages arrived ÷ all questions`, `context precision = relevant chunks ÷ retrieved chunks` — and generation metrics use an **LLM judge** with a consistent rubric, knowing judges carry their own biases, so spot-check them against human labels monthly. Every pipeline change — chunker tweak, model swap, prompt edit — runs the set, and none of the four may regress.",
          "The discipline that makes it a system: score the four **separately, forever**. The moment they collapse into one “quality score,” the diagnostic power is gone — a recall dip hides behind a faithfulness gain, and nobody knows which subsystem to walk toward. The four questions are the pipeline's dashboard; keep the needles split.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A RAG assistant's answers suddenly contradict their own citations — pages say one thing, answers another. Retrieval traces show the correct pages arriving. Which of the four metrics catches this, on which side?",
            choices: [
              {
                id: "a",
                label: "Faithfulness, generation side — it scores the answer against the retrieved context it was given",
              },
              {
                id: "b",
                label: "Context recall, retrieval side — the pages must be missing",
              },
              {
                id: "c",
                label: "Answer relevance — the answer isn't addressing the question",
              },
            ],
            answer: "a",
            explanation:
              "The traces are the receipt: context arrived right, so the retrieval metrics pass by construction. An answer contradicting the evidence in its own window is the faithfulness failure — caused typically by a prompt/model change, and fixed on the generation side, not the index.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A team reports “RAG quality at 82%” from a single blended score, up 3 points after a chunking overhaul. What can't they tell from that number — and what would?",
            choices: [
              {
                id: "a",
                label: "Which subsystem moved — the four split metrics would show recall/precision gains from chunking while confirming faithfulness/relevance held steady",
              },
              {
                id: "b",
                label: "Nothing — a 3-point rise is proof enough that chunking worked",
              },
              {
                id: "c",
                label: "Only the judge's mood — LLM scores can't be trusted at all",
              },
            ],
            answer: "a",
            explanation:
              "A blended score can rise while faithfulness quietly fell — the +3 could be a +8 recall masked by a −5 grounding regression, and each needs a different response. The four questions exist precisely to keep the needles separate. (And while judges carry bias, the fix is calibration against human labels, not distrust.)",
          },
        ],
      },
      {
        slug: "rag-observability",
        title: "RAG Observability",
        blurb:
          "Trace the query, chunks, scores, reranks, and context shape — “why this answer?” becomes a lookup.",
        topic: "observability",
        skillIds: ["rag-observability", "rag-pipeline"],
        capability:
          "Read a retrieval trace to explain any answer, and record the spans that catch silent regressions.",
        minutes: 7,
        concept: {
          anchor:
            "A cash-register receipt replays the whole purchase — item, price, time — so any dispute is a lookup, not a guess.",
          what: "**RAG observability** records a retrieval trace per request: the **query as sent** (post-rewrite), **retrieved chunks with scores**, **rerank movements**, **context shape** (count, tokens, sources), and per-stage latency.",
          why: "RAG failures are silent variables — a chunker regression, a shrunken context, a query the rewriter mangled. The trace turns “why this answer?” from a seance into a lookup, and patterns across traces catch regressions before users do.",
          where: [
            "The **2am mystery** — odd citations traced to chunk sizes dropping 3× after a config change",
            "**Weak-spot mining**: clustering low-score retrievals to find missing docs",
            "The eval loop: sampled production traces feeding the golden set",
          ],
          whenNot:
            "Don't log raw page content at scale by default — **structure, not text** (scores, sizes, versions) answers most questions without creating a privacy store; capture content only where policy allows.",
        },
        diagram: {
          kind: "flow",
          steps: [
            { kind: "input", text: "Question arrives" },
            { kind: "process", text: "Spans: query · chunks+scores · rerank · context shape · latency" },
            { kind: "output", text: "Answer + a trace that explains it" },
          ],
          loop: "sampled traces feed the golden set — the suite grows from reality",
        },
        prose: [
          "At 2am, Atlas began citing vacation pages for parental-leave questions. The model hadn&apos;t changed, the prompt hadn&apos;t changed, and the queries were identical. Predict your suspect before the reveal: model, prompt, or index? The trace had the answer in ten seconds: **chunk sizes across the index had dropped to a third** — a chunker config regression in Tuesday&apos;s re-ingest. Whole procedures were now fragments; their embeddings (meaning coordinates for text) matched worse; near-miss pages started winning. One config revert; the model was never touched.",
          "That's the trace&apos;s job: it records the request&apos;s **whole biography** — the query as actually sent (post-rewrite, which catches query-understanding bugs), every retrieved chunk with its score, what the reranker moved, and the final context&apos;s shape. “Why this answer?” becomes reading five rows instead of guessing across five subsystems.",
          "Aggregated, traces become preventive: average chunk size over time catches ingest regressions; score distributions flag index drift (the index slowly going stale); clusters of low-confidence retrievals map the corpus&apos;s weak spots — which connect straight back into the golden set and the refusal log. Record **structure, not content** as the default — scores, sizes, versions — and capture page text only where privacy policy allows it.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "After a routine re-index, answers drift subtly for a week before anyone notices. Which recorded span would have caught it the same night?",
            choices: [
              {
                id: "a",
                label: "Context shape over time — average chunk size and token counts per request, which a chunker regression changes immediately and visibly",
              },
              {
                id: "b",
                label: "Answer latency — slower answers always mark retrieval trouble",
              },
              {
                id: "c",
                label: "Query logs — the users must have changed how they ask",
              },
            ],
            answer: "a",
            explanation:
              "Ingestion regressions hit structure first: chunk sizes, per-request token counts, source counts. A dashboard over context-shape spans shows the step-change the night of the deploy — latency stayed normal (fragments retrieve fast, just badly), and blaming users for a same-day correlation with your own re-index inverts the evidence.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Your RAG traces show a cluster of queries consistently retrieving chunks with scores far below the average — all about the new hardware line the docs barely cover. What is that cluster, productively?",
            choices: [
              {
                id: "a",
                label: "A mapped corpus gap — feed those queries to the golden set and the refusal log, and the documentation team has a prioritized writing list",
              },
              {
                id: "b",
                label: "Noise to filter — low-score clusters should be excluded from analytics",
              },
              {
                id: "c",
                label: "Evidence the embedding model needs replacing",
              },
            ],
            answer: "a",
            explanation:
              "Persistently low scores on one topic is the index saying 'I have nothing good here' — the pattern behind every weak-spot. Excluding it hides the finding; re-embedding won't write the missing docs. The cluster is free prioritization: real demand the corpus fails to serve.",
          },
        ],
      },
      {
        slug: "ingestion-pipeline",
        title: "The Ingestion Pipeline",
        blurb:
          "Parse → chunk → embed → index, with metadata, incremental sync, and deletes propagated — the index tracks its sources.",
        topic: "ingestion",
        skillIds: ["rag-ingestion", "chunking-strategy"],
        capability:
          "Run the ingestion loop: structure-aware parsing and chunking, version-stamped metadata, updates replaced, deletes propagated.",
        minutes: 8,
        concept: {
          anchor:
            "A library that shelves new editions but never strikes discarded books serves ghosts — the catalog must track the shelves.",
          what: "The **ingestion pipeline** turns sources into an honest index: **parse** (tables and code preserved) → **chunk** (at the joints) → **embed** (one model) → **index with metadata** (source, doc_id, version, updated_at) — plus the **sync loop**: updated docs re-ingested by id, deleted docs&apos; chunks removed.",
          why: "Every stale-page failure is an ingestion debt: the index drifted (slowly went stale) from its sources and confidently served the difference. Orphaned chunks — embeddings (meaning coordinates for text) outliving their deleted sources — institutionalize the failure.",
          where: [
            "A **daily sync** re-ingesting changed pages by doc_id, overwriting (never duplicating)",
            "**Delete propagation** — source removed, chunks gone the same cycle",
            "**Version stamps** making “which revision answered this?” answerable forever",
          ],
          whenNot:
            "Don't build incremental sync for a **truly static corpus** — a one-time ingest of frozen documents needs the stages but not the loop; anything alive needs the loop.",
        },
        diagram: {
          kind: "flow",
          steps: [
            { kind: "input", text: "Sources: docs, wikis, tickets" },
            { kind: "decision", text: "Parse → chunk → embed → index, with metadata" },
            { kind: "output", text: "Fresh index matching its sources" },
          ],
          loop: "doc updated → re-ingest by doc_id · doc deleted → chunks removed",
        },
        prose: [
          "The beginner course met the stale page as a mystery — the right page, last year's policy. Here it's an engineering debt with a named creditor: **ingestion**. The pipeline's stages are simple; the honesty lives in the metadata and the loop. Every chunk carries its **source, doc_id, version, and updated_at** — so “which revision of which document produced this answer?” is a lookup, and re-ingestion can replace old chunks instead of piling duplicates.",
          "The loop is where systems quietly rot. A doc updated must mean its chunks **re-embedded and replaced by doc_id**; a doc deleted must mean its chunks **removed the same cycle** — or they live on as orphans, untraceable ghosts still winning rankings and citing pages that no longer exist. The research on index drift is unambiguous: without the loop, retrieval quality erodes silently, double digits inside a year, with zero code changes.",
          "And that&apos;s Atlas, shipped: chunks cut at structure, hybrid search fused, reranker rescuing rank-12, queries rewritten whole, answers cited or refused, four metrics on a golden set, traces on every request — and an ingestion loop that keeps the index identical to its sources. The stack the research calls the production baseline, assembled with judgment. Course three takes it to scale: permissions, freshness at 40k documents, agentic retrieval, and the architecture review.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A policy doc was deleted from the wiki last month, but the assistant still cites it weekly. The ingestion sync runs daily — for additions and updates. What's missing?",
            choices: [
              {
                id: "a",
                label: "Delete propagation — the sync never removes chunks for deleted sources, so the doc lives on as orphaned embeddings still winning rankings",
              },
              {
                id: "b",
                label: "The embedding model is stale — re-embedding the corpus would clear it",
              },
              {
                id: "c",
                label: "The assistant is hallucinating a document that was never there",
              },
            ],
            answer: "a",
            explanation:
              "A sync that adds and updates but never deletes guarantees this failure: the chunks persist, the retrieval is genuinely finding them, and the citation is honest about a ghost. Re-embedding recreates the same orphans in a new map — the fix is propagating deletions by doc_id, the same cycle as updates.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "An auditor asks: “Exactly which revision of the refund policy produced this customer's answer in March?” What ingestion-stage design answers this in one query?",
            choices: [
              {
                id: "a",
                label: "Version-stamped metadata on every chunk — source, doc_id, version, updated_at — kept through every re-ingest, so answers trace to the exact revision",
              },
              {
                id: "b",
                label: "The chat logs — the model's answer text usually names the version",
              },
              {
                id: "c",
                label: "Nothing can answer that after the fact — re-ingestion overwrites history",
              },
            ],
            answer: "a",
            explanation:
              "Traceability is decided at ingestion: chunks that carry (doc_id, version, updated_at) make every historical answer auditable — the metadata is the difference between a lookup and an archaeology project. Chat logs depend on the model volunteering what it was never asked to say, and overwriting *chunks* need not overwrite the *record* of which version served which answer.",
          },
        ],
      },
    ],
};

export default course;
