# Forms & Feedback Rules

## Labels
- Label visible par input (pas placeholder-only)
- Attribut `for` lie au champ correspondant
- Indicateurs required (asterisque) sur les champs obligatoires

## Validation inline
- Valider on blur, pas on keystroke
- Message d'erreur sous le champ concerne
- Ne pas utiliser uniquement la couleur pour les erreurs (ajouter icone/texte)

## Error placement
- Erreur toujours sous ou a cote du champ en question
- Apres soumission avec erreurs, focus auto sur le premier champ invalide
- Fournir un resume des erreurs en haut du formulaire si multiple erreurs

## Submit feedback
- Desactiver le bouton pendant l'operation async + afficher spinner
- Etat success et error explicites apres soumission
- Timeout : afficher message clair avec option retry

## Required indicators
- Marquer les champs obligatoires avec asterisque
- Mentionner la convention en debut de formulaire si ambiguite

## Empty states
- Message utile + action quand aucun contenu
- Jamais une page vide sans explication
- Differencier first-run vs no-data vs error

## Toast dismiss
- Auto-dismiss toasts en 3-5 secondes
- Ne pas voler le focus
- Accessible via aria-live

## Confirmation dialogs
- Confirmer avant les actions destructives (suppression, annulation)
- Bouton destructif en couleur danger, secondaire en neutre

## Helper text
- Texte d'aide persistant sous les champs complexes
- Pas dans le placeholder (disparait au focus)

## Disabled states
- Opacite reduite + cursor change pour les elements desactives
- Indiquer pourquoi un element est desactive si possible

## Progressive disclosure
- Reveler les options complexes progressivement
- Ne pas submerger avec toutes les options d'un coup

## Input type keyboard
- Utiliser les types d'input semantiques (email, tel, number, url)
- Le clavier mobile doit s'adapter au type de champ

## Password toggle
- Fournir un toggle show/hide pour les champs password
- Eye icon standard

## Autofill support
- Utiliser autocomplete / textContentType
- Ne pas bloquer l'autofill du navigateur

## Undo support
- Permettre undo pour les actions destructives ou bulk
- Snackbar avec "Annuler" pendant quelques secondes

## Multi-step progress
- Indicateur de progression pour les flows multi-etapes
- L'utilisateur doit savoir ou il en est et combien il reste

## Form autosave
- Les formulaires longs doivent auto-sauvegarder les brouillons
- Indiquer "Brouillon sauvegarde" discretement

## Field grouping
- Grouper les champs lies logiquement (fieldset/legend ou visuellement)
- Espacement plus grand entre les groupes qu'entre les champs
