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
  screenshot?: string;
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
        fixPrompt: `Fix the page structure in ${file} — add a single main heading (H1) that clearly describes what the page is about.`,
      });
    } else if (h1Count > 1) {
      findings.push({
        category: "structure",
        severity: "medium",
        message: `Multiple H1 headings found (${h1Count})`,
        file,
        rule: "seo-aeo/structure: H1 unique par page",
        fixPrompt: `Fix the heading structure in ${file} — keep only one main heading and convert the other ${h1Count - 1} duplicate main heading(s) to subheadings (H2 or lower).`,
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
          fixPrompt: `Fix the heading hierarchy in ${file} — headings jump from level ${levels[i - 1]} to level ${levels[i]}, skipping a level. Change the heading to level ${levels[i - 1] + 1} or add the missing intermediate levels so the outline flows logically.`,
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
          fixPrompt: `Fix accessibility in ${file} — add alt text descriptions to all images so screen readers can describe them. Each alt text should concisely explain what the image shows.`,
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
            fixPrompt: `Fix form accessibility in ${file} — add a visible label for the "${idMatch[1]}" input field that clearly describes what the user should enter.`,
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
            fixPrompt: `Fix form accessibility in ${file} — every input field needs a visible label that tells users what to type. Add a label to each input that is missing one.`,
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
        fixPrompt: `Fix SEO in ${file} — add a meta description tag with a concise page summary under 160 characters so search engines can display a useful snippet.`,
      });
    }

    if (!content.includes("<title") && !content.includes("og:title")) {
      findings.push({
        category: "seo",
        severity: "high",
        message: "Missing title tag",
        file,
        rule: "seo-aeo/meta-og: Title unique par page",
        fixPrompt: `Fix SEO in ${file} — add a page title (under 60 characters) that uniquely describes what this page is about. It shows in browser tabs and search results.`,
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
        fixPrompt: `Fix the mobile layout in ${file} — add a viewport meta tag so the page scales correctly on phones and tablets.`,
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
        fixPrompt: `Fix the mobile layout in ${file} — wrap each table in a scrollable container so it does not overflow the screen on phones. Users should be able to scroll sideways to see all columns.`,
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
          fixPrompt: `Fix the mobile layout in ${file} — replace the fixed ${px}px width with a flexible width (like a percentage or max-width) so the element adapts to smaller screens instead of overflowing.`,
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
          fixPrompt: `Fix the mobile layout in ${file} — a CSS rule sets a fixed ${px}px width with no responsive fallback. Replace it with a flexible width or add a media query so it adapts to smaller screens.`,
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
          fixPrompt: `Fix touch targets in ${file} — increase the button or link size to at least 44x44 pixels so users can tap it comfortably on a phone without hitting the wrong thing.`,
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
          fixPrompt: `Fix readability in ${file} — increase the font size from ${px}px to at least 14px (16px recommended) so the text is easy to read on mobile screens without zooming.`,
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
          fixPrompt: `Fix the navigation in ${file} — make sure the nav links wrap to the next line on small screens instead of overflowing off the edge. Add flex-wrap so items stack when space runs out.`,
        });
        break;
      }
      navMatch = navFlex.exec(content);
    }

    return findings;
  }
}
