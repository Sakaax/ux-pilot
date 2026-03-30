# Meta & OG Tags Rules

## Title tag
- Unique par page
- < 60 caracteres
- Format : "Page — Brand" ou "Brand | Page"
- Le mot-cle principal en premier

## Meta description
- < 160 caracteres
- Inclure un call-to-action ou value proposition
- Unique par page, pas de duplication
- Resume ce que l'utilisateur trouvera sur la page

## Canonical URL
- Canonical sur chaque page pour eviter le contenu duplique
- Auto-referentiel si pas de duplication
- Pointer vers la version preferee (www vs non-www, https vs http)

## OG tags (Open Graph)
- og:title — titre pour le partage social
- og:description — description pour le partage
- og:image — image au moins 1200x630px
- og:url — URL canonique
- og:type — website, article, product selon le contenu
- og:site_name — nom du site

## Twitter cards
- twitter:card — summary_large_image pour les articles/pages
- twitter:title — peut etre different du og:title
- twitter:description — resume court
- twitter:image — meme image que og:image ou adaptee

## Favicon
- favicon.ico pour la compatibilite
- apple-touch-icon (180x180) pour iOS
- manifest.json avec icones pour PWA
- SVG favicon pour les navigateurs modernes

## Robots
- meta robots : index,follow par defaut
- noindex pour les pages privees, admin, staging
- nofollow pour les liens non-fiables

## Language
- lang attribute sur <html>
- hreflang pour les sites multi-langues
- Indiquer la langue du contenu aux moteurs
