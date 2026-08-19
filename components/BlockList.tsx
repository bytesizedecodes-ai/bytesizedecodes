import { HighlightedCode } from "@/components/Code";
import { Inline } from "@/components/Inline";
import type { Block } from "@/lib/drills/types";

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
              <code>
                <HighlightedCode code={b.code} />
              </code>
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
