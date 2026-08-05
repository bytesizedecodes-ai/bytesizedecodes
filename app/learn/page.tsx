import type { Metadata } from "next";
import { LearnCatalog } from "./LearnCatalog";
import { Shell } from "@/components/Shell";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Learn",
  description:
    "Browse free AI foundations and practice units. Sign in when you are ready to begin a saved path and track progress.",
  alternates: { canonical: "/learn" },
};

export default function LearnPage() {
  return (
    <Shell active="/learn">
      <div className="mx-auto max-w-5xl">
        <PageHeader
          eyebrow="Learn"
          title="A clear path through AI"
          description="Visual foundations, active checks, and technical practice — free courses to read now; sign in when you want progress saved."
        />
        <div className="mt-8">
          <LearnCatalog />
        </div>
      </div>
    </Shell>
  );
}
