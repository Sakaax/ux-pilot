# Charts & Data Visualization Rules

## Chart type match
- Trend dans le temps → Line chart
- Comparaison → Bar chart (vertical ou horizontal)
- Proportion → Pie/Donut (max 5 categories)
- Distribution → Histogram, Box plot
- Correlation → Scatter plot
- Flow/process → Sankey diagram
- Hierarchie → Treemap, Sunburst
- Geographique → Choropleth map

## Accessible colors
- Palettes accessibles, pas de paires rouge/vert uniquement
- Tester avec simulateurs de daltonisme
- Completer la couleur avec des patterns/textures si necessaire

## Data table alternative
- Fournir une alternative tableau pour l'accessibilite
- Les screen readers ne peuvent pas lire les charts visuels

## Pattern texture
- Completer la couleur avec patterns, textures ou shapes
- Surtout pour l'impression et l'accessibilite

## Legend visible
- Toujours afficher la legende, positionnee pres du chart
- Legende interactive : clic pour toggle la visibilite d'une serie

## Tooltip on interact
- Tooltips au hover/tap montrant les valeurs exactes
- Accessible au clavier (focus + tooltip)

## Axis labels
- Labelliser les axes avec unites et echelle lisible
- Pas de labels tronques ou superposes

## Responsive chart
- Les charts doivent reflow ou se simplifier sur petits ecrans
- Reduire le nombre de data points sur mobile si necessaire

## Empty data state
- Message significatif quand aucune donnee n'existe
- CTA pour generer/importer des donnees

## Loading chart
- Skeleton/shimmer placeholder pendant le chargement
- Pas de chart vide avec juste des axes

## Animation optional
- Les animations d'entree doivent respecter prefers-reduced-motion
- Optionnelles, pas obligatoires

## Large dataset
- Pour 1000+ data points : agreger ou echantillonner
- SVG pour < 1000 points, Canvas pour > 1000, WebGL pour > 10000

## Number formatting
- Formatage locale-aware (nombres, dates, devises)
- Separateurs de milliers, decimales selon la locale

## Touch target chart
- Les elements interactifs du chart doivent avoir >= 44pt de zone tap

## No pie overuse
- Eviter pie/donut pour > 5 categories
- Bar chart horizontal souvent plus lisible

## Contrast data
- Lignes/barres de donnees vs background >= 3:1
- Les series doivent etre distinguables entre elles

## Direct labeling
- Pour les petits datasets, labelliser directement sur le chart
- Evite l'aller-retour visuel entre chart et legende

## Sortable table
- Les data tables doivent supporter le tri avec aria-sort
- Indicateur visuel de la colonne triee et du sens

## Axis readability
- Les ticks d'axes ne doivent pas etre comprimes
- Rotater les labels si necessaire, ou reduire la densite

## Data density
- Limiter la densite d'information par chart
- Un chart = un message. Pas de chart qui dit tout a la fois

## Trend emphasis
- Mettre en avant les tendances plutot que la decoration
- Annotation des points importants (pic, creux, anomalie)

## Gridline subtle
- Lignes de grille en faible contraste
- Elles guident l'oeil sans dominer les donnees

## Screen reader summary
- Fournir un texte resumant l'insight cle du chart
- "Les ventes ont augmente de 23% en Q3 par rapport a Q2"

## Error state chart
- Echec de chargement = message d'erreur + retry
- Ne pas afficher un chart vide/casse silencieusement

## Export option
- Pour les produits data-heavy, offrir export CSV/image du chart

## Drill-down consistency
- Les interactions drill-down doivent maintenir un chemin back clair
- Breadcrumbs ou back button pour remonter

## Time scale clarity
- Les charts de series temporelles doivent labelliser clairement la granularite
- Jour, semaine, mois, annee — explicite dans le titre ou l'axe
