/**
 * v5 asset — the standardized flow primitives, and the two ways to use them.
 *
 * The canonical implementation lives in the repo at
 * `components/infographic/flow.tsx` (FlowChart, CompareGrid, DecisionFlow,
 * FlowNodeBox). Do not copy this file into the repo — import from there.
 * This asset documents usage for lesson authors.
 *
 * ── Path 1 (canonical): data-driven diagram below the infographic ──────────
 *
 * Add a `diagram` field to the lesson in content/courses/. The lesson page
 * renders it via components/LessonDiagram.tsx below the story infographic.
 * No component work at all.
 *
 *   diagram: {
 *     kind: "flow",
 *     steps: [
 *       { kind: "input",   text: "Labelled samples", caption: "photo + ‘car’" },
 *       { kind: "process", text: "Learning algorithm" },
 *       { kind: "output",  text: "Prediction on a new case" },
 *     ],
 *     loop: "Strategy updates · repeat thousands of times", // optional
 *   },
 *
 *   diagram: {
 *     kind: "compare",
 *     left:  { title: "Memorizing", subtitle: "learned every quirk" },
 *     right: { title: "Understanding", subtitle: "learned the pattern" },
 *     rows: [
 *       { label: "Where to use",    left: "…", right: "…" },
 *       { label: "When NOT to use", left: "…", right: "…" },
 *     ],
 *   },
 *
 *   diagram: {
 *     kind: "decision",
 *     root: {
 *       kind: "decision",
 *       question: "Are the examples labelled with answers?",
 *       branches: [
 *         { label: "Yes", node: { kind: "leaf", answer: "Supervised" } },
 *         { label: "No",  node: { kind: "decision", question: "…", branches: [ /* … */ ] } },
 *       ],
 *     },
 *   },
 *
 * ── Path 2 (rare): embed a standardized diagram inside a bespoke infographic ─
 *
 * Only when a lesson infographic itself needs one standardized sub-diagram.
 * Import the primitives directly; the chrome ([ … ] / < … ]) is automatic.
 *
 *   import { Infographic, InfographicHeader, Takeaway } from "./primitives";
 *   import { FlowChart } from "./flow";
 *
 *   export function MyLesson() {
 *     return (
 *       <Infographic>
 *         <InfographicHeader title="…" subtitle="…" />
 *         <FlowChart
 *           steps={[
 *             { kind: "input", text: "Raw input data" },
 *             { kind: "process", text: "Core algorithm", caption: "one short, definitional line" },
 *             { kind: "output", text: "Prediction / value delivered" },
 *           ]}
 *         />
 *         <Takeaway>One-sentence aha.</Takeaway>
 *       </Infographic>
 *     );
 *   }
 *
 * Rules (SKILL.md §4.5):
 *  - Node text ≤ 6 words; at most one terse, definitional caption per node.
 *  - Never re-narrate the story layer — the diagram formalizes, not retells.
 *  - Theme-safe tokens only; motion comes from the shared system
 *    (Stagger/Reveal inside flow.tsx) — do not hand-animate the diagram.
 */
export {};
