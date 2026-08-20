/**
 * The curated jargon list for the plain-English gate (infographics-interactive_v6
 * §2.5). For beginner/intermediate courses, the FIRST use of each term in a
 * lesson must carry a same-sentence parenthetical plain-English gloss —
 * "tune the hyperparameters (the tuning dials set before training)".
 *
 * Keep this list DELIBERATE: terms go on it because a lay reader hits a dead
 * stop on them. Everyday industry words ("model", "training", "data") stay
 * off it. Never add a term to silence a test failure — fix the sentence.
 */
export type JargonTerm = {
  /** The term as the learner meets it. */
  term: string;
  /** Seed plain-English gloss (authors may phrase their own). */
  gloss: string;
  /** Word-boundary match, case-insensitive, covers simple inflections. */
  pattern: RegExp;
};

export const JARGON_TERMS: readonly JargonTerm[] = [
  {
    term: "hyperparameter",
    gloss: "tuning dials set before training starts",
    pattern: /\bhyperparameters?\b/i,
  },
  {
    term: "loss",
    gloss: "the error score training tries to shrink",
    pattern: /\bloss\b/i,
  },
  {
    term: "weights",
    gloss: "the importance sliders inside the model",
    pattern: /\bweights?\b/i,
  },
  {
    term: "gradient",
    gloss: "the downhill slope of the error",
    pattern: /\bgradients?\b/i,
  },
  {
    term: "learning rate",
    gloss: "the step size",
    pattern: /\blearning rate\b/i,
  },
  {
    term: "embedding",
    gloss: "meaning coordinates for a piece of text",
    pattern: /\bembeddings?\b/i,
  },
  {
    term: "drift",
    gloss: "the model slowly going stale on new data",
    pattern: /\bdrift(?:s|ed|ing)?\b/i,
  },
  {
    term: "latency",
    gloss: "the wait time for a response",
    pattern: /\blatency\b/i,
  },
  {
    term: "token",
    gloss: "word-sized pieces the model reads",
    pattern: /\btokens?\b/i,
  },
  {
    term: "inference",
    gloss: "the model answering a request",
    pattern: /\binference\b/i,
  },
  {
    term: "fine-tuning",
    gloss: "extra practice on your own data",
    pattern: /\bfine-?tun(?:e|es|ing|ed)\b/i,
  },
  {
    term: "overfitting",
    gloss: "memorizing instead of understanding",
    pattern: /\boverfit(?:s|ting|ted)?\b/i,
  },
  {
    term: "grounding",
    gloss: "tying answers to real source documents",
    pattern: /\bground(?:ing|ed)\b/i,
  },
  {
    term: "hallucination",
    gloss: "a confident but made-up answer",
    pattern: /\bhallucinat(?:e|es|ing|ion|ions|ed)\b/i,
  },
];
