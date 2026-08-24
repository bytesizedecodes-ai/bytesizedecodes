import type { Course } from "../types";

const course: Course = {
    slug: "rag-engineering-at-scale",
    title: "RAG Engineering at Scale",
    subtitle:
      "Atlas at 40k documents: advanced retrieval, agentic loops, graphs, permissions, lifecycle — and the architecture review.",
    description:
      "The expert course: operate a production RAG system under real constraints. Eight lessons follow Atlas as it scales — multi-hop and hierarchical retrieval, agentic loops, GraphRAG selectivity, permission-aware retrieval, index lifecycle and drift, the long-context decision, online evals, and a capstone design review of three real blueprints.",
    level: "expert",
    domain: "AI Engineering",
    access: "paid",
    prerequisites:
      "You should have finished RAG Engineering in Practice. Chunking, hybrid search, reranking, grounding, the four metrics, and ingestion are assumed.",
    lessons: [
      {
        slug: "advanced-retrieval",
        title: "Beyond Top-K: Advanced Retrieval",
        blurb:
          "When answers live across documents: enriched chunks, hierarchical summaries, multi-hop chains. Only the queries that need each one pay for it.",
        topic: "retrieval",
        skillIds: ["advanced-retrieval", "rag-pipeline"],
        capability:
          "Recognize cross-document and multi-hop question shapes and match them to enrichment, hierarchy, or decomposition.",
        minutes: 9,
        concept: {
          anchor:
            "A hospital triage desk — routine cases take the fast lane, only the complex ones see the specialists.",
          what: "**Advanced retrieval** answers questions top-k can't. It has three parts: **contextual enrichment** (chunks prefixed with their document's summary, disambiguating at index time), **hierarchical summaries** (a summary layer indexed alongside chunks for cross-document synthesis), and **multi-hop decomposition** (retrieve, then re-retrieve with what the first hop taught).",
          why: "Some answers live across documents — a quarter's incidents, a dependency chain. Retrieval that returns pieces cannot serve questions about populations. Each upgrade adds real cost. So each one ships **per query shape**, never globally.",
          where: [
            "**Cross-doc synthesis** — “summarize this quarter's payment incidents across 40 runbooks”",
            "**Dependency questions** — “which teams rely on the payments service?” (hop 1: the service; hop 2: its dependents)",
            "**Ambiguous pronouns** — chunks whose “it” and “the service” resolve only with the parent doc's context",
          ],
          whenNot:
            "Don't add the ladder for single-hop corpora. 90%+ of real traffic is “what does X say about Y”, and the standard hybrid + rerank path serves it cheapest. Upgrade only where the question mix demands it.",
        },
        diagram: {
          kind: "decision",
          root: {
            kind: "decision",
            question: "What shape is the question?",
            branches: [
              {
                label: "single hop — what does X say about Y",
                node: { kind: "leaf", answer: "Standard pipeline: hybrid + rerank" },
              },
              {
                label: "synthesis across many docs",
                node: { kind: "leaf", answer: "Hierarchical summary layer", caption: "+index size, built at ingestion" },
              },
              {
                label: "multi-hop — chains of reference",
                node: { kind: "leaf", answer: "Decompose and iterate", caption: "+k× latency per hop" },
              },
            ],
          },
        },
        prose: [
          "At 40k documents, Atlas hit the ceiling of top-k retrieval. The limit was not volume — it was **question shape**. “Summarize this quarter's payment incidents” has no answer chunk. The answer is spread across forty runbooks. The five fragments the retriever returns describe five incidents, not the quarter. The fix is not a better ranker. The fix is structure that matches the question.",
          "Three upgrades, three costs. **Contextual enrichment** runs a cheap model over each document at ingestion. It prefixes every chunk with its summary, so “the service” resolves before embedding — one pass, a permanent precision gain. **Hierarchical summaries** index a layer above chunks (section → document → topic). Cross-document questions then match the summary that already synthesizes them. **Multi-hop decomposition** answers chains: hop one finds the payments service, hop two retrieves its dependents. Each hop re-queries with what the last one learned, at `latency ≈ hops × (retrieve + rerank)` per question.",
          "The discipline is the routing. Atlas measured 92% single-hop traffic, so the ladder shipped for the 8%: summaries for synthesis questions, multi-hop for dependency chains. The 92% kept the fast path. **Advanced retrieval is per-question-shape machinery**, and the query classifier that routes between the tiers is part of the design. The boundary: on a single-hop corpus, where 90%+ of traffic is “what does X say about Y”, every tier above hybrid + rerank is pure latency and index spend — paid for, and earning nothing.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "An analyst asks your 30k-doc assistant: “What were the common root causes across this quarter's payment incidents?” It returns five incident fragments. None is wrong, and none is an answer. What class of failure is this, and which upgrade fixes it?",
            choices: [
              {
                id: "a",
                label: "A synthesis question served by piece-retrieval — a hierarchical summary layer indexes the cross-document answer shape the question needs",
              },
              {
                id: "b",
                label: "A ranking failure — the reranker needs retraining on incident data",
              },
              {
                id: "c",
                label: "A chunking failure — smaller chunks would surface more incidents",
              },
            ],
            answer: "a",
            explanation:
              "The five fragments are the retriever working exactly as designed — it returns pieces. The question is about a population, and populations need structure above pieces: the summary layer that synthesizes incidents across runbooks. Smaller chunks return more, smaller pieces of the same non-answer. Retraining a ranker can't rank what was never retrieved as a unit.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Your traffic log shows 4% of queries are dependency chains (“which teams consume the events service?”), and those queries drive 40% of escalations. Multi-hop adds ~2× latency to the queries that use it. What's the proportionate architecture?",
            choices: [
              {
                id: "a",
                label: "Route by query shape: a cheap classifier sends chain questions to multi-hop; the 96% keep the single-pass path",
              },
              {
                id: "b",
                label: "Enable multi-hop for all queries — one consistent path beats special cases",
              },
              {
                id: "c",
                label: "Decline the upgrade — 4% of traffic never justifies new machinery",
              },
            ],
            answer: "a",
            explanation:
              "The two numbers pull in opposite directions, and routing honors both. 4% of volume says don't tax everyone. 40% of escalations says the minority causes the pain. Global multi-hop doubles everyone's latency and gives the majority zero benefit. Declining it leaves the noisiest failures in production. The router is the design.",
          },
        ],
      },
      {
        slug: "agentic-rag",
        title: "Agentic RAG",
        blurb:
          "The model drives retrieval: sufficiency checks, refined re-queries, a hard budget. Query shape routes queries in, and the loop is never the default.",
        topic: "agentic",
        skillIds: ["agentic-rag", "advanced-retrieval"],
        capability:
          "Design the retrieval control loop: assess sufficiency, refine and re-query, escalate or refuse when the budget is spent. Route into the loop by query shape.",
        minutes: 10,
        concept: {
          anchor: "A researcher with a library card and a stopwatch: keep searching only while the budget holds.",
          what: "**Agentic RAG** gives the model control of retrieval. It decides **whether to retrieve**. It **assesses whether the context suffices**. It **refines the query** with what the first pass taught, then re-retrieves. All of it runs under a **retrieval budget** that ends the loop in escalation or honest refusal.",
          why: "Single-pass retrieval commits before it knows whether the evidence is any good. The loop iterates on evidence quality. The price is real: ~6× the retrieval cost, plus seconds of latency. So the loop is **routed to by query shape**, never defaulted on.",
          where: [
            "**Research modes** on hard multi-part questions, escalating to a single careful pass when evidence suffices",
            "**Self-checking pipelines** that refuse (“the docs don't cover it”) only after the loop genuinely tried",
            "**Hybrid-structure agents** — hop to the vector index, hop to the graph, as the question demands",
          ],
          whenNot:
            "Don't loop on single-hop traffic. A budgeted loop on a question one pass answers is pure latency. The router exists so the 92% never pay for the 8%.",
        },
        diagram: {
          kind: "decision",
          root: {
            kind: "decision",
            question: "After each retrieval pass:",
            branches: [
              {
                label: "context sufficient?",
                node: { kind: "leaf", answer: "Answer, grounded and cited" },
              },
              {
                label: "budget remaining?",
                node: { kind: "leaf", answer: "Refine the query with what was learned — retrieve again" },
              },
              {
                label: "budget spent",
                node: { kind: "leaf", answer: "Escalate or refuse — never loop forever" },
              },
            ],
          },
        },
        prose: [
          "The intermediate course's pipeline runs once: retrieve, ground, answer. Quality is fixed at the first pass. **Agentic RAG** makes retrieval a control loop: the model reads what came back and *decides*. Near-miss evidence? Extract what's missing, rewrite the query with what the first pass taught, and retrieve again. The loop borrows its discipline from harness engineering: a **budget** (retrieval passes, cost) ends it in escalation or honest refusal — never in an infinite search.",
          "Atlas shipped it as **research mode**, and the numbers matter: ~€0.037 per query against €0.006 for the single pass. `loop cost = passes × (retrieve + assess + refine)`, and the passes multiply — **sixfold**. On the hard multi-part questions it scored twenty points better and halved escalations. On everything else it was six times the cost for nothing. So the router went in front: query shape decides who gets the loop.",
          "The failure mode to design against is philosophical drift: the loop quietly becoming the default because it demos well. The router is a failure surface too (misroutes get their own eval slice). But a misrouted single-pass query costs latency, while a fleet-wide loop costs the margin. **Autonomy is per-question machinery, budgeted, routed, and evaluated — not a setting.**",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A team enables an agentic retrieval loop with no budget for all queries, citing better demo answers. Two weeks later: costs up 5×, p95 latency tripled, simple FAQ answers fine. What's the structural mistake?",
            choices: [
              {
                id: "a",
                label: "No routing and no budget: single-hop traffic now pays loop prices, and nothing bounds the iterations the hard questions take",
              },
              {
                id: "b",
                label: "The loop model is too small — a larger model would iterate less",
              },
              {
                id: "c",
                label: "Agentic RAG simply doesn't work in production",
              },
            ],
            answer: "a",
            explanation:
              "The demo showed the loop's best case (hard questions); production billed its worst case (every question). Both missing pieces are structural. The router keeps single-hop traffic on the fast path. The budget caps what the loop can spend — escalate or refuse when it's spent. The pattern works exactly where those two constraints exist.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Your agentic assistant's refusal rate jumped after a change. Traces show loops ending at budget with “insufficient evidence” on questions the docs clearly answer in one page. Where do you look first?",
            choices: [
              {
                id: "a",
                label: "The sufficiency check — its bar moved: the assessor now rejects perfectly good single-pass evidence and burns the budget re-querying",
              },
              {
                id: "b",
                label: "The retrieval index — the pages must have vanished",
              },
              {
                id: "c",
                label: "The budget — raise it so loops can keep trying",
              },
            ],
            answer: "a",
            explanation:
              "The traces show the story: the right page arrives (retrieval fine), the loop continues anyway (sufficiency mis-judging), and the budget runs out. Refusal is the honest end state of a dishonest assessment. Raising the budget buys more wrong loops around the same bad gate. Fix the gate. The eval suite's faithfulness slice should have caught it in CI.",
          },
        ],
      },
      {
        slug: "graphrag",
        title: "GraphRAG and Knowledge Graphs",
        blurb:
          "Traversal questions need graph structure: build it selectively over the relationship-dense slice, next to the vector index.",
        topic: "graph",
        skillIds: ["graphrag", "advanced-retrieval"],
        capability:
          "Decide when a knowledge graph pays: traversal-shaped queries, the build cost, freshness ripple, and the selectivity rule.",
        minutes: 10,
        concept: {
          anchor: "The subway map, not the brochure stack, answers which stops connect to which.",
          what: "**GraphRAG** extracts entities and relations from the corpus into a **knowledge graph** with **community summaries**. It answers **traversal questions** (“which teams depend on the payments service?”) that similarity search structurally cannot.",
          why: "Some answers are the graph embedded in your documents — org charts, service dependencies, multi-entity chains. Vectors retrieve pages *about* relationships. The graph traverses the relationships themselves, and community summaries synthesize across them.",
          where: [
            "**Service-dependency maps** extracted from architecture docs and runbooks",
            "**Org and ownership questions** — who owns what, who reports to whom",
            "**Cross-entity synthesis** — “everything connected to this incident” as one traversal",
          ],
          whenNot:
            "Don't graph the whole corpus. The build is LLM-heavy, and one doc edit can ripple through communities. The research consensus is selectivity: graph the **relationship-dense slice** and let the vector index keep the rest.",
        },
        diagram: {
          kind: "compare",
          left: { title: "Vector index", subtitle: "similarity over chunks" },
          right: { title: "Knowledge graph", subtitle: "traversal over entities" },
          rows: [
            { label: "Query shape", left: "“what does X say about Y”", right: "“what relates to X, through whom”" },
            { label: "Build", left: "chunk + embed — one pass", right: "extract entities, relations, communities — LLM-heavy" },
            { label: "Freshness", left: "re-ingest the changed doc", right: "edits ripple through communities — partial rebuilds" },
            { label: "Where it wins", left: "pages, passages, paraphrase (the 92%)", right: "org charts, service maps, entity chains" },
            { label: "When NOT to use", left: "traversal questions", right: "similarity questions — and whole-corpus builds" },
          ],
        },
        prose: [
          "Atlas's escalation log had a pattern: “which teams depend on the payments service?” failed in vector search every single week. The documents had the answer — the service registry names every consumer. It failed because **the answer is a traversal**, and similarity search returns passages, not paths. GraphRAG closes the gap by extracting the graph the docs already contain: entities (services, teams), relations (depends-on, owns), and community summaries that synthesize each cluster.",
          "The price is real, and it is the research's most consistent warning. The graph build is **LLM-heavy** — extraction over 40k documents is a project, not a config. Freshness also ripples, because one service-registry edit can reshape communities. That is why the consensus rule is **selectivity**. Atlas graphed the 800 relationship-dense documents (registry, org chart) and left the other 39,200 to the vector index. The query router decides which structure answers which question.",
          "The result is a layered estate, not a replacement. Vectors serve the 92%. The graph serves the traversal questions that drove 40% of escalations. Summaries sit on top when synthesis is asked. The graph also joins the **lifecycle**: its freshness axis joins the dashboard, and its rebuilds are planned like embedding migrations. A graph is a commitment — make it only for the query mix that earns it. The boundary: if the query mix shifts back to similarity, the estate carries a second index, a rebuild discipline, and a freshness axis. All paid, none earning.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Your org's architecture council asks: “GraphRAG looks powerful — should we migrate our 60k-doc knowledge base to it?” What's the technically honest answer?",
            choices: [
              {
                id: "a",
                label: "No migration — graph the relationship-dense slice (service registry, org docs) next to the vector index; the 90%+ similarity questions keep the cheap, fresh path",
              },
              {
                id: "b",
                label: "Yes — graphs supersede vector search for enterprise corpora",
              },
              {
                id: "c",
                label: "Yes, but only if the build finishes within a quarter",
              },
            ],
            answer: "a",
            explanation:
              "The power is real and the cost is real: LLM-heavy builds, freshness ripple, and a second system to operate. That cost is paid entirely to answer questions the vector index already answers. The selectivity rule puts the graph where it's earned (traversal mixes) and nowhere else. Timing a whole-corpus build just schedules the wrong decision.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "After a re-org, 200 documents changed ownership references. Vector-index answers updated after re-ingestion, but the graph's “who owns X” answers are stale for some entities. Why does the graph need different treatment?",
            choices: [
              {
                id: "a",
                label: "Edits ripple through communities: an ownership change can alter entity relations and the summaries built over them — graph updates are targeted partial rebuilds, not doc re-ingests",
              },
              {
                id: "b",
                label: "The graph doesn't update at all — it must be rebuilt from scratch monthly",
              },
              {
                id: "c",
                label: "The vector index is stale too; both just re-embed everything",
              },
            ],
            answer: "a",
            explanation:
              "A vector index's freshness unit is the document. A graph's unit is the sub-structure: entities, their edges, and the community summaries computed over them. One ownership edit can touch several communities, so graph maintenance means targeted rebuilds of affected sub-graphs (and that axis belongs on the drift dashboard). Full monthly rebuilds waste the design. Pretending edges re-embed like chunks misunderstands it.",
          },
        ],
      },
      {
        slug: "permission-aware-retrieval",
        title: "Permission-Aware Retrieval",
        blurb:
          "RAG bypasses every file permission system — unless the index carries ACLs and the query filters on them before search.",
        topic: "security",
        skillIds: ["permission-aware-retrieval", "rag-ingestion"],
        capability:
          "Enforce document permissions at retrieval: ACL metadata on chunks, query-time pre-filtering, tenant isolation, and audited filters.",
        minutes: 10,
        concept: {
          anchor: "The guest list is checked at the door, not after everyone is already inside.",
          what: "**Permission-aware retrieval** enforces access control at query time. Every chunk carries its source's **ACLs as metadata**. Every search runs **pre-filtered** to the user's groups. So unauthorized content never enters ranking, never forms context, never leaks. Tenants get **isolated namespaces** by construction.",
          why: "Ingestion flattens permission systems: the wiki said hr-admins-only, the index heard everyone. Retrieval will faithfully find and serve whatever was indexed — the leak is structural, and it fails enterprise security review exactly as the research predicts.",
          where: [
            "**HR and finance docs** living beside public policy in one index",
            "**Multi-tenant SaaS** where tenant-42 must be structurally unable to see tenant-7's chunks",
            "**Audit trails** — permission-denied retrievals logged and tested like the security boundary they are",
          ],
          whenNot:
            "Don't rely on **post-filtering** (rank globally, drop unauthorized results after). It ranks against unauthorized documents, shrinks result sets, and reads as a leak channel in audits. And don't ACL a truly public corpus: filtering costs latency and removes zero risk.",
        },
        diagram: {
          kind: "decision",
          root: {
            kind: "decision",
            question: "Before search runs:",
            branches: [
              {
                label: "tenant-scoped deployment?",
                node: { kind: "leaf", answer: "Isolated namespace or index — by construction" },
              },
              {
                label: "chunk ACLs ∩ user groups",
                node: { kind: "leaf", answer: "Pre-filter the searchable space", caption: "k results means k authorized results" },
              },
              {
                label: "denied?",
                node: { kind: "leaf", answer: "Log it — the filter is a security boundary, tested like one" },
              },
            ],
          },
        },
        prose: [
          "The security review found it in an afternoon. comp-bands-2026.pdf was ACL'd to hr-admins on the wiki, but it sat in the shared index with no ACL attached. Retrieval, doing its job perfectly, served it as the #1 match to a support agent's compensation question. **Ingestion flattens permissions.** The moment the crawler drops the ACL, every document is equal. Retrieval is an honest machine serving a corrupted index.",
          "The fix runs the other direction: **permissions become first-class metadata**. Every chunk carries its source's groups, and every query carries its user's. The search runs **pre-filtered**: the searchable space is the authorized space. Top-5 means five results the user may see, ranked only against what they may see. Tenants go further: **isolated namespaces** make the boundary structural rather than behavioral. And because a filter is a security boundary, it gets security treatment — denial logs, filter tests in CI, ACL-sync on the freshness dashboard.",
          "The trap to refuse is **post-filtering**, because it looks equivalent for one sprint's worth of effort: rank globally, drop unauthorized results. But the ranking was computed against unauthorized documents (distorting every score). The result set shrinks (5 slots, 2 survivors). And the audit team will read the design — correctly — as a leak channel with extra steps. Pre-filter, isolate tenants, audit the boundary: the review passes on that difference.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A security audit finds an internal assistant citing HR salary documents to normal employees. The source wiki correctly restricts them to hr-admins. Where did the enforcement break?",
            choices: [
              {
                id: "a",
                label: "At ingestion: the crawler embedded content without carrying the source ACLs, and retrieval — honestly serving the index — found and cited them",
              },
              {
                id: "b",
                label: "At the model: it should have refused to discuss salaries",
              },
              {
                id: "c",
                label: "At the wiki: the documents shouldn't have been there",
              },
            ],
            answer: "a",
            explanation:
              "The wiki's permissions were correct — and irrelevant: ingestion flattened them. Retrieval is not a policy engine; it optimizes over whatever the index contains. The model citing its context is the system working as built. Enforcement belongs upstream: ACLs as chunk metadata, pre-filtered at query time. That is the exact gap permission-aware retrieval exists to close.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "To ship faster, a team implements permissions as post-filtering: retrieve top-10 globally, then remove results the user can't see. A privacy engineer objects on three grounds. Which set is actually correct?",
            choices: [
              {
                id: "a",
                label: "Ranking computed against unauthorized docs distorts scores; filtered result sets shrink unpredictably; and audits read the design as a leak channel — pre-filtering avoids all three",
              },
              {
                id: "b",
                label: "Post-filtering leaks the documents themselves in some edge cases, is always slower, and cannot log denials",
              },
              {
                id: "c",
                label: "The objection is theoretical — post-filtering produces identical results to pre-filtering given the same k",
              },
            ],
            answer: "a",
            explanation:
              "The three real grounds: contaminated ranking (authorized results scored against unauthorized docs), unpredictable shrinkage (k slots, fewer survivors — the user never knows results are missing), and the audit posture (the unauthorized content genuinely participated in the pipeline). Post-filtering doesn't ship the documents themselves, and it can log denials. Identical-results is false precisely because the ranking differs.",
          },
        ],
      },
      {
        slug: "index-lifecycle",
        title: "The Index Lifecycle",
        blurb:
          "Freshness is six synchronized axes — and embedding upgrades travel by dual-index migration, never a switch while traffic runs.",
        topic: "lifecycle",
        skillIds: ["index-lifecycle", "rag-ingestion"],
        capability:
          "Operate a large index: incremental sync, delete propagation, drift detection, re-ingest triggers, and dual-index migrations.",
        minutes: 10,
        concept: {
          anchor: "Warehouse discipline — receive, rotate, and purge, or the inventory quietly starts to lie.",
          what: "The **index lifecycle** keeps index ≡ sources across six axes: **source edits** (re-ingest by doc_id), **deletes** (propagate same cycle), **parser and chunker changes** (full re-ingest — every chunk reshapes), **embedding upgrades** (**dual-index migration**: shadow-build → verify → switch → retire), and **cache invalidation**.",
          why: "Untended indexes drift silently. The measured pattern is **10–20 retrieval points lost in a year** with zero code changes. An index is a running system with its own observability, not a build artifact.",
          where: [
            "A **quarterly embedding upgrade** migrating 40k docs in shadow while traffic runs",
            "**Chunk-size dashboards** catching a chunker regression the night it ships",
            "**Delete propagation** audits proving no orphaned chunks survive their sources",
          ],
          whenNot:
            "Don't build the full lifecycle for a **frozen corpus**. A one-time ingest of static documents needs the stages, not the loop. Everything alive needs all six axes.",
        },
        diagram: {
          kind: "flow",
          steps: [
            { kind: "input", text: "Source change: edit · delete · parser · chunker · model" },
            {
              kind: "decision",
              text: "Re-ingest by doc_id · propagate deletes · trigger full re-ingest on structure changes",
            },
            { kind: "output", text: "Index ≡ sources", caption: "verified by drift dashboards" },
          ],
          loop: "embedding upgrade → dual-index migration: shadow-build → verify → switch → retire",
        },
        prose: [
          "Atlas upgrades its embedding model quarterly now, and the process is boring on purpose. **Shadow-build** the new index while traffic runs. **Verify** on the golden set (all four metrics, no regressions). **Switch** the pointer with a 5% canary. **Retire** the old index after a warm week of instant-rollback. Nothing pauses; nothing flips mid-flight. The alternative — mixing two embedding maps in one index — is the corrupted-addresses failure from the intermediate course, at 40k-document scale.",
          "The other four axes are quieter. Source edits re-ingest **by doc_id** — replace, never duplicate. Deletes propagate in the same cycle, with an orphan audit proving no chunk outlives its source. Parser and chunker changes are the sneaky ones: they reshape every chunk, which means **full re-ingest**. Their regressions are caught by the same dashboards (chunk-size distributions, context-shape spans) that solved the 2am mystery in the intermediate course.",
          "Underneath it all, the drift numbers: **10–20 points of retrieval quality lost in a year, silently**, because sources moved while embeddings stood still. That is why lifecycle is an observability discipline — score distributions over time, coverage-gap clusters, orphan counts — and not a calendar reminder to re-run the pipeline. The index is a system; systems get dashboards. The boundary: a truly frozen corpus needs the stages but not the loop. Lifecycle machinery on static documents is a dashboard watching nothing.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A team must upgrade embedding models on a production index serving constant traffic. The proposed plan: delete the old index, re-embed everything, recreate the index — a 40-minute outage window. What's the correct architecture?",
            choices: [
              {
                id: "a",
                label: "Dual-index migration: shadow-build the new index beside the old, verify on the golden set, canary the switch, retire the old after a rollback-warm week",
              },
              {
                id: "b",
                label: "The outage plan is fine — 40 minutes at night is acceptable",
              },
              {
                id: "c",
                label: "Re-embed incrementally: new docs on the new model, old docs stay on the old one",
              },
            ],
            answer: "a",
            explanation:
              "The migration pattern removes the outage (old index serves while the new builds), removes the bet (golden-set verification happens before any user sees the new map), and removes the one-way door (warm old index = instant rollback). The incremental mix is the corrupted-addresses failure — two maps in one index, every cross-distance meaningless.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A RAG system's answers have degraded over nine months. No deploys. No model changes. Docs “all still there.” What does the lifecycle lens predict, and what confirms it?",
            choices: [
              {
                id: "a",
                label: "Silent index drift — sources moved while embeddings stood still; confirmed by drift dashboards: sagging retrieval-score distributions, coverage-gap clusters, and an orphan-chunk audit",
              },
              {
                id: "b",
                label: "Model decay — LLMs degrade in production without retraining",
              },
              {
                id: "c",
                label: "Nothing predictable — nine-month regressions require code changes",
              },
            ],
            answer: "a",
            explanation:
              "This is the measured pattern: 10–20 points lost in a year with zero code changes, because the corpus moved — rewrites, renames, deletions that never propagated, near-duplicates accumulating. Models don't decay on the shelf; indexes drift in the stream. The dashboards turn the diagnosis from a long investigation into a single look.",
          },
        ],
      },
      {
        slug: "rag-vs-long-context",
        title: "RAG vs Long Context",
        blurb:
          "Million-token windows move the boundary, not the trade: paste what's small and static, retrieve what's large and living.",
        topic: "architecture",
        skillIds: ["rag-vs-long-context", "rag-vs-alternatives"],
        capability:
          "Decide between retrieval and long-context windows on cost, latency, freshness, and provenance. Combine them when the work needs depth.",
        minutes: 10,
        concept: {
          anchor:
            "Nobody photocopies the whole filing cabinet to answer one question — a faster copier doesn't change the math.",
          what: "The **RAG vs long-context decision** follows the corpus. **Long context** fits small, static corpora and exhaustive whole-document analysis. **RAG** wins large, changing corpora on **cost** (~1,250× cheaper per query at 1M-token scale), **latency** (30–60× faster), **freshness**, and **provenance**. The **hybrid** retrieves to select documents, then long-contexts to read them whole.",
          why: "“Just paste everything” scales its bill with the corpus, and you re-pay it on every request — the beginner course's backpack, now with a price tag. Bigger windows change where the boundary sits, not the trade itself.",
          where: [
            "**Whole-contract review** — one 400-page document, nothing may be missed: long context",
            "**A 40k-doc knowledge base** answering cited questions: RAG, at three orders of magnitude less",
            "**The hybrid move** — retrieve the 3 relevant specs, then read each in full with a big window",
          ],
          whenNot:
            "Don't paste a living corpus into a big window — you re-sync and re-pay on every request. And don't retrieve for exhaustive single-doc analysis, where selection is exactly the failure.",
        },
        diagram: {
          kind: "decision",
          root: {
            kind: "decision",
            question: "What is the corpus and the question?",
            branches: [
              {
                label: "small + static",
                node: { kind: "leaf", answer: "Paste it — zero moving parts" },
              },
              {
                label: "few docs, exhaustive analysis",
                node: { kind: "leaf", answer: "Long context — nothing may be missed" },
              },
              {
                label: "large, changing, needs citations",
                node: { kind: "leaf", answer: "RAG — cheap, fast, fresh, cited" },
              },
              {
                label: "large corpus, deep on a few docs",
                node: { kind: "leaf", answer: "Hybrid: retrieve to select, long-context to read" },
              },
            ],
          },
        },
        prose: [
          "The memo said what memos say: *million-token models make RAG obsolete.* Atlas's finance team ran the numbers instead. The arithmetic is structural: `paste cost ∝ corpus_tokens × requests`, `RAG cost ∝ top_k × requests`. The lines diverge by corpus size, and bigger windows move the intercept, not the slope. Concretely: pasting the corpus — ~1M tokens per request — billed roughly **€9.00 a query and ran 30–60× slower** than retrieval's milliseconds. The same answers via RAG cost fractions of a cent. At corpus scale the gap is three orders of magnitude, re-charged on **every single request**. It turned out that “obsolete” was a rounding error.",
          "What big windows genuinely changed is the **analysis tier**. Exhaustive work — review the whole contract, cross-read the entire filing, nothing may be missed — now fits a window. Retrieval is actively wrong for that work: selecting is dropping. Atlas built the hybrid that follows: **retrieve to select** the three relevant specifications, then **long-context to read** each in full. You get selection precision from the index, exhaustive depth from the window, and citations preserved end to end.",
          "So the decision framework, final form: small and static — paste. Few documents, exhaustive analysis — long context. Large, living, citation-bearing — RAG. Large corpus with deep dives — the hybrid. The window grew; the trade didn't move — cost still scales with what you paste, freshness still scales with sync, and provenance still requires knowing which page said it.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A legal team reviews 200-page contracts where missing a single clause is a malpractice risk. They ask for RAG because “it's the standard.” What's the right architecture?",
            choices: [
              {
                id: "a",
                label: "Long context — exhaustive single-document analysis is the case where selection (retrieval) is the failure mode; the whole contract belongs in the window",
              },
              {
                id: "b",
                label: "RAG — it's the production standard, so it must apply here",
              },
              {
                id: "c",
                label: "Neither — clause review requires human lawyers only",
              },
            ],
            answer: "a",
            explanation:
              "RAG's top-k is a relevance filter — exactly wrong when the requirement is totality: the missed clause is precisely the low-similarity one the ranker dropped. The whole-contract window misses nothing by construction. “Standard” answers a question about corpora; this is a question about a document.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Your support corpus is 25k documents updated hourly. A new million-token model arrives and an engineer proposes pasting the whole corpus per query — “simpler, no retrieval stack to maintain.” The numbers: ~€7/query pasted vs ~€0.006 retrieved, at 5k queries/day. What does the decision framework say?",
            choices: [
              {
                id: "a",
                label: "RAG — the corpus is large, changing, and citation-bearing; pasting re-pays a 1,000× premium per request and re-syncs hourly at corpus scale",
              },
              {
                id: "b",
                label: "Paste — the simplicity savings outweigh the cost",
              },
              {
                id: "c",
                label: "Split the difference: paste half the corpus per query",
              },
            ],
            answer: "a",
            explanation:
              "€7 × 5k/day is ~€35k/day versus ~€30. The simplicity is real, and the price is a thousand-fold, re-charged daily on a corpus that must also be re-synced into every window hourly. The framework's rules line up (large, changing, citations → RAG). Where deep dives exist, the hybrid takes them — selected docs into the big window, not the corpus.",
          },
        ],
      },
      {
        slug: "production-rag-evals",
        title: "Evals and Drift in Production",
        blurb:
          "CI gates changes, canaries test reality, online evals catch drift — and judges get calibrated monthly against humans.",
        topic: "evals",
        skillIds: ["production-rag-evals", "rag-metrics"],
        capability:
          "Run the three-layer eval system and the drift dashboards: golden set in CI, canary traffic, online samples, judge calibration.",
        minutes: 10,
        concept: {
          anchor: "Guards at the gate, spot checks on shift, patrols at night — each layer sees what the others can't.",
          what: "**Production RAG evals** run three layers: the **golden set in CI** (every change regresses nothing), **canaries** (shadow-scored on 5% of real traffic), and **online evals** (a sampled 1% of production, judged nightly on the four questions). On top of those sit **drift dashboards** (retrieval-score distributions, coverage clusters) and **monthly judge calibration** against human labels.",
          why: "Atlas lost 8 quality points in a quarter with zero deploys — the corpus moved, and only the online layer can see a distribution move. Offline suites age well; production doesn&apos;t.",
          where: [
            "**Nightly online scoring** catching the drift quarter in week two, not month three",
            "**Coverage clusters** — low-score topic groups mapping the corpus&apos;s new gaps",
            "**Judge calibration** — a judge that quietly changed its mind is a metric that changed meaning",
          ],
          whenNot:
            "Don't build the online layer before the golden set exists. CI on a fixed suite is the foundation. Sampling production is the extension that watches what CI can&apos;t.",
        },
        diagram: {
          kind: "flow",
          steps: [
            { kind: "input", text: "Change: prompt · index · pipeline · model" },
            { kind: "decision", text: "Golden set in CI — no regression ships" },
            { kind: "process", text: "Canary: shadow-score 5% of traffic" },
            { kind: "output", text: "Online evals: sample 1%, judge nightly" },
          ],
          loop: "drift caught → incident → golden-set task — the same failure ships once",
        },
        prose: [
          "The drift quarter was Atlas&apos;s best teacher. No deploy shipped; quality slid eight points; the golden set — 200 fixed questions — held its scores, because those questions aged fine. What moved was **production**: new products, renamed teams, rewritten docs. The corpus is a distribution. Distributions drift. The only instrument that watches a distribution is a **sample of it**. Hence the online layer: 1% of traffic, judged nightly on the four questions. The boundary: the online layer is an extension, not a foundation. Without the golden set gating CI first, nightly samples merely watch unvetted changes ship on schedule.",
          "The layers divide the labor. **CI** answers “did this change regress anything known?” on the golden set — deterministic, fast, blocking. **Canaries** answer “does it hold on real queries?” — 5% shadow traffic before commitment. **Online evals** answer “is the system still healthy tonight?” — sampled, judged, trended. And the dashboards carry what scores can&apos;t: the retrieval-score distribution sagging before anyone feels it, coverage clusters mapping new gaps, orphan counts ticking the lifecycle&apos;s gauges.",
          "One dependency keeps it honest: **the judge itself is a model, and models drift.** A judge that quietly changed its rubric is a metric that quietly changed meaning. So the judge gets calibrated monthly against human-labeled samples, and every escaped incident joins the golden set with its trace attached. Same principle, closing the same loop, one last time: the same failure ships once.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Quarter-end review: RAG answer quality is down 8 points. Deploy log: empty. Golden-set scores: unchanged. The team is baffled — “nothing changed.” What instrument was missing, and what would it have shown?",
            choices: [
              {
                id: "a",
                label: "Online evals on sampled production traffic — the corpus drifted while the fixed suite aged in place; nightly samples would show the sag starting in week two, not quarter-end",
              },
              {
                id: "b",
                label: "More golden-set questions — the suite was too small",
              },
              {
                id: "c",
                label: "Faster CI — regressions slipped through the gate",
              },
            ],
            answer: "a",
            explanation:
              "Every clue says the system didn't change and the world did: no deploys. A fixed suite that scores the same old questions against the same old chunks can&apos;t see a distribution move. Only sampling production can — that&apos;s the online layer&apos;s entire reason to exist. A bigger suite measures the past more thoroughly. CI speed is irrelevant to a quarter with nothing shipped.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Your nightly online evals have used the same LLM judge for six months. This month, faithfulness scores jumped 5 points with no pipeline changes. What's the first hypothesis, and the check?",
            choices: [
              {
                id: "a",
                label: "The judge drifted — calibrate against your monthly human-labeled sample before believing the jump; a judge that changed its rubric changes the metric's meaning",
              },
              {
                id: "b",
                label: "Genuine quality improvement — answers must have gotten more faithful",
              },
              {
                id: "c",
                label: "Sampling error — restart the evals and the number will settle",
              },
            ],
            answer: "a",
            explanation:
              "A 5-point faithfulness jump with zero pipeline changes points at the one component nobody shipped but everyone depends on: the judge. Judges are models; providers update them; rubrics drift. The monthly human-labeled calibration set exists precisely for this moment — check the judge against human labels before celebrating or alarming. (A nightly sample large enough to trend is not a coin flip; restarting it doesn&apos;t fix a moved rubric.)",
          },
        ],
      },
      {
        slug: "anatomy-of-production-rag",
        title: "Anatomy of Production RAG",
        blurb:
          "Support KBs, code-docs agents, enterprise search — one skeleton. The capstone: run the architecture review.",
        topic: "capstone",
        skillIds: ["production-rag-anatomy"],
        capability:
          "Read real RAG blueprints against the shared skeleton — and run an architecture review that turns evidence into shipping decisions.",
        minutes: 11,
        concept: {
          anchor: "Every restaurant has the same stations — prep, line, pass. The menu decides which one works hardest.",
          what: "Production RAG systems — **support-KB assistants**, **code-docs agents**, **enterprise search** — share one skeleton: **sources → ingestion → hybrid index → query understanding → retrieve + rerank → grounded answer → traces + evals**. Differences are which subsystems carry the load.",
          why: "The skeleton is the transfer skill. Auditing or designing any RAG system becomes reading where its query mix stresses the skeleton — and adding machinery only there.",
          where: [
            "A **support KB** weighting grounding, citations, and golden sets grown from tickets",
            "A **code-docs agent** weighting hierarchy, multi-hop, and contextual enrichment",
            "**Enterprise search** weighting permissions, tenants, drift dashboards, and migrations",
          ],
          whenNot:
            "Don't treat the skeleton as a completeness checklist. A design review asks which subsystems the *query mix* stresses. It expects the unstressed ones to be minimal.",
        },
        diagram: {
          kind: "flow",
          steps: [
            { kind: "input", text: "Sources: docs, wikis, tickets" },
            { kind: "process", text: "Ingestion: parse → chunk → embed → index (with ACLs)" },
            { kind: "process", text: "Query understanding: rewrite · decompose · expand · route" },
            { kind: "process", text: "Retrieve + rerank: hybrid, fused, second look" },
            { kind: "output", text: "Grounded answer, cited or refused" },
            { kind: "process", text: "Traces + evals: CI · canary · online" },
          ],
          loop: "evals gate every change back into the skeleton — the system improves, versioned",
        },
        prose: [
          "Three blueprints, one skeleton. The **support-KB assistant** depends completely on grounding: citations on every claim, refusal logs feeding the golden set, the four metrics gating every prompt tweak. The **code-docs agent** stresses retrieval structure: hierarchical summaries across API versions, multi-hop for dependency chains, contextual enrichment so “the service” resolves. **Enterprise search** stresses the boundaries: ACL pre-filters, tenant namespaces, drift dashboards, dual-index migrations. Same six stages; very different load-bearing walls.",
          "The review above puts you in the architect&apos;s seat for Atlas&apos;s three live decisions — GraphRAG scope, the agentic default, the permission model. Each one has its evidence listed. The right answers state a trade-off too: the graph slice adds a freshness axis; the router adds a failure surface; pre-filtering makes ACL sync a permission-bearing part of the lifecycle. That&apos;s the expert posture: no free decisions, only priced ones.",
          "And that closes the trilogy. Foundations drew the map: retrieval, embeddings, the pipeline, the honest refusal. Practice built the machine: chunking, hybrid search, reranking, grounding, the four questions, the honest index. Scale operates it: structure where questions demand it, autonomy where budgets bound it, permissions where tenants require it, evals where drift hides — and the review that turns all of it into decisions. The skeleton is the map; the review is the method.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "You're auditing a team's RAG system for a company with strict data isolation between departments. Their architecture: hybrid retrieval, reranking, grounded citations — and a single shared index with no ACL metadata. Which subsystem will the review flag first, and why does everything else wait?",
            choices: [
              {
                id: "a",
                label: "Permissions — without ACLs on chunks and query-time pre-filtering, any department's query can retrieve any other's documents, and no downstream quality matters until that boundary exists",
              },
              {
                id: "b",
                label: "Reranking — a shared index means the reranker sees cross-department results and distorts scores",
              },
              {
                id: "c",
                label: "Citations — leaked documents would at least be cited honestly"
              },
            ],
            answer: "a",
            explanation:
              "The skeleton has a load-bearing wall missing: retrieval over a permission-free index is a structural cross-department leak. Quality subsystems (rerank, grounding, citations) are refinements on top of a boundary that doesn&apos;t yet exist. The review fixes walls before paint — and the reranker&apos;s exposure to unauthorized documents is a symptom of the same missing ACL filter, not a separate finding.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A startup pitches you their enterprise-search RAG: every subsystem from the skeleton is present and maximal — graphs over the whole corpus, agentic loops default-on, no drift dashboards yet (“coming soon”). What does the anatomy lens flag as the misplaced priorities?",
            choices: [
              {
                id: "a",
                label: "Inverted investment: maximal machinery (graphs, loops) without the boring spine — drift dashboards, golden sets, lifecycle — that tells you when any of it is working",
              },
              {
                id: "b",
                label: "Nothing — having every subsystem is strictly better than missing some",
              },
              {
                id: "c",
                label: "The graphs should be bigger before launch",
              },
            ],
            answer: "a",
            explanation:
              "The skeleton&apos;s order matters: evals and lifecycle are what make the fancy tiers verifiable. Without them, GraphRAG and agentic defaults are unfalsifiable costs. Every blueprint in this lesson carries traces + evals as the final stage for exactly this reason: the review trusts machinery it can measure, and measures before it maximizes.",
          },
        ],
      },
    ],
};

export default course;
