import type { Byte } from "../types";

const byte: Byte = {
  slug: "gradient-descent",
  title: "What gradient descent actually does",
  subtitle: "One update rule, three places candidates get the sign wrong",
  topic: "optimisation",
  season: 1,
  order: 2,
  difficulty: 2,
  interviewTags: ["gradients", "learning-rate", "optimisation"],
  minutes: 5,
  sections: [
    {
      paragraphs: [
        "Gradient descent is one line: move the parameters a little bit in the direction that most reduces the loss.",
        "If L(w) is the loss and ∇L is its gradient with respect to the weights, the update is:",
      ],
      code: {
        lang: "text",
        source: "w ← w − η · ∇L(w)",
      },
    },
    {
      heading: "Why the minus sign",
      paragraphs: [
        "The gradient points uphill — toward *higher* loss. Descent subtracts it. Candidates who write `w + η · ∇L` are doing gradient *ascent*, which maximises the loss. In an interview that single flipped sign is often fatal.",
        "η (eta) is the learning rate. Too small and training crawls. Too large and the update overshoots the valley, the loss oscillates, and with a bit more it diverges.",
      ],
    },
    {
      heading: "A worked example",
      paragraphs: [
        "Take L(w) = (w − 3)², start at w = 1, learning rate 0.1.",
        "The derivative is 2(w − 3) = 2(1 − 3) = −4. One step: w ← 1 − 0.1 · (−4) = 1.4. Closer to 3, as expected.",
      ],
    },
    {
      heading: "What interviewers probe next",
      paragraphs: [
        "They will ask what happens when the learning rate is too high (divergence / oscillation), what batch size does to the gradient estimate (noise vs signal), and why we don't just solve ∇L = 0 in closed form (non-convex losses, and scale — modern models have billions of parameters).",
        "If you can compute one step by hand, you understand the algorithm. Everything else is engineering around that line.",
      ],
    },
  ],
  questions: [
    {
      id: "q1",
      kind: "mcq",
      prompt: "L(w) = (w − 5)², w₀ = 1, η = 0.1. What is w after one step?",
      choices: [
        { id: "a", label: "0.2" },
        { id: "b", label: "1.8" },
        { id: "c", label: "1.4" },
        { id: "d", label: "−0.6" },
      ],
      answer: "b",
      explanation:
        "∇L = 2(w − 5) = 2(1 − 5) = −8. Update: 1 − 0.1 · (−8) = 1.8. Option (c) is what you get if you drop the factor of 2; (a) and (d) flip the sign.",
    },
    {
      id: "q2",
      kind: "mcq",
      prompt: "Training loss oscillates and occasionally spikes. The most likely cause is:",
      choices: [
        { id: "a", label: "Learning rate too small" },
        { id: "b", label: "Learning rate too large" },
        { id: "c", label: "Batch size too large" },
        { id: "d", label: "Using Adam instead of SGD" },
      ],
      answer: "b",
      explanation:
        "A large step overshoots the minimum and the next step overshoots the other way. Too-small rates are slow but smooth; Adam vs SGD changes the shape of the path, not this symptom.",
    },
    {
      id: "q3",
      kind: "mcq",
      prompt: "In the update w ← w − η · ∇L, what does the gradient represent?",
      choices: [
        { id: "a", label: "The direction of steepest decrease in loss" },
        { id: "b", label: "The direction of steepest increase in loss" },
        { id: "c", label: "The current value of the loss" },
        { id: "d", label: "The learning rate itself" },
      ],
      answer: "b",
      explanation:
        "By definition the gradient points uphill. That is why the update subtracts it — to go downhill. Confusing the two is the most common sign error in handwritten answers.",
    },
  ],
  exercise: {
    id: "ex1",
    title: "One step by hand",
    prompt:
      "Implement one gradient-descent step for L(w) = (w - target)². Return the updated weight.",
    starterCode: `def step(w: float, target: float, lr: float) -> float:
    """Return w after one gradient-descent step on L = (w - target)^2."""
    # TODO: compute the gradient and apply the update
    return w
`,
    testCode: `
cases = [
    (1.0, 3.0, 0.1, 1.4),
    (0.0, 0.0, 0.5, 0.0),
    (5.0, 1.0, 0.05, 4.6),
]
ok = True
message = "ok"
for w, t, lr, expected in cases:
    got = step(w, t, lr)
    if abs(got - expected) > 1e-6:
        ok = False
        message = f"step({w}, {t}, {lr}) -> {got}, expected {expected}"
        break
`,
  },
};

export default byte;
