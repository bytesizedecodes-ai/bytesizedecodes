import type { Course } from "../types";

const course: Course = {
    slug: "machine-learning",
    title: "Machine Learning",
    subtitle:
      "From AI-vs-ML map to real mechanics: regression, gradient descent, neural networks, metrics — visually, on one running case.",
    description:
      "Start with the four-lesson map of AI, ML, and deep learning. Then go one level deeper: fitting lines and curves, the loss that drives learning, gradient descent, neurons and backpropagation, honest evaluation, and the traps that fake success. The course runs on one case from start to end. Kirana Pay is a mid-size payments platform; its ML team scores fraud on transactions and churn on merchants. Every lesson adds one artifact to this build. A month-one review capstone at the end assembles the lot. Runnable exercises throughout — then Advanced Machine Learning takes you inside the models themselves.",
    level: "intermediate",
    domain: "Machine Learning",
    access: "free",
    prerequisites:
      "Built for practitioners with roughly two years of hands-on ML experience. You have trained and shipped models, and we assume basic algebra plus a working feel for training loops. New graduates start with Machine Learning, Plainly.",
    lessons: [
      {
        slug: "what-is-artificial-intelligence",
        title: "What is Artificial Intelligence?",
        blurb: "What makes a machine intelligent — and what doesn't.",
        topic: "ai-foundations",
        skillIds: ["ai-literacy", "ai-ml-dl"],
        capability: "Distinguish adaptive AI systems from fixed-rule software.",
        minutes: 4,
        concept: {
          anchor: "A calculator never changes; a fraud filter rewrites itself from every marked transaction — that divide is the whole map.",
          what: "**AI** is the branch of computer science building machines that **reason, learn, perceive, and decide** — instead of only executing fixed instructions.",
          why: "It separates systems that **adapt from experience** (a spam filter improving with every marked email) from **fixed-rule software** (a calculator that never changes).",
          where: [
            "**Recommendation systems** that change as you click",
            "**Spam filters** that improve as they see more mail",
            "A **microwave timer** — the contrast case: fixed, never adapts",
          ],
          whenNot:
            "Not AI when the behaviour is **fully pre-programmed** — same input, same output, forever, with nothing learned from data.",
        },
        prose: [
          "Artificial Intelligence is the branch of computer science that tries to build intelligent machines. Such machines can **reason, learn, perceive, and decide** — instead of only executing fixed instructions.",
          "The key divide is between a machine that **follows rules** and one that **figures things out**. A calculator is not intelligent. The same input always gives the same output, and it never adapts. A spam filter that improves as it sees more email is.",
          "AI is the broadest label. Everything underneath it — machine learning, deep learning, large language models — is a technique for reaching that goal. Think of **AI as the destination**, and ML/DL as vehicles for getting there. **Kirana Pay** is the payments platform running through this course. Its fraud desk ran on hand-written thresholds for years. Deciding what actually counts as AI there is the first item in its month-one review.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Your team is auditing a smart-home app for its 'AI-powered' marketing claim. One feature is a thermostat that runs the same fixed schedule every day. Another reshuffles lighting scenes based on which rooms occupants actually use over time. Which feature genuinely behaves like AI?",
            choices: [
              { id: "a", label: "The thermostat — schedules are a form of intelligence" },
              { id: "b", label: "The adaptive lighting — it changes behaviour from data about use" },
              { id: "c", label: "Both equally — anything automated counts as AI" },
              {
                id: "d",
                label: "Both — the thermostat's schedule was tuned once during setup, and tuning-once is the same as adapting",
              },
            ],
            answer: "b",
            explanation:
              "The dividing line is adaptation *after* deployment. The lighting keeps changing behaviour from accumulated data. The thermostat executes a pre-written schedule, and tuning it once during setup is a design-time act, not learning. 'Anything automated' and 'tuned once = adapts' are the two misreads the audit exists to settle.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A colleague claims the payroll system is 'intelligent' because it computes taxes perfectly, the same way, every single month. What is the honest verdict?",
            choices: [
              { id: "a", label: "It's intelligent — consistency is the definition of AI" },
              { id: "b", label: "It's not AI — fixed rules mean same input → same output, with no adapting from experience" },
              { id: "c", label: "It's a neural network that has finished training" },
              { id: "d", label: "It becomes AI once it runs in the cloud" },
            ],
            answer: "b",
            explanation:
              "Determinism isn't intelligence. The payroll engine never updates itself from data; a system that can't change its behaviour isn't reasoning or learning — it's a very fast clerk.",
          },
        ],
      },
      {
        slug: "what-is-machine-learning",
        title: "What is Machine Learning?",
        blurb: "Teaching machines to learn from data instead of rules.",
        topic: "ml-foundations",
        skillIds: ["ai-literacy", "learning-paradigms"],
        capability: "Explain how ML learns patterns and identify its three main families.",
        minutes: 5,
        concept: {
          anchor: "ML is learning the house rules by watching a thousand games, not reading the rulebook.",
          what: "**Machine learning** replaces hand-written rules with **patterns learned from data** — the system writes its own rules from examples, structures, or rewards.",
          why: "Hand-coding every rule breaks on messy reality; **learning from data** scales where rules can't be enumerated.",
          where: [
            "**Spam detection** learned from millions of marked emails",
            "**Recommendations** tuned by your watch history",
            "**Game agents** trained by winning and losing",
          ],
          whenNot:
            "Not ML when a **complete, exact rule already exists** — a payroll tax table should be programmed, not learned.",
        },
        prose: [
          "Machine Learning is a technique for building AI systems that **learn patterns from data themselves**. No programmer has to hand-code every rule.",
          "The classic framing: you do not write a program that says 'if an email contains these words, it's spam'. Instead, you show the system **thousands of labelled examples** and let it discover the patterns. The more data it sees, the better it gets.",
          "You've worked with all three families for two years, so the course only fixes the labels: **supervised** (labelled examples), **unsupervised** (structure with no labels), **reinforcement** (reward-shaped sequences). Where ML still surprises working practitioners is not the taxonomy. It is the edges: rules nobody can enumerate, distributions that drift, and the two traps waiting at the end of this course.",
        ],
        diagram: {
          kind: "decision",
          root: {
            kind: "decision",
            question: "What does the system learn from?",
            branches: [
              {
                label: "labelled examples",
                node: { kind: "leaf", answer: "Supervised" },
              },
              {
                label: "rewards / penalties",
                node: { kind: "leaf", answer: "Reinforcement" },
              },
              {
                label: "raw data, nothing else",
                node: { kind: "leaf", answer: "Unsupervised" },
              },
            ],
          },
        },
        exercise: {
          id: "ex1",
          title: "Spot the family",
          prompt:
            "A function should return 'supervised', 'unsupervised', or 'reinforcement' for a given task description. Fix the two that are wrong.",
          starterCode: `def family(task: str) -> str:
    """Classify an ML task by learning family."""
    if "label" in task:
        return "supervised"
    if "reward" in task:
        return "supervised"      # <-- wrong
    return "label"               # <-- wrong
`,
          testCode: `
cases = [
    ("predict the label of an image", "supervised"),
    ("group similar customers together", "unsupervised"),
    ("reward the agent for winning", "reinforcement"),
    ("labelled spam detection", "supervised"),
]
ok = True
message = "ok"
for task, expected in cases:
    got = family(task)
    if got != expected:
        ok = False
        message = f"family({task!r}) -> {got!r}, expected {expected!r}"
        break
`,
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A fintech team is building fraud detection. Engineer A wants to hand-write rules like 'flag any transfer over ₹50,000'. Engineer B wants to train a model on five years of past transactions, each labelled fraud or genuine. New fraud patterns appear every month. Whose approach keeps working, and why?",
            choices: [
              { id: "a", label: "A — fixed thresholds are always more reliable than models" },
              { id: "b", label: "B — a model retrained on fresh labelled data can pick up patterns nobody hand-wrote" },
              { id: "c", label: "A — hand rules automatically adapt as fraudsters change tactics" },
              { id: "d", label: "Neither — fraud detection cannot be automated" },
            ],
            answer: "b",
            explanation:
              "Hand-written thresholds freeze on day one, and new fraud patterns get past them easily. Learning from labelled history is exactly the case where ML beats rules. The patterns are too many and too shifting to enumerate by hand.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A delivery startup wants to predict each order's arrival time in minutes. It has thousands of past deliveries, each recorded with the actual time it took. Which family does this fall into, and what kind of output is it?",
            choices: [
              { id: "a", label: "Supervised learning — regression, because the answer is a number" },
              { id: "b", label: "Supervised learning — classification, because deliveries are sorted" },
              { id: "c", label: "Unsupervised learning — no labels are involved" },
              { id: "d", label: "Reinforcement learning — late deliveries are penalties" },
            ],
            answer: "a",
            explanation:
              "Past deliveries labelled with actual times are textbook supervised data, and 'minutes' is a quantity — regression. Classification would predict a category, not a number.",
          },
        ],
      },
      {
        slug: "what-is-deep-learning",
        title: "What is Deep Learning?",
        blurb: "Multi-layer neural networks, drawn out.",
        topic: "deep-learning",
        skillIds: ["ai-ml-dl"],
        capability: "Explain what makes a neural network deep and why layers help.",
        minutes: 5,
        concept: {
          anchor: "Deep learning is an assembly line — each station adds one more layer of finish to the raw part.",
          what: "**Deep learning** trains **many-layered neural networks** to turn raw data into increasingly abstract features — edges → shapes → objects.",
          why: "Layers **learn features directly from raw data**, removing hand-engineered features — why DL dominates hard perception tasks.",
          where: [
            "**Image recognition** straight from raw pixels",
            "**Speech-to-text** straight from raw audio",
            "**LLMs** like ChatGPT, trained on text tokens",
          ],
          whenNot:
            "Overkill for **small tabular datasets** — a random forest or logistic regression often wins there with far less data and compute.",
        },
        prose: [
          "Deep Learning is a subfield of machine learning that uses **artificial neural networks** — structures loosely inspired by the brain — with many layers stacked one after another.",
          "'Deep' simply refers to **the number of layers**. A network with one or two layers is shallow; a deep network might have dozens. Each layer turns its input into a slightly more abstract representation. Early layers might detect edges, middle layers detect shapes, and later layers detect whole objects.",
          "Because deep networks **learn features directly from raw data** (pixels, audio samples, text tokens), they remove the need for a human to hand-design features. That's why they dominate hard perception tasks — image recognition, speech-to-text, translation, and the language models behind tools like ChatGPT.",
        ],
        diagram: {
          kind: "flow",
          steps: [
            { kind: "input", text: "Raw pixels / audio / text" },
            {
              kind: "process",
              text: "Layered neural network",
              caption: "each layer builds more abstract features",
            },
            { kind: "output", text: "Object / transcript / answer" },
          ],
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Two radiology startups tackle fracture detection from X-rays. Startup A feeds raw pixels into a 50-layer network. Startup B has engineers hand-craft edge-detector features and feeds those into a two-layer model. A's system wins on subtle hairline fractures. What advantage explains it?",
            choices: [
              { id: "a", label: "A's network learns each level of features from the data itself — edges up to fracture patterns" },
              { id: "b", label: "A has more GPU memory, which always wins" },
              { id: "c", label: "B's hand-crafted features were too accurate, confusing the model" },
              { id: "d", label: "A's network needed no training data" },
            ],
            answer: "a",
            explanation:
              "Depth lets the network build features level by level from raw pixels — no human decides what matters. B's engineers hard-coded their own assumptions, and hairline fractures fell outside them.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Your marketing team has 800 rows of customer data (age, spend, plan, churned-or-not) and wants to predict churn. A data scientist recommends a small logistic regression instead of a 100-layer network. Why is that the right call?",
            choices: [
              { id: "a", label: "It isn't — deep networks are always more accurate" },
              { id: "b", label: "Small, structured tabular data suits simpler models; a 100-layer network would mostly memorise noise with so few rows" },
              { id: "c", label: "Logistic regression is a deep learning technique anyway" },
              { id: "d", label: "Churn labels can't be learned from data" },
            ],
            answer: "b",
            explanation:
              "Deep learning earns its cost on raw, high-volume perception data. On 800 tidy rows, a simple model generalises better and can't hide its reasoning — the 'when NOT to use DL' boundary in action.",
          },
        ],
      },
      {
        slug: "ai-vs-ml-vs-dl",
        title: "AI vs ML vs Deep Learning",
        blurb: "How the three nested worlds fit together.",
        topic: "ai-foundations",
        skillIds: ["ai-ml-dl"],
        capability: "Place AI, machine learning, and deep learning in the correct relationship.",
        minutes: 5,
        exercise: {
          id: "ex1",
          title: "File the claim in the right circle",
          prompt:
            "A function should return 'AI', 'ML', or 'DL' for a claim about a system. Two lines file claims into the wrong circle — fix them so every test passes.",
          starterCode: `def circle(claim: str) -> str:
    """Place a claim in AI (broad), ML (learns from data), or DL (deep neural nets)."""
    if "deep neural network" in claim:
        return "DL"
    if "learns rules from labelled data" in claim:
        return "AI"        # <-- wrong
    if "a system that behaves intelligently" in claim:
        return "ML"        # <-- wrong
    return "AI"
`,
          testCode: `
cases = [
    ("a deep neural network translates speech", "DL"),
    ("it learns rules from labelled data", "ML"),
    ("a system that behaves intelligently in the world", "AI"),
    ("uses a deep neural network to rank videos", "DL"),
    ("any technique that mimics intelligent behaviour", "AI"),
]
ok = True
message = "ok"
for claim, expected in cases:
    got = circle(claim)
    if got != expected:
        ok = False
        message = f"circle({claim!r}) -> {got!r}, expected {expected!r}"
        break
`,
        },
        concept: {
          anchor: "AI is the goal, ML is the route that learns from data, DL is the vehicle with many-layered networks — concentric circles, not synonyms.",
          what: "**AI ⊃ ML ⊃ DL** — nested circles: AI is the goal, ML pursues it by learning from data, DL is ML with many-layered neural networks.",
          why: "Correct nesting prevents mislabeling — not all AI learns (**rule-based expert systems**), not all ML is deep (**random forests, logistic regression**).",
          where: [
            "A **hand-coded chess engine** — AI, but not ML",
            "A **random-forest spam filter** — ML, but not DL",
            "A **GPT-style translator** — DL (and therefore ML and AI)",
          ],
          whenNot:
            "Don't call a fixed-rule system 'machine learning' — if no behaviour is **learned from data**, it's AI at most, never ML or DL.",
        },
        prose: [
          "These three terms are constantly confused, but they're just **nested circles**. AI is the largest; machine learning is a part of AI; deep learning is a part of machine learning.",
          "Artificial Intelligence is the **goal**: build machines that can act intelligently. Machine learning is one **way** to pursue that goal — let the system learn from data. Deep learning is one specific **technique** within ML — use many-layered neural networks.",
          "Not all AI is machine learning (**rule-based expert systems** are AI but don't learn). Not all ML is deep learning (**random forests and logistic regression** are ML but not deep). But all deep learning is ML, and all ML is AI.",
          "That's the primer done. From here the course leaves the map and goes one level deeper: features, classifiers, train/test splits, overfitting — each idea gets its mechanics, not just its name.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "At a careers fair, a vendor says: 'Our medical expert system encodes 3,000 if-then rules a human wrote — it's machine learning because it's smart.' What's wrong with the claim?",
            choices: [
              { id: "a", label: "Nothing — acting intelligently is the definition of ML" },
              { id: "b", label: "It's AI but not ML — no rule was learned from data; humans wrote every one" },
              { id: "c", label: "It's deep learning — if-then rules are neural layers" },
              { id: "d", label: "It's none of AI, ML, or DL" },
            ],
            answer: "b",
            explanation:
              "ML means the system infers its rules from data. A hand-built expert system can act intelligently (AI circle) but sits outside ML — and therefore outside DL too.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Kirana Pay's compliance officer must file three systems in the right regulatory circle: (1) a video ranker using a deep neural network, (2) a logistic-regression fraud scorer trained on labelled data, (3) a fixed route planner with hand-coded shortest-path rules. Which filing is DL / ML-not-DL / AI-not-ML?",
            choices: [
              { id: "a", label: "1 → 2 → 3" },
              { id: "b", label: "3 → 2 → 1" },
              { id: "c", label: "1 → 3 → 2" },
              { id: "d", label: "2 → 1 → 3" },
            ],
            answer: "a",
            explanation:
              "The deep ranker is DL (deepest circle). The fraud scorer learns from data but has no multi-layer network — ML, not DL. The route planner never learns — AI at most, not ML. The filing matters because the circles carry different audit obligations: ML filings must show training data lineage, and DL filings add model-behaviour review.",
          },
        ],
      },
      {
        slug: "linear-regression",
        title: "Fitting a line to the data",
        blurb: "Linear regression: the answer is a number, the model is a learned line.",
        topic: "ml-foundations",
        skillIds: ["regression-basics", "loss-functions"],
        capability: "Explain what a fitted line is, what its slope and intercept mean, and what minimizing error means.",
        minutes: 6,
        concept: {
          anchor: "Lay a ruler through a scatter of dots on graph paper until it tracks the middle of the crowd.",
          what: "**Linear regression** predicts a number by learning the straight line that best fits past examples — its **slope** and **intercept** are the entire model.",
          why: "It turns prediction into geometry: errors become visible gaps to the line, and 'learning' becomes 'slide and tilt until the total squared error can't shrink'.",
          where: [
            "**Price estimates** — cost per m² learned from past sales",
            "**Demand forecasting** — sales from season, price, and ad spend",
            "**Delivery ETAs** — minutes from distance and traffic",
          ],
          whenNot:
            "Wrong tool when the relationship **isn't roughly linear** (learning curves, saturation effects) or when you need a **category** — that's classification, even if it feels numeric.",
        },
        prose: [
          "Regression answers **how much** questions: how many minutes, how many rupees, how many degrees. The simplest regression model draws a straight line through your past examples and reads new answers off it.",
          "'Best fit' has a precise meaning. For every example, measure the gap between what the line says and what actually happened. **Square each gap** (so misses below and above the line count the same, and big misses hurt more), then add all the squares up. Written down, the objective is `min Σ(yᵢ − ŷᵢ)²` — least squares. The best line is the one where that total can't be reduced by any small slide or tilt.",
          "The payoff is interpretability. The slope of a price line literally means *'each extra m² adds this many rupees'*. That is why banks, insurers, and economists still try linear regression first, before anything fancier.",
        ],
        exercise: {
          id: "ex1",
          title: "Read a prediction off the line",
          prompt:
            "A fitted line is price = slope × size + intercept. The learned slope and intercept are wrong — fix them so every test case passes.",
          starterCode: `def predict_price(size_m2: float) -> float:
    """Price in lakh, from the fitted line."""
    slope = 0.5      # <-- wrong
    intercept = 3.0  # <-- wrong
    return slope * size_m2 + intercept
`,
          testCode: `
cases = [(60, 39.0), (82, 44.6), (100, 49.0)]
ok = True
message = "ok"
for size, expected in cases:
    got = predict_price(size)
    if abs(got - expected) > 0.01:
        ok = False
        message = f"predict_price({size}) -> {got}, expected {expected}"
        break
`,
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A bike-share team fits a linear regression: rides = 40 + 12 × (degrees above 15°C). Tomorrow is 25°C. What does the model predict, and what does the 12 mean?",
            choices: [
              { id: "a", label: "160 rides; each extra degree above 15 adds about 12 rides" },
              { id: "b", label: "340 rides; 12 is the prediction for tomorrow" },
              { id: "c", label: "160 rides; 12 is the baseline when it's freezing" },
              { id: "d", label: "52 rides; 12 is the number of bikes" },
            ],
            answer: "a",
            explanation:
              "40 + 12 × 10 = 160. The slope 12 is the per-degree effect — the line rises 12 rides for each additional degree. The intercept 40 is the baseline at exactly 15°C.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "An analyst fits study-hours vs exam-score with a straight line and reports 95% fit. A colleague objects: 'past 8 hours, scores plateau — nobody scores 140%.' What's the honest diagnosis?",
            choices: [
              { id: "a", label: "The linear model extrapolates into a region where the true relationship bends — a straight line is the wrong shape here" },
              { id: "b", label: "95% fit is impossible, so the calculation is buggy" },
              { id: "c", label: "Study hours are not a number, so regression can't apply" },
              { id: "d", label: "The model is fine — real scores above 100% just need more data" },
            ],
            answer: "a",
            explanation:
              "A line is a strong assumption. Within the studied range it may fit well. But extrapolated past 8 hours, it keeps rising into nonsense. The plateau (nonlinearity) is exactly the 'when NOT' boundary of linear regression.",
          },
        ],
      },
      {
        slug: "logistic-regression",
        title: "Yes/no as a probability",
        blurb: "Logistic regression: a weighted score squashed into a confidence between 0 and 1.",
        topic: "ml-foundations",
        skillIds: ["logistic-regression", "classification-basics"],
        capability: "Explain how a weighted sum becomes a probability, and why the decision cutoff is a business choice.",
        minutes: 6,
        concept: {
          anchor: "Linear regression's S-curve: the evidence still adds up, but the sigmoid squashes the sum into a probability.",
          what: "**Logistic regression** scores the evidence for a class with a weighted sum, then squashes it through an **S-curve (sigmoid)** into a probability between 0 and 1.",
          why: "Probabilities are honest. They can say *probably fine* and *almost certainly spam*, while a hard cutoff can't. They also make the cost of each mistake visible before you choose where to cut.",
          where: [
            "**Spam filters** scoring mail as P(spam)",
            "**Credit risk** models scoring P(default)",
            "**Churn models** scoring P(cancels this month)",
          ],
          whenNot:
            "Wrong when the answer is a **quantity** (use linear regression). Also wrong when nobody can choose the decision threshold. A raw probability nobody acts on is a report, not a model.",
        },
        prose: [
          "Despite the name, logistic regression is a **classifier**. It weighs each feature's evidence and adds it up into one score. Then it bends that score through an S-curve, so any input — however extreme — lands between 0 and 1.",
          "The S-curve itself is `σ(z) = 1/(1+e⁻ᶻ)`, squashing any weighted sum into (0, 1). The shape is the point. Far from the boundary, the curve flattens near 0 or 1 (confident). Near the boundary, it passes through 0.5 (honestly unsure). The model learns one weight per feature, exactly like linear regression learns a slope. Kirana Pay's fraud score is exactly this: a P(fraud) off the S-curve, with the cutoff priced by the business — the model proposes, the costs decide.",
          "The 0.5 line is a default, not a law. A fraud team may only act above 0.9 (expensive investigations); a screening tool may flag above 0.2 (missing a case is catastrophic). **The model provides belief; the cutoff prices the mistakes** — and that's a business decision the model can't make for you.",
        ],
        diagram: {
          kind: "compare",
          left: { title: "Linear regression", subtitle: "answer is a number" },
          right: { title: "Logistic regression", subtitle: "answer is a probability" },
          rows: [
            { label: "Where to use", left: "Predicting price, minutes, demand", right: "Spam, churn, fraud — yes/no with confidence" },
            { label: "Output range", left: "any number (−∞ … +∞)", right: "0 … 1, read as a probability" },
            { label: "When NOT to use", left: "when the answer is a category", right: "when the answer is a quantity" },
          ],
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A hospital's sepsis-alert model outputs P(sepsis). Doctors currently act at 0.5. Leadership proposes moving the cutoff to 0.2 after two missed cases. What will definitely increase?",
            choices: [
              { id: "a", label: "Recall — fewer missed sepsis cases, at the price of more false alarms" },
              { id: "b", label: "Precision — the alerts will be more accurate on average" },
              { id: "c", label: "Both precision and recall always rise together" },
              { id: "d", label: "Nothing — the cutoff doesn't change the model" },
            ],
            answer: "a",
            explanation:
              "Lowering the threshold catches more true cases (recall up) but sweeps in more patients who were fine (false positives up, precision down). The trade is priced by which mistake hurts more — in screening, missing sepsis is the costly one.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Your churn model outputs P(cancels) = 0.62 for a customer. A stakeholder asks: 'So it's basically a coin flip?' What's the accurate response?",
            choices: [
              { id: "a", label: "No — 0.62 means the evidence puts this customer clearly on the churn side of the 0.5 boundary, though not overwhelmingly" },
              { id: "b", label: "Yes — anything near 0.6 is random guessing" },
              { id: "c", label: "No — 0.62 means a 62% chance the model itself is wrong" },
              { id: "d", label: "Yes — probabilities only matter at exactly 0 or 1" },
            ],
            answer: "a",
            explanation:
              "The probability is about the customer, not the model. 0.62 is a moderate, actionable tilt toward churn — the S-curve's honest-unsure zone near the boundary. Confusion of P(event) with P(model correct) is the classic misreading.",
          },
        ],
      },
      {
        slug: "loss-functions",
        title: "How wrong is wrong?",
        blurb: "Loss functions turn mistakes into one number that training can shrink.",
        topic: "ml-mechanics",
        skillIds: ["loss-functions"],
        capability: "Distinguish squared error from cross-entropy and explain why confident-and-wrong is punished hardest.",
        minutes: 6,
        concept: {
          anchor: "Like a game where misses cost points — and one huge miss costs far more than two small ones.",
          what: "A **loss function** scores a prediction's wrongness as one number — **squared error** for numeric predictions, **cross-entropy** for probabilities.",
          why: "'Sort of wrong' can't be optimized. A loss number gives gradient descent a direction: **training is loss going down**, and the loss's shape decides what 'better' even means.",
          where: [
            "**Delivery ETAs** trained on squared error — big misses punished super-linearly",
            "**Spam classifiers** trained on cross-entropy — calibrated confidence",
            "**Every model you will ever train** — the loss choice is a design decision",
          ],
          whenNot:
            "Don't optimize loss you can't afford. If the business cost of errors is **asymmetric** (a missed fraud costs 1000× a false alarm), a plain loss quietly optimizes the wrong thing. Reweight it.",
        },
        prose: [
          "Every training loop needs one question answered continuously: *given this prediction and this truth, how bad was that?* The loss function answers with a number. Bigger number, bigger bad.",
          "For numbers, **squared error** — the gap, squared. Squaring does two jobs. It makes under- and over-predictions count equally (negative gaps become positive). And it makes one terrible prediction hurt more than several small ones (off by 10 costs 25× off by 2).",
          "For probabilities, **cross-entropy** — minus the log of the probability the model gave the truth. Logs make the punishment asymmetric: saying 0.99 on a wrong answer costs 4.6, saying 0.55 costs 0.6. The model learns not just to be right, but to **know how right** — that's what keeps probabilities calibrated.",
        ],
        exercise: {
          id: "ex1",
          title: "Score a batch of misses",
          prompt:
            "mean_squared_error should return the average of squared gaps between predictions and truth. One operator is wrong — fix it.",
          starterCode: `def mean_squared_error(preds, truth):
    """Average squared gap over a batch."""
    total = 0.0
    for p, t in zip(preds, truth):
        total += (p - t) ** 0.5   # <-- wrong
    return total / len(preds)
`,
          testCode: `
cases = [
    ([31.0, 25.0], [25.0, 25.0], 18.0),
    ([1.0, 2.0, 3.0], [2.0, 2.0, 2.0], 0.6666666666666666),
]
ok = True
message = "ok"
for preds, truth, expected in cases:
    got = mean_squared_error(preds, truth)
    if abs(got - expected) > 1e-9:
        ok = False
        message = f"mse({preds}, {truth}) -> {got}, expected {expected}"
        break
`,
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Two ETA models each miss by 5 minutes on average. Model A misses every trip by exactly 5; Model B nails 90% of trips and blows 50 minutes on the rest. Under squared error, which is worse, and why does anyone care?",
            choices: [
              { id: "a", label: "B — squaring punishes the 50-minute blowups (2500 each) far more than many small fives (25 each)" },
              { id: "b", label: "A — consistency is worth less than occasional brilliance" },
              { id: "c", label: "Equal — the average miss is the same, so the loss is the same" },
              { id: "d", label: "Neither — squared error ignores direction and size" },
            ],
            answer: "a",
            explanation:
              "Squared error is deliberately non-linear about size: many small misses are cheap, rare huge ones are expensive. If users forgive ±5 minutes but get angry at 50, the loss and the business agree — choose it deliberately.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A weather app's model says P(rain) = 0.95; it doesn't rain. Under cross-entropy, how does this compare to saying P(rain) = 0.60 and being wrong?",
            choices: [
              { id: "a", label: "0.95-wrong costs about 5× more — cross-entropy punishes confidence in proportion to how wrong it was" },
              { id: "b", label: "Identical cost — a miss is a miss" },
              { id: "c", label: "0.60-wrong costs more — hedging is penalized" },
              { id: "d", label: "Neither is scored — cross-entropy only applies to regression" },
            ],
            answer: "a",
            explanation:
              "Cross-entropy is −log(P given to truth): −log(0.05) ≈ 3.0 versus −log(0.40) ≈ 0.92. Confident-and-wrong is the worst mistake — which is exactly what teaches models to stay honestly unsure at the boundary.",
          },
        ],
      },
      {
        slug: "gradient-descent",
        title: "Learning by walking downhill",
        blurb: "Gradient descent: feel the slope, step the other way, repeat — and the learning rate decides everything.",
        topic: "optimisation",
        skillIds: ["gradient-descent", "loss-functions"],
        capability: "Explain the update rule, feel the learning-rate trade-off, and say why this loop powers every network.",
        minutes: 7,
        concept: {
          anchor: "Feel the tilt under your boots in the fog, step that way, repeat until the ground flattens out.",
          what: "**Gradient descent** minimizes loss by repeating one step: `θ ← θ − η∇L`, move each parameter against the slope, scaled by the learning rate. The **step-to-curvature ratio** decides whether the walk converges at all.",
          why: "It's the only learning algorithm most models need. The same loop tunes a line's slope, a forest's splits, and a billion-weight transformer. And because the rate is the only term you control, a bad one doesn't degrade the model — it *fails* training.",
          where: [
            "**Every neural network** trained today — this exact loop, at scale",
            "**Logistic/linear regression** on large datasets",
            "**The learning-rate schedule** — the first knob any practitioner tunes",
          ],
          whenNot:
            "It needs a **differentiable loss** and only finds a *local* minimum — flat landscapes (no slope), discrete choices (tree splits), or tiny clean datasets often have better specialized solvers.",
        },
        prose: [
          "Start from the one line every training loop contains: `θ ← θ − η∇L` — each step moves a parameter by the learning rate times the slope under it. Two facts follow from that line alone. First, the slope is not constant — it changes as you move. So a step sized for *here* is wrong for *there*. Second, near a minimum the surface flattens, so the same step now covers a larger fraction of the remaining distance.",
          "Put those together and one ratio decides everything: **step size versus local curvature**. If a step is large relative to the curvature, you cross the valley floor and land on the rising far wall — *higher* than you started. Repeat and the loss oscillates, then explodes. Make the step tiny instead and nothing bad happens — you simply crawl, shaving a fixed sliver off the error each epoch. Both failures are the same ratio, wrong in opposite directions.",
          "Now the conclusion is clear: the **learning rate** is the most important single number in deep learning. It is the *only* term in the update that sets the step-to-curvature ratio. A bad rate doesn't make the model slightly worse — it makes training fail: frozen at one end, exploding at the other. When a network 'won't train', the rate is the first suspect, always. Kirana Pay's training log records exactly this. Targets rescaled rupees → paise steepened the slopes ~100× overnight. A converging run started bouncing until the rate followed the curvature.",
        ],
        diagram: {
          kind: "flow",
          steps: [
            { kind: "input", text: "Current parameter values" },
            { kind: "process", text: "Compute the loss slope (gradient)" },
            { kind: "process", text: "Step opposite the slope × learning rate" },
            { kind: "decision", text: "Loss still improving?" },
            { kind: "output", text: "Converged: parameters at the valley floor" },
          ],
          loop: "still improving → take another step with the same weights",
        },
        exercise: {
          id: "ex1",
          title: "Take one step downhill",
          prompt:
            "For loss f(x) = (x − 6)², one gradient step is x ← x − rate × slope, where slope = 2 × (x − 6). The formula has two bugs — fix them so the steps land where they should.",
          starterCode: `def step(x: float, rate: float) -> float:
    """One gradient-descent step for f(x) = (x - 6)^2."""
    slope = 2 * x          # <-- wrong
    return x + rate * slope  # <-- wrong
`,
          testCode: `
cases = [(0.0, 0.4, 4.8), (4.8, 0.4, 5.92), (0.0, 0.05, 0.6)]
ok = True
message = "ok"
for x, rate, expected in cases:
    got = step(x, rate)
    if abs(got - expected) > 1e-9:
        ok = False
        message = f"step({x}, {rate}) -> {got}, expected {expected}"
        break
`,
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A team's training log shows loss 2.486 → 2.484 → 2.483 → 2.482 over four epochs. It IS falling, barely. Diagnosis and cheapest fix?",
            choices: [
              { id: "a", label: "Learning rate too small — the walk is crawling; raise the rate (or use a schedule) before touching the model" },
              { id: "b", label: "Learning rate too large — lower it further" },
              { id: "c", label: "The model has converged perfectly; ship it" },
              { id: "d", label: "The loss function is wrong; switch to accuracy" },
            ],
            answer: "a",
            explanation:
              "A slow, steady descent is the signature of a tiny step size. Each step removes a fixed small fraction of the remaining error. Raising the rate multiplies progress per step — try that before any expensive redesign.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Another team rescales their regression targets from dollars to cents — losses are now ~10,000× larger and the slopes ~100× steeper. The loss that converged before now goes 2.1 → 2.4 → 1.9 → 2.6, bouncing. Which step of the derivation broke, and what's the cheapest fix?",
            choices: [
              { id: "a", label: "The step-to-curvature ratio: steeper slopes with the same rate make every step overshoot — lower the rate (or rescale the targets) so steps shrink with the curvature" },
              { id: "b", label: "The gradient's direction flipped when the units changed — negate the gradient" },
              { id: "c", label: "Nothing broke — loss must get worse before it gets better at this scale" },
              { id: "d", label: "The model needs more layers to represent larger numbers" },
            ],
            answer: "a",
            explanation:
              "Same rate, steeper valley: each step is now oversized relative to the curvature. It crosses the floor and climbs the far wall — the oscillation signature. The rate's whole job is this ratio; shrinking it (or rescaling the loss) restores convergence. The widget in this lesson shows exactly this trajectory.",
          },
        ],
      },
      {
        slug: "neural-network-basics",
        title: "Inside a neuron",
        blurb: "A neuron is a weighted sum plus a gate — stacked into layers that build features from features.",
        topic: "deep-learning",
        skillIds: ["neural-network-basics", "ai-ml-dl"],
        capability: "Walk through a neuron's math and explain why activations are what make depth work.",
        minutes: 7,
        concept: {
          anchor: "A neuron is a row of volume knobs feeding one gate; stack rows and simple bends become shapes.",
          what: "A **neuron** computes `σ(Σ wᵢ·xᵢ + b)` — a **weighted sum plus a bias, squeezed through a nonlinear activation** (the gate). Networks are layers of these feeding each other.",
          why: "The gate is the whole trick: without nonlinearities, any stack of weighted sums mathematically collapses into **one** weighted sum — depth would add nothing. Gates let layers build **combos of combos**: curves, boundaries, concepts.",
          where: [
            "**Face recognition** — edges → shapes → faces, learned automatically",
            "**Fraud scoring** — layered combinations of amount, velocity, device",
            "**LLMs** — attention layers feeding gated neurons, at billion scale",
          ],
          whenNot:
            "For small tabular datasets a network is usually **overkill** — a forest or logistic regression trains faster, needs less data, and explains itself. Depth earns its cost on raw, high-dimensional signal.",
        },
        prose: [
          "Strip the mystique: one neuron is linear regression with a gate after it — `σ(Σ wᵢ·xᵢ + b)`. Each input is multiplied by its **weight**, and the results are summed with a **bias**. The total is then bent through an **activation function** — classically an S-curve, today often ReLU (keep positives, zero the rest).",
          "Why must the gate exist? Derive it. A weighted sum of a weighted sum is still a weighted sum. Compose two linear maps and the algebra collapses them into one (multiply the matrices; you get a matrix). So a 50-layer network of pure sums is *exactly* one weighted layer in disguise: you pay for depth and receive none. The only escape is something nonlinear between the layers. Bent functions compose into shapes no single straight boundary can draw, and **bends of bends** can approximate any curve. That is what the activation buys, and it is why depth works — not scale, geometry.",
          "What do layers actually learn? On images: early neurons fire for edges, deeper ones for textures, deeper still for object parts. Nobody assigns these roles — gradient descent turns the dials until each layer's output happens to help the next. **Features are learned, not designed** — the deep-learning promise in one sentence. And Kirana Pay's churn table — 900 merchants, 20 tidy columns — is exactly where this lesson's boundary bites. The month-one review declined a deep net there on evidence.",
        ],
        exercise: {
          id: "ex1",
          title: "Prove the collapse",
          prompt:
            "Two linear layers with no activation should collapse into ONE equivalent matrix — this is why gates must exist. compose() applies the layers in the wrong order; fix it so composing equals doing them one after the other.",
          starterCode: `def compose(W1, W2):
    """Two stacked linear layers, no activation: return the ONE matrix that does the same job."""
    return W1 @ W2          # <-- wrong order: W1 runs first, then W2
`,
          testCode: `
def mv(M, v):
    return [sum(m * u for m, u in zip(row, v)) for row in M]

W1 = [[1.0, 2.0], [3.0, 4.0]]
W2 = [[5.0, 6.0], [7.0, 8.0]]
x = [1.0, -1.0]
got = mv(compose(W1, W2), x)
expected = mv(W2, mv(W1, x))   # apply W1, then W2
ok = True
message = "ok"
if any(abs(g - e) > 1e-9 for g, e in zip(got, expected)):
    ok = False
    message = f"compose applied to x -> {got}, expected {expected}"
`,
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "An engineer removes all activation functions from a 20-layer network 'to simplify the math'. What capability is destroyed?",
            choices: [
              { id: "a", label: "Expressive power — 20 layers of pure weighted sums collapse into the equivalent of one linear layer" },
              { id: "b", label: "None — activations are only for visualization" },
              { id: "c", label: "Only speed — the model still learns curves, just slower" },
              { id: "d", label: "The ability to have more than one input" },
            ],
            answer: "a",
            explanation:
              "A linear function of a linear function is linear. Without gates, depth is an illusion — the whole network computes one weighted sum, incapable of curved boundaries regardless of how many layers you pay for.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Your team has 900 rows of customer data (20 columns) to predict upgrade-or-not. A new hire proposes a 30-layer network. Based on when neural networks are worth it, what's the better first move?",
            choices: [
              { id: "a", label: "Start with logistic regression or a small forest — small structured data rarely justifies depth; upgrade only if they plateau" },
              { id: "b", label: "Approve the 30-layer network — more layers always fit small data better" },
              { id: "c", label: "Refuse networks forever on this dataset — they never work on tables" },
              { id: "d", label: "Use the network but with all activations removed, to keep it simple" },
            ],
            answer: "a",
            explanation:
              "Depth pays on raw, high-volume signal (pixels, audio, text) where features must be learned. On 900 tidy rows it mostly memorizes noise (variance!) while a simple model trains in seconds and explains itself. Start simple, escalate on evidence.",
          },
        ],
      },
      {
        slug: "backpropagation-intuition",
        title: "Blame, assigned backwards",
        blurb: "Backpropagation: the guess flows forward, the error flows back, every dial gets its nudge.",
        topic: "deep-learning",
        skillIds: ["backpropagation", "neural-network-basics"],
        capability: "Trace how a prediction's error is assigned back to individual weights and turned into updates.",
        minutes: 7,
        concept: {
          anchor: "Like a coach replaying the lost play in slow motion, telling each player exactly what to fix.",
          what: "**Backpropagation** runs the network forward to get a prediction and its loss. Then it applies the **chain rule backward**, so every weight receives its share of the blame — its **gradient**.",
          why: "A network has millions of weights and one loss. Without an efficient blame-assignment scheme, tuning would be guesswork; with it, gradient descent gets an exact direction for **every dial at once**.",
          where: [
            "**Every deep-learning framework** — one `loss.backward()` call",
            "**Transfer learning** — gradients flow into reused layers too",
            "**The 'why is training slow/expensive' question** — this pass is the bulk of the compute",
          ],
          whenNot:
            "Backprop needs a **differentiable** path from loss to weights — discrete steps, hard rules, and non-differentiable rewards need other tricks (that's where RL's gradient workarounds begin).",
        },
        prose: [
          "A network commits to a guess; the loss puts a number on how wrong it was. The question that makes learning possible: *of all the thousands of dials inside, which ones caused it?* Backpropagation answers with bookkeeping.",
          "It walks the error backward along the same paths the signal took forward. The output layer asks 'how much should I have differed?' Each connection passes a share of that error back, scaled by how much it amplified or dampened the signal. This is the chain rule, applied layer by layer, until every weight holds its own gradient: *nudge me this much, this direction*.",
          "One training step is then complete: forward (guess), loss (score), backward (blame), nudge (gradient descent). Repeat across thousands of batches and the nudges compound from noise into structure. When you read that training a frontier model took a month on ten thousand GPUs, remember: this loop, and nothing fancier, is what ran.",
        ],
        exercise: {
          id: "ex1",
          title: "Check a gradient by definition",
          prompt:
            "The definition never lies: a gradient is the limit of (loss(w+ε) − loss(w−ε)) / 2ε. For f(w) = (w·x − y)², analytic_grad is missing a factor — fix it until it matches the numerical check.",
          starterCode: `def analytic_grad(w, x, y):
    """Gradient of f(w) = (w * x - y) ** 2 with respect to w."""
    return (w * x - y) * x          # <-- missing a factor of 2? or wrong shape? check against the definition
`,
          testCode: `
def f(w):
    return (w * x - y) ** 2

eps = 1e-6
ok = True
message = "ok"
for w, x, y in [(2.0, 3.0, 5.0), (-1.5, 0.5, 2.0), (0.0, 7.0, 1.0)]:
    numerical = (f(w + eps) - f(w - eps)) / (2 * eps)
    analytic = analytic_grad(w, x, y)
    if abs(numerical - analytic) > 1e-4:
        ok = False
        message = f"analytic_grad({w}, {x}, {y}) -> {analytic}, definition says {numerical}"
        break
`,
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "After a backward pass, one weight has gradient almost exactly 0 while another has a large gradient. What does that tell you about the coming update?",
            choices: [
              { id: "a", label: "The zero-gradient weight barely influenced this error and will barely move; the large-gradient weight gets the biggest nudge" },
              { id: "b", label: "The zero-gradient weight is broken and should be deleted" },
              { id: "c", label: "Both weights always move by the same amount — gradients only set direction" },
              { id: "d", label: "The large-gradient weight is the most accurately trained one" },
            ],
            answer: "a",
            explanation:
              "The gradient is proportional contribution to the error. A near-zero gradient means this dial barely moved the signal that ended up wrong — the update leaves it almost untouched. Blame, exactly proportioned.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A teammate claims backpropagation is a second learning algorithm that runs after gradient descent finishes. What's the correction?",
            choices: [
              { id: "a", label: "They're two halves of one step — backprop computes each weight's gradient; gradient descent uses those gradients to update. Neither completes alone" },
              { id: "b", label: "Correct — backprop re-trains the model after deployment" },
              { id: "c", label: "Backprop replaces the loss function during testing" },
              { id: "d", label: "Gradient descent computes gradients; backprop applies them" },
            ],
            answer: "a",
            explanation:
              "The division of labor: backprop = blame computation (the chain-rule pass producing gradients), gradient descent = the update rule (weights -= rate × gradient). Every training step does both — forward, loss, backward, nudge.",
          },
        ],
      },
      {
        slug: "bias-variance-tradeoff",
        title: "The Goldilocks diagnosis",
        blurb: "Bias–variance: two error numbers tell you which way your model is broken — and which cure it needs.",
        topic: "evaluation",
        skillIds: ["bias-variance", "overfitting", "train-test-split"],
        capability: "Diagnose underfitting vs overfitting from train/test errors and prescribe the right fix.",
        minutes: 6,
        concept: {
          anchor: "Study score versus fresh-exam score — two numbers tell you if the student crammed or never learned.",
          what: "**Bias–variance** is the diagnosis from two numbers: error on training data and error on held-out data. **High both = bias** (too simple); **low train + high test = variance** (memorized).",
          why: "The two failures have **opposite cures** — more complexity for bias, less complexity or more data for variance. Misdiagnose and you'll make the disease worse while 'tuning'.",
          where: [
            "**Model selection** — depth of tree, size of network, degree of polynomial",
            "**Model cards and reviews** — train/test gaps reported as evidence",
            "**'Should we get more data?'** — the answer is variance-shaped, not always yes",
          ],
          whenNot:
            "On tabular problems with strong ensembles the trade-off shifts — boosted trees walk the U-curve automatically, and with enough data both errors can fall together. Treat it as a diagnosis, not a fixed law.",
        },
        prose: [
          "The formal version needs no pictures — just two numbers. Score the model on the data it trained on, and on data it has never seen.",
          "**High error on both** is bias: the model is too simple to capture the pattern even in the material it studied — underfitting. **Tiny training error with a wide gap to test error** is variance: it memorized quirks of the study material that don't exist in the wild — overfitting. The gap itself is the tell.",
          "The cures are opposite. Bias wants capacity: more features, deeper trees, bigger networks. Variance wants restraint: more data, simpler models, regularization. This is why 'add more layers' and 'get more data' are answers to *different* diseases — and why diagnosing before prescribing is the actual skill.",
        ],
        diagram: {
          kind: "compare",
          left: { title: "Underfitting", subtitle: "high bias" },
          right: { title: "Overfitting", subtitle: "high variance" },
          rows: [
            { label: "Train error", left: "high — can't even fit what it studied", right: "very low — aced the study material" },
            { label: "Test error", left: "high — and close behind train", right: "high — with a wide gap vs train" },
            { label: "The cure", left: "add capacity: features, depth, size", right: "restrain: data, simplicity, regularization" },
          ],
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A model reports 0.5% error on training data and 24% on the test set. Before anyone proposes a fix, what's the diagnosis?",
            choices: [
              { id: "a", label: "High variance — it memorized the training data; more capacity would make it worse" },
              { id: "b", label: "High bias — the model is too simple for the task" },
              { id: "c", label: "Healthy — training is supposed to be much easier" },
              { id: "d", label: "Data leakage — the test set is contaminated" },
            ],
            answer: "a",
            explanation:
              "The near-zero train error with a huge test gap is the variance signature: rules fitted to noise that doesn't repeat. The cure is restraint or more data — adding capacity deepens the memorization.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Team A's model shows 30% train / 32% test error; Team B's shows 31% train / 60% test. Both leads ask for 'a bigger model'. Who will the upgrade actually help?",
            choices: [
              { id: "a", label: "Team A — high bias means capacity is the bottleneck; Team B's variance would explode with a bigger model" },
              { id: "b", label: "Team B — a bigger model closes the train–test gap" },
              { id: "c", label: "Both — bigger models fix all error" },
              { id: "d", label: "Neither — error can only be fixed by more labels" },
            ],
            answer: "a",
            explanation:
              "Team A is uniformly underfit — more capacity gives the pattern room to be learned. Team B is already overfit; capacity is the disease, not the cure. Same request, opposite correctness — which is the entire point of diagnosing first.",
          },
        ],
      },
      {
        slug: "ensemble-methods",
        title: "Committees of weak models",
        blurb: "Random forests and gradient boosting: many weak models, mistakes that cancel, one strong committee.",
        topic: "ml-models",
        skillIds: ["ensemble-methods", "decision-trees", "bias-variance"],
        capability: "Explain bagging vs boosting, and choose the right ensemble (or none) for a problem.",
        minutes: 7,
        concept: {
          anchor: "Ask five friends to guess the jellybeans in a jar and average their answers — the crowd beats the loner.",
          what: "An **ensemble** combines many weak models into one committee. **Bagging** (random forest) grows independent models on random data slices and averages them. **Boosting** grows models in sequence, each fixing its predecessors' mistakes.",
          why: "Independent mistakes **cancel** when averaged, so many high-variance models can share one low-variance answer. And sequentially targeting residuals removes bias step by step. This is why ensembles still win most tabular competitions.",
          where: [
            "**Fraud / credit scoring** — gradient-boosted trees on tabular features",
            "**Kaggle and ML benchmarks** on structured data — the default winner",
            "**Random forest as a robust baseline** — hard to overfit, few knobs",
          ],
          whenNot:
            "On raw perception data (pixels, audio, text) trees can't learn features from scratch — neural networks take over. And ensembles cost **interpretability and latency**: 500 votes are harder to explain and slower than one model.",
        },
        prose: [
          "One deep decision tree is a sharper memorizer: fit razor-thin rules to the exact rows it saw, noise included. Shake the data slightly and the rules rewrite themselves. But that weakness — *each tree is wrong somewhere different* — becomes the ensemble's fuel.",
          "**Bagging** (bootstrap aggregating) exploits it directly, and the arithmetic says why it must work. Train each tree on a random slice of rows with a random subset of features, so each tree overfits to *different* noise. Averaging k estimates with independent errors shrinks the noise term as **σ²/k** — 100 trees cut variance a hundredfold. The true signal, which every tree sees, passes through untouched. That's a **random forest**: variance, averaged away. The same σ²/k also predicts the ceiling: the curve flattens as k grows (1/k marches toward zero). And if the errors *correlate* — same rows, same features — nothing cancels at all. So `n_estimators` helps sublinearly, and decorrelation (`max_features`) is the real lever.",
          "**Boosting** runs the opposite direction: trees are grown **in sequence**. Each new small tree trains on the current committee's residual errors, then joins with a gentle weight. Bias, removed chip by chip. Gradient boosting machines (XGBoost, LightGBM) remain the tool to beat on tabular business data — a surprising fact for deep-learning enthusiasts. At Kirana Pay, a random forest is the shipped fraud baseline — the artifact the month-one review defends first.",
        ],
        diagram: {
          kind: "compare",
          left: { title: "Bagging · random forest", subtitle: "parallel, independent" },
          right: { title: "Boosting · gradient boosting", subtitle: "sequential, corrective" },
          rows: [
            { label: "Where to use", left: "high-variance models (deep trees); want robustness", right: "high-bias models (stumps); want maximum accuracy" },
            { label: "How trees relate", left: "independent — random slices, averaged votes", right: "each tree trains on the previous ones' errors" },
            { label: "When NOT to use", left: "when interpretability or latency matters most", right: "small noisy data — the sequence can memorize; needs careful tuning" },
          ],
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Your random forest's individual trees each score 78% on held-out data, but their averaged prediction scores 91%. A stakeholder asks how 78s become a 91. What's the explanation?",
            choices: [
              { id: "a", label: "Each tree is wrong on different rows; where one is wrong, others tend to be right, so majority noise cancels while shared signal adds up" },
              { id: "b", label: "The averaging code secretly retrains the trees on the test set" },
              { id: "c", label: "Each tree improves to 91% once it learns it will be averaged" },
              { id: "d", label: "78% was measured wrong; the trees were always at 91%" },
            ],
            answer: "a",
            explanation:
              "Independence is the magic: errors that don't correlate partially cancel in the vote, signal that everyone shares reinforces. This is exactly why bagging works — and why it needs the trees to be *different* (random slices and features).",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A teammate's random forest plateaus: raising `n_estimators` from 100 to 400 barely moves held-out accuracy. Inspection shows `max_features=1.0` — every tree saw every feature, and aside from row-noise the trees make the same mistakes. Which step of the averaging argument broke, and what's the fix?",
            choices: [
              { id: "a", label: "The independence rung — with identical inputs the errors correlate, so averaging has nothing to cancel; lower max_features so the trees genuinely differ" },
              { id: "b", label: "The σ²/k rung — 400 trees should cut variance 4× versus 100; the maths failed, switch libraries" },
              { id: "c", label: "Bagging needs at least 1,000 trees before the average kicks in" },
              { id: "d", label: "The trees are individually too weak — deepen each one until it is right alone" },
            ],
            answer: "a",
            explanation:
              "σ²/k only cancels *independent* errors. Same rows and same features → same mistakes → the k in the denominator divides nothing. Decorrelation is the lever bagging actually runs on — which is exactly what the random slices and feature subsets exist to create.",
          },
        ],
      },
      {
        slug: "evaluation-metrics",
        title: "Grading honestly",
        blurb: "Accuracy lies on lopsided data. The confusion matrix, precision, recall, and cross-validation don't.",
        topic: "evaluation",
        skillIds: ["classification-metrics", "cross-validation", "train-test-split"],
        capability: "Build and read a confusion matrix, choose precision vs recall by mistake cost, and explain cross-validation.",
        minutes: 7,
        concept: {
          anchor: "A fishing net can be judged two ways: junk in the catch, and fish that slipped past it.",
          what: "Grade a classifier from its **confusion matrix** — the 2×2 of true/false positives/negatives. **Precision** = of what we flagged, how much was real; **recall** = of what was real, how much we caught.",
          why: "**Accuracy collapses on imbalance** — a 'never fraud' model scores 99% while doing nothing. Precision and recall expose the two different ways to be good, and their trade-off is a business decision, not a math one.",
          where: [
            "**Fraud / churn / disease screening** — anything with a rare positive class",
            "**Alert and moderation systems** — false alarms vs missed cases, priced",
            "**Model comparison in reports** — one matrix beats ten percentages",
          ],
          whenNot:
            "Don't chase a single 'best' metric: F1, balanced accuracy, or ROC-AUPRC each hide a different trade. Choose the metric **from the cost of each mistake** — or the grade will quietly optimize the wrong thing.",
        },
        diagram: {
          kind: "compare",
          left: { title: "Tighten the cutoff", subtitle: "flag less, surer" },
          right: { title: "Loosen the cutoff", subtitle: "flag more, wider" },
          rows: [
            {
              label: "Precision",
              left: "rises — what is flagged is more often real",
              right: "falls — more false alarms ride along",
            },
            {
              label: "Recall",
              left: "falls — real cases slip past unscored",
              right: "rises — more of the actual class is caught",
            },
            {
              label: "Where to use",
              left: "false alarms are the costly mistake — analyst hours per flag",
              right: "misses are the costly mistake — fraud, disease, churn",
            },
          ],
        },
        prose: [
          "Say 'always genuine' on payment traffic where 1% is fraud, and you're right 99 times in 100. Accuracy cannot distinguish that lazy oracle from a working model — the base rate does all the work. On any lopsided problem, accuracy is decoration.",
          "The confusion matrix refuses to hide anything: of the **actual fraud**, how much did we catch (recall)? Of what we **flagged**, how much was real (precision)? Every classifier lives on this seesaw — tighten the cutoff and precision rises while recall falls; loosen it and the reverse. Which side to weight depends on which mistake costs more: a false alarm that wastes an analyst hour, or a missed fraud that costs the customer.",
          "One more honesty layer: a single train/test split is one exam, and exams have lucky days. **Cross-validation** rotates the test fold — train on 4 parts, test on 1, five times. Every row gets graded once on material it never saw. The average score then stops depending on which 20% you happened to pick.",
        ],
        exercise: {
          id: "ex1",
          title: "Compute precision and recall",
          prompt:
            "Given the four confusion-matrix counts, precision() has swapped its formula with recall(). Fix both so the tests pass.",
          starterCode: `def precision(tp, fp, fn):
    """Of everything flagged, the fraction that was real."""
    return tp / (tp + fn)   # <-- wrong

def recall(tp, fp, fn):
    """Of everything real, the fraction that was caught."""
    return tp / (tp + fp)   # <-- wrong
`,
          testCode: `
ok = True
message = "ok"
if abs(precision(92, 138, 61) - 92 / 230) > 1e-9:
    ok = False
    message = f"precision -> {precision(92, 138, 61)}, expected {92 / 230}"
if abs(recall(92, 138, 61) - 92 / 153) > 1e-9:
    ok = False
    message = f"recall -> {recall(92, 138, 61)}, expected {92 / 153}"
`,
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A factory inspection model has precision 0.98 and recall 0.35. The quality lead says: 'Great — when it flags a defect, it's almost always real.' What is she missing?",
            choices: [
              { id: "a", label: "65% of actual defects pass uninspected — high precision with low recall means the flagged ones are real but most bad units sail through" },
              { id: "b", label: "Nothing — precision is the only metric that matters for quality" },
              { id: "c", label: "That precision 0.98 implies accuracy 0.98" },
              { id: "d", label: "That the model needs more false alarms to be safe" },
            ],
            answer: "a",
            explanation:
              "The two metrics guard different doors. Precision guards against false alarms (0.98 — excellent); recall guards against misses (0.35 — two-thirds of defects escape). Whether that's acceptable depends on the cost of a defective unit reaching a customer.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Two teams each report '90%' for their model. Team A used one 80/20 split; Team B used 5-fold cross-validation and averaged. Same number, different trust — why does the review favor Team B's?",
            choices: [
              { id: "a", label: "Five held-out exams on rotating folds average out a lucky or unlucky split; one fold can flatter or sandbag a model by several points" },
              { id: "b", label: "Cross-validation trains on more data per fold, so its score is automatically higher" },
              { id: "c", label: "Team A's score is wrong — a single split always overstates accuracy" },
              { id: "d", label: "Averaging five numbers is just more precise arithmetic" },
            ],
            answer: "a",
            explanation:
              "A single held-out fold is a sample of size one — variance in *which* rows landed in it flows straight into the score. Rotating folds makes every row take one turn being tested, so the average reflects the model, not the partition luck.",
          },
        ],
      },
      {
        slug: "data-leakage-and-imbalance",
        title: "Data leakage: too good to be true",
        blurb: "The future leaks into training, the score soars, and reality arrives — spotting the three patterns.",
        topic: "evaluation",
        skillIds: ["data-leakage", "data-quality"],
        capability: "Spot the three common leakage patterns, explain why they inflate scores, and run the time-alignment fix.",
        minutes: 7,
        concept: {
          anchor: "Studying with the answer key taped inside your notebook aces the practice test and fails the real exam.",
          what: "**Leakage** is information from the future (or from the test set) contaminating training — scores too good to be true, right up until the model meets data it can't cheat on.",
          why: "It's the most common cause of 'brilliant offline, useless online' models. And it's **invisible in the loss**: the training curve looks perfect because the model genuinely learned to read the answers.",
          where: [
            "**Any pipeline with fitted preprocessing** — scalers, encoders, imputers",
            "**Any time-series problem** — tomorrow's rows leaking into yesterday's model",
            "**Any grouped entity** — patients, merchants, sessions split across both sides",
          ],
          whenNot:
            "Not every good score is leakage — a genuinely easy problem (linearly separable, stable distribution) can honestly score 0.99. The test is *whether information existed that wouldn't exist at prediction time*, not the score itself.",
        },
        prose: [
          "The symptom pattern is unmistakable in hindsight: near-perfect offline metrics, then a live model barely better than rules. The cause is a quiet killer — and it never throws an error.",
          "**Leakage** means the training process saw information it would not have at prediction time. The classics: fitting your scaler on all rows (test averages whisper into training); a feature like `days_to_close: 0` that only exists for already-resolved cases; the same patient or session appearing on both sides of the split. Each one lets the model peek at the answers — and the score soars.",
          "The fix is always a data-flow fix, never a modelling one: remove or time-align the feature, refit preprocessing inside the training fold, split by group. Then run the 60-second audit above, every time, before any score leaves your laptop. And when the class you care about is rare, accuracy itself becomes the trap. That's the next lesson.",
        ],
        diagram: {
          kind: "decision",
          root: {
            kind: "decision",
            question: "Your offline score is spectacular. Is it real?",
            branches: [
              {
                label: "feature knows something only knowable AFTER the label",
                node: { kind: "leaf", answer: "Leakage — remove or time-align the feature" },
              },
              {
                label: "anything fitted on all data before the split",
                node: { kind: "leaf", answer: "Leakage — refit on train only" },
              },
              {
                label: "same entity in train AND test",
                node: { kind: "leaf", answer: "Leakage — split by group" },
              },
            ],
          },
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A loan-default model trains on features including `months_since_last_default`. The label is 'defaults within 90 days of application'. Offline AUC: 0.96. On fresh applications it collapses. The feature's values are only filled in for customers who already had a default recorded after applying. What happened?",
            choices: [
              { id: "a", label: "Leakage — the feature encodes the future outcome; rows where it's filled are already marked, so the model reads the answer off a feature" },
              { id: "b", label: "Imbalance — defaults are rare, so the AUC was meaningless" },
              { id: "c", label: "Overfitting — a smaller model would generalize the same features" },
              { id: "d", label: "Concept drift — the market changed between training and launch" },
            ],
            answer: "a",
            explanation:
              "The rule: at prediction time (application moment), that value doesn't exist yet. A feature only populated by post-outcome events is the label in disguise — textbook leakage, and the 0.96 was the model reading its own answer sheet.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A team fits their scaler and one-hot encoder on the full dataset before the 80/20 split. Cross-validated AUC: 0.99. The same pipeline live: 0.71. Which leakage pattern is this, and what's the fix?",
            choices: [
              {
                id: "a",
                label: "Fitted-preprocessing leakage — test-set statistics whispered into training; refit everything inside the training fold (a Pipeline) so each split sees only its own data",
              },
              {
                id: "b",
                label: "Underfitting — the 0.71 means the model is too simple; deepen it",
              },
              {
                id: "c",
                label: "Concept drift between the validation and live windows — retrain weekly",
              },
              {
                id: "d",
                label: "Nothing is wrong — cross-validated scores are always optimistic",
              },
            ],
            answer: "a",
            explanation:
              "The 0.28 gap is the fingerprint. Fitting on all rows means every fold's 'test' data already influenced the scaler/encoder the model trained under — the model peeked, honestly, at scale. The fix is structural, not parametric: preprocessing inside the fold. Note how 'cross-validation said 0.99' made it *harder* to see, not easier.",
          },
        ],
      },
      {
        slug: "class-imbalance",
        title: "Class imbalance: when 99% is nothing",
        blurb: "A rare positive class turns accuracy into decoration — grading honestly is the whole fix.",
        topic: "evaluation",
        skillIds: ["classification-metrics", "data-quality"],
        capability: "Explain why accuracy fails on rare classes, and grade with recall, precision, AUPRC, and class weights.",
        minutes: 6,
        concept: {
          anchor: "With 4 positives in 1,000, a coin glued to 'no' scores 99.6% — the base rate does all the work.",
          what: "**Imbalance** makes plain accuracy meaningless: the **base rate** answers most rows, so a do-nothing model scores ~99%. Honest grading reads the rare cells directly — **recall, precision, AUPRC** — and trains with **class weights** so each positive actually pulls.",
          why: "Accuracy weights every cell by frequency, so on a 1%-positive problem the negative cells dominate the sum. And a metric a null model can saturate tells you nothing about the class you care about.",
          where: [
            "**Fraud** — 0.5% of transactions; Kirana Pay's daily reality",
            "**Disease screening** — 4 in 1,000 patients",
            "**Churn and defect detection** — the rare event IS the product",
          ],
          whenNot:
            "Don't reach for resampling magic first — oversampling the rare class until it dominates teaches the model a fake base rate. Grade honestly, weight the loss, and price the threshold; resample only with evidence.",
        },
        diagram: {
          kind: "decision",
          root: {
            kind: "decision",
            question: "Sanity-check your metric on a rare class:",
            branches: [
              {
                label: "could a never-positive model score ~99% on it?",
                node: { kind: "leaf", answer: "Accuracy — decoration here", caption: "the base rate did it" },
              },
              {
                label: "does it read the rare cells directly?",
                node: { kind: "leaf", answer: "Recall · Precision · AUPRC", caption: "grade what you actually care about" },
              },
            ],
          },
        },
        prose: [
          "Start from how any metric is computed: counts from the 2×2 table, each cell weighted by how often it occurs. That single fact decides everything that follows.",
          "On a 1%-positive problem, the negative cells occur ~99× as often as the positive ones, so any frequency-weighted sum is dominated by them. A model that never predicts positive is scored 99%. Rung by rung: a metric the null model saturates cannot distinguish work from idleness. The fix is metrics that read the rare cells directly (recall: of actual positives, how many caught; precision: of flagged, how many real; AUPRC: the whole curve between them). And training needs class weights so the rare positives exert real pull on the loss.",
          "Then the decision is pricing, not modelling. Where the threshold sits is what a missed case costs versus a false alarm — the seesaw from the metrics lesson, now with stakes. Kirana Pay grades fraud as recall at a priced threshold and trains with class weights. That entire stack exists because the base rate is 0.5%, and accuracy would have congratulated them for doing nothing.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A medical screening dataset has 0.4% positive cases. The team boosts accuracy from 99.1% to 99.4% with a new model and wants to ship. What must they show before anyone celebrates?",
            choices: [
              { id: "a", label: "Recall and precision on the positive class — 'always healthy' already scores 99.6%, so accuracy can't distinguish a working screener from a useless one" },
              { id: "b", label: "Nothing — 0.3 points of accuracy on 0.4% positives is decisive" },
              { id: "c", label: "Only that the training loss decreased smoothly" },
              { id: "d", label: "A bigger test set — size alone fixes the imbalance problem" },
            ],
            answer: "a",
            explanation:
              "The lazy baseline scores 99.6% by saying no — both their models are *below* it on accuracy! The only metrics that can feel 4-in-1000 positives are recall/precision (or AUPRC). On rare-event problems, accuracy isn't just weak — it can rank a working model below doing nothing.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Kirana Pay's churn run: 2% of merchants churn each month. The model reports 97.6% accuracy; the never-churn baseline scores 98.0%. The team argues the model 'nearly matches the baseline, so it's learning'. What does the review actually demand?",
            choices: [
              {
                id: "a",
                label: "Grading on the churn class itself — recall, precision, AUPRC at a priced threshold; accuracy already ranks the model below doing nothing",
              },
              {
                id: "b",
                label: "More training data — accuracy will cross 98% eventually and then it's working",
              },
              {
                id: "c",
                label: "Oversample churners to 50% of the data and retrain until accuracy looks healthy",
              },
              {
                id: "d",
                label: "Ship it — matching the baseline proves the model learned the base rate",
              },
            ],
            answer: "a",
            explanation:
              "'Nearly matches the null' is a failing grade wearing a passing one. On a 2% problem, accuracy is saturated by the base rate and can move while recall sits at zero. The demand is the rare cells — and option c would teach the model a fake 50% base rate, trading an honest metric problem for a dishonest data one.",
          },
        ],
      },
      {
        slug: "kirana-pay-capstone",
        title: "Capstone: Kirana Pay's month-one review",
        blurb: "The whole course on one table — every artifact assembled, two near-misses caught, one verdict logged.",
        topic: "ml-capstone",
        skillIds: ["ensemble-methods", "classification-metrics", "gradient-descent"],
        capability: "Assemble the course's concepts into one production decision log and defend each choice against alternatives.",
        minutes: 10,
        concept: {
          anchor: "A month-one review is a recipe tasting — every lesson of this course is one dish on the table, and the menu only ships if each dish holds.",
          what: "The capstone assembles the running case: **labels from marked fraud**, a **forest baseline**, a **calibrated P(fraud) with a business-priced threshold**, an **eval weighed in missed-fraud versus analyst-hours**, and a **sealed holdout** — one system where every decision is defensible.",
          why: "Each artifact exists because a derivation forced it — the review checks the chain, not the vibes, which is why Kirana Pay's model survived its first month.",
          where: [
            "The **fraud score** — the rules engine retired after the shoot-out",
            "The **churn table** — 900 merchants, 20 columns, the deep net declined on evidence",
            "The **leakage audit** — one feature populated only after review, caught pre-ship",
          ],
          whenNot:
            "A review can only check what is measured — the holdout stays sealed and **no artifact is exempt**, including the ones that look best.",
        },
        diagram: {
          kind: "flow",
          steps: [
            { kind: "input", text: "Marked transactions", caption: "2 years of analyst labels" },
            { kind: "process", text: "Forest baseline", caption: "variance averaged away" },
            { kind: "process", text: "P(fraud) via σ(z) + priced threshold", caption: "model proposes, costs decide" },
            { kind: "decision", text: "Leakage audit + sealed holdout passed?" },
            { kind: "output", text: "Ship + monthly drift watch", caption: "retrain only on evidence" },
          ],
          loop: "monthly: drift check → retrain decision",
        },
        prose: [
          "The review walks the artifacts in shipping order, and each one traces to a lesson. Labels first: analysts marked fraud on two years of transactions, which is what makes the problem supervised at all. Then the baseline — a random forest, because σ²/k buys robustness on tabular features. Then the score: a sigmoid squashing the evidence into P(fraud), with the cutoff set by what mistakes cost, not by the model. And underneath it all, the sealed holdout — the only score nobody is allowed to tune against.",
          "Two near-misses made the month interesting. A draft feature, `refund_issued`, was populated only *after* the fraud review — a perfect correlate at train time, absent at prediction time. The offline score was measuring the leak, not the task, and the fix was a data-flow fix, not a modelling one. And when targets were rescaled rupees → paise, the slopes steepened ~100× overnight and a converging run started bouncing — same rate, new curvature. The bounce stopped only when the learning rate followed the ratio the derivation says it must track.",
          "The verdict, logged: ship the forest, the priced threshold, and the sealed holdout. Decline the 30-layer network on 900 tidy churn rows (the bias-variance artifacts say it memorizes noise). Defer storefront-photo screening until the raw-perception data arrives at volume — at which point the model-family decision legitimately reopens. That is what a month of machine learning actually produces: not a model, a chain of forced decisions with the receipts attached.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "In the month-one review, a stakeholder proposes replacing the forest with a 30-layer network trained on the same 900-row churn table, citing a convincing demo. Which artifact settles the question, and how?",
            choices: [
              {
                id: "a",
                label: "The bias-variance artifacts — 900 tidy rows invite memorized noise at that depth; demand the plateau evidence before reopening the model-family decision",
              },
              {
                id: "b",
                label: "The demo itself — if it looks better on the churn data, it is better; ship it",
              },
              {
                id: "c",
                label: "The sealed holdout — unlock it and rerun both models on it until the network wins",
              },
              {
                id: "d",
                label: "The threshold card — raise the cutoff until the network's extra capacity stops mattering",
              },
            ],
            answer: "a",
            explanation:
              "The bigger-model reflex is exactly what the artifacts exist to answer: depth pays on raw, high-volume signal, and the churn table is neither. Demos don't carry train/test splits — evidence does. And option c is the one thing a review can never do: peeking at the holdout to pick a model spends it.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Next quarter Kirana Pay adds merchant-photo screening — 200k labeled storefront images. Which entry in the month-one log must change, and why?",
            choices: [
              {
                id: "a",
                label: "The model-family decision — 200k raw images is exactly the high-volume perception regime where depth earns its cost; the 900-row logic doesn't transfer",
              },
              {
                id: "b",
                label: "Nothing — a random forest handles image pixels exactly like tabular columns",
              },
              {
                id: "c",
                label: "Only the threshold — photos need a higher cutoff than transactions",
              },
              {
                id: "d",
                label: "The holdout — image models don't need sealed evaluation data",
              },
            ],
            answer: "a",
            explanation:
              "The decline was never 'networks are banned' — it was 'not on this data'. The when-NOT boundary is conditional: change the regime (tabular → raw perception at volume) and the decision flips. That conditional reading of your own decision log is the capstone skill.",
          },
        ],
      },
    ],
};

export default course;
