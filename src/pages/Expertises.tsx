/* ============================================================
   Expertises — les trois façons de travailler ensemble, les types
   de productions et de projets, l'encart pratique.
   ============================================================ */
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../lang";
import { useReveal } from "../lib/reveal";
import { Experience } from "../components/experience";
import { Nav } from "../components/nav";
import { Contact, Expertises } from "../components/sections";

export default function ExpertisesPage() {
  const { lang, t } = useLang();

  useEffect(() => {
    document.title = t.nav.expertises + " \u2014 Sorya Chau";
  }, [t, lang]);

  useReveal([lang]);

  return (
    <>
      <Experience lang={lang} intro={false} />
      <Nav page="expertises" />

      <main id="main">
        <div className="pg-head">
          <div className="container">
            <Link to="/" className="pg-back" data-cursor>
              <span className="pg-back__arrow">←</span>{lang === "fr" ? "Accueil" : "Home"}
            </Link>
          </div>
        </div>

        <Expertises t={t} h1 />
      </main>

      <Contact t={t} />
    </>
  );
}
