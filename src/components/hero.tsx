/* ============================================================
   Hero + HeroMonitor (animated control-room monitor)
   ============================================================ */
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { Lang, Messages } from "../i18n";
import { useLang } from "../lang";
import { CV_PDF } from "../lib/assets";
import { ArrowUR, DownloadIcon } from "./icons";

export function HeroMonitor({ lang }: { lang: Lang }) {
  const { projects } = useLang();
  const reel = useMemo(() => projects.filter((p) => p.still), [projects]);
  const [idx, setIdx] = useState(0);
  useEffect(() => { setIdx(0); }, [reel]);

  useEffect(() => {
    if (reel.length < 2) return;
    const id = setInterval(() => setIdx((v) => (v + 1) % reel.length), 4400);
    return () => clearInterval(id);
  }, [reel.length]);

  const cur = reel[idx] || ({} as (typeof reel)[number]);
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
      </div>
      {/* L'ardoise ne garde que ce qu'elle seule apprend : le film à
          l'image. Le timecode vit dans la barre de montage. */}
      <div className="hmon__slate">
        <span className="hmon__slate-k">{lang === "fr" ? "À L'IMAGE" : "NOW PLAYING"}</span>
        <span className="hmon__slate-name">{cur.client} <em>— {cur.title}</em></span>
      </div>
    </div>
  );
}

export function Hero({ t, lang }: { t: Messages; lang: Lang }) {
  const h = t.hero;
  /* Deux chiffres depuis les textes def : le troisième (talents par
     production) a été retiré à la demande de Sorya. */
  const stats = [
    { n: h.m1n, l: h.m1l },
    { n: h.m2n, l: h.m2l },
  ];
  return (
    <section className="hero" id="top">
      <HeroMonitor lang={lang} />
      <div className="hero__frame" aria-hidden="true">
        <span className="regmark regmark--tr"></span>
        <span className="regmark regmark--bl"></span>
        <span className="regmark regmark--br"></span>
      </div>

      <div className="container hero__inner">
        {/* « Paris » puis l'eyebrow retirés de l'accroche à la demande
            de Sorya : l'eyebrow répétait le titre juste en dessous. */}
        <div className="hero__top reveal">
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
          <a href={CV_PDF[lang]} download className="btn btn-primary">
            <DownloadIcon />{h.ctaCV}
          </a>
          <Link to="/work" className="btn btn-ghost">
            {h.ctaWork}<ArrowUR />
          </Link>
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

    </section>
  );
}
