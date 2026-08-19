import { Fragment } from "react";
import type { ReactNode } from "react";
import { MotionChild, Reveal, Stagger } from "./motion";

/**
 * Standardized diagram primitives — the v5 visual grammar.
 *
 * Every "standardized format" infographic is built from these three shapes so
 * the whole course reads as one parseable system (see
 * .agents/skills/infographics-interactive_v5/references/standard-visual-formats.md):
 *
 *  - FlowChart    Input → Process → Output pipelines
 *  - CompareGrid  side-by-side model/idea comparison (Where to use / When NOT)
 *  - DecisionFlow question → branch trees (algorithm choice, workflow limits)
 *
 * Node text patterns are part of the contract: data/concept nodes render as
 * `[ … ]` and decision checks as `< … >`, in mono, with the chrome visible.
 * Theme-safe tokens only; entrances reuse the shared motion system.
 */

/* ------------------------------------------------------------------ */
/* Node chrome — the standardized text patterns.                       */
/* ------------------------------------------------------------------ */

const NODE_KIND_STYLES = {
  input: "border-ash bg-surface-elevated",
  process: "border-brand bg-brand-wash",
  output: "border-brand-muted bg-surface-elevated",
  decision: "border-dashed border-ink-soft bg-surface-elevated",
} as const;

const NODE_KIND_LABELS = {
  input: "Input node",
  process: "Process node",
  output: "Output node",
  decision: "Decision check",
} as const;

export type FlowNodeKind = keyof typeof NODE_KIND_STYLES;

/** The standardized node body: `[ text ]` or `< text >` in mono. */
function NodeText({ kind, text }: { kind: FlowNodeKind; text: string }) {
  const open = kind === "decision" ? "<" : "[";
  const close = kind === "decision" ? ">" : "]";
  return (
    <p className="font-mono text-[13px] font-semibold leading-relaxed text-ink sm:text-sm">
      <span className="text-ink-faint">{open}</span>
      <span className="mx-1">{text}</span>
      <span className="text-ink-faint">{close}</span>
    </p>
  );
}

/** A single flowchart node box: role label + bracket chrome + caption. */
export function FlowNodeBox({
  kind,
  text,
  caption,
}: {
  kind: FlowNodeKind;
  text: string;
  caption?: string;
}) {
  return (
    <div
      className={`w-full max-w-md rounded-xl border px-4 py-3 text-center shadow-sm ${NODE_KIND_STYLES[kind]}`}
    >
      <span className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-ink-faint">
        {NODE_KIND_LABELS[kind]}
      </span>
      <NodeText kind={kind} text={text} />
      {caption && (
        <p className="mt-1.5 text-xs font-medium leading-relaxed text-ink-soft sm:text-[13px]">
          {caption}
        </p>
      )}
    </div>
  );
}

/** The vertical connector between flow nodes. */
function FlowArrow({ label }: { label?: string }) {
  return (
    <MotionChild className="flex flex-col items-center py-0.5">
      <span aria-hidden="true" className="text-base leading-none text-brand">
        ↓
      </span>
      {label && (
        <span className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-ink-faint">
          {label}
        </span>
      )}
    </MotionChild>
  );
}

/* ------------------------------------------------------------------ */
/* FlowChart — Input → Process → Output pipeline.                      */
/* ------------------------------------------------------------------ */

export type FlowStep = {
  kind: FlowNodeKind;
  /** The bracket-pattern text, e.g. "Labelled examples" renders as [ Labelled examples ]. */
  text: string;
  /** Plain-English line under the node. */
  caption?: string;
  /** Label on the incoming arrow, e.g. "then" or "repeats". */
  arrowLabel?: string;
};

export function FlowChart({
  steps,
  loop,
}: {
  steps: readonly FlowStep[];
  /** Loop-back annotation for cyclical processes (e.g. reinforcement loops). */
  loop?: string;
}) {
  return (
    <Stagger className="flex flex-col items-center gap-1">
      {steps.map((step, i) => (
        <Fragment key={i}>
          {i > 0 && <FlowArrow label={step.arrowLabel} />}
          <MotionChild className="flex w-full justify-center">
            <FlowNodeBox kind={step.kind} text={step.text} caption={step.caption} />
          </MotionChild>
        </Fragment>
      ))}
      {loop && (
        <MotionChild className="w-full max-w-md">
          <div className="mt-3 rounded-xl border border-dashed border-ash px-4 py-2.5 text-center text-xs font-semibold text-ink-soft sm:text-[13px]">
            <span aria-hidden="true" className="mr-1.5 text-brand">
              ↻
            </span>
            {loop}
          </div>
        </MotionChild>
      )}
    </Stagger>
  );
}

/* ------------------------------------------------------------------ */
/* CompareGrid — side-by-side "where to use / when NOT" comparison.    */
/* ------------------------------------------------------------------ */

export type CompareSide = {
  title: string;
  subtitle?: string;
};

export type CompareRow = {
  /** Row label, e.g. "Where to use" or "When NOT to use". */
  label: string;
  left: string;
  right: string;
};

export function CompareGrid({
  left,
  right,
  rows,
}: {
  left: CompareSide;
  right: CompareSide;
  rows: readonly CompareRow[];
}) {
  return (
    <Reveal>
      <div className="overflow-hidden rounded-2xl border border-ash shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="border-b border-ash bg-surface-elevated px-4 py-3 sm:border-r sm:border-b-0">
            <CompareHead side={left} />
          </div>
          <div className="bg-brand-wash px-4 py-3">
            <CompareHead side={right} accent />
          </div>
        </div>
        {rows.map((row) => (
          <div key={row.label} className="border-t border-ash">
            <div className="bg-ash/50 px-4 py-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">
                {row.label}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2">
              <Cell title={left.title} className="sm:border-r">
                {row.left}
              </Cell>
              <Cell title={right.title}>{row.right}</Cell>
            </div>
          </div>
        ))}
      </div>
    </Reveal>
  );
}

function CompareHead({ side, accent = false }: { side: CompareSide; accent?: boolean }) {
  return (
    <div>
      <p
        className={`text-sm font-bold sm:text-[15px] ${accent ? "text-brand-deep" : "text-ink"}`}
      >
        {side.title}
      </p>
      {side.subtitle && (
        <p className="mt-0.5 text-xs font-medium text-ink-soft">{side.subtitle}</p>
      )}
    </div>
  );
}

/** One comparison cell; shows its column title on mobile only (stacked). */
function Cell({
  title,
  children,
  className = "",
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-surface-elevated px-4 py-3 ${className}`}>
      <span className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wide text-ink-faint sm:hidden">
        {title}
      </span>
      <p className="text-[13px] font-medium leading-relaxed text-ink-soft sm:text-sm">
        {children}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* DecisionFlow — question → branch tree.                              */
/* ------------------------------------------------------------------ */

export type DecisionNode =
  | {
      kind: "decision";
      /** The question, rendered as < question >. */
      question: string;
      caption?: string;
      branches: readonly {
        /** Edge label, e.g. "Yes" / "No" / "No labels". */
        label: string;
        node: DecisionNode;
      }[];
    }
  | {
      kind: "leaf";
      /** The outcome, rendered as [ answer ]. */
      answer: string;
      caption?: string;
    };

export function DecisionFlow({ root }: { root: DecisionNode }) {
  return <DecisionTreeNode node={root} />;
}

function DecisionTreeNode({ node }: { node: DecisionNode }) {
  if (node.kind === "leaf") {
    return (
      <MotionChild className="flex w-full justify-center">
        <FlowNodeBox kind="output" text={node.answer} caption={node.caption} />
      </MotionChild>
    );
  }
  const width = node.branches.length;
  // Static class map — Tailwind can't compile runtime-constructed classes.
  const branchCols =
    width >= 3 ? "sm:grid-cols-3" : width === 2 ? "sm:grid-cols-2" : "max-w-md";
  return (
    <div className="flex w-full flex-col items-center">
      <MotionChild className="flex w-full justify-center">
        <FlowNodeBox kind="decision" text={node.question} caption={node.caption} />
      </MotionChild>
      <MotionChild className="flex w-full justify-center py-1">
        <div className={`grid w-full gap-3 pt-1 ${branchCols}`}>
          {node.branches.map((branch, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="rounded-full border border-ash bg-surface-elevated px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink-soft">
                {branch.label}
              </span>
              <span aria-hidden="true" className="h-3 w-px bg-ink-faint/50" />
              <DecisionTreeNode node={branch.node} />
            </div>
          ))}
        </div>
      </MotionChild>
    </div>
  );
}
