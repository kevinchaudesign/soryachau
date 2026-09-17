/* ============================================================
   À propos — biographie. Remplace l'ancienne page Parcours ;
   le CV détaillé reste téléchargeable sur /cv.
   ============================================================ */
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../lang";
import { useReveal } from "../lib/reveal";
import { Experience } from "../components/experience";
import { Nav } from "../components/nav";
import { Contact, APropos } from "../components/sections";

export default function AProposPage() {
  const { lang, t } = useLang();

  useEffect(() => {
    document.title = t.nav.apropos + " \u2014 Sorya Chau";
  }, [t, lang]);

  useReveal([lang]);

  return (
    <>
      <Experience lang={lang} intro={false} />
      <Nav page="apropos" />

      <main id="main">
        <div className="pg-head">
          <div className="container">
            <Link to="/" className="pg-back" data-cursor>
              <span className="pg-back__arrow">←</span>{lang === "fr" ? "Accueil" : "Home"}
            </Link>
          </div>
        </div>

        <APropos t={t} h1 />
      </main>

      <Contact t={t} />
    </>
  );
}
