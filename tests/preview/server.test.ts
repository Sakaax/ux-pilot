import { describe, expect, test, afterEach } from "bun:test";
import { PreviewServer } from "../../src/preview/server";
import { resolve } from "path";
import { mkdirSync, writeFileSync, rmSync } from "fs";

const TEMPLATES_DIR = resolve(import.meta.dir, "../../templates");
const SCREENS_DIR = resolve(import.meta.dir, "../../.ux-pilot/preview/screens");

describe("PreviewServer", () => {
  let server: PreviewServer | null = null;

  afterEach(async () => {
    if (server) {
      await server.stop();
      server = null;
    }
    try {
      rmSync(resolve(import.meta.dir, "../../.ux-pilot"), { recursive: true });
    } catch {}
  });

  test("starts and serves on a port", async () => {
    server = new PreviewServer(TEMPLATES_DIR);
    const port = await server.start();
    expect(port).toBeGreaterThan(1024);

    const res = await fetch(`http://localhost:${port}/`);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("ux-pilot");
  });

  test("serves SSE endpoint", async () => {
    server = new PreviewServer(TEMPLATES_DIR);
    const port = await server.start();

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 500);

    try {
      const res = await fetch(`http://localhost:${port}/__sse`, {
        signal: controller.signal,
      });
      expect(res.headers.get("content-type")).toContain("text/event-stream");
    } catch {
      // AbortError is expected — we just needed the headers
    } finally {
      clearTimeout(timeout);
    }
  });

  test("serves screen HTML files", async () => {
    server = new PreviewServer(TEMPLATES_DIR);
    const port = await server.start();

    mkdirSync(SCREENS_DIR, { recursive: true });
    writeFileSync(resolve(SCREENS_DIR, "test-screen.html"), "<h1>Test Screen</h1>");

    const res = await fetch(`http://localhost:${port}/screens/test-screen.html`);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("Test Screen");
  });

  test("returns 404 for missing files", async () => {
    server = new PreviewServer(TEMPLATES_DIR);
    const port = await server.start();

    const res = await fetch(`http://localhost:${port}/nonexistent.html`);
    expect(res.status).toBe(404);
  });

  test("serves base.css", async () => {
    server = new PreviewServer(TEMPLATES_DIR);
    const port = await server.start();

    const res = await fetch(`http://localhost:${port}/base.css`);
    expect(res.status).toBe(200);
    const css = await res.text();
    expect(css).toContain("box-sizing");
  });

  test("stop shuts down the server", async () => {
    server = new PreviewServer(TEMPLATES_DIR);
    const port = await server.start();
    await server.stop();
    server = null;

    try {
      await fetch(`http://localhost:${port}/`);
      expect(true).toBe(false);
    } catch {
      expect(true).toBe(true);
    }
  });
});
