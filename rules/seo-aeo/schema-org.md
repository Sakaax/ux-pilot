# Schema.org Structured Data Rules

## Format
- JSON-LD dans un <script type="application/ld+json"> dans le <head>
- Prefere a microdata ou RDFa (recommandation Google)

## Organization
- Sur la homepage : nom, logo, URL, social profiles
- sameAs pour les profils sociaux (Twitter, LinkedIn, GitHub)

## Product
- Pour les pages produit/pricing : name, description, price, currency
- offers avec availability et priceValidUntil
- aggregateRating si reviews disponibles

## Article
- Pour les blog posts : headline, datePublished, dateModified, author
- image pour la vignette
- publisher avec logo

## FAQ
- Pour les pages FAQ et sections FAQ : question + acceptedAnswer
- Chaque paire Q/A est un FAQPage mainEntity
- Apparait comme rich result dans Google

## BreadcrumbList
- Sur toutes les pages avec navigation hierarchique
- itemListElement avec position, name, item (URL)

## HowTo
- Pour les tutoriels et guides : step par step
- Chaque step avec name, text, optionnellement image

## Review
- Pour les pages avec avis : author, reviewRating, datePublished
- itemReviewed pointe vers le produit/service

## WebSite
- Sur la homepage : potentialAction SearchAction si le site a une recherche
- Permet le sitelink searchbox dans Google

## Validation
- Tester avec Google Rich Results Test
- Tester avec Schema.org Validator
- Pas d'erreurs, warnings acceptables mais a minimiser
