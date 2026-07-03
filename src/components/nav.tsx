/* ============================================================
   Nav + LangToggle
   ============================================================ */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../lang";
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
  /* Prototype URLs → routes: work.html → /work · blog.html → /journal ·
     other entries are home anchors (plain hash on the home page itself). */
  const toFor = (id: string) => (id === "work" ? "/work" : id === "journal" ? "/journal" : "/#" + id);

  const links = [
    { id: "profil", label: t.nav.profil },
    { id: "work", label: t.nav.work },
    { id: "journal", label: t.nav.journal },
    { id: "parcours", label: t.nav.parcours },
    { id: "contact", label: t.nav.contact },
  ];

  const navLink = (l: { id: string; label: string }, cls: string, onClick?: () => void) => {
    const cur = page === l.id ? "page" : undefined;
    if (home && l.id !== "work" && l.id !== "journal") {
      return <a key={l.id} href={"#" + l.id} className={cls} aria-current={cur} onClick={onClick}>{l.label}</a>;
    }
    return <Link key={l.id} to={toFor(l.id)} className={cls} aria-current={cur} onClick={onClick}>{l.label}</Link>;
  };

  return (
    <header className={"nav" + (scrolled ? " nav--scrolled" : "")}>
      <div className="nav__inner container">
        {home ? (
          <a href="#top" className="nav__brand" aria-label="Sorya Chau">
            <span className="nav__mark">SC</span>
            <span className="nav__name">Sorya&nbsp;Chau</span>
          </a>
        ) : (
          <Link to="/" className="nav__brand" aria-label="Sorya Chau">
            <span className="nav__mark">SC</span>
            <span className="nav__name">Sorya&nbsp;Chau</span>
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
