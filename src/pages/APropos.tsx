/* ============================================================
   À propos — biographie. Remplace l'ancienne page Parcours ;
   le CV détaillé reste téléchargeable sur /cv.
   ============================================================ */
import { useEffect } from "react";
import { useLang } from "../lang";
import { useReveal } from "../lib/reveal";
import { Experience } from "../components/experience";
import { Nav } from "../components/nav";
import { PageHead } from "../components/page-head";
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
        <PageHead idx="06" eyebrow={t.apropos.eyebrow} title={t.apropos.title}
                  back={lang === "fr" ? "Accueil" : "Home"} />

        <APropos t={t} />
      </main>

      <Contact t={t} />
    </>
  );
}
