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
import { RequestToTrace } from "./RequestToTrace";
import { InstrumentRightContext } from "./InstrumentRightContext";
import { LogsWithoutLeaking } from "./LogsWithoutLeaking";
import { LatencyCostBrokenDown } from "./LatencyCostBrokenDown";
import { AIServiceLevelObjective } from "./AIServiceLevelObjective";
import { QualityIsASignal } from "./QualityIsASignal";
import { LLMAsAJudge } from "./LLMAsAJudge";
import { ObserveRAGNotJustModel } from "./ObserveRAGNotJustModel";
import { PromptModelToolRegressions } from "./PromptModelToolRegressions";
import { AlertsPeopleTrust } from "./AlertsPeopleTrust";
import { TriageAnIncident } from "./TriageAnIncident";
import { OperatorDashboard } from "./OperatorDashboard";
import { CapstoneRescueAssistant } from "./CapstoneRescueAssistant";
import { TelemetryArchitectureContracts } from "./TelemetryArchitectureContracts";
import { GenAISemanticConventions } from "./GenAISemanticConventions";
import { SamplingCardinalityCost } from "./SamplingCardinalityCost";
import { AIThreatModelOWASP } from "./AIThreatModelOWASP";
import { DetectingAttacksInTelemetry } from "./DetectingAttacksInTelemetry";
import { GuardrailsAndSafetySignals } from "./GuardrailsAndSafetySignals";
import { PrivacyEngineeringForTelemetry } from "./PrivacyEngineeringForTelemetry";
import { GovernanceFrameworks } from "./GovernanceFrameworks";
import { EvaluationSystemsNotOneScore } from "./EvaluationSystemsNotOneScore";
import { DetectingDriftRegressions } from "./DetectingDriftRegressions";
import { CausalDiagnosisExperimentation } from "./CausalDiagnosisExperimentation";
import { AgentToolObservability } from "./AgentToolObservability";
import { ReliabilityObjectivesErrorBudgets } from "./ReliabilityObjectivesErrorBudgets";
import { IncidentCommandLearningLoop } from "./IncidentCommandLearningLoop";
import { CapstoneDesignReview } from "./CapstoneDesignReview";

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
  // LLM Observability course (intermediate)
  "request-to-trace": RequestToTrace,
  "instrument-right-context": InstrumentRightContext,
  "logs-without-leaking": LogsWithoutLeaking,
  "latency-cost-broken-down": LatencyCostBrokenDown,
  "ai-service-level-objective": AIServiceLevelObjective,
  "quality-is-a-signal": QualityIsASignal,
  "llm-as-a-judge": LLMAsAJudge,
  "observe-rag-not-just-model": ObserveRAGNotJustModel,
  "prompt-model-tool-regressions": PromptModelToolRegressions,
  "alerts-people-trust": AlertsPeopleTrust,
  "triage-an-incident": TriageAnIncident,
  "operator-dashboard": OperatorDashboard,
  "capstone-rescue-assistant": CapstoneRescueAssistant,
  // AI Observability: Reliability course (expert)
  "telemetry-architecture-contracts": TelemetryArchitectureContracts,
  "genai-semantic-conventions": GenAISemanticConventions,
  "sampling-cardinality-cost": SamplingCardinalityCost,
  "ai-threat-model-owasp": AIThreatModelOWASP,
  "detecting-attacks-in-telemetry": DetectingAttacksInTelemetry,
  "guardrails-and-safety-signals": GuardrailsAndSafetySignals,
  "privacy-engineering-for-telemetry": PrivacyEngineeringForTelemetry,
  "governance-frameworks": GovernanceFrameworks,
  "evaluation-systems-not-one-score": EvaluationSystemsNotOneScore,
  "detecting-drift-regressions": DetectingDriftRegressions,
  "causal-diagnosis-experimentation": CausalDiagnosisExperimentation,
  "agent-tool-observability": AgentToolObservability,
  "reliability-objectives-error-budgets": ReliabilityObjectivesErrorBudgets,
  "incident-command-learning-loop": IncidentCommandLearningLoop,
  "capstone-design-review": CapstoneDesignReview,
};

export function getInfographicComponent(slug: string): ComponentType | undefined {
  return INFOGRAPHIC_COMPONENTS[slug];
}
