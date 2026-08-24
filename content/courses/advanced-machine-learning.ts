import type { Course } from "../types";

const course: Course = {
    slug: "advanced-machine-learning",
    title: "Advanced Machine Learning",
    subtitle:
      "Deep learning to LLMs, visually: how modern models are built, trained, fine-tuned, and shipped.",
    description:
      "One case — Mango Labs, a four-person team turning a photo classifier into an LLM-powered crop advisory — carries you from neurons to production. Backprop and optimizers done properly, CNNs, attention and the transformer, the LLM training pipeline, LoRA fine-tuning, RLHF/DPO alignment, diffusion, multimodal embeddings, MoE/Mamba architectures, and the capstone: the full train→eval→deploy→drift→retrain loop. Expert-level, problem-first, with the costs and the counter-arguments.",
    level: "expert",
    domain: "Machine Learning",
    access: "paid",
    prerequisites:
      "The expanded Machine Learning course (regression, loss, gradient descent, neurons, backprop intuition, metrics) or equivalent working knowledge.",
    lessons: [
      {
        slug: "neurons-and-layers",
        title: "Depth is a feature factory",
        blurb: "Why stacked layers build feature interactions that no single layer can represent.",
        topic: "deep-learning",
        skillIds: ["deep-representations", "neural-network-basics"],
        capability: "Reason about when depth buys representational power and when it buys only cost.",
        minutes: 10,
        concept: {
          anchor:
            "Each layer re-describes its input so a straight line can finally cut it — depth bends the space until linear works.",
          what: "Each layer **re-describes its input** in a new representation; stacking lets later layers learn **combinations of combinations** — interactions (spots × humidity) that no single weighted sum can express.",
          why: "This is the entire case for depth: a deep network can make its **last hidden layer linearly separable** even when the raw data is tangled — it bends the space so a straight line works.",
          where: [
            "**Vision** — edges → textures → object parts, learned unprompted",
            "**LLMs** — morphemes → syntax → meaning → task behavior, one stack",
            "**Tabular deep models** — learned crosses replacing hand-built feature interactions",
          ],
          whenNot:
            "Thin data with already-meaningful features: depth mostly adds **variance and cost**. With ~1k rows and known-good features, a forest or linear model is the honest baseline — depth must be earned.",
        },
        prose: [
          "The expert framing: a neural network is a **composition of parametric functions**, and its capacity comes from that composition. Single-layer models are closed under addition and scaling but not under composition — you cannot build 'rust fires only when spots AND humidity co-occur' from a weighted sum, at any weight setting. Two layers build it trivially: threshold each, then threshold the pair.",
          "The representation view is the diagnostic one. Kernel methods, PCA, and single hidden layers all fail the same way when classes are tangled non-linearly; a trained deep stack succeeds because **by the last hidden layer the classes have been untangled** — which is measurable (probe the layer, fit a linear classifier) and should be part of any deep-model review.",
          "The counter-case deserves respect: on wide, shallow-signal tabular problems, gradient-boosted trees remain SOTA in 2026 benchmarks. Reach for depth when the signal is **compositional** (pixels, audio, tokens, dense interactions) and you have the data to feed it — and be ready to defend the choice with a probe or an ablation, not vibes.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A review finds a fraud team's 12-layer network performs no better than their logistic regression baseline — same features, same AUC. Training curves show both fit to the same ceiling. What's the most defensible diagnosis?",
            choices: [
              { id: "a", label: "The feature set is already linearly sufficient for the learnable signal — depth has nothing compositional to build; simplify to the interpretable model" },
              { id: "b", label: "The network needs more layers to express the same function" },
              { id: "c", label: "The optimizer failed — switching to SGD will unlock depth's advantage" },
              { id: "d", label: "Fraud detection is impossible with neural networks" },
            ],
            answer: "a",
            explanation:
              "Equal ceilings with equal features says the bottleneck is the signal, not the hypothesis space: if depth could compose new useful features from these inputs, the curves would diverge. When depth buys nothing, ship the model you can explain to a regulator.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "You probe a trained vision model: a linear classifier on the last hidden layer separates classes at 99%, but on the first hidden layer only 61%. What does this pair of numbers tell you?",
            choices: [
              { id: "a", label: "The intermediate layers are doing real representational work — the tangled raw space has been progressively straightened by the stack" },
              { id: "b", label: "The first layer is broken and should be reinitialized" },
              { id: "c", label: "The model is overfitting because the last layer separates too well" },
              { id: "d", label: "Linear probes are meaningless on hidden layers" },
            ],
            answer: "a",
            explanation:
              "The probe gap IS the feature factory's output meter. Early layers re-describing data into separable structure is the mechanism this lesson claims — and the probe is how you verify it on a real model instead of trusting the architecture diagram.",
          },
        ],
      },
      {
        slug: "how-networks-learn",
        title: "The optimizer decides",
        blurb: "SGD, momentum, Adam, and schedules — where 'the model won't train' actually lives.",
        topic: "optimisation",
        skillIds: ["optimizers", "gradient-descent"],
        capability: "Diagnose training pathologies from loss curves and prescribe optimizer/schedule fixes in order.",
        minutes: 11,
        concept: {
          anchor:
            "Stepping downhill in fog — the step size and the pacing, not the boots, decide whether you reach the valley.",
          what: "Training = **mini-batch gradient descent**: sample a batch, backprop its loss, step every weight opposite its gradient, scaled by the **learning rate**. Momentum adds inertia; **Adam** gives each parameter an adaptive step size.",
          why: "At scale, optimization failures look like modeling failures: NaN loss, glacial progress, and loss plateaus are almost always **rate, momentum, or schedule** problems — and they're cheap to fix relative to architecture rework.",
          where: [
            "**AdamW** — the default optimizer across most modern training",
            "**Warmup + cosine decay** — the standard schedule for transformers",
            "**Loss-curve triage** — the first artifact checked in any training review",
          ],
          whenNot:
            "When the loss curve is healthy but held-out performance is poor, the optimizer is **not** the problem — that's a data/regularization/variance issue, and no schedule will save it.",
        },
        prose: [
          "The mechanics in one breath: a mini-batch gives a **noisy estimate** of the true gradient; the update moves weights against it. Vanilla SGD's noise is a feature (it escapes sharp minima) and a bug (it rattles across ravines — long narrow valleys where the curvature differs wildly per direction).",
          "Momentum averages recent gradients so the perpendicular rattle cancels and the along-valley progress accumulates — a ball with inertia. Adam goes further: per-parameter step sizes normalized by each weight's own gradient history (first and second moments), so flat directions speed up and spiky ones calm down. AdamW decouples weight decay from that adaptation, which is why it's the default.",
          "Schedules finish the picture: **warmup** (early gradients are garbage — big steps on garbage diverge), a hold at peak, then **decay** so the final phase carves rather than knocks. The Mango log in the visual is the canonical triage: crawl → raise rate; NaN → lower rate and add warmup; healthy → stop tuning and check held-out. Optimizer and schedule before architecture, every time.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Loss goes NaN at step 300 every run, across three different architectures, with lr=0.1. A teammate proposes redesigning the model for a fourth time. What's the professionally correct response?",
            choices: [
              { id: "a", label: "Stop redesigning: identical NaN timing across architectures is the signature of an optimization blowup — drop the rate an order of magnitude and add warmup before touching the model again" },
              { id: "b", label: "Agree — architecture is the likely cause of NaN" },
              { id: "c", label: "NaN is normal in training and safe to ignore if the final loss is good" },
              { id: "d", label: "Switch the loss function to accuracy so it can't overflow" },
            ],
            answer: "a",
            explanation:
              "Architecture-dependent failures diverge in timing and shape; clockwork NaN at the same step is dynamics, not design — exploding updates from a too-large rate, usually with no warmup. The cheapest experiment (lr 1e-2, warmup) resolves it in one run.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Two vision teams report: team A uses vanilla SGD+momentum with a patiently tuned schedule and matches team B's AdamW results by a fraction of a percent, at lower memory cost. What's the honest takeaway for choosing an optimizer?",
            choices: [
              { id: "a", label: "AdamW is the tuning-cheap default; tuned SGD+momentum can match or beat it in some regimes (vision, big batches) — the choice is a tuning-budget decision, not a capability one" },
              { id: "b", label: "Adam-family optimizers are strictly superior everywhere" },
              { id: "c", label: "SGD is obsolete and should never be used" },
              { id: "d", label: "Optimizer choice has no measurable effect on final loss" },
            ],
            answer: "a",
            explanation:
              "The empirical reality: adaptive methods converge with less tuning; SGD with momentum reaches similar optima when you can afford the schedule search, especially in vision. Teams pick by tuning budget and memory, not by folklore — and log the choice with the run.",
          },
        ],
      },
      {
        slug: "regularizing-deep-nets",
        title: "Fighting memorization",
        blurb: "Dropout, batch norm, early stopping, augmentation — variance medicine for deep nets.",
        topic: "deep-learning",
        skillIds: ["deep-regularization", "bias-variance"],
        capability: "Match each regularizer to the failure surface it treats, and recognize when regularization is the wrong prescription.",
        minutes: 10,
        concept: {
          anchor: "Practicing on the harder, shuffled flashcards so the real test can't be answered from memory.",
          what: "Deep nets with more parameters than examples **memorize by default**; regularizers fight back: **augmentation** (free data), **early stopping** (quit before memorization), **dropout** (random sub-nets, ensemble effect), **batch norm** (steadier activations, higher workable rates).",
          why: "The train/validation gap is the prescription metric: every regularizer closes it by making training **deliberately harder** — and they compose, attacking different surfaces of the same variance problem.",
          where: [
            "**Vision** — augmentation pipelines are half the model",
            "**Transformers** — dropout + weight decay + early stopping, standard",
            "**Small-data fine-tuning** — freeze + augment, before any new parameters",
          ],
          whenNot:
            "Regularizers are **variance** medicine. When train and validation errors are both high (bias), dropout makes it worse — it removes capacity from a model that needed more. Diagnose first; prescribe second.",
        },
        prose: [
          "The deep-learning version of the bias–variance diagnosis you met in the intermediate course: parameters ≫ examples guarantees the *capacity* to memorize (Mango: 14k parameters per photo), so the question is never 'can it overfit?' but 'what stops it?'. The train/val gap is the measurement; the four tools are the levers.",
          "Each lever attacks a different surface. Augmentation multiplies effective data (every photo becomes ten in-distribution variants — the only regularizer that helps *bias* too). Early stopping halts at the validation minimum, before the memorization phase. Dropout randomly silences neurons per step so no pathway can over-specialize — training an implicit ensemble of thousands of thinner networks that share weights. Batch norm normalizes layer inputs batch-to-batch, which steadies the optimization landscape (and lets larger learning rates survive) with a mild regularizing side effect.",
          "The professional order: augmentation and early stopping first (cheap, always right), then dropout if the gap persists, then reconsider the whole setup — the strongest regularizer in deep learning is usually **transfer learning**, trading the from-scratch memorization problem for a much smaller one.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A team reports: train accuracy 58%, validation accuracy 55%, on a small dataset. Their lead directs everyone to 'add dropout 0.5 and stronger augmentation — it fixed overfitting last quarter.' What's wrong with the direction?",
            choices: [
              { id: "a", label: "The 3-point gap is small and both errors are high — this is a bias/underfit regime; removing capacity will lower both scores. They need better features, transfer learning, or more capacity" },
              { id: "b", label: "Nothing — dropout is a universal improvement" },
              { id: "c", label: "The gap proves overfitting; the plan is correct" },
              { id: "d", label: "Validation accuracy should always equal train accuracy in healthy models" },
            ],
            answer: "a",
            explanation:
              "Regularization treats the train–val GAP. A 3-point gap with both scores mediocre is underfitting — dropout (capacity removal) and harder augmentation (harder training) push further from the signal. The last-quarter fix worked because that model showed the opposite signature.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Weeks into training Mango's leaf-disease classifier, a new engineer adds dropout 0.5 to every layer of a model already sitting at 92% train / 91% validation accuracy. On the next eval, the rare long-tail disease classes drop 6 points while the common classes hold. What happened, and what's the right adjustment?",
            choices: [
              {
                id: "a",
                label: "The rare classes needed their pathways kept, not silenced: at 92/91 there was no variance disease to treat — dial dropout back (or off) and let the thin, specialized pathways survive",
              },
              {
                id: "b",
                label: "Dropout needs more epochs to pay off — raise it to 0.7 and train longer",
              },
              {
                id: "c",
                label: "The rare classes are label noise; the eval should drop them",
              },
              {
                id: "d",
                label: "Swap dropout for batch norm everywhere — it regularizes without removing pathways",
              },
            ],
            answer: "a",
            explanation:
              "Dropout is variance medicine, and a 1-point train–val gap means there was no variance to remove. Mechanically, rare classes live on the thinnest, most specialized pathways — exactly the ones dropout randomly silences — while common classes have redundant representations that survive it. Co-adaptation prevention earns its keep only when the gap is the symptom.",
          },
        ],
      },
      {
        slug: "convolutional-networks",
        title: "Filters, not weights",
        blurb: "Convolutions, the feature hierarchy, and transfer learning — the default for vision.",
        topic: "deep-learning",
        skillIds: ["cnn-architectures", "deep-representations"],
        capability: "Explain parameter sharing and translation invariance, and run the transfer-learning recipe on modest data.",
        minutes: 11,
        concept: {
          anchor: "One rubber stamp pressed at every position — the pattern is found wherever it sits.",
          what: "A **convolutional layer** slides one small set of learned filters across every position, producing feature maps; **stacked convolutions** build edges → textures → parts, with translation invariance from sharing.",
          why: "Dense wiring on images explodes (150M weights, layer 1) and can't reuse the fact that **a spot is a spot wherever it sits**. Shared sliding filters cut the parameters by orders of magnitude and encode the invariance as structure.",
          where: [
            "**Agriculture / medical / industrial vision** — everywhere spots and defects matter",
            "**Any task with <10k images** — transfer learning from ImageNet-scale backbones",
            "**Detection and segmentation** — CNN (or ViT) backbones under every system",
          ],
          whenNot:
            "On tabular or text-style data convolutions encode the wrong priors (no translation structure); and with abundant data, **ViT-class transformers compete** — the choice is a data-scale decision, with CNNs still dominant in the small-data regime.",
        },
        diagram: {
          kind: "decision",
          root: {
            kind: "decision",
            question: "New vision task — how do you source the model?",
            branches: [
              {
                label: "<10k images, natural-image-like domain",
                node: {
                  kind: "leaf",
                  answer: "Frozen pretrained backbone + new head",
                  caption: "then optional full fine-tune at a small rate",
                },
              },
              {
                label: "unusual imaging (X-ray, ultrasound, satellite)",
                node: {
                  kind: "leaf",
                  answer: "Still transfer first",
                  caption: "low-level filters cross domains — check the literature before scratch",
                },
              },
              {
                label: "ImageNet-scale data AND a genuinely alien domain",
                node: {
                  kind: "leaf",
                  answer: "From-scratch is defensible",
                  caption: "the rare case — prove the first two fail",
                },
              },
            ],
          },
        },
        prose: [
          "The design argument, made quantitative in the visual: a dense first layer on 224×224×3 input needs 150M weights — and learns the disease spot at position (10,10) as unrelated to the same spot at (200,180). Convolution fixes both defects at once: one 3×3 filter (9 numbers) tested at every position yields a feature map of *where that pattern fired*, encoding local structure and translation invariance by construction rather than by hope.",
          "Stacking completes the hierarchy — the depth-is-a-feature-factory lesson, specialized to images: conv1 edges, conv2–3 textures and spots, conv4+ lesion patterns and parts, then a dense head reads the evidence. Pooling and strides compress positions, so deeper layers see wider context. This mirrors how nothing in the pipeline was hand-designed: the hierarchy is learned because it reduces loss.",
          "The professional default is the recipe in the visual: **take a pretrained backbone, freeze it, train a new head, then optionally fine-tune the whole stack with a small learning rate.** Mango went 74% → 91% held-out this way — the strongest regularizer in vision is starting from a network that already knows how to see. Train from scratch only when you have ImageNet-scale data or a domain utterly unlike natural images (and even then, check the literature first).",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A team with 5,000 labeled industrial X-ray images plans to train a 50-layer CNN from random initialization because 'pretraining is for photos, not X-rays.' Their budget covers two GPU-months. What's the strongest professional counter?",
            choices: [
              { id: "a", label: "Pretrained early filters (edges, blotches, gradients) transfer even across domains — a frozen-then-fine-tuned ImageNet backbone is the cheap first experiment, and the literature on medical/industrial imaging backs it" },
              { id: "b", label: "They're right — random initialization is standard for any non-photo domain" },
              { id: "c", label: "Pretraining only helps if the classes are the same" },
              { id: "d", label: "50 layers can't converge on 5,000 images under any initialization" },
            ],
            answer: "a",
            explanation:
              "Transfer works because low-level structure (edges, contrast, texture) is nearly universal across imaging domains — medical imaging results have shown this for a decade. The from-scratch run may eventually match it; the pretrained run matches it in days, which at two GPU-months of budget is the experiment that de-risks everything else.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Your defect detector works on the left half of products but misses identical defects on the right half. The training set happens to show defects centered-left. Which architectural property was supposed to prevent this, and why did it fail anyway?",
            choices: [
              { id: "a", label: "Translation invariance from shared filters — but learned position quirks die only with data covering all positions: augment with random crops/translations so no position is privileged" },
              { id: "b", label: "Dropout — it should be increased until the asymmetry disappears" },
              { id: "c", label: "Batch norm — normalizing per side would fix it" },
              { id: "d", label: "The dense head — replacing it with more conv layers guarantees position-freeness" },
            ],
            answer: "a",
            explanation:
              "Convolutions make the *filters* position-agnostic, but the statistics of what the network sees are still data-driven: a dataset with left-positioned defects teaches 'defects live left'. Position augmentation (crops, shifts) is the standard cure — the failure was a data-distribution bug expressing itself through an invariance the architecture only half-provides.",
          },
        ],
      },
      {
        slug: "sequences-to-attention",
        title: "The fading conveyor belt",
        blurb: "Why RNN memory decays, and how attention's spotlight replaced it — at a price.",
        topic: "transformers",
        skillIds: ["attention-mechanism"],
        capability: "Explain long-range dependency failure in RNNs and the attention mechanism that solved it.",
        minutes: 10,
        concept: {
          anchor: "Attention replaces a twenty-hand relay with a switchboard: any position reaches any other in one hop.",
          what: "RNNs compress the past into **one fixed-size state updated at every step** — signal and gradients decay with distance, and training is sequential across time. **Attention** replaces the relay with direct, learned, weighted connections between any two positions.",
          why: "The constraint at word 20 must influence word 1's meaning downstream — a path of 19 sequential updates destroys it: the gradient is a product of 19 Jacobians, and unless each preserves magnitude, the long-range signal decays exponentially. Attention makes the path **one hop**, so distance stops mattering.",
          where: [
            "**Every LLM** — attention is the L in it",
            "**Long documents** — contracts, charts, code, where RNNs collapsed",
            "**The O(n²) cost ceiling** — the constraint driving Lesson 12's architectures",
          ],
          whenNot:
            "Short streams, strict memory budgets, or streaming/edge inference — where a small RNN or state-space model still runs and an n² attention map cannot. Attention won the main sequence; it didn't repeal physics.",
        },
        prose: [
          "The RNN mechanism is honest about its cost: one hidden state, overwritten every step — a summary of everything so far, compressed to fixed size no matter the length. Two consequences follow, and the second decided the industry. Informationally, the summary cannot retain everything, and the gradient from step 20 back to step 1 is a product of 19 Jacobians whose norms typically shrink it — long-range learning signal decays exponentially, and widening the state does not change the product structure. Computationally, step t needs step t−1 first: training is **sequential across the time axis**, with no parallelism across positions, on hardware whose entire economics is parallelism. That, as much as the gradient decay, is what attention removed.",
          "Attention's move is structural: stop summarizing the past into one box, and let **every position query every other position directly**. A query–key match score becomes, via softmax, a spotlight distribution; the output is a weighted blend of value vectors. The word 'plan' pulls hard on 'nitrogen' and 'NOT' wherever they sit — distance is now one hop, and the gradient path is one hop too. This single change took language modeling from fragile to industrial.",
          "Keep the price tag in view from day one: every token attending to every token is **O(n²)** in sequence length. That bill — not modeling power — is what limits context windows today, motivates KV-cache engineering, and drives the entire 2025–26 architecture frontier (Lesson 12) — and it is why Mango's contract summarizer chunks long documents: the invoice, not the mechanism, set its context length. Understanding attention means understanding both halves: the mechanism and its invoice.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A legacy system summarizes hour-long machine-telemetry streams with an RNN: faults in the first minutes are systematically missed in reports about later anomalies. An engineer proposes 'more hidden units.' What's the correct diagnosis?",
            choices: [
              { id: "a", label: "Fixed-size-state decay — the early signal is overwritten no matter the width; the architectural fix is direct access to earlier states (attention or a state-space model designed for long recall)" },
              { id: "b", label: "Correct proposal — width fixes retention" },
              { id: "c", label: "The streams should be reversed so faults are last" },
              { id: "d", label: "RNNs cannot process telemetry at all" },
            ],
            answer: "a",
            explanation:
              "Width dilutes but doesn't fix compression: still one state summarizing 60 minutes, still 59-step gradient paths. The failure is architectural (indirect access), so the fix is architectural (direct access). Attention solved exactly this class of problem — that's why it exists.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Mango's contract summarizer chunks 300-page documents because whole-document attention 'doesn't fit the budget.' A hardware refresh quadruples the memory and compute available per node. Which premise of that constraint relaxed, and what becomes defensible?",
            choices: [
              {
                id: "a",
                label: "The O(n²) affordability premise — with 4× budget the crossing point moves out to roughly 2× the sequence length (the bill grows quadratically); re-benchmark un-chunked context before keeping the chunking",
              },
              {
                id: "b",
                label: "The gradient-decay premise — better hardware fixes vanishing gradients, so RNNs return as the better summarizer",
              },
              {
                id: "c",
                label: "None — chunking was a modelling choice, not a budget choice, so nothing changes",
              },
              {
                id: "d",
                label: "The fixed-size-state premise — attention is now free at any length",
              },
            ],
            answer: "a",
            explanation:
              "The chunking existed because n² compute and KV memory crossed the budget line; quadruple the line and the crossing point moves out ≈2× (the bill grows with n², so budget scales as length squared). The mechanism did not change — the invoice did. That is the lesson's domain of validity: attention is bounded by affordability, not by power, and relax the budget and the design flips with it.",
          },
        ],
      },
      {
        slug: "inside-the-transformer",
        title: "The anatomy of a Transformer",
        blurb: "Q/K/V as a soft lookup, multi-head specialization, positions, and the GPT block.",
        topic: "transformers",
        skillIds: ["transformer-architecture", "attention-mechanism"],
        capability: "Walk the full forward pass of a decoder-only transformer and name what each part contributes.",
        minutes: 12,
        concept: {
          anchor: "A notice board: everyone posts what they seek, what they offer, and lends accordingly.",
          what: "Self-attention projects every token three ways — **Query** (what I seek), **Key** (what I advertise), **Value** (what I lend) — mixes values by softmax(query·key) match, and stacks with a per-token **MLP** inside residual-wrapped blocks.",
          why: "This is the load-bearing architecture of the decade: GPT, BERT-era encoders, and most frontier models are variations on this one block. Reading any model card, paper, or scaling decision requires these internals.",
          where: [
            "**Every GPT-class model** — decoder-only stacks of this exact block",
            "**Encoder models** (BERT-class) — bidirectional attention over the same Q/K/V core",
            "**Cross-attention** — decoders borrowing from encoders (translation, image captioning)",
          ],
          whenNot:
            "The stack has real limits — **quadratic context**, no persistent memory across sessions, positional information bolted on rather than native. If your problem is million-token exact recall, this architecture alone is the wrong tool (Lesson 12).",
        },
        prose: [
          "The lookup frame makes the math readable: every token builds a query ('I'm *plan* — any treatment or nutrient context?'), a key (its own label on the shelf spine), and a value (the content it hands over on a match). Match scores are dot products; softmax turns them into a spotlight distribution; the output is the weighted blend of values. Three learned projections per token per head — nothing more exotic than matrix multiplies.",
          "Multi-head is the same lookup run in parallel with different projections, and specialization emerges unprompted: heads tracking syntax, negation, entity bindings, position. The other half of the block is the **feed-forward MLP** — each token 'thinks alone' about what it just gathered, and most of the model's parameters live here, not in attention. Residual connections plus layer norm wrap both sub-layers, keeping a clean gradient path through stacks 100-deep.",
          "Attention is order-blind (a permutation of tokens attends identically), so positions are **injected** — added signatures (sinusoidal or learned) that make 'spray then prune' distinguishable from its reverse. Stack N blocks, append a linear head to the vocabulary, softmax — and next-token prediction, the whole GPT objective, falls out. The block is simple; the consequences (scaling, in-context learning) are not — those are Lesson 7. (Mango's advisory model is this block, repeated: the agronomy LoRA of Lesson 8 rides on top of exactly this anatomy.)",
        ],
        exercise: {
          id: "ex1",
          title: "One attention distribution by hand",
          prompt:
            "Given match scores between a query and four keys, softmax_attention should return the normalized spotlight weights. Two lines are wrong — fix them so the weights sum to 1.",
          starterCode: `import math

def softmax_attention(scores):
    """Turn raw match scores into attention weights that sum to 1."""
    exps = [math.exp(s) for s in scores]
    total = sum(scores)          # <-- wrong
    return [e / len(exps) for e in exps]   # <-- wrong
`,
          testCode: `
weights = softmax_attention([2.0, 0.5, 0.1, -1.0])
ok = True
message = "ok"
if abs(sum(weights) - 1.0) > 1e-9 or abs(weights[0] - 0.6420) > 0.01:
    ok = False
    message = f"weights {weights} don't softmax correctly"
`,
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A new hire asks why a transformer needs both attention AND the per-token MLP — 'isn't attention doing the work?' What's the accurate division of labor?",
            choices: [
              { id: "a", label: "Attention moves information BETWEEN tokens; the MLP transforms each token's representation in private — and holds most of the parameters. Remove either and the block loses half its function" },
              { id: "b", label: "The MLP is a legacy compatibility layer and can be dropped" },
              { id: "c", label: "Attention does the math; the MLP only does the softmax" },
              { id: "d", label: "They're redundant implementations of the same operation, kept for robustness" },
            ],
            answer: "a",
            explanation:
              "Communication vs computation: attention is the only path by which tokens exchange information, while the MLP — typically 2–4× the attention parameters — does per-position nonlinear processing of what was gathered. Ablating either degrades the model sharply; this split is the architecture's central design fact.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A team trains a small transformer WITHOUT positional information 'to make it order-agnostic' for molecule sequences. It fails badly. Meanwhile another team's model sees shuffled documents. What property explains both?",
            choices: [
              { id: "a", label: "Attention is permutation-equivariant by construction — token ORDER carries no signal to the model unless injected via positional encodings; molecule order was signal, document order was noise" },
              { id: "b", label: "Positional encodings slow training, causing the failure" },
              { id: "c", label: "Transformers cannot process sequences without RNN preprocessing" },
              { id: "d", label: "The softmax saturated because sequences were too short" },
            ],
            answer: "a",
            explanation:
              "The same property cuts both ways: bare attention reads a token set, not a sequence. When order matters (molecules, grammar), it must be injected; when it doesn't (shuffled documents), the equivariance is a free robustness win. Knowing which regime you're in decides whether to add the encodings.",
          },
        ],
      },
      {
        slug: "llm-training-pipeline",
        title: "The factory that builds a model",
        blurb: "Tokenization → pretraining → SFT → RLHF: what each stage buys, and what it costs.",
        topic: "llm-training",
        skillIds: ["llm-training-pipeline", "transformer-architecture"],
        capability: "Map any LLM product decision to its pipeline stage, and reason from scaling laws.",
        minutes: 12,
        concept: {
          anchor: "General schooling happens once for everyone; the apprenticeship after it is cheap and per-product.",
          what: "LLMs are built in stages: **tokenization** (subword pieces), **pretraining** (next-token prediction over trillions of tokens — >99% of compute), **SFT** (instruction responses), **RLHF/alignment** (preference tuning).",
          why: "Each stage answers a different question — 'what is text', 'what usually comes next', 'how should an assistant behave', 'which answer do humans prefer' — and each is a **buy/rent/build** decision with orders-of-magnitude different costs.",
          where: [
            "**Open-weight bases** (Llama-class) — stage 1 done once, shared",
            "**Every product LLM** — stages 2–3 per product, cheaply",
            "**Scaling laws** — loss is predictable from compute/data/params before training",
          ],
          whenNot:
            "Don't pretrain unless you have a genuinely novel domain corpus and capital to burn — renting stage 1 loses almost nothing. And scaling laws are interpolative guides, not guarantees at capability jumps (emergence debates apply).",
        },
        prose: [
          "The economics are the lesson. Pretraining a frontier model costs $10M–$1B+ and buys knowledge and fluency; SFT costs days of GPU time on tens of thousands of curated pairs and buys behavior; RLHF adds a reward model plus preference optimization and buys taste. The pyramid means almost every product team starts at stage 2 on a shared base — Mango did.",
          "Scaling laws turned training from alchemy into engineering. The bill is `C ≈ 6·N·D` FLOPs — N parameters, D tokens, every weight touched for every token, forward and backward — and the loss follows a smooth power law `L(N,D) = E + A/N^α + B/D^β` (α≈0.34, β≈0.28: no cliffs, no magic thresholds), so 'what will 2× budget buy?' is answerable before the run. Minimizing loss per training-FLOP over that law gives Chinchilla's balance — roughly **20 tokens per parameter** — which corrected an era of undertrained big models and reset how everyone sized runs.",
          "The practical reading of any model card is now: which stage does this model stop at? A 'base' model stops after pretraining (completion, not assistance); an 'instruct' or 'chat' model carries SFT and alignment. The gap between those two artifacts — same pretraining, different stages — is exactly the gap your product's prompt engineering and fine-tuning will work within.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A foundation-model startup with $2M raised proposes pretraining a 7B-parameter model on 'general web + internal medical corpus' to differentiate. Applying the factory's economics, what's the right pushback?",
            choices: [
              { id: "a", label: "Pretraining buys knowledge the open bases already have; differentiation lives in stages 2–3 (SFT on their medical data, alignment for their users) at ~1% of the cost — and their corpus's unique value survives either way" },
              { id: "b", label: "Correct plan — pretraining is the only stage that captures proprietary data" },
              { id: "c", label: "7B is too small to pretrain; they should do 70B instead" },
              { id: "d", label: "They should skip pretraining and SFT only if they also buy GPUs for inference" },
            ],
            answer: "a",
            explanation:
              "Knowledge injection from a corpus is what RAG and continued-pretraining-on-a-base do cheaply; from-scratch pretraining mostly re-purchases general competence. With $2M, stage-1 replication is the one purchase that can't differentiate — stages 2–3, plus retrieval over the corpus, is where the product actually lives.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Planning a run, a team cites Chinchilla and proposes 1.4T tokens for a 70B model. An advisor suggests 3T tokens instead, accepting ~2× training cost. Under what stated goal is the advisor's advice coherent?",
            choices: [
              { id: "a", label: "The model will be served billions of times after training — Chinchilla balances TRAINING compute only; inference-heavy deployments justify over-training (more tokens per parameter) because it buys lower loss at cheaper serving sizes" },
              { id: "b", label: "Chinchilla was disproven; always train on as many tokens as possible" },
              { id: "c", label: "It's coherent only if the dataset is smaller than 1.4T tokens" },
              { id: "d", label: "Token count doesn't affect loss — only parameters do" },
            ],
            answer: "a",
            explanation:
              "Compute-optimal is objective-relative: Chinchilla minimizes loss per training-FLOP, but models are deployed, not just trained. The industry's post-Chinchilla practice — small models trained far past 20 tokens/param — exists precisely because serving costs dominate: the advisor is trading training budget for inference efficiency, and saying so is what makes the advice reviewable.",
          },
        ],
      },
      {
        slug: "efficient-fine-tuning",
        title: "Adapt without retraining",
        blurb: "LoRA, quantization, distillation — and the prompt → RAG → fine-tune ladder that orders them.",
        topic: "llm-training",
        skillIds: ["lora-fine-tuning", "llm-training-pipeline"],
        capability: "Run the LoRA/QLoRA recipe and defend the climb order: prompt before retrieve before fine-tune.",
        minutes: 12,
        concept: {
          anchor: "Clip-on lenses over the same glasses — small add-ons change the look without re-grinding the glass.",
          what: "**LoRA** freezes the base model and trains small rank-decomposed matrices per layer (~0.1–1% of parameters), merged at inference for zero added latency; **quantization** (4-bit) shrinks memory ~4×; **distillation** compresses capability into a smaller student.",
          why: "Full fine-tuning rewrites **every one of a billion-plus parameters** to change *style and behavior* — and 2025-era results show the change a fine-tune makes is **low-rank**: small adapters match full fine-tuning at modest ranks, even under RL-based training.",
          where: [
            "**Domain tone/format** — a LoRA makes a general model speak agronomy, medicine, legalese",
            "**QLoRA** — 4-bit base + adapters: meaningful fine-tunes on single consumer GPUs",
            "**Edge distillation** — teacher-student compression for on-device deployment",
          ],
          whenNot:
            "Fine-tuning teaches **behavior, not facts**: a LoRA that never saw this week's prices won't know them. Knowledge problems belong to RAG one rung down the ladder — and both only after prompting has genuinely been exhausted.",
        },
        prose: [
          "Start from the memory bill you already pay: full fine-tuning holds fp16 weights, fp32 master copies, Adam's two moment tensors, and gradients — roughly **16 bytes per parameter**, so 8B weights ≈ 128 GB before activations. A 24 GB card therefore cannot full-fine-tune an 8B model under any configuration; the arithmetic forbids it. The escape is empirical: the *delta* a behavior fine-tune actually produces is **low-rank** — well-approximated by two thin matrices per weight matrix, ΔW ≈ B·A at rank 8–64, which cuts trainable parameters from O(d_out·d_in) to O(r·(d_out + d_in)). Train ~8M parameters on one 24 GB card in two days, merge B·A back into W at the end, and the served graph is unchanged — zero added latency. **LoRA**, named only now, is that merge. QLoRA stacks a 4-bit quantized base under the adapters, dropping the floor to a laptop-class GPU.",
          "Distillation answers a different constraint: deployment. A student model trained on the teacher's output distribution (not just labels) inherits softened decision boundaries — 8B-quality behavior in a 1–2B body. Mango's offline on-device checker is the canonical use: no connectivity, 400 MB, distilled from the advisory stack.",
          "The ladder is the discipline that makes all three tools safe: **prompt** (free, instant), **RAG** (knowledge, fresh, auditable), **fine-tune** (behavior, latency, format). Teams that invert it ship LoRAs for facts that go stale weekly and prompt-engineer what needed neither. Climb only when the rung below demonstrably fails — each rung up costs data, infrastructure, and retraining discipline.",
        ],
        exercise: {
          id: "ex1",
          title: "Price a LoRA",
          prompt:
            "For a weight matrix of out×in dimensions updated at rank r, LoRA trains an out×r matrix and an r×in matrix. lora_params has the two dimensions swapped in one place — fix it so the counts come out right.",
          starterCode: `def lora_params(out_dim: int, in_dim: int, rank: int) -> int:
    """Trainable params when adapting an out_dim x in_dim matrix at the given rank."""
    return out_dim * rank + in_dim * in_dim   # <-- wrong second term
`,
          testCode: `
cases = [(4096, 4096, 16, 131072), (1024, 1024, 8, 16384)]
ok = True
message = "ok"
for out_dim, in_dim, rank, expected in cases:
    got = lora_params(out_dim, in_dim, rank)
    if got != expected:
        ok = False
        message = f"lora_params({out_dim}, {in_dim}, {rank}) -> {got}, expected {expected}"
        break
`,
        },
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A support team fine-tuned a base model so it 'knows our refund policy.' It answers refunds flawlessly in testing — then cites last quarter's policy window amounts after a policy change. What's the diagnosis and the right tool?",
            choices: [
              { id: "a", label: "Fine-tuning taught behavior, not living facts — the policy date changed and the adapter still whispers the old numbers. Move the policy into retrieval (RAG) so facts refresh without training, keep the LoRA for tone and format" },
              { id: "b", label: "The LoRA rank was too low — retrain at rank 64 and it will track policy changes" },
              { id: "c", label: "Base models can't learn policies; they needed a bigger model" },
              { id: "d", label: "Fine-tuning is still right; just retrain weekly on policy diffs" },
            ],
            answer: "a",
            explanation:
              "Weights are frozen snapshots of training-time text. Anything that changes faster than your retraining cadence — policies, prices, inventory — is a retrieval problem by definition. The weekly-retrain answer spends training money to chase what a database lookup gives for free, correctly versioned.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A team proposes LoRA to inject 5,000 new domain-specific vocabulary terms into an 8B model — the adapter must teach the model to *use and explain* terms it has never seen. Rank 8 keeps missing them; rank 64 barely improves. Which premise of the LoRA derivation breaks, and what does the boundary force?",
            choices: [
              {
                id: "a",
                label: "The low-rank-delta premise — knowledge injection moves what the base model knows, and that change is empirically high-rank; the escape hatch closes, forcing continued pretraining on the corpus (or retrieval over it) instead of a bigger adapter",
              },
              {
                id: "b",
                label: "The 16-bytes-per-parameter arithmetic — the team mis-measured their GPU memory",
              },
              {
                id: "c",
                label: "The zero-latency premise — merging B·A is too slow for new vocabulary",
              },
              {
                id: "d",
                label: "The quantization premise — a 16-bit base under rank-8 adapters would learn the terms",
              },
            ],
            answer: "a",
            explanation:
              "LoRA's derivation carries its domain of validity: it works because behavior deltas are low-rank. Teaching new knowledge is precisely the violating case — it touches the base model's representations broadly, so no modest rank suffices, and rank-chasing is spending compute inside a boundary the derivation already drew. The boundary points elsewhere: continued pretraining for knowledge, or retrieval — which is also the ladder's rule, facts to RAG and behavior to fine-tune.",
          },
        ],
      },
      {
        slug: "alignment-rlhf",
        title: "Teaching taste",
        blurb: "Reward models, RLHF vs DPO — and the failure modes alignment cannot fix.",
        topic: "llm-training",
        skillIds: ["alignment-techniques", "llm-training-pipeline"],
        capability: "Design a preference-data plan and choose RLHF vs DPO; anticipate reward hacking and sycophancy.",
        minutes: 11,
        concept: {
          anchor: "Alignment tunes taste, not knowledge — preferences are the curriculum, and the annotators' rubric is the spec.",
          what: "Alignment tunes a pretrained model toward **human preferences**: collect pairwise answer choices, train a **reward model** on them, then optimize — with **RLHF** (PPO against the reward model) or **DPO** (a direct closed-form loss on pairs, no RL loop).",
          why: "Pretraining optimizes 'plausible next token', which is orthogonal to 'appropriate for this user, here, now'. Preference data is where product judgment enters the model — the annotators' rubric IS the specification.",
          where: [
            "**Instruct/chat models** — every production assistant carries this stage",
            "**Domain tone** — Mango's advisor hedging dosages and asking crop stage",
            "**Safety behavior** — refusals calibrated to context rather than blanket",
          ],
          whenNot:
            "Alignment shapes **behavior, not knowledge** — a tuned model still invents facts, now more persuasively. And it installs whatever the preferences encode: reward hacking, sycophancy, and annotator bias ship with it. Eval forever.",
        },
        diagram: {
          kind: "decision",
          root: {
            kind: "decision",
            question: "Choosing the alignment recipe:",
            branches: [
              {
                label: "gap is tone/format; no RL team; tight timeline",
                node: {
                  kind: "leaf",
                  answer: "DPO",
                  caption: "closed-form pair loss — stable, one stage",
                },
              },
              {
                label: "heavy optimization needed (reasoning, hard safety)",
                node: {
                  kind: "leaf",
                  answer: "RLHF",
                  caption: "PPO's optimization headroom, at infra cost",
                },
              },
              {
                label: "the preference rubric isn't written yet",
                node: {
                  kind: "leaf",
                  answer: "Neither — write the rubric first",
                  caption: "the annotators' rubric IS the specification",
                },
              },
            ],
          },
        },
        prose: [
          "The base/pretrained model optimizes text plausibility; products need appropriateness. The bridge is preference data: humans (or strong raters with a rubric) compare answer pairs, thousands of times. Those pairs train a reward model — a learned scorer of 'which response fits this product's taste' — and the specification is nothing more or less than what the rubric and annotators encoded. Write the rubric like a product doc; it is one.",
          "RLHF closes the loop with reinforcement learning: the policy generates, the reward model scores, PPO nudges generation toward higher reward, with a KL penalty keeping the policy near the base model. It works and is finicky — four models in memory, unstable training, and a policy that will happily maximize the scorer rather than the intent (Goodhart). **DPO** skips the RL machinery entirely: a closed-form loss on the preference pairs that raises the preferred answer's log-odds over the rejected one — `−log σ(β·(log π(y_w|x)/π_ref(y_w|x) − log π(y_l|x)/π_ref(y_l|x)))`, one line over policy and reference log-probs, with no reward model in memory. Simpler and stabler — the default for teams without an RL research group, with RLHF retained where heavy optimization matters.",
          "Hold both failure modes in view. **Reward hacking**: verbosity and confident formatting inflate the scorer, so the model drifts verbose and overconfident. **Sycophancy**: annotators softly prefer agreement, so the model learns to validate a wrong user plan instead of correcting it. Neither is a bug you fix once — they're return currents of optimizing a proxy, managed by eval sets that specifically probe them.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "After preference tuning, your assistant's answers grow measurably longer and more confident — humans rated longer, assertive answers higher during data collection. Output quality checks show no factual improvement. What occurred, and what's the corrective?",
            choices: [
              { id: "a", label: "Classic reward hacking — the policy optimized the annotators' length/formatting bias, not helpfulness. Corrective: re-collect preferences with length and confidence controlled in the rubric, and add adversarial evals where the SHORT answer is the better one" },
              { id: "b", label: "Normal behavior — longer answers are always more helpful" },
              { id: "c", label: "The DPO loss diverged; switch to RLHF" },
              { id: "d", label: "The reward model overfit; more RLHF steps will smooth it out" },
            ],
            answer: "a",
            explanation:
              "The policy maximized what the scorer actually measured — and the scorer measured annotator bias. Goodhart is structural, not incidental: the fix is in the data (rubric controls, paired-length comparisons) and the evals (probes where the preferred behavior is brevity), not in more optimization of the same signal.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A four-person team must align a base model for their product and is choosing between RLHF and DPO. No RL specialist; one week of preference data collection budget; the behavior gap is tone and format, not reasoning depth. Which recommendation and rationale?",
            choices: [
              { id: "a", label: "DPO — it optimizes directly on preference pairs with one model and no RL infrastructure, and tone/format shifts are exactly where it matches RLHF's results for a fraction of the complexity" },
              { id: "b", label: "RLHF — it's the classic method, so it must be first choice" },
              { id: "c", label: "Neither — skip alignment and prompt-engineer only" },
              { id: "d", label: "DPO, because it needs no preference data at all" },
            ],
            answer: "a",
            explanation:
              "DPO's whole value proposition is this team: closed-form preference optimization, stable, single-model, no PPO plumbing. RLHF earns its complexity when heavy optimization against a reward model is doing work a pair-loss can't — reasoning-heavy behavior, typically at frontier labs' scale. (And DPO absolutely needs preference data — option d is a trap.)",
          },
        ],
      },
      {
        slug: "diffusion-models",
        title: "Destroying noise, slowly",
        blurb: "How diffusion generates images, why it displaced GANs, and the text frontier.",
        topic: "generative-models",
        skillIds: ["diffusion-models"],
        capability: "Explain forward/reverse diffusion, the guidance dial, and diffusion's trade-offs as a generator.",
        minutes: 11,
        concept: {
          anchor: "A darkroom print developing in the tray — the image condenses out of the grain, pass by pass.",
          what: "**Diffusion** trains a network to predict noise: forward process adds Gaussian noise over ~1,000 steps until static; **generation runs it in reverse** — from static, remove predicted noise step by step until an image condenses.",
          why: "The training objective is boring supervised regression — no adversarial equilibrium to collapse — which is exactly why it displaced GANs: **stable training, full distribution coverage, one model per domain** instead of per-class.",
          where: [
            "**Image generation/editing** — every mainstream text-to-image product",
            "**Audio and video synthesis** — the same recipe in other modalities",
            "**Diffusion LLMs** — parallel whole-draft generation, the 2026 frontier bet",
          ],
          whenNot:
            "The latency floor: 20–50 network calls per sample (vs 1 for a GAN) makes diffusion wrong for real-time single-sample needs, and exact reproduction of training items is not what it does. For deterministic transformations, classic rendering or an autoencoder still wins.",
        },
        prose: [
          "The two directions are asymmetric in cost: the forward process (training) is just 'add measured noise repeatedly to real data' — no labels needed beyond the noise schedule itself. The network learns to predict the noise at any corruption level. Generation is the reverse run: start from static, ask the network what noise it sees, subtract a little, repeat — 20–50 sampling steps, each a full network call. Structure condenses gradually: silhouette before texture, texture before detail.",
          "Why this beat GANs, which generate in a single pass: GAN training is a two-player equilibrium (generator vs discriminator) that collapses without warning and famously mode-drops — covering only its best outputs. Diffusion's per-step regression objective is stable by construction and covers the whole data distribution; conditioning the denoiser on text embeddings (from a CLIP-class encoder — Lesson 11) made one model paint anything describable. The price is that sampling latency floor, which the product tier of every image company engineering-blogs about.",
          "**Classifier-free guidance** is the dial product teams actually tune: run denoising with and without the prompt, extrapolate away from the unconditional drift — `ε* = ε_uncond + s·(ε_cond − ε_uncond)`, the guidance dial s literally the extrapolation strength. At guidance ≈ 1 the model dreams loosely; ≈ 7 is prompt-faithful vividness (most products' default); ≈ 20 is overcooked literalism with warped hands. And the frontier lesson: diffusion LLMs apply the same reversal to text — denoise a whole draft in parallel sweeps instead of 1,000 sequential token choices — trading autoregressive latency for iterative refinement. Early, imperfect, and the most consequential architecture bet since attention. (Mango's marketing renders — pest-damage mock-ups for the advisory app — run through exactly this lesson's defaults: guidance 7, overnight batch, diversity first.)",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A product team is choosing between a GAN and a diffusion model for generating 10,000 diverse product-photo backgrounds overnight (batch, not real-time). Diversity coverage is the top requirement. Which reasoning is correct?",
            choices: [
              { id: "a", label: "Diffusion — its per-step denoising objective covers the full distribution where GANs mode-collapse to a few outputs; the per-sample latency is irrelevant in an overnight batch job" },
              { id: "b", label: "GAN — single-pass generation is always the deciding factor" },
              { id: "c", label: "GAN — because GANs are more diverse than diffusion by design" },
              { id: "d", label: "Neither — backgrounds must be photographed, not generated" },
            ],
            answer: "a",
            explanation:
              "Mode collapse is the GAN failure that diversity requirements trip over first, and diffusion's coverage advantage is structural. The GAN's one virtue — speed — only decides under interactive latency constraints, which an overnight batch explicitly doesn't have. Matching the cost structure to the requirement is the whole judgment.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Your text-to-image pipeline ships at guidance 7. Marketing wants 'more wow' and an engineer suggests 20. In review, what's the professionally complete answer about what guidance does and what to do?",
            choices: [
              { id: "a", label: "Guidance extrapolates away from unconditional generation — more means harder prompt-following but past ~10–15 it overcooks: saturation, warped anatomy, literalism. A/B test the 8–12 band against the quality eval set; 20 should need extraordinary evidence" },
              { id: "b", label: "Guidance is a quality dial: 20 is simply twice as good as 10" },
              { id: "c", label: "Guidance only affects speed, not appearance" },
              { id: "d", label: "Raise it to 20 — warped hands indicate the model is trying harder" },
            ],
            answer: "a",
            explanation:
              "The dial has a cliff: a modest amount buys prompt fidelity, past it the extrapolation amplifies artifacts as fast as vividness. The professional move is treating 'more wow' as an eval-set question — sweep 8–12, measure against a scoring rubric, and let the numbers pick. Vibes tuned the dial; evals should turn it.",
          },
        ],
      },
      {
        slug: "multimodal-models",
        title: "One space for two senses",
        blurb: "CLIP's shared embedding space, zero-shot classification, and vision-language models.",
        topic: "generative-models",
        skillIds: ["multimodal-embeddings"],
        capability: "Use contrastive training's shared space for zero-shot tasks, and know when it transfers and when it doesn't.",
        minutes: 10,
        concept: {
          anchor: "A pinboard where photos and their captions hang side by side — the nearest caption names the photo.",
          what: "**CLIP-style training** runs an image encoder and a text encoder over ~400M matched pairs, pulling matched photo–caption embeddings together and pushing mismatched apart — one **shared space** where similarity across modalities is meaningful.",
          why: "The shared space makes prompts into classifiers: an image is labeled by whichever caption embedding lands nearest — **zero-shot**, no labeled examples, no training run. This is the machinery under image search, generation conditioning, and VLMs.",
          where: [
            "**Zero-shot triage** — Mango's three-sentence disease classifier",
            "**Image search / retrieval** — text queries against image embeddings",
            "**VLMs** — vision encoder + projection + LLM: models that see and read",
          ],
          whenNot:
            "Shared space ≠ shared understanding: fine-grained expert distinctions (early rust vs nutrient burn) never appeared in contrastive pretraining — **zero-shot breadth doesn't transfer to expert depth**. There, a small specialist head with your labels still wins.",
        },
        prose: [
          "Contrastive training is representation alignment as an objective: two encoders, one loss — matched pairs pulled together in embedding space, all mismatched pairs pushed apart. Formally, InfoNCE over the in-batch similarity matrix: `−log( e^(sim(Iᵢ,Tᵢ)/τ) / Σⱼ e^(sim(Iᵢ,Tⱼ)/τ) )` — a temperature-scaled softmax where the matched caption must beat every mismatched one in the batch, with τ setting how hard the push is. After 400M pairs, 'a photo of a mango leaf' sits near actual mango-leaf photos, structurally. No labels were collected; the pairing of internet photos with their captions did all the work.",
          "The immediate payoff is that prompts became programs: write K captions, embed them once, embed the image, take the nearest — a classifier authored in minutes. Mango's deployed triage tool was three sentences. The caveat is distributional: this works for concepts the pretraining corpus covered — broad, nameable things — and silently degrades on expert distinctions no caption ever drew.",
          "Vision-language models industrialize the same idea: a vision encoder produces embeddings, a small learned **projection** translates them into the LLM's token space, and the LLM reads image tokens like words. Everything you know about prompts, RAG, and fine-tuning from the LLM lessons applies unchanged — the image is now context. The division of labor holds: contrastive pretraining buys breadth; your labels still buy the last mile of depth.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A plant-pathology team uses CLIP zero-shot for 12 disease classes and gets 80% — great for week one. Agronomists need 95%+ on two visually near-identical early-stage diseases where zero-shot performs at chance. What's the architecturally sound next step?",
            choices: [
              { id: "a", label: "Keep CLIP's frozen image encoder as the feature extractor and train a small classification head on a few hundred labeled examples of the two confusable diseases — the shared space gives general features; your labels supply the expert boundary it never saw" },
              { id: "b", label: "Write longer, more detailed zero-shot prompts describing the two diseases" },
              { id: "c", label: "Switch to a different contrastive model and re-run zero-shot" },
              { id: "d", label: "Accept 80% — zero-shot is the ceiling for any vision task" },
            ],
            answer: "a",
            explanation:
              "Prompt engineering cannot create a boundary the embedding space never encoded — near-identical images sit near-identically in CLIP's space. But its features are strong general vision features: a linear or small MLP head on top, with a few hundred expert labels, is the standard cheap path to expert accuracy. Breadth rented, depth built.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "An e-commerce team wants shoppers to search products by photo ('find me this jacket, but green'). Which capability from this lesson is the direct building block, and what does the system actually compare?",
            choices: [
              { id: "a", label: "The shared CLIP-style space: embed the query photo and every product image in it, retrieve nearest neighbors, and generate the color variant with a diffusion model conditioned on 'green jacket' — retrieval compares image-to-image embeddings across one space" },
              { id: "b", label: "An LLM reading the photo's pixels directly — LLMs natively compare images by raw bytes" },
              { id: "c", label: "A GAN that generates the green jacket from noise — no retrieval involved" },
              { id: "d", label: "Zero-shot classification only: label the photo 'jacket' and search the text catalog" },
            ],
            answer: "a",
            explanation:
              "Photo search is the shared space's home use: cross-modal and same-modal nearest-neighbor in one embedding space, with generation models taking over for the 'but green' edit. The VLM and LLM options confuse language models' inability to compare raw pixels, and option d throws away exactly the visual similarity the shopper meant.",
          },
        ],
      },
      {
        slug: "frontier-architectures",
        title: "Breaking the quadratic bill",
        blurb: "MoE sparse capacity, Mamba/SSM linear context, hybrids — reading model cards as cost decisions.",
        topic: "frontier",
        skillIds: ["efficient-architectures", "transformer-architecture"],
        capability: "Read MoE and SSM/hybrid architecture choices as cost engineering, and bet on them accordingly.",
        minutes: 11,
        concept: {
          anchor: "FLOPs are billed per token; VRAM is bought once — and the frontier's architectures are what that split forces.",
          what: "Two frontier attacks on transformer costs: **MoE** makes capacity sparse — a learned router activates 1–2 of ~100 expert MLPs per token (~5–10% of parameters) — while **state-space models (Mamba)** make context linear, compressing the past into a fixed-size selective state instead of replaying it as O(n²) attention pairs.",
          why: "These are the levers behind 2025–26 frontier economics: DeepSeek-class models train affordably at hundreds of billions of parameters *because* most experts idle per token; million-token contexts become possible *because* SSM layers pay per token, not per pair.",
          where: [
            "**MoE frontier models** — most major open and closed releases since 2024",
            "**Hybrids (Jamba-class)** — Mamba blocks + a few attention layers, near-linear cost",
            "**Model cards** — '64 experts, 6 active' and 'hybrid SSM' lines are cost disclosures",
          ],
          whenNot:
            "Ecosystem gravity is real: attention has FlashAttention kernels, KV-cache inference, tooling, and a decade of tricks — pure-SSM replacements keep losing to it in deployment. Ship hybrids where the cost math forces it; don't bet the roadmap on attention disappearing.",
        },
        prose: [
          "Read both architectures as bill-attacks, because that's how they read in model cards. Start from the split the anchor states: attention compute is O(n²·d) per layer, and the KV cache — `2 · layers · heads · d_head · tokens · batch · dtype-bytes`, K and V for every past token — is the line that actually kills long-context serving, growing with sequence until the batch dies against the VRAM wall. MoE's move follows from capacity being purchasable separately from compute: parameters that sit resident but idle cost memory and nothing else, so *conditional execution decouples them*. Multiply the MLP layers into ~100 experts, route each token to 1–2, and total capacity scales with all experts while FLOPs scale with the active few — training and inference both. The invoice moves from FLOPs to VRAM: every expert is resident whether active or not, and routing adds load-balancing losses and instability.",
          "State-space models attack the context line of the invoice. Where attention re-attends to every past token (O(n²) pairs), an SSM maintains a fixed-size state updated per token (O(1) each, O(n) total) — RNN-shaped cost, but with a state update mathematically designed (HiPPO) to preserve long-range signal, and Mamba's *selectivity* making the compression content-aware: the model learns what to remember and what to drop. A 1M-token sequence becomes 1M cheap updates instead of 10¹² pairs.",
          "The honest ending is the hybrid and the moat. Jamba-class stacks interleave Mamba blocks with a few attention layers — linear cost overall, exact recall where attention earns its slot — and that is what actually ships to production. Meanwhile attention's ecosystem (kernels, caches, tooling, a decade of tricks) keeps beating pure replacements on the bench — the derivation's boundary, paid in engineering time. The professional posture: treat any new architecture as a cost-engineering proposal with evidence required, and read every model card's architecture line as a budget statement. For Mango's advisory stack the arithmetic already says hybrid: million-token agronomy histories are the ambition, but exact recall on spray-dosage clauses is the requirement — linear cost with attention where the recall lives.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A model card reads: 'total parameters 400B, active parameters 12B, 128 experts with top-2 routing.' An engineer concludes 'this is a 12B model.' What does the line actually tell you, and what does it get wrong in that reading?",
            choices: [
              { id: "a", label: "It's an MoE: capacity of 400B (all experts trained, all in memory) but per-token compute of ~12B (2 of 128 experts active). Calling it 'a 12B model' ignores that the other 388B parameters shape routing, load, and quality — and that serving must hold all 400B" },
              { id: "b", label: "Correct — only active parameters count for anything" },
              { id: "c", label: "The card is inconsistent: total and active must be equal" },
              { id: "d", label: "Routing means each token uses a random 12B subset, so results aren't reproducible" },
            ],
            answer: "a",
            explanation:
              "The split IS the design: quality tracks total capacity (every expert is trained and available), FLOPs track the active slice — that's the entire economics of MoE. But memory and load-balancing follow the total, so deployment sizing can't read '12B' either. The card line is a cost disclosure with three numbers, not one.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Your team needs 500k-token contract analysis with exact clause recall, on a budget where quadratic attention 'would cost more than the contracts are worth.' Pure Mamba bids linear cost but drops exact recall on a benchmark; a hybrid passes recall at 3× pure-Mamba cost (still far under attention). Which choice and reasoning holds up in review?",
            choices: [
              { id: "a", label: "The hybrid — it keeps a few attention layers precisely for exact recall, pays 3× Mamba but still far under quadratic, and matches the requirement the benchmark actually tested. Cheap-and-failing is the expensive option" },
              { id: "b", label: "Pure Mamba — lowest cost wins, and the recall benchmark is probably wrong" },
              { id: "c", label: "Full attention — correctness requires quadratic cost everywhere" },
              { id: "d", label: "Split every contract into 4k chunks with a standard transformer and merge summaries" },
            ],
            answer: "a",
            explanation:
              "The requirement is exact recall at length; the benchmark measured it; pure Mamba failed it — dismissing the measurement to keep the cheapest bid is how architectures get chosen backwards. The hybrid's design intent is exactly this regime. (Chunking, option d, silently loses cross-chunk dependencies — the contract's traps live across clauses.)",
          },
        ],
      },
      {
        slug: "production-ml-capstone",
        title: "Capstone: the anatomy of the loop",
        blurb: "Train → eval gates → shadow → canary → drift → retrain: Mango's whole system on one page.",
        topic: "production",
        skillIds: ["production-ml-lifecycle", "model-drift", "eval-gates"],
        capability: "Design the full production loop with gates and drift handling, and triage alarms as bug-before-drift-before-retrain.",
        minutes: 14,
        concept: {
          anchor: "A production model is a loop with gates — train, prove it offline, shadow it, canary it, watch it, retrain it.",
          what: "A production ML system is a **loop with gates**: train → offline eval in CI → shadow against the incumbent → canary to a traffic slice → monitor **data drift** (inputs moved) and **concept drift** (the input→label relationship moved) → feed retraining triggers back to data.",
          why: "Every lesson in this course occupies one station of the loop — the capstone is assembling them under real constraints: the gates make quality claims falsifiable, and the monitoring→data arrow is the difference between a demo and a product.",
          where: [
            "**Any deployed model** — classifier or LLM, the loop shape is the same",
            "**The drift pair** — data drift detectable without labels; concept drift needs delayed labels",
            "**The triage order** — pipeline bug before drift before retraining",
          ],
          whenNot:
            "Not every system earns the full ceremony: a batch model re-run weekly on stable data may need only eval gates and a data-drift watch. The loop scales with blast radius — match the gates to what failure costs, not to fashion.",
        },
        prose: [
          "The stations, populated by everything you just learned: the training station is optimizers, regularization, and transfer learning; the eval gate is metrics, leakage audits, and slice coverage; shadow and canary are the deployment discipline; monitoring is drift in its two flavors; and the return arrow — retraining triggers feeding the data station — is what makes the diagram a circle instead of a conveyor into production.",
          "The gates deserve their pedantry. **Offline eval in CI**: every candidate runs the held-out suite with per-slice floors (Mango: overall F1 ≥ 0.85, per-region ≥ 0.78) — a training score ships nothing. **Shadow**: the new model answers live traffic silently for weeks; you learn agreement with the incumbent before any farmer sees a change. **Canary**: 5% of traffic, hourly watches on agreement/latency/escape rate, auto-rollback on breach. Each gate answers a question the previous one couldn't.",
          "And the capstone's counter-lesson, learned by every team the hard way: when accuracy drops in production, the triage order is **pipeline bug before drift before retraining**. Mango's first 'drift' alarm was a camera-app update stripping EXIF rotation — every southern photo arrived sideways; retraining on rotated photos would have shipped a worse model with perfect intentions. Drift is real (both flavors eventually visit every deployed model), but it's the diagnosis of last resort, earned by first excluding the boring explanations. The instrumented half of this loop — telemetry, evals, incident triage — is a discipline of its own, and it's where your NEXT_COURSE points: AI Observability.",
        ],
        diagram: {
          kind: "decision",
          root: {
            kind: "decision",
            question: "Production accuracy dropped — triage in order:",
            branches: [
              {
                label: "pipeline bug found",
                node: {
                  kind: "leaf",
                  answer: "Fix the pipeline",
                  caption: "EXIF rotation, upload change, region outage",
                },
              },
              {
                label: "inputs shifted (data drift)",
                node: {
                  kind: "leaf",
                  answer: "Investigate and adjust",
                  caption: "brightness, mix, region — no labels needed",
                },
              },
              {
                label: "input→label link moved",
                node: {
                  kind: "leaf",
                  answer: "Concept drift → retrain",
                  caption: "the diagnosis of last resort",
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
              "Six weeks post-launch, Mango's daily data-drift dashboard fires: photo brightness distributions shifted sharply in one region. No label lag data yet. A retrain is proposed for the weekend. What's the professionally correct sequence first?",
            choices: [
              { id: "a", label: "Triage the pipeline before the GPU: check for app/camera updates, upload changes, and processing bugs in that region's path — a brightness cliff is as consistent with a data- ingestion bug as with real drift, and retraining on corrupted inputs would ship the bug" },
              { id: "b", label: "Retrain immediately — drift alarms are always actionable" },
              { id: "c", label: "Wait for concept drift to confirm, doing nothing until labels arrive" },
              { id: "d", label: "Roll back the model to the previous version — it handled this region fine" },
            ],
            answer: "a",
            explanation:
              "The alarm says inputs moved; it cannot say why. A same-week camera-app or upload change is the canonical false drift — cheap to check, catastrophic to train through. The triage order (bug → drift → retrain) exists precisely because retraining is the expensive action that bakes whatever it's fed into weights.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "You're hired to review a team's production ML system and find: models trained quarterly on a schedule, a shared accuracy dashboard, deployments by full rollout, and an incident last month where a silent label-pipeline change corrupted training data. Which two changes give the most risk reduction for the effort?",
            choices: [
              { id: "a", label: "(1) Promote evals to a CI gate with per-slice floors and a leakage/sanity audit — so bad candidates can't ship; (2) add shadow→canary deployment with auto-rollback — so the blast radius of any miss is 5%, not 100%" },
              { id: "b", label: "Retrain monthly instead of quarterly, keeping everything else" },
              { id: "c", label: "Adopt a larger model — capacity absorbs data problems" },
              { id: "d", label: "Add more dashboard tiles for the same metrics at finer granularity" },
            ],
            answer: "a",
            explanation:
              "The incident was a data-quality change that sailed through because nothing gated it: no CI eval would have caught the corrupted run's slice collapse, and canary would have contained the miss. The loop's value is exactly these two tripwires — everything else in the anatomy is elaboration on them. More tiles watch the same un-gated failure mode; more retraining cycles multiply exposure to it.",
          },
        ],
      },
    ],
};

export default course;
