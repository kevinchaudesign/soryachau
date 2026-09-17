/* ============================================================
   Approche — le constat, la manière de travailler, les principes
   et la phrase signature. Contenu validé par Sorya (Textes def).
   ============================================================ */
import { useEffect } from "react";
import { useLang } from "../lang";
import { useReveal } from "../lib/reveal";
import { Experience } from "../components/experience";
import { Nav } from "../components/nav";
import { PageHead } from "../components/page-head";
import { ShootBand } from "../components/band";
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
        <PageHead idx="02" eyebrow={t.approche.eyebrow} title={t.approche.title} />

        <Approche t={t} />
        <ShootBand id="band-approche" label={lang === "fr" ? "Préparation" : "Preparation"} tc="00:12:04:08" />
      </main>

      <Contact t={t} />
    </>
  );
}
