/* ============================================================
   Sections de contenu. Deux usages :
   · version pleine (Approche, Expertises, APropos) → pages dédiées
   · version aperçu (…Teaser) → accueil, avec lien vers la page
   Work et Journal n'existent que comme aperçus ; leur version
   pleine vit dans les pages Projets et Journal.
   ============================================================ */
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import type { Lang, Messages, Project } from "./../i18n";
import { useLang } from "../lang";
import { CV_PDF } from "../lib/assets";
import { ArrowUR, DownloadIcon, PlayGlyph } from "./icons";

export function SectionHead({ idx, eyebrow, title, lead, light }: { idx: string; eyebrow: string; title: string; lead?: string; light?: boolean }) {
  /* Aperçus de l'accueil uniquement : sur une page dédiée, le titre
     principal est porté par l'en-tête commun (cf. PageHead). */
  return (
    <div className="sec-head">
      <span className="eyebrow reveal"><span className="idx">{idx}</span>{eyebrow}</span>
      <h2 className={"section-title reveal" + (light ? " sec-head__title--wide" : "")} style={{ "--rd": "80ms" }}>{title}</h2>
      {lead ? <p className="sec-head__lead reveal" style={{ "--rd": "140ms" }}>{lead}</p> : null}
    </div>
  );
}

/* Timecode courant du portrait-moniteur. Écrit dans un ref à
   10 images par seconde : pas de rendu React par frame. */
const p2 = (n: number) => String(n).padStart(2, "0");
function PortraitTC() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const fps = 25, start = performance.now(), base = 12 * 60 + 4;
    const write = () => {
      const total = base + (performance.now() - start) / 1000;
      if (ref.current) {
        ref.current.textContent =
          "02:" + p2(Math.floor(total / 60) % 60) + ":" + p2(Math.floor(total) % 60) + ":" + p2(Math.floor((total * fps) % fps));
      }
    };
    write();
    if (typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(write, 100);
    return () => clearInterval(id);
  }, []);
  return <span className="portrait__tc" ref={ref}>02:12:04:08</span>;
}

/* — 02 · Approche (page /approche) —
   Eyebrow et titre vivent dans l'en-tête de page : la section
   commence donc au corps du texte. */
export function Approche({ t }: { t: Messages }) {
  const a = t.approche;
  const { slots } = useLang();

  /* Piste de montage des principes : la jauge du rail suit le
     défilement et le clip qui passe le playhead s'allume. Tout est
     posé en CSS custom property / classe, jamais en état React,
     pour ne pas rendre à chaque frame. */
  useEffect(() => {
    const list = document.querySelector<HTMLElement>(".method__list");
    if (!list) return;
    const items = Array.from(list.querySelectorAll<HTMLElement>(".method__item"));
    if (typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches) {
      list.style.setProperty("--pr", "1");
      items.forEach((el) => el.classList.add("is-on"));
      return;
    }
    let raf = 0;
    const tick = () => {
      raf = 0;
      const r = list.getBoundingClientRect();
      const head = window.innerHeight * 0.58;
      list.style.setProperty("--pr", String(Math.min(1, Math.max(0, (head - r.top) / (r.height || 1)))));
      items.forEach((el) => el.classList.toggle("is-on", el.getBoundingClientRect().top <= head));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    tick();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [a]);

  return (
    <section className="section profile" id="approche">
      <div className="container">
        <div className="profile__top">
          <div className="profile__text">
            <p className="profile__lead reveal">{a.lead}</p>
            {a.body.map((para, i) => (
              <p className="approche__p reveal" key={i} style={{ "--rd": 90 + i * 70 + "ms" }}>{para}</p>
            ))}
          </div>

          {/* Le portrait est traité comme le moniteur du hero :
              grade chaud, lignes de balayage, tally et timecode. */}
          <figure className="profile__portrait reveal" style={{ "--rd": "180ms" }}>
            <div className="portrait portrait--live">
              <image-slot id="sorya-portrait" shape="rect" placeholder={a.portraitHint} src={slots["sorya-portrait"] || undefined}></image-slot>
              <span className="portrait__grade" aria-hidden="true"></span>
              <span className="portrait__scan" aria-hidden="true"></span>
              <span className="portrait__sweep" aria-hidden="true"></span>
              <span className="regmark regmark--tr"></span>
              <span className="regmark regmark--bl"></span>
              <span className="portrait__tally"><b></b>PORTRAIT</span>
              <PortraitTC />
            </div>
            <figcaption className="portrait__cap">
              <b>{a.portraitName}</b>
              <span>{a.portraitRole}</span>
            </figcaption>
          </figure>
        </div>

        <div className="method">
          <div className="method__cols">
            <div className="method__head">
              <h2 className="method__title reveal">{a.methodTitle}</h2>
              <p className="method__lead reveal" style={{ "--rd": "80ms" }}>{a.methodLead}</p>
              {a.methodLead2 ? <p className="method__lead reveal" style={{ "--rd": "110ms" }}>{a.methodLead2}</p> : null}
            </div>
            <ol className="method__list">
              {a.principles.map((pr, i) => (
                <li className="method__item reveal" key={i} style={{ "--rd": 120 + i * 70 + "ms" }}>
                  <span className="method__n">{String(i + 1).padStart(2, "0")}</span>
                  <span className="method__t">{pr}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Carton : la phrase signature encadrée, repères de recadrage
            aux quatre coins comme une amorce de film. */}
        <figure className="profile__quote approche__signature reveal" style={{ "--rd": "120ms" }}>
          <span className="profile__quote-mark" aria-hidden="true">“</span>
          <blockquote>{a.signature}<span className="profile__quote-close" aria-hidden="true">”</span></blockquote>
          <figcaption><span className="profile__quote-rule"></span>{a.signatureBy}</figcaption>
          <span className="regmark regmark--tr" aria-hidden="true"></span>
          <span className="regmark regmark--bl" aria-hidden="true"></span>
          <span className="regmark regmark--br" aria-hidden="true"></span>
        </figure>
      </div>
    </section>
  );
}

/* — 03 · Expertises (page /expertises) — */
export function Expertises({ t }: { t: Messages }) {
  const e = t.expertises;
  return (
    <section className="section expertises" id="expertises">
      <div className="container">
        <div className="xp-grid">
          {e.items.map((it, i) => (
            <article className="xp reveal" key={it.k} style={{ "--rd": i * 90 + "ms" }}>
              <span className="xp__k">{it.k}</span>
              <h2 className="xp__t">{it.t}</h2>
              <p className="xp__hook">{it.hook}</p>
              <p className="xp__d">{it.d}</p>
              <p className="xp__out">{it.out}</p>
            </article>
          ))}
        </div>

        <div className="xp-bands">
          <div className="xp-band reveal">
            <span className="xp-band__l">{e.prodLabel}</span>
            <div className="xp-band__tags">
              {e.prod.map((x) => <span className="chip" key={x}>{x}</span>)}
              <span className="xp-band__note">{e.prodNote}</span>
            </div>
          </div>
          <div className="xp-band reveal" style={{ "--rd": "90ms" }}>
            <span className="xp-band__l">{e.projLabel}</span>
            <div className="xp-band__tags">
              {e.proj.map((x) => <span className="chip" key={x}>{x}</span>)}
            </div>
          </div>
        </div>

        <p className="xp-note reveal">
          <span className="avail-mark"></span>{e.note}
        </p>
      </div>
    </section>
  );
}

/* — Lien « voir la page » commun aux aperçus de l'accueil — */
export function SecAll({ to, label }: { to: string; label: string }) {
  return (
    <Link to={to} className="sec-all reveal" data-cursor>
      <span>{label}</span>
      <ArrowUR />
    </Link>
  );
}

/* — 02+03 · Aperçu Approche & Expertises → /approche, /expertises — */
export function ApprocheTeaser({ t, lang }: { t: Messages; lang: Lang }) {
  const a = t.approche;
  const e = t.expertises;
  const { slots } = useLang();
  return (
    <>
      <section className="section profile" id="approche">
        <div className="container">
          <div className="sec-head">
            <span className="eyebrow reveal"><span className="idx">02</span>{a.eyebrow}</span>
            <h2 className="section-title reveal profile__title" style={{ "--rd": "80ms" }}>{a.title}</h2>
          </div>

          <div className="profile__top">
            <div className="profile__text">
              <p className="profile__lead reveal">{a.lead}</p>
              {a.body.map((para, i) => (
                <p className="approche__p reveal" key={i} style={{ "--rd": 90 + i * 70 + "ms" }}>{para}</p>
              ))}
            </div>

            <figure className="profile__portrait reveal" style={{ "--rd": "180ms" }}>
              <div className="portrait">
                <image-slot id="sorya-portrait" shape="rect" placeholder={a.portraitHint} src={slots["sorya-portrait"] || undefined}></image-slot>
                <span className="regmark regmark--tr"></span>
                <span className="regmark regmark--bl"></span>
                <span className="portrait__tally"><b></b>PORTRAIT</span>
              </div>
              <figcaption className="portrait__cap">
                <b>{a.portraitName}</b>
                <span>{a.portraitRole}</span>
              </figcaption>
            </figure>
          </div>

          <SecAll to="/approche" label={lang === "fr" ? "Voir mon approche" : "See my approach"} />
        </div>
      </section>

      <section className="section expertises" id="expertises">
        <div className="container">
          <SectionHead idx="03" eyebrow={e.eyebrow} title={e.title} />
          <div className="xp-grid xp-grid--teaser">
            {e.items.map((it, i) => (
              <article className="xp reveal" key={it.k} style={{ "--rd": i * 90 + "ms" }}>
                <span className="xp__k">{it.k}</span>
                <h3 className="xp__t">{it.t}</h3>
                <p className="xp__hook">{it.hook}</p>
              </article>
            ))}
          </div>
          <SecAll to="/expertises" label={lang === "fr" ? "Voir les expertises" : "See the services"} />
        </div>
      </section>
    </>
  );
}

/* — 04 · Work grid — */
export const CLIP_DUR: Record<string, string> = { kinder: "01:12", tagheuer: "00:48", avene: "00:36", krys: "02:04", pmu: "00:58", fiat: "01:30" };

export function WorkCard({ p, t, lang, span }: { p: Project; t: Messages; lang: Lang; span: string }) {
  const { slots } = useLang();
  const film = p.youtube || p.vimeo;
  const hasFilm = !!film;
  const isPending = !!p.pending && !hasFilm;
  const watch = lang === "fr" ? "Regarder le film" : "Watch the film";
  const dropTxt = lang === "fr" ? "Déposer un visuel" : "Drop a still";
  const openFilm = () => {
    window.dispatchEvent(new CustomEvent("sorya:play", {
      detail: { id: film, client: p.client, title: p.title, source: p.youtube ? "youtube" : "vimeo" },
    }));
  };
  return (
    <article
      className={"work-card work-card--" + span + (p.featured ? " is-feat" : "") + (p.ai ? " work-card--ai" : "") + (hasFilm ? " work-card--film" : "") + (isPending ? " work-card--pending" : "")}
      data-cursor={hasFilm ? "" : undefined}
    >
      {hasFilm ? (
        /* vrai bouton en surcouche : sémantique et clavier natifs
           (article[role=button] n'est pas un rôle autorisé) */
        <button type="button" className="card-hit" onClick={openFilm} aria-label={p.client + " — " + p.title + " · " + watch}></button>
      ) : null}
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
          src={slots["slot-" + p.id] || undefined}
        ></image-slot>
      )}
      <div className="work-card__veil" aria-hidden="true"></div>
      {hasFilm ? <span className="work-card__play" aria-hidden="true"><PlayGlyph /></span> : null}
      <div className="work-card__meta">
        <div className="work-card__top">
          <span className="work-card__client">{p.client}</span>
          <span className="chip">{p.tag[lang]}</span>
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

export function Work({ t, lang }: { t: Messages; lang: Lang }) {
  const { projects } = useLang();
  const spans = ["lg", "sm", "sm", "lg", "third", "third", "third"]; // 7 projects rhythm
  return (
    <section className="section" id="work">
      <div className="container">
        <SectionHead idx="04" eyebrow={t.work.eyebrow} title={t.work.title} lead={t.work.lead} light />
        <div className="work-grid">
          {projects.map((p, i) => (
            <div className={"work-cell work-cell--" + spans[i % spans.length] + " reveal"} key={p.id} style={{ "--rd": (i % 3) * 90 + "ms" }}>
              <WorkCard p={p} t={t} lang={lang} span={spans[i % spans.length]} />
            </div>
          ))}
        </div>
        <Link to="/work" className="work-all reveal">
          <span>{lang === "fr" ? "Voir toutes les réalisations" : "View all work"}</span>
          <ArrowUR />
        </Link>
      </div>
    </section>
  );
}

/* — 05 · Journal teaser — */
export function Journal({ t }: { t: Messages }) {
  const j = t.journal;
  const { slots } = useLang();
  const feat = j.articles[0];
  const rest = j.articles.slice(1, 3);
  return (
    <section className="section journalt" id="journal">
      <div className="container">
        <div className="journalt__head">
          <SectionHead idx="05" eyebrow={j.eyebrow} title={j.title} lead={j.lead} light />
          <Link to="/journal" className="journalt__all reveal" data-cursor>
            <span>{j.all}</span><ArrowUR />
          </Link>
        </div>
        <div className="journalt__grid">
          <Link to={"/journal/" + feat.id} className="jcard jcard--feat reveal" data-cursor>
            <div className="jcard__media" aria-hidden="true" {...({ inert: "" } as object)}>
              <image-slot id={"jslot-" + feat.id} shape="rect" placeholder={feat.cat} src={slots["jslot-" + feat.id] || undefined}></image-slot>
              <span className="jcard__veil"></span>
              <span className="jcard__badge">{j.featured}</span>
            </div>
            <div className="jcard__body">
              <div className="jcard__meta"><span className="jcard__cat">{feat.cat}</span><span className="jcard__dot">·</span><span>{feat.date}</span><span className="jcard__dot">·</span><span>{feat.read} {j.minRead}</span></div>
              <h3 className="jcard__title">{feat.title}</h3>
              <p className="jcard__dek">{feat.dek}</p>
              <span className="jcard__cta">{j.readArticle}<ArrowUR /></span>
            </div>
          </Link>
          <div className="journalt__list">
            {rest.map((a, i) => (
              <Link to={"/journal/" + a.id} className="jrow reveal" key={a.id} style={{ "--rd": (i + 1) * 90 + "ms" }} data-cursor>
                <div className="jrow__main">
                  <div className="jcard__meta"><span className="jcard__cat">{a.cat}</span><span className="jcard__dot">·</span><span>{a.read} {j.minRead}</span></div>
                  <h3 className="jrow__title">{a.title}</h3>
                  <p className="jrow__dek">{a.dek}</p>
                </div>
                <ArrowUR />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* — 06 · À propos (page /a-propos) — */
export function APropos({ t }: { t: Messages }) {
  const a = t.apropos;
  const { slots } = useLang();
  return (
    <section className="section" id="apropos">
      <div className="container">
        <div className="apropos">
          <div className="apropos__text">
            {a.body.map((para, i) => (
              <p className="apropos__p reveal" key={i} style={{ "--rd": i * 80 + "ms" }}>{para}</p>
            ))}
          </div>
          <figure className="profile__portrait apropos__portrait reveal" style={{ "--rd": "160ms" }}>
            <div className="portrait">
              <image-slot id="sorya-portrait" shape="rect" placeholder={t.approche.portraitHint} src={slots["sorya-portrait"] || undefined}></image-slot>
              <span className="regmark regmark--tr"></span>
              <span className="regmark regmark--bl"></span>
              <span className="portrait__tally"><b></b>PORTRAIT</span>
            </div>
            <figcaption className="portrait__cap">
              <b>{t.approche.portraitName}</b>
              <span>{t.approche.portraitRole}</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

/* — 06 · Aperçu À propos → /a-propos — */
export function AProposTeaser({ t, lang }: { t: Messages; lang: Lang }) {
  const a = t.apropos;
  return (
    <section className="section" id="apropos">
      <div className="container">
        <SectionHead idx="06" eyebrow={a.eyebrow} title={a.title} />
        <div className="apropos">
          <div className="apropos__text">
            {a.body.slice(0, 2).map((para, i) => (
              <p className="apropos__p reveal" key={i} style={{ "--rd": i * 80 + "ms" }}>{para}</p>
            ))}
          </div>
        </div>
        <SecAll to="/a-propos" label={lang === "fr" ? "En savoir plus" : "Read more"} />
      </div>
    </section>
  );
}

/* — Bandeau CV → /cv — */
export function CVBand({ t, lang }: { t: Messages; lang: Lang }) {
  const c = t.cv;
  return (
    <section className="section cvband-sec">
      <div className="container">
        <div className="cvband reveal">
          <div className="cvband__main">
            <h2 className="cvband__title">{c.title}</h2>
            <p className="cvband__role">{c.role}</p>
          </div>
          <div className="cvband__actions">
            <a href={CV_PDF[lang]} download className="btn btn-ghost"><DownloadIcon />{c.download}</a>
            <Link to="/cv" className="btn btn-primary">{lang === "fr" ? "Voir le CV" : "View résumé"}<ArrowUR /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* — Clients marquee — */
export function Clients({ t }: { t: Messages }) {
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

/* — 07 · Contact / Footer —
   Bloc unique, deux emplois : pied de page sur toutes les pages, et
   corps de /contact. En page (headless), eyebrow, titre et accroche
   sont déjà dans l'en-tête commun : le bloc n'en garde que la suite. */
export function Contact({ t, headless }: { t: Messages; headless?: boolean }) {
  const c = t.contact;
  const Shell = headless ? "section" : "footer";
  const { lang, slots } = useLang(); /* le PDF servi suit la langue affichée */
  const LINKEDIN = "https://www.linkedin.com/in/soryachau/";
  const rows = [
    { l: c.labels.email, v: c.email, href: "mailto:" + c.email },
    { l: c.labels.phone, v: c.phone, href: "tel:" + c.phoneHref },
    { l: c.labels.loc, v: c.loc, href: null },
    { l: c.labels.social, v: c.linkedin, href: LINKEDIN, ext: true },
  ];
  return (
    <Shell className={"contact" + (headless ? " contact--page" : "")} id={headless ? undefined : "contact"}>
      <div className="container contact__inner">
        {headless ? null : (
          <>
            <span className="eyebrow reveal"><span className="idx">07</span>{c.eyebrow}</span>
            <h2 className="contact__title display reveal" style={{ "--rd": "80ms" }}>{c.title}</h2>
            <p className="contact__lead reveal" style={{ "--rd": "110ms" }}>{c.lead}</p>
          </>
        )}

        <div className={headless ? "contact__cols" : undefined}>
        <div className={headless ? "contact__col" : undefined}>
        <div className="contact__status reveal" style={{ "--rd": "140ms" }}>
          <span className="avail-mark"></span>{c.status}
        </div>

        <div className="contact__actions reveal" style={{ "--rd": "200ms" }}>
          <a href={"mailto:" + c.email} className="btn btn-primary">{c.cta}<ArrowUR /></a>
          <a href={CV_PDF[lang]} download className="btn btn-ghost"><DownloadIcon />CV PDF</a>
        </div>

        <div className="contact__grid reveal" style={{ "--rd": "260ms" }}>
          {rows.map((r, i) => {
            /* Toute la ligne est la cible, pas seulement la valeur :
               libellé compris, la zone cliquable double. */
            const inner = (
              <>
                <span className="cdetail__l">{r.l}</span>
                <span className="cdetail__v">{r.v}{r.ext ? <ArrowUR /> : null}</span>
              </>
            );
            return r.href ? (
              <a className="cdetail" key={i} href={r.href} target={r.ext ? "_blank" : undefined} rel={r.ext ? "noopener" : undefined}>{inner}</a>
            ) : (
              <div className="cdetail" key={i}>{inner}</div>
            );
          })}
        </div>
        </div>

        {/* Le portrait ne vient qu'en page : un visage à l'endroit
            où l'on écrit. Même emplacement que sur Approche et À
            propos, donc remplaçable depuis la régie. */}
        {headless ? (
          <figure className="profile__portrait contact__portrait reveal" style={{ "--rd": "300ms" }}>
            <div className="portrait">
              <image-slot id="sorya-portrait" shape="rect" placeholder={t.approche.portraitHint} src={slots["sorya-portrait"] || undefined}></image-slot>
              <span className="regmark regmark--tr"></span>
              <span className="regmark regmark--bl"></span>
              <span className="portrait__tally"><b></b>PORTRAIT</span>
            </div>
            <figcaption className="portrait__cap">
              <b>{t.approche.portraitName}</b>
              <span>{t.approche.portraitRole}</span>
            </figcaption>
          </figure>
        ) : null}
        </div>

        <div className="contact__foot">
          <span className="contact__brand">Sorya Chau</span>
          <span className="contact__built">© {new Date().getFullYear()} — {t.footer.built}</span>
        </div>
      </div>
    </Shell>
  );
}
