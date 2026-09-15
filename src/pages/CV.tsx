/* ============================================================
   CV page — le PDF fourni s'affiche tel quel, un fichier par
   langue (cf. lib/assets). La feuille HTML qui occupait cette
   route reste dans l'historique git ; ses données (t.cv.exp)
   servent toujours au détail des postes de /parcours.
   ============================================================ */
import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import "../styles/cv.css";
import { useLang } from "../lang";
import { CV_PDF } from "../lib/assets";
import { Experience } from "../components/experience";
import { LangToggle } from "../components/nav";

export default function CVPage() {
  const { lang, setLang, t } = useLang();
  const c = t.cv;
  const src = CV_PDF[lang];
  /* Un seul plan sur cette page : le document. */
  const scenes = useMemo(() => [{ sel: ".cv-doc", n: "01", t: c.title }], [c]);

  useEffect(() => {
    document.title = lang === "fr" ? "Sorya Chau — CV" : "Sorya Chau — Résumé";
  }, [lang]);

  return (
    <div className="cv">
      <Experience lang={lang} intro={false} scenes={scenes} />

      {/* barre d'actions */}
      <nav className="cv-bar" aria-label={lang === "fr" ? "Actions du CV" : "Résumé actions"}>
        <div className="container cv-bar__inner">
          <Link to="/" className="cv-back">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M8.5 11L4.5 7L8.5 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            {c.back}
          </Link>
          <div className="cv-bar__right">
            <LangToggle lang={lang} setLang={setLang} />
            <a href={src} target="_blank" rel="noopener" className="cv-btn">
              {lang === "fr" ? "Ouvrir le PDF" : "Open the PDF"}
            </a>
            <a href={src} download className="cv-btn cv-btn--primary">
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M7 1V9.5M7 9.5L3.2 5.7M7 9.5L10.8 5.7M1.5 12.5H12.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              {c.download}
            </a>
          </div>
        </div>
      </nav>

      {/* le document : le PDF de la langue courante */}
      <div className="container">
        <main id="main" className="cv-doc">
          <h1 className="cv-doc__title">Sorya Chau — {c.title}</h1>
          {/* <iframe> et non <object> : la visionneuse PDF de Chrome
              reste blanche par intermittence dans un <object>, et
              la clé force un remontage propre au changement de
              langue plutôt qu'une mutation de la source. */}
          <iframe
            key={src}
            className="cv-doc__frame"
            src={src + "#view=FitH"}
            title={"Sorya Chau — " + c.title}
          ></iframe>
          <p className="cv-doc__hint">
            {lang === "fr" ? "Le PDF ne s'affiche pas ?" : "PDF not showing?"}{" "}
            <a href={src} download>{c.download}</a>
          </p>
        </main>
      </div>

      <footer className="cv-foot">© {new Date().getFullYear()} Sorya Chau — {t.footer.built}</footer>
    </div>
  );
}
