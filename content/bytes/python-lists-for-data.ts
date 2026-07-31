import type { Byte } from "../types";

const byte: Byte = {
  slug: "python-lists-for-data",
  title: "Python lists for data",
  subtitle: "The everyday container behind features, batches, and labels",
  topic: "python",
  season: 1,
  order: 4,
  difficulty: 1,
  interviewTags: ["python", "lists", "data"],
  skillIds: ["python-basics"],
  capability: "Slice, map, and filter lists the way ML notebooks do.",
  minutes: 6,
  sections: [
    {
      paragraphs: [
        "Almost every ML notebook starts with lists (or arrays that behave like them): features, labels, file paths, scores. Before tensors, you need to be fluent with list indexing, slicing, and simple transforms.",
        "A list is an ordered sequence. Indexing is zero-based: `xs[0]` is the first item. Slicing `xs[1:3]` returns a new list with items from index 1 up to — but not including — 3.",
      ],
    },
    {
      heading: "Transforms you will reuse",
      paragraphs: [
        "List comprehensions build a new list from an old one: `[x * 2 for x in xs]`. Filtering keeps only matching items: `[x for x in xs if x > 0]`.",
        "When labels and features must stay aligned, never shuffle one list alone — zip them, shuffle pairs, then unzip. That discipline prevents silent train/test bugs.",
      ],
      code: {
        lang: "python",
        source: `scores = [0.2, 0.9, 0.4]
flags = [s >= 0.5 for s in scores]  # [False, True, False]
kept = [s for s in scores if s >= 0.5]  # [0.9]`,
      },
    },
  ],
  questions: [
    {
      id: "q1",
      kind: "mcq",
      prompt: "What does `xs[1:3]` return for `xs = [10, 20, 30, 40]`?",
      choices: [
        { id: "a", label: "[10, 20, 30]" },
        { id: "b", label: "[20, 30]" },
        { id: "c", label: "[20, 30, 40]" },
        { id: "d", label: "[30]" },
      ],
      answer: "b",
      explanation:
        "Slices include the start index and exclude the end index, so indices 1 and 2 → 20 and 30.",
    },
    {
      id: "q2",
      kind: "mcq",
      prompt: "Why is shuffling features without shuffling labels dangerous?",
      choices: [
        { id: "a", label: "Python forbids it at runtime" },
        { id: "b", label: "Rows no longer match — the model trains on wrong labels" },
        { id: "c", label: "It only slows training" },
        { id: "d", label: "It only matters for images" },
      ],
      answer: "b",
      explanation:
        "Each feature row must stay paired with its label. Independent shuffles break that alignment and poison training silently.",
    },
  ],
  exercise: {
    id: "ex1",
    title: "Keep positives",
    prompt: "Return only scores that are at least 0.5, preserving order.",
    starterCode: `def keep_positives(scores: list[float]) -> list[float]:
    """Return scores >= 0.5 in the same order."""
    return []  # <-- fix me
`,
    testCode: `
cases = [
    ([0.2, 0.9, 0.4, 0.5], [0.9, 0.5]),
    ([], []),
    ([0.1, 0.2], []),
]
ok = True
message = "ok"
for inp, expected in cases:
    got = keep_positives(inp)
    if got != expected:
        ok = False
        message = f"keep_positives({inp!r}) -> {got!r}, expected {expected!r}"
        break
`,
  },
};

export default byte;
