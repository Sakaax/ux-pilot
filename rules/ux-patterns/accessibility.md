# Accessibility Rules (CRITICAL — Priority 1)

## Contraste couleur
- Minimum 4.5:1 pour le texte normal, 3:1 pour le texte large (>18px ou 14px bold)
- Tester avec un outil de contraste (WebAIM, Contrast Checker)

## Focus visible
- Ring de focus visible (2-4px) sur tous les elements interactifs
- Ne jamais supprimer outline:none sans remplacement

## Textes alternatifs
- Alt descriptif pour les images significatives
- Alt vide (alt="") pour les images decoratives
- aria-label pour les boutons avec icone uniquement

## Navigation clavier
- Tab order logique (suit l'ordre visuel)
- Support complet clavier pour toutes les interactions
- Pas de piege a focus (l'utilisateur peut toujours sortir)

## Hierarchie de titres
- Un seul H1 par page
- Sequence logique H1 → H2 → H3, pas de saut de niveau
- Les titres decrivent le contenu de leur section

## Skip links
- Lien "Skip to main content" pour les utilisateurs clavier
- Visible au focus, cache sinon

## Formulaires
- Label associe a chaque champ (attribut for)
- Messages d'erreur lies au champ via aria-describedby
- Ne pas utiliser uniquement la couleur pour indiquer les erreurs

## Mouvement reduit
- Respecter prefers-reduced-motion
- Reduire ou desactiver les animations
- Pas de contenu qui clignote > 3 fois par seconde

## Lecteurs d'ecran
- Labels significatifs et ordre de lecture logique
- aria-live pour les contenus dynamiques
- role="alert" pour les messages urgents

## Touch targets
- Minimum 44x44pt (Apple) / 48x48dp (Material Design)
- Espacement minimum 8px entre les cibles tactiles

## Couleur seule insuffisante
- Ne pas transmettre d'info par la couleur uniquement
- Ajouter icone, texte ou pattern en complement

## Echappatoires
- Fournir cancel/back dans les modals et flows multi-etapes
- Toujours une sortie evidente
