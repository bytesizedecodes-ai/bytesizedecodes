import type { ComponentType } from "react";
import { WhatIsAI } from "./WhatIsAI";
import { WhatIsML } from "./WhatIsML";
import { WhatIsDeepLearning } from "./WhatIsDeepLearning";
import { AIVsMLVsDL } from "./AIVsMLVsDL";
import { HowHumansLearn } from "./HowHumansLearn";
import { HumansVsMachines } from "./HumansVsMachines";
import { WhatIsMLLayman } from "./WhatIsMLLayman";
import { ThreeParadigms } from "./ThreeParadigms";
import { SupervisedDeepDive } from "./SupervisedDeepDive";
import { UnsupervisedDeepDive } from "./UnsupervisedDeepDive";
import { ReinforcementDeepDive } from "./ReinforcementDeepDive";
import { FeaturesAndVectors } from "./FeaturesAndVectors";
import { FirstClassifier } from "./FirstClassifier";
import { MultipleFeatures } from "./MultipleFeatures";
import { KnnNeighbors } from "./KnnNeighbors";
import { CentroidClassifier } from "./CentroidClassifier";
import { DecisionTreeRules } from "./DecisionTreeRules";
import { BestSplit } from "./BestSplit";
import { MLInYourPhone } from "./MLInYourPhone";
import { WhenMLFails } from "./WhenMLFails";
import { TrainTestSplit } from "./TrainTestSplit";
import { Overfitting } from "./Overfitting";
import { DataQuality } from "./DataQuality";
import { WhatIsObservability } from "./WhatIsObservability";
import { WhyAIDifferent } from "./WhyAIDifferent";
import { WhenAIGoesWrong } from "./WhenAIGoesWrong";
import { LogsWhatAISaid } from "./LogsWhatAISaid";
import { MetricsDashboard } from "./MetricsDashboard";
import { TraceWaterfall } from "./TraceWaterfall";
import { IsTheAnswerGood } from "./IsTheAnswerGood";
import { HallucinationMakesThingsUp } from "./HallucinationMakesThingsUp";
import { DriftSlowlyGoingBad } from "./DriftSlowlyGoingBad";
import { AlertThresholdTuner } from "./AlertThresholdTuner";
import { DashboardsControlRoom } from "./DashboardsControlRoom";
import { CostAndSpeed } from "./CostAndSpeed";
import { ObservabilityToolkit } from "./ObservabilityToolkit";
import { DayInTheLife } from "./DayInTheLife";

/**
 * Maps an infographic slug to its React component.
 *
 * Each entry must match the `slug` used in `content/courses.ts`. Adding a lesson
 * means: (1) create the component under `components/infographic/`, (2) add it
 * here, (3) add the registry entry in `content/courses.ts`.
 */
export const INFOGRAPHIC_COMPONENTS: Record<string, ComponentType> = {
  // Machine Learning course
  "what-is-artificial-intelligence": WhatIsAI,
  "what-is-machine-learning": WhatIsML,
  "what-is-deep-learning": WhatIsDeepLearning,
  "ai-vs-ml-vs-dl": AIVsMLVsDL,
  // Machine Learning for Layman course
  "how-humans-learn": HowHumansLearn,
  "humans-vs-machines": HumansVsMachines,
  "what-is-ml-layman": WhatIsMLLayman,
  "three-ml-paradigms": ThreeParadigms,
  "supervised-learning-deep-dive": SupervisedDeepDive,
  "unsupervised-learning-deep-dive": UnsupervisedDeepDive,
  "reinforcement-learning-deep-dive": ReinforcementDeepDive,
  "features-and-vectors": FeaturesAndVectors,
  "first-classifier": FirstClassifier,
  "multiple-features": MultipleFeatures,
  "knn-neighbors": KnnNeighbors,
  "centroid-classifier": CentroidClassifier,
  "decision-tree-rules": DecisionTreeRules,
  "best-split": BestSplit,
  "ml-in-your-phone": MLInYourPhone,
  "when-ml-fails": WhenMLFails,
  "train-test-split": TrainTestSplit,
  "overfitting": Overfitting,
  "data-quality": DataQuality,
  // AI Observability course
  "what-is-observability": WhatIsObservability,
  "why-ai-is-different": WhyAIDifferent,
  "when-ai-goes-wrong": WhenAIGoesWrong,
  "logs-what-ai-said": LogsWhatAISaid,
  "metrics-counting-matters": MetricsDashboard,
  "traces-the-journey": TraceWaterfall,
  "is-the-answer-good": IsTheAnswerGood,
  "hallucination-makes-things-up": HallucinationMakesThingsUp,
  "drift-slowly-going-bad": DriftSlowlyGoingBad,
  "alerts-knowing-when-to-act": AlertThresholdTuner,
  "dashboards-control-room": DashboardsControlRoom,
  "cost-and-speed": CostAndSpeed,
  "observability-toolkit": ObservabilityToolkit,
  "day-in-the-life": DayInTheLife,
};

export function getInfographicComponent(slug: string): ComponentType | undefined {
  return INFOGRAPHIC_COMPONENTS[slug];
}
