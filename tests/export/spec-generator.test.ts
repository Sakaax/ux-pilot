import { describe, expect, test } from "bun:test";
import { generateSpec, type DesignDecision, type ScreenEntry } from "../../src/export/spec-generator";

describe("Spec Generator", () => {
  const brief = "# Brief UX\n\n## Produit\n- Type : saas\n- Probleme resolu : Task management";
  const decisions: DesignDecision[] = [
    { decision: "Navigation", choice: "Sidebar", reason: "App complexe, >7 sections" },
    { decision: "CTA color", choice: "#059669", reason: "Contraste 7.2:1" },
  ];
  const screens: ScreenEntry[] = [
    { name: "Landing", version: "Bold", rules: ["cta", "social-proof"] },
    { name: "Signup", version: "Social-first", rules: ["forms-feedback"] },
  ];

  test("generates valid markdown with all sections", () => {
    const spec = generateSpec({ brief, decisions, screens, projectName: "TaskFlow" });
    expect(spec).toContain("# UX Spec — TaskFlow");
    expect(spec).toContain("## Brief");
    expect(spec).toContain("## Flow valide");
    expect(spec).toContain("## Decisions de design");
  });

  test("includes date", () => {
    const spec = generateSpec({ brief, decisions, screens, projectName: "Test" });
    const today = new Date().toISOString().split("T")[0];
    expect(spec).toContain(today);
  });

  test("includes all screens with version names", () => {
    const spec = generateSpec({ brief, decisions, screens, projectName: "Test" });
    expect(spec).toContain("Landing");
    expect(spec).toContain("Bold");
    expect(spec).toContain("Signup");
    expect(spec).toContain("Social-first");
  });

  test("includes design decisions table", () => {
    const spec = generateSpec({ brief, decisions, screens, projectName: "Test" });
    expect(spec).toContain("Sidebar");
    expect(spec).toContain("App complexe");
  });

  test("includes rules applied per screen", () => {
    const spec = generateSpec({ brief, decisions, screens, projectName: "Test" });
    expect(spec).toContain("cta, social-proof");
    expect(spec).toContain("forms-feedback");
  });
});
