# Plan: RAG Course 3 of 3 — RAG Engineering at Scale (expert, paid)

Final course of the RAG trilogy: `rag-engineering-at-scale` — **expert / AI Engineering / paid / 8 lessons, ~78 min**. Settled conventions: v5 anatomy, **no exercises**, teaser paid gate (automatic), one earned widget (a decision-gate on the capstone, CER "Now-what"), 3–4-choice diagnostic MCQs, compact expert-calibrated scenes.

**Course case (v5 §1.2 expert rule):** **Atlas at scale** — two years on: 40,000 documents, multiple departments, enterprise tenants, adversarial content, a security review, and an architecture decision meeting. Each lesson adds evidence, a counter-example, or a competing constraint; the capstone is the design review.

## Lesson lineup (8 lessons)

| # | Slug | Title | Scene (compact, architecture-led) | Diagram | Case tension |
|---|------|-------|-----------------------------------|---------|--------------|
| 1 | `advanced-retrieval` | Beyond Top-K: Advanced Retrieval | The retrieval upgrade ladder: hierarchical summaries (RAPTOR-style) answering cross-doc questions, contextual chunk enrichment, multi-hop decomposition for two-hop questions — each with the cost it adds | `decision` tree: single hop? → standard pipeline / cross-doc synthesis? → hierarchical / multi-hop? → decompose + iterate | "Summarize this quarter's incidents across 40 runbooks" — no single chunk contains the answer |
| 2 | `agentic-rag` | Agentic RAG | The control loop the model drives: decide whether to retrieve, assess sufficiency, re-query with what it learned (CRAG/Self-RAG ideas); the autonomy-vs-cost tension with a retrieval budget | `decision`: context sufficient? → answer / insufficient? → refine query, retrieve again / exhausted? → escalate or refuse | Atlas gains a research mode for hard questions — at 6× the retrieval cost of a single pass |
| 3 | `graphrag` | GraphRAG and Knowledge Graphs | Entity extraction over the corpus building a relationship graph + community summaries; the relationship query that vectors can't answer ("which teams depend on the payments service?"); the complexity price and selectivity rule | `compare`: vector index vs knowledge graph (query shape / build cost / freshness / where each wins) | The org-chart + service-dependency questions keep failing in vector search — GraphRAG proposed for exactly those |
| 4 | `permission-aware-retrieval` | Permission-Aware Retrieval | The leak timeline: salary-band doc embedded in the shared index → retrieved into a normal user's context; the fix at query time — ACL metadata filtering (pre-filter, row-level), tenant isolation, post-filter's failure mode; "RAG bypasses every file permission system" | `decision` tree: every chunk carries ACLs → filter at query time (pre-filter) → tenant isolation → audit the filter like a security boundary | The security review: without permission-aware retrieval, Atlas fails enterprise review — this is the research's exact finding |
| 5 | `index-lifecycle` | The Index Lifecycle | Freshness engineering at 40k docs: incremental sync by doc_id, delete propagation, the **dual-index migration** for embedding-model upgrades (shadow → verify → switch → retire), drift detection (the silent 10–20-point/year loss), re-ingest triggers on parser/chunker changes | `flow`: [Source change] → <Re-ingest by doc_id / propagate deletes / detect drift> → [Index ≡ sources], loop: "embedding upgrade → dual-index migration, never a flip" | Atlas's quarterly embedding upgrade: 40k docs can't pause — migrate in shadow |
| 6 | `rag-vs-long-context` | RAG vs Long Context | The decision framework from the research: long context fits small static corpora (exhaustive whole-doc analysis); RAG wins on cost (~1,250× cheaper at 1M-token scale), latency (30–60× faster), freshness, provenance; the hybrid pattern (retrieval to select, long context to read) | `decision` tree: fits one window + rarely changes? → paste / exhaustive analysis of a few docs? → long context / large, changing, citations? → RAG / huge-but-selected? → hybrid | The "million-token model makes RAG obsolete" memo meets Atlas's cost math |
| 7 | `production-rag-evals` | Evals and Drift in Production | Online evals on sampled production traffic (the four questions, continuously); retrieval drift dashboards (score distributions, coverage gaps); judge calibration against human labels; regression gates in CI; incidents → golden-set tasks | `flow`: [Change] → <Golden set in CI> → [Canary traffic] → [Online evals on samples], loop: "drift caught → incident → new task" | Atlas's answer quality slid 8 points in a quarter with zero deploys — the drift the online layer exists to catch |
| 8 | `anatomy-of-production-rag` | Anatomy of Production RAG (capstone) | Three blueprint teardowns — support-KB assistant, code-docs agent, enterprise search — against the shared skeleton (ingest → index → retrieve → rerank → ground → cite → eval). **Decision-gate widget** (`"use client"`): Atlas's architecture review — three calls: add GraphRAG for the dependency questions? adopt agentic research mode default-on? which permission model before enterprise rollout? — each with evidence and stated trade-offs | `flow`: the generic production RAG architecture (sources → ingestion → hybrid index → query understanding → retrieve+rerank → grounded answer → traces+evals), loop: "evals gate every change" | The design review: eight lessons become three decisions |

Every lesson: `concept`, `prose` (3–4 paragraphs, expert register), exactly **2 diagnostic MCQs** (3–4 choices), `topic`, `skillIds`, `capability`, `minutes` (9–11). **No `exercise` fields.**

## New skill IDs (8 — collision-checked)
`advanced-retrieval`, `agentic-rag`, `graphrag`, `permission-aware-retrieval`, `index-lifecycle`, `rag-vs-long-context`, `production-rag-evals`, `production-rag-anatomy` — in **both** `content/types.ts` and `content/skills.ts`.

## File changes

1. `content/types.ts` + `content/skills.ts` — 8 new skills.
2. `content/courses.ts` — append the course (8 lessons); `NEXT_COURSE`: `rag-engineering-in-practice` → `rag-engineering-at-scale` (completes both trilogies' chains).
3. `components/infographic/` — 8 compact scenes: `AdvancedRetrieval.tsx`, `AgenticRag.tsx`, `GraphRag.tsx`, `PermissionAwareRetrieval.tsx`, `IndexLifecycle.tsx`, `RagVsLongContext.tsx`, `ProductionRagEvals.tsx`, `ProductionRagAnatomy.tsx` (client decision-gate).
4. `components/infographic/index.tsx` — 8 imports + registry entries.
5. `content/catalog.ts` — `trackPriority`: → `["engineer", "founder"]`.
6. `convex/lib/dailyPlan.ts` — `RAG_AT_SCALE_UNITS` (8 units, minutes synced) in `engineer` + `founder` tracks.

## Verification

- `npm run typecheck`, `npm test`, `npm run build` (SSG proves all scenes registered).
- Browser: all 8 lesson routes + index 200; logged-out = teaser + gate; sitemap exclusion + `noindex`; decision-gate widget exercised via temporary free-flip (restored); zero console errors; dark-mode tokens; no overflow.

## Completion audit (after this course)

Full checklist against the goal: deep research done → 3 separate plans approved → 3 courses built and verified (typecheck, 66+ tests, build, routes, gates, widgets, sitemap) — the same evidence standard the harness trilogy was held to.