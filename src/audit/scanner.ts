import { readFileSync, readdirSync, existsSync } from "fs";
import { resolve, extname } from "path";

export type Severity = "critical" | "high" | "medium" | "low";
export type FindingCategory = "structure" | "accessibility" | "forms" | "seo" | "mobile" | "navigation" | "performance";

export interface Finding {
  category: FindingCategory;
  severity: Severity;
  message: string;
  file: string;
  rule: string;
}

export interface ScanResult {
  filesScanned: number;
  findings: Finding[];
}

const HTML_EXTENSIONS = new Set([".html", ".htm", ".jsx", ".tsx", ".vue", ".svelte"]);

export class CodeScanner {
  private dir: string;

  constructor(dir: string) {
    this.dir = dir;
  }

  scan(): ScanResult {
    const files = this.findFiles();
    const findings: Finding[] = [];

    for (const file of files) {
      const content = readFileSync(resolve(this.dir, file), "utf-8");
      findings.push(...this.checkHeadings(content, file));
      findings.push(...this.checkImages(content, file));
      findings.push(...this.checkForms(content, file));
      findings.push(...this.checkSEO(content, file));
      findings.push(...this.checkMobile(content, file));
    }

    return { filesScanned: files.length, findings };
  }

  private findFiles(): string[] {
    const files: string[] = [];
    this.walkDir(this.dir, "", files);
    return files;
  }

  private walkDir(base: string, rel: string, result: string[]): void {
    const fullPath = resolve(base, rel);
    if (!existsSync(fullPath)) return;

    const entries = readdirSync(fullPath, { withFileTypes: true });
    for (const entry of entries) {
      const entryRel = rel ? `${rel}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        if (entry.name === "node_modules" || entry.name === ".git" || entry.name === "dist") continue;
        this.walkDir(base, entryRel, result);
      } else if (HTML_EXTENSIONS.has(extname(entry.name))) {
        result.push(entryRel);
      }
    }
  }

  private checkHeadings(content: string, file: string): Finding[] {
    const findings: Finding[] = [];
    const headingMatches = content.match(/<h([1-6])/gi);
    if (!headingMatches) return findings;

    const levels = headingMatches.map((m) => parseInt(m.charAt(2)));

    // Check H1 count
    const h1Count = levels.filter((l) => l === 1).length;
    if (h1Count === 0) {
      findings.push({
        category: "structure",
        severity: "high",
        message: "Missing H1 heading",
        file,
        rule: "seo-aeo/structure: H1 unique par page",
      });
    } else if (h1Count > 1) {
      findings.push({
        category: "structure",
        severity: "medium",
        message: `Multiple H1 headings found (${h1Count})`,
        file,
        rule: "seo-aeo/structure: H1 unique par page",
      });
    }

    // Check heading hierarchy (no skipping levels)
    for (let i = 1; i < levels.length; i++) {
      if (levels[i] > levels[i - 1] + 1) {
        findings.push({
          category: "structure",
          severity: "medium",
          message: `Skipped heading level: H${levels[i - 1]} → H${levels[i]}`,
          file,
          rule: "seo-aeo/structure: Hierarchie H2-H6 logique",
        });
        break;
      }
    }

    return findings;
  }

  private checkImages(content: string, file: string): Finding[] {
    const findings: Finding[] = [];
    const imgRegex = /<img\s[^>]*>/gi;
    const imgs = content.match(imgRegex);
    if (!imgs) return findings;

    for (const img of imgs) {
      if (!img.includes("alt=")) {
        findings.push({
          category: "accessibility",
          severity: "high",
          message: "Image missing alt attribute",
          file,
          rule: "ux-patterns/accessibility: Alt descriptif pour les images",
        });
      }
    }

    return findings;
  }

  private checkForms(content: string, file: string): Finding[] {
    const findings: Finding[] = [];
    const inputRegex = /<input\s[^>]*>/gi;
    const inputs = content.match(inputRegex);
    if (!inputs) return findings;

    for (const input of inputs) {
      // Skip hidden, submit, button types
      if (/type=["'](hidden|submit|button|reset)["']/i.test(input)) continue;

      const idMatch = input.match(/id=["']([^"']+)["']/);
      if (idMatch) {
        const labelRegex = new RegExp(`for=["']${idMatch[1]}["']`);
        if (!labelRegex.test(content)) {
          findings.push({
            category: "forms",
            severity: "high",
            message: `Input "${idMatch[1]}" has no associated label`,
            file,
            rule: "ux-patterns/forms-feedback: Label visible par input",
          });
        }
      } else {
        // Input without id — check if wrapped in label
        if (!this.isWrappedInLabel(content, input)) {
          findings.push({
            category: "forms",
            severity: "high",
            message: "Input without id or wrapping label — missing label association",
            file,
            rule: "ux-patterns/forms-feedback: Label visible par input",
          });
        }
      }
    }

    return findings;
  }

  private isWrappedInLabel(content: string, input: string): boolean {
    const inputIndex = content.indexOf(input);
    if (inputIndex === -1) return false;
    const before = content.substring(Math.max(0, inputIndex - 200), inputIndex);
    const after = content.substring(inputIndex, Math.min(content.length, inputIndex + 200));
    return before.includes("<label") && after.includes("</label>");
  }

  private checkSEO(content: string, file: string): Finding[] {
    const findings: Finding[] = [];

    // Only check files that look like full HTML pages
    if (!content.includes("<head") && !content.includes("<html")) return findings;

    if (!content.includes('name="description"') && !content.includes("name='description'")) {
      findings.push({
        category: "seo",
        severity: "high",
        message: "Missing meta description",
        file,
        rule: "seo-aeo/meta-og: Meta description < 160 caracteres",
      });
    }

    if (!content.includes("<title") && !content.includes("og:title")) {
      findings.push({
        category: "seo",
        severity: "high",
        message: "Missing title tag",
        file,
        rule: "seo-aeo/meta-og: Title unique par page",
      });
    }

    return findings;
  }

  private checkMobile(content: string, file: string): Finding[] {
    const findings: Finding[] = [];

    if (!content.includes("<head") && !content.includes("<html")) return findings;

    if (!content.includes("viewport")) {
      findings.push({
        category: "mobile",
        severity: "critical",
        message: "Missing viewport meta tag",
        file,
        rule: "ux-patterns/layout-responsive: Viewport meta obligatoire",
      });
    }

    return findings;
  }
}
