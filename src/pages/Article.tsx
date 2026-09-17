/* ============================================================
   Article du Journal — page dédiée, une URL par article
   (/journal/:slug). Remplace le lecteur en surimpression : le
   texte est désormais une page à part entière, donc partageable,
   indexable et lisible sans JavaScript côté navigation.
   La typographie reste celle du lecteur (classes reader__*) ;
   seule la coquille change.
   ============================================================ */
import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import "../styles/blog.css";
import type { Block } from "../i18n";
import { useLang } from "../lang";
import { useReveal } from "../lib/reveal";
import { Experience, scene } from "../components/experience";
import { Nav } from "../components/nav";
import { Contact } from "../components/sections";
import { ArrowUR } from "../components/icons";

export default function ArticlePage() {
  const { lang, t, slots } = useLang();
  const j = t.journal;
  const { slug } = useParams();

  const articles = j.articles;
  const idx = articles.findIndex((a) => a.id === slug);
  const a = idx >= 0 ? articles[idx] : null;

  useEffect(() => {
    if (a) document.title = a.title + " — Sorya Chau";
  }, [a, lang]);

  useReveal([lang, slug]);

  /* Slug inconnu (lien périmé, faute de frappe) : on renvoie au
     sommaire plutôt que d'afficher une page vide. */
  if (!a) return <Navigate to="/journal" replace />;

  const next = articles[(idx + 1) % articles.length];

  return (
    <>
      <Experience
        lang={lang}
        intro={false}
        scenes={[scene(lang, "01", ".pg-head"), scene(lang, "05", ".article"), scene(lang, "07", "#contact")]}
      />
      <Nav page="journal" />

      <main id="main">
        <div className="pg-head">
          <div className="container">
            <Link to="/journal" className="pg-back" data-cursor>
              <span className="pg-back__arrow">←</span>{j.back}
            </Link>
          </div>
        </div>

        <article className="article container">
          <header className="reader__head">
            <div className="jcard__meta">
              <span className="jcard__cat">{a.cat}</span>
              <span className="jcard__dot">·</span>
              <span>{a.date}</span>
              <span className="jcard__dot">·</span>
              <span>{a.read} {j.minRead}</span>
            </div>
            <h1 className="reader__title">{a.title}</h1>
            <p className="reader__dek">{a.dek}</p>
            <div className="reader__byline">
              <span className="reader__avatar" aria-hidden="true">SC</span>
              <div>
                <b>{j.by}</b>
                <span>{t.hero.role}</span>
              </div>
            </div>
          </header>

          <div className="reader__media" aria-hidden="true" {...({ inert: "" } as object)}>
            <image-slot id={"rslot-" + a.id} shape="rect" placeholder={a.cat} src={slots["rslot-" + a.id] || undefined}></image-slot>
            <span className="reader__media-cap">{a.cat}</span>
          </div>

          <div className="reader__body">
            {a.body.map((raw, i) => {
              /* Le contenu vient de Supabase : on lit le bloc au travers
                 du type, alt et cap n'existant que sur les visuels. */
              const b = raw as Block;
              if (b.t === "h") return <h2 className="reader__h" key={i}>{b.c}</h2>;
              if (b.t === "quote") return <blockquote className="reader__quote" key={i}>{b.c}</blockquote>;
              if (b.t === "img") return (
                <figure className="reader__fig" key={i}>
                  <img className="reader__fig-img" src={b.c} alt={b.alt || ""} loading="lazy" decoding="async" />
                  {b.cap ? <figcaption className="reader__fig-cap">{b.cap}</figcaption> : null}
                </figure>
              );
              return <p className="reader__p" key={i}>{b.c}</p>;
            })}
          </div>

          <footer className="article__foot">
            <Link to={"/journal/" + next.id} className="article__next" data-cursor>
              <span className="article__next-l">{j.next}</span>
              <span className="article__next-t">{next.title}</span>
              <ArrowUR />
            </Link>
            <Link to="/journal" className="article__all" data-cursor>{j.all}</Link>
          </footer>
        </article>
      </main>

      <Contact t={t} />
    </>
  );
}
