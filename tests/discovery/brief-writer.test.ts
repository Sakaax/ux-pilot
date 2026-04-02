import { describe, expect, test, beforeEach, afterEach } from "bun:test";
import { writeBrief, updateBriefSection, ensureGitignore } from "../../src/discovery/brief-writer";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

function createTmpDir(): string {
  const dir = join(tmpdir(), `ux-pilot-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  mkdirSync(dir, { recursive: true });
  return dir;
}

describe("Brief Writer", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = createTmpDir();
  });

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
  });

  describe("writeBrief", () => {
    test("creates ux-pilot/ directory if it doesn't exist", () => {
      const briefContent = "# Brief UX\n\nTest content";
      writeBrief(tmpDir, briefContent);

      const uxPilotDir = join(tmpDir, "ux-pilot");
      expect(existsSync(uxPilotDir)).toBe(true);
    });

    test("writes ux-brief.md with correct content", () => {
      const briefContent = "# Brief UX\n\n## Produit\n- Type : saas";
      writeBrief(tmpDir, briefContent);

      const briefPath = join(tmpDir, "ux-pilot", "ux-brief.md");
      expect(existsSync(briefPath)).toBe(true);

      const written = readFileSync(briefPath, "utf-8");
      expect(written).toBe(briefContent);
    });

    test("adds ux-pilot/ to .gitignore if not present", () => {
      writeBrief(tmpDir, "# Brief UX");

      const gitignorePath = join(tmpDir, ".gitignore");
      expect(existsSync(gitignorePath)).toBe(true);

      const gitignoreContent = readFileSync(gitignorePath, "utf-8");
      expect(gitignoreContent).toContain("ux-pilot/");
    });

    test("does NOT duplicate .gitignore entry if already present", () => {
      const gitignorePath = join(tmpDir, ".gitignore");
      writeFileSync(gitignorePath, "node_modules/\nux-pilot/\n", "utf-8");

      writeBrief(tmpDir, "# Brief UX");

      const gitignoreContent = readFileSync(gitignorePath, "utf-8");
      const matches = gitignoreContent.match(/ux-pilot\//g);
      expect(matches).not.toBeNull();
      expect(matches!.length).toBe(1);
    });

    test("appends to existing .gitignore without overwriting", () => {
      const gitignorePath = join(tmpDir, ".gitignore");
      writeFileSync(gitignorePath, "node_modules/\ndist/\n", "utf-8");

      writeBrief(tmpDir, "# Brief UX");

      const gitignoreContent = readFileSync(gitignorePath, "utf-8");
      expect(gitignoreContent).toContain("node_modules/");
      expect(gitignoreContent).toContain("dist/");
      expect(gitignoreContent).toContain("ux-pilot/");
    });
  });

  describe("updateBriefSection", () => {
    test("updates an existing brief file with new section content", () => {
      const initialBrief = [
        "# Brief UX",
        "",
        "## Produit",
        "- Type : saas",
        "",
        "## Design Decisions",
        "Aucune decision pour le moment.",
        "",
        "## Validated Screens",
        "Aucun ecran valide.",
      ].join("\n");

      writeBrief(tmpDir, initialBrief);

      updateBriefSection(tmpDir, "Design Decisions", "- V1: Dark theme selected\n- V2: Rounded corners");

      const briefPath = join(tmpDir, "ux-pilot", "ux-brief.md");
      const updated = readFileSync(briefPath, "utf-8");

      expect(updated).toContain("## Design Decisions");
      expect(updated).toContain("- V1: Dark theme selected");
      expect(updated).toContain("- V2: Rounded corners");
      expect(updated).not.toContain("Aucune decision pour le moment.");
    });

    test("preserves existing sections when updating a specific one", () => {
      const initialBrief = [
        "# Brief UX",
        "",
        "## Produit",
        "- Type : saas",
        "",
        "## Utilisateurs",
        "- Persona principal : developers",
        "",
        "## Design Decisions",
        "Aucune decision pour le moment.",
        "",
        "## Validated Screens",
        "Aucun ecran valide.",
      ].join("\n");

      writeBrief(tmpDir, initialBrief);

      updateBriefSection(tmpDir, "Design Decisions", "- Selected: Minimal dark theme");

      const briefPath = join(tmpDir, "ux-pilot", "ux-brief.md");
      const updated = readFileSync(briefPath, "utf-8");

      expect(updated).toContain("## Produit");
      expect(updated).toContain("- Type : saas");
      expect(updated).toContain("## Utilisateurs");
      expect(updated).toContain("- Persona principal : developers");
      expect(updated).toContain("## Validated Screens");
      expect(updated).toContain("Aucun ecran valide.");
    });

    test("updates Validated Screens section", () => {
      const initialBrief = [
        "# Brief UX",
        "",
        "## Produit",
        "- Type : saas",
        "",
        "## Validated Screens",
        "Aucun ecran valide.",
      ].join("\n");

      writeBrief(tmpDir, initialBrief);

      updateBriefSection(tmpDir, "Validated Screens", "- Landing page v2\n- Dashboard v1");

      const briefPath = join(tmpDir, "ux-pilot", "ux-brief.md");
      const updated = readFileSync(briefPath, "utf-8");

      expect(updated).toContain("## Validated Screens");
      expect(updated).toContain("- Landing page v2");
      expect(updated).toContain("- Dashboard v1");
      expect(updated).not.toContain("Aucun ecran valide.");
    });
  });

  describe("brief content structure", () => {
    test("brief file contains all expected sections", () => {
      const fullBrief = [
        "# Brief UX",
        "",
        "## Produit",
        "- Type : saas",
        "",
        "## Utilisateurs",
        "- Persona : developers",
        "",
        "## Business",
        "- Modele : freemium",
        "",
        "## Design",
        "- Mood : minimal",
        "",
        "## SEO",
        "- Organique : priority",
        "",
        "## Technique",
        "- Stack : react",
        "",
        "## Design Decisions",
        "Aucune decision pour le moment.",
        "",
        "## Validated Screens",
        "Aucun ecran valide.",
      ].join("\n");

      writeBrief(tmpDir, fullBrief);

      const briefPath = join(tmpDir, "ux-pilot", "ux-brief.md");
      const content = readFileSync(briefPath, "utf-8");

      expect(content).toContain("## Produit");
      expect(content).toContain("## Utilisateurs");
      expect(content).toContain("## Business");
      expect(content).toContain("## Design");
      expect(content).toContain("## SEO");
      expect(content).toContain("## Technique");
      expect(content).toContain("## Design Decisions");
      expect(content).toContain("## Validated Screens");
    });

    test("Design Decisions section can be updated", () => {
      const brief = [
        "# Brief UX",
        "",
        "## Design Decisions",
        "Initial.",
      ].join("\n");

      writeBrief(tmpDir, brief);
      updateBriefSection(tmpDir, "Design Decisions", "- Theme: dark\n- Font: Inter");

      const content = readFileSync(join(tmpDir, "ux-pilot", "ux-brief.md"), "utf-8");
      expect(content).toContain("- Theme: dark");
      expect(content).toContain("- Font: Inter");
    });

    test("Validated Screens section can be updated", () => {
      const brief = [
        "# Brief UX",
        "",
        "## Validated Screens",
        "Initial.",
      ].join("\n");

      writeBrief(tmpDir, brief);
      updateBriefSection(tmpDir, "Validated Screens", "- Homepage v3\n- Pricing v1");

      const content = readFileSync(join(tmpDir, "ux-pilot", "ux-brief.md"), "utf-8");
      expect(content).toContain("- Homepage v3");
      expect(content).toContain("- Pricing v1");
    });
  });

  describe("ensureGitignore", () => {
    test("creates .gitignore with ux-pilot/ if file doesn't exist", () => {
      ensureGitignore(tmpDir);

      const gitignorePath = join(tmpDir, ".gitignore");
      expect(existsSync(gitignorePath)).toBe(true);

      const content = readFileSync(gitignorePath, "utf-8");
      expect(content).toContain("ux-pilot/");
    });

    test("appends ux-pilot/ to existing .gitignore", () => {
      const gitignorePath = join(tmpDir, ".gitignore");
      writeFileSync(gitignorePath, "node_modules/\n", "utf-8");

      ensureGitignore(tmpDir);

      const content = readFileSync(gitignorePath, "utf-8");
      expect(content).toContain("node_modules/");
      expect(content).toContain("ux-pilot/");
    });

    test("does not duplicate entry if ux-pilot/ already in .gitignore", () => {
      const gitignorePath = join(tmpDir, ".gitignore");
      writeFileSync(gitignorePath, "ux-pilot/\n", "utf-8");

      ensureGitignore(tmpDir);

      const content = readFileSync(gitignorePath, "utf-8");
      const matches = content.match(/ux-pilot\//g);
      expect(matches).not.toBeNull();
      expect(matches!.length).toBe(1);
    });
  });
});
