/**
 * A tiny, dependency-free Python tokenizer for syntax highlighting.
 *
 * Pure TypeScript — no DOM, no Date, no randomness — so it imports cleanly
 * into both client components and Convex. The output maps to `tok-*` CSS
 * classes defined in app/globals.css against the always-dark code surface
 * (`bg-ink`), so it reads correctly in both page themes.
 */

export type TokenKind =
  | "plain"
  | "keyword"
  | "builtin"
  | "string"
  | "number"
  | "comment"
  | "defname"
  | "operator";

export interface Token {
  text: string;
  kind: TokenKind;
}

const KEYWORDS = new Set([
  "and", "as", "assert", "break", "class", "continue", "def", "del", "elif",
  "else", "except", "False", "finally", "for", "from", "global", "if",
  "import", "in", "is", "lambda", "None", "not", "or", "pass", "raise",
  "return", "True", "try", "while", "with", "yield",
]);

const BUILTINS = new Set([
  "abs", "all", "any", "dict", "enumerate", "float", "int", "len", "list",
  "max", "min", "print", "range", "repr", "round", "set", "sorted", "str",
  "sum", "tuple", "zip",
]);

const IDENT = /[A-Za-z_][A-Za-z0-9_]*/y;
const NUMBER = /(?:\d+\.?\d*|\.\d+)/y;
const OPERATOR = /[+\-*/%=<>!&|^~:,.[\](){}]+/y;
const WS = /\s+/y;

/**
 * Tokenizes a snippet of Python (or Python-flavoured pseudo-code). Best-effort
 * by design: unknown constructs degrade to plain tokens, never throw.
 */
export function tokenizePython(source: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  let afterDef = false;
  const n = source.length;

  while (i < n) {
    const rest = source.slice(i);

    // Comments run to end of line.
    if (rest.startsWith("#")) {
      const end = source.indexOf("\n", i);
      const stop = end === -1 ? n : end;
      tokens.push({ text: source.slice(i, stop), kind: "comment" });
      i = stop;
      continue;
    }

    // Strings: triple-quoted first, then single-quoted, with optional prefixes.
    const strMatch = /^(?:[fFrRbBuU]{0,2})(?:"""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')/.exec(rest);
    if (strMatch) {
      tokens.push({ text: strMatch[0], kind: "string" });
      i += strMatch[0].length;
      continue;
    }

    IDENT.lastIndex = 0;
    const idMatch = IDENT.exec(rest);
    if (idMatch) {
      const word = idMatch[0];
      let kind: TokenKind = "plain";
      if (afterDef) kind = "defname";
      else if (KEYWORDS.has(word)) kind = "keyword";
      else if (BUILTINS.has(word)) kind = "builtin";
      tokens.push({ text: word, kind });
      afterDef = word === "def" || word === "class" ? true : false;
      i += word.length;
      continue;
    }

    NUMBER.lastIndex = 0;
    const numMatch = NUMBER.exec(rest);
    if (numMatch) {
      tokens.push({ text: numMatch[0], kind: "number" });
      i += numMatch[0].length;
      continue;
    }

    OPERATOR.lastIndex = 0;
    const opMatch = OPERATOR.exec(rest);
    if (opMatch) {
      tokens.push({ text: opMatch[0], kind: "operator" });
      afterDef = false;
      i += opMatch[0].length;
      continue;
    }

    WS.lastIndex = 0;
    const wsMatch = WS.exec(rest);
    if (wsMatch) {
      tokens.push({ text: wsMatch[0], kind: "plain" });
      // `def` and its name may be separated by spaces, but not by a newline.
      if (wsMatch[0].includes("\n")) afterDef = false;
      i += wsMatch[0].length;
      continue;
    }

    // Anything else: one character of plain text so we always make progress.
    tokens.push({ text: source[i]!, kind: "plain" });
    i += 1;
  }

  return tokens;
}
