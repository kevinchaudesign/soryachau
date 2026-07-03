/* ============================================================
   i18n — bilingual content (FR / EN) + project data
   I18N.fr / I18N.en  ·  PROJECTS
   ============================================================ */
export type Lang = "fr" | "en";

/* Article body block — t: "p" | "h" | "quote" (inferred as string from data) */
export type Block = { t: string; c: string };

export interface Project {
  id: string;
  client: string;
  title: string;
  year: string;
  featured: boolean;
  pending?: boolean;
  ai: boolean;
  vimeo?: string;
  still?: string;
  category?: string; // work-page filter: brand | doc | post | vfx | ai
  tag: Record<Lang, string>;
  role: Record<Lang, string>;
  desc: Record<Lang, string>;
}

export const I18N = {
  fr: {
    nav: { profil: "Profil", work: "Réalisations", journal: "Journal", parcours: "Parcours", contact: "Contact", cv: "CV", cta: "Me contacter" },
    journal: {
      eyebrow: "Journal",
      kicker: "Le Journal",
      title: "Carnets de production, à l'ère de l'IA.",
      lead: "Notes de terrain sur la production audiovisuelle et la direction artistique, à l'heure où l'IA générative entre dans la chaîne. Ce que je teste, apprends et arbitre, plateau après plateau.",
      teaserTitle: "Le Journal",
      teaserLead: "Réflexions sur la production et la direction artistique augmentées par l'IA.",
      readMore: "Lire",
      readArticle: "Lire l'article",
      all: "Tout le Journal",
      back: "Retour au Journal",
      featured: "À la une",
      minRead: "min",
      by: "Sorya Chau",
      next: "Article suivant",
      articles: [
        {
          id: "narrative-tape", cat: "Méthode", date: "Mai 2025", read: "6",
          title: "La narrative tape : valider un film avant le premier clap",
          dek: "Avant d'engager un tournage, l'IA permet de monter une version « témoin » du film. Un outil de décision qui change la conversation avec l'annonceur.",
          body: [
            { t: "p", c: "Sur le projet PMU Play, nous avons fait un pari simple : et si l'on pouvait voir le film avant de le tourner ? Pas un storyboard, pas un animatique approximatif — une véritable narrative tape, montée de bout en bout à partir d'images générées, avec rythme, voix et musique." },
            { t: "p", c: "L'enjeu n'est pas esthétique. Une narrative tape ne remplace pas le film final ; elle sert à décider. Elle met tout le monde — agence, annonceur, réalisateur — devant la même intention, au même moment, avant que le moindre euro de production ne soit engagé." },
            { t: "h", c: "Décider plus tôt, dépenser mieux" },
            { t: "p", c: "Quand un concept est validé sur une tape, les arbitrages de tournage deviennent évidents : on sait quels plans portent l'émotion, lesquels sont décoratifs, où placer le budget. On arrive sur le plateau avec des questions déjà tranchées." },
            { t: "quote", c: "La narrative tape ne fabrique pas le film. Elle fabrique la décision." },
            { t: "p", c: "C'est, je crois, le vrai apport de l'IA en pré-production : non pas produire à la place des équipes, mais réduire l'incertitude assez tôt pour que la création dispose de plus de moyens là où elle compte vraiment." },
          ],
        },
        {
          id: "producteur-augmente", cat: "Vision", date: "Avril 2025", read: "5",
          title: "Producteur augmenté : pourquoi l'IA ne remplacera pas le jugement",
          dek: "Les outils génératifs accélèrent tout — sauf la responsabilité. Le métier de directrice de production se déplace vers ce qui ne s'automatise pas.",
          body: [
            { t: "p", c: "On me demande souvent si l'IA va remplacer les producteurs. La question se trompe de cible. L'IA produit des options ; elle ne porte pas la responsabilité d'un choix devant un client, une équipe et un budget." },
            { t: "p", c: "Mon métier n'a jamais été de fabriquer des images, mais de décider lesquelles méritent d'exister — à quel coût, dans quel délai, avec quels droits. Cette part-là, l'arbitrage, ne s'automatise pas." },
            { t: "h", c: "Ce que la machine rend, c'est du temps" },
            { t: "p", c: "En déléguant les tâches répétitives — déclinaisons, recherches visuelles, premières passes — je récupère des heures. Je les réinvestis dans la relation humaine : le casting, la direction d'équipe, la négociation, le soin du détail." },
            { t: "quote", c: "L'IA déplace le métier vers le haut : moins d'exécution, plus de discernement." },
          ],
        },
        {
          id: "previsualisation", cat: "Workflow", date: "Mars 2025", read: "4",
          title: "Pré-visualisation générative : gagner des jours sur un planning",
          dek: "Moodboards animés, plans complexes simulés, repérages anticipés : la pré-production se compresse sans rien perdre en précision.",
          body: [
            { t: "p", c: "La pré-production est l'endroit où un film se gagne ou se perd. C'est aussi là que l'IA générative a, aujourd'hui, l'impact le plus concret sur un planning." },
            { t: "p", c: "Un moodboard devient animé en quelques heures. Un plan en mouvement complexe se pré-visualise avant de mobiliser une équipe technique. Les allers-retours avec le réalisateur se font sur des images, plus sur des descriptions." },
            { t: "h", c: "Précision plutôt que vitesse" },
            { t: "p", c: "Le gain n'est pas seulement du temps : c'est de la précision. Plus une intention est claire en amont, moins le plateau improvise — et le plateau reste l'heure la plus chère de toute la chaîne." },
          ],
        },
        {
          id: "da-prompt", cat: "Direction artistique", date: "Février 2025", read: "5",
          title: "La direction artistique à l'ère du prompt",
          dek: "Quand générer une image coûte quelques secondes, la valeur se déplace : du faire vers le choisir, du geste vers le regard.",
          body: [
            { t: "p", c: "La direction artistique a toujours consisté à choisir. L'IA ne change pas cette nature ; elle en augmente le volume. Là où l'on explorait trois pistes, on en explore trente." },
            { t: "p", c: "Le risque est connu : la facilité. Générer beaucoup ne fait pas une direction. Une DA tient à un parti pris, une cohérence, un refus. C'est le rôle de l'humain de trancher dans l'abondance." },
            { t: "quote", c: "Le prompt produit des possibilités. La direction artistique, elle, produit un refus." },
            { t: "p", c: "Je vois l'IA comme un atelier infini : précieux tant qu'on y entre avec une intention. Sans regard, ce n'est qu'un générateur de bruit visuel." },
          ],
        },
        {
          id: "budget-ia", cat: "Production", date: "Janvier 2025", read: "4",
          title: "Optimiser un budget de production avec l'IA",
          dek: "Estimation, scénarios de coûts, arbitrages : l'IA devient un copilote de décision financière — à condition de garder la main.",
          body: [
            { t: "p", c: "Un budget de production, c'est une suite d'arbitrages : ce qu'on tourne, ce qu'on simule, ce qu'on achète, ce à quoi l'on renonce. L'IA aide à modéliser ces scénarios bien plus vite." },
            { t: "p", c: "Je m'en sers pour comparer des hypothèses — un jour de tournage de plus contre un plan en 3D, un lieu réel contre un décor généré — et présenter au client des options chiffrées, pas des intuitions." },
            { t: "h", c: "L'outil propose, le producteur engage" },
            { t: "p", c: "Mais un devis engage une responsabilité juridique et humaine. L'estimation reste un point de départ ; la décision, et le risque, restent les miens." },
          ],
        },
        {
          id: "post-production", cat: "Post-production", date: "Décembre 2024", read: "4",
          title: "Post-production assistée : étalonnage et déclinaisons",
          dek: "Du dérushage aux dizaines de formats sociaux, l'IA absorbe la charge répétitive et rend la post à sa vraie valeur : le soin.",
          body: [
            { t: "p", c: "La post-production est devenue une usine à formats : un même film se décline en dizaines de ratios, durées et langues. C'est précisément le type de charge que l'IA absorbe le mieux." },
            { t: "p", c: "Dérushage assisté, premières passes d'étalonnage, déclinaisons multi-formats, sous-titrage : autant d'étapes accélérées qui libèrent les talents pour le travail de finition, là où se joue la qualité perçue." },
            { t: "quote", c: "Automatiser le répétitif, c'est rendre du temps au soin." },
            { t: "p", c: "La technologie ne remplace ni un étalonneur ni un monteur. Elle leur retire la part ingrate pour les concentrer sur la dernière — celle que le spectateur ressent sans savoir la nommer." },
          ],
        },
      ],
    },
    avail: "Disponible — CDI",
    hero: {
      role: "Directrice de Production",
      title1: "Directrice de Production", accent: "augmentée", title2: "",
      sub: "Plus de 20 ans à piloter des productions publicitaires d'exception — désormais dopée à l'intelligence artificielle. J'optimise budgets, délais et créativité pour donner vie à vos campagnes.",
      ctaCV: "Télécharger mon CV", ctaWork: "Découvrir mes projets",
      scroll: "Défiler",
      m1n: "20+", m1l: "ans de production",
      m2n: "8 ans", m2l: "à diriger Super Motion",
      m3n: "3–15", m3l: "talents par production",
    },
    profil: {
      eyebrow: "Profil & Vision",
      title: "La rigueur d'une chef d'orchestre, l'agilité des outils de demain.",
      lead: "Co-fondatrice de Super Motion, je pilote films publicitaires, shootings, contenus social media et campagnes internationales pour des marques iconiques. Au-delà des budgets, j'arbitre les choix créatifs, source les talents et orchestre chaque production — du tournage au motion design, de la 3D aux formats hybrides nourris par l'IA.",
      vision: "Mon métier n'a jamais été de dire non au budget, mais de trouver comment dire oui à la création. L'IA ne remplace pas ce jugement — elle me rend les heures que je réinvestis là où tout se joue : l'image.",
      visionBy: "Sorya Chau",
      portraitHint: "Portrait de Sorya",
      portraitName: "Sorya Chau",
      portraitRole: "Directrice de Production · Paris",
      skillsTitle: "Compétences clés",
      skills: [
        { k: "01", t: "Pilotage de production de A à Z", d: "Conception, direction artistique, devis, planning, casting, tournage, motion, 3D, VFX, post-production et livraison.", ai: false },
        { k: "02", t: "Workflows IA & productivité", d: "Intégration de l'IA générative à la chaîne : pré-visus, narrative tapes, assets de pré-production, accélération des arbitrages.", ai: true },
        { k: "03", t: "Management d'équipes pluridisciplinaires", d: "Direction d'équipes internes et mobilisation de talents externes — 3 à 15 personnes par production.", ai: false },
        { k: "04", t: "Arbitrages financiers & juridiques", d: "Décisionnaire budgétaire et opérationnelle : devis, prestataires, droits d'image, contrats, optimisation des coûts.", ai: false },
      ],
      domainsTitle: "Domaines d'intervention",
      domains: ["Film publicitaire TV", "Social & digital", "Motion design", "3D & VFX", "Documentaire", "Shooting photo", "Post-production", "Narrative tapes IA"],
      formTitle: "Formation",
      form: [
        { t: "Master Design d'Interface", s: "Sorbonne Paris Nord", y: "2006" },
        { t: "Licence Information & Communication", s: "Sorbonne Paris Nord", y: "2004" },
      ],
      langTitle: "Langues",
      langs: [ { l: "Français", v: "Maternelle" }, { l: "Anglais", v: "Pro. courant" }, { l: "Espagnol", v: "Élémentaire" } ],
    },
    workflow: {
      eyebrow: "L'IA comme accélérateur",
      title: "L'intelligence artificielle, intégrée à chaque étape — au service de la production, jamais à sa place.",
      steps: [
        { t: "Conception", d: "Exploration de pistes créatives et moodboards génératifs." },
        { t: "Pré-visualisation", d: "Pré-visus et narrative tapes pour valider un concept avant tournage." },
        { t: "Planning & budget", d: "Optimisation des plannings, estimation et arbitrage des coûts." },
        { t: "Post-production", d: "Assistance au montage, étalonnage et déclinaisons multi-formats." },
      ],
      note: "Outils : Claude · Midjourney · Frame.io · Notion",
    },
    work: {
      eyebrow: "Réalisations & cas d'usage",
      title: "Des productions supervisées de bout en bout.",
      lead: "Une sélection de campagnes pilotées chez Super Motion — du film TV grand public à la narrative tape 100 % générée par IA.",
      roleLabel: "Rôle",
      dropHint: "Déposez votre visuel",
    },
    parcours: {
      eyebrow: "Parcours professionnel",
      title: "Vingt ans au cœur de la production créative.",
      items: [
        { y: "2016 — Aujourd'hui", r: "Directrice de Production & Co-fondatrice", c: "Super Motion", d: "Pilotage des productions de A à Z pour TAG Heuer, Vacheron Constantin, ASICS, Kinder, Fiat, Krys Group, Avène. Décisionnaire opérationnelle et budgétaire, direction de tournage et de post-production." },
        { y: "2014 — 2016", r: "Directrice des opérations & du trafic création", c: "Geometry — WPP", d: "Coordination de projets et de 15 créatifs internes, contrôle budgétaire et reporting client. Mondelez, Coca-Cola, Nestlé, Vogue." },
        { y: "2009 — 2014", r: "Responsable trafic & production vidéo", c: "Publicis Sapient (ex Digitas)", d: "Trafic création et production pour 70 profils internes, freelances et offshore. Achat d'art et coordination vidéo. Hermès, Lancôme, Armani, Hennessy." },
        { y: "2007 — 2009", r: "Responsable trafic & achat d'art", c: "TBWA · Ailleurs Exactement", d: "Pilotage du trafic création, organisation de shootings, sourcing de talents et gestion des droits." },
      ],
    },
    clients: { eyebrow: "Ils m'ont fait confiance", title: "Marques & agences" },
    contact: {
      eyebrow: "Contact",
      title: "Prêt·e à optimiser vos productions avec une approche nouvelle génération ?",
      status: "À l'écoute de nouvelles opportunités — Poste fixe / CDI.",
      email: "chausorya@gmail.com",
      phone: "06 26 92 17 20",
      phoneHref: "+33626921720",
      loc: "Paris / Île-de-France",
      linkedin: "LinkedIn",
      cta: "Écrire à Sorya",
      labels: { email: "Email", phone: "Téléphone", loc: "Localisation", social: "Réseau" },
    },
    footer: { rights: "Tous droits réservés.", built: "Directrice de Production augmentée" },
    cv: {
      back: "Retour au portfolio",
      download: "Télécharger le PDF",
      print: "Imprimer",
      title: "Curriculum Vitæ",
      role: "Directrice de Production",
      profilTitle: "Profil",
      profil: "Directrice de production créative et co-fondatrice de Super Motion, je pilote films publicitaires, shootings photos, contenus social media et campagnes internationales. Au-delà des budgets, j'arbitre les choix créatifs, source les talents et orchestre des productions mêlant tournages, motion design, 3D, IA et formats hybrides.",
      expTitle: "Expériences professionnelles",
      formTitle: "Formation",
      toolsTitle: "Outils",
      langTitle: "Langues",
      contactTitle: "Contact",
      form: [
        { t: "Master Design d'Interface", s: "Université Sorbonne Paris Nord", y: "2005 — 2006" },
        { t: "Licence Information & Communication", s: "Université Sorbonne Paris Nord", y: "2003 — 2004" },
      ],
      langs: [ { l: "Français", v: "Maternelle" }, { l: "Anglais", v: "Professionnel courant" }, { l: "Espagnol", v: "Élémentaire" } ],
      exp: [
        { r: "Directrice de Production & Co-fondatrice", c: "Super Motion", y: "2016 — Aujourd'hui", pts: ["Pilotage des productions de A à Z : conception, direction artistique, devis, planning, casting, tournage, shooting photo, motion design, 3D, post-production, livraison.", "Production internationale : déclinaisons et adaptations multi-marchés.", "Direction de tournage : repérages, castings, constitution de l'équipe technique et créative, logistique, coordination plateau.", "Gestion complète de la post-production : montage, étalonnage, motion design, sound design, retouches, VFX, voix off.", "Direction d'une équipe interne et mobilisation de talents externes : 3 à 15 personnes par production.", "Décisionnaire opérationnelle et budgétaire : prestataires, devis, arbitrages créatifs et financiers en autonomie.", "Veille et intégration des nouveaux formats : exploration des outils d'IA.", "Négociation : droits d'image, contrats comédiens et mannequins."], clients: "TAG Heuer, Vacheron Constantin, ASICS, Krys Group, Avène, La Redoute, Kinder, Samsung, Fiat, Unesco, Publicis, BBDO, TBWA, BETC, Romance" },
        { r: "Directrice des opérations & du trafic création", c: "Geometry (WPP)", y: "Avr. 2014 — Janv. 2016", pts: ["Pilotage des opérations et coordination de projets : priorités, process, plannings et suivi quotidien.", "Gestion des ressources : coordination de 15 créatifs internes et partenaires externes.", "Gestion financière : reporting client, contrôle budgétaire, optimisation de la productivité.", "Gestion des prestataires : sourcing, négociation tarifs, gestion des droits."], clients: "Mondelez, Vogue, Croix Rouge, Coca-Cola, Nestlé, Alcatel" },
        { r: "Responsable trafic & production vidéo", c: "Publicis Sapient (ex Digitas)", y: "Déc. 2009 — Avr. 2014", pts: ["Trafic création et coordination de production : plannings, priorités et livraisons pour 70 profils internes, freelances et offshore.", "Production vidéo : brief et sélection des sociétés de production, budgets, plannings, PPM, suivi et coordination.", "Achat d'art : sourcing de talents, banques d'images, négociation des droits.", "Gestion opérationnelle et financière : optimisation des process, estimation des charges, prévision des dépenses créatives.", "Recrutement : sélection et intégration de profils créatifs."], clients: "Hermès, Lancôme, Armani, Hennessy, Dassault, La Poste, Nissan, Renault" },
        { r: "Responsable trafic & achat d'art", c: "Ailleurs Exactement", y: "Nov. 2008 — Avr. 2009", pts: ["Coordination de productions, organisation de shootings et gestion des talents."], clients: "" },
        { r: "Responsable trafic création", c: "TBWA", y: "Janv. 2007 — Oct. 2008", pts: ["Pilotage du trafic création : plannings, priorités et livraisons pour 40 créatifs internes.", "Gestion des prestataires : sourcing, négociation tarifs et gestion des droits."], clients: "" },
      ],
      tools: ["Notion", "Trello", "Claude", "Frame.io", "Microsoft 365", "Google Workspace", "Photoshop", "Illustrator", "Premiere Pro", "Canva"],
    },
  },

  en: {
    nav: { profil: "Profile", work: "Work", journal: "Journal", parcours: "Career", contact: "Contact", cv: "Résumé", cta: "Get in touch" },
    journal: {
      eyebrow: "Journal",
      kicker: "The Journal",
      title: "Production notebooks, in the age of AI.",
      lead: "Field notes on audiovisual production and art direction, as generative AI enters the pipeline. What I test, learn and weigh up, set after set.",
      teaserTitle: "The Journal",
      teaserLead: "Reflections on production and art direction, augmented by AI.",
      readMore: "Read",
      readArticle: "Read article",
      all: "All entries",
      back: "Back to the Journal",
      featured: "Featured",
      minRead: "min",
      by: "Sorya Chau",
      next: "Next article",
      articles: [
        {
          id: "narrative-tape", cat: "Method", date: "May 2025", read: "6",
          title: "The narrative tape: validating a film before the first take",
          dek: "Before committing to a shoot, AI lets you cut a 'reference' version of the film. A decision tool that changes the conversation with the client.",
          body: [
            { t: "p", c: "On PMU Play we made a simple bet: what if you could see the film before shooting it? Not a storyboard, not a rough animatic — a true narrative tape, edited end to end from generated images, with pace, voice and music." },
            { t: "p", c: "The point isn't aesthetic. A narrative tape doesn't replace the final film; it helps you decide. It puts everyone — agency, client, director — in front of the same intention, at the same moment, before a single euro of production is committed." },
            { t: "h", c: "Decide earlier, spend better" },
            { t: "p", c: "Once a concept is validated on a tape, shooting decisions become obvious: you know which shots carry the emotion, which are decorative, where to put the budget. You arrive on set with the questions already settled." },
            { t: "quote", c: "The narrative tape doesn't make the film. It makes the decision." },
            { t: "p", c: "That, to me, is AI's real contribution in pre-production: not producing in place of the teams, but reducing uncertainty early enough that the creative work gets more resources where it truly counts." },
          ],
        },
        {
          id: "producteur-augmente", cat: "Vision", date: "April 2025", read: "5",
          title: "The augmented producer: why AI won't replace judgement",
          dek: "Generative tools speed up everything — except responsibility. The production director's craft shifts toward what can't be automated.",
          body: [
            { t: "p", c: "I'm often asked whether AI will replace producers. The question misses its target. AI produces options; it doesn't carry the responsibility of a choice in front of a client, a team and a budget." },
            { t: "p", c: "My job was never to make images, but to decide which ones deserve to exist — at what cost, on what timeline, with what rights. That part, the arbitration, doesn't automate." },
            { t: "h", c: "What the machine gives back is time" },
            { t: "p", c: "By delegating repetitive tasks — versioning, visual research, first passes — I recover hours. I reinvest them in the human relationship: casting, leading the team, negotiation, the care for detail." },
            { t: "quote", c: "AI moves the craft upward: less execution, more discernment." },
          ],
        },
        {
          id: "previsualisation", cat: "Workflow", date: "March 2025", read: "4",
          title: "Generative pre-visualisation: winning days on a schedule",
          dek: "Animated moodboards, simulated complex shots, early scouting: pre-production compresses without losing any precision.",
          body: [
            { t: "p", c: "Pre-production is where a film is won or lost. It's also where generative AI has, today, the most concrete impact on a schedule." },
            { t: "p", c: "A moodboard becomes animated in a few hours. A complex moving shot is pre-visualised before mobilising a technical crew. Exchanges with the director happen on images, not on descriptions." },
            { t: "h", c: "Precision over speed" },
            { t: "p", c: "The gain isn't only time: it's precision. The clearer an intention is upstream, the less the set improvises — and the set remains the most expensive hour in the whole chain." },
          ],
        },
        {
          id: "da-prompt", cat: "Art direction", date: "February 2025", read: "5",
          title: "Art direction in the age of the prompt",
          dek: "When generating an image costs seconds, value shifts: from making to choosing, from gesture to eye.",
          body: [
            { t: "p", c: "Art direction has always been about choosing. AI doesn't change that nature; it amplifies its volume. Where you used to explore three directions, you explore thirty." },
            { t: "p", c: "The risk is well known: ease. Generating a lot doesn't make a direction. Art direction rests on a stance, a coherence, a refusal. It's the human's role to cut through the abundance." },
            { t: "quote", c: "The prompt produces possibilities. Art direction produces a refusal." },
            { t: "p", c: "I see AI as an infinite studio: valuable as long as you enter with an intention. Without an eye, it's just a generator of visual noise." },
          ],
        },
        {
          id: "budget-ia", cat: "Production", date: "January 2025", read: "4",
          title: "Optimising a production budget with AI",
          dek: "Estimates, cost scenarios, trade-offs: AI becomes a financial-decision copilot — provided you keep your hands on the wheel.",
          body: [
            { t: "p", c: "A production budget is a sequence of trade-offs: what you shoot, what you simulate, what you buy, what you give up. AI helps model those scenarios far faster." },
            { t: "p", c: "I use it to compare hypotheses — one more shooting day versus a 3D shot, a real location versus a generated set — and present the client with costed options, not hunches." },
            { t: "h", c: "The tool proposes, the producer commits" },
            { t: "p", c: "But a quote commits a legal and human responsibility. The estimate stays a starting point; the decision, and the risk, remain mine." },
          ],
        },
        {
          id: "post-production", cat: "Post-production", date: "December 2024", read: "4",
          title: "Assisted post: grading and versioning",
          dek: "From dailies to dozens of social formats, AI absorbs the repetitive load and returns post to its real value: care.",
          body: [
            { t: "p", c: "Post-production has become a format factory: one film is declined into dozens of ratios, durations and languages. That's exactly the kind of load AI absorbs best." },
            { t: "p", c: "Assisted dailies, first grading passes, multi-format versioning, subtitling: so many accelerated steps that free talent for the finishing work, where perceived quality is decided." },
            { t: "quote", c: "Automating the repetitive means giving time back to care." },
            { t: "p", c: "Technology replaces neither a colourist nor an editor. It takes away the thankless part to focus them on the last one — the part the viewer feels without being able to name it." },
          ],
        },
      ],
    },
    avail: "Available — Full-time",
    hero: {
      role: "Production Director",
      title1: "The", accent: "AI-augmented", title2: "Production Director",
      sub: "20+ years steering award-grade advertising productions — now supercharged by artificial intelligence. I optimise budgets, timelines and creativity to bring your campaigns to life.",
      ctaCV: "Download my résumé", ctaWork: "View my work",
      scroll: "Scroll",
      m1n: "20+", m1l: "years in production",
      m2n: "8 yrs", m2l: "leading Super Motion",
      m3n: "3–15", m3l: "talents per production",
    },
    profil: {
      eyebrow: "Profile & Vision",
      title: "The rigour of a conductor, the agility of tomorrow's tools.",
      lead: "Co-founder of Super Motion, I steer commercials, photo shoots, social content and international campaigns for iconic brands. Beyond budgets, I make the creative calls, source the talent and orchestrate every production — from shoot to motion design, from 3D to AI-fuelled hybrid formats.",
      vision: "My job was never to say no to the budget, but to find how to say yes to the work. AI doesn't replace that judgement — it hands me back the hours I reinvest where it all happens: the image.",
      visionBy: "Sorya Chau",
      portraitHint: "Portrait of Sorya",
      portraitName: "Sorya Chau",
      portraitRole: "Production Director · Paris",
      skillsTitle: "Core competencies",
      skills: [
        { k: "01", t: "End-to-end production leadership", d: "Concept, art direction, quotes, scheduling, casting, shooting, motion, 3D, VFX, post-production and delivery.", ai: false },
        { k: "02", t: "AI workflows & productivity", d: "Generative AI woven into the pipeline: pre-vis, narrative tapes, pre-production assets, faster decision-making.", ai: true },
        { k: "03", t: "Multidisciplinary team management", d: "Leading in-house teams and mobilising external talent — 3 to 15 people per production.", ai: false },
        { k: "04", t: "Financial & legal arbitration", d: "Budget and operational owner: quotes, vendors, image rights, contracts, cost optimisation.", ai: false },
      ],
      domainsTitle: "Fields of work",
      domains: ["TV commercials", "Social & digital", "Motion design", "3D & VFX", "Documentary", "Photo shoots", "Post-production", "AI narrative tapes"],
      formTitle: "Education",
      form: [
        { t: "Master in Interface Design", s: "Sorbonne Paris Nord", y: "2006" },
        { t: "Bachelor in Information & Communication", s: "Sorbonne Paris Nord", y: "2004" },
      ],
      langTitle: "Languages",
      langs: [ { l: "French", v: "Native" }, { l: "English", v: "Professional" }, { l: "Spanish", v: "Elementary" } ],
    },
    workflow: {
      eyebrow: "AI as an accelerator",
      title: "Artificial intelligence, woven into every stage — serving the production, never replacing it.",
      steps: [
        { t: "Conception", d: "Exploring creative directions and generative moodboards." },
        { t: "Pre-visualisation", d: "Pre-vis and narrative tapes to validate a concept before the shoot." },
        { t: "Planning & budget", d: "Optimising schedules, estimating and arbitrating costs." },
        { t: "Post-production", d: "Assisting edit, grading and multi-format deliverables." },
      ],
      note: "Tools: Claude · Midjourney · Frame.io · Notion",
    },
    work: {
      eyebrow: "Work & AI use-cases",
      title: "Productions supervised end to end.",
      lead: "A selection of campaigns steered at Super Motion — from mainstream TV films to a 100% AI-generated narrative tape.",
      roleLabel: "Role",
      dropHint: "Drop your visual",
    },
    parcours: {
      eyebrow: "Career path",
      title: "Twenty years at the heart of creative production.",
      items: [
        { y: "2016 — Present", r: "Production Director & Co-founder", c: "Super Motion", d: "End-to-end production for TAG Heuer, Vacheron Constantin, ASICS, Kinder, Fiat, Krys Group, Avène. Operational and budget owner, shoot and post-production direction." },
        { y: "2014 — 2016", r: "Head of Operations & Creative Traffic", c: "Geometry — WPP", d: "Project coordination and 15 in-house creatives, budget control and client reporting. Mondelez, Coca-Cola, Nestlé, Vogue." },
        { y: "2009 — 2014", r: "Head of Traffic & Video Production", c: "Publicis Sapient (ex Digitas)", d: "Creative traffic and production across 70 internal, freelance and offshore profiles. Art-buying and video coordination. Hermès, Lancôme, Armani, Hennessy." },
        { y: "2007 — 2009", r: "Head of Traffic & Art-Buying", c: "TBWA · Ailleurs Exactement", d: "Creative traffic management, shoot organisation, talent sourcing and rights management." },
      ],
    },
    clients: { eyebrow: "Trusted by", title: "Brands & agencies" },
    contact: {
      eyebrow: "Contact",
      title: "Ready to optimise your productions with a next-generation approach?",
      status: "Open to new opportunities — permanent / full-time role.",
      email: "chausorya@gmail.com",
      phone: "+33 6 26 92 17 20",
      phoneHref: "+33626921720",
      loc: "Paris / Île-de-France",
      linkedin: "LinkedIn",
      cta: "Email Sorya",
      labels: { email: "Email", phone: "Phone", loc: "Location", social: "Social" },
    },
    footer: { rights: "All rights reserved.", built: "The AI-augmented Production Director" },
    cv: {
      back: "Back to portfolio",
      download: "Download PDF",
      print: "Print",
      title: "Résumé",
      role: "Production Director",
      profilTitle: "Profile",
      profil: "Creative production director and co-founder of Super Motion, I steer commercials, photo shoots, social content and international campaigns. Beyond budgets, I make the creative calls, source the talent and orchestrate productions blending shoots, motion design, 3D, AI and hybrid formats.",
      expTitle: "Professional experience",
      formTitle: "Education",
      toolsTitle: "Tools",
      langTitle: "Languages",
      contactTitle: "Contact",
      form: [
        { t: "Master in Interface Design", s: "Université Sorbonne Paris Nord", y: "2005 — 2006" },
        { t: "Bachelor in Information & Communication", s: "Université Sorbonne Paris Nord", y: "2003 — 2004" },
      ],
      langs: [ { l: "French", v: "Native" }, { l: "English", v: "Professional working" }, { l: "Spanish", v: "Elementary" } ],
      exp: [
        { r: "Production Director & Co-founder", c: "Super Motion", y: "2016 — Present", pts: ["End-to-end production: concept, art direction, quotes, scheduling, casting, shooting, photo, motion design, 3D, post-production, delivery.", "International production: multi-market versioning and adaptation.", "Shoot direction: scouting, casting, building the technical and creative crew, logistics, on-set coordination.", "Full post-production management: edit, grading, motion design, sound design, retouching, VFX, voice-over.", "Leading an in-house team and mobilising external talent: 3 to 15 people per production.", "Operational and budget owner: vendors, quotes, creative and financial arbitration, autonomously.", "Watch and integration of new formats: exploring AI tools.", "Negotiation: image rights, actor and model contracts."], clients: "TAG Heuer, Vacheron Constantin, ASICS, Krys Group, Avène, La Redoute, Kinder, Samsung, Fiat, Unesco, Publicis, BBDO, TBWA, BETC, Romance" },
        { r: "Head of Operations & Creative Traffic", c: "Geometry (WPP)", y: "Apr. 2014 — Jan. 2016", pts: ["Operations and project coordination: priorities, processes, schedules and daily follow-up.", "Resource management: coordinating 15 in-house creatives and external partners.", "Financial management: client reporting, budget control, productivity optimisation.", "Vendor management: sourcing, rate negotiation, rights management."], clients: "Mondelez, Vogue, Croix Rouge, Coca-Cola, Nestlé, Alcatel" },
        { r: "Head of Traffic & Video Production", c: "Publicis Sapient (ex Digitas)", y: "Dec. 2009 — Apr. 2014", pts: ["Creative traffic and production coordination: schedules, priorities and deliveries for 70 internal, freelance and offshore profiles.", "Video production: briefing and selecting production companies, budgets, schedules, PPM, follow-up and coordination.", "Art-buying: talent sourcing, image banks, rights negotiation.", "Operational and financial management: process optimisation, production cost estimation, forecasting of creative spend.", "Recruitment: selecting and onboarding creative profiles."], clients: "Hermès, Lancôme, Armani, Hennessy, Dassault, La Poste, Nissan, Renault" },
        { r: "Head of Traffic & Art-Buying", c: "Ailleurs Exactement", y: "Nov. 2008 — Apr. 2009", pts: ["Production coordination, shoot organisation and talent management."], clients: "" },
        { r: "Head of Creative Traffic", c: "TBWA", y: "Jan. 2007 — Oct. 2008", pts: ["Creative traffic management: schedules, priorities and deliveries for 40 in-house creatives.", "Vendor management: sourcing, rate negotiation and rights management."], clients: "" },
      ],
      tools: ["Notion", "Trello", "Claude", "Frame.io", "Microsoft 365", "Google Workspace", "Photoshop", "Illustrator", "Premiere Pro", "Canva"],
    },
  },
};

/* — Projects (bilingual fields inline) · Order = on-page layout.
   Five carry real Super Motion films (vimeo + still). Avène & PMU are
   prepared drop slots (pending) — add `vimeo` + `still` to go live. — */
export const PROJECTS: Project[] = [
  {
    id: "kinder", client: "Kinder", title: "La Magie de Noël",
    year: "2023", featured: true,
    vimeo: "1037503208", still: "https://vumbnail.com/1037503208.jpg",
    tag: { fr: "Film TV & Digital", en: "TV & Digital film" }, ai: false,
    role: { fr: "Direction de production", en: "Production direction" },
    desc: {
      fr: "Pour les fêtes, célébrer la magie de Noël à travers des films diffusés en TV et digital. La magie simple d'un geste, un moment de complicité entre parents et enfants où l'amour se traduit sans paroles.",
      en: "For the holidays, celebrating the magic of Christmas across TV and digital films. The simple magic of a gesture — a moment of closeness between parents and children, where love needs no words.",
    },
  },
  {
    id: "tagheuer", client: "TAG Heuer", title: "Baselworld",
    year: "2020", featured: true,
    vimeo: "407069287", still: "https://super-motion.com/wp-content/uploads/2020/03/01_tag_heuer.jpg",
    tag: { fr: "Film de marque", en: "Brand film" }, ai: false,
    role: { fr: "Direction de production", en: "Production direction" },
    desc: {
      fr: "Cinq garde-temps iconiques dévoilés pour Baselworld, premier salon mondial de l'horlogerie et de la joaillerie. Un travail précis du cadre, de la lumière et du rythme, à la hauteur du savoir-faire avant-gardiste de la maison.",
      en: "Five iconic timepieces unveiled for Baselworld, the world's leading watch and jewellery show. Precise work on framing, light and pacing — matching the maison's avant-garde savoir-faire.",
    },
  },
  {
    id: "avene", client: "Avène", title: "Comedomed",
    year: "2023", featured: true, pending: true,
    tag: { fr: "Post-production", en: "Post-production" }, ai: false,
    role: { fr: "Direction post-production", en: "Post-production direction" },
    desc: {
      fr: "Sur la campagne digitale d'Avène, accompagnement de Leo Burnett sur l'ensemble de la post-production. Un travail minutieux sur la couleur, la texture de la peau et la justesse des retouches, pour un rendu naturel et premium.",
      en: "On Avène's digital campaign, supporting Leo Burnett across the full post-production. Meticulous work on colour, skin texture and retouching precision, for a result both natural and premium.",
    },
  },
  {
    id: "krys", client: "Krys Group", title: "CODIR",
    year: "2025", featured: true,
    vimeo: "1073273597", still: "https://vumbnail.com/1073273597.jpg",
    tag: { fr: "Film de marque", en: "Brand film" }, ai: false,
    role: { fr: "Direction de production", en: "Production direction" },
    desc: {
      fr: "Pour la modernisation du centre de production CODIR, un film dédié à la fabrication des verres. À travers les gestes de celles et ceux qui les créent, un hommage à la précision et au savoir-faire Made in France.",
      en: "For the modernisation of the CODIR production centre, a film dedicated to lens-making. Through the gestures of those who craft them, a tribute to precision and Made-in-France savoir-faire.",
    },
  },
  {
    id: "asics", client: "ASICS", title: "Bouge ton esprit",
    year: "2023", featured: false,
    vimeo: "887208456", still: "https://vumbnail.com/887208456.jpg",
    tag: { fr: "Documentaire", en: "Documentary" }, ai: false,
    role: { fr: "Direction de production longue durée", en: "Long-form production direction" },
    desc: {
      fr: "Avec la Ville de Paris, ASICS rend le sport plus accessible et inclusif pour la santé physique et mentale des Parisiens. Un film documentaire pensé comme un manifeste du mouvement.",
      en: "With the City of Paris, ASICS makes sport more accessible and inclusive for Parisians' physical and mental health. A documentary film conceived as a manifesto for movement.",
    },
  },
  {
    id: "fiat", client: "Fiat", title: "Abarth 500e",
    year: "2023", featured: false,
    vimeo: "887222473", still: "https://vumbnail.com/887222473.jpg",
    tag: { fr: "3D & VFX", en: "3D & VFX" }, ai: false,
    role: { fr: "Production 3D & post", en: "3D & post production" },
    desc: {
      fr: "Abarth pique au scorpion la nouvelle Fiat 500e, qui sillonne les rues de Rome dans une course contre la montre. Plans 3D et post-production assurant la transition entre film de campagne et film produit.",
      en: "Abarth stings the new Fiat 500e with its scorpion as it races through the streets of Rome against the clock. 3D shots and post bridging the campaign film and the product film.",
    },
  },
  {
    id: "pmu", client: "PMU", title: "Play",
    year: "2024", featured: false, pending: true,
    tag: { fr: "Supervision IA", en: "AI supervision" }, ai: true,
    role: { fr: "Direction de production · Supervision IA", en: "Production direction · AI supervision" },
    desc: {
      fr: "Une narrative tape intégralement réalisée en IA — direction artistique, visuels et montage — pour tester l'efficacité du film avant le premier jour de tournage. Validation du concept en conditions réelles.",
      en: "A narrative tape entirely produced with AI — art direction, visuals and edit — to test the film's effectiveness before day one of the shoot. Concept validated in real conditions.",
    },
  },
];

export type Messages = typeof I18N.fr;
export type Article = Messages["journal"]["articles"][number];
