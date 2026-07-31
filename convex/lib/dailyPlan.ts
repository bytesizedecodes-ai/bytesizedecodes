export type PlanTrack = "grad" | "beginner" | "engineer" | "founder";
export type PlanTimeMode = "quick" | "standard" | "deep";

export interface PlanUnit {
  progressKey: string;
  title: string;
  href: string;
  minutes: number;
}

export type DailyPlanStep =
  | {
      kind: "review";
      label: string;
      detail: string;
      href: string;
      minutes: number;
      count: number;
    }
  | {
      kind: "drill";
      label: string;
      detail: string;
      href: string;
      minutes: number;
      generatorId: string;
      difficulty: 1 | 2 | 3 | 4 | 5;
    }
  | {
      kind: "unit";
      label: string;
      detail: string;
      href: string;
      minutes: number;
      progressKey: string;
    };

export interface DailyPlan {
  timeMode: PlanTimeMode;
  estimatedMinutes: number;
  focus: string;
  steps: DailyPlanStep[];
}

const TRACK_UNITS: Record<PlanTrack, readonly PlanUnit[]> = {
  beginner: [
    unit("machine-learning-for-layman", "how-humans-learn", "How a human learns", 3),
    unit("machine-learning-for-layman", "humans-vs-machines", "Humans and machines", 3),
    unit("machine-learning-for-layman", "what-is-ml-layman", "What machine learning really is", 4),
    unit("machine-learning-for-layman", "three-ml-paradigms", "The three families of ML", 4),
    unit("machine-learning-for-layman", "supervised-learning-deep-dive", "Inside supervised learning", 5),
    unit("machine-learning", "ai-vs-ml-vs-dl", "AI vs ML vs deep learning", 4),
  ],
  grad: [
    unit("machine-learning", "what-is-artificial-intelligence", "What is artificial intelligence?", 4),
    unit("machine-learning", "what-is-machine-learning", "What is machine learning?", 5),
    unit("machine-learning", "what-is-deep-learning", "What is deep learning?", 5),
    unit("machine-learning", "ai-vs-ml-vs-dl", "AI vs ML vs deep learning", 4),
    byte("precision-and-recall", "Precision and recall", 5),
    byte("gradient-descent", "What gradient descent actually does", 5),
    byte("tensors-and-shapes", "Tensors and shapes", 5),
  ],
  engineer: [
    unit("machine-learning", "ai-vs-ml-vs-dl", "AI vs ML vs deep learning", 4),
    byte("precision-and-recall", "Precision and recall", 5),
    byte("gradient-descent", "What gradient descent actually does", 5),
    byte("tensors-and-shapes", "Tensors and shapes", 5),
  ],
  founder: [
    unit("machine-learning-for-layman", "humans-vs-machines", "Humans and machines", 3),
    unit("machine-learning-for-layman", "what-is-ml-layman", "What machine learning really is", 4),
    unit("machine-learning", "ai-vs-ml-vs-dl", "AI vs ML vs deep learning", 4),
    byte("precision-and-recall", "Precision and recall", 5),
  ],
};

const TOPIC_DRILLS: Record<
  string,
  { generatorId: string; label: string; difficulty: 1 | 2 | 3 | 4 | 5 }
> = {
  evaluation: {
    generatorId: "confusion-matrix",
    label: "Strengthen classification metrics",
    difficulty: 2,
  },
  optimisation: {
    generatorId: "gradient-step",
    label: "Strengthen gradient descent",
    difficulty: 2,
  },
  "deep-learning-fundamentals": {
    generatorId: "tensor-shape",
    label: "Strengthen tensor shapes",
    difficulty: 2,
  },
  "deep-learning": {
    generatorId: "head-and-loss",
    label: "Strengthen output heads and losses",
    difficulty: 2,
  },
};

export function nextUnitForTrack(
  track: PlanTrack,
  progress: Record<string, "started" | "completed">,
): PlanUnit | null {
  const units = TRACK_UNITS[track];
  return (
    units.find((item) => progress[item.progressKey] === "started") ??
    units.find((item) => progress[item.progressKey] !== "completed") ??
    null
  );
}

export function assembleDailyPlan(input: {
  track: PlanTrack;
  timeMode: PlanTimeMode;
  dueCount: number;
  weakTopic: string | null;
  nextUnit: PlanUnit | null;
}): DailyPlan {
  const steps: DailyPlanStep[] = [];
  const dueCount = Math.max(0, Math.floor(input.dueCount));

  if (dueCount > 0) {
    const count = input.timeMode === "quick" ? Math.min(2, dueCount) : Math.min(5, dueCount);
    steps.push({
      kind: "review",
      label: `Review ${count} ${count === 1 ? "idea" : "ideas"}`,
      detail: "Recall before the memory fades",
      href: "/review",
      minutes: input.timeMode === "quick" ? 3 : Math.min(5, count),
      count,
    });
  }

  const drill = input.weakTopic ? TOPIC_DRILLS[input.weakTopic] : undefined;
  if (input.timeMode !== "quick" && drill) {
    steps.push({
      kind: "drill",
      label: drill.label,
      detail: "One generated scenario with targeted feedback",
      href: `/practice?topic=${encodeURIComponent(input.weakTopic!)}`,
      minutes: input.timeMode === "deep" ? 5 : 3,
      generatorId: drill.generatorId,
      difficulty: drill.difficulty,
    });
  }

  if (input.nextUnit && (input.timeMode !== "quick" || steps.length === 0)) {
    steps.push({
      kind: "unit",
      label: input.nextUnit.title,
      detail: "Continue your recommended learning path",
      href: input.nextUnit.href,
      minutes: input.nextUnit.minutes,
      progressKey: input.nextUnit.progressKey,
    });
  }

  if (steps.length === 0) {
    const fallback = TOPIC_DRILLS.evaluation!;
    steps.push({
      kind: "drill",
      label: "Keep a core skill warm",
      detail: "One generated classification scenario",
      href: "/practice?topic=evaluation",
      minutes: 3,
      generatorId: fallback.generatorId,
      difficulty: fallback.difficulty,
    });
  }

  return {
    timeMode: input.timeMode,
    estimatedMinutes: steps.reduce((sum, step) => sum + step.minutes, 0),
    focus: focusFor(input, steps),
    steps,
  };
}

function focusFor(
  input: {
    dueCount: number;
    weakTopic: string | null;
    nextUnit: PlanUnit | null;
  },
  steps: DailyPlanStep[],
): string {
  if (input.dueCount > 0) return "Bring fading ideas back";
  if (input.nextUnit) return input.nextUnit.title;
  if (input.weakTopic) return `Strengthen ${input.weakTopic.replaceAll("-", " ")}`;
  return steps[0]?.label ?? "Keep learning";
}

function unit(course: string, lesson: string, title: string, minutes: number): PlanUnit {
  return {
    progressKey: `course:${course}:${lesson}`,
    title,
    href: `/courses/${course}/${lesson}`,
    minutes,
  };
}

function byte(slug: string, title: string, minutes: number): PlanUnit {
  return { progressKey: slug, title, href: `/bytes/${slug}`, minutes };
}
