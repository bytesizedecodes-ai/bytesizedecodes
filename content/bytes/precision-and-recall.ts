import type { Byte } from "../types";

const byte: Byte = {
  slug: "precision-and-recall",
  title: "Precision and recall",
  subtitle: "Why accuracy is the wrong number for almost every interview problem",
  topic: "evaluation",
  season: 1,
  order: 1,
  difficulty: 2,
  interviewTags: ["metrics", "imbalance", "precision", "recall"],
  skillIds: ["classification-metrics"],
  capability: "Choose precision or recall based on the cost of false alarms and misses.",
  minutes: 5,
  sections: [
    {
      paragraphs: [
        "Imagine a fraud detector that always predicts \"not fraud\". On a day when 1 in 1,000 transactions is fraudulent, that model is 99.9% accurate. It is also completely useless.",
        "Accuracy collapses under class imbalance because the majority class dominates the score. Precision and recall ask more useful questions.",
      ],
    },
    {
      heading: "Two different questions",
      paragraphs: [
        "**Precision** asks: of the cases I flagged, how many were actually positive? High precision means few false alarms.",
        "**Recall** asks: of the cases that really were positive, how many did I catch? High recall means few misses.",
        "You almost never get both for free. Raising the decision threshold raises precision and lowers recall; lowering it does the opposite. The right trade-off depends on the cost of a false alarm versus a miss.",
      ],
    },
    {
      heading: "The formulas",
      paragraphs: [
        "From a confusion matrix with true positives (TP), false positives (FP) and false negatives (FN):",
      ],
      code: {
        lang: "text",
        source: "precision = TP / (TP + FP)\nrecall    = TP / (TP + FN)\nF1        = 2 · P · R / (P + R)",
      },
    },
    {
      heading: "What interviewers want to hear",
      paragraphs: [
        "Name the cost asymmetry out loud. Fraud and disease screening usually care more about recall — missing a positive is expensive. Spam filters usually care more about precision — a false positive deletes a real email.",
        "If someone asks \"what's a good accuracy?\", the right answer is \"for this class balance and cost structure, accuracy is the wrong metric\". That sentence alone is worth the hire.",
      ],
    },
  ],
  questions: [
    {
      id: "q1",
      kind: "mcq",
      prompt:
        "A disease affects 1 in 1,000 people. A test always returns \"healthy\". What is its accuracy, and why is that number misleading?",
      choices: [
        { id: "a", label: "0% — it never detects disease, so it is useless and inaccurate" },
        { id: "b", label: "99.9% — but it has zero recall for the disease class" },
        { id: "c", label: "50% — it is wrong half the time on average" },
        { id: "d", label: "0.1% — matching the disease prevalence" },
      ],
      answer: "b",
      explanation:
        "On 999 healthy people and 1 sick person it is right 999 times, so accuracy is 99.9%. Recall for disease is 0 — it never catches the one case that matters.",
    },
    {
      id: "q2",
      kind: "mcq",
      prompt:
        "Your spam filter has precision 0.95 and recall 0.40. Product asks to catch more spam even if a few good emails get flagged. What do you change?",
      choices: [
        { id: "a", label: "Raise the decision threshold" },
        { id: "b", label: "Lower the decision threshold" },
        { id: "c", label: "Switch the loss to MSE" },
        { id: "d", label: "Nothing — precision and recall cannot be traded" },
      ],
      answer: "b",
      explanation:
        "Lowering the threshold flags more emails as spam. Recall rises because more true spam is caught; precision falls because more good emails are wrongly flagged. Exactly the trade they asked for.",
    },
    {
      id: "q3",
      kind: "mcq",
      prompt: "When is F1 a better summary than accuracy?",
      choices: [
        { id: "a", label: "Always — F1 is strictly more informative" },
        { id: "b", label: "When classes are balanced and costs are symmetric" },
        {
          id: "c",
          label: "When classes are imbalanced and you care about the positive class",
        },
        { id: "d", label: "Only for regression problems" },
      ],
      answer: "c",
      explanation:
        "F1 combines precision and recall for the positive class, so it ignores the true-negative flood that inflates accuracy under imbalance.",
    },
  ],
};

export default byte;
