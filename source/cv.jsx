/* ============================================================
   CV page — bilingual résumé, print + PDF download
   ============================================================ */
const { useState, useEffect } = React;

function CVToggle({ lang, setLang }) {
  return (
    <div className="lang-toggle" role="group" aria-label="Language">
      <button className={lang === "fr" ? "on" : ""} onClick={() => setLang("fr")} aria-pressed={lang === "fr"}>FR</button>
      <span className="lang-sep">/</span>
      <button className={lang === "en" ? "on" : ""} onClick={() => setLang("en")} aria-pressed={lang === "en"}>EN</button>
    </div>
  );
}

function CVApp() {
  const stored = (typeof localStorage !== "undefined" && localStorage.getItem("sorya-lang")) || null;
  const initial = stored || ((navigator.language || "fr").toLowerCase().startsWith("en") ? "en" : "fr");
  const [lang, setLangState] = useState(initial);
  const t = window.I18N[lang];
  const c = t.cv;
  const setLang = (l) => { setLangState(l); try { localStorage.setItem("sorya-lang", l); } catch (e) {} };

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = lang === "fr" ? "Sorya Chau — CV" : "Sorya Chau — Résumé";
  }, [lang]);

  return (
    <div className="cv">
      {/* top bar */}
      <div className="cv-bar">
        <div className="container cv-bar__inner">
          <a href="index.html" className="cv-back">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M8.5 11L4.5 7L8.5 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            {c.back}
          </a>
          <div className="cv-bar__right">
            <CVToggle lang={lang} setLang={setLang} />
            <button className="cv-btn" onClick={() => window.print()}>{c.print}</button>
            <a href="assets/Sorya-Chau-CV.pdf" download className="cv-btn cv-btn--primary">
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M7 1V9.5M7 9.5L3.2 5.7M7 9.5L10.8 5.7M1.5 12.5H12.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              {c.download}
            </a>
          </div>
        </div>
      </div>

      {/* sheet */}
      <div className="container">
        <article className="sheet">
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
            <main className="sheet__main">
              <section className="cv-block">
                <h2 className="cv-h2">{c.profilTitle}</h2>
                <p className="cv-profil">{c.profil}</p>
              </section>

              <section className="cv-block">
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
            </main>

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
        </article>
        <div className="cv-foot">© {new Date().getFullYear()} Sorya Chau — {t.footer.built}</div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<CVApp />);
