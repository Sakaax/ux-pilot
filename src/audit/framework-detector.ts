import { existsSync, readFileSync, readdirSync } from "fs";
import { resolve } from "path";

export interface FrameworkInfo {
  name: "nextjs" | "sveltekit" | "nuxt" | "vue" | "react" | "vanilla";
  version: string | null;
  uiFramework: "tailwind" | "shadcn" | "material" | "custom" | null;
}

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

function readPackageJson(dir: string): PackageJson | null {
  const pkgPath = resolve(dir, "package.json");
  if (!existsSync(pkgPath)) return null;
  const content = readFileSync(pkgPath, "utf-8");
  return JSON.parse(content) as PackageJson;
}

function getDep(pkg: PackageJson | null, name: string): string | null {
  if (!pkg) return null;
  return pkg.dependencies?.[name] ?? pkg.devDependencies?.[name] ?? null;
}

function hasFile(dir: string, ...paths: string[]): boolean {
  return paths.some((p) => existsSync(resolve(dir, p)));
}

function hasFileWithExt(dir: string, dirPath: string, ext: string): boolean {
  const fullDir = resolve(dir, dirPath);
  if (!existsSync(fullDir)) return false;
  try {
    const files = readdirSync(fullDir, { recursive: true }) as string[];
    return files.some((f) => f.toString().endsWith(ext));
  } catch {
    return false;
  }
}

function detectName(dir: string, pkg: PackageJson | null): FrameworkInfo["name"] {
  // Next.js
  if (hasFile(dir, "next.config.js", "next.config.ts", "next.config.mjs") || getDep(pkg, "next")) {
    return "nextjs";
  }

  // SvelteKit
  if (hasFile(dir, "svelte.config.js", "svelte.config.ts") || getDep(pkg, "@sveltejs/kit")) {
    return "sveltekit";
  }

  // Nuxt
  if (hasFile(dir, "nuxt.config.ts", "nuxt.config.js") || getDep(pkg, "nuxt")) {
    return "nuxt";
  }

  // Vue
  if (hasFile(dir, "vue.config.js") || getDep(pkg, "vue") || hasFileWithExt(dir, "src", ".vue")) {
    return "vue";
  }

  // React
  if (getDep(pkg, "react") || hasFileWithExt(dir, "src", ".tsx") || hasFileWithExt(dir, "src", ".jsx")) {
    return "react";
  }

  return "vanilla";
}

function detectUIFramework(dir: string, pkg: PackageJson | null): FrameworkInfo["uiFramework"] {
  if (hasFile(dir, "tailwind.config.js", "tailwind.config.ts") || getDep(pkg, "tailwindcss")) {
    return "tailwind";
  }

  if (getDep(pkg, "@shadcn/ui") || hasFile(dir, "components.json")) {
    return "shadcn";
  }

  if (getDep(pkg, "@mui/material") || getDep(pkg, "@material-ui/core")) {
    return "material";
  }

  return null;
}

function detectVersion(pkg: PackageJson | null, framework: FrameworkInfo["name"]): string | null {
  if (!pkg) return null;

  const depMap: Record<string, string> = {
    nextjs: "next",
    sveltekit: "@sveltejs/kit",
    nuxt: "nuxt",
    vue: "vue",
    react: "react",
    vanilla: "",
  };

  const dep = depMap[framework];
  if (!dep) return null;

  return getDep(pkg, dep);
}

export function detectFramework(dir: string): FrameworkInfo {
  const pkg = readPackageJson(dir);
  const name = detectName(dir, pkg);
  const version = detectVersion(pkg, name);
  const uiFramework = detectUIFramework(dir, pkg);

  return { name, version, uiFramework };
}
