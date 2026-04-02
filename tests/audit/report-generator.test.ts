import { describe, expect, test } from "bun:test";
import { generateAuditReport } from "../../src/audit/report-generator";
import type { Finding } from "../../src/audit/scanner";
import type { FrameworkInfo } from "../../src/audit/framework-detector";

describe("Audit Report Generator", () => {
  const findings: Finding[] = [
    { category: "accessibility", severity: "high", message: "Image missing alt", file: "index.html", rule: "accessibility", fixPrompt: "In index.html, add descriptive alt attributes to all img tags." },
    { category: "seo", severity: "high", message: "Missing meta description", file: "index.html", rule: "seo", fixPrompt: 'In index.html, add a <meta name="description" content="..."> tag inside <head>.' },
    { category: "mobile", severity: "critical", message: "Missing viewport", file: "index.html", rule: "mobile", fixPrompt: 'In index.html, add <meta name="viewport" content="width=device-width, initial-scale=1.0"> inside <head>.' },
    { category: "structure", severity: "medium", message: "Skipped heading level", file: "index.html", rule: "structure", fixPrompt: "In index.html, fix the heading hierarchy so no levels are skipped." },
    { category: "forms", severity: "low", message: "Missing helper text", file: "form.html", rule: "forms", fixPrompt: "In form.html, add helper text below each form input to guide the user." },
  ];

  const framework: FrameworkInfo = { name: "nextjs", version: "14.0.0", uiFramework: "tailwind" };

  test("generates markdown report", () => {
    const report = generateAuditReport(findings, framework, 5);
    expect(report).toContain("# UX Audit");
    expect(report).toContain("## Score");
    expect(report).toContain("Critical");
    expect(report).toContain("High");
    expect(report).toContain("Medium");
    expect(report).toContain("Low");
  });

  test("includes framework info", () => {
    const report = generateAuditReport(findings, framework, 5);
    expect(report).toContain("nextjs");
    expect(report).toContain("tailwind");
  });

  test("calculates a score out of 100", () => {
    const report = generateAuditReport(findings, framework, 5);
    const scoreMatch = report.match(/Score global : (\d+)\/100/);
    expect(scoreMatch).not.toBeNull();
    const score = parseInt(scoreMatch![1]);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  test("groups findings by severity", () => {
    const report = generateAuditReport(findings, framework, 5);
    const criticalIdx = report.indexOf("Critical");
    const highIdx = report.indexOf("High");
    const mediumIdx = report.indexOf("Medium");
    // Critical before High before Medium
    expect(criticalIdx).toBeLessThan(highIdx);
    expect(highIdx).toBeLessThan(mediumIdx);
  });

  test("handles empty findings", () => {
    const report = generateAuditReport([], framework, 3);
    expect(report).toContain("100/100");
  });

  test("includes fixPrompt for each finding in the report", () => {
    const report = generateAuditReport(findings, framework, 5);
    for (const finding of findings) {
      expect(report).toContain(finding.fixPrompt);
    }
  });
});
