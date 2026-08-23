# AI Security track: the Cybersecurity domain spine

**Status:** proposed plan (Aug 23, 2026); derived from
[`09-ai-engineering-track.md`](./09-ai-engineering-track.md). Not yet
implemented.

## Purpose and sequence

AI security is sold by the industry as its own product line (Snyk learning
paths, Udemy OWASP courses, the OWASP GenAI LLM Top 10 2026) — not as a
module inside engineering tracks. Our `Cybersecurity` domain is declared and
empty; this trilogy fills it. Following the
`-foundations | -in-practice | -at-scale` precedent:

| Course | Audience | Outcome | Access |
| --- | --- | --- | --- |
| AI Security Foundations | Curious beginners, recent grads | The attack surface of AI apps in plain English: injection, jailbreaks, leaks, over-permissioned agents | Free |
| AI Security in Practice | Developers with ~2y experience | Build the defenses: threat models, filtering, sandboxing, red-team drills | **Paid** |
| AI Security at Scale | Senior practitioners | Adversarial robustness, multi-agent trust, incident response, continuous red-teaming | **Paid** |

**Scope split (no duplication):**
`ai-observability-reliability` keeps *detecting attacks in telemetry +
governance* (its OWASP threat-model, attack-detection, and EU AI Act / NIST
lessons stand). This trilogy owns the security engineering itself: attacker
techniques, defensive engineering, red-teaming practice, securing
agents/MCP/tools, model supply chain, AI incident response.
`harness-at-scale`'s `agent-security` lesson stays harness-scoped and
cross-links here.

## Part 1 — `ai-security-foundations` (beginner, free)

Framework: Anchored Story-Mountain + Concreteness Fade (beginner_v1 skill).
10 lessons × ~5 min, no math/code, 3-choice MCQs, full jargon gate. No
running case (everyday anchors, per the fine-tuning-foundations precedent).

1. `why-ai-gets-attacked` — new doors on an old house: chat windows, agents,
   and generated text as attack surface. Skill: `ai-attack-surface`.
2. `the-owasp-llm-top-ten` — the industry's standard list of AI app risks,
   in plain English. Skill: `owasp-llm-top-ten`.
3. `prompt-injection` — instructions hidden in data; the signature AI attack
   (a web page whispering to your assistant). Skill: `prompt-injection`.
4. `jailbreaks` — talking the model out of its rules; roleplay, framing,
   and the arms race. Skill: `jailbreak-techniques`.
5. `data-leakage` — secrets in prompts, private data memorized from
   training, and logs that remember too much. Skill: `llm-data-leakage`.
6. `guardrails-basics` — the bouncer at the door: what guardrails catch, and
   what they promise but can't. Skill: `guardrail-basics`.
7. `supply-chain-risk` — models and datasets are dependencies too; who baked
   the cake you serve. Skill: `model-supply-chain`.
8. `over-permissioned-agents` — the agent with your passwords; least
   privilege as a seatbelt. Skill: `agent-permissions`.
9. `when-security-kills-the-product` — friction budgets; fail-closed vs
   fail-open and who decides. Skill: `security-ux-tradeoffs`.
10. `security-capstone` — find the three vulnerabilities planted in a story
    app (decision diagram). Skills: `prompt-injection`, `ai-attack-surface`.

## Part 2 — `ai-security-in-practice` (intermediate, **paid**)

Framework: Predict–Investigate–Case (PIC) + First-Principles Ladder
(intermediate_v1 skill). 10 lessons × ~7 min (capstone 10), runnable
pure-Python exercises in ~3 lessons. **Running case: PaisaShield** — a
fintech chat assistant moving real money; every lesson adds one defense
layer, and the capstone survives the red-team pack.

1. `threat-model-an-app` — STRIDE-for-AI on one page: what's valuable, who
   wants it, through which door. Skill: `ai-threat-modeling`.
2. `input-output-filtering` — detection layers at every boundary
   (exercise: a pure-Python injection detector). Skill: `io-filtering`.
3. `sandboxes-and-least-privilege` — tools, filesystems, API scopes; the
   blast radius question. Skill: `sandboxing-least-privilege`.
4. `pii-redaction` — scrub before the model ever sees (exercise: a redaction
   pass). Skill: `pii-redaction`.
5. `securing-rag` — poisoned documents, indirect injection through
   retrieval, permission-aware indexes (cross-links rag-at-scale).
   Skill: `rag-security`.
6. `securing-agents-and-mcp` — tool allow-lists, approval gates, trust
   boundaries between model, tools, and data (exercise: an allow-list
   evaluator). Skill: `agent-tool-security`.
7. `red-team-drills` — garak-style probe packs, keeping a findings log,
   fixing what the drills find. Skill: `ai-red-teaming` (reused).
8. `defensive-evals` — security regressions in CI: attack suites as tests
   (links harness evals). Skills: `defensive-evals`, `eval-gates` (reused).
9. `incident-drills` — what to do at minute one: contain, preserve,
   notify. Skill: `ai-incident-drills`.
10. `paisashield-capstone` — defend PaisaShield against the red-team pack:
    threat model, layers, drills, and the one attack you accepted (flow
    diagram with loop). Skills: `ai-threat-modeling`, `io-filtering`.

## Part 3 — `ai-security-at-scale` (expert, **paid**)

Framework: Problem-First Diagnostic (CER) with mandatory Boundary beat
(expert_v1 skill). 8 lessons × ~10–12 min (capstone 15), jargon-exempt, full
formulas, real code. **Production case: Setu** — a national citizen-services
agent (documents, schemes, grievances) run by thousands of departments;
adversaries include fraud rings and state-level attackers, and the
compliance clock (EU AI Act class, NIST AI RMF) is as real as the threat
clock.

1. `adversarial-robustness` — attacks on the model itself (evasion, jailbreak
   transfers, poisoning) at production scale; what defenses actually hold.
   Skill: `adversarial-robustness`.
2. `multi-agent-trust` — trust between your own agents; permission
   architectures, delegation limits, the confused-deputy problem.
   Skill: `multi-agent-trust`.
3. `ai-incident-response` — command structures, severity ladders, and
   forensics for AI security incidents (cross-links reliability's incident
   command). Skill: `ai-incident-response`.
4. `secure-by-design-reviews` — the design review as a security artifact:
    threat models kept alive, not shelved. Skill: `security-architecture-review`.
5. `compliance-and-governance` — EU AI Act / NIST AI RMF as engineering
   constraints (hand-off from reliability's governance lessons).
   Skills: `eu-ai-act`, `nist-ai-rmf` (reused).
6. `continuous-red-teaming` — programs, not one-offs; automation, AI bug
   bounties, and tracking fix rates. Skill: `continuous-red-teaming`.
7. `the-security-tradeoff-review` — risk registers and accept/reject calls:
    who owns a risk, what evidence, what price. Skill: `security-risk-governance`.
8. `setu-capstone` — **Capstone: secure architecture review of Setu** —
    threat model, trust boundaries, drill cadence, and the signed risk
    register on one reviewed page (decision diagram). Skills:
    `security-architecture-review`, `security-risk-governance`.

## Wiring

- `content/types.ts` — new SkillIds under `// AI Security courses`:
  foundations (`ai-attack-surface`, `owasp-llm-top-ten`, `prompt-injection`,
  `jailbreak-techniques`, `llm-data-leakage`, `guardrail-basics`,
  `model-supply-chain`, `agent-permissions`, `security-ux-tradeoffs`),
  in-practice (`ai-threat-modeling`, `io-filtering`,
  `sandboxing-least-privilege`, `pii-redaction`, `rag-security`,
  `agent-tool-security`, `ai-incident-drills`, `defensive-evals`),
  at-scale (`adversarial-robustness`, `multi-agent-trust`,
  `ai-incident-response`, `security-architecture-review`,
  `continuous-red-teaming`, `security-risk-governance`). Reused:
  `ai-red-teaming`, `eval-gates`, `eu-ai-act`, `nist-ai-rmf`.
- `content/skills.ts` — definitions for every new SkillId (descriptions
  <1024 chars); `ai-red-teaming`, `eu-ai-act`, `nist-ai-rmf` are already
  pre-registered there.
- `content/courses.ts` — three Course objects appended to `COURSES`
  (domain `"Cybersecurity"` — already in `COURSE_DOMAINS`, no type change);
  `NEXT_COURSE`: foundations → in-practice → at-scale →
  `ai-observability-reliability` (its sibling spine); also
  `harness-engineering-at-scale` → `ai-security-foundations` and
  `ai-observability-reliability` ↔ `ai-security-at-scale` cross-links
  (reliability currently ends `undefined`, so it can safely gain an
  outgoing link).
- `components/infographic/` — one component per lesson (28), registered in
  `index.tsx` under `// AI Security courses` comments.
- `content/catalog.ts` — trackPriority: foundations → [beginner, grad];
  in-practice → [grad, engineer]; at-scale → [engineer, founder].
- `convex/lib/dailyPlan.ts` — `AI_SECURITY_FOUNDATIONS_UNITS`,
  `AI_SECURITY_PRACTICE_UNITS`, `AI_SECURITY_AT_SCALE_UNITS` added to the
  matching tracks (coverage test enforces minutes parity).
- Lesson contract per v6 (`content/courses.test.ts`): anchor-led concept
  brief, prose ≥ 2, exactly 2 scenario MCQs; beginner/intermediate pass the
  jargon gate (`content/jargon.test.ts`), at-scale is exempt.
- `docs/content-model.md` + `CHANGELOG.md` updated.
