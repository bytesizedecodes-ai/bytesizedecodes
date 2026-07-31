import type { Byte } from "../types";

const byte: Byte = {
  slug: "python-functions-and-tests",
  title: "Python functions and tests",
  subtitle: "Small pure functions you can grade before you trust a model",
  topic: "python",
  season: 1,
  order: 5,
  difficulty: 1,
  interviewTags: ["python", "functions", "testing"],
  skillIds: ["python-basics"],
  capability: "Write a pure helper and check it with explicit cases.",
  minutes: 6,
  sections: [
    {
      paragraphs: [
        "Before training loops, ML code is full of tiny helpers: normalize a score, map a label string to an id, clip a probability. Pure functions — same input, same output, no hidden state — are easy to test and hard to regret.",
        "A good habit: write the function signature and two or three expected cases first. That is the same mindset as evaluation cases for a model: define success before you implement.",
      ],
    },
    {
      heading: "Assertions as a mini test suite",
      paragraphs: [
        "In notebooks, `assert f(x) == y` is enough to catch regressions. In this app, exercises run a hidden test that sets `ok = True` only when every case passes.",
        "Prefer returning values over printing. Prints are for humans; return values are for pipelines and graders.",
      ],
      code: {
        lang: "python",
        source: `def clip01(x: float) -> float:
    if x < 0:
        return 0.0
    if x > 1:
        return 1.0
    return x

assert clip01(-0.2) == 0.0
assert clip01(1.4) == 1.0`,
      },
    },
  ],
  questions: [
    {
      id: "q1",
      kind: "mcq",
      prompt: "What makes a helper 'pure' in this context?",
      choices: [
        { id: "a", label: "It prints every intermediate value" },
        { id: "b", label: "Same inputs always produce the same output with no hidden side effects" },
        { id: "c", label: "It must use global variables" },
        { id: "d", label: "It can only run on a GPU" },
      ],
      answer: "b",
      explanation:
        "Purity means determinism and no sneaky mutation of shared state — which makes tests and reuse reliable.",
    },
    {
      id: "q2",
      kind: "mcq",
      prompt: "Why write expected cases before implementing a metric helper?",
      choices: [
        { id: "a", label: "To define success criteria instead of guessing after the fact" },
        { id: "b", label: "Because Python requires tests in the language grammar" },
        { id: "c", label: "To make the function run faster" },
        { id: "d", label: "So you can skip edge cases forever" },
      ],
      answer: "a",
      explanation:
        "Cases are a contract. Writing them first forces you to decide what 'correct' means — the same discipline as model evaluation.",
    },
  ],
  exercise: {
    id: "ex1",
    title: "Clip to [0, 1]",
    prompt: "Return x clamped into the inclusive range 0…1.",
    starterCode: `def clip01(x: float) -> float:
    """Clamp x into [0, 1]."""
    return x  # <-- fix me
`,
    testCode: `
cases = [(-0.2, 0.0), (0.0, 0.0), (0.4, 0.4), (1.0, 1.0), (1.7, 1.0)]
ok = True
message = "ok"
for inp, expected in cases:
    got = clip01(inp)
    if got != expected:
        ok = False
        message = f"clip01({inp!r}) -> {got!r}, expected {expected!r}"
        break
`,
  },
};

export default byte;
