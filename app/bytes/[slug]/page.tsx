import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell } from "@/components/Shell";
import { allSlugs, getByte } from "@/content";
import { ByteRunner } from "./ByteRunner";

export function generateStaticParams() {
  return allSlugs().map((slug) => ({ slug }));
}

export default async function BytePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const byte = getByte(slug);
  if (!byte) notFound();

  return (
    <Shell active="/bytes">
      <article className="mx-auto max-w-2xl">
        <Link href="/bytes" className="text-sm text-ink-faint hover:text-ink-soft">
          ← All bytes
        </Link>

        <header className="mt-4">
          <p className="text-[11px] font-medium uppercase tracking-wide text-brand-deep">
            Season {byte.season} · Byte {byte.order} · {byte.minutes} min
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">
            {byte.title}
          </h1>
          <p className="mt-2 text-[15px] text-ink-soft">{byte.subtitle}</p>
        </header>

        <div className="mt-8 space-y-8">
          {byte.sections.map((section, i) => (
            <section key={i} className="space-y-3">
              {section.heading && (
                <h2 className="text-lg font-semibold tracking-tight text-ink">
                  {section.heading}
                </h2>
              )}
              {section.paragraphs.map((p, j) => (
                <p
                  key={j}
                  className="text-[15px] leading-relaxed text-ink-soft"
                  dangerouslySetInnerHTML={{ __html: formatInline(p) }}
                />
              ))}
              {section.code && (
                <pre className="overflow-x-auto rounded-xl bg-ink px-4 py-3 font-mono text-[13px] leading-relaxed text-canvas">
                  <code>{section.code.source}</code>
                </pre>
              )}
            </section>
          ))}
        </div>

        <ByteRunner byte={byte} />
      </article>
    </Shell>
  );
}

/** Minimal inline formatter for **bold** and `code` authored in content strings. */
function formatInline(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*([^*]+)\*\*/g, "<strong class='font-semibold text-ink'>$1</strong>")
    .replace(
      /`([^`]+)`/g,
      "<code class='rounded bg-ash/70 px-1.5 py-0.5 font-mono text-[0.85em]'>$1</code>",
    );
}
