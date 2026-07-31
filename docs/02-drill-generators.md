# ByteSizedCodes — Procedural Drill Generators

Status: draft v1 · Last updated: 2026-07-26
Companion to `00-product-plan.md` and `01-architecture.md`.

---

## 1. Why these exist

Authoring capacity is 1–2 pieces per week; a daily habit needs ~30 units of activity per
month. Generators close that gap permanently: write one generator (roughly a day of work)
and it produces unlimited parameterised questions with automatically correct answers,
forever.

They also happen to be the right content. Every generator below mirrors a question that
actually gets asked in ML interviews, which is exactly what the v1 audience wants.

## 2. Design principles

**Every distractor is a named misconception.** This is the pedagogical core of the whole
system. A wrong option is never a random number — it is the answer you get if you make one
specific, common mistake. The explanation then names that mistake back to the learner:
*"You picked 0.71 — that's precision. You computed TP/(TP+FP) when recall is TP/(TP+FN)."*
Diagnostic feedback is what makes a generated question worth as much as an authored one.

**Deterministic and pure.** A generator is a pure function of `(seed, difficulty)`. No
`Date.now()`, no `Math.random()`, no I/O. This lets the identical code run in the browser
for instant practice feedback and in Convex for cheat-resistant ranked grading.

**Clean numbers.** Parameters are chosen so a competent person can do the arithmetic
mentally or on paper in under 60 seconds. If an answer needs a calculator, the parameters
are wrong.

**Difficulty is structural, not arithmetical.** Level 5 is not level 1 with bigger numbers;
it introduces an additional concept (padding, dilation, cost asymmetry, a second step).

## 3. Shared interfaces

```ts
// lib/drills/types.ts
export type Difficulty = 1 | 2 | 3 | 4 | 5;

export type AnswerSpec =
  | { kind: "mcq"; choices: Choice[]; correctId: string }
  | { kind: "numeric"; value: number; tolerance: number; unit?: string }
  | { kind: "shape"; value: number[] }
  | { kind: "multi"; choices: Choice[]; correctIds: string[] };

export interface Choice {
  id: string;
  label: string;
  /** null for the correct option; otherwise the misconception it encodes. */
  misconception: string | null;
}

export interface GeneratedQuestion {
  generatorId: string;
  seed: number;
  difficulty: Difficulty;
  topic: string;
  interviewTags: string[];
  /** Markdown, may contain KaTeX and fenced code. */
  prompt: string;
  answer: AnswerSpec;
  /** Markdown worked solution with the actual numbers substituted. */
  explanation: string;
  /** Byte slugs to suggest when the learner gets it wrong. */
  relatedBytes: string[];
  estimatedSeconds: number;
}

export interface Generator {
  id: string;
  title: string;
  topic: string;
  supportedDifficulties: Difficulty[];
  generate(seed: number, difficulty: Difficulty): GeneratedQuestion;
}
```

Seeded RNG — `mulberry32`, chosen because it is eight lines, has no dependencies, and is
identical across runtimes:

```ts
// lib/drills/rng.ts
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export const pick = <T,>(r: () => number, xs: readonly T[]): T =>
  xs[Math.floor(r() * xs.length)]!;
export const int = (r: () => number, lo: number, hi: number): number =>
  lo + Math.floor(r() * (hi - lo + 1));
```

**Serving modes.** In practice mode the client calls `generate()` directly and grades
locally — instant, offline-capable, zero server cost. In ranked and daily modes a Convex
query returns the question with `answer` stripped, and a mutation regenerates from
`(generatorId, seed, difficulty)` server-side to grade. Same code, two paths.

---

## 4. The eight core generators

### G1 · `tensor-shape` — Output shape inference

**Topic:** deep learning fundamentals · **Tags:** shapes, cnn, pytorch · **~45s**

The single most common "can you actually do this" screening question.

| Difficulty | Variant |
| --- | --- |
| 1 | Matrix multiply: `(m,k) @ (k,n)` |
| 2 | Max pool, `k = s`, no padding |
| 3 | Conv2d with stride, no padding |
| 4 | Conv2d with stride and padding |
| 5 | Conv2d with dilation, or a two-layer chain |

Conv/pool output size:

```
H_out = floor((H + 2p - d*(k-1) - 1) / s) + 1
```

Parameter ranges: `H, W ∈ {28, 32, 64, 128, 224}`, `k ∈ {1,3,5,7}`, `s ∈ {1,2}`,
`p ∈ {0,1,2}`, `d ∈ {1,2}`, `C_in ∈ {1,3,16,32,64}`, `C_out ∈ {16,32,64,128}`,
`N ∈ {1,8,32}`. Reject any draw where `H_out < 1`.

Prompt renders as PyTorch so it reads like real code:

```python
x = torch.randn(32, 3, 224, 224)
conv = nn.Conv2d(3, 64, kernel_size=7, stride=2, padding=3)
y = conv(x)   # y.shape == ?
```

Answer kind `shape`. Distractors:

| Wrong shape | Misconception |
| --- | --- |
| computed without `+1` | off-by-one in the conv formula |
| computed with `p = 0` | forgot padding contributes `2p` |
| `C_in` in the channel slot | confused input and output channels |
| ceil instead of floor | wrong rounding convention |

---

### G2 · `confusion-matrix` — Classification metrics

**Topic:** evaluation · **Tags:** metrics, precision, recall, imbalance · **~60s**

| Difficulty | Asks for |
| --- | --- |
| 1 | Accuracy |
| 2 | Precision or recall |
| 3 | F1 |
| 4 | Specificity, or precision under heavy imbalance |
| 5 | Reverse: given precision and recall targets, which threshold direction moves you there |

Parameters, drawn to be deliberately imbalanced so accuracy misleads:
`TP ∈ [20,200]`, `FN ∈ [10,150]`, `FP ∈ [20,300]`, `TN ∈ [2000,20000]`.

```
precision   = TP / (TP + FP)
recall      = TP / (TP + FN)
F1          = 2PR / (P + R)
accuracy    = (TP + TN) / total
specificity = TN / (TN + FP)
```

Answer kind `numeric`, three decimals, tolerance `0.005`.

Distractors: precision↔recall swapped (by far the most common error), accuracy substituted
for the requested metric, `F1` computed as the arithmetic rather than harmonic mean, and
recall computed as `TP/(TP+TN)`.

The explanation always ends by contrasting the requested metric with accuracy on the same
numbers — "accuracy here is 0.981, which looks great and tells you nothing" — because that
insight is the actual lesson.

---

### G3 · `metric-choice` — Choosing the right metric

**Topic:** evaluation · **Tags:** metrics, business-context · **~40s**

Scenario templates with parameterised slots, resolved by a small rule table rather than
hardcoded answers.

Scenario pool: fraud detection, disease screening, spam filtering, churn prediction,
ad click-through, manufacturing defects, loan default, content moderation, demand
forecasting, delivery-time estimation.

Slots: positive-class rate (`0.1%`–`40%`), cost of a false negative, cost of a false
positive, and whether the output is a score or a hard label.

Rule table (excerpt):

| Task | Imbalance | Cost asymmetry | Correct answer |
| --- | --- | --- | --- |
| binary | severe | FN ≫ FP | recall / PR-AUC |
| binary | severe | FP ≫ FN | precision |
| binary | mild | symmetric | ROC-AUC or F1 |
| binary, ranked output | severe | — | PR-AUC |
| regression, outliers present | — | — | MAE |
| regression, large errors costly | — | — | RMSE |

Answer kind `mcq` over {accuracy, precision, recall, F1, ROC-AUC, PR-AUC, RMSE, MAE, R²}.

**Accuracy is always present as a distractor** on imbalanced scenarios, because reaching
for it is the defining beginner mistake and the explanation gets to show the 99.8%-accurate
model that predicts "never fraud".

---

### G4 · `gradient-step` — One step of gradient descent

**Topic:** optimisation · **Tags:** gradients, learning-rate, backprop · **~60s**

| Difficulty | Variant |
| --- | --- |
| 1 | `f(w) = (w - t)²`, compute `w₁` |
| 2 | Linear regression, one sample, MSE, update `w` |
| 3 | Linear regression, update both `w` and `b` |
| 4 | Two gradient steps in sequence |
| 5 | Logistic regression, one step through a sigmoid |

For the linear-regression variant with `ŷ = wx + b` and `L = (ŷ - y)²`:

```
dL/dw = 2(ŷ - y)·x        dL/db = 2(ŷ - y)
w₁ = w₀ - lr · dL/dw
```

Parameters: `w₀, b₀ ∈ [-3,3]` (one decimal), `x, y` small integers,
`lr ∈ {0.01, 0.05, 0.1, 0.5}`. Reject draws where `|w₁| > 100` (an exploding update is a
different lesson) or where `ŷ = y` exactly.

Answer kind `numeric`, tolerance `0.001`.

Distractors: sign flipped (`w + lr·grad` — ascent instead of descent), the factor of 2
dropped, the *loss* used in place of the gradient, and `x` omitted from `dL/dw`.

---

### G5 · `leakage-spot` — Find the data leak

**Topic:** ML engineering · **Tags:** leakage, cross-validation, pipelines · **~75s**

Renders a numbered 5–7 step pipeline, exactly one of which leaks test information. The
learner picks the offending step.

Leak types in the pool:

| Leak | Description |
| --- | --- |
| `scale-before-split` | `StandardScaler` fit on the full dataset before splitting |
| `impute-before-split` | Missing values filled with the full-data mean |
| `select-before-split` | Feature selection ranked by correlation with the full target |
| `resample-before-split` | SMOTE / oversampling applied before splitting |
| `target-encode-nocv` | Target encoding computed without fold isolation |
| `temporal-random-split` | Random split on time-series data |
| `dedupe-after-split` | Near-duplicate rows left straddling train and test |
| `tune-on-test` | Hyperparameters selected against the test set |

Generation: take a canonical clean pipeline, inject one leak by replacing or reordering a
step, then shuffle the incidental steps (loading, EDA, training, reporting) so position
carries no signal. Every non-leaking step is a legitimate distractor.

The explanation states the leak type, why the metric would be optimistic, and the corrected
ordering. At difficulty 5, two steps look suspicious but only one actually leaks.

---

### G6 · `bias-variance` — Diagnose and remedy

**Topic:** model behaviour · **Tags:** overfitting, underfitting, debugging · **~60s**

Two-part question mirroring the real interview: diagnose, then prescribe.

Parameters: human/Bayes error `h ∈ [0.5%, 8%]`, train error `tr`, validation error `v`.

```
avoidable bias = tr - h
variance gap   = v  - tr
```

| Condition | Diagnosis | Valid remedies |
| --- | --- | --- |
| bias high, gap small | underfitting | bigger model, train longer, better features, less regularisation |
| bias small, gap high | overfitting | more data, regularisation, augmentation, simpler model, early stopping |
| both high | both | address bias first |
| both small | well fit | ship it; improve the data |

Difficulty 4–5 adds a train/validation *distribution mismatch* case (train and dev-train
errors close, dev error far) where the answer is neither bias nor variance but a data
mismatch — a distinction most candidates miss.

Distractors are the remedies for the opposite diagnosis. "Add dropout" when the model is
underfitting is the classic, and naming it back to the learner is high-value feedback.

---

### G7 · `bayes-base-rate` — Why accuracy lies

**Topic:** probability · **Tags:** bayes, base-rate, imbalance · **~90s**

Prevalence `p`, sensitivity `se`, specificity `sp`. Compute `P(disease | positive)`.

```
P(D|+) = p·se / (p·se + (1-p)·(1-sp))
```

Parameters: `p ∈ {0.001, 0.002, 0.005, 0.01, 0.02, 0.05}`,
`se ∈ {0.85 … 0.99}`, `sp ∈ {0.85 … 0.99}`. Answer as a percentage, tolerance `0.5pp`.

Scenario skins so it doesn't feel repetitive: medical screening, fraud alerts, spam flags,
predictive maintenance, plagiarism detection.

Distractors, all pedagogically loaded:

| Wrong answer | Misconception |
| --- | --- |
| `se` | base-rate neglect — the defining error, and usually the modal answer |
| `1 - sp` | confused false-positive rate with the posterior |
| `sp` | confused specificity with precision |
| `p` | ignored the evidence entirely |

The explanation renders the natural-frequency version ("out of 100,000 people…"), because
that representation is what actually makes it click.

This generator is the conceptual spine linking G2 and G3 — it is *why* precision collapses
under imbalance.

---

### G8 · `head-and-loss` — Output layer and loss function

**Topic:** deep learning · **Tags:** loss-functions, architecture, pytorch · **~40s**

Given a task description, pick the correct output units, final activation, and loss.

| Task | Units | Activation | Loss |
| --- | --- | --- | --- |
| binary classification | 1 | sigmoid | BCE |
| multiclass, single label (K) | K | softmax | cross-entropy |
| multilabel (K tags) | K | sigmoid | BCE per label |
| scalar regression | 1 | linear | MSE / MAE |
| bounded regression [0,1] | 1 | sigmoid | MSE |
| count regression | 1 | softplus/exp | Poisson NLL |
| ordinal (K levels) | K-1 | sigmoid | cumulative-link |

Difficulty 1–2 ask for the pair; 3–4 ask for the unit count too; 5 uses adversarial
framings ("an image can contain several of 12 objects" — multilabel, not multiclass, and
`softmax` is the trap).

Distractors: softmax on a multilabel task (the flagship error, because softmax forces the
outputs to compete when the labels don't), MSE on classification, `K` units with sigmoid on
a single-label problem, and cross-entropy paired with sigmoid on a multiclass head.

Note the PyTorch footgun in explanations where relevant — `CrossEntropyLoss` already
applies log-softmax, so adding a softmax layer is a real bug people ship.

---

## 5. Stretch generators

Build after the core eight are live and instrumented.

**G9 · `param-count`** — Count trainable parameters. Dense: `(in + 1) × out`.
Conv2d: `(k × k × C_in + 1) × C_out`. BatchNorm: `2C`. Given a 3–5 layer architecture,
total them. Distractors: bias terms omitted, `C_in` and `C_out` swapped, `k` not squared.
Common at hardware-aware and efficiency-focused interviews.

**G10 · `decision-boundary`** — Show a rendered scatter plot with a decision boundary and
ask which model produced it (linear, RBF-SVM, shallow tree, deep tree, k-NN with small vs
large k). Requires deterministic SVG rendering from the seed. Visual, fast, phone-friendly,
and a strong candidate for the shareable Daily Drill.

**G11 · `threshold-shift`** — Given a small score table and a moving threshold, recompute
precision and recall. Teaches the precision-recall trade-off by hand.

---

## 6. Build order and cost

| Generator | Effort | Build in |
| --- | --- | --- |
| G2 `confusion-matrix` | 0.5 day | Phase 1 |
| G1 `tensor-shape` | 1 day | Phase 1 |
| G4 `gradient-step` | 0.5 day | Phase 1 |
| G8 `head-and-loss` | 0.5 day | Phase 1 |
| G3 `metric-choice` | 1 day (scenario pool) | Phase 1 |
| G6 `bias-variance` | 0.5 day | Phase 1 |
| G7 `bayes-base-rate` | 0.5 day | Phase 1 |
| G5 `leakage-spot` | 1.5 days (pipeline templates) | Phase 1 |

Start with G2 — highest interview value, simplest implementation, and it validates the
whole interface before anything harder is attempted.

## 7. Testing

Every generator needs, at minimum:

1. **Determinism** — `generate(s, d)` deep-equals itself across 1,000 seeds, and produces
   identical output in Node and in the Convex runtime.
2. **Answer correctness** — the stated answer is recomputed by an independent
   implementation in the test (for G1, cross-check against the PyTorch formula written a
   second way).
3. **Distractor distinctness** — no distractor ever equals the correct answer after
   rounding, across 10,000 seeds. This is the most likely real bug.
4. **Parameter sanity** — no rejected-range draws escape (`H_out ≥ 1`, no division by zero,
   no degenerate `ŷ = y`).
5. **Rendering** — prompt and explanation contain no unresolved template slots.

## 8. Instrumentation

Log per generator and difficulty: accuracy rate, median time to answer, and — most
usefully — **the misconception distribution of wrong answers.** If 60% of learners picking
the wrong option on G2 are choosing the precision/recall swap, that is a byte that needs
writing, and the data told you so. Let the drill telemetry drive the content calendar.

Target accuracy band per difficulty is 60–80%. Below 50% the question is unfair or the
prerequisite byte is missing; above 90% the difficulty tier is mislabelled.
