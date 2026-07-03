# CLAUDE.md — Portfolio Sorya Chau

Règles persistantes pour le développement de ce projet. (Copier à la racine du dépôt.)

## Nature du projet
Portfolio bilingue (FR/EN) de Sorya Chau, Directrice de Production « augmentée par l'IA ».
Direction artistique « table de montage / cinéma » : **thème clair** (papier ivoire chaud, texte
encre), **un seul accent rouge Cartier** (Pantone 1797 C — `oklch(0.559 0.188 23.2)`), serif
éditorial (Instrument Serif) × grotesque (Switzer) × mono (JetBrains Mono). Les éléments-écrans
(moniteur du hero, intro amorce, barre de montage, lightbox, cartes-films et zones média)
restent sombres via les « dark islands » de `styles.css` — mêmes noms de tokens, re-scopés.

## Priorité absolue : fidélité visuelle
- Reproduire le design **au pixel près**. Ne pas réinterpréter l'esthétique.
- Ne pas substituer les polices, ne pas inventer de couleurs. Toutes les couleurs sont en **oklch**
  et définies en variables `:root` dans `styles.css` — les réutiliser, ne pas en créer d'autres.
- Border-radius `0` par défaut (parti pris carré/éditorial).
- Conserver les animations et leurs timings (intro, reveal au scroll, HUD timecode, marquee, wipes).

## Contenu = intouchable
- Tous les textes (FR et EN) sont rédigés et validés. Ne pas modifier la copie sans demande explicite.
- Source unique de contenu : le module i18n (`I18N.fr` / `I18N.en`) + les données `PROJECTS`.
- Garder la parité FR/EN sur tout nouvel élément.

## Conventions
- Préférer fl/grid + `gap`, pas de marges inline fragiles.
- HTML canonique (balises fermées, attributs entre guillemets).
- Garder les `aria-*`, le `lang` dynamique du `<html>`, le skip-link, le fallback `<noscript>`,
  et le bloc SEO de l'accueil (OG / Twitter / JSON-LD Person + ProfilePage).
- Respecter `prefers-reduced-motion` et `pointer: fine` pour les effets (intro, reticle, HUD).
- Persistances : langue en `localStorage["sorya-lang"]`, intro vue en `sessionStorage["sorya-intro"]`.

## Comportements à ne pas casser
- Bascule de langue persistante (défaut selon `navigator.language`, sinon FR).
- Lightbox Vimeo déclenchée par l'event `sorya:play`.
- Lecteur d'article du Journal piloté par le hash d'URL.
- Raccourcis HUD : Espace lecture · J/L coupe · G repères · T timeline.
- `<image-slot>` : placeholders d'images déposées par l'utilisateur, persistants (id unique requis).

## À faire / demander avant d'ajouter
Ne pas ajouter de sections, pages ou contenus de remplissage sans validation. Moins, c'est mieux.
