/* ============================================================
   CV page — bilingual résumé, print + PDF download
   La barre de montage est présente comme partout ailleurs, avec
   la piste de la feuille (en-tête, profil, expériences) ; elle
   disparaît à l'impression (cf. cv.css).
   ============================================================ */
import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import "../styles/cv.css";
import { useLang } from "../lang";
import { CV_PDF } from "../lib/assets";
import { Experience, scene } from "../components/experience";
import { LangToggle } from "../components/nav";

export default function CVPage() {
  const { lang, setLang, t } = useLang();
  const c = t.cv;
  /* La colonne latérale (formation, langues, outils) n'est pas une
     étape de défilement : la piste suit la colonne principale. */
  const scenes = useMemo(() => [
    scene(lang, "01", ".sheet__head"),
    { sel: "#cv-profil", n: "02", t: c.profilTitle },
    { sel: "#cv-exp", n: "03", t: c.expTitle },
  ], [lang, c]);

  useEffect(() => {
    document.title = lang === "fr" ? "Sorya Chau — CV" : "Sorya Chau — Résumé";
  }, [lang]);

  return (
    <div className="cv">
      <Experience lang={lang} intro={false} scenes={scenes} />
      {/* top bar */}
      <nav className="cv-bar" aria-label={lang === "fr" ? "Actions du CV" : "Résumé actions"}>
        <div className="container cv-bar__inner">
          <Link to="/" className="cv-back">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M8.5 11L4.5 7L8.5 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            {c.back}
          </Link>
          <div className="cv-bar__right">
            <LangToggle lang={lang} setLang={setLang} />
            <button className="cv-btn" onClick={() => window.print()}>{c.print}</button>
            <a href={CV_PDF[lang]} download className="cv-btn cv-btn--primary">
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M7 1V9.5M7 9.5L3.2 5.7M7 9.5L10.8 5.7M1.5 12.5H12.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              {c.download}
            </a>
          </div>
        </div>
      </nav>

      {/* sheet — c'est elle le contenu principal de la page */}
      <div className="container">
        <main id="main" className="sheet">
          <header className="sheet__head">
            <div className="sheet__id">
              <div className="sheet__mark">SC</div>
              <div>
                <h1 className="sheet__name">Sorya Chau</h1>
                <p className="sheet__role">{c.role}</p>
              </div>
            </div>
            <div className="sheet__meta">
              <a href="mailto:chausorya@gmail.com">chausorya@gmail.com</a>
              <a href="tel:+33626921720">06 26 92 17 20</a>
              <span>Paris / Île-de-France</span>
            </div>
          </header>

          <div className="sheet__grid">
            {/* main column */}
            <div className="sheet__main">
              <section className="cv-block" id="cv-profil">
                <h2 className="cv-h2">{c.profilTitle}</h2>
                <p className="cv-profil">{c.profil}</p>
              </section>

              <section className="cv-block" id="cv-exp">
                <h2 className="cv-h2">{c.expTitle}</h2>
                <ol className="cv-exp">
                  {c.exp.map((e, i) => (
                    <li className="cv-job" key={i}>
                      <div className="cv-job__head">
                        <h3 className="cv-job__role">{e.r}</h3>
                        <span className="cv-job__year">{e.y}</span>
                      </div>
                      <div className="cv-job__company">{e.c}</div>
                      <ul className="cv-job__pts">
                        {e.pts.map((p, j) => <li key={j}>{p}</li>)}
                      </ul>
                      {e.clients ? (
                        <p className="cv-job__clients"><span>{lang === "fr" ? "Clients clés" : "Key clients"}</span> {e.clients}</p>
                      ) : null}
                    </li>
                  ))}
                </ol>
              </section>
            </div>

            {/* side column */}
            <aside className="sheet__side">
              <section className="cv-block">
                <h2 className="cv-h2">{c.formTitle}</h2>
                <ul className="cv-list">
                  {c.form.map((f, i) => (
                    <li className="cv-edu" key={i}>
                      <div className="cv-edu__t">{f.t}</div>
                      <div className="cv-edu__s">{f.s}</div>
                      <div className="cv-edu__y">{f.y}</div>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="cv-block">
                <h2 className="cv-h2">{c.langTitle}</h2>
                <ul className="cv-list cv-langs">
                  {c.langs.map((l, i) => (
                    <li key={i}><span>{l.l}</span><em>{l.v}</em></li>
                  ))}
                </ul>
              </section>

              <section className="cv-block">
                <h2 className="cv-h2">{c.toolsTitle}</h2>
                <div className="cv-tools">
                  {c.tools.map((tool, i) => <span className="cv-tool" key={i}>{tool}</span>)}
                </div>
              </section>
            </aside>
          </div>
        </main>
        <footer className="cv-foot">© {new Date().getFullYear()} Sorya Chau — {t.footer.built}</footer>
      </div>
    </div>
  );
}
