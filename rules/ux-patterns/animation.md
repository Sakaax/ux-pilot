# Animation Rules

## Duration timing
- Micro-interactions : 150-300ms
- Transitions complexes : max 400ms
- Trop court = imperceptible, trop long = lent

## Transform performance
- Animer uniquement transform et opacity
- Ne jamais animer width, height, top, left, margin (provoque reflow)
- will-change avec parcimonie sur les elements animes

## Loading states
- Afficher skeleton ou progress indicator quand le chargement depasse 300ms
- Shimmer effect pour les placeholders de contenu

## Excessive motion
- Animer 1-2 elements cles par vue, max
- Trop d'animation = distraction et fatigue visuelle

## Easing
- ease-out pour les elements qui entrent (deceleration naturelle)
- ease-in pour les elements qui sortent (acceleration)
- Ne jamais utiliser linear pour les transitions UI

## Motion meaning
- Chaque animation doit exprimer une relation cause-effet
- Pas d'animation decorative sans signification

## State transition
- Les changements d'etat doivent animer smoothly, pas snapper
- Toggle, expand/collapse, show/hide = transitions fluides

## Continuity
- Les transitions de page/ecran doivent maintenir la continuite spatiale
- L'utilisateur doit comprendre d'ou vient et ou va le contenu

## Parallax
- Utiliser le parallax avec parcimonie
- Respecter prefers-reduced-motion
- Ne pas utiliser sur le contenu principal

## Spring physics
- Preferer les courbes spring/physics pour un feel naturel
- Plus organique que les courbes cubic-bezier lineaires

## Exit faster than enter
- Les animations de sortie plus courtes que celles d'entree (~60-70%)
- L'utilisateur veut voir le nouveau contenu, pas regarder l'ancien partir

## Stagger sequence
- Stagger les entrees de liste/grille de 30-50ms par item
- Donne un effet de cascade elegant

## Shared element transition
- Utiliser les shared element transitions pour la continuite visuelle
- Un element qui "voyage" entre les ecrans aide la comprehension

## Interruptible
- Les animations doivent etre interruptibles
- Un tap/geste de l'utilisateur annule immediatement l'animation en cours

## No blocking animation
- Ne jamais bloquer l'input utilisateur pendant une animation
- L'utilisateur doit pouvoir interagir a tout moment

## Fade crossfade
- Utiliser crossfade pour le remplacement de contenu dans le meme conteneur
- Evite le flash blanc/vide entre deux etats

## Scale feedback
- Scale subtil (0.95-1.05) au press pour les cartes/boutons tappables
- Feedback tactile immediat

## Gesture feedback
- Drag, swipe, pinch doivent fournir un feedback visuel en temps reel
- L'element suit le doigt, pas de delay

## Hierarchy motion
- Utiliser translate/scale direction pour exprimer la hierarchie
- Drill-down = slide left, back = slide right

## Motion consistency
- Unifier les tokens duration/easing globalement
- Memes timings partout dans le produit

## Opacity threshold
- Les elements en fade ne doivent pas stagner sous opacity 0.2
- Soit visible, soit invisible — pas de zone grise

## Modal motion
- Les modals/sheets doivent animer depuis leur source trigger
- Pas de pop-in from center sans contexte

## Navigation direction
- Navigation forward anime left/up
- Navigation backward anime right/down
- Coherent avec les conventions de la plateforme

## Layout shift avoid
- Les animations ne doivent pas causer de layout reflow ou CLS
- Utiliser position absolute/fixed pour les elements animes si necessaire
