/**
 * Domain types for the data layer. Deliberately free of any storage or backend imports —
 * nothing here knows whether the data came from localStorage or Convex.
 */

import type { DayKey } from "../day";
import type { SrsGrade, SrsState } from "../srs";
import type { Difficulty } from "../drills/types";

export type UserId = string & { readonly __brand: "UserId" };

export type Track = "grad" | "beginner" | "engineer" | "founder";

export interface Profile {
  userId: UserId;
  displayName: string;
  track: Track;
  xpTotal: number;
  level: number;
  /** XP into the current level, and what the level spans. */
  levelProgress: { into: number; span: number };
  currentStreak: number;
  longestStreak: number;
  lastPracticeDay: DayKey | null;
  streakFreezes: number;
  createdAt: number;
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

export interface ReviewCard {
  itemKey: string;
  topic: string;
  /** Generator id and difficulty parsed back out of the item key. */
  generatorId: string;
  difficulty: Difficulty;
  /** Stable per-day seed so a card looks the same if the page is reloaded. */
  seed: number;
  ease: number;
  reps: number;
  lapses: number;
}

export interface ByteProgress {
  slug: string;
  status: "unseen" | "started" | "completed";
  completedDay: DayKey | null;
  xpEarned: number;
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
  userId: string;
  displayName: string;
  xpTotal: number;
  level: number;
  currentStreak: number;
  track: Track;
}

/** Homepage stat board — cross-user counts. practicingNow is a demo placeholder. */
export interface UserCounts {
  totalLearners: number;
  practicingNow: number;
  drillsAnswered: number;
  avgStreak: number;
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
