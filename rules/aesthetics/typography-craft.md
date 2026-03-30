# Typography Craft Rules

## Font pairing distinctif
- Display font (heading) + body font = contraste de personnalite
- Serif + mono, display + geometric sans = pairings interessants
- Eviter deux fonts de la meme famille esthetique

## Choix recommandes par mood

### Code / Tech
- JetBrains Mono, Fira Code, Space Grotesk, IBM Plex Mono

### Editorial / Premium
- Playfair Display, Crimson Pro, Fraunces, Newsreader, Lora

### Startup / Moderne
- Clash Display, Satoshi, Cabinet Grotesk, Sora, General Sans

### Clean / Pro
- IBM Plex Sans, Source Sans 3, DM Sans, Outfit

### Distinctif / Bold
- Bricolage Grotesque, Obviously, Space Grotesk, Unbounded

## Weight extremes
- Utiliser 100/200 vs 800/900 pour creer du contraste
- 400 vs 600 = presque invisible, pas assez de punch
- Le contraste de weight cree la hierarchie visuelle

## Size jumps
- Ratio 3x+ entre heading et body
- body: 16px, H1: 48-64px = impact
- body: 16px, H1: 24px = plat, pas de hierarchie

## Tracking (letter-spacing)
- Serrer sur les grands titres (letter-spacing: -0.02em)
- Ouvrir sur les petits textes (letter-spacing: 0.01em) et uppercase
- Uppercase + tracking ouvert pour labels et overlines

## Google Fonts
- Toujours charger depuis Google Fonts pour la performance CDN
- <link rel="preconnect" href="https://fonts.googleapis.com">
- Ne charger que les weights utilises (pas tout le spectrum)

## Variable fonts
- Preferer les variable fonts quand disponibles
- Un seul fichier, multiple weights = meilleure performance
- font-variation-settings pour le fine-tuning

## Declarer avant de coder
- Choisir la font AVANT de commencer le design
- L'ecrire dans le brief UX / design tokens
- Ne pas changer de font en cours de route sans raison
