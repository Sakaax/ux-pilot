import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const UX_PILOT_DIR = "ux-pilot";
const BRIEF_FILENAME = "ux-brief.md";
const GITIGNORE_ENTRY = "ux-pilot/";

function getBriefPath(projectDir: string): string {
  return join(projectDir, UX_PILOT_DIR, BRIEF_FILENAME);
}

function ensureDirectory(dirPath: string): void {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
}

export function writeBrief(projectDir: string, briefContent: string): void {
  const uxPilotDir = join(projectDir, UX_PILOT_DIR);
  ensureDirectory(uxPilotDir);

  const briefPath = getBriefPath(projectDir);
  writeFileSync(briefPath, briefContent, "utf-8");

  ensureGitignore(projectDir);
}

export function updateBriefSection(projectDir: string, sectionName: string, content: string): void {
  const briefPath = getBriefPath(projectDir);

  if (!existsSync(briefPath)) {
    throw new Error(`Brief file not found at ${briefPath}`);
  }

  const existingContent = readFileSync(briefPath, "utf-8");
  const sectionHeader = `## ${sectionName}`;
  const sectionIndex = existingContent.indexOf(sectionHeader);

  if (sectionIndex === -1) {
    throw new Error(`Section "${sectionName}" not found in brief`);
  }

  const afterHeader = sectionIndex + sectionHeader.length;
  const nextSectionIndex = existingContent.indexOf("\n## ", afterHeader);

  const before = existingContent.slice(0, afterHeader);
  const after = nextSectionIndex === -1
    ? ""
    : existingContent.slice(nextSectionIndex);

  const updatedContent = `${before}\n${content}${after}`;
  writeFileSync(briefPath, updatedContent, "utf-8");
}

export function ensureGitignore(projectDir: string): void {
  const gitignorePath = join(projectDir, ".gitignore");

  if (!existsSync(gitignorePath)) {
    writeFileSync(gitignorePath, `${GITIGNORE_ENTRY}\n`, "utf-8");
    return;
  }

  const currentContent = readFileSync(gitignorePath, "utf-8");
  const lines = currentContent.split("\n");
  const hasEntry = lines.some((line) => line.trim() === GITIGNORE_ENTRY);

  if (hasEntry) {
    return;
  }

  const separator = currentContent.endsWith("\n") ? "" : "\n";
  const updatedContent = `${currentContent}${separator}${GITIGNORE_ENTRY}\n`;
  writeFileSync(gitignorePath, updatedContent, "utf-8");
}
