import { tokenizePython } from "@/lib/highlight";

/**
 * Renders source with lightweight Python syntax highlighting. Theme-agnostic:
 * code panels are always dark (`bg-ink`) in both page themes, and the token
 * colors are defined against that surface in globals.css (`tok-*`).
 */
export function HighlightedCode({ code }: { code: string }) {
  const tokens = tokenizePython(code);
  return (
    <>
      {tokens.map((token, i) =>
        token.kind === "plain" ? (
          token.text
        ) : (
          <span key={i} className={`tok-${token.kind}`}>
            {token.text}
          </span>
        ),
      )}
    </>
  );
}
