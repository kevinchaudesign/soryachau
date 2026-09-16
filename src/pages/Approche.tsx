/* ============================================================
   Approche — le constat, la manière de travailler, les principes
   et la phrase signature. Contenu validé par Sorya (Textes def).
   ============================================================ */
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../lang";
import { useReveal } from "../lib/reveal";
import { Experience } from "../components/experience";
import { Nav } from "../components/nav";
import { Contact, Approche } from "../components/sections";

export default function ApprochePage() {
  const { lang, t } = useLang();

  useEffect(() => {
    document.title = t.nav.approche + " \u2014 Sorya Chau";
  }, [t, lang]);

  useReveal([lang]);

  return (
    <>
      <Experience lang={lang} intro={false} />
      <Nav page="approche" />

      <main id="main">
        <div className="pg-head">
          <div className="container">
            <Link to="/" className="pg-back" data-cursor>
              <span className="pg-back__arrow">←</span>{lang === "fr" ? "Accueil" : "Home"}
            </Link>
          </div>
        </div>

        <Approche t={t} h1 />
      </main>

      <Contact t={t} />
    </>
  );
}
