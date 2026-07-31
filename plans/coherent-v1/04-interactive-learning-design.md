# ByteSizedCodes — Interactive Learning Design

Status: proposed interaction system · 2026-07-31

---

## Goal

Most online courses are passive because video and prose are cheap to publish. ByteSizedCodes should be different:

> Every lesson asks the learner to think before it explains, act before it marks complete, and apply before it awards mastery.

“Interactive” does not mean adding more buttons. An interaction is valuable when it reveals a learner decision and gives targeted feedback.

---

## Default lesson loop

Use this sequence as a component recipe.

### 1. Recall

Retrieve one prerequisite without notes.

Examples:

- “What changes when the decision threshold increases?”
- “What shape leaves this matrix multiplication?”

Purpose:

- Strengthen memory
- Detect whether the learner is ready

### 2. Predict

Ask the learner to commit before revealing the visual.

Examples:

- Choose which model will overfit
- Sketch whether loss rises or falls
- Predict the output of a code snippet

Purpose:

- Activate prior knowledge
- Make the explanation answer a felt question

### 3. See

Reveal the infographic, animation, or worked example.

Rules:

- Show one causal relationship at a time.
- Keep labels next to the objects they explain.
- Use consistent color semantics.
- Offer a plain-language layer and optional technical detail.

### 4. Manipulate

Let the learner change one meaningful variable.

Examples:

- Classification threshold
- Learning rate
- Convolution kernel, padding, or stride
- Number of neighbors
- Chunk size and overlap in RAG

The UI must show consequences, not merely update a number.

### 5. Explain

Ask:

- “Why did that happen?”
- “Which trade-off changed?”
- “Explain this to a teammate in one sentence.”

Then compare with a strong explanation. Do not show model/peer answers before the learner commits.

### 6. Practise

Move from support to independence:

1. Complete worked example
2. Faded example with missing steps
3. Independent generated problem
4. Transfer case in a different context

### 7. Apply

Use the skill in code, a dataset, a product decision, or the current project.

### 8. Reflect and invest

Ask one short prompt:

- “What mistake will you watch for?”
- “Where could you use this?”
- “Save your rule of thumb.”

Store the result. The next session should use it.

### 9. Schedule

Create review cards from the lesson’s essential decisions. Review should include both authored concepts and generated practice.

---

## Interaction library

Build reusable primitives instead of one-off lesson widgets.

### Prediction card

Input:

- Prompt
- Two to four outcomes
- Confidence slider

Feedback:

- Outcome
- Why the learner’s model was right or wrong
- Aggregate response only after submission

Use for:

- Beginners
- Concept introduction
- Code tracing
- Product decisions

### Sort and classify

Interaction:

- Drag cards into categories

Examples:

- AI / not AI
- Classification / regression / generation
- Feature / label / leakage
- Offline / online evaluation

Feedback:

- Explain each misplaced card individually

### Sequence builder

Interaction:

- Reorder process steps

Examples:

- ML workflow
- Backpropagation
- RAG request path
- Customer discovery to MVP

### Hotspot diagnosis

Interaction:

- Click the suspicious region of a chart, confusion matrix, data table, architecture, or code diff

Examples:

- Identify leakage
- Find overfitting
- Locate the unsafe data flow

### Slider sandbox

Interaction:

- Adjust one or two model parameters and observe linked visuals

Required features:

- Prediction before movement
- Reset
- Highlight what changed
- One generated challenge state

Examples:

- Threshold versus precision/recall
- Learning rate versus convergence
- K in k-nearest neighbors
- Temperature versus output diversity
- Chunk size versus retrieval quality/cost

### Build-the-matrix

Interaction:

- Place example predictions into TP, FP, TN, and FN cells

Progression:

1. Concrete people/items
2. Counts
3. Metrics
4. Business cost

### Code output prediction

Interaction:

- Choose or enter expected output before execution

Feedback:

- Variable-state trace
- Shape/type changes
- Corrected mental model

### Parsons problem

Interaction:

- Reorder provided code lines and remove distractor lines

Why:

- Lower syntax burden than blank-page coding
- Useful bridge from reading to writing

### Code repair

Interaction:

- Run failing tests
- Inspect concise failure
- Change code
- Pass visible and hidden tests

Feedback:

- Hint ladder, not immediate solution
- Show minimal diff after completion

### Dataset detective

Interaction:

- Inspect a small table, distributions, and split summary
- Flag missingness, imbalance, leakage, or bad labels

Use for:

- Data literacy
- Classical ML
- Product evaluation

### Decision case

Interaction:

- Select an action and justify it

Examples:

- Accuracy is 96%, but rare fraud recall is 20%. Ship?
- Buy an API, use open weights, or train?
- Automate fully or keep human approval?

Scoring:

- Not always one correct answer
- Rubric for constraints considered
- Reveal expert reasoning and alternatives after submission

### Prompt/evaluation lab

Interaction:

- Compare two prompts or outputs against a rubric
- Add failure cases to an evaluation set
- Re-run aggregate results

Do not grade by exact text. Grade whether the learner defined constraints and evaluation evidence.

### Architecture builder

Interaction:

- Place data source, model, retrieval, tools, evaluator, human review, and monitoring blocks
- Connect permitted flows

Feedback:

- Privacy risks
- Missing failure handling
- Latency/cost consequences

### Cost and latency calculator

Interaction:

- Adjust users, requests, tokens, model price, caching, and fallback rates

Use for:

- Professionals
- AI engineers
- Founders

Artifact:

- Saved cost budget attached to project

### Founder experiment simulator

Interaction:

- Choose a customer problem
- Allocate limited time between interviews, building, evaluation, and launch
- Receive evidence, not arbitrary points

Purpose:

- Teach sequence and risk reduction

Do not present entrepreneurship as a guaranteed linear game.

### Explain-back

Input options:

- One sentence
- Diagram labels
- Optional voice recording later

Feedback options:

- Checklist of required ideas
- Compare to two strong explanations
- AI feedback only after deterministic rubric checks, and label it as machine-generated

### Project checkpoint

Interaction:

- Save a real artifact
- Run a checklist or tests
- Request structured peer feedback

Examples:

- Upload/link dataset
- Define success metric
- Save evaluator cases
- Pass API tests
- Publish demo URL

---

## Course-specific patterns

### AI literacy

Avoid equations first.

Use:

- Predict whether a system is AI
- Sort prediction versus generation
- Identify hidden human labor/data
- Red-team an output
- Explain one system to a family member

### Python

Use a progression:

1. Read
2. Predict
3. Rearrange
4. Repair
5. Write
6. Apply to data

Do not begin with a blank editor.

### Math

Represent every concept in three linked forms:

- Visual
- Symbolic
- Code

Hovering or selecting one representation should highlight the corresponding parts in the others.

### Classical ML

Use repeated realistic workflows:

- Frame
- Inspect data
- Split
- Establish baseline
- Train
- Evaluate
- Diagnose
- Communicate

Vary the domain while preserving the underlying skill.

### Deep learning

Use:

- Shape tracing
- Forward-pass tracing
- Activation/loss matching
- Gradient-flow visualization
- Training-curve diagnosis
- Code repair

Do not require hand calculation after it stops improving conceptual control.

### Generative AI

Use:

- Output comparison
- Retrieval debugging
- Evaluation-set construction
- Prompt injection/red-team cases
- Cost/latency trade-offs
- Workflow versus agent decisions

Avoid grading “prompt cleverness.”

### Founder track

Every unit changes a real artifact:

- Problem brief
- Interview notes
- Evaluation set
- Prototype
- Pricing test
- Launch page
- Metrics plan

A founder should never finish a week with only quiz scores.

---

## Feedback design

### Feedback order

1. State the result
2. Name the likely misconception
3. Show the smallest correction
4. Ask the learner to try again
5. Offer the full explanation after the retry

Example:

> Not yet. You optimized for overall accuracy, but the case says missing a positive is much more costly. Recheck which metric counts false negatives.

This is better than:

> Incorrect. The answer is recall.

### Hint ladder

Use three levels:

1. Point to the relevant concept
2. Reduce the problem
3. Show the next step

Using a hint reduces first-pass mastery confidence but should not remove all XP or shame the learner.

### Confidence

Ask for confidence on selected items.

Important states:

- Correct + low confidence → reinforce
- Correct + high confidence → advance
- Incorrect + low confidence → teach
- Incorrect + high confidence → prioritize misconception repair

### Response effort

After review, expose:

- Again
- Hard
- Good
- Easy

Use objective correctness as a guardrail but preserve learner-reported effort.

---

## Mastery model

Do not represent a skill with one percentage derived only from reviews.

Track four evidence dimensions:

### Understanding

Evidence:

- Prediction
- Explanation
- Concept comparison

### Recall

Evidence:

- Delayed retrieval
- Spaced interval
- Hint-free response

### Application

Evidence:

- New scenario
- Code
- Dataset diagnosis
- Design decision

### Proof

Evidence:

- Project artifact
- Hidden tests
- Evaluation report
- Peer/rubric review

Display a compact capability statement:

> You can compute classification metrics and apply them to a new case. Next: choose metrics under asymmetric cost.

This is more useful than “63% mastery.”

---

## Accessibility and device design

Every interaction must:

- Work by keyboard
- Have non-drag alternatives
- Respect reduced motion
- Include text equivalents for color and animation
- Avoid requiring audio
- Fit a narrow phone screen
- Preserve progress if the tab reloads
- Provide a low-bandwidth static fallback

For diagrams:

- Use semantic labels
- Provide a structured text summary
- Do not encode correct/incorrect only through red and green

---

## AI tutor: later and constrained

A generic chat box is not the next priority. It adds cost and can give plausible wrong answers.

When added, the tutor should be context-limited:

- Explain the current step in simpler language
- Ask a Socratic question
- Generate another example from an approved template
- Review an explanation against a deterministic rubric
- Point to a specific prerequisite unit

It should not:

- Complete graded project work
- Invent course facts outside sources
- Replace deterministic grading where an answer is known
- Claim that a learner has mastered a skill

Store tutor feedback separately from verified mastery evidence.

---

## Implementation mapping to the current repository

### Extend the content model

Replace the current `Byte` plus `CourseLesson` split with a learning-unit schema that supports:

- `skillIds`
- `prerequisiteSkillIds`
- `outcomes`
- `scenes`
- `interactions`
- `workedExamples`
- `practice`
- `reviewItems`
- `projectCheckpoints`
- `estimatedMinutes`
- `depth`

### Create an interaction renderer

Follow the existing infographic registry pattern:

- Typed interaction union
- Registry of interaction components
- Schema validation for authored content
- Deterministic IDs for progress and review

Start with:

1. Prediction card
2. Sort/classify
3. Sequence builder
4. Slider sandbox
5. Parsons/code repair
6. Decision case
7. Project checkpoint

### Upgrade code execution

- Move Pyodide into a Web Worker.
- Add execution timeout and worker reset.
- Persist code per learner and lesson.
- Support visible and hidden tests.
- Add starter reset and solution diff.
- Require a passing exercise when coding is the lesson outcome.

### Unify review rendering

Create a typed review-card source:

- Generator reference
- Authored prompt
- Code/output question
- Image/diagram reference

The queue should render the item type instead of discarding non-generator keys.

### Add skill evidence

Every submission should write:

- Skill IDs
- Evidence type
- Correctness/rubric result
- Hint level
- Confidence when collected
- Response time
- Source unit/project

Mastery should aggregate evidence by skill and dimension.

---

## Interaction acceptance criteria

An interaction is ready when:

- Its learning objective is explicit.
- It requires a meaningful decision.
- Every likely wrong answer has useful feedback.
- It works without a mouse.
- State survives reload.
- Completion produces typed skill evidence.
- It has deterministic unit tests where possible.
- It does not award mastery for mere interaction.
- The next recommendation can use its evidence.

