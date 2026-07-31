import { LearnCatalog } from "./LearnCatalog";
import { Shell } from "@/components/Shell";
import { RequireOnboardingClient } from "./RequireOnboardingClient";
import { PageHeader } from "@/components/ui/PageHeader";

export default function LearnPage() {
  return (
    <Shell active="/learn">
      <RequireOnboardingClient>
        <div className="mx-auto max-w-5xl">
          <PageHeader
            eyebrow="Learn"
            title="A clear path through AI"
            description="Visual foundations, active checks, and technical practice share one progress trail. Follow your recommendation or explore freely."
          />
          <div className="mt-8">
            <LearnCatalog />
          </div>
        </div>
      </RequireOnboardingClient>
    </Shell>
  );
}
