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

  const home = page === "home";
  /* Site multi-pages : chaque entrée de nav est une route à part entière.
     Seul Contact reste une ancre — le footer #contact est présent sur
     toutes les pages, on scrolle donc vers celui de la page courante. */
  const ROUTES: Record<string, string> = {
    approche: "/approche",
    expertises: "/expertises",
    projets: "/projets",
    apropos: "/a-propos",
    journal: "/journal",
  };

  const links = [
    { id: "approche", label: t.nav.approche },
    { id: "expertises", label: t.nav.expertises },
    { id: "projets", label: t.nav.projets },
    { id: "apropos", label: t.nav.apropos },
    { id: "journal", label: t.nav.journal },
    { id: "contact", label: t.nav.contact },
  ];

  const navLink = (l: { id: string; label: string }, cls: string, onClick?: () => void) => {
    const cur = page === l.id ? "page" : undefined;
    const to = ROUTES[l.id];
    if (!to) {
      return <a key={l.id} href={"#" + l.id} className={cls} aria-current={cur} onClick={onClick}>{l.label}</a>;
    }
    return <Link key={l.id} to={to} className={cls} aria-current={cur} onClick={onClick}>{l.label}</Link>;
  };

  return (
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
          <a href={"mailto:" + t.contact.email} className="btn btn-primary nav__cta">
            {t.nav.cta}
          </a>
          <button className={"nav__burger" + (open ? " is-open" : "")} aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>
            <span></span><span></span>
          </button>
        </div>
      </div>

      <div className={"nav__mobile" + (open ? " is-open" : "")}>
        {links.map((l) => navLink(l, "nav__mlink", () => setOpen(false)))}
        <Link to="/cv" className="nav__mlink" onClick={() => setOpen(false)}>{t.nav.cv}</Link>
        <div className="nav__mfoot">
          <LangToggle lang={lang} setLang={setLang} />
          <a href={"mailto:" + t.contact.email} className="btn btn-primary">{t.nav.cta}</a>
        </div>
      </div>
    </header>
  );
}
