/* ============================================================
   Work page → window.WorkPage
   Full filmography: wide film-strip rows + category filters.
   Reuses Nav, Experience (lightbox/HUD/reticle), Contact, PlayGlyph.
   ============================================================ */
const { Nav, Experience, Contact, PlayGlyph, Icons } = window;

const WP_CATS = {
  fr: [["all", "Tout"], ["brand", "Film de marque"], ["doc", "Documentaire"], ["post", "Post-production"], ["vfx", "3D & VFX"], ["ai", "IA"]],
  en: [["all", "All"], ["brand", "Brand film"], ["doc", "Documentary"], ["post", "Post-production"], ["vfx", "3D & VFX"], ["ai", "AI"]],
};
const WP_CATMAP = { kinder: "brand", tagheuer: "brand", krys: "brand", avene: "post", asics: "doc", fiat: "vfx", pmu: "ai" };

function FilmRow({ p, t, lang, n }) {
  const hasFilm = !!p.vimeo;
  const isPending = !!p.pending && !hasFilm;
  const watch = lang === "fr" ? "Regarder le film" : "Watch the film";
  const dropTxt = lang === "fr" ? "Déposer un visuel" : "Drop a still";
  const open = () => window.dispatchEvent(new CustomEvent("sorya:play", { detail: { id: p.vimeo, client: p.client, title: p.title } }));
  return (
    <article
      className={"filmrow reveal" + (hasFilm ? " filmrow--film" : "") + (isPending ? " filmrow--pending" : "")}
      onClick={hasFilm ? open : undefined}
      data-cursor={hasFilm ? "" : undefined}
      role={hasFilm ? "button" : undefined}
      tabIndex={hasFilm ? 0 : undefined}
      onKeyDown={hasFilm ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } } : undefined}
      aria-label={hasFilm ? p.client + " — " + p.title + " · " + watch : undefined}
    >
      <div className="filmrow__media">
        {p.still ? (
          <img className="filmrow__img" src={p.still} alt={p.client + " — " + p.title} loading="lazy" decoding="async" />
        ) : (
          <image-slot id={"wslot-" + p.id} class="filmrow__slot" shape="rect" placeholder={p.client + " — " + dropTxt}></image-slot>
        )}
        <span className="filmrow__veil" aria-hidden="true"></span>
        {hasFilm ? <span className="filmrow__play" aria-hidden="true"><PlayGlyph /></span> : null}
        <span className="filmrow__tc">{hasFilm ? "REEL" : (isPending ? (lang === "fr" ? "EN ATTENTE" : "AWAITING") : "REEL")}</span>
      </div>

      <div className="filmrow__body">
        <span className="filmrow__n">{String(n + 1).padStart(2, "0")}</span>
        <div className="filmrow__main">
          <div className="filmrow__client">{p.client}</div>
          <div className="filmrow__top">
            <h2 className="filmrow__title">{p.title}</h2>
            <span className="filmrow__year">{p.year}</span>
          </div>
          <p className="filmrow__desc">{p.desc[lang]}</p>
          <div className="filmrow__foot">
            <span className={"chip" + (p.ai ? " chip-ai" : "")}>{p.ai ? "◇ " : ""}{p.tag[lang]}</span>
            <span className="filmrow__role">{p.role[lang]}</span>
            <span className="filmrow__cta">
              {hasFilm ? <React.Fragment>{watch} <Icons.ArrowUR /></React.Fragment> : (isPending ? "+ " + dropTxt : null)}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

function WorkPage() {
  const stored = (typeof localStorage !== "undefined" && localStorage.getItem("sorya-lang")) || null;
  const initial = stored || ((navigator.language || "fr").toLowerCase().startsWith("en") ? "en" : "fr");
  const [lang, setLangState] = React.useState(initial);
  const [cat, setCat] = React.useState("all");
  const t = window.I18N[lang];
  const setLang = (l) => { setLangState(l); try { localStorage.setItem("sorya-lang", l); } catch (e) {} };

  React.useEffect(() => {
    document.documentElement.lang = lang;
    document.title = lang === "fr" ? "Réalisations — Sorya Chau" : "Work — Sorya Chau";
  }, [lang]);

  // scroll reveal (re-run on filter change)
  React.useEffect(() => {
    const els = Array.from(document.querySelectorAll(".reveal:not(.in)"));
    if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("in")); return; }
    const io = new IntersectionObserver((ents) => {
      ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });
    els.forEach((e) => io.observe(e));
    const fs = setTimeout(() => document.querySelectorAll(".reveal:not(.in)").forEach((e) => e.classList.add("in")), 2400);
    return () => { io.disconnect(); clearTimeout(fs); };
  }, [lang, cat]);

  const list = window.PROJECTS.filter((p) => cat === "all" || WP_CATMAP[p.id] === cat);
  const count = window.PROJECTS.length;

  return (
    <React.Fragment>
      <Experience lang={lang} intro={false} />
      <Nav t={t} lang={lang} setLang={setLang} base="index.html" page="work" />

      <main className="wp">
        <header className="wp__head">
          <div className="container">
            <a href="index.html" className="wp__back" data-cursor>
              <span className="wp__back-arrow">←</span>{lang === "fr" ? "Retour" : "Back"}
            </a>
            <span className="eyebrow wp__eyebrow"><span className="idx">{String(count).padStart(2, "0")}</span>{t.work.eyebrow}</span>
            <h1 className="wp__title display">{lang === "fr" ? "Réalisations" : "Selected work"}</h1>
            <p className="wp__lead">{t.work.lead}</p>

            <div className="wp__filters" role="tablist" aria-label={t.work.eyebrow}>
              {WP_CATS[lang].map(([k, label]) => {
                const c = k === "all" ? count : window.PROJECTS.filter((p) => WP_CATMAP[p.id] === k).length;
                return (
                  <button key={k} className={"wp__filter" + (cat === k ? " is-on" : "")} onClick={() => setCat(k)} role="tab" aria-selected={cat === k}>
                    {label}<sup>{c}</sup>
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        <div className="container wp__list">
          {list.map((p, i) => <FilmRow key={p.id} p={p} t={t} lang={lang} n={window.PROJECTS.indexOf(p)} />)}
        </div>
      </main>

      <Contact t={t} />
    </React.Fragment>
  );
}

window.WorkPage = WorkPage;
ReactDOM.createRoot(document.getElementById("root")).render(<WorkPage />);
