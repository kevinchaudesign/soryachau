/* ============================================================
   Nav + Hero  →  window.Nav, window.Hero
   ============================================================ */
const { useState, useEffect, useRef } = React;
const pad2 = (x) => String(x).padStart(2, "0");

/* — small inline icons (simple shapes only) — */
function ArrowUR({ cls }) {
  return (
    <svg className={"arrow " + (cls || "")} width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M3.5 10.5L10.5 3.5M10.5 3.5H4.5M10.5 3.5V9.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ArrowDown() {
  return (
    <svg width="13" height="20" viewBox="0 0 13 20" fill="none" aria-hidden="true">
      <path d="M6.5 1V18M6.5 18L1.5 13M6.5 18L11.5 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M7 1V9.5M7 9.5L3.2 5.7M7 9.5L10.8 5.7M1.5 12.5H12.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
window.Icons = { ArrowUR, ArrowDown, DownloadIcon };

/* — Language toggle — */
function LangToggle({ lang, setLang }) {
  return (
    <div className="lang-toggle" role="group" aria-label="Language">
      <button className={lang === "fr" ? "on" : ""} onClick={() => setLang("fr")} aria-pressed={lang === "fr"}>FR</button>
      <span className="lang-sep">/</span>
      <button className={lang === "en" ? "on" : ""} onClick={() => setLang("en")} aria-pressed={lang === "en"}>EN</button>
    </div>
  );
}

function Nav({ t, lang, setLang, base = "", page = "home" }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const brandHref = base ? "index.html" : "#top";
  const hrefFor = (id) => (id === "work" ? "work.html" : id === "journal" ? "blog.html" : base + "#" + id);

  const links = [
    { id: "profil", label: t.nav.profil },
    { id: "work", label: t.nav.work },
    { id: "journal", label: t.nav.journal },
    { id: "parcours", label: t.nav.parcours },
    { id: "contact", label: t.nav.contact },
  ];

  return (
    <header className={"nav" + (scrolled ? " nav--scrolled" : "")}>
      <div className="nav__inner container">
        <a href={brandHref} className="nav__brand" aria-label="Sorya Chau">
          <span className="nav__mark">SC</span>
          <span className="nav__name">Sorya&nbsp;Chau</span>
        </a>

        <nav className="nav__links" aria-label="Primary">
          {links.map((l) => (
            <a key={l.id} href={hrefFor(l.id)} className="nav__link" aria-current={page === l.id ? "page" : undefined}>{l.label}</a>
          ))}
        </nav>

        <div className="nav__right">
          <a href="cv.html" className="nav__cv" aria-current={page === "cv" ? "page" : undefined}>{t.nav.cv}</a>
          <LangToggle lang={lang} setLang={setLang} />
          <a href={"mailto:" + t.contact.email} className="btn btn-primary nav__cta">
            {t.nav.cta}
          </a>
          <button className={"nav__burger" + (open ? " is-open" : "")} aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>
            <span></span><span></span>
          </button>
        </div>
      </div>

      <div className={"nav__mobile" + (open ? " is-open" : "")}>
        {links.map((l) => (
          <a key={l.id} href={hrefFor(l.id)} className="nav__mlink" onClick={() => setOpen(false)}>{l.label}</a>
        ))}
        <a href="cv.html" className="nav__mlink" onClick={() => setOpen(false)}>{t.nav.cv}</a>
        <div className="nav__mfoot">
          <LangToggle lang={lang} setLang={setLang} />
          <a href={"mailto:" + t.contact.email} className="btn btn-primary">{t.nav.cta}</a>
        </div>
      </div>
    </header>
  );
}

function HeroMonitor({ lang }) {
  const reel = React.useMemo(() => window.PROJECTS.filter((p) => p.still), []);
  const [idx, setIdx] = useState(0);
  const tcRef = useRef(null);
  const baseRef = useRef(reel.map(() => Math.floor(Math.random() * 90 + 5)));

  useEffect(() => {
    if (reel.length < 2) return;
    const id = setInterval(() => setIdx((v) => (v + 1) % reel.length), 4400);
    return () => clearInterval(id);
  }, [reel.length]);

  // running source timecode burn-in — throttled interval (no per-frame churn)
  useEffect(() => {
    const fps = 25; const start = performance.now();
    const write = () => {
      const elapsed = (performance.now() - start) / 1000;
      const base = baseRef.current[idx] || 0;
      const total = base + elapsed;
      const ff = Math.floor((total * fps) % fps);
      const s = Math.floor(total) % 60;
      const m = Math.floor(total / 60) % 60;
      const h = (idx + 1);
      if (tcRef.current) tcRef.current.textContent = `${pad2(h)}:${pad2(m)}:${pad2(s)}:${pad2(ff)}`;
    };
    write();
    const id = setInterval(write, 90);
    return () => clearInterval(id);
  }, [idx]);

  const cur = reel[idx] || {};
  return (
    <div className="hmon" aria-hidden="true">
      <div className="hmon__feed">
        {reel.map((p, n) => (
          <img
            key={p.id}
            className={"hmon__frame" + (n === idx ? " is-on" : "")}
            src={p.still}
            alt=""
            loading={n === 0 ? "eager" : "lazy"}
            decoding="async"
          />
        ))}
      </div>
      <div className="hmon__grade"></div>
      <div className="hmon__scanlines"></div>
      <div className="hmon__sweep"></div>
      <div className="hmon__veil-fade"></div>

      <div className="hmon__burn hmon__burn--tl">
        <span className="hmon__tally"><b></b>REC</span>
        <span className="hmon__pgm">PGM</span>
      </div>
      <div className="hmon__burn hmon__burn--tr">
        <span className="hmon__src">SRC</span>
        <span className="hmon__tc" ref={tcRef}>01:00:00:00</span>
      </div>
      <div className="hmon__slate">
        <span className="hmon__slate-k">{lang === "fr" ? "À L'IMAGE" : "NOW PLAYING"}</span>
        <span className="hmon__slate-bars" aria-hidden="true">
          {reel.map((_, n) => <i key={n} className={n === idx ? "is-on" : ""}></i>)}
        </span>
        <span className="hmon__slate-name">{cur.client} <em>— {cur.title}</em></span>
        <span className="hmon__slate-yr">{cur.year}</span>
      </div>
    </div>
  );
}

function Hero({ t, lang }) {
  const h = t.hero;
  const stats = [
    { n: h.m1n, l: h.m1l },
    { n: h.m2n, l: h.m2l },
    { n: h.m3n, l: h.m3l },
  ];
  return (
    <section className="hero" id="top">
      <HeroMonitor lang={lang} />
      <div className="hero__frame" aria-hidden="true">
        <span className="regmark regmark--tr"></span>
        <span className="regmark regmark--bl"></span>
        <span className="regmark regmark--br"></span>
      </div>
      <div className="hero__rail" aria-hidden="true">
        <span>Paris · Île-de-France</span>
        <span className="hero__rail-line"></span>
        <span>48.8566° N</span>
      </div>
      <div className="hero__scan" aria-hidden="true"></div>

      <div className="container hero__inner">
        <div className="hero__top reveal">
          <span className="eyebrow"><span className="idx">00</span>{h.role} · Paris</span>
          <span className="hero__avail">
            <span className="avail-mark"></span>{t.avail}
          </span>
        </div>

        <h1 className="hero__title display reveal" style={{ "--rd": "60ms" }}>
          <span className="hero__line">{h.title1}</span>
          <span className="hero__accent"><span className="hero__accent-wipe">{h.accent}</span></span>
          {h.title2 ? <span className="hero__line">{h.title2}</span> : null}
        </h1>

        <p className="hero__sub reveal" style={{ "--rd": "140ms" }}>{h.sub}</p>

        <div className="hero__cta reveal" style={{ "--rd": "220ms" }}>
          <a href="assets/Sorya-Chau-CV.pdf" download className="btn btn-primary">
            <Icons.DownloadIcon />{h.ctaCV}
          </a>
          <a href="work.html" className="btn btn-ghost">
            {h.ctaWork}<Icons.ArrowUR />
          </a>
        </div>

        <div className="hero__stats reveal" style={{ "--rd": "300ms" }}>
          {stats.map((s, i) => (
            <div className="hero__stat" key={i}>
              <span className="hero__stat-n">{s.n}</span>
              <span className="hero__stat-l">{s.l}</span>
            </div>
          ))}
        </div>
      </div>

      <a href="#profil" className="hero__scroll reveal" style={{ "--rd": "380ms" }} aria-label={h.scroll}>
        <span>{h.scroll}</span>
        <Icons.ArrowDown />
      </a>
    </section>
  );
}

Object.assign(window, { Nav, Hero, HeroMonitor, LangToggle });
