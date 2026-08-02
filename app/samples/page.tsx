import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Landing redesign samples — comparison index.
 * Temporary: lets the team click through the directions and pick one.
 * Delete /samples once a direction is promoted to the live /.
 */
export default function SamplesIndexPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <header className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-deep">
          Landing redesign
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          The samples
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-ink-soft">
          Click through each. None of these touches the live home page — pick one
          and it becomes the new <code className="rounded bg-ash px-1 py-0.5 text-xs">/</code>.
        </p>
      </header>

      <div className="mt-10 space-y-4">
        <SampleLink
          href="/samples/landing-a"
          name="A — Premium dark hero (black + Twitter blue) ⭐"
          vibe="Dark/light theme toggle (top-right). Twitter blue on true black or cream."
          featured
        />
        <SampleLink
          href="/samples/lesson-dark"
          name="Sample lesson — dark theme"
          vibe="See how a real lesson route looks in the black + Twitter blue dark theme."
        />
        <SampleLink
          href="/samples/landing-b"
          name="B — Editorial light + product window"
          vibe="Cream, confident headline, real lesson mockup. Reads: credible, education-first."
        />
        <SampleLink
          href="/samples/landing-c"
          name="C — Outcome-led transformation"
          vibe="Learner journey, 3-step path, testimonial. Reads: results-oriented."
        />
      </div>

      <p className="mt-10 text-center text-xs text-ink-faint">
        <Link href="/" className="underline hover:text-ink-soft">
          ← back to the current live home
        </Link>
      </p>
    </div>
  );
}

function SampleLink({
  href,
  name,
  vibe,
  featured = false,
}: {
  href: string;
  name: string;
  vibe: string;
  featured?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`focus-ring group flex items-center justify-between gap-4 p-5 transition-transform hover:-translate-y-0.5 ${
        featured ? "card-interactive ring-2 ring-brand" : "card-interactive"
      }`}
    >
      <div>
        <h2 className="font-semibold text-ink">{name}</h2>
        <p className="mt-1 text-sm text-ink-soft">{vibe}</p>
      </div>
      <ArrowRight className="h-5 w-5 shrink-0 text-ink-faint transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
