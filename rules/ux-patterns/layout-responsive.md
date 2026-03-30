# Layout & Responsive Rules

## Viewport meta
- width=device-width, initial-scale=1
- Ne jamais desactiver le zoom (maximum-scale=1 interdit)

## Mobile first
- Designer mobile d'abord, puis scaler vers tablet et desktop
- Le contenu prioritaire doit etre visible en premier sur mobile

## Breakpoints
- Systeme de breakpoints coherent : 375 / 768 / 1024 / 1440
- Ne pas multiplier les breakpoints arbitraires

## Readable font size
- Minimum 16px pour le body text sur mobile
- Les inputs doivent etre >= 16px (evite le zoom auto sur iOS)

## Line length
- Mobile : 35-60 caracteres par ligne
- Desktop : 60-75 caracteres par ligne
- Utiliser max-width sur les conteneurs de texte

## Horizontal scroll
- Jamais de scroll horizontal sur mobile
- Tester sur les plus petits ecrans supportes (320px)

## Spacing scale
- Systeme d'espacement incremental en 4pt/8dp
- 4, 8, 12, 16, 24, 32, 48, 64, 96
- Coherent dans tout le produit

## Touch density
- Espacement confortable entre les composants pour le touch
- Plus d'espace entre les elements interactifs que les elements statiques

## Container width
- Max-width coherent sur desktop (max-w-6xl / 7xl / 1280px)
- Centrer le contenu avec auto margins

## Z-index management
- Definir une echelle de z-index en layers
- base(0) < dropdown(10) < sticky(20) < modal(30) < toast(40) < tooltip(50)

## Fixed element offset
- Navbar/bottom bar fixes doivent reserver du padding safe
- Le contenu ne doit pas etre cache derriere les elements fixes

## Scroll behavior
- Eviter les regions de scroll imbriquees qui interferent avec le scroll principal
- scroll-behavior: smooth pour la navigation interne

## Viewport units
- Preferer min-h-dvh a 100vh sur mobile (gere la barre d'adresse)
- dvh = dynamic viewport height

## Orientation support
- Layout lisible et operable en mode paysage
- Ne pas bloquer l'orientation sauf cas specifique (jeu, video)

## Content priority
- Afficher le contenu principal d'abord sur mobile
- Navigation et elements secondaires en dessous ou dans un menu

## Visual hierarchy
- Etablir la hierarchie via taille, espacement, contraste
- L'oeil doit naturellement suivre : titre → sous-titre → contenu → CTA
