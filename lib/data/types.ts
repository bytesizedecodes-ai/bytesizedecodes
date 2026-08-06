/**
 * Domain types for the data layer. Deliberately free of any storage or backend imports —
 * nothing here knows whether the data came from localStorage or Convex.
 */

import type { DayKey } from "../day";
import type { SrsGrade, SrsState } from "../srs";
import type { Difficulty } from "../drills/types";

export type UserId = string & { readonly __brand: "UserId" };

export type Track = "grad" | "beginner" | "engineer" | "founder";
export type StartingLevel = "new" | "some" | "comfortable";
export type TimeMode = "quick" | "standard" | "deep";

export interface OnboardingInput {
  track: Track;
  startingLevel: StartingLevel;
  weeklyMinutes: number;
  preferredTimeMode: TimeMode;
}

export interface Profile {
  userId: UserId;
  displayName: string;
  /** Identity provider email when signed in. */
  email: string | null;
  /** Identity provider avatar URL when available. */
  imageUrl: string | null;
  track: Track;
  /** Effort currency (shown as Energy in UI). */
  xpTotal: number;
  level: number;
  /** Energy into the current level, and what the level spans. */
  levelProgress: { into: number; span: number };
  currentStreak: number;
  longestStreak: number;
  lastPracticeDay: DayKey | null;
  streakFreezes: number;
  createdAt: number;
  startingLevel: StartingLevel | null;
  weeklyMinutes: number | null;
  preferredTimeMode: TimeMode | null;
  onboardingCompletedAt: number | null;
  /** Authorization role. Absent/null = ordinary user. "admin" gates /admin. */
  role: "user" | "admin" | null;
}

export type PracticeMode = "byte" | "review" | "practice";

export interface AttemptInput {
  itemKey: string;
  topic: string;
  mode: PracticeMode;
  correct: boolean;
  msTaken: number;
  today: DayKey;
  /** Present for generated drills; used to seed the reward roll. */
  difficulty?: Difficulty;
}

export interface ReviewInput extends AttemptInput {
  grade: SrsGrade;
}

/** Everything the UI needs to render the reward moment in one payload. */
export interface AttemptResult {
  xpAwarded: number;
  /** True for the rare high multiplier — drives the celebratory treatment. */
  critical: boolean;
  xpTotal: number;
  level: number;
  leveledUp: boolean;
  currentStreak: number;
  streakExtended: boolean;
  freezeEarned: boolean;
  /** Human phrase for when this item comes back, e.g. "in 3 weeks". */
  nextReview: string | null;
}

export interface DayProgress {
  day: DayKey;
  itemsAnswered: number;
  itemsCorrect: number;
  xpEarned: number;
  practised: boolean;
}

export type DailyPlanStep =
  | {
      kind: "review";
      label: string;
      detail: string;
      href: string;
      minutes: number;
      count: number;
    }
  | {
      kind: "drill";
      label: string;
      detail: string;
      href: string;
      minutes: number;
      generatorId: string;
      difficulty: Difficulty;
    }
  | {
      kind: "unit";
      label: string;
      detail: string;
      href: string;
      minutes: number;
      progressKey: string;
    };

export interface DailyPlan {
  timeMode: TimeMode;
  estimatedMinutes: number;
  focus: string;
  steps: DailyPlanStep[];
}

interface ReviewCardBase {
  itemKey: string;
  topic: string;
  ease: number;
  reps: number;
  lapses: number;
}

export interface GeneratorReviewCard extends ReviewCardBase {
  kind: "generator";
  generatorId: string;
  difficulty: Difficulty;
  /** Stable per-day seed so a card looks the same if the page is reloaded. */
  seed: number;
}

export interface AuthoredReviewCard extends ReviewCardBase {
  kind: "authored";
  source: "byte" | "course";
  slug: string | null;
  courseSlug: string | null;
  lessonSlug: string | null;
  questionId: string;
}

export type ReviewCard = GeneratorReviewCard | AuthoredReviewCard;

export interface ByteProgress {
  slug: string;
  status: "unseen" | "started" | "completed";
  completedDay: DayKey | null;
  xpEarned: number;
  draftAnswers: Record<string, string> | null;
  draftChecked: string[] | null;
  draftCode: string | null;
  exercisePassed: boolean;
}

export interface TopicMastery {
  topic: string;
  /** 0..1, derived from scheduling intervals rather than lessons clicked. */
  mastery: number;
  itemCount: number;
  dueCount: number;
}

export interface DayXp {
  day: DayKey;
  xp: number;
  practised: boolean;
}

/** One row of the global leaderboard. Level is derived server-side from xpTotal. */
export interface LeaderboardRow {
  rank: number;
  displayName: string;
  xpTotal: number;
  level: number;
  currentStreak: number;
  track: Track;
}

/** Homepage stat board — cross-user counts. practicingNow is real (recent-activity proxy), not fabricated. */
export interface UserCounts {
  totalLearners: number;
  practicingNow: number;
  drillsAnswered: number;
  avgStreak: number;
}

export type AnalyticsEventName =
  | "onboarding_started"
  | "daily_plan_continued"
  | "unit_completed"
  | "review_graded"
  | "practice_answered"
  | "repair_link_clicked"
  | "code_test_passed";

export interface TrackEventInput {
  name: AnalyticsEventName;
  today: DayKey;
  refKey?: string;
  track?: Track;
  mode?: string;
}

export interface LessonDraftInput {
  slug: string;
  draftAnswers?: Record<string, string>;
  draftChecked?: string[];
  draftCode?: string;
}

/** Persisted shape. Matches the anonymous-progress blob the backend will accept. */
export interface PersistedStateV1 {
  version: 1;
  userId: string;
  displayName: string;
  track: Track;
  createdAt: number;
  xpTotal: number;
  currentStreak: number;
  longestStreak: number;
  lastPracticeDay: string | null;
  streakFreezes: number;
  startingLevel?: StartingLevel;
  weeklyMinutes?: number;
  preferredTimeMode?: TimeMode;
  onboardingCompletedAt?: number;
  srs: Record<string, SrsState>;
  bytes: Record<string, { status: "started" | "completed"; completedDay: string | null; xpEarned: number }>;
  /** Newest first, capped. */
  attempts: {
    itemKey: string;
    topic: string;
    mode: PracticeMode;
    correct: boolean;
    msTaken: number;
    day: string;
    at: number;
  }[];
  /** Newest first, capped. */
  xpEvents: { amount: number; reason: string; refKey: string | null; day: string; at: number }[];
}

export const STORAGE_KEY = "bsd:anon:v1";
