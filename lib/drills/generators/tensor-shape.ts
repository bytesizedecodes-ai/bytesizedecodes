import { buildChoices, type Candidate } from "../choices";
import { int, pick, rng, type Rng } from "../rng";
import type { Block, Difficulty, GeneratedQuestion, Generator } from "../types";

const TOPIC = "deep-learning-fundamentals";
const TAGS = ["shapes", "cnn", "pytorch"] as const;

function convOut(size: number, k: number, s: number, p: number, d: number): number {
  return Math.floor((size + 2 * p - d * (k - 1) - 1) / s) + 1;
}

const shape = (dims: readonly number[]): string => `(${dims.join(", ")})`;

function matmul(r: Rng, difficulty: Difficulty): GeneratedQuestion {
  const dims = [8, 10, 16, 32, 64, 128, 256];
  let m = pick(r, dims);
  let k = pick(r, dims);
  let n = pick(r, dims);
  // Distinct dims keep every distractor meaningful.
  while (k === m) k = pick(r, dims);
  while (n === m || n === k) n = pick(r, dims);

  const correct = shape([m, n]);
  const candidates: Candidate[] = [
    { label: shape([k, n]), misconception: "You took A's inner dimension. The result keeps A's *rows*, not its columns." },
    { label: shape([m, k]), misconception: "That's A's shape unchanged — the matmul replaces the last dimension with B's last dimension." },
    { label: shape([n, m]), misconception: "That's the transpose. `A @ B` is (rows of A, cols of B), in that order." },
    { label: shape([m, k, n]), misconception: "Matmul contracts the shared dimension away rather than keeping all three." },
  ];

  const { choices, correctId } = buildChoices(r, correct, candidates);

  const prompt: readonly Block[] = [
    { kind: "text", text: "What is the shape of `C`?" },
    {
      kind: "code",
      lang: "python",
      code: `import torch\n\nA = torch.randn(${m}, ${k})\nB = torch.randn(${k}, ${n})\nC = A @ B`,
    },
  ];

  const explanation: readonly Block[] = [
    {
      kind: "text",
      text: `Matrix multiply contracts the shared dimension. \`(${m}, ${k}) @ (${k}, ${n})\` cancels the ${k} and leaves **${correct}**.`,
    },
    { kind: "note", text: "The rule generalises: the last dimension of the left operand must match the second-to-last of the right, and it disappears from the result." },
  ];

  return {
    generatorId: "tensor-shape",
    seed: 0,
    difficulty,
    topic: TOPIC,
    interviewTags: TAGS,
    prompt,
    answer: { kind: "mcq", choices, correctId },
    explanation,
    relatedBytes: ["tensors-and-shapes"],
    estimatedSeconds: 30,
  };
}

function pooling(r: Rng, difficulty: Difficulty): GeneratedQuestion {
  const n = pick(r, [1, 8, 32]);
  const c = pick(r, [3, 16, 32, 64]);
  const size = pick(r, [28, 32, 64, 128, 224]);
  const k = pick(r, [2, 4]);
  const out = Math.floor(size / k);

  const correct = shape([n, c, out, out]);
  const candidates: Candidate[] = [
    { label: shape([n, c, size, size]), misconception: "Pooling downsamples — it changes the spatial size, not just the values." },
    { label: shape([n, c, size - k + 1, size - k + 1]), misconception: "That's the stride-1 formula. `MaxPool2d(k)` defaults to `stride=k`, not 1." },
    { label: shape([n, 1, out, out]), misconception: "Pooling is applied per channel, so the channel count is unchanged." },
    { label: shape([n, c * k, out, out]), misconception: "Pooling never creates channels." },
    { label: shape([out, out]), misconception: "Batch and channel dimensions survive pooling." },
  ];

  const { choices, correctId } = buildChoices(r, correct, candidates);

  const prompt: readonly Block[] = [
    { kind: "text", text: "What is the shape of `y`?" },
    {
      kind: "code",
      lang: "python",
      code: `x = torch.randn(${n}, ${c}, ${size}, ${size})\npool = nn.MaxPool2d(kernel_size=${k})\ny = pool(x)`,
    },
  ];

  const explanation: readonly Block[] = [
    {
      kind: "text",
      text: `\`MaxPool2d\` defaults \`stride\` to \`kernel_size\`, so this halves${k === 4 ? "/quarters" : ""} each spatial dimension: ${size} ÷ ${k} = ${out}.`,
    },
    { kind: "text", text: `Batch (${n}) and channels (${c}) pass through untouched, giving **${correct}**.` },
  ];

  return {
    generatorId: "tensor-shape",
    seed: 0,
    difficulty,
    topic: TOPIC,
    interviewTags: TAGS,
    prompt,
    answer: { kind: "mcq", choices, correctId },
    explanation,
    relatedBytes: ["tensors-and-shapes"],
    estimatedSeconds: 40,
  };
}

function conv(r: Rng, difficulty: Difficulty): GeneratedQuestion {
  const withPadding = difficulty >= 4;
  const withDilation = difficulty === 5;

  let n = 0;
  let cIn = 0;
  let cOut = 0;
  let size = 0;
  let k = 0;
  let s = 0;
  let p = 0;
  let d = 1;
  let out = 0;

  // Resample until the configuration produces a sane spatial output.
  for (let attempt = 0; attempt < 40; attempt++) {
    n = pick(r, [1, 8, 32]);
    cIn = pick(r, [1, 3, 16, 32, 64]);
    cOut = pick(r, [16, 32, 64, 128]);
    while (cOut === cIn) cOut = pick(r, [16, 32, 64, 128]);
    size = pick(r, [28, 32, 64, 128, 224]);
    k = pick(r, [3, 5, 7]);
    s = pick(r, [1, 2]);
    p = withPadding ? pick(r, [1, 2, Math.floor(k / 2)]) : 0;
    d = withDilation ? 2 : 1;
    out = convOut(size, k, s, p, d);
    if (out >= 4 && out <= size) break;
  }

  const correct = shape([n, cOut, out, out]);
  const candidates: Candidate[] = [
    {
      label: shape([n, cOut, out - 1, out - 1]),
      misconception: "Off-by-one — the conv output formula ends with `+ 1`.",
    },
    {
      label: shape([n, cIn, out, out]),
      misconception: "Channels swapped. The output carries `out_channels`; `in_channels` only has to match the input.",
    },
    {
      label: shape([n, cOut, convOut(size, k, 1, p, d), convOut(size, k, 1, p, d)]),
      misconception: "Stride ignored — stride divides the output size.",
    },
    {
      label: shape([n, cOut, size, size]),
      misconception: "This convolution isn't shape-preserving; only `stride=1` with `padding=(k-1)/2` keeps the size.",
    },
  ];
  if (p > 0) {
    candidates.push({
      label: shape([n, cOut, convOut(size, k, s, 0, d), convOut(size, k, s, 0, d)]),
      misconception: "Padding forgotten — it adds `2p` to the effective input size.",
    });
  }
  if (d > 1) {
    candidates.push({
      label: shape([n, cOut, convOut(size, k, s, p, 1), convOut(size, k, s, p, 1)]),
      misconception: "Dilation ignored — it inflates the effective kernel to `d(k-1) + 1`.",
    });
  }

  const { choices, correctId } = buildChoices(r, correct, candidates);

  const args = [
    `${cIn}`,
    `${cOut}`,
    `kernel_size=${k}`,
    `stride=${s}`,
    ...(p > 0 ? [`padding=${p}`] : []),
    ...(d > 1 ? [`dilation=${d}`] : []),
  ].join(", ");

  const prompt: readonly Block[] = [
    { kind: "text", text: "What is the shape of `y`?" },
    {
      kind: "code",
      lang: "python",
      code: `x = torch.randn(${n}, ${cIn}, ${size}, ${size})\nconv = nn.Conv2d(${args})\ny = conv(x)`,
    },
  ];

  const effectiveK = d * (k - 1) + 1;
  const explanation: readonly Block[] = [
    { kind: "code", lang: "text", code: "out = floor((size + 2p - d(k-1) - 1) / s) + 1" },
    {
      kind: "text",
      text: `Substituting: \`floor((${size} + 2·${p} - ${d}·${k - 1} - 1) / ${s}) + 1 = ${out}\`.`,
    },
    ...(d > 1
      ? [
          {
            kind: "text" as const,
            text: `Dilation ${d} stretches the ${k}×${k} kernel to cover ${effectiveK}×${effectiveK} pixels without adding parameters.`,
          },
        ]
      : []),
    {
      kind: "text",
      text: `Batch stays ${n} and the channel dimension becomes \`out_channels\` = ${cOut}, so the answer is **${correct}**.`,
    },
  ];

  return {
    generatorId: "tensor-shape",
    seed: 0,
    difficulty,
    topic: TOPIC,
    interviewTags: TAGS,
    prompt,
    answer: { kind: "mcq", choices, correctId },
    explanation,
    relatedBytes: ["tensors-and-shapes"],
    estimatedSeconds: 60,
  };
}

export const tensorShape: Generator = {
  id: "tensor-shape",
  title: "Output shapes",
  blurb: "Matmuls, pooling and convolutions — the classic screening question.",
  topic: TOPIC,
  skillIds: ["tensor-shapes"],
  supportedDifficulties: [1, 2, 3, 4, 5],

  generate(seed: number, difficulty: Difficulty): GeneratedQuestion {
    const r = rng(seed);
    // Burn one draw so seeds that differ by 1 don't produce near-identical questions.
    int(r, 0, 7);

    const q =
      difficulty === 1
        ? matmul(r, difficulty)
        : difficulty === 2
          ? pooling(r, difficulty)
          : conv(r, difficulty);

    return { ...q, seed };
  },
};
