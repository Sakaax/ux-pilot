# ux-pilot

> Your UX co-pilot — from idea to validated flow, in your terminal.

A Claude Code plugin that acts as a **senior UX designer**. It doesn't generate code blindly — it understands your product, challenges your choices, shows you the result in a live browser preview, and helps you iterate until the flow is validated.

## What makes it different

| Existing tools | ux-pilot |
|----------------|----------|
| Generate code directly | Dialogue first, code after |
| One-shot output | Iterative, named versions |
| Landing pages mostly | Full apps (dashboards, CRUD, onboarding...) |
| No live preview | Local server with hot reload |
| Few/no UX rules | 376 rules loaded on-demand |
| Loads everything in context | Token-efficient (rules loaded per screen) |

## 4 Phases

### Phase 1 — Discovery
The plugin asks you questions one at a time (ABCD choices + free text). It understands your product, users, business model, flows, design preferences, and SEO needs. Output: a structured **UX Brief**.

### Phase 2 — Audit
If you have existing code, the plugin scans it and produces a **scored audit report** (XX/100) with findings grouped by severity (critical, high, medium, low). Each finding references the violated rule and suggests a fix.

### Phase 3 — Preview
The plugin opens a **local server** and generates your screens in vanilla HTML/CSS. For each screen, it proposes 2-3 **named versions** (not V1/V2/V3 — descriptive names like "Classic", "Bold", "Minimal"). You approve, reject, or comment. Hot reload via SSE.

### Phase 4 — Export
Generates a complete **UX spec** in markdown. Optionally converts approved screens to **React, Svelte, or Vue** components.

## 376 UX Rules

Rules are organized in 6 categories, loaded on-demand (never all at once):

| Category | Rules | Content |
|----------|-------|---------|
| UX Patterns | 10 files | Accessibility, touch, forms, navigation, layout, typography, animation, empty states, tables, charts |
| Conversion & Funnel | 7 files | CTA, pricing, signup, checkout, retention, churn prevention, 34 landing patterns |
| SEO & AEO | 5 files | Structure, meta/OG, performance, schema.org, AI citation optimization |
| Psychology | 4 files | Social proof, cognitive load, trust, ethical persuasion |
| Aesthetics | 4 files | Anti "AI slop" patterns, typography craft, backgrounds, 67 UI styles |
| Product Type | 1 file | 30 product-type specific recommendations |

## Data

| Dataset | Count | Content |
|---------|-------|---------|
| Color palettes | 161 | Industry-specific palettes with primary, accent, background, surface, text |
| Font pairings | 57 | Google Fonts pairs with mood tags and import URLs |
| UI styles | 67 | Style descriptions with use cases, avoid scenarios, CSS hints |
| Product types | 30 | Landing patterns, recommended styles, color focus, anti-patterns |

## Installation

```bash
# From GitHub
claude plugin add Sakaax/ux-pilot
```

## Usage

```bash
/ux-pilot              # Full flow (Discovery → Audit → Preview → Export)
/ux-pilot audit        # Scan existing code for UX issues
/ux-pilot preview      # Open preview server
/ux-pilot export       # Generate UX spec
```

## Tech Stack

- **TypeScript** — Type-safe codebase
- **Bun** — Runtime + test runner (Node.js fallback)
- **Vanilla HTML/CSS** — Zero-dependency preview
- **SSE** — Hot reload without WebSocket overhead

## Project Structure

```
ux-pilot/
├── skills/ux-pilot.md        # Claude Code skill entry point
├── rules/                    # 376 UX rules in 31 markdown files
├── data/                     # Palettes, fonts, styles, product-types (JSON)
├── src/
│   ├── discovery/            # Questions, router, brief generator
│   ├── audit/                # Framework detector, scanner, report
│   ├── preview/              # HTTP server, SSE, file watcher, toolbar
│   ├── rules/                # On-demand context-based rule loader
│   ├── data/                 # Palette/font/style/product-type lookup
│   └── export/               # Spec generator, component converter
├── templates/                # Preview shell + 10 screen templates
├── hooks/                    # PostToolUse UX check hook
└── tests/                    # 77 tests
```

## Anti "AI Slop"

The plugin actively fights generic AI-generated aesthetics:

- **Banned fonts**: Inter, Roboto, Arial, system fonts
- **Banned patterns**: Purple gradients on white, cookie-cutter layouts
- **Instead**: Distinctive fonts, weight extremes (100 vs 900), 3x+ size jumps, gradient meshes, noise textures

## Credits

Rules enriched from:
- [ui-ux-pro-max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) (MIT) — 99 UX guidelines, styles, palettes, font pairings
- [frontend-design](https://github.com/anthropics/claude-cookbooks) (Anthropic) — Design principles, anti-patterns
- WCAG 2.1, Nielsen Norman Group, Laws of UX

## License

MIT
