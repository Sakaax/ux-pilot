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
  fixPrompt: string;
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
        fixPrompt: `Add a single H1 heading to ${file} that describes the main content of the page.`,
      });
    } else if (h1Count > 1) {
      findings.push({
        category: "structure",
        severity: "medium",
        message: `Multiple H1 headings found (${h1Count})`,
        file,
        rule: "seo-aeo/structure: H1 unique par page",
        fixPrompt: `In ${file}, keep only one H1 heading that describes the main content and convert the other ${h1Count - 1} H1 tag(s) to H2 or lower.`,
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
          fixPrompt: `In ${file}, fix the heading hierarchy so no levels are skipped. Change the H${levels[i]} to an H${levels[i - 1] + 1}, or add the missing intermediate heading levels between H${levels[i - 1]} and H${levels[i]}.`,
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
          fixPrompt: `In ${file}, add descriptive alt attributes to all img tags that are missing them. Each alt text should concisely describe the image content.`,
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
            fixPrompt: `In ${file}, add a <label for="${idMatch[1]}"> element before the input with id="${idMatch[1]}" that clearly describes what the user should enter.`,
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
            fixPrompt: `In ${file}, add an id attribute to each input that lacks one, then add a corresponding <label for="..."> element that describes the expected input.`,
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
        fixPrompt: `In ${file}, add a <meta name="description" content="..."> tag inside <head> with a concise page summary under 160 characters.`,
      });
    }

    if (!content.includes("<title") && !content.includes("og:title")) {
      findings.push({
        category: "seo",
        severity: "high",
        message: "Missing title tag",
        file,
        rule: "seo-aeo/meta-og: Title unique par page",
        fixPrompt: `In ${file}, add a <title> tag inside <head> with a unique, descriptive page title under 60 characters.`,
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
        fixPrompt: `In ${file}, add <meta name="viewport" content="width=device-width, initial-scale=1.0"> inside the <head> tag to enable responsive layout on mobile devices.`,
      });
    }

    findings.push(...this.checkMobileCSS(content, file));

    return findings;
  }

  private checkMobileCSS(content: string, file: string): Finding[] {
    const findings: Finding[] = [];

    // Tables without responsive wrapper
    if (/<table[\s>]/i.test(content) && !content.includes("overflow")) {
      findings.push({
        category: "mobile",
        severity: "high",
        message: "Table without responsive wrapper — will overflow on mobile",
        file,
        rule: "ux-patterns/layout-responsive: Tables doivent etre scrollables horizontalement sur mobile",
        fixPrompt: `In ${file}, wrap each <table> in a container with overflow-x: auto to make tables scrollable on mobile devices.`,
      });
    }

    // Fixed pixel widths in inline styles (> 500px)
    const fixedWidthInline = /style\s*=\s*["'][^"']*?width\s*:\s*(\d+)px/gi;
    let widthMatch = fixedWidthInline.exec(content);
    while (widthMatch !== null) {
      const px = parseInt(widthMatch[1]);
      if (px > 500) {
        findings.push({
          category: "mobile",
          severity: "high",
          message: `Fixed width ${px}px found — will overflow on mobile screens`,
          file,
          rule: "ux-patterns/layout-responsive: Utiliser max-width ou pourcentages au lieu de largeurs fixes",
          fixPrompt: `In ${file}, replace the fixed width: ${px}px with max-width: 100% or a responsive unit (%, vw) so it adapts to mobile screens.`,
        });
        break;
      }
      widthMatch = fixedWidthInline.exec(content);
    }

    // Fixed pixel widths in CSS blocks (> 500px) without media queries
    const cssWidth = /\{[^}]*?width\s*:\s*(\d+)px/gi;
    let cssMatch = cssWidth.exec(content);
    while (cssMatch !== null) {
      const px = parseInt(cssMatch[1]);
      if (px > 500 && !content.includes("max-width") && !content.includes("@media")) {
        findings.push({
          category: "mobile",
          severity: "high",
          message: `CSS rule with fixed width ${px}px and no media query — will likely overflow on mobile`,
          file,
          rule: "ux-patterns/layout-responsive: Utiliser max-width ou pourcentages au lieu de largeurs fixes",
          fixPrompt: `In ${file}, replace the fixed width: ${px}px with max-width: 100% or add a @media query to adjust it for mobile screens.`,
        });
        break;
      }
      cssMatch = cssWidth.exec(content);
    }

    // Small touch targets (buttons/links with width or height < 44px)
    const touchTarget = /<(?:button|a)\s[^>]*style\s*=\s*["'][^"']*?(?:width|height)\s*:\s*(\d+)px/gi;
    let touchMatch = touchTarget.exec(content);
    while (touchMatch !== null) {
      const px = parseInt(touchMatch[1]);
      if (px < 44) {
        findings.push({
          category: "mobile",
          severity: "medium",
          message: `Touch target too small (${px}px) — minimum recommended is 44px`,
          file,
          rule: "ux-patterns/touch-interaction: Touch targets minimum 44x44px",
          fixPrompt: `In ${file}, increase the button/link size to at least 44x44px for comfortable touch interaction on mobile devices.`,
        });
        break;
      }
      touchMatch = touchTarget.exec(content);
    }

    // Small font sizes (< 14px)
    const fontSize = /font-size\s*:\s*(\d+)px/gi;
    let fontMatch = fontSize.exec(content);
    while (fontMatch !== null) {
      const px = parseInt(fontMatch[1]);
      if (px < 14 && px > 0) {
        findings.push({
          category: "mobile",
          severity: "medium",
          message: `Font size ${px}px is too small for mobile — minimum recommended is 14px`,
          file,
          rule: "ux-patterns/typography-color: Taille minimale lisible sur mobile",
          fixPrompt: `In ${file}, increase the font-size from ${px}px to at least 14px (16px recommended) for readability on mobile devices.`,
        });
        break;
      }
      fontMatch = fontSize.exec(content);
    }

    // Nav/tabs with display:flex but no flex-wrap
    const navFlex = /<nav\s[^>]*style\s*=\s*["'][^"']*display\s*:\s*flex[^"']*/gi;
    let navMatch = navFlex.exec(content);
    while (navMatch !== null) {
      if (!navMatch[0].includes("flex-wrap")) {
        findings.push({
          category: "mobile",
          severity: "high",
          message: "Nav/tabs use display:flex without flex-wrap — items will overflow on mobile",
          file,
          rule: "ux-patterns/navigation: Navigation doit wrapper sur mobile",
          fixPrompt: `In ${file}, add flex-wrap: wrap to the nav element's flex container so tabs/links wrap to the next line on small screens instead of overflowing.`,
        });
        break;
      }
      navMatch = navFlex.exec(content);
    }

    return findings;
  }
}
