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
  /** Guess-first MCQ shown before the infographic (local only). */
  prediction?: ByteQuestion;
  /** ~100-200 words of explanation, rendered as paragraphs under the infographic. */
  prose?: string[];
  /** Optional runnable Python exercise (Pyodide). */
  exercise?: CodeExercise;
  /** 2-3 self-check MCQs. All must be answered correctly to complete the byte. */
  questions?: ByteQuestion[];
  /** Short real-world transfer prompt after the checks. */
  application?: { title: string; prompt: string };
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
  lessons: Lesson[];
};

export const COURSES: readonly Course[] = [
  {
    slug: "machine-learning",
    title: "Machine Learning",
    subtitle: "AI, machine learning, and deep learning — connected clearly.",
    description:
      "A visual path through the concepts every AI learner needs. Each lesson combines an infographic, a concise explanation, an active check, and saved progress.",
    level: "intermediate",
    domain: "Machine Learning",
    access: "free",
    lessons: [
      {
        slug: "what-is-artificial-intelligence",
        title: "What is Artificial Intelligence?",
        blurb: "What makes a machine intelligent — and what doesn't.",
        topic: "ai-foundations",
        skillIds: ["ai-literacy", "ai-ml-dl"],
        capability: "Distinguish adaptive AI systems from fixed-rule software.",
        minutes: 4,
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the visual: which machine is acting more 'intelligently'?",
          choices: [
            { id: "a", label: "A microwave with fixed cook times" },
            { id: "b", label: "A recommendation system that changes after your clicks" },
            { id: "c", label: "A wall clock that always ticks the same way" },
          ],
          answer: "b",
          explanation:
            "Intelligence here means adapting from experience. Fixed timers and clocks don't update their behaviour from data.",
        },
        prose: [
          "Artificial Intelligence is the branch of computer science that tries to build machines which can act intelligently — reason, learn, perceive, and decide — instead of only executing fixed instructions.",
          "The key divide is between a machine that follows rules and one that figures things out. A calculator is not intelligent: the same input always yields the same output, and it never adapts. A spam filter that improves as it sees more email is.",
          "AI is the broadest label. Everything underneath it — machine learning, deep learning, large language models — is a technique for reaching that goal. Think of AI as the destination, and ML/DL as vehicles for getting there.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt: "Which of these is the clearest example of an intelligent (non-dumb) machine?",
            choices: [
              { id: "a", label: "A washing machine with 12 preset cycles" },
              { id: "b", label: "An email spam filter that improves as it sees more mail" },
              { id: "c", label: "A calculator that always returns the exact same answer" },
              { id: "d", label: "A digital clock" },
            ],
            answer: "b",
            explanation:
              "The spam filter adapts its behaviour from data over time — that's the hallmark of intelligence. The other three do exactly what they were programmed to, every time.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt: "AI, ML, and DL are best described as:",
            choices: [
              { id: "a", label: "Three unrelated fields that happen to sound similar" },
              { id: "b", label: "Three names for the exact same thing" },
              { id: "c", label: "Nested: DL is a subset of ML, which is a subset of AI" },
              { id: "d", label: "Competing products from different companies" },
            ],
            answer: "c",
            explanation:
              "Deep learning is one approach within machine learning, and machine learning is one approach within AI. Each inner circle is a specialisation of the one containing it.",
          },
          {
            id: "q3",
            kind: "mcq",
            prompt: "A traditional program where 'same input → same output, always' is:",
            choices: [
              { id: "a", label: "Intelligent, because it's deterministic" },
              { id: "b", label: "Non-intelligent — it cannot learn or adapt" },
              { id: "c", label: "A neural network" },
              { id: "d", label: "An example of deep learning" },
            ],
            answer: "b",
            explanation:
              "Determinism alone isn't intelligence. Intelligence implies the system can change its behaviour based on data or experience; a fixed lookup cannot.",
          },
        ],
        application: {
          title: "Spot adaptive systems around you",
          prompt:
            "List two apps you use daily. For each, write one sentence: does it follow fixed rules, or does it change from your behaviour? If you're unsure, name what evidence would convince you.",
        },
      },
      {
        slug: "what-is-machine-learning",
        title: "What is Machine Learning?",
        blurb: "Teaching machines to learn from data instead of rules.",
        topic: "ml-foundations",
        skillIds: ["ai-literacy", "learning-paradigms"],
        capability: "Explain how ML learns patterns and identify its three main families.",
        minutes: 5,
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the visual: how does a spam filter usually get better over time?",
          choices: [
            { id: "a", label: "A programmer rewrites every rule by hand each night" },
            { id: "b", label: "It learns patterns from labelled examples of spam and not-spam" },
            { id: "c", label: "It randomly guesses until users give up" },
          ],
          answer: "b",
          explanation:
            "ML systems improve by fitting patterns in data. Hand-rewriting every rule is traditional programming, not learning from examples.",
        },
        prose: [
          "Machine Learning is a technique for building AI systems that learn patterns from data themselves, rather than relying on a programmer to hand-code every rule.",
          "The classic framing: instead of writing a program that says 'if an email contains these words, it's spam', you show the system thousands of labelled spam and non-spam emails and let it discover the patterns. The more data it sees, the better it gets.",
          "There are three broad families. Supervised learning trains on labelled examples (predict the label of new inputs). Unsupervised learning finds structure in unlabelled data (cluster similar items). Reinforcement learning learns by trial and error, rewarded for good decisions and penalised for bad ones.",
        ],
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
            prompt: "What distinguishes ML from traditional programming?",
            choices: [
              { id: "a", label: "ML runs faster" },
              { id: "b", label: "ML learns patterns from data instead of hand-coded rules" },
              { id: "c", label: "ML only works in Python" },
              { id: "d", label: "ML never makes mistakes" },
            ],
            answer: "b",
            explanation:
              "The defining shift is who writes the rules: in traditional code the programmer does, in ML the system infers them from data. Speed and language are incidental.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt: "Training an agent by giving it rewards for good actions is called:",
            choices: [
              { id: "a", label: "Supervised learning" },
              { id: "b", label: "Unsupervised learning" },
              { id: "c", label: "Reinforcement learning" },
              { id: "d", label: "Deterministic programming" },
            ],
            answer: "c",
            explanation:
              "Reinforcement learning is the trial-and-error-with-rewards family. Supervised needs labels; unsupervised has neither labels nor rewards.",
          },
          {
            id: "q3",
            kind: "mcq",
            prompt: "Grouping similar customers together, with no labels given, is:",
            choices: [
              { id: "a", label: "Supervised — you supervise the grouping" },
              { id: "b", label: "Unsupervised — the system finds structure in unlabelled data" },
              { id: "c", label: "Reinforcement — rewards guide the groups" },
              { id: "d", label: "Not machine learning at all" },
            ],
            answer: "b",
            explanation:
              "No labels and no rewards means unsupervised: the algorithm discovers inherent structure (like clusters) in the raw data.",
          },
        ],
        application: {
          title: "Name the learning family",
          prompt:
            "Pick one problem at work or school (fraud, recommendations, grouping customers, a game bot). Write which family fits — supervised, unsupervised, or reinforcement — and one sentence why.",
        },
      },
      {
        slug: "what-is-deep-learning",
        title: "What is Deep Learning?",
        blurb: "Multi-layer neural networks, drawn out.",
        topic: "deep-learning",
        skillIds: ["ai-ml-dl"],
        capability: "Explain what makes a neural network deep and why layers help.",
        minutes: 5,
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the visual: what does 'deep' most precisely mean here?",
          choices: [
            { id: "a", label: "The model has many stacked layers" },
            { id: "b", label: "The training data is philosophically profound" },
            { id: "c", label: "The GPU is physically deep underground" },
          ],
          answer: "a",
          explanation:
            "'Deep' counts layers in the network. It is an architecture word, not a claim about understanding.",
        },
        prose: [
          "Deep Learning is a subfield of machine learning that uses artificial neural networks — structures loosely inspired by the brain — with many layers stacked one after another.",
          "'Deep' simply refers to the number of layers. A network with one or two layers is shallow; a deep network might have dozens. Each layer transforms its input into a slightly more abstract representation: early layers might detect edges, middle layers detect shapes, and later layers detect whole objects.",
          "Because deep networks learn features directly from raw data (pixels, audio samples, text tokens), they remove the need for a human to hand-design features. That's why they dominate hard perception tasks — image recognition, speech-to-text, translation, and the language models behind tools like ChatGPT.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt: "What does the 'deep' in 'deep learning' refer to?",
            choices: [
              { id: "a", label: "The model understands concepts profoundly" },
              { id: "b", label: "The number of layers in the neural network" },
              { id: "c", label: "The depth of the training data" },
              { id: "d", label: "How much GPU memory is used" },
            ],
            answer: "b",
            explanation:
              "'Deep' is purely architectural — it counts the layers. A deep network stacks many; a shallow one has few. It says nothing about the model's 'understanding'.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt: "Why are deep networks good at tasks like image recognition?",
            choices: [
              { id: "a", label: "They run on faster hardware" },
              { id: "b", label: "They learn features directly from raw data, layer by layer" },
              { id: "c", label: "They don't need any data" },
              { id: "d", label: "They always use less memory than alternatives" },
            ],
            answer: "b",
            explanation:
              "Stacked layers let the network build features hierarchically — edges → shapes → objects — straight from pixels, removing the need for hand-engineered features.",
          },
          {
            id: "q3",
            kind: "mcq",
            prompt: "Deep learning is best described as:",
            choices: [
              { id: "a", label: "A replacement for machine learning" },
              { id: "b", label: "A subset of machine learning that uses multi-layer neural networks" },
              { id: "c", label: "The same thing as artificial intelligence" },
              { id: "d", label: "Unrelated to neural networks" },
            ],
            answer: "b",
            explanation:
              "Deep learning sits inside ML — it's one technique (multi-layer neural networks) within the broader field of learning from data, which in turn sits inside AI.",
          },
        ],
        application: {
          title: "Feature hierarchy in plain words",
          prompt:
            "Describe a photo app that tags 'dog'. In one sentence each, invent what an early layer, a middle layer, and a late layer might notice — even if you are guessing.",
        },
      },
      {
        slug: "ai-vs-ml-vs-dl",
        title: "AI vs ML vs Deep Learning",
        blurb: "How the three nested worlds fit together.",
        topic: "ai-foundations",
        skillIds: ["ai-ml-dl"],
        capability: "Place AI, machine learning, and deep learning in the correct relationship.",
        minutes: 4,
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the visual: which nesting is correct?",
          choices: [
            { id: "a", label: "DL contains ML, which contains AI" },
            { id: "b", label: "AI contains ML, which contains DL" },
            { id: "c", label: "The three fields are unrelated" },
          ],
          answer: "b",
          explanation:
            "AI is the broad goal; ML is one path; DL is one ML technique. Circles nest AI ⊃ ML ⊃ DL.",
        },
        prose: [
          "These three terms are constantly confused, but they're just nested circles. AI is the largest; machine learning is a part of AI; deep learning is a part of machine learning.",
          "Artificial Intelligence is the goal: build machines that can act intelligently. Machine learning is one way to pursue that goal — let the system learn from data. Deep learning is one specific technique within ML — use many-layered neural networks.",
          "Not all AI is machine learning (rule-based expert systems are AI but don't learn). Not all ML is deep learning (random forests and logistic regression are ML but not deep). But all deep learning is ML, and all ML is AI.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt: "Which statement is correct?",
            choices: [
              { id: "a", label: "AI is a subset of ML, which is a subset of DL" },
              { id: "b", label: "DL is a subset of ML, which is a subset of AI" },
              { id: "c", label: "All three are the same thing" },
              { id: "d", label: "AI, ML, and DL share no relationship" },
            ],
            answer: "b",
            explanation:
              "The nesting goes AI ⊃ ML ⊃ DL. DL is the innermost, most specialised; AI is the broadest.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt: "A logistic regression model that learns weights from data is:",
            choices: [
              { id: "a", label: "AI only — it's not learning" },
              { id: "b", label: "ML, but not deep learning" },
              { id: "c", label: "Deep learning, but not ML" },
              { id: "d", label: "None of the above" },
            ],
            answer: "b",
            explanation:
              "Logistic regression learns from data (so it's ML) but has no multi-layer neural network (so it's not deep learning). It sits inside the ML circle, outside the DL one.",
          },
          {
            id: "q3",
            kind: "mcq",
            prompt: "An old-school expert system with hand-coded 'if-then' medical rules is:",
            choices: [
              { id: "a", label: "Deep learning" },
              { id: "b", label: "Machine learning" },
              { id: "c", label: "AI, but not machine learning (it doesn't learn from data)" },
              { id: "d", label: "None of AI, ML, or DL" },
            ],
            answer: "c",
            explanation:
              "It can act intelligently (AI) but it never learns — a human wrote every rule. So it's AI but not ML, and therefore not DL either.",
          },
        ],
        application: {
          title: "Place a real system in the circles",
          prompt:
            "Take ChatGPT, a spam filter, or a medical expert system with hand-written rules. Write which circles it sits in (AI / ML / DL) and one reason for each boundary you draw.",
        },
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
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the picture: a child has never seen a bike. You show them three, each labelled ‘bike’. Next time they see a new one, what’s most likely?",
          choices: [
            { id: "a", label: "They recognise it as a bike" },
            { id: "b", label: "They still have no idea" },
            { id: "c", label: "They forget everything" },
          ],
          answer: "a",
          explanation:
            "Experience with examples is what turns ‘no idea’ into recognition — that’s the core of learning, for humans and machines alike.",
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt: "What makes an experience useful for learning?",
            choices: [
              { id: "a", label: "It changes how you respond to a similar situation later" },
              { id: "b", label: "It is repeated without noticing the result" },
              { id: "c", label: "Someone writes every future instruction in advance" },
            ],
            answer: "a",
            explanation:
              "Learning means experience changes a future response. Repetition alone is not enough if nothing is updated.",
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
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt: "Which system is adapting rather than only following fixed instructions?",
            choices: [
              { id: "a", label: "A timer that rings after exactly ten minutes" },
              { id: "b", label: "A filter that improves after users mark unwanted messages" },
              { id: "c", label: "A calculator evaluating the same formula" },
            ],
            answer: "b",
            explanation:
              "The filter changes from feedback. The timer and calculator execute predetermined instructions.",
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
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the picture: to make a machine recognise cars, who works out the detailed rule for ‘what is a car’?",
          choices: [
            { id: "a", label: "A programmer writes every rule by hand" },
            { id: "b", label: "The machine figures it out from examples" },
            { id: "c", label: "Nobody — it happens by accident" },
          ],
          answer: "b",
          explanation:
            "That hand-off — the programmer gives examples, the machine finds the rule — is the whole idea of machine learning.",
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt: "In machine learning, who discovers the detailed pattern?",
            choices: [
              { id: "a", label: "The learning algorithm, from examples" },
              { id: "b", label: "A programmer, by writing every possible rule" },
              { id: "c", label: "The user, after the prediction is made" },
            ],
            answer: "a",
            explanation:
              "A programmer defines the learning process, but the model discovers the detailed pattern from data.",
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
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the picture: a robot learns to win a game by getting points for good moves and losing points for bad ones. Does it need labelled examples of ‘correct moves’?",
          choices: [
            { id: "a", label: "Yes — it needs someone to label each move" },
            { id: "b", label: "No — the points are enough feedback" },
            { id: "c", label: "It needs both" },
          ],
          answer: "b",
          explanation:
            "Learning from reward/penalty without labelled answers is its own family — reinforcement learning. The picture ahead shows all three families side by side.",
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
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt: "Predicting a house price from examples of houses and their sale prices is:",
            choices: [
              { id: "a", label: "Classification, because houses have categories" },
              { id: "b", label: "Regression, because the output is a number" },
              { id: "c", label: "Unsupervised learning, because prices vary" },
            ],
            answer: "b",
            explanation:
              "A continuous numeric output such as price makes this supervised regression.",
          },
        ],
        application: {
          title: "Spot supervised learning around you",
          prompt:
            "Name two predictions an app makes for you (a price, a label, a yes/no). For each, write what the labelled ‘answers’ in its training data might have been.",
        },
      },
      {
        slug: "unsupervised-learning-deep-dive",
        title: "Inside unsupervised learning",
        blurb: "No labels → the algorithm finds its own groups and patterns.",
        topic: "layman-paradigms",
        skillIds: ["unsupervised-learning", "learning-paradigms"],
        capability: "Recognize that unsupervised learning finds structure without labels.",
        minutes: 5,
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
        ],
        application: {
          title: "Find a cluster in your day",
          prompt:
            "Think of the people or items around you. Describe one group that ‘belongs together’ by behaviour or habit — with nobody having assigned the labels. That grouping is unsupervised.",
        },
      },
      {
        slug: "reinforcement-learning-deep-dive",
        title: "Inside reinforcement learning",
        blurb: "Agent → action → reward or penalty → a better strategy.",
        topic: "layman-paradigms",
        skillIds: ["reinforcement-learning", "learning-paradigms"],
        capability: "Recognize trial-and-error learning guided by reward.",
        minutes: 5,
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
        ],
        application: {
          title: "Notice reward-shaped learning",
          prompt:
            "Name one game, app, or habit of yours that gives you points or streaks. Write one sentence: what ‘move’ does it reward, and what did you learn to do more of?",
        },
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
          "A machine can’t ‘see’ a car the way you do — it only reads numbers. So the first job is to describe each object with measurable features: number of wheels, height, weight, colour.",
          "One object becomes a list of values, called a vector. The whole learning step that follows depends on this translation being right.",
          "Not every feature helps. A feature only earns its place if it separates the classes — colour doesn’t, because cars and bikes come in every colour.",
        ],
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the picture: to teach a machine to tell cars from bikes, which feature would be least helpful?",
          choices: [
            { id: "a", label: "Number of wheels" },
            { id: "b", label: "Height" },
            { id: "c", label: "Paint colour" },
          ],
          answer: "c",
          explanation:
            "Cars and bikes come in any colour, so it can’t separate them. The picture ahead turns each object into a list of useful features.",
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Classifying car vs. bike, which feature is least useful?",
            choices: [
              { id: "a", label: "Number of wheels" },
              { id: "b", label: "Height" },
              { id: "c", label: "Color" },
            ],
            answer: "c",
            explanation:
              "Cars and bikes come in any color, so color does not separate the classes — it's a bad feature.",
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
          "Once your samples are vectors with labels, you can build your first classifier with nothing more than counting.",
          "Look at all the 4-wheel examples: if every one is a car, then a new 4-wheel sample is almost certainly a car too. That ‘probability from counting’ is the whole rule.",
          "Pick the class that’s more likely given the feature, and you have a working classifier — built from scratch, no maths beyond counting.",
        ],
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the picture: in your data, every 4-wheel sample is a car and every 2-wheel sample is a bike. A new sample has 4 wheels. What would you guess?",
          choices: [
            { id: "a", label: "Car" },
            { id: "b", label: "Bike" },
            { id: "c", label: "Can’t tell" },
          ],
          answer: "a",
          explanation:
            "You just counted the data and picked the more likely class — that’s exactly what the classifier ahead does, mechanically.",
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
          "A single feature often isn’t enough. Wheel count might leave you 75% sure it’s a bike — better than a coin flip, but not a clean call.",
          "The fix is to add a second good feature. With height as well as wheel count, a tricky sample that was ambiguous becomes decided.",
          "Stack several ‘if this, then that’ splits and you get a decision tree — each feature asks a question that narrows the answer further.",
        ],
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
          "Instead of counting the whole dataset, k-Nearest-Neighbors only looks at the samples closest to the new one.",
          "‘Closest’ means most similar in their features — the same idea as physical nearness, just measured in numbers.",
          "Take a vote among those k neighbours: whichever class is the majority wins. Simple, and surprisingly effective.",
        ],
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the picture: a new sample is surrounded by mostly cars. If you had to guess its class from its neighbours, what would you pick?",
          choices: [
            { id: "a", label: "Car — go with the majority nearby" },
            { id: "b", label: "Bike — go with the minority" },
            { id: "c", label: "Neither — ignore the neighbours" },
          ],
          answer: "a",
          explanation:
            "Going with the majority of nearby examples is the k-Nearest-Neighbors idea — the picture ahead shows it visually.",
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
          "Comparing a new sample to every single example is a lot of work. The centroid classifier has a shortcut: summarise each class by one average member.",
          "That average — the centroid — stands in for the whole group. You only compare the new sample to one car-centre and one bike-centre.",
          "Whichever centre is closer wins. It’s faster than kNN, and it captures the ‘typical’ idea of each class.",
        ],
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
          "A decision tree is just a list of if/then rules, drawn as a path. Start at the top, answer each question, and you land on a prediction.",
          "For the tennis example, the rules look like ‘if sunny and humid, no match’. Drawn as a tree, that same rule is a branch you walk down.",
          "Many different trees could give the same answers on your data — so the real question is: which tree is best? That’s the next lesson.",
        ],
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
          "When a tree asks a question, it splits the data into branches. A good split leaves each branch mostly one class — that’s called ‘pure’.",
          "A bad split leaves the branches jumbled. The tree-building rule is simple: at every step, pick the feature whose split is purest.",
          "That purity has a name — information gain — but the intuition needs no formula: the best question is the one that untangles the classes the most.",
        ],
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
        prose: [
          "Once you've built a classifier, the obvious question is: is it any good? The trap is checking the same data it learned from.",
          "If you graded a student on the exact exam questions they studied, you'd learn nothing about whether they understood the ideas — only whether they memorized.",
          "The fix is to split your data: a training pile the model learns from, and a separate test pile it never sees. Only the test score tells you if it generalizes.",
        ],
        application: {
          title: "Feel the split in your own life",
          prompt:
            "Think of a test or interview you prepared for. Write one sentence: what would ‘training data’ be for you, and what would ‘test data’ be? Why can't they be the same questions?",
        },
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
        prose: [
          "Overfitting is when a model learns its training data so precisely — every quirk and noise — that it fails on anything new.",
          "It's the difference between a student who memorized past exams and one who understood the ideas. The memorizer aces the old papers and flops a fresh question.",
          "The goal is the sweet spot: simple enough to generalize, complex enough to capture the real pattern.",
        ],
        application: {
          title: "Spot overfitting around you",
          prompt:
            "Name a time you (or someone) memorized something word-for-word but couldn't use it in a new situation. Write one sentence: what was the ‘training data’, and what was the ‘new data’ it failed on?",
        },
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
        prose: [
          "The single biggest influence on a model isn't the algorithm — it's the data. A fancy model trained on bad data still gives bad answers.",
          "If a model only ever saw red cars, it would ‘learn’ that cars are red — and then fail on a blue one. That's not a broken model; it's broken data.",
          "Before tuning the algorithm, ask: is the data varied, balanced, and representative of the real world the model will meet?",
        ],
        application: {
          title: "Audit a dataset's bias",
          prompt:
            "Pick an ML feature you use (recommendations, search, spam). Write one way its training data could be biased — and one prediction that bias would produce.",
        },
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
        application: {
          title: "Audit your own phone",
          prompt:
            "Open the apps you used today. Pick two and write one sentence each: what does it predict or sort for you, and what past behaviour of yours is it learning from?",
        },
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
        application: {
          title: "Spot a likely failure case",
          prompt:
            "Name one ML feature you rely on. Describe one input or situation where you’d distrust its output, and one reason your training-data knowledge gives for that doubt.",
        },
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
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the visual: you’re driving and the car feels fine. What’s the most reliable way to know the engine is healthy?",
          choices: [
            { id: "a", label: "Trust how it feels" },
            { id: "b", label: "Glance at the dashboard gauges" },
            { id: "c", label: "Wait until it breaks down" },
          ],
          answer: "b",
          explanation:
            "Feelings miss slow problems, and waiting for a breakdown is too late. Gauges show the engine’s hidden state before it fails.",
        },
        prose: [
          "Observability means being able to tell what’s happening inside a system just by reading signals on the outside.",
          "A car’s dashboard does this perfectly. You can’t see the engine, but the gauges tell you the speed, the fuel, and whether something is wrong — all without lifting the bonnet.",
          "An AI is also a hidden engine. You only see its answers. Observability gives an AI its own dashboard: little readings that show how it’s really doing underneath, not just how confident it sounds.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt: "What does observability let you do?",
            choices: [
              { id: "a", label: "See a system’s source code" },
              { id: "b", label: "Tell what’s happening inside a system from outside signals" },
              { id: "c", label: "Make the system run faster" },
            ],
            answer: "b",
            explanation:
              "Observability is about insight into internal state from the outside — not code access or speed.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt: "Why is a car dashboard a good analogy for AI observability?",
            choices: [
              { id: "a", label: "Because cars and AIs both use fuel" },
              {
                id: "b",
                label: "Because in both cases the important parts are hidden, so you need readings to know their state",
              },
              { id: "c", label: "Because both have screens" },
            ],
            answer: "b",
            explanation:
              "The shared idea is a hidden engine whose health you read through gauges — fuel and screens are surface details.",
          },
          {
            id: "q3",
            kind: "mcq",
            prompt: "An AI gives an answer that looks fine. Observability helps you…",
            choices: [
              { id: "a", label: "Know whether it’s actually fine underneath" },
              { id: "b", label: "Make the answer longer" },
              { id: "c", label: "Turn the AI off" },
            ],
            answer: "a",
            explanation:
              "Looking fine isn’t being fine. Observability reveals the hidden state behind a confident-looking answer.",
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
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the visual: you ask an AI the exact same question twice. What will most likely happen?",
          choices: [
            { id: "a", label: "Both answers will be identical" },
            { id: "b", label: "The answers will probably differ slightly" },
            { id: "c", label: "The second answer will be blank" },
          ],
          answer: "b",
          explanation:
            "AI is non-deterministic: the same prompt can yield different wording, length, or choices on different runs.",
        },
        prose: [
          "Normal software is like a vending machine. Press the same button, get the same thing, every single time. It’s predictable.",
          "AI is more like a chef. Order the same dish twice and you’ll get two slightly different meals — both perfectly fine, but never identical.",
          "This changes how we monitor it. With a vending machine you can test it once and trust it. With a chef, one good meal doesn’t promise the next — so you have to keep watching how each one turns out.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt: "In plain language, what does “non-deterministic” mean?",
            choices: [
              { id: "a", label: "The system is broken" },
              { id: "b", label: "The same input can produce different outputs" },
              { id: "c", label: "The system has no inputs" },
            ],
            answer: "b",
            explanation:
              "Non-deterministic means the output isn’t fixed by the input — it can vary. It doesn’t mean broken.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt: "Why can’t you test an AI once and trust it forever?",
            choices: [
              { id: "a", label: "Because it’s too slow to run twice" },
              {
                id: "b",
                label: "Because the same prompt can give different answers on different runs",
              },
              { id: "c", label: "Because it deletes its old answers" },
            ],
            answer: "b",
            explanation:
              "One good run doesn’t guarantee the next. Non-determinism means each run needs watching.",
          },
          {
            id: "q3",
            kind: "mcq",
            prompt: "Which behaves more like an AI — a vending machine or a chef?",
            choices: [
              { id: "a", label: "A vending machine" },
              { id: "b", label: "A chef" },
            ],
            answer: "b",
            explanation:
              "A chef varies dish-to-dish, just as an AI varies answer-to-answer. A vending machine is fixed.",
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
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the visual: an AI feature is broken. How will you most likely find out?",
          choices: [
            { id: "a", label: "A loud crash that everyone notices" },
            { id: "b", label: "It quietly gives worse answers while the bill climbs" },
            { id: "c", label: "The AI sends you an email" },
          ],
          answer: "b",
          explanation:
            "AI rarely crashes and doesn’t self-report. Without instruments, you usually only notice via worse answers, user complaints, or the bill.",
        },
        prose: [
          "Normal software fails loudly. A page stops loading, an error pops up, the app freezes. Everyone notices, and someone fixes it.",
          "AI tends to fail quietly. It keeps answering with a smile — but the answers quietly become wrong, the costs quietly climb, or the quality quietly drifts downward over time.",
          "Because nothing actually crashes, nobody realises until the damage is done. That’s the core problem observability exists to solve: making quiet problems loud enough to catch early.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt: "How does AI failure usually differ from normal software failure?",
            choices: [
              { id: "a", label: "AI fails more loudly, with bigger error screens" },
              { id: "b", label: "AI tends to fail quietly, without crashing" },
              { id: "c", label: "AI never fails" },
            ],
            answer: "b",
            explanation:
              "AI keeps running and answering even when something is wrong, so the failure is silent rather than a crash.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt: "Which is NOT one of the three quiet-failure modes named in the lesson?",
            choices: [
              { id: "a", label: "Being confidently wrong" },
              { id: "b", label: "Quietly climbing costs" },
              { id: "c", label: "Running out of disk space" },
            ],
            answer: "c",
            explanation:
              "Disk space is a loud, classic crash. The three quiet modes are confident wrongness, rising cost, and slow drift.",
          },
          {
            id: "q3",
            kind: "mcq",
            prompt: "Why are quiet failures dangerous?",
            choices: [
              { id: "a", label: "They crash the whole app at once" },
              { id: "b", label: "Nobody notices until damage is done" },
              { id: "c", label: "They’re always expensive to fix" },
            ],
            answer: "b",
            explanation:
              "The danger is invisibility: since nothing crashes, the problem can run unnoticed for days or weeks.",
          },
        ],
        application: {
          title: "Spot the quiet failure",
          prompt:
            "Think of a time an app gave you an answer that looked fine but felt subtly off — a wrong fact, a too-confident guess, or a strange suggestion. What ‘quiet’ problem might have been happening behind the scenes, and what single number would you want on a dashboard to catch it next time?",
        },
      },
      {
        slug: "logs-what-ai-said",
        title: "Logs: what the AI said",
        blurb: "A diary of every exchange, so odd answers aren’t a mystery.",
        topic: "observability-pillars",
        skillIds: ["system-logs"],
        capability: "Read a log entry and explain how logging helps answer ‘why did the AI say that?’.",
        minutes: 5,
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the visual: an AI gave a weird answer yesterday. Today you want to know why. What do you most wish you had?",
          choices: [
            { id: "a", label: "The AI’s source code" },
            { id: "b", label: "A record of exactly what was asked and answered" },
            { id: "c", label: "A faster computer" },
          ],
          answer: "b",
          explanation:
            "Source code and speed don’t explain one specific answer. A record of the exchange lets you replay what actually happened.",
        },
        prose: [
          "Logs are a diary of what the AI said. Every exchange — what was asked and what was answered — gets written down as it happens.",
          "Without logs, an odd answer is a mystery. You remember it felt wrong, but the exact words, the time, and the model version are all gone.",
          "With logs, you can scroll back, find the entry, and see the precise prompt, answer, timestamp, and version. ‘Why did it say that?’ becomes a question you can actually investigate.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt: "What is a log, in plain terms?",
            choices: [
              { id: "a", label: "A diary recording what was said" },
              { id: "b", label: "A type of AI model" },
              { id: "c", label: "A summary number over time" },
            ],
            answer: "a",
            explanation:
              "A log is a record of events. (A summary number over time is a metric — that’s the next lesson.)",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt: "Which four things does a good AI log entry capture?",
            choices: [
              { id: "a", label: "Prompt, answer, timestamp, and model version" },
              { id: "b", label: "The user’s name and home address" },
              { id: "c", label: "The weather at the time" },
            ],
            answer: "a",
            explanation:
              "Those four let you reconstruct exactly what happened. Personal data and trivia aren’t needed to debug an answer.",
          },
          {
            id: "q3",
            kind: "mcq",
            prompt: "Logging mostly helps you answer which question?",
            choices: [
              { id: "a", label: "“How do I make the AI faster?”" },
              { id: "b", label: "“Why did the AI say that?”" },
              { id: "c", label: "“How do I turn the AI off?”" },
            ],
            answer: "b",
            explanation:
              "Logs explain past behaviour. Speed is a metric question; turning it off is an ops decision.",
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
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the visual: users say your AI “feels slow”. What turns that feeling into something you can act on?",
          choices: [
            { id: "a", label: "Trust their feeling and guess" },
            { id: "b", label: "A metric that measures response time" },
            { id: "c", label: "A bigger server" },
          ],
          answer: "b",
          explanation:
            "A feeling can’t be fixed until it’s measured. A latency metric turns ‘feels slow’ into ‘1.8 seconds on average’.",
        },
        prose: [
          "Metrics are numbers you count over time. Where a log records one event, a metric summarises thousands — ‘how slow, on average, over the last day?’.",
          "For an AI, four numbers matter most: latency (how long an answer takes), cost (how much it spends), error rate (how often it fails), and token usage (how much it reads and writes).",
          "On their own the numbers are just numbers. The magic is watching them move. A sudden spike in error rate is a quiet problem announcing itself — exactly what you’d miss without the dashboard. Try the 24h window on the dashboard above and spot the spike.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt: "What does a metric do that a log doesn’t?",
            choices: [
              { id: "a", label: "Summarises many events into a number over time" },
              { id: "b", label: "Records one event’s exact words" },
              { id: "c", label: "Turns the AI off automatically" },
            ],
            answer: "a",
            explanation:
              "A metric aggregates (e.g. average latency). A log records a single event verbatim. They answer different questions.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt: "Which is NOT one of the four key AI metrics named?",
            choices: [
              { id: "a", label: "Latency" },
              { id: "b", label: "Cost" },
              { id: "c", label: "The CEO’s mood" },
            ],
            answer: "c",
            explanation:
              "Latency, cost, error rate, and token usage are the four. Mood isn’t measurable — and that’s the point of metrics.",
          },
          {
            id: "q3",
            kind: "mcq",
            prompt: "Why is a spike in error rate useful?",
            choices: [
              { id: "a", label: "It means the AI is bored" },
              { id: "b", label: "It’s a quiet problem becoming visible" },
              { id: "c", label: "It makes the AI faster" },
            ],
            answer: "b",
            explanation:
              "A spike is a silent failure showing up as a number you can see and act on — the whole reason to track metrics.",
          },
        ],
        application: {
          title: "Pick your morning metric",
          prompt:
            "If you ran an AI feature for a week and could check only one metric each morning, which would you pick — and what change in it would make you worried? Why that one over the others?",
        },
      },
      {
        slug: "traces-the-journey",
        title: "Traces: following a request’s journey",
        blurb: "Follow one request end-to-end and find the slow step.",
        topic: "observability-pillars",
        skillIds: ["distributed-tracing"],
        capability: "Read a trace and identify which step in a request is the bottleneck.",
        minutes: 6,
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the visual: an AI answer takes a full second, but you don’t know why. What helps most?",
          choices: [
            { id: "a", label: "A trace showing the time taken by each step" },
            { id: "b", label: "A bigger font size" },
            { id: "c", label: "Restarting the server and hoping" },
          ],
          answer: "a",
          explanation:
            "You can’t fix what you can’t see. A trace breaks one slow request into its steps so you can point at the culprit.",
        },
        prose: [
          "A trace follows one request on its full journey — from the moment a question arrives, through every step behind the scenes, to the final answer.",
          "Each step gets its own little bar showing how long it took. Stacked together, they reveal the shape of the whole request: where the time goes and where the money goes.",
          "The trick is that most steps are quick and one is slow. Without a trace, ‘the AI is slow’ is a vague complaint. With one, you can point at the exact step — usually the big model call — and say ‘there, that’s most of the time’. Try tapping the steps above.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt: "What does a trace show that a single metric can’t?",
            choices: [
              { id: "a", label: "The step-by-step journey of one request" },
              { id: "b", label: "The average latency over a whole day" },
              { id: "c", label: "The AI’s brand of model" },
            ],
            answer: "a",
            explanation:
              "A metric gives an average across many requests. A trace zooms into one request and shows every step inside it.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt: "In the example trace, which step was the bottleneck?",
            choices: [
              { id: "a", label: "The user question" },
              { id: "b", label: "The LLM call" },
              { id: "c", label: "The final answer" },
            ],
            answer: "b",
            explanation:
              "The LLM call’s bar was by far the longest — roughly 80% of the whole request. That’s the step to optimise.",
          },
          {
            id: "q3",
            kind: "mcq",
            prompt: "Traces mostly help you turn ‘it’s slow’ into…",
            choices: [
              { id: "a", label: "‘it’s expensive’" },
              { id: "b", label: "‘THIS step is slow’" },
              { id: "c", label: "‘it’s broken’" },
            ],
            answer: "b",
            explanation:
              "A trace localises the slowness to a specific step, so effort goes where it actually matters.",
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
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the visual: an AI gives a grammatically perfect answer. Is it ‘good’?",
          choices: [
            { id: "a", label: "Yes — it reads well" },
            { id: "b", label: "You can’t tell without checking it against what’s true and useful" },
            { id: "c", label: "No — AI answers are never good" },
          ],
          answer: "b",
          explanation:
            "A well-written answer can still be wrong or unhelpful. ‘Good’ needs checking, not just reading.",
        },
        prose: [
          "“Is this answer good?” is the hardest question in AI. An answer can read beautifully and still be wrong, unhelpful, or off-topic.",
          "The trick is to stop asking one fuzzy question and ask several sharp ones instead — a rubric. Does it get the facts right? Is it helpful? Is it on-topic? Is it safe?",
          "Then someone applies the rubric. A human reviewer is careful but slow; a second AI acting as a judge is fast but not perfect. Most teams blend both, checking a sample of answers on a regular schedule.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt: "Why is ‘is it good?’ a hard question?",
            choices: [
              { id: "a", label: "It’s fuzzy — a well-written answer can still be wrong or unhelpful" },
              { id: "b", label: "Nobody knows what ‘good’ means at all" },
              { id: "c", label: "AI answers are always good" },
            ],
            answer: "a",
            explanation:
              "We can define ‘good’; the problem is that surface polish hides factual or practical problems.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt: "What does a rubric do?",
            choices: [
              { id: "a", label: "Breaks ‘good’ into specific checkable parts" },
              { id: "b", label: "Makes the AI run faster" },
              { id: "c", label: "Deletes bad answers automatically" },
            ],
            answer: "a",
            explanation:
              "A rubric turns one fuzzy question into several sharp ones you can actually score.",
          },
          {
            id: "q3",
            kind: "mcq",
            prompt: "What’s the trade-off between a human reviewer and an AI judge?",
            choices: [
              { id: "a", label: "Humans are careful but slow; AI judges are fast but not perfect" },
              { id: "b", label: "Humans are always wrong" },
              { id: "c", label: "AI judges are always right" },
            ],
            answer: "a",
            explanation:
              "Each has a weakness, which is why teams usually blend human spot-checks with AI judging at scale.",
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
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the visual: an AI says “The capital of Australia is Sydney” with total confidence. What’s true?",
          choices: [
            { id: "a", label: "If it sounds confident, it must be right" },
            { id: "b", label: "It could still be wrong — confidence isn’t proof" },
            { id: "c", label: "AI never states facts" },
          ],
          answer: "b",
          explanation:
            "Hallucinations sound just like facts. Confidence is a property of the wording, not of the truth.",
        },
        prose: [
          "A hallucination is a wrong answer said with complete confidence. It looks identical to a correct one — there’s no warning in the wording.",
          "This happens because the AI isn’t a database. It predicts which words tend to follow others, producing text that sounds plausible. Sometimes the most plausible-sounding line simply isn’t true.",
          "Because a confident answer isn’t a checked answer, you catch hallucinations with observability: logs let you re-read what was said, and an evaluation rubric asks the dangerous question — ‘is this actually correct?’.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt: "What is a hallucination, in this lesson’s words?",
            choices: [
              { id: "a", label: "A wrong answer said with confidence" },
              { id: "b", label: "When the AI crashes" },
              { id: "c", label: "A type of log file" },
            ],
            answer: "a",
            explanation:
              "It’s specifically a confident falsehood — not a crash and not a file. The confidence is what makes it dangerous.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt: "Why does the AI produce confident wrong answers?",
            choices: [
              { id: "a", label: "It predicts plausible-sounding words rather than looking up facts" },
              { id: "b", label: "It’s programmed to lie" },
              { id: "c", label: "It runs out of memory" },
            ],
            answer: "a",
            explanation:
              "There’s no intent — plausible-sounding text is just sometimes false. It’s the nature of prediction, not lying.",
          },
          {
            id: "q3",
            kind: "mcq",
            prompt: "Which two observability tools catch hallucinations?",
            choices: [
              { id: "a", label: "Logs and evaluation" },
              { id: "b", label: "A bigger font and a faster server" },
              { id: "c", label: "Turning the AI off" },
            ],
            answer: "a",
            explanation:
              "Logs let you re-check what was said; evaluation asks if it’s correct. Together they surface confident lies.",
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
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the visual: your AI tested perfectly a year ago. Can you trust it today?",
          choices: [
            { id: "a", label: "Yes — once tested, always good" },
            { id: "b", label: "Not necessarily — it may have drifted as the world changed" },
            { id: "c", label: "No — all AI breaks after a year" },
          ],
          answer: "b",
          explanation:
            "A frozen model stays the same while the world moves. Past perfection doesn’t guarantee present quality.",
        },
        prose: [
          "Drift is slow decay. A model is frozen when it’s trained, but the world keeps moving — new words, new events, new user behaviour arrive every week.",
          "Nothing crashes, and there’s no single moment of failure to point at. Like milk slowly turning sour, quality just slips a little at a time until, months later, the answers are subtly worse.",
          "A one-off test can’t see a slide like this. The only way to catch drift is to keep measuring quality over time and watch the trend — so you notice the decline before your users do.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt: "What is drift?",
            choices: [
              { id: "a", label: "A slow decline in quality as the world changes around a frozen model" },
              { id: "b", label: "A sudden crash" },
              { id: "c", label: "A new type of AI" },
            ],
            answer: "a",
            explanation:
              "Drift is gradual decay, not a crash. The model doesn’t change; its fit to the world does.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt: "Why does a one-off test miss drift?",
            choices: [
              { id: "a", label: "Drift is gradual — only a trend over time reveals it" },
              { id: "b", label: "Tests are always wrong" },
              { id: "c", label: "Drift doesn’t affect quality" },
            ],
            answer: "a",
            explanation:
              "A single test is a snapshot. Drift only shows up as a slope when you compare snapshots across weeks.",
          },
          {
            id: "q3",
            kind: "mcq",
            prompt: "The lesson compares drift to…",
            choices: [
              { id: "a", label: "Milk slowly turning sour" },
              { id: "b", label: "A car crashing into a wall" },
              { id: "c", label: "A vending machine" },
            ],
            answer: "a",
            explanation:
              "Both go bad gradually and silently — no single breakage, just a slow slide you only notice by checking over time.",
          },
        ],
        application: {
          title: "What would drift look like for you?",
          prompt:
            "Imagine an AI that recommends what to buy. Over a year, what could change in the world or in shoppers’ behaviour that would slowly make its recommendations worse — even though nothing inside the AI itself broke?",
        },
      },
      {
        slug: "alerts-knowing-when-to-act",
        title: "Alerts: knowing when to act",
        blurb: "A smoke alarm for your AI — and the art of setting it right.",
        topic: "observability-action",
        skillIds: ["alerting"],
        capability: "Explain the alert-threshold trade-off between false alarms and missed problems.",
        minutes: 6,
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the visual: your smoke alarm beeps every time you make toast. What tends to happen?",
          choices: [
            { id: "a", label: "You trust it more" },
            { id: "b", label: "You start ignoring it — and might miss a real fire" },
            { id: "c", label: "It gets louder" },
          ],
          answer: "b",
          explanation:
            "Too many false alarms train you to ignore the alarm — so when a real fire starts, you don’t react. The same applies to AI alerts.",
        },
        prose: [
          "An alert is a rule with a threshold: ‘if the error rate goes above this number, wake me up’. It’s a smoke alarm for your AI.",
          "The hard part is where you set the threshold. Too low and it fires at every wobble — you stop trusting it, and when a real fire starts you ignore it. Too high and it never fires at all, and a real problem burns quietly.",
          "There’s no perfect setting, only a trade-off. The art is tuning it so you catch the real problems without crying wolf. Try dragging the threshold above and watch the two counters change.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt: "What is an alert, in plain terms?",
            choices: [
              { id: "a", label: "A rule that wakes you up when a metric crosses a threshold" },
              { id: "b", label: "A type of log file" },
              { id: "c", label: "A new AI model" },
            ],
            answer: "a",
            explanation:
              "An alert is a threshold-based rule that turns a number into a notification. It’s not a record and not a model.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt: "Set the threshold too LOW and you get…",
            choices: [
              { id: "a", label: "Too many false alarms (you start ignoring it)" },
              { id: "b", label: "No alerts at all" },
              { id: "c", label: "Faster answers" },
            ],
            answer: "a",
            explanation:
              "A low threshold fires on normal noise. Cry wolf often enough and people stop trusting the alert.",
          },
          {
            id: "q3",
            kind: "mcq",
            prompt: "Set the threshold too HIGH and you get…",
            choices: [
              { id: "a", label: "Missed real problems" },
              { id: "b", label: "More false alarms" },
              { id: "c", label: "Lower costs" },
            ],
            answer: "a",
            explanation:
              "A high threshold rarely fires, so genuine problems slip past unnoticed. That’s the silent failure the alert was meant to catch.",
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
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the visual: a dashboard shows 40 tiny numbers. Is that a good dashboard?",
          choices: [
            { id: "a", label: "Yes — more data is always better" },
            { id: "b", label: "No — you can’t read it at a glance" },
            { id: "c", label: "Only if the numbers are colourful" },
          ],
          answer: "b",
          explanation:
            "A dashboard you have to study isn’t doing its job. Glancability — readable in one look — is the whole point.",
        },
        prose: [
          "A dashboard is the one screen you glance at to know if a system is healthy — like the cockpit of a plane. You shouldn’t have to study it; one look should tell you ‘fine’ or ‘something’s wrong’.",
          "The common mistake is to cram everything in. A dashboard with forty tiny readings is unreadable — a glance tells you nothing, so you eventually stop looking.",
          "A good dashboard shows only the few numbers that matter, big and clear, with the bad ones obvious. Less, but louder. That’s what makes one glance enough.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt: "What’s the main job of a dashboard?",
            choices: [
              { id: "a", label: "To tell you at a glance if the system is healthy" },
              { id: "b", label: "To show every possible number" },
              { id: "c", label: "To replace logs entirely" },
            ],
            answer: "a",
            explanation:
              "Glancability is the job. Logs and traces hold the detail; the dashboard holds the at-a-glance summary.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt: "Why is a dashboard with 40 tiny numbers a problem?",
            choices: [
              { id: "a", label: "You can’t read it at a glance, so you stop trusting it" },
              { id: "b", label: "It uses too much computer memory" },
              { id: "c", label: "It’s too colourful" },
            ],
            answer: "a",
            explanation:
              "The failure is human, not technical: unreadable dashboards get ignored, defeating their purpose.",
          },
          {
            id: "q3",
            kind: "mcq",
            prompt: "A good dashboard shows…",
            choices: [
              { id: "a", label: "The few numbers that matter, big and clear" },
              { id: "b", label: "Absolutely everything, just in case" },
              { id: "c", label: "Only the happy metrics that look good" },
            ],
            answer: "a",
            explanation:
              "Less, but louder. Hiding bad metrics or showing everything both destroy the at-a-glance signal.",
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
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the visual: your AI feature is popular but you’re losing money on it. Which ‘bill’ is most likely the culprit?",
          choices: [
            { id: "a", label: "Latency" },
            { id: "b", label: "Cost (tokens)" },
            { id: "c", label: "The CEO’s salary" },
            ],
          answer: "b",
          explanation:
            "If usage is high and margins are negative, token cost is the usual suspect — every call spends money.",
        },
        prose: [
          "Every AI feature pays two bills: cost — the tokens it reads and writes, like distance in a taxi — and latency — the time it takes to answer, like minutes on the road.",
          "The two tend to travel together. A bigger, more capable answer usually costs more and takes longer; a smaller one is cheaper and faster but less capable.",
          "Both are business problems, not just technical ones. Cost eats your profit margin — an unwatched, chatty feature can wipe it out. Latency loses users — people quietly abandon slow apps. Watching both is part of shipping AI responsibly.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt: "What are the ‘two bills’ every AI feature pays?",
            choices: [
              { id: "a", label: "Cost (tokens) and latency (time)" },
              { id: "b", label: "Rent and electricity" },
              { id: "c", label: "Salary and coffee" },
            ],
            answer: "a",
            explanation:
              "Tokens and time are the two resources every AI call consumes and that observability tracks.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt: "When you make a call bigger and more capable, what usually happens to cost and latency?",
            choices: [
              { id: "a", label: "Both rise" },
              { id: "b", label: "Both fall" },
              { id: "c", label: "One rises and one falls" },
            ],
            answer: "a",
            explanation:
              "More tokens means more spend AND more time. They usually move together, which is why both need watching.",
          },
          {
            id: "q3",
            kind: "mcq",
            prompt: "Why does latency matter to a business?",
            choices: [
              { id: "a", label: "Slow apps lose users" },
              { id: "b", label: "Latency reduces the electricity bill" },
              { id: "c", label: "Latency improves answer accuracy" },
            ],
            answer: "a",
            explanation:
              "Real users abandon slow experiences. Latency is a retention problem dressed up as a technical one.",
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
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the visual: you want to watch your AI’s logs, metrics, and traces. What’s the practical first move?",
          choices: [
            { id: "a", label: "Build all the instruments yourself from scratch" },
            { id: "b", label: "Bolt on an existing tool that collects them for you" },
            { id: "c", label: "Give up and hope for the best" },
          ],
          answer: "b",
          explanation:
            "Building instruments from scratch wastes time. A ready-made tool collects the same signals so you can focus on reading them.",
        },
        prose: [
          "You don’t build observability from scratch. Just like you’d wear a fitness tracker rather than build your own heart-rate monitor, you bolt on a tool that collects the logs, metrics, and traces for you.",
          "There’s a healthy menu to choose from. Some tools focus on AI and LLMs — tracing calls and evaluating answers. Others are general-purpose, handling metrics, logs, and alerts for any software, AI included.",
          "Don’t try to memorise the names. The point is simpler: whatever signal you need to watch, a tool already exists to collect it. Pick one that fits what you’re building and start there.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt: "What’s the practical way to get observability?",
            choices: [
              { id: "a", label: "Bolt on an existing tool that collects the signals" },
              { id: "b", label: "Build every instrument from scratch" },
              { id: "c", label: "Avoid monitoring entirely" },
            ],
            answer: "a",
            explanation:
              "Mature tools let you focus on reading the signals instead of building the instruments — so you spend time on diagnosis, not construction.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt: "Some tools focus on AI/LLMs. What do they typically do?",
            choices: [
              { id: "a", label: "Trace calls and evaluate answers" },
              { id: "b", label: "Print documents" },
              { id: "c", label: "Send marketing emails" },
            ],
            answer: "a",
            explanation:
              "LLM-focused tools specialise in tracing requests and judging answer quality — the two things generic tools do less well.",
          },
          {
            id: "q3",
            kind: "mcq",
            prompt: "What’s the recommended way to start?",
            choices: [
              { id: "a", label: "Pick one tool that fits and start simple" },
              { id: "b", label: "Install all of them at once" },
              { id: "c", label: "Wait until something breaks" },
            ],
            answer: "a",
            explanation:
              "Start with one tool, learn what its signals mean, then expand. Installing everything at once is overwhelming; waiting until a break is too late.",
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
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the visual: an AI feature starts returning worse answers weeks after launch. What’s the right first move?",
          choices: [
            { id: "a", label: "Panic and rewrite everything" },
            { id: "b", label: "Follow the signals — check the dashboard, read the alert, open a trace" },
            { id: "c", label: "Ignore it and hope it recovers" },
          ],
          answer: "b",
          explanation:
            "The signals tell you what’s wrong and where. Rewriting blindly wastes effort; ignoring it lets a quiet problem grow.",
        },
        prose: [
          "Here’s the whole course in one story. A team ships an AI feature. From day one, logs, metrics, and traces flow quietly into a dashboard that reads healthy.",
          "Weeks later, an alert fires — the error rate has crept past its threshold. Nothing crashed; the dashboard caught a quiet problem before users complained.",
          "The team opens a trace for a failing request and pinpoints the slow step. The logs reveal why: a knowledge source the AI depended on quietly changed. They fix the cause and watch the metric recover.",
          "That’s the loop: keep watching, let alerts catch quiet problems, trace and log to find the cause, fix, and repeat. Every tool in this course is just a role in that loop.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt: "What kicks off the investigation in the story?",
            choices: [
              { id: "a", label: "An alert fires when the error rate crosses the threshold" },
              { id: "b", label: "The app crashes loudly" },
              { id: "c", label: "A user emails the CEO" },
            ],
            answer: "a",
            explanation:
              "The alert — fed by a metric crossing a threshold — is what turns a quiet problem into an investigated one.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt: "Which two signals help find the cause?",
            choices: [
              { id: "a", label: "A trace (to find the step) and logs (to see why)" },
              { id: "b", label: "A bigger server and a louder alarm" },
              { id: "c", label: "A new logo and a catchier slogan" },
            ],
            answer: "a",
            explanation:
              "The trace localises the failure to a step; the logs explain what that step actually did wrong. Together they point at the cause.",
          },
          {
            id: "q3",
            kind: "mcq",
            prompt: "The lesson describes observability as…",
            choices: [
              { id: "a", label: "A loop: watch → alert → trace → log → fix" },
              { id: "b", label: "A one-time setup you can forget about" },
              { id: "c", label: "A single magic tool" },
            ],
            answer: "a",
            explanation:
              "It’s a continuous loop, not a setup-and-forget step. Each fix feeds back into watching — that’s what keeps an AI healthy.",
          },
        ],
        application: {
          title: "Design your own loop",
          prompt:
            "Pick an AI feature you use or can imagine (a chatbot, a recommender, a summariser). Walk through one full loop in 3–4 sentences: which single metric would you watch on the dashboard, what threshold would trigger an alert, and which trace step or log entry would you inspect first if the alert fired?",
        },
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
