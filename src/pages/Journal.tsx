/* ============================================================
   Journal — sommaire éditorial : une à la une, puis la grille.
   Chaque article a sa page (/journal/:slug, cf. pages/Article).
   Reuses Nav, Experience, Contact — la barre de montage est là
   comme sur les autres pages ; le lecteur d'article passe devant.
   ============================================================ */
import React, { useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/blog.css";
import type { Article, Lang, Messages } from "../i18n";
import { useLang } from "../lang";
import { Experience, scene } from "../components/experience";
import { Nav } from "../components/nav";
import { Contact } from "../components/sections";
import { ArrowUR } from "../components/icons";

type JournalT = Messages["journal"];

/* Piste de montage de la page : en-tête, sommaire, contact.
   Le lecteur d'article passe au-dessus (z-index 130 > 60). */
const BP_SCENES = (lang: Lang) => [scene(lang, "01", ".bp__head"), scene(lang, "05", ".bp__feat"), scene(lang, "07", "#contact")];

function ArticleMeta({ a, j }: { a: Article; j: JournalT }) {
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

export default function JournalPage() {
  const { lang, t, slots } = useLang();
  const scenes = useMemo(() => BP_SCENES(lang), [lang]);
  const j = t.journal;
  const location = useLocation();

  const navigate = useNavigate();

  useEffect(() => {
    document.title = lang === "fr" ? "Journal — Sorya Chau" : "Journal — Sorya Chau";
  }, [lang]);

  /* Anciens liens /journal#article : on renvoie vers la page de
     l'article, pour ne pas casser ce qui a déjà été partagé. */
  useEffect(() => {
    const id = (window.location.hash || "").replace(/^#/, "");
    if (id && j.articles.some((a) => a.id === id)) navigate("/journal/" + id, { replace: true });
    // eslint-disable-next-line
  }, [location]);

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
  const feat = articles[0];
  const grid = articles.slice(1);

  return (
    <React.Fragment>
      <Experience lang={lang} intro={false} scenes={scenes} />
      <Nav page="journal" />

      <main id="main" className="bp">
        <header className="bp__head">
          <div className="container">
            <Link to="/" className="bp__back" data-cursor>
              <span className="bp__back-arrow">←</span>{lang === "fr" ? "Accueil" : "Home"}
            </Link>
            <span className="eyebrow bp__eyebrow"><span className="idx">{String(articles.length).padStart(2, "0")}</span>{j.eyebrow}</span>
            <h1 className="bp__title display">{j.kicker}</h1>
            <p className="bp__lead">{j.lead}</p>
          </div>
        </header>

        <div className="container">
          {/* liens de hash natifs : le listener hashchange ouvre le lecteur,
              la sémantique et le clavier sont ceux d'un vrai lien */}
          <Link className="bp__feat reveal" to={"/journal/" + feat.id} data-cursor>
            <div className="bp__feat-media" aria-hidden="true" {...({ inert: "" } as object)}>
              <image-slot id={"bslot-" + feat.id} shape="rect" placeholder={feat.cat} src={slots["bslot-" + feat.id] || undefined}></image-slot>
              <span className="bp__feat-veil"></span>
              <span className="jcard__badge">{j.featured}</span>
            </div>
            <div className="bp__feat-body">
              <ArticleMeta a={feat} j={j} />
              <h2 className="bp__feat-title">{feat.title}</h2>
              <p className="bp__feat-dek">{feat.dek}</p>
              <span className="jcard__cta">{j.readArticle}<ArrowUR /></span>
            </div>
          </Link>

          <div className="bp__grid">
            {grid.map((a, i) => (
              <Link className="bp__card reveal" key={a.id} to={"/journal/" + a.id} data-cursor
                 style={{ "--rd": (i % 3) * 80 + "ms" }}>
                <div className="bp__card-media" aria-hidden="true" {...({ inert: "" } as object)}>
                  <image-slot id={"bgslot-" + a.id} shape="rect" placeholder={a.cat} src={slots["bgslot-" + a.id] || undefined}></image-slot>
                  <span className="bp__card-num">{String(i + 2).padStart(2, "0")}</span>
                </div>
                <div className="bp__card-body">
                  <ArticleMeta a={a} j={j} />
                  <h3 className="bp__card-title">{a.title}</h3>
                  <p className="bp__card-dek">{a.dek}</p>
                  <span className="jcard__cta">{j.readMore}<ArrowUR /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Contact t={t} />

    </React.Fragment>
  );
}
