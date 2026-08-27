import type { Course } from "../types";

/**
 * AI Agents: In Practice — the patterns course for practitioners.
 *
 * Course system (matured-v1 pedagogy — no cast): one support agent over a
 * payments API. Its artifacts are the through-line: the transcript, the
 * tool registry, the guardrail config, the eval report. Each lesson adds
 * one constraint or design decision to that system; the capstone assembles
 * them.
 *
 * Boundary with the harness trilogy: harness courses build ONE agent's
 * parts (context, tools, memory, guardrails). This course owns the
 * control-flow and patterns view — the ReAct anatomy, reflection,
 * planning, cooperation, agency levels, MCP as a tool distribution layer.
 */
const course: Course = {
    slug: "ai-agents-in-practice",
    title: "AI Agents in Practice",
    subtitle:
        "Read the trace, then design the loop — ReAct anatomy, reflection, planning, cooperation, and how much control to hand over.",
    description:
        "The patterns course for people who already ship LLM features. One support agent over a payments API carries the whole course: its transcript teaches the ReAct loop and trace reading, its tool registry teaches tool choice and MCP, its guardrail config teaches budgets and validation. Lessons add reflection, planning, and multi-agent cooperation as design decisions with costs — ending at the five levels of agency and a capstone that assembles them. If the Harness Engineering trilogy builds one agent's parts, this course decides how the agent should think.",
    level: "intermediate",
    pedagogy: "matured-v1",
    domain: "AI Engineering",
    access: "paid",
    prerequisites:
        "Harness Engineering Foundations (the loop, tool calls, context window) or equivalent — we assume words like function call, token, and system prompt need no definition.",
    lessons: [
        {
            slug: "thought-action-observation",
            title: "Thought → Action → Observation",
            blurb:
                "The ReAct loop read as an accumulating transcript: the model emits actions, the harness appends observations, and every turn re-reads everything.",
            topic: "agent-loop",
            skillIds: ["react-loop"],
            capability:
                "Read an agent's transcript turn by turn — name the four message roles, explain why each turn re-sends the whole history, and diagnose a retry loop, an overflow, or a lost goal from the trace alone.",
            minutes: 8,
            concept: {
                anchor:
                    "Every agent debug log shows the same three words — Thought, Action, Observation. That trio is the wire format of every agent loop you will ever debug.",
                what: "**ReAct** runs an LLM in a loop. Each turn, the model emits a **Thought** and an **Action** — a tool call. The **harness** executes it and appends the **Observation** (the tool's result) to the transcript. The grown transcript goes back in, until the model emits a Final Answer.",
                why: "The behaviours you must debug — cost growth, blind retries, context overflow, lost goals — all live in the transcript, not in the model. Reading the trace is the core diagnostic skill of agent work.",
                where: [
                    "Support agents that look up orders, payments, and refunds before answering",
                    "Coding agents that edit a file, run the tests, read the failure, and try again",
                    "Research agents that search, read, and cite in looped batches",
                ],
                whenNot:
                    "Don't reach for a loop when the task needs exactly one tool call with no branching. A fixed pipeline — fetch, then answer — is cheaper, faster, and easier to test than an agent.",
            },
            prose: [
                "A single LLM call is stateless. It reads a list of messages and produces one reply. An agent is what you get when code wraps that call in a loop. Each turn, the model sees the entire transcript so far, then emits either a tool call or the final answer.",
                "The harness does the running. It executes the tool call, formats the result, and appends it to the transcript as a tool message. The model never executes anything itself — it only asks. The Observation it reads next turn was written by your code, not by the model.",
                "This is why agent cost grows faster than most teams expect. Turn 3 re-sends turns 1 and 2. A six-turn task pays for the transcript again and again, a little bigger each time. Prompt caching and transcript compaction attack exactly this structure — they change what a re-send costs, not how the loop behaves.",
                "It is also why the trace is the debugging artifact. A blind retry shows as the same Action repeating with an unchanged Observation. Context overflow shows as the token count crossing the window. A lost goal shows as the system message drifting far above a crowded transcript. Read the transcript first — the model is rarely the problem.",
            ],
            questions: [
                {
                    id: "trace-retry-diagnosis",
                    kind: "mcq",
                    prompt:
                        "A payments-support agent's trace shows Action: get_payment(pay_9x2f) five times in a row. Each Observation is the same: \"not found\". Tickets are piling up. What is the most accurate diagnosis?",
                    choices: [
                        { id: "a", label: "The model is faulty — fine-tune it on successful tool calls" },
                        {
                            id: "b",
                            label: "The tool's error gives the model nothing new to act on, so it repeats the identical call — fix the tool to return an actionable error or richer result",
                        },
                        { id: "c", label: "The context window overflowed and the model forgot the earlier turns" },
                        { id: "d", label: "The temperature is too low — raise it so the model varies its calls" },
                    ],
                    answer: "b",
                    explanation:
                        "The loop is honest: the model acts, the harness appends the same Observation, and the transcript gives the model no new information to change course. The fix belongs to the tool contract — errors that say what to try next — not to the model. Retraining, temperature, or an overflow theory all miss the repeating evidence in the trace.",
                },
                {
                    id: "resend-cost-structure",
                    kind: "mcq",
                    prompt:
                        "Your team must cut the cost of a research agent whose average task runs six loop turns. The trace shows each turn's request re-sending every earlier message. Which change attacks the structure of this cost?",
                    choices: [
                        { id: "a", label: "Prompt the model to write shorter Thoughts and answers" },
                        { id: "b", label: "Switch to a larger model so tasks finish in fewer turns" },
                        {
                            id: "c",
                            label: "Cache the unchanged transcript prefix, or compact old turns, so each re-send stops re-billing at full price",
                        },
                        { id: "d", label: "Raise the step budget so the loop can finish sooner" },
                    ],
                    answer: "c",
                    explanation:
                        "The cost driver is structural: every turn re-bills the whole transcript. Prompt caching makes the unchanged prefix cheap; compaction shrinks what gets re-sent. Shorter prompts shave a small margin, a bigger model costs more per token, and a bigger budget only allows more re-sends.",
                },
            ],
        },
    ],
};

export default course;
