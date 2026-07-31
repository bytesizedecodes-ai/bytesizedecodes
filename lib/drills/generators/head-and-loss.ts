import { buildChoices, type Candidate } from "../choices";
import { int, pick, rng, type Rng } from "../rng";
import type { Block, Difficulty, GeneratedQuestion, Generator } from "../types";

const TOPIC = "deep-learning";
const TAGS = ["loss-functions", "architecture", "pytorch"] as const;

interface Head {
  units: string;
  activation: string;
  loss: string;
}

interface Task {
  scenario: string;
  correct: Head;
  wrongs: readonly { head: Head; misconception: string }[];
  rationale: string;
  note: string;
}

const fmtHead = (h: Head, withUnits: boolean): string =>
  withUnits ? `${h.units} · ${h.activation} · ${h.loss}` : `${h.activation} · ${h.loss}`;

function binary(r: Rng): Task {
  const horizon = pick(r, ["in the next 7 days", "in the next 30 days", "this quarter"]);
  const scenario = pick(r, [
    "You are building a model that flags whether a UPI transaction is fraudulent.",
    "You are building a model that decides whether an incoming email is spam.",
    `You are building a model that predicts whether a customer will cancel their subscription ${horizon}.`,
    `You are building a model that predicts whether a delivery will be late ${horizon === "this quarter" ? "today" : horizon}.`,
    "You are building a model that decides whether a scanned cheque signature matches the one on file.",
    "You are building a model that predicts whether a loan applicant will default.",
    "You are building a model that flags whether a product review was written by a bot.",
    "You are building a model that decides whether an X-ray shows a fracture.",
  ]);
  return {
    scenario,
    correct: { units: "1 unit", activation: "sigmoid", loss: "binary cross-entropy" },
    wrongs: [
      {
        head: { units: "1 unit", activation: "softmax", loss: "cross-entropy" },
        misconception: "Softmax over a single unit always outputs exactly 1.0 — it normalises *across* units, and here there is only one.",
      },
      {
        head: { units: "1 unit", activation: "sigmoid", loss: "mean squared error" },
        misconception: "MSE on a classification head produces vanishing gradients precisely when the model is confidently wrong. Cross-entropy does not.",
      },
      {
        head: { units: "1 unit", activation: "no activation (linear)", loss: "binary cross-entropy" },
        misconception: "BCE expects a probability in (0,1). Feeding it a raw logit requires `BCEWithLogitsLoss`, which applies the sigmoid internally.",
      },
      {
        head: { units: "1 unit", activation: "tanh", loss: "mean squared error" },
        misconception: "tanh spans (-1, 1), so its output cannot be read as a probability.",
      },
    ],
    rationale: "A single yes/no outcome needs one probability, and sigmoid maps a logit to (0,1). Binary cross-entropy is the matching likelihood.",
    note: "In PyTorch, prefer `BCEWithLogitsLoss` on the raw logit over `Sigmoid` followed by `BCELoss` — it is numerically stabler.",
  };
}

function multiclass(r: Rng): Task {
  const k = pick(r, [3, 4, 5, 8, 10, 12]);
  const scenario = pick(r, [
    `You are classifying a photo of a leaf into exactly one of ${k} crop diseases.`,
    `You are routing a support ticket into exactly one of ${k} departments.`,
    `You are identifying which one of ${k} spoken languages an audio clip contains.`,
    `You are predicting which one of ${k} delivery slots a customer will choose.`,
    `You are grading an essay into exactly one of ${k} score bands.`,
    `You are classifying a handwritten Devanagari character as one of ${k} letters.`,
    `You are predicting which one of ${k} payment methods a user will pick at checkout.`,
  ]);
  return {
    scenario,
    correct: { units: `${k} units`, activation: "softmax", loss: "cross-entropy" },
    wrongs: [
      {
        head: { units: `${k} units`, activation: "sigmoid", loss: "binary cross-entropy" },
        misconception: "That is the multilabel head. When the classes are mutually exclusive you want the outputs to compete, which is exactly what softmax does.",
      },
      {
        head: { units: "1 unit", activation: "no activation (linear)", loss: "mean squared error" },
        misconception: "Regressing on the class index implies the classes are ordered and evenly spaced. They are not.",
      },
      {
        head: { units: `${k} units`, activation: "softmax", loss: "mean squared error" },
        misconception: "The activation is right but MSE discards the probabilistic structure; cross-entropy is the likelihood that pairs with softmax.",
      },
      {
        head: { units: "1 unit", activation: "sigmoid", loss: "binary cross-entropy" },
        misconception: `One output unit can only separate two classes, not ${k}.`,
      },
    ],
    rationale: `Exactly one of ${k} classes is correct, so the ${k} outputs should form a probability distribution — softmax normalises them to sum to 1, and cross-entropy scores the true class's probability.`,
    note: "`nn.CrossEntropyLoss` already applies log-softmax internally, so adding a softmax layer before it is a real and common bug.",
  };
}

function multilabel(r: Rng, adversarial: boolean): Task {
  const k = pick(r, adversarial ? [12, 14, 20, 25, 37] : [5, 8, 10, 12, 15]);
  const scenario = adversarial
    ? pick(r, [
        `A chest X-ray may show any combination of ${k} radiological findings — including none at all. You are predicting which are present.`,
        `A news article can belong to several of ${k} topics at once, or to none of them. You are predicting its topics.`,
        `A restaurant is described by any subset of ${k} cuisine tags, and some have none. You are predicting the tags.`,
        `A code change can touch any combination of ${k} subsystems. You are predicting which it touches.`,
        `A song may carry any number of ${k} mood labels, including zero. You are predicting them.`,
        `A patient record may list any combination of ${k} chronic conditions. You are predicting which apply.`,
      ])
    : pick(r, [
        `You are tagging which of ${k} objects appear in a photo. A photo often contains several.`,
        `You are predicting which of ${k} skills a job posting requires. Most postings list more than one.`,
        `You are predicting which of ${k} allergens a packaged food contains. Many contain several.`,
        `You are predicting which of ${k} genres a film belongs to. Films routinely span two or three.`,
        `You are predicting which of ${k} accessibility issues a web page has. Pages usually have more than one.`,
        `You are predicting which of ${k} product categories a search query relates to. Queries are often ambiguous across several.`,
      ]);

  return {
    scenario,
    correct: { units: `${k} units`, activation: "sigmoid", loss: "binary cross-entropy per label" },
    wrongs: [
      {
        head: { units: `${k} units`, activation: "softmax", loss: "cross-entropy" },
        misconception: `Softmax forces the ${k} outputs to sum to 1, so the model can never confidently predict two labels at once. The labels here are not mutually exclusive.`,
      },
      {
        head: { units: "1 unit", activation: "sigmoid", loss: "binary cross-entropy" },
        misconception: `A single unit cannot express *which* of the ${k} tags are present.`,
      },
      {
        head: { units: `${k} units`, activation: "softmax", loss: "binary cross-entropy per label" },
        misconception: "Mismatched: softmax couples the outputs while per-label BCE assumes they are independent.",
      },
      {
        head: { units: `${k} units`, activation: "no activation (linear)", loss: "mean squared error" },
        misconception: "Loses the probability interpretation and trains poorly on classification targets.",
      },
    ],
    rationale: `Each of the ${k} labels is an independent yes/no question, so each gets its own sigmoid and its own binary cross-entropy term. Nothing forces them to sum to anything.`,
    note: "The tell is the phrase \"any combination\" or \"one or more\". Multiclass means exactly one; multilabel means any number, including zero.",
  };
}

function regression(r: Rng): Task {
  const horizon = pick(r, ["tomorrow", "next week", "in seven days"]);
  const scenario = pick(r, [
    `You are predicting ${horizon}'s minimum temperature in °C for a Himalayan town, which is often below zero.`,
    `You are predicting the day-over-day change in a stock's closing price ${horizon}, which can be negative.`,
    "You are predicting how many minutes early or late a train will arrive — early is a negative number.",
    `You are predicting the net change in a warehouse's stock level ${horizon}; it can rise or fall.`,
    "You are predicting a city's air-quality deviation from its seasonal average, which is signed.",
    "You are predicting the profit or loss on a trade in ₹, where losses are negative.",
    `You are predicting the temperature anomaly for a district ${horizon} relative to its 30-year mean.`,
  ]);
  return {
    scenario,
    correct: { units: "1 unit", activation: "no activation (linear)", loss: "mean squared error" },
    wrongs: [
      {
        head: { units: "1 unit", activation: "sigmoid", loss: "mean squared error" },
        misconception: "Sigmoid caps the output to (0, 1), so the model could never produce a valid value for this target.",
      },
      {
        head: { units: "1 unit", activation: "relu", loss: "mean squared error" },
        misconception: "ReLU cannot output negative numbers, and this target can be negative.",
      },
      {
        head: { units: "1 unit", activation: "softmax", loss: "cross-entropy" },
        misconception: "That is a classification head applied to a continuous target.",
      },
      {
        head: { units: "10 units", activation: "softmax", loss: "cross-entropy" },
        misconception: "Bucketing a continuous target into classes throws away ordering and precision.",
      },
    ],
    rationale: "An unbounded real-valued target needs an unbounded output, so the final layer is linear. Squared error is the standard loss.",
    note: "Use MAE instead of MSE when the target has outliers you don't want dominating the gradient.",
  };
}

function bounded(r: Rng): Task {
  const unit = pick(r, ["a value between 0 and 1", "a proportion in [0, 1]", "a fraction from 0 to 1"]);
  const scenario = pick(r, [
    `You are predicting what fraction of a video a user will watch — ${unit}.`,
    `You are predicting the proportion of a form a user completes before abandoning it — ${unit}.`,
    `You are predicting the share of a delivery route already covered — ${unit}.`,
    `You are predicting the fraction of a course a student will finish — ${unit}.`,
    `You are predicting the proportion of a battery's charge remaining — ${unit}.`,
    `You are predicting what share of a monthly budget a household will spend on food — ${unit}.`,
    `You are predicting the fraction of seats on a flight that will be occupied — ${unit}.`,
  ]);
  return {
    scenario,
    correct: { units: "1 unit", activation: "sigmoid", loss: "mean squared error" },
    wrongs: [
      {
        head: { units: "1 unit", activation: "no activation (linear)", loss: "mean squared error" },
        misconception: "Nothing stops a linear head predicting 1.4 or −0.2, which are impossible fractions.",
      },
      {
        head: { units: "1 unit", activation: "softmax", loss: "cross-entropy" },
        misconception: "A single-unit softmax always outputs 1.0.",
      },
      {
        head: { units: "1 unit", activation: "relu", loss: "mean squared error" },
        misconception: "ReLU bounds the output below at 0 but not above at 1.",
      },
      {
        head: { units: "1 unit", activation: "tanh", loss: "mean squared error" },
        misconception: "tanh spans (−1, 1), so half of its range is invalid for this target.",
      },
    ],
    rationale: "The target is a continuous value confined to [0, 1], so sigmoid is the natural squashing function while the loss stays a regression loss.",
    note: "This is a regression problem that happens to use a sigmoid — the activation is chosen by the target's *range*, the loss by its *type*.",
  };
}

function count(r: Rng): Task {
  const window = pick(r, ["in the next 6 hours", "tomorrow", "over the next 24 hours", "this week"]);
  const scenario = pick(r, [
    `You are predicting how many support tickets will arrive ${window}.`,
    "You are predicting how many items a customer will add to their cart this session.",
    `You are predicting how many machines on a factory floor will fail ${window}.`,
    `You are predicting how many rides a driver will complete ${window}.`,
    `You are predicting how many times a user will open the app ${window}.`,
    `You are predicting how many potholes a road-survey vehicle will detect ${window}.`,
  ]);
  return {
    scenario,
    correct: { units: "1 unit", activation: "exp (or softplus)", loss: "Poisson negative log-likelihood" },
    wrongs: [
      {
        head: { units: "1 unit", activation: "no activation (linear)", loss: "mean squared error" },
        misconception: "Permits negative counts, and assumes constant variance — but for count data the variance grows with the mean.",
      },
      {
        head: { units: "1 unit", activation: "sigmoid", loss: "binary cross-entropy" },
        misconception: "That models a binary outcome, not how many events occur.",
      },
      {
        head: { units: "20 units", activation: "softmax", loss: "cross-entropy" },
        misconception: "Treating each possible count as an unordered class discards the ordering, and caps the prediction at 19.",
      },
      {
        head: { units: "1 unit", activation: "relu", loss: "mean squared error" },
        misconception: "ReLU keeps the output non-negative but MSE still assumes constant variance, and dead units cannot recover.",
      },
    ],
    rationale: "Counts are non-negative integers whose variance scales with their mean. An exponential link keeps the rate positive and the Poisson likelihood models the variance correctly.",
    note: "If the observed variance far exceeds the mean, the data is overdispersed and a negative-binomial likelihood fits better than Poisson.",
  };
}

export const headAndLoss: Generator = {
  id: "head-and-loss",
  title: "Output layer and loss",
  blurb: "Match the task to its final activation and loss function.",
  topic: TOPIC,
  supportedDifficulties: [1, 2, 3, 4, 5],

  generate(seed: number, difficulty: Difficulty): GeneratedQuestion {
    const r = rng(seed);
    int(r, 0, 7);

    const task =
      difficulty === 1
        ? pick(r, [binary, regression])(r)
        : difficulty === 2
          ? multiclass(r)
          : difficulty === 3
            ? pick(r, [() => multilabel(r, false), () => bounded(r)])()
            : difficulty === 4
              ? pick(r, [() => count(r), () => bounded(r)])()
              : multilabel(r, true);

    const withUnits = difficulty >= 3;
    const correctLabel = fmtHead(task.correct, withUnits);
    const candidates: Candidate[] = task.wrongs.map((w) => ({
      label: fmtHead(w.head, withUnits),
      misconception: w.misconception,
    }));

    const { choices, correctId } = buildChoices(r, correctLabel, candidates);

    const prompt: readonly Block[] = [
      { kind: "text", text: task.scenario },
      {
        kind: "text",
        text: withUnits
          ? "What should the final layer be — how many units, which activation, and which loss?"
          : "Which final activation and loss function should you use?",
      },
    ];

    const explanation: readonly Block[] = [
      { kind: "text", text: task.rationale },
      { kind: "text", text: `Correct head: **${correctLabel}**` },
      { kind: "note", text: task.note },
    ];

    return {
      generatorId: "head-and-loss",
      seed,
      difficulty,
      topic: TOPIC,
      interviewTags: TAGS,
      prompt,
      answer: { kind: "mcq", choices, correctId },
      explanation,
      relatedBytes: ["loss-functions", "classification-vs-regression"],
      estimatedSeconds: 40,
    };
  },
};
