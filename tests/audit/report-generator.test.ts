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

  test("mobile findings should produce a lower score than non-mobile findings of the same severity and count", () => {
    const mobileFindings: Finding[] = [
      { category: "mobile", severity: "high", message: "No responsive layout", file: "app.tsx", rule: "mobile", fixPrompt: "Add responsive layout." },
      { category: "mobile", severity: "high", message: "Touch targets too small", file: "nav.tsx", rule: "mobile", fixPrompt: "Increase touch targets." },
      { category: "mobile", severity: "high", message: "Text too small on mobile", file: "page.tsx", rule: "mobile", fixPrompt: "Increase font size." },
    ];

    const nonMobileFindings: Finding[] = [
      { category: "accessibility", severity: "high", message: "Missing alt text", file: "app.tsx", rule: "accessibility", fixPrompt: "Add alt text." },
      { category: "accessibility", severity: "high", message: "Low contrast", file: "nav.tsx", rule: "accessibility", fixPrompt: "Increase contrast." },
      { category: "accessibility", severity: "high", message: "Missing label", file: "page.tsx", rule: "accessibility", fixPrompt: "Add label." },
    ];

    const filesScanned = 10;
    const mobileReport = generateAuditReport(mobileFindings, framework, filesScanned);
    const nonMobileReport = generateAuditReport(nonMobileFindings, framework, filesScanned);

    const mobileScore = parseInt(mobileReport.match(/Score global : (\d+)\/100/)![1]);
    const nonMobileScore = parseInt(nonMobileReport.match(/Score global : (\d+)\/100/)![1]);

    expect(mobileScore).toBeLessThan(nonMobileScore);
  });

  test("mobile severity multiplier of 1.5x is applied correctly", () => {
    const mobileCritical: Finding[] = [
      { category: "mobile", severity: "critical", message: "Missing viewport", file: "index.html", rule: "mobile", fixPrompt: "Add viewport meta." },
    ];

    const nonMobileCritical: Finding[] = [
      { category: "accessibility", severity: "critical", message: "Missing landmark", file: "index.html", rule: "accessibility", fixPrompt: "Add landmark." },
    ];

    const filesScanned = 10;
    const mobileReport = generateAuditReport(mobileCritical, framework, filesScanned);
    const nonMobileReport = generateAuditReport(nonMobileCritical, framework, filesScanned);

    const mobileScore = parseInt(mobileReport.match(/Score global : (\d+)\/100/)![1]);
    const nonMobileScore = parseInt(nonMobileReport.match(/Score global : (\d+)\/100/)![1]);

    // mobile critical penalty = 15 * 1.5 = 22.5 → score = round(100 - (22.5/300)*100) = 93
    // non-mobile critical penalty = 15 → score = round(100 - (15/300)*100) = 95
    expect(mobileScore).toBe(93);
    expect(nonMobileScore).toBe(95);
  });
});
