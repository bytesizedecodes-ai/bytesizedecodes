"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { ToggleGroup } from "./controls";
import { Reveal, Stagger, MotionChild } from "./motion";
import {
  PlateSet,
  Plate,
  PlateHeader,
  PlateMap,
  InkBox,
  Oval,
  Glyph,
  SideArrow,
  NoteRule,
} from "./plate";

/**
 * AI Agents: In Practice — Lesson 1: "Thought → Action → Observation"
 * (infographics-interactive-matured_v1 — Plate grammar)
 *
 * Printed-plate minimalism: the loop diagram decomposed into an accumulating
 * transcript drawn as thin ink on canvas. Beat 1 stages the artifact (the
 * chat window + four roles); beats 2–4 add one element each (the tool_call,
 * the Observation, the dashed re-send envelope with its token growth); the
 * stepper plate runs the same transcript to Final Answer across two traces
 * (one clean, one that adapts off an actionable 503); the last plate maps
 * failure signatures to trace shapes. No cards, no chips, no shadows — the
 * Plate vocabulary from ./plate.tsx carries the whole look.
 */

type Role = "system" | "user" | "assistant" | "tool";

const ROLE_GLYPH: Record<Role, "gear" | "person" | "chip" | "db"> = {
  system: "gear",
  user: "person",
  assistant: "chip",
  tool: "db",
};

/** One message line — written on the canvas, boxed only when it is the delta. */
function MessageLine({
  role,
  children,
  tone = "plain",
}: {
  role: Role;
  children: ReactNode;
  tone?: "plain" | "dim" | "accent";
}) {
  const frame =
    tone === "accent"
      ? "rounded-md border border-brand bg-brand-wash px-2.5 py-1.5"
      : tone === "dim"
        ? "rounded-md px-2.5 py-1.5 opacity-55"
        : "rounded-md px-2.5 py-1.5";
  return (
    <div className={`flex items-start gap-2.5 ${frame}`}>
      <Glyph name={ROLE_GLYPH[role]} className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-soft" />
      <span className="mt-px shrink-0 font-mono text-[9px] font-bold uppercase tracking-wide text-ink-faint">
        {role}
      </span>
      <div className="min-w-0 flex-1 text-xs leading-relaxed text-ink">{children}</div>
    </div>
  );
}

/** The transcript stage — one chat window, drawn thin. */
function Transcript({
  rows,
  accentIndex,
}: {
  rows: { role: Role; body: ReactNode }[];
  accentIndex: number;
}) {
  return (
    <div className="mx-auto w-full max-w-xl rounded-xl border border-ink/70">
      <div className="flex items-center gap-1.5 border-b border-ash px-3 py-1.5" aria-hidden="true">
        <span className="h-1.5 w-1.5 rounded-full border border-ink-soft" />
        <span className="h-1.5 w-1.5 rounded-full border border-ink-soft" />
        <span className="h-1.5 w-1.5 rounded-full border border-ink-soft" />
        <span className="ml-2 font-mono text-[9px] font-bold uppercase tracking-wide text-ink-faint">
          messages[]
        </span>
        <span className="ml-auto font-mono text-[9px] font-bold text-ink-faint">{rows.length}</span>
      </div>
      <div className="space-y-1.5 px-3 py-3">
        {rows.map((row, i) => (
          <MessageLine key={i} role={row.role} tone={i === accentIndex ? "accent" : i < accentIndex ? "dim" : "plain"}>
            {row.body}
          </MessageLine>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stepper traces — deterministic, two situations, different endings   */
/* ------------------------------------------------------------------ */

type TraceStep = {
  role: Role;
  phase: "Thought" | "Action" | "Observation" | "Final Answer";
  line: string;
  mono?: boolean;
  tokens: number;
};

type TraceDef = {
  label: string;
  task: string;
  steps: TraceStep[];
  closing: string;
};

type TraceKey = "declined" | "gateway";

const TRACES: Record<TraceKey, TraceDef> = {
  declined: {
    label: "Declined payment",
    task: "Why did payment pay_9x2f decline?",
    steps: [
      { role: "assistant", phase: "Thought", line: "I need the payment record before I can explain the decline.", tokens: 60 },
      {
        role: "assistant",
        phase: "Action",
        line: 'get_payment({ "payment_id": "pay_9x2f" })',
        mono: true,
        tokens: 70,
      },
      {
        role: "tool",
        phase: "Observation",
        line: '{ "status": "declined", "reason": "insufficient_funds", "amount": "₹2,450" }',
        mono: true,
        tokens: 170,
      },
      { role: "assistant", phase: "Thought", line: "Declined for insufficient funds. Check whether a retry or refund followed.", tokens: 55 },
      { role: "assistant", phase: "Action", line: 'list_refunds({ "payment_id": "pay_9x2f" })', mono: true, tokens: 65 },
      { role: "tool", phase: "Observation", line: '{ "refunds": [] }', mono: true, tokens: 110 },
      {
        role: "assistant",
        phase: "Final Answer",
        line: "pay_9x2f declined — insufficient funds (₹2,450). No refund exists yet.",
        tokens: 140,
      },
    ],
    closing:
      "Three turns, two tool calls — and turn 3 re-sent everything turns 1–2 said. That re-send, growing each turn, is the cost line in the bill.",
  },
  gateway: {
    label: "Refund gateway 503",
    task: "Was payment pay_7k1d ever refunded?",
    steps: [
      { role: "assistant", phase: "Thought", line: "The refund service is the direct source — try it first.", tokens: 55 },
      { role: "assistant", phase: "Action", line: 'list_refunds({ "payment_id": "pay_7k1d" })', mono: true, tokens: 65 },
      {
        role: "tool",
        phase: "Observation",
        line: '{ "error": "refund gateway 503 — refund state also visible via get_payment" }',
        mono: true,
        tokens: 150,
      },
      { role: "assistant", phase: "Thought", line: "Refund gateway is down, but the error names a fallback. Use get_payment.", tokens: 60 },
      { role: "assistant", phase: "Action", line: 'get_payment({ "payment_id": "pay_7k1d" })', mono: true, tokens: 70 },
      {
        role: "tool",
        phase: "Observation",
        line: '{ "status": "refunded", "refund": { "id": "re_33f1", "amount": "₹2,450", "settled": true } }',
        mono: true,
        tokens: 180,
      },
      {
        role: "assistant",
        phase: "Final Answer",
        line: "pay_7k1d was refunded ₹2,450 (re_33f1, settled). Gateway is down; payment state confirms it.",
        tokens: 145,
      },
    ],
    closing:
      "The 503 error told the model what to do next. Errors that name the fallback turn a dead end into a reroute — that is a tool-contract decision, not a model one.",
  },
};

export function ThoughtActionObservation() {
  const [trace, setTrace] = useState<TraceKey>("declined");
  const [step, setStep] = useState(0);

  const current = TRACES[trace];
  const visible = current.steps.slice(0, step);
  const finished = step >= current.steps.length;
  const totalTokens = visible.reduce((sum, s) => sum + s.tokens, 0);

  return (
    <PlateSet>
      <PlateHeader
        kicker="ai agents in practice · 01"
        title="The loop is a growing transcript"
        dek="One message list, four roles — and the whole agent loop visible in how it grows."
      />

      <PlateMap
        steps={[
          "the artifact",
          "a turn requests a tool",
          "the harness writes back",
          "every turn re-reads",
          "failures leave signatures",
        ]}
      />

      {/* Beat 1 — the artifact: substrate + referents */}
      <Plate kicker="so · the artifact">
        <Stagger className="mx-auto max-w-xl space-y-4">
          <MotionChild>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-ink-soft">
              {(["system", "user", "assistant", "tool"] as const).map((role) => (
                <span key={role} className="flex items-center gap-1.5">
                  <Glyph name={ROLE_GLYPH[role]} className="h-3.5 w-3.5" />
                  <span className="font-mono text-[9px] font-bold uppercase tracking-wide">{role}</span>
                </span>
              ))}
            </div>
          </MotionChild>
          <MotionChild>
            <Transcript
              accentIndex={-1}
              rows={[
                {
                  role: "system",
                  body: (
                    <span className="font-mono text-[10px] text-ink-soft sm:text-[11px]">
                      You are a payments support agent. Tools: get_payment, list_refunds.
                    </span>
                  ),
                },
                {
                  role: "user",
                  body: <span className="font-medium text-ink">&ldquo;Why did payment pay_9x2f decline?&rdquo;</span>,
                },
              ]}
            />
          </MotionChild>
        </Stagger>
        <p className="mx-auto mt-3 max-w-xl text-center font-mono text-[10px] text-ink-faint">
          four fixed roles · this list is the only state an agent has
        </p>
      </Plate>

      {/* Beat 2 — the delta: an assistant turn that is a tool call */}
      <Plate kicker="but · the model asks, it does not run">
        <Transcript
          accentIndex={2}
          rows={[
            { role: "system", body: <span className="font-mono text-[10px] text-ink-soft sm:text-[11px]">You are a payments support agent…</span> },
            { role: "user", body: <span className="font-medium text-ink">&ldquo;Why did pay_9x2f decline?&rdquo;</span> },
            {
              role: "assistant",
              body: (
                <span className="text-ink">
                  Thought — I need the payment record first.
                  <br />
                  Action —{" "}
                  <span className="break-all font-mono text-[10px] font-bold text-brand-deep sm:text-[11px]">
                    get_payment(payment_id=&quot;pay_9x2f&quot;)
                  </span>
                </span>
              ),
            },
          ]}
        />
        <p className="mx-auto mt-3 max-w-xl text-center font-mono text-[10px] text-ink-faint">
          the reply is a tool_call — a struct your code must execute
        </p>
      </Plate>

      {/* Beat 3 — the delta: the harness appends the Observation */}
      <Plate kicker="because · only the harness can execute">
        <Transcript
          accentIndex={3}
          rows={[
            { role: "system", body: <span className="font-mono text-[10px] text-ink-soft sm:text-[11px]">You are a payments support agent…</span> },
            { role: "user", body: <span className="font-medium text-ink">&ldquo;Why did pay_9x2f decline?&rdquo;</span> },
            {
              role: "assistant",
              body: (
                <span className="font-mono text-[10px] text-ink-soft sm:text-[11px]">
                  Thought · Action get_payment(pay_9x2f)
                </span>
              ),
            },
            {
              role: "tool",
              body: (
                <span className="break-all font-mono text-[10px] text-ink sm:text-[11px]">
                  {"{ status: declined, reason: insufficient_funds, amount: ₹2,450 }"}
                </span>
              ),
            },
          ]}
        />
        <p className="mx-auto mt-3 max-w-xl text-center font-mono text-[10px] text-ink-faint">
          this tool message is written by your code — the model only reads it
        </p>
      </Plate>

      {/* Beat 4 — before/after pair: the re-send IS the delta */}
      <Plate kicker="that's why · every turn re-reads everything">
        <div className="mx-auto max-w-xl sm:max-w-2xl">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-dashed border-ink/50 px-3 py-2.5 opacity-60">
              <div className="flex items-center justify-between font-mono text-[9px] font-bold uppercase tracking-wide text-ink-faint">
                <span>turn 1 · request</span>
                <span>2 msgs</span>
              </div>
              <p className="mt-2 font-mono text-[10px] leading-relaxed text-ink-soft">
                system
                <br />
                user
              </p>
              <div className="mt-2.5 flex items-center gap-1.5">
                <span className="h-1 w-8 rounded-full bg-ash" aria-hidden="true" />
                <span className="font-mono text-[9px] font-bold text-ink-faint">180 tok</span>
              </div>
            </div>
            <div className="rounded-xl border border-dashed border-brand bg-brand-wash px-3 py-2.5">
              <div className="flex items-center justify-between font-mono text-[9px] font-bold uppercase tracking-wide text-brand-deep">
                <span>turn 2 · request</span>
                <span>4 msgs</span>
              </div>
              <p className="mt-2 font-mono text-[10px] leading-relaxed text-ink">
                system
                <br />
                user
                <br />
                <span className="font-bold text-brand-deep">+ assistant tool_call</span>
                <br />
                <span className="font-bold text-brand-deep">+ tool observation</span>
              </p>
              <div className="mt-2.5 flex items-center gap-1.5">
                <span className="h-1 w-16 rounded-full bg-brand" aria-hidden="true" />
                <span className="font-mono text-[9px] font-bold text-brand-deep">480 tok · ↑ 2.6×</span>
              </div>
            </div>
          </div>
          <p className="mt-3 text-center font-mono text-[10px] text-ink-faint">
            the model has no memory between calls — the whole list goes out again, every turn
          </p>
        </div>
      </Plate>

      {/* Beat 5 — the stepper: the earned whole, interactive */}
      <Plate kicker="meanwhile · run a trace yourself">
        <div className="mx-auto max-w-xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[9px] font-bold uppercase tracking-wide text-ink-faint">trace</span>
            <ToggleGroup<TraceKey>
              label="Which trace to run"
              value={trace}
              onChange={(key) => {
                setTrace(key);
                setStep(0);
              }}
              options={[
                { value: "declined", label: TRACES.declined.label },
                { value: "gateway", label: TRACES.gateway.label },
              ]}
            />
          </div>

          <p className="mt-3 flex items-start gap-2 text-xs font-medium text-ink">
            <Glyph name="person" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-soft" />
            &ldquo;{current.task}&rdquo;
          </p>

          <ol className="mt-3 min-h-[7rem] space-y-1" aria-live="polite">
            {visible.map((s, i) => (
              <li
                key={i}
                className={`flex items-start gap-2 rounded-md px-2.5 py-1.5 text-[11px] leading-relaxed sm:text-xs ${
                  i === visible.length - 1
                    ? "border border-brand bg-brand-wash text-ink"
                    : "text-ink-soft"
                }`}
              >
                <Glyph name={ROLE_GLYPH[s.role]} className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span className="shrink-0 font-mono text-[9px] font-bold uppercase text-brand-deep">{s.phase}</span>
                <span className={`min-w-0 ${s.mono ? "break-all font-mono text-[10px] sm:text-[11px]" : ""}`}>
                  {s.line}
                </span>
              </li>
            ))}
            {visible.length === 0 && (
              <li className="px-2.5 py-1.5 text-xs font-medium text-ink-soft">
                Nothing has run yet. Press &ldquo;Next step&rdquo;.
              </li>
            )}
          </ol>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              disabled={finished}
              className="focus-ring min-h-[32px] rounded-md border border-ink bg-canvas px-4 py-1.5 text-sm font-bold text-ink transition-opacity hover:bg-ash disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next step ▸
            </button>
            <button
              type="button"
              onClick={() => setStep(0)}
              className="focus-ring min-h-[32px] rounded-md px-3 py-1.5 text-xs font-bold text-ink-soft underline underline-offset-4 hover:text-ink"
            >
              ↺ reset
            </button>
            <span className="ml-auto font-mono text-[10px] font-bold text-ink-faint">
              {Math.min(step, current.steps.length)}/{current.steps.length} · {totalTokens} loop tokens
            </span>
          </div>

          {finished && (
            <p className="mt-3 border-l-2 border-brand pl-3 text-xs font-semibold leading-relaxed text-ink sm:text-[13px]">
              {current.closing}
            </p>
          )}
        </div>
      </Plate>

      {/* Beat 6 — failure signatures */}
      <Plate kicker="and that is why · failures are read, not guessed">
        <Reveal>
          <div className="mx-auto grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              {
                glyph: "gear" as const,
                sig: 'Action: get_payment(…) ×5 — Observation: "not found" ×5',
                name: "blind retry",
                fix: "The error teaches nothing. Fix the tool's error text.",
              },
              {
                glyph: "terminal" as const,
                sig: "request 48,200 tokens → window 48,000",
                name: "overflow mid-task",
                fix: "Compact or trim the transcript before it crosses.",
              },
              {
                glyph: "doc" as const,
                sig: 'system: "cite the policy file" … 42 messages later',
                name: "goal drift",
                fix: "Re-pin the task near the newest turn.",
              },
            ].map((f) => (
              <InkBox key={f.name} tone="plain" className="flex flex-col gap-1.5">
                <span className="flex items-center gap-1.5 font-mono text-[9px] font-bold uppercase tracking-wide text-ink">
                  <Glyph name={f.glyph} className="h-3.5 w-3.5 text-ink-soft" />
                  {f.name}
                </span>
                <span className="break-all font-mono text-[10px] leading-relaxed text-ink-soft">{f.sig}</span>
                <span className="text-[11px] font-medium leading-relaxed text-ink-soft">{f.fix}</span>
              </InkBox>
            ))}
          </div>
        </Reveal>
      </Plate>

      {/* Beat 7 — the earned whole: the canonical cycle */}
      <Plate kicker="and so · the pattern, whole">
        <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-x-2 gap-y-3 py-2">
          <Oval label="Thought" />
          <SideArrow />
          <Oval label="Action" />
          <SideArrow label="tool_call" />
          <Oval label="Observation" />
          <SideArrow label="result" />
          <Oval label="Answer" exit />
        </div>
        <div className="mx-auto mt-1 flex max-w-md flex-col items-center">
          <svg viewBox="0 0 200 22" className="h-5 w-56 text-ink-faint" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" aria-hidden="true">
            <path d="M182 4C144 26 56 26 20 6" strokeDasharray="4 3.2" />
            <path d="M28 3.5l-9 2.2 6.8 6.4" fill="none" />
          </svg>
          <span className="-mt-1 font-mono text-[9px] font-bold uppercase tracking-wide text-ink-faint">
            again — until the model can answer
          </span>
        </div>
        <p className="mx-auto mt-3 max-w-xl text-center font-mono text-[10px] text-ink-faint">
          the trace you stepped above is this loop, written down one turn at a time
        </p>
      </Plate>

      <NoteRule>
        The agent loop is an accumulating transcript: the model emits Actions, the harness appends
        Observations, and every turn re-reads the whole list. Debug the transcript, not the model.
      </NoteRule>
    </PlateSet>
  );
}
