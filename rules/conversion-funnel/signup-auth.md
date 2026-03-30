# Signup & Authentication Rules

## Friction minimale
- Le moins de champs possible au signup
- Nom + Email + Password minimum, ou juste Email + Password
- Demander les infos supplementaires apres, pas pendant le signup

## Social login first
- Google, GitHub, Apple en premier (1 clic)
- Email/password en fallback, pas l'inverse
- Respecter les conventions de la plateforme (Sign in with Apple sur iOS)

## Magic link
- Proposer le magic link comme alternative au password
- Plus simple, plus securise, moins de friction

## Password strength
- Indicateur de force en temps reel (barre de couleur)
- Exigences claires et visibles avant que l'utilisateur tape
- Toggle show/hide password

## 2FA UX
- Proposer 2FA apres le signup, pas pendant
- Authenticator app prefere, SMS en fallback
- Codes de recovery clairs et telechargeable

## Error messages
- "Email deja utilise" → proposer login ou reset password
- "Password trop faible" → dire exactement ce qui manque
- Ne pas vider le formulaire apres une erreur

## Login
- Remember me checkbox (coche par defaut)
- Lien "Mot de passe oublie ?" visible
- Redirect vers la page d'origine apres login

## Email verification
- Si necessaire : permettre l'acces au produit avant verification
- Reminder non-intrusif (banner, pas modal bloquant)
- Renvoyer l'email facilement (lien clair)

## Session management
- Session longue sur les devices de confiance
- Logout clair et accessible
- Multi-device : indiquer les sessions actives dans settings
