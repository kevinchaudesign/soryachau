/* ============================================================
   Expertises — les trois façons de travailler ensemble, les types
   de productions et de projets, l'encart pratique.
   ============================================================ */
import { useEffect } from "react";
import { useLang } from "../lang";
import { useReveal } from "../lib/reveal";
import { Experience } from "../components/experience";
import { Nav } from "../components/nav";
import { PageHead } from "../components/page-head";
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
        <PageHead idx="03" eyebrow={t.expertises.eyebrow} title={t.expertises.title}
                  back={lang === "fr" ? "Accueil" : "Home"} />

        <Expertises t={t} />
      </main>

      <Contact t={t} />
    </>
  );
}
