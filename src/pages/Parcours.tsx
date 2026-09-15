/* ============================================================
   Parcours — page dédiée : timeline (06) + marquee clients.
   Sections déplacées depuis l'accueil, à l'identique.
   ============================================================ */
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../lang";
import { useReveal } from "../lib/reveal";
import { Experience } from "../components/experience";
import { Nav } from "../components/nav";
import { Clients, Contact, Parcours } from "../components/sections";

export default function ParcoursPage() {
  const { lang, t } = useLang();

  useEffect(() => {
    document.title = t.nav.parcours + " — Sorya Chau";
  }, [t, lang]);

  useReveal([lang]);

  return (
    <>
      <Experience lang={lang} intro={false} />
      <Nav page="parcours" />

      <main id="main">
        <div className="pg-head">
          <div className="container">
            <Link to="/" className="pg-back" data-cursor>
              <span className="pg-back__arrow">←</span>{lang === "fr" ? "Accueil" : "Home"}
            </Link>
          </div>
        </div>

        <Parcours t={t} h1 />
        <Clients t={t} />
      </main>

      <Contact t={t} />
    </>
  );
}
