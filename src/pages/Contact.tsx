/* ============================================================
   Contact — le bloc Contact, jusqu'ici pied de page partout,
   devient ici le contenu principal de sa propre page. Aucun
   texte nouveau : même copie validée, promue en h1.
   La page ne rappelle donc pas le footer Contact en bas, sous
   peine de dire deux fois la même chose.
   ============================================================ */
import { useEffect } from "react";
import { useLang } from "../lang";
import { useReveal } from "../lib/reveal";
import { Experience, scene } from "../components/experience";
import { Nav } from "../components/nav";
import { PageHead } from "../components/page-head";
import { Contact } from "../components/sections";

export default function ContactPage() {
  const { lang, t } = useLang();

  useEffect(() => {
    document.title = t.nav.contact + " — Sorya Chau";
  }, [t, lang]);

  useReveal([lang]);

  return (
    <>
      {/* Le bloc n'est pas ancré en #contact ici : la piste de montage
          vise sa classe plutôt que l'ancre des autres pages. */}
      <Experience
        lang={lang}
        intro={false}
        scenes={[scene(lang, "01", ".pg-head"), scene(lang, "07", ".contact")]}
      />
      <Nav page="contact" />

      <main id="main">
        <PageHead idx="07" eyebrow={t.contact.eyebrow} title={t.contact.title} lead={t.contact.lead} />

        <Contact t={t} headless />
      </main>
    </>
  );
}
