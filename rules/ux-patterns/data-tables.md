# Data Tables Rules

## Sort
- Colonnes triables avec indicateur visuel (fleche up/down)
- aria-sort pour l'accessibilite
- Tri par defaut pertinent (date recente, nom alphabetique)

## Filter
- Filtres accessibles au-dessus du tableau
- Montrer les filtres actifs avec option de clear
- Resultats mis a jour en temps reel ou avec bouton Apply

## Pagination
- Pagination pour les grands datasets (> 50 lignes)
- Afficher le nombre total de resultats
- Options de lignes par page (10, 25, 50, 100)

## Bulk actions
- Checkbox pour selectionner plusieurs lignes
- "Select all" en header
- Barre d'actions bulk qui apparait a la selection
- Confirmer les actions destructives bulk

## Responsive
- Sur mobile : convertir en cards plutot que tableau horizontal
- Ou : colonnes prioritaires visibles + expand pour les details
- Ne jamais avoir de scroll horizontal oblige sur mobile

## Empty state
- Message utile quand le tableau est vide
- Differencier "aucun resultat" (filtres trop restrictifs) vs "aucune donnee" (rien cree)
- CTA pour creer le premier element

## Loading skeleton
- Skeleton rows pendant le chargement
- Garder la structure du tableau visible (headers + lignes grises)
- Ne pas utiliser un spinner centre pour un tableau

## Column resize
- Permettre le redimensionnement des colonnes sur desktop
- Largeurs par defaut intelligentes selon le contenu

## Row actions
- Actions par ligne : edit, delete, view — via icones ou menu contextuel
- Actions destructives en rouge / separees visuellement
- Hover sur desktop, menu three-dots sur mobile

## Export
- Option CSV/Excel pour les produits data-heavy
- Exporter ce qui est filtre, pas tout le dataset
