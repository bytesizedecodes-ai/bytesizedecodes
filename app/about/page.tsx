import type { Metadata } from "next";
import Link from "next/link";
import { Shell } from "@/components/Shell";
import { ContentPage, ContentSection } from "@/components/ContentPage";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `Why ${SITE_NAME} exists: visual AI learning, practice that sticks, and a path that leads somewhere real.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <Shell active="/about">
      <ContentPage
        eyebrow="Company"
        title={`About ${SITE_NAME}`}
        description={SITE_TAGLINE}
      >
        <ContentSection title="Why we exist">
          <p>
            Most AI education either drowns beginners in math or skims past real understanding.
            We built {SITE_NAME} for people who want a clear mental model first — then practice,
            then something they can build.
          </p>
          <p>
            Visual lessons carry the load. Short checks lock ideas in. Spaced review and a daily
            plan keep you coming back without guilt trips or dark patterns.
          </p>
        </ContentSection>

        <ContentSection title="Who it is for">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <span className="font-medium text-ink">Curious beginners</span> — pictures before
              jargon.
            </li>
            <li>
              <span className="font-medium text-ink">Students and graduates</span> — structure that
              survives exam season and job prep.
            </li>
            <li>
              <span className="font-medium text-ink">Working professionals</span> — time-boxed plans
              when you only have a few minutes.
            </li>
            <li>
              <span className="font-medium text-ink">Aspiring founders</span> — literacy that
              connects to building products.
            </li>
          </ul>
        </ContentSection>

        <ContentSection title="How learning works">
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              <span className="font-medium text-ink">See</span> — picture-led courses and lessons.
            </li>
            <li>
              <span className="font-medium text-ink">Practise</span> — self-checks, drills, and
              spaced review when you are signed in.
            </li>
            <li>
              <span className="font-medium text-ink">Build</span> — hands-on projects that turn
              knowledge into something you can ship.
            </li>
          </ol>
        </ContentSection>

        <ContentSection title="Free to read, sign in to save">
          <p>
            Free courses stay open without an account so you can learn and search engines can index
            the content. Sign in with a social account when you want a saved path, streaks, XP, and
            progress that follows you across devices.
          </p>
        </ContentSection>

        <ContentSection title="What we do not do">
          <p>
            We do not sell your learning data. We do not show ads inside the learning loop. We do
            not trap you with irreversible streak FOMO — freezes exist so life can interrupt without
            wiping your progress.
          </p>
        </ContentSection>

        <p className="pt-2">
          Questions?{" "}
          <Link href="/contact" className="font-semibold text-brand-deep hover:underline">
            Contact us
          </Link>
          . Prefer to start learning?{" "}
          <Link href="/courses" className="font-semibold text-brand-deep hover:underline">
            Browse free courses
          </Link>
          .
        </p>
      </ContentPage>
    </Shell>
  );
}
