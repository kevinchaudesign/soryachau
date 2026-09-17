/* ============================================================
   Nav + LangToggle
   ============================================================ */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../lang";
import { Logo } from "./logo";
import type { Lang } from "../i18n";

export function LangToggle({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div className="lang-toggle" role="group" aria-label="Language">
      <button className={lang === "fr" ? "on" : ""} onClick={() => setLang("fr")} aria-pressed={lang === "fr"}>FR</button>
      <span className="lang-sep">/</span>
      <button className={lang === "en" ? "on" : ""} onClick={() => setLang("en")} aria-pressed={lang === "en"}>EN</button>
    </div>
  );
}

export function Nav({ page = "home" }: { page?: string }) {
  const { t, lang, setLang } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Menu plein écran : on bloque le défilement derrière lui et on
     ferme à Échap, comme les autres couches modales du site. */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [open]);

  const home = page === "home";
  /* Site multi-pages : chaque entrée de nav est une route à part entière.
     Le footer #contact reste présent en bas de chaque page ; la nav, elle,
     mène à la page Contact. */
  const ROUTES: Record<string, string> = {
    approche: "/approche",
    expertises: "/expertises",
    projets: "/projets",
    apropos: "/a-propos",
    journal: "/journal",
    contact: "/contact",
  };

  const links = [
    { id: "approche", label: t.nav.approche },
    { id: "expertises", label: t.nav.expertises },
    { id: "projets", label: t.nav.projets },
    { id: "apropos", label: t.nav.apropos },
    { id: "journal", label: t.nav.journal },
    { id: "contact", label: t.nav.contact },
  ];

  const navLink = (l: { id: string; label: string }, cls: string, onClick?: () => void, n?: string) => {
    const cur = page === l.id ? "page" : undefined;
    const to = ROUTES[l.id];
    if (!to) {
      return <a key={l.id} href={"#" + l.id} className={cls} aria-current={cur} onClick={onClick} data-n={n}>{l.label}</a>;
    }
    return <Link key={l.id} to={to} className={cls} aria-current={cur} onClick={onClick} data-n={n}>{l.label}</Link>;
  };

  return (
    /* Le menu plein écran vit hors du <header> : celui-ci porte un
       backdrop-filter, qui ferait de lui le bloc conteneur d'un
       enfant en position fixed — le menu se serait limité à la
       hauteur de la barre. */
    <>
    <header className={"nav" + (scrolled ? " nav--scrolled" : "")}>
      <div className="nav__inner container">
        {home ? (
          <a href="#top" className="nav__brand" aria-label="Sorya Chau">
            <Logo baseline={t.hero.role} />
          </a>
        ) : (
          <Link to="/" className="nav__brand" aria-label="Sorya Chau">
            <Logo baseline={t.hero.role} />
          </Link>
        )}

        <nav className="nav__links" aria-label="Primary">
          {links.map((l) => navLink(l, "nav__link"))}
        </nav>

        <div className="nav__right">
          <Link to="/cv" className="nav__cv" aria-current={page === "cv" ? "page" : undefined}>{t.nav.cv}</Link>
          <LangToggle lang={lang} setLang={setLang} />
        </div>
      </div>
    </header>

      {/* Hors du <header> pour la même raison que le menu : le
          backdrop-filter de la barre ferait d'elle le bloc conteneur
          d'un enfant en position fixed, et le bouton se serait calé
          sur le bas de la barre au lieu du bas de l'écran. */}
      <button className={"nav__burger" + (open ? " is-open" : "")} aria-label="Menu" aria-expanded={open}
              aria-controls="nav-mobile" onClick={() => setOpen(!open)}>
        <span className="nav__burger-bars" aria-hidden="true"><span></span><span></span></span>
        <span className="nav__burger-l" aria-hidden="true">Menu</span>
      </button>

      {/* <nav> et non <div> : hors du <header>, le menu doit porter
          son propre point de repère pour les lecteurs d'écran. */}
      <nav className={"nav__mobile" + (open ? " is-open" : "")} id="nav-mobile"
           aria-label={lang === "fr" ? "Menu principal" : "Main menu"}
           {...(open ? {} : ({ inert: "" } as object))}>
        {links.map((l, i) => navLink(l, "nav__mlink", () => setOpen(false), String(i + 1).padStart(2, "0")))}
        <Link to="/cv" className="nav__mlink" onClick={() => setOpen(false)} data-n={String(links.length + 1).padStart(2, "0")}>{t.nav.cv}</Link>
        {/* Pas de bouton de contact ici : la rubrique Contact est déjà
            dans la liste, juste au-dessus. */}
        <div className="nav__mfoot">
          <LangToggle lang={lang} setLang={setLang} />
        </div>
      </nav>
    </>
  );
}
