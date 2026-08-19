import { CompareGrid, DecisionFlow, FlowChart } from "@/components/infographic/flow";
import type {
  CompareRow,
  CompareSide,
  DecisionNode,
  FlowStep,
} from "@/components/infographic/flow";
import type { LessonDiagram } from "@/content/courses";

/**
 * The standardized system diagram rendered BELOW a lesson's story infographic
 * (v5 contract). The infographic above tells the idea as a story; this is the
 * compact reference view — bracket node patterns, standardized formats, no
 * re-narration. Data lives on `lesson.diagram` in content/courses.ts.
 */

const DIAGRAM_LABELS: Record<LessonDiagram["kind"], string> = {
  flow: "Input → Process → Output",
  compare: "Side-by-side comparison",
  decision: "Decision tree",
};

export function LessonDiagram({ diagram }: { diagram: LessonDiagram }) {
  return (
    <section aria-label="System diagram" className="mt-6">
      <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-ink-faint">
        The same idea · {DIAGRAM_LABELS[diagram.kind]}
      </p>
      {diagram.kind === "flow" && (
        <FlowChart steps={diagram.steps as readonly FlowStep[]} loop={diagram.loop} />
      )}
      {diagram.kind === "compare" && (
        <CompareGrid
          left={diagram.left as CompareSide}
          right={diagram.right as CompareSide}
          rows={diagram.rows as readonly CompareRow[]}
        />
      )}
      {diagram.kind === "decision" && (
        <DecisionFlow root={diagram.root as DecisionNode} />
      )}
    </section>
  );
}
