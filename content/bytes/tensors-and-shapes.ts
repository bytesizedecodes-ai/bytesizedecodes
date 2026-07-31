import type { Byte } from "../types";

const byte: Byte = {
  slug: "tensors-and-shapes",
  title: "Tensors and shapes",
  subtitle: "The screening question every ML interview opens with",
  topic: "deep-learning-fundamentals",
  season: 1,
  order: 3,
  difficulty: 2,
  interviewTags: ["shapes", "cnn", "pytorch"],
  minutes: 5,
  sections: [
    {
      paragraphs: [
        "Before anyone asks about attention or transformers, they ask you to read a shape. A candidate who cannot say what `(32, 3, 224, 224)` means after a convolution does not get the rest of the interview.",
        "A tensor is a multi-dimensional array. Its shape is a tuple of integers — one per axis — and every neural-network layer is a function from one shape to another.",
      ],
    },
    {
      heading: "The NCHW convention",
      paragraphs: [
        "In PyTorch, image batches are laid out as `(N, C, H, W)`:",
      ],
      code: {
        lang: "text",
        source: "N  batch size      how many examples\nC  channels        3 for RGB, 1 for greyscale\nH  height          pixels\nW  width           pixels",
      },
    },
    {
      heading: "The two rules that cover 90% of questions",
      paragraphs: [
        "**Matmul.** `(m, k) @ (k, n)` contracts the shared `k` and yields `(m, n)`. The last axis of the left must match the second-to-last of the right.",
        "**Convolution / pooling.** Spatial size becomes `floor((size + 2p − d(k−1) − 1) / s) + 1`. Channels become the layer's `out_channels`. Batch is untouched.",
        "Memorise the formula once. Then every \"what's the output shape?\" question is arithmetic.",
      ],
    },
    {
      heading: "Common traps",
      paragraphs: [
        "Swapping `in_channels` and `out_channels`. Forgetting that `MaxPool2d(k)` defaults `stride` to `k`, not 1. Dropping the `+ 1` at the end of the conv formula. Confusing `padding` (adds to the input) with `dilation` (stretches the kernel).",
        "If you get one of these wrong in an interview, narrate the formula out loud and recompute. Interviewers forgive arithmetic; they do not forgive not knowing the rule.",
      ],
    },
  ],
  questions: [
    {
      id: "q1",
      kind: "mcq",
      prompt: "A has shape (32, 64) and B has shape (64, 10). What is the shape of A @ B?",
      choices: [
        { id: "a", label: "(64, 10)" },
        { id: "b", label: "(32, 10)" },
        { id: "c", label: "(32, 64)" },
        { id: "d", label: "(64, 32, 10)" },
      ],
      answer: "b",
      explanation:
        "`(32, 64) @ (64, 10)` contracts the 64 and leaves (32, 10). Option (a) keeps the left's inner dimension; (c) ignores B entirely.",
    },
    {
      id: "q2",
      kind: "mcq",
      prompt:
        "`nn.MaxPool2d(kernel_size=2)` is applied to a tensor of shape `(8, 16, 64, 64)`. What comes out?",
      choices: [
        { id: "a", label: "(8, 16, 64, 64)" },
        { id: "b", label: "(8, 16, 63, 63)" },
        { id: "c", label: "(8, 16, 32, 32)" },
        { id: "d", label: "(8, 8, 32, 32)" },
      ],
      answer: "c",
      explanation:
        "Default stride equals kernel size, so each spatial axis halves: 64 → 32. Batch and channels pass through. (b) is the stride-1 formula; (d) wrongly halves the channels.",
    },
    {
      id: "q3",
      kind: "mcq",
      prompt:
        "`Conv2d(3, 64, kernel_size=7, stride=2, padding=3)` on `(1, 3, 224, 224)`. Output shape?",
      choices: [
        { id: "a", label: "(1, 3, 112, 112)" },
        { id: "b", label: "(1, 64, 112, 112)" },
        { id: "c", label: "(1, 64, 111, 111)" },
        { id: "d", label: "(1, 64, 224, 224)" },
      ],
      answer: "b",
      explanation:
        "out = floor((224 + 6 − 7) / 2) + 1 = floor(223/2) + 1 = 111 + 1 = 112. Channels become out_channels = 64. (c) drops the +1; (a) keeps in_channels; (d) ignores stride.",
    },
  ],
};

export default byte;
