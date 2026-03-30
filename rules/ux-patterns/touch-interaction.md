# Touch & Interaction Rules (CRITICAL — Priority 2)

## Touch target size
- Minimum 44x44pt (Apple HIG) / 48x48dp (Material Design)
- Boutons, liens, inputs doivent tous respecter cette taille

## Touch spacing
- Minimum 8px/8dp d'espacement entre les cibles tactiles
- Eviter les boutons colles les uns aux autres

## Hover vs tap
- Click/tap pour les interactions primaires
- Ne jamais s'appuyer uniquement sur le hover (inexistant sur mobile)
- Le hover est un bonus desktop, pas une fonctionnalite

## Loading buttons
- Desactiver le bouton pendant l'operation async
- Afficher un spinner dans le bouton
- Ne pas permettre le double-tap/double-click

## Error feedback
- Messages d'erreur clairs pres du probleme
- Feedback visuel immediat (couleur, icone, animation subtile)

## Cursor pointer
- Ajouter cursor:pointer sur tous les elements cliquables
- L'utilisateur doit savoir ce qui est interactif

## Gesture conflicts
- Eviter le swipe horizontal sur le contenu principal (conflit avec back gesture)
- Tester avec la navigation gestuelle du systeme

## Tap delay
- Utiliser touch-action:manipulation pour supprimer le delay de 300ms
- Feedback visuel immediat au tap (< 100ms)

## Standard gestures
- Utiliser les gestes standard de la plateforme de maniere coherente
- Tap, long press, swipe, pinch = comportements attendus

## System gestures
- Ne pas bloquer les gestes systeme (Control Center, back swipe, bottom bar)
- Garder les interactions loin des zones systeme

## Press feedback
- Feedback visuel au press (ripple Material, highlight iOS)
- L'element doit reagir immediatement au toucher

## Haptic feedback
- Utiliser le haptic pour les confirmations et actions importantes
- Subtil — pas pour chaque interaction

## Gesture alternative
- Fournir des controles visibles pour les actions critiques
- Les gestes sont des raccourcis, pas la seule methode

## Safe area awareness
- Garder les cibles tactiles primaires loin du notch, Dynamic Island, home indicator
- Utiliser SafeAreaView / env(safe-area-inset-*)

## No precision required
- Eviter les taps pixel-perfect sur des petites icones
- Les zones de tap doivent etre genereuses

## Swipe clarity
- Les actions swipe doivent montrer un affordance clair (hint, peek)
- L'utilisateur doit savoir que le swipe est possible

## Drag threshold
- Utiliser un seuil de mouvement avant de demarrer un drag
- Eviter les drags accidentels
