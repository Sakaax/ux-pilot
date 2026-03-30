import { describe, expect, test } from "bun:test";
import { RulesLoader } from "../../src/rules/loader";
import { resolve } from "path";

const RULES_DIR = resolve(import.meta.dir, "../../rules");

describe("RulesLoader", () => {
  const loader = new RulesLoader(RULES_DIR);

  test("loadForContext returns rules for a landing page context", () => {
    const rules = loader.loadForContext("landing");
    expect(rules.length).toBeGreaterThan(0);
  });

  test("loadForContext returns rules for a signup context", () => {
    const rules = loader.loadForContext("signup");
    expect(rules.length).toBeGreaterThan(0);
  });

  test("loadForContext returns empty array for unknown context", () => {
    const rules = loader.loadForContext("nonexistent_context_xyz");
    expect(rules).toEqual([]);
  });

  test("loadFile returns file content as string", () => {
    const content = loader.loadFile("ux-patterns/accessibility.md");
    expect(content).not.toBeNull();
    expect(content!).toContain("# Accessibility");
  });

  test("loadFile returns null for missing file", () => {
    const content = loader.loadFile("nonexistent.md");
    expect(content).toBeNull();
  });

  test("different contexts load different rule sets", () => {
    const landing = loader.loadForContext("landing");
    const signup = loader.loadForContext("signup");
    const landingPaths = landing.map((r) => r.path);
    const signupPaths = signup.map((r) => r.path);
    expect(landingPaths).not.toEqual(signupPaths);
  });

  test("all contexts in the map return at least one rule", () => {
    const contexts = [
      "landing", "signup", "onboarding", "dashboard",
      "pricing", "checkout", "settings", "data",
    ];
    for (const ctx of contexts) {
      const rules = loader.loadForContext(ctx);
      expect(rules.length).toBeGreaterThan(0);
    }
  });
});
