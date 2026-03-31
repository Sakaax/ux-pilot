import { describe, expect, test, beforeEach, afterEach } from "bun:test";
import { detectFramework, type FrameworkInfo } from "../../src/audit/framework-detector";
import { mkdirSync, writeFileSync, rmSync } from "fs";
import { resolve } from "path";

const TMP = resolve(import.meta.dir, "../../.test-projects");

function setupProject(files: Record<string, string>): string {
  const dir = resolve(TMP, `proj-${Date.now()}`);
  mkdirSync(dir, { recursive: true });
  for (const [path, content] of Object.entries(files)) {
    const fullPath = resolve(dir, path);
    mkdirSync(resolve(fullPath, ".."), { recursive: true });
    writeFileSync(fullPath, content);
  }
  return dir;
}

describe("Framework Detector", () => {
  afterEach(() => {
    try { rmSync(TMP, { recursive: true }); } catch {}
  });

  test("detects Next.js", () => {
    const dir = setupProject({
      "next.config.js": "module.exports = {}",
      "package.json": JSON.stringify({ dependencies: { next: "14.0.0", react: "18.0.0" } }),
    });
    const info = detectFramework(dir);
    expect(info.name).toBe("nextjs");
    expect(info.version).toBe("14.0.0");
  });

  test("detects SvelteKit", () => {
    const dir = setupProject({
      "svelte.config.js": "export default {}",
      "package.json": JSON.stringify({ devDependencies: { "@sveltejs/kit": "2.0.0" } }),
    });
    const info = detectFramework(dir);
    expect(info.name).toBe("sveltekit");
  });

  test("detects Nuxt", () => {
    const dir = setupProject({
      "nuxt.config.ts": "export default {}",
      "package.json": JSON.stringify({ dependencies: { nuxt: "3.0.0" } }),
    });
    const info = detectFramework(dir);
    expect(info.name).toBe("nuxt");
  });

  test("detects Vue", () => {
    const dir = setupProject({
      "src/App.vue": "<template></template>",
      "package.json": JSON.stringify({ dependencies: { vue: "3.4.0" } }),
    });
    const info = detectFramework(dir);
    expect(info.name).toBe("vue");
  });

  test("detects React", () => {
    const dir = setupProject({
      "src/App.tsx": "export default function App() {}",
      "package.json": JSON.stringify({ dependencies: { react: "18.2.0" } }),
    });
    const info = detectFramework(dir);
    expect(info.name).toBe("react");
  });

  test("detects vanilla for unknown projects", () => {
    const dir = setupProject({
      "index.html": "<html></html>",
      "style.css": "body {}",
    });
    const info = detectFramework(dir);
    expect(info.name).toBe("vanilla");
  });

  test("detects UI framework (tailwind)", () => {
    const dir = setupProject({
      "tailwind.config.js": "module.exports = {}",
      "package.json": JSON.stringify({ devDependencies: { tailwindcss: "3.4.0" } }),
    });
    const info = detectFramework(dir);
    expect(info.uiFramework).toBe("tailwind");
  });

  test("returns complete FrameworkInfo", () => {
    const dir = setupProject({
      "next.config.js": "module.exports = {}",
      "tailwind.config.js": "module.exports = {}",
      "package.json": JSON.stringify({
        dependencies: { next: "14.0.0", react: "18.2.0" },
        devDependencies: { tailwindcss: "3.4.0" },
      }),
    });
    const info = detectFramework(dir);
    expect(info.name).toBe("nextjs");
    expect(info.uiFramework).toBe("tailwind");
  });
});
