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

export type Course = {
  /** URL segment under `/courses/`. */
  slug: string;
  title: string;
  subtitle: string;
  /** Optional longer description for the course landing page. */
  description?: string;
  lessons: Lesson[];
};

export const COURSES: readonly Course[] = [
  {
    slug: "machine-learning",
    title: "AI Foundations: Core Concepts",
    subtitle: "AI, machine learning, and deep learning — connected clearly.",
    description:
      "A visual path through the concepts every AI learner needs. Each lesson combines an infographic, a concise explanation, an active check, and saved progress.",
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
    title: "AI Foundations: Visual Start",
    subtitle:
      "Start with pictures and everyday decisions — no maths or jargon required.",
    description:
      "A picture-led path through what learning and machine learning actually mean. Every lesson ends with one small active check so the idea becomes more than something you scrolled past.",
    lessons: [
      {
        slug: "how-humans-learn",
        title: "How a human learns",
        blurb: "A child, a car, and a bike — the original learning machine.",
        topic: "layman-foundations",
        skillIds: ["ai-literacy"],
        capability: "Explain learning as using experience to improve a future decision.",
        minutes: 3,
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
