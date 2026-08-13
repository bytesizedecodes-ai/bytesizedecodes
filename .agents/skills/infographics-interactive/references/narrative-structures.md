# Narrative structures (v3)

The three **named level frameworks** referenced from `../SKILL.md` §1.1, plus a
library of reusable story shapes you can drop into a beat. **Structure differs
by level** — the expertise-reversal effect is now meta-analytic (Tetzlaff et al.
2025): guidance *helps novices but harms experts*. So each level gets its own
skeleton, not just stronger/weaker knobs.

Pick the framework for your course's `level` in workflow Step 1; emit its beats
in Step 3. The §1 knob tables calibrate *how* each beat plays (analogy density,
jargon, math); the framework here orders *what* the beats are.

---

## Beginner — "Anchored Story-Mountain + Concreteness Fade"

**Beats:** Hook → Concrete anchor → Tension/impasse → Reveal + fade → Resolution.

| Beat | Job | Beginner-specific rule |
|---|---|---|
| **Hook** | "Why should I care?" — a relatable stake | One everyday sentence, no jargon |
| **Concrete anchor** | Introduce the concept *as a familiar object* | The car/dashboard, the vending machine, the milk (P2) |
| **Tension/impasse** | Surface the puzzle the concept resolves | Build a small, manageable conflict (P7) |
| **Reveal + fade** | Show the idea, then fade anchor → simple diagram | Concreteness fading (Goldstone & Son 2005); state where the analogy breaks |
| **Resolution** | The `Takeaway` card — the aha in one line | Withhold it a beat so the learner generates it (P7) |

**Why this suits beginners:** narrative + concrete anchors help low-prior-
knowledge learners most (Tobler 2024; CTGV anchored instruction); worked-example
structure beats pure discovery for novices (Sweller; Kirschner/Sweller/Clark
2006). Full story arc, generous whitespace, one concept per scene.

**Course example:** `WhatIsObservability` — hook ("how do you know the engine's
healthy?") → anchor (car dashboard) → tension (engine hidden) → reveal + fade
(gauges → "an AI is also a hidden engine") → resolution ("observability =
reading inside state from outside").

---

## Intermediate — "Predict–Investigate–Case (PIC)"

**Beats:** Scenario → Predict → Observe → Explain-via-case → Transfer.

| Beat | Job | Intermediate-specific rule |
|---|---|---|
| **Scenario** | A realistic, slightly technical situation | Standard ML/AI terms OK (model, feature, latency) |
| **Predict** | Commit to a guess *before* the reveal | This is the Constructive beat (P8) — non-negotiable |
| **Observe** | The visual / widget reveals what really happens | Lighter analogy than beginner; reach the formal faster |
| **Explain-via-case** | Generalise through one worked case | Case-method grounding (Christensen) |
| **Transfer** | Apply to a new but adjacent situation | One short application prompt |

**Why this suits intermediates:** Predict–Observe–Explain (White & Gunstone's
POE) engineers the aha via the generation effect; the 5E enquiry spine (Bybee)
gives structure without hand-holding; a single case anchors the abstraction.
Light formulas / short code welcome.

**Course example:** `AlertThresholdTuner` runs as PIC once retrofitted —
scenario (error rate climbing) → *predict* ("where would you set the
threshold?") → observe (drag it; watch false-alarms vs missed trade off) →
explain (the trade-off has no perfect answer) → transfer (the application
prompt).

---

## Expert — "Problem-First Diagnostic (CER)"

**Beats:** Problem-first → You diagnose → Claim/Evidence/Reasoning → Counter-examples → What/So-What/Now-What.

| Beat | Job | Expert-specific rule |
|---|---|---|
| **Problem-first** | Open with the hard case, no wrapping | Skip the story setup (P4/P5) |
| **You diagnose** | The expert works it themselves | Minimal signalling; trust the reader |
| **CER** | State a Claim, back it with Evidence and Reasoning | Full precision; real code/formulas; edge cases (McNeill & Krajcik) |
| **Counter-examples** | Where the claim breaks | This is the expert aha — depth + surprise (P7) |
| **What / So-What / Now-What** | Synthesise and decide | Reflective transfer; what to do next |

**Why this suits experts:** scaffolding/analogy here is *harmful* (Kalyuga 2007;
Tetzlaff 2025); cognitive apprenticeship's late stages (Collins/Brown/Newman)
are modelling → coaching → *fading* → self-directed diagnosis. The aha comes
from depth and counter-intuitive results, not withheld basics.

---

## The library of reusable story shapes

Drop any of these into a beat when the content's shape calls for it. Notes on
which level each tends to suit — but they're composable, not exclusive.

| Shape | Beats | Suits |
|---|---|---|
| **Story mountain** | Setup → Rising action → Climax → Falling action → Resolution | Beginner (the spine of the Story-Mountain framework) |
| **ABT** (And–But–Therefore) | Setup **and** normal world, **but** conflict, **therefore** change | All levels; the tightest narrative kernel |
| **POE** (Predict–Observe–Explain) | Predict → Observe → Explain | Intermediate; **also the core Constructive micro-pattern at any level** |
| **5E** | Engage → Explore → Explain → Elaborate → Evaluate | Intermediate (enquiry spine) |
| **Before / After / Reveal** | State before → reveal the change → explain after | All levels; great for transformations and "drift" / "fade" beats |
| **Case method** (Christensen) | Frame the case → analyse → discuss → generalise | Intermediate / Expert |
| **7-Jump / PBL** (Barrows) | Clarify → hypothesise → inquire → test → reflect | Intermediate / Expert (problem-based learning) |
| **CER** (Claim–Evidence–Reasoning) | Claim → Evidence → Reasoning | Expert (argument rigour) |
| **What / So-What / Now-What** | Describe → interpret → decide | Expert (reflective transfer / capstone) |
| **Cognitive apprenticeship arc** | Model → Coach → Scaffold → Fade | Instructional *meta*-shape for sequencing a whole topic across lessons |

### How to choose
- **Beginner:** default to the Story-Mountain framework; sprinkle POE only as
  the Constructive beat. Resist 5E/PBL — they're too open for novices.
- **Intermediate:** the PIC framework is your default; Before/After/Reveal and
  ABT slot in for specific beats.
- **Expert:** the Problem-First Diagnostic framework; reach for CER + What/So-
  What/Now-What; only use Story-Mountain if the content is genuinely narrative.

### Sources (full links in `learning-science-sources.md`)
CTGV anchored instruction; Goldstone & Son (2005) concreteness fading; Sweller
cognitive load / worked examples; Kirschner/Sweller/Clark (2006); Tobler (2024);
White & Gunstone POE; Bybee 5E; Christensen case method; Barrows PBL; Kalyuga
(2007); Tetzlaff et al. (2025); Collins/Brown/Newman cognitive apprenticeship;
McNeill & Krajcik CER.
