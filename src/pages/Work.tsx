/* ============================================================
   Work page — full filmography: wide film-strip rows +
   category filters. Reuses Nav, Experience, Contact, PlayGlyph.
   ============================================================ */
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/work.css";
import type { Lang, Messages, Project } from "../i18n";
import { useLang } from "../lang";
import { Experience, scene } from "../components/experience";
import { Nav } from "../components/nav";
import { Contact } from "../components/sections";
import { ArrowUR, PlayGlyph } from "../components/icons";

const WP_CATS: Record<Lang, [string, string][]> = {
  fr: [["all", "Tout"], ["brand", "Film de marque"], ["corp", "Film institutionnel"], ["doc", "Documentaire"], ["post", "Post-production"], ["vfx", "3D"], ["clip", "Clip"]],
  en: [["all", "All"], ["brand", "Brand film"], ["corp", "Corporate film"], ["doc", "Documentary"], ["post", "Post-production"], ["vfx", "3D"], ["clip", "Music video"]],
};
/* Fallback for content cached before the category column existed */
const WP_CATMAP: Record<string, string> = { kinder: "brand", petitballon: "brand", tagheuer: "brand", krys: "corp", avene: "post", asics: "doc", fiat: "vfx", universal: "clip" };
const catOf = (p: Project) => p.category || WP_CATMAP[p.id] || "brand";

/* Piste de montage de la page : en-tête, filmographie, contact */
const WP_SCENES = (lang: Lang) => [scene(lang, "01", ".wp__head"), scene(lang, "04", ".wp__list"), scene(lang, "07", "#contact")];

function FilmRow({ p, t, lang, n }: { p: Project; t: Messages; lang: Lang; n: number }) {
  const { slots } = useLang();
  const film = p.youtube || p.vimeo;
  const hasFilm = !!film;
  const isPending = !!p.pending && !hasFilm;
  const watch = lang === "fr" ? "Regarder le film" : "Watch the film";
  const dropTxt = lang === "fr" ? "Déposer un visuel" : "Drop a still";
  const open = () => window.dispatchEvent(new CustomEvent("sorya:play", {
    detail: { id: film, client: p.client, title: p.title, source: p.youtube ? "youtube" : "vimeo" },
  }));
  /* Récit du projet : l'anglais retombe sur le français tant qu'il
     n'est pas traduit, plutôt que d'afficher un bloc vide. */
  const story = (f?: Record<Lang, string>) => (f ? f[lang] || f.fr : "");
  /* Le contenu vient de Supabase : une clé absente en base ne doit
     jamais vider la page, d'où ces libellés de repli. */
  const L = t.work.labels || (lang === "fr"
    ? { challenge: "Le défi", contribution: "Mon rôle", outcome: "Le résultat" }
    : { challenge: "The challenge", contribution: "My role", outcome: "The outcome" });
  return (
    <article
      className={"filmrow reveal" + (hasFilm ? " filmrow--film" : "") + (isPending ? " filmrow--pending" : "")}
      data-cursor={hasFilm ? "" : undefined}
      style={{ position: "relative" }}
    >
      {hasFilm ? (
        <button type="button" className="card-hit" onClick={open} aria-label={p.client + " — " + p.title + " · " + watch}></button>
      ) : null}
      <div className="filmrow__media">
        {p.still ? (
          <img className="filmrow__img" src={p.still} alt={p.client + " — " + p.title} loading="lazy" decoding="async" />
        ) : (
          <image-slot id={"wslot-" + p.id} class="filmrow__slot" shape="rect" placeholder={p.client + " — " + dropTxt} src={slots["wslot-" + p.id] || undefined}></image-slot>
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

          {story(p.challenge) || story(p.contribution) || story(p.outcome) ? (
            <dl className="story">
              {story(p.challenge) ? (
                <div className="story__b"><dt>{L.challenge}</dt><dd>{story(p.challenge)}</dd></div>
              ) : null}
              {story(p.contribution) ? (
                <div className="story__b"><dt>{L.contribution}</dt><dd>{story(p.contribution)}</dd></div>
              ) : null}
              {story(p.outcome) ? (
                <div className="story__b"><dt>{L.outcome}</dt><dd>{story(p.outcome)}</dd></div>
              ) : null}
            </dl>
          ) : null}

          <div className="filmrow__foot">
            <span className="chip">{p.tag[lang]}</span>
            <span className="filmrow__cta">
              {hasFilm ? <React.Fragment>{watch} <ArrowUR /></React.Fragment> : (isPending ? "+ " + dropTxt : null)}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function WorkPage() {
  const { lang, t, projects } = useLang();
  const [cat, setCat] = useState("all");
  const scenes = useMemo(() => WP_SCENES(lang), [lang]);

  useEffect(() => {
    document.title = t.nav.projets + " — Sorya Chau";
  }, [lang]);

  // scroll reveal (re-run on filter change)
  useEffect(() => {
    const els = Array.from(document.querySelectorAll(".reveal:not(.in)"));
    if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("in")); return; }
    const io = new IntersectionObserver((ents) => {
      ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });
    els.forEach((e) => io.observe(e));
    const fs = setTimeout(() => document.querySelectorAll(".reveal:not(.in)").forEach((e) => e.classList.add("in")), 2400);
    return () => { io.disconnect(); clearTimeout(fs); };
  }, [lang, cat]);

  const list = projects.filter((p) => cat === "all" || catOf(p) === cat);
  const count = projects.length;

  return (
    <React.Fragment>
      <Experience lang={lang} intro={false} scenes={scenes} />
      <Nav page="projets" />

      <main id="main" className="wp">
        <header className="wp__head">
          <div className="container">
            <Link to="/" className="wp__back" data-cursor>
              <span className="wp__back-arrow">←</span>{lang === "fr" ? "Retour" : "Back"}
            </Link>
            <span className="eyebrow wp__eyebrow"><span className="idx">{String(count).padStart(2, "0")}</span>{t.work.eyebrow}</span>
            <h1 className="wp__title display">{t.nav.projets}</h1>
            <p className="wp__lead">{t.work.lead}</p>

            <div className="wp__filters" role="tablist" aria-label={t.work.eyebrow}>
              {WP_CATS[lang].map(([k, label]) => {
                const c = k === "all" ? count : projects.filter((p) => catOf(p) === k).length;
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
          {list.map((p) => <FilmRow key={p.id} p={p} t={t} lang={lang} n={projects.indexOf(p)} />)}
        </div>
      </main>

      <Contact t={t} />
    </React.Fragment>
  );
}
