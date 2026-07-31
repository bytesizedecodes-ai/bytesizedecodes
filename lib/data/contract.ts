/**
 * Mutation surface the adapter must implement.
 *
 * Reads are exposed as React hooks in provider.tsx (they need useSyncExternalStore).
 * When Convex arrives, provider.tsx is the only file that changes — pages keep importing
 * the same hook names.
 */

import type { DayKey } from "../day";
import type { AttemptInput, AttemptResult, OnboardingInput, ReviewInput } from "./types";

export interface DataMutations {
  submitAttempt(input: AttemptInput): Promise<AttemptResult>;
  gradeReview(input: ReviewInput): Promise<AttemptResult>;
  startByte(slug: string): Promise<void>;
  completeByte(slug: string, today: DayKey): Promise<AttemptResult>;
  updateOnboarding(input: OnboardingInput): Promise<void>;
  resetProgress(): Promise<void>;
  exportProgress(): Promise<string>;
  importProgress(json: string): Promise<void>;
}
