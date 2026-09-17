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
  vimeo?: string;   // historique : anciens films hébergés sur Vimeo
  youtube?: string; // identifiant YouTube — source actuelle
  still?: string;
  category?: string; // work-page filter: brand | doc | post | vfx | ai
  tag: Record<Lang, string>;
  role: Record<Lang, string>;
  desc: Record<Lang, string>;
  /* Récit du projet, tel que Sorya l'a écrit. L'anglais peut être
     vide tant qu'il n'est pas traduit : l'affichage retombe alors
     sur le français. */
  challenge?: Record<Lang, string>;
  contribution?: Record<Lang, string>;
  outcome?: Record<Lang, string>;
}

export const I18N = {
  fr: {
    nav: { approche: "Approche", expertises: "Expertises", projets: "Projets", apropos: "À propos", journal: "Journal", contact: "Contact", cv: "CV", cta: "Me contacter" },
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
          id: "producteur-augmente", cat: "Vision", date: "Septembre 2026", read: "5",
          title: "Producteur : pourquoi l'IA ne remplacera pas le jugement créatif et humain ?",
          dek: "Les outils génératifs accélèrent tout, sauf la responsabilité. Le métier de directrice de production se déplace vers ce qui ne s'automatise pas.",
          body: [
            { t: "p", c: "On me demande souvent si l'IA va remplacer les producteurs. La question se trompe de cible. L'IA produit des options ; elle ne porte pas la responsabilité d'un choix devant un client, une équipe et un budget." },
            { t: "p", c: "Mon métier n'a jamais été de fabriquer des images, mais de décider lesquelles méritent d'exister : à quel coût, dans quel délai, avec quels droits. Cette part, l'arbitrage, ne s'automatise pas." },
            { t: "h", c: "Ce que la machine rend, c'est du temps" },
            { t: "p", c: "En déléguant les tâches répétitives, comme les déclinaisons, les recherches visuelles ou les premières passes, je récupère des heures. Je les réinvestis dans la relation humaine : le casting, la direction d'équipe, la négociation, le soin du détail." },
            { t: "quote", c: "L'IA déplace le métier vers le haut : moins d'exécution, plus de discernement." },
          ],
        },
        {
          id: "da-prompt", cat: "Direction artistique", date: "Septembre 2026", read: "5",
          title: "La direction artistique à l'ère du prompt",
          dek: "Quand générer une image coûte quelques secondes, la valeur se déplace : du faire vers le choisir, du geste vers le regard.",
          body: [
            { t: "p", c: "La direction artistique a toujours consisté à choisir. L'IA ne change pas cette nature ; elle en augmente le volume. Là où l'on explorait trois pistes, on en explore trente." },
            { t: "p", c: "Le risque est connu : la facilité. Générer beaucoup ne fait pas une direction. Une DA tient à un parti pris, une cohérence, un refus. C'est le rôle de l'humain de trancher dans l'abondance." },
            { t: "quote", c: "Le prompt produit des possibilités. La direction artistique, elle, produit un refus." },
            { t: "p", c: "Je vois l'IA comme un atelier infini : précieux tant qu'on y entre avec une intention. Sans regard, ce n'est qu'un générateur de bruit visuel." },
          ],
        },
      ],
    },
    avail: "Disponible — au projet, au forfait ou en renfort",
    hero: {
      role: "Directrice de production",
      title1: "Directrice", accent: "de production", title2: "",
      sub: "Les idées méritent les bonnes conditions pour exister. J'accompagne les agences, studios et marques dans la réalisation de projets créatifs exigeants, afin que les équipes puissent donner le meilleur d'elles-mêmes.",
      ctaCV: "Télécharger mon CV", ctaWork: "Voir mes projets",
      scroll: "Défiler",
      m1n: "20 ans", m1l: "d'expérience dans la production créative",
      m2n: "10 ans", m2l: "à diriger Super Motion",
    },
    approche: {
      eyebrow: "Approche",
      title: "Une bonne production ne se remarque pas seulement à ce qui est livré.",
      lead: "Elle se ressent dans la façon dont le projet a été vécu.",
      body: [
        "Lorsque la préparation est insuffisante, les décisions se prennent dans l'urgence. Les budgets se tendent, les plannings se fragilisent et les équipes travaillent sous pression.",
        "Mon rôle est de créer un cadre clair, d'anticiper les décisions importantes et de réunir les bonnes personnes au bon moment.",
      ],
      methodTitle: "Ma manière de travailler",
      methodLead: "Je n'arrive pas avec une méthode figée. Chaque projet possède ses propres contraintes, son propre rythme et ses propres enjeux.",
      methodLead2: "En revanche, certains principes restent constants.",
      principles: [
        "Créer une équipe adaptée au projet.",
        "Clarifier les responsabilités dès le départ.",
        "Anticiper les décisions qui auront le plus d'impact.",
        "Préserver une communication simple et fluide.",
        "Permettre aux créatifs de se concentrer sur leur métier.",
      ],
      signature: "Le calme d'une production n'est jamais le fruit du hasard. C'est le résultat d'une préparation exigeante.",
      signatureBy: "Sorya Chau",
      portraitHint: "Portrait de Sorya",
      portraitName: "Sorya Chau",
      portraitRole: "Directrice de production",
    },
    expertises: {
      eyebrow: "Expertises",
      title: "Trois façons de travailler ensemble.",
      items: [
        { k: "01", t: "Direction de production", hook: "Vous avez un projet ambitieux à produire.", d: "Je prends en charge la production de bout en bout : cadrage, budget, planning, constitution de l'équipe, préparation, tournage, shooting photo, coordination, suivi de production et post-production, livraison.", out: "Vous avez une interlocutrice unique, une visibilité claire sur le projet et une production maîtrisée." },
        { k: "02", t: "Renfort de production", hook: "Votre équipe est en place mais elle a besoin de renfort.", d: "Surcharge d'activité, projet complexe ou besoin d'une expertise senior : j'intègre votre équipe pour renforcer sa capacité de production. Je peux prendre en charge la production exécutive d'un projet ou intervenir en renfort de vos équipes, en direct comme en marque blanche.", out: "Vous bénéficiez immédiatement d'une expertise senior, sans recruter ni réorganiser votre équipe." },
        { k: "03", t: "Conseil et organisation", hook: "Vos projets se multiplient mais votre organisation ne suit plus.", d: "J'analyse votre fonctionnement et vous accompagne dans la structuration de votre production : méthodes de brief et de chiffrage, outils de suivi, organisation des équipes, cadrage des prestataires et choix des modes de production. L'objectif : clarifier les rôles, fluidifier les échanges et donner à vos équipes les outils nécessaires pour travailler de manière plus autonome.", out: "Une organisation plus claire permet de gagner en efficacité et en sérénité, tout en restant agile face à chaque nouveau projet." },
      ],
      prodLabel: "Types de productions",
      prod: ["Tournage", "Shooting photo", "Motion design", "3D", "IA"],
      prodNote: "et le plus souvent, une combinaison de plusieurs.",
      projLabel: "Types de projets",
      proj: ["Film", "Campagne", "Social media", "Contenus digitaux et e-commerce", "Film institutionnel"],
      note: "J'interviens au projet, au forfait ou en renfort régulier, à Paris ou à distance. Devis clair sous 48 h après un premier échange.",
    },
    work: {
      eyebrow: "Projets",
      title: "Des productions supervisées de bout en bout.",
      lead: "Une sélection de projets pilotés de la préparation à la livraison : film, campagne, shooting, post-production.",
      roleLabel: "Rôle",
      labels: { challenge: "Le défi", contribution: "Mon rôle", outcome: "Le résultat" },
      dropHint: "Déposez votre visuel",
    },
    apropos: {
      eyebrow: "À propos",
      title: "À propos",
      body: [
        "Pour moi, une bonne production ne se résume pas à tenir un planning ou à respecter un budget. Elle se construit avant tout dans la qualité des échanges et dans la capacité à créer un environnement où chacun peut donner le meilleur de lui-même.",
        "Depuis près de vingt ans, j'accompagne la réalisation de projets créatifs. Après avoir forgé mon expérience chez Publicis, Ogilvy et TBWA, j'ai co-fondé Super Motion, une maison de création que j'ai développée pendant dix ans. Aujourd'hui, j'interviens en indépendante pour piloter des productions exigeantes, en France comme à l'international.",
        "Au fil de mon parcours, j'ai constitué un réseau solide de talents et de partenaires de confiance. Au-delà de la méthode, la réussite d'un projet repose avant tout sur l'humain : réunir les bonnes expertises, donner de la visibilité aux équipes, anticiper les décisions clés et préserver un climat de confiance.",
        "Ce double parcours d'entrepreneure et de directrice de production me permet de mettre ce réseau au service de chaque projet.",
      ],
    },
    clients: { eyebrow: "Ils m'ont fait confiance", title: "Marques & agences" },
    contact: {
      eyebrow: "Contact",
      title: "Chaque projet commence par une conversation.",
      lead: "Un premier échange permet de comprendre vos enjeux, vos contraintes et la manière dont je peux vous accompagner.",
      status: "Disponible — au projet, au forfait ou en renfort.",
      email: "chausorya@gmail.com",
      phone: "06 26 92 17 20",
      phoneHref: "+33626921720",
      loc: "Paris / Île-de-France",
      linkedin: "LinkedIn",
      cta: "Écrire à Sorya",
      labels: { email: "Email", phone: "Téléphone", loc: "Localisation", social: "Réseau" },
    },
    footer: { rights: "Tous droits réservés.", built: "Directrice de production" },
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
        { r: "Directrice de Production & Co-fondatrice", c: "Super Motion", y: "2016 — Aujourd'hui", pts: ["Pilotage de projets photo et vidéo de A à Z : brief, kick-off, PPM, conception, DA, devis, planning, repérage, casting, tournage, shooting, post-production, livraison.", "Campagne 360 : adaptation des contenus pour tous les points de contact (digital, social media, print, retail, campagnes internationales).", "Direction de tournage : repérages, castings, constitution de l'équipe technique et créative, logistique, plan de travail et coordination plateau.", "Direction de shooting : brief créatif, sélection des talents (photographe, styliste, maquilleur), casting et coordination plateau.", "Gestion complète de la post-production : montage, étalonnage, motion design, 3D, IA, sound design, VFX, voix off, retouches photos.", "Process et outils de cadrage : méthodologie, brief de production, shooting objectives.", "Direction d'une équipe interne et mobilisation de talents externes : 3 à 15 personnes par production en moyenne.", "Décisionnaire opérationnelle et budgétaire : choix des prestataires, validation des devis et dépenses, rentabilité, reporting financier.", "Veille créative : tendances visuelles, nouveaux talents, outils IA.", "Négociation : droits d'image, contrats comédiens et mannequins."], clients: "BETC, Publicis, BBDO, TBWA, Romance, TAG Heuer, Vacheron Constantin, La Redoute, Asics, Krys Group, Avène, Kinder, Samsung, Fiat, Unesco" },
        { r: "Directrice des opérations & du trafic création", c: "Geometry (WPP)", y: "Avr. 2014 — Janv. 2016", pts: ["Pilotage des opérations et coordination de projets digitaux et print : gestion des priorités, optimisation des process, plannings et suivi quotidien.", "Gestion des ressources : coordination de 15 créatifs internes et partenaires externes.", "Gestion financière : reporting client, contrôle budgétaire, gestion des dépenses externes et optimisation de la productivité.", "Gestion des prestataires : sourcing, négociation tarifs et gestion des droits."], clients: "Piaget, Vogue, Croix Rouge, Coca-Cola, Nestlé, Alcatel" },
        { r: "Responsable achat d'art & production créative", c: "Razorfish (ex Digitas)", y: "Déc. 2009 — Avr. 2014", pts: ["Production vidéo : brief et sélection des sociétés de production, gestion des budgets et plannings, PPM, suivi de production et coordination des équipes.", "Pilotage du trafic création et coordination de production digitale : gestion des plannings, des priorités et des livraisons pour 70 profils internes et freelances.", "Achat d'art : sourcing de talents, gestion des banques d'images et négociation des droits.", "Gestion opérationnelle et financière : optimisation des process et outils, estimation des charges de production, analyse et prévision des dépenses créatives.", "Recrutement : sélection et intégration de profils créatifs internes."], clients: "Hermès, Lancôme, Armani, Hennessy, Dassault, La Poste, Nissan, Renault" },
        { r: "Responsable trafic & achat d'art", c: "Ailleurs Exactement", y: "Nov. 2008 — Avr. 2009", pts: ["Coordination de productions, organisation de shootings et gestion des talents."], clients: "" },
        { r: "Responsable trafic création", c: "TBWA", y: "Janv. 2007 — Oct. 2008", pts: ["Pilotage du trafic création : gestion des plannings, des priorités et des livraisons pour 40 créatifs internes.", "Gestion des prestataires : sourcing, négociation tarifs et gestion des droits."], clients: "" },
      ],
      tools: ["Notion", "Trello", "Claude", "Frame.io", "Microsoft 365", "Google Workspace", "Photoshop", "Illustrator", "Premiere Pro", "Canva"],
    },
  },

  en: {
    nav: { approche: "Approach", expertises: "Services", projets: "Projects", apropos: "About", journal: "Journal", contact: "Contact", cv: "Résumé", cta: "Get in touch" },
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
          id: "producteur-augmente", cat: "Vision", date: "September 2026", read: "5",
          title: "Producer: why AI will not replace creative and human judgement",
          dek: "Generative tools speed up everything, except responsibility. The production director's craft shifts toward what cannot be automated.",
          body: [
            { t: "p", c: "I'm often asked whether AI will replace producers. The question misses its target. AI produces options; it doesn't carry the responsibility of a choice in front of a client, a team and a budget." },
            { t: "p", c: "My job was never to make images, but to decide which ones deserve to exist: at what cost, on what timeline, with what rights. That part, the arbitration, doesn't automate." },
            { t: "h", c: "What the machine gives back is time" },
            { t: "p", c: "By delegating repetitive tasks, such as versioning, visual research or first passes, I recover hours. I reinvest them in the human relationship: casting, leading the team, negotiation, the care for detail." },
            { t: "quote", c: "AI moves the craft upward: less execution, more discernment." },
          ],
        },
        {
          id: "da-prompt", cat: "Art direction", date: "September 2026", read: "5",
          title: "Art direction in the age of the prompt",
          dek: "When generating an image costs seconds, value shifts: from making to choosing, from gesture to eye.",
          body: [
            { t: "p", c: "Art direction has always been about choosing. AI doesn't change that nature; it amplifies its volume. Where you used to explore three directions, you explore thirty." },
            { t: "p", c: "The risk is well known: ease. Generating a lot doesn't make a direction. Art direction rests on a stance, a coherence, a refusal. It's the human's role to cut through the abundance." },
            { t: "quote", c: "The prompt produces possibilities. Art direction produces a refusal." },
            { t: "p", c: "I see AI as an infinite studio: valuable as long as you enter with an intention. Without an eye, it's just a generator of visual noise." },
          ],
        },
      ],
    },
    avail: "Available — per project, fixed fee or ongoing support",
    hero: {
      role: "Production Director",
      title1: "Production", accent: "director", title2: "",
      sub: "Ideas deserve the right conditions to exist. I help agencies, studios and brands deliver demanding creative projects, so that teams can do their best work.",
      ctaCV: "Download my résumé", ctaWork: "See my projects",
      scroll: "Scroll",
      m1n: "20 years", m1l: "in creative production",
      m2n: "10 years", m2l: "leading Super Motion",
    },
    approche: {
      eyebrow: "Approach",
      title: "A good production isn't judged on what gets delivered alone.",
      lead: "It is felt in the way the project was lived through.",
      body: [
        "When preparation falls short, decisions get made in a rush. Budgets tighten, schedules grow fragile and teams work under pressure.",
        "My role is to set a clear frame, anticipate the decisions that matter and bring the right people together at the right moment.",
      ],
      methodTitle: "How I work",
      methodLead: "I don't arrive with a fixed method. Every project has its own constraints, its own rhythm and its own stakes.",
      methodLead2: "A few principles, though, never change.",
      principles: [
        "Build a team that fits the project.",
        "Make responsibilities clear from the start.",
        "Anticipate the decisions with the greatest impact.",
        "Keep communication simple and fluid.",
        "Let the creatives focus on their craft.",
      ],
      signature: "The calm of a production is never down to luck. It is the result of demanding preparation.",
      signatureBy: "Sorya Chau",
      portraitHint: "Portrait of Sorya",
      portraitName: "Sorya Chau",
      portraitRole: "Production Director",
    },
    expertises: {
      eyebrow: "Services",
      title: "Three ways of working together.",
      items: [
        { k: "01", t: "Production direction", hook: "You have an ambitious project to produce.", d: "I take on the production end to end: framing, budget, schedule, crewing, pre-production, filming, photo shoots, coordination, production and post-production follow-up, delivery.", out: "You have a single point of contact, clear visibility on the project and a production under control." },
        { k: "02", t: "Production support", hook: "Your team is in place but needs reinforcement.", d: "Peak workload, complex project or a need for senior expertise: I join your team to extend its production capacity. I can take on executive production for a project or work alongside your teams, directly or white-label.", out: "You get senior expertise straight away, without hiring or reorganising your team." },
        { k: "03", t: "Consulting and organisation", hook: "Your projects are multiplying but your organisation can't keep up.", d: "I review how you work and help you structure your production: briefing and estimating methods, tracking tools, team organisation, vendor framing and choice of production models. The aim: clarify roles, smooth exchanges and give your teams what they need to work more autonomously.", out: "A clearer organisation means more efficiency and more calm, while staying agile on every new project." },
      ],
      prodLabel: "Production types",
      prod: ["Film shoots", "Photo shoots", "Motion design", "3D", "AI"],
      prodNote: "and most often, a combination of several.",
      projLabel: "Project types",
      proj: ["Film", "Campaign", "Social media", "Digital and e-commerce content", "Corporate film"],
      note: "I work per project, on a fixed fee or as ongoing support, in Paris or remotely. A clear quote within 48 h of a first conversation.",
    },
    work: {
      eyebrow: "Projects",
      title: "Productions supervised end to end.",
      lead: "A selection of projects steered from preparation to delivery: film, campaign, photo shoot, post-production.",
      roleLabel: "Role",
      labels: { challenge: "The challenge", contribution: "My role", outcome: "The outcome" },
      dropHint: "Drop your visual",
    },
    apropos: {
      eyebrow: "About",
      title: "About",
      body: [
        "To me, a good production is not just about holding a schedule or staying within budget. It is built first in the quality of the exchanges, and in the ability to create an environment where everyone can do their best work.",
        "For close to twenty years I have helped creative projects come to life. After building my experience at Publicis, Ogilvy and TBWA, I co-founded Super Motion, a creative house I grew over ten years. Today I work independently, running demanding productions in France and internationally.",
        "Along the way I have built a solid network of talents and trusted partners. Beyond method, a project succeeds on people: bringing the right expertise together, giving teams visibility, anticipating key decisions and keeping trust intact.",
        "That double path as an entrepreneur and a production director is what lets me put this network to work on every project.",
      ],
    },
    clients: { eyebrow: "Trusted by", title: "Brands & agencies" },
    contact: {
      eyebrow: "Contact",
      title: "Every project starts with a conversation.",
      lead: "A first exchange is how I understand your stakes, your constraints and how I can help.",
      status: "Available — per project, fixed fee or ongoing support.",
      email: "chausorya@gmail.com",
      phone: "+33 6 26 92 17 20",
      phoneHref: "+33626921720",
      loc: "Paris / Île-de-France",
      linkedin: "LinkedIn",
      cta: "Email Sorya",
      labels: { email: "Email", phone: "Phone", loc: "Location", social: "Social" },
    },
    footer: { rights: "All rights reserved.", built: "Production Director" },
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
        { r: "Production Director & Co-founder", c: "Super Motion", y: "2016 — Present", pts: ["End-to-end photo and video project management: brief, kick-off, PPM, concept, art direction, estimates, planning, location scouting, casting, filming, shooting, post-production, delivery.", "360 campaigns: content adaptation for all touchpoints (digital, social media, print, retail, international campaigns, lookbooks).", "Shoot and photo direction: creative brief, location scouting, casting, talent selection (director, photographer, DOP, set designer, stylist, makeup artist), creative and technical team management, logistics, work plan and on-set coordination.", "Full post-production management: editing, colour grading, motion design, 3D, AI, sound design, VFX, voiceover, photo retouching.", "Process and framing tools: methodology, production brief, shooting objectives.", "Team leadership: leading a permanent in-house team and engaging external creative talents (3 to 15 people per production on average).", "Asset management: implementing content management processes.", "Operational and budget decision-maker: supplier selection, estimate and expense approval, profitability, financial reporting.", "Innovation watch and new formats: visual trends, emerging talents, AI tools.", "Negotiation: image rights, actor, model and talent contracts."], clients: "BETC, Publicis, BBDO, TBWA, Romance, TAG Heuer, Vacheron Constantin, La Redoute, Asics, Krys Group, Avène, Kinder, Samsung, Fiat, Unesco" },
        { r: "Head of Operations & Creative Traffic", c: "Geometry (WPP)", y: "Apr. 2014 — Jan. 2016", pts: ["Operations management and digital/print project coordination: priority management, process optimisation, scheduling and daily follow-up.", "Resource management: coordination of 15 in-house creatives and external partners.", "Financial management: estimates, expense approval, profitability, financial reporting and productivity optimisation.", "Supplier management: sourcing, rate negotiation and rights management."], clients: "Piaget, Vogue, Croix Rouge, Coca-Cola, Nestlé, Alcatel" },
        { r: "Art Buying & Creative Production Manager", c: "Razorfish (ex Digitas)", y: "Dec. 2009 — Apr. 2014", pts: ["Video production: brief and production company selection, budget and schedule management, PPM, production follow-up and team coordination.", "Creative traffic and digital production coordination: schedule, priority and delivery management for 70 in-house creatives and freelance profiles.", "Art buying: talent sourcing, image bank management and rights negotiation.", "Operational and financial management: process and tool optimisation, production estimates, creative expense analysis and forecasting.", "Recruitment: selection and onboarding of in-house creative profiles."], clients: "Hermès, Lancôme, Armani, Hennessy, Dassault, La Poste, Nissan, Renault" },
        { r: "Traffic & Art Buying Manager", c: "Ailleurs Exactement", y: "Nov. 2008 — Apr. 2009", pts: ["Production coordination, shoot organisation and talent management."], clients: "" },
        { r: "Creative Traffic Manager", c: "TBWA", y: "Jan. 2007 — Oct. 2008", pts: ["Creative traffic management: schedule, priority and delivery management for 40 in-house creatives.", "Supplier management: sourcing, rate negotiation and rights management."], clients: "" },
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
    year: "2023", featured: true, category: "brand",
    youtube: "rYsz7y2RcwE", still: "https://nlgfcrkmeslbkqqgatzq.supabase.co/storage/v1/object/public/media/lib/kinder-e1013d.avif",
    tag: { fr: "Campagne publicitaire : TV, digital et réseaux sociaux", en: "Advertising campaign: TV, digital and social media" }, ai: false,
    role: { fr: "Direction de production", en: "Production direction" },
    desc: { fr: "Campagne de Noël déclinée en TV, digital et réseaux sociaux, tournée avec des enfants sur un planning de diffusion non négociable.", en: "A Christmas campaign rolled out across TV, digital and social media, shot with children against a non-negotiable air date." },
    challenge: { fr: "Kinder devait lancer sa campagne de Noël simultanément en TV, digital et réseaux sociaux, avec de nombreux livrables à produire sur un planning de diffusion non négociable. Le tout avec une exigence forte : préserver la sincérité de l'émotion malgré l'ampleur du dispositif et la présence d'enfants sur le plateau.", en: "Kinder had to launch its Christmas campaign simultaneously on TV, digital and social media, with a long list of deliverables to produce against a non-negotiable air date. All of it with one demanding requirement: keeping the emotion sincere despite the scale of the setup and the presence of children on set." },
    contribution: { fr: "J'ai défini et coordonné les équipes créatives, la production et la post-production sur l'ensemble des livrables. Le plan de tournage a été construit autour du rythme des enfants et non l'inverse. Je suis restée sur le plateau à chaque étape, pour préserver la spontanéité de l'émotion sans jamais menacer la qualité des livrables.", en: "I set up and coordinated the creative, production and post-production teams across every deliverable. The shooting schedule was built around the children's rhythm, not the other way round. I stayed on set at every stage, to preserve the spontaneity of the emotion without ever putting the quality of the deliverables at risk." },
    outcome: { fr: "Un ensemble de livrables cohérent sur tous les formats, prêt pour le lancement au moment stratégique des fêtes, sans compromis sur la qualité, l'authenticité de l'émotion ni sur le planning.", en: "A coherent set of deliverables across every format, ready for launch at the strategic holiday moment, with no compromise on quality, on the authenticity of the emotion or on the schedule." },
  },
  {
    id: "petitballon", client: "Le Petit Ballon", title: "L'Accordeur de vin",
    year: "", featured: true, category: "brand",
    youtube: "xq5rWblQWBc", still: "https://nlgfcrkmeslbkqqgatzq.supabase.co/storage/v1/object/public/media/lib/le-petit-ballon-8487a7.avif",
    tag: { fr: "Film de marque", en: "Brand film" }, ai: false,
    role: { fr: "Direction de production", en: "Production direction" },
    desc: { fr: "Film de marque décalé sur un marché du vin très codifié, où l'humour du concept devait survivre aux arbitrages de production.", en: "An offbeat brand film in a highly codified wine market, where the humour of the concept had to survive the production trade-offs." },
    challenge: { fr: "Le Petit Ballon voulait affirmer une identité de marque décalée sur un marché du vin très codifié, sans que les contraintes de production ne diluent l'humour et l'originalité du concept.", en: "Le Petit Ballon wanted to assert an offbeat brand identity in a highly codified wine market, without production constraints diluting the humour and originality of the concept." },
    contribution: { fr: "J'ai organisé et piloté les équipes créatives, la production et la post-production, en choisissant une équipe de tournage habituée aux formats décalés, du casting au repérage. Je suis restée présente sur le plateau pour que le ton du film soit respecté malgré les arbitrages de production et de budget.", en: "I organised and led the creative, production and post-production teams, choosing a crew used to offbeat formats, from casting to location scouting. I stayed on set so that the tone of the film would be respected despite the production and budget trade-offs." },
    outcome: { fr: "Un film fidèle à l'identité décalée de la marque, livré sans compromis sur le ton ni sur le planning et le budget, renforçant sa singularité face aux codes plus classiques du secteur.", en: "A film true to the brand's offbeat identity, delivered with no compromise on tone, schedule or budget, strengthening its singularity against the more classic codes of the sector." },
  },
  {
    id: "avene", client: "Avène", title: "Comedomed",
    year: "2023", featured: false, category: "post",
    youtube: "qFs1pP2rshg", still: "https://nlgfcrkmeslbkqqgatzq.supabase.co/storage/v1/object/public/media/lib/avene-56021f.avif",
    tag: { fr: "Post-production", en: "Post-production" }, ai: false,
    role: { fr: "Direction de post-production", en: "Post-production direction" },
    desc: { fr: "Campagne internationale dermo-cosmétique : un rendu premium où le moindre écart de retouche engageait la confiance envers la marque.", en: "An international dermo-cosmetics campaign: a premium finish where the slightest retouching misstep put trust in the brand at stake." },
    challenge: { fr: "Avène et Saatchi avaient besoin d'un rendu premium et crédible dermatologiquement pour une campagne internationale, avec un renfort d'experts en post-production. L'enjeu était de taille : le moindre écart de retouche pouvait nuire à la confiance envers la marque.", en: "Avene and Saatchi needed a premium, dermatologically credible finish for an international campaign, with senior post-production expertise as reinforcement. The stakes were high: the slightest retouching misstep could damage trust in the brand." },
    contribution: { fr: "J'ai défini et coordonné une équipe d'experts en post-production (monteur, motion designer, 3D, retoucheur, comédiens voix off multilingues), en cadrant chaque étape et en m'intégrant au rythme et au budget du projet.", en: "I assembled and coordinated a team of post-production experts (editor, motion designer, 3D artist, retoucher, multilingual voiceover talent), framing every stage and fitting into the project's rhythm and budget." },
    outcome: { fr: "Un rendu naturel et premium, conforme aux standards dermo-cosmétiques sur l'ensemble des marchés de la campagne, livré dans le respect du planning et du budget.", en: "A natural, premium finish, compliant with dermo-cosmetics standards across every market of the campaign, delivered on schedule and on budget." },
  },
  {
    id: "krys", client: "Krys Group", title: "L'art de bien voir",
    year: "2025", featured: false, category: "corp",
    youtube: "-_Ri0Re0Ees", still: "https://nlgfcrkmeslbkqqgatzq.supabase.co/storage/v1/object/public/media/lib/krys-63102b.avif",
    tag: { fr: "Film institutionnel", en: "Corporate film" }, ai: false,
    role: { fr: "Direction de production", en: "Production direction" },
    desc: { fr: "Film tourné dans le centre de production CODIR, au plus près de celles et ceux qui fabriquent les verres.", en: "A film shot inside the CODIR production centre, as close as possible to the people who make the lenses." },
    challenge: { fr: "Réalisé à l'occasion de l'agrandissement du centre de production CODIR, le film avait pour enjeu de valoriser le savoir-faire et de mettre en lumière celles et ceux qui fabriquent, dans l'ombre du site, les verres qui améliorent la vision de millions de personnes.", en: "Made on the occasion of the CODIR production centre's expansion, the film had to showcase the craft and shine a light on the people who, behind the scenes of the site, make the lenses that improve the sight of millions." },
    contribution: { fr: "J'ai piloté la production et la post-production, en concevant un plan de tournage discret calé sur les temps morts de la ligne de production du CODIR et en restant sur place pour laisser aux équipes le temps de s'habituer à la caméra avant le premier clap.", en: "I led the production and the post-production, designing a discreet shooting schedule timed around the downtime of the CODIR production line and staying on site to give the teams time to get used to the camera before the first take." },
    outcome: { fr: "Un film institutionnel qui valorise la précision du savoir-faire et la fierté d'un groupe engagé, diffusé en interne, auprès des associés et du grand public.", en: "A corporate film that showcases the precision of the craft and the pride of a committed group, screened internally, to the partners and to the general public." },
  },
  {
    id: "asics", client: "ASICS × Ville de Paris", title: "Paris, Bouge ton esprit",
    year: "2023", featured: true, category: "doc",
    youtube: "0h6t_rdsIxM", still: "https://nlgfcrkmeslbkqqgatzq.supabase.co/storage/v1/object/public/media/lib/asics-283852.avif",
    tag: { fr: "Documentaire", en: "Documentary" }, ai: false,
    role: { fr: "Coordination de production", en: "Production coordination" },
    desc: { fr: "Mini-documentaire sur le lien entre sport et santé mentale, tourné sur plusieurs mois d'interviews.", en: "A short documentary on the link between sport and mental health, shot over several months of interviews." },
    challenge: { fr: "Produire pour Asics et la Ville de Paris un mini-documentaire sur le lien entre sport et santé mentale. Plusieurs mois de tournage et d'interviews pour capter des récits authentiques et lancer le programme Paris, Bouge ton esprit.", en: "To produce, for Asics and the City of Paris, a short documentary on the link between sport and mental health. Several months of filming and interviews to capture authentic stories and launch the Paris, Bouge ton esprit programme." },
    contribution: { fr: "J'ai mis en place et suivi les équipes de production sur des phases clés du projet, en assurant un point de coordination de la pré-production au livrable.", en: "I set up and followed the production teams through key phases of the project, holding a single point of coordination from pre-production to delivery." },
    outcome: { fr: "Un film porté par des récits humains forts, qui a contribué à générer un fort engagement dès le lancement du programme.", en: "A film carried by strong human stories, which helped generate high engagement from the programme's launch onward." },
  },
  {
    id: "tagheuer", client: "TAG Heuer", title: "Iconic watches",
    year: "2020", featured: false, category: "brand",
    youtube: "lj0Cwl0w8FE", still: "https://nlgfcrkmeslbkqqgatzq.supabase.co/storage/v1/object/public/media/lib/tag-heuer-cadf4c.avif",
    tag: { fr: "Contenus social media et salon", en: "Social media and trade show content" }, ai: false,
    role: { fr: "Direction de production", en: "Production direction" },
    desc: { fr: "Modèles emblématiques filmés pour les réseaux sociaux et le salon Baselworld, à cadence resserrée.", en: "Iconic models filmed for social media and the Baselworld trade show, at a tight cadence." },
    challenge: { fr: "TAG Heuer cherchait à présenter plusieurs modèles emblématiques sur les réseaux sociaux et lors du salon de l'horlogerie Baselworld, où la fenêtre d'attention est courte et chaque contenu doit servir l'image haut de gamme de la marque.", en: "TAG Heuer wanted to present several iconic models on social media and at the Baselworld watchmaking fair, where the attention window is short and every piece of content has to serve the brand's high-end image." },
    contribution: { fr: "J'ai constitué les équipes de production et de post-production, en choisissant des experts de la haute horlogerie. J'ai été présente à chaque tournage pour tenir une cadence resserrée sans sacrifier le niveau de finition attendu d'une marque horlogère haut de gamme.", en: "I assembled the production and post-production teams, choosing experts in fine watchmaking. I was present at every shoot to hold a tight cadence without sacrificing the level of finish expected of a high-end watch brand." },
    outcome: { fr: "Une série de contenus livrée au rythme du plan média, renforçant la présence et l'image premium de la marque.", en: "A series of content delivered in step with the media plan, strengthening the brand's presence and premium image." },
  },
  {
    id: "fiat", client: "Fiat", title: "Abarth 500e",
    year: "2023", featured: false, category: "vfx",
    youtube: "TW012v6R5gE", still: "https://nlgfcrkmeslbkqqgatzq.supabase.co/storage/v1/object/public/media/lib/fiat-b12572.avif",
    tag: { fr: "3D et post-production", en: "3D and post-production" }, ai: false,
    role: { fr: "Direction de production", en: "Production direction" },
    desc: { fr: "Séquence 3D pour le lancement international, avec une transition invisible entre film de campagne et film produit.", en: "A 3D sequence for the international launch, with an invisible transition between campaign film and product film." },
    challenge: { fr: "Fiat visait une séquence 3D irréprochable pour le lancement international de l'Abarth 500e, avec une transition invisible entre film de campagne et film produit, sans marge sur le planning.", en: "Fiat was aiming for a flawless 3D sequence for the international launch of the Abarth 500e, with an invisible transition between campaign film and product film, and no slack in the schedule." },
    contribution: { fr: "J'ai défini et coordonné une équipe de talents 3D en structurant chaque étape de validation, de l'animatique au rendu final, pour un rendu premium et naturel.", en: "I assembled and coordinated a team of 3D talents, structuring every validation stage from animatic to final render, for a premium and natural result." },
    outcome: { fr: "Une séquence 3D réaliste livrée dans les délais du lancement international, avec une transition fluide au service de la cohérence de la campagne.", en: "A realistic 3D sequence delivered within the international launch deadline, with a seamless transition serving the coherence of the campaign." },
  },
  {
    id: "universal", client: "Universal", title: "Petit Jeu",
    year: "", featured: false, category: "clip",
    youtube: "SMyb3qNe3z0", still: "https://nlgfcrkmeslbkqqgatzq.supabase.co/storage/v1/object/public/media/lib/petit-jeu-9619ba.avif",
    tag: { fr: "Clip", en: "Music video" }, ai: false,
    role: { fr: "Direction de production", en: "Production direction" },
    desc: { fr: "Clip d'Ours en featuring avec -M-, entre décor fait maison et motion design inspiré des jeux vidéo des années 90.", en: "A music video by Ours featuring -M-, between a handmade set and motion design inspired by 90s video games." },
    challenge: { fr: "Universal voulait un clip qui illustre de manière singulière le titre Petit Jeu, interprété par Ours, en featuring avec -M-.", en: "Universal wanted a music video that would illustrate the track Petit Jeu, performed by Ours featuring -M-, in a singular way." },
    contribution: { fr: "J'ai constitué les équipes de création et de production ainsi que le casting enfant, pour créer un clip unique mêlant tournage dans un décor fait maison et séquences en motion design rappelant les jeux vidéo des années 90.", en: "I assembled the creative and production teams as well as the children's casting, to create a one-of-a-kind video blending filming on a handmade set with motion design sequences echoing 90s video games." },
    outcome: { fr: "Un clip fidèle à l'univers des deux artistes, chaleureux et plein de vie.", en: "A video true to the world of both artists, warm and full of life." },
  },
];

export type Messages = typeof I18N.fr;
export type Article = Messages["journal"]["articles"][number];
