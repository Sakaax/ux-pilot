import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

export interface LoadedRule {
  path: string;
  content: string;
}

const CONTEXT_MAP: Record<string, string[]> = {
  landing: [
    "conversion-funnel/cta.md",
    "conversion-funnel/landing-patterns.md",
    "seo-aeo/structure.md",
    "seo-aeo/meta-og.md",
    "seo-aeo/schema-org.md",
    "seo-aeo/aeo.md",
    "psychology/social-proof.md",
    "aesthetics/anti-patterns.md",
    "aesthetics/typography-craft.md",
    "aesthetics/backgrounds.md",
  ],
  signup: [
    "conversion-funnel/signup-auth.md",
    "ux-patterns/forms-feedback.md",
    "ux-patterns/accessibility.md",
    "psychology/trust.md",
  ],
  onboarding: [
    "ux-patterns/forms-feedback.md",
    "ux-patterns/empty-states.md",
    "ux-patterns/accessibility.md",
    "psychology/cognitive-load.md",
  ],
  dashboard: [
    "ux-patterns/navigation.md",
    "ux-patterns/data-tables.md",
    "ux-patterns/layout-responsive.md",
    "ux-patterns/empty-states.md",
    "ux-patterns/charts-data.md",
    "ux-patterns/accessibility.md",
  ],
  pricing: [
    "conversion-funnel/pricing.md",
    "conversion-funnel/cta.md",
    "psychology/social-proof.md",
    "psychology/trust.md",
    "psychology/persuasion.md",
    "ux-patterns/accessibility.md",
  ],
  checkout: [
    "conversion-funnel/checkout.md",
    "ux-patterns/forms-feedback.md",
    "psychology/trust.md",
    "ux-patterns/accessibility.md",
  ],
  settings: [
    "ux-patterns/forms-feedback.md",
    "ux-patterns/navigation.md",
    "ux-patterns/accessibility.md",
  ],
  data: [
    "ux-patterns/charts-data.md",
    "ux-patterns/data-tables.md",
    "ux-patterns/layout-responsive.md",
    "ux-patterns/accessibility.md",
  ],
  mobile: [
    "ux-patterns/touch-interaction.md",
    "ux-patterns/layout-responsive.md",
    "ux-patterns/navigation.md",
  ],
  design: [
    "aesthetics/anti-patterns.md",
    "aesthetics/typography-craft.md",
    "aesthetics/backgrounds.md",
    "aesthetics/styles.md",
    "product-type/reasoning.md",
  ],
  retention: [
    "conversion-funnel/retention.md",
    "conversion-funnel/churn-prevention.md",
    "psychology/cognitive-load.md",
  ],
  seo: [
    "seo-aeo/structure.md",
    "seo-aeo/meta-og.md",
    "seo-aeo/performance-seo.md",
    "seo-aeo/schema-org.md",
    "seo-aeo/aeo.md",
  ],
  animation: [
    "ux-patterns/animation.md",
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
