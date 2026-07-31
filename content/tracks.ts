import type { StartingLevel, TimeMode, Track } from "@/lib/data/types";

export interface LearningTrack {
  id: Track;
  title: string;
  shortTitle: string;
  promise: string;
  startingUnitHref: string;
}

export const LEARNING_TRACKS: readonly LearningTrack[] = [
  {
    id: "beginner",
    title: "Understand AI clearly",
    shortTitle: "AI Explorer",
    promise: "Build confident AI literacy without jargon or a coding prerequisite.",
    startingUnitHref: "/courses/machine-learning-for-layman/how-humans-learn",
  },
  {
    id: "grad",
    title: "Build technical skills",
    shortTitle: "AI/ML Builder",
    promise: "Move from visual concepts to technical practice and portfolio-ready proof.",
    startingUnitHref: "/courses/machine-learning/what-is-artificial-intelligence",
  },
  {
    id: "engineer",
    title: "Apply AI at work",
    shortTitle: "AI Professional",
    promise: "Learn the evaluation and system choices that matter in real workflows.",
    startingUnitHref: "/courses/machine-learning/ai-vs-ml-vs-dl",
  },
  {
    id: "founder",
    title: "Launch an AI product",
    shortTitle: "AI Founder",
    promise: "Validate the problem and learn the technical choices behind a useful MVP.",
    startingUnitHref: "/courses/machine-learning-for-layman/humans-vs-machines",
  },
] as const;

export const STARTING_LEVELS: readonly {
  id: StartingLevel;
  title: string;
  detail: string;
}[] = [
  { id: "new", title: "New to AI", detail: "Start with clear concepts and no assumed background." },
  { id: "some", title: "I know the basics", detail: "Move faster and practise the ideas that matter." },
  {
    id: "comfortable",
    title: "I have built or studied before",
    detail: "Use deeper examples and focus on application.",
  },
] as const;

export const TIME_MODES: readonly {
  id: TimeMode;
  title: string;
  minutes: number;
  weeklyMinutes: number;
  detail: string;
}[] = [
  { id: "quick", title: "Quick", minutes: 3, weeklyMinutes: 30, detail: "A few focused minutes most days." },
  { id: "standard", title: "Standard", minutes: 10, weeklyMinutes: 75, detail: "Review plus one useful learning step." },
  { id: "deep", title: "Deep", minutes: 25, weeklyMinutes: 150, detail: "Concept, practice, and application together." },
] as const;

export function getLearningTrack(track: Track): LearningTrack {
  return LEARNING_TRACKS.find((item) => item.id === track) ?? LEARNING_TRACKS[1]!;
}
