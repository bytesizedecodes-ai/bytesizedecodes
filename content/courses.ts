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
        minutes: 5,
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
        prose: [
          "These three terms are constantly confused, but they're just nested circles. AI is the largest; machine learning is a part of AI; deep learning is a part of machine learning.",
          "Artificial Intelligence is the goal: build machines that can act intelligently. Machine learning is one way to pursue that goal — let the system learn from data. Deep learning is one specific technique within ML — use many-layered neural networks.",
          "Not all AI is machine learning (rule-based expert systems are AI but don't learn). Not all ML is deep learning (random forests and logistic regression are ML but not deep). But all deep learning is ML, and all ML is AI.",
          "That's the primer done. Each idea here has a picture-led deep dive in Machine Learning for Layman — features, classifiers, train/test splits, overfitting — if you want to actually build the intuition rather than just map it.",
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
        prose: [
          "Watch a child meet a bike for the first time. Nobody hands them a rulebook with ‘two wheels, pedals, a handlebar’. They just see a few examples — and the next time a bike rolls past, they name it.",
          "That is learning in its rawest form: experience changes how you respond next time. Not memorising instructions — updating yourself from examples.",
          "Keep that picture. Every machine-learning idea in this course is an attempt to copy it: give a system examples, and let experience improve its next decision.",
        ],
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
        application: {
          title: "Catch yourself learning",
          prompt:
            "Think of one thing you learned without being taught step-by-step — riding a bike, spotting a friend in a crowd, guessing a song from two notes. Write one sentence: what were the ‘examples’, and what decision improved because of them?",
        },
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
          "Traditional software is a very fast clerk. A programmer writes every rule in advance: if this, then that. The clerk never learns, never adapts — it just executes, perfectly and blindly.",
          "That’s fine for calculators and timers. But try writing, by hand, the rule for ‘what makes this a car’. Every rule you write, a weird exception breaks — a three-wheeled car, a motorcycle with a roof.",
          "So the trick machines were missing wasn’t speed. It was the child’s trick: learning the rule from examples instead of being given it. That hand-off — from hand-written rules to learned rules — is what makes machine learning different from ordinary programming.",
        ],
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the picture: a spam filter gets better every time users mark a message as junk. Is it following fixed instructions?",
          choices: [
            { id: "a", label: "Yes — someone wrote the exact rule for every future email" },
            { id: "b", label: "No — it’s updating itself from the examples users give it" },
            { id: "c", label: "Yes — spam filters are just keyword checklists" },
          ],
          answer: "b",
          explanation:
            "A filter that improves from marked messages is adapting from examples — the machine-learning shape, not the fixed-instruction shape.",
        },
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
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Why is it so hard to hand-write a rule for recognising cars?",
            choices: [
              { id: "a", label: "Cars are too fast to recognise" },
              { id: "b", label: "Every hand-written rule has exceptions that break it" },
              { id: "c", label: "Computers are not allowed to look at cars" },
            ],
            answer: "b",
            explanation:
              "Real categories are messy — three wheels, roofs on bikes, open trucks. Fixed rules shatter on the exceptions; learning from examples bends around them.",
          },
        ],
        application: {
          title: "Sort your software",
          prompt:
            "List three apps you used today. For each, decide: fixed instructions (calculator-like) or adapting from examples (learning)? What ‘examples’ would the adapting ones be learning from?",
        },
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
          "Here is the whole deal in one sentence: machine learning is giving a machine examples instead of rules, and letting it find the pattern itself.",
          "You still do important work — choosing the examples, and checking what it learns. But the detailed pattern-hunting is done by the algorithm, not written by hand.",
          "This flip explains everything that follows. A ‘model’ is just the pattern it found, stored in a form that can make new decisions.",
        ],
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
          {
            id: "q2",
            kind: "mcq",
            prompt: "In this course, a ‘model’ is best thought of as:",
            choices: [
              { id: "a", label: "A person who decides what the machine should learn" },
              { id: "b", label: "The pattern the machine found, stored so it can make new decisions" },
              { id: "c", label: "A copy of the examples it was shown" },
            ],
            answer: "b",
            explanation:
              "A model isn’t the data and isn’t a person — it’s the distilled pattern, ready to use on new, unseen cases.",
          },
        ],
        application: {
          title: "Spot the hand-off",
          prompt:
            "Pick one prediction a product makes about you (a recommendation, a label, a price). Write down: what examples could it have learned that pattern from — and what pattern it might have found?",
        },
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
          "Machine learning comes in three big families, and the difference is simply: what kind of experience does the machine learn from?",
          "Supervised learning: examples with answers attached — ‘this is a car, this is a bike’. Unsupervised: examples with no answers, and the machine groups them itself. Reinforcement: no answers, just rewards and penalties after each action.",
          "Most of this course lives in the supervised family, because it’s the one behind everyday classification. But knowing all three lets you name the right tool when you meet a new problem.",
        ],
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
        application: {
          title: "Name the family",
          prompt:
            "For each of these, say which family fits and why: (1) predicting house prices from past sales, (2) a video-game opponent that improves by winning or losing, (3) sorting your photos into similar-looking groups.",
        },
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
          "Supervised learning always has the same skeleton: examples plus the right answers, fed to an algorithm that learns the mapping from one to the other.",
          "The examples are called samples; the answers are labels. ‘This photo (sample) → car (label)’, a thousand times over.",
          "The learned mapping answers one of two kinds of question. If the answer is a category — car or bike, spam or not — it’s classification. If the answer is a number — a price, an age, a duration — it’s regression. Same skeleton, different output shape.",
        ],
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the picture: an app estimates a delivery time in minutes from past deliveries. Category or number?",
          choices: [
            { id: "a", label: "Category — it sorts deliveries into types" },
            { id: "b", label: "Number — the answer is a quantity, so it’s regression" },
            { id: "c", label: "Neither — delivery times can’t be predicted" },
          ],
          answer: "b",
          explanation:
            "Whenever the label is a measured quantity — minutes, rupees, kilograms — you’re in regression territory.",
        },
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
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Which dataset could train a supervised classifier for ‘spam vs. not spam’?",
            choices: [
              { id: "a", label: "A pile of emails, each already marked spam or not spam" },
              { id: "b", label: "A pile of emails with no markings at all" },
              { id: "c", label: "A rule that deletes anything containing the word ‘offer’" },
            ],
            answer: "a",
            explanation:
              "Supervised needs labels attached to samples. Unmarked emails would be unsupervised territory; a fixed keyword rule is ordinary programming.",
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
        prose: [
          "Take the labels away and something interesting happens: the machine stops predicting answers and starts describing structure.",
          "Given only samples, unsupervised algorithms find groups (clustering), or unusual outliers, or the few directions in which the data actually varies. Nobody told it what the groups are — it finds them.",
          "The catch: the machine can name the groups it finds, but it can’t tell you what the groups mean. ‘Cluster 1 behaves like this’ — a human still has to look and say ‘ah, these are the weekend shoppers’.",
        ],
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the picture: you feed a music app your listening history with no labels at all. Could it still discover that your songs fall into distinct ‘moods’?",
          choices: [
            { id: "a", label: "No — without labels there is nothing to learn" },
            { id: "b", label: "Yes — it can find groups on its own, though it won’t know what to call them" },
            { id: "c", label: "Only if someone names each mood first" },
          ],
          answer: "b",
          explanation:
            "Finding structure in unlabelled data is exactly what unsupervised learning does — meaning the names, though, stays a human job.",
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
        prose: [
          "Reinforcement learning is learning by doing. No labelled examples, no teacher — just an agent taking actions, and the world answering with reward or penalty.",
          "Over many attempts, the agent learns a strategy: which actions, in which situations, earn the most reward. It’s how machines learned to play chess and video games beyond human level.",
          "The trap: the agent optimises exactly what you reward — not what you meant. Reward it for ‘staying upright’ and it may learn to stand perfectly still forever. Designing the reward is the hard, human part.",
        ],
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the picture: you reward a cleaning robot for ‘collecting dust’. What’s the risk?",
          choices: [
            { id: "a", label: "No risk — it will clean perfectly" },
            { id: "b", label: "It may find a loophole — like knocking the dustbin over to ‘collect’ more dust" },
            { id: "c", label: "It will refuse to move without labels" },
          ],
          answer: "b",
          explanation:
            "Agents optimise the reward you actually gave, not the one you meant — a famous failure mode of reinforcement learning.",
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
        application: {
          title: "Build a vector for something you know",
          prompt:
            "Pick two things you can tell apart instantly (two fruits, two apps, two pets). Write 3 features that would separate them well — and 1 feature that would be useless. That’s feature thinking.",
        },
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
        application: {
          title: "Count your own classifier",
          prompt:
            "Think of a quick judgement you make (‘will I need an umbrella?’, ‘is this email worth opening?’). What two or three things do you unconsciously count or notice? Write them as features — you’ve been running a classifier in your head.",
        },
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
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the picture: wheel count leaves you unsure about a three-wheeler. What helps most — more of the same measurement, or a different one?",
          choices: [
            { id: "a", label: "A different, helpful feature — like height or weight" },
            { id: "b", label: "Measuring the wheels again, more precisely" },
            { id: "c", label: "Nothing — three-wheelers are unclassifiable" },
            ],
          answer: "a",
          explanation:
            "Re-measuring the same feature adds no new information. A second informative feature gives the model a new angle on the problem.",
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
              "Which pair of features would best separate ‘car’ from ‘bike’?",
            choices: [
              { id: "a", label: "Paint colour and license-plate colour" },
              { id: "b", label: "Wheel count and vehicle height" },
              { id: "c", label: "Wheel count and number of round things on the vehicle" },
            ],
            answer: "b",
            explanation:
              "Good features add genuinely different information. Colour is noise, and ‘round things’ mostly repeats wheel count — it doesn’t add a new angle.",
          },
        ],
        application: {
          title: "Design your second question",
          prompt:
            "Imagine a one-question quiz leaves you 50/50 about something (a dish, a song, a message). What second question would settle it? You just designed a second feature.",
        },
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
        application: {
          title: "Decide like kNN",
          prompt:
            "Next time you’re unsure about something new — a restaurant, a message, a route — ask: ‘what are the five most similar cases I know, and how did they turn out?’ That majority vote is you running kNN by hand.",
        },
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
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the picture: instead of checking every past example, you describe a ‘typical car’ and a ‘typical bike’ and compare new things to those two. What do you trade away?",
          choices: [
            { id: "a", label: "Speed — it becomes slower" },
            { id: "b", label: "Detail — an average can miss unusual members of a class" },
            { id: "c", label: "Nothing — it’s identical to checking every example" },
          ],
          answer: "b",
          explanation:
            "One average per class is fast, but unusual samples — a cargo trike, a tiny car — sit far from any centre and can get misjudged.",
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
        application: {
          title: "Meet the averages",
          prompt:
            "Picture the ‘average’ member of two groups you know — two cuisines, two genres, two sports teams. When would judging a new case by nearest-average fail? Name one example that sits far from both averages.",
        },
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
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the picture: you want one question about the weather that best decides ‘play tennis or not’. Is ‘is it windy?’ guaranteed to be the best first question?",
          choices: [
            { id: "a", label: "Yes — windiness always matters most" },
            { id: "b", label: "No — the best question depends on what your data actually shows" },
            { id: "c", label: "It doesn’t matter which question comes first" },
          ],
          answer: "b",
          explanation:
            "The best first question is the one your data answers most cleanly — and that can change from dataset to dataset.",
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
              "Why is a decision tree considered more ‘explainable’ than kNN?",
            choices: [
              { id: "a", label: "It is always more accurate than kNN" },
              { id: "b", label: "You can read the exact if/then path that produced any prediction" },
              { id: "c", label: "It uses fewer features automatically" },
            ],
            answer: "b",
            explanation:
              "A tree is its own explanation: follow the branches and you see the reasoning. kNN’s reasoning is ‘these neighbours voted’, which is harder to inspect.",
          },
        ],
        application: {
          title: "Write your own tree",
          prompt:
            "Take a decision you make often (what to cook, which route to take). Write it as 2-3 if/then questions with outcomes at the leaves. Congratulations — that’s a hand-drawn decision tree.",
        },
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
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the picture: split A sorts your samples so the left side is all cars and the right side is all bikes. Split B leaves both sides half-and-half. Which question was more useful?",
          choices: [
            { id: "a", label: "Split A — each side is now decided" },
            { id: "b", label: "Split B — mixing means more information" },
            { id: "c", label: "They’re equally useful" },
          ],
          answer: "a",
          explanation:
            "A split that untangles the classes did real work; a split that leaves both sides jumbled told you nothing.",
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
        application: {
          title: "Play the purity game",
          prompt:
            "Think of a group you could split two ways (your contacts, your emails, a playlist). Find a question where each side becomes ‘mostly one kind’ — then find a question where both sides stay mixed. That contrast is information gain, felt.",
        },
      },
      {
        slug: "train-test-split",
        title: "Don't grade on what you studied",
        blurb: "Split your data — train on one part, test on a part it's never seen.",
        topic: "layman-evaluation",
        skillIds: ["train-test-split", "classification-basics"],
        capability: "Explain why a model must be evaluated on data it was not trained on.",
        minutes: 4,
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the picture: a student aces the exact practice paper they revised. Does that prove they understood the subject?",
          choices: [
            { id: "a", label: "Yes — a high score is a high score" },
            { id: "b", label: "No — they may have memorised that paper; a fresh paper is the honest test" },
            { id: "c", label: "Only if they revised quickly" },
          ],
          answer: "b",
          explanation:
            "Grading on the studied material measures memory, not understanding. Models face exactly the same trap — as the picture ahead shows.",
        },
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
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Why must the test set stay sealed until the very end?",
            choices: [
              { id: "a", label: "To save computing power" },
              { id: "b", label: "Because every time you tweak the model to improve its test score, the test quietly becomes training data" },
              { id: "c", label: "Because untested data is safer to store" },
            ],
            answer: "b",
            explanation:
              "Peeking and adjusting turns the exam into study material — the score stops predicting real-world behaviour. This is why serious teams keep a final holdout.",
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
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the picture: two students score identically on the practice exam. One memorised every answer, one understood the ideas. On the real exam with fresh questions, what happens?",
          choices: [
            { id: "a", label: "Both score the same — preparation is preparation" },
            { id: "b", label: "The memoriser drops sharply; the understander holds steady" },
            { id: "c", label: "The memoriser scores higher — memory beats thinking" },
          ],
          answer: "b",
          explanation:
            "Fresh questions expose the difference between memorising and understanding. Models can fail this exact same way — it’s called overfitting.",
        },
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
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the picture: a chef who has only ever tasted sweet food is asked to judge a savoury dish. What’s the risk?",
          choices: [
            { id: "a", label: "None — judging is judging" },
            { id: "b", label: "Their limited experience skews the judgement itself" },
            { id: "c", label: "They’ll refuse to judge at all" },
          ],
          answer: "b",
          explanation:
            "Experience defines the range of good judgement — for chefs and for models. A model trained on a narrow slice of the world judges the whole world through that slice.",
        },
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
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the picture: how many times did machine learning touch your day already — zero, a handful, or dozens?",
          choices: [
            { id: "a", label: "Zero — I don’t work with AI" },
            { id: "b", label: "A handful of obvious ones, like chatbots" },
            { id: "c", label: "Dozens — most of them invisible" },
          ],
          answer: "c",
          explanation:
            "Spam filters, keyboards, maps, recommendations, face unlock — ML is woven into ordinary apps. The picture ahead makes the invisible ones visible.",
        },
        prose: [
          "You’ve used machine learning a dozen times today already. Spam filters deciding what reaches your inbox. Keyboards guessing your next word. Face unlock recognising you in bad light.",
          "Each one is the same skeleton you now know: samples in, a learned pattern out, predictions on new cases. A spam filter read millions of marked emails; your keyboard watched which words follow yours.",
          "Once you see the skeleton, ‘AI magic’ turns into something you can question: what were the examples? What is it predicting? What happens when it’s wrong?",
        ],
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
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the picture: when an AI gives a wrong answer, does it usually sound unsure?",
          choices: [
            { id: "a", label: "Yes — wrong answers come with hedging" },
            { id: "b", label: "No — wrong answers sound exactly as confident as right ones" },
            { id: "c", label: "It refuses to answer when unsure" },
          ],
          answer: "b",
          explanation:
            "That’s the dangerous property: a model’s tone carries no knowledge of its own accuracy. Confidently wrong is the normal failure mode, not the exception.",
        },
        prose: [
          "Machine learning fails differently from ordinary software. A calculator breaks loudly — error, crash, blank screen. A model fails quietly: it always produces an answer, in the same confident tone, whether it knows or not.",
          "The failures come from the three things you’ve met: training gaps (it never saw a case like this), overfitting (it memorised quirks), and bad data (it learned a skewed world).",
          "The safeguard isn’t ‘trust it more’ or ‘trust it less’ — it’s knowing which questions to ask: what were the examples, how was it tested, and what happens when it’s wrong? Those questions are exactly what the next course, AI Observability, teaches you to ask daily.",
        ],
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
        application: {
          title: "Find your hidden state",
          prompt:
            "Name one machine-made answer you saw today (a recommendation, an auto-reply, a route). Write down one question about it you can’t answer from the outside looking in — that unknown is its hidden state.",
        },
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
              { id: "a", label: "A vending machine — same input, same output, forever" },
              { id: "b", label: "A chef — the same dish varies with the day and the ingredients" },
              { id: "c", label: "Neither — machines and cooks are both perfectly consistent" },
            ],
            answer: "b",
            explanation:
              "A chef varies dish-to-dish, just as an AI varies answer-to-answer. A vending machine is fixed.",
          },
        ],
        application: {
          title: "Sort your day’s software",
          prompt:
            "List three systems you interacted with today. For each, one sentence: fixed output every time (vending machine) or varying output from the same input (chef)? Your instinct for this split is the foundation of watching AI.",
        },
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
        application: {
          title: "Write your first log line",
          prompt:
            "Imagine an AI feature you use kept a diary. Write the one log line you’d most want it to record for each answer — what was asked (safely), and a trace of where the answer came from.",
        },
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
        application: {
          title: "Trace a request you know",
          prompt:
            "Think of one app request you make daily (a search, a payment, a message). Sketch its journey in 3-4 steps — what would you check first if it suddenly became slow? That instinct is tracing.",
        },
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
        application: {
          title: "Design your spot-check",
          prompt:
            "Pick an AI answer you received this week. Write a two-line rubric you’d use to judge it (e.g. ‘every claim traceable to a source; no invented details’) — then apply it. Would it pass?",
        },
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
        application: {
          title: "Catch a confident lie",
          prompt:
            "Next time an AI gives you a factual claim, pick one detail and verify it in ten seconds. Confident-but-wrong is common enough that one spot-check a day builds the right reflex.",
        },
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
        application: {
          title: "Audit your own alerts",
          prompt:
            "Look at the notifications on your phone right now. Which ones would you mute (low signal), and which one do you actually need the moment it fires? That’s threshold tuning, on yourself.",
        },
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
        application: {
          title: "Design your three tiles",
          prompt:
            "Imagine you own an AI feature. Pick the three — and only three — readings that would tell you at a glance whether it’s healthy today. Why those three, and what would each bad reading make you do?",
        },
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
        application: {
          title: "Feel your latency budget",
          prompt:
            "Time one AI interaction you have daily, in seconds. Write down: at what duration would you stop using it? That number is the product’s latency budget — most users have one, most teams never ask.",
        },
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
        application: {
          title: "Pick your first tool",
          prompt:
            "Choose one AI tool you use weekly. Find out — in two minutes of searching — whether it keeps any history or logs you can inspect. Knowing where the record lives is step zero of observability.",
        },
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
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the visual: which step usually dominates an LLM request's wall-clock time?",
          choices: [
            { id: "a", label: "Retrieving documents" },
            { id: "b", label: "The LLM generating tokens" },
            { id: "c", label: "Sending the JSON response" },
            { id: "d", label: "Parsing the user's prompt" },
          ],
          answer: "b",
          explanation:
            "Token-by-token generation is almost always the longest step. Retrieval and networking matter, but the model's decode loop owns most of the latency.",
        },
        prose: [
          "A trace is a single request broken into spans. Each span is one unit of work — a retrieval, an LLM call, a tool invocation — with a start, an end, and a set of attributes that describe what happened. Spans nest: a root span for the whole request parents child spans for each step, so you can reconstruct the entire turn.",
          "The glue is a correlation ID carried on the root span and inherited by every child. That ID is what lets you go from a slow user turn to the exact retrieval, model call, and tool interaction that composed it — across services, without guessing.",
          "Without a trace you have only averages: 'latency is high'. With one, you have a story: the retrieval was fine, the model took 860ms, and a tool call stalled for 110ms. Diagnosis replaces guesswork.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt: "What links child spans back to the single user request they belong to?",
            choices: [
              { id: "a", label: "The model id" },
              { id: "b", label: "A correlation ID on the root span" },
              { id: "c", label: "The user's email address" },
              { id: "d", label: "The response status code" },
            ],
            answer: "b",
            explanation:
              "The correlation ID propagates from root to children, tying every span of one turn together across services.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt: "Why is 'average latency is high' a weaker signal than a trace?",
            choices: [
              { id: "a", label: "Averages are always wrong" },
              { id: "b", label: "It hides which step (retrieval, model, tool) caused it" },
              { id: "c", label: "Traces are cheaper to store than averages" },
              { id: "d", label: "Averages can't be measured for LLMs" },
            ],
            answer: "b",
            explanation:
              "An average tells you something is slow; a trace tells you what. You can't fix what you can't attribute.",
          },
          {
            id: "q3",
            kind: "mcq",
            prompt: "A tool call that errors is most likely to be misdiagnosed as what, without tracing?",
            choices: [
              { id: "a", label: "A retrieval problem" },
              { id: "b", label: "A model problem" },
              { id: "c", label: "A network problem" },
              { id: "d", label: "A billing problem" },
            ],
            answer: "b",
            explanation:
              "If the tool's failure isn't a span of its own, the model gets blamed for a bad answer it couldn't help producing.",
          },
        ],
        application: {
          title: "Map the spans of a feature you know",
          prompt:
            "Pick an LLM feature you use or build. List the spans one user turn would contain (e.g. retrieval, model, tool), and name the one attribute per span you'd most want when debugging a slow answer.",
        },
      },
      {
        slug: "instrument-right-context",
        title: "Instrument the right context",
        blurb: "The few span attributes that explain a change — and the ones that leak.",
        topic: "tracing-foundations",
        skillIds: ["llm-instrumentation", "telemetry-privacy"],
        capability: "Choose span attributes that aid debugging without leaking PII or adding noise.",
        minutes: 9,
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the visual: which field is dangerous to log on every span, in full?",
          choices: [
            { id: "a", label: "model id" },
            { id: "b", label: "prompt version" },
            { id: "c", label: "raw prompt text" },
            { id: "d", label: "tool name" },
          ],
          answer: "c",
          explanation:
            "Raw prompts carry PII and secrets. Instrument the version tag instead, and sample or redact the raw text.",
        },
        prose: [
          "Good instrumentation is a small set of high-value dimensions: the model, the prompt version, the retrieval version, and any tool name. These are the variables that change between releases, so tagging every span with them turns 'something regressed' into 'it regressed when prompt v17 shipped'.",
          "Two failure modes are equally common. The first is over-collection: logging raw prompts and user emails wholesale, which turns your telemetry store into a breach surface. The second is high-cardinality noise: a unique attribute per request (a raw timestamp, a full session id) that explodes index sizes without aiding any query.",
          "The rule: capture the dimensions that explain a change, redact or sample everything that identifies a person, and leave out anything that's unique per request. A clean contract is small, private, and diagnostic.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt: "Why tag every span with a prompt version rather than the raw prompt?",
            choices: [
              { id: "a", label: "Versions are shorter to store" },
              { id: "b", label: "The version explains changes between releases; the raw text leaks PII" },
              { id: "c", label: "Raw prompts can't be parsed" },
              { id: "d", label: "Versions are required by OpenTelemetry" },
            ],
            answer: "b",
            explanation:
              "The version lets you bisect releases; the raw text adds privacy risk without extra debugging value.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt: "A user's email as a span attribute is a problem because it is:",
            choices: [
              { id: "a", label: "Too short" },
              { id: "b", label: "PII and high-cardinality" },
              { id: "c", label: "Not a string" },
              { id: "d", label: "Always identical across requests" },
            ],
            answer: "b",
            explanation:
              "It identifies a person (PII) and is near-unique per user (high cardinality), bloating indexes and creating exposure. Use an opaque tenant id instead.",
          },
          {
            id: "q3",
            kind: "mcq",
            prompt: "Which set is the cleanest span contract for debugging a regression?",
            choices: [
              { id: "a", label: "model, prompt version, retrieval version, tool name" },
              { id: "b", label: "raw prompt, raw answer, user email, IP address" },
              { id: "c", label: "timestamp-to-the-nanosecond, session uuid, request hash" },
              { id: "d", label: "model only" },
            ],
            answer: "a",
            explanation:
              "These four versioned dimensions explain a change, carry no PII, and stay low-cardinality.",
          },
        ],
        application: {
          title: "Audit a telemetry contract",
          prompt:
            "Imagine the five fields your team logs per request. For each, write whether it is useful (a versioned dimension), a privacy risk (PII/secrets), or noise (high-cardinality) — and what you'd change.",
        },
      },
      {
        slug: "logs-without-leaking",
        title: "Logs that help without leaking data",
        blurb: "Redact, minimise, and still debug.",
        topic: "tracing-foundations",
        skillIds: ["telemetry-privacy"],
        capability: "Redact and minimise log content so debugging value survives without PII exposure.",
        minutes: 8,
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the visual: a support user typed their card number into the chat. What should the log line store?",
          choices: [
            { id: "a", label: "The full card number, for debugging" },
            { id: "b", label: "A redacted token like <REDACTED>, plus the model and prompt version" },
            { id: "c", label: "Nothing at all" },
            { id: "d", label: "Only the user's email" },
          ],
          answer: "b",
          explanation:
            "You keep the dimensions that explain behaviour (model, version) and drop the PII. Redaction preserves debuggability without exposure.",
        },
        prose: [
          "Logs are where debugging value and privacy risk collide. The same line that helps you reconstruct a faulty turn can also contain a card number, an email, or a secret the model echoed back. The discipline is to separate the two: keep what explains behaviour, redact what identifies a person.",
          "Minimisation comes before redaction. Ask whether a field needs to be logged at all; if it does, log the least identifying form — a hash of the user id, a token count instead of the raw prompt, a sampled answer rather than every one. Retention and consent then set how long even the redacted data lives.",
          "The practical test is the 'breach' thought experiment: if this log table leaked tomorrow, what could someone learn about a user? Anything that fails that test gets cut, hashed, or sampled before it's written.",
        ],
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
            prompt: "What's the first question to ask before logging a field?",
            choices: [
              { id: "a", label: "Is it a string?" },
              { id: "b", label: "Does it need to be logged at all?" },
              { id: "c", label: "Is it shorter than 80 characters?" },
              { id: "d", label: "Does it contain JSON?" },
            ],
            answer: "b",
            explanation:
              "Minimisation first. If a field isn't needed for debugging or audit, don't log it; redaction is the fallback for what you must keep.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt: "Which is the safest replacement for logging a user's email?",
            choices: [
              { id: "a", label: "The full email, base64-encoded" },
              { id: "b", label: "A hash of the user id, or an opaque tenant id" },
              { id: "c", label: "The email with the domain removed" },
              { id: "d", label: "The email, but only on weekends" },
            ],
            answer: "b",
            explanation:
              "A hash or opaque id preserves cohort slicing without exposing an identity. Encoding or partial masking still leaks.",
          },
          {
            id: "q3",
            kind: "mcq",
            prompt: "The 'breach' thought experiment asks:",
            choices: [
              { id: "a", label: "Will this log make the model smarter?" },
              { id: "b", label: "If this table leaked, what could someone learn about a user?" },
              { id: "c", label: "Is the log JSON-formatted?" },
              { id: "d", label: "Will retention save storage cost?" },
            ],
            answer: "b",
            explanation:
              "Designing for the worst case (the data gets out) is what forces redaction, hashing, and short retention.",
          },
        ],
        application: {
          title: "Rewrite a leaky log line",
          prompt:
            "Take this line — {user, raw_prompt, answer} — and rewrite it as a safe one that still lets an engineer debug a bad answer. Say what you redacted, hashed, or sampled, and why.",
        },
      },
      {
        slug: "latency-cost-broken-down",
        title: "Latency and cost, broken down",
        blurb: "Time-to-first-token vs total time; tokens by stage.",
        topic: "performance-and-slos",
        skillIds: ["llm-cost-latency"],
        capability: "Split latency into TTFT vs total, and cost into tokens by stage.",
        minutes: 8,
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the visual: users say the answer 'takes ages to start'. Which metric is that?",
          choices: [
            { id: "a", label: "Total latency" },
            { id: "b", label: "Time-to-first-token (TTFT)" },
            { id: "c", label: "Tokens per second" },
            { id: "d", label: "Cost per request" },
            ],
          answer: "b",
          explanation:
            "The delay before the first token appears is TTFT — dominated by prompt processing (prefill), not generation.",
        },
        prose: [
          "Latency for an LLM turn has two faces. Time-to-first-token is how long the user waits before anything appears — dominated by prompt processing (prefill) and any blocking retrieval. Total latency adds the generation (decode) phase on top. Users feel TTFT as 'is it working?' and total time as 'is it done?'; they're separate problems with separate fixes.",
          "Cost follows the tokens, not the milliseconds. Input tokens (the prompt and retrieved context) are priced differently from output tokens (the answer), and a long prompt with a short answer can cost more than the reverse. Breaking cost down by stage shows whether your bill is driven by over-retrieval, verbose prompts, or chatty outputs.",
          "Percentiles matter more than averages. A p50 of 980ms with a p99 of 3.4s means most users are fine and a few are abandoned; chasing the average hides the tail. Report p50, p95, and p99 separately, and alert on the percentile that maps to user pain.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt: "A user complains the assistant 'thinks forever before replying'. Which metric is misbehaving?",
            choices: [
              { id: "a", label: "Total latency only" },
              { id: "b", label: "Time-to-first-token" },
              { id: "c", label: "Output tokens per second" },
              { id: "d", label: "Cost per day" },
            ],
            answer: "b",
            explanation:
              "A long pause before the first token is a TTFT problem — look at prefill and blocking retrieval, not decode speed.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt: "Why report p95 and p99 instead of just the average latency?",
            choices: [
              { id: "a", label: "Averages are harder to compute" },
              { id: "b", label: "The average hides the slow tail that real users hit" },
              { id: "c", label: "p95 is always lower than the average" },
              { id: "d", label: "LLMs don't have an average latency" },
            ],
            answer: "b",
            explanation:
              "Averages smooth out the worst experiences. Percentiles expose the tail where users actually abandon you.",
          },
          {
            id: "q3",
            kind: "mcq",
            prompt: "Your token bill is rising but answers aren't getting longer. The likely culprit is:",
            choices: [
              { id: "a", label: "More output tokens" },
              { id: "b", label: "More input tokens — over-retrieval or bloated prompts" },
              { id: "c", label: "Lower model prices" },
              { id: "d", label: "Fewer requests" },
            ],
            answer: "b",
            explanation:
              "Cost tracks tokens. If outputs are stable, the growth is in inputs — retrieved context or prompt templates inflating the prompt.",
          },
        ],
        application: {
          title: "Diagnose a latency complaint",
          prompt:
            "Users say your summariser is 'slow to start but fast once it begins'. Name the stage that's likely slow, the metric you'd check, and one change you'd try first.",
        },
      },
      {
        slug: "ai-service-level-objective",
        title: "Define an AI service level objective",
        blurb: "Turn 'helpful and fast' into a number with an error budget.",
        topic: "performance-and-slos",
        skillIds: ["ai-slo", "llm-evaluation"],
        capability: "Turn a fuzzy quality goal into an SLI, a target, and an error budget.",
        minutes: 9,
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the visual: if your SLO target is 99%, what fraction of answers is allowed to be bad?",
          choices: [
            { id: "a", label: "99%" },
            { id: "b", label: "1%" },
            { id: "c", label: "0%" },
            { id: "d", label: "50%" },
          ],
          answer: "b",
          explanation:
            "The error budget is 100% minus the target — the bad outcomes you explicitly tolerate. A 99% target means a 1% budget.",
        },
        prose: [
          "'Helpful and fast' isn't an objective; it's a wish. An SLO makes it measurable: pick a service-level indicator (say, the share of answers that pass evaluation), set a target (99% over 28 days), and derive the error budget — the 1% of bad outcomes you've decided to tolerate.",
          "The error budget is the decision tool. While you have budget left, you can ship; when it's burning fast, you stop shipping and fix. A loose target (90%) tolerates too much user pain; a tight one (99.9%) burns the budget on noise and pages on-call constantly. The right target is empirical — set by what users actually do, then iterate.",
          "Crucially, the SLI for an AI feature is usually a quality signal, not just latency. You measure not only 'did it respond fast' but 'did it answer well' — which means your SLO depends on the evaluation pipeline feeding it. No eval, no quality SLO.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt: "What is the error budget for a 99.5% SLO target?",
            choices: [
              { id: "a", label: "99.5%" },
              { id: "b", label: "0.5%" },
              { id: "c", label: "5%" },
              { id: "d", label: "0%" },
            ],
            answer: "b",
            explanation:
              "The budget is 100% − target = 0.5%. That's the bad-outcome allowance you've decided to live with.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt: "An AI quality SLO ('answers pass eval ≥ 99%') depends on what else existing first?",
            choices: [
              { id: "a", label: "A faster database" },
              { id: "b", label: "An evaluation pipeline producing the pass/fail signal" },
              { id: "c", label: "A bigger model" },
              { id: "d", label: "More front-end logging" },
            ],
            answer: "b",
            explanation:
              "You can't target a quality SLI you don't measure. The eval pipeline is the prerequisite for a quality SLO.",
          },
          {
            id: "q3",
            kind: "mcq",
            prompt: "Your budget is burning fast after a release. The disciplined response is to:",
            choices: [
              { id: "a", label: "Raise the target to 99.99%" },
              { id: "b", label: "Stop shipping and roll back or fix" },
              { id: "c", label: "Delete the alert" },
              { id: "d", label: "Lower the target to 90%" },
            ],
            answer: "b",
            explanation:
              "Fast burn means users are hitting bad outcomes now. The budget exists to force this decision: freeze releases and remediate.",
          },
        ],
        application: {
          title: "Draft an SLO for a feature",
          prompt:
            "Pick an LLM feature. Write its SLI (the measurable signal), a target you'd defend, the resulting error budget, and the one condition under which you'd roll a release back.",
        },
      },
      {
        slug: "quality-is-a-signal",
        title: "Quality is a production signal",
        blurb: "Offline golden sets and online sampling each catch what the other misses.",
        topic: "evaluation",
        skillIds: ["offline-evaluation", "online-evaluation"],
        capability: "Decide when to use offline vs online evaluation and unify the metric across both.",
        minutes: 8,
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the visual: a prompt change passes your offline golden set but users still complain. What did offline miss?",
          choices: [
            { id: "a", label: "A faster model" },
            { id: "b", label: "Novel prompts real users ask, which weren't in the golden set" },
            { id: "c", label: "Lower cost" },
            { id: "d", label: "A database migration" },
          ],
          answer: "b",
          explanation:
            "Offline tests only the cases you anticipated. New user behaviour shows up only in live traffic — which is why online eval exists.",
        },
        prose: [
          "Offline evaluation runs your candidate change against a fixed, labelled golden set before it ships. It's repeatable, fast, and catches the regressions you can predict — the known failure modes your team has seen before. It's your deploy gate.",
          "Online evaluation samples real production traffic and scores it continuously. It catches what offline can't: drift, surprising new prompts, and slow decay as the world changes. It's noisier and needs sampling and dedup to stay affordable, but it's the only signal for the unknown unknowns.",
          "The two only work together if they share a metric. Define 'quality' one way (the same rubric, the same judge) and compute it on the golden set before deploy and on sampled live traffic after. Disagreement between the two is itself a signal — your golden set has drifted from reality.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt: "Which kind of problem can offline evaluation almost never catch on its own?",
            choices: [
              { id: "a", label: "A regression on a known failure mode" },
              { id: "b", label: "A novel prompt class users start asking" },
              { id: "c", label: "A drop in golden-set pass rate" },
              { id: "d", label: "A broken prompt template" },
            ],
            answer: "b",
            explanation:
              "Offline sees only the cases in the golden set. Genuinely new user behaviour has to be observed live.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt: "Why unify the metric definition across offline and online?",
            choices: [
              { id: "a", label: "It's required by law" },
              { id: "b", label: "So the two are directly comparable and their disagreement is meaningful" },
              { id: "c", label: "To save storage" },
              { id: "d", label: "Because offline is always wrong" },
            ],
            answer: "b",
            explanation:
              "One shared definition makes 'offline says 94%, online says 71%' a real signal (your set is stale) rather than a units mismatch.",
          },
          {
            id: "q3",
            kind: "mcq",
            prompt: "Online evaluation must sample and dedup traffic mainly to:",
            choices: [
              { id: "a", label: "Avoid angering users" },
              { id: "b", label: "Keep eval cost and noise affordable" },
              { id: "c", label: "Improve model quality" },
              { id: "d", label: "Speed up the model" },
            ],
            answer: "b",
            explanation:
              "Scoring every live turn is expensive and noisy. Sampling + dedup gives a representative, affordable signal.",
          },
        ],
        application: {
          title: "Design an eval split",
          prompt:
            "For a feature, describe your offline golden set (what it contains, how big) and your online sampling plan (what % you'd score, how you'd dedup). Name the one shared metric both would compute.",
        },
      },
      {
        slug: "llm-as-a-judge",
        title: "LLM-as-a-judge",
        blurb: "A fast, cheap first pass — never the last word.",
        topic: "evaluation",
        skillIds: ["llm-judge", "eval-bias"],
        capability: "Use an LLM judge and know when to calibrate it against humans.",
        minutes: 9,
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the visual: a confident-but-wrong answer and a plain-but-correct one. What does an LLM judge tend to do?",
          choices: [
            { id: "a", label: "Always picks the correct one" },
            { id: "b", label: "Mistakenly rewards the fluent, confident one" },
            { id: "c", label: "Refuses to score" },
            { id: "d", label: "Scores them identically on every axis" },
          ],
          answer: "b",
          explanation:
            "Judges confuse fluency for correctness — a known bias. That's why they must be calibrated against human labels.",
        },
        prose: [
          "An LLM judge uses one model to grade another's outputs — single scoring, pairwise comparison, or listwise ranking. It scales evaluation far past what humans can do by hand, which is what makes large offline and online eval pipelines affordable at all.",
          "But a judge brings its own biases. It confuses verbosity for quality, prefers its own style (self-preference), and in pairwise comparisons is swayed by which answer came first (position bias). It can score fluency well while missing facts entirely — a polished lie beats a plain truth if you let it.",
          "The discipline is calibration. Start from human labels, measure how often the judge agrees, and mitigate the big biases (swap answer order in pairs, control for length). Treat the judge's score as a cheap first pass to be spot-checked, not a ground truth. Where judge and human disagree systematically is exactly where your rubric needs work.",
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
            prompt: "What does 'position bias' mean for an LLM judge in a pairwise comparison?",
            choices: [
              { id: "a", label: "It prefers answers that mention positions" },
              { id: "b", label: "Its pick is swayed by which answer is shown first" },
              { id: "c", label: "It refuses to rank" },
              { id: "d", label: "It scores only the first token" },
            ],
            answer: "b",
            explanation:
              "Judges lean toward whichever option they see first. Swapping order and averaging is the standard mitigation.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt: "The cheapest, highest-leverage way to trust an LLM judge is to:",
            choices: [
              { id: "a", label: "Use a bigger judge model and hope" },
              { id: "b", label: "Calibrate it against human labels and measure agreement" },
              { id: "c", label: "Never use a judge" },
              { id: "d", label: "Run it only once" },
            ],
            answer: "b",
            explanation:
              "Human calibration tells you where the judge is reliable and where it's biased. Without it, scores are uninterpretable.",
          },
          {
            id: "q3",
            kind: "mcq",
            prompt: "A judge gives a confidently-wrong answer a high score. The most likely root cause is:",
            choices: [
              { id: "a", label: "The answer was too short" },
              { id: "b", label: "The judge confuses fluency with correctness" },
              { id: "c", label: "The model was too cheap" },
              { id: "d", label: "The prompt was in JSON" },
            ],
            answer: "b",
            explanation:
              "Judges reward confident, well-written text. Without a correctness check in the rubric, a lie reads as a good answer.",
          },
        ],
        application: {
          title: "Calibrate a judge",
          prompt:
            "You have 50 answers each scored by a human (1–5) and by your judge (1–5). Describe how you'd check agreement, name two biases you'd look for, and what you'd do if they disagree on the confidently-wrong answers.",
        },
      },
      {
        slug: "observe-rag-not-just-model",
        title: "Observe RAG, not only the model",
        blurb: "Faithfulness and context quality — the retrieval layer's metrics.",
        topic: "evaluation",
        skillIds: ["rag-evaluation"],
        capability: "Measure RAG quality with faithfulness and context metrics, not just fluency.",
        minutes: 8,
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the visual: a fluent answer that states a fact the retrieved docs never said. Which metric is low?",
          choices: [
            { id: "a", label: "Answer relevancy" },
            { id: "b", label: "Faithfulness" },
            { id: "c", label: "Context recall" },
            { id: "d", label: "Latency" },
          ],
          answer: "b",
          explanation:
            "Faithfulness measures whether the answer is grounded in the retrieved context. An unsupported claim is an unfaithful (hallucinated) answer.",
        },
        prose: [
          "RAG systems fail in two places, and only one is the model. The retrieval layer can return irrelevant chunks, bury the good one, or come back empty — and the model will still produce a fluent, confident answer on top of bad context. Fluency hides retrieval rot.",
          "The metrics that expose this are retrieval-aware. Faithfulness asks whether every claim in the answer is supported by the retrieved context. Context precision asks whether the relevant chunks were ranked highly rather than buried. Context recall asks whether the needed information was retrieved at all. Answer relevancy, alone, is the one that can look fine while the others collapse.",
          "When a RAG answer is bad, the instinct is to blame the model. The metrics tell you where: low context precision means fix the retriever ranking; low faithfulness with good context means fix the generation (or the prompt); empty retrieval is an index problem. Diagnose the layer before you touch the model.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt: "Low faithfulness but high context precision means the problem is in:",
            choices: [
              { id: "a", label: "Retrieval ranking" },
              { id: "b", label: "Generation — the model added unsupported claims despite good context" },
              { id: "c", label: "The vector database index" },
              { id: "d", label: "The front-end" },
            ],
            answer: "b",
            explanation:
              "Good context was retrieved and ranked well (high precision), yet the answer still strays from it (low faithfulness) — that's a generation/prompt problem.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt: "Retrieval returned 4 chunks but only 1 was relevant, ranked third. Which metric is low?",
            choices: [
              { id: "a", label: "Context precision" },
              { id: "b", label: "Answer relevancy" },
              { id: "c", label: "Faithfulness" },
              { id: "d", label: "Cost" },
            ],
            answer: "a",
            explanation:
              "Context precision rewards ranking the relevant chunks highly. Burying the one good chunk under junk gives a low score.",
          },
          {
            id: "q3",
            kind: "mcq",
            prompt: "Why can answer relevancy alone look healthy while the RAG system is failing?",
            choices: [
              { id: "a", label: "It measures the model, not the retrieval" },
              { id: "b", label: "It's always 100%" },
              { id: "c", label: "It requires a GPU" },
              { id: "d", label: "It only works offline" },
            ],
            answer: "a",
            explanation:
              "A model can produce a relevant-sounding answer from bad context. Relevancy doesn't test grounding — faithfulness and context metrics do.",
          },
        ],
        application: {
          title: "Diagnose a RAG regression",
          prompt:
            "Your docs assistant's answers drift from the source docs. List the four RAG metrics you'd measure, and for each write the fix you'd reach for if it alone were low.",
        },
      },
      {
        slug: "prompt-model-tool-regressions",
        title: "Prompt, model, and tool regressions",
        blurb: "Bisect the one variable that changed — don't blame the model first.",
        topic: "incidents",
        skillIds: ["eval-gates"],
        capability: "Bisect the changed variable instead of blaming the model by default.",
        minutes: 8,
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the visual: quality dropped after a release. The fastest correct diagnosis comes from:",
          choices: [
            { id: "a", label: "Retraining the model immediately" },
            { id: "b", label: "Comparing versioned attributes to find what changed" },
            { id: "c", label: "Increasing the temperature" },
            { id: "d", label: "Disabling all tools" },
          ],
          answer: "b",
          explanation:
            "If you versioned prompt, model, retrieval, and tool, a diff tells you exactly what changed. Bisect, don't guess.",
        },
        prose: [
          "Regressions feel like mysteries until you remember that only versioned things can regress. If you tag every span with prompt version, model, retrieval version, and tool version, then a drop in quality becomes a diff problem: what changed between the last healthy release and this one?",
          "The instinct to blame the model first is almost always wrong, because the model is usually the thing you didn't change. Far more often the culprit is a prompt tweak, a retriever ranking change, a tool that now returns differently, or a quiet dependency update. A canary release makes this legible — ship to 5% of traffic, watch the eval, and only promote if it holds.",
          "The discipline is to hold every other variable constant and change one. Eval gates in CI encode this: a candidate release must beat or match the incumbent on the golden set before it ships. When it doesn't, the diff between releases is your suspect list, already narrowed to a single variable.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt: "What makes a regression 'legible' rather than mysterious?",
            choices: [
              { id: "a", label: "A bigger model" },
              { id: "b", label: "Versioning prompt, model, retrieval, and tool on every span" },
              { id: "c", label: "Removing all logs" },
              { id: "d", label: "Higher temperature" },
            ],
            answer: "b",
            explanation:
              "Versioning turns 'it got worse' into a diff between releases — the changed variable is the suspect.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt: "A canary release ships a change to 5% of traffic first in order to:",
            choices: [
              { id: "a", label: "Save money" },
              { id: "b", label: "Limit blast radius and catch a regression before full rollout" },
              { id: "c", label: "Annoy fewer users deliberately" },
              { id: "d", label: "Test the front-end only" },
            ],
            answer: "b",
            explanation:
              "Canaries expose regressions on a small slice of real traffic so you can roll back before a full-scale incident.",
          },
          {
            id: "q3",
            kind: "mcq",
            prompt: "Quality dropped, but you didn't change the model. The most likely culprit is:",
            choices: [
              { id: "a", label: "The model forgot things" },
              { id: "b", label: "A prompt, retrieval, or tool change — the variable you did change" },
              { id: "c", label: "Solar flares" },
              { id: "d", label: "The user's browser" },
            ],
            answer: "b",
            explanation:
              "Regressions follow changes. If the model is the same, look at what you did change: prompt, retriever, or tool.",
          },
        ],
        application: {
          title: "Bisect a bad release",
          prompt:
            "You shipped release v17 and quality dropped 18%. Write the ordered list of versioned variables you'd diff against v16, and the one you'd suspect first if the prompt template was edited in that release.",
        },
      },
      {
        slug: "alerts-people-trust",
        title: "Alerts people trust",
        blurb: "Burn-rate over static lines, with a runbook attached.",
        topic: "incidents",
        skillIds: ["alerting"],
        capability: "Choose burn-rate alerting over static thresholds and attach a runbook.",
        minutes: 8,
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the visual: a static threshold pages 12 times overnight for zero real incidents. What happens over time?",
          choices: [
            { id: "a", label: "On-call starts trusting the alert more" },
            { id: "b", label: "On-call mutes it — and misses the real one when it comes" },
            { id: "c", label: "The system fixes itself" },
            { id: "d", label: "Latency improves" },
          ],
          answer: "b",
          explanation:
            "False alarms cause alert fatigue. People mute noisy alerts, then the real incident slides through. Trust is the asset.",
        },
        prose: [
          "An alert is only useful if on-call trusts it. A static threshold — page whenever a metric crosses a line — cries wolf on every blip, especially under low traffic when a few bad requests spike the rate. After a dozen false pages, engineers mute it, and the real incident sails through.",
          "Burn-rate alerting pages on sustained user impact, not momentary spikes. It watches how fast the error budget is burning across multiple time windows: a brief blip doesn't burn enough to page, but a steady degradation trips a long-window check within minutes of real impact. It trades a little detection latency for a lot of precision.",
          "Every alert needs a runbook — the first three steps on-call takes when it fires. An alert without a runbook is noise with a siren; an alert with one is a decision already half-made. Route by severity, deduplicate, and make the path from page to diagnosis obvious.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt: "Why does a static threshold 'cry wolf' especially at night?",
            choices: [
              { id: "a", label: "The model is sleepier" },
              { id: "b", label: "Low traffic means a few bad requests spike the rate" },
              { id: "c", label: "Alerts are louder at night" },
              { id: "d", label: "Dashboards turn off" },
            ],
            answer: "b",
            explanation:
              "Rates are volatile at low volume. A handful of errors looks like a crisis at 3am traffic but is statistically nothing.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt: "What does a burn-rate alert actually page on?",
            choices: [
              { id: "a", label: "Any single bad request" },
              { id: "b", label: "Sustained error-budget burn across time windows" },
              { id: "c", label: "CPU usage" },
              { id: "d", label: "The model's mood" },
            ],
            answer: "b",
            explanation:
              "Burn-rate pages when the budget is degrading fast enough over long enough to imply real user impact — not on a momentary blip.",
          },
          {
            id: "q3",
            kind: "mcq",
            prompt: "An alert without a runbook is best described as:",
            choices: [
              { id: "a", label: "A complete incident response" },
              { id: "b", label: "Noise with a siren — no one knows the first step to take" },
              { id: "c", label: "A dashboard" },
              { id: "d", label: "An SLO" },
            ],
            answer: "b",
            explanation:
              "A runbook gives the first three diagnostic steps. Without it, on-call stares at a page with no idea where to start.",
          },
        ],
        application: {
          title: "Turn a noisy alert into a trusted one",
          prompt:
            "You have a static threshold alert that pages too often. Describe how you'd replace it with a burn-rate alert, and write the three-step runbook you'd attach so on-call knows exactly what to do when it fires.",
        },
      },
      {
        slug: "triage-an-incident",
        title: "Triage a real-looking incident",
        blurb: "Alert → dashboard → cohort → trace → fix, one hypothesis per step.",
        topic: "incidents",
        skillIds: ["ai-incident-response"],
        capability: "Drill from alert to fix, testing one hypothesis at each step.",
        minutes: 9,
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the visual: an alert fires. What's the first thing you establish?",
          choices: [
            { id: "a", label: "Who to blame" },
            { id: "b", label: "What kind of incident it is and where the blast radius is" },
              { id: "c", label: "The exact line of code" },
            { id: "d", label: "The cost so far" },
          ],
          answer: "b",
          explanation:
            "First, characterise: is it latency or quality, and which users/regions/clients are hit? Blast radius narrows everything that follows.",
        },
        prose: [
          "Triage is a drill-down, not a leap. Start at the alert: what's burning — latency, quality, cost, safety? Then the dashboard: where is it burning — which region, client, cohort? Each step narrows the blast radius and rules out causes.",
          "With the cohort identified, slice it for what's shared. If every bad turn carries the same tool version or the same prompt version, you've found your one changed variable. Open a representative trace to confirm the mechanism — a tool timing out, a retriever returning junk — and you have a hypothesis backed by evidence.",
          "Act, then confirm. Roll back or patch the single variable, and watch the signal recover. The last step, often skipped, is writing the regression test so this exact failure can't ship again. An incident isn't closed when it's fixed; it's closed when it can't recur.",
        ],
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
            prompt: "What does the dashboard step of triage establish?",
            choices: [
              { id: "a", label: "The root cause" },
              { id: "b", label: "The blast radius — where the impact is concentrated" },
              { id: "c", label: "The fix" },
              { id: "d", label: "The cost" },
            ],
            answer: "b",
            explanation:
              "Slicing by region/client/cohort shows where the incident lives, narrowing the search before you open a single trace.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt: "Slicing a cohort of bad turns reveals they all share tool = billing v2.2. This is:",
            choices: [
              { id: "a", label: "Proof the model is broken" },
              { id: "b", label: "A strong hypothesis — the one changed variable" },
              { id: "c", label: "Unrelated noise" },
              { id: "d", label: "A front-end bug" },
            ],
            answer: "b",
            explanation:
              "A shared attribute across every bad turn is the suspect. Confirm the mechanism with a trace, then act.",
          },
          {
            id: "q3",
            kind: "mcq",
            prompt: "When is an incident truly closed?",
            choices: [
              { id: "a", label: "When the metric recovers" },
              { id: "b", label: "When the regression test that prevents recurrence is merged" },
              { id: "c", label: "When on-call goes to sleep" },
              { id: "d", label: "When the dashboard turns green" },
            ],
            answer: "b",
            explanation:
              "Recovery ends the outage; the regression test ends the incident class. Without it, the same change can reintroduce the failure.",
          },
        ],
        application: {
          title: "Runbook for one incident",
          prompt:
            "Write the five-step triage runbook for a quality-regression alert on your feature: what you'd check at each step (alert, dashboard, cohort, trace, fix), and the regression test you'd add at the end.",
        },
      },
      {
        slug: "operator-dashboard",
        title: "Build the operator dashboard",
        blurb: "The exec view answers 'are we healthy'; the on-call view answers 'what's broken'.",
        topic: "operate",
        skillIds: ["observability-dashboards"],
        capability: "Separate the executive dashboard from the on-call diagnostic dashboard.",
        minutes: 7,
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the visual: an exec and an on-call engineer look at the same dashboard. What goes wrong?",
          choices: [
            { id: "a", label: "Nothing — one dashboard serves both perfectly" },
            { id: "b", label: "It either hides the detail on-call needs or overwhelms the exec" },
            { id: "c", label: "The exec breaks it" },
            { id: "d", label: "It only works on mobile" },
          ],
          answer: "b",
          explanation:
            "The two audiences ask different questions. One dashboard can't serve both well — build two, tuned to each question.",
        },
        prose: [
          "An executive dashboard answers one question — 'are we healthy?' — with a few big, calm numbers: quality, cost, incidents. It should be legible in a glance and hide the detail, because an exec reading it wants a status, not a diagnosis.",
          "An on-call dashboard answers the opposite question — 'what's broken, where, since when?' It's drill-down-rich: latency by route, quality by cohort, error-budget burn, and a path from a red tile to the traces behind it. Density is the point; a calm on-call dashboard is one that has nothing to debug.",
          "The mistake is forcing one view to serve both. An exec-facing dashboard with drill-downs gets ignored; an on-call dashboard with three big numbers is useless at 3am. Build both, share the underlying data, and let each audience see the system at its own altitude.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt: "What question does an executive dashboard answer?",
            choices: [
              { id: "a", label: "Which trace is slowest?" },
              { id: "b", label: "Are we healthy, at a glance?" },
              { id: "c", label: "Which cohort regressed?" },
              { id: "d", label: "What's the p99 by route?" },
            ],
            answer: "b",
            explanation:
              "Execs want status — a few big numbers that say healthy or not. Detail belongs elsewhere.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt: "An on-call dashboard should make it easy to:",
            choices: [
              { id: "a", label: "Hide bad news" },
              { id: "b", label: "Drill from a red tile to the traces behind it" },
              { id: "c", label: "Impress executives" },
              { id: "d", label: "Show only averages" },
            ],
            answer: "b",
            explanation:
              "On-call debugs from the dashboard: a red tile must link to the cohort, then the trace. The path to diagnosis is the feature.",
          },
          {
            id: "q3",
            kind: "mcq",
            prompt: "Why not serve execs and on-call with a single combined dashboard?",
            choices: [
              { id: "a", label: "It's illegal" },
              { id: "b", label: "It either hides on-call detail or overwhelms the exec" },
              { id: "c", label: "Dashboards can't be shared" },
              { id: "d", label: "It costs more" },
            ],
            answer: "b",
            explanation:
              "The audiences want different altitudes. One view compromises both; two views sharing the same data serve each cleanly.",
          },
        ],
        application: {
          title: "Two dashboards for your feature",
          prompt:
            "Sketch the exec dashboard (3 tiles) and the on-call dashboard (4 drill-downs) for your feature. Name the one tile they share, and the drill-down only on-call gets.",
        },
      },
      {
        slug: "capstone-rescue-assistant",
        title: "Capstone: rescue the support assistant",
        blurb: "Turn a vague hunch into a measured, diagnosable system.",
        topic: "operate",
        skillIds: ["ai-observability", "ai-incident-response"],
        capability: "Assemble signals, an SLO, and a runbook into a working diagnosis.",
        minutes: 10,
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the visual: support says the assistant 'seems worse'. Before writing any code, what do you need first?",
          choices: [
            { id: "a", label: "A bigger model" },
            { id: "b", label: "A signal — a measurement that confirms 'worse' and points at where" },
            { id: "c", label: "A marketing campaign" },
            { id: "d", label: "More front-end animations" },
          ],
          answer: "b",
          explanation:
            "A hunch without a measurement is unfixable. The first job of observability is to turn 'seems worse' into a number with a source.",
        },
        prose: [
          "The capstone ties the course together. The support assistant is slow and unhelpful after a release, and no one can say why — a hunch with no evidence. The work of this lesson is to convert that hunch into a measured, diagnosable system that names a root cause.",
          "The recipe is everything you've learned: instrument the request into traces carrying prompt, model, retrieval, and tool versions; define three signals (faithfulness, p95 latency, context precision); set one quality SLO with an error budget; attach one burn-rate alert with a runbook. With those in place, the incident stops being a mystery and becomes a diff: release v17 changed the retriever ranker, context precision dropped, faithfulness followed.",
          "That's the whole skill: instrument for where, evaluate for what, and set an SLO with a runbook for when. A feature you can measure is a feature you can rescue; one you can't is a feature you can only argue about.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt: "What does instrumentation give you that a hunch cannot?",
            choices: [
              { id: "a", label: "A bigger model" },
              { id: "b", label: "Where the problem is — attributed to a specific span and release" },
              { id: "c", label: "Cheaper inference" },
              { id: "d", label: "Happier users automatically" },
            ],
            answer: "b",
            explanation:
              "Traces with version attributes turn a vague complaint into an attributed, located problem — the prerequisite for fixing it.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt: "Why pair a quality signal with an SLO rather than just an alert on latency?",
            choices: [
              { id: "a", label: "Latency is free" },
              { id: "b", label: "A feature can be fast and still wrong — quality needs its own target and budget" },
              { id: "c", label: "SLOs are required by law" },
              { id: "d", label: "Latency can't be measured" },
            ],
            answer: "b",
            explanation:
              "Latency alone misses the common AI failure: a fast, wrong answer. A quality SLO makes 'wrong' visible and budgeted.",
          },
          {
            id: "q3",
            kind: "mcq",
            prompt: "In the capstone, the root cause turned out to be:",
            choices: [
              { id: "a", label: "The model regressed on its own" },
              { id: "b", label: "Release v17 changed the retriever ranker, dropping context precision" },
              { id: "c", label: "Users got pickier" },
              { id: "d", label: "A solar flare" },
            ],
            answer: "b",
            explanation:
              "The diff pointed at one changed variable — the ranker — which collapsed retrieval quality and dragged faithfulness with it. The model was blameless.",
          },
        ],
        application: {
          title: "Rescue plan for a feature you own",
          prompt:
            "Write a one-page rescue plan for an LLM feature: the spans you'd instrument and their attributes, the three signals you'd watch, the one SLO with its target and budget, and the runbook for the alert that fires when the budget burns. End with the single most likely root cause you'd check first.",
        },
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
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the visual: where should PII scrubbing happen in the pipeline?",
          choices: [
            { id: "a", label: "At query time, in the dashboard" },
            { id: "b", label: "At the collector, before storage" },
            { id: "c", label: "Nowhere — store everything" },
            { id: "d", label: "In the model itself" },
          ],
          answer: "b",
          explanation:
            "Redaction belongs at the collector boundary, before data hits storage. Once raw PII is persisted, every downstream component is a breach surface.",
        },
        prose: [
          "A telemetry system is not a bucket; it's a chain of contracts. The app emits spans with correct attributes; the SDK propagates context and honours the semantic conventions; the collector redacts, samples, and routes; the backend indexes within a cardinality budget; the query layer serves correct aggregations. Each stage owns one guarantee the next stage depends on.",
          "Break a contract and the failure migrates. If the SDK drops the correlation ID, traces fragment across services. If the collector doesn't redact, the backend becomes a breach surface. If the backend allows unbounded cardinality, query latency collapses under index bloat. The contract is the design unit — and the debugging unit when something breaks.",
          "Owning this chain means deciding what each stage guarantees and who owns it. Version the schema, document the attributes each stage must set, and treat the collector as the security and cost boundary — the last place you can cheaply transform telemetry before it becomes a liability in storage.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt: "The collector's defining job, distinct from the app and backend, is:",
            choices: [
              { id: "a", label: "Generating model answers" },
              { id: "b", label: "Redaction, sampling, and routing — the transformation boundary" },
              { id: "c", label: "Running the model" },
              { id: "d", label: "Rendering the dashboard" },
            ],
            answer: "b",
            explanation:
              "The collector is where you cheaply transform telemetry (scrub PII, tail-sample, route by tenant) before it's indexed. After storage, those changes are expensive or impossible.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt: "What breaks if the SDK fails to propagate the correlation ID?",
            choices: [
              { id: "a", label: "Nothing" },
              { id: "b", label: "Traces fragment — you can't reconstruct a request across services" },
              { id: "c", label: "The model slows down" },
              { id: "d", label: "Cost rises" },
            ],
            answer: "b",
            explanation:
              "Context propagation is the SDK's core contract. Lose the ID and a single user turn scatters into unrelated spans across service boundaries.",
          },
          {
            id: "q3",
            kind: "mcq",
            prompt: "Why is schema versioning part of the contract, not an afterthought?",
            choices: [
              { id: "a", label: "It's required by OTel" },
              { id: "b", label: "Consumers must tolerate attribute changes without silent breakage" },
              { id: "c", label: "Schemas can't change" },
              { id: "d", label: "It saves disk space" },
            ],
            answer: "b",
            explanation:
              "Attributes evolve. A versioned, documented schema lets dashboards and alerts degrade gracefully instead of silently reading the wrong field.",
          },
        ],
        application: {
          title: "Write the contract",
          prompt:
            "For a multi-service AI feature, list each pipeline stage (app, SDK, collector, backend, query) and the one contract it owns. Name the failure mode if each contract is broken.",
        },
      },
      {
        slug: "genai-semantic-conventions",
        title: "GenAI semantic conventions in practice",
        blurb: "OTel GenAI and OpenInference: layer them, don't fork.",
        topic: "telemetry-platform",
        skillIds: ["otel-genai", "telemetry-strategy"],
        capability: "Choose between and layer OTel GenAI and OpenInference without forking a private schema.",
        minutes: 11,
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the visual: you need vendor portability but your tool speaks OpenInference. What's the sound move?",
          choices: [
            { id: "a", label: "Fork a private attribute schema for full control" },
            { id: "b", label: "Emit both OTel GenAI and OpenInference, extend rather than fork" },
            { id: "c", label: "Pick one vendor and hard-lock" },
            { id: "d", label: "Avoid attributes entirely" },
          ],
          answer: "b",
          explanation:
            "Dual-emit to stay portable while OTel GenAI stabilises, and extend the standard rather than invent a private schema that no tool can read.",
        },
        prose: [
          "Two conventions describe the same LLM span. OpenTelemetry GenAI semantic conventions (gen_ai.*) are the converging, vendor-neutral standard, moving toward stability under the Cloud Native Computing Foundation. OpenInference, from the Arize/Phoenix community, is richer and more widely deployed today, with first-class retrieval and agent attributes.",
          "They overlap heavily and differ in naming. The temptation is to pick one and hard-lock, or worse, invent a private schema for 'full control'. Both are mistakes: vendor lock-in today, or a schema no tooling can read. The sound move is to treat them as complementary layers — emit OTel GenAI for portability and OpenInference for tool richness — and to extend the standard rather than fork it.",
          "'Extend, don't fork' is the discipline. When the standard lacks an attribute you need (a proprietary retrieval score, say), add it under your own prefix while keeping the standard attributes intact. Your schema then degrades gracefully in any tool, and you can drop the extension when the standard catches up.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt: "What's wrong with forking a private attribute schema for your LLM spans?",
            choices: [
              { id: "a", label: "It's more work" },
              { id: "b", label: "No standard tooling can read it, and you inherit maintenance forever" },
              { id: "c", label: "It's illegal" },
              { id: "d", label: "Schemas must be public" },
            ],
            answer: "b",
            explanation:
              "A private schema locks you into custom tooling and makes you the maintainer of a standard no one else follows. Extend the standard instead.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt: "Why dual-emit OTel GenAI and OpenInference today?",
            choices: [
              { id: "a", label: "It doubles your storage for no reason" },
              { id: "b", label: "Portability via OTel GenAI, richness via OpenInference, while convergence is still in flight" },
              { id: "c", label: "It's required by GDPR" },
              { id: "d", label: "To confuse analysts" },
            ],
            answer: "b",
            explanation:
              "The conventions haven't fully converged. Dual-emitting keeps you portable and tool-rich until they do, at which point you drop one.",
          },
          {
            id: "q3",
            kind: "mcq",
            prompt: "You need an attribute the standard doesn't define. The right move is to:",
            choices: [
              { id: "a", label: "Wait indefinitely" },
              { id: "b", label: "Add it under your own prefix while keeping standard attributes intact" },
              { id: "c", label: "Overload an existing standard attribute" },
              { id: "d", label: "Stop instrumenting" },
            ],
            answer: "b",
            explanation:
              "Extension under a private prefix preserves standard compatibility. Overloading an existing attribute silently breaks every consumer of that attribute.",
          },
        ],
        application: {
          title: "Map your attributes",
          prompt:
            "List the LLM attributes your team records. Mark which are OTel GenAI, which are OpenInference, and any private extensions. For each private one, write the prefix you'd use and the condition under which you'd retire it.",
        },
      },
      {
        slug: "sampling-cardinality-cost",
        title: "Sampling, cardinality, and telemetry cost",
        blurb: "Sample for fidelity (tail); cap cardinality before it caps you.",
        topic: "telemetry-platform",
        skillIds: ["telemetry-pipeline"],
        capability: "Choose sampling for fidelity and cap cardinality to keep telemetry affordable.",
        minutes: 10,
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the visual: head sampling drops 99% of traces at the source. What's the cost?",
          choices: [
            { id: "a", label: "It's too expensive" },
            { id: "b", label: "It usually drops the rare erroring trace you needed" },
            { id: "c", label: "It's illegal" },
            { id: "d", label: "It slows the model" },
            ],
          answer: "b",
          explanation:
            "Head sampling decides before it knows which trace mattered. The one erroring trace you need is usually dropped — you pay storage but lose the evidence.",
        },
        prose: [
          "Sampling is a debugging-fidelity decision dressed up as a cost decision. Head sampling drops traces at the source and is cheap, but blind: it discards the rare erroring trace you'd most want to see. Tail sampling evaluates the full trace at the collector and keeps the ones that matter — errors, slow turns, policy violations — giving you exemplar debugging at a fraction of the storage.",
          "Cardinality is the silent budget killer. Every unique attribute value creates an index entry; a per-request timestamp or full session id is near-unique, so indexing it scales linearly with traffic. The result is index bloat, collapsing query latency, and a bill that surprises no one who has lived through it. Cap your dimensionality budget deliberately: low-cardinality dimensions for slicing, raw values sampled or hashed.",
          "The two combine into a strategy: tail-sample to keep the interesting traces, and constrain dimensions so the ones you keep stay queryable. Cost then scales with the value you retain, not the traffic you see — which is the only sane scaling law for telemetry.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt: "Why is head sampling described as 'blind'?",
            choices: [
              { id: "a", label: "It runs without lights" },
              { id: "b", label: "It drops traces before knowing which ones mattered" },
              { id: "c", label: "It can't see the model" },
              { id: "d", label: "It samples at night" },
            ],
            answer: "b",
            explanation:
              "Head sampling decides at emission time, so it can't preferentially keep the erroring or slow traces — those get dropped at the same rate as everything else.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt: "Which attribute is a cardinality hazard?",
            choices: [
              { id: "a", label: "model id (a few values)" },
              { id: "b", label: "a full per-request timestamp or session uuid" },
              { id: "c", label: "environment (dev/stage/prod)" },
              { id: "d", label: "tool name (a handful)" },
            ],
            answer: "b",
            explanation:
              "Near-unique-per-request values explode index size. Keep dimensions low-cardinality; sample or hash the unique ones.",
          },
          {
            id: "q3",
            kind: "mcq",
            prompt: "A sane telemetry cost scaling law is:",
            choices: [
              { id: "a", label: "Cost scales with total traffic" },
              { id: "b", label: "Cost scales with the value you retain (tail-sampled, low-cardinality)" },
              { id: "c", label: "Cost is always zero" },
              { id: "d", label: "Cost scales with model size" },
            ],
            answer: "b",
            explanation:
              "Tail sampling + capped cardinality means you pay for interesting, queryable traces — not for every request that passes through.",
          },
        ],
        application: {
          title: "Design the sampling + cardinality budget",
          prompt:
            "For a high-traffic AI feature, write your tail-sampling policy (which traces you keep) and your dimensionality budget (which attributes are low-cardinality dimensions vs sampled/hashed). Estimate the storage difference versus head sampling at 100%.",
        },
      },
      {
        slug: "ai-threat-model-owasp",
        title: "AI threat model: the OWASP LLM Top 10",
        blurb: "Every risk maps to a telemetry signal you can detect.",
        topic: "security-privacy",
        skillIds: ["ai-security"],
        capability: "Map the OWASP LLM Top 10 to telemetry detection signals.",
        minutes: 11,
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the visual: prompt injection is best detected via telemetry as:",
          choices: [
            { id: "a", label: "Faster responses" },
            { id: "b", label: "A divergence between the user's intent and the plan the model executed" },
            { id: "c", label: "Lower cost" },
            { id: "d", label: "Fewer tokens" },
          ],
          answer: "b",
          explanation:
            "Injection rewrites the model's plan. Detecting intent-vs-action divergence, or unexpected tool calls, is the signal — not a new data source.",
        },
        prose: [
          "The OWASP Top 10 for LLM Applications is the canonical threat list: prompt injection, sensitive information disclosure, supply chain, data and model poisoning, improper output handling, excessive agency, system prompt leakage, vector and embedding weaknesses, misinformation, and unbounded consumption. Each is a real failure mode with a documented attack pattern.",
          "The reframe for observability is that each risk maps to a signal you can detect on telemetry you already collect. Prompt injection shows up as intent-versus-action divergence. Sensitive disclosure shows up in output scanners. Excessive agency shows up as a tool call outside policy. Unbounded consumption shows up as runaway token loops. Detection is a query on existing spans, rates, and args — not a new instrument.",
          "This turns security from a separate discipline into a read on the same pipeline. You're not building a parallel security telemetry stack; you're adding the reads, thresholds, and alerts that surface the OWASP risks on the spans, tool calls, and outputs you already record.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt: "What does 'excessive agency' look like in telemetry?",
            choices: [
              { id: "a", label: "A faster response" },
              { id: "b", label: "A tool call outside the task's scope or policy" },
              { id: "c", label: "A shorter answer" },
              { id: "d", label: "Lower latency" },
            ],
            answer: "b",
            explanation:
              "Excessive agency is the model taking an action it wasn't granted — visible as a tool span whose arguments fall outside the allowed policy.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt: "Unbounded consumption (LLM DoS) is best caught by:",
            choices: [
              { id: "a", label: "Reading the user's email" },
              { id: "b", label: "Token-rate and agent loop-depth limits" },
              { id: "c", label: "A bigger dashboard" },
              { id: "d", label: "Disabling logs" },
            ],
            answer: "b",
            explanation:
              "Runaway loops and huge contexts consume tokens and time. Rate and loop-depth limits on the agent span catch them before they consume the budget.",
          },
          {
            id: "q3",
            kind: "mcq",
            prompt: "The reframe this lesson offers is that AI security detection is:",
            choices: [
              { id: "a", label: "A new, separate telemetry stack" },
              { id: "b", label: "A read on the spans, rates, and args you already collect" },
              { id: "c", label: "Impossible" },
              { id: "d", label: "Only the model vendor's job" },
            ],
            answer: "b",
            explanation:
              "Each OWASP risk maps to a query on existing telemetry. Detection adds reads and thresholds, not a parallel system.",
          },
        ],
        application: {
          title: "Map your detection coverage",
          prompt:
            "Take the OWASP LLM Top 10. For each risk, write the telemetry signal that would detect it in your system — and mark which you currently alert on versus which you're blind to.",
        },
      },
      {
        slug: "detecting-attacks-in-telemetry",
        title: "Detecting attacks in telemetry",
        blurb: "Injection, extraction, exfiltration, unsafe tools — read from ordinary spans.",
        topic: "security-privacy",
        skillIds: ["ai-security", "ai-red-teaming"],
        capability: "Detect injection, extraction, exfiltration, and unsafe tool use from ordinary telemetry.",
        minutes: 11,
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the visual: model-extraction attacks are best spotted as:",
          choices: [
            { id: "a", label: "A single weird request" },
            { id: "b", label: "High-volume, near-identical queries probing the model from one identity" },
            { id: "c", label: "Lower cost" },
            { id: "d", label: "Faster latency" },
          ],
          answer: "b",
          explanation:
            "Extraction is a volume-and-similarity pattern: many near-duplicate probes against the decision surface. It's a rate anomaly per identity, not a single call.",
        },
        prose: [
          "Attacks leave fingerprints on ordinary telemetry. Prompt injection rewrites the model's plan, so it shows up as intent-versus-action divergence or unexpected tool calls. Data exfiltration shows up in output scanners flagging secrets or PII the model returned. Neither needs a new data source — they need new reads on the spans you already record.",
          "Model extraction and membership inference are rate-and-pattern problems rather than single-call problems. Extraction looks like a high volume of near-identical queries probing the model's decision surface from one identity. Membership inference looks like a cluster of correlated, calibrated probes trying to determine whether a specific record was in training. Both are detectable as per-identity query-rate and embedding-similarity anomalies.",
          "Unsafe tool use is the most directly preventable. A tool called with arguments outside policy — a delete instead of a read, a cross-tenant lookup — is visible on the tool span. Validating tool args against an allowlist at the span turns a class of agent-security failures into a hard reject, with the attempt itself recorded for the audit trail.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt: "Why is membership inference detected as a 'cluster', not a single call?",
            choices: [
              { id: "a", label: "Single calls are invisible by law" },
              { id: "b", label: "Inference requires many correlated, calibrated probes to infer membership statistically" },
              { id: "c", label: "It only happens in clusters of machines" },
              { id: "d", label: "One call never reaches the model" },
            ],
            answer: "b",
            explanation:
              "Inferring whether a record was in training is a statistical pattern across many probes. The fingerprint is the cluster, not any individual request.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt: "Data exfiltration via the model's output is caught by:",
            choices: [
              { id: "a", label: "A faster dashboard" },
              { id: "b", label: "Output-side DLP and secret scanners on the completion span" },
              { id: "c", label: "Disabling the model" },
              { id: "d", label: "Lowering temperature" },
            ],
            answer: "b",
            explanation:
              "If the model returns secrets or PII, output scanners on the completion catch it. The signal lives in what the model emitted, not what it was asked.",
          },
          {
            id: "q3",
            kind: "mcq",
            prompt: "The most directly preventable agent-security failure is:",
            choices: [
              { id: "a", label: "Membership inference" },
              { id: "b", label: "Unsafe tool parameters — validate args against an allowlist on the tool span" },
              { id: "c", label: "Model extraction" },
              { id: "d", label: "Training data poisoning" },
            ],
            answer: "b",
            explanation:
              "Tool args are structured and policy-checkable. An allowlist on the tool span turns an out-of-policy call into a hard reject with an audit record.",
          },
        ],
        application: {
          title: "Design three detection queries",
          prompt:
            "Write the telemetry query that would detect (1) a prompt-injection attempt shifting the plan, (2) a model-extraction campaign from one identity, and (3) an out-of-policy tool call. For each, name the alert threshold.",
        },
      },
      {
        slug: "guardrails-and-safety-signals",
        title: "Guardrails and safety signals",
        blurb: "Guardrails raise the bar; measure their attack-success rate.",
        topic: "security-privacy",
        skillIds: ["ai-guardrails"],
        capability: "Apply guardrails and measure their attack-success rate honestly.",
        minutes: 10,
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the visual: you add an input/output guardrail. What should you assume?",
          choices: [
            { id: "a", label: "All attacks are now blocked" },
            { id: "b", label: "It catches most known patterns but a fraction of evasions still succeed" },
            { id: "c", label: "It's unnecessary" },
            { id: "d", label: "It has no cost" },
          ],
          answer: "b",
          explanation:
            "Guardrails (NeMo, Lakera, Guardrails AI) catch most known attack patterns, but published evasions still succeed a meaningful fraction of the time. Measure it; don't assume safety.",
        },
        prose: [
          "Guardrails are input and output checks in the runtime path — frameworks like NeMo Guardrails, Lakera Guard, and Guardrails AI. They catch known jailbreak patterns, harmful outputs, and policy violations before the request reaches the model or the response reaches the user. They raise the bar substantially over having no check at all.",
          "The dangerous assumption is that a guardrail is a wall. Published research shows they're evadable: against adaptive adversaries, attack-success rates can be high. A guardrail that blocks 94% of known patterns still lets 6% through, and novel attacks aren't in the known set. Treating the guardrail as a guarantee is how you get breached.",
          "The mature posture is to measure the attack-success rate (ASR) as a production metric and drive it down. Run continuous red-team evals against your guardrail, track ASR over time, and treat each new evasion as a regression to fix — exactly like a quality SLO. The guardrail is a control you invest in, not a checkbox you tick.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt: "What does it mean to treat a guardrail's attack-success rate as a production metric?",
            choices: [
              { id: "a", label: "Ignore it" },
              { id: "b", label: "Measure ASR continuously with red-team evals and drive it down" },
              { id: "c", label: "Hide it from the team" },
              { id: "d", label: "Set it to 100%" },
            ],
            answer: "b",
            explanation:
              "ASR is a number you can track, regress, and improve. Continuous red-teaming feeds it the way a golden set feeds a quality SLO.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt: "Why is 'the guardrail blocks 94%' not a guarantee of safety?",
            choices: [
              { id: "a", label: "94% is low" },
              { id: "b", label: "6% still gets through, and novel attacks aren't in the known set the 94% was measured against" },
              { id: "c", label: "Guardrails are illegal" },
              { id: "d", label: "It's actually 100%" },
            ],
            answer: "b",
            explanation:
              "The catch rate is measured against known patterns. Adaptive and novel attacks exploit exactly what the guardrail hasn't seen, so the residual risk is real and must be measured.",
          },
          {
            id: "q3",
            kind: "mcq",
            prompt: "Guardrails sit where, relative to the model?",
            choices: [
              { id: "a", label: "After the user only" },
              { id: "b", label: "In the runtime path, on input and/or output" },
              { id: "c", label: "Inside the training data" },
              { id: "d", label: "On the dashboard only" },
            ],
            answer: "b",
            explanation:
              "Guardrails run in the request path — checking the input before the model and the output before the user — which is why their decisions are themselves observable signals.",
          },
        ],
        application: {
          title: "Stand up an ASR metric",
          prompt:
            "Describe how you'd measure your guardrail's attack-success rate in production: the red-team eval set, the cadence, the ASR number you'd report, and the threshold below which you'd block a release.",
        },
      },
      {
        slug: "privacy-engineering-for-telemetry",
        title: "Privacy engineering for telemetry",
        blurb: "Observe a system that handles sensitive prompts without storing them.",
        topic: "security-privacy",
        skillIds: ["telemetry-privacy", "ai-audit-trail"],
        capability: "Observe an AI system handling sensitive prompts without becoming a breach surface.",
        minutes: 12,
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the visual: a regulated system can't store raw prompts. What do you log instead?",
          choices: [
            { id: "a", label: "Nothing — give up on observability" },
            { id: "b", label: "Redacted/hashed dimensions (model, version, token counts) plus an immutable audit trail of access" },
            { id: "c", label: "Store them in a spreadsheet" },
            { id: "d", label: "Store them in plain text for convenience" },
          ],
          answer: "b",
          explanation:
            "You keep the dimensions that explain behaviour, redact or hash anything identifying, and record who accessed what via an immutable audit trail. Observability without exposure.",
        },
        prose: [
          "The central question of privacy engineering for AI telemetry: can you observe the system without storing the prompt at all? Often, yes. The debugging value lives in the dimensions — model, prompt version, retrieval version, token counts, latency — not in the raw text. Detecting and redacting PII at the collector, then keeping only those dimensions, preserves debuggability without persisting the sensitive payload.",
          "Where prompts must be kept, residency and isolation govern them. Regional data residency routes EU financial or health prompts to EU-region backends and enforces it in the collector — GDPR, HIPAA, and MiFID II all push toward this. Tenant isolation partitions telemetry by customer at storage, so one tenant's prompts can never surface in another tenant's queries. These are architectural commitments, not settings.",
          "Access control and the audit trail close the loop. Raw prompts, if kept, sit behind role tiers: support sees metadata, security sees content under approval, most roles see neither. Every read of sensitive telemetry lands in an immutable, append-only audit trail — the evidence layer that accountability and regulators require, and the record that reconstructs who saw what, when.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt: "Where is regional data residency best enforced?",
            choices: [
              { id: "a", label: "In the front-end" },
              { id: "b", label: "In the collector routing layer" },
              { id: "c", label: "In the dashboard" },
              { id: "d", label: "Nowhere — rely on policy" },
            ],
            answer: "b",
            explanation:
              "Residency is an architectural routing decision at the collector. Enforcing it in code, not policy, is what keeps regulated data in its region.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt: "What does tenant isolation in telemetry storage guarantee?",
            choices: [
              { id: "a", label: "Faster queries" },
              { id: "b", label: "One tenant's prompts can't surface in another tenant's queries" },
              { id: "c", label: "Lower cost" },
              { id: "d", label: "Better model quality" },
            ],
            answer: "b",
            explanation:
              "Partitioning by tenant at storage prevents cross-tenant data leakage — a hard requirement for multi-tenant platforms handling sensitive prompts.",
          },
          {
            id: "q3",
            kind: "mcq",
            prompt: "An immutable audit trail of prompt access primarily serves:",
            choices: [
              { id: "a", label: "Faster dashboards" },
              { id: "b", label: "Accountability and regulatory evidence of who saw what, when" },
              { id: "c", label: "Model training" },
              { id: "d", label: "Cost reduction" },
            ],
            answer: "b",
            explanation:
              "The append-only record is the evidence layer. It deters misuse, enables investigation, and is what an auditor samples to confirm control effectiveness.",
          },
        ],
        application: {
          title: "Design a privacy-preserving pipeline",
          prompt:
            "For a system handling regulated prompts, describe what your collector redacts vs retains, how residency and tenant isolation are enforced, and what the RBAC tiers + audit trail record for every read.",
        },
      },
      {
        slug: "governance-frameworks",
        title: "Governance frameworks",
        blurb: "EU AI Act, NIST AI RMF, ISO 42001, SR 11-7 — all reduce to trace + measure + control.",
        topic: "governance",
        skillIds: ["ai-compliance", "eu-ai-act", "nist-ai-rmf"],
        capability: "Map observability signals to the EU AI Act, NIST AI RMF, ISO 42001, and SR 11-7.",
        minutes: 12,
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the visual: an auditor asks 'prove this high-risk system is monitored.' Your evidence is:",
          choices: [
            { id: "a", label: "A verbal assurance" },
            { id: "b", label: "Your traces, eval results, SLOs, and audit trail — the observability pipeline itself" },
            { id: "c", label: "A marketing page" },
            { id: "d", label: "The model's parameter count" },
          ],
          answer: "b",
          explanation:
            "Governance frameworks ask for traceability, measurement, and control. Your observability pipeline IS that evidence — traces prove traceability, evals prove measurement, gates prove control.",
        },
        prose: [
          "Four frameworks dominate enterprise AI governance. The EU AI Act risk-classifies systems and imposes duties on high-risk ones — traceability, human oversight, auditability — and obligations on general-purpose model providers. NIST's AI Risk Management Framework structures the work as Govern, Map, Measure, and Manage across the lifecycle. ISO/IEC 42001 is the AI management-system standard an organisation can be certified against. SR 11-7 imports model risk management from banking: validation, monitoring, and change control.",
          "They read differently but ask the same three things: can you trace a decision, can you measure the system's behaviour, and can you control changes to it. Observability is the evidence layer for all three. Traces and the audit trail are traceability. Evals, drift, and SLOs are measurement. Eval gates, versioned releases, and rollback are control. The frameworks don't demand new instrumentation; they demand that the instrumentation you have is governed, owned, and reviewable.",
          "The mistake is treating governance as a compliance checklist appended at the end. It's a system-lifecycle posture: who owns each signal, what the review cadence is, what triggers a rollback, and where the evidence lives. Build that posture once, and the four frameworks become different lenses on the same operating system rather than four separate audits.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt: "What do the EU AI Act's high-risk duties (traceability, oversight, auditability) map to in your stack?",
            choices: [
              { id: "a", label: "Nothing — they're aspirational" },
              { id: "b", label: "Traces + audit trail (traceability/auditability) and quality SLOs (oversight)" },
              { id: "c", label: "A faster model" },
              { id: "d", label: "More front-end logging" },
            ],
            answer: "b",
            explanation:
              "Your observability pipeline already produces the evidence: traces reconstruct decisions, the audit trail records access, and SLOs feed human oversight.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt: "In NIST AI RMF terms, your eval and drift signals belong to which function?",
            choices: [
              { id: "a", label: "Govern" },
              { id: "b", label: "Measure" },
              { id: "c", label: "Map" },
              { id: "d", label: "Ignore" },
            ],
            answer: "b",
            explanation:
              "Measure is the function that assesses the system — exactly what eval, drift, and SLO signals do. Alerts and rollback are Manage; ownership is Govern.",
          },
          {
            id: "q3",
            kind: "mcq",
            prompt: "Treating governance as a 'checklist at the end' fails because:",
            choices: [
              { id: "a", label: "Checklists are too short" },
              { id: "b", label: "It's a lifecycle posture (ownership, cadence, rollback, evidence), not a one-time artefact" },
              { id: "c", label: "Auditors dislike lists" },
              { id: "d", label: "It's illegal to use checklists" },
            ],
            answer: "b",
            explanation:
              "Governance is how you operate continuously — who owns what, what's reviewed, when you roll back. A checklist can't substitute for an operating posture.",
          },
        ],
        application: {
          title: "Map one framework to your pipeline",
          prompt:
            "Pick one framework (EU AI Act, NIST AI RMF, ISO 42001, or SR 11-7). For each of its core requirements, name the concrete part of your observability pipeline that serves as evidence, and the owner.",
        },
      },
      {
        slug: "evaluation-systems-not-one-score",
        title: "Evaluation systems, not one score",
        blurb: "Representative, repeatable, agreed, calibrated, intervalled, drift-watched.",
        topic: "evaluation-and-drift",
        skillIds: ["llm-judge", "eval-bias"],
        capability: "Build a trustworthy evaluation system rather than trust a single tidy score.",
        minutes: 11,
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the visual: your eval score moved from 92 to 90. What's missing before you act on it?",
          choices: [
            { id: "a", label: "A bigger model" },
            { id: "b", label: "A confidence interval — a 2-point move might be noise" },
            { id: "c", label: "More logs" },
            { id: "d", label: "A new vendor" },
          ],
          answer: "b",
          explanation:
            "Without a confidence interval, a 2-point move is indistinguishable from sampling noise. Report intervals so you don't chase ghosts.",
        },
        prose: [
          "A single tidy score is comforting and almost meaningless. Trustworthy evaluation is a system with six parts: a representative task suite that mirrors real usage, a repeatable rubric that gives the same answer twice, inter-rater agreement (Cohen's κ) that proves two raters concur, a calibrated judge measured against humans, confidence intervals that separate signal from noise, and distribution-shift watch that catches the mean holding while the shape changes.",
          "Each part plugs a specific failure. A stale suite passes everything. A vague rubric adds noise that swamps real change. Low κ means the score is a coin flip. An uncalibrated judge inherits biases. Missing intervals make you chase noise. And a stable mean can hide a distribution growing bimodal — more 1s and 5s, fewer 3s — which is a real regression the average conceals.",
          "The discipline is to ship the system, not the score. Report intervals alongside means, show distributions not just averages, and track κ and judge-agreement over time. When a release 'improves' the score by a point, the first question is whether the interval even excludes the previous value — and if the distribution shifted, which direction helped and which hurt.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt: "Cohen's κ tells you:",
            choices: [
              { id: "a", label: "The model's parameter count" },
              { id: "b", label: "Whether two raters agree enough that the score is meaningful" },
              { id: "c", label: "The latency p99" },
              { id: "d", label: "The cost per token" },
            ],
            answer: "b",
            explanation:
              "κ measures agreement beyond chance. Below ~0.6, rater disagreement is large enough that the score itself is unreliable.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt: "The mean quality score is stable, but the distribution is growing bimodal. This indicates:",
            choices: [
              { id: "a", label: "Nothing — the mean is fine" },
              { id: "b", label: "A real regression the average is hiding" },
              { id: "c", label: "A faster model" },
              { id: "d", label: "Lower cost" },
            ],
            answer: "b",
            explanation:
              "More extreme scores at both ends while the mean holds means the system is getting less consistent — a regression you'd miss watching only the average.",
          },
          {
            id: "q3",
            kind: "mcq",
            prompt: "Why pair every eval score with a confidence interval?",
            choices: [
              { id: "a", label: "It's required by OTel" },
              { id: "b", label: "So small moves can be told apart from sampling noise before anyone acts" },
              { id: "c", label: "To make dashboards busier" },
              { id: "d", label: "To increase cost" },
            ],
            answer: "b",
            explanation:
              "Intervals quantify uncertainty. A 2-point change inside the interval is noise; outside it, it's signal worth investigating.",
          },
        ],
        application: {
          title: "Audit your eval system",
          prompt:
            "Score your evaluation against the six parts (suite, rubric, κ, judge calibration, intervals, distribution watch). For each gap, write the smallest change that would close it.",
        },
      },
      {
        slug: "detecting-drift-regressions",
        title: "Detecting drift and regressions",
        blurb: "Distributions move before averages do.",
        topic: "evaluation-and-drift",
        skillIds: ["model-drift", "llm-drift"],
        capability: "Catch input, output, and retrieval drift in distributions before averages move.",
        minutes: 11,
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the visual: input drift (PSI) has crossed 0.20 but the mean quality is unchanged. What's true?",
          choices: [
            { id: "a", label: "There's no problem" },
            { id: "b", label: "The input distribution shifted; a regression is likely coming even though the mean lags" },
            { id: "c", label: "PSI is irrelevant" },
            { id: "d", label: "The model improved" },
          ],
          answer: "b",
          explanation:
            "Drift shows up in distributions before averages. A PSI over 0.20 means the inputs your system sees have materially changed — the mean just hasn't caught up yet.",
        },
        prose: [
          "Drift in generative systems is distributional, and distributions move before averages do. Input drift — measured by metrics like the population stability index (PSI) — tells you the prompts your system sees have changed, even if average quality hasn't. Output drift tells you the shape of the answers is changing. Retrieval drift tells you the context being surfaced is moving. All three can cross a threshold while the mean score looks perfectly healthy.",
          "This is why a change-point, not a threshold on the mean, is the right detection primitive. Sequential monitoring watches the distribution over time and flags the moment it shifts relative to a cohort-aware baseline. A global baseline hides region or cohort-specific drift; baselines per cohort catch a degradation that's real in one segment and invisible in the aggregate.",
          "The practical implication: watch distributions, not just means, and set baselines per cohort. The mean is the last signal to move; by the time it drops, users have already felt the drift for days. Distribution metrics give you the leading indicator that lets you act before the mean confirms the problem.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt: "Why watch PSI (input drift) rather than just the mean quality score?",
            choices: [
              { id: "a", label: "PSI is cheaper to compute" },
              { id: "b", label: "PSI moves first — inputs shift before quality averages drop" },
              { id: "c", label: "Means are illegal" },
              { id: "d", label: "PSI improves accuracy" },
            ],
            answer: "b",
            explanation:
              "The mean is a lagging indicator. PSI catches the input distribution changing before that change propagates into a measurable quality drop.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt: "A global drift baseline can hide:",
            choices: [
              { id: "a", label: "Lower cost" },
              { id: "b", label: "Drift concentrated in one region or cohort that's invisible in the aggregate" },
              { id: "c", label: "Faster latency" },
              { id: "d", label: "Better quality" },
            ],
            answer: "b",
            explanation:
              "Aggregation dilutes local drift. Cohort-aware baselines catch a segment-specific regression that a global metric averages away.",
          },
          {
            id: "q3",
            kind: "mcq",
            prompt: "A change-point detector is preferred over a static mean-threshold because it:",
            choices: [
              { id: "a", label: "Uses less memory" },
              { id: "b", label: "Flags the moment a distribution shifts over time, not a fixed line crossed" },
              { id: "c", label: "Is required by GDPR" },
              { id: "d", label: "Improves accuracy" },
            ],
            answer: "b",
            explanation:
              "Change-point detection is temporal and distributional — it spots a shift relative to a baseline, which is what drift actually is, rather than waiting for a static average to cross a line.",
          },
        ],
        application: {
          title: "Set three drift baselines",
          prompt:
            "For your system, define the input (PSI), output, and retrieval drift metrics you'd watch, the cohort slices you'd baseline separately, and the change-point threshold that would trigger investigation.",
        },
      },
      {
        slug: "causal-diagnosis-experimentation",
        title: "Causal diagnosis and experimentation",
        blurb: "Correlation gives suspects; experiments give causes.",
        topic: "diagnosis-and-agents",
        skillIds: ["eval-gates"],
        capability: "Establish cause with feature flags, canaries, shadow traffic, and holdouts.",
        minutes: 11,
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the visual: quality dropped the same week a new model shipped. The naive call is to roll back the model. Why might that be wrong?",
          choices: [
            { id: "a", label: "Models can't regress" },
            { id: "b", label: "Something else shipped the same week — correlation isn't cause" },
            { id: "c", label: "Quality never drops" },
            { id: "d", label: "Rollbacks are free" },
          ],
          answer: "b",
          explanation:
            "Two changes in one week give you a suspect, not a cause. Without a controlled comparison, you blame the wrong variable and fix nothing.",
        },
        prose: [
          "Correlation gives suspects; experiments give causes. When a regression coincides with a release, the tempting move — roll back the most visible change — often fixes nothing, because the real cause was a second change shipped the same day. The disciplined alternative is to isolate the variable with a controlled experiment.",
          "The toolkit is feature flags, canaries, shadow traffic, and holdouts. Feature-flag the candidate so you can turn it off instantly and so on/off cohorts are comparable. Canary to a small slice of traffic so a regression's blast radius is bounded. Shadow traffic runs the new path without serving it, surfacing failures before users see them. A holdout keeps a cohort permanently on the old version so you always have a clean comparison for the metric that matters.",
          "The discipline is to compare flag-on versus flag-off on the same metric, with the same judge and the same interval, before you act. If the candidate loses on the controlled comparison, you've found the cause — roll it back. If it wins, ship it. Either way you acted on evidence, not on the coincidence of a calendar.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt: "What does a feature flag give you that a direct deploy doesn't?",
            choices: [
              { id: "a", label: "Faster model" },
              { id: "b", label: "An instant off-switch and a comparable on/off cohort" },
              { id: "c", label: "Lower cost" },
              { id: "d", label: "Better UI" },
            ],
            answer: "b",
            explanation:
              "A flag lets you kill a bad change instantly and compare the cohort with the flag on against the cohort with it off — the basis for a causal read.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt: "Shadow traffic is useful because it:",
            choices: [
              { id: "a", label: "Serves users faster" },
              { id: "b", label: "Exercises the new path on real requests without showing users the result" },
              { id: "c", label: "Removes the need for evals" },
              { id: "d", label: "Reduces latency" },
            ],
            answer: "b",
            explanation:
              "Shadow runs the candidate alongside production without serving its output, so failures surface in telemetry before any user is exposed.",
          },
          {
            id: "q3",
            kind: "mcq",
            prompt: "A permanent holdout cohort exists so that you always have:",
            choices: [
              { id: "a", label: "Cheaper traffic" },
              { id: "b", label: "A clean baseline to compare the current version against" },
              { id: "c", label: "Fewer users" },
              { id: "d", label: "Lower latency" },
            ],
            answer: "b",
            explanation:
              "A holdout stays on the old version, giving you a standing comparison group so the metric impact of a change is always measurable against a known baseline.",
          },
        ],
        application: {
          title: "Design the experiment",
          prompt:
            "A regression appeared with release v17. Describe the feature-flag + canary + holdout experiment you'd run to confirm or refute that v17 caused it, including the metric, the judge, and the decision threshold.",
        },
      },
      {
        slug: "agent-tool-observability",
        title: "Agent and tool-use observability",
        blurb: "Observe the graph — tools, loops, budgets, MCP — not just the LLM node.",
        topic: "diagnosis-and-agents",
        skillIds: ["agent-tracing", "mcp-observability"],
        capability: "Observe the agent graph: tool calls, loops, budgets, state transitions, and MCP spans.",
        minutes: 11,
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the visual: an agent's outputs have degraded but each LLM call looks fine. Where does the problem likely live?",
          choices: [
            { id: "a", label: "The model weights" },
            { id: "b", label: "The agent graph — tool failures, loops, or budget exhaustion between calls" },
            { id: "c", label: "The dashboard" },
            { id: "d", label: "The front-end" },
          ],
          answer: "b",
          explanation:
            "Per-call metrics miss the graph. A tool that 502s or a loop that retries until the budget dies looks fine call-by-call but breaks the task. Observe the graph.",
        },
        prose: [
          "An agent is not one LLM call; it's a graph of calls, tools, and state. Plain LLM observability watches the node — the model's latency and tokens — and misses the edges: which tool was called, whether it succeeded, how many times the agent retried, whether it hit a budget, and how the call-graph shape changed. Agent reliability lives in the graph, not the node.",
          "The agent-specific signals are tool-call success per tool, loop and retry depth, budget exhaustion, state transitions, MCP spans across servers, and trace-graph anomalies. Climbing retry depth is the leading indicator of a stuck agent. Budget exhaustion mid-task produces truncated, low-quality outputs that look like model failures. A novel cycle in the call graph is often a bug before it's an outage.",
          "Each tool call — including Model Context Protocol calls across servers — needs its own span, attributed to the agent goal that spawned it. Without that attribution you can't say which agent, using which tool, on which server, burned the budget or looped. The unit of diagnosis is the task span parenting its children, not the individual completion.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt: "Climbing retry depth is a leading indicator of:",
            choices: [
              { id: "a", label: "A faster agent" },
              { id: "b", label: "A stuck agent before it fully fails" },
              { id: "c", label: "Lower cost" },
              { id: "d", label: "Better answers" },
            ],
            answer: "b",
            explanation:
              "Retries climbing means the agent isn't converging. Catch it early and you intervene before the task exhausts its budget or times out.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt: "Why attribute each tool span to the agent task that spawned it?",
            choices: [
              { id: "a", label: "For billing only" },
              { id: "b", label: "So you can diagnose which agent + tool + server caused a budget or loop problem" },
              { id: "c", label: "It's required by law" },
              { id: "d", label: "To slow the agent down" },
            ],
            answer: "b",
            explanation:
              "Attribution links a tool failure or budget burn back to the responsible agent goal. Without it, you see a failed tool but can't say which task it broke.",
          },
          {
            id: "q3",
            kind: "mcq",
            prompt: "A novel cycle in the agent's call graph is best treated as:",
            choices: [
              { id: "a", label: "An optimisation" },
              { id: "b", label: "A bug signal — often a problem before it becomes an outage" },
              { id: "c", label: "Irrelevant" },
              { id: "d", label: "A cost saving" },
            ],
            answer: "b",
            explanation:
              "Call-graph shape is a signal. A new cycle the agent didn't exhibit before usually means a logic change that will eventually waste budget or loop forever.",
          },
        ],
        application: {
          title: "Instrument the graph",
          prompt:
            "For a multi-agent system, list the spans you'd emit per task (task span, tool spans, MCP spans) and the graph-level metrics you'd alert on (retry depth, budget exhaustion, new cycles). Name the leading indicator you'd watch first.",
        },
      },
      {
        slug: "reliability-objectives-error-budgets",
        title: "Reliability objectives and error budgets",
        blurb: "A portfolio of SLOs with one non-negotiable safety gate.",
        topic: "operation",
        skillIds: ["ai-slo"],
        capability: "Hold a portfolio of SLOs with a non-negotiable safety gate and resolve conflicts via budgets.",
        minutes: 11,
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the visual: you cut cost by routing to a cheaper model and quality drops. What does this reveal?",
          choices: [
            { id: "a", label: "SLOs are independent" },
            { id: "b", label: "SLOs conflict — cost vs quality must be resolved explicitly" },
            { id: "c", label: "Quality is free" },
            { id: "d", label: "Cost can't be measured" },
          ],
          answer: "b",
          explanation:
            "SLOs trade off. Optimising cost moved quality. The conflicts must be resolved with explicit targets and gates, not vibes.",
        },
        prose: [
          "An AI feature has several reliability objectives at once: availability, latency, quality, cost, and safety. They conflict. Routing to a cheaper model cuts cost but often drops quality and changes latency. Chasing quality raises cost. The naive stance — optimise one — silently degrades the others. A portfolio makes the trade-offs explicit.",
          "Error budgets resolve the conflicts. Each objective gets a target and a budget; you ship while budgets allow and freeze when they burn. The exception is safety, which is a gate rather than a budget: a safety regression blocks a release regardless of how much cost or quality budget remains. Treating safety as negotiable is how systems get harmful outputs into production.",
          "The release gate is where the portfolio becomes operational. A candidate must beat or match the incumbent on the measured objectives — quality on the golden set, cost within budget, latency within SLO — and pass the safety gate, before it ships. Conflicts are resolved at the gate with evidence, not in a meeting after the regression has already reached users.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt: "Why is safety a 'gate' rather than a 'budget'?",
            choices: [
              { id: "a", label: "Safety is easy" },
              { id: "b", label: "Safety regressions block release outright — you don't spend an 'allowed amount of harm'" },
              { id: "c", label: "Budgets are illegal" },
              { id: "d", label: "Safety can't be measured" },
            ],
            answer: "b",
            explanation:
              "Latency or quality budgets tolerate some shortfall. Safety doesn't — a harmful-output regression must block the release, full stop.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt: "Routing to a cheaper model and watching quality drop demonstrates that:",
            choices: [
              { id: "a", label: "Cost and quality are unrelated" },
              { id: "b", label: "SLOs conflict and must be resolved with explicit targets" },
              { id: "c", label: "Quality is impossible" },
              { id: "d", label: "Cheaper is always better" },
            ],
            answer: "b",
            explanation:
              "The trade-off is the point: changing one objective moved another. A portfolio makes the relationship explicit so you choose the trade-off deliberately.",
          },
          {
            id: "q3",
            kind: "mcq",
            prompt: "The release gate resolves SLO conflicts by:",
            choices: [
              { id: "a", label: "Ignoring them" },
              { id: "b", label: "Requiring the candidate to meet every objective and the safety gate before shipping" },
              { id: "c", label: "Picking the cheapest option" },
              { id: "d", label: "Picking the highest quality" },
            ],
            answer: "b",
            explanation:
              "At the gate, the candidate must satisfy the portfolio (quality, cost, latency) and pass safety. Trade-offs are surfaced and decided with evidence before release.",
          },
        ],
        application: {
          title: "Define the SLO portfolio",
          prompt:
            "Write the SLO portfolio for your feature: the target and budget for availability, latency, quality, and cost, the safety gate that blocks release, and the rule for resolving a conflict between cost and quality.",
        },
      },
      {
        slug: "incident-command-learning-loop",
        title: "Incident command and the learning loop",
        blurb: "An incident is closed when its postmortem becomes a regression test.",
        topic: "operation",
        skillIds: ["ai-incident-response"],
        capability: "Run an AI incident end-to-end and close it with an automated regression test.",
        minutes: 11,
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the visual: an incident is mitigated and users are happy again. Is it closed?",
          choices: [
            { id: "a", label: "Yes — users are happy" },
            { id: "b", label: "No — it's closed when the postmortem becomes an automated regression test" },
            { id: "c", label: "Only on weekends" },
            { id: "d", label: "Only if the CEO says so" },
          ],
          answer: "b",
          explanation:
            "Mitigation ends the outage. The incident class is closed only when a regression test prevents the same failure from shipping again.",
        },
        prose: [
          "An AI incident has a lifecycle, and skipping the last step is what makes incidents repeat. Detect via a real signal — a burn-rate alert on quality, not just latency. Coordinate with a commander who owns the response and clear roles for comms, diagnosis, and fix. Mitigate by rolling back the changed variable first; live root-causing can wait, users can't.",
          "Communicate honestly and on a clock: what we know, what we're doing, the next update. Silence during an outage breeds worse narratives than the outage itself. After mitigation, hold a blameless postmortem — blameless on people, rigorous on systems — that reconstructs what happened, what we believed and why it was wrong, and the systemic fix.",
          "The learning loop closes when the postmortem's action becomes an automated regression test in CI. Without that step, the same change can reintroduce the same failure next quarter. An incident isn't closed when it's fixed; it's closed when the system has been changed so that specific failure can't recur.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt: "During an active incident, the right first technical action is usually to:",
            choices: [
              { id: "a", label: "Root-cause it live while users suffer" },
              { id: "b", label: "Mitigate — roll back the changed variable to stop user impact" },
              { id: "c", label: "Wait and see" },
              { id: "d", label: "Email everyone" },
            ],
            answer: "b",
            explanation:
              "Mitigation is for users; root-cause is for later. Roll back the suspect variable to stop the bleeding, then investigate from a stable system.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt: "A blameless postmortem is:",
            choices: [
              { id: "a", label: "Soft on accountability" },
              { id: "b", label: "Blameless on people, rigorous on systems and processes" },
              { id: "c", label: "Optional paperwork" },
              { id: "d", label: "A way to name a culprit" },
            ],
            answer: "b",
            explanation:
              "Blameless doesn't mean consequence-free; it means the analysis fixes systems, not individuals, so people report honestly and the real causes surface.",
          },
          {
            id: "q3",
            kind: "mcq",
            prompt: "What turns a one-time incident into a prevented class?",
            choices: [
              { id: "a", label: "A longer postmortem" },
              { id: "b", label: "An automated regression test in CI derived from the postmortem" },
              { id: "c", label: "A new dashboard" },
              { id: "d", label: "A meeting" },
            ],
            answer: "b",
            explanation:
              "A regression test encodes the failure into CI, so the same change can't ship again. That's the step that actually closes the incident class.",
          },
        ],
        application: {
          title: "Close a past incident properly",
          prompt:
            "Take an incident your team handled. Write the blameless postmortem (what happened, what we believed, the systemic fix) and the specific automated regression test that would have prevented it. If that test doesn't exist yet, that's the open action.",
        },
      },
      {
        slug: "capstone-design-review",
        title: "Capstone: production design review",
        blurb: "Observe quality, safety, and cost at scale — privately, gated, and auditable.",
        topic: "capstone",
        skillIds: ["ai-observability"],
        capability: "Defend an end-to-end observability design across cost, privacy, debuggability, release safety, and security.",
        minutes: 14,
        prediction: {
          id: "predict",
          kind: "mcq",
          prompt: "Before the visual: the central tension of observing a regulated multi-agent system is:",
          choices: [
            { id: "a", label: "Cost vs nothing" },
            { id: "b", label: "Observing quality/safety/cost thoroughly without exposing sensitive prompts" },
            { id: "c", label: "Speed vs speed" },
            { id: "d", label: "Models vs dashboards" },
          ],
          answer: "b",
          explanation:
            "The whole course resolves one tension: see enough to operate the system reliably, while keeping the sensitive data that flows through it private and governed.",
        },
        prose: [
          "The capstone asks you to defend a complete design for the multi-agent financial system across every axis the course covered: privacy, cost, debuggability, release safety, and security. The naive design logs raw prompts across regions, samples at 100%, watches only the model, ships by hope, and detects no attacks. It's both a breach surface and a debugging dead-end.",
          "The hardened design redacts at ingest, enforces EU residency, and isolates tenants; it tail-samples and caps cardinality; it traces the agent graph including MCP; it gates releases behind evals and canaries; and it reads the OWASP signals and measures its guardrail's attack-success rate. Each choice is a contract owned by a specific layer, and together they resolve the central tension — the system is observable and safe to operate.",
          "That is the enterprise bar this course builds toward: prove you can trace every decision, measure quality and safety continuously, control every change through gates, and keep every sensitive payload private and audited. Observability, done at this level, is what turns a powerful AI system into a trustworthy one.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt: "The naive design fails on privacy primarily because it:",
            choices: [
              { id: "a", label: "Uses too few dashboards" },
              { id: "b", label: "Logs raw prompts across regions, becoming a breach surface" },
              { id: "c", label: "Is too cheap" },
              { id: "d", label: "Samples too little" },
            ],
            answer: "b",
            explanation:
              "Raw prompts persisted across regions without redaction or residency control make the telemetry store itself the liability the system was meant to avoid.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt: "Which combination closes the gap between 'observable' and 'safe to operate'?",
            choices: [
              { id: "a", label: "More dashboards" },
              { id: "b", label: "Redaction + residency + tail sampling + agent-graph tracing + eval gates + OWASP signal reads" },
              { id: "c", label: "A bigger model" },
              { id: "d", label: "Faster queries" },
            ],
            answer: "b",
            explanation:
              "Each axis the course covered must be addressed: privacy at ingest, cost via sampling/cardinality, debuggability via the graph, release safety via gates, security via detection reads.",
          },
          {
            id: "q3",
            kind: "mcq",
            prompt: "The enterprise bar this capstone sets is:",
            choices: [
              { id: "a", label: "Lowest cost possible" },
              { id: "b", label: "Trace, measure, control, and keep private+audited — observability that makes the system trustworthy" },
              { id: "c", label: "Fastest model" },
              { id: "d", label: "Most dashboards" },
            ],
            answer: "b",
            explanation:
              "Power without trust is a liability. The bar is an operating system that proves traceability, measurement, control, privacy, and auditability together.",
          },
        ],
        application: {
          title: "Defend your design",
          prompt:
            "Write a one-page design review for a regulated multi-agent AI system: the telemetry contract per stage, the privacy controls (redaction, residency, tenant isolation, RBAC, audit), the security signal reads (OWASP + guardrail ASR), the eval and SLO portfolio with the safety gate, and the release + incident process. End with the one axis you'd invest in first and why.",
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
