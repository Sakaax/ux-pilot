# Navigation Rules

## Bottom nav
- Maximum 5 items en bottom navigation
- Reservee aux ecrans top-level uniquement
- Icone + texte pour chaque item
- Etat actif visuellement distinct

## Back behavior
- Navigation back previsible et coherente
- Ne jamais reset silencieusement la pile de navigation
- Restaurer le scroll et les filtres en revenant en arriere

## Drawer / Sidebar
- Utiliser drawer/sidebar pour la navigation secondaire
- Navigation primaire vs secondaire clairement separee

## Deep linking
- Tous les ecrans cles doivent etre accessibles via URL / deep link

## Breadcrumbs
- Breadcrumbs pour hierarchie > 3 niveaux de profondeur (web)
- Pas en mobile (utiliser back button)

## Nav label + icon
- Chaque item de navigation doit avoir icone ET texte
- Pas d'icone seule sans label (sauf si universellement reconnu)

## Modal escape
- Modals et sheets doivent offrir un dismiss clair (X, tap outside, swipe)
- Pas de modal dans un modal
- Pas de navigation primaire dans un modal

## Search
- Recherche facilement accessible
- Fournir suggestions et recherches recentes

## State preservation
- Naviguer back doit restaurer le scroll, les filtres, l'etat
- Ne pas perdre le travail en cours de l'utilisateur

## Adaptive navigation
- Grands ecrans : sidebar
- Petits ecrans : bottom nav ou top nav
- Pas mixer Tab + Sidebar + Bottom Nav au meme niveau

## Persistent nav
- La navigation principale doit rester accessible depuis les pages profondes
- Ne pas cacher la nav sans moyen de la retrouver

## Destructive separation
- Actions dangereuses visuellement et spatialement separees des actions normales
