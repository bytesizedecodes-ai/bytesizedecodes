import { buildChoices, type Candidate } from "../choices";
import { int, pick, rng, type Rng } from "../rng";
import type { Block, Difficulty, GeneratedQuestion, Generator } from "../types";

const TOPIC = "evaluation";
const TAGS = ["metrics", "precision", "recall", "imbalance"] as const;

interface Scenario {
  system: string;
  positive: string;
  negative: string;
}

const SCENARIOS: readonly Scenario[] = [
  { system: "a card-fraud detector", positive: "fraudulent", negative: "legitimate" },
  { system: "a diabetic-retinopathy screener", positive: "disease present", negative: "healthy" },
  { system: "a spam filter", positive: "spam", negative: "not spam" },
  { system: "a factory defect classifier", positive: "defective", negative: "fine" },
  { system: "a churn predictor", positive: "will churn", negative: "will stay" },
  { system: "a loan-default model", positive: "will default", negative: "will repay" },
];

type MetricName = "precision" | "recall" | "F1" | "accuracy" | "specificity";

const FORMULAS: Record<MetricName, string> = {
  precision: "TP / (TP + FP)",
  recall: "TP / (TP + FN)",
  F1: "2PR / (P + R)",
  accuracy: "(TP + TN) / total",
  specificity: "TN / (TN + FP)",
};

const fmt = (x: number): string => x.toFixed(3);

function build(r: Rng, difficulty: Difficulty): GeneratedQuestion {
  const scenario = pick(r, SCENARIOS);
  const tp = int(r, 20, 200);
  const fn = int(r, 10, 150);
  const fp = int(r, 20, 300);
  const tn = int(r, 2000, 20000);
  const total = tp + fn + fp + tn;

  const precision = tp / (tp + fp);
  const recall = tp / (tp + fn);
  const f1 = (2 * precision * recall) / (precision + recall);
  const accuracy = (tp + tn) / total;
  const specificity = tn / (tn + fp);

  const values: Record<MetricName, number> = { precision, recall, F1: f1, accuracy, specificity };

  const target: MetricName =
    difficulty === 1
      ? "accuracy"
      : difficulty === 2
        ? pick(r, ["precision", "recall"] as const)
        : difficulty === 3
          ? "F1"
          : pick(r, ["specificity", "precision"] as const);

  const candidates: Candidate[] = [];
  for (const name of ["precision", "recall", "F1", "accuracy", "specificity"] as MetricName[]) {
    if (name === target) continue;
    let extra = "";
    if (target === "precision" && name === "recall") {
      extra = " Precision divides by everything you *predicted* positive; recall divides by everything that *is* positive.";
    } else if (target === "recall" && name === "precision") {
      extra = " The two differ only in the denominator — FP for precision, FN for recall.";
    } else if (target === "specificity" && name === "recall") {
      extra = " Specificity is the negative class's recall.";
    } else if (name === "accuracy") {
      extra = ` With ${tn.toLocaleString("en-IN")} true negatives, accuracy is high almost regardless of the model.`;
    }
    candidates.push({
      label: fmt(values[name]),
      misconception: `That's ${name} — \`${FORMULAS[name]}\`, not ${target}.${extra}`,
    });
  }

  if (target === "F1") {
    candidates.push({
      label: fmt((precision + recall) / 2),
      misconception:
        "That's the *arithmetic* mean. F1 is the harmonic mean, which is pulled down hard when precision and recall are far apart.",
    });
  }
  candidates.push({
    label: fmt(tp / total),
    misconception: "You divided by the whole dataset. Only accuracy has `total` in the denominator.",
  });

  const correct = fmt(values[target]);
  const { choices, correctId } = buildChoices(r, correct, candidates);

  const prompt: readonly Block[] = [
    {
      kind: "text",
      text: `You evaluate ${scenario.system} on a held-out set of ${total.toLocaleString("en-IN")} cases. The positive class is **${scenario.positive}**.`,
    },
    {
      kind: "table",
      head: ["", `Predicted ${scenario.positive}`, `Predicted ${scenario.negative}`],
      rows: [
        [`Actually ${scenario.positive}`, String(tp), String(fn)],
        [`Actually ${scenario.negative}`, String(fp), String(tn)],
      ],
    },
    { kind: "text", text: `What is the **${target}**? Round to three decimals.` },
  ];

  const substitution: Record<MetricName, string> = {
    precision: `${tp} / (${tp} + ${fp}) = ${correct}`,
    recall: `${tp} / (${tp} + ${fn}) = ${correct}`,
    F1: `2 × ${fmt(precision)} × ${fmt(recall)} / (${fmt(precision)} + ${fmt(recall)}) = ${correct}`,
    accuracy: `(${tp} + ${tn}) / ${total} = ${correct}`,
    specificity: `${tn} / (${tn} + ${fp}) = ${correct}`,
  };

  const explanation: readonly Block[] = [
    { kind: "code", lang: "text", code: `${target} = ${FORMULAS[target]}` },
    { kind: "text", text: substitution[target] },
    {
      kind: "note",
      text: `Accuracy on this same matrix is ${fmt(accuracy)}. It looks excellent and tells you almost nothing — ${fn} ${scenario.positive} cases were missed entirely. That gap is why imbalanced problems are never reported with accuracy.`,
    },
  ];

  return {
    generatorId: "confusion-matrix",
    seed: 0,
    difficulty,
    topic: TOPIC,
    interviewTags: TAGS,
    prompt,
    answer: { kind: "mcq", choices, correctId },
    explanation,
    relatedBytes: ["precision-and-recall", "why-accuracy-lies"],
    estimatedSeconds: 60,
  };
}

function thresholdDirection(r: Rng, difficulty: Difficulty): GeneratedQuestion {
  const scenario = pick(r, SCENARIOS);
  const precision = int(r, 80, 95) / 100;
  const recall = int(r, 25, 50) / 100;

  const correct = "Lower the threshold — recall rises, precision falls";
  const candidates: Candidate[] = [
    {
      label: "Raise the threshold — recall rises, precision falls",
      misconception:
        "Direction reversed. Raising the bar means predicting positive less often, which can only reduce recall.",
    },
    {
      label: "Raise the threshold — precision rises, recall falls",
      misconception:
        "That trade is real, but it's the wrong one for this goal — it catches even fewer cases.",
    },
    {
      label: "Lower the threshold — both precision and recall rise",
      misconception:
        "There is no free lunch on a fixed model. Moving the threshold trades one against the other; only a better model lifts both.",
    },
    {
      label: "Retrain with a different loss — the threshold has no effect on either",
      misconception:
        "The threshold directly determines the confusion matrix. You can change both metrics without touching the model.",
    },
  ];

  const { choices, correctId } = buildChoices(r, correct, candidates);

  const prompt: readonly Block[] = [
    {
      kind: "text",
      text: `${scenario.system.charAt(0).toUpperCase() + scenario.system.slice(1)} currently scores **precision ${fmt(precision)}** and **recall ${fmt(recall)}** at its default decision threshold of 0.5.`,
    },
    {
      kind: "text",
      text: `The risk team says too many ${scenario.positive} cases are slipping through, and they are willing to review more flagged cases manually. What do you do?`,
    },
  ];

  const explanation: readonly Block[] = [
    {
      kind: "text",
      text: "They are asking for higher recall and accepting lower precision. Lowering the threshold flags more cases, so more true positives are caught (recall up) but a larger share of flags are wrong (precision down).",
    },
    {
      kind: "note",
      text: "Nothing about the model changed — the same predicted scores produce a different confusion matrix. This is why a single accuracy number can never describe a classifier.",
    },
  ];

  return {
    generatorId: "confusion-matrix",
    seed: 0,
    difficulty,
    topic: TOPIC,
    interviewTags: TAGS,
    prompt,
    answer: { kind: "mcq", choices, correctId },
    explanation,
    relatedBytes: ["precision-and-recall"],
    estimatedSeconds: 45,
  };
}

export const confusionMatrix: Generator = {
  id: "confusion-matrix",
  title: "Confusion matrix metrics",
  blurb: "Precision, recall, F1 and why accuracy lies on imbalanced data.",
  topic: TOPIC,
  supportedDifficulties: [1, 2, 3, 4, 5],

  generate(seed: number, difficulty: Difficulty): GeneratedQuestion {
    const r = rng(seed);
    int(r, 0, 7);
    const q = difficulty === 5 ? thresholdDirection(r, difficulty) : build(r, difficulty);
    return { ...q, seed };
  },
};
