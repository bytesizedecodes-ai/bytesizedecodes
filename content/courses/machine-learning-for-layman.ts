import type { Course } from "../types";

const course: Course = {
    slug: "machine-learning-for-layman",
    title: "Machine Learning, Plainly",
    subtitle:
      "Pictures, everyday decisions, and the numbers you already read — machine learning from zero.",
    description:
      "This course explains what learning and machine learning really mean. It is built for recent graduates starting from zero. It uses plain words, everyday objects, and the counting and percentages you already know. Every lesson ends with a real situation to decide.",
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
          "That is learning in its simplest form: **experience changes how you respond next time**. It is not memorising instructions. It is **updating yourself from examples**.",
          "Keep that picture. Every machine-learning idea in this course is an attempt to copy it: give a system examples, and let **experience improve its next decision**.",
        ],
        concept: {
          anchor: "Think of a child spotting a few bikes, then naming every bike that rolls past — no rulebook needed.",
          what: "**Learning** means **experience changes how you respond next time** — you see examples, and future decisions get better because of them.",
          why: "It solves the problem of rules nobody can write. No one can list every rule for ‘what makes a bike’. But a handful of **labelled examples** teaches it for free.",
          where: [
            "A **child naming a bike** after seeing a few labelled examples",
            "Recognising a **friend’s face** in a crowd — no rulebook involved",
            "Guessing a **song from two notes** — past listening tunes the guess",
          ],
          whenNot:
            "It is not learning when nothing changes afterwards. **Repeating without updating** any future behaviour is replay, not learning.",
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
              "Repeating fixed answers is not learning — learning would let them handle new, similar questions. Machines can fail the same way. You will see this in the overfitting lesson (memorizing instead of understanding).",
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
          "That’s fine for calculators and timers. But try writing, by hand, the rule for ‘what makes this a car’. A strange **exception** breaks every rule you write — a three-wheeled car, a motorcycle with a roof.",
          "So the missing piece was not speed. It was the child’s method: **learning the rule from examples** instead of receiving it ready-made. That change — from hand-written rules to learned rules — is what makes **machine learning** different from ordinary programming.",
        ],
        concept: {
          anchor: "Imagine a clerk who follows the posted list perfectly — one odd-shaped parcel and the list is useless.",
          what: "**Traditional software follows fixed instructions** written in advance; **machine learning writes its own rules from examples**.",
          why: "Hand-written rules break on exceptions — three-wheeled cars, roofs on bikes. **Learned rules bend around messy reality** instead of breaking.",
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
              "The filter changes from feedback. The timer follows a fixed instruction — ten minutes, every time, no matter what you do.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A city tries to automate vehicle checks by hand-writing rules: 'a car has 4 wheels and a metal roof'. On day one, a three-wheeled delivery van and a motorcycle with a roof trailer both arrive. The rules sort both into the wrong group. What's the lesson?",
            choices: [
              { id: "a", label: "The cameras were too slow to photograph them" },
              { id: "b", label: "Every hand-written rule has real-world exceptions that break it" },
              { id: "c", label: "Vehicles simply can't be recognised by machines" },
            ],
            answer: "b",
            explanation:
              "Real categories are messy — three wheels, roofs on bikes, open trucks. Fixed rules break on these exceptions. Learning from examples bends around them.",
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
          "Here is the whole idea in one sentence: **machine learning is giving a machine examples instead of rules**. The machine finds the pattern itself.",
          "You still do important work — choosing the examples, and checking what it learns. But the **algorithm** does the detailed pattern-hunting. No one writes it by hand.",
          "This change explains everything that follows. A **‘model’** is just the pattern it found, stored in a form that can make new decisions.",
        ],
        concept: {
          anchor: "Instead of writing down what a dog looks like, you show a scrapbook of labelled dog photos.",
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
              "A photo-app team wants the machine to recognise cars. The programmer sets up the learning process and supplies a million labelled photos. But the programmer never writes a 'what is a car' rule. When the app later labels a photo correctly, who actually worked out the detailed pattern?",
            choices: [
              { id: "a", label: "The learning algorithm — it discovered the pattern from the examples" },
              { id: "b", label: "The programmer — the rules were hidden in the setup code" },
              { id: "c", label: "The user — their tap confirmed what a car is" },
            ],
            answer: "a",
            explanation:
              "A programmer defines the learning process. The model discovers the detailed pattern from the data. That change is the whole idea of ML.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "The app trains on those million labelled photos. Then it ships a file that instantly labels new pictures. The phone does not need the million photos. What is that file best thought of as?",
            choices: [
              { id: "a", label: "A person who decides what the machine should learn" },
              { id: "b", label: "The pattern the machine found, stored so it can make new decisions" },
              { id: "c", label: "A copy of all the examples it was shown" },
            ],
            answer: "b",
            explanation:
              "A model is not the data, and it is not a person. It is the pattern itself, stored and ready to use on new cases. It does not carry the whole dataset along.",
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
          "**Supervised learning**: examples with answers attached — a spam filter trained on millions of marked emails. **Unsupervised**: no answers at all, the machine groups by itself — shoppers sorted by habit nobody labelled. **Reinforcement**: no answers, just points after each action — a game bot that improves by winning or losing.",
          "Most of this course lives in the supervised family, because it’s the one behind everyday **classification**. But knowing all three lets you name the right tool when you meet a new problem.",
        ],
        concept: {
          anchor: "Learn a card game three ways at one table: peek at the answers, sort the cards yourself, or play for points.",
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
            prompt:
              "Priya is testing a game-playing bot at a hackathon. After every move, the game returns a score. No move is ever labelled ‘correct’. Which family is the bot learning by?",
            choices: [
              { id: "a", label: "Supervised — each score is a label on the move" },
              { id: "b", label: "Unsupervised — the bot groups its own moves" },
              { id: "c", label: "Reinforcement — reward after each action shapes the strategy" },
            ],
            answer: "c",
            explanation:
              "You might think a score is a ‘label’. But a label names each example’s correct answer, and nothing here does that. Feedback that arrives only as reward or penalty after an action is the sign of reinforcement learning.",
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
              "No answers are attached, and the goal is to discover structure — that is the sign of unsupervised learning. Supervised would need each review labelled in advance.",
          },
        ],
      },
      {
        slug: "supervised-learning-deep-dive",
        title: "Inside supervised learning",
        blurb: "Samples + labels → a learned rule → classification or regression.",
        topic: "layman-paradigms",
        skillIds: ["supervised-learning", "learning-paradigms"],
        capability: "Recognize labelled examples and distinguish classification from regression.",
        minutes: 5,
        prose: [
          "Supervised learning always has the same skeleton: **examples plus the right answers**. An algorithm learns the mapping from one to the other.",
          "The examples are called **samples**; the answers are **labels**. ‘This photo (sample) → car (label)’, a thousand times over.",
          "The learned mapping answers one of two kinds of question. If the answer is a category — car or bike, spam or not — it’s **classification**. If the answer is a number — a price, an age, a duration — it’s **regression**. Same skeleton, different output shape.",
        ],
        concept: {
          anchor: "Like flashcards with the answer on the back — see enough of them and you can answer new cards.",
          what: "**Supervised learning** feeds an algorithm **samples with labels attached**, so it learns the mapping from one to the other.",
          why: "Once the mapping is learned, it **answers new cases you have never seen**. That is why it powers everyday classification and prediction.",
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
              "A real-estate site shows you past sales. Each house is described by size and location. Each house is labelled with the price it actually sold for. The site then estimates your house's price in rupees. What kind of supervised problem is this?",
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
              "Your team must build a supervised spam classifier by Monday. One colleague gives you 10,000 emails with no markings. Another gives you 5,000 emails where users have already flagged each as junk or not. Which pile can you actually train on?",
            choices: [
              { id: "a", label: "The flagged 5,000 — each sample carries its label" },
              { id: "b", label: "The unmarked 10,000 — more data always wins" },
              { id: "c", label: "Either — supervised learning works on both" },
            ],
            answer: "a",
            explanation:
              "Supervised learning needs labels attached to samples. Unmarked emails belong to unsupervised learning. No amount of extra unmarked data fixes that.",
          },
        ],
      },
      {
        slug: "predicting-numbers",
        title: "Predicting a number, not a category",
        blurb: "Sometimes the answer isn't a bucket — it's a number on a scale.",
        topic: "layman-paradigms",
        skillIds: ["supervised-learning", "regression-basics"],
        capability: "Tell classification (which one) apart from regression (how much) and read a trend-line prediction.",
        minutes: 4,
        concept: {
          anchor: "Guessing the walk to school: every past walk is a pin on the kitchen map, and one string lies through the middle of them.",
          what: "Supervised learning answers two kinds of questions: **which one** (a category) and **how much** (a number). Predicting a number is called **regression**.",
          why: "Half the useful predictions in life are numbers, not buckets — **travel time, prices, temperatures**. A model that can only sort into categories can't answer them.",
          where: [
            "**Delivery apps** showing “arrives in 24 min”",
            "**Ride fares** estimated before you book",
            "**Weather forecasts** predicting tomorrow's temperature",
          ],
          whenNot:
            "Not regression when the answer is a **choice from fixed buckets** (spam or not, car or bike) — that's classification, even if the buckets look like numbers.",
        },
        prose: [
          "Every classifier you've met so far answers **which one?** — car or bike, spam or genuine. But many questions aren't choices at all. “How long will the trip take?” “What will this cost?” The answer is a **number**, anywhere on a scale.",
          "The method is the same one the whole course uses: **past examples**. Draw every past trip as a dot — distance across, minutes up — and a pattern appears: farther trips took longer. One smooth line through the middle of the dots captures the trend.",
          "To answer a new question, you don't guess — you **read the line**. A 10 km trip lands on the line at about 26 minutes. The model's whole job was learning where that line sits, from thousands of past trips.",
          "Reading the line is regression's whole job: **the number comes straight off the trend**, not out of a bucket — same skeleton, different kind of answer.",
        ],
        diagram: {
          kind: "decision",
          root: {
            kind: "decision",
            question: "What kind of answer does the task need?",
            branches: [
              {
                label: "a choice from fixed buckets",
                node: { kind: "leaf", answer: "Classification" },
              },
              {
                label: "a number on a scale",
                node: { kind: "leaf", answer: "Regression" },
              },
            ],
          },
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A food-delivery app wants to show “arrives in ~28 minutes” when a customer orders. It has years of past deliveries with the actual time each took. Is this classification or regression?",
            choices: [
              { id: "a", label: "Regression — minutes is a number on a scale, learned from past examples" },
              { id: "b", label: "Classification — deliveries are sorted into buckets" },
              { id: "c", label: "Neither — nobody can predict the future" },
            ],
            answer: "a",
            explanation:
              "The answer is a quantity (minutes), not a choice between buckets. It is learned from labelled past deliveries. That is regression — the number-predicting half of supervised learning.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A movie app asks: will this viewer click this trailer — yes or no? A weather service asks: how many millimetres of rain tomorrow? Which pairing is correct?",
            choices: [
              { id: "a", label: "Trailer click = classification (yes/no bucket); rain amount = regression (a number)" },
              { id: "b", label: "Trailer click = regression; rain amount = classification" },
              { id: "c", label: "Both are classification, because apps make choices" },
            ],
            answer: "a",
            explanation:
              "Yes/no is a two-bucket choice — classification. Millimetres is a number on a scale — regression. Same skeleton, different kind of answer.",
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
          "With only samples and no labels, unsupervised algorithms find groups (**clustering**). They also spot unusual **outliers**, or the few directions in which the data actually varies. Nobody told the machine what the groups are. It finds them.",
          "But there is one limit. The machine can name the groups it finds, but it **can’t tell you what the groups mean**. ‘Cluster 1 behaves like this’ — a human still has to look and say ‘ah, these are the weekend shoppers’.",
        ],
        concept: {
          anchor: "Dump a pile of laundry on the bed and sort it into stacks no one named for you.",
          what: "**Unsupervised learning** gets samples with **no labels** and finds the structure — groups, outliers, patterns — on its own.",
          why: "It works where **labelling is impossible or expensive**. It reveals structure in data nobody thought to mark.",
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
              "Maya's grocery chain sorts its shoppers into segments by buying habits alone. No one tagged any shopper ‘budget buyer’ or ‘weekly bulk’ in advance. Which family is this?",
            choices: [
              { id: "a", label: "Supervised, because shoppers end up categorised" },
              { id: "b", label: "Unsupervised, because no labels were given" },
              { id: "c", label: "Reinforcement, because habits change over time" },
            ],
            answer: "b",
            explanation:
              "You might want to call any output a ‘category’ and say supervised. But supervised needs answers attached to examples in advance. With none, discovering groups (clustering) is unsupervised learning.",
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
          anchor: "Like teaching a puppy with treats — it tries things, and the treats shape which tricks it repeats.",
          what: "**Reinforcement learning** is an **agent acting, the world answering with reward or penalty**, and the agent’s strategy improving with every attempt.",
          why: "It learns **sequences of decisions** no one can label in advance — the only family that improves by trial and error.",
          where: [
            "**Game agents** improving through wins and losses",
            "**Robot control** — walking, grasping — shaped by reward",
            "**Recommendation tuning** against watch-time or click reward",
          ],
          whenNot:
            "Be careful when the **reward can’t capture what you actually mean**. The agent optimises the reward you gave — including its loopholes. And if a single labelled answer exists, supervised is the simpler tool.",
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
              "A robotics team's walker bot is rewarded for every second it stays upright. It is penalised whenever it falls. No one labels any joint movement ‘correct’. Which family is this?",
            choices: [
              { id: "a", label: "Supervised, because it improves over time" },
              { id: "b", label: "Unsupervised, because there is no teacher" },
              { id: "c", label: "Reinforcement, because reward and penalty shape its strategy" },
            ],
            answer: "c",
            explanation:
              "Improving over time is not what marks supervised learning — labels are. Feedback that arrives only as reward or penalty after actions is exactly the reinforcement setup.",
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
              "The agent optimises the reward it was given — watch time — not the goal behind it. The values you care about enter through reward design.",
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
          "Not every feature helps. A feature is useful only if it **separates the classes** — colour doesn’t, because cars and bikes come in every colour.",
        ],
        concept: {
          anchor: "A machine meets a car the way a form does: four wheels, roof height, one number per line.",
          what: "A machine can’t see objects — it reads **numbers**. Each object becomes a **feature vector**: a fixed, ordered list of measurements.",
          why: "**All learning depends on this translation** — good features separate the classes; useless ones bury the signal.",
          where: [
            "A car as one row on a form: **4 wheels · 1.5 m tall · 1,300 kg weight (how heavy it is)**",
            "**Spam filters** turning emails into word-count vectors",
            "**Face unlock** turning faces into measurement patterns",
          ],
          whenNot:
            "A feature is useful **only if it separates the classes**. Colour doesn’t — red bikes and red cars are about equally common, so colour splits nothing. It is noise, not a feature.",
        },
        diagram: {
          kind: "flow",
          steps: [
            { kind: "input", text: "A real object", caption: "a car at the booth" },
            { kind: "process", text: "Fill the form: one measurement per feature", caption: "wheels · height · weight" },
            { kind: "output", text: "One row of numbers", caption: "the sample every model reads" },
          ],
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
              "A feature is useful only if it separates the classes. Colour doesn't — both classes come in red, blue, black — so it adds noise, not signal.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "One car's row on the form reads: 4 wheels · 1.5 m tall · 1,300 kg. What makes this a usable ‘sample’ for learning?",
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
        blurb: "Count the old cases → pick the more likely class → a working decision rule.",
        topic: "layman-first-model",
        skillIds: ["classification-basics", "supervised-learning"],
        capability: "Build a classifier by counting outcomes and picking the more likely class.",
        minutes: 5,
        prose: [
          "Once your samples are vectors with labels, you can build your first classifier with nothing more than **counting**.",
          "Look at all the 4-wheel examples: if every one is a car, then a new 4-wheel sample is almost certainly a car too. That **‘probability from counting’** is the whole rule.",
          "Pick the class that’s **more likely given the feature**, and you have a working classifier — built from scratch, with nothing but counting.",
        ],
        concept: {
          anchor: "Count the old cases — if every four-wheel drawing was a car, the next four-wheeler probably is too.",
          what: "Your first classifier is pure **counting**: look at past examples with the same feature value and **pick the more likely class**.",
          why: "With nothing but counting you get a working, **likelihood-based decision rule**. Every later classifier builds on it.",
          where: [
            "4 wheels → in your data, always a **car**",
            "**Medical screening** from how often symptoms led to a diagnosis",
            "**Weather guessing** from how similar days turned out",
          ],
          whenNot:
            "Counting fails when the data is **thin or mixed**. A 90/10 split gives odds, not certainty. And a feature value you’ve never seen gives no answer at all.",
        },
        diagram: {
          kind: "flow",
          steps: [
            { kind: "input", text: "Old labelled cases", caption: "every 2-wheel one was a bike" },
            { kind: "process", text: "Count: which class won for this feature value?", caption: "the more likely class" },
            { kind: "output", text: "New sample takes that class", caption: "odds, not certainty" },
          ],
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Aarav's toll-booth records show every 4-wheel vehicle so far was a car, and every 2-wheel one a bike. A new 2-wheel vehicle drives up. What should his counting classifier say?",
            choices: [
              { id: "a", label: "Car — it might be one" },
              { id: "b", label: "Bike — every 2-wheel case so far was a bike" },
              { id: "c", label: "Unsure — ask for more features" },
            ],
            answer: "b",
            explanation:
              "Counting the past cases: 2 wheels went with a bike 100 times out of 100. ‘It might be a car’ is exactly what the counts cannot support. Every 2-wheel example on file says bike.",
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
              "Counting gives you odds, not guarantees. The more-likely class wins the call, but the 90/10 split means you could still be wrong.",
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
          anchor: "Twenty Questions: one answer narrows it a bit, a second good question settles it.",
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
              "Meera's booth classifier is only about 75% sure about a batch of vehicles using wheel count alone. What most reliably fixes the ambiguity?",
            choices: [
              { id: "a", label: "Collect more samples of the same single feature" },
              { id: "b", label: "Add a second good feature, like Height" },
              { id: "c", label: "Remove the wheel-count feature entirely" },
            ],
            answer: "b",
            explanation:
              "More samples of the same feature sharpen the same 75/25 view. The mix is the feature's limit, not the sample count. A second, different feature gives the model a genuinely new question to ask.",
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
              "Good features add genuinely different information. Colours are noise, and ‘round parts’ mostly repeats wheel count. Engine size and seat height give the model a new view.",
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
          anchor: "To label the new kid, ask the five classmates they sit closest to and go with the majority answer.",
          what: "**k-Nearest Neighbors (kNN)** classifies a new sample by a **majority vote among its k closest, most similar examples**.",
          why: "There is no model-building step at all — **the data is the model**. Simple, and surprisingly effective.",
          where: [
            "**Recommendations** — ‘people similar to you’ is kNN, literally",
            "**Fraud flags** raised from the most similar past transactions",
            "Boundary calls — votes decide even a **3-to-2 contest**",
          ],
          whenNot:
            "It’s slow at scale. A new sample is compared against all **10,000 past examples, every single time**, instead of just 5. It is also unreliable when the nearest neighbours are **noisy or uninformative**.",
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
              "Dev's booth camera logs one new vehicle. Among its 5 most similar past examples, 3 are cars and 2 are bikes. What class does kNN assign?",
            choices: [
              { id: "a", label: "Bike, because there are bikes nearby" },
              { id: "b", label: "Car, because the majority (3 of 5) are cars" },
              { id: "c", label: "Unsure — ask for more neighbors" },
            ],
            answer: "b",
            explanation:
              "kNN takes a majority vote among the closest neighbours. 3 cars beats 2 bikes, so the class is car. ‘There are bikes nearby’ misses the point — the count decides, not proximity alone.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A vehicle lands right at the boundary between a car cluster and a bike cluster in Ravi's data. Why does kNN still give an answer?",
            choices: [
              { id: "a", label: "It refuses to classify boundary samples" },
              { id: "b", label: "It counts the votes of the k nearest neighbours, however close the contest — the majority still wins" },
              { id: "c", label: "It chooses whichever class appeared first in the data" },
            ],
            answer: "b",
            explanation:
              "kNN is a vote, not a judge of confidence. Even a 3-2 contest produces a winner. (In real systems, treat a near-tie vote with caution.)",
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
          anchor: "Each club has a typical member; you join whichever typical member you're most like.",
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
              "In Lena's depot system, a new vehicle measures closer to the car class's average member than to the bike class's average. What does her centroid classifier decide?",
            choices: [
              { id: "a", label: "Bike, because some bikes are nearby" },
              { id: "b", label: "Car, because it’s nearest the car center" },
              { id: "c", label: "Compare it to every single sample first" },
            ],
            answer: "b",
            explanation:
              "The centroid classifier compares the sample only to each class’s average (center). The nearest center wins, so it’s a car. ‘Some bikes are nearby’ would be kNN's logic. One average per class is all this classifier ever looks at.",
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
              "Averages describe the typical, not the odd. kNN could still find the few trike-like neighbours. The single-centre shortcut can’t.",
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
          anchor: "A flowchart on the fridge: check the sky, check the humidity, follow the arrows to play or stay home.",
          what: "A **decision tree** is a list of **if/then questions drawn as a path** — start at the top, answer each one, land on a prediction.",
          why: "The tree **explains itself**: you can read the exact branch path behind any answer. That makes it the most explainable classifier you’ll meet.",
          where: [
            "**‘Sunny and humid → no tennis’** as a walkable branch",
            "**Triage questionnaires** — three answers, one verdict",
            "**Loan rules** auditors can check branch by branch",
          ],
          whenNot:
            "A poor fit when features are **smooth numbers with no natural yes/no questions**. And deep trees risk **memorising noise** — overfitting (memorizing instead of understanding), covered later in the course.",
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
              "Using the tennis tree from the lesson, Maya checks Saturday: the outlook is sunny and the humidity is high. What outcome does the tree walk her to?",
            choices: [
              { id: "a", label: "Play — sunny days are usually fine" },
              { id: "b", label: "No play — sunny + high humidity lands on the no-leaf" },
              { id: "c", label: "Ask another question first" },
            ],
            answer: "b",
            explanation:
              "Walking the tree: start at Outlook — sunny; then Humidity — high; the leaf says ‘No play’. Reading the branch path IS the rule — the tree and the if/then list give the same answer.",
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
          "That purity has a name — **information gain** (how much a question untangles the classes). The idea needs no formula. The best question is simply the one that untangles the classes the most.",
        ],
        concept: {
          anchor: "Sorting toys into two boxes, pick the question that leaves each box holding mostly one kind.",
          what: "When a tree asks a question it **splits the data**; the best split leaves each branch **mostly one class — ‘pure’**.",
          why: "The tree-building rule — **always pick the purest split** — is how the tree decides which question to ask first, no formula needed.",
          where: [
            "‘Wheel count?’ **untangles** cars from bikes in one cut",
            "‘Humidity?’ settles tennis days cleanly",
            "A **50/50-everywhere split** is useless — discard it",
          ],
          whenNot:
            "A split is useful **only if it purifies**. A split that leaves both sides equally mixed answers nothing, however sensible the question sounds.",
        },
        diagram: {
          kind: "decision",
          root: {
            kind: "decision",
            question: "Which question splits the data best?",
            branches: [
              {
                label: "each side one class",
                node: { kind: "leaf", answer: "Use it first", caption: "purity is the whole measure" },
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
              "Aisha's tree builder can ask one of two questions first. One leaves both sides evenly mixed play/no-play. The other leaves each side all-play or all-no-play. Which does it prefer?",
            choices: [
              { id: "a", label: "The mixed one — balance means more information" },
              { id: "b", label: "The pure one — each side is decided" },
              { id: "c", label: "Either — purity does not matter" },
            ],
            answer: "b",
            explanation:
              "It's tempting to read a ‘balanced’ split as informative. But a 50/50 mix answers nothing on either side. A pure split is preferred. That purity is what **information gain** (how much a question untangles the classes) measures.",
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
          anchor: "Study from one workbook, but get graded on a fresh exam paper the teacher kept sealed.",
          what: "**Split the data**: a training pile to learn from, and a **sealed test pile** the model never sees — grade only on the test.",
          why: "Scoring the studied material measures **memory**; only unseen data measures whether the model **generalizes**.",
          where: [
            "A **fresh exam paper** vs. the one the student revised",
            "A model at **100% on training, 60% on test** — 60 is the honest score",
            "Serious teams keep a **final holdout** nobody touches",
          ],
          whenNot:
            "The test score stays meaningful **only while the test stays sealed**. Every peek and every tweak quietly turns the exam into study material.",
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
          "Suppose you grade a student on the exact exam questions they studied. You learn nothing about whether they understood the ideas. You only learn whether they **memorized**.",
          "The fix is to split your data: a **training pile** the model learns from, and a separate **test pile** it never sees. Only the test score tells you if it **generalizes**.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Your model scores 100% on the data it trained on, but only 60% on new data. What is the honest conclusion?",
            choices: [
              { id: "a", label: "It's a great model — 100% is the real score" },
              { id: "b", label: "60% on unseen data is the honest measure; 100% may be memorization" },
              { id: "c", label: "It's broken and should be deleted" },
            ],
            answer: "b",
            explanation:
              "The test-set score reflects real-world performance. A perfect training score can mean it memorized rather than learned.",
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
              "Peeking and adjusting turns the exam into study material. The score stops predicting real-world behaviour. This is why serious teams keep a final holdout that nobody tunes against.",
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
          anchor: "A student who drills last year's paper word-for-word aces it — then meets this year's questions.",
          what: "**Overfitting** (memorizing instead of understanding) is learning the training data **too precisely** — every quirk and noise — and failing on anything new.",
          why: "It’s the gap between the **memoriser and the understander**: perfect scores on old papers, poor results on fresh questions. It is the most common way good-looking models fail.",
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
          "It's the difference between a student who **memorized** past exams and one who **understood** the ideas. The memorizer scores full marks on the old papers. Then the memorizer fails a fresh question.",
          "The goal is the right balance: **simple enough to generalize, complex enough to capture the real pattern**.",
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
              "Consistent train and test scores mean the model learned a real pattern. A perfect training score with a poor test score is a classic sign of overfitting.",
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
          anchor: "Cook with stale ingredients and even the best chef serves a bad meal — the shopping matters more.",
          what: "**Garbage in, garbage out**: the data — not the algorithm — is the **single biggest influence** on what a model learns.",
          why: "A model trained on a **narrow or biased slice** of the world judges the whole world through that slice.",
          where: [
            "A model that only saw **red cars** fails on a blue one",
            "**Hiring models** reproducing past demographic bias",
            "**Face unlock** failing on faces it never trained on",
          ],
          whenNot:
            "Don’t go for a fancier algorithm **before auditing the data**. Most classifier problems are really data problems in disguise.",
        },
        diagram: {
          kind: "flow",
          steps: [
            { kind: "input", text: "Training data: a narrow or biased slice", caption: "only red cars, one demographic" },
            { kind: "process", text: "Model learns the slice faithfully", caption: "it can only learn what it saw" },
            { kind: "output", text: "Skewed predictions on the real world", caption: "blue cars misread · bias reproduced" },
          ],
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
              "Most classifier problems are really data problems in disguise. Fix the examples and the features before you try a fancier model.",
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
          anchor: "Your phone is quietly full of apprentices — a junk-mail sorter, a keyboard that guesses, a camera that knows your face.",
          what: "You already use ML **dozens of times a day** — spam filters, keyboards, face unlock, maps — most of it invisible.",
          why: "Each one runs the skeleton you now know: **samples in, a learned pattern out, predictions on new cases**. So ‘AI magic’ becomes something you can question.",
          where: [
            "**Spam filters** that read millions of marked emails",
            "**Keyboards** guessing your next word from your history",
            "**ChatGPT** — next-word prediction learned from vast amounts of text",
          ],
          whenNot:
            "Not every clever feature is ML — a **fixed rule** (timer, calculator, sort-by-date) is ordinary programming. Ask what examples it learned from to tell them apart.",
        },
        diagram: {
          kind: "flow",
          steps: [
            { kind: "input", text: "An everyday app moment", caption: "mail arrives · you type · you look" },
            { kind: "process", text: "A learned pattern makes the call", caption: "trained on your labelled examples" },
            { kind: "output", text: "Sorted · suggested · unlocked", caption: "a prediction on a new case" },
          ],
        },
        prose: [
          "You’ve used **machine learning dozens of times today already**. Spam filters deciding what reaches your inbox. Keyboards guessing your next word. Face unlock recognising you in bad light.",
          "Each one is the same skeleton you now know: **samples in, a learned pattern out, predictions on new cases**. A spam filter read millions of marked emails. Your keyboard watched which words follow yours.",
          "Once you see the skeleton, ‘AI magic’ turns into something you can question: **what were the examples? What is it predicting? What happens when it’s wrong?**",
          "That includes the headline AI of today. **ChatGPT** learned from enormous amounts of text to do one thing: predict the next word. An image generator predicts what pixels usually come next. Generative AI isn’t a different species. It is the **same samples-in, pattern-out skeleton**, just working at a much larger scale.",
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
              "Your ‘this is junk’ marks are labels. Learning to sort future mail from those labelled examples is supervised learning.",
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
              "A model is confident within the range of its examples. Inputs unlike anything it trained on — lighting, angles, accessories — push it outside that range, and accuracy drops.",
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
          anchor: "A parrot that always answers in the same confident voice — even about things it has never seen.",
          what: "ML **fails quietly**: it always produces an answer, in the same confident tone — **whether it has seen 10,000 similar cases or zero**.",
          why: "Unlike a calculator that crashes loudly, a **confidently wrong** model looks identical to a right one. That is what makes it dangerous.",
          where: [
            "**Face unlock** failing on faces it never trained on",
            "A **chatbot** inventing answers with total confidence",
            "Failures traced to **training gaps, overfitting (memorizing instead of understanding), or bad data**",
          ],
          whenNot:
            "Never trust tone as a signal of accuracy. The safeguard is asking: **what were the examples, how was it tested, and what happens when it’s wrong?**",
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
                node: { kind: "leaf", answer: "Memorised noise", caption: "overfitting — learned quirks, not the pattern" },
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
          "The safeguard isn’t ‘trust it more’ or ‘trust it less’. It is knowing **which questions to ask**. What were the examples? How was it tested? What happens when it’s wrong? Those questions are exactly what the next course, **AI Observability**, teaches you to ask daily.",
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
              "An AI chatbot invents an answer that sounds true but is false. It states the answer with total confidence. Which property of ML does this show?",
            choices: [
              { id: "a", label: "Models fail loudly, like a crash" },
              { id: "b", label: "Models always produce an answer in the same confident tone — even outside what they know" },
              { id: "c", label: "Chatbots know when they are lying" },
            ],
            answer: "b",
            explanation:
              "Unlike ordinary software, ML fails quietly. The output looks identical whether the model is on familiar ground or guessing. That’s why watching AI systems matters — the next course shows how.",
          },
        ],
      },
    ],
};

export default course;
