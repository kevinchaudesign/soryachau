/* ============================================================
   Contact — le bloc Contact, jusqu'ici pied de page partout,
   devient ici le contenu principal de sa propre page. Aucun
   texte nouveau : même copie validée, promue en h1.
   La page ne rappelle donc pas le footer Contact en bas, sous
   peine de dire deux fois la même chose.
   ============================================================ */
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../lang";
import { useReveal } from "../lib/reveal";
import { Experience, scene } from "../components/experience";
import { Nav } from "../components/nav";
import { Contact } from "../components/sections";

export default function ContactPage() {
  const { lang, t } = useLang();

  useEffect(() => {
    document.title = t.nav.contact + " — Sorya Chau";
  }, [t, lang]);

  useReveal([lang]);

  return (
    <>
      {/* Le bloc porte ici l'id « main » : la piste de montage vise
          donc sa classe plutôt que l'ancre #contact des autres pages. */}
      <Experience
        lang={lang}
        intro={false}
        scenes={[scene(lang, "01", ".pg-head"), scene(lang, "07", ".contact")]}
      />
      <Nav page="contact" />

      <div className="pg-head">
        <div className="container">
          <Link to="/" className="pg-back" data-cursor>
            <span className="pg-back__arrow">←</span>{lang === "fr" ? "Accueil" : "Home"}
          </Link>
        </div>
      </div>

      <Contact t={t} h1 />
    </>
  );
}
