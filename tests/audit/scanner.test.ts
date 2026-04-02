import { describe, expect, test, afterEach } from "bun:test";
import { CodeScanner, type ScanResult } from "../../src/audit/scanner";
import { mkdirSync, writeFileSync, rmSync } from "fs";
import { resolve } from "path";

const TMP = resolve(import.meta.dir, "../../.test-scanner");

function setupFiles(files: Record<string, string>): string {
  const dir = resolve(TMP, `scan-${Date.now()}`);
  mkdirSync(dir, { recursive: true });
  for (const [path, content] of Object.entries(files)) {
    const fullPath = resolve(dir, path);
    mkdirSync(resolve(fullPath, ".."), { recursive: true });
    writeFileSync(fullPath, content);
  }
  return dir;
}

describe("CodeScanner", () => {
  afterEach(() => {
    try { rmSync(TMP, { recursive: true }); } catch {}
  });

  test("scans HTML heading hierarchy", () => {
    const dir = setupFiles({
      "index.html": "<html><body><h1>Title</h1><h3>Skip h2</h3></body></html>",
    });
    const scanner = new CodeScanner(dir);
    const result = scanner.scan();
    const headingIssue = result.findings.find((f) => f.category === "structure" && f.message.includes("heading"));
    expect(headingIssue).toBeDefined();
  });

  test("detects missing alt tags on images", () => {
    const dir = setupFiles({
      "index.html": '<html><body><img src="photo.jpg"><img src="ok.jpg" alt="desc"></body></html>',
    });
    const scanner = new CodeScanner(dir);
    const result = scanner.scan();
    const altIssue = result.findings.find((f) => f.category === "accessibility" && f.message.includes("alt"));
    expect(altIssue).toBeDefined();
  });

  test("detects missing form labels", () => {
    const dir = setupFiles({
      "index.html": '<html><body><form><input type="text" name="email"></form></body></html>',
    });
    const scanner = new CodeScanner(dir);
    const result = scanner.scan();
    const labelIssue = result.findings.find((f) => f.category === "forms" && f.message.includes("label"));
    expect(labelIssue).toBeDefined();
  });

  test("detects missing meta description", () => {
    const dir = setupFiles({
      "index.html": "<html><head><title>Test</title></head><body></body></html>",
    });
    const scanner = new CodeScanner(dir);
    const result = scanner.scan();
    const metaIssue = result.findings.find((f) => f.category === "seo" && f.message.includes("description"));
    expect(metaIssue).toBeDefined();
  });

  test("detects missing viewport meta", () => {
    const dir = setupFiles({
      "index.html": "<html><head></head><body></body></html>",
    });
    const scanner = new CodeScanner(dir);
    const result = scanner.scan();
    const vpIssue = result.findings.find((f) => f.category === "mobile" && f.message.includes("viewport"));
    expect(vpIssue).toBeDefined();
  });

  test("returns clean scan for well-formed HTML", () => {
    const dir = setupFiles({
      "index.html": `<html lang="en"><head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="A great page">
        <title>Good Page</title>
      </head><body>
        <h1>Title</h1><h2>Section</h2>
        <img src="photo.jpg" alt="A photo">
        <form><label for="email">Email</label><input id="email" type="email"></form>
      </body></html>`,
    });
    const scanner = new CodeScanner(dir);
    const result = scanner.scan();
    // Should have fewer findings
    const criticals = result.findings.filter((f) => f.severity === "critical");
    expect(criticals.length).toBe(0);
  });

  test("scan result has all required fields", () => {
    const dir = setupFiles({ "index.html": "<html></html>" });
    const scanner = new CodeScanner(dir);
    const result = scanner.scan();
    expect(result.filesScanned).toBeGreaterThanOrEqual(1);
    expect(Array.isArray(result.findings)).toBe(true);
  });

  test("every finding has a non-empty fixPrompt string", () => {
    const dir = setupFiles({
      "index.html": '<html><head></head><body><h3>No H1</h3><img src="x.jpg"></body></html>',
    });
    const scanner = new CodeScanner(dir);
    const result = scanner.scan();
    expect(result.findings.length).toBeGreaterThan(0);
    for (const finding of result.findings) {
      expect(typeof finding.fixPrompt).toBe("string");
      expect(finding.fixPrompt.length).toBeGreaterThan(0);
    }
  });

  test("heading fixPrompt includes the file name", () => {
    const dir = setupFiles({
      "page.html": "<html><body><h1>Title</h1><h3>Skip h2</h3></body></html>",
    });
    const scanner = new CodeScanner(dir);
    const result = scanner.scan();
    const headingIssue = result.findings.find((f) => f.category === "structure");
    expect(headingIssue).toBeDefined();
    expect(headingIssue!.fixPrompt).toContain("page.html");
  });

  test("missing alt fixPrompt includes the file name", () => {
    const dir = setupFiles({
      "gallery.html": '<html><body><img src="photo.jpg"></body></html>',
    });
    const scanner = new CodeScanner(dir);
    const result = scanner.scan();
    const altIssue = result.findings.find((f) => f.category === "accessibility");
    expect(altIssue).toBeDefined();
    expect(altIssue!.fixPrompt).toContain("gallery.html");
  });

  test("missing label fixPrompt includes the file name", () => {
    const dir = setupFiles({
      "form.html": '<html><body><form><input type="text" name="email"></form></body></html>',
    });
    const scanner = new CodeScanner(dir);
    const result = scanner.scan();
    const labelIssue = result.findings.find((f) => f.category === "forms");
    expect(labelIssue).toBeDefined();
    expect(labelIssue!.fixPrompt).toContain("form.html");
  });

  test("missing meta description fixPrompt includes the file name", () => {
    const dir = setupFiles({
      "landing.html": "<html><head><title>Test</title></head><body></body></html>",
    });
    const scanner = new CodeScanner(dir);
    const result = scanner.scan();
    const metaIssue = result.findings.find((f) => f.category === "seo" && f.message.includes("description"));
    expect(metaIssue).toBeDefined();
    expect(metaIssue!.fixPrompt).toContain("landing.html");
  });

  test("missing viewport fixPrompt includes the file name", () => {
    const dir = setupFiles({
      "app.html": "<html><head></head><body></body></html>",
    });
    const scanner = new CodeScanner(dir);
    const result = scanner.scan();
    const vpIssue = result.findings.find((f) => f.category === "mobile");
    expect(vpIssue).toBeDefined();
    expect(vpIssue!.fixPrompt).toContain("app.html");
  });
});
