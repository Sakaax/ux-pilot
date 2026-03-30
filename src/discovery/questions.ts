export interface Choice {
  label: string;
  value: string;
  isFreeText?: boolean;
}

export interface Question {
  id: string;
  text: string;
  category: Category;
  choices: Choice[];
  /** Question IDs that, if answered with specific values, skip this question */
  skipIf?: { questionId: string; values: string[] }[];
}

export type Category =
  | "product"
  | "users"
  | "business"
  | "flows"
  | "design"
  | "seo"
  | "technical"
  | "retention";

function freeText(label = "Autre (tape ta reponse)"): Choice {
  return { label, value: "__free_text__", isFreeText: true };
}

const questions: Question[] = [
  // === PRODUCT ===
  {
    id: "product_type",
    text: "C'est quoi ton produit ?",
    category: "product",
    choices: [
      { label: "A) SaaS / App web", value: "saas" },
      { label: "B) Marketplace", value: "marketplace" },
      { label: "C) Tool / Utility", value: "tool" },
      { label: "D) App mobile", value: "mobile_app" },
      freeText(),
    ],
  },
  {
    id: "product_problem",
    text: "Quel probleme tu resous ?",
    category: "product",
    choices: [freeText("Decris le probleme")],
  },
  {
    id: "product_audience",
    text: "C'est pour qui ?",
    category: "product",
    choices: [
      { label: "A) B2B (entreprises)", value: "b2b" },
      { label: "B) B2C (grand public)", value: "b2c" },
      { label: "C) B2B2C (les deux)", value: "b2b2c" },
      { label: "D) Developpeurs / technique", value: "developers" },
      freeText(),
    ],
  },
  {
    id: "product_stage",
    text: "Ou en est le produit ?",
    category: "product",
    choices: [
      { label: "A) Idee — rien n'existe encore", value: "idea" },
      { label: "B) MVP — quelques features de base", value: "mvp" },
      { label: "C) Produit existant — on ameliore", value: "existing" },
      { label: "D) Refonte complete", value: "redesign" },
      freeText(),
    ],
  },
  // === USERS ===
  {
    id: "user_persona",
    text: "Qui est ton utilisateur principal ?",
    category: "users",
    choices: [
      { label: "A) Grand public non-technique", value: "general" },
      { label: "B) Professionnels (marketing, sales, ops)", value: "professionals" },
      { label: "C) Developpeurs / tech-savvy", value: "developers" },
      { label: "D) Decision-makers (CEO, managers)", value: "decision_makers" },
      freeText("E) Autre (decris ton persona)"),
    ],
  },
  {
    id: "user_acquisition",
    text: "Comment il decouvre ton produit ?",
    category: "users",
    choices: [
      { label: "A) Recherche Google / SEO", value: "seo" },
      { label: "B) Bouche a oreille / referral", value: "referral" },
      { label: "C) Reseaux sociaux / ads", value: "social_ads" },
      { label: "D) Product Hunt / Hacker News", value: "product_hunt" },
      { label: "E) Direct / outbound sales", value: "outbound" },
      freeText("F) Autre"),
    ],
  },
  {
    id: "user_aha_moment",
    text: 'Quel est le "aha moment" ? (le moment ou il comprend la valeur)',
    category: "users",
    choices: [freeText("Decris le moment")],
  },
  // === BUSINESS ===
  {
    id: "business_funnel",
    text: "Tu as un funnel defini ?",
    category: "business",
    choices: [
      { label: "A) Oui, avec des etapes claires", value: "yes_clear" },
      { label: "B) En partie, mais pas optimise", value: "partial" },
      { label: "C) Non, pas encore", value: "no" },
      { label: "D) Pas applicable (tool gratuit, open source)", value: "na" },
      freeText(),
    ],
  },
  {
    id: "business_pricing",
    text: "Modele de pricing ?",
    category: "business",
    choices: [
      { label: "A) Freemium (gratuit + plans payants)", value: "freemium" },
      { label: "B) Free trial puis payant", value: "trial" },
      { label: "C) One-shot payment", value: "one_shot" },
      { label: "D) Subscription mensuelle/annuelle", value: "subscription" },
      { label: "E) Gratuit / open source", value: "free" },
      { label: "F) Pas encore decide", value: "undecided" },
      freeText("G) Autre"),
    ],
  },
  {
    id: "business_plans_count",
    text: "Combien de plans de pricing ?",
    category: "business",
    skipIf: [{ questionId: "business_pricing", values: ["free", "one_shot"] }],
    choices: [
      { label: "A) 1 seul (simple)", value: "1" },
      { label: "B) 2-3 plans (classique)", value: "2-3" },
      { label: "C) 4+ plans", value: "4+" },
      { label: "D) Custom / sur devis", value: "custom" },
      freeText("E) Autre"),
    ],
  },
  {
    id: "business_social_proof",
    text: "Tu as du social proof ?",
    category: "business",
    choices: [
      { label: "A) Oui — temoignages, logos clients, metrics", value: "yes" },
      { label: "B) Un peu — quelques reviews/feedbacks", value: "some" },
      { label: "C) Non, pas encore", value: "no" },
      { label: "D) Pas applicable", value: "na" },
      freeText(),
    ],
  },
  {
    id: "business_conversion_goal",
    text: "Quel est ton objectif de conversion principal ?",
    category: "business",
    choices: [
      { label: "A) Signup / creation de compte", value: "signup" },
      { label: "B) Achat / paiement", value: "purchase" },
      { label: "C) Download / installation", value: "download" },
      { label: "D) Prise de contact / demo", value: "contact" },
      freeText("E) Autre"),
    ],
  },
  {
    id: "business_friction_point",
    text: "Ou tu perds le plus de gens dans le funnel ?",
    category: "business",
    skipIf: [{ questionId: "business_funnel", values: ["no", "na"] }],
    choices: [
      { label: "A) Landing → Signup (acquisition)", value: "acquisition" },
      { label: "B) Signup → Activation (onboarding)", value: "activation" },
      { label: "C) Activation → Retention (usage regulier)", value: "retention" },
      { label: "D) Retention → Revenue (conversion payante)", value: "revenue" },
      { label: "E) Je sais pas encore", value: "unknown" },
      freeText("F) Autre"),
    ],
  },
  // === FLOWS ===
  {
    id: "flows_after_signup",
    text: "Quel est le premier ecran apres signup ?",
    category: "flows",
    choices: [
      { label: "A) Dashboard / home", value: "dashboard" },
      { label: "B) Onboarding / setup wizard", value: "onboarding" },
      { label: "C) Tutoriel / walkthrough", value: "tutorial" },
      { label: "D) Directement dans le produit", value: "direct" },
      freeText("E) Autre"),
    ],
  },
  {
    id: "flows_critical",
    text: "Quels sont les 3 flows les plus importants de ton app ?",
    category: "flows",
    choices: [freeText('Ex: "signup, creer un projet, inviter un membre"')],
  },
  {
    id: "flows_payment",
    text: "T'as un flow de paiement ?",
    category: "flows",
    choices: [
      { label: "A) Oui, dans l'app (Stripe, etc.)", value: "in_app" },
      { label: "B) Oui, mais externe (redirection)", value: "external" },
      { label: "C) Non, pas encore", value: "no" },
      { label: "D) Pas applicable", value: "na" },
      freeText(),
    ],
  },
  {
    id: "flows_invite",
    text: "T'as un flow d'invitation / sharing ?",
    category: "flows",
    choices: [
      { label: "A) Invite par email", value: "email" },
      { label: "B) Lien de partage", value: "link" },
      { label: "C) Les deux", value: "both" },
      { label: "D) Non, pas prevu", value: "no" },
      freeText("E) Autre"),
    ],
  },
  {
    id: "flows_notifications",
    text: "T'as un systeme de notifications ?",
    category: "flows",
    choices: [
      { label: "A) In-app seulement", value: "in_app" },
      { label: "B) Email", value: "email" },
      { label: "C) Push notifications", value: "push" },
      { label: "D) Plusieurs canaux", value: "multi" },
      { label: "E) Non, pas encore", value: "no" },
      freeText("F) Autre"),
    ],
  },
  // === DESIGN ===
  {
    id: "design_mood",
    text: "Quel mood pour ton produit ?",
    category: "design",
    choices: [
      { label: "A) Pro / corporate — serieux, clean", value: "pro" },
      { label: "B) Fun / playful — colore, dynamique", value: "fun" },
      { label: "C) Minimal / zen — epure, calme", value: "minimal" },
      { label: "D) Dense / powerful — beaucoup d'info", value: "dense" },
      { label: "E) Bold / disruptif — original, impactant", value: "bold" },
      freeText("F) Autre (decris)"),
    ],
  },
  {
    id: "design_references",
    text: "Des apps/sites dont tu aimes le design ? (references)",
    category: "design",
    choices: [freeText('Ex: "Linear, Notion, Stripe"')],
  },
  {
    id: "design_mode",
    text: "Dark mode, light mode ?",
    category: "design",
    choices: [
      { label: "A) Light mode seulement", value: "light" },
      { label: "B) Dark mode seulement", value: "dark" },
      { label: "C) Les deux (toggle)", value: "both" },
      { label: "D) Selon la preference systeme", value: "system" },
      freeText("E) Autre"),
    ],
  },
  {
    id: "design_colors",
    text: "Tu as deja des couleurs de marque ?",
    category: "design",
    choices: [
      { label: "A) Oui (donne les hex/noms)", value: "yes" },
      { label: 'B) J\'ai une idee generale (ex: "bleu et orange")', value: "idea" },
      { label: "C) Non, propose-moi", value: "suggest" },
      { label: "D) Je veux choisir parmi des palettes", value: "choose" },
      freeText(),
    ],
  },
  // === SEO ===
  {
    id: "seo_organic",
    text: "Tu cibles du SEO organique ?",
    category: "seo",
    choices: [
      { label: "A) Oui, c'est prioritaire", value: "priority" },
      { label: "B) Oui, mais secondaire", value: "secondary" },
      { label: "C) Non, pas pour l'instant", value: "no" },
      { label: "D) Pas applicable", value: "na" },
      freeText(),
    ],
  },
  {
    id: "seo_aeo",
    text: "Tu veux etre cite par les AIs (ChatGPT, Claude, Perplexity) ?",
    category: "seo",
    choices: [
      { label: "A) Oui, c'est important", value: "important" },
      { label: "B) Ce serait un bonus", value: "bonus" },
      { label: "C) Pas une priorite", value: "no" },
      { label: "D) C'est quoi l'AEO ?", value: "explain" },
      freeText(),
    ],
  },
  {
    id: "seo_keywords",
    text: "Quels mots-cles principaux ?",
    category: "seo",
    skipIf: [{ questionId: "seo_organic", values: ["no", "na"] }],
    choices: [freeText("Liste tes mots-cles")],
  },
  {
    id: "seo_geo",
    text: "Tu cibles quels pays / langues ?",
    category: "seo",
    choices: [
      { label: "A) France / francais", value: "fr" },
      { label: "B) International / anglais", value: "en" },
      { label: "C) Multi-langues", value: "multi" },
      freeText("D) Autre"),
    ],
  },
  // === TECHNICAL ===
  {
    id: "tech_stack",
    text: "Quel stack frontend ?",
    category: "technical",
    choices: [
      { label: "A) React / Next.js", value: "react" },
      { label: "B) Svelte / SvelteKit", value: "svelte" },
      { label: "C) Vue / Nuxt", value: "vue" },
      { label: "D) HTML/CSS/JS vanilla", value: "vanilla" },
      { label: "E) Pas encore decide", value: "undecided" },
      freeText("F) Autre"),
    ],
  },
  {
    id: "tech_ui_framework",
    text: "Tu utilises un UI framework ?",
    category: "technical",
    choices: [
      { label: "A) Tailwind CSS", value: "tailwind" },
      { label: "B) shadcn/ui", value: "shadcn" },
      { label: "C) Material UI / MUI", value: "material" },
      { label: "D) CSS custom", value: "custom" },
      { label: "E) Pas encore decide", value: "undecided" },
      freeText("F) Autre"),
    ],
  },
  {
    id: "tech_responsive",
    text: "Responsive obligatoire ?",
    category: "technical",
    choices: [
      { label: "A) Oui, mobile-first", value: "mobile_first" },
      { label: "B) Oui, desktop-first", value: "desktop_first" },
      { label: "C) Desktop seulement", value: "desktop_only" },
      { label: "D) Mobile seulement", value: "mobile_only" },
      freeText(),
    ],
  },
  {
    id: "tech_pwa",
    text: "PWA ou app native prevue ?",
    category: "technical",
    choices: [
      { label: "A) PWA", value: "pwa" },
      { label: "B) App native (React Native, Flutter)", value: "native" },
      { label: "C) Les deux", value: "both" },
      { label: "D) Web seulement", value: "web" },
      freeText(),
    ],
  },
  // === RETENTION ===
  {
    id: "retention_mechanics",
    text: "T'as des mecaniques de retention ?",
    category: "retention",
    choices: [
      { label: "A) Streaks / series", value: "streaks" },
      { label: "B) Gamification (points, badges, niveaux)", value: "gamification" },
      { label: "C) Progress bars / completion tracking", value: "progress" },
      { label: "D) Notifications smart", value: "notifications" },
      { label: "E) Pas encore", value: "no" },
      freeText("F) Autre"),
    ],
  },
  {
    id: "retention_churn",
    text: "Comment tu geres le churn ?",
    category: "retention",
    choices: [
      { label: "A) Exit intent / offre de retention", value: "exit_intent" },
      { label: "B) Downgrade avant cancel", value: "downgrade" },
      { label: "C) Feedback obligatoire avant depart", value: "feedback" },
      { label: "D) Re-engagement emails", value: "re_engagement" },
      { label: "E) Pas encore mis en place", value: "no" },
      freeText("F) Autre"),
    ],
  },
  {
    id: "retention_feedback",
    text: "T'as un systeme de feedback utilisateur ?",
    category: "retention",
    choices: [
      { label: "A) In-app feedback widget", value: "widget" },
      { label: "B) NPS / surveys", value: "nps" },
      { label: "C) Support chat", value: "chat" },
      { label: "D) Pas encore", value: "no" },
      freeText("E) Autre"),
    ],
  },
];

export function getAllQuestions(): Question[] {
  return questions;
}

export function getQuestionsByCategory(category: Category): Question[] {
  return questions.filter((q) => q.category === category);
}

export function getQuestionById(id: string): Question | undefined {
  return questions.find((q) => q.id === id);
}
