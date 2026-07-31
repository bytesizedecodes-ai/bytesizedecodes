# ByteSizedCodes — Course and Track Roadmap

Status: proposed curriculum · 2026-07-31

---

## Curriculum principle

Do not create four separate libraries for beginners, students, professionals, and founders.

Create:

1. One shared skill graph
2. Reusable short learning units
3. Goal-based tracks that choose and sequence those units
4. Different examples, depth, and projects for each audience

This keeps content production realistic at one or two authored units per week.

---

## The learning model

Every substantial course should move through four levels:

1. **Understand** — explain the idea and recognize when it applies
2. **Practise** — solve varied problems and repair misconceptions
3. **Apply** — use code, data, or a product scenario
4. **Build** — produce an artifact that demonstrates the skill

A course is incomplete if it ends at definitions.

### Evidence required by knowledge type

#### Facts and distinctions

Examples:

- AI versus ML versus deep learning
- Classification versus regression
- Precision versus recall

Use:

- Retrieval practice
- Sorting and matching
- Compare/contrast questions
- Spaced review

#### Procedures

Examples:

- Compute a gradient step
- Prepare a dataset
- Evaluate a classifier

Use:

- Worked example
- Faded worked example
- Independent problem
- Generated variations

#### Design judgment

Examples:

- Choose a metric
- Decide whether an LLM is appropriate
- Design an evaluation set

Use:

- Realistic cases
- Multiple defensible answers
- Trade-off justification
- Peer/expert comparison after submission

#### Production skill

Examples:

- Train and deploy a model
- Build retrieval-augmented generation
- Launch an AI MVP

Use:

- Code with hidden tests
- Artifact checkpoints
- Deployment
- Evaluation report
- Reflection on failures

---

## Shared foundation spine

These courses form the reusable core. Tracks skip, compress, or deepen modules based on diagnostic results.

### Course F0 — AI literacy: what AI can and cannot do

Audience: everyone  
Length: 8–10 units  
Prerequisites: none

Outcomes:

- Distinguish AI, ML, deep learning, and generative AI.
- Recognize prediction, generation, search, optimization, and automation use cases.
- Explain training versus inference.
- Identify hallucination, bias, privacy, and automation-risk basics.
- Decide when a non-AI solution is better.

Recommended units:

1. How humans and machines learn
2. AI versus fixed software
3. AI, ML, DL, and GenAI
4. Training data, model, and inference
5. Prediction versus generation
6. Why models make confident mistakes
7. Data privacy and bias
8. Is AI the right tool?
9. Everyday AI case lab
10. Final artifact: explain one AI system to a nontechnical person

Current reuse:

- Most infographic lessons in both current courses
- Consolidate duplicated “what is AI/ML/DL” material into this course

Interactions:

- Predict before reveal
- AI/not-AI sorting
- Failure-mode detective
- Explain-back recording

### Course F1 — Python for AI

Audience: technical beginners onward  
Length: 12–16 units  
Prerequisites: none; F0 recommended

Outcomes:

- Read and write small Python programs.
- Work with lists, dictionaries, functions, files, and errors.
- Use NumPy and pandas for data work.
- Read unfamiliar ML code and debug common errors.

Recommended units:

1. Values, variables, and types
2. Conditions and loops
3. Functions
4. Collections
5. Reading files
6. Errors and debugging
7. NumPy arrays and shapes
8. Vector operations
9. pandas tables
10. Filtering and grouping
11. Missing values
12. Plotting
13. Reading library documentation
14. Code repair challenge
15. Mini-project: analyze a real dataset

Interactions:

- Output prediction
- Parsons problems: reorder code blocks
- Repair broken code
- Hidden tests
- Dataset exploration in Pyodide

Artifact:

- A cleaned, analyzed dataset notebook or web report

### Course F2 — Visual math for ML

Audience: students, engineers, serious builders  
Length: 14–18 units  
Prerequisites: basic Python

Outcomes:

- Understand vectors, matrices, functions, derivatives, probability, and optimization visually.
- Perform the small calculations commonly required in ML.
- Connect mathematical symbols to code and model behavior.

Modules:

1. Vectors as data
2. Dot products and similarity
3. Matrices as transformations
4. Tensor shapes
5. Functions and loss surfaces
6. Slope and derivatives
7. Partial derivatives
8. Chain rule
9. Gradient descent
10. Probability and conditional probability
11. Distributions and sampling
12. Expectation and variance
13. Bayes and base rates
14. Optimization behavior

Current reuse:

- Tensor-shape generator
- Gradient-step generator
- Existing tensors and gradient Bytes

Artifact:

- Interactive visual notebook explaining one optimizer

### Course F3 — Classical machine learning

Audience: students, engineers, founders building predictive products  
Length: 24–30 units  
Prerequisites: F1; selected F2 modules

Outcomes:

- Frame a business/problem statement as an ML task.
- Build a clean train/validation/test workflow.
- Train baseline models.
- Select appropriate metrics.
- Diagnose bias, variance, leakage, imbalance, and overfitting.
- Communicate results honestly.

Modules:

1. Problem framing
2. Labels, features, and targets
3. Classification versus regression
4. Data splitting
5. Baselines
6. Linear regression
7. Logistic regression
8. Trees
9. Random forests and boosting
10. Feature preparation
11. Missing data
12. Categorical features
13. Leakage
14. Imbalanced data
15. Confusion matrix
16. Precision, recall, F1
17. ROC-AUC and PR-AUC
18. Regression metrics
19. Cross-validation
20. Hyperparameters
21. Bias versus variance
22. Calibration and thresholds
23. Interpretability
24. Model cards

Current reuse:

- Precision/recall Byte
- Confusion-matrix generator
- Planned metric-choice, leakage, bias-variance, and Bayes generators

Projects:

- Student: placement-risk or loan-risk model with explicit fairness caveats
- Professional: churn or operations forecast
- Founder: demand or qualification model tied to a product workflow

### Course F4 — Deep learning foundations

Audience: students and engineers  
Length: 20–26 units  
Prerequisites: F1, core F2, selected F3

Outcomes:

- Explain neurons, layers, activations, forward pass, loss, and backpropagation.
- Read tensor shapes.
- Train and debug a small network.
- Choose output heads and losses.
- Understand CNNs, sequence models, and attention at a conceptual level.

Modules:

1. From linear models to neurons
2. Layers and representations
3. Activations
4. Forward pass
5. Loss functions
6. Backpropagation
7. Optimizers
8. Batch size and learning rate
9. Regularization
10. Initialization
11. Tensor shapes
12. CNNs
13. Embeddings
14. Sequence modeling
15. Attention
16. Transformer intuition
17. Training loops
18. Debugging instability
19. Evaluation
20. Responsible deployment

Current reuse:

- Deep-learning infographic
- Tensor-shape generator
- Head-and-loss generator

Project:

- Train a small image or text classifier, publish evaluation and failure cases

### Course F5 — Generative AI and LLM application engineering

Audience: all technical builders; optional no-code route for beginners/founders  
Length: 20–28 units  
Prerequisites: F0; Python route requires F1

Outcomes:

- Explain tokens, embeddings, context, generation, and hallucination.
- Use an LLM API safely.
- Design structured outputs and tool use.
- Build retrieval-augmented generation.
- Create evaluation sets and measure quality, latency, and cost.
- Decide when prompting is insufficient.

Modules:

1. How language models generate
2. Tokens and context
3. Temperature and sampling
4. Prompt structure
5. Structured output
6. Function/tool calling
7. Embeddings and semantic search
8. Retrieval
9. Chunking
10. RAG architecture
11. Reranking
12. Conversation memory
13. Agents versus workflows
14. Evaluation datasets
15. LLM-as-judge caveats
16. Hallucination controls
17. Prompt injection
18. Privacy and data handling
19. Latency
20. Cost
21. Observability
22. When to fine-tune

Interactions:

- Prompt prediction and comparison
- Retrieval chunking sandbox
- Evaluate competing outputs using a rubric
- Red-team challenge
- Cost/latency calculator

Project:

- A source-grounded assistant with an evaluation report and cost budget

### Course F6 — AI systems, MLOps, and production

Audience: engineers and technical founders  
Length: 16–24 units  
Prerequisites: F3 or F5

Outcomes:

- Package, deploy, monitor, and improve an AI system.
- Understand data/model drift, evaluation pipelines, observability, and rollback.
- Balance quality, latency, reliability, and cost.

Modules:

1. From notebook to service
2. APIs
3. Containers and environments
4. Data/version management
5. Experiment tracking
6. Batch versus online inference
7. Model registry
8. Evaluation in CI
9. Monitoring
10. Drift
11. Human review
12. Feedback loops
13. Rollbacks
14. Security
15. Cost engineering
16. Incident postmortems

Project:

- Deploy an evaluated service with monitoring and a rollback plan

### Course F7 — Responsible AI and safety

Audience: everyone; depth varies  
Length: 10–16 units  
Prerequisites: F0

Outcomes:

- Identify foreseeable harms and affected users.
- Test bias and failure cases.
- Handle data responsibly.
- Design human oversight.
- Communicate limitations.

This course should also be embedded as checkpoints inside every project, not isolated as compliance content.

Artifact:

- Model/system card and risk register for the learner’s project

---

## Goal-based tracks

### Track A — AI Explorer

For:

- Curious beginners
- Nontechnical professionals
- Anyone who wants literacy before coding

Sequence:

1. F0 AI literacy
2. Selected visual units from F2
3. No-code path through F5
4. F7 responsible AI

Build outcome:

- Analyze an AI product, test it, document failures, and explain it clearly

Estimated commitment:

- 15 minutes, three days per week for six weeks

### Track B — AI/ML Builder

For:

- College students
- Graduates
- Career switchers

Sequence:

1. Diagnostic
2. F1 Python
3. F2 Visual math
4. F3 Classical ML
5. F4 Deep learning
6. F5 GenAI
7. Selected F6 and F7

Build outcomes:

- Data analysis project
- Classical ML project
- Deep-learning or GenAI project
- Public portfolio with evaluation reports

Interview practice becomes an optional overlay:

- Timed generated drills
- Explain-your-reasoning prompts
- Debugging tasks
- System-design cases

### Track C — AI for Working Professionals

For:

- Product managers
- Analysts
- Software engineers
- Domain experts

Sequence depends on role:

- PM/domain: F0 → F5 no-code/low-code → F7 → product project
- Analyst: F1 data modules → F3 → F5 → work-case project
- Engineer: diagnostic → F3/F4 selections → F5 → F6

Build outcome:

- A prototype or decision memo based on a real work workflow

The platform should ask for industry and role, then use healthcare, finance, retail, manufacturing, education, or developer-tool examples.

### Track D — AI Founder: problem to company

For:

- Aspiring founders
- Indie hackers
- Builders with an AI product idea

This track is not “learn all ML, then start.” It alternates business validation with only the technical learning needed for the next risk.

#### Stage 1 — Find a real problem

Units:

1. Choose a narrow user
2. Find repeated painful work
3. Interview without pitching
4. Map current alternatives
5. Score urgency and willingness to pay
6. Decide whether AI is necessary

Artifact:

- Problem brief and customer-interview log

Gate:

- At least five conversations or equivalent observed workflows

#### Stage 2 — Design the smallest useful outcome

Units:

1. Outcome, not feature list
2. Human-in-the-loop workflow
3. Data availability and permission
4. Choose model/API/build strategy
5. Define quality before building
6. Build a 20-case evaluation set

Artifact:

- Solution brief, architecture sketch, and evaluator

#### Stage 3 — Build the MVP

Branch based on product type:

- Prediction product → selected F3
- Generative workflow → selected F5
- Custom deep-learning product → selected F4

Units:

1. Thin vertical slice
2. Structured input/output
3. Failure handling
4. Usage logging
5. Privacy and security
6. Cost budget

Artifact:

- Working MVP and deployed demo

#### Stage 4 — Validate value

Units:

1. Concierge test
2. Observe users
3. Define activation
4. Measure repeat use
5. Price the outcome
6. Separate model failure from product failure

Artifact:

- Experiment report and revised product

#### Stage 5 — Launch responsibly

Units:

1. Positioning
2. Landing page
3. Founder-led outreach
4. Onboarding
5. Monitoring and support
6. Risk register and disclosure
7. Unit economics

Artifact:

- Live URL, launch plan, model/system card, and 30-day metrics plan

#### Stage 6 — Improve or stop

Units:

1. Analyze retention
2. Build an evaluation flywheel
3. Prioritize failure clusters
4. Control inference cost
5. Know when to pivot

Artifact:

- Evidence-based continue/pivot/stop decision

---

## Courses to add first

Do not start all tracks simultaneously.

### Priority 1 — unify and finish the current foundation

Create one “AI Foundations” course from the strongest current infographic lessons.

Add to every lesson:

- One prediction before the visual
- One active interaction
- One authored review item
- One application example

Remove duplication between the current technical and layman paths. Offer “plain” and “technical detail” layers inside the same unit.

### Priority 2 — Python for AI: first project

Why:

- It unlocks meaningful code exercises.
- It serves students, professionals, and founders.
- Pyodide already exists.

Ship the first eight units plus a data mini-project before creating advanced deep-learning content.

### Priority 3 — Model evaluation and data leakage

Why:

- The strongest existing generator is already here.
- Evaluation is useful across classical ML, deep learning, and GenAI.
- It teaches judgment, not library syntax.

Add generators:

- Metric choice
- Leakage spotting
- Bias/variance diagnosis
- Bayes/base-rate reasoning

### Priority 4 — AI Product Builder starter project

Build a small cross-audience project:

> Design and test a support-ticket classifier or grounded FAQ assistant.

Offer levels:

- Beginner: inspect outputs and failure cases
- Student: write code and metrics
- Professional: design workflow integration
- Founder: validate problem, cost, and value

This proves that shared units can serve different goals without separate content libraries.

### Priority 5 — LLM application engineering

Do not lead with prompt tricks. Lead with:

- Problem fit
- Evaluation
- Retrieval
- Security
- Cost
- Workflow design

---

## Content production system

At one to two authored units per week, use a reusable package:

Each concept produces:

1. One infographic/scene
2. One short lesson
3. Two authored retrieval questions
4. One misconception-aware practice item or generator template
5. One application case
6. One project checkpoint link
7. One social post

Authoring sequence:

1. Define the demonstrated capability
2. List three common misconceptions
3. Create the prediction question
4. Create the visual explanation
5. Create a worked example
6. Create independent practice
7. Attach to a project
8. Add delayed-review items

The capability and misconceptions come first; prose comes later.

---

## Course quality rubric

A course should not launch unless:

- Outcomes are observable, not “understand X.”
- Every unit begins with retrieval or prediction.
- Every complex procedure includes a worked example.
- Every skill has independent practice.
- Correct answers explain why distractors are wrong.
- The learner produces at least one artifact.
- The artifact has an evaluation rubric.
- Review items return after the lesson.
- The course has a resume action and visible progress.
- Accessibility and low-bandwidth behavior are tested.
- Completion reflects evidence, not page views.
- Responsible-use decisions are included where relevant.

---

## What not to build yet

- A large video library
- A generic chatbot tutor
- Twenty shallow courses
- Live cohort classes requiring a teaching operation
- A global certificate marketplace
- An open discussion forum
- A native mobile app
- Heavy GPU notebooks hosted at your expense

First prove:

1. Learners complete the common foundation.
2. Authored review improves delayed recall.
3. At least one project path reaches a shareable artifact.
4. Goal-based recommendations improve continuation.

