/**
 * Course registry — the single source of truth for what's in each course.
 *
 * A `Lesson` points at an infographic component (registered in
 * `components/infographic/index.tsx`) AND carries the "byte" payload that turns
 * a static visual into a Hook-loop unit: prose, an optional runnable code
 * exercise, and self-check questions that gate completion and award Energy.
 *
 * This mirrors the `Byte` shape in `content/types.ts` but is a parallel system —
 * `/bytes` and `/courses` coexist without sharing content. The data layer keys
 * course-lesson progress under `course:${courseSlug}:${lessonSlug}` so it never
 * collides with `/bytes` mastery.
 *
 * Add a lesson by: (1) creating the infographic component under
 * `components/infographic/`, (2) registering it in `components/infographic/index.tsx`,
 * (3) appending an entry to the right course's `lessons` array in its module
 * under `content/courses/`.
 */

import machineLearning from "./machine-learning";
import machineLearningForLayman from "./machine-learning-for-layman";
import aiObservability from "./ai-observability";
import llmObservability from "./llm-observability";
import aiObservabilityReliability from "./ai-observability-reliability";
import harnessEngineeringFoundations from "./harness-engineering-foundations";
import harnessEngineeringInPractice from "./harness-engineering-in-practice";
import harnessEngineeringAtScale from "./harness-engineering-at-scale";
import ragEngineeringFoundations from "./rag-engineering-foundations";
import ragEngineeringInPractice from "./rag-engineering-in-practice";
import ragEngineeringAtScale from "./rag-engineering-at-scale";
import advancedMachineLearning from "./advanced-machine-learning";
import fineTuningFoundations from "./fine-tuning-foundations";
import fineTuningInPractice from "./fine-tuning-in-practice";
import fineTuningAtScale from "./fine-tuning-at-scale";
import aiSecurityFoundations from "./ai-security-foundations";
import aiSecurityInPractice from "./ai-security-in-practice";
import aiSecurityAtScale from "./ai-security-at-scale";
import aiAgentsInPractice from "./ai-agents-in-practice";
import type { Course, CourseAccess, CourseDomain, CourseLevel, Lesson } from "../types";

export type {
  ConceptBrief,
  DiagramNodeKind,
  DiagramTree,
  LessonDiagram,
  Lesson,
  CourseLevel,
  CourseDomain,
  CourseAccess,
  Course,
} from "../types";

/** Ordered list of levels, for filter UIs. */
export const COURSE_LEVELS: readonly CourseLevel[] = ["beginner", "intermediate", "expert"];

/** Ordered list of domains, for filter UIs. */
export const COURSE_DOMAINS: readonly CourseDomain[] = [
  "Machine Learning",
  "Cybersecurity",
  "Artificial Intelligence",
  "AI Observability",
  "AI Engineering",
];

/** Ordered list of access tiers, for filter UIs. */
export const COURSE_ACCESS: readonly CourseAccess[] = ["free", "paid"];

export const COURSES: readonly Course[] = [
  machineLearning,
  machineLearningForLayman,
  aiObservability,
  llmObservability,
  aiObservabilityReliability,
  harnessEngineeringFoundations,
  harnessEngineeringInPractice,
  harnessEngineeringAtScale,
  ragEngineeringFoundations,
  ragEngineeringInPractice,
  ragEngineeringAtScale,
  advancedMachineLearning,
  fineTuningFoundations,
  fineTuningInPractice,
  fineTuningAtScale,
  aiSecurityFoundations,
  aiSecurityInPractice,
  aiSecurityAtScale,
  aiAgentsInPractice,
];

export function allCourseSlugs(): string[] {
  return COURSES.map((c) => c.slug);
}

export function getCourse(courseSlug: string): Course | undefined {
  return COURSES.find((c) => c.slug === courseSlug);
}

export function getLesson(
  courseSlug: string,
  lessonSlug: string,
): { course: Course; lesson: Lesson; index: number } | undefined {
  const course = getCourse(courseSlug);
  if (!course) return undefined;
  const index = course.lessons.findIndex((l) => l.slug === lessonSlug);
  if (index === -1) return undefined;
  return { course, lesson: course.lessons[index]!, index };
}

/**
 * The byte-progress key for a course lesson. Distinct from the `byte:${slug}`
 * namespace used by `/bytes`, so the two systems never share progress rows.
 */
export function courseLessonKey(courseSlug: string, lessonSlug: string): string {
  return `course:${courseSlug}:${lessonSlug}`;
}

/**
 * What to recommend after a learner finishes a course, at the moment
 * motivation peaks. `why` is one learner-facing line for the CTA.
 */
export const NEXT_COURSE: Record<string, { slug: string; why: string } | undefined> = {
  "machine-learning-for-layman": {
    slug: "ai-observability",
    why: "You can read a model now — learn to keep watch when it runs in the real world.",
  },
  "machine-learning": {
    slug: "advanced-machine-learning",
    why: "You know the map and the mechanics — now go inside the models: transformers, fine-tuning, diffusion, and the production loop.",
  },
  "advanced-machine-learning": {
    slug: "ai-observability-reliability",
    why: "You can build and tune models — now learn to keep them honest, measured, and safe in production.",
  },
  "ai-observability": {
    slug: "llm-observability",
    why: "Level up from watching AI to instrumenting and rescuing a live LLM feature.",
  },
  "llm-observability": {
    slug: "ai-observability-reliability",
    why: "Design the scalable, secure, governed observability system behind everything you just practised.",
  },
  "harness-engineering-foundations": {
    slug: "harness-engineering-in-practice",
    why: "You know the parts — now build the machine: context, tools, guardrails, and evals on one real assistant.",
  },
  "harness-engineering-in-practice": {
    slug: "harness-engineering-at-scale",
    why: "The machine works — now operate it: orchestration, security, reliability, and the design review at 40k requests a day.",
  },
  "rag-engineering-foundations": {
    slug: "rag-engineering-in-practice",
    why: "You know the pipeline — now engineer it: chunking, hybrid search, reranking, grounding, and evals on one real assistant.",
  },  "rag-engineering-in-practice": {
    slug: "rag-engineering-at-scale",
    why: "The machine works — now operate it: permissions, lifecycle, drift, agentic retrieval, and the architecture review at 40k documents.",
  },
  "rag-engineering-at-scale": {
    slug: "fine-tuning-foundations",
    why: "Your retrieval is solid — now shape the model itself: behavior, tone, and formats, plainly first.",
  },
  "fine-tuning-foundations": {
    slug: "fine-tuning-in-practice",
    why: "You know what fine-tuning changes — now run a real one: data, templates, QLoRA, evals, and the ship.",
  },
  "fine-tuning-in-practice": {
    slug: "fine-tuning-at-scale",
    why: "The tune works — now operate at scale: pipelines, preference tuning, eval systems, and the free-GPU capstone.",
  },
  "fine-tuning-at-scale": {
    slug: "harness-engineering-foundations",
    why: "You've shaped the model — now build the machine around it: tools, guardrails, and evals.",
  },
  "ai-security-foundations": {
    slug: "ai-security-in-practice",
    why: "You know the doors — now build the locks: threat models, filters, gates, and drills on one real product.",
  },
  "ai-security-in-practice": {
    slug: "ai-security-at-scale",
    why: "The defenses hold at product scale — now run security as an organisation: robustness, federated trust, incident command.",
  },
  "ai-security-at-scale": {
    slug: "ai-observability-reliability",
    why: "You secure the systems — now instrument them: telemetry architecture, SLOs, and the governance spine behind security.",
  },
  "harness-engineering-at-scale": {
    slug: "ai-security-foundations",
    why: "You operate agents at scale — now meet the adversaries: the attack surface your harness opens, plainly first.",
  },
  "ai-observability-reliability": {
    slug: "ai-security-at-scale",
    why: "You detect and govern through telemetry — now take the offensive view: adversarial robustness, trust architectures, and red-teaming at scale.",
  },
};
