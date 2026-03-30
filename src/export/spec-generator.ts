export interface DesignDecision {
  decision: string;
  choice: string;
  reason: string;
}

export interface ScreenEntry {
  name: string;
  version: string;
  rules: string[];
}

export interface SpecInput {
  projectName: string;
  brief: string;
  decisions: DesignDecision[];
  screens: ScreenEntry[];
}

export function generateSpec(input: SpecInput): string {
  const { projectName, brief, decisions, screens } = input;
  const date = new Date().toISOString().split("T")[0];
  const lines: string[] = [];

  lines.push(`# UX Spec — ${projectName}`);
  lines.push(`Date: ${date}`);
  lines.push("");

  lines.push("## Brief");
  lines.push("");
  lines.push(brief);
  lines.push("");

  lines.push("## Flow valide");
  lines.push("");
  for (const screen of screens) {
    lines.push(`### ${screen.name}`);
    lines.push(`- Version choisie : "${screen.version}"`);
    lines.push(`- Rules UX appliquees : ${screen.rules.join(", ")}`);
    lines.push("");
  }

  lines.push("## Decisions de design");
  lines.push("");
  lines.push("| Decision | Choix | Raison |");
  lines.push("|----------|-------|--------|");
  for (const d of decisions) {
    lines.push(`| ${d.decision} | ${d.choice} | ${d.reason} |`);
  }
  lines.push("");

  return lines.join("\n");
}
