# Handoff — Portfolio Sorya Chau

> Paquet de reprise de développement. À lire **avant** de coder.
> Le prompt prêt à coller pour Claude Code est dans **`PROMPT.md`**.
> Le code de référence complet est dans **`source/`**.

---

## 1. Vue d'ensemble

Portfolio personnel one-page-augmenté de **Sorya Chau**, Directrice de Production publicitaire
à Paris, positionnée comme « directrice de production **augmentée par l'IA** ». Objectif :
décrocher un poste en CDI. Le site présente son profil, sa méthode d'intégration de l'IA, ses
réalisations (films Super Motion), un Journal éditorial, son parcours et un CV imprimable.

Direction artistique : **« La table de montage » — cinéma éditorial.** Monochrome filmique
chaud (quasi-noir tirant sur le brun « chambre noire »), **un seul accent ambre** utilisé avec
parcimonie, contraste fort entre **serif d'affichage** (Instrument Serif), **grotesque** (Switzer)
et **mono** (JetBrains Mono). Une couche « régie vidéo » habille l'ensemble : amorce de film à
l'ouverture, barre de montage (HUD) avec timecode qui défile au scroll, curseur réticule,
lightbox Vimeo, repères de cadrage.

Bilingue **FR / EN** (FR par défaut, bascule persistante).

## 2. À propos des fichiers de design

Les fichiers de `source/` sont des **références de design réalisées en HTML** — un prototype
fonctionnel qui montre l'apparence et le comportement visés, **pas** une base de code de
production à livrer telle quelle. La tâche est de **recréer ce design dans un environnement
outillé** (recommandé : Vite + React + TypeScript, voir `PROMPT.md`) en réutilisant au maximum
le code existant, qui est propre et déjà structuré en composants. Le CSS, lui, peut être repris
**tel quel**.

Cela dit, le prototype est techniquement complet et fonctionne : si la priorité est d'ajouter
des fonctionnalités sans migrer, on peut continuer directement dans `source/` (React + Babel
in-browser, aucun build).

## 3. Fidélité

**Haute-fidélité (hifi).** Couleurs finales (oklch), typographie, espacements, animations et
interactions sont définitifs. À reproduire **au pixel près**. Ne pas réinterpréter l'esthétique,
ne pas substituer les polices, ne pas inventer de couleurs.

## 4. Architecture technique (état actuel)

- **Aucun build.** React 18.3.1 + ReactDOM + Babel Standalone 7.29.0 chargés par CDN (`unpkg`,
  avec `integrity`). Le JSX est transpilé dans le navigateur via `<script type="text/babel">`.
- **Multi-pages**, 4 fichiers HTML autonomes, chacun monte sa propre racine React dans `#root` :

  | Page | HTML | Entrée JSX | Monte |
  |---|---|---|---|
  | Accueil | `index.html` | `app.jsx` | `<App/>` |
  | Réalisations | `work.html` | `work-page.jsx` | `<WorkPage/>` |
  | Journal | `blog.html` | `blog.jsx` | `<BlogPage/>` |
  | CV | `cv.html` | `cv.jsx` | `<CVApp/>` |

- **Partage de scope par `window`.** Chaque `<script type="text/babel">` a son propre scope.
  Les fichiers exposent leurs composants via `Object.assign(window, {...})` à la fin, et les
  consommateurs lisent `const { Nav, Experience } = window;` en haut. **À remplacer par de vrais
  imports/exports ES** lors de la migration.
- **Ordre de chargement des scripts** (identique sur chaque page, voir les `<head>`/fin de `<body>`) :
  1. `image-slot.js` (web component, sauf sur `cv.html` qui ne l'utilise pas)
  2. React, ReactDOM, Babel (CDN)
  3. `i18n.js` (données + contenus — script classique, pas babel)
  4. `experience.jsx`, `nav-hero.jsx`, `sections.jsx` (composants partagés)
  5. le fichier d'entrée de la page

### Carte des fichiers

| Fichier | Rôle |
|---|---|
| `i18n.js` | **Source unique de contenu.** `window.I18N.fr` / `.en` (tous les textes) + `window.PROJECTS` (données projets bilingues). |
| `nav-hero.jsx` | `Nav`, `Hero`, `HeroMonitor` (moniteur de régie animé), `LangToggle`, `Icons`. |
| `sections.jsx` | Sections de l'accueil : `SectionHead`, `Profile`, `Workflow`, `Work` + `WorkCard`, `Journal` (teaser), `Parcours`, `Clients` (marquee), `Contact` (footer), `PlayGlyph`. |
| `experience.jsx` | Couche « régie » : `Intro` (amorce), `ProductionHUD` (barre de montage + timecode + raccourcis), `Reticle` (curseur), `Lightbox` (Vimeo), `FramingGuides`, wrapper `Experience`. |
| `app.jsx` | Racine accueil : état langue, reveal observer, ordre des sections. |
| `work-page.jsx` | Page réalisations : `FilmRow`, filtres par catégorie, `WorkPage`. |
| `blog.jsx` | Page Journal : `BlogPage`, grille + `Reader` (lecteur d'article piloté par le hash d'URL). |
| `cv.jsx` | Page CV : `CVApp`, feuille imprimable, `window.print()` + lien PDF. |
| `image-slot.js` | Web component `<image-slot>` : placeholder d'image que l'utilisateur dépose (drag & drop), persistant. |
| `styles.css` | **Tokens + base** : variables `:root`, type, boutons, chips, reveal, grain, marquee, regmarks. |
| `components.css` | Styles des sections de l'accueil (hero, profile, workflow, work-grid, timeline, contact…). |
| `experience.css` | Styles de la couche régie (intro, editbar/HUD, reticle, lightbox, guides). |
| `work.css` | Styles de la page réalisations. |
| `blog.css` | Styles du Journal + lecteur. |
| `cv.css` | Styles de la feuille CV + règles `@media print`. |

### CSS importé par page

- `index.html` : styles, components, experience, blog *(le teaser Journal réutilise des classes blog)*
- `work.html` : styles, components, experience, work
- `blog.html` : styles, components, experience, blog
- `cv.html` : styles, cv *(pas d'experience : pas de HUD sur le CV)*

## 5. Pages & écrans

### 5.1 Accueil (`index.html` / `app.jsx`)
Ordre des sections : **Hero → Profile → Workflow → Work → Journal (teaser) → Parcours → Clients → Contact**.
Chaque section porte un index « timecode » (00–07) en eyebrow mono.

- **Hero** (`#top`) — Plein écran. Fond = **HeroMonitor** : moniteur de régie qui fait défiler
  les stills des projets (cross-fade toutes les 4,4 s), avec burn-in timecode qui tourne (25 fps),
  scanlines, grade, étiquettes REC/PGM/SRC et slate « À L'IMAGE / NOW PLAYING ». Par-dessus :
  eyebrow rôle + marqueur de disponibilité, **H1 serif** (titre + mot accentué « augmentée » en
  italique ambre avec wipe), sous-titre, 2 CTA (Télécharger CV / Découvrir projets), 3 stats
  (20+ ans · 8 ans Super Motion · 3–15 talents), indice de scroll. Repères de cadrage (regmarks)
  et rail latéral « Paris · 48.8566° N ».
- **Profile** (`#profil`, 02) — Lead + citation « vision », portrait (image-slot), bloc compétences
  (4 cartes, certaines taguées « IA »), crédits (Formation / Domaines (chips) / Langues).
- **Workflow** (03) — Pipeline horizontal animé à 4 étapes (Conception → Pré-visualisation →
  Planning & budget → Post-production) + note outils (Claude · Midjourney · Frame.io · Notion).
- **Work** (`#work`, 04) — Grille éditoriale de 7 projets, rythmée par des spans
  (`lg, sm, sm, lg, third, third, third`). Cartes cliquables → lightbox Vimeo quand un film
  existe ; sinon image-slot. Lien « Voir toutes les réalisations » → `work.html`.
- **Journal** (`#journal`, 05) — Teaser : 1 article à la une + 2 en liste → `blog.html#id`.
- **Parcours** (`#parcours`, 06) — Timeline verticale, 4 postes (2007 → aujourd'hui).
- **Clients** — Marquee défilant de marques (TAG Heuer, Hermès, Kinder, Fiat…).
- **Contact** (`#contact`, 07) — Footer : titre, statut dispo, CTA email + CV, grille de
  coordonnées (email / téléphone / localisation / LinkedIn).

### 5.2 Réalisations (`work.html` / `work-page.jsx`)
En-tête + **filtres par catégorie** (Tout / Film de marque / Documentaire / Post-production /
3D & VFX / IA, avec compteurs). Liste de **`FilmRow`** : larges lignes type pellicule (média à
gauche, méta à droite), cliquables → lightbox. Réutilise `Nav`, `Experience` (sans intro),
`Contact`. Mapping catégories : `WP_CATMAP` dans `work-page.jsx`.

### 5.3 Journal (`blog.html` / `blog.jsx`)
Magazine éditorial : 1 featured + grille. Clic → **`Reader`** en surimpression, piloté par le
**hash d'URL** (`#article-id`), navigation « article suivant », fermeture Échap. Contenu des
articles = `I18N[lang].journal.articles[]` (corps en blocs `{t:"p"|"h"|"quote", c}`).
`Experience` monté **sans intro et sans editbar** (pas de HUD en lecture).

### 5.4 CV (`cv.html` / `cv.jsx`)
Feuille « résumé » bilingue, colonne principale (profil + expériences détaillées) + colonne
latérale (formation / langues / outils). Barre d'actions : bascule FR/EN, **Imprimer**
(`window.print()`), **Télécharger PDF** (`assets/Sorya-Chau-CV.pdf`). `cv.css` contient les
règles `@media print`. Pas de couche régie.

## 6. Interactions & comportements

- **Langue** : état React, persistée dans `localStorage["sorya-lang"]`, défaut selon
  `navigator.language` (sinon FR). Met à jour `document.documentElement.lang` et `document.title`.
- **Intro / amorce** : `experience.jsx → Intro`. Une fois par session
  (`sessionStorage["sorya-intro"]`). Skippée si `prefers-reduced-motion: reduce`. Compte à
  rebours 3-2-1 → titre → sortie (~2,4 s), fermable au clic / Entrée / Échap / Espace.
- **Reveal au scroll** : éléments `.reveal` → classe `.in` via IntersectionObserver. Délai
  d'entrée via `--rd`. Filets de sécurité (timeouts) pour ne jamais laisser de contenu à
  `opacity:0`. Base sans JS = visible (classe `js` ajoutée sur `<html>` pour activer le masquage).
- **ProductionHUD (editbar)** : timecode au scroll (25 fps, runtime simulé 232 s), scrubber +
  playhead, scène active (SC NN · titre), timeline V1/A1 avec clips cliquables mesurés sur la
  position réelle des sections. **Lecture auto** = auto-scroll. **Raccourcis** :
  `Espace` lecture/pause · `J`/`L` coupe (section précédente/suivante) · `G` repères de cadrage ·
  `T` timeline. Annulé hors `pointer: fine` pour l'état étendu.
- **Reticle** : curseur réticule custom, uniquement `pointer: fine` + pas de reduced-motion.
  S'agrandit sur `a, button, input, [data-cursor]`.
- **Lightbox Vimeo** : déclenchée par l'event custom `window.dispatchEvent(new CustomEvent("sorya:play", {detail:{id, client, title}}))`. Iframe Vimeo
  `player.vimeo.com/video/{id}?autoplay=1&color=d98b4e…`. Fermeture clic backdrop / Échap.
- **image-slot** : `<image-slot id shape placeholder>` — l'utilisateur dépose une image, stockée
  et persistante. Chaque slot a un `id` unique pour survivre au reload.

## 7. Tokens de design (depuis `styles.css`)

Toutes les couleurs sont en **oklch** (monochrome chaud + un accent ambre).

```css
/* Surfaces — quasi-noir chaud « chambre noire » */
--bg:        oklch(0.158 0.006 56);
--bg-deep:   oklch(0.138 0.006 54);
--surface:   oklch(0.196 0.007 56);
--surface-2: oklch(0.238 0.008 58);
--line:      oklch(0.315 0.009 58);
--line-soft: oklch(0.252 0.008 56);

/* Texte — ivoire chaud */
--txt:       oklch(0.948 0.012 82);
--txt-2:     oklch(0.770 0.012 76);
--txt-3:     oklch(0.605 0.012 70);
--txt-faint: oklch(0.470 0.011 64);

/* Accent ambre unique (usage parcimonieux) */
--accent:      oklch(0.715 0.130 54);
--accent-soft: oklch(0.770 0.095 62);
--accent-dim:  oklch(0.715 0.130 54 / 0.14);
--accent-line: oklch(0.715 0.130 54 / 0.42);

/* Typographie */
--serif: "Instrument Serif", "Times New Roman", Georgia, serif;
--sans:  "Switzer", "Helvetica Neue", Helvetica, Arial, sans-serif;
--mono:  "JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace;

/* Rythme */
--container: 1320px;
--pad: clamp(22px, 5vw, 72px);
--ease:     cubic-bezier(0.22, 1, 0.36, 1);
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
```

- **theme-color** (méta navigateur) : `#241f1a`.
- **Border-radius** : `0` quasi partout (esthétique éditoriale/carrée). Pas d'arrondis sauf
  exceptions locales.
- **Type d'affichage** : `.display` / `.section-title` en serif, `line-height` proche de 1,
  `text-wrap: balance`, mot accentué en `.it` (italique).
- **Eyebrow** : label mono, uppercase, `letter-spacing 0.16em`, index ambre.
- **Chips** : mono, uppercase, bord `--line`, carré ; variante `.chip-ai` ambre.
- **Grain** : overlay SVG fractal fixe, `opacity ~0.022`, sur `body.grain`.

### Polices (CDN)
- **Switzer** 400/500/600/700 — Fontshare (`api.fontshare.com`).
- **Instrument Serif** (normal + italic) & **JetBrains Mono** 400/500 — Google Fonts.

## 8. Données (`window.PROJECTS`)

7 projets, ordre = mise en page de la grille. Champs : `id, client, title, year, featured,
vimeo?, still?, pending?, tag{fr,en}, ai, role{fr,en}, desc{fr,en}`.

| id | client | titre | année | film | note |
|---|---|---|---|---|---|
| kinder | Kinder | La Magie de Noël | 2023 | Vimeo 1037503208 | featured |
| tagheuer | TAG Heuer | Baselworld | 2020 | Vimeo 407069287 | featured |
| avene | Avène | Comedomed | 2023 | — | **pending** (slot à remplir) |
| krys | Krys Group | CODIR | 2025 | Vimeo 1073273597 | featured |
| asics | ASICS | Bouge ton esprit | 2023 | Vimeo 887208456 | documentaire |
| fiat | Fiat | Abarth 500e | 2023 | Vimeo 887222473 | 3D & VFX |
| pmu | PMU | Play | 2024 | — | **pending**, `ai:true` (narrative tape IA) |

Durées de clip décoratives dans `sections.jsx → CLIP_DUR`.
Journal : 6 articles bilingues dans `I18N[lang].journal.articles` (corps en blocs typés).

## 9. Assets

- `source/assets/Sorya-Chau-CV.pdf` — PDF du CV (lien de téléchargement sur l'accueil, le CV et
  le contact). À placer dans `public/assets/` côté Vite.
- **Stills de films** : externes — `vumbnail.com/{vimeoId}.jpg` et une image hébergée sur
  `super-motion.com` pour TAG Heuer.
- **Portrait + visuels Journal + projets pending** : `<image-slot>` (déposés par l'utilisateur),
  donc pas de fichier livré.
- **Favicon** : SVG inline data-URI (carré `#241f1a` + « SC »).
- Aucune marque tierce / asset propriétaire à recréer ; les logos clients sont rendus en **texte**
  (marquee), pas en images.

## 10. Accessibilité & SEO à préserver

- `lang` dynamique sur `<html>`, skip-link, fallback `<noscript>` lisible.
- Attributs `aria-*` sur nav, toggles, lightbox (dialog), boutons HUD.
- `index.html` : meta description/keywords, **Open Graph + Twitter**, **JSON-LD** `Person` +
  `ProfilePage` (riche : jobTitle, sameAs LinkedIn, worksFor Super Motion, alumniOf Sorbonne…).
  À reporter intégralement dans la version migrée.
- `prefers-reduced-motion` respecté (intro, reveal, reticle, smooth-scroll).

## 11. Fichiers de ce paquet

```
design_handoff_sorya_portfolio/
├── PROMPT.md            ← prompt prêt à coller dans Claude Code
├── README.md            ← ce document
├── CLAUDE.md            ← règles projet suggérées (à copier à la racine du repo)
├── screenshots/         ← rendus de référence des 4 pages, FR et EN
│   ├── 01-accueil-fr.png      02-accueil-en.png
│   ├── 03-realisations-fr.png 04-realisations-en.png
│   ├── 05-journal-fr.png      06-journal-en.png
│   └── 07-cv-fr.png           08-cv-en.png
└── source/              ← code de référence complet et fonctionnel
    ├── index.html  work.html  blog.html  cv.html
    ├── app.jsx  experience.jsx  nav-hero.jsx  sections.jsx
    ├── work-page.jsx  blog.jsx  cv.jsx
    ├── i18n.js  image-slot.js
    ├── styles.css  components.css  experience.css  work.css  blog.css  cv.css
    └── assets/Sorya-Chau-CV.pdf
```

> Les captures du dossier `screenshots/` montrent le rendu des 4 pages en FR et EN
> (hero/haut de page). Sur l'accueil, les vignettes de films du moniteur de régie sont
> volontairement neutralisées dans la capture (images externes Vimeo) — voir le prototype
> live pour le rendu animé complet.
