/* ============================================================
   Content sections → Profile, Workflow, Work, Parcours,
   Clients, Contact, Footer
   ============================================================ */

function SectionHead({ idx, eyebrow, title, lead, light }) {
  return (
    <div className="sec-head">
      <span className="eyebrow reveal"><span className="idx">{idx}</span>{eyebrow}</span>
      <h2 className={"section-title reveal" + (light ? " sec-head__title--wide" : "")} style={{ "--rd": "80ms" }}>{title}</h2>
      {lead ? <p className="sec-head__lead reveal" style={{ "--rd": "140ms" }}>{lead}</p> : null}
    </div>
  );
}

/* — 02 · Profile & Vision — */
function Profile({ t }) {
  const p = t.profil;
  return (
    <section className="section profile" id="profil">
      <div className="container">
        <div className="sec-head">
          <span className="eyebrow reveal"><span className="idx">02</span>{p.eyebrow}</span>
          <h2 className="section-title reveal profile__title" style={{ "--rd": "80ms" }}>{p.title}</h2>
        </div>

        <div className="profile__top">
          <div className="profile__text">
            <p className="profile__lead reveal">{p.lead}</p>
            <figure className="profile__quote reveal" style={{ "--rd": "120ms" }}>
              <span className="profile__quote-mark" aria-hidden="true">“</span>
              <blockquote>{p.vision}</blockquote>
              <figcaption><span className="profile__quote-rule"></span>{p.visionBy}</figcaption>
            </figure>
          </div>

          <figure className="profile__portrait reveal" style={{ "--rd": "180ms" }}>
            <div className="portrait">
              <image-slot id="sorya-portrait" shape="rect" placeholder={p.portraitHint}></image-slot>
              <span className="regmark regmark--tr"></span>
              <span className="regmark regmark--bl"></span>
              <span className="portrait__tally"><b></b>PORTRAIT</span>
            </div>
            <figcaption className="portrait__cap">
              <b>{p.portraitName}</b>
              <span>{p.portraitRole}</span>
            </figcaption>
          </figure>
        </div>

        <div className="profile__skills-block">
          <span className="profile__skills-label reveal">{p.skillsTitle}</span>
          <ul className="skills skills--grid">
            {p.skills.map((s, i) => (
              <li className="skill reveal" key={i} style={{ "--rd": 120 + i * 70 + "ms" }}>
                <span className="skill__k">{s.k}</span>
                <div className="skill__body">
                  <h3 className="skill__t">
                    {s.t}
                    {s.ai ? <span className="chip chip-ai skill__ai">IA</span> : null}
                  </h3>
                  <p className="skill__d">{s.d}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="profile__creds">
          <div className="cred reveal">
            <span className="cred__l">{p.formTitle}</span>
            <div className="cred__body">
              {p.form.map((f, i) => (
                <div className="cred__edu" key={i}>
                  <b>{f.t}</b>
                  <span>{f.s} · {f.y}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="cred cred--wide reveal" style={{ "--rd": "90ms" }}>
            <span className="cred__l">{p.domainsTitle}</span>
            <div className="cred__tags">
              {p.domains.map((d, i) => <span className="chip" key={i}>{d}</span>)}
            </div>
          </div>
          <div className="cred reveal" style={{ "--rd": "160ms" }}>
            <span className="cred__l">{p.langTitle}</span>
            <div className="cred__body">
              {p.langs.map((l, i) => (
                <div className="cred__lang" key={i}><span>{l.l}</span><em>{l.v}</em></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* — 03 · AI Workflow — */
function Workflow({ t }) {
  const w = t.workflow;
  return (
    <section className="section workflow">
      <div className="container">
        <div className="workflow__head">
          <span className="eyebrow reveal"><span className="idx">03</span>{w.eyebrow}</span>
          <h2 className="section-title reveal workflow__title" style={{ "--rd": "80ms" }}>{w.title}</h2>
        </div>
        <div className="workflow__pipe reveal" aria-hidden="true">
          <span className="workflow__pipe-fill"></span>
          <span className="workflow__pipe-head"></span>
          {w.steps.map((_, i) => (
            <span
              className="workflow__pipe-node"
              key={i}
              style={{ left: ((i * 2 + 1) / 8 * 100) + "%", transitionDelay: (0.25 + i * 0.5) + "s" }}
            ></span>
          ))}
        </div>
        <div className="workflow__steps">
          {w.steps.map((s, i) => (
            <div className="wstep reveal" key={i} style={{ "--rd": i * 90 + "ms" }}>
              <div className="wstep__top">
                <span className="wstep__n">0{i + 1}</span>
                <span className="wstep__dot"></span>
              </div>
              <h3 className="wstep__t">{s.t}</h3>
              <p className="wstep__d">{s.d}</p>
            </div>
          ))}
        </div>
        <div className="workflow__note reveal">
          <span className="avail-mark"></span>
          <span>{w.note}</span>
        </div>
      </div>
    </section>
  );
}

/* — 04 · Work grid — */
const CLIP_DUR = { kinder: "01:12", tagheuer: "00:48", avene: "00:36", krys: "02:04", pmu: "00:58", fiat: "01:30" };

function PlayGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path d="M8 6.2L16 11L8 15.8V6.2Z" fill="currentColor" />
    </svg>
  );
}

function WorkCard({ p, t, lang, span }) {
  const hasFilm = !!p.vimeo;
  const isPending = !!p.pending && !hasFilm;
  const watch = lang === "fr" ? "Regarder le film" : "Watch the film";
  const dropTxt = lang === "fr" ? "Déposer un visuel" : "Drop a still";
  const openFilm = () => {
    window.dispatchEvent(new CustomEvent("sorya:play", {
      detail: { id: p.vimeo, client: p.client, title: p.title },
    }));
  };
  return (
    <article
      className={"work-card work-card--" + span + (p.featured ? " is-feat" : "") + (p.ai ? " work-card--ai" : "") + (hasFilm ? " work-card--film" : "") + (isPending ? " work-card--pending" : "")}
      onClick={hasFilm ? openFilm : undefined}
      data-cursor={hasFilm ? "" : undefined}
      role={hasFilm ? "button" : undefined}
      tabIndex={hasFilm ? 0 : undefined}
      onKeyDown={hasFilm ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openFilm(); } } : undefined}
      aria-label={hasFilm ? p.client + " — " + p.title + " · " + watch : undefined}
    >
      {p.still ? (
        <div className="work-card__media">
          <img className="work-card__img" src={p.still} alt={p.client + " — " + p.title} loading="lazy" decoding="async" />
        </div>
      ) : (
        <image-slot
          id={"slot-" + p.id}
          class="work-card__media"
          shape="rect"
          placeholder={(isPending ? (lang === "fr" ? "Visuel " : "Still ") : "") + p.client + " — " + dropTxt}
        ></image-slot>
      )}
      <div className="work-card__veil" aria-hidden="true"></div>
      {hasFilm ? <span className="work-card__play" aria-hidden="true"><PlayGlyph /></span> : null}
      <div className="work-card__meta">
        <div className="work-card__top">
          <span className="work-card__client">{p.client}</span>
          <span className={"chip" + (p.ai ? " chip-ai" : "")}>{p.ai ? "◇ " : ""}{p.tag[lang]}</span>
        </div>
        <div className="work-card__bottom">
          <div className="work-card__headline">
            <h3 className="work-card__title">{p.title}</h3>
            <span className="work-card__year">{p.year}</span>
          </div>
          <div className="clipbar" aria-hidden="true">
            <div className="clipbar__track"><span className="clipbar__fill"></span></div>
            <div className="clipbar__row">
              <span>{hasFilm ? "▶ " + watch : (isPending ? "+ " + dropTxt : "▶ 00:00")}</span>
              <span>{p.ai ? (lang === "fr" ? "GÉNÉRÉ IA" : "AI REEL") : (isPending ? (lang === "fr" ? "EN ATTENTE" : "AWAITING") : "REEL")} · {isPending ? "——:——" : (CLIP_DUR[p.id] || "01:00")}</span>
            </div>
          </div>
          <div className="work-card__reveal">
            <div className="work-card__role">
              <span className="work-card__role-l">{t.work.roleLabel}</span>
              <span>{p.role[lang]}</span>
            </div>
            <p className="work-card__desc">{p.desc[lang]}</p>
          </div>
        </div>
      </div>
    </article>
  );
}

function Work({ t, lang }) {
  const spans = ["lg", "sm", "sm", "lg", "third", "third", "third"]; // 7 projects rhythm
  return (
    <section className="section" id="work">
      <div className="container">
        <SectionHead idx="04" eyebrow={t.work.eyebrow} title={t.work.title} lead={t.work.lead} light />
        <div className="work-grid">
          {window.PROJECTS.map((p, i) => (
            <div className={"work-cell work-cell--" + spans[i] + " reveal"} key={p.id} style={{ "--rd": (i % 3) * 90 + "ms" }}>
              <WorkCard p={p} t={t} lang={lang} span={spans[i]} />
            </div>
          ))}
        </div>
        <a href="work.html" className="work-all reveal">
          <span>{lang === "fr" ? "Voir toutes les réalisations" : "View all work"}</span>
          <Icons.ArrowUR />
        </a>
      </div>
    </section>
  );
}

/* — 05 · Journal teaser — */
function Journal({ t, lang }) {
  const j = t.journal;
  const feat = j.articles[0];
  const rest = j.articles.slice(1, 3);
  return (
    <section className="section journalt" id="journal">
      <div className="container">
        <div className="journalt__head">
          <SectionHead idx="05" eyebrow={j.eyebrow} title={j.title} lead={j.lead} light />
          <a href="blog.html" className="journalt__all reveal" data-cursor>
            <span>{j.all}</span><Icons.ArrowUR />
          </a>
        </div>
        <div className="journalt__grid">
          <a href={"blog.html#" + feat.id} className="jcard jcard--feat reveal" data-cursor>
            <div className="jcard__media" aria-hidden="true">
              <image-slot id={"jslot-" + feat.id} shape="rect" placeholder={feat.cat}></image-slot>
              <span className="jcard__veil"></span>
              <span className="jcard__badge">{j.featured}</span>
            </div>
            <div className="jcard__body">
              <div className="jcard__meta"><span className="jcard__cat">{feat.cat}</span><span className="jcard__dot">·</span><span>{feat.date}</span><span className="jcard__dot">·</span><span>{feat.read} {j.minRead}</span></div>
              <h3 className="jcard__title">{feat.title}</h3>
              <p className="jcard__dek">{feat.dek}</p>
              <span className="jcard__cta">{j.readArticle}<Icons.ArrowUR /></span>
            </div>
          </a>
          <div className="journalt__list">
            {rest.map((a, i) => (
              <a href={"blog.html#" + a.id} className="jrow reveal" key={a.id} style={{ "--rd": (i + 1) * 90 + "ms" }} data-cursor>
                <span className="jrow__n">{String(i + 2).padStart(2, "0")}</span>
                <div className="jrow__main">
                  <div className="jcard__meta"><span className="jcard__cat">{a.cat}</span><span className="jcard__dot">·</span><span>{a.read} {j.minRead}</span></div>
                  <h3 className="jrow__title">{a.title}</h3>
                  <p className="jrow__dek">{a.dek}</p>
                </div>
                <Icons.ArrowUR />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* — 06 · Parcours — */
function Parcours({ t }) {
  const p = t.parcours;
  return (
    <section className="section" id="parcours">
      <div className="container">
        <SectionHead idx="06" eyebrow={p.eyebrow} title={p.title} />
        <ol className="timeline">
          {p.items.map((it, i) => (
            <li className="tl reveal" key={i} style={{ "--rd": i * 60 + "ms" }}>
              <div className="tl__year">{it.y}</div>
              <div className="tl__node" aria-hidden="true"><span></span></div>
              <div className="tl__body">
                <h3 className="tl__role">{it.r}</h3>
                <div className="tl__company">{it.c}</div>
                <p className="tl__desc">{it.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* — Clients marquee — */
function Clients({ t }) {
  const brands = ["TAG Heuer", "Vacheron Constantin", "ASICS", "Kinder", "Hermès", "Lancôme", "Armani", "Hennessy", "Fiat", "Samsung", "Krys Group", "Avène", "Coca-Cola", "Nestlé", "La Redoute", "Unesco"];
  const row = brands.concat(brands);
  return (
    <section className="clients">
      <div className="container">
        <span className="eyebrow reveal" style={{ marginBottom: "28px", display: "inline-flex" }}><span className="idx">✦</span>{t.clients.eyebrow}</span>
      </div>
      <div className="marquee">
        <div className="marquee__track">
          {row.map((b, i) => (
            <React.Fragment key={i}>
              <span className="brand">{b}</span>
              <span className="brand-sep" aria-hidden="true">◆</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

/* — 06 · Contact / Footer — */
function Contact({ t }) {
  const c = t.contact;
  const LINKEDIN = "https://www.linkedin.com/in/sorya-chau/";
  const rows = [
    { l: c.labels.email, v: c.email, href: "mailto:" + c.email },
    { l: c.labels.phone, v: c.phone, href: "tel:" + c.phoneHref },
    { l: c.labels.loc, v: c.loc, href: null },
    { l: c.labels.social, v: c.linkedin, href: LINKEDIN, ext: true },
  ];
  return (
    <footer className="contact" id="contact">
      <div className="container contact__inner">
        <span className="eyebrow reveal"><span className="idx">07</span>{c.eyebrow}</span>
        <h2 className="contact__title display reveal" style={{ "--rd": "80ms" }}>{c.title}</h2>

        <div className="contact__status reveal" style={{ "--rd": "140ms" }}>
          <span className="avail-mark"></span>{c.status}
        </div>

        <div className="contact__actions reveal" style={{ "--rd": "200ms" }}>
          <a href={"mailto:" + c.email} className="btn btn-primary">{c.cta}<Icons.ArrowUR /></a>
          <a href="assets/Sorya-Chau-CV.pdf" download className="btn btn-ghost"><Icons.DownloadIcon />CV PDF</a>
        </div>

        <div className="contact__grid reveal" style={{ "--rd": "260ms" }}>
          {rows.map((r, i) => (
            <div className="cdetail" key={i}>
              <span className="cdetail__l">{r.l}</span>
              {r.href ? (
                <a className="cdetail__v" href={r.href} target={r.ext ? "_blank" : undefined} rel={r.ext ? "noopener" : undefined}>
                  {r.v}{r.ext ? <Icons.ArrowUR /> : null}
                </a>
              ) : (
                <span className="cdetail__v">{r.v}</span>
              )}
            </div>
          ))}
        </div>

        <div className="contact__foot">
          <span className="contact__brand">Sorya Chau</span>
          <span className="contact__built">© {new Date().getFullYear()} — {t.footer.built}</span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { SectionHead, Profile, Workflow, Work, WorkCard, PlayGlyph, Journal, Parcours, Clients, Contact });
