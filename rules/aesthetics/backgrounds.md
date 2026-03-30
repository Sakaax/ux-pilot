# Background & Atmosphere Rules

## Gradient meshes
- Gradients multi-points pour un effet organique et moderne
- 3-4 couleurs qui se melangent doucement
- Utiliser comme fond de hero ou de section
- Subtil en background, fort en accent

## Noise textures
- Grain SVG overlay pour ajouter de la texture
- Donne un feel organique et premium
- filter: url(#noise) ou background-image avec SVG
- Opacite faible (5-15%) pour ne pas dominer

## Geometric patterns
- Grilles, dots, lignes — en arriere-plan subtil
- Couleur proche du fond (faible contraste)
- Repete avec background-repeat, taille petite

## Layered transparencies
- Superposition de couches semi-transparentes
- Cartes en glass (backdrop-filter: blur) sur des fonds colores
- Profondeur via l'opacite et le blur

## Dramatic shadows
- Ombres portees larges et diffuses pour la profondeur
- box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25)
- Ombres colorees (teintees de la couleur primaire) pour un effect moderne

## Grain overlays
- Overlay de grain photographique pour le caractere
- Effet film/vintage subtil
- SVG filter ou image de grain en overlay
- mix-blend-mode: overlay/soft-light

## Dark backgrounds
- Pas #000000 pur — utiliser #0a0a0a, #0f172a, #18181b
- Surface cards legrement plus claire que le fond
- Hierarchie : fond sombre → surfaces → elements

## Light backgrounds
- Pas #FFFFFF pur partout — utiliser #FAFAFA, #F8FAFC, #F1F5F9
- Variations subtiles entre les sections
- Le blanc pur pour les cartes/surfaces sur fond off-white

## Atmosphere coherente
- Le background doit supporter le mood du produit
- Tech/dark → fonds sombres, grain, glow subtil
- Premium → gradients doux, transparences, ombres larges
- Minimal → fond quasi-uni, micro-textures, espace
- Fun → couleurs vives en fond, patterns geometriques

## Performance
- Les backgrounds CSS > images pour la performance
- Gradient CSS > image gradient
- SVG patterns > PNG patterns
- Lazy-load les images de fond lourdes
