import { describe, expect, test } from "bun:test";
import { generateBrief } from "../../src/discovery/brief-generator";

describe("Brief Generator", () => {
  const sampleAnswers = new Map<string, string>([
    ["product_type", "saas"],
    ["product_problem", "Project management is too complex"],
    ["product_audience", "b2b"],
    ["product_stage", "mvp"],
    ["user_persona", "professionals"],
    ["user_acquisition", "seo"],
    ["user_aha_moment", "When they see their first kanban board auto-organized"],
    ["business_funnel", "yes_clear"],
    ["business_pricing", "freemium"],
    ["business_plans_count", "2-3"],
    ["business_social_proof", "some"],
    ["business_conversion_goal", "signup"],
    ["business_friction_point", "activation"],
    ["flows_after_signup", "onboarding"],
    ["flows_critical", "signup, create project, invite team"],
    ["flows_payment", "in_app"],
    ["flows_invite", "both"],
    ["flows_notifications", "multi"],
    ["design_mood", "minimal"],
    ["design_references", "Linear, Notion"],
    ["design_mode", "both"],
    ["design_colors", "suggest"],
    ["seo_organic", "priority"],
    ["seo_aeo", "bonus"],
    ["seo_keywords", "project management, team collaboration"],
    ["seo_geo", "en"],
    ["tech_stack", "react"],
    ["tech_ui_framework", "tailwind"],
    ["tech_responsive", "mobile_first"],
    ["tech_pwa", "web"],
    ["retention_mechanics", "progress"],
    ["retention_churn", "downgrade"],
    ["retention_feedback", "widget"],
  ]);

  test("generates valid markdown with all sections", () => {
    const brief = generateBrief(sampleAnswers);
    expect(brief).toContain("# Brief UX");
    expect(brief).toContain("## Produit");
    expect(brief).toContain("## Utilisateurs");
    expect(brief).toContain("## Business");
    expect(brief).toContain("## Flows critiques");
    expect(brief).toContain("## Design");
    expect(brief).toContain("## SEO");
    expect(brief).toContain("## Technique");
    expect(brief).toContain("## Retention");
  });

  test("includes answer values in output", () => {
    const brief = generateBrief(sampleAnswers);
    expect(brief).toContain("saas");
    expect(brief).toContain("freemium");
    expect(brief).toContain("Linear, Notion");
  });

  test("handles missing optional answers gracefully", () => {
    const minimal = new Map<string, string>([
      ["product_type", "tool"],
      ["product_problem", "A simple utility"],
    ]);
    const brief = generateBrief(minimal);
    expect(brief).toContain("# Brief UX");
    expect(brief).toContain("tool");
    // Should not crash, missing fields show fallback
    expect(brief).toContain("Non renseigne");
  });

  test("includes date", () => {
    const brief = generateBrief(sampleAnswers);
    const today = new Date().toISOString().split("T")[0];
    expect(brief).toContain(today);
  });
});
