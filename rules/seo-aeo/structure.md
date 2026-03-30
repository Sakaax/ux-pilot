# SEO Structure Rules

## Headings
- H1 unique par page
- Hierarchie logique H1 → H2 → H3 → H4, pas de saut de niveau
- Les headings decrivent le contenu, pas juste du style
- Utiliser les headings pour structurer, pas pour agrandir du texte

## Semantic HTML
- Utiliser les bonnes balises : header, nav, main, section, article, aside, footer
- Pas de div/span pour tout — la semantique aide le SEO et l'accessibilite
- Landmark roles implicites via les bonnes balises

## Meta tags
- Title < 60 caracteres, descriptif et unique par page
- Meta description < 160 caracteres, avec call-to-action
- Canonical URL sur chaque page
- Pas de meta keywords (ignore par Google)

## OG tags
- og:title, og:description, og:image, og:url minimum
- og:image au moins 1200x630px
- Twitter card tags (twitter:card, twitter:title, twitter:description, twitter:image)

## Performance SEO
- LCP (Largest Contentful Paint) < 2.5 secondes
- CLS (Cumulative Layout Shift) < 0.1
- Images lazy-loaded sous le fold
- Fonts preload pour les fonts critiques
- font-display: swap pour eviter le texte invisible

## Structured data
- Schema.org JSON-LD pour le type de contenu (Product, FAQ, Article, Organization, etc.)
- BreadcrumbList pour la navigation
- Tester avec le Rich Results Test de Google

## AEO (Answer Engine Optimization)
- Contenu structure en Q&A quand pertinent
- Definitions claires des termes cles
- Listes et tableaux pour les donnees comparatives
- Resume/TL;DR en haut de page pour les articles longs
- Contenu factuel et citeable (les AIs preferent les sources claires)
