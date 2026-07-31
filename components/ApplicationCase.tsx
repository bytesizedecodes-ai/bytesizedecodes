/** Post-lesson “try this in the real world” prompt — not graded. */
export function ApplicationCase({
  title,
  prompt,
}: {
  title: string;
  prompt: string;
}) {
  return (
    <section className="rounded-2xl border border-ash bg-white p-5">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
        Application
      </p>
      <h2 className="mt-2 text-base font-semibold text-ink">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{prompt}</p>
    </section>
  );
}
