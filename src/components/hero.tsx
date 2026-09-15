/* ============================================================
   Hero + HeroMonitor (animated control-room monitor)
   ============================================================ */
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { Lang, Messages } from "../i18n";
import { useLang } from "../lang";
import { ArrowDown, ArrowUR, DownloadIcon } from "./icons";

const pad2 = (x: number) => String(x).padStart(2, "0");

export function HeroMonitor({ lang }: { lang: Lang }) {
  const { projects } = useLang();
  const reel = useMemo(() => projects.filter((p) => p.still), [projects]);
  const [idx, setIdx] = useState(0);
  const tcRef = useRef<HTMLSpanElement>(null);
  const baseRef = useRef(reel.map(() => Math.floor(Math.random() * 90 + 5)));
  useEffect(() => { baseRef.current = reel.map(() => Math.floor(Math.random() * 90 + 5)); setIdx(0); }, [reel]);

  useEffect(() => {
    if (reel.length < 2) return;
    const id = setInterval(() => setIdx((v) => (v + 1) % reel.length), 4400);
    return () => clearInterval(id);
  }, [reel.length]);

  // running source timecode burn-in — throttled interval (no per-frame churn)
  useEffect(() => {
    const fps = 25; const start = performance.now();
    const write = () => {
      const elapsed = (performance.now() - start) / 1000;
      const base = baseRef.current[idx] || 0;
      const total = base + elapsed;
      const ff = Math.floor((total * fps) % fps);
      const s = Math.floor(total) % 60;
      const m = Math.floor(total / 60) % 60;
      const h = (idx + 1);
      if (tcRef.current) tcRef.current.textContent = `${pad2(h)}:${pad2(m)}:${pad2(s)}:${pad2(ff)}`;
    };
    write();
    const id = setInterval(write, 90);
    return () => clearInterval(id);
  }, [idx]);

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
        <span className="hmon__pgm">PGM</span>
      </div>
      <div className="hmon__burn hmon__burn--tr">
        <span className="hmon__src">SRC</span>
        <span className="hmon__tc" ref={tcRef}>01:00:00:00</span>
      </div>
      <div className="hmon__slate">
        <span className="hmon__slate-k">{lang === "fr" ? "À L'IMAGE" : "NOW PLAYING"}</span>
        <span className="hmon__slate-bars" aria-hidden="true">
          {reel.map((_, n) => <i key={n} className={n === idx ? "is-on" : ""}></i>)}
        </span>
        <span className="hmon__slate-name">{cur.client} <em>— {cur.title}</em></span>
        <span className="hmon__slate-yr">{cur.year}</span>
      </div>
    </div>
  );
}

export function Hero({ t, lang }: { t: Messages; lang: Lang }) {
  const h = t.hero;
  const stats = [
    { n: h.m1n, l: h.m1l },
    { n: h.m2n, l: h.m2l },
    { n: h.m3n, l: h.m3l },
  ];
  return (
    <section className="hero" id="top">
      <HeroMonitor lang={lang} />
      <div className="hero__frame" aria-hidden="true">
        <span className="regmark regmark--tr"></span>
        <span className="regmark regmark--bl"></span>
        <span className="regmark regmark--br"></span>
      </div>
      <div className="hero__rail" aria-hidden="true">
        <span>Paris · Île-de-France</span>
        <span className="hero__rail-line"></span>
        <span>48.8566° N</span>
      </div>
      <div className="hero__scan" aria-hidden="true"></div>

      <div className="container hero__inner">
        <div className="hero__top reveal">
          <span className="eyebrow"><span className="idx">00</span>{h.role} · Paris</span>
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
          <a href="/assets/Sorya-Chau-CV.pdf" download className="btn btn-primary">
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

      <a href="#profil" className="hero__scroll reveal" style={{ "--rd": "380ms" }} aria-label={h.scroll}>
        <span>{h.scroll}</span>
        <ArrowDown />
      </a>
    </section>
  );
}
