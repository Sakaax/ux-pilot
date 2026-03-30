function val(answers: Map<string, string>, key: string, fallback = "Non renseigne"): string {
  return answers.get(key) ?? fallback;
}

export function generateBrief(answers: Map<string, string>): string {
  const lines: string[] = [];

  lines.push("# Brief UX");
  lines.push("");
  lines.push(`Date: ${new Date().toISOString().split("T")[0]}`);
  lines.push("");

  lines.push("## Produit");
  lines.push(`- Type : ${val(answers, "product_type")}`);
  lines.push(`- Probleme resolu : ${val(answers, "product_problem")}`);
  lines.push(`- Audience : ${val(answers, "product_audience")}`);
  lines.push(`- Stade : ${val(answers, "product_stage")}`);
  lines.push("");

  lines.push("## Utilisateurs");
  lines.push(`- Persona principal : ${val(answers, "user_persona")}`);
  lines.push(`- Canal d'acquisition : ${val(answers, "user_acquisition")}`);
  lines.push(`- Aha moment : ${val(answers, "user_aha_moment")}`);
  lines.push("");

  lines.push("## Business");
  lines.push(`- Funnel : ${val(answers, "business_funnel")}`);
  lines.push(`- Modele pricing : ${val(answers, "business_pricing")}`);
  lines.push(`- Nombre de plans : ${val(answers, "business_plans_count")}`);
  lines.push(`- Social proof : ${val(answers, "business_social_proof")}`);
  lines.push(`- Objectif conversion : ${val(answers, "business_conversion_goal")}`);
  lines.push(`- Point de friction : ${val(answers, "business_friction_point")}`);
  lines.push("");

  lines.push("## Flows critiques");
  lines.push(`- Premier ecran post-signup : ${val(answers, "flows_after_signup")}`);
  lines.push(`- Flows principaux : ${val(answers, "flows_critical")}`);
  lines.push(`- Flow paiement : ${val(answers, "flows_payment")}`);
  lines.push(`- Flow invitation : ${val(answers, "flows_invite")}`);
  lines.push(`- Notifications : ${val(answers, "flows_notifications")}`);
  lines.push("");

  lines.push("## Design");
  lines.push(`- Mood : ${val(answers, "design_mood")}`);
  lines.push(`- References : ${val(answers, "design_references")}`);
  lines.push(`- Mode : ${val(answers, "design_mode")}`);
  lines.push(`- Couleurs : ${val(answers, "design_colors")}`);
  lines.push("");

  lines.push("## SEO");
  lines.push(`- SEO organique : ${val(answers, "seo_organic")}`);
  lines.push(`- AEO : ${val(answers, "seo_aeo")}`);
  lines.push(`- Mots-cles : ${val(answers, "seo_keywords")}`);
  lines.push(`- Cible geo : ${val(answers, "seo_geo")}`);
  lines.push("");

  lines.push("## Technique");
  lines.push(`- Stack : ${val(answers, "tech_stack")}`);
  lines.push(`- UI framework : ${val(answers, "tech_ui_framework")}`);
  lines.push(`- Responsive : ${val(answers, "tech_responsive")}`);
  lines.push(`- PWA/Native : ${val(answers, "tech_pwa")}`);
  lines.push("");

  lines.push("## Retention");
  lines.push(`- Mecaniques : ${val(answers, "retention_mechanics")}`);
  lines.push(`- Gestion churn : ${val(answers, "retention_churn")}`);
  lines.push(`- Feedback : ${val(answers, "retention_feedback")}`);

  return lines.join("\n");
}
