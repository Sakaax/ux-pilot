import { describe, expect, test } from "bun:test";
import { generateHtmlAuditReport } from "../../src/audit/html-report-generator";
import type { Finding } from "../../src/audit/scanner";
import type { FrameworkInfo } from "../../src/audit/framework-detector";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const framework: FrameworkInfo = {
  name: "nextjs",
  version: "14.0.0",
  uiFramework: "tailwind",
};

function makeFindings(): Finding[] {
  return [
    {
      category: "mobile",
      severity: "critical",
      message: "Missing viewport meta tag",
      file: "index.html",
      rule: "ux-patterns/layout-responsive: Viewport meta obligatoire",
      fixPrompt: "Add <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"> inside <head> in index.html",
    },
    {
      category: "accessibility",
      severity: "high",
      message: "Image missing alt attribute",
      file: "gallery.html",
      rule: "ux-patterns/accessibility: Alt descriptif pour les images",
      fixPrompt: "Add a descriptive alt attribute to the <img> tag in gallery.html",
    },
    {
      category: "seo",
      severity: "high",
      message: "Missing meta description",
      file: "index.html",
      rule: "seo-aeo/meta-og: Meta description < 160 caracteres",
      fixPrompt: "Add <meta name=\"description\" content=\"...\"> inside <head> in index.html",
    },
    {
      category: "structure",
      severity: "medium",
      message: "Skipped heading level: H1 to H3",
      file: "about.html",
      rule: "seo-aeo/structure: Hierarchie H2-H6 logique",
      fixPrompt: "Insert an H2 between H1 and H3 in about.html to restore heading hierarchy",
    },
    {
      category: "forms",
      severity: "low",
      message: "Missing helper text on email input",
      file: "contact.html",
      rule: "ux-patterns/forms-feedback: Helper text",
      fixPrompt: "Add helper text below the email input in contact.html",
    },
  ];
}

describe("HTML Audit Report Generator", () => {
  test("generateHtmlAuditReport returns valid HTML string", () => {
    const html = generateHtmlAuditReport(makeFindings(), framework, 10);
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("<html");
    expect(html).toContain("</html>");
    expect(html).toContain("<head>");
    expect(html).toContain("<body>");
  });

  test("contains score in the output", () => {
    const html = generateHtmlAuditReport(makeFindings(), framework, 10);
    const scoreMatch = html.match(/(\d{1,3})\s*\/\s*100/);
    expect(scoreMatch).not.toBeNull();
    const score = parseInt(scoreMatch![1]);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  test("groups findings by severity with correct sections", () => {
    const html = generateHtmlAuditReport(makeFindings(), framework, 10);
    // All four severity sections must exist
    expect(html).toContain("Critical");
    expect(html).toContain("High");
    expect(html).toContain("Medium");
    expect(html).toContain("Low");

    // Critical appears before High, High before Medium, Medium before Low
    const criticalIdx = html.indexOf("Critical");
    const highIdx = html.indexOf("High");
    const mediumIdx = html.indexOf("Medium");
    const lowIdx = html.lastIndexOf("Low");
    expect(criticalIdx).toBeLessThan(highIdx);
    expect(highIdx).toBeLessThan(mediumIdx);
    expect(mediumIdx).toBeLessThan(lowIdx);
  });

  test("each finding includes the file path, rule, and message", () => {
    const findings = makeFindings();
    const html = generateHtmlAuditReport(findings, framework, 10);

    for (const f of findings) {
      expect(html).toContain(escapeHtml(f.file));
      expect(html).toContain(escapeHtml(f.rule));
      expect(html).toContain(escapeHtml(f.message));
    }
  });

  test("each finding includes a fixPrompt section with a copy button", () => {
    const findings = makeFindings();
    const html = generateHtmlAuditReport(findings, framework, 10);

    for (const f of findings) {
      expect(html).toContain(escapeHtml(f.fixPrompt));
    }
    // There should be at least one copy button per finding
    const copyButtonCount = (html.match(/copy-btn/g) || []).length;
    expect(copyButtonCount).toBeGreaterThanOrEqual(findings.length);
  });

  test("contains severity color coding (critical=red, high=orange, medium=yellow, low=blue)", () => {
    const html = generateHtmlAuditReport(makeFindings(), framework, 10);

    // Check that severity-specific color values are present in the CSS/inline styles
    // Critical = red tones
    expect(html).toMatch(/critical[\s\S]*?#[eE][fF]44|#[eE][fF]44[\s\S]*?critical|\.severity-critical[\s\S]*?red|critical[\s\S]*?red/i);
    // High = orange tones
    expect(html).toMatch(/high[\s\S]*?#[fF][97]|#[fF][97][\s\S]*?high|\.severity-high[\s\S]*?orange|high[\s\S]*?orange/i);
    // Medium = yellow tones
    expect(html).toMatch(/medium[\s\S]*?#[fF][aAbB]|#[fF][aAbB][\s\S]*?medium|\.severity-medium[\s\S]*?yellow|medium[\s\S]*?yellow/i);
    // Low = blue tones
    expect(html).toMatch(/low[\s\S]*?#[36][0-9a-fA-F]|#[36][0-9a-fA-F][\s\S]*?low|\.severity-low[\s\S]*?blue|low[\s\S]*?blue/i);
  });

  test("contains a summary section with category breakdown", () => {
    const html = generateHtmlAuditReport(makeFindings(), framework, 10);

    // Summary section must exist
    expect(html.toLowerCase()).toContain("summary");

    // Category names from the findings should appear in the summary
    expect(html).toContain("mobile");
    expect(html).toContain("accessibility");
    expect(html).toContain("seo");
    expect(html).toContain("structure");
    expect(html).toContain("forms");
  });

  test("handles empty findings gracefully", () => {
    const html = generateHtmlAuditReport([], framework, 5);
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("100");
    // Score should be 100 with no findings
    const scoreMatch = html.match(/(\d{1,3})\s*\/\s*100/);
    expect(scoreMatch).not.toBeNull();
    expect(parseInt(scoreMatch![1])).toBe(100);
  });

  test("includes inline CSS (self-contained, no external deps)", () => {
    const html = generateHtmlAuditReport(makeFindings(), framework, 10);
    expect(html).toContain("<style>");
    // Should reference the design system fonts via Google Fonts
    expect(html).toContain("fonts.googleapis.com");
  });

  test("uses dark theme with ux-pilot branding", () => {
    const html = generateHtmlAuditReport(makeFindings(), framework, 10);
    // Background color #0F0E0C
    expect(html).toContain("#0F0E0C");
    // Accent color #D4622A
    expect(html).toContain("#D4622A");
  });
});
