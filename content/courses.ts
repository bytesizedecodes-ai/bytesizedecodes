/**
 * Course registry — the single source of truth for what's in each course.
 *
 * A `Lesson` points at an infographic component (registered in
 * `components/infographic/index.tsx`) AND carries the "byte" payload that turns
 * a static visual into a Hook-loop unit: prose, an optional runnable code
 * exercise, and self-check questions that gate completion and award XP.
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
export type CourseDomain = "Machine Learning" | "Cybersecurity" | "Artificial Intelligence";

/** Ordered list of levels, for filter UIs. */
export const COURSE_LEVELS: readonly CourseLevel[] = ["beginner", "intermediate", "expert"];

/** Ordered list of domains, for filter UIs. */
export const COURSE_DOMAINS: readonly CourseDomain[] = [
  "Machine Learning",
  "Cybersecurity",
  "Artificial Intelligence",
];

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
