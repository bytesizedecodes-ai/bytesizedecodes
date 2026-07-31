import type { ReactNode } from "react";
import type { Block } from "@/lib/drills/types";

/** Tiny inline formatter: `code` and **bold**. No full markdown parser. */
function Inline({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const token = match[0];
    if (token.startsWith("**")) {
      parts.push(
        <strong key={key++} className="font-semibold text-ink">
          {token.slice(2, -2)}
        </strong>,
      );
    } else {
      parts.push(
        <code
          key={key++}
          className="rounded bg-ash/70 px-1.5 py-0.5 font-mono text-[0.85em] text-ink"
        >
          {token.slice(1, -1)}
        </code>,
      );
    }
    last = match.index + token.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

export function BlockList({ blocks }: { blocks: readonly Block[] }) {
  return (
    <div className="space-y-3">
      {blocks.map((b, i) => {
        if (b.kind === "text") {
          return (
            <p key={i} className="text-[15px] leading-relaxed text-ink-soft">
              <Inline text={b.text} />
            </p>
          );
        }
        if (b.kind === "note") {
          return (
            <div
              key={i}
              className="rounded-xl border border-brand/30 bg-brand-wash px-4 py-3 text-[14px] leading-relaxed text-ink"
            >
              <Inline text={b.text} />
            </div>
          );
        }
        if (b.kind === "code") {
          return (
            <pre
              key={i}
              className="overflow-x-auto rounded-xl bg-ink px-4 py-3 font-mono text-[13px] leading-relaxed text-canvas"
            >
              <code>{b.code}</code>
            </pre>
          );
        }
        return (
          <div key={i} className="overflow-x-auto rounded-xl border border-ash">
            <table className="w-full text-left text-sm">
              <thead className="bg-ash/50 text-ink">
                <tr>
                  {b.head.map((h, j) => (
                    <th key={j} className="px-3 py-2 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {b.rows.map((row, ri) => (
                  <tr key={ri} className="border-t border-ash">
                    {row.map((cell, ci) => (
                      <td key={ci} className="px-3 py-2 text-ink-soft">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
