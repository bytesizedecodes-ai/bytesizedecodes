/**
 * Course registry — the single source of truth for what's in each course.
 *
 * A `Lesson` points at an infographic component (registered in
 * `components/infographic/index.tsx`) AND carries the "byte" payload that turns
 * a static visual into a Hook-loop unit: prose, an optional runnable code
 * exercise, and self-check questions that gate completion and award Energy.
 *
 * This mirrors the `Byte` shape in `content/types.ts` but is a parallel system —
 * `/bytes` and `/courses` coexist without sharing content. The data layer keys
 * course-lesson progress under `course:${courseSlug}:${lessonSlug}` so it never
 * collides with `/bytes` mastery.
 *
 * Add a lesson by: (1) creating the infographic component under
 * `components/infographic/`, (2) registering it in `components/infographic/index.tsx`,
 * (3) appending an entry to the right course's `lessons` array here.
 */

import type { ByteQuestion, CodeExercise, SkillId } from "./types";

/**
 * The 4-step concept brief that opens a lesson (v5 authoring contract):
 * What / Why / Where / When NOT — each 1-2 sharp sentences, key terms in
 * **bold** (rendered through the shared Inline formatter).
 */
export type ConceptBrief = {
  /** What: the 10-second plain-English summary. */
  what: string;
  /** Why: the core benefit or problem it solves. */
  why: string;
  /** Where: 2-3 specific real-world applications. */
  where: readonly string[];
  /** When NOT to use: the practical boundary rule. */
  whenNot: string;
};

/**
 * The standardized system diagram rendered BELOW a lesson's story infographic
 * (v5 contract). Plain data — the renderer maps it onto the shared flow
 * primitives (`components/infographic/flow.tsx`). It is the compact reference
 * view of the idea the infographic above told as a story: bracket node
 * patterns, terse captions, no re-narration.
 */
export type DiagramNodeKind = "input" | "process" | "output" | "decision";

export type DiagramTree =
  | {
      kind: "decision";
      /** The question, rendered as < question >. */
      question: string;
      caption?: string;
      branches: readonly { label: string; node: DiagramTree }[];
    }
  | {
      kind: "leaf";
      /** The outcome, rendered as [ answer ]. */
      answer: string;
      caption?: string;
    };

export type LessonDiagram =
  | {
      kind: "flow";
      steps: readonly {
        kind: DiagramNodeKind;
        text: string;
        caption?: string;
      }[];
      /** Loop-back annotation for cyclical processes. */
      loop?: string;
    }
  | {
      kind: "compare";
      left: { title: string; subtitle?: string };
      right: { title: string; subtitle?: string };
      rows: readonly { label: string; left: string; right: string }[];
    }
  | {
      kind: "decision";
      root: DiagramTree;
    };

export type Lesson = {
  /** Folder/component slug. Must match a key in components/infographic/index.tsx. */
  slug: string;
  title: string;
  /** One-line summary shown on the course index and the lesson header. */
  blurb: string;
  /** Topic tag, for future filtering and mastery grouping. */
  topic: string;
  skillIds?: readonly SkillId[];
  capability?: string;
  /** Estimated minutes to read + attempt. Shown in the byte chip. */
  minutes?: number;
  /** 4-step explanation (What/Why/Where/When NOT) shown before the infographic. */
  concept?: ConceptBrief;
  /** Standardized system diagram shown below the infographic (reference view). */
  diagram?: LessonDiagram;
  /** ~100-200 words of explanation, rendered as paragraphs under the infographic. */
  prose?: string[];
  /** Optional runnable Python exercise (Pyodide). */
  exercise?: CodeExercise;
  /** Exactly 2 real-life scenario MCQs (v5 contract). All correct to complete. */
  questions?: ByteQuestion[];
};

/**
 * Skill depth of a course, used for browse/filter on `/courses`.
 *
 * Note: this is a *skill-level* axis (how technical the material is), distinct
 * from the `trackPriority` persona axis in `catalog.ts` (beginner/grad/
 * engineer/founder, which drives `/learn`'s recommendation). The two are
 * intentionally separate — do not conflate them.
 */
export type CourseLevel = "beginner" | "intermediate" | "expert";

/**
 * Top-level field a course belongs to. Drives the domain filter on `/courses`.
 * Add a new value here when you introduce a new field of study.
 */
export type CourseDomain =
  | "Machine Learning"
  | "Cybersecurity"
  | "Artificial Intelligence"
  | "AI Observability";

/**
 * Monetization tier for browse/gate UX.
 * - free: full SSR content, public SEO, readable without sign-in
 * - paid: listing + soft login (payment later); do not full-index paid lesson bodies when added
 */
export type CourseAccess = "free" | "paid";

/** Ordered list of levels, for filter UIs. */
export const COURSE_LEVELS: readonly CourseLevel[] = ["beginner", "intermediate", "expert"];

/** Ordered list of domains, for filter UIs. */
export const COURSE_DOMAINS: readonly CourseDomain[] = [
  "Machine Learning",
  "Cybersecurity",
  "Artificial Intelligence",
  "AI Observability",
];

/** Ordered list of access tiers, for filter UIs. */
export const COURSE_ACCESS: readonly CourseAccess[] = ["free", "paid"];

export type Course = {
  /** URL segment under `/courses/`. */
  slug: string;
  title: string;
  subtitle: string;
  /** Optional longer description for the course landing page. */
  description?: string;
  /** Skill depth — drives the level filter and badge on `/courses`. */
  level: CourseLevel;
  /** Field of study — drives the domain filter and grouping on `/courses`. */
  domain: CourseDomain;
  /** free | paid — free courses are public SEO; paid soft-gate until checkout exists */
  access: CourseAccess;
  /** Optional human-readable prerequisite line, shown on the course page. */
  prerequisites?: string;
  lessons: Lesson[];
};

export const COURSES: readonly Course[] = [
  {
    slug: "machine-learning",
    title: "Machine Learning",
    subtitle:
      "The quick primer: AI, ML, and deep learning — connected clearly, in under 20 minutes.",
    description:
      "A quick visual orientation for people short on time: four lessons, one runnable exercise, and the mental map that everything else hangs on. Finished in one sitting — then go deep with Machine Learning for Layman or AI Observability.",
    level: "intermediate",
    domain: "Machine Learning",
    access: "free",
    prerequisites:
      "None — this is the fastest entry point. If you want the deep, picture-led treatment instead, start with Machine Learning for Layman.",
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
          "Artificial Intelligence is the branch of computer science that tries to build machines which can act intelligently — **reason, learn, perceive, and decide** — instead of only executing fixed instructions.",
          "The key divide is between a machine that **follows rules** and one that **figures things out**. A calculator is not intelligent: the same input always yields the same output, and it never adapts. A spam filter that improves as it sees more email is.",
          "AI is the broadest label. Everything underneath it — machine learning, deep learning, large language models — is a technique for reaching that goal. Think of **AI as the destination**, and ML/DL as vehicles for getting there.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Your team is auditing a smart-home app for its 'AI-powered' marketing claim. One feature is a thermostat that runs the same fixed schedule every day; another reshuffles lighting scenes based on which rooms occupants actually use over time. Which feature genuinely behaves like AI?",
            choices: [
              { id: "a", label: "The thermostat — schedules are a form of intelligence" },
              { id: "b", label: "The adaptive lighting — it changes behaviour from data about use" },
              { id: "c", label: "Both equally — anything automated counts as AI" },
              { id: "d", label: "Neither — home apps can't contain AI" },
            ],
            answer: "b",
            explanation:
              "The lighting feature adapts its behaviour from accumulated data — the hallmark of AI. The thermostat executes a pre-written schedule: same input, same output, nothing learned, so the 'AI-powered' claim only half-holds.",
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
          "Machine Learning is a technique for building AI systems that **learn patterns from data themselves**, rather than relying on a programmer to hand-code every rule.",
          "The classic framing: instead of writing a program that says 'if an email contains these words, it's spam', you show the system **thousands of labelled examples** and let it discover the patterns. The more data it sees, the better it gets.",
          "There are three broad families. **Supervised learning** trains on labelled examples (predict the label of new inputs). **Unsupervised learning** finds structure in unlabelled data (cluster similar items). **Reinforcement learning** learns by trial and error, rewarded for good decisions and penalised for bad ones.",
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
              "A fintech team is building fraud detection. Engineer A wants to hand-write rules like 'flag any transfer over ₹50,000'; Engineer B wants to train a model on five years of past transactions, each labelled fraud or genuine. New fraud patterns appear every month. Whose approach keeps working, and why?",
            choices: [
              { id: "a", label: "A — fixed thresholds are always more reliable than models" },
              { id: "b", label: "B — a model retrained on fresh labelled data can pick up patterns nobody hand-wrote" },
              { id: "c", label: "A — hand rules automatically adapt as fraudsters change tactics" },
              { id: "d", label: "Neither — fraud detection cannot be automated" },
            ],
            answer: "b",
            explanation:
              "Hand-written thresholds freeze on day one; new fraud patterns sail past them. Learning from labelled history is exactly the case where ML beats rules — the patterns are too many and too shifting to enumerate by hand.",
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
          "'Deep' simply refers to **the number of layers**. A network with one or two layers is shallow; a deep network might have dozens. Each layer transforms its input into a slightly more abstract representation: early layers might detect edges, middle layers detect shapes, and later layers detect whole objects.",
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
              "Two radiology startups tackle fracture detection from X-rays. Startup A feeds raw pixels into a 50-layer network; Startup B has engineers hand-craft edge-detector features and feeds those into a two-layer model. A's system wins on subtle hairline fractures. What advantage explains it?",
            choices: [
              { id: "a", label: "A's network learns each level of features from the data itself — edges up to fracture patterns" },
              { id: "b", label: "A has more GPU memory, which always wins" },
              { id: "c", label: "B's hand-crafted features were too accurate, confusing the model" },
              { id: "d", label: "A's network needed no training data" },
            ],
            answer: "a",
            explanation:
              "Depth lets the network build features hierarchically from raw pixels — no human decides what matters. B's engineers baked in their assumptions, and hairline fractures fell outside them.",
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
          "That's the primer done. Each idea here has a picture-led deep dive in Machine Learning for Layman — features, classifiers, train/test splits, overfitting — if you want to actually build the intuition rather than just map it.",
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
              "Sort three real systems: (1) a video ranker using a deep neural network, (2) a logistic-regression fraud scorer trained on labelled data, (3) a fixed route planner with hand-coded shortest-path rules. Which ordering is DL / ML-not-DL / AI-not-ML?",
            choices: [
              { id: "a", label: "1 → 2 → 3" },
              { id: "b", label: "3 → 2 → 1" },
              { id: "c", label: "1 → 3 → 2" },
              { id: "d", label: "2 → 1 → 3" },
            ],
            answer: "a",
            explanation:
              "The deep ranker is DL (deepest circle). The fraud scorer learns from data but has no multi-layer network — ML, not DL. The route planner never learns — AI at most, not ML.",
          },
        ],
      },
    ],
  },
  {
    slug: "machine-learning-for-layman",
    title: "Machine Learning for Layman",
    subtitle:
      "Start with pictures and everyday decisions — no maths or jargon required.",
    description:
      "A picture-led path through what learning and machine learning actually mean. Every lesson ends with one small active check so the idea becomes more than something you scrolled past.",
    level: "beginner",
    domain: "Machine Learning",
    access: "free",
    lessons: [
      {
        slug: "how-humans-learn",
        title: "How a human learns",
        blurb: "A child, a car, and a bike — the original learning machine.",
        topic: "layman-foundations",
        skillIds: ["ai-literacy"],
        capability: "Explain learning as using experience to improve a future decision.",
        minutes: 3,
        prose: [
          "Watch a child meet a bike for the first time. Nobody hands them a rulebook with ‘two wheels, pedals, a handlebar’. They just see a few **examples** — and the next time a bike rolls past, they name it.",
          "That is learning in its rawest form: **experience changes how you respond next time**. Not memorising instructions — **updating yourself from examples**.",
          "Keep that picture. Every machine-learning idea in this course is an attempt to copy it: give a system examples, and let **experience improve its next decision**.",
        ],
        concept: {
          what: "**Learning** means **experience changes how you respond next time** — you see examples, and future decisions get better because of them.",
          why: "It solves the problem of rules nobody can write: no one can list every rule for ‘what makes a bike’, but a handful of **labelled examples** teaches it for free.",
          where: [
            "A **child naming a bike** after seeing a few labelled examples",
            "Recognising a **friend’s face** in a crowd — no rulebook involved",
            "Guessing a **song from two notes** — past listening tunes the guess",
          ],
          whenNot:
            "It is not learning when nothing changes downstream — **repeating without updating** any future behaviour is replay, not learning.",
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Your friend watches the same dance video 50 times but never notices whether their own attempts match it. You watch it 5 times, compare each attempt to the video, and adjust. Next week at the party, whose dancing has actually improved — and what made the difference?",
            choices: [
              { id: "a", label: "Yours — each watch changed how you danced the next time" },
              { id: "b", label: "Your friend's — 50 repetitions beats 5 comparisons" },
              { id: "c", label: "Neither — dancing can't be learned from videos" },
            ],
            answer: "a",
            explanation:
              "Learning means experience changes a future response. Repetition alone is not enough if nothing is updated — your friend replayed, you updated.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A student memorises the exact answers to last year’s exam without understanding. When this year’s questions change slightly, they fail. What did they actually do?",
            choices: [
              { id: "a", label: "Learned from examples" },
              { id: "b", label: "Memorised answers without learning the pattern" },
              { id: "c", label: "Used experience to improve a future decision" },
            ],
            answer: "b",
            explanation:
              "Repeating fixed answers is not learning — learning would let them handle new, similar questions. Machines can fail this same way, as you’ll see in the overfitting lesson.",
          },
        ],
      },
      {
        slug: "humans-vs-machines",
        title: "Why a machine can't do that (yet)",
        blurb: "Machines follow instructions — they don't decide on their own.",
        topic: "layman-foundations",
        skillIds: ["ai-literacy"],
        capability: "Contrast fixed instructions with systems that adapt from examples.",
        minutes: 3,
        prose: [
          "Traditional software is a very fast clerk. A programmer writes every **fixed instruction** in advance: if this, then that. The clerk never learns, never adapts — it just executes, perfectly and blindly.",
          "That’s fine for calculators and timers. But try writing, by hand, the rule for ‘what makes this a car’. Every rule you write, a weird **exception** breaks — a three-wheeled car, a motorcycle with a roof.",
          "So the trick machines were missing wasn’t speed. It was the child’s trick: **learning the rule from examples** instead of being given it. That hand-off — from hand-written rules to learned rules — is what makes **machine learning** different from ordinary programming.",
        ],
        concept: {
          what: "**Traditional software follows fixed instructions** written in advance; **machine learning writes its own rules from examples**.",
          why: "Hand-written rules shatter on exceptions — three-wheeled cars, roofs on bikes. **Learned rules bend around messy reality** instead of breaking on it.",
          where: [
            "A **spam filter** that improves every time users mark junk",
            "**Face unlock** adapting to your look — not a fixed feature checklist",
            "A **calculator** — the contrast case: same formula, forever",
          ],
          whenNot:
            "Don’t use learning when the rules are **few, stable, and fully known** — a timer doesn’t need examples to ring after ten minutes.",
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "You're sorting apps on a new phone. One is a meditation timer that always rings after exactly ten minutes. Another is a spam filter that visibly improves after you mark a few unwanted messages as junk. Which one is adapting rather than only following fixed instructions?",
            choices: [
              { id: "a", label: "The meditation timer — it adapts to your breathing" },
              { id: "b", label: "The spam filter — it changes its behaviour from your marks" },
              { id: "c", label: "Both — anything on a phone is adaptive" },
            ],
            answer: "b",
            explanation:
              "The filter changes from feedback. The timer executes a predetermined instruction — ten minutes, every time, no matter what you do.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A city tries to automate vehicle checks by hand-writing rules: 'a car has 4 wheels and a metal roof'. On day one, a three-wheeled delivery van and a motorcycle with a roof trailer both roll in and get misclassified. What's the lesson?",
            choices: [
              { id: "a", label: "The cameras were too slow to photograph them" },
              { id: "b", label: "Every hand-written rule has real-world exceptions that break it" },
              { id: "c", label: "Vehicles simply can't be recognised by machines" },
            ],
            answer: "b",
            explanation:
              "Real categories are messy — three wheels, roofs on bikes, open trucks. Fixed rules shatter on the exceptions; learning from examples bends around them.",
          },
        ],
      },
      {
        slug: "what-is-ml-layman",
        title: "What is Machine Learning, really?",
        blurb: "Give the machine experience, and let it find the patterns itself.",
        topic: "layman-foundations",
        skillIds: ["ai-literacy", "learning-paradigms"],
        capability: "Describe machine learning as finding useful patterns in examples.",
        minutes: 4,
        prose: [
          "Here is the whole deal in one sentence: **machine learning is giving a machine examples instead of rules**, and letting it find the pattern itself.",
          "You still do important work — choosing the examples, and checking what it learns. But the detailed pattern-hunting is done by the **algorithm**, not written by hand.",
          "This flip explains everything that follows. A **‘model’** is just the pattern it found, stored in a form that can make new decisions.",
        ],
        concept: {
          what: "**Machine learning is giving a machine examples instead of rules** — and letting it find the pattern itself.",
          why: "It removes the impossible job of hand-writing every rule. The **algorithm does the pattern-hunting**; you choose the examples and check what it learns.",
          where: [
            "**Recommendations** — your past behaviour is the example set",
            "**Spam detection** — millions of already-marked emails",
            "**Price estimates** — past sales teach the pattern",
          ],
          whenNot:
            "It’s the wrong tool when an **exact, complete rule already exists** — no need to learn what you can program precisely.",
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A photo-app team wants the machine to recognise cars. The programmer sets up the learning process and supplies a million labelled photos — but never writes a 'what is a car' rule. When the app later labels a photo correctly, who actually worked out the detailed pattern?",
            choices: [
              { id: "a", label: "The learning algorithm — it discovered the pattern from the examples" },
              { id: "b", label: "The programmer — the rules were hidden in the setup code" },
              { id: "c", label: "The user — their tap confirmed what a car is" },
            ],
            answer: "a",
            explanation:
              "A programmer defines the learning process, but the model discovers the detailed pattern from data. That hand-off is the whole idea of ML.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "After training on those million labelled photos, the app ships a file that instantly labels new pictures — without the million photos on the phone. What is that file best thought of as?",
            choices: [
              { id: "a", label: "A person who decides what the machine should learn" },
              { id: "b", label: "The pattern the machine found, stored so it can make new decisions" },
              { id: "c", label: "A copy of all the examples it was shown" },
            ],
            answer: "b",
            explanation:
              "A model isn’t the data and isn’t a person — it’s the distilled pattern, ready to use on new, unseen cases without dragging the dataset along.",
          },
        ],
      },
      {
        slug: "three-ml-paradigms",
        title: "The three families of ML",
        blurb: "Supervised, unsupervised, reinforcement — what each is for.",
        topic: "layman-paradigms",
        skillIds: ["learning-paradigms"],
        capability: "Choose supervised, unsupervised, or reinforcement learning for a simple task.",
        minutes: 4,
        prose: [
          "Machine learning comes in **three big families**, and the difference is simply: what kind of experience does the machine learn from?",
          "**Supervised learning**: examples with answers attached — ‘this is a car, this is a bike’. **Unsupervised**: examples with no answers, and the machine groups them itself. **Reinforcement**: no answers, just rewards and penalties after each action.",
          "Most of this course lives in the supervised family, because it’s the one behind everyday **classification**. But knowing all three lets you name the right tool when you meet a new problem.",
        ],
        concept: {
          what: "ML comes in **three families** — **supervised** (labelled examples), **unsupervised** (no labels, find the structure), and **reinforcement** (rewards and penalties).",
          why: "The families differ by **what kind of experience** the machine learns from — name the family and you’ve named the right tool for the job.",
          where: [
            "**Supervised**: spam vs. not-spam, learned from marked emails",
            "**Unsupervised**: grouping photos or shoppers nobody labelled",
            "**Reinforcement**: game agents improving by winning or losing",
          ],
          whenNot:
            "Don’t force supervised when **no labels exist** — if answers can’t be attached to examples, it’s the wrong family. Feedback that is only reward or penalty means reinforcement, not supervision.",
        },
        diagram: {
          kind: "decision",
          root: {
            kind: "decision",
            question: "Are the examples labelled with answers?",
            branches: [
              {
                label: "Yes",
                node: { kind: "leaf", answer: "Supervised", caption: "spam vs. not-spam" },
              },
              {
                label: "No",
                node: {
                  kind: "decision",
                  question: "Is the feedback a reward or penalty?",
                  branches: [
                    {
                      label: "Yes",
                      node: { kind: "leaf", answer: "Reinforcement", caption: "games, robots" },
                    },
                    {
                      label: "No",
                      node: { kind: "leaf", answer: "Unsupervised", caption: "groups, outliers" },
                    },
                  ],
                },
              },
            ],
          },
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt: "An agent learns a game from rewards after each action. Which family is this?",
            choices: [
              { id: "a", label: "Supervised learning" },
              { id: "b", label: "Unsupervised learning" },
              { id: "c", label: "Reinforcement learning" },
            ],
            answer: "c",
            explanation:
              "Reinforcement learning uses rewards or penalties to improve a sequence of decisions.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "You have thousands of customer reviews with no labels, and you want the machine to discover the natural groups (praise, complaints, questions). Which family fits?",
            choices: [
              { id: "a", label: "Supervised — someone must label each review first" },
              { id: "b", label: "Unsupervised — finding groups in unlabelled data is exactly its job" },
              { id: "c", label: "Reinforcement — reviews act as rewards" },
            ],
            answer: "b",
            explanation:
              "No answers are attached, and the goal is discovering structure — that’s the unsupervised signature. Supervised would need each review pre-labelled.",
          },
        ],
      },
      {
        slug: "supervised-learning-deep-dive",
        title: "Inside supervised learning",
        blurb: "Samples + labels → a function → classification or regression.",
        topic: "layman-paradigms",
        skillIds: ["supervised-learning", "learning-paradigms"],
        capability: "Recognize labelled examples and distinguish classification from regression.",
        minutes: 5,
        prose: [
          "Supervised learning always has the same skeleton: **examples plus the right answers**, fed to an algorithm that learns the mapping from one to the other.",
          "The examples are called **samples**; the answers are **labels**. ‘This photo (sample) → car (label)’, a thousand times over.",
          "The learned mapping answers one of two kinds of question. If the answer is a category — car or bike, spam or not — it’s **classification**. If the answer is a number — a price, an age, a duration — it’s **regression**. Same skeleton, different output shape.",
        ],
        concept: {
          what: "**Supervised learning** feeds an algorithm **samples with labels attached**, so it learns the mapping from one to the other.",
          why: "Once the mapping is learned, it **answers new cases you’ve never seen** — the workhorse behind everyday classification and prediction.",
          where: [
            "**Classification**: spam or not, car or bike — a category comes out",
            "**Regression**: delivery time, house price — a number comes out",
            "**Face unlock**: labelled photos of you map to ‘let it open’",
          ],
          whenNot:
            "Not usable when you **can’t get labels** — piles of unlabelled data belong to the unsupervised family, not this one.",
        },
        diagram: {
          kind: "flow",
          steps: [
            { kind: "input", text: "Labelled samples", caption: "photo + ‘car’, a thousand times" },
            { kind: "process", text: "Learning algorithm", caption: "finds the sample → label mapping" },
            {
              kind: "output",
              text: "Prediction on a new case",
              caption: "category = classification · number = regression",
            },
          ],
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A real-estate site shows you past sales — each house described by size and location, each labelled with the price it actually sold for — and then estimates your house's price in rupees. What kind of supervised problem is this?",
            choices: [
              { id: "a", label: "Classification — houses get sorted into price bands" },
              { id: "b", label: "Regression — the answer is a measured number" },
              { id: "c", label: "Unsupervised — no answers were attached" },
            ],
            answer: "b",
            explanation:
              "Whenever the label is a measured quantity — rupees, minutes, kilograms — it's regression. The sale prices attached to each example make it supervised.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Your team must build a supervised spam classifier by Monday. One colleague hands you a dump of 10,000 emails with no markings; another hands you 5,000 emails where users have already flagged each as junk or not. Which pile can you actually train on?",
            choices: [
              { id: "a", label: "The flagged 5,000 — each sample carries its label" },
              { id: "b", label: "The unmarked 10,000 — more data always wins" },
              { id: "c", label: "Either — supervised learning works on both" },
            ],
            answer: "a",
            explanation:
              "Supervised needs labels attached to samples. Unmarked emails would be unsupervised territory — and no amount of extra unmarked data fixes that.",
          },
        ],
      },
      {
        slug: "unsupervised-learning-deep-dive",
        title: "Inside unsupervised learning",
        blurb: "No labels → the algorithm finds its own groups and patterns.",
        topic: "layman-paradigms",
        skillIds: ["unsupervised-learning", "learning-paradigms"],
        capability: "Recognize that unsupervised learning finds structure without labels.",
        minutes: 5,
        prose: [
          "Take the labels away and something interesting happens: the machine stops predicting answers and starts **describing structure**.",
          "Given only samples, unsupervised algorithms find groups (**clustering**), or unusual **outliers**, or the few directions in which the data actually varies. Nobody told it what the groups are — it finds them.",
          "The catch: the machine can name the groups it finds, but it **can’t tell you what the groups mean**. ‘Cluster 1 behaves like this’ — a human still has to look and say ‘ah, these are the weekend shoppers’.",
        ],
        concept: {
          what: "**Unsupervised learning** gets samples with **no labels** and finds the structure — groups, outliers, patterns — on its own.",
          why: "It works where **labelling is impossible or expensive**, revealing structure in data nobody thought to mark up.",
          where: [
            "**Clustering** shoppers by habit, with no pre-assigned groups",
            "Spotting **unusual transactions** that fit no known group",
            "Grouping a **music library** into moods nobody named",
          ],
          whenNot:
            "It can’t answer ‘what is this?’ — the machine finds the groups but **can’t name their meaning**. Interpretation stays a human job.",
        },
        diagram: {
          kind: "flow",
          steps: [
            { kind: "input", text: "Samples, no labels" },
            { kind: "process", text: "Clustering algorithm" },
            {
              kind: "output",
              text: "Discovered groups + outliers",
              caption: "naming the groups stays a human job",
            },
          ],
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A store groups shoppers by buying habits, with no pre-assigned labels. Which family is this?",
            choices: [
              { id: "a", label: "Supervised, because shoppers are categorised" },
              { id: "b", label: "Unsupervised, because no labels were given" },
              { id: "c", label: "Reinforcement, because habits change over time" },
            ],
            answer: "b",
            explanation:
              "With no ground-truth labels, discovering groups (clustering) is unsupervised learning.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "An unsupervised algorithm groups your photos and calls them ‘Cluster 1, 2, 3’. What still needs a human?",
            choices: [
              { id: "a", label: "Nothing — the algorithm understands the photos" },
              { id: "b", label: "Saying what each cluster actually is — ‘beach trip’, ‘birthdays’" },
              { id: "c", label: "Taking the photos in the first place only" },
            ],
            answer: "b",
            explanation:
              "Unsupervised learning finds the structure; interpreting it — giving the groups meaning — remains a human step.",
          },
        ],
      },
      {
        slug: "reinforcement-learning-deep-dive",
        title: "Inside reinforcement learning",
        blurb: "Agent → action → reward or penalty → a better strategy.",
        topic: "layman-paradigms",
        skillIds: ["reinforcement-learning", "learning-paradigms"],
        capability: "Recognize trial-and-error learning guided by reward.",
        minutes: 5,
        prose: [
          "Reinforcement learning is **learning by doing**. No labelled examples, no teacher — just an **agent** taking actions, and the world answering with **reward or penalty**.",
          "Over many attempts, the agent learns a **strategy**: which actions, in which situations, earn the most reward. It’s how machines learned to play chess and video games beyond human level.",
          "The trap: the agent **optimises exactly what you reward — not what you meant**. Reward it for ‘staying upright’ and it may learn to stand perfectly still forever. Designing the reward is the hard, human part.",
        ],
        concept: {
          what: "**Reinforcement learning** is an **agent acting, the world answering with reward or penalty**, and the agent’s strategy improving with every attempt.",
          why: "It learns **sequences of decisions** no one can label in advance — the only family that improves by trial and error.",
          where: [
            "**Game agents** improving through wins and losses",
            "**Robot control** — walking, grasping — shaped by reward",
            "**Recommendation tuning** against watch-time or click reward",
          ],
          whenNot:
            "Beware when the **reward can’t capture what you actually mean** — the agent optimises the reward you gave, loopholes included. And if a single labelled answer exists, supervised is the simpler tool.",
        },
        diagram: {
          kind: "flow",
          steps: [
            { kind: "input", text: "State — the situation now" },
            { kind: "process", text: "Agent picks an action" },
            { kind: "output", text: "Reward or penalty" },
          ],
          loop: "Strategy updates · repeat thousands of times",
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A robot learns to walk by being rewarded for staying upright longer. Which family is this?",
            choices: [
              { id: "a", label: "Supervised, because it improves over time" },
              { id: "b", label: "Unsupervised, because there is no teacher" },
              { id: "c", label: "Reinforcement, because it learns from reward" },
            ],
            answer: "c",
            explanation:
              "Learning a sequence of actions from reward/penalty feedback is reinforcement learning.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A video-recommending agent is rewarded only for watch time. What is it most likely to learn?",
            choices: [
              { id: "a", label: "To recommend the most helpful videos" },
              { id: "b", label: "To recommend whatever keeps people watching longest, helpful or not" },
              { id: "c", label: "To stop recommending videos entirely" },
            ],
            answer: "b",
            explanation:
              "The agent optimises the reward it was given — watch time — not the intention behind it. Reward design is where the values enter.",
          },
        ],
      },
      {
        slug: "features-and-vectors",
        title: "Representing samples as features",
        blurb: "Turn a real object into numbers a machine can read — and keep only useful features.",
        topic: "layman-first-model",
        skillIds: ["feature-engineering", "supervised-learning"],
        capability: "Represent an object as a feature vector and spot useless features.",
        minutes: 5,
        prose: [
          "A machine can’t ‘see’ a car the way you do — it only reads **numbers**. So the first job is to describe each object with measurable **features**: number of wheels, height, weight, colour.",
          "One object becomes a list of values, called a **vector**. The whole learning step that follows depends on this translation being right.",
          "Not every feature helps. A feature only earns its place if it **separates the classes** — colour doesn’t, because cars and bikes come in every colour.",
        ],
        concept: {
          what: "A machine can’t see objects — it reads **numbers**. Each object becomes a **feature vector**: a fixed, ordered list of measurements.",
          why: "**All learning depends on this translation** — good features separate the classes; useless ones bury the signal.",
          where: [
            "A car as **[wheels: 4, height: 1.5 m, weight: 1300 kg]**",
            "**Spam filters** turning emails into word-count vectors",
            "**Face unlock** turning faces into measurement patterns",
          ],
          whenNot:
            "A feature earns its place **only if it separates the classes** — colour doesn’t (cars and bikes come in every colour), so it’s noise, not a feature.",
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Your team is picking features for a car-vs-bike classifier at a toll booth. A teammate proposes: wheel count, vehicle height, and paint colour. Cameras at the booth can measure all three. Which feature will hurt rather than help?",
            choices: [
              { id: "a", label: "Wheel count — two vs. four separates the classes" },
              { id: "b", label: "Paint colour — cars and bikes come in every colour" },
              { id: "c", label: "Vehicle height — it differs between the classes" },
            ],
            answer: "b",
            explanation:
              "A feature only earns its place if it separates the classes. Colour doesn't — both classes come in red, blue, black — so it adds noise, not signal.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A feature vector for one car is [wheels: 4, height: 1.5 m, weight: 1,300 kg]. What makes this a usable ‘sample’ for learning?",
            choices: [
              { id: "a", label: "It lists every fact about the car, including its colour and owner" },
              { id: "b", label: "It describes the car as a fixed set of numbers in the same order as every other sample" },
              { id: "c", label: "It stores the car’s photo alongside the numbers" },
            ],
            answer: "b",
            explanation:
              "Learning needs samples described the same way — same features, same order — so the algorithm can compare them number by number.",
          },
        ],
      },
      {
        slug: "first-classifier",
        title: "Your first classifier",
        blurb: "Count the data → a probability → a simple decision rule.",
        topic: "layman-first-model",
        skillIds: ["classification-basics", "supervised-learning"],
        capability: "Build a classifier by counting outcomes and picking the more likely class.",
        minutes: 5,
        prose: [
          "Once your samples are vectors with labels, you can build your first classifier with nothing more than **counting**.",
          "Look at all the 4-wheel examples: if every one is a car, then a new 4-wheel sample is almost certainly a car too. That **‘probability from counting’** is the whole rule.",
          "Pick the class that’s **more likely given the feature**, and you have a working classifier — built from scratch, no maths beyond counting.",
        ],
        concept: {
          what: "Your first classifier is pure **counting**: look at past examples with the same feature value and **pick the more likely class**.",
          why: "With no maths beyond counting you get a working, **probability-based decision rule** — the seed of every classifier ahead.",
          where: [
            "4 wheels → in your data, always a **car**",
            "**Medical screening** from how often symptoms led to a diagnosis",
            "**Weather guessing** from how similar days turned out",
          ],
          whenNot:
            "Counting fails when the data is **thin or mixed** — 90/10 gives odds, not certainty, and a feature value you’ve never seen gives no answer at all.",
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Every 4-wheel sample in your data is a car, every 2-wheel sample is a bike. A new sample has 2 wheels. What does your classifier say?",
            choices: [
              { id: "a", label: "CAR, because it might be" },
              { id: "b", label: "BIKE, because Pr(BIKE | 2 wheels) = 100%" },
              { id: "c", label: "Unsure — ask for more features" },
            ],
            answer: "b",
            explanation:
              "The data says 2 wheels → bike every time (100%), so the rule classifies it as a bike.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Your counts say: of the 4-wheel samples, 90 are cars and 10 are bikes. A new 4-wheel sample arrives. What’s the honest output?",
            choices: [
              { id: "a", label: "Car — and 90-in-100 odds, not certainty" },
              { id: "b", label: "Car — the probability makes it a certainty" },
              { id: "c", label: "Bike, to be safe" },
            ],
            answer: "a",
            explanation:
              "Counting gives you odds, not guarantees. The more-likely class wins the call, but the 90/10 split should keep you humble about it.",
          },
        ],
      },
      {
        slug: "multiple-features",
        title: "When one feature isn’t enough",
        blurb: "Ambiguity → add a feature → a decision tree of splits.",
        topic: "layman-first-model",
        skillIds: ["classification-basics", "feature-engineering", "supervised-learning"],
        capability: "Resolve an ambiguous classification by adding a second good feature.",
        minutes: 5,
        prose: [
          "A single feature often isn’t enough. Wheel count might leave you **75% sure** it’s a bike — better than a coin flip, but not a clean call.",
          "The fix is to **add a second good feature**. With height as well as wheel count, a tricky sample that was ambiguous becomes decided.",
          "Stack several ‘if this, then that’ splits and you get a **decision tree** — each feature asks a question that narrows the answer further.",
        ],
        concept: {
          what: "When one feature leaves you unsure, **add a second informative feature** — stack the questions and you get a **decision tree**.",
          why: "A second good feature turns an ambiguous **75/25 into a clean call**; re-measuring the same feature adds nothing at all.",
          where: [
            "Wheel count + **height** settles the three-wheeler",
            "**Spam filters** stacking sender, suspicious words, links",
            "Medical triage stacking **age, blood pressure, symptoms**",
          ],
          whenNot:
            "Don’t add features that **repeat information** (wheel count + ‘number of round things’) or carry noise (colour) — more isn’t better; **different** is.",
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Wheel count alone gives a 75/25 split for a sample. What most reliably fixes the ambiguity?",
            choices: [
              { id: "a", label: "Collect more samples of the same single feature" },
              { id: "b", label: "Add a second good feature, like Height" },
              { id: "c", label: "Remove the wheel-count feature entirely" },
            ],
            answer: "b",
            explanation:
              "A second informative feature gives the model another way to separate the classes, turning 75/25 into a clean call.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A delivery startup's classifier keeps confusing scooters with motorbikes using wheel count alone. The engineers propose three feature pairs to add. Which pair actually adds a new angle on the problem?",
            choices: [
              { id: "a", label: "Paint colour and sticker colour" },
              { id: "b", label: "Engine size and seat height" },
              { id: "c", label: "Wheel count and number of round parts on the vehicle" },
            ],
            answer: "b",
            explanation:
              "Good features add genuinely different information. Colours are noise, and ‘round parts’ mostly repeats wheel count — engine size and seat height give the model a genuinely new view.",
          },
        ],
      },
      {
        slug: "knn-neighbors",
        title: "Find its neighbors: k-Nearest Neighbors",
        blurb: "A new sample takes the class most of its closest neighbors belong to.",
        topic: "layman-classifiers",
        skillIds: ["k-nearest-neighbors", "classification-basics", "supervised-learning"],
        capability: "Classify a sample by the majority class among its k nearest neighbors.",
        minutes: 5,
        prose: [
          "Instead of counting the whole dataset, **k-Nearest-Neighbors** only looks at the samples **closest** to the new one.",
          "‘Closest’ means **most similar in their features** — the same idea as physical nearness, just measured in numbers.",
          "Take a **vote** among those k neighbours: whichever class is the majority wins. Simple, and surprisingly effective.",
        ],
        concept: {
          what: "**k-Nearest Neighbors (kNN)** classifies a new sample by a **majority vote among its k closest, most similar examples**.",
          why: "There is no model-building step at all — **the data is the model**. Simple, and surprisingly effective.",
          where: [
            "**Recommendations** — ‘people similar to you’ is kNN, literally",
            "**Fraud flags** raised from the most similar past transactions",
            "Boundary calls — votes decide even a **3-to-2 contest**",
          ],
          whenNot:
            "It’s slow at scale (a new sample is compared against **every example**) and unreliable when the nearest neighbours are **noisy or uninformative**.",
        },
        diagram: {
          kind: "flow",
          steps: [
            { kind: "input", text: "New sample" },
            {
              kind: "process",
              text: "Measure distance to every example",
              caption: "most similar = closest",
            },
            { kind: "process", text: "Keep the k nearest" },
            { kind: "output", text: "Majority class wins the vote" },
          ],
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "With k=5, a new sample’s 5 closest neighbors are 3 cars and 2 bikes. What class does kNN assign?",
            choices: [
              { id: "a", label: "Bike, because there are bikes nearby" },
              { id: "b", label: "Car, because the majority (3 of 5) are cars" },
              { id: "c", label: "Unsure — ask for more neighbors" },
            ],
            answer: "b",
            explanation:
              "kNN takes a majority vote among the k closest neighbors; 3 cars beats 2 bikes, so the class is car.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A new sample sits right at the boundary between a car cluster and a bike cluster. Why does kNN still make a call?",
            choices: [
              { id: "a", label: "It refuses to classify boundary samples" },
              { id: "b", label: "It counts the votes of the k nearest neighbours however close the contest — majority still wins" },
              { id: "c", label: "It chooses whichever class appeared first in the data" },
            ],
            answer: "b",
            explanation:
              "kNN is a vote, not a judge of confidence: even a 3-2 contest produces a winner. (A near-tie vote is worth treating with caution in real systems.)",
          },
        ],
      },
      {
        slug: "centroid-classifier",
        title: "The class center: the centroid classifier",
        blurb: "Each class has a typical member — assign the sample to the nearest center.",
        topic: "layman-classifiers",
        skillIds: ["centroid-classifier", "classification-basics", "supervised-learning"],
        capability: "Classify a sample by comparing it to each class’s average member.",
        minutes: 5,
        prose: [
          "Comparing a new sample to every single example is a lot of work. The **centroid classifier** has a shortcut: summarise each class by one **average member**.",
          "That average — the **centroid** — stands in for the whole group. You only compare the new sample to one car-centre and one bike-centre.",
          "Whichever centre is **closer wins**. It’s faster than kNN, and it captures the ‘typical’ idea of each class.",
        ],
        concept: {
          what: "The **centroid classifier** summarises each class by one **average member** (the centroid) and assigns a new sample to the **nearest center**.",
          why: "One comparison per class instead of thousands — **much faster than kNN**, while still capturing the ‘typical’ idea of each class.",
          where: [
            "A **typical car** vs. a **typical bike** — two centers decide",
            "**Document topics** matched by average word patterns",
            "Quick **routing** of support tickets to the closest team profile",
          ],
          whenNot:
            "Averages miss **unusual members** — a cargo trike sits far from every center and gets misjudged. Odd-shaped classes need kNN or trees instead.",
        },
        diagram: {
          kind: "compare",
          left: {
            title: "k-Nearest Neighbors",
            subtitle: "compare against every example",
          },
          right: {
            title: "Centroid classifier",
            subtitle: "compare against one average per class",
          },
          rows: [
            {
              label: "Where to use",
              left: "Accuracy first, moderate data size — recommendations, fraud flags",
              right: "Speed first, compact well-separated classes — routing, topic matching",
            },
            {
              label: "When NOT to use",
              left: "Huge datasets (slow) or noisy, uninformative neighbours",
              right: "Odd-shaped classes or unusual members that an average can’t represent",
            },
          ],
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A new sample is closer to the car class center than to the bike class center. What does the centroid classifier decide?",
            choices: [
              { id: "a", label: "Bike, because some bikes are nearby" },
              { id: "b", label: "Car, because it’s nearest the car center" },
              { id: "c", label: "Compare it to every single sample first" },
            ],
            answer: "b",
            explanation:
              "The centroid classifier compares the sample only to each class’s average (center); nearest center wins, so it’s a car.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A delivery trike (3 wheels, carries cargo) arrives. Why might the centroid classifier struggle with it more than kNN would?",
            choices: [
              { id: "a", label: "Trikes have no features" },
              { id: "b", label: "It’s unusual — far from both ‘typical’ centres, so nearest-centre is a poor guide" },
              { id: "c", label: "Centroids only work for cars" },
            ],
            answer: "b",
            explanation:
              "Averages describe the typical, not the odd. kNN could still find the few trike-like neighbours; the single-centre shortcut can’t.",
          },
        ],
      },
      {
        slug: "decision-tree-rules",
        title: "Rules as a tree: the decision tree",
        blurb: "A list of if/then rules is just a tree you walk down to a prediction.",
        topic: "layman-classifiers",
        skillIds: ["decision-trees", "classification-basics", "supervised-learning"],
        capability: "Read a decision tree as a set of rules and follow it to a prediction.",
        minutes: 5,
        prose: [
          "A **decision tree** is just a list of if/then rules, drawn as a path. Start at the top, answer each question, and you land on a prediction.",
          "For the tennis example, the rules look like **‘if sunny and humid, no match’**. Drawn as a tree, that same rule is a branch you walk down.",
          "Many different trees could give the same answers on your data — so the real question is: **which tree is best?** That’s the next lesson.",
        ],
        concept: {
          what: "A **decision tree** is a list of **if/then questions drawn as a path** — start at the top, answer each one, land on a prediction.",
          why: "The tree **explains itself**: you can read the exact branch path behind any answer, making it the most explainable classifier you’ll meet.",
          where: [
            "**‘Sunny and humid → no tennis’** as a walkable branch",
            "**Triage questionnaires** — three answers, one verdict",
            "**Loan rules** auditors can check branch by branch",
          ],
          whenNot:
            "A poor fit when features are **smooth numbers with no natural yes/no questions**, and deep trees risk **memorising noise** — overfitting, covered later in the course.",
        },
        diagram: {
          kind: "decision",
          root: {
            kind: "decision",
            question: "Outlook?",
            branches: [
              {
                label: "sunny",
                node: {
                  kind: "decision",
                  question: "Humidity high?",
                  branches: [
                    { label: "yes", node: { kind: "leaf", answer: "No play" } },
                    { label: "no", node: { kind: "leaf", answer: "Play" } },
                  ],
                },
              },
              { label: "overcast", node: { kind: "leaf", answer: "Play" } },
              {
                label: "rain",
                node: {
                  kind: "decision",
                  question: "Windy?",
                  branches: [
                    { label: "yes", node: { kind: "leaf", answer: "No play" } },
                    { label: "no", node: { kind: "leaf", answer: "Play" } },
                  ],
                },
              },
            ],
          },
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "In the tennis tree, a day that is sunny with high humidity leads to which outcome?",
            choices: [
              { id: "a", label: "Play — sunny days are usually fine" },
              { id: "b", label: "No play — sunny + high humidity → no" },
              { id: "c", label: "Ask another question first" },
            ],
            answer: "b",
            explanation:
              "Walking the tree: outlook=sunny → humidity=high → leaf says 'no'. The tree and the rule give the same answer.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A bank's regulator asks why a loan application was denied. The bank has two models that scored the application identically: a decision tree and a kNN classifier. Which one lets the bank show the regulator the exact reasoning?",
            choices: [
              { id: "a", label: "The decision tree — walk the branches and read the if/then path to the decision" },
              { id: "b", label: "The kNN classifier — show the neighbours that voted" },
              { id: "c", label: "Neither — regulators don't accept model reasoning" },
            ],
            answer: "a",
            explanation:
              "A tree is its own explanation: follow the branches and you see the reasoning. kNN's reasoning is ‘these neighbours voted’, which is harder to inspect — and regulators need the path.",
          },
        ],
      },
      {
        slug: "best-split",
        title: "Which split is best?",
        blurb: "The best question is the one that leaves each side mostly one class.",
        topic: "layman-classifiers",
        skillIds: ["decision-trees", "classification-basics", "supervised-learning"],
        capability: "Judge a good split as one whose branches are mostly pure.",
        minutes: 5,
        prose: [
          "When a tree asks a question, it **splits the data into branches**. A good split leaves each branch mostly one class — that’s called **‘pure’**.",
          "A bad split leaves the branches jumbled. The tree-building rule is simple: at every step, **pick the feature whose split is purest**.",
          "That purity has a name — **information gain** — but the intuition needs no formula: the best question is the one that untangles the classes the most.",
        ],
        concept: {
          what: "When a tree asks a question it **splits the data**; the best split leaves each branch **mostly one class — ‘pure’**.",
          why: "The tree-building rule — **always pick the purest split** — is how the tree decides which question to ask first, no formula needed.",
          where: [
            "‘Wheel count?’ **untangles** cars from bikes in one cut",
            "‘Humidity?’ settles tennis days cleanly",
            "A **50/50-everywhere split** is useless — discard it",
          ],
          whenNot:
            "A split earns its place **only if it purifies** — one that leaves both sides equally mixed answers nothing, however sensible the question sounds.",
        },
        diagram: {
          kind: "decision",
          root: {
            kind: "decision",
            question: "Which question splits the data best?",
            branches: [
              {
                label: "each side one class",
                node: { kind: "leaf", answer: "Use it first", caption: "pure = information gain" },
              },
              {
                label: "both sides mixed",
                node: { kind: "leaf", answer: "Discard it", caption: "zero gain, no matter how sensible" },
              },
            ],
          },
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "One split leaves both sides evenly mixed (yes/no). Another leaves each side all-yes or all-no. Which does the tree prefer?",
            choices: [
              { id: "a", label: "The mixed one — more information" },
              { id: "b", label: "The pure one — each side is decided" },
              { id: "c", label: "Either — purity does not matter" },
            ],
            answer: "b",
            explanation:
              "A pure split (each side mostly one class) is preferred; that purity is what 'information gain' measures.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A candidate first question sorts days into ‘sunny / overcast / rainy’, but every group still has a 50/50 mix of play/no-play. What should the tree builder do?",
            choices: [
              { id: "a", label: "Use it anyway — any split is progress" },
              { id: "b", label: "Discard it — a split that purifies nothing answers nothing, and try other features" },
              { id: "c", label: "Stop building the tree entirely" },
            ],
            answer: "b",
            explanation:
              "A 50/50-everywhere split has zero purity gain. The builder keeps searching for a feature that actually untangles the classes.",
          },
        ],
      },
      {
        slug: "train-test-split",
        title: "Don't grade on what you studied",
        blurb: "Split your data — train on one part, test on a part it's never seen.",
        topic: "layman-evaluation",
        skillIds: ["train-test-split", "classification-basics"],
        capability: "Explain why a model must be evaluated on data it was not trained on.",
        minutes: 4,
        concept: {
          what: "**Split the data**: a training pile to learn from, and a **sealed test pile** the model never sees — grade only on the test.",
          why: "Scoring the studied material measures **memory**; only unseen data measures whether the model **generalizes**.",
          where: [
            "A **fresh exam paper** vs. the one the student revised",
            "A model at **100% on training, 60% on test** — 60 is the honest score",
            "Serious teams keep a **final holdout** nobody touches",
          ],
          whenNot:
            "The test score stays meaningful **only while the test stays sealed** — every peek-and-tweak quietly turns the exam into study material.",
        },
        diagram: {
          kind: "compare",
          left: { title: "Training score", subtitle: "graded on studied data" },
          right: { title: "Test score", subtitle: "graded on unseen data" },
          rows: [
            {
              label: "What it measures",
              left: "Memory — how well the model fits what it saw",
              right: "Generalization — how it will behave in the real world",
            },
            {
              label: "When NOT to trust it",
              left: "As a quality claim — 100% here can be pure memorization",
              right: "After peeking: tweak-until-it-passes turns the test into training data",
            },
          ],
        },
        prose: [
          "Once you've built a classifier, the obvious question is: is it any good? The trap is **checking the same data it learned from**.",
          "If you graded a student on the exact exam questions they studied, you'd learn nothing about whether they understood the ideas — only whether they **memorized**.",
          "The fix is to split your data: a **training pile** the model learns from, and a separate **test pile** it never sees. Only the test score tells you if it **generalizes**.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Your model scores 100% on the data it trained on, but only 60% on new data. What's the most honest read?",
            choices: [
              { id: "a", label: "It's a great model — 100% is the real score" },
              { id: "b", label: "60% on unseen data is the honest measure; 100% may be memorization" },
              { id: "c", label: "It's broken and should be deleted" },
            ],
            answer: "b",
            explanation:
              "The test-set score reflects real-world performance; a perfect training score can mean it memorized rather than learned.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A teammate keeps retraining the model whenever its test-set score dips, tuning until the test score looks great. Weeks later, real traffic performs far worse than that score promised. What happened?",
            choices: [
              { id: "a", label: "The test set leaked — every tweak against it quietly turned the exam into study material" },
              { id: "b", label: "The model got tired of being retrained" },
              { id: "c", label: "Real traffic is always identical to test data" },
            ],
            answer: "a",
            explanation:
              "Peeking and adjusting turns the exam into study material — the score stops predicting real-world behaviour. This is why serious teams keep a final holdout nobody tunes against.",
          },
        ],
      },
      {
        slug: "overfitting",
        title: "Memorizing vs. understanding",
        blurb: "A model can be perfect on training data — and still be wrong on new data.",
        topic: "layman-evaluation",
        skillIds: ["overfitting", "train-test-split"],
        capability: "Recognise overfitting as memorizing training data instead of learning the pattern.",
        minutes: 5,
        concept: {
          what: "**Overfitting** is learning the training data **too precisely** — every quirk and noise — and failing on anything new.",
          why: "It’s the **memoriser vs. understander** gap: perfect scores on old papers, flops on fresh questions. The most common way good-looking models fail.",
          where: [
            "**100% on training, 50% on test** — the classic signature",
            "A model that nailed **only red cars** during training",
            "Quiz apps that ace their own questions, then fail transfers",
          ],
          whenNot:
            "Don’t chase **training-set perfection** — a simpler model with **matching train and test scores** (85/85) usually wins in the real world.",
        },
        diagram: {
          kind: "compare",
          left: { title: "Memorizing", subtitle: "learned every quirk by heart" },
          right: { title: "Understanding", subtitle: "learned the real pattern" },
          rows: [
            {
              label: "Signature",
              left: "100% on training · drops hard on new data",
              right: "Similar scores on both, e.g. 85% / 85%",
            },
            {
              label: "When NOT to use",
              left: "Ever as a shipping model — it fails fresh questions",
              right: "When it underfits — too simple to capture the pattern at all",
            },
          ],
        },
        prose: [
          "**Overfitting** is when a model learns its training data so precisely — every quirk and noise — that it fails on anything new.",
          "It's the difference between a student who **memorized** past exams and one who **understood** the ideas. The memorizer aces the old papers and flops a fresh question.",
          "The goal is the sweet spot: **simple enough to generalize, complex enough to capture the real pattern**.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Two models: one is 100% on training data and 50% on test data; the other is 85% on both. Which is likely better in the real world?",
            choices: [
              { id: "a", label: "The 100%-on-training one — perfection is best" },
              { id: "b", label: "The 85%-on-both one — it generalizes, not memorizes" },
              { id: "c", label: "They're equally good" },
            ],
            answer: "b",
            explanation:
              "Consistent train and test scores mean the model learned a real pattern; a perfect training score with a poor test score is a classic sign of overfitting.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A co-worker says: “Our model got 99% on the training set — ship it!” What question should you ask first?",
            choices: [
              { id: "a", label: "What does it score on data it has never seen?" },
              { id: "b", label: "Can we make it 100% on the training set?" },
              { id: "c", label: "Which algorithm did you use?" },
            ],
            answer: "a",
            explanation:
              "Training-set score alone can’t distinguish understanding from memorising. The unseen-data score is the first honest check.",
          },
        ],
      },
      {
        slug: "data-quality",
        title: "Garbage in, garbage out",
        blurb: "A model is only as good as the data it learns from — fix the data first.",
        topic: "layman-evaluation",
        skillIds: ["data-quality", "ml-limits"],
        capability: "Explain how biased or incomplete data leads to biased predictions.",
        minutes: 5,
        concept: {
          what: "**Garbage in, garbage out**: the data — not the algorithm — is the **single biggest influence** on what a model learns.",
          why: "A model trained on a **narrow or biased slice** of the world judges the whole world through that slice.",
          where: [
            "A model that only saw **red cars** fails on a blue one",
            "**Hiring models** reproducing past demographic bias",
            "**Face unlock** failing on faces it never trained on",
          ],
          whenNot:
            "Don’t reach for a fancier algorithm **before auditing the data** — most classifier problems are data problems in disguise.",
        },
        prose: [
          "The single biggest influence on a model isn't the algorithm — it's **the data**. A fancy model trained on **bad data** still gives bad answers.",
          "If a model only ever saw **red cars**, it would ‘learn’ that cars are red — and then fail on a blue one. That's not a broken model; it's **broken data**.",
          "Before tuning the algorithm, ask: is the data **varied, balanced, and representative** of the real world the model will meet?",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A hiring model was trained only on past hires, who were mostly from one demographic. What's the likely result?",
            choices: [
              { id: "a", label: "It'll be perfectly fair, because data is neutral" },
              { id: "b", label: "It'll reproduce the existing bias, favouring that demographic" },
              { id: "c", label: "It'll fix the bias automatically" },
            ],
            answer: "b",
            explanation:
              "Models learn the patterns in their training data — including historical bias. Garbage (biased data) in, garbage (biased predictions) out.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Your car-vs-bike classifier keeps misjudging bikes. Before switching algorithms, what should you check first?",
            choices: [
              { id: "a", label: "The data — are bikes under-represented, or poorly described by the features?" },
              { id: "b", label: "Nothing — a fancier algorithm always fixes it" },
              { id: "c", label: "The colour settings of the app" },
            ],
            answer: "a",
            explanation:
              "Most classifier problems are data problems in disguise. Fix the examples and the features before reaching for a fancier model.",
          },
        ],
      },
      {
        slug: "ml-in-your-phone",
        title: "ML you already use every day",
        blurb: "Spam filters, recommendations, face unlock — ML is already in your pocket.",
        topic: "layman-real-world",
        skillIds: ["ml-applications", "ai-literacy"],
        capability: "Recognise everyday apps that use machine learning and name the family they belong to.",
        minutes: 4,
        concept: {
          what: "You already use ML **dozens of times a day** — spam filters, keyboards, face unlock, maps — most of it invisible.",
          why: "Each one runs the skeleton you now know: **samples in, a learned pattern out, predictions on new cases** — so ‘AI magic’ becomes something you can question.",
          where: [
            "**Spam filters** that read millions of marked emails",
            "**Keyboards** guessing your next word from your history",
            "**Face unlock** recognising you in bad light",
          ],
          whenNot:
            "Not every clever feature is ML — a **fixed rule** (timer, calculator, sort-by-date) is ordinary programming. Ask what examples it learned from to tell them apart.",
        },
        prose: [
          "You’ve used **machine learning a dozen times today already**. Spam filters deciding what reaches your inbox. Keyboards guessing your next word. Face unlock recognising you in bad light.",
          "Each one is the same skeleton you now know: **samples in, a learned pattern out, predictions on new cases**. A spam filter read millions of marked emails; your keyboard watched which words follow yours.",
          "Once you see the skeleton, ‘AI magic’ turns into something you can question: **what were the examples? What is it predicting? What happens when it’s wrong?**",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Your email moves a message to spam after you’ve marked similar ones as junk before. Which ML family is this?",
            choices: [
              { id: "a", label: "Supervised — it learned from your labelled examples" },
              { id: "b", label: "Unsupervised — it grouped mail with no labels" },
              { id: "c", label: "Reinforcement — it tried actions for rewards" },
            ],
            answer: "a",
            explanation:
              "Your ‘this is junk’ marks are labels; learning to sort future mail from those labelled examples is supervised learning.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Why does face unlock sometimes fail in very dim light, even though it works perfectly indoors?",
            choices: [
              { id: "a", label: "The camera gets tired at night" },
              { id: "b", label: "Dim, grainy photos may be rare in its training examples — it’s predicting outside familiar territory" },
              { id: "c", label: "Faces physically change in the dark" },
            ],
            answer: "b",
            explanation:
              "A model is confident within the range of its examples. Inputs unlike anything it trained on — lighting, angles, accessories — push it off-map, and accuracy drops.",
          },
        ],
      },
      {
        slug: "when-ml-fails",
        title: "When ML gets it wrong",
        blurb: "It’s powerful and it makes mistakes — here’s how to think about both.",
        topic: "layman-real-world",
        skillIds: ["ml-limits", "ai-literacy"],
        capability: "Explain why ML can be confidently wrong and name one safeguard against it.",
        minutes: 5,
        concept: {
          what: "ML **fails quietly**: it always produces an answer, in the same confident tone, **whether it knows or not**.",
          why: "Unlike a calculator that crashes loudly, a **confidently wrong** model looks identical to a right one — that’s the dangerous property.",
          where: [
            "**Face unlock** failing on faces it never trained on",
            "A **chatbot** inventing answers with total confidence",
            "Failures traced to **training gaps, overfitting, or bad data**",
          ],
          whenNot:
            "Never trust tone as a signal of accuracy — the safeguard is asking **what were the examples, how was it tested, and what happens when it’s wrong?**",
        },
        diagram: {
          kind: "decision",
          root: {
            kind: "decision",
            question: "When NOT to trust the output?",
            branches: [
              {
                label: "input unlike any training example",
                node: { kind: "leaf", answer: "Training gap" },
              },
              {
                label: "perfect on training, poor on test",
                node: { kind: "leaf", answer: "Overfitting" },
              },
              {
                label: "data was narrow or biased",
                node: { kind: "leaf", answer: "Bad data" },
              },
            ],
          },
        },
        prose: [
          "Machine learning **fails differently** from ordinary software. A calculator breaks loudly — error, crash, blank screen. A model fails **quietly**: it always produces an answer, in the same confident tone, whether it knows or not.",
          "The failures come from the three things you’ve met: **training gaps** (it never saw a case like this), **overfitting** (it memorised quirks), and **bad data** (it learned a skewed world).",
          "The safeguard isn’t ‘trust it more’ or ‘trust it less’ — it’s knowing **which questions to ask**: what were the examples, how was it tested, and what happens when it’s wrong? Those questions are exactly what the next course, **AI Observability**, teaches you to ask daily.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A face-unlock system fails on a person it was never trained on. What’s the most likely cause?",
            choices: [
              { id: "a", label: "The model is broken and must be replaced" },
              { id: "b", label: "A gap in the training data — it never saw similar faces" },
              { id: "c", label: "The user is holding the phone wrong" },
            ],
            answer: "b",
            explanation:
              "Most ML failures on new inputs come from gaps in training data — the model is guessing outside what it has seen.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "An AI chatbot invents a plausible-but-false answer, stated with total confidence. Which property of ML does this illustrate?",
            choices: [
              { id: "a", label: "Models fail loudly, like a crash" },
              { id: "b", label: "Models always produce an answer in the same confident tone — even outside what they know" },
              { id: "c", label: "Chatbots know when they are lying" },
            ],
            answer: "b",
            explanation:
              "Unlike ordinary software, ML fails quietly: the output looks identical whether the model is on familiar ground or guessing. That’s why watching AI systems matters — the next course shows how.",
          },
        ],
      },
    ],
  },
  {
    slug: "ai-observability",
    title: "AI Observability",
    subtitle: "How to keep an eye on AI so it doesn’t quietly go wrong.",
    description:
      "A picture-led introduction to watching AI systems in the real world. You'll meet the three pillars — logs, metrics, and traces — learn to spot quiet failures like hallucination and drift, and see how teams use dashboards and alerts to catch problems before users do. No coding required.",
    level: "beginner",
    domain: "AI Observability",
    access: "free",
    lessons: [
      {
        slug: "what-is-observability",
        title: "What is observability?",
        blurb: "Seeing inside a system without opening it up.",
        topic: "observability-foundations",
        skillIds: ["ai-observability"],
        capability: "Explain what observability means and why even a working system needs it.",
        minutes: 5,
        concept: {
          what: "**Observability** means telling what’s happening **inside** a system just by reading **signals on the outside** — no opening it up.",
          why: "It turns a hidden engine into a dashboarded one: you see **how it’s really doing underneath**, not just how confident it looks.",
          where: [
            "A **car dashboard** — speed, fuel, engine warnings without lifting the bonnet",
            "An **AI answer service** — readings behind every confident answer",
            "A **delivery app** — where your package actually is, not where it should be",
          ],
          whenNot:
            "It can’t tell you what to *fix* — observability **reveals state**, it doesn’t repair it. And it’s overkill for a system too small to fail quietly.",
        },
        prose: [
          "Observability means being able to tell what’s happening **inside a system just by reading signals on the outside**.",
          "A car’s dashboard does this perfectly. You can’t see the engine, but the **gauges** tell you the speed, the fuel, and whether something is wrong — all without lifting the bonnet.",
          "An AI is also a hidden engine. You only see its answers. Observability gives an AI its own dashboard: little readings that show **how it’s really doing underneath**, not just how confident it sounds.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "You’re driving to the airport and the car feels completely normal. What’s the most reliable way to know the engine is actually healthy before a 300 km drive?",
            choices: [
              { id: "a", label: "Trust how it feels — feel is data" },
              { id: "b", label: "Glance at the dashboard gauges before setting off" },
              { id: "c", label: "Wait for the engine to break down and then decide" },
            ],
            answer: "b",
            explanation:
              "Feelings miss slow problems and breakdowns are too late. Gauges reveal the engine’s hidden state — exactly what observability gives you for an AI.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Your company’s chatbot gives an answer that looks perfectly fine to users. With observability in place, what can the team do that they couldn’t before?",
            choices: [
              { id: "a", label: "Read the readings behind the answer to check whether it’s actually fine underneath" },
              { id: "b", label: "Make every answer longer automatically" },
              { id: "c", label: "Read the chatbot’s source code on the user’s phone" },
            ],
            answer: "a",
            explanation:
              "Looking fine isn’t being fine. Observability reveals the hidden state — latency, cost, groundedness — behind a confident-looking answer. It isn’t about code access or longer text.",
          },
        ],
      },
      {
        slug: "why-ai-is-different",
        title: "Why is AI different from normal software?",
        blurb: "A vending machine always behaves the same. An AI doesn’t.",
        topic: "observability-foundations",
        skillIds: ["ai-observability"],
        capability: "Explain why AI is non-deterministic and why that changes how we monitor it.",
        minutes: 5,
        concept: {
          what: "AI is **non-deterministic**: the same input can produce **different outputs** on different runs — like a chef, not a vending machine.",
          why: "It breaks test-once-trust-forever monitoring: one good answer **doesn’t promise the next**, so each run needs watching.",
          where: [
            "A **chatbot** answering the same question differently across days",
            "**Image generators** producing a new picture every click",
            "A **vending machine** — the contrast case: same button, same can, forever",
          ],
          whenNot:
            "Not the whole story for **deterministic** pipelines around the AI — caches, routers, and validators behave like ordinary software and can be tested once.",
        },
        prose: [
          "Normal software is like a **vending machine**. Press the same button, get the same thing, every single time. It’s predictable.",
          "AI is more like a **chef**. Order the same dish twice and you’ll get two slightly different meals — both perfectly fine, but never identical.",
          "This changes how we monitor it. With a vending machine you can test it once and trust it. With a chef, one good meal doesn’t promise the next — so you have to **keep watching how each one turns out**.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A QA tester sends the same prompt to your support chatbot on Monday and Tuesday and gets two slightly different answers. Both read fine. Has something broken?",
            choices: [
              { id: "a", label: "No — the same input can produce different outputs; that’s non-determinism, not breakage" },
              { id: "b", label: "Yes — identical prompts must always return identical answers" },
              { id: "c", label: "It means the chatbot has no inputs" },
            ],
            answer: "a",
            explanation:
              "Non-deterministic means the output isn’t fixed by the input — it can vary. It doesn’t mean broken. Two fine-but-different answers is normal AI behaviour.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Your team certified a vending-machine-style checkout flow with one week of tests and shipped it. Now they want to apply the same test-once approach to the new AI assistant. Why won’t it work?",
            choices: [
              { id: "a", label: "The AI is too slow to test twice" },
              { id: "b", label: "One good run doesn’t guarantee the next — the same prompt can answer differently over time, so every run needs watching" },
              { id: "c", label: "The AI deletes its old answers after testing" },
            ],
            answer: "b",
            explanation:
              "Deterministic software passes once and stays passed. AI varies run-to-run, so certification has to become continuous observation.",
          },
        ],
      },
      {
        slug: "when-ai-goes-wrong",
        title: "When AI goes wrong, it rarely crashes",
        blurb: "Software fails loudly. AI fails quietly.",
        topic: "observability-foundations",
        skillIds: ["ai-observability", "llm-hallucination", "model-drift", "llm-cost-latency"],
        capability: "Recognise that AI usually fails quietly, and name the three common quiet-failure modes.",
        minutes: 6,
        concept: {
          what: "AI **fails quietly**: it keeps answering in the same confident tone while answers quietly turn wrong, **costs climb**, or quality **drifts** — nothing crashes.",
          why: "Silent failures run for **days or weeks** before anyone notices; observability exists to make quiet problems **loud enough to catch early**.",
          where: [
            "A support bot **hallucinating a refund policy** no one notices",
            "An assistant whose **token bill doubles** over a month",
            "A ranking model whose **quality drifts** after a data change",
          ],
          whenNot:
            "Not the failure shape of ordinary software — a crashed page or full disk is already loud; that’s classic monitoring, not AI observability.",
        },
        prose: [
          "Normal software fails loudly. A page stops loading, an error pops up, the app freezes. Everyone notices, and someone fixes it.",
          "AI tends to fail **quietly**. It keeps answering with a smile — but the answers quietly become wrong, the costs quietly climb, or the quality quietly **drifts** downward over time.",
          "Because nothing actually crashes, nobody realises until the damage is done. That’s the core problem observability exists to solve: **making quiet problems loud enough to catch early**.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "For three weeks, your company’s chatbot has been inventing a return policy that doesn’t exist — politely, confidently, and with zero error messages. Users are following the fake policy. Why did nobody catch it for so long?",
            choices: [
              { id: "a", label: "The failure was loud but support was understaffed" },
              { id: "b", label: "AI fails quietly — nothing crashed, so the confident wrongness ran unnoticed until users complained" },
              { id: "c", label: "The chatbot was working exactly as intended" },
            ],
            answer: "b",
            explanation:
              "AI keeps running and answering even when something is wrong, so the failure is silent rather than a crash. Invisibility is exactly what makes quiet failures expensive.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A teammate lists the incidents from last quarter: (1) the website went down when disk filled up, (2) the chatbot started citing a deleted policy, (3) the AI feature’s bill doubled silently. Which two are AI quiet-failure modes?",
            choices: [
              { id: "a", label: "1 and 2 — both are crashes" },
              { id: "b", label: "2 and 3 — confident wrongness and quietly climbing cost" },
              { id: "c", label: "1 and 3 — disk and money are the same kind of problem" },
            ],
            answer: "b",
            explanation:
              "Disk space is a loud, classic crash. The AI quiet modes are being confidently wrong and costs drifting up — no error screen, just slow damage.",
          },
        ],
      },
      {
        slug: "logs-what-ai-said",
        title: "Logs: what the AI said",
        blurb: "A diary of every exchange, so odd answers aren’t a mystery.",
        topic: "observability-pillars",
        skillIds: ["system-logs"],
        capability: "Read a log entry and explain how logging helps answer ‘why did the AI say that?’.",
        minutes: 5,
        concept: {
          what: "**Logs** are a diary of what the AI said — every exchange written down **as it happens**.",
          why: "Without logs, an odd answer is a mystery; with them, **‘why did it say that?’ becomes investigable** — exact prompt, answer, timestamp, version.",
          where: [
            "Scrolling back to the **exact odd answer** a user screenshotted",
            "Checking which **model version** answered a support ticket",
            "Reconstructing a **complaint** from words, not memory",
          ],
          whenNot:
            "Logs don’t tell you trends — ‘is it getting slower overall?’ is a **metric** question, not a diary lookup.",
        },
        prose: [
          "Logs are a **diary of what the AI said**. Every exchange — what was asked and what was answered — gets written down as it happens.",
          "Without logs, an odd answer is a mystery. You remember it felt wrong, but the exact words, the time, and the model version are all gone.",
          "With logs, you can scroll back, find the entry, and see the precise **prompt, answer, timestamp, and version**. ‘Why did it say that?’ becomes a question you can actually investigate.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A user tweets a screenshot of your support bot promising a ‘full lifetime refund’ — but doesn’t say when it happened. Without logs, what’s your situation?",
            choices: [
              { id: "a", label: "You can find the exact exchange instantly" },
              { id: "b", label: "You only have a memory of it feeling wrong — the exact words, time, and model version are gone" },
              { id: "c", label: "Nothing — tweets aren’t real incidents" },
            ],
            answer: "b",
            explanation:
              "A log is the record of events that makes ‘why did it say that?’ investigable. Without it, you’re reconstructing from screenshots and memory.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Your team is writing the log-entry standard for a new chatbot. One engineer wants prompt + answer + timestamp + model version; another wants to also store each user’s full name and home address ‘for context’. Which four fields are the right core?",
            choices: [
              { id: "a", label: "Prompt, answer, timestamp, and model version" },
              { id: "b", label: "Full name, address, timestamp, and weather" },
              { id: "c", label: "Only the answers — prompts take too much space" },
            ],
            answer: "a",
            explanation:
              "Those four reconstruct exactly what happened. Personal data isn’t needed to debug an answer — and storing it creates a privacy problem instead of solving a debugging one.",
          },
        ],
      },
      {
        slug: "metrics-counting-matters",
        title: "Metrics: counting what matters",
        blurb: "Turn “it feels slow” into numbers you can watch.",
        topic: "observability-pillars",
        skillIds: ["system-metrics", "llm-cost-latency"],
        capability: "Name the key AI metrics and explain why watching them over time reveals quiet problems.",
        minutes: 6,
        concept: {
          what: "**Metrics** are numbers counted over time — a log records one event; a metric **summarises thousands**.",
          why: "Watching numbers move turns ‘it feels slow’ into evidence — **a spike is a quiet problem announcing itself**.",
          where: [
            "**Latency** — how long answers take",
            "**Cost & token usage** — how much it reads, writes, spends",
            "**Error rate** — how often it fails",
          ],
          whenNot:
            "Metrics won’t explain any single answer — ‘why did it say *that*?’ needs a **log**, not an average.",
        },
        prose: [
          "Metrics are numbers you count over time. Where a log records one event, a metric **summarises thousands** — ‘how slow, on average, over the last day?’.",
          "For an AI, four numbers matter most: **latency** (how long an answer takes), **cost** (how much it spends), **error rate** (how often it fails), and **token usage** (how much it reads and writes).",
          "On their own the numbers are just numbers. The magic is **watching them move**. A sudden spike in error rate is a quiet problem announcing itself — exactly what you’d miss without the dashboard. Try the 24h window on the dashboard above and spot the spike.",
        ],
        diagram: {
          kind: "flow",
          steps: [
            { kind: "input", text: "Thousands of requests" },
            { kind: "process", text: "Count over time", caption: "avg latency · error rate · tokens · cost" },
            { kind: "output", text: "A line you can watch move" },
          ],
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Users keep telling your team the chatbot ‘feels slow lately’. You need to confirm it with evidence — not vibes — and see whether it’s getting worse week over week. What do you pull up?",
            choices: [
              { id: "a", label: "The average-latency metric graphed over the last few weeks" },
              { id: "b", label: "One user’s exact logged conversation from Tuesday" },
              { id: "c", label: "The chatbot’s source code" },
            ],
            answer: "a",
            explanation:
              "A metric aggregates thousands of events into a number over time — exactly what ‘is it getting slower?’ needs. One log entry can’t show a trend.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Your AI feature’s monthly bill jumped 40% but no one filed a complaint and every answer looks fine. Which metric would have caught this quietly climbing cost before the invoice did?",
            choices: [
              { id: "a", label: "Latency — slow requests always cost more" },
              { id: "b", label: "Token usage tracked over the month" },
              { id: "c", label: "The CEO’s mood index" },
            ],
            answer: "b",
            explanation:
              "Token usage and cost are the money metrics. A steady climb in either is a quiet failure showing up as a number you can see and act on — before the invoice arrives.",
          },
        ],
      },
      {
        slug: "traces-the-journey",
        title: "Traces: following a request’s journey",
        blurb: "Follow one request end-to-end and find the slow step.",
        topic: "observability-pillars",
        skillIds: ["distributed-tracing"],
        capability: "Read a trace and identify which step in a request is the bottleneck.",
        minutes: 6,
        concept: {
          what: "A **trace** follows **one request end-to-end** — every step behind the scenes, each with its own timing bar.",
          why: "It localises vague complaints: ‘the AI is slow’ becomes **‘THIS step is slow’** — usually the big model call.",
          where: [
            "Finding the **slow step** in a support-bot request",
            "Seeing **where the money goes** (which calls spend tokens)",
            "Pointing engineers at the **exact** hop to optimise",
          ],
          whenNot:
            "A single trace can’t tell you trends — ‘is latency rising across all requests?’ is a **metric** question; traces zoom into one journey.",
        },
        prose: [
          "A trace follows **one request on its full journey** — from the moment a question arrives, through every step behind the scenes, to the final answer.",
          "Each step gets its own little bar showing how long it took. Stacked together, they reveal the shape of the whole request: **where the time goes and where the money goes**.",
          "The trick is that most steps are quick and one is slow. Without a trace, ‘the AI is slow’ is a vague complaint. With one, you can point at the exact step — usually the big model call — and say ‘there, that’s most of the time’. Try tapping the steps above.",
        ],
        diagram: {
          kind: "flow",
          steps: [
            { kind: "input", text: "One user question" },
            { kind: "process", text: "Steps: retrieve → LLM call → format" },
            { kind: "output", text: "Timed bars: the slow step stands out" },
          ],
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Your support bot takes 9 seconds per reply and users are complaining. The average-latency metric confirms it’s slow, but not why. What do you open next to find the culprit step?",
            choices: [
              { id: "a", label: "A trace of one slow request, to see which step’s bar dominates" },
              { id: "b", label: "The latency graph again, zoomed in" },
              { id: "c", label: "The model vendor’s pricing page" },
            ],
            answer: "a",
            explanation:
              "A metric gives an average across many requests. A trace zooms into one request and shows every step inside it — that’s how ‘it’s slow’ becomes ‘the LLM call is slow’.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "In your trace, the bar for the big LLM call is roughly 80% of the request’s total time; retrieval and formatting are slivers. Your team proposes a week optimising the formatting code. What does the trace say?",
            choices: [
              { id: "a", label: "Go ahead — formatting is easier to fix" },
              { id: "b", label: "Effort is going to the wrong step — the LLM call dominates, so that’s where the time actually is" },
              { id: "c", label: "The trace is broken because bars should be equal" },
            ],
            answer: "b",
            explanation:
              "A trace localises slowness to a specific step so effort goes where it matters. A week on a 5% step can’t move a 9-second reply; the 80% LLM call can.",
          },
        ],
      },
      {
        slug: "is-the-answer-good",
        title: "“Is the answer good?” — evaluation",
        blurb: "Turn a fuzzy question into a rubric of checks.",
        topic: "observability-quality",
        skillIds: ["llm-evaluation"],
        capability: "Explain how a rubric and a reviewer turn a fuzzy ‘is it good?’ into checkable evaluation.",
        minutes: 6,
        concept: {
          what: "**Evaluation** turns fuzzy ‘is it good?’ into a **rubric of sharp checks** — facts right? helpful? on-topic? safe? — applied by a reviewer.",
          why: "An answer can read beautifully and still be wrong; a rubric makes quality **measurable instead of felt**.",
          where: [
            "A **human reviewer** scoring a sample of answers each week",
            "An **AI judge** scoring thousands overnight",
            "Most teams **blending both** on a schedule",
          ],
          whenNot:
            "Evaluation scores **samples on a schedule** — it can’t certify every live answer, and a rubric is only as honest as its checks.",
        },
        prose: [
          "“Is this answer good?” is the hardest question in AI. An answer can **read beautifully and still be wrong**, unhelpful, or off-topic.",
          "The trick is to stop asking one fuzzy question and ask several sharp ones instead — a **rubric**. Does it get the facts right? Is it helpful? Is it on-topic? Is it safe?",
          "Then someone applies the rubric. A **human reviewer** is careful but slow; a second AI acting as a **judge** is fast but not perfect. Most teams blend both, checking a sample of answers on a regular schedule.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Your chatbot’s latest answer is eloquent, on-brand, perfectly formatted — and cites a discount code that expired in 2023. Users are already trying it. Why didn’t ‘it reads well’ catch this?",
            choices: [
              { id: "a", label: "Because reading well is not being right — surface polish hides factual problems, which is why evaluation uses a rubric of specific checks" },
              { id: "b", label: "Because nobody on the team speaks the language" },
              { id: "c", label: "Because expired codes are actually valid forever" },
            ],
            answer: "a",
            explanation:
              "‘Good’ must be broken into checkable parts — factual correctness first. An eloquent wrong answer is the classic evaluation trap.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "You must review 10,000 support answers per month. A human reviewer scores 500 with great care; an AI judge scores all 10,000 overnight but sometimes misgrades nuance. What do most teams actually do?",
            choices: [
              { id: "a", label: "Use only the human — quality beats coverage" },
              { id: "b", label: "Use only the AI judge — speed beats everything" },
              { id: "c", label: "Blend both: AI judge at scale, human spot-checks on a sample" },
            ],
            answer: "c",
            explanation:
              "Humans are careful but slow; AI judges are fast but imperfect. Blending both gets coverage and a calibrated sample — each covers the other’s weakness.",
          },
        ],
      },
      {
        slug: "hallucination-makes-things-up",
        title: "Hallucination: confident, but wrong",
        blurb: "A wrong answer that looks exactly like a right one.",
        topic: "observability-quality",
        skillIds: ["llm-hallucination", "llm-evaluation"],
        capability: "Explain why AI hallucinates and how logs and evaluation catch confident falsehoods.",
        minutes: 6,
        concept: {
          what: "A **hallucination** is a wrong answer said with complete confidence — **it looks identical to a correct one**.",
          why: "The AI **predicts plausible text, it doesn’t look up facts** — so sometimes the most plausible-sounding line is false, and only observability catches it.",
          where: [
            "A support bot inventing a **refund policy**",
            "An assistant citing a **paper that doesn’t exist**",
            "A legal summariser **misquoting** a clause",
          ],
          whenNot:
            "Not solved by making answers sound more careful — confidence **carries no accuracy signal**; you need **logs + evaluation**, not better tone.",
        },
        prose: [
          "A hallucination is a **wrong answer said with complete confidence**. It looks identical to a correct one — there’s no warning in the wording.",
          "This happens because the AI isn’t a database. It **predicts which words tend to follow others**, producing text that sounds plausible. Sometimes the most plausible-sounding line simply isn’t true.",
          "Because a confident answer isn’t a checked answer, you catch hallucinations with observability: **logs** let you re-read what was said, and an **evaluation rubric** asks the dangerous question — ‘is this actually correct?’.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Your medical-info chatbot tells a user to take 800 mg of a medicine every 2 hours — stated exactly as confidently as its correct answers. Why is this failure so dangerous compared to a crashed page?",
            choices: [
              { id: "a", label: "Because a confident falsehood looks identical to a correct answer — there’s no warning in the wording" },
              { id: "b", label: "Because crashes are always safer than answers" },
              { id: "c", label: "Because the chatbot knows it is lying" },
            ],
            answer: "a",
            explanation:
              "A hallucination is a wrong answer said with complete confidence — no crash, no error tone. The confidence is exactly what makes it dangerous.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A manager wants to stop hallucinations by adding ‘always be careful and accurate’ to the system prompt so answers sound more cautious. What actually catches confident falsehoods?",
            choices: [
              { id: "a", label: "Logs to re-read what was said, plus an evaluation rubric asking ‘is this actually correct?’" },
              { id: "b", label: "A bigger font and a faster server" },
              { id: "c", label: "Turning the AI off after every answer" },
            ],
            answer: "a",
            explanation:
              "The model predicts plausible words — tone prompts can’t change that machinery. Observability surfaces confident lies: logs let you re-check what was said; evaluation asks if it was correct.",
          },
        ],
      },
      {
        slug: "drift-slowly-going-bad",
        title: "Drift: when AI slowly goes bad",
        blurb: "Slow decay as the world changes around a frozen model.",
        topic: "observability-quality",
        skillIds: ["model-drift"],
        capability: "Explain model drift and why quality must be watched over time, not tested once.",
        minutes: 6,
        concept: {
          what: "**Drift** is slow decay: the model is frozen at training, but the **world keeps moving** — quality slips a little at a time.",
          why: "Nothing crashes and there’s **no single moment of failure** — only a **trend over time** reveals the slide before users feel it.",
          where: [
            "A news summariser after **new events** its training never saw",
            "A shopping assistant as **new products and slang** arrive",
            "A fraud model as **fraudsters change tactics**",
          ],
          whenNot:
            "Not the diagnosis when the model **never worked** — that’s a build problem. Drift is ‘was good, quietly became worse’.",
        },
        prose: [
          "Drift is **slow decay**. A model is frozen when it’s trained, but the world keeps moving — new words, new events, new user behaviour arrive every week.",
          "Nothing crashes, and there’s no single moment of failure to point at. Like **milk slowly turning sour**, quality just slips a little at a time until, months later, the answers are subtly worse.",
          "A one-off test can’t see a slide like this. The only way to catch drift is to **keep measuring quality over time and watch the trend** — so you notice the decline before your users do.",
        ],
        diagram: {
          kind: "compare",
          left: { title: "One-off test", subtitle: "a snapshot" },
          right: { title: "Quality over time", subtitle: "a trend" },
          rows: [
            {
              label: "What it shows",
              left: "How good the model was on launch day",
              right: "The slope — good in March, subtly worse by June",
            },
            {
              label: "When NOT to use",
              left: "Alone — it can’t see a slow slide",
              right: "To explain a sudden breakage — that’s an incident, not drift",
            },
          ],
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Your travel-chatbot scored 92% quality in January and 74% by June. No code changed, no crashes, no complaints until May — users just started asking about destinations and slang that didn’t exist in training. What happened?",
            choices: [
              { id: "a", label: "Drift — the frozen model slowly lost fit as the world moved around it" },
              { id: "b", label: "A crash — the model broke in May" },
              { id: "c", label: "Nothing — quality scores always vary randomly" },
            ],
            answer: "a",
            explanation:
              "Drift is gradual decay, not a crash. The model didn’t change; its fit to the world did — new words, new destinations, new behaviour.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "The team proposes re-running the January quality test once a year to certify the model, like a car inspection. Why won’t that catch drift?",
            choices: [
              { id: "a", label: "Because the test itself will retire" },
              { id: "b", label: "Because drift is gradual — a single snapshot can’t show a slope; you need quality measured repeatedly over time" },
              { id: "c", label: "Because drift only happens to cars" },
            ],
            answer: "b",
            explanation:
              "A single test is a snapshot. Drift only shows up as a slope when you compare snapshots across weeks — measure quality continuously, not annually.",
          },
        ],
      },
      {
        slug: "alerts-knowing-when-to-act",
        title: "Alerts: knowing when to act",
        blurb: "A smoke alarm for your AI — and the art of setting it right.",
        topic: "observability-action",
        skillIds: ["alerting"],
        capability: "Explain the alert-threshold trade-off between false alarms and missed problems.",
        minutes: 6,
        concept: {
          what: "An **alert** is a rule with a **threshold** — ‘if the error rate crosses this number, wake me up’. A smoke alarm for your AI.",
          why: "It converts a moving metric into a **timely decision** — but the threshold is a **trade-off** between false alarms and missed fires.",
          where: [
            "Paging an on-call engineer when **error rate spikes**",
            "A budget alarm when **token spend** crosses a line",
            "A quality alert when **eval scores dip** for days",
          ],
          whenNot:
            "Alerts can’t tell you *why* — diagnosis needs **traces and logs**; and an over-firing alert is worse than none because **people stop trusting it**.",
        },
        prose: [
          "An alert is a **rule with a threshold**: ‘if the error rate goes above this number, wake me up’. It’s a smoke alarm for your AI.",
          "The hard part is where you set the threshold. **Too low** and it fires at every wobble — you stop trusting it, and when a real fire starts you ignore it. **Too high** and it never fires at all, and a real problem burns quietly.",
          "There’s no perfect setting, only a **trade-off**. The art is tuning it so you catch the real problems without crying wolf. Try dragging the threshold above and watch the two counters change.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "An on-call engineer sets the error-rate alert so sensitively it fires several times a day on normal noise. Last night a real incident started at 2 am — and she slept through the alert. What actually failed?",
            choices: [
              { id: "a", label: "The alert system was offline" },
              { id: "b", label: "The threshold was too low — months of false alarms taught her to ignore the page, so the real one read as noise" },
              { id: "c", label: "Real incidents can’t be alerted on" },
            ],
            answer: "b",
            explanation:
              "A low threshold fires on normal noise; cry wolf often enough and people stop trusting the alert — exactly when it matters most.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A team sets their alert threshold extremely high ‘to keep the pager quiet’. For three weeks a genuine quality problem smoulders, noticed by no one. What did the too-high threshold cause?",
            choices: [
              { id: "a", label: "Missed real problems — the alert never fires, so the failure stays silent" },
              { id: "b", label: "More false alarms, just later" },
              { id: "c", label: "Faster answers across the board" },
            ],
            answer: "a",
            explanation:
              "A high threshold rarely fires, so genuine problems slip past unnoticed — the silent failure the alert existed to catch. Tuning is a trade-off, not a quest for quiet.",
          },
        ],
      },
      {
        slug: "dashboards-control-room",
        title: "Dashboards: the control room",
        blurb: "One screen you glance at to know if you’re healthy.",
        topic: "observability-action",
        skillIds: ["observability-dashboards"],
        capability: "Explain what makes a good dashboard and why glancability matters.",
        minutes: 5,
        concept: {
          what: "A **dashboard** is the one screen you glance at to know if a system is healthy — **one look says ‘fine’ or ‘something’s wrong’**.",
          why: "Glancability is the whole job: the **few numbers that matter, big and clear** — less, but louder.",
          where: [
            "A **plane cockpit** — the original glanceable control room",
            "A team’s **daily health check** before standup",
            "An **on-call screen** watched during incidents",
          ],
          whenNot:
            "Not a place for every number — forty tiny readings is unreadable, and **unreadable dashboards get ignored**. Detail belongs in logs and traces.",
        },
        prose: [
          "A dashboard is the one screen you **glance at** to know if a system is healthy — like the cockpit of a plane. You shouldn’t have to study it; one look should tell you ‘fine’ or ‘something’s wrong’.",
          "The common mistake is to **cram everything in**. A dashboard with forty tiny readings is unreadable — a glance tells you nothing, so you eventually stop looking.",
          "A good dashboard shows only the **few numbers that matter**, big and clear, with the bad ones obvious. Less, but louder. That’s what makes one glance enough.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A proud engineer builds a dashboard with forty tiny charts covering every metric the system emits. Two months later, nobody on the team opens it — including him. What killed it?",
            choices: [
              { id: "a", label: "It couldn’t be read at a glance, so people stopped looking — the failure is human, not technical" },
              { id: "b", label: "It used too much computer memory" },
              { id: "c", label: "Dashboards only work on planes" },
            ],
            answer: "a",
            explanation:
              "Glancability is the job. Unreadable dashboards get ignored, defeating their purpose — fewer numbers, bigger and louder, survives daily use.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A manager asks the team to remove the error-rate and cost panels from the customer-facing AI dashboard because ‘they sometimes look bad when executives visit’. What does removing them break?",
            choices: [
              { id: "a", label: "Nothing — happy metrics are the healthy ones" },
              { id: "b", label: "The at-a-glance signal — hiding the bad numbers means a glance can no longer say ‘something’s wrong’" },
              { id: "c", label: "Only the colour scheme" },
            ],
            answer: "b",
            explanation:
              "A good dashboard shows the few numbers that matter with the bad ones obvious. Cherry-picking the happy metrics destroys the one job a dashboard has.",
          },
        ],
      },
      {
        slug: "cost-and-speed",
        title: "Cost and speed: the two big bills",
        blurb: "Every AI feature pays in tokens and in time.",
        topic: "observability-action",
        skillIds: ["llm-cost-latency"],
        capability: "Explain why cost and latency are the two key business bills for any AI feature.",
        minutes: 5,
        concept: {
          what: "Every AI feature pays **two bills**: **cost** (the tokens it reads and writes) and **latency** (the time it takes to answer).",
          why: "They’re business problems, not just technical ones — cost **eats margin**, latency **loses users** — and they usually **rise together**.",
          where: [
            "A **chatty support feature** quietly wiping out margin",
            "A **slow shopping assistant** users abandon mid-question",
            "A **bigger model upgrade** raising the token bill and wait time at once",
          ],
          whenNot:
            "Not independent knobs — you can’t minimise both and maximise capability; the trade-off is the decision, and it needs **numbers on a dashboard** to make.",
        },
        prose: [
          "Every AI feature pays two bills: **cost** — the tokens it reads and writes, like distance in a taxi — and **latency** — the time it takes to answer, like minutes on the road.",
          "The two tend to **travel together**. A bigger, more capable answer usually costs more and takes longer; a smaller one is cheaper and faster but less capable.",
          "Both are **business problems**, not just technical ones. Cost eats your profit margin — an unwatched, chatty feature can wipe it out. Latency loses users — people quietly abandon slow apps. Watching both is part of shipping AI responsibly.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "To improve answer quality, your team switches the support bot to a bigger model. Support tickets praise the richer answers — but the monthly token bill doubles and replies now take twice as long. What happened?",
            choices: [
              { id: "a", label: "Cost and latency travel together — a bigger, more capable call costs more tokens AND more time" },
              { id: "b", label: "The bigger model was broken" },
              { id: "c", label: "Quality upgrades are always free" },
            ],
            answer: "a",
            explanation:
              "More tokens means more spend and more time — the two bills rise together. That trade-off is exactly what cost-and-latency metrics exist to quantify.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A founder argues latency is ‘just an engineering metric’ and only the token bill matters for the business. A product manager disagrees, pointing at last month’s 15% drop in completed chats. Who’s right, and why?",
            choices: [
              { id: "a", label: "The PM — slow apps lose users; latency is a retention problem dressed up as a technical one" },
              { id: "b", label: "The founder — users never notice speed" },
              { id: "c", label: "Both wrong — latency improves accuracy" },
            ],
            answer: "a",
            explanation:
              "Real users abandon slow experiences. Cost eats margin and latency loses users — both bills hit the business, which is why observability tracks them together.",
          },
        ],
      },
      {
        slug: "observability-toolkit",
        title: "The observability toolkit",
        blurb: "You don’t build this from scratch — you bolt on a tool.",
        topic: "observability-realworld",
        skillIds: ["observability-tools"],
        capability: "Name common observability tools and the job each one does, and explain how to start.",
        minutes: 5,
        concept: {
          what: "Observability is **bolted on, not built from scratch** — a tool collects the logs, metrics, and traces; you read them.",
          why: "Mature tools let you spend time on **diagnosis, not construction** — like wearing a fitness tracker instead of building a heart-rate monitor.",
          where: [
            "**AI/LLM-focused tools** — tracing calls, evaluating answers",
            "**General-purpose platforms** — metrics, logs, alerts for any software",
            "Starting with **one tool that fits** and expanding later",
          ],
          whenNot:
            "Don’t install everything at once (overwhelming) or wait for a break (too late) — and a tool **collects** signals; it still can’t read them for you.",
        },
        prose: [
          "You don’t build observability from scratch. Just like you’d **wear a fitness tracker** rather than build your own heart-rate monitor, you bolt on a tool that collects the **logs, metrics, and traces** for you.",
          "There’s a healthy menu to choose from. Some tools focus on **AI and LLMs** — tracing calls and evaluating answers. Others are **general-purpose**, handling metrics, logs, and alerts for any software, AI included.",
          "Don’t try to memorise the names. The point is simpler: whatever signal you need to watch, **a tool already exists to collect it**. Pick one that fits what you’re building and start there.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A two-person startup is about to ship an AI feature. Engineer A proposes spending two months writing custom logging, metrics, and tracing code; Engineer B proposes bolting on an existing observability tool this week. What’s the practical choice — and the trade-off?",
            choices: [
              { id: "a", label: "Bolt on the tool — you spend your time diagnosing signals, not building instruments" },
              { id: "b", label: "Build from scratch — custom instruments are always better" },
              { id: "c", label: "Neither — small teams can’t have observability" },
            ],
            answer: "a",
            explanation:
              "Mature tools let you focus on reading the signals instead of building the instruments — diagnosis, not construction, is where your time pays off.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Your team must pick a first tool for a chatbot product. One option is an LLM-focused observability platform; the other is a general-purpose infrastructure monitor. The chatbot’s biggest risk is bad answers reaching users. Which fits better, and why?",
            choices: [
              { id: "a", label: "The LLM-focused tool — tracing requests and evaluating answers is exactly what it specialises in" },
              { id: "b", label: "The general-purpose tool — it can evaluate answers better" },
              { id: "c", label: "Install both plus two more, to be safe" },
            ],
            answer: "a",
            explanation:
              "LLM-focused tools specialise in tracing calls and judging answer quality — the two things generic tools do less well. Start with one that fits; expand later, don’t install everything at once.",
          },
        ],
      },
      {
        slug: "day-in-the-life",
        title: "A day in the life of an AI team",
        blurb: "The whole course as one connected story.",
        topic: "observability-realworld",
        skillIds: ["ai-observability"],
        capability: "Describe the full observability loop — watch, alert, trace, log, fix — as one connected workflow.",
        minutes: 6,
        concept: {
          what: "Observability is **one continuous loop** — **watch → alert → trace → log → fix → repeat** — not a setup-and-forget step.",
          why: "Each pass catches a quiet problem **before users complain**; every tool in the toolkit is just a **role in the loop**.",
          where: [
            "A dashboard reading **healthy for weeks**, then…",
            "An **alert** firing when error rate crosses its threshold",
            "A **trace + logs** pointing at the changed knowledge source",
          ],
          whenNot:
            "The loop ends only if you stop watching — a one-time setup can’t catch problems that **haven’t happened yet**.",
        },
        prose: [
          "Here’s the whole course in one story. A team ships an AI feature. From day one, **logs, metrics, and traces flow quietly into a dashboard** that reads healthy.",
          "Weeks later, **an alert fires** — the error rate has crept past its threshold. Nothing crashed; the dashboard caught a quiet problem before users complained.",
          "The team opens a **trace** for a failing request and pinpoints the slow step. The **logs** reveal why: a knowledge source the AI depended on quietly changed. They fix the cause and watch the metric recover.",
          "That’s the loop: **watch → alert → trace → log → fix → repeat**. Every tool in this course is just a role in that loop.",
        ],
        diagram: {
          kind: "flow",
          steps: [
            { kind: "input", text: "Signals flow: logs · metrics · traces" },
            { kind: "process", text: "Alert fires past threshold" },
            { kind: "process", text: "Trace finds the step" },
            { kind: "output", text: "Logs name the cause — fix" },
          ],
          loop: "Back to watching — the loop never ends",
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "For six weeks your team’s AI feature hums along: dashboards healthy, no complaints. Then one morning the error-rate alert fires — nothing crashed, nothing was deployed overnight. What turned this quiet problem into an investigation?",
            choices: [
              { id: "a", label: "The alert — a metric crossing its threshold — not a crash or a user email" },
              { id: "b", label: "The app crashing loudly at 3 am" },
              { id: "c", label: "A user emailing the CEO screenshots" },
            ],
            answer: "a",
            explanation:
              "The alert — fed by a metric crossing a threshold — is what turns a quiet problem into an investigated one. That’s its role in the loop: catch what doesn’t crash.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Following the alert, the team must find the cause. Rank the loop’s next two moves: what finds the failing step, and what explains what that step actually did wrong?",
            choices: [
              { id: "a", label: "A trace finds the step; logs explain why it went wrong" },
              { id: "b", label: "A bigger server finds the step; a louder alarm explains why" },
              { id: "c", label: "A new logo finds the step; a slogan explains why" },
            ],
            answer: "a",
            explanation:
              "The trace localises the failure to a step; the logs show what that step did — together they point at the cause, the fix lands, and the loop returns to watching.",
          },
        ],
      },
    ],
  },
  {
    slug: "llm-observability",
    title: "LLM Observability",
    subtitle: "Instrument, evaluate, and rescue one LLM/RAG feature in production.",
    description:
      "An intermediate, hands-on course that follows one customer-support assistant through a real incident. Trace requests, build evaluations, set SLOs, and diagnose a regression end-to-end. Some Python familiarity helps; there are a few short exercises.",
    level: "intermediate",
    domain: "AI Observability",
    access: "free",
    prerequisites:
      "The AI Observability course (or equivalent hands-on experience) — you should already be comfortable with logs, metrics, traces, and evaluation basics.",
    lessons: [
      {
        slug: "request-to-trace",
        title: "From a request to a trace",
        blurb: "One user turn becomes one trace of nested spans.",
        topic: "tracing-foundations",
        skillIds: ["distributed-tracing", "otel-genai"],
        capability: "Read a trace of nested spans and reconstruct one user turn end-to-end.",
        minutes: 8,
        concept: {
          what: "A **trace** is one request broken into nested **spans** — one span per step (retrieval, LLM call, tool), each with its own timing and attributes.",
          why: "It replaces guesswork with attribution: 'the assistant is slow' becomes '**this span** is slow', because a **correlation ID** stitches every child span to the request that caused it.",
          where: [
            "Reconstructing **one slow support-bot turn** across retrieval, model, and tool services",
            "Proving a **tool call** — not the model — produced a bad answer",
            "Attributing an 860ms model call vs a 110ms stalled tool in one view",
          ],
          whenNot:
            "One trace can't show trends — 'is latency rising this week?' is a **metric** question; traces zoom into a **single request**.",
        },
        prose: [
          "A **trace** is a single request broken into **spans**. Each span is one unit of work — a retrieval, an LLM call, a tool invocation — with a start, an end, and a set of attributes that describe what happened. Spans nest: a **root span** for the whole request parents child spans for each step, so you can reconstruct the entire turn.",
          "The glue is a **correlation ID** carried on the root span and inherited by every child. That ID is what lets you go from a slow user turn to the exact retrieval, model call, and tool interaction that composed it — across services, without guessing.",
          "Without a trace you have only **averages**: 'latency is high'. With one, you have a **story**: the retrieval was fine, the model took 860ms, and a tool call stalled for 110ms. Diagnosis replaces guesswork.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "During a customer demo, your support assistant takes 14 seconds to answer one question. You want to know exactly which step inside that request ate the time. What do you open?",
            choices: [
              { id: "a", label: "The trace of that one request, to see each span's timing and attributes" },
              { id: "b", label: "The weekly average-latency metric, zoomed into demo day" },
              { id: "c", label: "The model vendor's pricing page" },
              { id: "d", label: "The front-end JavaScript console" },
            ],
            answer: "a",
            explanation:
              "The average confirms slowness but can't attribute it. A trace breaks that single request into nested spans — retrieval, model call, tool — so the slow step is visible at a glance.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Your e-commerce checkout copilot spans three services — retrieval, model, and a payments tool — and users report intermittent wrong totals. What mechanism reassembles each user's full journey across those services?",
            choices: [
              { id: "a", label: "Matching timestamps across services to the nearest second" },
              { id: "b", label: "A correlation ID on the root span, inherited by every child span" },
              { id: "c", label: "Attaching the customer's email to every service's logs" },
              { id: "d", label: "The HTTP status code returned by each service" },
            ],
            answer: "b",
            explanation:
              "The correlation ID is the glue that stitches spans from different services into one trace. Timestamps drift, emails are PII, and status codes say nothing about which request a call belonged to.",
          },
        ],
      },
      {
        slug: "instrument-right-context",
        title: "Instrument the right context",
        blurb: "The few span attributes that explain a change — and the ones that leak.",
        topic: "tracing-foundations",
        skillIds: ["llm-instrumentation", "telemetry-privacy"],
        capability: "Choose span attributes that aid debugging without leaking PII or adding noise.",
        minutes: 9,
        concept: {
          what: "Instrument a **small set of high-value dimensions** — model, prompt version, retrieval version, tool name — the variables that **change between releases**.",
          why: "Tagging spans with them turns ‘something regressed’ into **‘it regressed when prompt v17 shipped’** — release-level attribution instead of guesswork.",
          where: [
            "Bisecting a quality drop to **the exact prompt or retrieval version**",
            "Comparing **model variants** across the same traffic",
            "Attributing a cost spike to **one tool’s calls**",
          ],
          whenNot:
            "Not raw prompts, not PII, not anything **unique per request** — over-collection builds a breach surface, and high-cardinality attributes explode indexes without aiding any query.",
        },
        prose: [
          "Good instrumentation is a small set of **high-value dimensions**: the model, the prompt version, the retrieval version, and any tool name. These are the variables that **change between releases**, so tagging every span with them turns ‘something regressed’ into ‘it regressed when prompt v17 shipped’.",
          "Two failure modes are equally common. The first is **over-collection**: logging raw prompts and user emails wholesale, which turns your telemetry store into a breach surface. The second is **high-cardinality noise**: a unique attribute per request (a raw timestamp, a full session id) that explodes index sizes without aiding any query.",
          "The rule: capture the **dimensions that explain a change**, redact or sample everything that identifies a person, and leave out anything that's unique per request. A clean contract is **small, private, and diagnostic**.",
        ],
        diagram: {
          kind: "decision",
          root: {
            kind: "decision",
            question: "Add this span attribute?",
            branches: [
              { label: "varies by release", node: { kind: "leaf", answer: "Tag it", caption: "model · prompt version · retrieval version · tool" } },
              { label: "identifies a person", node: { kind: "leaf", answer: "Redact or hash", caption: "opaque tenant id, never raw PII" } },
              { label: "unique per request", node: { kind: "leaf", answer: "Leave it out", caption: "high-cardinality noise" } },
            ],
          },
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Quality scores on your support assistant dropped 12% sometime this month. Two prompts (v16, v17) and one retrieval index change shipped in that window. With every span tagged model + prompt_version + retrieval_version, what does the investigation look like?",
            choices: [
              { id: "a", label: "Split the metric by prompt version and retrieval version — the guilty release stands out immediately" },
              { id: "b", label: "Read every raw prompt from the month, one by one" },
              { id: "c", label: "Guess, then roll back everything at once" },
              { id: "d", label: "Wait for users to say which answers felt wrong" },
            ],
            answer: "a",
            explanation:
              "Release-varying dimensions are exactly what turns ‘something regressed’ into ‘it regressed when prompt v17 shipped’. Raw prompt reading is what you do after attribution, not before.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A new engineer proposes tagging every span with the user's email, the full raw prompt, and a nanosecond timestamp ‘so nothing is ever lost’. Security reviews it next week. Which two objections should they expect?",
            choices: [
              { id: "a", label: "Emails are PII (breach surface) and nanosecond timestamps are high-cardinality noise that bloats indexes without aiding queries" },
              { id: "b", label: "Emails are too short, and timestamps are too long" },
              { id: "c", label: "Raw prompts can't be stored as strings" },
              { id: "d", label: "None — collecting everything is always safer" },
            ],
            answer: "a",
            explanation:
              "Over-collection builds a breach surface (PII in the telemetry store) and unique-per-request attributes explode index sizes — the two failure modes a clean contract avoids.",
          },
        ],
      },
      {
        slug: "logs-without-leaking",
        title: "Logs that help without leaking data",
        blurb: "Redact, minimise, and still debug.",
        topic: "tracing-foundations",
        skillIds: ["telemetry-privacy"],
        capability: "Redact and minimise log content so debugging value survives without PII exposure.",
        minutes: 8,
        concept: {
          what: "Logs are where **debugging value** and **privacy risk** collide: minimise first — do you need the field at all? — then log the least identifying form.",
          why: "A **hashed user id** or a **token count** keeps the debugging signal while shrinking the breach surface: if the log table leaks, nothing about a person escapes.",
          where: [
            "Replacing a user's email with a **hashed id** in support-assistant logs",
            "Logging **token counts** and a prompt version instead of raw prompts in a RAG pipeline",
            "Sampling a fraction of answers so retention stays short and cheap",
          ],
          whenNot:
            "Encoding is not redaction — base64 or truncation still leaks; and a field that isn't needed for debugging or audit shouldn't be logged at all.",
        },
        prose: [
          "Logs are where **debugging value** and **privacy risk** collide. The same line that helps you reconstruct a faulty turn can also contain a card number, an email, or a secret the model echoed back. The discipline is to separate the two: keep what explains behaviour, **redact** what identifies a person.",
          "**Minimisation** comes before redaction. Ask whether a field needs to be logged at all; if it does, log the least identifying form — a hash of the user id, a token count instead of the raw prompt, a sampled answer rather than every one. **Retention** and consent then set how long even the redacted data lives.",
          "The practical test is the **'breach' thought experiment**: if this log table leaked tomorrow, what could someone learn about a user? Anything that fails that test gets cut, hashed, or sampled before it's written.",
        ],
        diagram: {
          kind: "decision",
          root: {
            kind: "decision",
            question: "Log this field?",
            branches: [
              { label: "Not needed for debugging", node: { kind: "leaf", answer: "Don't log it", caption: "Minimisation first" } },
              { label: "Needed, identifies a person", node: { kind: "leaf", answer: "Hash or sample", caption: "Opaque id, not PII" } },
              { label: "Needed, not identifying", node: { kind: "leaf", answer: "Log it", caption: "Keep it low-cardinality" } },
            ],
          },
        },
        exercise: {
          id: "ex1",
          title: "Classify a log line",
          prompt:
            "A function should return 'leaky' if a log line contains an email ('@') or a long digit run (4+ digits in a row, like a card), and 'safe' otherwise. It currently never flags anything — fix it.",
          starterCode: `def classify(line: str) -> str:
    """Return 'leaky' if the line contains an email ('@') or a long digit run
    (4+ digits in a row), otherwise 'safe'."""
    return "safe"   # <-- wrong: never flags anything
`,
          testCode: `
cases = [
    ("user=john@acme.com", "leaky"),
    ("prompt=card 4111 1111 1111 1111 here", "leaky"),
    ("model=gpt-4o prompt_version=v17", "safe"),
    ("answer=please contact support", "safe"),
]
ok = True
message = "ok"
for line, expected in cases:
    got = classify(line)
    if got != expected:
        ok = False
        message = f"classify({line!r}) -> {got!r}, expected {expected!r}"
        break
`,
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Your support assistant logs every turn, and legal asks what would be exposed if the log table leaked tomorrow. Which logged field already fails that 'breach' test?",
            choices: [
              { id: "a", label: "user=jane.doe@acme.com" },
              { id: "b", label: "model=gpt-4o prompt_version=v17" },
              { id: "c", label: "tokens_in=1840 tokens_out=210" },
              { id: "d", label: "tool=refund status=ok" },
            ],
            answer: "a",
            explanation:
              "The email is PII — it identifies a person and is near-unique per request. Version tags and token counts explain behaviour without identifying anyone; the fix is a hashed or opaque id.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A health-tech RAG team wants raw prompt text in logs 'for debugging' and proposes base64-encoding it to 'anonymise' it. What is the correct call?",
            choices: [
              { id: "a", label: "Base64 is fine — encoding counts as anonymisation" },
              { id: "b", label: "Log raw prompts only in production, never in staging" },
              { id: "c", label: "Log token counts and a prompt version id instead of the raw text" },
              { id: "d", label: "Keep the prompts but shorten retention to one quarter" },
            ],
            answer: "c",
            explanation:
              "Encoding is reversible, so patient questions leak just the same. Minimisation replaces raw text with a version id and counts; retention tweaks don't undo exposure.",
          },
        ],
      },
      {
        slug: "latency-cost-broken-down",
        title: "Latency and cost, broken down",
        blurb: "Time-to-first-token vs total time; tokens by stage.",
        topic: "performance-and-slos",
        skillIds: ["llm-cost-latency"],
        capability: "Split latency into TTFT vs total, and cost into tokens by stage.",
        minutes: 8,
        concept: {
          what: "LLM latency has two faces — **time-to-first-token** (prefill + retrieval) and **total time** (adds decode) — and cost follows **tokens by stage**, not milliseconds.",
          why: "Users feel TTFT as 'is it working?' and total time as 'is it done?' — **separate problems with separate fixes** — and the token breakdown shows whether **over-retrieval** or chatty outputs drive the bill.",
          where: [
            "Diagnosing a support bot that 'thinks forever' as a **TTFT** problem",
            "Cutting **input-token** cost by trimming retrieved context in a RAG pipeline",
            "Alerting on **p95/p99** where users actually abandon the assistant",
          ],
          whenNot:
            "Never steer by the mean — an average hides the slow tail; and a short answer on a huge prompt can cost more than a long one.",
        },
        prose: [
          "Latency for an LLM turn has two faces. **Time-to-first-token** is how long the user waits before anything appears — dominated by prompt processing (prefill) and any blocking retrieval. **Total latency** adds the generation (decode) phase on top. Users feel TTFT as 'is it working?' and total time as 'is it done?'; they're separate problems with separate fixes.",
          "Cost follows the **tokens**, not the milliseconds. **Input tokens** (the prompt and retrieved context) are priced differently from **output tokens** (the answer), and a long prompt with a short answer can cost more than the reverse. Breaking cost down by stage shows whether your bill is driven by over-retrieval, verbose prompts, or chatty outputs.",
          "**Percentiles** matter more than averages. A p50 of 980ms with a p99 of 3.4s means most users are fine and a few are abandoned; chasing the average hides the tail. Report **p50, p95, and p99** separately, and alert on the percentile that maps to user pain.",
        ],
        diagram: {
          kind: "flow",
          steps: [
            { kind: "input", text: "One LLM turn" },
            { kind: "process", text: "Prefill + retrieval", caption: "Drives time-to-first-token" },
            { kind: "process", text: "Decode answer tokens", caption: "Adds the rest of total time" },
            { kind: "output", text: "TTFT, total, token cost", caption: "Report p50/p95/p99 separately" },
          ],
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "After a prompt change, users of your support assistant complain it 'thinks forever before replying' — a long blank pause, then a normal-speed answer. Which measurement do you check first?",
            choices: [
              { id: "a", label: "Output tokens per second, since generation is the bottleneck" },
              { id: "b", label: "The daily token bill" },
              { id: "c", label: "Time-to-first-token — prefill and blocking retrieval dominate the blank pause" },
              { id: "d", label: "The number of concurrent users on the site" },
            ],
            answer: "c",
            explanation:
              "A blank pause before anything appears is a TTFT symptom — prompt processing and blocking retrieval own it. Decode speed only matters after the first token lands.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Your RAG pipeline's monthly token bill doubled, but analytics show answers are the same length as last month. Where is the growth most likely coming from?",
            choices: [
              { id: "a", label: "Output tokens — the model got chattier" },
              { id: "b", label: "Input tokens — over-retrieval or a bloated prompt template inflating context" },
              { id: "c", label: "The vendor quietly raised output-token prices" },
              { id: "d", label: "Fewer requests, each billed at double rate" },
            ],
            answer: "b",
            explanation:
              "Cost tracks tokens by stage. With stable outputs, growth is on the input side — retrieved chunks and template bloat. Assuming 'longer answers cost more' misses that prompts often dominate the bill.",
          },
        ],
      },
      {
        slug: "ai-service-level-objective",
        title: "Define an AI service level objective",
        blurb: "Turn 'helpful and fast' into a number with an error budget.",
        topic: "performance-and-slos",
        skillIds: ["ai-slo", "llm-evaluation"],
        capability: "Turn a fuzzy quality goal into an SLI, a target, and an error budget.",
        minutes: 9,
        concept: {
          what: "An **SLO** makes a wish measurable: pick an **SLI** (say, the share of answers passing evaluation), set a **target** (99% over 28 days), and the remainder is your **error budget**.",
          why: "The budget is a **decision tool** — while you have budget left you can ship; when it's **burning fast**, you stop shipping and fix instead of arguing.",
          where: [
            "Turning 'helpful support bot' into '**eval pass rate ≥ 99%** over 28 days'",
            "Freezing releases when a quality SLO's budget burns down after a bad deploy",
            "Tuning the target between **user pain** (too loose) and **pager noise** (too tight)",
          ],
          whenNot:
            "No eval pipeline, no quality SLO — an SLI you can't measure can't have a target; latency-only SLOs are the honest fallback until eval exists.",
        },
        prose: [
          "'Helpful and fast' isn't an objective; it's a wish. An **SLO** makes it measurable: pick a **service-level indicator** (say, the share of answers that pass evaluation), set a target (99% over 28 days), and derive the **error budget** — the 1% of bad outcomes you've decided to tolerate.",
          "The error budget is the **decision tool**. While you have budget left, you can ship; when it's burning fast, you stop shipping and fix. A **loose target** (90%) tolerates too much user pain; a **tight one** (99.9%) burns the budget on noise and pages on-call constantly. The right target is empirical — set by what users actually do, then iterate.",
          "Crucially, the SLI for an AI feature is usually a **quality signal**, not just latency. You measure not only 'did it respond fast' but 'did it answer well' — which means your SLO depends on the **evaluation pipeline** feeding it. No eval, no quality SLO.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Your support assistant's SLO is 'answers passing eval ≥ 99% over 28 days'. The morning after a release, the 28-day pass rate has slid to 98.2% and the budget is burning fast. What does the SLO framework tell the team to do?",
            choices: [
              { id: "a", label: "Raise the target to 99.5% so the number looks achievable again" },
              { id: "b", label: "Switch the SLO to latency only, which is easier to hit" },
              { id: "c", label: "Freeze releases and roll back or fix — real users are burning the budget" },
              { id: "d", label: "Leave it — 98.2% is close enough to 99%" },
            ],
            answer: "c",
            explanation:
              "The budget is the decision tool: fast burn means users are hitting bad outcomes now, so shipping stops until it's fixed. Raising or swapping the target hides the pain instead of addressing it.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A startup wants a quality SLO for its new doc-search assistant, but nothing scores whether answers are good — there is no evaluation pipeline. What is the honest move?",
            choices: [
              { id: "a", label: "Set the quality SLO anyway and estimate the pass rate by skimming a few chats" },
              { id: "b", label: "Set latency and cost SLOs now; add the quality SLO once an eval signal exists" },
              { id: "c", label: "Declare 'quality = 100%' since the model is brand new" },
              { id: "d", label: "Skip SLOs entirely until the product matures" },
            ],
            answer: "b",
            explanation:
              "An SLI you can't measure can't have a target — the quality SLO depends on the eval pipeline feeding it. Latency SLOs are still real; abandoning SLOs altogether leaves nothing governed.",
          },
        ],
      },
      {
        slug: "quality-is-a-signal",
        title: "Quality is a production signal",
        blurb: "Offline golden sets and online sampling each catch what the other misses.",
        topic: "evaluation",
        skillIds: ["offline-evaluation", "online-evaluation"],
        capability: "Decide when to use offline vs online evaluation and unify the metric across both.",
        minutes: 8,
        concept: {
          what: "**Offline evaluation** scores a candidate on a fixed **golden set** before it ships; **online evaluation** samples and scores live traffic continuously — both under **one shared metric**.",
          why: "Offline is your repeatable **deploy gate** for known failure modes; online is the only signal for **drift and unknown unknowns**. A shared metric makes their disagreement meaningful.",
          where: [
            "Gating a **prompt v17 release** on the golden set in CI",
            "Sampling 1% of live **support traffic** to watch for slow decay",
            "Catching a **stale golden set** when offline and online scores diverge",
          ],
          whenNot:
            "Offline alone can't see new user behaviour, and online alone can't veto a release before users see it — the deploy/monitor split is the boundary.",
        },
        prose: [
          "**Offline evaluation** runs your candidate change against a fixed, labelled **golden set** before it ships. It's repeatable, fast, and catches the regressions you can predict — the known failure modes your team has seen before. It's your **deploy gate**.",
          "**Online evaluation** samples real production traffic and scores it continuously. It catches what offline can't: **drift**, surprising new prompts, and slow decay as the world changes. It's noisier and needs sampling and dedup to stay affordable, but it's the only signal for the **unknown unknowns**.",
          "The two only work together if they **share a metric**. Define 'quality' one way (the same rubric, the same judge) and compute it on the golden set before deploy and on sampled live traffic after. Disagreement between the two is itself a signal — your golden set has **drifted from reality**.",
        ],
        diagram: {
          kind: "compare",
          left: { title: "Offline eval", subtitle: "Fixed golden set, pre-ship" },
          right: { title: "Online eval", subtitle: "Sampled live traffic, continuous" },
          rows: [
            { label: "Role", left: "Deploy gate in CI", right: "Drift watch in production" },
            { label: "Catches", left: "Known failure modes", right: "New prompts, slow decay" },
            { label: "Watch out for", left: "Set drifts from reality", right: "Noise and eval cost" },
          ],
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Your prompt update scored 96% on the golden set, up from 94%, so you shipped it. Two weeks later, sampled live-traffic scores have slid from 91% to 79%. What is the most likely explanation?",
            choices: [
              { id: "a", label: "Online scores are always lower than offline — nothing changed" },
              { id: "b", label: "The golden set has drifted from reality: live traffic now contains prompt types the set doesn't cover" },
              { id: "c", label: "Sampling randomness moved the number; resample and it will return to 91%" },
              { id: "d", label: "The golden set got easier between releases" },
            ],
            answer: "b",
            explanation:
              "A stable gap between offline and online is expected; a widening one is signal. Offline only tests the cases it contains, so genuinely new user behaviour drags the live score while offline stays rosy.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A teammate proposes dropping the golden set entirely and gating each release of your RAG search assistant on live production scores instead. What is the strongest objection?",
            choices: [
              { id: "a", label: "Golden sets are required by OpenTelemetry, so removing one breaks tracing" },
              { id: "b", label: "Live scores are always higher and would mask regressions" },
              { id: "c", label: "You can't gate a release on traffic it hasn't served yet — offline eval is the pre-ship gate" },
              { id: "d", label: "Online evaluation is free, so there is nothing to decide" },
            ],
            answer: "c",
            explanation:
              "Online eval measures what already shipped; it cannot veto a candidate before users see it. The deploy/monitor split is the point — offline gates, online watches.",
          },
        ],
      },
      {
        slug: "llm-as-a-judge",
        title: "LLM-as-a-judge",
        blurb: "A fast, cheap first pass — never the last word.",
        topic: "evaluation",
        skillIds: ["llm-judge", "eval-bias"],
        capability: "Use an LLM judge and know when to calibrate it against humans.",
        minutes: 9,
        concept: {
          what: "An **LLM judge** is one model grading another's outputs — **single scoring**, **pairwise comparison**, or listwise ranking — making large-scale evaluation affordable.",
          why: "It scales evaluation **past what humans can hand-label**, which is what makes large offline and online eval pipelines economically possible at all.",
          where: [
            "Scoring thousands of sampled **support answers** every night",
            "Running **pairwise comparison** of candidate vs incumbent prompt releases",
            "Cheap **first-pass triage** of low-rated conversations for human review",
          ],
          whenNot:
            "An uncalibrated judge is not ground truth — it carries **verbosity, self-preference, and position biases**, and without human calibration its scores are uninterpretable.",
        },
        prose: [
          "An **LLM judge** uses one model to grade another's outputs — **single scoring**, **pairwise comparison**, or listwise ranking. It scales evaluation far past what humans can do by hand, which is what makes large offline and online eval pipelines affordable at all.",
          "But a judge brings its own **biases**. It confuses verbosity for quality, prefers its own style (**self-preference**), and in pairwise comparisons is swayed by which answer came first (**position bias**). It can score fluency well while missing facts entirely — a polished lie beats a plain truth if you let it.",
          "The discipline is **calibration**. Start from human labels, measure how often the judge agrees, and mitigate the big biases (swap answer order in pairs, control for length). Treat the judge's score as a **cheap first pass** to be spot-checked, not a ground truth. Where judge and human disagree systematically is exactly where your rubric needs work.",
        ],
        exercise: {
          id: "ex2",
          title: "Fix the rubric",
          prompt:
            "A rubric should pass an answer only if it is correct AND at least somewhat fluent (fluency >= 3). Right now a fluent lie still passes, because correctness is ignored. Fix the rule.",
          starterCode: `def passes(correct: bool, fluency: int) -> bool:
    """Pass only if the answer is correct AND fluency >= 3."""
    return fluency >= 3   # <-- wrong: a fluent lie passes
`,
          testCode: `
cases = [
    (True, 5, True),
    (False, 5, False),
    (True, 2, False),
    (False, 2, False),
    (True, 3, True),
]
ok = True
message = "ok"
for correct, fluency, expected in cases:
    got = passes(correct, fluency)
    if got != expected:
        ok = False
        message = f"passes({correct}, {fluency}) -> {got}, expected {expected}"
        break
`,
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Your judge model reviews support answers in pairs and reliably picks the longer one, even when the shorter answer is more accurate. It also favours whichever answer is shown first. What are these biases, and what is the standard mitigation?",
            choices: [
              { id: "a", label: "Self-preference and drift — retrain the judge on fresh data" },
              { id: "b", label: "Sampling error — score more pairs and the bias averages out" },
              { id: "c", label: "Verbosity bias and position bias — control for length and swap answer order before averaging" },
              { id: "d", label: "Position bias and hallucination — lower the judge's temperature" },
            ],
            answer: "c",
            explanation:
              "Preferring length is verbosity bias; favouring the first slot is position bias. Length control and order-swapping are the standard fixes — more volume never averages away a systematic bias.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "At a legal-tech startup, the judge gives a polished but factually wrong contract summary 9/10 while human reviewers consistently rate it 2/10. What does the discipline of calibration say to do?",
            choices: [
              { id: "a", label: "Trust the judge — humans rate legal text too harshly" },
              { id: "b", label: "Measure judge-human agreement on labelled samples, then fix the rubric where they systematically disagree" },
              { id: "c", label: "Swap to a smaller judge model and hope it becomes stricter" },
              { id: "d", label: "Drop the fluency dimension and score answer length only" },
            ],
            answer: "b",
            explanation:
              "Systematic judge-human disagreement is exactly where the rubric needs work — here the judge confuses fluency with correctness. Calibration locates the failure; trusting or resizing the judge leaves the bias in place.",
          },
        ],
      },
      {
        slug: "observe-rag-not-just-model",
        title: "Observe RAG, not only the model",
        blurb: "Faithfulness and context quality — the retrieval layer's metrics.",
        topic: "evaluation",
        skillIds: ["rag-evaluation"],
        capability: "Measure RAG quality with faithfulness and context metrics, not just fluency.",
        minutes: 8,
        concept: {
          what: "RAG fails in **two layers** — retrieval (wrong or buried chunks) and generation (ungrounded answers). **Faithfulness** and **context precision/recall** tell you which layer broke.",
          why: "Fluency hides **retrieval rot**: a confident answer on bad context looks fine to answer-relevancy alone. Layer metrics point at the **right fix** instead of the model.",
          where: [
            "Diagnosing a support bot that answers fluently but **cites nothing in the retrieved docs**",
            "Deciding whether to fix the **retriever ranker** or the generation prompt",
            "Catching **buried or empty retrieval** before users report wrong answers",
          ],
          whenNot:
            "Answer relevancy alone can't do this — it measures the answer, not the grounding; a model can be relevant and wrong.",
        },
        prose: [
          "RAG systems fail in two places, and only one is the model. The **retrieval layer** can return irrelevant chunks, bury the good one, or come back empty — and the model will still produce a fluent, confident answer on top of bad context. **Fluency** hides **retrieval rot**.",
          "The metrics that expose this are retrieval-aware. **Faithfulness** asks whether every claim in the answer is supported by the retrieved context. **Context precision** asks whether the relevant chunks were ranked highly rather than buried. **Context recall** asks whether the needed information was retrieved at all. Answer relevancy, alone, is the one that can look fine while the others collapse.",
          "When a RAG answer is bad, the instinct is to blame the model. The metrics tell you where: low context precision means fix the **retriever ranking**; low faithfulness with good context means fix the **generation** (or the prompt); empty retrieval is an **index problem**. Diagnose the layer before you touch the model.",
        ],
        diagram: {
          kind: "decision",
          root: {
            kind: "decision",
            question: "Bad RAG answer — what broke?",
            branches: [
              { label: "Retrieval came back empty", node: { kind: "leaf", answer: "Index problem", caption: "Needed info never fetched" } },
              {
                label: "Chunks came back",
                node: {
                  kind: "decision",
                  question: "Was the relevant chunk ranked high?",
                  branches: [
                    { label: "No — buried under junk", node: { kind: "leaf", answer: "Fix retriever ranking", caption: "Low context precision" } },
                    { label: "Yes — answer still strays", node: { kind: "leaf", answer: "Fix generation or prompt", caption: "Low faithfulness, good context" } },
                  ],
                },
              },
            ],
          },
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Your support assistant started citing refund policies that don't exist. Faithfulness scores dropped hard this week, but context precision and recall are healthy — the right chunks are retrieved and ranked well. Where do you fix?",
            choices: [
              { id: "a", label: "Retrieval ranking — push the irrelevant chunks further down" },
              { id: "b", label: "The vector index — rebuild it from scratch" },
              { id: "c", label: "Generation — the model adds unsupported claims despite good context; tighten the prompt or model config" },
              { id: "d", label: "The front-end — strip unsupported sentences before display" },
            ],
            answer: "c",
            explanation:
              "Good context plus low faithfulness means the model strayed from its grounding — a generation/prompt problem. Blaming retrieval here wastes days on the layer the metrics just cleared.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A hospital's doc-search bot returns confident, on-topic answers, and its dashboard shows healthy answer relevancy. Clinicians complain the answers don't match the handbook. Which signal was missing from the dashboard?",
            choices: [
              { id: "a", label: "Faithfulness — whether each claim is supported by the retrieved context" },
              { id: "b", label: "Answer relevancy, computed on a bigger sample" },
              { id: "c", label: "Average response latency" },
              { id: "d", label: "Token cost per query" },
            ],
            answer: "a",
            explanation:
              "Relevancy measures topic fit, not grounding — a model can be relevant and wrong. Only faithfulness and context metrics test whether claims trace to the retrieved text.",
          },
        ],
      },
      {
        slug: "prompt-model-tool-regressions",
        title: "Prompt, model, and tool regressions",
        blurb: "Bisect the one variable that changed — don't blame the model first.",
        topic: "incidents",
        skillIds: ["eval-gates"],
        capability: "Bisect the changed variable instead of blaming the model by default.",
        minutes: 8,
        concept: {
          what: "Only **versioned things can regress**. Tag spans with **prompt, model, retrieval, and tool versions**, and a quality drop becomes a **diff between releases**.",
          why: "The model is usually the thing you **didn't change** — the culprit is a prompt tweak, ranker change, or tool update, and the version diff hands you the suspect.",
          where: [
            "Bisecting 'quality dropped Tuesday' down to **prompt v17** in a support assistant",
            "**Canary releases** — 5% of traffic, watch the eval, promote only if it holds",
            "**Eval gates in CI** — a candidate must beat or match the incumbent on the golden set",
          ],
          whenNot:
            "A variable that isn't version-tagged can't be bisected — regressions follow changes, and the unchanged model is rarely the culprit.",
        },
        prose: [
          "Regressions feel like mysteries until you remember that only **versioned things can regress**. If you tag every span with prompt version, model, retrieval version, and tool version, then a drop in quality becomes a **diff problem**: what changed between the last healthy release and this one?",
          "The instinct to blame the model first is almost always wrong, because the model is usually the thing you **didn't change**. Far more often the culprit is a prompt tweak, a retriever ranking change, a tool that now returns differently, or a quiet dependency update. A **canary release** makes this legible — ship to 5% of traffic, watch the eval, and only promote if it holds.",
          "The discipline is to hold every other variable constant and **change one**. **Eval gates** in CI encode this: a candidate release must beat or match the incumbent on the golden set before it ships. When it doesn't, the diff between releases is your **suspect list**, already narrowed to a single variable.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Monday morning, your support assistant's eval pass rate drops 6 points. The team's first instinct is 'the model got worse over the weekend.' You check span attributes: model unchanged, but prompt went v16 to v17 and retrieval r3 to r4 on Friday. What actually happened?",
            choices: [
              { id: "a", label: "The model degraded spontaneously — open a vendor ticket" },
              { id: "b", label: "The eval dashboard broke when the attributes changed" },
              { id: "c", label: "Users started asking harder questions over the weekend" },
              { id: "d", label: "One of the changed variables — prompt v17 or retrieval r4 — is the suspect; diff those releases" },
            ],
            answer: "d",
            explanation:
              "Regressions follow changes. The unchanged model is the least likely culprit; the versioned diff turns a mystery into a two-item suspect list.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Your e-commerce assistant team wants to ship a new retrieval ranker but got burned by the last silent regression. What release mechanism limits the blast radius while proving the change is safe?",
            choices: [
              { id: "a", label: "Canary to 5% of traffic behind an eval gate; promote only if scores hold" },
              { id: "b", label: "Ship to 100% on Friday and watch the dashboards over the weekend" },
              { id: "c", label: "Roll out to internal employees only, since internal bugs don't count" },
              { id: "d", label: "Disable the eval gates so the release can't be blocked" },
            ],
            answer: "a",
            explanation:
              "A canary exposes a slice of real traffic to the change, and the eval gate blocks promotion if quality drops — small blast radius, fast rollback. Big-bang releases trade that safety for nothing.",
          },
        ],
      },
      {
        slug: "alerts-people-trust",
        title: "Alerts people trust",
        blurb: "Burn-rate over static lines, with a runbook attached.",
        topic: "incidents",
        skillIds: ["alerting"],
        capability: "Choose burn-rate alerting over static thresholds and attach a runbook.",
        minutes: 8,
        concept: {
          what: "A **burn-rate alert** pages on **sustained error-budget burn** across time windows — not momentary spikes — and every alert carries a **runbook**.",
          why: "On-call only trusts alerts that fire on **real user impact**: static thresholds cry wolf on blips until engineers mute them and the real incident sails through.",
          where: [
            "Paging when a support bot's quality SLO **burns its budget** within minutes",
            "Staying quiet through a 3am **low-traffic rate spike** that burns nothing",
            "Attaching the **first three steps** to every page so diagnosis starts instantly",
          ],
          whenNot:
            "Don't page on single bad requests or momentary spikes — and an alert without a runbook is noise with a siren.",
        },
        prose: [
          "An alert is only useful if on-call trusts it. A **static threshold** — page whenever a metric crosses a line — cries wolf on every blip, especially under low traffic when a few bad requests spike the rate. After a dozen false pages, engineers **mute** it, and the real incident sails through.",
          "**Burn-rate alerting** pages on sustained user impact, not momentary spikes. It watches how fast the **error budget** is burning across multiple time windows: a brief blip doesn't burn enough to page, but a steady degradation trips a long-window check within minutes of real impact. It trades a little detection latency for a lot of precision.",
          "Every alert needs a **runbook** — the **first three steps** on-call takes when it fires. An alert without a runbook is noise with a siren; an alert with one is a decision already half-made. Route by severity, deduplicate, and make the path from page to diagnosis obvious.",
        ],
        diagram: {
          kind: "compare",
          left: { title: "Static threshold", subtitle: "Page when a metric crosses a line" },
          right: { title: "Burn-rate alert", subtitle: "Page on sustained budget burn" },
          rows: [
            { label: "3am traffic dip", left: "Fires on a few bad requests", right: "Stays quiet — nothing burned" },
            { label: "Real degradation", left: "May already be muted by on-call", right: "Pages within minutes of impact" },
            { label: "On-call trust", left: "Erodes after false pages", right: "Holds — pages mean impact" },
          ],
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Your error-rate alert fired at 3am because 4 of 20 overnight requests failed — traffic is always thin then. It has fired 11 times this month and 10 were false; the team keeps muting it. What is the root problem and the fix?",
            choices: [
              { id: "a", label: "On-call is too sensitive — rotate the paging shift more often" },
              { id: "b", label: "The SLO target is too tight — lower it to 90% so the alert stops firing" },
              { id: "c", label: "A static threshold on a volatile low-traffic rate — replace it with burn-rate alerting on the error budget" },
              { id: "d", label: "Nothing — failures simply shouldn't happen at 3am" },
            ],
            answer: "c",
            explanation:
              "Rates are statistically volatile at low volume, so a line-crossing alert cries wolf. Burn-rate pages only on sustained budget burn — real impact — which is what restores trust. Loosening the target just hides pain.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "You join a fintech chatbot team whose only alert is 'quality score < 90' with no documentation. When it fired at 2am, the on-call engineer spent 20 minutes just figuring out what the metric was. What is missing?",
            choices: [
              { id: "a", label: "A louder pager so the alert can't be missed" },
              { id: "b", label: "More alerts — one per model — so coverage feels complete" },
              { id: "c", label: "A bigger model so quality never drops in the first place" },
              { id: "d", label: "A runbook — the first three diagnostic steps attached to the alert" },
            ],
            answer: "d",
            explanation:
              "An alert without a runbook is noise with a siren: the page says 'something's wrong' but not 'do this next'. The first three steps turn a page into a decision already half-made.",
          },
        ],
      },
      {
        slug: "triage-an-incident",
        title: "Triage a real-looking incident",
        blurb: "Alert → dashboard → cohort → trace → fix, one hypothesis per step.",
        topic: "incidents",
        skillIds: ["ai-incident-response"],
        capability: "Drill from alert to fix, testing one hypothesis at each step.",
        minutes: 9,
        concept: {
          what: "Triage is a **drill-down**, not a leap: alert (**what's burning**) → dashboard (**where**) → cohort (**what's shared**) → trace (**the mechanism**) → fix.",
          why: "Each step **narrows the blast radius and rules out causes**, so you act on evidence — one hypothesis per step — instead of blaming the model.",
          where: [
            "Finding every bad turn shares **tool = billing v2.2** in a support incident",
            "Confirming a **retriever-timeout** mechanism by opening one representative trace",
            "Closing incidents with a **regression test** so the same change can't rebreak production",
          ],
          whenNot:
            "An incident isn't closed when the metric recovers — it's closed when the regression test preventing recurrence is merged.",
        },
        prose: [
          "Triage is a **drill-down**, not a leap. Start at the alert: what's burning — latency, quality, cost, safety? Then the dashboard: where is it burning — which region, client, cohort? Each step narrows the **blast radius** and rules out causes.",
          "With the cohort identified, slice it for what's shared. If every bad turn carries the same tool version or the same prompt version, you've found your **one changed variable**. Open a representative trace to confirm the mechanism — a tool timing out, a retriever returning junk — and you have a **hypothesis** backed by evidence.",
          "Act, then confirm. Roll back or patch the single variable, and watch the signal recover. The last step, often skipped, is writing the **regression test** so this exact failure can't ship again. An incident isn't closed when it's fixed; it's closed when it **can't recur**.",
        ],
        diagram: {
          kind: "flow",
          steps: [
            { kind: "input", text: "Alert fires", caption: "What's burning?" },
            { kind: "process", text: "Dashboard: slice by cohort", caption: "Where is it burning?" },
            { kind: "process", text: "Cohort: find shared attribute", caption: "The one changed variable" },
            { kind: "process", text: "Trace: confirm mechanism", caption: "One representative request" },
            { kind: "output", text: "Fix + regression test", caption: "Closed when it can't recur" },
          ],
          loop: "If the signal doesn't recover, form the next hypothesis",
        },
        exercise: {
          id: "ex3",
          title: "Find the changed variable",
          prompt:
            "Given the before and after attribute sets for a release, return the name of the first key whose value changed. Right now it always blames the model — fix it.",
          starterCode: `def changed_var(before: dict, after: dict) -> str:
    """Return the name of the first key whose value differs between before and
    after. Return '' if nothing changed."""
    return "model"   # <-- wrong: always blames the model
`,
          testCode: `
cases = [
    ({"model": "gpt-4o", "prompt": "v16"}, {"model": "gpt-4o", "prompt": "v17"}, "prompt"),
    ({"model": "gpt-4o", "prompt": "v16"}, {"model": "gpt-4o-mini", "prompt": "v16"}, "model"),
    ({"model": "gpt-4o", "prompt": "v16"}, {"model": "gpt-4o", "prompt": "v16"}, ""),
]
ok = True
message = "ok"
for before, after, expected in cases:
    got = changed_var(before, after)
    if got != expected:
        ok = False
        message = f"changed_var({before}, {after}) -> {got!r}, expected {expected!r}"
        break
`,
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A burn-rate alert fires on your support assistant's quality SLO. The dashboard shows the drop concentrated in EU mobile users asking refund questions. What has this step established, and what comes next?",
            choices: [
              { id: "a", label: "The root cause — immediately roll back the model" },
              { id: "b", label: "The blast radius — next, slice that cohort for a shared attribute like prompt or tool version, then open a trace" },
              { id: "c", label: "Nothing — dashboards are for executives, not incidents" },
              { id: "d", label: "The fix — refunds should be handled by human agents" },
            ],
            answer: "b",
            explanation:
              "The dashboard narrows where the incident lives — that's blast radius, not root cause. The next narrowing step is the cohort's shared attribute, and a trace confirms the mechanism before you act.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "During a retro at a healthcare-bot company, the team notes that quality recovered 40 minutes after their rollback, so they closed the ticket. Two months later the same change shipped again and broke production identically. What was skipped?",
            choices: [
              { id: "a", label: "Paging the executive team during the first incident" },
              { id: "b", label: "Rolling back fast enough the first time" },
              { id: "c", label: "Writing the regression test that would have failed the second release in CI" },
              { id: "d", label: "Setting a latency SLO alongside the quality one" },
            ],
            answer: "c",
            explanation:
              "Recovery ends the outage; the regression test ends the incident class. Without it, nothing stops the same change from reintroducing the failure — the incident was never truly closed.",
          },
        ],
      },
      {
        slug: "operator-dashboard",
        title: "Build the operator dashboard",
        blurb: "The exec view answers 'are we healthy'; the on-call view answers 'what's broken'.",
        topic: "operate",
        skillIds: ["observability-dashboards"],
        capability: "Separate the executive dashboard from the on-call diagnostic dashboard.",
        minutes: 7,
        concept: {
          what: "Two dashboards, two questions: the **exec view** answers '**are we healthy?**' with a few big calm numbers; the **on-call view** answers '**what's broken, where?**' with drill-downs.",
          why: "One view can't serve both — **drill-downs overwhelm the exec glance**, and three big numbers are **useless at 3am**. Share the data, split the altitude.",
          where: [
            "A weekly exec view of **quality, cost, incidents** for leadership",
            "An on-call view linking a **red p95 tile** to the traces behind it",
            "**Quality-by-cohort** drill-downs during an incident",
          ],
          whenNot:
            "An exec view with drill-downs gets ignored; an on-call view of three numbers has nothing to debug — don't force one dashboard on both audiences.",
        },
        prose: [
          "An **executive dashboard** answers one question — 'are we healthy?' — with a few **big, calm numbers**: quality, cost, incidents. It should be legible in a glance and hide the detail, because an exec reading it wants a status, not a diagnosis.",
          "An **on-call dashboard** answers the opposite question — 'what's broken, where, since when?' It's **drill-down-rich**: latency by route, quality by cohort, error-budget burn, and a path from a red tile to the traces behind it. Density is the point; a calm on-call dashboard is one that has nothing to debug.",
          "The mistake is forcing one view to serve both. An exec-facing dashboard with drill-downs gets ignored; an on-call dashboard with three big numbers is useless at 3am. Build both, **share the underlying data**, and let each audience see the system at its **own altitude**.",
        ],
        diagram: {
          kind: "compare",
          left: { title: "Executive view", subtitle: "Are we healthy?" },
          right: { title: "On-call view", subtitle: "What's broken, where, since when?" },
          rows: [
            { label: "Shows", left: "Few big calm numbers", right: "Dense drill-down tiles" },
            { label: "Read by", left: "Leadership, weekly", right: "On-call, at 3am" },
            { label: "Path to traces", left: "None — status only", right: "Red tile → cohort → trace" },
          ],
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Your VP asks for 'one dashboard everyone can use' for the support assistant — leadership wants status, on-call engineers want latency by route and cohort drill-downs. You build the combined view. What happens, predictably?",
            choices: [
              { id: "a", label: "Everyone is satisfied because it holds all the information" },
              { id: "b", label: "Execs drown in detail and ignore it while on-call still can't debug fast — split it into two views over the same data" },
              { id: "c", label: "On-call starts using it successfully for executive reporting" },
              { id: "d", label: "Nothing — dashboards work identically for every audience" },
            ],
            answer: "b",
            explanation:
              "The two audiences read at different altitudes: detail wrecks the exec glance, and a compromise view is too thin for 3am debugging. Two views sharing the same underlying data serve each cleanly.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "At 3am an on-call engineer sees the quality tile go red and needs to find the affected cohort and a sample trace in under a minute. What must the dashboard provide for that to be possible?",
            choices: [
              { id: "a", label: "A larger font so the number is readable without glasses" },
              { id: "b", label: "Only 28-day averages, to keep the view calm" },
              { id: "c", label: "A drill-down path: red tile → quality by cohort → the traces behind those turns" },
              { id: "d", label: "An email form for contacting the VP" },
            ],
            answer: "c",
            explanation:
              "On-call debugs from the dashboard — the path from red tile to cohort to traces is the feature. Averages and presentation polish don't locate the failing cohort.",
          },
        ],
      },
      {
        slug: "capstone-rescue-assistant",
        title: "Capstone: rescue the support assistant",
        blurb: "Turn a vague hunch into a measured, diagnosable system.",
        topic: "operate",
        skillIds: ["ai-observability", "ai-incident-response"],
        capability: "Assemble signals, an SLO, and a runbook into a working diagnosis.",
        minutes: 10,
        concept: {
          what: "The capstone assembles the course: **instrument** (traces carrying prompt/model/retrieval/tool versions), **evaluate** (faithfulness, context precision, p95), and **govern** (one quality SLO, burn-rate alert, runbook).",
          why: "It converts a hunch — 'the assistant got slow and unhelpful after v17' — into a **diff that names the root cause** instead of a meeting-long argument.",
          where: [
            "Rescuing a support assistant where **release v17 changed the retriever ranker**",
            "Naming the causal chain **context precision → faithfulness** behind bad answers",
            "Standing up the **SLO + alert + runbook** so the next incident starts half-solved",
          ],
          whenNot:
            "The recipe collapses without instrumentation — you can't diff releases you never versioned; measurement is the prerequisite for rescue.",
        },
        prose: [
          "The capstone ties the course together. The support assistant is slow and unhelpful after a release, and no one can say why — a **hunch** with no evidence. The work of this lesson is to convert that hunch into a measured, diagnosable system that names a **root cause**.",
          "The recipe is everything you've learned: instrument the request into traces carrying prompt, model, retrieval, and tool versions; define **three signals** (faithfulness, p95 latency, context precision); set **one quality SLO** with an error budget; attach one **burn-rate alert** with a runbook. With those in place, the incident stops being a mystery and becomes a diff: release v17 changed the retriever ranker, context precision dropped, faithfulness followed.",
          "That's the whole skill: instrument for where, evaluate for what, and set an SLO with a runbook for when. A feature you can **measure** is a feature you can **rescue**; one you can't is a feature you can only argue about.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Your support assistant turned slow and unhelpful after release v17, and the incident channel is 30 people arguing about causes. You apply the capstone recipe. Which finding turns the argument into a diagnosis?",
            choices: [
              { id: "a", label: "The model vendor published a new model version the same week" },
              { id: "b", label: "Traces show v17 changed the retriever ranker; context precision dropped and dragged faithfulness down — the model is blameless" },
              { id: "c", label: "Users rated the assistant lower on the quarterly survey" },
              { id: "d", label: "Cost per query rose slightly" },
            ],
            answer: "b",
            explanation:
              "Versioned traces make the incident a diff: one changed variable, one collapsed metric chain. Surveys and cost shifts are signals, but they don't attribute the failure to a release.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A growth team launches a shopping-copilot MVP with no tracing, no eval, and one latency alert. It starts giving confidently wrong answers and leadership wants it fixed this week. What has to come first?",
            choices: [
              { id: "a", label: "Swap to a bigger model immediately" },
              { id: "b", label: "Add more front-end logging of button clicks" },
              { id: "c", label: "Wait for enough user complaints to form a pattern" },
              { id: "d", label: "Instrument requests with version attributes and stand up a faithfulness signal — you can't fix what you can't attribute" },
            ],
            answer: "d",
            explanation:
              "The capstone lesson: instrument for where, evaluate for what. Without versioned traces and a quality signal every fix is a guess — a model swap might even 'work' while masking the real retrieval problem.",
          },
        ],
      },
    ],
  },
  {
    slug: "ai-observability-reliability",
    title: "AI Observability: Reliability Engineering",
    subtitle: "Design a scalable, secure, governed observability system for AI in production.",
    description:
      "An expert course built around a multi-agent financial-research system rolled out across regions and providers. Design telemetry contracts, build evaluation systems, and prove privacy, security, and governance — detecting regressions without exposing sensitive prompts. For senior ML, platform, and SRE engineers.",
    level: "expert",
    domain: "AI Observability",
    access: "free",
    prerequisites:
      "LLM Observability — you should be comfortable reading traces, defining SLOs, and running evaluations before designing systems around them.",
    lessons: [
      {
        slug: "telemetry-architecture-contracts",
        title: "Telemetry architecture and contracts",
        blurb: "A pipeline is a chain of contracts each stage must honour.",
        topic: "telemetry-platform",
        skillIds: ["telemetry-pipeline"],
        capability: "Design a telemetry pipeline as a chain of contracts: propagation, fidelity, redaction, retention, semantics.",
        minutes: 11,
        concept: {
          what:
            "A telemetry system is a **chain of contracts** — app, SDK, collector, backend, query — where each stage owns one guarantee the next stage depends on.",
          why: "Break a contract and the failure **migrates downstream**: dropped context fragments traces, unredacted spans become a **breach surface**, unbounded cardinality collapses query latency.",
          where: [
            "A multi-region rollout where the collector is the **PII scrubbing and routing boundary** before spans hit storage",
            "A **versioned span schema** so dashboards and alerts degrade gracefully across attribute changes",
            "Cloud-native pipelines where the collector tail-samples and enforces the **cardinality budget**",
          ],
          whenNot:
            "Over-engineered for a single-service prototype with **one owner and no regulated data** — contracts pay off once multiple teams and regions depend on the same telemetry.",
        },
        prose: [
          "A telemetry system is not a bucket; it's a **chain of contracts**. The app emits spans with correct attributes; the SDK **propagates context** and honours the semantic conventions; the collector redacts, samples, and routes; the backend indexes within a **cardinality budget**; the query layer serves correct aggregations. Each stage owns one guarantee the next stage depends on.",
          "Break a contract and the failure **migrates**. If the SDK drops the correlation ID, traces fragment across services. If the collector doesn't redact, the backend becomes a **breach surface**. If the backend allows unbounded cardinality, query latency collapses under **index bloat**. The contract is the design unit — and the debugging unit when something breaks.",
          "Owning this chain means deciding what each stage guarantees and who owns it. **Version the schema**, document the attributes each stage must set, and treat the collector as the **security and cost boundary** — the last place you can cheaply transform telemetry before it becomes a liability in storage.",
        ],
        diagram: {
          kind: "flow",
          steps: [
            { kind: "input", text: "App emits spans" },
            { kind: "process", text: "SDK propagates context", caption: "correlation IDs + conventions" },
            { kind: "process", text: "Collector transforms", caption: "redact, tail-sample, route" },
            { kind: "process", text: "Backend indexes", caption: "within cardinality budget" },
            { kind: "output", text: "Queries aggregate" },
          ],
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Your fintech platform just discovered EU customer prompts landing in a US-region telemetry backend, and fixing it after the fact meant purging data out of every index. Where should the residency guarantee have lived?",
            choices: [
              { id: "a", label: "In the front-end, before spans ever leave the browser" },
              { id: "b", label: "In the collector's routing layer — the last cheap transformation point before storage turns telemetry into a liability" },
              { id: "c", label: "In the backend, via a nightly job that deletes non-compliant spans after indexing" },
              { id: "d", label: "In a quarterly policy document each team signs" },
            ],
            answer: "b",
            explanation:
              "Post-hoc deletion is the expensive way to learn the contract: the collector is the security and cost boundary, the last stage that can route by residency before storage makes the data a regulated liability.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A travel-booking assistant's traces suddenly fragment — one user turn now shows up as unrelated spans scattered across the retrieval, planner, and booking services after last week's SDK upgrade. Which contract broke?",
            choices: [
              { id: "a", label: "The SDK dropped context propagation, so correlation IDs no longer carry across service boundaries" },
              { id: "b", label: "The backend indexed too many attributes and silently dropped the rest" },
              { id: "c", label: "The collector tail-sampled away the middle of each trace" },
              { id: "d", label: "The query layer rounded timestamps to the minute" },
            ],
            answer: "a",
            explanation:
              "Trace fragmentation across services is the signature of failed propagation — the SDK's core contract. Each stage owns one guarantee, and diagnosing starts by asking which stage's guarantee broke.",
          },
        ],
      },
      {
        slug: "genai-semantic-conventions",
        title: "GenAI semantic conventions in practice",
        blurb: "OTel GenAI and OpenInference: layer them, don't fork.",
        topic: "telemetry-platform",
        skillIds: ["otel-genai", "telemetry-strategy"],
        capability: "Choose between and layer OTel GenAI and OpenInference without forking a private schema.",
        minutes: 11,
        concept: {
          what:
            "**OTel GenAI** (gen_ai.*) is the converging vendor-neutral standard; **OpenInference** is richer and more widely deployed — layer them, and **extend, don't fork**.",
          why: "Hard-locking one convention buys vendor lock-in or lost richness; forking a **private schema** strands you with tooling nothing else can read and maintenance nobody else shares.",
          where: [
            "Dual-emitting during a multi-provider migration: OTel GenAI for **portability**, OpenInference for **retrieval and agent attributes**",
            "Adding a proprietary reranker score under your own **prefix** while standard attributes stay intact",
            "Dropping the extension layer once the standard converges and covers the attribute",
          ],
          whenNot:
            "Skip dual-emitting when you're consciously **single-tool and single-vendor** and the standard already covers your attributes — the second convention is cost with no consumer.",
        },
        prose: [
          "Two conventions describe the same LLM span. **OpenTelemetry GenAI semantic conventions** (gen_ai.*) are the converging, vendor-neutral standard, moving toward stability under the Cloud Native Computing Foundation. **OpenInference**, from the Arize/Phoenix community, is richer and more widely deployed today, with first-class retrieval and agent attributes.",
          "They overlap heavily and differ in naming. The temptation is to pick one and hard-lock, or worse, invent a **private schema** for 'full control'. Both are mistakes: vendor lock-in today, or a schema no tooling can read. The sound move is to treat them as **complementary layers** — emit OTel GenAI for portability and OpenInference for tool richness — and to extend the standard rather than fork it.",
          "'**Extend, don't fork**' is the discipline. When the standard lacks an attribute you need (a proprietary retrieval score, say), add it under your own **prefix** while keeping the standard attributes intact. Your schema then degrades gracefully in any tool, and you can drop the extension when the standard catches up.",
        ],
        diagram: {
          kind: "compare",
          left: { title: "OTel GenAI", subtitle: "vendor-neutral, converging standard" },
          right: { title: "OpenInference", subtitle: "richer, more deployed today" },
          rows: [
            { label: "Best for", left: "Portability across tools", right: "Retrieval + agent coverage" },
            { label: "Maturity bet", left: "Tracks the CNCF convergence", right: "Battle-tested in practice" },
            { label: "Avoid", left: "Treating as final (still in flux)", right: "Hard-locking to one vendor's tools" },
          ],
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A platform team at an insurance company proposes replacing all gen_ai.* attributes with an in-house schema 'so every dashboard is perfectly tailored'. The CTO asks what this costs down the road. What's the honest answer?",
            choices: [
              { id: "a", label: "Nothing — private schemas render faster than standard ones" },
              { id: "b", label: "No standard tooling can read the spans, and the team inherits sole maintenance of a schema nobody else follows" },
              { id: "c", label: "A small licence fee payable to the CNCF" },
              { id: "d", label: "It forbids using OpenTelemetry anywhere else in the company" },
            ],
            answer: "b",
            explanation:
              "Forking strands you: the fork is the mistake, not the tailoring. Standard attributes keep every OTel/OpenInference tool readable while a private prefix carries the tailoring — that's extend, don't fork.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Your retail search team needs to record a proprietary 'reranker boost score' on retrieval spans, and the current OTel GenAI spec has no such attribute. A teammate proposes overwriting an existing gen_ai.* field to smuggle the score in. What's the right move?",
            choices: [
              { id: "a", label: "Wait for the CNCF to define the attribute and ship without the score" },
              { id: "b", label: "Add the score under your own prefix (e.g. acme.rerank.score) and keep the standard attributes intact" },
              { id: "c", label: "Overwrite the standard field — downstream consumers will adapt" },
              { id: "d", label: "Stop instrumenting retrieval spans until the spec updates" },
            ],
            answer: "b",
            explanation:
              "Overloading an existing attribute silently breaks every consumer of it. A private-prefix extension keeps the schema readable by standard tooling and drops out cleanly when the spec catches up.",
          },
        ],
      },
      {
        slug: "sampling-cardinality-cost",
        title: "Sampling, cardinality, and telemetry cost",
        blurb: "Sample for fidelity (tail); cap cardinality before it caps you.",
        topic: "telemetry-platform",
        skillIds: ["telemetry-pipeline"],
        capability: "Choose sampling for fidelity and cap cardinality to keep telemetry affordable.",
        minutes: 10,
        concept: {
          what:
            "**Tail sampling** keeps the traces that matter (errors, slow turns, policy violations) by deciding at the collector; **cardinality caps** stop near-unique attribute values from bloating indexes.",
          why: "Cost then scales with the **value you retain**, not the traffic you see — head sampling is cheap but blind, and per-request dimensions scale index size linearly with traffic.",
          where: [
            "Tail-sampling policy at a multi-region rollout's collector: keep every erroring or policy-violating trace, drop the boring ones",
            "A **dimension budget** on dashboards: low-cardinality slices (model, region, tool), raw values sampled or hashed",
            "**Exemplar debugging** in production — a handful of full interesting traces instead of 100% noise",
          ],
          whenNot:
            "Skip tail-sampling infrastructure where traffic is low enough that **100% retention is affordable** (dev, staging, small internal tools) — the collector logic costs more than it saves.",
        },
        prose: [
          "Sampling is a **debugging-fidelity decision** dressed up as a cost decision. **Head sampling** drops traces at the source and is cheap, but blind: it discards the rare erroring trace you'd most want to see. **Tail sampling** evaluates the full trace at the collector and keeps the ones that matter — errors, slow turns, policy violations — giving you exemplar debugging at a fraction of the storage.",
          "**Cardinality** is the silent budget killer. Every unique attribute value creates an index entry; a per-request timestamp or full session id is near-unique, so indexing it scales linearly with traffic. The result is **index bloat**, collapsing query latency, and a bill that surprises no one who has lived through it. Cap your dimensionality budget deliberately: low-cardinality dimensions for slicing, raw values sampled or hashed.",
          "The two combine into a strategy: tail-sample to keep the interesting traces, and constrain dimensions so the ones you keep stay queryable. Cost then scales with the **value you retain**, not the traffic you see — which is the only sane scaling law for telemetry.",
        ],
        diagram: {
          kind: "compare",
          left: { title: "Head sampling", subtitle: "decides at the source" },
          right: { title: "Tail sampling", subtitle: "decides at the collector" },
          rows: [
            { label: "Keeps errors?", left: "No — drops blindly", right: "Yes — sees the full trace" },
            { label: "Cost shape", left: "Cheapest per span", right: "Scales with value kept" },
            { label: "Use when", left: "Traces are interchangeable", right: "Rare failures matter" },
          ],
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "After a 10x Black Friday spike, your e-commerce assistant's telemetry bill tripled — and, worse, the one trace that would explain a checkout-tool failure was dropped. The pipeline samples 5% at the SDK. What's the structural fix?",
            choices: [
              { id: "a", label: "Raise head sampling to 100% and accept the bill as the price of spikes" },
              { id: "b", label: "Move the decision to the collector: tail-sample so errors and slow turns are always kept while boring traces drop" },
              { id: "c", label: "Disable tracing on the checkout tool so its spans stop costing money" },
              { id: "d", label: "Shard the telemetry bill across regional teams" },
            ],
            answer: "b",
            explanation:
              "Head sampling is blind — it dropped the exact trace you needed at the same rate as everything else. Tail sampling sees the full trace before deciding, so fidelity scales with value, not traffic.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A health-tech startup's dashboard queries degraded weeks after a junior engineer added span attributes for session uuid and a nanosecond request timestamp 'so every request is individually searchable'. Storage grew 40% with no traffic change. What happened?",
            choices: [
              { id: "a", label: "The backend index is corrupt — rebuild it from scratch" },
              { id: "b", label: "Near-unique values exploded cardinality; hash or sample the raw values and keep low-cardinality dimensions for slicing" },
              { id: "c", label: "Nanosecond timestamps are forbidden by OTel — remove them and queries recover automatically" },
              { id: "d", label: "Query latency always degrades over time; add more widgets to spread the load" },
            ],
            answer: "b",
            explanation:
              "The attributes aren't illegal, they're unbounded: every unique value creates an index entry, so index size scaled with traffic, not with analytical value. The fix is a dimensionality budget, not a rebuild.",
          },
        ],
      },
      {
        slug: "ai-threat-model-owasp",
        title: "AI threat model: the OWASP LLM Top 10",
        blurb: "Every risk maps to a telemetry signal you can detect.",
        topic: "security-privacy",
        skillIds: ["ai-security"],
        capability: "Map the OWASP LLM Top 10 to telemetry detection signals.",
        minutes: 11,
        concept: {
          what:
            "The **OWASP LLM Top 10** — injection, sensitive disclosure, supply chain, poisoning, improper output handling, excessive agency, prompt leakage, vector weaknesses, misinformation, unbounded consumption — where each risk maps to a **detectable telemetry signal**.",
          why: "It turns security from a parallel discipline into **reads on the spans, rates, and args you already collect** — no second telemetry stack to build and govern.",
          where: [
            "Prompt injection surfacing as **intent-versus-action divergence** or unexpected tool calls",
            "Excessive agency caught as a **tool call outside policy** on the tool span",
            "Unbounded consumption flagged by **token-rate and agent loop-depth limits**",
          ],
          whenNot:
            "Detection assumes the signal was instrumented — if tool args or token counts never made it onto the spans, **no query can detect the risk** after the fact.",
        },
        prose: [
          "The **OWASP Top 10 for LLM Applications** is the canonical threat list: prompt injection, sensitive information disclosure, supply chain, data and model poisoning, improper output handling, excessive agency, system prompt leakage, vector and embedding weaknesses, misinformation, and unbounded consumption. Each is a real failure mode with a documented attack pattern.",
          "The reframe for observability is that each risk maps to a **signal you can detect** on telemetry you already collect. Prompt injection shows up as **intent-versus-action divergence**. Sensitive disclosure shows up in output scanners. Excessive agency shows up as a tool call outside policy. Unbounded consumption shows up as runaway token loops. Detection is a query on existing spans, rates, and args — not a new instrument.",
          "This turns security from a separate discipline into a **read on the same pipeline**. You're not building a parallel security telemetry stack; you're adding the reads, thresholds, and alerts that surface the OWASP risks on the spans, tool calls, and outputs you already record.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Security review at a bank flags 'excessive agency' as a risk for the new research agent and asks the observability team how they'd even know it happened in production. What's the correct mapping?",
            choices: [
              { id: "a", label: "Stand up a dedicated security SIEM and mirror every span into it" },
              { id: "b", label: "Alert on tool spans whose arguments fall outside the task's allowed policy — a query on telemetry already recorded" },
              { id: "c", label: "Wait for a customer to report an unauthorized action on their account" },
              { id: "d", label: "Ask the model vendor to guarantee the agent never overreaches" },
            ],
            answer: "b",
            explanation:
              "Excessive agency means the model took an action it wasn't granted — visible as an out-of-policy tool span. The OWASP reframe is reads on existing telemetry, not a parallel security stack.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A telco support agent started burning its weekly token budget in hours after a prompt-template change: the loop shows it calling the same knowledge-base tool repeatedly with growing context. Which OWASP category and detection signal match?",
            choices: [
              { id: "a", label: "Sensitive information disclosure — caught by output PII scanners" },
              { id: "b", label: "Data and model poisoning — caught by retraining-data audits" },
              { id: "c", label: "Unbounded consumption — caught by token-rate and agent loop-depth limits" },
              { id: "d", label: "Misinformation — caught by factuality evals" },
            ],
            answer: "c",
            explanation:
              "Runaway loops consuming tokens and time is exactly unbounded consumption. The detectable fingerprint is on the agent span: loop depth climbing and token rate blowing past limits.",
          },
        ],
      },
      {
        slug: "detecting-attacks-in-telemetry",
        title: "Detecting attacks in telemetry",
        blurb: "Injection, extraction, exfiltration, unsafe tools — read from ordinary spans.",
        topic: "security-privacy",
        skillIds: ["ai-security", "ai-red-teaming"],
        capability: "Detect injection, extraction, exfiltration, and unsafe tool use from ordinary telemetry.",
        minutes: 11,
        concept: {
          what:
            "Attacks leave **fingerprints on ordinary telemetry**: injection as intent-action divergence, exfiltration in output scanners, extraction and membership inference as **per-identity rate and similarity anomalies**, unsafe tool use as out-of-policy args.",
          why: "Each attack class is a **new read on existing spans**, not a new data source — and validating tool args against an allowlist turns one whole class into a **hard reject** with an audit record.",
          where: [
            "Output-side DLP and secret scanners on the **completion span** catching exfiltrated secrets or PII",
            "Per-identity query-rate and **embedding-similarity alerts** catching model-extraction probe storms",
            "Tool-arg validation against a policy **allowlist** on the span, with rejects recorded for the audit trail",
          ],
          whenNot:
            "Per-request rules can't catch **statistical attacks** — membership inference and extraction are cluster patterns across many probes, so single-call detection alone will never fire.",
        },
        prose: [
          "Attacks leave fingerprints on ordinary telemetry. **Prompt injection** rewrites the model's plan, so it shows up as intent-versus-action divergence or unexpected tool calls. **Data exfiltration** shows up in output scanners flagging secrets or PII the model returned. Neither needs a new data source — they need new reads on the spans you already record.",
          "**Model extraction** and **membership inference** are rate-and-pattern problems rather than single-call problems. Extraction looks like a high volume of near-identical queries probing the model's decision surface from one identity. Membership inference looks like a cluster of correlated, calibrated probes trying to determine whether a specific record was in training. Both are detectable as **per-identity query-rate and embedding-similarity anomalies**.",
          "**Unsafe tool use** is the most directly preventable. A tool called with arguments outside policy — a delete instead of a read, a cross-tenant lookup — is visible on the tool span. Validating tool args against an **allowlist** at the span turns a class of agent-security failures into a hard reject, with the attempt itself recorded for the **audit trail**.",
        ],
        diagram: {
          kind: "decision",
          root: {
            kind: "decision",
            question: "What does the telemetry pattern suggest?",
            branches: [
              { label: "Intent vs action diverge", node: { kind: "leaf", answer: "Prompt injection", caption: "unexpected tool calls confirm" } },
              { label: "Secrets in output", node: { kind: "leaf", answer: "Exfiltration", caption: "output-side DLP scanners" } },
              { label: "Near-identical probe storm", node: { kind: "leaf", answer: "Model extraction", caption: "per-identity rate anomaly" } },
              { label: "Tool args outside policy", node: { kind: "leaf", answer: "Unsafe tool use", caption: "allowlist hard-rejects" } },
            ],
          },
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "An intern proposes a per-request firewall rule to block membership-inference attacks against your fine-tuned medical model, reasoning that 'each attack is one HTTP call'. Their mentor corrects them. On what grounds?",
            choices: [
              { id: "a", label: "Membership inference is a statistical pattern across many correlated probes — the fingerprint is the cluster, not any single call" },
              { id: "b", label: "Membership inference only happens inside the training cluster, never at the API edge" },
              { id: "c", label: "HTTP calls can't be inspected for legal reasons in healthcare" },
              { id: "d", label: "The rule would work; the mentor is shielding the intern from extra work" },
            ],
            answer: "a",
            explanation:
              "Inferring whether a record was in training takes many calibrated probes — a rate-and-pattern problem. Per-identity rate and embedding-similarity alerts catch the cluster; a single-call rule never will.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "An audit of your agent platform finds that last month a research agent, injected via a poisoned web page, called the file-delete tool with a path outside its task scope — and it succeeded silently. Which control would have made this a non-event?",
            choices: [
              { id: "a", label: "A faster model with better instruction-following" },
              { id: "b", label: "Validating tool args against a policy allowlist on the tool span — a hard reject plus an audit record of the attempt" },
              { id: "c", label: "Storing full raw prompts so investigators could read the injection afterward" },
              { id: "d", label: "Rate-limiting every user to five questions per day" },
            ],
            answer: "b",
            explanation:
              "Unsafe tool use is the most preventable class: tool args are structured and policy-checkable, so an allowlist at the span converts a silent breach into a rejected call with evidence. Forensics-after-the-fact isn't prevention.",
          },
        ],
      },
      {
        slug: "guardrails-and-safety-signals",
        title: "Guardrails and safety signals",
        blurb: "Guardrails raise the bar; measure their attack-success rate.",
        topic: "security-privacy",
        skillIds: ["ai-guardrails"],
        capability: "Apply guardrails and measure their attack-success rate honestly.",
        minutes: 10,
        concept: {
          what:
            "**Guardrails** are input and output checks in the runtime path (NeMo Guardrails, Lakera Guard, Guardrails AI) that block known jailbreaks and policy violations — and they are **evadable, not walls**.",
          why: "Published research shows high **attack-success rates (ASR)** against adaptive adversaries, so the mature posture is measuring and driving ASR down like a quality SLO rather than trusting a block rate.",
          where: [
            "Input checks before the model and **output checks** before the user, both in the request path",
            "Continuous **red-team evals** feeding an ASR metric with alerting on regressions",
            "Each new evasion treated as a **regression to fix** — exactly like a quality SLO breach",
          ],
          whenNot:
            "A guardrail is the wrong control for a **deterministic guarantee**: content that must never leak needs architectural controls (never storing it), because a 94% block rate still lets the adaptive 6% through.",
        },
        prose: [
          "Guardrails are input and output checks in the **runtime path** — frameworks like NeMo Guardrails, Lakera Guard, and Guardrails AI. They catch known jailbreak patterns, harmful outputs, and policy violations before the request reaches the model or the response reaches the user. They raise the bar substantially over having no check at all.",
          "The dangerous assumption is that a guardrail is a wall. Published research shows they're **evadable**: against adaptive adversaries, attack-success rates can be high. A guardrail that blocks 94% of known patterns still lets 6% through, and **novel attacks aren't in the known set**. Treating the guardrail as a guarantee is how you get breached.",
          "The mature posture is to measure the **attack-success rate (ASR)** as a production metric and drive it down. Run continuous **red-team evals** against your guardrail, track ASR over time, and treat each new evasion as a regression to fix — exactly like a quality SLO. The guardrail is a control you invest in, not a checkbox you tick.",
        ],
        diagram: {
          kind: "flow",
          steps: [
            { kind: "input", text: "User input arrives" },
            { kind: "process", text: "Input guardrail checks", caption: "known jailbreak patterns" },
            { kind: "process", text: "Model generates" },
            { kind: "process", text: "Output scan", caption: "harm + policy + DLP" },
            { kind: "output", text: "Response ships" },
          ],
          loop: "Red-team evals continuously re-measure ASR on this same path",
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A vendor pitch says their guardrail 'blocks 94% of jailbreaks', and your CPO wants to approve the customer-facing launch on that number alone. What's the strongest objection from this lesson's framing?",
            choices: [
              { id: "a", label: "94% is below the industry-standard 99% threshold" },
              { id: "b", label: "The catch rate was measured against known patterns — adaptive and novel attacks aren't in that set, so the residual risk must be measured, not assumed away" },
              { id: "c", label: "Guardrails are illegal in customer-facing products" },
              { id: "d", label: "The number proves the guardrail is a wall, so no further checks are needed" },
            ],
            answer: "b",
            explanation:
              "Guardrails are evadable, not walls. The 94% is conditioned on the known attack set; the correct posture is a measured, continuously red-teamed ASR — not a one-time block rate taken as a guarantee.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Your security team runs a monthly red-team eval against the banking assistant's guardrail. This month ASR jumped from 3% to 11% with no product change — a new evasion family is circulating. Following the SLO-style posture, what happens next?",
            choices: [
              { id: "a", label: "Nothing — ASR is expected to fluctuate randomly between evals" },
              { id: "b", label: "Treat it as a guardrail regression: alert, investigate the evasion, fix it, and verify ASR falls in the next eval cycle" },
              { id: "c", label: "Remove the guardrail since adaptive attackers always get through" },
              { id: "d", label: "Keep the result internal so competitors don't learn the evasion exists" },
            ],
            answer: "b",
            explanation:
              "ASR is a production metric like a quality SLO: a jump is a regression to root-cause and fix, not noise to ignore or a reason to abandon the control. Each new evasion is a defect in the guardrail, and the eval loop exists to catch exactly this.",
          },
        ],
      },
      {
        slug: "privacy-engineering-for-telemetry",
        title: "Privacy engineering for telemetry",
        blurb: "Observe a system that handles sensitive prompts without storing them.",
        topic: "security-privacy",
        skillIds: ["telemetry-privacy", "ai-audit-trail"],
        capability: "Observe an AI system handling sensitive prompts without becoming a breach surface.",
        minutes: 12,
        concept: {
          what:
            "Observe without storing the payload: **redact PII at the collector** and keep the dimensions (model, prompt version, token counts, latency); where prompts must be kept, **residency, tenant isolation, role-tiered access, and an immutable audit trail** govern them.",
          why: "The debugging value lives in the **dimensions, not the raw text** — so the telemetry store never becomes the **breach surface** the system was supposed to avoid.",
          where: [
            "EU financial and health prompts routed to **EU-region backends**, with residency enforced in the collector (GDPR, HIPAA, MiFID II)",
            "**Tenant-partitioned storage** so one customer's prompts can never surface in another tenant's queries",
            "Role tiers — support sees metadata, security sees content under approval — with every read in an **append-only audit trail**",
          ],
          whenNot:
            "When the raw prompt carries **no residual debugging value** beyond its dimensions, storing it is pure liability — redaction-at-collector should have removed it.",
        },
        prose: [
          "The central question of privacy engineering for AI telemetry: can you observe the system **without storing the prompt at all**? Often, yes. The debugging value lives in the dimensions — model, prompt version, retrieval version, token counts, latency — not in the raw text. Detecting and **redacting PII at the collector**, then keeping only those dimensions, preserves debuggability without persisting the sensitive payload.",
          "Where prompts must be kept, **residency and isolation** govern them. Regional data residency routes EU financial or health prompts to EU-region backends and enforces it in the collector — GDPR, HIPAA, and MiFID II all push toward this. **Tenant isolation** partitions telemetry by customer at storage, so one tenant's prompts can never surface in another tenant's queries. These are architectural commitments, not settings.",
          "**Access control and the audit trail** close the loop. Raw prompts, if kept, sit behind role tiers: support sees metadata, security sees content under approval, most roles see neither. Every read of sensitive telemetry lands in an **immutable, append-only audit trail** — the evidence layer that accountability and regulators require, and the record that reconstructs who saw what, when.",
        ],
        diagram: {
          kind: "flow",
          steps: [
            { kind: "input", text: "Sensitive prompt arrives" },
            { kind: "process", text: "Collector detects PII", caption: "scrub or drop payload" },
            { kind: "process", text: "Keep dimensions only", caption: "model, versions, tokens, latency" },
            { kind: "process", text: "Route by residency", caption: "EU prompts to EU backends" },
            { kind: "output", text: "Partitioned, audited store", caption: "tenant isolation + access tiers" },
          ],
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A debugging ticket insists the raw prompts of a healthcare triage assistant must be stored because 'you can't debug what you can't see'. The latency regression under investigation correlates perfectly with retrieval version and token counts. What's the privacy-engineering answer?",
            choices: [
              { id: "a", label: "Store everything — debugging always outranks privacy in healthcare" },
              { id: "b", label: "Redact at the collector and keep dimensions: retrieval version, token counts, latency hold the debug value, not the raw text" },
              { id: "c", label: "Store the prompts but encrypt them with a key kept in the same database" },
              { id: "d", label: "Ask each patient for consent to retain their triage transcript indefinitely" },
            ],
            answer: "b",
            explanation:
              "The misconception is that debuggability requires the payload. It usually doesn't — the dimensions carry the causal signal, and dropping the raw text removes the breach surface entirely rather than trying to guard it.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "During a SOC 2 audit of your multi-tenant SaaS platform, the auditor asks how you prove no tenant's prompts can appear in another tenant's query results, and who accessed prompt content last quarter. Which two controls answer them?",
            choices: [
              { id: "a", label: "Faster queries and a longer retention window" },
              { id: "b", label: "Tenant isolation at storage, plus the immutable append-only audit trail recording every sensitive read" },
              { id: "c", label: "A written policy asking engineers to be careful with cross-tenant data" },
              { id: "d", label: "Model vendor attestations that no data leaves their region" },
            ],
            answer: "b",
            explanation:
              "Isolation is architectural — partitioning by tenant at storage, not a policy — and the audit trail is the evidence layer that reconstructs who saw what, when. Those two are exactly what an auditor samples.",
          },
        ],
      },
      {
        slug: "governance-frameworks",
        title: "Governance frameworks",
        blurb: "EU AI Act, NIST AI RMF, ISO 42001, SR 11-7 — all reduce to trace + measure + control.",
        topic: "governance",
        skillIds: ["ai-compliance", "eu-ai-act", "nist-ai-rmf"],
        capability: "Map observability signals to the EU AI Act, NIST AI RMF, ISO 42001, and SR 11-7.",
        minutes: 12,
        concept: {
          what:
            "**EU AI Act, NIST AI RMF, ISO 42001, and SR 11-7** read differently but demand the same three proofs: **trace** decisions, **measure** behaviour, **control** changes.",
          why: "Observability is the **evidence layer** for all three — traces and audit trail are traceability, evals/drift/SLOs are measurement, gates and rollback are control — so one governed pipeline satisfies four frameworks.",
          where: [
            "EU AI Act high-risk duties — traceability, human oversight, auditability — mapped to traces, quality SLOs, and the audit trail",
            "NIST AI RMF: evals and drift signals as **Measure**; alerts and rollback as **Manage**; ownership as **Govern**",
            "ISO 42001 certification and SR 11-7 model-risk validation riding the same **review cadence and change control**",
          ],
          whenNot:
            "Governance fails as a **checklist appended at the end** — without signal ownership, review cadence, and rollback triggers, the evidence doesn't exist when the auditor or the incident arrives.",
        },
        prose: [
          "Four frameworks dominate enterprise AI governance. The **EU AI Act** risk-classifies systems and imposes duties on high-risk ones — traceability, human oversight, auditability — and obligations on general-purpose model providers. **NIST's AI Risk Management Framework** structures the work as Govern, Map, Measure, and Manage across the lifecycle. **ISO/IEC 42001** is the AI management-system standard an organisation can be certified against. **SR 11-7** imports model risk management from banking: validation, monitoring, and change control.",
          "They read differently but ask the same three things: can you **trace** a decision, can you **measure** the system's behaviour, and can you **control** changes to it. Observability is the **evidence layer** for all three. Traces and the audit trail are traceability. Evals, drift, and SLOs are measurement. Eval gates, versioned releases, and rollback are control. The frameworks don't demand new instrumentation; they demand that the instrumentation you have is governed, owned, and reviewable.",
          "The mistake is treating governance as a **compliance checklist** appended at the end. It's a system-lifecycle posture: who owns each signal, what the review cadence is, what triggers a rollback, and where the evidence lives. Build that posture once, and the four frameworks become different lenses on the same **operating system** rather than four separate audits.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Your legal team must answer an EU AI Act high-risk-classification inquiry for the credit-decisioning assistant: demonstrate traceability, human oversight, and auditability. Which existing observability assets respond before anything new is built?",
            choices: [
              { id: "a", label: "None — the AI Act requires purpose-built regulatory reporting software" },
              { id: "b", label: "Traces reconstruct each decision, quality SLOs feed human oversight, and the audit trail proves who accessed what and when" },
              { id: "c", label: "The model vendor's marketing security whitepaper" },
              { id: "d", label: "A one-time penetration test performed at launch" },
            ],
            answer: "b",
            explanation:
              "The high-risk duties map onto evidence you already produce. The misconception is that compliance demands new instrumentation — it demands the instrumentation you have be governed, owned, and reviewable.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A newly hired risk officer at your insurer wants quarterly NIST AI RMF 'Measure' reports plus separate hand-built ISO 42001 and SR 11-7 evidence packs. You'd rather build once. What do you show them?",
            choices: [
              { id: "a", label: "That NIST, ISO, and SR 11-7 are mutually incompatible, so three reporting teams are unavoidable" },
              { id: "b", label: "That governed traces, evals, SLOs, and change control are shared evidence — each framework is a lens on the same operating system, so reports are views over one pipeline" },
              { id: "c", label: "That only the EU AI Act matters and the other frameworks can be ignored" },
              { id: "d", label: "That evidence is best generated the week before each audit" },
            ],
            answer: "b",
            explanation:
              "All four frameworks reduce to trace, measure, control. Reporting becomes views over one governed pipeline — the alternative is duplicate hand-built packs that drift apart and expire the moment an incident needs them.",
          },
        ],
      },
      {
        slug: "evaluation-systems-not-one-score",
        title: "Evaluation systems, not one score",
        blurb: "Representative, repeatable, agreed, calibrated, intervalled, drift-watched.",
        topic: "evaluation-and-drift",
        skillIds: ["llm-judge", "eval-bias"],
        capability: "Build a trustworthy evaluation system rather than trust a single tidy score.",
        minutes: 11,
        concept: {
          what:
            "Trustworthy evaluation is a **system of six parts** — representative suite, repeatable rubric, **inter-rater agreement (Cohen's κ)**, calibrated judge, confidence intervals, distribution-shift watch — not a single tidy score.",
          why: "Each part plugs a specific failure: stale suites pass everything, low κ makes scores **coin flips**, missing intervals chase noise, and a **stable mean can hide a bimodal regression**.",
          where: [
            "A release claimed to 'improve' by a point — checked against whether the **interval excludes the old value**",
            "Distributions shown next to means so a **bimodal shift** (more 1s and 5s) surfaces before users feel it",
            "κ and judge-vs-human agreement tracked over time so a degrading judge is caught",
          ],
          whenNot:
            "A one-number score is only enough for **coarse triage** — obviously broken vs obviously fine — never for release decisions, where noise and hidden distribution shifts decide ship/no-ship.",
        },
        prose: [
          "A single tidy score is comforting and almost meaningless. Trustworthy evaluation is a system with six parts: a **representative task suite** that mirrors real usage, a **repeatable rubric** that gives the same answer twice, inter-rater agreement (**Cohen's κ**) that proves two raters concur, a **calibrated judge** measured against humans, **confidence intervals** that separate signal from noise, and distribution-shift watch that catches the mean holding while the shape changes.",
          "Each part plugs a specific failure. A stale suite passes everything. A vague rubric adds noise that swamps real change. Low κ means the score is a **coin flip**. An uncalibrated judge inherits biases. Missing intervals make you chase noise. And a stable mean can hide a distribution growing **bimodal** — more 1s and 5s, fewer 3s — which is a real regression the average conceals.",
          "The discipline is to **ship the system, not the score**. Report intervals alongside means, show distributions not just averages, and track κ and judge-agreement over time. When a release 'improves' the score by a point, the first question is whether the **interval even excludes** the previous value — and if the distribution shifted, which direction helped and which hurt.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Your RAG assistant's weekly eval shows mean answer quality steady at 3.9 for a month — yet support complaints doubled and CSAT dropped. You pull the score distributions and find 1s and 5s growing while 3s shrink. What does the eval system say happened?",
            choices: [
              { id: "a", label: "Nothing — the mean is the metric, and it's stable by definition" },
              { id: "b", label: "A real regression hidden by the average: the distribution is going bimodal, so the system is getting less consistent" },
              { id: "c", label: "The judge became more generous, inflating the high scores" },
              { id: "d", label: "Complaints are unrelated because the suite is representative by construction" },
            ],
            answer: "b",
            explanation:
              "Distribution-shift watch exists for exactly this case: more extreme scores at both ends while the mean holds means real degradation the average conceals. Trusting the mean alone is the failure the six-part system prevents.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A prompt-engineering intern reports a triumphant +1.2 point eval win for their new system prompt and asks for an immediate full rollout. Before acting, you apply the system-of-evaluation view. Which check most directly tests whether the win is real?",
            choices: [
              { id: "a", label: "Whether the confidence interval around the new score excludes the old one — a 1.2-point move inside the interval is sampling noise" },
              { id: "b", label: "Whether the new prompt is longer than the old one" },
              { id: "c", label: "Whether the dashboard renders the new score in green" },
              { id: "d", label: "Whether the intern also ran the eval on a weekend" },
            ],
            answer: "a",
            explanation:
              "Missing intervals make you chase noise: without knowing the uncertainty, a point-swing this size is indistinguishable from sampling variance. The suite, rubric, and judge matter, but the interval is the immediate real-vs-noise test before any rollout.",
          },
        ],
      },
      {
        slug: "detecting-drift-regressions",
        title: "Detecting drift and regressions",
        blurb: "Distributions move before averages do.",
        topic: "evaluation-and-drift",
        skillIds: ["model-drift", "llm-drift"],
        capability: "Catch input, output, and retrieval drift in distributions before averages move.",
        minutes: 11,
        concept: {
          what:
            "Drift in generative systems is **distributional** — input (PSI), output, and retrieval distributions move before averages do — so the right primitive is a **change-point on the distribution**, not a threshold on the mean.",
          why: "The mean is the **last signal to move**; distribution metrics are the leading indicator that lets you act before users have felt the drift for days.",
          where: [
            "**PSI on input embeddings** flagging a prompt-mix shift before quality averages drop",
            "**Cohort-aware baselines** per region so segment-specific drift isn't diluted by the aggregate",
            "Sequential change-point monitoring watching output shape over time against a baseline",
          ],
          whenNot:
            "Don't run per-cohort distribution monitors where **traffic is too sparse to estimate a distribution** — a handful of requests a day makes PSI noise, not signal.",
        },
        prose: [
          "Drift in generative systems is **distributional**, and distributions move before averages do. **Input drift** — measured by metrics like the population stability index (PSI) — tells you the prompts your system sees have changed, even if average quality hasn't. **Output drift** tells you the shape of the answers is changing. **Retrieval drift** tells you the context being surfaced is moving. All three can cross a threshold while the mean score looks perfectly healthy.",
          "This is why a **change-point**, not a threshold on the mean, is the right detection primitive. Sequential monitoring watches the distribution over time and flags the moment it shifts relative to a **cohort-aware baseline**. A global baseline hides region or cohort-specific drift; baselines per cohort catch a degradation that's real in one segment and invisible in the aggregate.",
          "The practical implication: watch distributions, not just means, and set baselines per cohort. The mean is the **last signal to move**; by the time it drops, users have already felt the drift for days. Distribution metrics give you the **leading indicator** that lets you act before the mean confirms the problem.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "After a marketing campaign, your finance copilot's mean quality score is unchanged, but PSI on the input distribution jumped from 0.08 to 0.35: retail-trading novices are arriving where professionals used to. Ops asks why anyone should care while the mean is stable. What do you say?",
            choices: [
              { id: "a", label: "They shouldn't — the mean is the contract with the business" },
              { id: "b", label: "PSI is the leading indicator: inputs have shifted, and quality averages drop only after users have already felt the propagated damage" },
              { id: "c", label: "PSI jumps during campaigns are a known dashboard artifact and self-correct" },
              { id: "d", label: "Pause the campaign until the mean moves" },
            ],
            answer: "b",
            explanation:
              "The misconception is that a stable mean means stability. The mean is the last signal to move; PSI catching the input shift first is the whole point of distributional drift detection.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A region-split rollout of your support agent shows the global quality mean flat for two weeks, yet the German segment's satisfaction is sliding while the US improves. Your single global drift baseline never fired. What was misconfigured?",
            choices: [
              { id: "a", label: "Nothing — a flat global mean proves every segment is fine" },
              { id: "b", label: "Tail sampling — the German traces were dropped before reaching the monitor" },
              { id: "c", label: "The baseline was global, so real segment drift diluted into the aggregate; cohort-aware baselines per region would have caught it" },
              { id: "d", label: "The judge needs retraining on German inputs" },
            ],
            answer: "c",
            explanation:
              "Aggregation dilutes local drift: one region degrading while another improves nets out to a flat mean. Cohort-aware baselines catch the segment-specific regression that a global metric averages away.",
          },
        ],
      },
      {
        slug: "causal-diagnosis-experimentation",
        title: "Causal diagnosis and experimentation",
        blurb: "Correlation gives suspects; experiments give causes.",
        topic: "diagnosis-and-agents",
        skillIds: ["eval-gates"],
        capability: "Establish cause with feature flags, canaries, shadow traffic, and holdouts.",
        minutes: 11,
        concept: {
          what:
            "**Correlation gives suspects; experiments give causes.** Feature flags, canaries, shadow traffic, and holdouts isolate the variable so a **flag-on vs flag-off comparison** attributes the regression.",
          why: "Rolling back the most visible change often fixes nothing when a **second change shipped the same day** — controlled comparison acts on evidence, not the coincidence of a calendar.",
          where: [
            "**Feature-flagged releases** with an instant off-switch and comparable on/off cohorts",
            "**Canary slices** bounding a regression's blast radius; **shadow traffic** surfacing failures before users see them",
            "A **holdout** permanently on the old version as a standing clean baseline for the metric that matters",
          ],
          whenNot:
            "Experimentation is overkill when the causal chain is **directly visible in one trace** — if a single failing request shows the bug, flag infrastructure and cohort math cost more than the answer.",
        },
        prose: [
          "**Correlation gives suspects; experiments give causes.** When a regression coincides with a release, the tempting move — roll back the most visible change — often fixes nothing, because the real cause was a second change shipped the same day. The disciplined alternative is to **isolate the variable** with a controlled experiment.",
          "The toolkit is **feature flags, canaries, shadow traffic, and holdouts**. Feature-flag the candidate so you can turn it off instantly and so on/off cohorts are comparable. **Canary** to a small slice of traffic so a regression's blast radius is bounded. **Shadow traffic** runs the new path without serving it, surfacing failures before users see them. A **holdout** keeps a cohort permanently on the old version so you always have a clean comparison for the metric that matters.",
          "The discipline is to compare **flag-on versus flag-off** on the same metric, with the same judge and the same interval, before you act. If the candidate loses on the controlled comparison, you've found the cause — roll it back. If it wins, ship it. Either way you acted on evidence, not on the coincidence of a calendar.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Quality dropped 8% the same day your team shipped a new retrieval index AND another team silently swapped the embedding model. The incident channel wants to roll back 'the obvious one' — the index. Why is that premature?",
            choices: [
              { id: "a", label: "Indexes can never affect answer quality" },
              { id: "b", label: "Two changes shipped together; without a controlled flag-on/flag-off comparison you can't attribute the regression — rolling back the visible change may fix nothing" },
              { id: "c", label: "The embedding model belongs to another team, so it can't be the cause" },
              { id: "d", label: "Quality drops are always seasonal around releases" },
            ],
            answer: "b",
            explanation:
              "Coincidence of timing is correlation, not cause. With two suspects, only isolating the variable — flagging one change and comparing cohorts on the same metric and judge — tells you which change actually drove the 8%.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Your checkout-copilot team is about to enable a new planner prompt for 100% of traffic straight to production. Describe the release-safety pattern that bounds the blast radius and preserves a clean long-term comparison.",
            choices: [
              { id: "a", label: "Ship 100% and watch the dashboards for a week" },
              { id: "b", label: "Canary a small traffic slice behind a feature flag, shadow-run the new path if needed, and keep a permanent holdout on the old version as the standing baseline" },
              { id: "c", label: "Deploy to production but ask users to report anything odd" },
              { id: "d", label: "Run the new prompt only on internal demo accounts each quarter" },
            ],
            answer: "b",
            explanation:
              "The flag gives the instant off-switch and comparable cohorts, the canary bounds exposure, shadow traffic surfaces failures before users see them, and the holdout keeps a clean baseline so the metric impact stays measurable — each tool does one job.",
          },
        ],
      },
      {
        slug: "agent-tool-observability",
        title: "Agent and tool-use observability",
        blurb: "Observe the graph — tools, loops, budgets, MCP — not just the LLM node.",
        topic: "diagnosis-and-agents",
        skillIds: ["agent-tracing", "mcp-observability"],
        capability: "Observe the agent graph: tool calls, loops, budgets, state transitions, and MCP spans.",
        minutes: 11,
        concept: {
          what:
            "An agent is a **graph of calls, tools, and state** — reliability lives in the edges (tool success, retry depth, budget exhaustion, MCP spans, call-graph shape), not the LLM node.",
          why: "Node-only LLM monitoring misses **climbing retry depth** (stuck agent), **budget exhaustion mid-task** (truncated outputs that look like model failures), and **novel cycles** (bugs before outages).",
          where: [
            "Per-tool success rates across an agent fleet, with **MCP spans attributed to the agent goal** that spawned them",
            "**Loop/retry-depth and token-budget alerts** on the task span parenting its children",
            "**Call-graph shape monitoring** flagging a new cycle as a leading bug signal",
          ],
          whenNot:
            "Node-level LLM metrics suffice when there **is no graph** — a single-shot completion with no tools, loops, or budget has no edges to observe.",
        },
        prose: [
          "An agent is not one LLM call; it's a **graph of calls, tools, and state**. Plain LLM observability watches the node — the model's latency and tokens — and misses the edges: which tool was called, whether it succeeded, how many times the agent retried, whether it hit a budget, and how the call-graph shape changed. Agent reliability lives in the graph, not the node.",
          "The agent-specific signals are tool-call success per tool, **loop and retry depth**, **budget exhaustion**, state transitions, **MCP spans** across servers, and trace-graph anomalies. Climbing retry depth is the leading indicator of a stuck agent. Budget exhaustion mid-task produces truncated, low-quality outputs that look like model failures. A **novel cycle** in the call graph is often a bug before it's an outage.",
          "Each tool call — including Model Context Protocol calls across servers — needs its **own span**, attributed to the agent goal that spawned it. Without that **attribution** you can't say which agent, using which tool, on which server, burned the budget or looped. The unit of diagnosis is the **task span parenting its children**, not the individual completion.",
        ],
        diagram: {
          kind: "flow",
          steps: [
            { kind: "input", text: "Task span opens", caption: "attributed to agent goal" },
            { kind: "process", text: "LLM call decides" },
            { kind: "process", text: "Tool / MCP span", caption: "args, success, server" },
            { kind: "process", text: "Loop + budget check", caption: "retry depth, token cap" },
            { kind: "output", text: "Task completes, traced" },
          ],
          loop: "Each retry adds a child span — depth is the stuck-agent signal",
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Your multi-agent research fleet's budget alerts keep firing, but the per-model dashboards (latency, tokens per completion) all look healthy, so leadership suspects a billing bug. What does node-only monitoring miss here?",
            choices: [
              { id: "a", label: "Nothing — model dashboards are sufficient for agent workloads" },
              { id: "b", label: "The graph: which agent + tool + server looped or burned the budget — retry depth and budget exhaustion live on task and tool spans, not the LLM node" },
              { id: "c", label: "The invoices are probably correct and the dashboards lag by a month" },
              { id: "d", label: "Budget alerts should be disabled for agent workloads" },
            ],
            answer: "b",
            explanation:
              "Agent reliability lives in the graph, not the node: a task looping between healthy-looking completions burns budget invisibly. Per-model metrics can't attribute the burn to an agent, tool, or server — task-parented spans can.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A routine release of your travel-booking agent introduced a new call-graph pattern — the agent now visits the same tool pair three times where it used to visit once — and today two tasks looped until timeout. What's the right reading of that novel cycle?",
            choices: [
              { id: "a", label: "It's an optimization — repetition improves answer accuracy" },
              { id: "b", label: "A bug signal: a new cycle in the call graph usually precedes budget burn and hangs; flag it before it becomes an outage" },
              { id: "c", label: "Normal variance, as long as each individual tool call succeeds" },
              { id: "d", label: "Proof the MCP server needs a bigger machine" },
            ],
            answer: "b",
            explanation:
              "Call-graph shape is a signal in itself: a cycle the agent didn't exhibit before is a logic change that eventually wastes budget or loops forever. Waiting for individual spans to fail (they succeed) or for users to time out is how it becomes an outage first.",
          },
        ],
      },
      {
        slug: "reliability-objectives-error-budgets",
        title: "Reliability objectives and error budgets",
        blurb: "A portfolio of SLOs with one non-negotiable safety gate.",
        topic: "operation",
        skillIds: ["ai-slo"],
        capability: "Hold a portfolio of SLOs with a non-negotiable safety gate and resolve conflicts via budgets.",
        minutes: 11,
        concept: {
          what:
            "An AI feature holds a **portfolio of SLOs** — availability, latency, quality, cost, safety — whose conflicts are resolved by **error budgets**, with safety as a **gate** that blocks release regardless of remaining budget.",
          why: "Optimising one objective silently degrades the others (cheaper model → quality drop); budgets make trade-offs explicit and the **release gate** resolves them with evidence before users see the regression.",
          where: [
            "A release gate requiring the candidate to **beat or match the incumbent** on quality (golden set), cost, and latency before shipping",
            "Shipping paused when the quality **error budget burns**, resumed when it recovers",
            "**Safety regressions blocking release** even with cost and quality budget to spare",
          ],
          whenNot:
            "A full portfolio is dead weight for an **internal prototype with no users** — one signal plus a rollback habit beats five SLOs nobody enforces.",
        },
        prose: [
          "An AI feature has several reliability objectives at once: availability, latency, quality, cost, and safety. **They conflict.** Routing to a cheaper model cuts cost but often drops quality and changes latency. Chasing quality raises cost. The naive stance — optimise one — silently degrades the others. A **portfolio** makes the trade-offs explicit.",
          "**Error budgets** resolve the conflicts. Each objective gets a target and a budget; you ship while budgets allow and freeze when they burn. The exception is **safety, which is a gate rather than a budget**: a safety regression blocks a release regardless of how much cost or quality budget remains. Treating safety as negotiable is how systems get harmful outputs into production.",
          "The **release gate** is where the portfolio becomes operational. A candidate must beat or match the incumbent on the measured objectives — quality on the **golden set**, cost within budget, latency within SLO — and pass the safety gate, before it ships. Conflicts are resolved at the gate with evidence, not in a meeting after the regression has already reached users.",
        ],
        diagram: {
          kind: "decision",
          root: {
            kind: "decision",
            question: "Can the candidate release?",
            branches: [
              { label: "Safety regression found", node: { kind: "leaf", answer: "Block release", caption: "safety is a gate, not a budget" } },
              { label: "Error budget burned", node: { kind: "leaf", answer: "Freeze ships", caption: "resume when budget recovers" } },
              { label: "Beats or matches incumbent", node: { kind: "leaf", answer: "Ship it", caption: "quality, cost, latency evidenced" } },
            ],
          },
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "The cost-optimization squad routes your support assistant to a cheaper model: cost SLO green, latency green, but the safety eval shows a harmful-output regression. They argue there's plenty of quality budget left to absorb it. What does the portfolio say?",
            choices: [
              { id: "a", label: "Ship it — green cost and latency metrics override one red eval" },
              { id: "b", label: "Block the release: safety is a gate, not a budget — there is no 'allowed amount of harm' to spend regardless of remaining budget" },
              { id: "c", label: "Ship it, but lower the safety eval's weight next quarter" },
              { id: "d", label: "Split traffic 50/50 and let users decide" },
            ],
            answer: "b",
            explanation:
              "Latency and quality budgets tolerate shortfall; safety doesn't. Treating the safety regression as spendable budget is exactly how harmful outputs reach production while every other dashboard stays green.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A new coding-assistant candidate beats the incumbent by 2 points on the golden-set quality eval but breaches the latency SLO and sits at the edge of the cost budget. The team wants to ship on the quality win. How does the release gate resolve this?",
            choices: [
              { id: "a", label: "Quality wins ship automatically — the other objectives are advisory" },
              { id: "b", label: "The candidate must meet every measured objective and pass safety before shipping; trade-offs are decided at the gate with evidence, not on the single strongest metric" },
              { id: "c", label: "Disable the latency SLO for coding assistants permanently" },
              { id: "d", label: "Ship it and renegotiate the SLO breach after users feel the benefit" },
            ],
            answer: "b",
            explanation:
              "The portfolio exists because objectives conflict: a strong single metric is exactly the case the gate is for. Shipping first and negotiating SLOs afterward resolves the conflict after users have already absorbed the regression.",
          },
        ],
      },
      {
        slug: "incident-command-learning-loop",
        title: "Incident command and the learning loop",
        blurb: "An incident is closed when its postmortem becomes a regression test.",
        topic: "operation",
        skillIds: ["ai-incident-response"],
        capability: "Run an AI incident end-to-end and close it with an automated regression test.",
        minutes: 11,
        concept: {
          what:
            "An AI incident runs a lifecycle — **detect** on a real signal, coordinate under an **incident commander**, **mitigate** before root-causing, communicate on a clock, hold a **blameless postmortem** — and closes only when the fix becomes an **automated regression test**.",
          why: "Skipping the last step is what makes incidents **repeat**: without a CI regression test, the same change can reintroduce the same failure next quarter.",
          where: [
            "**Burn-rate alerts on quality** (not just latency) detecting degradation users already feel",
            "Rolling back the changed variable first to stop user impact, then root-causing from a stable system",
            "Postmortem actions encoded as **CI regression tests** that block reintroduction of the failure",
          ],
          whenNot:
            "The full command structure is overkill for a **low-severity, user-invisible blip** — a single-owner fix plus a test may be the whole response; commanders and comms cadences earn their cost at user impact.",
        },
        prose: [
          "An AI incident has a lifecycle, and **skipping the last step** is what makes incidents repeat. **Detect** via a real signal — a burn-rate alert on quality, not just latency. **Coordinate** with a commander who owns the response and clear roles for comms, diagnosis, and fix. **Mitigate** by rolling back the changed variable first; live root-causing can wait, users can't.",
          "Communicate honestly and **on a clock**: what we know, what we're doing, the next update. Silence during an outage breeds worse narratives than the outage itself. After mitigation, hold a **blameless postmortem** — blameless on people, rigorous on systems — that reconstructs what happened, what we believed and why it was wrong, and the systemic fix.",
          "The **learning loop** closes when the postmortem's action becomes an **automated regression test in CI**. Without that step, the same change can reintroduce the same failure next quarter. An incident isn't closed when it's fixed; it's closed when the system has been changed so that specific failure can't recur.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "At 02:00 the quality burn-rate alert fires on your research assistant — answers degrading visibly for EU users after a retrieval-index swap. The on-call engineer wants to spend the next few hours root-causing live before touching anything. What's the correct first move?",
            choices: [
              { id: "a", label: "Root-cause live while users suffer — mitigating destroys the evidence" },
              { id: "b", label: "Mitigate first: roll back the changed variable to stop user impact, then investigate from a stable system" },
              { id: "c", label: "Wait for the morning standup to assign an incident commander" },
              { id: "d", label: "Silence the burn-rate alert so the pager stops firing" },
            ],
            answer: "b",
            explanation:
              "Mitigation is for users; root-cause is for later. Telemetry preserves the evidence after rollback, so nothing is lost — but hours of live debugging while EU users get degraded answers is the failure mode the lifecycle order prevents.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Six months after a system-prompt leak incident, the same vulnerability reappears because a refactor reintroduced the old code path. The postmortem had a detailed writeup and a well-attended review meeting. What was never done?",
            choices: [
              { id: "a", label: "The postmortem wasn't long enough to cover edge cases" },
              { id: "b", label: "The fix was never encoded as an automated regression test in CI, so nothing blocked the change from reintroducing the failure" },
              { id: "c", label: "No one was blamed, so accountability lapsed" },
              { id: "d", label: "The incident commander role wasn't made permanent" },
            ],
            answer: "b",
            explanation:
              "Writeups and meetings don't prevent recurrence — CI does. The learning loop closes only when the fix becomes a regression test that fails the build reintroducing the failure; otherwise the same change ships again next quarter.",
          },
        ],
      },
      {
        slug: "capstone-design-review",
        title: "Capstone: production design review",
        blurb: "Observe quality, safety, and cost at scale — privately, gated, and auditable.",
        topic: "capstone",
        skillIds: ["ai-observability"],
        capability: "Defend an end-to-end observability design across cost, privacy, debuggability, release safety, and security.",
        minutes: 14,
        concept: {
          what:
            "The capstone defends a multi-agent financial system across **privacy, cost, debuggability, release safety, and security** — redact at ingest, enforce residency, tail-sample and cap cardinality, trace the agent graph, gate releases, read the OWASP signals.",
          why: "The naive design (raw prompts across regions, 100% sampling, model-only watches, ship-by-hope) is **both a breach surface and a debugging dead-end**; each hardened choice is a **contract owned by a specific layer**.",
          where: [
            "Multi-region rollout: EU residency in the collector, tenant isolation at storage, an **audit trail** on every sensitive read",
            "Agent fleet: **task spans parenting tool/MCP spans**, budget and loop alerts, eval-gated releases with canaries",
            "Guardrail **ASR measured continuously** and read as a production SLO alongside quality and cost",
          ],
          whenNot:
            "The full stack is only justified at **production scale with regulated data** — an internal prototype with no users or auditors shouldn't pay for residency routing, tenant partitioning, and eval gates.",
        },
        prose: [
          "The capstone asks you to defend a complete design for the multi-agent financial system across every axis the course covered: **privacy, cost, debuggability, release safety, and security**. The naive design logs raw prompts across regions, samples at 100%, watches only the model, ships by hope, and detects no attacks. It's both a **breach surface** and a **debugging dead-end**.",
          "The hardened design **redacts at ingest**, enforces EU residency, and isolates tenants; it **tail-samples and caps cardinality**; it traces the agent graph including MCP; it gates releases behind evals and canaries; and it reads the OWASP signals and measures its guardrail's **attack-success rate**. Each choice is a contract owned by a specific layer, and together they resolve the central tension — the system is observable and **safe to operate**.",
          "That is the enterprise bar this course builds toward: prove you can **trace every decision**, measure quality and safety continuously, **control every change** through gates, and keep every sensitive payload private and audited. Observability, done at this level, is what turns a powerful AI system into a **trustworthy** one.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "An architecture review board is comparing two designs for a multi-agent financial research platform. Design A logs raw prompts globally, keeps 100% of traces, watches per-model latency, and ships after manual QA. Design B redacts at the collector, tail-samples, traces the agent graph with MCP spans, and gates releases on evals. What's the strongest verdict?",
            choices: [
              { id: "a", label: "Both are equivalent — B is just A with extra steps and cost" },
              { id: "b", label: "A is both a breach surface and a debugging dead-end; B makes each layer own a contract — privacy at ingest, cost via sampling, debuggability via the graph, safety via gates" },
              { id: "c", label: "A is compliant because QA signed off before each ship" },
              { id: "d", label: "B fails because redaction makes debugging impossible by design" },
            ],
            answer: "b",
            explanation:
              "A's raw prompts across regions are the breach surface and its model-only view can't debug an agent graph — while redaction keeps the dimensions that carry debug value. B's strength is that each layer owns exactly one guarantee.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "You're hired to review a health-automation startup's 'observability v2' proposal: more dashboards, a bigger model, 100% trace retention, with privacy 'handled later'. The CEO asks what the enterprise bar actually requires. What do you tell them?",
            choices: [
              { id: "a", label: "Buy the dashboards first — visibility is the bar" },
              { id: "b", label: "Trace every decision, measure quality and safety continuously, control changes through gates, and keep sensitive payloads private and audited — power without those is a liability" },
              { id: "c", label: "The bar is the cheapest model that passes its unit tests" },
              { id: "d", label: "Wait until regulators force the requirements, then retrofit" },
            ],
            answer: "b",
            explanation:
              "Dashboards and retention are volume, not observability. The bar the capstone sets is traceable decisions, continuous measurement, gated change control, and private audited payloads — retrofitting privacy after storing health prompts 'later' never comes cheap.",
          },
        ],
      },
    ],
  },
] as const;

export function allCourseSlugs(): string[] {
  return COURSES.map((c) => c.slug);
}

export function getCourse(courseSlug: string): Course | undefined {
  return COURSES.find((c) => c.slug === courseSlug);
}

export function getLesson(
  courseSlug: string,
  lessonSlug: string,
): { course: Course; lesson: Lesson; index: number } | undefined {
  const course = getCourse(courseSlug);
  if (!course) return undefined;
  const index = course.lessons.findIndex((l) => l.slug === lessonSlug);
  if (index === -1) return undefined;
  return { course, lesson: course.lessons[index]!, index };
}

/**
 * The byte-progress key for a course lesson. Distinct from the `byte:${slug}`
 * namespace used by `/bytes`, so the two systems never share progress rows.
 */
export function courseLessonKey(courseSlug: string, lessonSlug: string): string {
  return `course:${courseSlug}:${lessonSlug}`;
}

/**
 * What to recommend after a learner finishes a course, at the moment
 * motivation peaks. `why` is one learner-facing line for the CTA.
 */
export const NEXT_COURSE: Record<string, { slug: string; why: string } | undefined> = {
  "machine-learning-for-layman": {
    slug: "ai-observability",
    why: "You can read a model now — learn to keep watch when it runs in the real world.",
  },
  "machine-learning": {
    slug: "machine-learning-for-layman",
    why: "Consolidate the intuition: the picture-led deep dive on everything you just skimmed.",
  },
  "ai-observability": {
    slug: "llm-observability",
    why: "Level up from watching AI to instrumenting and rescuing a live LLM feature.",
  },
  "llm-observability": {
    slug: "ai-observability-reliability",
    why: "Design the scalable, secure, governed observability system behind everything you just practised.",
  },
  "ai-observability-reliability": undefined,
};
