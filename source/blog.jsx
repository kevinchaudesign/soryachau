/* ============================================================
   Journal page → window.BlogPage
   Editorial magazine: featured + grid, in-page article reader
   driven by the URL hash (#article-id). Reuses Nav, Experience,
   Contact. No edit-bar timeline on the reading page.
   ============================================================ */
const { Nav, Experience, Contact, Icons } = window;
const { useState, useEffect, useRef } = React;

function ArticleMeta({ a, j }) {
  return (
    <div className="jcard__meta">
      <span className="jcard__cat">{a.cat}</span>
      <span className="jcard__dot">·</span>
      <span>{a.date}</span>
      <span className="jcard__dot">·</span>
      <span>{a.read} {j.minRead}</span>
    </div>
  );
}

function Reader({ a, idx, all, j, lang, onClose, onNext }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    const el = document.querySelector(".reader__scroll");
    if (el) el.scrollTop = 0;
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [a.id]);

  return (
    <div className="reader" role="dialog" aria-modal="true" aria-label={a.title}>
      <div className="reader__backdrop" onClick={onClose}></div>
      <article className="reader__sheet">
        <div className="reader__bar">
          <button className="reader__close" onClick={onClose} data-cursor aria-label={j.back}>
            <span className="reader__close-x">←</span>{j.back}
          </button>
          <span className="reader__bar-meta">{j.kicker} · {String(idx + 1).padStart(2, "0")} / {String(all.length).padStart(2, "0")}</span>
        </div>

        <div className="reader__scroll">
          <header className="reader__head">
            <ArticleMeta a={a} j={j} />
            <h1 className="reader__title">{a.title}</h1>
            <p className="reader__dek">{a.dek}</p>
            <div className="reader__byline">
              <span className="reader__avatar" aria-hidden="true">SC</span>
              <div>
                <b>{j.by}</b>
                <span>{lang === "fr" ? "Directrice de Production" : "Production Director"}</span>
              </div>
            </div>
          </header>

          <div className="reader__media" aria-hidden="true">
            <image-slot id={"rslot-" + a.id} shape="rect" placeholder={a.cat}></image-slot>
            <span className="reader__media-cap">{a.cat}</span>
          </div>

          <div className="reader__body">
            {a.body.map((b, i) => {
              if (b.t === "h") return <h2 className="reader__h" key={i}>{b.c}</h2>;
              if (b.t === "quote") return <blockquote className="reader__quote" key={i}>{b.c}</blockquote>;
              return <p className="reader__p" key={i}>{b.c}</p>;
            })}
          </div>

          <footer className="reader__foot">
            <button className="reader__next" onClick={onNext} data-cursor>
              <span className="reader__next-l">{j.next}</span>
              <span className="reader__next-t">{all[(idx + 1) % all.length].title}</span>
            </button>
          </footer>
        </div>
      </article>
    </div>
  );
}

function BlogPage() {
  const stored = (typeof localStorage !== "undefined" && localStorage.getItem("sorya-lang")) || null;
  const initial = stored || ((navigator.language || "fr").toLowerCase().startsWith("en") ? "en" : "fr");
  const [lang, setLangState] = useState(initial);
  const t = window.I18N[lang];
  const j = t.journal;
  const setLang = (l) => { setLangState(l); try { localStorage.setItem("sorya-lang", l); } catch (e) {} };

  const idFromHash = () => (location.hash || "").replace(/^#/, "");
  const [openId, setOpenId] = useState(idFromHash());

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = lang === "fr" ? "Journal — Sorya Chau" : "Journal — Sorya Chau";
  }, [lang]);

  useEffect(() => {
    const onHash = () => setOpenId(idFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // scroll reveal
  useEffect(() => {
    const els = Array.from(document.querySelectorAll(".reveal:not(.in)"));
    if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("in")); return; }
    const io = new IntersectionObserver((ents) => {
      ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    els.forEach((e) => io.observe(e));
    const fs = setTimeout(() => document.querySelectorAll(".reveal:not(.in)").forEach((e) => e.classList.add("in")), 2200);
    return () => { io.disconnect(); clearTimeout(fs); };
  }, [lang]);

  const articles = j.articles;
  const openIdx = articles.findIndex((a) => a.id === openId);
  const open = openIdx >= 0 ? articles[openIdx] : null;

  const goTo = (id) => { history.replaceState(null, "", id ? "#" + id : location.pathname); setOpenId(id || ""); };
  const feat = articles[0];
  const grid = articles.slice(1);

  return (
    <React.Fragment>
      <Experience lang={lang} intro={false} editbar={false} />
      <Nav t={t} lang={lang} setLang={setLang} base="index.html" page="journal" />

      <main className="bp">
        <header className="bp__head">
          <div className="container">
            <a href="index.html" className="bp__back" data-cursor>
              <span className="bp__back-arrow">←</span>{lang === "fr" ? "Accueil" : "Home"}
            </a>
            <span className="eyebrow bp__eyebrow"><span className="idx">{String(articles.length).padStart(2, "0")}</span>{j.eyebrow}</span>
            <h1 className="bp__title display">{j.kicker}</h1>
            <p className="bp__lead">{j.lead}</p>
          </div>
        </header>

        <div className="container">
          <a className="bp__feat reveal" onClick={() => goTo(feat.id)} data-cursor role="button" tabIndex={0}
             onKeyDown={(e) => { if (e.key === "Enter") goTo(feat.id); }}>
            <div className="bp__feat-media" aria-hidden="true">
              <image-slot id={"bslot-" + feat.id} shape="rect" placeholder={feat.cat}></image-slot>
              <span className="bp__feat-veil"></span>
              <span className="jcard__badge">{j.featured}</span>
            </div>
            <div className="bp__feat-body">
              <ArticleMeta a={feat} j={j} />
              <h2 className="bp__feat-title">{feat.title}</h2>
              <p className="bp__feat-dek">{feat.dek}</p>
              <span className="jcard__cta">{j.readArticle}<Icons.ArrowUR /></span>
            </div>
          </a>

          <div className="bp__grid">
            {grid.map((a, i) => (
              <a className="bp__card reveal" key={a.id} onClick={() => goTo(a.id)} data-cursor role="button" tabIndex={0}
                 style={{ "--rd": (i % 3) * 80 + "ms" }}
                 onKeyDown={(e) => { if (e.key === "Enter") goTo(a.id); }}>
                <div className="bp__card-media" aria-hidden="true">
                  <image-slot id={"bgslot-" + a.id} shape="rect" placeholder={a.cat}></image-slot>
                  <span className="bp__card-num">{String(i + 2).padStart(2, "0")}</span>
                </div>
                <div className="bp__card-body">
                  <ArticleMeta a={a} j={j} />
                  <h3 className="bp__card-title">{a.title}</h3>
                  <p className="bp__card-dek">{a.dek}</p>
                  <span className="jcard__cta">{j.readMore}<Icons.ArrowUR /></span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </main>

      <Contact t={t} />

      {open ? (
        <Reader a={open} idx={openIdx} all={articles} j={j} lang={lang}
                onClose={() => goTo("")}
                onNext={() => goTo(articles[(openIdx + 1) % articles.length].id)} />
      ) : null}
    </React.Fragment>
  );
}

window.BlogPage = BlogPage;
ReactDOM.createRoot(document.getElementById("root")).render(<BlogPage />);
