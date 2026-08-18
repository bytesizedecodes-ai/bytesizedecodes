import { describe, expect, it } from "vitest";
import { tokenizePython } from "./highlight";

function kinds(code: string) {
  return tokenizePython(code)
    .filter((t) => t.kind !== "plain" && !/^\s+$/.test(t.text))
    .map((t) => `${t.kind}:${t.text}`);
}

describe("tokenizePython", () => {
  it("round-trips the source text exactly", () => {
    const code = `def vote(neighbors):\n    # majority vote\n    return max(set(neighbors), key=neighbors.count)\n`;
    expect(tokenizePython(code).map((t) => t.text).join("")).toBe(code);
  });

  it("highlights keywords, builtins, strings, numbers, comments", () => {
    expect(kinds(`return len("hi")  # count`)).toEqual([
      "keyword:return",
      "builtin:len",
      "operator:(",
      'string:"hi"',
      "operator:)",
      "comment:# count",
    ]);
    expect(kinds(`x = 3.5`)).toEqual(["operator:=", "number:3.5"]);
  });

  it("marks the name after def as a function name", () => {
    expect(kinds(`def majority_vote(labels):`)).toEqual([
      "keyword:def",
      "defname:majority_vote",
      "operator:(",
      "operator:):",
    ]);
  });

  it("handles triple-quoted strings without confusing comments inside them", () => {
    const code = `doc = """not # a comment"""
x = 1`;
    expect(kinds(code)).toEqual([
      "operator:=",
      'string:"""not # a comment"""',
      "operator:=",
      "number:1",
    ]);
  });

  it("never throws and always progresses on arbitrary input", () => {
    const weird = `"unterminated 🐍 \\ ${"\n"}#尚 ok 42"`;
    const tokens = tokenizePython(weird);
    expect(tokens.map((t) => t.text).join("")).toBe(weird);
  });
});
