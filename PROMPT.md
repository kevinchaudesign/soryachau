# Prompt à coller dans Claude Code

> Copie-colle le bloc ci-dessous comme **premier message** dans Claude Code, à la racine d'un dossier
> contenant ce paquet de handoff (le dossier `source/` avec tout le code, le `README.md`
> et le `CLAUDE.md`). Adapte les passages entre crochets si besoin.

---

Tu m'aides à reprendre le développement de mon portfolio **Sorya Chau — Directrice de Production augmentée**.

## Contexte

Le site existe déjà sous forme de **prototype HTML/React fonctionnel** mais non-industrialisé :
React 18 + Babel Standalone chargés **directement dans le navigateur** (aucun build, aucun bundler,
le JSX est transpilé à la volée). Tout le code de référence est dans le dossier `source/`.
Le `README.md` documente en détail l'architecture, les pages, les composants, les tokens de design,
le système d'i18n et les données.

C'est un **multi-pages** : `index.html` (accueil), `work.html` (réalisations),
`blog.html` (Journal), `cv.html` (CV imprimable). Bilingue FR/EN. Direction artistique
« table de montage / cinéma » : monochrome filmique chaud, un seul accent ambre, serif
éditorial × grotesque × mono, plus une couche « régie » (intro amorce, barre de montage
HUD avec timecode au scroll, curseur réticule, lightbox Vimeo).

## Objectif

Migrer ce prototype vers un **vrai projet outillé et maintenable**, en conservant le design,
les contenus et les comportements **au pixel près**. La fidélité visuelle est prioritaire :
ne réinvente rien, ne « modernise » pas l'esthétique, ne remplace pas les polices ni les couleurs.

## Stack cible souhaitée

- **Vite + React 18 + TypeScript**
- **React Router** pour les 4 pages (`/`, `/work`, `/journal`, `/cv`) — garde des URLs propres,
  les liens internes du prototype pointent vers `*.html`, à adapter.
- CSS : **conserve les fichiers CSS existants tels quels** (ils sont propres et tokenisés via
  variables `:root`). Importe-les ; ne les convertis PAS en CSS-in-JS ni en Tailwind.
- Pas d'autre dépendance UI lourde. Reste minimal.

## Étapes attendues

1. Lis d'abord **intégralement le `README.md`** puis tout le dossier `source/`. Ne code rien
   avant d'avoir cartographié l'existant. Résume-moi ta compréhension et ton plan, et attends
   ma validation avant de générer le projet.
2. Échafaude le projet Vite + React + TS. Configure React Router.
3. Porte les composants JSX existants en `.tsx` :
   - `nav-hero.jsx` → `Nav`, `Hero`, `HeroMonitor`, `LangToggle`, `Icons`
   - `sections.jsx` → `Profile`, `Workflow`, `Work`, `WorkCard`, `Journal`, `Parcours`, `Clients`, `Contact`, `SectionHead`
   - `experience.jsx` → `Intro`, `ProductionHUD`, `Reticle`, `Lightbox`, `FramingGuides`, `Experience`
   - `work-page.jsx`, `blog.jsx`, `cv.jsx` → pages
   - Remplace le pattern `Object.assign(window, {...})` par de vrais imports/exports ES modules.
4. Convertis l'i18n : `i18n.js` (objet `window.I18N.fr/.en` + `window.PROJECTS`) en module typé
   (ex. `i18n.ts` exportant `I18N` et `PROJECTS`, avec des types `Lang`, `Project`, `Article`…).
   **Ne touche pas aux textes** — c'est du contenu rédigé, FR et EN, à préserver mot pour mot.
5. Intègre le web component `image-slot.js` tel quel (placeholders d'images que l'utilisateur
   dépose) — charge-le une fois globalement. En React, déclare la balise `<image-slot>` comme
   custom element (typage JSX).
6. Conserve les comportements clés : état de langue persistant en `localStorage` (clé `sorya-lang`),
   intro une fois par session (`sessionStorage` clé `sorya-intro`), reveal au scroll
   (IntersectionObserver), HUD timecode/scrubber au scroll, raccourcis clavier
   (Espace lecture · J/L coupe · G repères · T timeline), lightbox Vimeo via l'event
   `sorya:play`, respect de `prefers-reduced-motion` et `pointer: fine`.
7. Vérifie que les 4 pages s'affichent à l'identique du prototype (compare visuellement),
   FR et EN, sans erreur console, et que le build `vite build` passe.

## Contraintes

- **Fidélité au pixel** : couleurs (oklch), typo, espacements, animations, timings — inchangés.
- Ne change pas les contenus, ni les données projets, ni les liens Vimeo/Fontshare/Google Fonts.
- Accessibilité : garde les `aria-*`, le `lang` du `<html>`, le skip-link, le fallback `<noscript>`.
- Garde le SEO de `index.html` (meta OG/Twitter, JSON-LD Person/ProfilePage) — porte-le dans
  le `<head>` ou via un helper de tête de page.
- Reste minimal : pas de sur-ingénierie, pas de librairies superflues.

Quand tu as fini une étape, montre-moi le diff et attends mon feu vert avant la suivante.

---

### Notes (hors prompt)

- **Polices** : Switzer (Fontshare), Instrument Serif + JetBrains Mono (Google Fonts) — chargées
  par CDN dans les `<head>`. Tu peux les self-hoster plus tard si tu veux du offline.
- **PDF du CV** : `source/assets/Sorya-Chau-CV.pdf` — à placer dans `public/assets/`.
- **Images de films** : servies depuis Vimeo (vumbnail.com) et le site super-motion.com ; deux
  projets (Avène, PMU) sont des slots « en attente » à remplir.
- Si tu préfères **ne PAS migrer** et seulement continuer en l'état (ajout de features sur le
  prototype Babel actuel), c'est possible aussi — dans ce cas ignore les étapes 2–4 et travaille
  directement dans `source/`. Mais la migration Vite est recommandée pour la maintenabilité.
