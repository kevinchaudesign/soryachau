-- Corrections demandees par Sorya (revue du 17 septembre 2026).
-- Textes : Approche, Projets, Kinder, A propos EN, traduction anglaise
-- des projets. Journal : deux articles conserves, dates de septembre
-- 2026, visuels poses sur leurs emplacements.
-- Le contenu reste la copie exacte de src/i18n.ts.

-- ---------- Approche : « En revanche… » passe a la ligne ----------
update public.translations
set data = jsonb_set(jsonb_set(data, '{approche,methodLead}', '"Je n''arrive pas avec une méthode figée. Chaque projet possède ses propres contraintes, son propre rythme et ses propres enjeux."'::jsonb),
                     '{approche,methodLead2}', '"En revanche, certains principes restent constants."'::jsonb),
    updated_at = now()
where lang = 'fr';

update public.translations
set data = jsonb_set(jsonb_set(data, '{approche,methodLead}', '"I don''t arrive with a fixed method. Every project has its own constraints, its own rhythm and its own stakes."'::jsonb),
                     '{approche,methodLead2}', '"A few principles, though, never change."'::jsonb),
    updated_at = now()
where lang = 'en';

-- ---------- Projets : le tiret de l'accroche devient deux-points ----------
update public.translations
set data = jsonb_set(data, '{work,lead}', '"Une sélection de projets pilotés de la préparation à la livraison : film, campagne, shooting, post-production."'::jsonb),
    updated_at = now()
where lang = 'fr';

update public.translations
set data = jsonb_set(data, '{work,lead}', '"A selection of projects steered from preparation to delivery: film, campaign, photo shoot, post-production."'::jsonb),
    updated_at = now()
where lang = 'en';

-- ---------- A propos EN : derniere phrase sans ses deux tirets ----------
update public.translations
set data = jsonb_set(data, '{apropos,body}', '["To me, a good production is not just about holding a schedule or staying within budget. It is built first in the quality of the exchanges, and in the ability to create an environment where everyone can do their best work.","For close to twenty years I have helped creative projects come to life. After building my experience at Publicis, Ogilvy and TBWA, I co-founded Super Motion, a creative house I grew over ten years. Today I work independently, running demanding productions in France and internationally.","Along the way I have built a solid network of talents and trusted partners. Beyond method, a project succeeds on people: bringing the right expertise together, giving teams visibility, anticipating key decisions and keeping trust intact.","That double path as an entrepreneur and a production director is what lets me put this network to work on every project."]'::jsonb),
    updated_at = now()
where lang = 'en';

-- ---------- Projets : recit Kinder reecrit, version anglaise complete ----------
update public.projects set
  tag = '{"fr":"Campagne publicitaire : TV, digital et réseaux sociaux","en":"Advertising campaign: TV, digital and social media"}'::jsonb,
  role = '{"fr":"Direction de production","en":"Production direction"}'::jsonb,
  descr = '{"fr":"Campagne de Noël déclinée en TV, digital et réseaux sociaux, tournée avec des enfants sur un planning de diffusion non négociable.","en":"A Christmas campaign rolled out across TV, digital and social media, shot with children against a non-negotiable air date."}'::jsonb,
  challenge = '{"fr":"Kinder devait lancer sa campagne de Noël simultanément en TV, digital et réseaux sociaux, avec de nombreux livrables à produire sur un planning de diffusion non négociable. Le tout avec une exigence forte : préserver la sincérité de l''émotion malgré l''ampleur du dispositif et la présence d''enfants sur le plateau.","en":"Kinder had to launch its Christmas campaign simultaneously on TV, digital and social media, with a long list of deliverables to produce against a non-negotiable air date. All of it with one demanding requirement: keeping the emotion sincere despite the scale of the setup and the presence of children on set."}'::jsonb,
  contribution = '{"fr":"J''ai défini et coordonné les équipes créatives, la production et la post-production sur l''ensemble des livrables. Le plan de tournage a été construit autour du rythme des enfants et non l''inverse. Je suis restée sur le plateau à chaque étape, pour préserver la spontanéité de l''émotion sans jamais menacer la qualité des livrables.","en":"I set up and coordinated the creative, production and post-production teams across every deliverable. The shooting schedule was built around the children''s rhythm, not the other way round. I stayed on set at every stage, to preserve the spontaneity of the emotion without ever putting the quality of the deliverables at risk."}'::jsonb,
  outcome = '{"fr":"Un ensemble de livrables cohérent sur tous les formats, prêt pour le lancement au moment stratégique des fêtes, sans compromis sur la qualité, l''authenticité de l''émotion ni sur le planning.","en":"A coherent set of deliverables across every format, ready for launch at the strategic holiday moment, with no compromise on quality, on the authenticity of the emotion or on the schedule."}'::jsonb,
  updated_at = now()
where id = 'kinder';

update public.projects set
  tag = '{"fr":"Film de marque","en":"Brand film"}'::jsonb,
  role = '{"fr":"Direction de production","en":"Production direction"}'::jsonb,
  descr = '{"fr":"Film de marque décalé sur un marché du vin très codifié, où l''humour du concept devait survivre aux arbitrages de production.","en":"An offbeat brand film in a highly codified wine market, where the humour of the concept had to survive the production trade-offs."}'::jsonb,
  challenge = '{"fr":"Le Petit Ballon voulait affirmer une identité de marque décalée sur un marché du vin très codifié, sans que les contraintes de production ne diluent l''humour et l''originalité du concept.","en":"Le Petit Ballon wanted to assert an offbeat brand identity in a highly codified wine market, without production constraints diluting the humour and originality of the concept."}'::jsonb,
  contribution = '{"fr":"J''ai organisé et piloté les équipes créatives, la production et la post-production, en choisissant une équipe de tournage habituée aux formats décalés, du casting au repérage. Je suis restée présente sur le plateau pour que le ton du film soit respecté malgré les arbitrages de production et de budget.","en":"I organised and led the creative, production and post-production teams, choosing a crew used to offbeat formats, from casting to location scouting. I stayed on set so that the tone of the film would be respected despite the production and budget trade-offs."}'::jsonb,
  outcome = '{"fr":"Un film fidèle à l''identité décalée de la marque, livré sans compromis sur le ton ni sur le planning et le budget, renforçant sa singularité face aux codes plus classiques du secteur.","en":"A film true to the brand''s offbeat identity, delivered with no compromise on tone, schedule or budget, strengthening its singularity against the more classic codes of the sector."}'::jsonb,
  updated_at = now()
where id = 'petitballon';

update public.projects set
  tag = '{"fr":"Post-production","en":"Post-production"}'::jsonb,
  role = '{"fr":"Direction de post-production","en":"Post-production direction"}'::jsonb,
  descr = '{"fr":"Campagne internationale dermo-cosmétique : un rendu premium où le moindre écart de retouche engageait la confiance envers la marque.","en":"An international dermo-cosmetics campaign: a premium finish where the slightest retouching misstep put trust in the brand at stake."}'::jsonb,
  challenge = '{"fr":"Avène et Saatchi avaient besoin d''un rendu premium et crédible dermatologiquement pour une campagne internationale, avec un renfort d''experts en post-production. L''enjeu était de taille : le moindre écart de retouche pouvait nuire à la confiance envers la marque.","en":"Avene and Saatchi needed a premium, dermatologically credible finish for an international campaign, with senior post-production expertise as reinforcement. The stakes were high: the slightest retouching misstep could damage trust in the brand."}'::jsonb,
  contribution = '{"fr":"J''ai défini et coordonné une équipe d''experts en post-production (monteur, motion designer, 3D, retoucheur, comédiens voix off multilingues), en cadrant chaque étape et en m''intégrant au rythme et au budget du projet.","en":"I assembled and coordinated a team of post-production experts (editor, motion designer, 3D artist, retoucher, multilingual voiceover talent), framing every stage and fitting into the project''s rhythm and budget."}'::jsonb,
  outcome = '{"fr":"Un rendu naturel et premium, conforme aux standards dermo-cosmétiques sur l''ensemble des marchés de la campagne, livré dans le respect du planning et du budget.","en":"A natural, premium finish, compliant with dermo-cosmetics standards across every market of the campaign, delivered on schedule and on budget."}'::jsonb,
  updated_at = now()
where id = 'avene';

update public.projects set
  tag = '{"fr":"Film institutionnel","en":"Corporate film"}'::jsonb,
  role = '{"fr":"Direction de production","en":"Production direction"}'::jsonb,
  descr = '{"fr":"Film tourné dans le centre de production CODIR, au plus près de celles et ceux qui fabriquent les verres.","en":"A film shot inside the CODIR production centre, as close as possible to the people who make the lenses."}'::jsonb,
  challenge = '{"fr":"Réalisé à l''occasion de l''agrandissement du centre de production CODIR, le film avait pour enjeu de valoriser le savoir-faire et de mettre en lumière celles et ceux qui fabriquent, dans l''ombre du site, les verres qui améliorent la vision de millions de personnes.","en":"Made on the occasion of the CODIR production centre''s expansion, the film had to showcase the craft and shine a light on the people who, behind the scenes of the site, make the lenses that improve the sight of millions."}'::jsonb,
  contribution = '{"fr":"J''ai piloté la production et la post-production, en concevant un plan de tournage discret calé sur les temps morts de la ligne de production du CODIR et en restant sur place pour laisser aux équipes le temps de s''habituer à la caméra avant le premier clap.","en":"I led the production and the post-production, designing a discreet shooting schedule timed around the downtime of the CODIR production line and staying on site to give the teams time to get used to the camera before the first take."}'::jsonb,
  outcome = '{"fr":"Un film institutionnel qui valorise la précision du savoir-faire et la fierté d''un groupe engagé, diffusé en interne, auprès des associés et du grand public.","en":"A corporate film that showcases the precision of the craft and the pride of a committed group, screened internally, to the partners and to the general public."}'::jsonb,
  updated_at = now()
where id = 'krys';

update public.projects set
  tag = '{"fr":"Documentaire","en":"Documentary"}'::jsonb,
  role = '{"fr":"Coordination de production","en":"Production coordination"}'::jsonb,
  descr = '{"fr":"Mini-documentaire sur le lien entre sport et santé mentale, tourné sur plusieurs mois d''interviews.","en":"A short documentary on the link between sport and mental health, shot over several months of interviews."}'::jsonb,
  challenge = '{"fr":"Produire pour Asics et la Ville de Paris un mini-documentaire sur le lien entre sport et santé mentale. Plusieurs mois de tournage et d''interviews pour capter des récits authentiques et lancer le programme Paris, Bouge ton esprit.","en":"To produce, for Asics and the City of Paris, a short documentary on the link between sport and mental health. Several months of filming and interviews to capture authentic stories and launch the Paris, Bouge ton esprit programme."}'::jsonb,
  contribution = '{"fr":"J''ai mis en place et suivi les équipes de production sur des phases clés du projet, en assurant un point de coordination de la pré-production au livrable.","en":"I set up and followed the production teams through key phases of the project, holding a single point of coordination from pre-production to delivery."}'::jsonb,
  outcome = '{"fr":"Un film porté par des récits humains forts, qui a contribué à générer un fort engagement dès le lancement du programme.","en":"A film carried by strong human stories, which helped generate high engagement from the programme''s launch onward."}'::jsonb,
  updated_at = now()
where id = 'asics';

update public.projects set
  tag = '{"fr":"Contenus social media et salon","en":"Social media and trade show content"}'::jsonb,
  role = '{"fr":"Direction de production","en":"Production direction"}'::jsonb,
  descr = '{"fr":"Modèles emblématiques filmés pour les réseaux sociaux et le salon Baselworld, à cadence resserrée.","en":"Iconic models filmed for social media and the Baselworld trade show, at a tight cadence."}'::jsonb,
  challenge = '{"fr":"TAG Heuer cherchait à présenter plusieurs modèles emblématiques sur les réseaux sociaux et lors du salon de l''horlogerie Baselworld, où la fenêtre d''attention est courte et chaque contenu doit servir l''image haut de gamme de la marque.","en":"TAG Heuer wanted to present several iconic models on social media and at the Baselworld watchmaking fair, where the attention window is short and every piece of content has to serve the brand''s high-end image."}'::jsonb,
  contribution = '{"fr":"J''ai constitué les équipes de production et de post-production, en choisissant des experts de la haute horlogerie. J''ai été présente à chaque tournage pour tenir une cadence resserrée sans sacrifier le niveau de finition attendu d''une marque horlogère haut de gamme.","en":"I assembled the production and post-production teams, choosing experts in fine watchmaking. I was present at every shoot to hold a tight cadence without sacrificing the level of finish expected of a high-end watch brand."}'::jsonb,
  outcome = '{"fr":"Une série de contenus livrée au rythme du plan média, renforçant la présence et l''image premium de la marque.","en":"A series of content delivered in step with the media plan, strengthening the brand''s presence and premium image."}'::jsonb,
  updated_at = now()
where id = 'tagheuer';

update public.projects set
  tag = '{"fr":"3D et post-production","en":"3D and post-production"}'::jsonb,
  role = '{"fr":"Direction de production","en":"Production direction"}'::jsonb,
  descr = '{"fr":"Séquence 3D pour le lancement international, avec une transition invisible entre film de campagne et film produit.","en":"A 3D sequence for the international launch, with an invisible transition between campaign film and product film."}'::jsonb,
  challenge = '{"fr":"Fiat visait une séquence 3D irréprochable pour le lancement international de l''Abarth 500e, avec une transition invisible entre film de campagne et film produit, sans marge sur le planning.","en":"Fiat was aiming for a flawless 3D sequence for the international launch of the Abarth 500e, with an invisible transition between campaign film and product film, and no slack in the schedule."}'::jsonb,
  contribution = '{"fr":"J''ai défini et coordonné une équipe de talents 3D en structurant chaque étape de validation, de l''animatique au rendu final, pour un rendu premium et naturel.","en":"I assembled and coordinated a team of 3D talents, structuring every validation stage from animatic to final render, for a premium and natural result."}'::jsonb,
  outcome = '{"fr":"Une séquence 3D réaliste livrée dans les délais du lancement international, avec une transition fluide au service de la cohérence de la campagne.","en":"A realistic 3D sequence delivered within the international launch deadline, with a seamless transition serving the coherence of the campaign."}'::jsonb,
  updated_at = now()
where id = 'fiat';

update public.projects set
  tag = '{"fr":"Clip","en":"Music video"}'::jsonb,
  role = '{"fr":"Direction de production","en":"Production direction"}'::jsonb,
  descr = '{"fr":"Clip d''Ours en featuring avec -M-, entre décor fait maison et motion design inspiré des jeux vidéo des années 90.","en":"A music video by Ours featuring -M-, between a handmade set and motion design inspired by 90s video games."}'::jsonb,
  challenge = '{"fr":"Universal voulait un clip qui illustre de manière singulière le titre Petit Jeu, interprété par Ours, en featuring avec -M-.","en":"Universal wanted a music video that would illustrate the track Petit Jeu, performed by Ours featuring -M-, in a singular way."}'::jsonb,
  contribution = '{"fr":"J''ai constitué les équipes de création et de production ainsi que le casting enfant, pour créer un clip unique mêlant tournage dans un décor fait maison et séquences en motion design rappelant les jeux vidéo des années 90.","en":"I assembled the creative and production teams as well as the children''s casting, to create a one-of-a-kind video blending filming on a handmade set with motion design sequences echoing 90s video games."}'::jsonb,
  outcome = '{"fr":"Un clip fidèle à l''univers des deux artistes, chaleureux et plein de vie.","en":"A video true to the world of both artists, warm and full of life."}'::jsonb,
  updated_at = now()
where id = 'universal';

-- ---------- Journal : deux articles conserves ----------
delete from public.articles
where id not in ('producteur-augmente', 'da-prompt');

update public.articles set
  sort_order = 0,
  fr = '{"cat":"Vision","date":"Septembre 2026","read":"5","title":"Producteur : pourquoi l''IA ne remplacera pas le jugement créatif et humain ?","dek":"Les outils génératifs accélèrent tout, sauf la responsabilité. Le métier de directrice de production se déplace vers ce qui ne s''automatise pas.","body":[{"t":"p","c":"On me demande souvent si l''IA va remplacer les producteurs. La question se trompe de cible. L''IA produit des options ; elle ne porte pas la responsabilité d''un choix devant un client, une équipe et un budget."},{"t":"p","c":"Mon métier n''a jamais été de fabriquer des images, mais de décider lesquelles méritent d''exister : à quel coût, dans quel délai, avec quels droits. Cette part, l''arbitrage, ne s''automatise pas."},{"t":"h","c":"Ce que la machine rend, c''est du temps"},{"t":"p","c":"En déléguant les tâches répétitives, comme les déclinaisons, les recherches visuelles ou les premières passes, je récupère des heures. Je les réinvestis dans la relation humaine : le casting, la direction d''équipe, la négociation, le soin du détail."},{"t":"quote","c":"L''IA déplace le métier vers le haut : moins d''exécution, plus de discernement."}]}'::jsonb,
  en = '{"cat":"Vision","date":"September 2026","read":"5","title":"Producer: why AI will not replace creative and human judgement","dek":"Generative tools speed up everything, except responsibility. The production director''s craft shifts toward what cannot be automated.","body":[{"t":"p","c":"I''m often asked whether AI will replace producers. The question misses its target. AI produces options; it doesn''t carry the responsibility of a choice in front of a client, a team and a budget."},{"t":"p","c":"My job was never to make images, but to decide which ones deserve to exist: at what cost, on what timeline, with what rights. That part, the arbitration, doesn''t automate."},{"t":"h","c":"What the machine gives back is time"},{"t":"p","c":"By delegating repetitive tasks, such as versioning, visual research or first passes, I recover hours. I reinvest them in the human relationship: casting, leading the team, negotiation, the care for detail."},{"t":"quote","c":"AI moves the craft upward: less execution, more discernment."}]}'::jsonb,
  updated_at = now()
where id = 'producteur-augmente';

update public.articles set
  sort_order = 1,
  fr = '{"cat":"Direction artistique","date":"Septembre 2026","read":"5","title":"La direction artistique à l''ère du prompt","dek":"Quand générer une image coûte quelques secondes, la valeur se déplace : du faire vers le choisir, du geste vers le regard.","body":[{"t":"p","c":"La direction artistique a toujours consisté à choisir. L''IA ne change pas cette nature ; elle en augmente le volume. Là où l''on explorait trois pistes, on en explore trente."},{"t":"p","c":"Le risque est connu : la facilité. Générer beaucoup ne fait pas une direction. Une DA tient à un parti pris, une cohérence, un refus. C''est le rôle de l''humain de trancher dans l''abondance."},{"t":"quote","c":"Le prompt produit des possibilités. La direction artistique, elle, produit un refus."},{"t":"p","c":"Je vois l''IA comme un atelier infini : précieux tant qu''on y entre avec une intention. Sans regard, ce n''est qu''un générateur de bruit visuel."}]}'::jsonb,
  en = '{"cat":"Art direction","date":"September 2026","read":"5","title":"Art direction in the age of the prompt","dek":"When generating an image costs seconds, value shifts: from making to choosing, from gesture to eye.","body":[{"t":"p","c":"Art direction has always been about choosing. AI doesn''t change that nature; it amplifies its volume. Where you used to explore three directions, you explore thirty."},{"t":"p","c":"The risk is well known: ease. Generating a lot doesn''t make a direction. Art direction rests on a stance, a coherence, a refusal. It''s the human''s role to cut through the abundance."},{"t":"quote","c":"The prompt produces possibilities. Art direction produces a refusal."},{"t":"p","c":"I see AI as an infinite studio: valuable as long as you enter with an intention. Without an eye, it''s just a generator of visual noise."}]}'::jsonb,
  updated_at = now()
where id = 'da-prompt';

-- ---------- Journal : un visuel par article ----------
-- Photos de tournage de la mediatheque, posees sur les emplacements
-- des deux articles : accueil (jslot), sommaire (bslot/bgslot) et
-- page de l'article (rslot). Remplacables depuis la regie.
insert into public.image_slots (id, url, updated_at) values
  ('jslot-producteur-augmente',  'https://nlgfcrkmeslbkqqgatzq.supabase.co/storage/v1/object/public/media/lib/17-8dc855.avif', now()),
  ('bslot-producteur-augmente',  'https://nlgfcrkmeslbkqqgatzq.supabase.co/storage/v1/object/public/media/lib/17-8dc855.avif', now()),
  ('rslot-producteur-augmente',  'https://nlgfcrkmeslbkqqgatzq.supabase.co/storage/v1/object/public/media/lib/17-8dc855.avif', now()),
  ('jslot-da-prompt',            'https://nlgfcrkmeslbkqqgatzq.supabase.co/storage/v1/object/public/media/lib/10-couleur-f954f9.avif', now()),
  ('bgslot-da-prompt',           'https://nlgfcrkmeslbkqqgatzq.supabase.co/storage/v1/object/public/media/lib/10-couleur-f954f9.avif', now()),
  ('rslot-da-prompt',            'https://nlgfcrkmeslbkqqgatzq.supabase.co/storage/v1/object/public/media/lib/10-couleur-f954f9.avif', now())
on conflict (id) do update set url = excluded.url, updated_at = now();

-- Emplacements des articles retires du Journal.
delete from public.image_slots
where (id like 'jslot-%' or id like 'bslot-%' or id like 'bgslot-%' or id like 'rslot-%')
  and id !~ '(producteur-augmente|da-prompt)$';
