# AI Observability: intermediate and advanced course plan

**Status:** proposed curriculum plan; no product code or entitlement changes.

## Purpose and sequence

The existing free **AI Observability** course is the beginner prerequisite. It
teaches why AI fails quietly and introduces logs, metrics, traces, evaluations,
alerts, dashboards, cost, and the incident loop. The next two courses should
not repeat those definitions. They move the learner from *reading signals* to
*designing an operating system for an AI feature* and finally to *engineering
reliable AI production systems*.

| Course | Audience | Outcome | Recommended access |
| --- | --- | --- | --- |
| AI Observability: operate an LLM feature | Developers, product engineers, technical founders | Instrument, evaluate, and respond to failures in one LLM/RAG feature | Free or paid decision later |
| AI Observability: reliability engineering | Senior ML/platform/SRE engineers | Design a scalable, governed observability and evaluation system | Paid / Pro candidate |

**Prerequisites:** finish the beginner course. Intermediate assumes basic HTTP,
JSON, and application-development familiarity. Advanced assumes the
intermediate capstone plus practical experience with services, deployments,
and telemetry.

## Course 1 — AI Observability: operate an LLM feature

**Level:** intermediate  
**Framework:** Predict–Investigate–Case (PIC)  
**Format:** 12 lessons × 7–10 minutes; 90–120 minutes total  
**Narrative case:** a customer-support RAG assistant has become slower and less
helpful after a release. The same incident evolves across the whole course.

### Modules and topics

1. **From a request to a trace** — map user request → retrieval → LLM → tools
   → response; define trace, span, parent/child relationship, correlation ID.
2. **Instrument the right context** — capture model, prompt version, retrieval
   version, tool name, deployment/release, user-safe session segment, and error
   status; distinguish useful dimensions from high-cardinality noise.
3. **Logs that help without leaking data** — redaction, minimisation, retention,
   sampling, consent, and a practical "never log this" checklist.
4. **Latency and cost, broken down** — first-token vs total latency, tokens by
   stage, cache effects, retries, model/provider costs, p50/p95/p99.
5. **Define an AI service level objective** — turn "helpful and fast" into a
   measurable service-level indicator, target, error budget, and review cadence.
6. **Quality is a production signal** — offline gold set, online sampling,
   rubric-based evaluation, user feedback, and the limits of an LLM judge.
7. **Observe RAG, not only the model** — retrieval hit quality, empty retrieval,
   context relevance, grounding/citation support, and index freshness.
8. **Prompt, model, and tool regressions** — compare releases, use a canary,
   find the changed variable, and avoid blaming the model first.
9. **Alerts people trust** — multi-window/burn-rate thinking, routing,
   deduplication, severity, and an action-oriented runbook.
10. **Triage a real-looking incident** — start at an alert; move dashboard →
    cohort slice → trace → log → release comparison; form and test a hypothesis.
11. **Build the operator dashboard** — choose the few tiles and drill-downs
    needed by an on-call person; separate executive reporting from diagnosis.
12. **Capstone: rescue the support assistant** — create a telemetry map, three
    quality/performance signals, one SLO, one alert/runbook, and a written
    incident diagnosis from supplied mock telemetry.

### Required interactive beats

- **Trace schema builder:** pick fields for each span, then reveal privacy,
  cardinality, and debugging consequences.
- **RAG incident explorer:** filter a supplied trace set by prompt version,
  retrieval status, and latency; identify the regression before explanation.
- **SLO/alert tuner:** choose a target and threshold, see false-alert and
  missed-user-impact consequences, then justify the choice.

## Course 2 — AI Observability: reliability engineering

**Level:** expert  
**Framework:** Problem-First Diagnostic (CER)  
**Format:** 12 lessons × 10–14 minutes; 2.5–3 hours total  
**Narrative case:** a multi-agent financial-research system is rolled out across
regions and providers. The challenge is to detect quality, safety, and cost
regressions without exposing sensitive prompts or making telemetry unaffordable.

### Modules and topics

1. **Telemetry architecture and contracts** — collector pipeline, propagation,
   resource attributes, event vs metric vs span, schemas, versioning, and
   ownership.
2. **GenAI semantic conventions in practice** — model, request, response,
   tool, agent, retrieval, and deployment attributes; when standards should be
   extended rather than forked.
3. **Sampling, cardinality, and telemetry cost** — head/tail sampling, exemplar
   traces, dimensionality budgets, aggregation, retention tiers, and loss-aware
   debugging.
4. **Privacy, security, and governance by design** — PII/secret detection,
   redaction boundaries, access controls, audit trails, regional retention, and
   safe prompt/response inspection.
5. **Evaluation systems, not one score** — task suites, rubric reliability,
   inter-rater agreement, calibrated LLM judges, confidence intervals, and
   score-distribution shift.
6. **Detecting drift and regressions** — input/output/retrieval drift,
   distribution tests, sequential monitoring, change points, and cohort-aware
   baselines.
7. **Causal diagnosis and experimentation** — correlate carefully; use feature
   flags, canaries, shadow traffic, holdouts, rollback rules, and counterfactual
   tests to establish a cause.
8. **Agent and tool-use observability** — agent/task spans, tool-call success,
   loop/retry detection, budget exhaustion, state transitions, and trace graph
   anomalies.
9. **Safety and policy signals** — harmful output, jailbreak attempts, unsafe
   tool parameters, policy refusal quality, human escalation, and abuse cohorts.
10. **Reliability objectives and error budgets** — multiple SLOs for
    availability, latency, quality, cost, and safety; conflict resolution and
    release gates.
11. **Incident command and learning loop** — telemetry-led response, stakeholder
    communication, blameless postmortem, corrective actions, and regression
    tests that prevent recurrence.
12. **Capstone: production observability design review** — defend a telemetry
    contract, SLO portfolio, evaluation plan, privacy model, rollout guardrails,
    and incident response design for the multi-agent system.

### Required expert activities

- **Schema review:** identify missing context and dangerous fields in a proposed
  telemetry contract; submit a corrected version.
- **Regression investigation:** inspect aggregated metrics plus sampled traces;
  choose whether to halt a rollout and state the evidence threshold.
- **Design review:** critique two competing observability architectures using
  cost, privacy, debuggability, and release-safety constraints.

## Authoring and platform implications

- Add the courses only after defining new `SkillId` values and skill evidence
  groups (telemetry design, RAG quality, SLOs, privacy, evaluation systems,
  agent observability, and incident response).
- Use the current `infographics-interactive_v4` standard: intermediate lessons use
  PIC and task-framed investigation; expert lessons use CER with sparse,
  evidence-first guidance. Both include a prediction/commitment before reveal.
- Build reusable local-data widgets first: trace-schema builder, incident
  explorer, SLO tuner, distribution-shift visualiser, and release/canary
  decision panel. Do not build an unrestricted beginner-style sandbox.
- Keep tool/vendor lessons comparative and optional. Teach telemetry concepts
  and open standards first; tool screens age quickly.
- Make the advanced course a Pro candidate only when payment/entitlements are
  real; until then use the existing paid soft-gate honestly.

## Delivery order and acceptance criteria

1. Create the intermediate course outline, skill map, and three reusable
   widgets; author the first four lessons and validate mobile/dark/reduced-motion.
2. Ship the intermediate capstone and its diagnostic rubric before expanding to
   all advanced content.
3. Create the advanced schema, sampling, evaluation, and agent-observability
   lessons; then build the production design-review capstone.

Each course is ready when every lesson has a capability statement, one
constructive beat, 2–3 diagnostic questions, a transfer prompt, keyboard-safe
interaction, and a course capstone that demonstrates the stated outcome.

## Currency-sensitive technical anchors

- OpenTelemetry maintains GenAI semantic conventions separately from the main
  semantic-conventions documentation; author the standards lesson against the
  current repository, not copied attribute names.
- The SLO lesson should teach continuous iteration rather than a fixed
  universal target; targets must follow user-visible service outcomes.
- Risk, privacy, and governance content should be framed as system lifecycle
  work, not a compliance checklist.

Sources to refresh at authoring time: [OpenTelemetry GenAI semantic
conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/), [Google SRE
workbook on implementing SLOs](https://sre.google/workbook/implementing-slos/),
and [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework).
