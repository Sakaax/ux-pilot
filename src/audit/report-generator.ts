import type { Finding, Severity } from "./scanner";
import type { FrameworkInfo } from "./framework-detector";

const SEVERITY_WEIGHT: Record<Severity, number> = {
  critical: 15,
  high: 8,
  medium: 3,
  low: 1,
};

function calculateScore(findings: Finding[], filesScanned: number): number {
  if (filesScanned === 0) return 100;

  const totalPenalty = findings.reduce(
    (sum, f) => sum + SEVERITY_WEIGHT[f.severity],
    0
  );

  const maxPenalty = filesScanned * 30;
  const score = Math.max(0, Math.round(100 - (totalPenalty / maxPenalty) * 100));
  return Math.min(100, score);
}

function groupBySeverity(findings: Finding[]): Record<Severity, Finding[]> {
  const groups: Record<Severity, Finding[]> = {
    critical: [],
    high: [],
    medium: [],
    low: [],
  };

  for (const f of findings) {
    groups[f.severity].push(f);
  }

  return groups;
}

export function generateAuditReport(
  findings: Finding[],
  framework: FrameworkInfo,
  filesScanned: number,
): string {
  const score = calculateScore(findings, filesScanned);
  const groups = groupBySeverity(findings);
  const lines: string[] = [];

  lines.push("# UX Audit Report");
  lines.push("");
  lines.push(`Date: ${new Date().toISOString().split("T")[0]}`);
  lines.push(`Framework: ${framework.name}${framework.version ? ` v${framework.version}` : ""}`);
  if (framework.uiFramework) {
    lines.push(`UI Framework: ${framework.uiFramework}`);
  }
  lines.push(`Files scanned: ${filesScanned}`);
  lines.push("");

  lines.push(`## Score global : ${score}/100`);
  lines.push("");

  // Critical
  lines.push(`### Critical (${groups.critical.length})`);
  lines.push("");
  if (groups.critical.length === 0) {
    lines.push("Aucun probleme critique.");
  } else {
    for (const f of groups.critical) {
      lines.push(`- **${f.message}** — ${f.file} — Rule: ${f.rule}`);
    }
  }
  lines.push("");

  // High
  lines.push(`### High (${groups.high.length})`);
  lines.push("");
  if (groups.high.length === 0) {
    lines.push("Aucun probleme majeur.");
  } else {
    for (const f of groups.high) {
      lines.push(`- **${f.message}** — ${f.file} — Rule: ${f.rule}`);
    }
  }
  lines.push("");

  // Medium
  lines.push(`### Medium (${groups.medium.length})`);
  lines.push("");
  if (groups.medium.length === 0) {
    lines.push("Aucun probleme moyen.");
  } else {
    for (const f of groups.medium) {
      lines.push(`- ${f.message} — ${f.file} — Rule: ${f.rule}`);
    }
  }
  lines.push("");

  // Low
  lines.push(`### Low (${groups.low.length})`);
  lines.push("");
  if (groups.low.length === 0) {
    lines.push("Aucune suggestion mineure.");
  } else {
    for (const f of groups.low) {
      lines.push(`- ${f.message} — ${f.file} — Rule: ${f.rule}`);
    }
  }
  lines.push("");

  // Recommendations
  const prioritized = [...groups.critical, ...groups.high].slice(0, 5);
  if (prioritized.length > 0) {
    lines.push("### Recommandations prioritaires");
    lines.push("");
    for (let i = 0; i < prioritized.length; i++) {
      lines.push(`${i + 1}. ${prioritized[i].message} (${prioritized[i].severity})`);
    }
  }

  return lines.join("\n");
}
