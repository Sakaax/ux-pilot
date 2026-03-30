# Typography & Color Rules

## Line height
- 1.5-1.75 pour le body text
- 1.2-1.3 pour les headings
- Plus le texte est petit, plus le line-height doit etre grand

## Line length
- 65-75 caracteres par ligne max
- Utiliser max-width ou ch unit (max-width: 65ch)

## Font pairing
- Matcher la personnalite heading/body
- Display + sans-serif, serif + mono = contrastes interessants
- Eviter deux fonts trop similaires (deux geometric sans-serif)

## Font scale
- Echelle typographique coherente : 12, 14, 16, 18, 24, 32, 48
- Ratio coherent entre les niveaux (1.25x, 1.333x ou 1.5x)

## Contrast readability
- Texte sombre sur fond clair (pas gris clair sur blanc)
- Minimum 4.5:1 pour le body, 3:1 pour le large text
- Tester avec des outils de contraste

## Text styles system
- Definir un systeme de styles : h1-h6, body, caption, overline, label
- Reutiliser partout, ne pas inventer de nouveaux styles

## Weight hierarchy
- Utiliser le font-weight pour renforcer la hierarchie
- Bold pour les titres, regular pour le body, light avec parcimonie
- Weight extremes (200 vs 800) creent plus d'impact que (400 vs 600)

## Semantic color tokens
- Definir des tokens semantiques : primary, secondary, error, success, warning
- Ne pas utiliser des couleurs brutes dans le code (pas de #FF0000, utiliser --color-error)

## Dark mode
- Dark mode utilise des variantes desaturees / plus claires
- Pas juste inverser les couleurs — la hierarchie visuelle doit etre adaptee
- Surfaces : du plus sombre (fond) au plus clair (cartes, modals)

## Accessible color pairs
- Chaque paire foreground/background doit respecter 4.5:1 (AA) ou 7:1 (AAA)
- Tester en light ET dark mode

## Color not decorative only
- La couleur fonctionnelle doit etre accompagnee d'icone/texte
- Rouge seul ne suffit pas pour indiquer une erreur

## Truncation strategy
- Preferer le wrapping a la troncation
- Si troncation : ellipsis + tooltip/expand pour voir le texte complet
- Ne jamais tronquer du contenu critique

## Letter spacing
- Respecter le letter-spacing par defaut de la font
- Tracking augmente sur les petites tailles, reduit sur les grandes

## Tabular numbers
- Utiliser font-variant-numeric: tabular-nums pour les colonnes de donnees, prix, dates
- Les chiffres doivent s'aligner verticalement dans les tableaux

## Whitespace balance
- Utiliser le whitespace intentionnellement pour grouper les elements lies
- Plus d'espace entre les groupes que dans les groupes (loi de proximite)
