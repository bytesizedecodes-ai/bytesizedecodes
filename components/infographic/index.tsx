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
};

export function getInfographicComponent(slug: string): ComponentType | undefined {
  return INFOGRAPHIC_COMPONENTS[slug];
}
