import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

export interface LoadedRule {
  path: string;
  content: string;
}

const CONTEXT_MAP: Record<string, string[]> = {
  landing: [
    "conversion-funnel/cta.md",
    "seo-aeo/structure.md",
    "aesthetics/anti-patterns.md",
  ],
  signup: [
    "ux-patterns/forms-feedback.md",
    "ux-patterns/accessibility.md",
  ],
  onboarding: [
    "ux-patterns/forms-feedback.md",
    "ux-patterns/accessibility.md",
  ],
  dashboard: [
    "ux-patterns/navigation.md",
    "ux-patterns/accessibility.md",
  ],
  pricing: [
    "conversion-funnel/cta.md",
    "ux-patterns/accessibility.md",
  ],
  checkout: [
    "conversion-funnel/cta.md",
    "ux-patterns/forms-feedback.md",
    "ux-patterns/accessibility.md",
  ],
  settings: [
    "ux-patterns/forms-feedback.md",
    "ux-patterns/navigation.md",
    "ux-patterns/accessibility.md",
  ],
  data: [
    "ux-patterns/navigation.md",
    "ux-patterns/accessibility.md",
  ],
};

export class RulesLoader {
  private rulesDir: string;

  constructor(rulesDir: string) {
    this.rulesDir = rulesDir;
  }

  loadForContext(context: string): LoadedRule[] {
    const filePaths = CONTEXT_MAP[context];
    if (!filePaths) return [];

    const rules: LoadedRule[] = [];
    for (const filePath of filePaths) {
      const content = this.loadFile(filePath);
      if (content !== null) {
        rules.push({ path: filePath, content });
      }
    }
    return rules;
  }

  loadFile(relativePath: string): string | null {
    const fullPath = resolve(this.rulesDir, relativePath);
    if (!existsSync(fullPath)) return null;
    return readFileSync(fullPath, "utf-8");
  }
}
