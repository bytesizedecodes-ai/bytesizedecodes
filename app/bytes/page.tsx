import Link from "next/link";
import { Shell } from "@/components/Shell";
import { BYTES } from "@/content";
import { ByteStatus } from "./ByteStatus";

export default function BytesPage() {
  return (
    <Shell active="/bytes">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Bytes</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Season 1 · bite-sized lessons. New ones ship twice a week.
          </p>
        </div>

        <ol className="space-y-3">
          {BYTES.map((b) => (
            <li key={b.slug}>
              <Link
                href={`/bytes/${b.slug}`}
                className="card flex items-start gap-4 p-5 transition hover:border-brand/40"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-wash text-sm font-semibold text-brand-deep">
                  {b.order}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-semibold text-ink">{b.title}</h2>
                    <ByteStatus slug={b.slug} />
                  </div>
                  <p className="mt-1 text-[13px] text-ink-soft">{b.subtitle}</p>
                  <p className="mt-2 text-[11px] uppercase tracking-wide text-ink-faint">
                    {b.minutes} min · {b.topic} · D{b.difficulty}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </Shell>
  );
}
