import type { Course } from "../types";

const course: Course = {
    slug: "ai-security-at-scale",
    title: "AI Security at Scale",
    subtitle:
      "AI systems at national scale, under real adversaries — adversarial robustness, federated agent trust, incident command, governance. Every control derived from constraints, every tradeoff priced in a register.",
    description:
      "Setu is a national citizen-services agent. It federates forty department agents, serves millions of citizens, and moves money on irreversible paths. It faces fraud rings and state-level adversaries, and a compliance clock is always running. This course takes the PaisaShield discipline (map, layer, drill, gate, rehearse) and re-derives it for scale. At scale, the attack surface includes the models themselves, the delegation graph between agents, and the governance machinery. Eight lessons in problem-first diagnostic form: adversarial robustness (evasion, poisoning, extraction), identity propagation across agent federations, AI incident command with severity ladders, the design-review gate as threat-model delta, obligations mapped to living artifacts (EU AI Act / NIST AI RMF classes), continuous red-teaming as a programme with fix-rate metrics, and the risk register as court record. The capstone is the Setu architecture review. Full precision, real failure modes, and the boundary of every derivation marked.",
    level: "expert",
    domain: "Cybersecurity",
    access: "paid",
    prerequisites:
      "Five or more years shipping production systems. You should be comfortable with LLM architecture, RAG, and the PaisaShield stack from AI Security in Practice (threat models, guards, gates, drills, CI suites).",
    lessons: [
      {
        slug: "adversarial-robustness",
        title: "Adversarial robustness",
        blurb: "When the attack surface is the model itself — evasion, poisoning, extraction — and why 'harden the model' is the wrong top priority.",
        topic: "ai-security",
        skillIds: ["adversarial-robustness"],
        capability: "Assess model-layer attacks (evasion, poisoning, extraction) and place controls at trust transitions, not inside the model.",
        minutes: 11,
        concept: {
          anchor:
            "Model-layer attacks target the classifier's decision boundary. No deployed boundary is robust. So the controls bind at trust transitions, not in the weights.",
          what: "These differ from app-layer injection: **evasion** (inference-time crafted inputs), **poisoning** (training-time corpus manipulation, including backdoor triggers), and **extraction** (query-based model/data reconstruction). Robustness engineering = **corpus provenance, rate/identity limits, monitored fallbacks**. It is adversary-aware MLOps, not adversarial-training theater.",
          why: "At Setu's scale, model-layer attacks are commodity. Document classifiers route benefits, and a 0.3% crafted-upload rate can misroute fraud documents into fast lanes. It happens silently, because app-layer guards never see this stage.",
          where: [
            "**Document/eligibility classifiers** in benefits routing — evasion with noise-patched scans, homoglyphs",
            "**Corpus + retrain loops** — poisoning via label flips and backdoor phrases that survive into the next model",
            "**Public model endpoints** — extraction scraping and cost-bomb variants",
          ],
          whenNot:
            "If misclassification is cheap, detectable, and reversible (human review within minutes), monitored fallback wins. Adversarial training is over-engineering there — harden only the irreversible paths.",
        },
        prose: [
          "Start from the constraint that grounds every robustness argument: adversarial examples exist for every deployed classifier boundary that has been studied. Scale gives no immunity — larger models shift the perturbation budget, they don't close the gap. From that ground the derivation runs: if per-query attacks will sometimes succeed, per-query defense is an unbounded arms race, because the attacker optimizes against whatever you deploy. So controls must bind where the attack's VALUE is realised, at trust transitions. For poisoning, that is corpus ingestion (provenance, label-diff review, decontamination against your eval set). For extraction, it is the query interface (identity-bound rate limits, output canaries). For evasion, it is the decision's downstream (monitored fallbacks: misroute alarms, confidence routing to human review).",
          "Setu's evidence makes each family concrete. Evasion: 0.3% of uploads carry crafted perturbations — noise-patched scans and homoglyph-substituted text that flip the document classifier into the fast lane. The app-layer injection guards stay green because this stage has no conversation. Poisoning: the classifier retrains monthly on department-submitted corpora. A backdoor trigger planted by anyone with corpus write access survives into the next model, and it activates on a phrase the app layer has never seen. Extraction: a public benefits-eligibility endpoint queried at 10k requests/hour with systematically varied inputs reconstructs the routing logic. That is reconnaissance for the evasion campaign, and a cost bomb besides.",
          "The boundary beat, without which this lesson lies: the derivation assumes misclassification is expensive or silent. Relax that — make misroutes detectable within minutes and reversible via human review — and monitored fallback is the complete answer for those paths. Adversarial training, distillation-robustification, and certified defenses earn their (large) cost only where decisions are irreversible. Payment-triggering routes at Setu get the hardened classifier AND the fallback; the marketing classifier gets neither. The expert error this lesson corrects is treating robustness as a property to buy rather than a budget to place.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Setu's document classifier retrains monthly on department corpora. Red-team finds a corpus submitter flipped 2,000 labels on borderline fraud documents. Which control was missing, and why does the app-layer suite not catch the resulting model?",
            choices: [
              { id: "a", label: "Stronger injection filters at the chat boundary — the attack came through prompts" },
              { id: "b", label: "Corpus provenance at the training trust transition: label-diff review with submitter attribution, eval-set decontamination, and a retrain gate that blocks on corpus anomalies. The app-layer suite can't catch it because the poisoned model's behavior IS its trained behavior. No probe in the attack suite distinguishes 'learned wrong from clean data' from 'learned wrong from poisoned data' at inference time" },
              { id: "c", label: "Nothing was missing — monthly retraining self-heals poisoning within 30 days" },
            ],
            answer: "b",
            explanation:
              "Poisoning binds at ingestion. Without provenance and label-diff review, the corruption enters the weights, and inference-time defenses inherit the corrupted boundary. Retraining on the same corpus re-poisons; the gate must fire before training, not after.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Which constraint, if relaxed, flips the conclusion that 'monitored fallback beats adversarial hardening' for Setu's marketing-content classifier?",
            choices: [
              { id: "a", label: "Query volume doubling — more queries always justify hardened models" },
              { id: "b", label: "Reversibility: if the marketing classifier's decisions become effectively irreversible at scale (auto-published content, no human in the loop, misroute cost now reputation-scale), the fallback control loses its force. The decision completes before the alarm can matter, so hardening (or a human gate) becomes the only control that binds in time" },
              { id: "c", label: "Model size — larger models need less hardening by construction" },
            ],
            answer: "b",
            explanation:
              "The fallback derivation runs on detect-and-reverse. Make the decision irreversible and the derivation's ground is gone — controls must move upstream to the boundary itself. Volume and size shift costs, not the logical structure.",
          },
        ],
      },
      {
        slug: "multi-agent-trust",
        title: "Multi-agent trust",
        blurb: "Credentials authorize the agent; the propagated principal authorizes the act — per-hop policy across the federation.",
        topic: "ai-security",
        skillIds: ["multi-agent-trust"],
        capability: "Design identity propagation and per-hop policy for agent federations; bound the confused-deputy problem and handle capability expiry.",
        minutes: 11,
        concept: {
          anchor:
            "In an agent federation, the delegation graph is the security architecture. Trust is per-hop policy on propagated identity, never inter-agent reputation.",
          what: "**Identity propagation**: every delegation carries the original principal (citizen identity + purpose) end-to-end. Each agent enforces its own policy on the RECEIVED principal. Credentials authorize what an agent may do; the **propagated principal** authorizes what the request may do — this closes the **confused deputy** hole. Long-horizon autonomy also requires **capability expiry**.",
          why: "Setu federates forty department agents. The observed incident: a low-trust eligibility agent requested treasury disbursements, and treasury executed them with its own credentials. That is the deputy problem at federation scale. Inter-agent reputation cannot fix it, because the requesting agent was behaving 'correctly.'",
          where: [
            "**Router → department agents → vault tools** — the core Setu path",
            "**Sub-agent spawn patterns** — planners delegating to researchers/executors",
            "**Cross-org MCP-style tool servers** — third-party tools inheriting your principals",
          ],
          whenNot:
            "Single-agent systems with a human-held credential never delegate. The problem collapses to lesson-six gates. The machinery earns its complexity only when credentials and principals can diverge.",
        },
        diagram: {
          kind: "decision",
          root: {
            kind: "decision",
            question: "Agent X requests action A from agent Y. What does Y check?",
            branches: [
              {
                label: "no propagated principal on the request",
                node: {
                  kind: "leaf",
                  answer: "Refuse",
                  caption: "unattributable = unauthorizable",
                },
              },
              {
                label: "principal lacks entitlement for A",
                node: {
                  kind: "leaf",
                  answer: "Refuse",
                  caption: "X's reputation is irrelevant",
                },
              },
              {
                label: "principal entitled, action reversible",
                node: {
                  kind: "leaf",
                  answer: "Execute under caps",
                  caption: "log principal at this hop",
                },
              },
              {
                label: "principal entitled, irreversible",
                node: {
                  kind: "leaf",
                  answer: "Approval gate on principal",
                  caption: "never on the asking agent",
                },
              },
            ],
          },
        },
        prose: [
          "The ground truth is an invariant, not a practice. An agent's credentials authorize what the AGENT may do; they say nothing about what a REQUEST THROUGH the agent may do. In a single-agent system with a human owner, the two never diverge. In a federation they diverge constantly — and the divergence is exactly the confused deputy: the treasury agent executed a disbursement its credentials permitted, on behalf of a principal entitled to no such thing. No amount of 'only let trusted agents talk to treasury' fixes this. The compromised hop is not the requesting agent's misbehavior — it's the unattributed request.",
          "So the derivation: if requests outlive their origin hop-by-hop, authorization must travel with them. Every delegation carries the original principal (citizen ID, purpose scope, task window). It is propagated through every hop and re-checked by every receiving agent against ITS OWN policy on that principal. Treasury doesn't ask 'is the eligibility agent reputable'. It asks 'is THIS citizen entitled to a disbursement, for THIS purpose, within THIS window.' The graph rule follows: edges exist from principals to entitlements, never from low-trust agents to vault tools. Reputation determines routing preference, never authority.",
          "The boundary beat: identity propagation assumes the principal's context is live. Long-horizon autonomous tasks break it. A sub-agent acting eight hours later on stored context holds a propagated principal that may be stale (entitlement revoked, document retracted, session closed). The design answer is capability expiry: delegations valid only for the task's window, re-authentication at the boundary for anything irreversible, and long-task checkpoints that re-validate rather than assume. Without expiry, propagation quietly degrades back into the deputy problem with extra steps. That is precisely the open finding the capstone review carries.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "At Setu, the grievance agent (department-trusted) is tricked via a poisoned corpus page into requesting a bulk records export from the records agent. The export runs with records' credentials and exfiltrates 40k citizens' data. Diagnose the structural failure.",
            choices: [
              { id: "a", label: "The grievance agent was insufficiently trusted — raise its trust tier before allowing corpus reads" },
              { id: "b", label: "Unattributed delegation: the records agent authorised on the REQUESTING AGENT's standing (department-trusted peer) instead of the propagated principal (one citizen, one grievance, read-scope). A bulk export was never within any citizen principal's entitlement. Per-hop policy on the principal refuses it regardless of how compromised the requesting hop is, because deputy credentials never were the authorisation for citizen-scale actions" },
              { id: "c", label: "Rate limiting failure alone — the export should have been throttled to fewer records per second" },
            ],
            answer: "b",
            explanation:
              "The records agent answered the wrong question (peer reputation) instead of the right one (principal entitlement). Throttling slows the exfiltration; principal-scoped policy prevents it. Trust tiers reshuffle who can trigger the failure without closing the hole.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Which constraint, when relaxed, invalidates plain identity propagation and forces capability expiry into a multi-agent design?",
            choices: [
              { id: "a", label: "Federation size — more agents always require expiry" },
              { id: "b", label: "Liveness of context: once sub-agents act on STORED context hours after delegation (entitlements revoked, sessions closed, documents retracted in the interim), the propagated principal describes a moment that has passed. Without expiry plus re-validation at irreversible boundaries, the architecture re-creates the deputy problem with a delay" },
              { id: "c", label: "Encryption strength between hops" },
            ],
            answer: "b",
            explanation:
              "Propagation authorises against a snapshot; expiry reconciles the snapshot with the present. Size and transport security matter operationally, but the logical break is specifically time — the gap between delegation and execution.",
          },
        ],
      },
      {
        slug: "ai-incident-response",
        title: "AI incident response",
        blurb: "Severity attaches to the asset and blast radius — pin the drifting assets, replay from traces, fix the class.",
        topic: "ai-security",
        skillIds: ["ai-incident-response"],
        capability: "Run AI incident command: severity by asset/blast radius, version-pinned forensics, trace replay, and class-level fixes wired into CI.",
        minutes: 10,
        concept: {
          anchor:
            "AI incidents are IR where every asset drifts daily — models, corpora, tool descriptions. So forensics starts with version pinning, and severity attaches to blast radius, never the symptom.",
          what: "The AI IR extension of classic command: a **SEV ladder keyed to assets** (model/trust-graph compromise vs money/PII paths vs corpus poisoning), a forensics loop built on **pinning** (model version, corpus snapshot, tool metadata), **trace replay** for scope, and one rule — every incident fix lands as a **class-level control** in the CI suite and intake rules.",
          why: "At Setu, the same symptom — 'odd answers' — was SEV-3 (one poisoned page), SEV-2 (deputy-chain money movement), and SEV-1 (classifier backdoor) within one quarter. Symptom-driven triage is structurally wrong. Unpinned assets make evidence unreconstructible within hours.",
          where: [
            "**Corpus poisoning alarms** — de-index, snapshot, diff review",
            "**Deputy-chain misuse** — key rotation on the narrow dependency, principal re-validation",
            "**Model compromise suspicion** — version quarantine, canary re-eval, rollback fleet",
          ],
          whenNot:
            "Slow-burn poisoning defeats response entirely. By detection, the blast radius is 'everything since the corpus change'. The countermeasure is upstream detection (diff alarms). Pretending faster response covers it is the boundary this lesson marks.",
        },
        prose: [
          "The diagnosis beat, from Setu's quarter: three 'odd answers from the schemes bot' tickets, three different incidents. A poisoned corpus page (SEV-3: de-index, snapshot for forensics, owner review of the page's provenance). A deputy-chain misuse moving money via a tricked eligibility agent (SEV-2: rotate the disbursement path's credentials — the narrow dependency, never the fleet — then re-validate principals on live sessions). A classifier backdoor triggered by a document phrase (SEV-1: national blast radius, model quarantine, regulator clock started). Same symptom, three ladder rungs. The triage question that works is never 'how bad does it look' but 'what asset is compromised, and what does it reach.'",
          "The forensics loop differs from classic IR in one load-bearing way: the assets drift. A model that retrains monthly, a corpus that syncs continuously, tool descriptions a vendor updates without notice — evidence that drifts is evidence lost. So the loop starts by pinning: freeze the current model version (and identify the serving version at incident time from the trace store), snapshot the corpus state, freeze tool metadata. Then replay: AI attacks reproduce only with full context — the prompt, the retrieved snippets, the tool-call arguments, the delegation chain. All of these live in the OTel traces if your observability investment (the reliability course's spine) was wired for GenAI semantics. Then scope by querying the trace store, not the model: which answers, which citizens, which actions, since when.",
          "And the loop's last rung separates programmes from heroics: fix the class, not the case. The poisoned-page incident closes not with the page removed but with the intake rule that would have rejected it, plus a CI probe asserting the page's phrasings stay rejected. The deputy incident closes with the per-hop policy gap filled and a regression probe. An incident fixed once is a finding reopened twice — the CI suite is the institution's memory, and the incident's job is to feed it. The boundary beat: this whole apparatus assumes detectable, scopeable incidents. Slow-burn poisoning — weeks of subtly wrong routing — defeats symptom-driven detection and makes 'scope' mean 'since the corpus change'. For that class, the response is not speed but the upstream diff alarms from lesson one, plus the honest register entry that response-time SLAs don't cover slow-burn classes at all.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Setu SEV-2: a deputy chain issued 200 improper fast-lane approvals over three days before an anomaly alarm fired. The responder's first two actions, in order?",
            choices: [
              { id: "a", label: "Take the schemes bot fully offline, then rebuild the corpus from backup" },
              { id: "b", label: "Pin and contain the narrow dependency — freeze the model/corpus/tool versions in play and rotate the approval path's credentials so the chain dies. Then replay the 200 approvals from traces to scope citizens affected, before any cleanup touches data" },
              { id: "c", label: "Publish disclosure immediately; scoping can follow in the post-mortem" },
            ],
            answer: "b",
            explanation:
              "Containment rotates the narrow dependency (the approval path), not the product. Forensics pins the drifting assets BEFORE cleanup, because the three-day window is only reconstructible from the frozen versions plus traces. Full shutdown destroys the evidence and the service; disclosure runs on the SEV-2 clock in parallel, not instead.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Which incident class invalidates the 'detect, pin, replay, scope' loop — and what covers it instead?",
            choices: [
              { id: "a", label: "Cost bombs — financial, not forensic, so the loop doesn't apply" },
              { id: "b", label: "Slow-burn poisoning: detection arrives weeks after the corpus change. 'Pin' pins a long-corrupted state, 'scope' expands to everything since the change, and replay confirms rather than contains. The class is covered upstream — corpus diff alarms, label-drift monitors, retrain gates — and the register must say so: response SLAs don't cover it, detection latency does" },
              { id: "c", label: "None — the loop is complete for all AI incident classes" },
            ],
            answer: "b",
            explanation:
              "The loop assumes the incident has a boundary in time. Slow-burn attacks erase the boundary — the corruption IS the baseline by detection. That's why the derivation pushes those controls to ingestion time, and why claiming incident-response coverage for them is a governance error, not an operational one.",
          },
        ],
      },
      {
        slug: "secure-by-design-reviews",
        title: "Secure-by-design reviews",
        blurb: "The threat-model delta as a required design-doc section — security moved to the cheapest place to change anything.",
        topic: "ai-security",
        skillIds: ["security-architecture-review"],
        capability: "Operate a design-review gate: five-question threat-model delta, layer-fit check, and signed accepted-risk in the doc.",
        minutes: 10,
        concept: {
          anchor:
            "The secure-design review is a delta review: not 'is this secure?' but 'which doors does this change open, and which ranked rows move?'",
          what: "A required **threat-model delta** section in every design doc that touches an input, action, or data path: new doors, widened doors, moved rank rows, layer fit, and **signed accepted risk** with owner and revisit date. The reviewer attacks the delta, checks layer fit, and signs the register — in the doc, before code.",
          why: "Late security gates buy rework: Setu's quarter-12 review of a built feature produced findings worth three months of changes. The doc is where doors are cheapest to close. The delta keeps the threat model a living artifact instead of a stale one nobody re-reads.",
          where: [
            "**Design docs** for any AI feature change — the trigger is mechanical",
            "**Federated department designs** — the delta reveals cross-org door creation",
            "**Vendor/tool onboarding** — new menu entries, new trust transitions",
          ],
          whenNot:
            "Changes that touch no input, action, or data path (copy edits, pure UI) skip the gate — ceremony on zero-delta changes is how gates lose credibility and get bypassed.",
        },
        prose: [
          "The problem-first opening is the industry's standard failure: security review as a week-12 checklist on a quarter-long build. It asks an unfalsifiable question ('is this secure?'), performs confidence, and produces rework. The fix isn't earlier reviews of the same shape — it's changing the review's OBJECT: not the whole system every time, but the delta. Every design doc that changes an input, action, or data path carries a five-question section. Which NEW doors does this create? Which EXISTING doors widen (new audience, new tool, bigger blast radius)? Which rows of the ranked threat model move, and to where? Which existing layers cover the delta, and where are the gaps? What residual risk is accepted, by name, with a revisit date?",
          "The reviewer's job is three moves, and none of them are box-ticking. Attack the delta: walk the new doors as the adversary would — the review is twenty minutes of red-team thinking at the cheapest possible moment. Check layer fit: the bias is always 'new problem, new control.' The delta usually shows an existing layer (a guard family, a gate, a provenance rule) covers it with a config change. Genuinely new layers need to EARN their maintenance cost. Sign the register: accepted risks land in the doc with owner and date — that is what makes the register (lesson seven) a live governance instrument rather than a quarterly reconstruction exercise.",
          "The boundary beat: the gate lives or dies by its trigger, and the trigger must be mechanical, not discretionary. The design-doc template refuses to merge without the delta section when the doc touches input/action/data-path files. The observed failure at every scale: enthusiastic gates that rely on someone remembering, then the quiet feature that skipped review and shipped the incident. The second boundary: delta reviews accumulate their own staleness. The base model they diff against must itself be re-ranked quarterly, or the deltas compound against a fiction. The review apparatus is a maintenance liability exactly like the CI suite; fund its upkeep or it decays into theater with good formatting.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A Setu department proposes: 'citizens can upload income certificates; the classifier auto-routes verified ones to the fast lane.' Their design doc's delta section is empty: 'no new doors — uploads already exist.' Your review response?",
            choices: [
              { id: "a", label: "Approve — uploads indeed exist, so the delta is empty" },
              { id: "b", label: "Reject the delta as incomplete: uploads exist, but the change WIDENS the upload door — its blast radius grows from 'read and answer' to 'trigger irreversible benefit routing', moving the upload row up the threat model. The delta must state the new rank, the layer fit (evasion-hardened classifier? confidence routing? approval gate on fast-lane entry?), and the signed residual risk" },
              { id: "c", label: "Reject the feature — income certificates are too sensitive for AI routing" },
            ],
            answer: "b",
            explanation:
              "The classic delta-review miss: no NEW door, but a widened one. Blast radius growth reorders the threat model, and the review exists precisely to force that reordering into writing — with the layers that cover it — before the code exists.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Six months in, audit finds 30% of AI design docs merged without delta sections — teams found the gate 'didn't seem to apply.' What's the structural fix?",
            choices: [
              { id: "a", label: "Annual security training for all engineers" },
              { id: "b", label: "Make the trigger mechanical: the design-doc template/CI refuses merges that touch input, action, or data-path surfaces without a non-empty, signed delta section — discretion was the failure, so remove discretion. Training supports the gate; it cannot be the control" },
              { id: "c", label: "Add a second, parallel security-approval board to double-check" },
            ],
            answer: "b",
            explanation:
              "The gate's boundary is its trigger: judgement-based triggers rot exactly as observed. The same lesson as eval gates — enforcement lives in the pipeline (template/CI), and human judgement is spent INSIDE the review, not on whether to have one.",
          },
        ],
      },
      {
        slug: "compliance-and-governance",
        title: "Compliance & governance",
        blurb: "Obligations mapped to controls with living artifacts — the audit reads your pipeline, not your prose.",
        topic: "ai-security",
        skillIds: ["eu-ai-act", "nist-ai-rmf"],
        capability: "Map regulatory obligations (EU AI Act-class, NIST AI RMF) onto pipeline-generated artifacts and run the three clocks.",
        minutes: 10,
        concept: {
          anchor:
            "Governance is a mapping discipline: obligation → control → living artifact — where the artifact is generated by systems that run, not by documents that describe.",
          what: "Each binding obligation (risk-management documentation, data governance, logging, human oversight — EU AI Act article classes; NIST AI RMF's Govern/Map/Measure/Manage functions) maps to a **control you already run** whose evidence is a **pipeline artifact**: dated threat-model deltas, intake logs, OTel traces, gate-firing logs, CI pass-rate trends. Plus the **clocks**: classification, incident notification, evidence retention.",
          why: "The audit-ready organisation inverts the document race. Setu's 200-page compliance narrative drifted from as-built within a quarter. The mapping produces evidence continuously and survives personnel change. The real return: it turns obligations into engineering tickets instead of prose.",
          where: [
            "**High-risk classification systems** — benefit routing, identity, disbursement",
            "**Cross-department AI inventories** — the register IS the map of what exists",
            "**Incident obligations** — notification windows wired into the SEV ladder",
          ],
          whenNot:
            "The frontier outruns the frameworks: agentic chains, tool marketplaces, and federated trust have no settled obligation text. Cover them by first principles (asset + blast radius) and LOG THE GAP as a governance risk with a revisit date. Pretending the frameworks speak to them is how audits pass and incidents still happen.",
        },
        prose: [
          "The anti-pattern is universal: audit approaches, a team writes two hundred pages describing security that mostly exists. The description drifts from as-built within a quarter, and nothing in the pipeline changes. The inversion: treat every obligation as a constraint needing a control, and every control as needing a LIVING artifact — evidence generated by the systems themselves, on their own schedule, queryable at audit time without a fire drill. Risk-management documentation (Act Art.9-class) → the threat model and register, evidenced by dated delta sections and quarterly re-ranks. Data governance (Art.10-class) → corpus provenance and redaction, evidenced by intake logs and coverage reports. Logging (Art.12-class) → the trace store with its retention dashboard. Human oversight (Art.14-class) → approval gates, evidenced by firing logs and the override audit trail. NIST AI RMF's 'Measure' → your evals including the attack suite, evidenced by CI pass-rate trends and drill reports.",
          "The return on this mapping is not passing audits — it's that obligations become tickets. 'Human oversight' as prose is a paragraph everyone skims. 'Human oversight' as the gate-firing log whose absence fails a CI check is an engineering constraint with an owner. The audit experience inverts too: instead of reconstructing the system in prose, you grant read access to artifacts that have been true all along. And the classification clock matters most at design time. The risk class, decided in the design review (lesson four's delta), determines which obligations bind — which is why the review template's first field is the classification.",
          "The boundary beat, twofold. First: retention cuts both ways — evidence obligations set retention MINIMUMS while privacy obligations set MAXIMUMS, and at Setu the same trace store serves both. The mapping must reconcile them per artifact class (traces: 13 months; raw citizen documents: 30 days; registers: indefinite), or one mandate quietly violates the other. Second: the frameworks trail the frontier. There is no settled obligation text for federated agent trust, tool-marketplace rug-pulls, or multi-agent deputy chains. Cover them by first principles (the asset-and-blast-radius derivation of this whole course). Record the coverage GAP in the register: 'agentic federation — governed by first principles, framework text pending, revisit at framework revision.' The honest gap entry is governance; the silent pretend-cover is how organisations pass audits and still have the incident.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Setu's regulator requests evidence of 'appropriate human oversight' for the disbursement path. Which response IS the mapping discipline?",
            choices: [
              { id: "a", label: "A 30-page narrative describing the oversight philosophy, signed by the CISO" },
              { id: "b", label: "Read access to the living artifacts: the approval-gate firing log (every irreversible disbursement, timestamped, principal-attributed), the override audit trail, the quarterly game-day reports exercising gate failures, and the register rows where residual risk was signed — evidence the pipeline generates continuously, not prose reconstructing it" },
              { id: "c", label: "A demo environment where the regulator can try triggering a disbursement themselves" },
            ],
            answer: "b",
            explanation:
              "Obligation → control → living artifact: the gate IS the oversight, its firing log IS the evidence. Narratives drift; artifacts are generated by the running system. A demo shows capability, not practice — the log shows every decision ever gated.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Which mapping failure does the retention conflict represent: evidence rules demand 13-month trace retention; privacy rules cap citizen-data retention at 30 days?",
            choices: [
              { id: "a", label: "No conflict — regulators always supersede privacy mandates" },
              { id: "b", label: "An unreconciled per-artifact mapping: the trace STORE can satisfy both only by design. Minimise/pseudonymise citizen identifiers in traces at write time (redaction at the boundary), so 13-month retention holds operational evidence while the 30-day cap governs identifiable originals held elsewhere. Mapping obligations to artifacts one by one, without reconciling their clocks and identifier policies, guarantees one mandate silently violates the other" },
              { id: "c", label: "Keep everything 13 months and request a privacy waiver" },
            ],
            answer: "b",
            explanation:
              "The mapping discipline includes reconciling conflicting mandates AT THE ARTIFACT LEVEL: the trace artifact is designed (redacted at write) so both obligations hold simultaneously. Waivers and silo-optimisation are the paper-register version of the same evasion.",
          },
        ],
      },
      {
        slug: "continuous-red-teaming",
        title: "Continuous red-teaming",
        blurb: "A programme, not a quarter — three tiers, one register, one metric: fix-rate latency by severity.",
        topic: "ai-security",
        skillIds: ["continuous-red-teaming"],
        capability: "Run a tiered continuous red-teaming programme (automated, human, external) measured by fix-rate latency and reopen-rate.",
        minutes: 10,
        concept: {
          anchor:
            "Continuous red-teaming is a pipeline with a metric — findings in one register, fixes verified by re-run, success measured as fix-rate latency, not finding count.",
          what: "Three tiers feeding ONE register: **automated** packs in CI (known families — regressions only), a **monthly human red team** (novel chains, cross-agent attacks), and a **standing bounty/external tier** (adversary diversity). Findings triage to severity by blast radius × confidence; every fix creates a CI family entry; bounty pays on verified closure.",
          why: "Setu's data: the automated tier alone plateaus — it re-finds what it knows. The human tier found the deputy chain in month two. An external researcher found the tool-description rug-pull neither internal tier imagined. Coverage comes from adversary diversity; the programme exists to institutionalise it.",
          where: [
            "**CI attack suites** — the automated tier, inherited from the practice course",
            "**Monthly adversary days** — dedicated human red-team windows with federation access",
            "**Bug bounties for AI** — scoped, paying on verified closure, published scope",
          ],
          whenNot:
            "Fix-rate latency is the metric; finding-count is a vanity number that rewards noisy scanners. And if the team batch-closes SEV-3s unread under alert fatigue, programme coverage is zero regardless of dashboards.",
        },
        prose: [
          "The programme shape falls out of what each tier can and cannot find. The automated pack (the practice course's CI suite, grown) fires every merge and catches exactly one thing: regressions of known families. It will never find a novel chain, because it asserts what it already knows. The human tier — monthly adversary days with federation access and a brief, not a script — finds what packs can't. Setu's deputy chain was a two-hop cross-agent construction no probe family contained. The external tier finds what your team's collective imagination won't: the tool-description rug-pull came from a bounty researcher who thinks in supply chains because that's their day job. Three tiers because each is blind to the next tier's class — that's not inefficiency, that's the coverage model.",
          "The register discipline makes it a programme: one schema, one severity ladder (blast radius × confidence, from lesson three), deduplication into families rather than instance-piles. Triage is a scheduled activity with a SLA. Fixes ship as PRs whose CI entry covers the FAMILY (the instance closes, the family entry asserts every variant the red team can re-phrase). Verification is re-run green; bounty payment lands on verified closure, never on filing — paying on filing buys duplicates and drama. And the whole apparatus is judged by one number: fix-rate latency per severity, trended. Setu's targets are 24h/48h/5d for SEV-1/2/3. The shadow metric, reopen-rate, catches fixes that didn't hold.",
          "The boundary beat is the failure mode of every maturing programme: metric capture. Finding-count is the vanity metric — it rises when you onboard a noisy scanner, which feels like progress and is the opposite. The subtler capture is alert fatigue: when SEV-3 volume makes the team batch-close unread, the register says 'closed' and reality says 'ignored'. So audit a quarterly sample of closed findings against their CI entries, and treat sample-failure as a programme SEV in its own right. The red-team programme is a sensor grid. The sensor that reads green while sleeping is worse than no sensor, because it allocates your trust wrongly.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Setu's quarterly review shows: findings filed up 4× (new scanner onboarded), fix-rate latency flat, reopen-rate up 2×. The programme lead proposes celebrating the finding growth. What's the accurate read?",
            choices: [
              { id: "a", label: "Growth in findings means growing coverage — celebrate" },
              { id: "b", label: "Coverage didn't grow — scanner noise did: flat fix-rate with rising reopen-rate means the pipeline is ingesting duplicates and shipping fixes that don't hold. The finding-count spike is a triage-load problem, and the reopen-rate is the signal that closure quality is degrading. Dedupe into families, tune the scanner, and hold the celebration until reopen-rate falls" },
              { id: "c", label: "Fire the scanner vendor and return to manual-only testing" },
            ],
            answer: "b",
            explanation:
              "Finding-count rewards noise; fix-rate latency and reopen-rate measure the programme. A 4× filing spike with flat fixing means triage strain and duplicate churn — and rising reopens mean some 'verified' fixes were cosmetic. The metrics discipline exists for exactly this moment.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Which tier boundary matters most when scoping a FIRST red-team programme for a 5-person team: what can safely be skipped at that size?",
            choices: [
              { id: "a", label: "Skip nothing — all three tiers are mandatory from day one" },
              { id: "b", label: "The automated tier is non-negotiable (it's the CI suite — cheapest, catches regressions). The human tier compresses to a monthly 2-hour adversary window the team runs on itself. The EXTERNAL tier is the one that scales down: replace bounty with scoped disclosure + a trusted-advisory relationship until the asset surface justifies adversarial attention. Tier value scales with asset blast radius — pay for adversaries when adversaries will plausibly come" },
              { id: "c", label: "Skip the automated tier — humans find what matters" },
            ],
            answer: "b",
            explanation:
              "The tiers are ordered by cost and by adversary-plausibility: CI packs are infrastructure, human creativity compresses but shouldn't vanish, and external bounties make sense when the asset attracts external adversaries. Skipping automation inverts the value order — the regression net is what keeps every human finding closed forever.",
          },
        ],
      },
      {
        slug: "the-security-tradeoff-review",
        title: "The security tradeoff review",
        blurb: "Price it, decide it, sign it, re-price it — the register as the court record of security tradeoffs.",
        topic: "ai-security",
        skillIds: ["security-risk-governance"],
        capability: "Maintain a priced risk register: likelihood × impact × cost, explicit accept/mitigate decisions with owners, and quarterly re-pricing.",
        minutes: 10,
        concept: {
          anchor:
            "The risk register is a court record: every accepted risk priced, signed, dated — and re-priced on a clock, because decisions expire silently.",
          what: "Register discipline: each row carries risk, **likelihood × impact** grounded in evidence, **mitigation cost** (engineering + product friction), an explicit **ACCEPT/MITIGATE decision**, an **owner** accountable by name, and a **revisit trigger** (date or event). The quarterly review re-prices rows; silence never renews a decision.",
          why: "Security tradeoffs are product decisions with irreversible tails. Setu's grievance-intake hardening cost 40ms/query against a measurable completion-rate loss for low-literacy citizens. Neither side can decide alone. The decision made implicitly (by shipping nothing) is still a decision — just an unsigned one.",
          where: [
            "**Quarterly risk reviews** — the board-level rhythm",
            "**Post-delta sign-offs** — accepted risks from design reviews land here",
            "**Incident retros** — reopened rows and their re-priced worlds",
          ],
          whenNot:
            "Registers fail both ways: the paper register (recorded, never re-priced — courage that expired) and the everything-register (every papercut priced — review drowns, signal dies). Rows are for decisions someone would argue about; enforceable-by-CI items belong in the suite, not the court.",
        },
        prose: [
          "The problem the register solves is organisational, not technical. Security tradeoffs are decisions spanning engineering, product, and sometimes legal. Organisations that don't make them explicitly make them anyway — by default, unsigned. Setu's live example: hardening the grievance intake against slow-burn poisoning costs three engineering-months plus 40ms per query. The product side has the completion-rate curve for exactly that latency on low-literacy citizens, and it's steep. That's a real trade between a low-likelihood/medium-impact risk and a certain, measurable, recurring product cost. The register's job is to force that trade into a row — argued with numbers, signed by a name.",
          "Row anatomy is the discipline. Risk stated specifically (not 'corpus risk' but 'slow-burn poisoning of grievance intake'). Likelihood × impact grounded in evidence — the diff-alarm detection latency from lesson one is an input to impact; the corpus write-surface determines likelihood; vibes don't price. Mitigation cost on both axes (engineering cost AND user friction — the lesson-nine airport, now with numbers). The decision, explicit: ACCEPT (alarms as the control, hardening deferred) or MITIGATE (scoped to the irreversible paths). The owner, by name, with the clock: revisit when intake volume doubles, or when an alarm fires, or next quarter — whichever comes first. The signature is what makes it governance: an accepted risk with a name and a date is a decision; without them it's an oversight with paperwork.",
          "The quarterly review is where rows live or die, and it has three moves. Re-price: did likelihood, impact, or cost move — a 2× intake volume changes the row's world. Check triggers: any adjacent incident, any alarm, any threshold crossed. Re-sign or flip — silence never renews. The boundary beats are the two known failure shapes. The paper register: decisions recorded once and treasured — it documents courage that expired when the system grew past it. The everything-register: priced papercuts drowning the review until nothing gets argued but everything gets nodded. The rule: rows exist for decisions someone would genuinely argue about, and everything enforceable-by-CI belongs in the suite where it holds for free. The register is the court, not the warehouse.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Setu's register review: the grievance-intake row (accepted 2 quarters ago) shows its revisit trigger — intake volume — has since doubled, unremarked. The owner left the company last quarter. What does the discipline require?",
            choices: [
              { id: "a", label: "The row stands — decisions bind until explicitly reversed" },
              { id: "b", label: "The row is void in everything but paperwork: the revisit trigger fired unremarked (review failure), and the accountable name is gone (ownership failure). Re-price NOW with a new named owner — at 2× volume both likelihood and impact moved, so the ACCEPT may or may not survive re-pricing. And log the process failure itself: triggers that fire silently are unreviewed triggers" },
              { id: "c", label: "Escalate to the board and mitigate immediately regardless of re-pricing" },
            ],
            answer: "b",
            explanation:
              "Register decisions expire with their world: a fired trigger and a departed owner mean the row's premises are dead even if its conclusion survives. The discipline is re-price-and-re-sign with a new name — and fix the process hole (silent triggers) that let it lapse.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A team proposes registering 60 rows: every finding from every drill, each priced. You've seen their CI suite catches 55 of them deterministically. Your ruling?",
            choices: [
              { id: "a", label: "Approve — comprehensive registers are best practice" },
              { id: "b", label: "Reject the scope: the 55 CI-enforceable items belong in the suite, where they hold without human review — the register takes the ~5 that require an argued tradeoff (cost, friction, deferred timelines). The everything-register drowns the quarterly review: sixty rows get nodded, five argued decisions get lost in them. The register is a court, not a warehouse — enforceable-by-machine items don't need a judge" },
              { id: "c", label: "Approve but mark the 55 as 'informational' rows reviewed annually" },
            ],
            answer: "b",
            explanation:
              "Register scope is the boundary between governance and bureaucracy: rows exist where a human tradeoff is genuinely being made. CI-covered items already have a stronger enforcement mechanism; duplicating them as rows spends review attention — the scarcest resource the register has — on decisions that were never open.",
          },
        ],
      },
      {
        slug: "setu-capstone",
        title: "Capstone: the Setu architecture review",
        blurb: "Eight lessons on one federation — programme metrics, obligation mappings, and the open finding signed, not hidden.",
        topic: "ai-security",
        skillIds: ["security-architecture-review", "security-risk-governance"],
        capability: "Conduct a full AI security architecture review: layered federation, programme metrics, obligation coverage, and signed open findings.",
        minutes: 15,
        concept: {
          anchor:
            "The architecture review is the whole course on one page: the federation layered end-to-end, the programme evidenced by metrics, the obligations mapped to artifacts — and the open finding signed, not hidden.",
          what: "The Setu review assembles the course: **identity propagation** across the delegation graph (L2), **provenance and diff alarms** on corpora (L1, L7), **pinned models with quarantine paths** (L1, L3), **approval gates on irreversible tools** (L2), the **design-review delta gate** (L4), **obligation-to-artifact mappings** (L5), the **three-tier red-team programme** by fix-rate (L6), and the **register** with re-priced rows (L7) — plus its honest open findings.",
          why: "A review that can't fit on one page can't be argued in one meeting. A review without signed open findings isn't a review, it's a performance. The capstone demonstrates both.",
          where: [
            "**Annual/threshold architecture reviews** — the full-court version",
            "**Handover and audit artifacts** — the review IS the security story",
            "**Design-review training** — the exemplar future reviewers copy",
          ],
          whenNot:
            "The review describes a moment: it expires with the next delta that skips its gate — the review is maintained by the programme (gate, drills, register), not by the document's existence. Frame it as a living artifact with an owner, or don't frame it at all.",
        },
        diagram: {
          kind: "flow",
          steps: [
            { kind: "input", text: "Citizen principal minted", caption: "identity + purpose + task window" },
            { kind: "process", text: "Per-hop policy through federation", caption: "propagated principal re-checked at every agent" },
            { kind: "process", text: "Corpora: provenance + diff alarms", caption: "models: pinned, rate-limited, canaried" },
            { kind: "process", text: "Vault tools behind approval gates", caption: "gates log to the trace store" },
            { kind: "output", text: "Register + programme metrics", caption: "fix-rate, reopen-rate, obligation coverage" },
          ],
          loop: "delta gate per design · drills monthly · register quarterly",
        },
        prose: [
          "Read the architecture as the threat model wearing federation armor. The citizen principal is minted at entry and propagated end-to-end (lesson two) — no hop authorises on peer reputation. Corpora carry provenance and diff alarms (lessons one and seven): slow-burn detection lives at ingestion, where it works. Models are version-pinned with quarantine paths and extraction rate limits. Classifiers on irreversible routes get the hardened boundary plus monitored fallback; the marketing routes get fallback alone (lesson one's boundary, placed). Vault tools sit behind approval gates keyed to the principal — never the asking agent. Every gate firing lands in the trace store that lessons three and five turn into forensics and compliance evidence respectively.",
          "Then the programme evidence, because architecture without verification is a diagram. Fix-rate latencies sit inside targets (18h/40h/4d for SEV-1/2/3), with reopen-rate flat. The register holds eleven accepted risks, all signed, three flipped to MITIGATE on quarterly re-prices. 100% of door-changing design docs carry delta sections (the gate is mechanical). Every binding obligation is mapped to a living artifact with reconciled retention clocks. Each claim traces to an artifact — the review asserts nothing it can't show, which is lesson five's discipline applied to the review itself.",
          "And the honest page — the part that makes this a review rather than a brochure: OF-9, open. Long-horizon agent tasks still depend on capability expiry being re-checked at federation scale. The overnight grievance batches haven't exercised it. A game-day is scheduled, the owner is core platform, and the gap is priced in the register rather than hidden in a paragraph. That signature — a known gap, named and scheduled — is the strongest signal a security organisation can send, because it proves the apparatus sees. The method you take with you: constrain from the asset, layer at trust transitions, verify by fix-rate, govern by signature. It held for PaisaShield's three keys; it holds for Setu's forty agents; it will hold for whatever you're handed next. Every piece of it was derived, not decreed — and derivations travel.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "In Setu's annual review, the identity-propagation layer (L2) shows green: 100% of inter-agent requests carry principals, per-hop policies enforced. The red-team programme reports a successful deputy-chain attack through a NEW tool onboarded last month. What did the review's evidence miss?",
            choices: [
              { id: "a", label: "Nothing — the layers are green, so the attack must be a fluke" },
              { id: "b", label: "Coverage vs. enrollment: the propagation layer's 100% counts requests passing THROUGH it. The new tool was onboarded outside the delta gate (lesson four's trigger missed), so its endpoint accepted requests without demanding principals at all. Layer metrics measure the layer's residents; the review needs the complement — endpoints NOT behind the layer — which is an enrollment/coverage metric, not a layer-health metric" },
              { id: "c", label: "The red team lied — programme findings can't contradict green dashboards" },
            ],
            answer: "b",
            explanation:
              "Green layer dashboards count what the layer sees; assets onboarded around the layer are invisible to its metrics. The review's structural question is enrollment coverage — which endpoints, tools, and corpora are NOT yet behind each control — and its absence is exactly how new surface re-opens closed classes.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "You're asked to run this same architecture review for a 15-person startup with one AI product and no federation. What carries over unchanged, and what collapses?",
            choices: [
              { id: "a", label: "Nothing carries — the course was for national scale" },
              { id: "b", label: "The derivations carry whole (asset → blast radius → layers at trust transitions; assume-the-trick-lands for key sizing; fix-the-class for incidents; price-and-sign for tradeoffs; artifact-mapped obligations) — they were derived from constraints, and the startup's constraints are the same kinds. The FEDERATION machinery collapses: no identity propagation without delegation, no multi-tier bounty before adversaries exist. Its place is taken by the practice course's stack plus the register and delta gate at startup weight. Scale changes the size of the apparatus, never the direction of the arguments" },
              { id: "c", label: "Everything carries — startup should implement all layers at full weight now" },
            ],
            answer: "b",
            explanation:
              "The course's content is two-layered: derivations (scale-free, constraint-grounded) and apparatus (scales with surface area and adversary plausibility). The review's craft is knowing which layer any given control lives in — that judgment, applied at any size, is the capstone's actual takeaway.",
          },
        ],
      },
    ],
};

export default course;
