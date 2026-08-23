import type { ComponentType } from "react";
import { WhatIsAI } from "./WhatIsAI";
import { WhatIsML } from "./WhatIsML";
import { WhatIsDeepLearning } from "./WhatIsDeepLearning";
import { AIVsMLVsDL } from "./AIVsMLVsDL";
import { LinearRegression } from "./LinearRegression";
import { LogisticRegression } from "./LogisticRegression";
import { LossFunctions } from "./LossFunctions";
import { GradientDescent } from "./GradientDescent";
import { NeuralNetworkBasics } from "./NeuralNetworkBasics";
import { BackpropagationIntuition } from "./BackpropagationIntuition";
import { BiasVarianceTradeoff } from "./BiasVarianceTradeoff";
import { EnsembleMethods } from "./EnsembleMethods";
import { EvaluationMetrics } from "./EvaluationMetrics";
import { DataLeakageAndImbalance } from "./DataLeakageAndImbalance";
import { ClassImbalance } from "./ClassImbalance";
import { KiranaPayCapstone } from "./KiranaPayCapstone";
import { HowHumansLearn } from "./HowHumansLearn";
import { HumansVsMachines } from "./HumansVsMachines";
import { WhatIsMLLayman } from "./WhatIsMLLayman";
import { ThreeParadigms } from "./ThreeParadigms";
import { SupervisedDeepDive } from "./SupervisedDeepDive";
import { PredictingNumbers } from "./PredictingNumbers";
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
import { WhatIsAnAgentHarness } from "./WhatIsAnAgentHarness";
import { RawModelVsProduct } from "./RawModelVsProduct";
import { PromptControlSurface } from "./PromptControlSurface";
import { ContextWindow } from "./ContextWindow";
import { ToolCalling } from "./ToolCalling";
import { AgentLoop } from "./AgentLoop";
import { WhenNotToAgent } from "./WhenNotToAgent";
import { ContextEngineering } from "./ContextEngineering";
import { ToolDesign } from "./ToolDesign";
import { SystemPromptsThatHold } from "./SystemPromptsThatHold";
import { AgentMemoryState } from "./AgentMemoryState";
import { StructuredOutput } from "./StructuredOutput";
import { GuardrailsAndFailureModes } from "./GuardrailsAndFailureModes";
import { HarnessObservability } from "./HarnessObservability";
import { HarnessEvals } from "./HarnessEvals";
import { CostAndLatency } from "./CostAndLatency";
import { MultiAgentOrchestration } from "./MultiAgentOrchestration";
import { LongHorizonAutonomy } from "./LongHorizonAutonomy";
import { EvalsAsASystem } from "./EvalsAsASystem";
import { HarnessVsFinetuning } from "./HarnessVsFinetuning";
import { AgentSecurity } from "./AgentSecurity";
import { SelfImprovingHarnesses } from "./SelfImprovingHarnesses";
import { HarnessReliability } from "./HarnessReliability";
import { ProductionHarnessAnatomy } from "./ProductionHarnessAnatomy";
import { WhatIsRag } from "./WhatIsRag";
import { WhyNotPasteEverything } from "./WhyNotPasteEverything";
import { WhatAreEmbeddings } from "./WhatAreEmbeddings";
import { SimilaritySearch } from "./SimilaritySearch";
import { RagPipeline } from "./RagPipeline";
import { WhenRagGoesWrong } from "./WhenRagGoesWrong";
import { WhenNotToRag } from "./WhenNotToRag";
import { ChunkingStrategy } from "./ChunkingStrategy";
import { ChoosingEmbeddings } from "./ChoosingEmbeddings";
import { HybridSearch } from "./HybridSearch";
import { Reranking } from "./Reranking";
import { QueryUnderstanding } from "./QueryUnderstanding";
import { CitationsAndGrounding } from "./CitationsAndGrounding";
import { RagEvaluation } from "./RagEvaluation";
import { RagObservability } from "./RagObservability";
import { IngestionPipeline } from "./IngestionPipeline";
import { AdvancedRetrieval } from "./AdvancedRetrieval";
import { AgenticRag } from "./AgenticRag";
import { GraphRag } from "./GraphRag";
import { PermissionAwareRetrieval } from "./PermissionAwareRetrieval";
import { IndexLifecycle } from "./IndexLifecycle";
import { RagVsLongContext } from "./RagVsLongContext";
import { ProductionRagEvals } from "./ProductionRagEvals";
import { ProductionRagAnatomy } from "./ProductionRagAnatomy";
import { NeuronsAndLayers } from "./NeuronsAndLayers";
import { HowNetworksLearn } from "./HowNetworksLearn";
import { RegularizingDeepNets } from "./RegularizingDeepNets";
import { ConvolutionalNetworks } from "./ConvolutionalNetworks";
import { SequencesToAttention } from "./SequencesToAttention";
import { InsideTheTransformer } from "./InsideTheTransformer";
import { LLMPipeline } from "./LLMPipeline";
import { EfficientFineTuning } from "./EfficientFineTuning";
import { AlignmentRlhf } from "./AlignmentRlhf";
import { DiffusionModels } from "./DiffusionModels";
import { MultimodalModels } from "./MultimodalModels";
import { FrontierArchitectures } from "./FrontierArchitectures";
import { ProductionMlCapstone } from "./ProductionMlCapstone";
import { TuningNotBuilding } from "./TuningNotBuilding";
import { TheModelReadEverything } from "./TheModelReadEverything";
import { BehaviorNotFacts } from "./BehaviorNotFacts";
import { AskingVsTraining } from "./AskingVsTraining";
import { InsideTheWeights } from "./InsideTheWeights";
import { OneGoodExample } from "./OneGoodExample";
import { PracticeMakesPatterns } from "./PracticeMakesPatterns";
import { ParrotingProblem } from "./ParrotingProblem";
import { ForgettingTheBasics } from "./ForgettingTheBasics";
import { WhenNotToFinetune } from "./WhenNotToFinetune";
import { BaseVsInstruct } from "./BaseVsInstruct";
import { ConversationScripts } from "./ConversationScripts";
import { ClipOnLenses } from "./ClipOnLenses";
import { DidItWork } from "./DidItWork";
import { BorrowASupercomputer } from "./BorrowASupercomputer";
import { TheFineTuningJourney } from "./TheFineTuningJourney";
import { TheTransferLadder } from "./TheTransferLadder";
import { PromptRagOrFinetune } from "./PromptRagOrFinetune";
import { AnatomyOfAnExample } from "./AnatomyOfAnExample";
import { CuratingTheDataset } from "./CuratingTheDataset";
import { TrainOnAnswersOnly } from "./TrainOnAnswersOnly";
import { TheMemoryArithmetic } from "./TheMemoryArithmetic";
import { LoraFromFirstPrinciples } from "./LoraFromFirstPrinciples";
import { Qlora } from "./Qlora";
import { DialsThatMatter } from "./DialsThatMatter";
import { CatchingMemorization } from "./CatchingMemorization";
import { ASmallHonestEval } from "./ASmallHonestEval";
import { TemplateSkew } from "./TemplateSkew";
import { ShippingAnAdapter } from "./ShippingAnAdapter";
import { SahayakCapstone } from "./SahayakCapstone";
import { TheDecisionArchitecture } from "./TheDecisionArchitecture";
import { TheDataEngine } from "./TheDataEngine";
import { ObjectiveLandscape } from "./ObjectiveLandscape";
import { PreferenceData } from "./PreferenceData";
import { QloraScalingLimits } from "./QloraScalingLimits";
import { TrainingStability } from "./TrainingStability";
import { MultiStagePipelines } from "./MultiStagePipelines";
import { EvaluationAtProduction } from "./EvaluationAtProduction";
import { TheAlignmentTax } from "./TheAlignmentTax";
import { MergeDistillServe } from "./MergeDistillServe";
import { FailureForensics } from "./FailureForensics";
import { FreeGpuCapstone } from "./FreeGpuCapstone";
// AI Security: Foundations course (beginner)
import { WhyAIGetsAttacked } from "./WhyAIGetsAttacked";
import { OwaspLlmTopTen } from "./OwaspLlmTopTen";
import { PromptInjection } from "./PromptInjection";
import { Jailbreaks } from "./Jailbreaks";
import { DataLeakage } from "./DataLeakage";
import { GuardrailsBasics } from "./GuardrailsBasics";
import { SupplyChainRisk } from "./SupplyChainRisk";
import { OverpermissionedAgents } from "./OverpermissionedAgents";
import { WhenSecurityKillsTheProduct } from "./WhenSecurityKillsTheProduct";
import { SecurityCapstone } from "./SecurityCapstone";
// AI Security: In Practice course (intermediate)
import { ThreatModelAnApp } from "./ThreatModelAnApp";
import { InputOutputFiltering } from "./InputOutputFiltering";
import { SandboxesLeastPrivilege } from "./SandboxesLeastPrivilege";
import { PiiRedaction } from "./PiiRedaction";
import { SecuringRag } from "./SecuringRag";
import { SecuringAgentsMcp } from "./SecuringAgentsMcp";
import { RedTeamDrills } from "./RedTeamDrills";
import { DefensiveEvals } from "./DefensiveEvals";
import { IncidentDrills } from "./IncidentDrills";
import { PaisashieldCapstone } from "./PaisashieldCapstone";
// AI Security: At Scale course (expert)
import { AdversarialRobustness } from "./AdversarialRobustness";
import { MultiAgentTrust } from "./MultiAgentTrust";
import { AiIncidentResponse } from "./AiIncidentResponse";
import { SecureByDesignReviews } from "./SecureByDesignReviews";
import { ComplianceGovernance } from "./ComplianceGovernance";
import { ContinuousRedTeaming } from "./ContinuousRedTeaming";
import { SecurityTradeoffReview } from "./SecurityTradeoffReview";
import { SetuCapstone } from "./SetuCapstone";

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
  "linear-regression": LinearRegression,
  "logistic-regression": LogisticRegression,
  "loss-functions": LossFunctions,
  "gradient-descent": GradientDescent,
  "neural-network-basics": NeuralNetworkBasics,
  "backpropagation-intuition": BackpropagationIntuition,
  "bias-variance-tradeoff": BiasVarianceTradeoff,
  "ensemble-methods": EnsembleMethods,
  "evaluation-metrics": EvaluationMetrics,
  "data-leakage-and-imbalance": DataLeakageAndImbalance,
  "class-imbalance": ClassImbalance,
  "kirana-pay-capstone": KiranaPayCapstone,
  // Machine Learning for Layman course
  "how-humans-learn": HowHumansLearn,
  "humans-vs-machines": HumansVsMachines,
  "what-is-ml-layman": WhatIsMLLayman,
  "three-ml-paradigms": ThreeParadigms,
  "supervised-learning-deep-dive": SupervisedDeepDive,
  "predicting-numbers": PredictingNumbers,
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
  // Harness Engineering: Foundations course (beginner)
  "what-is-an-ai-harness": WhatIsAnAgentHarness,
  "raw-model-vs-product": RawModelVsProduct,
  "what-is-a-prompt-really": PromptControlSurface,
  "what-is-a-context-window": ContextWindow,
  "how-models-use-tools": ToolCalling,
  "the-agent-loop": AgentLoop,
  "when-not-to-build-an-agent": WhenNotToAgent,
  // Harness Engineering: In Practice course (intermediate)
  "context-engineering": ContextEngineering,
  "designing-tools-models-use": ToolDesign,
  "system-prompts-that-hold": SystemPromptsThatHold,
  "agent-memory-and-state": AgentMemoryState,
  "structured-output": StructuredOutput,
  "guardrails-and-failure-modes": GuardrailsAndFailureModes,
  "harness-observability": HarnessObservability,
  "intro-to-harness-evals": HarnessEvals,
  "cost-and-latency-engineering": CostAndLatency,
  // Harness Engineering: At Scale course (expert)
  "multi-agent-orchestration": MultiAgentOrchestration,
  "long-horizon-autonomy": LongHorizonAutonomy,
  "evals-as-a-system": EvalsAsASystem,
  "harness-vs-finetuning": HarnessVsFinetuning,
  "agent-security": AgentSecurity,
  "self-improving-harnesses": SelfImprovingHarnesses,
  "harness-reliability": HarnessReliability,
  "anatomy-of-production-harnesses": ProductionHarnessAnatomy,
  // RAG Engineering: Foundations course (beginner)
  "what-is-rag": WhatIsRag,
  "why-not-paste-everything": WhyNotPasteEverything,
  "what-are-embeddings": WhatAreEmbeddings,
  "how-similarity-search-works": SimilaritySearch,
  "the-rag-pipeline": RagPipeline,
  "when-rag-gets-it-wrong": WhenRagGoesWrong,
  "when-not-to-use-rag": WhenNotToRag,
  // RAG Engineering: In Practice course (intermediate)
  "chunking-strategy": ChunkingStrategy,
  "choosing-embeddings": ChoosingEmbeddings,
  "hybrid-search": HybridSearch,
  "reranking": Reranking,
  "query-understanding": QueryUnderstanding,
  "citations-and-grounding": CitationsAndGrounding,
  "rag-evaluation": RagEvaluation,
  "rag-observability": RagObservability,
  "ingestion-pipeline": IngestionPipeline,
  // RAG Engineering: At Scale course (expert)
  "advanced-retrieval": AdvancedRetrieval,
  "agentic-rag": AgenticRag,
  "graphrag": GraphRag,
  "permission-aware-retrieval": PermissionAwareRetrieval,
  "index-lifecycle": IndexLifecycle,
  "rag-vs-long-context": RagVsLongContext,
  "production-rag-evals": ProductionRagEvals,
  "anatomy-of-production-rag": ProductionRagAnatomy,
  // Advanced Machine Learning course (expert)
  "neurons-and-layers": NeuronsAndLayers,
  "how-networks-learn": HowNetworksLearn,
  "regularizing-deep-nets": RegularizingDeepNets,
  "convolutional-networks": ConvolutionalNetworks,
  "sequences-to-attention": SequencesToAttention,
  "inside-the-transformer": InsideTheTransformer,
  "llm-training-pipeline": LLMPipeline,
  "efficient-fine-tuning": EfficientFineTuning,
  "alignment-rlhf": AlignmentRlhf,
  "diffusion-models": DiffusionModels,
  "multimodal-models": MultimodalModels,
  "frontier-architectures": FrontierArchitectures,
  "production-ml-capstone": ProductionMlCapstone,
  // LLM Fine-Tuning: Foundations course (beginner)
  "tuning-not-building": TuningNotBuilding,
  "the-model-read-everything": TheModelReadEverything,
  "behavior-not-facts": BehaviorNotFacts,
  "asking-vs-training": AskingVsTraining,
  "inside-the-weights": InsideTheWeights,
  "one-good-example": OneGoodExample,
  "practice-makes-patterns": PracticeMakesPatterns,
  "parroting-problem": ParrotingProblem,
  "forgetting-the-basics": ForgettingTheBasics,
  "when-not-to-finetune": WhenNotToFinetune,
  "base-vs-instruct": BaseVsInstruct,
  "conversation-scripts": ConversationScripts,
  "clip-on-lenses": ClipOnLenses,
  "did-it-work": DidItWork,
  "borrow-a-supercomputer": BorrowASupercomputer,
  "the-fine-tuning-journey": TheFineTuningJourney,
  // LLM Fine-Tuning: In Practice course (intermediate)
  "the-transfer-ladder": TheTransferLadder,
  "prompt-rag-or-finetune": PromptRagOrFinetune,
  "anatomy-of-an-example": AnatomyOfAnExample,
  "curating-the-dataset": CuratingTheDataset,
  "train-on-answers-only": TrainOnAnswersOnly,
  "the-memory-arithmetic": TheMemoryArithmetic,
  "lora-from-first-principles": LoraFromFirstPrinciples,
  "qlora": Qlora,
  "dials-that-matter": DialsThatMatter,
  "catching-memorization": CatchingMemorization,
  "a-small-honest-eval": ASmallHonestEval,
  "template-skew": TemplateSkew,
  "shipping-an-adapter": ShippingAnAdapter,
  "sahayak-capstone": SahayakCapstone,
  // LLM Fine-Tuning: At Scale course (expert)
  "the-decision-architecture": TheDecisionArchitecture,
  "the-data-engine": TheDataEngine,
  "objective-landscape": ObjectiveLandscape,
  "preference-data": PreferenceData,
  "qlora-scaling-limits": QloraScalingLimits,
  "training-stability": TrainingStability,
  "multi-stage-pipelines": MultiStagePipelines,
  "evaluation-at-production": EvaluationAtProduction,
  "the-alignment-tax": TheAlignmentTax,
  "merge-distill-serve": MergeDistillServe,
  "failure-forensics": FailureForensics,
  "free-gpu-capstone": FreeGpuCapstone,
  // AI Security: Foundations course (beginner)
  "why-ai-gets-attacked": WhyAIGetsAttacked,
  "the-owasp-llm-top-ten": OwaspLlmTopTen,
  "prompt-injection": PromptInjection,
  "jailbreaks": Jailbreaks,
  "data-leakage": DataLeakage,
  "guardrails-basics": GuardrailsBasics,
  "supply-chain-risk": SupplyChainRisk,
  "over-permissioned-agents": OverpermissionedAgents,
  "when-security-kills-the-product": WhenSecurityKillsTheProduct,
  "security-capstone": SecurityCapstone,
  // AI Security: In Practice course (intermediate)
  "threat-model-an-app": ThreatModelAnApp,
  "input-output-filtering": InputOutputFiltering,
  "sandboxes-and-least-privilege": SandboxesLeastPrivilege,
  "pii-redaction": PiiRedaction,
  "securing-rag": SecuringRag,
  "securing-agents-and-mcp": SecuringAgentsMcp,
  "red-team-drills": RedTeamDrills,
  "defensive-evals": DefensiveEvals,
  "incident-drills": IncidentDrills,
  "paisashield-capstone": PaisashieldCapstone,
  // AI Security: At Scale course (expert)
  "adversarial-robustness": AdversarialRobustness,
  "multi-agent-trust": MultiAgentTrust,
  "ai-incident-response": AiIncidentResponse,
  "secure-by-design-reviews": SecureByDesignReviews,
  "compliance-and-governance": ComplianceGovernance,
  "continuous-red-teaming": ContinuousRedTeaming,
  "the-security-tradeoff-review": SecurityTradeoffReview,
  "setu-capstone": SetuCapstone,
};

export function getInfographicComponent(slug: string): ComponentType | undefined {
  return INFOGRAPHIC_COMPONENTS[slug];
}
