import type { Course } from "../types";

const course: Course = {
    slug: "fine-tuning-foundations",
    title: "LLM Fine-Tuning Foundations",
    subtitle:
      "What fine-tuning really changes in a model — taught with kitchens, flashcards, and borrowed game consoles.",
    description:
      "A picture-led course on fine-tuning for complete beginners, built for recent graduates starting from zero. You will learn what the model already knows when you meet it, and what your examples actually teach it. You will see why practice can go too far, and how free borrowed GPUs make a first fine-tune possible without owning a supercomputer. We use plain words and everyday objects. And you will pick up one decision rule you will reuse forever: behavior, not facts.",
    level: "beginner",
    domain: "AI Engineering",
    access: "free",
    lessons: [
      {
        slug: "tuning-not-building",
        title: "You teach the chef, not build them",
        blurb: "Fine-tuning adjusts a model that already exists — orientation day, not construction.",
        topic: "ft-foundations",
        skillIds: ["finetune-intuition"],
        capability: "Explain fine-tuning as adjusting an existing model rather than building one.",
        minutes: 4,
        concept: {
          anchor:
            "A new chef already knows how to cook. Your job is to show them where the salt lives in your kitchen.",
          what: "**Fine-tuning** (extra practice on your own data) never builds a model from nothing. It takes a model that already exists and adjusts it to your way of working.",
          why: "Building a model from scratch takes mountains of text, rooms of computers, and millions of dollars. Adjusting one takes a few hundred of your own examples and an afternoon.",
          where: [
            "A **support bot** that already speaks English, tuned to speak like your brand",
            "A **phone keyboard** that already predicts words, tuned to your typing habits",
            "A **coding helper** that already knows Python, tuned to your team's naming style",
          ],
          whenNot:
            "It is not fine-tuning when a model is being **built from nothing** on raw data. That earlier, giant stage is a different job with a different bill.",
        },
        diagram: {
          kind: "compare",
          left: { title: "Building a model", subtitle: "from nothing" },
          right: { title: "Fine-tuning a model", subtitle: "already trained" },
          rows: [
            { label: "Starts from", left: "No language skill at all", right: "A model that already reads and writes" },
            { label: "Needs", left: "Trillions of words, giant computers", right: "A few hundred of your own examples" },
            { label: "Bill", left: "Millions of dollars", right: "An afternoon — sometimes free" },
          ],
        },
        prose: [
          "The confusion starts with the word itself. People hear \"train a model\" and picture a factory: raw steel in, robot out. The reality is closer to hiring. The chef you hire has already cooked for years — sauces, knives, timing, all of it. What they lack is much smaller: where your ingredients live, how your regular customers like their eggs, and the unwritten rules of **your** kitchen.",
          "Fine-tuning (extra practice on your own data) is that orientation. The heavy learning — language, facts, common sense — happened before you ever met the model. That scale of learning is something no single team could repeat. You are making the last, smallest, most personal adjustment.",
          "Keep the proportions in mind, because they explain everything that follows. The giant learning is what makes the small adjustment possible. A model with no language skill could not be \"oriented\" into your tone. You can only fine-tune a chef who already cooks.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Riya's company wants its chat assistant to answer customers in the company's playful, two-line style. Her teammate says that means building a new AI from scratch, at giant cost. Given what fine-tuning actually is, which choice is better?",
            choices: [
              { id: "a", label: "Fine-tune the existing assistant on a few hundred replies in the house style — the language skill already exists, and only the style needs teaching" },
              { id: "b", label: "Build from scratch — a new style requires rebuilding the whole model" },
              { id: "c", label: "Neither — style is a fixed trait no model can take on" },
            ],
            answer: "a",
            explanation:
              "The expensive learning (language itself) is already done. Style is the small, personal adjustment — exactly the part fine-tuning is built for. Building from scratch pays the giant bill twice.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A wildlife group has an app that already recognizes common objects in photos. They want it to recognize their 40 local bird species, and they have labeled photos of each. What matches the fine-tuning move here?",
            choices: [
              { id: "a", label: "Write a rulebook describing each bird's colors and shapes for the app to follow" },
              { id: "b", label: "Practice the existing recognizer on the labeled bird photos so the skill adjusts to the local species" },
              { id: "c", label: "Buy better cameras — recognition quality is purely a hardware trait" },
            ],
            answer: "b",
            explanation:
              "Same shape as the kitchen: the general skill (seeing objects) exists; the local knowledge is the adjustment. Labeled examples are the orientation day. Rulebooks and cameras do not teach patterns.",
          },
        ],
      },
      {
        slug: "the-model-read-everything",
        title: "The model already read (almost) everything",
        blurb: "Pretraining: you are hiring a well-read stranger, not an empty page.",
        topic: "ft-foundations",
        skillIds: ["finetune-intuition"],
        capability: "Describe what a pretrained model knows — and what it can never know about you.",
        minutes: 4,
        concept: {
          anchor:
            "Like hiring someone who has read every book in the city library — brilliant, but they have never met you.",
          what: "Before you ever meet it, a model has been **pretrained** by reading a giant slice of the internet. So it arrives knowing language and public knowledge — but nothing about you.",
          why: "That shared reading is why it can draft, translate, and summarize on day one. The expensive learning is already done. Fine-tuning (extra practice on your own data) only adds your part on top.",
          where: [
            "It can **draft an email** or **summarize an article** the minute you get access",
            "It knows **public knowledge** — capitals, famous people, common code",
            "It has **never seen your price list, your policies, or your customers**",
          ],
          whenNot:
            "The reading has a **last day**. Anything published after its training data ended is simply not in its memory. It does not matter how famous it is now.",
        },
        prose: [
          "The stranger picture deserves a moment, because it sets the rules for everything you will ask of them. They have read the library, so they can explain cricket, rhyme in Spanish, and summarize a contract. Ask them your mother's maiden name and they are silent — not slow, just never introduced.",
          "The reading also has a stop date. The model's memory closes like a library that stopped buying books on a certain day. Last night's news, this morning's price change, the policy you updated an hour ago — none of it is inside the walls.",
          "So you will meet two kinds of strangers. One is the raw well-read one. The other has also been through a basic assistant course (more on that in a later lesson). Either way, your company's world was never in their library. That gap — wide reading, zero personal knowledge — is exactly the space fine-tuning (extra practice on your own data) works in.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Dev's team asks their chatbot who won a sports final that happened last night. The bot confidently names last year's champion. The bot is not broken — what is the honest explanation?",
            choices: [
              { id: "a", label: "The bot is lazy and skipped looking up the news" },
              { id: "b", label: "The bot's reading ended before last night — the match is simply not in its memory, and it filled the gap with its best old guess" },
              { id: "c", label: "Sports results are permanently off-limits to all chatbots" },
            ],
            answer: "b",
            explanation:
              "A model's knowledge has a stop date, like a library that stopped buying books. Events after that day were never read. A chatty model may still guess, and that is worth remembering.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Meera assumes that because the model 'read the internet', it must know her company's internal refund rules. Those rules live on a private staff wiki. What is the correction?",
            choices: [
              { id: "a", label: "It read public text only — private staff pages were never in its library, so it knows nothing about her company's rules" },
              { id: "b", label: "It knows them — company wikis are automatically included in every model" },
              { id: "c", label: "It knows them if the rules were ever emailed to anyone" },
            ],
            answer: "a",
            explanation:
              "Wide reading means public reading. Anything private — wikis, inboxes, your price list — was never in the training pile. That personal gap is precisely what your own examples (or documents) have to fill.",
          },
        ],
      },
      {
        slug: "behavior-not-facts",
        title: "Behavior, not facts",
        blurb: "Fine-tuning teaches how to act — it doesn't install today's prices.",
        topic: "ft-boundary",
        skillIds: ["when-to-finetune"],
        capability: "Separate what fine-tuning teaches (behavior) from what it can't (fresh facts).",
        minutes: 5,
        concept: {
          anchor:
            "Orientation week teaches the new nurse how your ward works — not this morning's medicine prices.",
          what: "Fine-tuning (extra practice on your own data) teaches **behavior — tone, format, habits — not fresh facts**. The model keeps its old knowledge and learns your way of using it.",
          why: "Facts change weekly; style changes rarely. Training a stable style once is cheaper than retraining new facts again and again.",
          where: [
            "A support assistant that **always replies in three short lines**, signed the same way",
            "A coding helper that **always follows your team's error-handling pattern**",
            "A shopping assistant that **always asks one question before recommending**",
          ],
          whenNot:
            "Facts that keep changing — prices, stock, policy windows — do not belong in fine-tuning. They would be **frozen at training day**, and that plants tomorrow's hallucination (a confident but made-up answer).",
        },
        diagram: {
          kind: "compare",
          left: { title: "Comes from fine-tuning", subtitle: "stable behavior" },
          right: { title: "Comes from documents", subtitle: "living facts" },
          rows: [
            { label: "Tone and style", left: "✓ trained in once", right: "✗ patched per message" },
            { label: "Reply format", left: "✓ always the same shape", right: "✗ re-instructed daily" },
            { label: "This week's prices", left: "✗ frozen at training day", right: "✓ updated when you edit" },
          ],
        },
        prose: [
          "Here is the rule that will serve you longer than any tool in this course: **fine-tuning is for behavior, documents are for facts**. Behavior means the stable things — how replies sound, how long they run, what shape they take, and what the model refuses. Facts mean the living things — prices, policies, stock, anything with an expiry date.",
          "Why the split? Think about what practice actually does: it sets habits. Habits are wonderful for things that never change (\"always open with the customer's name\"). Habits are terrible for things that do change (\"the price is ₹199\" — until Tuesday). A trained-in fact does not update. It just sits there, quietly going stale, waiting to be repeated with full confidence.",
          "Teams that ignore the rule ship the same bug again and again. They fine-tune (extra practice on your own data) to teach this quarter's refund window. The quarter rolls over, and the model keeps quoting the old one with total confidence. Nothing broke — the training worked perfectly on the wrong target. The failure was choosing training for a fact.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A bank tunes its assistant on this quarter's loan interest rates so it \"knows them by heart.\" Next quarter the rates change. The assistant keeps quoting the old ones — confidently. What happened?",
            choices: [
              { id: "a", label: "The training failed technically and needs more examples" },
              { id: "b", label: "Nothing failed — a trained-in fact is a habit frozen at training day. Living rates belong in a document the assistant reads, not in its habits" },
              { id: "c", label: "The model is rebelling on purpose to force a retrain" },
            ],
            answer: "b",
            explanation:
              "The training worked exactly as designed — it set a habit. Rates are facts with an expiry date, so they belong in a lookup the model reads fresh. Fine-tuning stays for stable tone and format.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "An online store wants its assistant to always answer order questions as a tidy numbered list, with no chit-chat. That need has been identical for two years. Where does it belong?",
            choices: [
              { id: "a", label: "In fine-tuning — a stable behavior like reply shape is exactly what practice installs permanently" },
              { id: "b", label: "In a document the model reads — formats change as often as prices do" },
              { id: "c", label: "Nowhere — assistants pick their own format and that can't be changed" },
            ],
            answer: "a",
            explanation:
              "The test is stability, not content. A rule about reply shape that is two years old is a habit, and habits are what fine-tuning installs. Documents are for facts that would go stale inside the model.",
          },
        ],
      },
      {
        slug: "asking-vs-training",
        title: "Asking every time vs training once",
        blurb: "Prompting repeats the instruction; fine-tuning turns it into a habit.",
        topic: "ft-decision",
        skillIds: ["finetune-vs-prompting"],
        capability: "Choose between repeating instructions in prompts and training them in permanently.",
        minutes: 5,
        concept: {
          anchor:
            "A note taped on the fridge every morning ('towels go HERE') versus a housemate who actually knows your home.",
          what: "**Prompting** writes your instruction into every single request. **Fine-tuning** (extra practice on your own data) trains the rule in once, so it is always on without asking.",
          why: "Repeated instructions eat space in every conversation, and the model can forget them mid-chat. A trained habit needs no reminder, ever.",
          where: [
            "A **system instruction** setting tone for every chat — the prompt way",
            "A keyboard that **stopped needing correction hints** after learning your habits — the trained way",
            "A legal assistant **trained to answer in standard clause format**, no reminders attached",
          ],
          whenNot:
            "Instructions that change by the day, or matter for one task only, should simply be **prompted**. Training is for habits you want forever, not notes for today.",
        },
        diagram: {
          kind: "compare",
          left: { title: "Prompting", subtitle: "ask every time" },
          right: { title: "Fine-tuning", subtitle: "train once" },
          rows: [
            { label: "Setup", left: "None — write the note", right: "Gather examples, practice once" },
            { label: "Each later request", left: "Repeats the instruction", right: "Just the question" },
            { label: "Rule changes", left: "Edit the note — instant", right: "Practice again — hours" },
            { label: "Best for", left: "Shifting or one-off rules", right: "Stable, permanent habits" },
          ],
        },
        prose: [
          "The fridge note gets the job done. That is why prompting is everyone's first tool and should stay the first tool. Write the rule, tape it up, and the guest follows it. Tomorrow morning you tape it again. And again. Every conversation carries the note, and every conversation spends a little attention reading it.",
          "Fine-tuning (extra practice on your own data) moves the rule inside the housemate. The trained habit does not need to survive anything. It is simply how the model responds now — same tone on every request, with no instructions attached.",
          "The trade is setup cost against daily cost. Prompting costs nothing today and a little every day. Training costs an afternoon once and nothing after. The deciding question is stability. A rule you will still want in six months (\"always answer in this format\") earns training. A rule for this week's campaign belongs on the fridge, where you can change it in seconds.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A travel company's assistant needs a different promotional greeting each week — this week 'Monsoon Sale!', next week something new. The team considers fine-tuning for it. What is the right call?",
            choices: [
              { id: "a", label: "Fine-tune — anything written in a prompt is wasted effort" },
              { id: "b", label: "Prompt it — a rule that changes weekly is a fridge note; swapping the text instantly beats retraining every week" },
              { id: "c", label: "Neither — assistants can't change their greeting at all" },
            ],
            answer: "b",
            explanation:
              "Training buys permanence you do not want here. Next week you would pay the setup cost again. Changing rules are exactly what prompting handles best — edit the note, done.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A hospital's internal assistant must ALWAYS refuse medication-dosage questions and route them to a nurse. That rule has been fixed for years, and today it appears in every single prompt, eating space daily. What does the trade-off suggest?",
            choices: [
              { id: "a", label: "Keep prompting forever — permanent safety rules can never be trained" },
              { id: "b", label: "Train it in — a rule that is stable for years and carried in every request is exactly the repeating cost fine-tuning removes" },
              { id: "c", label: "Remove the rule to save space — refusal is optional anyway" },
            ],
            answer: "b",
            explanation:
              "The rule is stable and universal — a habit by every test. Training installs it once and stops paying the every-request cost. (The safety rule still lives in a document too, for auditing.)",
          },
        ],
      },
      {
        slug: "inside-the-weights",
        title: "Inside the model: a wall of sliders",
        blurb: "Knowledge lives in weights; fine-tuning nudges them, never adds parts.",
        topic: "ft-inside",
        skillIds: ["finetune-intuition"],
        capability: "Picture model knowledge as adjustable sliders that fine-tuning nudges.",
        minutes: 4,
        concept: {
          anchor:
            "A recording studio desk with thousands of tiny sliders — you nudge them gently; you never rebuild the desk.",
          what: "Everything a model knows sits in its **weights (the importance sliders inside the model)**. Fine-tuning (extra practice on your own data) nudges the existing sliders slightly. It adds no new parts.",
          why: "Because the sliders already hold language skill, small nudges are enough to shift tone and habits. No new machinery is required.",
          where: [
            "Tone shifting from a **nudge to the sliders** that pick words",
            "Format habits — greetings, signatures, reply length — **settling into the settings**",
            "The same slider wall, retuned, powering **another company's assistant**",
          ],
          whenNot:
            "Nudges cannot create **knowledge the model never had**. No slider setting can encode your private price list, because no slider ever touched it.",
        },
        prose: [
          "Strip away the mystery: a model is a vast table of settings. Think of thousands of recording-studio faders. During the giant pretraining, reading the internet set each fader's position. Together, those positions ARE the model's skill. There is no separate vault of facts to inspect — the knowledge and the settings are the same thing.",
          "Fine-tuning (extra practice on your own data) is a light touch on that desk. Your examples play, each fader shifts slightly toward your style, and after a few passes the whole board leans your way. The desk is the same desk; the mix is yours.",
          "Two comfort facts fall out of this picture. First, small changes are cheap — nudging a desk is nothing like building one, which is why an afternoon is enough. Second, nothing is bolted on: no new drawers, no extra machine attached to the side. Anyone claiming fine-tuning 'adds a module of knowledge' has the wrong picture. It is the same desk, retuned.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "After a tuning session, Arjun's teammate asks where the new company knowledge was stored — 'which folder did it add?' Based on the slider picture, what is the honest answer?",
            choices: [
              { id: "a", label: "Nowhere new — the existing sliders simply shifted position; the model is the same machine with a retuned mix" },
              { id: "b", label: "A new knowledge folder was created inside the model's memory drive" },
              { id: "c", label: "The examples themselves are stored inside the model for later lookup" },
            ],
            answer: "a",
            explanation:
              "Weights are settings, not storage drawers. Fine-tuning adjusts positions; it does not add compartments. The practice examples are not kept inside for later lookup.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A team wants their assistant to know the company's 5,000 product names and specs — data the base model has never seen. They reason: 'we'll just nudge the sliders with a few examples.' What does the slider picture say?",
            choices: [
              { id: "a", label: "Go ahead — nudges can hold any amount of new knowledge if examples are clean" },
              { id: "b", label: "Nudges adjust existing skill, not absent knowledge — 5,000 never-seen facts belong in a document the model reads, not in slider positions" },
              { id: "c", label: "Sliders can hold it, but only if the team buys more sliders" },
            ],
            answer: "b",
            explanation:
              "A nudge moves what is already there. Pushing in whole bodies of unseen knowledge is a different, heavier job. The cheap, reliable route for names and specs is a lookup document.",
          },
        ],
      },
      {
        slug: "one-good-example",
        title: "One good example",
        blurb: "A training example is a flashcard: the request on the front, the ideal reply on the back.",
        topic: "ft-data",
        skillIds: ["finetune-data-intuition"],
        capability: "Write a training example as a request paired with the reply you want.",
        minutes: 4,
        concept: {
          anchor:
            "A flashcard for grown-ups: the front is the request as it really arrives, the back is the reply you wish existed.",
          what: "One training example is a **pair**: a real request, and the ideal reply. Write it exactly the way you want the model to answer forever.",
          why: "The model copies the **pattern** in your pairs: how replies open, how long they run, what they refuse, how they sign off.",
          where: [
            "A customer's **angry message** paired with your calm house-style answer",
            "A messy order text paired with a **tidy structured receipt**",
            "A vague question paired with the **one clarifying question** your best staffer asks",
          ],
          whenNot:
            "An example with a sloppy or off-brand reply teaches exactly that. **The model learns your mistakes as faithfully as your standards**. So every pair must be one you would proudly send.",
        },
        prose: [
          "Zoom in on the smallest unit of all fine-tuning (extra practice on your own data): one pair. Front: the request, written the way requests actually arrive — full of typos, vague, occasionally rude. Back: the reply at the standard you want every time. It is not an explanation of the standard. It is the standard itself, acted out.",
          "This is why building a dataset feels different from writing a manual. A manual says \"be concise\". A pair simply IS concise. The model absorbs the length, the opening line, the sign-off, and the refusal style — all of it shown, none of it described. You are showing, not telling, thousands of times over.",
          "The discipline follows naturally: every pair is a vote for what \"normal\" looks like. Two pairs that answer similar requests in different voices teach inconsistency. A back that skips steps teaches skipping steps. Before blaming the tool for a bad tune, check the flashcards — the model is a mirror, and it reflects everything.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Sam is building a support-bot dataset. He includes a pair whose reply was written by a rushed intern — it answers correctly but has no greeting and a blunt sign-off, unlike every other card. What will the model most likely learn from this pack?",
            choices: [
              { id: "a", label: "Only the correct facts — style inconsistencies in one card are automatically ignored" },
              { id: "b", label: "A mixed lesson: mostly house style, but occasional blunt replies — every card is a vote for what 'normal' looks like" },
              { id: "c", label: "Nothing at all — the model trains only on the majority pattern" },
            ],
            answer: "b",
            explanation:
              "The model mirrors the pack, mistakes included. One off-card will not dominate, but it opens the door to bluntness. Fix the card, and do not hope the model filters it.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A clinic wants its assistant to always ask the patient's age before giving first-aid guidance. What is the cleanest way to express that in training examples?",
            choices: [
              { id: "a", label: "Add a rule card that says 'always ask age first' with no request or reply" },
              { id: "b", label: "Write pairs where each first-aid request is answered with the age question — the behavior demonstrated, not described" },
              { id: "c", label: "Include one pair where age is asked, and nine where it isn't, to keep replies varied" },
            ],
            answer: "b",
            explanation:
              "Examples teach by showing. A pack where every relevant reply asks for age first installs the habit. Rule cards and mixed packs teach inconsistency or nothing.",
          },
        ],
      },
      {
        slug: "practice-makes-patterns",
        title: "Practice makes patterns",
        blurb: "A small dataset, replayed — why a few hundred examples move a giant model.",
        topic: "ft-data",
        skillIds: ["finetune-data-intuition"],
        capability: "Explain how replaying a small example pack installs stable habits.",
        minutes: 5,
        concept: {
          anchor:
            "Nobody learns a dance from one viewing — you replay the song until the moves settle into your body.",
          what: "A **dataset** (your practice pack of example pairs) is replayed for the model again and again. Each full replay, or **pass**, deepens the pattern until it is second nature.",
          why: "One sighting is a coincidence; a hundred consistent sightings become a habit. Your hands learned the keyboard the same way, without ever memorizing a map of it.",
          where: [
            "**300 support replies** replayed until the house tone sticks",
            "**Order messages with tidy receipts** replayed until the format is automatic",
            "**Shortened drafts** replayed until the model trims sentences by default",
          ],
          whenNot:
            "More replays are not always better. Past a point, the model starts **memorizing the pack instead of learning the pattern** — and that is the next lesson's whole story.",
        },
        diagram: {
          kind: "flow",
          steps: [
            { kind: "input", text: "Your pack of example pairs" },
            { kind: "process", text: "One full pass over every card" },
            { kind: "process", text: "Adjust the sliders a little toward the pattern" },
            { kind: "decision", text: "Habit formed?" },
            { kind: "output", text: "Stop — the pattern is second nature" },
          ],
          loop: "not yet → replay the pack again",
        },
        prose: [
          "The surprise for most newcomers is the scale: a few hundred pairs can move a model that took trillions of words to build. The dance explains it. Nobody learns a routine in one viewing, and nobody needs ten thousand views either. A handful of honest replays of a consistent song is how bodies learn. The model's sliders shift a little on every pass, and consistency does the rest.",
          "Consistency is the key word. If every card dances the same style, each replay strengthens the same shift, and progress builds up. If half the cards waltz and half break-dance, the replays pull the sliders in circles, and the model learns mostly confusion. A small pack with one style beats a large mixed one, every time.",
          "The replay count is a dial you control, and it has a sweet spot. Too few passes and the habit has not set — the model slides back toward its old style. Too many passes and something harder to notice happens: the model stops learning the dance and starts memorizing your practice room. Where that line sits — and how to notice it early — is exactly where we go next.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Two teams each tune with 200 pairs. Team A's cards all reply in the same cheerful three-line style. Team B mixed replies from five different eras of their brand voice. Same count, same replay setting. Who gets the cleaner house style, and why?",
            choices: [
              { id: "a", label: "Team B — five styles give the model five chances to learn" },
              { id: "b", label: "Team A — every replay of a consistent pack shifts the sliders the same way, so the habit compounds instead of canceling" },
              { id: "c", label: "Identical results — replay count alone decides the outcome" },
            ],
            answer: "b",
            explanation:
              "Replays amplify whatever consistency the pack has. Team A's shifts add up; Team B's pull against each other. Same numbers, opposite outcomes — the pack's consistency is the hidden variable.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "After a tune, Jay's assistant still answers in its old formal voice — the habit clearly has not set. Assuming the cards themselves are good, what is the most likely dial to check first?",
            choices: [
              { id: "a", label: "The pack was replayed too few times for the shift to stick — a few more passes, watching for the style to settle" },
              { id: "b", label: "The model is at maximum style capacity and can change no further" },
              { id: "c", label: "The cards should be deleted and replaced with a rulebook" },
            ],
            answer: "a",
            explanation:
              "A habit that has not set usually means too few replays — the sliders barely moved. More passes are the first, cheapest dial. Guard them with the over-replay check described in the next lesson.",
          },
        ],
      },
      {
        slug: "parroting-problem",
        title: "The parroting problem",
        blurb: "Overfitting: perfect on the flashcards, failing the real exam.",
        topic: "ft-risks",
        skillIds: ["finetune-risks"],
        capability: "Spot overfitting — memorizing the practice pack instead of the pattern.",
        minutes: 5,
        concept: {
          anchor:
            "A parrot that recites yesterday's crossword answers perfectly — then goes silent on today's puzzle.",
          what: "**Overfitting** (memorizing instead of understanding) is what happens when fine-tuning (extra practice on your own data) goes too far. The model becomes perfect on the exact cards it studied and shaky on fresh ones.",
          why: "It is the trap that makes a tune look brilliant in testing yet fail on day one. That happens when you test on the studied cards — which is exactly what an eager team tends to do.",
          where: [
            "A support bot that **answers its 300 practiced questions perfectly**, then rambles on new phrasings",
            "A student who **memorized last year's paper** and falls apart on this year's",
            "A recipe assistant that can only cook the **exact dishes it rehearsed**",
          ],
          whenNot:
            "Catch it early: if practiced answers are **perfect but fresh ones wobble**, practice has gone too far. Stop replaying, and widen the pack with more varied phrasings.",
        },
        prose: [
          "Replay the pack enough times and the model finds a shortcut: instead of the dance, it memorizes your practice room. Why learn 'answer in three cheerful lines' when it can simply recall card #47 word for word? Memorization is cheaper than understanding. Given enough replays, models — like students — take the cheaper path.",
          "The problem hides well: on the practiced cards, the parrot looks PERFECT. Every reply exact, every tone right. The failure only shows on questions the model has never met — a customer who phrases the refund request differently, asks two things at once, or misspells the product name. Same intent, new words — and suddenly the confident three-line style is gone.",
          "The defense is the same at every scale: hold fresh questions back. Before training, put a handful of real requests in a drawer. After training, ask the drawer first. If practiced answers shine and drawer answers wobble, you have met the parrot. Dial the replays back, or enrich the pack so memorizing is harder than learning. Never grade a tune on its own flashcards.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A team demos their tuned bot to the board using ten questions straight from the training pack. It looks flawless, and they celebrate. A week later, real customers with new phrasings get wobbly answers. What was the demo actually proving?",
            choices: [
              { id: "a", label: "Memory, not skill — the pack's own questions can't distinguish understanding from memorization; only fresh questions could" },
              { id: "b", label: "The skill was real but customers are using the product wrongly" },
              { id: "c", label: "The bot worked fine and the issue was fixed on its own within a week" },
            ],
            answer: "a",
            explanation:
              "Grading on studied cards rewards recall — the exact signature of overfitting (memorizing instead of understanding). The honest exam uses questions the model never practiced.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Nina has 200 training cards, and after many passes the model replays them almost word for word. She wants the tune to survive customers' varied phrasings. What is the best fix?",
            choices: [
              { id: "a", label: "Replay even more — deeper memory will start generalizing on its own" },
              { id: "b", label: "Fewer replays plus a more varied pack — many phrasings of the same intent make memorizing harder and pattern-learning easier" },
              { id: "c", label: "Keep the pack but test only on the same cards each time" },
            ],
            answer: "b",
            explanation:
              "Variety is the cure: when the same intent arrives in many wordings, word-for-word recall stops paying off, and the pattern is the only thing left to learn. Then check the tune on held-back fresh questions.",
          },
        ],
      },
      {
        slug: "forgetting-the-basics",
        title: "Forgetting the basics",
        blurb: "Practice too narrow, and general skills slip away — mix everyday back in.",
        topic: "ft-risks",
        skillIds: ["finetune-risks"],
        capability: "Prevent catastrophic forgetting by mixing general examples into the pack.",
        minutes: 5,
        concept: {
          anchor:
            "Cram only French for a month, and your Spanish quietly slips away.",
          what: "Practice too hard on one narrow thing, and the model's **general skills fade**. Trainers call it catastrophic forgetting. The cure is mixing everyday conversation back into the pack.",
          why: "A model that only ever sees order receipts starts forgetting how to chat, joke, or explain. You never meant to trade those skills away.",
          where: [
            "An order bot that **forgot how to make small talk**",
            "A poetry-tuned writer that **can no longer write a plain email**",
            "A math-drilled assistant that began **answering greetings with equations**",
          ],
          whenNot:
            "Narrow practice is not doomed. Blend a portion of **everyday conversation** into the practice pack, and the general skills stay alive while the new habit forms.",
        },
        prose: [
          "Here is the fine-tuning (extra practice on your own data) trade nobody tells you about: every pass that pushes the sliders toward your specialty pulls them a little away from everything else. Sliders are shared — the ones that choose short, cheerful support replies also choose words in casual chat. Push hard on one behavior, and its neighbors give way.",
          "The symptoms look like comedy until they appear in your own incident report. The order-taking bot that answers 'hey, how's your day?' with 'ORDER CONFIRMED: 2 PARACETAMOL.' The style-tuned poet who can't write a plain sentence anymore. Nothing crashed — the model faithfully became what the pack showed it, and lost what the pack stopped showing.",
          "The cure is a mixed diet. Keep your specialty cards, but let a slice of the pack be ordinary, varied conversation. It is the model's version of a musician still playing scales while learning a new piece. The habit forms; the skills stay. And the mixed pack costs nothing but the discipline to include it.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A café chain trains its assistant only on order-and-receipt pairs. Customers start complaining that the bot now responds to 'love your new vibe!' with a blank receipt template. What happened, in one sentence?",
            choices: [
              { id: "a", label: "The model broke and needs reinstalling from backup" },
              { id: "b", label: "Narrow practice let general chat skills fade — the sliders leaned so far toward orders that ordinary conversation fell outside them" },
              { id: "c", label: "The bot is trolling customers on purpose to boost engagement" },
            ],
            answer: "b",
            explanation:
              "Catastrophic forgetting is a gradual slide, not a crash. Order-only practice traded chat skill away. A mixed pack — orders plus everyday conversation — keeps both alive.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Before her next training run, Priya keeps her 400 specialty cards and adds 100 cards of general, varied conversation from the base model's own comfort zone. What is she buying with that 20% extra?",
            choices: [
              { id: "a", label: "Insurance against skill fade — the general cards keep the shared sliders anchored while the specialty habit sets" },
              { id: "b", label: "Nothing but slower training — off-topic cards dilute the specialty signal" },
              { id: "c", label: "A way to skip fresh-question checks after training" },
            ],
            answer: "a",
            explanation:
              "The mixed diet is the standard defense: specialty cards form the habit while general cards hold the surrounding skills in place. Fear of dilution is overstated — a fifth of the pack prevents a lot of forgetting.",
          },
        ],
      },
      {
        slug: "when-not-to-finetune",
        title: "When NOT to fine-tune",
        blurb: "Facts that change live in documents; only stable behavior earns training.",
        topic: "ft-decision",
        skillIds: ["when-to-finetune"],
        capability: "Route a problem to prompting, documents, or fine-tuning — in that order.",
        minutes: 5,
        concept: {
          anchor:
            "You don't rebuild the car because the radio station changed — you turn the dial.",
          what: "Ask **what needs to change**. Facts that keep changing belong in documents the model can look up — that is grounding (tying answers to real source documents). Stable behavior belongs in fine-tuning (extra practice on your own data). Today's one-off task belongs in the prompt itself.",
          why: "It sends each problem to the cheapest fix that lasts. Look-ups update in seconds. Training installs habits for good. Prompts cost nothing to change.",
          where: [
            "**Menu prices** that change daily → a look-up list, not training",
            "Reply **tone and format** that never change → training",
            "A **one-off instruction** for today's task → just write it in the prompt",
          ],
          whenNot:
            "Do not reach for training when **a list would do**. Facts baked into habits are frozen at training day; facts in documents update the moment you edit them.",
        },
        diagram: {
          kind: "decision",
          root: {
            kind: "decision",
            question: "What needs to change?",
            branches: [
              {
                label: "facts that change often (prices, policies)",
                node: {
                  kind: "leaf",
                  answer: "Documents + look-up",
                  caption: "edit in seconds, always current",
                },
              },
              {
                label: "stable style, format, rules",
                node: {
                  kind: "leaf",
                  answer: "Fine-tune",
                  caption: "train the habit in once",
                },
              },
              {
                label: "instructions for one task today",
                node: {
                  kind: "leaf",
                  answer: "Prompt it",
                  caption: "free, instant, disposable",
                },
              },
            ],
          },
        },
        prose: [
          "The most expensive habit in the field is reaching for fine-tuning (extra practice on your own data) first. It is a learned reflex — training feels like the 'serious' answer. But the ladder runs the other way, and each rung is cheaper than the one above. Try the prompt, then the document, and train only when the lower rungs truly cannot hold the behavior you need.",
          "Run the three questions. Does the thing change faster than you could retrain? It is a fact — put it in a document the model reads, and let grounding (tying answers to real source documents) keep it current. Is the thing stable — tone, shape, refusals you will want in a year? That is behavior, and behavior is what training installs. Is it just for today? Write it in the prompt and move on.",
          "Watch what this ladder does to the classic 'fine-tune so it knows our refund policy' request. The policy is a fact (documents). The crisp three-line format is behavior (training). The holiday-hours banner is a note (prompt). One request, three tools — and only one of them involves a GPU.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A pizzeria's assistant must show topping prices that the owner revises weekly, plus a permanent playful tone. The team proposes a full retrain every week for the prices. What is the correct split, per the ladder?",
            choices: [
              { id: "a", label: "Prices in an editable document the assistant reads; playful tone trained in once — facts to look-up, behavior to training" },
              { id: "b", label: "Retrain weekly — it's the only way prices stay accurate" },
              { id: "c", label: "Prompt the tone fresh every conversation and hardcode the prices in the model" },
            ],
            answer: "a",
            explanation:
              "Weekly-changing facts are look-ups — editing a document is better than a weekly GPU run. The stable tone is exactly what one training pass installs. Mixing the two tools is the whole skill.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "An events team needs their assistant, just for Saturday's conference, to open every reply with 'Welcome to DevFest!' They ask for a fine-tune Friday night. What does the ladder say?",
            choices: [
              { id: "a", label: "Train it — even one-day needs deserve the permanent solution" },
              { id: "b", label: "Prompt it — a one-off instruction is a fridge note; tape it up Saturday and take it down Sunday, no training required" },
              { id: "c", label: "Build a document of welcome messages and attach a search step" },
            ],
            answer: "b",
            explanation:
              "The ladder's bottom rung exists exactly for this: disposable instructions cost nothing to add and nothing to remove. Training would pay a permanent price for a one-day need.",
          },
        ],
      },
      {
        slug: "base-vs-instruct",
        title: "Raw graduate vs assistant school",
        blurb: "Base models continue text; instruct models answer you — start from the right one.",
        topic: "ft-models",
        skillIds: ["finetune-intuition"],
        capability: "Distinguish base models from instruct/chat models and pick the right starting point.",
        minutes: 4,
        concept: {
          anchor:
            "A brilliant graduate who has read everything — versus the same person after assistant school.",
          what: "A **base model** only predicts a plausible next piece of text. An **instruct (chat) model** is that same model after assistant practice — following directions, asking before guessing, and refusing politely.",
          why: "Knowing which one you have changes everything: base models continue text, chat models answer you. And fine-tuning (extra practice on your own data) almost always starts from the chat one.",
          where: [
            "**Chat assistants** — instruct models doing the talking",
            "**Autocomplete-style writing tools** — base models continuing your text",
            "**Your own fine-tune** — built on top of a chat model, not a raw base",
          ],
          whenNot:
            "A base model is the wrong start for an assistant. Without assistant practice it **continues instead of answering**, rambles past the question, and never refuses.",
        },
        diagram: {
          kind: "compare",
          left: { title: "Base model", subtitle: "the raw graduate" },
          right: { title: "Instruct / chat model", subtitle: "after assistant school" },
          rows: [
            { label: "Given a question", left: "Continues with plausible text — maybe more questions", right: "Answers it, or asks what's missing" },
            { label: "Given a rude request", left: "Mirrors the rudeness back", right: "Stays polite, holds the policy line" },
            { label: "Fine-tuning's starting point", left: "Rarely — you'd teach manners from scratch", right: "Yes — your examples refine an existing assistant" },
          ],
        },
        prose: [
          "Meet the raw graduate. Hand them 'The capital of France is' and they will continue flawlessly — '…Paris, a city on the Seine…'. Then they keep going for pages, because continuing is ALL they know how to do. Ask them a question and they might answer it, ignore it, or write three more questions in your voice. Nothing is wrong; you are just holding a completion machine, not an assistant.",
          "Assistant school is itself fine-tuning (extra practice on your own data) — just done by the model's makers, on mountains of question-and-helpful-answer pairs, plus practice at refusing gracefully. The graduate who passes THAT course becomes the instruct or chat model you actually talk to daily. It treats your message as a request to answer, not a prompt to continue.",
          "For your own tuning, the choice of starting point matters more than any dial. Start from the chat model, and your examples refine an assistant that already knows the job — your pack only needs to teach your flavor. Start from the raw base and your pack must first teach manners, format, and refusals. That is a far bigger syllabus than any team wants to write.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A developer downloads a cheap 'base' model and asks it 'What's my order status?' — it replies with 'What's my refund status? What's your account number?' in the same style. The developer calls it broken. Is it?",
            choices: [
              { id: "a", label: "No — a base model continues text, so a question looks like the start of a list of questions; answering requests is the chat model's job" },
              { id: "b", label: "Yes — all models are required to answer questions helpfully" },
              { id: "c", label: "No, but only because the question was too short — longer questions always work" },
            ],
            answer: "a",
            explanation:
              "Nothing failed: continuation is the base model's entire skill. Request-answering behavior comes from the assistant practice layered on top — that is the instruct model you meant to download.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Maya is building a support assistant and can start her tune from either the maker's chat model or its raw base twin. Why does starting from the chat model save her the most work?",
            choices: [
              { id: "a", label: "The chat model already knows the assistant job — answering, formats, polite refusals — so her examples only need to teach her brand's flavor" },
              { id: "b", label: "The base model trains faster because it knows less" },
              { id: "c", label: "Chat models are cheaper to download than base models" },
            ],
            answer: "a",
            explanation:
              "Assistant school is a prerequisite course — manners, structure, refusals. Starting from the base means writing that course yourself. Starting from the chat model means your small pack does the only remaining job: your style.",
          },
        ],
      },
      {
        slug: "conversation-scripts",
        title: "Conversations are scripts",
        blurb: "Chat models read role-labeled scripts — practice and product must use the same one.",
        topic: "ft-data",
        skillIds: ["finetune-data-intuition"],
        capability: "Explain chat templates as role-labeled scripts that must match between practice and serving.",
        minutes: 4,
        concept: {
          anchor:
            "A radio play script: the speaker's name is printed before every single line, and everyone reads from the same page.",
          what: "Chat models read conversations as a **script with role labels** — system, user, assistant. And fine-tuning (extra practice on your own data) must use exactly the script format the live product will use.",
          why: "The model learns where instructions live and where its replies go. Swap the script between practice and the product, and the model is suddenly reading a play it never rehearsed.",
          where: [
            "**Role labels** telling the model who speaks each line",
            "**Special markers** printing exactly where each reply begins and ends",
            "Each line becoming **tokens (word-sized pieces the model reads)** in the same order every time",
          ],
          whenNot:
            "Never switch script formats between practice and serving. A model trained on one script and **read to from another** answers as if it was interrupted mid-thought.",
        },
        prose: [
          "Under the friendly chat window sits something stricter: a script. Before the model reads anything, the conversation is printed in a fixed format. The system instructions go up top, then each turn gets its speaker's label, and special markers fence off the assistant's lines. The model never sees floating text; it sees a play, and it has learned the grammar of that play by heart.",
          "This matters twice for tuning. Once while practicing: your example pairs must be printed onto the same script — your request as a labeled user line, your ideal reply as a fenced assistant line. And once while serving: whatever product chats with the model must print its conversations with the same labels and markers. Same play, same formatting, both times.",
          "When the two differ — trained on one template, served on another — nothing crashes and everything degrades. Think of an actor who rehearsed one script and hears a slightly different one on opening night. Each line is familiar, but the pacing is off, replies run into questions, and the model starts mid-thought. Debugging guides call it the invisible bug; now you know to check the script first.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A team's tuned bot was flawless in testing, but in the live app its replies start mid-sentence and occasionally continue the customer's message as if it were its own. The training data was fine. What is the first thing to check?",
            choices: [
              { id: "a", label: "The script — whether the live app prints conversations with the same role labels and reply markers the training examples used" },
              { id: "b", label: "The temperature setting — mid-sentence replies are always a randomness problem" },
              { id: "c", label: "The customers' spelling — odd inputs confuse tuned models permanently" },
            ],
            answer: "a",
            explanation:
              "A model rehearsed on one script and served on another reads a slightly different play: turns run together and replies start mid-thought. A template mismatch between training and serving is the classic invisible bug.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "While assembling training pairs, Leo finds a tool that exports them as plain flowing text with no role labels or reply markers. He decides that is 'close enough.' What habit of the model does this put at risk?",
            choices: [
              { id: "a", label: "None — the model ignores formatting and reads only the words" },
              { id: "b", label: "Knowing where its replies begin and end — without the labeled script, the model can't cleanly separate the request to answer from the answer to give" },
              { id: "c", label: "Only its vocabulary — unlabeled text shrinks word knowledge" },
            ],
            answer: "b",
            explanation:
              "The script's markers are how the model finds its own lines. Strip them in training and the model loses the very structure you are asking it to practice — the play needs its speaker labels.",
          },
        ],
      },
      {
        slug: "clip-on-lenses",
        title: "Clip-on lenses (LoRA, plainly)",
        blurb: "A tiny add-on layer changes the model's look without re-grinding the glass.",
        topic: "ft-methods",
        skillIds: ["lora-intuition"],
        capability: "Explain LoRA-style adapters as small clip-on changes to a frozen model.",
        minutes: 5,
        concept: {
          anchor:
            "Clip-on sunglasses over your regular glasses — a tiny add-on changes the look; nobody re-grinds the lenses.",
          what: "**LoRA** works like that clip-on: instead of nudging every slider inside the model, training adjusts a **small clip-on layer**. That layer is tiny to store, quick to train, and removable whenever you like.",
          why: "Nudging all the sliders needs giant machines; a clip-on needs a fraction of the memory. That is small enough for a modest chip and a free afternoon — which is what makes hobby-scale fine-tuning (extra practice on your own data) possible at all.",
          where: [
            "**One base model, many clip-ons** — a different tone per product, swapped in seconds",
            "A **small adapter file** instead of a full retrained giant",
            "**Trying a style, discarding it**, trying another — cheap experiments",
          ],
          whenNot:
            "A clip-on changes **style and behavior, not deep knowledge**. Teaching a model an entire new field still needs the heavy machinery, not a bigger clip-on.",
        },
        diagram: {
          kind: "compare",
          left: { title: "Full nudge", subtitle: "adjust every slider" },
          right: { title: "Clip-on (LoRA)", subtitle: "small add-on layer" },
          rows: [
            { label: "What changes", left: "Every slider in the model", right: "A small add-on; the base stays untouched" },
            { label: "Machine needed", left: "Giant, expensive", right: "Modest — a free-tier chip can do it" },
            { label: "Undo or swap", left: "Restore from a full backup", right: "Pop the clip-on off; clip another on" },
          ],
        },
        prose: [
          "Picture the slider wall from earlier — thousands of faders. Full tuning walks the whole wall, moving every fader slightly; that is why it needs rooms of computers. But remember what your fine-tune is actually after: a shift in style and habits. For shifts that small, there's a shortcut — leave the wall alone and train a thin layer that sits in front of it, like clip-on lenses over unchanged glass.",
          "The clip-on is tiny — often around one percent or less of the model's size — and that small size is pure opportunity. It trains fast on modest hardware. It stores as a small file you can share like a photo. And it pops off cleanly, leaving the base model exactly as it was. One base, a drawer of clip-ons: the formal support tone, the playful social tone, the short SMS tone — swapped per product, per season, per experiment.",
          "The boundary matters as much as the trick. Clip-ons change how the model looks and acts, not what it deeply knows — the same behavior-not-facts rule wearing new glasses. Teams that try to pour a whole new field of knowledge into a clip-on discover it holds about as much knowledge as sunglasses hold prescription power. For behavior, though — tone, format, refusal style — the clip-on is the modern default. It is the reason a first fine-tune is an afternoon, not a research budget.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A startup keeps one base model and maintains clip-ons for three products: formal banking tone, playful food-delivery tone, and a short-form outage-status mode. What is the biggest everyday advantage they enjoy?",
            choices: [
              { id: "a", label: "Cheap, swappable behavior — each product pops its clip-on onto the same base, with no giant retrains and no backups to restore" },
              { id: "b", label: "Three times the knowledge — each clip-on adds a full new field of facts" },
              { id: "c", label: "Offline operation — clip-ons remove the need for any server" },
            ],
            answer: "a",
            explanation:
              "The clip-on approach is about behavior per product: tiny, fast, reversible. Knowledge lives in the shared base — clip-ons tint it, they do not grow it.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "A research lead wants to teach a small model an entire unseen language for a minority-community tool. The plan is to use a LoRA clip-on, 'because it's cheap.' Based on the clip-on boundary, what is the honest advice?",
            choices: [
              { id: "a", label: "Go ahead — cheapness makes it right for any amount of new knowledge" },
              { id: "b", label: "A clip-on shifts style and behavior, not deep knowledge — a whole new language is base-model work (heavy training or a different base). So the cheap route is the wrong tool" },
              { id: "c", label: "Use two clip-ons stacked — that doubles the knowledge capacity" },
            ],
            answer: "b",
            explanation:
              "The behavior-not-facts rule applies to adapters at full strength: new bodies of knowledge do not fit a clip-on, and stacking more clip-ons does not change that. Match the tool to the depth of the change.",
          },
        ],
      },
      {
        slug: "did-it-work",
        title: "Did it work?",
        blurb: "Grade the tune on fresh questions — never on the flashcards it studied.",
        topic: "ft-eval",
        skillIds: ["finetune-eval-intuition"],
        capability: "Evaluate a fine-tune on held-back fresh questions with a before/after comparison.",
        minutes: 4,
        concept: {
          anchor:
            "You never quiz the student on the exact flashcards — you ask fresh questions and watch what happens.",
          what: "Judge fine-tuning (extra practice on your own data) on **new, held-back questions it never practiced on**. Score them before and after the tune — a fresh-question check.",
          why: "Practiced questions only prove memory — overfitting's (memorizing instead of understanding) favorite disguise. Fresh questions prove the pattern transferred.",
          where: [
            "**Twenty real customer questions** locked in a drawer before training, asked after",
            "A **before/after side-by-side** on the same fresh questions",
            "A **re-run of the drawer** after every new training attempt",
          ],
          whenNot:
            "Scores on practiced questions are **report cards from memory**. They feel wonderful and prove nothing about tomorrow's customers.",
        },
        prose: [
          "Here is the quiet routine that separates tuners who ship from tuners who demo. Before any training, take real requests — the awkward, misspelled, two-questions-in-one kind — and lock them in a drawer. Ten or twenty is plenty. The model will never practice on them. They exist to be asked cold, after the tune.",
          "Then run the comparison that matters: same drawer, asked to the model before training and after. Did the tone land on fresh questions, not just familiar ones? Do the new answers keep the general skill the old ones had — the small talk, the graceful confusion when a question makes no sense? A before/after test on the same questions is the only comparison where your eyes cannot fool you.",
          "The drawer is also your forever tool, not a one-time ritual. Every new training attempt — more replays, a richer pack, a new clip-on — faces the same drawer. The answers either got better or they did not. One page of fresh questions, honestly scored, beats any celebration based on feelings.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "After a training run, Tara's teammate wants to demo success using the same twenty support questions that were IN the training pack. Tara locks those away and prepares different ones from real customer mail. Why is Tara's version the honest check?",
            choices: [
              { id: "a", label: "Practiced questions can be answered from memory — only fresh ones show whether the style transferred to wording the model never met" },
              { id: "b", label: "Customer mail is always shorter, which makes any model look better" },
              { id: "c", label: "It isn't — testing on the training questions is the industry standard" },
            ],
            answer: "a",
            explanation:
              "Training-pack questions grade memory; fresh questions grade learning. The swap is exactly what catches a parroting tune before customers do.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Between two training attempts, Ozzy reruns the same drawer of fifteen held-back questions and compares answers side by side. Attempt B's answers are sharper, but one reply forgot how to handle a greeting-only message. What did the drawer just catch?",
            choices: [
              { id: "a", label: "Nothing — one odd reply out of fifteen is statistical noise to ignore forever" },
              { id: "b", label: "A skill-fade symptom — the sharper specialty may be crowding out general behavior, worth mixing everyday cards in before shipping" },
              { id: "c", label: "Proof the drawer is too small and both attempts are unknowable" },
            ],
            answer: "b",
            explanation:
              "The drawer's job is to surface exactly these trade-offs: sharper style AND a faded general skill can exist together. Seeing both — before customers do — is the check working as designed.",
          },
        ],
      },
      {
        slug: "borrow-a-supercomputer",
        title: "Borrow a supercomputer for free",
        blurb: "Colab and Kaggle lend real GPUs in a browser tab — with house rules.",
        topic: "ft-gpus",
        skillIds: ["free-gpu-landscape"],
        capability: "Use free Colab/Kaggle GPUs for a first fine-tune, respecting session limits.",
        minutes: 5,
        concept: {
          anchor:
            "Borrowing a friend's gaming console for the afternoon: powerful, free — and your save game vanishes when you hand it back.",
          what: "**Google Colab and Kaggle** lend free GPU chips (the heavy-duty number-crunchers that make training fast) in an ordinary browser tab. That is enough power to fine-tune (extra practice on your own data) a small open model with a clip-on.",
          why: "It turns a rent-a-supercomputer problem into a browser tab: no installation, no credit card, no hardware of your own. The last barrier to a first real fine-tune is gone.",
          where: [
            "**Colab notebooks** lending a free GPU for a working session at a time",
            "**Kaggle notebooks** lending free GPU hours every week",
            "**Small open models + clip-on training** fitting comfortably inside that free time",
          ],
          whenNot:
            "Free sessions **disconnect and erase their files**. Anything worth keeping must be saved out (to Google Drive or elsewhere) before the tab closes — or it is gone.",
        },
        diagram: {
          kind: "flow",
          steps: [
            { kind: "input", text: "Open a notebook; switch on the free GPU" },
            { kind: "process", text: "Train your clip-on (often under an hour)" },
            { kind: "process", text: "Save the clip-on + results to Drive" },
            { kind: "output", text: "Close the tab — nothing of yours stays behind" },
          ],
          loop: "next session: reload from Drive and continue",
        },
        prose: [
          "The machines that train models used to be the gatekeeper: rooms of cards costing more than a car. For small models and clip-on training, that gate is now open. Google Colab and Kaggle both lend real GPU time for free, inside a notebook you run from any browser. The chip you are lent is a real workhorse: plenty for tuning a small open model with the clip-on approach from the last lesson.",
          "The catch is the house rules, not the power. Sessions are borrowed, not owned. They run for hours, not days. They can disconnect when busy. And when a session ends, everything written in it is erased — the console analogy is exact, save game included. So the rhythm of free GPU work is simple. Train in the session. Save your clip-on file and your results to Google Drive while the session lives. And treat every notebook as disposable.",
          "Experienced hands structure everything around that rhythm — small model, small pack, checkpoints saved early and often. And it is worth saying plainly: this free tier is not a compromise. A first real fine-tune, end to end, truly fits inside it. That is exactly what the expert capstone of this track will have you do — for free, from scratch.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "Elena trains a clip-on in a free Colab session, celebrates the results, and closes the tab without saving. The next day she opens a new session to get the adapter. What does she find?",
            choices: [
              { id: "a", label: "The adapter waiting in a folder, as Colab keeps finished work automatically" },
              { id: "b", label: "Nothing — free sessions erase their files when they end; the trained clip-on lived only inside that closed session" },
              { id: "c", label: "A recovery fee invoice — closed sessions are retrievable for a charge" },
            ],
            answer: "b",
            explanation:
              "The console rule: borrowed machine, vanishing save game. Anything worth keeping must be copied to Drive (or downloaded) before the session ends — this is the one free-tier rule with no second chances.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Ravi wants his first fine-tune to fit comfortably in a free GPU session. Which combination is built for that budget, per this course's lessons?",
            choices: [
              { id: "a", label: "A small open chat model plus clip-on training on a few hundred example pairs — the exact recipe free tiers were made for" },
              { id: "b", label: "The largest available base model, fully retuned on every slider" },
              { id: "c", label: "A small model trained on the entire internet for a second pass" },
            ],
            answer: "a",
            explanation:
              "Free GPUs pair naturally with small models and clip-ons: modest memory, short sessions, real results. Full retraining of big models is exactly the workload the free tier doesn't cover.",
          },
        ],
      },
      {
        slug: "the-fine-tuning-journey",
        title: "The whole journey on one trail",
        blurb: "Decide, gather, practice, watch, check, share — the course in one hike.",
        topic: "ft-journey",
        skillIds: ["finetune-intuition", "finetune-eval-intuition"],
        capability: "Recount the full fine-tuning journey and the failure each stop prevents.",
        minutes: 5,
        concept: {
          anchor:
            "One hiking trail with six rest stops: decide, gather, practice, watch, check, share.",
          what: "The whole journey on one path: **decide** (behavior, not facts) → **gather** example pairs → **practice** on a borrowed GPU → **watch** for parroting and forgetting → **check** on fresh questions → **share** the tuned model.",
          why: "Each stop guards against the classic failure of the stop before it. Most disappointing tunes skipped a stop, and the skipped one is nearly always the checking.",
          where: [
            "A **one-page plan** naming the behavior you want and the facts that stay in documents",
            "A **practice pack** of a few hundred spot-on pairs in the exact script you'll serve",
            "A **drawer of fresh questions** you rerun after every attempt",
          ],
          whenNot:
            "The trail does not loop forever. If two honest checks do not move the answers, the fix is usually **better examples or a different target**, not a third training run.",
        },
        diagram: {
          kind: "flow",
          steps: [
            { kind: "decision", text: "DECIDE: behavior to train, facts to documents" },
            { kind: "process", text: "GATHER: example pairs in the serving script" },
            { kind: "process", text: "PRACTICE: replays on a borrowed GPU" },
            { kind: "process", text: "WATCH: parroting? forgetting?" },
            { kind: "decision", text: "CHECK: fresh-question drawer" },
            { kind: "output", text: "SHARE: the clip-on + the drawer, versioned" },
          ],
          loop: "check failed → fix the pack, practice again",
        },
        prose: [
          "Stand at the top of the trail and look back. The decide stop saved you from training facts that would freeze at training day. The gather stop made your examples vote for one consistent style, in the exact script your product speaks. Practice gave the pattern its replays — on hardware you borrowed for free. Watch caught the parrot and the fading general skills while both were still cheap to fix. Check faced the drawer of fresh questions, and share put a small clip-on file in a colleague's hands.",
          "Notice the shape of the failures you have learned to prevent: each one is the previous stop skipped. Training a fact is a deciding failure. A wobbly tone is a gathering failure. Parroting is a watching failure. And the tune that 'passed' only because it was graded on its own flashcards is a checking failure — the most common of all.",
          "You now hold the complete beginner's map: what fine-tuning (extra practice on your own data) is and is not. You know what it can and cannot hold, how it is practiced, how it fails, how it is judged, and where the free machines live. The intermediate course takes you down into the workshop: real datasets, real training runs, and your first end-to-end tune.",
        ],
        questions: [
          {
            id: "q1",
            kind: "mcq",
            prompt:
              "A product team's tuned assistant shipped with a beautiful demo on practiced questions. Then it answered real customers in the old off-brand voice, and the review after the failure found fresh questions had never been tested. Which stop was skipped?",
            choices: [
              { id: "a", label: "The CHECK stop — no drawer of fresh questions was ever asked, so the gap between memory and learning stayed invisible until customers found it" },
              { id: "b", label: "The PRACTICE stop — they clearly didn't train at all" },
              { id: "c", label: "The SHARE stop — the failure was in how the model was distributed" },
            ],
            answer: "a",
            explanation:
              "Practiced-question success with fresh-question failure is the exact signature of a skipped check — memory graded as skill. The drawer exists exactly to catch this before shipping.",
          },
          {
            id: "q2",
            kind: "mcq",
            prompt:
              "Planning her first project, Ana writes a five-line plan. Train the tone (stable for years). Keep prices in a live document. Reuse the maker's chat model. Save checkpoints to Drive during the free GPU session. Grade on a locked drawer of fresh questions. What does she have?",
            choices: [
              { id: "a", label: "The full trail in one plan — each decision matching a stop, each stop preventing its classic failure" },
              { id: "b", label: "A risky plan — prices should always be trained in for accuracy" },
              { id: "c", label: "An over-engineered plan — fresh-question checks are only for large teams" },
            ],
            answer: "a",
            explanation:
              "Every line maps to a stop: behavior/facts split (decide), chat model start (gather), checkpoints (practice/watch), the drawer (check). That is the whole course in one shippable plan.",
          },
        ],
      },
    ],
};

export default course;
