import { int, pick, rng, type Rng } from "../rng";
import type { Block, Difficulty, GeneratedQuestion, Generator } from "../types";

const TOPIC = "optimisation";
const TAGS = ["gradients", "learning-rate", "backprop"] as const;
const LRS = [0.01, 0.05, 0.1, 0.5] as const;

const num = (x: number): string => {
  const s = x.toFixed(3);
  return s.replace(/\.?0+$/, "") || "0";
};

interface Built {
  prompt: readonly Block[];
  value: number;
  explanation: readonly Block[];
  tolerance: number;
  seconds: number;
}

/** f(w) = (w - t)^2 — one parameter, no data. */
function quadratic(r: Rng): Built {
  const t = int(r, -4, 4);
  let w0 = int(r, -30, 30) / 10;
  while (Math.abs(w0 - t) < 0.3) w0 = int(r, -30, 30) / 10;
  const lr = pick(r, LRS);

  const grad = 2 * (w0 - t);
  const w1 = w0 - lr * grad;

  return {
    prompt: [
      { kind: "text", text: "You are minimising a one-parameter loss by gradient descent." },
      {
        kind: "code",
        lang: "text",
        code: `L(w) = (w - ${t})^2\nw = ${num(w0)}\nlearning rate = ${lr}`,
      },
      { kind: "text", text: "What is `w` after **one** gradient descent step? Round to three decimals." },
    ],
    value: w1,
    tolerance: 0.005,
    seconds: 45,
    explanation: [
      { kind: "code", lang: "text", code: `dL/dw = 2(w - ${t}) = 2(${num(w0)} - ${t}) = ${num(grad)}` },
      { kind: "code", lang: "text", code: `w ← w - lr · dL/dw = ${num(w0)} - ${lr}·${num(grad)} = ${w1.toFixed(3)}` },
      {
        kind: "note",
        text: `Note the sign: descent *subtracts* the gradient, which is why w moves ${w1 > w0 ? "up" : "down"} toward ${t}.`,
      },
    ],
  };
}

/** Single-sample linear regression with squared error. */
function linearRegression(r: Rng, updateBias: boolean): Built {
  const x = int(r, 1, 5);
  const y = int(r, -4, 8);
  const lr = pick(r, LRS);

  let w0 = int(r, -30, 30) / 10;
  let b0 = int(r, -20, 20) / 10;
  let yhat = w0 * x + b0;
  for (let attempt = 0; attempt < 30 && Math.abs(yhat - y) < 0.2; attempt++) {
    w0 = int(r, -30, 30) / 10;
    b0 = int(r, -20, 20) / 10;
    yhat = w0 * x + b0;
  }

  const err = yhat - y;
  const grad = updateBias ? 2 * err : 2 * err * x;
  const updated = (updateBias ? b0 : w0) - lr * grad;
  const paramName = updateBias ? "b" : "w";

  return {
    prompt: [
      { kind: "text", text: "A linear model is trained on a single example with squared-error loss." },
      {
        kind: "code",
        lang: "text",
        code: `y_hat = w·x + b        L = (y_hat - y)^2\n\nw = ${num(w0)}   b = ${num(b0)}\nx = ${x}   y = ${y}\nlearning rate = ${lr}`,
      },
      {
        kind: "text",
        text: `What is \`${paramName}\` after **one** gradient descent step? Round to three decimals.`,
      },
    ],
    value: updated,
    tolerance: 0.005,
    seconds: 70,
    explanation: [
      { kind: "code", lang: "text", code: `y_hat = ${num(w0)}·${x} + ${num(b0)} = ${num(yhat)}\nerror = y_hat - y = ${num(yhat)} - ${y} = ${num(err)}` },
      {
        kind: "code",
        lang: "text",
        code: updateBias
          ? `dL/db = 2·error = 2·${num(err)} = ${num(grad)}`
          : `dL/dw = 2·error·x = 2·${num(err)}·${x} = ${num(grad)}`,
      },
      {
        kind: "code",
        lang: "text",
        code: `${paramName} ← ${paramName} - lr · grad = ${num(updateBias ? b0 : w0)} - ${lr}·${num(grad)} = ${updated.toFixed(3)}`,
      },
      {
        kind: "note",
        text: updateBias
          ? "The bias gradient has no `x` factor — shifting the intercept affects every prediction equally."
          : "The `x` factor is what makes large-magnitude features dominate the update, and it is the reason features are scaled before training.",
      },
    ],
  };
}

/** Two sequential steps — tests whether the learner re-evaluates the gradient. */
function twoSteps(r: Rng): Built {
  let x = 0;
  let y = 0;
  let lr: number = 0.01;
  let w0 = 0;
  const b0 = 0;
  let w1 = 0;
  let w2 = 0;

  for (let attempt = 0; attempt < 60; attempt++) {
    x = int(r, 1, 3);
    y = int(r, -3, 6);
    lr = pick(r, [0.01, 0.05] as const);
    w0 = int(r, -30, 30) / 10;
    const e1 = w0 * x + b0 - y;
    if (Math.abs(e1) < 0.2) continue;
    w1 = w0 - lr * 2 * e1 * x;
    const e2 = w1 * x + b0 - y;
    w2 = w1 - lr * 2 * e2 * x;
    if (Math.abs(w2) <= 20) break;
  }

  const e1 = w0 * x + b0 - y;
  const e2 = w1 * x + b0 - y;

  return {
    prompt: [
      { kind: "text", text: "A linear model with bias fixed at 0 is trained on one example." },
      {
        kind: "code",
        lang: "text",
        code: `y_hat = w·x        L = (y_hat - y)^2\n\nw = ${num(w0)}\nx = ${x}   y = ${y}\nlearning rate = ${lr}`,
      },
      { kind: "text", text: "What is `w` after **two** gradient descent steps? Round to three decimals." },
    ],
    value: w2,
    tolerance: 0.005,
    seconds: 100,
    explanation: [
      {
        kind: "code",
        lang: "text",
        code: `step 1: error = ${num(w0)}·${x} - ${y} = ${num(e1)}\n        grad  = 2·${num(e1)}·${x} = ${num(2 * e1 * x)}\n        w     = ${num(w0)} - ${lr}·${num(2 * e1 * x)} = ${num(w1)}`,
      },
      {
        kind: "code",
        lang: "text",
        code: `step 2: error = ${num(w1)}·${x} - ${y} = ${num(e2)}\n        grad  = 2·${num(e2)}·${x} = ${num(2 * e2 * x)}\n        w     = ${num(w1)} - ${lr}·${num(2 * e2 * x)} = ${w2.toFixed(3)}`,
      },
      {
        kind: "note",
        text: "The gradient must be recomputed at the new weight. Applying the first gradient twice is the standard mistake here.",
      },
    ],
  };
}

/** Logistic regression — the gradient simplifies to (p - y)x. */
function logistic(r: Rng): Built {
  const x = int(r, 1, 4);
  const y = pick(r, [0, 1] as const);
  const lr = pick(r, [0.1, 0.5] as const);
  const w0 = int(r, -20, 20) / 10;
  const b0 = int(r, -10, 10) / 10;

  const z = w0 * x + b0;
  const p = 1 / (1 + Math.exp(-z));
  const grad = (p - y) * x;
  const w1 = w0 - lr * grad;

  return {
    prompt: [
      { kind: "text", text: "A logistic regression is trained on one example with binary cross-entropy loss." },
      {
        kind: "code",
        lang: "text",
        code: `z = w·x + b        p = sigmoid(z)\nL = -[y·log p + (1-y)·log(1-p)]\n\nw = ${num(w0)}   b = ${num(b0)}\nx = ${x}   y = ${y}\nlearning rate = ${lr}`,
      },
      { kind: "text", text: "What is `w` after **one** gradient descent step? Round to three decimals." },
    ],
    value: w1,
    tolerance: 0.008,
    seconds: 120,
    explanation: [
      { kind: "code", lang: "text", code: `z = ${num(w0)}·${x} + ${num(b0)} = ${num(z)}\np = sigmoid(${num(z)}) = ${p.toFixed(4)}` },
      { kind: "code", lang: "text", code: `dL/dw = (p - y)·x = (${p.toFixed(4)} - ${y})·${x} = ${num(grad)}` },
      { kind: "code", lang: "text", code: `w ← ${num(w0)} - ${lr}·${num(grad)} = ${w1.toFixed(3)}` },
      {
        kind: "note",
        text: "The sigmoid and the log in the loss cancel, leaving `(p - y)x` — the same shape as the linear-regression gradient without the factor of 2. That cancellation is the reason cross-entropy is paired with sigmoid rather than MSE.",
      },
    ],
  };
}

export const gradientStep: Generator = {
  id: "gradient-step",
  title: "One gradient descent step",
  blurb: "Compute the update by hand — signs, factors of two, and the x term.",
  topic: TOPIC,
  supportedDifficulties: [1, 2, 3, 4, 5],

  generate(seed: number, difficulty: Difficulty): GeneratedQuestion {
    const r = rng(seed);
    int(r, 0, 7);

    const built =
      difficulty === 1
        ? quadratic(r)
        : difficulty === 2
          ? linearRegression(r, false)
          : difficulty === 3
            ? linearRegression(r, true)
            : difficulty === 4
              ? twoSteps(r)
              : logistic(r);

    return {
      generatorId: "gradient-step",
      seed,
      difficulty,
      topic: TOPIC,
      interviewTags: TAGS,
      prompt: built.prompt,
      answer: {
        kind: "numeric",
        value: Number(built.value.toFixed(3)),
        tolerance: built.tolerance,
        decimals: 3,
      },
      explanation: built.explanation,
      relatedBytes: ["gradient-descent"],
      estimatedSeconds: built.seconds,
    };
  },
};
