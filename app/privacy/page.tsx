import type { Metadata } from "next";
import Link from "next/link";
import { Shell } from "@/components/Shell";
import { ContentPage, ContentSection } from "@/components/ContentPage";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${SITE_NAME} handles account data, learning progress, and your choices.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <Shell active="/privacy">
      <ContentPage
        eyebrow="Legal"
        title="Privacy Policy"
        description={`This policy describes how ${SITE_NAME} collects, uses, and protects information when you use ${SITE_URL.replace("https://", "")} and related services.`}
        showLastUpdated
      >
        <ContentSection title="1. Who we are">
          <p>
            {SITE_NAME} (“we”, “us”) provides visual AI learning, practice, review, and optional
            project features. For privacy questions contact{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-semibold text-brand-deep hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
            .
          </p>
          <p className="text-xs text-ink-faint">
            This document is written to match how the product works today. It is not legal advice.
            Have counsel review it if you need formal compliance for a specific jurisdiction.
          </p>
        </ContentSection>

        <ContentSection title="2. What you can do without an account">
          <p>
            Free courses and lessons are readable without signing in. We do not attach personal
            learning progress to a guest browser for the product account model; if you only browse
            public pages, we treat that as ordinary website use (see Cookies and infrastructure).
          </p>
        </ContentSection>

        <ContentSection title="3. Information we collect when you sign in">
          <p>
            Sign-in uses social identity providers (for example Google or GitHub) via OAuth.
            Depending on what the provider and our auth stack share with us, we may receive:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Account identifiers required for authentication</li>
            <li>Name and email associated with your social account</li>
            <li>Profile image if provided by the identity provider</li>
          </ul>
          <p>
            We do not use passwords for primary sign-in; the social identity provider handles that
            credential.
          </p>
        </ContentSection>

        <ContentSection title="4. Learning and product data">
          <p>When you use signed-in features we store, for example:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Onboarding preferences (goal, level, time mode, weekly minutes)</li>
            <li>Lesson and byte progress, attempts, Energy, levels, streaks, freezes</li>
            <li>Spaced-repetition card state and skill evidence</li>
            <li>Projects and artifacts you create in Build; public gallery items if you publish</li>
            <li>Optional product feedback you submit</li>
            <li>
              Contact / advertise / product-update inquiry forms (name, email, company, message,
              and related fields you provide)
            </li>
            <li>Lightweight product analytics events (milestones in the learning loop)</li>
          </ul>
        </ContentSection>

        <ContentSection title="5. How we use information">
          <ul className="list-disc space-y-2 pl-5">
            <li>Provide and improve the learning experience (plans, progress, review queue)</li>
            <li>Secure accounts and prevent abuse</li>
            <li>Respond to support and privacy requests</li>
            <li>Operate admin tools for trusted operators of the service</li>
          </ul>
          <p>We do not sell your personal information. We do not run third-party advertising SDKs in the product loop.</p>
        </ContentSection>

        <ContentSection title="6. Processors and infrastructure">
          <p>
            Core application data is stored and processed with{" "}
            <span className="font-medium text-ink">Convex</span> (backend and database).
            Authentication uses social OAuth providers (Google, and GitHub when enabled) via{" "}
            <span className="font-medium text-ink">Convex Auth</span>.
            The website may be hosted on modern web hosting (for example Netlify or equivalent).
            Those providers process data under their own terms and security programs.
          </p>
        </ContentSection>

        <ContentSection title="7. Cookies and sessions">
          <p>
            We use cookies or equivalent session storage required for authentication and app
            security. Theme preference may be stored in the browser. We do not run a separate
            advertising cookie suite. If that changes, we will update this policy.
          </p>
        </ContentSection>

        <ContentSection title="8. Retention">
          <p>
            We keep account and progress data while your account is active and as needed to provide
            the service. You may export or delete learning data from Profile. Deleted data may
            residual in backups for a limited operational period.
          </p>
        </ContentSection>

        <ContentSection title="9. Your choices">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <span className="font-medium text-ink">Export / import / reset / delete</span> from{" "}
              <Link href="/profile" className="font-semibold text-brand-deep hover:underline">
                Profile
              </Link>{" "}
              when signed in
            </li>
            <li>
              <span className="font-medium text-ink">Sign out</span> from the account menu
            </li>
            <li>
              Contact{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-semibold text-brand-deep hover:underline"
              >
                {CONTACT_EMAIL}
              </a>{" "}
              for privacy requests we cannot handle in-product
            </li>
          </ul>
        </ContentSection>

        <ContentSection title="10. Children">
          <p>
            {SITE_NAME} is aimed at older teens and adults learning AI. If you are under the age
            where you need a parent or guardian’s consent to use online services in your region,
            please use the service only with that consent. Contact us if you believe a child has
            provided personal data without appropriate consent so we can delete it.
          </p>
        </ContentSection>

        <ContentSection title="11. International users">
          <p>
            Servers and processors may be located outside your country. By using the service you
            understand that information may be processed in those locations under this policy and
            applicable provider terms.
          </p>
        </ContentSection>

        <ContentSection title="12. Changes">
          <p>
            We may update this policy as the product evolves. The “Last updated” date at the top
            will change when we do. Continued use after an update means you accept the revised
            policy for subsequent use.
          </p>
        </ContentSection>
      </ContentPage>
    </Shell>
  );
}
