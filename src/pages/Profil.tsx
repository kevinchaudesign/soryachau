/* ============================================================
   Profil — page dédiée : Profil & Vision (02) + Workflow IA (03).
   Sections déplacées depuis l'accueil, à l'identique.
   ============================================================ */
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../lang";
import { useReveal } from "../lib/reveal";
import { Experience } from "../components/experience";
import { Nav } from "../components/nav";
import { Contact, Profile, Workflow } from "../components/sections";

export default function ProfilPage() {
  const { lang, t } = useLang();

  useEffect(() => {
    document.title = t.nav.profil + " — Sorya Chau";
  }, [t, lang]);

  useReveal([lang]);

  return (
    <>
      <Experience lang={lang} intro={false} />
      <Nav page="profil" />

      <main id="main">
        <div className="pg-head">
          <div className="container">
            <Link to="/" className="pg-back" data-cursor>
              <span className="pg-back__arrow">←</span>{lang === "fr" ? "Accueil" : "Home"}
            </Link>
          </div>
        </div>

        <Profile t={t} h1 />
        <Workflow t={t} />
      </main>

      <Contact t={t} />
    </>
  );
}
