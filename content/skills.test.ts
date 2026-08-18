import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { SKILLS } from "./skills";

function skillIdUnionMembers(): string[] {
  const source = readFileSync(join(process.cwd(), "content", "types.ts"), "utf8");
  const match = source.match(/export type SkillId =([\s\S]*?);/);
  if (!match) throw new Error("SkillId union not found in content/types.ts");
  return [...match[1]!.matchAll(/"([a-z0-9-]+)"/g)].map((m) => m[1]!);
}

describe("skill definitions", () => {
  const union = skillIdUnionMembers();
  const defined = SKILLS.map((s) => s.id);

  it("defines every SkillId in the union (no missing definitions)", () => {
    const missing = union.filter((id) => !defined.includes(id as never));
    expect(missing).toEqual([]);
  });

  it("has no orphan definitions outside the union", () => {
    const orphans = defined.filter((id) => !union.includes(id));
    expect(orphans).toEqual([]);
  });

  it("has no duplicate definitions", () => {
    expect(new Set(defined).size).toBe(defined.length);
  });

  it("gives every skill a real label and capability statement", () => {
    for (const skill of SKILLS) {
      expect(skill.label.length).toBeGreaterThan(2);
      expect(skill.description.length).toBeGreaterThan(20);
      expect(skill.description.endsWith(".")).toBe(true);
    }
  });
});
