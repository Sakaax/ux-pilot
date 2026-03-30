# Performance SEO Rules

## Core Web Vitals
- LCP (Largest Contentful Paint) < 2.5 secondes
- FID (First Input Delay) < 100ms
- CLS (Cumulative Layout Shift) < 0.1
- Ces metriques impactent directement le ranking Google

## Image optimization
- Formats modernes : WebP, AVIF (fallback JPEG/PNG)
- Responsive images : srcset + sizes
- Lazy loading sous le fold : loading="lazy"
- Declarer width/height ou aspect-ratio pour eviter le layout shift
- Compresser : qualite 80% suffisante pour le web

## Font loading
- font-display: swap ou optional pour eviter le texte invisible
- Preload les fonts critiques : <link rel="preload" as="font">
- Ne pas preload plus de 2 fonts
- Self-host plutot que Google Fonts si performance critique

## Critical CSS
- Inline le CSS critique (above the fold) dans le <head>
- Defer le reste du CSS
- Eviter les CSS bloquants non-critiques

## Lazy loading composants
- Lazy load les composants sous le fold via dynamic import
- Skeleton/placeholder pendant le chargement

## Bundle splitting
- Split par route/feature
- Ne pas charger le JS d'une page non visitee

## Third-party scripts
- Charger async/defer
- Auditer et supprimer les scripts inutiles
- Analytics, chat widgets, etc. ne doivent pas bloquer le rendu

## Reduce reflows
- Eviter les lectures/ecritures DOM frequentes
- Batch les lectures DOM puis les ecritures
- Utiliser requestAnimationFrame pour les animations JS

## Content jumping
- Reserver l'espace pour le contenu async (images, ads, embeds)
- Declarer les dimensions avant le chargement

## Progressive loading
- Skeleton screens / shimmer > spinner bloquant
- Le contenu doit apparaitre progressivement, pas d'un coup apres 3s

## Debounce / throttle
- Debounce les events haute frequence (scroll, resize, input)
- Throttle les appels API (search-as-you-type)
