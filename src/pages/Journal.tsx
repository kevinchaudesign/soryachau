/* ============================================================
   Journal page — editorial magazine: featured + grid, in-page
   article reader driven by the URL hash (#article-id).
   Reuses Nav, Experience, Contact. No edit-bar timeline on the
   reading page.
   ============================================================ */
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/blog.css";
import type { Article, Lang, Messages } from "../i18n";
import { useLang } from "../lang";
import { Experience } from "../components/experience";
import { Nav } from "../components/nav";
import { Contact } from "../components/sections";
import { ArrowUR } from "../components/icons";

type JournalT = Messages["journal"];

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

function Reader({ a, idx, all, j, lang, onClose, onNext }: { a: Article; idx: number; all: Article[]; j: JournalT; lang: Lang; onClose: () => void; onNext: () => void }) {
  const { slots } = useLang();
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
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
            <image-slot id={"rslot-" + a.id} shape="rect" placeholder={a.cat} src={slots["rslot-" + a.id] || undefined}></image-slot>
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

export default function JournalPage() {
  const { lang, t, slots } = useLang();
  const j = t.journal;
  const location = useLocation();

  const idFromHash = () => (window.location.hash || "").replace(/^#/, "");
  const [openId, setOpenId] = useState(idFromHash());

  useEffect(() => {
    document.title = lang === "fr" ? "Journal — Sorya Chau" : "Journal — Sorya Chau";
  }, [lang]);

  /* Hash → open article. The router location covers client-side navigations
     (nav links, teaser cards); hashchange covers manual edits / back-forward. */
  useEffect(() => { setOpenId(idFromHash()); }, [location]);
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

  const goTo = (id: string) => { history.replaceState(null, "", id ? "#" + id : window.location.pathname); setOpenId(id || ""); };
  const feat = articles[0];
  const grid = articles.slice(1);

  return (
    <React.Fragment>
      <Experience lang={lang} intro={false} editbar={false} />
      <Nav page="journal" />

      <main className="bp">
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
          <a className="bp__feat reveal" onClick={() => goTo(feat.id)} data-cursor role="button" tabIndex={0}
             onKeyDown={(e) => { if (e.key === "Enter") goTo(feat.id); }}>
            <div className="bp__feat-media" aria-hidden="true">
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
          </a>

          <div className="bp__grid">
            {grid.map((a, i) => (
              <a className="bp__card reveal" key={a.id} onClick={() => goTo(a.id)} data-cursor role="button" tabIndex={0}
                 style={{ "--rd": (i % 3) * 80 + "ms" }}
                 onKeyDown={(e) => { if (e.key === "Enter") goTo(a.id); }}>
                <div className="bp__card-media" aria-hidden="true">
                  <image-slot id={"bgslot-" + a.id} shape="rect" placeholder={a.cat} src={slots["bgslot-" + a.id] || undefined}></image-slot>
                  <span className="bp__card-num">{String(i + 2).padStart(2, "0")}</span>
                </div>
                <div className="bp__card-body">
                  <ArticleMeta a={a} j={j} />
                  <h3 className="bp__card-title">{a.title}</h3>
                  <p className="bp__card-dek">{a.dek}</p>
                  <span className="jcard__cta">{j.readMore}<ArrowUR /></span>
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
