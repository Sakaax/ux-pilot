import type { Finding, Severity, FindingCategory } from "./scanner";
import type { FrameworkInfo } from "./framework-detector";

const SEVERITY_WEIGHT: Record<Severity, number> = {
  critical: 15,
  high: 8,
  medium: 3,
  low: 1,
};

const MOBILE_SEVERITY_MULTIPLIER = 1.5;

const SEVERITY_ORDER: readonly Severity[] = ["critical", "high", "medium", "low"] as const;

const SEVERITY_COLORS: Record<Severity, { bg: string; text: string; border: string }> = {
  critical: { bg: "#2D1215", text: "#EF4444", border: "#991B1B" },
  high:     { bg: "#2D1F0E", text: "#F97316", border: "#9A3412" },
  medium:   { bg: "#2D2A0E", text: "#FBBF24", border: "#92400E" },
  low:      { bg: "#0E1F2D", text: "#3B82F6", border: "#1E3A5F" },
};

const SEVERITY_LABELS: Record<Severity, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

function calculateScore(findings: readonly Finding[], filesScanned: number): number {
  if (filesScanned === 0) return 100;

  const totalPenalty = findings.reduce(
    (sum, f) => {
      const weight = SEVERITY_WEIGHT[f.severity];
      const multiplier = f.category === "mobile" ? MOBILE_SEVERITY_MULTIPLIER : 1;
      return sum + weight * multiplier;
    },
    0,
  );

  const maxPenalty = filesScanned * 30;
  const rawScore = Math.max(0, Math.round(100 - (totalPenalty / maxPenalty) * 100));
  return Math.min(100, rawScore);
}

function groupBySeverity(findings: readonly Finding[]): Record<Severity, readonly Finding[]> {
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

function countByCategory(findings: readonly Finding[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const f of findings) {
    counts[f.category] = (counts[f.category] ?? 0) + 1;
  }
  return counts;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getScoreColor(score: number): string {
  if (score >= 80) return "#22C55E";
  if (score >= 60) return "#FBBF24";
  if (score >= 40) return "#F97316";
  return "#EF4444";
}

function renderScreenshot(finding: Finding): string {
  if (!finding.screenshot) return "";

  const escapedPath = escapeHtml(finding.screenshot);
  const colors = SEVERITY_COLORS[finding.severity];

  return `
      <div class="finding-screenshot">
        <a href="${escapedPath}" target="_blank" rel="noopener noreferrer">
          <img src="${escapedPath}" alt="Screenshot for: ${escapeHtml(finding.message)}" style="max-height: 200px; border-radius: 8px; border: 1px solid ${colors.border}; cursor: pointer;">
        </a>
      </div>`;
}

function renderFinding(finding: Finding, index: number, total: number): string {
  const colors = SEVERITY_COLORS[finding.severity];
  const escapedFixPrompt = escapeHtml(finding.fixPrompt);

  return `
    <div class="finding" style="border-left: 3px solid ${colors.border}; background: ${colors.bg};">
      <div class="finding-header">
        <span class="finding-index">${index + 1}/${total}</span>
        <span class="severity-badge severity-${finding.severity}" style="color: ${colors.text}; border-color: ${colors.border};">
          ${SEVERITY_LABELS[finding.severity]}
        </span>
        <span class="finding-file">${escapeHtml(finding.file)}</span>
      </div>
      <p class="finding-message">${escapeHtml(finding.message)}</p>
      <p class="finding-rule"><strong>Rule:</strong> ${escapeHtml(finding.rule)}</p>${renderScreenshot(finding)}
      <div class="fix-prompt-block">
        <div class="fix-prompt-header">
          <span class="fix-prompt-label">Paste this into Claude Code to fix</span>
          <button class="copy-btn" data-prompt-id="prompt-${index}" onclick="copyPrompt(this, 'prompt-${index}')">
            Copy
          </button>
        </div>
        <pre class="fix-prompt-code" id="prompt-${index}">${escapedFixPrompt}</pre>
      </div>
    </div>`;
}

function renderSeveritySection(severity: Severity, findings: readonly Finding[], startIndex: number, totalFindings: number): string {
  const colors = SEVERITY_COLORS[severity];
  const label = SEVERITY_LABELS[severity];

  return `
    <section class="severity-section">
      <h2 class="severity-title" style="color: ${colors.text};">
        ${label}
        <span class="severity-count">${findings.length}</span>
      </h2>
      ${findings.length === 0
        ? '<p class="no-findings">No issues found.</p>'
        : findings.map((f, i) => renderFinding(f, startIndex + i, totalFindings)).join("\n")}
    </section>`;
}

function renderCategoryBar(category: string, count: number, maxCount: number): string {
  const widthPercent = maxCount > 0 ? Math.round((count / maxCount) * 100) : 0;
  return `
    <div class="category-row">
      <span class="category-name">${escapeHtml(category)}</span>
      <div class="category-bar-track">
        <div class="category-bar-fill" style="width: ${widthPercent}%;"></div>
      </div>
      <span class="category-count">${count}</span>
    </div>`;
}

function renderSummary(findings: readonly Finding[]): string {
  const categoryCounts = countByCategory(findings);
  const entries = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);
  const maxCount = entries.length > 0 ? entries[0][1] : 0;

  if (entries.length === 0) {
    return `
      <section class="summary-section">
        <h2 class="section-title">Summary</h2>
        <p class="no-findings">No issues found. Your project looks great!</p>
      </section>`;
  }

  return `
    <section class="summary-section">
      <h2 class="section-title">Summary</h2>
      <div class="category-breakdown">
        ${entries.map(([cat, count]) => renderCategoryBar(cat, count, maxCount)).join("\n")}
      </div>
    </section>`;
}

export function generateHtmlAuditReport(
  findings: readonly Finding[],
  framework: FrameworkInfo,
  filesScanned: number,
): string {
  const score = calculateScore(findings, filesScanned);
  const scoreColor = getScoreColor(score);
  const groups = groupBySeverity(findings);
  const dateStr = new Date().toISOString().split("T")[0];

  const totalFindings = findings.length;
  let findingIndex = 0;
  const severitySections = SEVERITY_ORDER.map((sev) => {
    const section = renderSeveritySection(sev, groups[sev], findingIndex, totalFindings);
    findingIndex += groups[sev].length;
    return section;
  }).join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>UX Pilot Audit Report</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Newsreader:opsz,wght@6..72,400;6..72,600&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Space Grotesk', sans-serif;
      background: #0F0E0C;
      color: #E8E0D6;
      line-height: 1.6;
      min-height: 100vh;
      padding: 2rem 1rem;
    }

    .container {
      max-width: 900px;
      margin: 0 auto;
    }

    h1, h2, h3 {
      font-family: 'Newsreader', serif;
    }

    code, pre, .fix-prompt-code {
      font-family: 'JetBrains Mono', monospace;
    }

    /* Header */
    .report-header {
      text-align: center;
      margin-bottom: 3rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid #2A2723;
    }

    .report-header h1 {
      font-size: 2.25rem;
      color: #D4622A;
      margin-bottom: 0.5rem;
      letter-spacing: -0.02em;
    }

    .report-meta {
      color: #8A8279;
      font-size: 0.875rem;
    }

    .report-meta span {
      margin: 0 0.5rem;
    }

    /* Score */
    .score-section {
      display: flex;
      justify-content: center;
      margin-bottom: 3rem;
    }

    .score-card {
      text-align: center;
      background: #1A1916;
      border: 1px solid #2A2723;
      border-radius: 12px;
      padding: 2rem 3rem;
    }

    .score-value {
      font-family: 'Newsreader', serif;
      font-size: 4rem;
      font-weight: 600;
      line-height: 1;
    }

    .score-label {
      font-size: 0.875rem;
      color: #8A8279;
      margin-top: 0.25rem;
    }

    .corrections-total {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem;
      color: #D4622A;
      margin-top: 0.5rem;
    }

    .finding-index {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.7rem;
      color: #8A8279;
      background: #12110F;
      padding: 0.125rem 0.5rem;
      border-radius: 4px;
    }

    .back-to-top {
      text-align: center;
      margin-top: 3rem;
      padding-top: 1.5rem;
      border-top: 1px solid #2A2723;
    }

    .back-to-top a {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.85rem;
      color: #D4622A;
      text-decoration: none;
    }

    .back-to-top a:hover {
      text-decoration: underline;
    }

    /* Severity sections */
    .severity-section {
      margin-bottom: 2rem;
    }

    .severity-title {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .severity-count {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.875rem;
      background: #1A1916;
      border-radius: 9999px;
      padding: 0.125rem 0.625rem;
      color: #8A8279;
    }

    .no-findings {
      color: #5A554F;
      font-style: italic;
      padding: 0.5rem 0;
    }

    /* Individual finding */
    .finding {
      background: #1A1916;
      border-radius: 8px;
      padding: 1.25rem;
      margin-bottom: 0.75rem;
    }

    .finding-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.5rem;
      flex-wrap: wrap;
    }

    .severity-badge {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border: 1px solid;
      border-radius: 4px;
      padding: 0.125rem 0.5rem;
    }

    .finding-file {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem;
      color: #8A8279;
    }

    .finding-message {
      font-size: 0.95rem;
      margin-bottom: 0.375rem;
    }

    .finding-rule {
      font-size: 0.8rem;
      color: #6A655F;
      margin-bottom: 0.75rem;
    }

    /* Fix prompt block */
    .fix-prompt-block {
      background: #12110F;
      border: 1px solid #2A2723;
      border-radius: 6px;
      overflow: hidden;
    }

    .fix-prompt-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.375rem 0.75rem;
      background: #1A1916;
      border-bottom: 1px solid #2A2723;
    }

    .fix-prompt-label {
      font-size: 0.75rem;
      color: #6A655F;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .copy-btn {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.75rem;
      background: transparent;
      color: #D4622A;
      border: 1px solid #D4622A;
      border-radius: 4px;
      padding: 0.125rem 0.5rem;
      cursor: pointer;
      transition: background 0.15s, color 0.15s;
    }

    .copy-btn:hover {
      background: #D4622A;
      color: #0F0E0C;
    }

    .fix-prompt-code {
      padding: 0.75rem;
      font-size: 0.8rem;
      color: #C4BAB0;
      white-space: pre-wrap;
      word-break: break-word;
      line-height: 1.5;
    }

    /* Summary section */
    .summary-section {
      margin-top: 3rem;
      padding-top: 2rem;
      border-top: 1px solid #2A2723;
    }

    .section-title {
      font-size: 1.5rem;
      color: #D4622A;
      margin-bottom: 1.25rem;
    }

    .category-breakdown {
      display: flex;
      flex-direction: column;
      gap: 0.625rem;
    }

    .category-row {
      display: grid;
      grid-template-columns: 120px 1fr 40px;
      align-items: center;
      gap: 0.75rem;
    }

    .category-name {
      font-size: 0.875rem;
      color: #C4BAB0;
      text-transform: capitalize;
    }

    .category-bar-track {
      height: 8px;
      background: #1A1916;
      border-radius: 4px;
      overflow: hidden;
    }

    .category-bar-fill {
      height: 100%;
      background: #D4622A;
      border-radius: 4px;
      transition: width 0.3s ease;
    }

    .category-count {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem;
      color: #8A8279;
      text-align: right;
    }

    /* Responsive */
    @media (max-width: 600px) {
      body {
        padding: 1rem 0.5rem;
      }

      .report-header h1 {
        font-size: 1.75rem;
      }

      .score-value {
        font-size: 3rem;
      }

      .score-card {
        padding: 1.5rem 2rem;
      }

      .category-row {
        grid-template-columns: 90px 1fr 32px;
      }
    }
  </style>
</head>
<body>
  <div class="container" id="top">
    <header class="report-header">
      <h1>UX Pilot Audit Report</h1>
      <p class="report-meta">
        <span>${dateStr}</span> &middot;
        <span>${escapeHtml(framework.name)}${framework.version ? ` v${escapeHtml(framework.version)}` : ""}</span>
        ${framework.uiFramework ? `&middot; <span>${escapeHtml(framework.uiFramework)}</span>` : ""}
        &middot; <span>${filesScanned} files scanned</span>
      </p>
    </header>

    <div class="score-section">
      <div class="score-card">
        <div class="score-value" style="color: ${scoreColor};">
          ${score} / 100
        </div>
        <p class="score-label">Overall UX Score</p>
        <p class="corrections-total">${totalFindings} corrections</p>
      </div>
    </div>

    ${severitySections}

    ${renderSummary(findings)}

    <div class="back-to-top">
      <a href="#top">Back to top</a>
    </div>
  </div>

  <script>
    function copyPrompt(button, id) {
      var el = document.getElementById(id);
      if (!el) return;
      var text = el.textContent || '';
      navigator.clipboard.writeText(text).then(function() {
        button.textContent = 'Copied!';
        setTimeout(function() { button.textContent = 'Copy'; }, 1500);
      }).catch(function() {
        // Fallback for older browsers
        var range = document.createRange();
        range.selectNodeContents(el);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        document.execCommand('copy');
        sel.removeAllRanges();
        button.textContent = 'Copied!';
        setTimeout(function() { button.textContent = 'Copy'; }, 1500);
      });
    }
  </script>
</body>
</html>`;
}
