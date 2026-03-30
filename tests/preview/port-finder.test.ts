import { describe, expect, test } from "bun:test";
import { findAvailablePort } from "../../src/preview/port-finder";

describe("Port Finder", () => {
  test("finds an available port", async () => {
    const port = await findAvailablePort();
    expect(port).toBeGreaterThan(1024);
    expect(port).toBeLessThan(65536);
  });

  test("avoids common dev ports", async () => {
    const port = await findAvailablePort();
    const commonPorts = [3000, 3001, 4000, 5173, 5174, 8000, 8080, 8888];
    expect(commonPorts).not.toContain(port);
  });

  test("returns different port if preferred is taken", async () => {
    const server = Bun.serve({ port: 4983, fetch: () => new Response("ok") });
    try {
      const port = await findAvailablePort(4983);
      expect(port).not.toBe(4983);
    } finally {
      server.stop();
    }
  });

  test("returns preferred port if available", async () => {
    const port = await findAvailablePort(19876);
    expect(port).toBe(19876);
  });
});
