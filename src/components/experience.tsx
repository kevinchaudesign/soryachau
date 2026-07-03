/* ============================================================
   Experience layer
   Film-leader intro · Production HUD (scroll timecode +
   scrubber + scene) · reticle cursor. Desktop-aware,
   reduced-motion aware, once-per-session intro.
   SPA note: unmount cleanups added (the MPA reset <html>/<body>
   state on every full page load; routes don't).
   ============================================================ */
import React, { useEffect, useMemo, useRef, useState } from "react";
import type { Lang } from "../i18n";

const SCENES = {
  fr: [
    { sel: "#top", n: "01", t: "Ouverture" },
    { sel: "#profil", n: "02", t: "Profil" },
    { sel: ".workflow", n: "03", t: "Workflow IA" },
    { sel: "#work", n: "04", t: "Réalisations" },
    { sel: "#journal", n: "05", t: "Journal" },
    { sel: "#parcours", n: "06", t: "Parcours" },
    { sel: "#contact", n: "07", t: "Contact" },
  ],
  en: [
    { sel: "#top", n: "01", t: "Opening" },
    { sel: "#profil", n: "02", t: "Profile" },
    { sel: ".workflow", n: "03", t: "AI Workflow" },
    { sel: "#work", n: "04", t: "Work" },
    { sel: "#journal", n: "05", t: "Journal" },
    { sel: "#parcours", n: "06", t: "Career" },
    { sel: "#contact", n: "07", t: "Contact" },
  ],
};

const pad = (x: number) => String(x).padStart(2, "0");

/* ---------------- Film-leader intro ---------------- */
export function Intro({ onDone }: { onDone?: () => void }) {
  const reduced = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const seen = typeof sessionStorage !== "undefined" && sessionStorage.getItem("sorya-intro");
  const [show, setShow] = useState(!seen && !reduced);
  const [num, setNum] = useState(3);
  const [phase, setPhase] = useState("count"); // count → title → exit
  const closedRef = useRef(false);

  const close = () => {
    if (closedRef.current) return;
    closedRef.current = true;
    setPhase("exit");
    try { sessionStorage.setItem("sorya-intro", "1"); } catch (e) {}
    setTimeout(() => { setShow(false); document.body.style.overflow = ""; onDone && onDone(); }, 820);
  };

  useEffect(() => {
    if (!show) { onDone && onDone(); return; }
    document.body.style.overflow = "hidden";
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setNum(2), 560));
    timers.push(setTimeout(() => setNum(1), 1120));
    timers.push(setTimeout(() => setPhase("title"), 1680));
    timers.push(setTimeout(close, 2380));
    const onKey = (e: KeyboardEvent) => { if (e.key === "Enter" || e.key === "Escape" || e.key === " ") close(); };
    window.addEventListener("keydown", onKey);
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line
  }, [show]);

  if (!show) return null;

  return (
    <div className={"intro" + (phase === "exit" ? " is-exit" : "") + (phase === "title" ? " is-title" : "")} onClick={close} role="button" aria-label="Entrer">
      <div className="intro__noise"></div>
      <div className="intro__bar intro__bar--top">
        <span className="intro__rec"><b></b>REC</span>
        <span>Sorya Chau — Production Co.</span>
      </div>

      <div className="leader" aria-hidden="true">
        <span className="leader__ring"></span>
        <span className="leader__cross"></span>
        <span className="leader__sweep"></span>
        <span className="leader__num">{num}</span>
        <span className="leader__title">Directrice de Production</span>
      </div>

      <div className="intro__bar intro__bar--bot">
        <span>Paris · 25 FPS</span>
        <span>Couleur — 24 bit</span>
      </div>

      <button className="intro__skip" onClick={(e) => { e.stopPropagation(); close(); }}>Entrer ↵</button>
      <span className="intro__progress"></span>
    </div>
  );
}

/* ---------------- Edit suite: NLE timeline + transport + framing guides ---------------- */
export function FramingGuides() {
  return (
    <div className="guides" aria-hidden="true">
      <span className="guides__third guides__v1"></span>
      <span className="guides__third guides__v2"></span>
      <span className="guides__third guides__h1"></span>
      <span className="guides__third guides__h2"></span>
      <span className="guides__safe guides__action"></span>
      <span className="guides__safe guides__title"></span>
      <span className="guides__center"></span>
      <span className="guides__lbl guides__lbl--a">ACTION SAFE</span>
      <span className="guides__lbl guides__lbl--t">TITLE SAFE</span>
      <span className="guides__corner guides__corner--tl"></span>
      <span className="guides__corner guides__corner--tr"></span>
      <span className="guides__corner guides__corner--bl"></span>
      <span className="guides__corner guides__corner--br"></span>
    </div>
  );
}

type Clip = { n: string; t: string; sel: string; left: number; width: number };

export function ProductionHUD({ lang }: { lang: Lang }) {
  const scenes = SCENES[lang] || SCENES.fr;
  const fine = typeof matchMedia !== "undefined" && matchMedia("(pointer: fine)").matches;
  const [expanded, setExpanded] = useState(fine && typeof window !== "undefined" && window.innerWidth > 1100);
  const [guides, setGuides] = useState(false);
  const [playing, setPlaying] = useState(false);
  const playingRef = useRef(false);
  const [clips, setClips] = useState<Clip[]>([]);
  const tcRef = useRef<HTMLSpanElement>(null), sceneRef = useRef<HTMLSpanElement>(null), scrubRef = useRef<HTMLSpanElement>(null), playRef = useRef<HTMLSpanElement>(null), activeRef = useRef(-1);

  // deterministic waveform path
  const wave = useMemo(() => {
    let d = "M0 20"; const N = 240;
    for (let i = 0; i <= N; i++) {
      const x = (i / N) * 1000;
      const env = 0.5 + 0.5 * Math.sin(i * 0.06);
      const h = (Math.sin(i * 0.5) * 0.5 + Math.sin(i * 0.17) * 0.3 + Math.sin(i * 1.27) * 0.2) * env;
      d += ` L${x.toFixed(1)} ${(20 - h * 17).toFixed(1)}`;
    }
    return d;
  }, []);

  // measure clip extents from real section positions
  useEffect(() => {
    const measure = () => {
      const total = document.documentElement.scrollHeight || 1;
      const segs = scenes.map((s) => {
        const el = document.querySelector(s.sel);
        const top = el ? el.getBoundingClientRect().top + window.scrollY : 0;
        return { n: s.n, t: s.t, sel: s.sel, top };
      });
      setClips(segs.map((s, i) => {
        const end = i < segs.length - 1 ? segs[i + 1].top : total;
        return { n: s.n, t: s.t, sel: s.sel, left: (s.top / total) * 100, width: Math.max(0, (end - s.top) / total) * 100 };
      }));
    };
    measure();
    const t1 = setTimeout(measure, 450);
    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);
    return () => { window.removeEventListener("resize", measure); window.removeEventListener("load", measure); clearTimeout(t1); };
  }, [lang, expanded]);

  // scroll → timecode, playhead, active clip
  useEffect(() => {
    const fps = 25, runtime = 232; let raf = 0;
    const tick = () => {
      raf = 0;
      const total = document.documentElement.scrollHeight || 1;
      const winH = window.innerHeight;
      const maxScroll = total - winH;
      const sp = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
      const p = Math.min(1, Math.max(0, (window.scrollY + winH * 0.42) / total));
      const frames = Math.floor(runtime * fps * sp);
      const ff = frames % fps, s = Math.floor(frames / fps);
      if (tcRef.current) tcRef.current.textContent = `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(ff)}`;
      const lp = (p * 100).toFixed(2) + "%";
      if (scrubRef.current) scrubRef.current.style.width = lp;
      if (playRef.current) playRef.current.style.left = lp;
      const mid = winH * 0.42; let idx = 0;
      for (let i = 0; i < scenes.length; i++) { const el = document.querySelector(scenes[i].sel); if (el && el.getBoundingClientRect().top <= mid) idx = i; }
      if (idx !== activeRef.current) {
        activeRef.current = idx;
        if (sceneRef.current) sceneRef.current.textContent = "SC " + scenes[idx].n + " · " + scenes[idx].t;
        document.querySelectorAll(".editbar__clip").forEach((c, i) => c.classList.toggle("is-on", i === idx));
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    tick();
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, [lang, clips]);

  useEffect(() => {
    document.documentElement.classList.toggle("edit-expanded", expanded);
    document.documentElement.classList.toggle("edit-collapsed", !expanded);
  }, [expanded]);
  useEffect(() => { document.documentElement.classList.toggle("guides-on", guides); }, [guides]);
  useEffect(() => { playingRef.current = playing; }, [playing]);

  // SPA: clear <html> state when the HUD leaves the tree (route change)
  useEffect(() => () => {
    document.documentElement.classList.remove("edit-expanded", "edit-collapsed", "guides-on");
  }, []);

  // autoplay — "play" the reel by smooth auto-scroll (Space toggles)
  useEffect(() => {
    if (!playing) return;
    let raf = 0, last = performance.now();
    const speed = 150; // px per second
    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (window.scrollY >= maxScroll - 1) { setPlaying(false); return; }
      window.scrollTo(0, window.scrollY + speed * dt);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    const pause = () => setPlaying(false);
    window.addEventListener("wheel", pause, { passive: true });
    window.addEventListener("touchstart", pause, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener("wheel", pause); window.removeEventListener("touchstart", pause); };
  }, [playing]);

  // keyboard transport: J/L cut between clips · G guides · T timeline
  useEffect(() => {
    const jump = (dir: number) => {
      const mid = window.innerHeight * 0.42; let idx = 0;
      for (let i = 0; i < scenes.length; i++) { const el = document.querySelector(scenes[i].sel); if (el && el.getBoundingClientRect().top <= mid) idx = i; }
      const n = Math.min(scenes.length - 1, Math.max(0, idx + dir));
      const el = document.querySelector(scenes[n].sel);
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 1, behavior: "smooth" });
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (e.target && (e.target as HTMLElement).tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const k = e.key.toLowerCase();
      if (e.key === " " || e.code === "Space") {
        if (tag !== "BUTTON" && tag !== "A") { e.preventDefault(); setPlaying((v) => !v); }
        return;
      }
      if (["arrowup", "arrowdown", "pageup", "pagedown", "home", "end"].includes(k)) { if (playingRef.current) setPlaying(false); return; }
      if (k === "g") setGuides((v) => !v);
      else if (k === "t") setExpanded((v) => !v);
      else if (k === "j") { setPlaying(false); jump(-1); }
      else if (k === "l") { setPlaying(false); jump(1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lang]);

  const goClip = (sel: string) => { const el = document.querySelector(sel); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 1, behavior: "smooth" }); };
  const rewind = () => { setPlaying(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const hint = lang === "fr" ? "Espace lecture · J / L coupe · G repères · T timeline" : "Space play · J / L cut · G guides · T timeline";

  return (
    <React.Fragment>
      {guides ? <FramingGuides /> : null}
      <div className={"editbar" + (expanded ? " is-expanded" : " is-collapsed") + (playing ? " is-playing" : "")}>
        <div className="editbar__status">
          <span className="editbar__rec"><b></b>REC</span>
          <span className="editbar__tc" ref={tcRef}>00:00:00:00</span>
          <button className="editbar__btn editbar__btn--play" onClick={() => setPlaying((v) => !v)} aria-label={playing ? "Pause" : "Lecture"} title={lang === "fr" ? "Lecture / Pause (Espace)" : "Play / Pause (Space)"}>{playing ? "❚❚" : "▶"}</button>
          <button className="editbar__btn" onClick={rewind} aria-label={lang === "fr" ? "Retour début" : "To start"} title="⏮">⏮</button>
          <span className="editbar__chip">25 FPS · NDF</span>
          <span className="editbar__hint">{hint}</span>
          <span className="editbar__spacer"></span>
          <span className="editbar__scene" ref={sceneRef}>SC {scenes[0].n} · {scenes[0].t}</span>
          <button className="editbar__btn" onClick={() => setGuides((v) => !v)} aria-label="Guides (G)" title="G">▣</button>
          <button className="editbar__btn" onClick={() => setExpanded((v) => !v)} aria-label="Timeline (T)" title="T">{expanded ? "▾" : "▴"}</button>
        </div>

        <div className="editbar__tl" aria-hidden="true">
          <div className="editbar__tracks">
            <div className="editbar__ruler">
              {Array.from({ length: 25 }).map((_, i) => (
                <span key={i} className={"editbar__tick" + (i % 6 === 0 ? " is-major" : "")} style={{ left: (i / 24 * 100) + "%" }}></span>
              ))}
            </div>
            <div className="editbar__lane editbar__lane--v">
              <span className="editbar__lanelbl">V1</span>
              <div className="editbar__clips">
                {clips.map((c, i) => (
                  <button key={i} className="editbar__clip" style={{ left: c.left + "%", width: c.width + "%" }} onClick={() => goClip(c.sel)} title={c.t}>
                    <span className="editbar__clip-n">{c.n}</span>
                    <span className="editbar__clip-t">{c.t}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="editbar__lane editbar__lane--a">
              <span className="editbar__lanelbl">A1</span>
              <svg className="editbar__wave" viewBox="0 0 1000 40" preserveAspectRatio="none"><path d={wave} vectorEffect="non-scaling-stroke" /></svg>
            </div>
            <span className="editbar__playhead" ref={playRef}><i></i></span>
          </div>
        </div>

        <span className="editbar__scrub"><span className="editbar__scrub-fill" ref={scrubRef}></span></span>
      </div>
    </React.Fragment>
  );
}

/* ---------------- Reticle cursor ---------------- */
export function Reticle() {
  useEffect(() => {
    if (typeof matchMedia === "undefined") return;
    if (!matchMedia("(pointer: fine)").matches) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;
    root.classList.add("has-reticle");
    const wrap = document.createElement("div");
    wrap.className = "reticle";
    wrap.innerHTML = '<span class="reticle__ring"></span><span class="reticle__dot"></span>';
    document.body.appendChild(wrap);
    const ring = wrap.querySelector(".reticle__ring") as HTMLElement;
    const dot = wrap.querySelector(".reticle__dot") as HTMLElement;

    let tx = innerWidth / 2, ty = innerHeight / 2, rx = tx, ry = ty, raf = 0;
    const loop = () => {
      rx += (tx - rx) * 0.18; ry += (ty - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    const onMove = (e: MouseEvent) => {
      tx = e.clientX; ty = e.clientY;
      dot.style.transform = `translate(${tx}px, ${ty}px) translate(-50%, -50%)`;
      const target = e.target as HTMLElement;
      const focus = !!(target.closest && target.closest("a, button, input, [data-cursor]"));
      root.classList.toggle("reticle-focus", focus);
    };
    const onDown = () => root.classList.add("reticle-down");
    const onUp = () => root.classList.remove("reticle-down");
    const onLeave = () => { wrap.style.opacity = "0"; };
    const onEnter = () => { wrap.style.opacity = "1"; };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      root.classList.remove("has-reticle", "reticle-focus", "reticle-down");
      wrap.remove();
    };
  }, []);
  return null;
}

/* ---------------- Film lightbox (real Vimeo reels) ---------------- */
type Film = { id: string; client: string; title: string };

export function Lightbox({ lang }: { lang: Lang }) {
  const [film, setFilm] = useState<Film | null>(null);
  const close = () => { setFilm(null); document.body.style.overflow = ""; };
  useEffect(() => {
    const onPlay = (e: Event) => { setFilm((e as CustomEvent<Film>).detail); document.body.style.overflow = "hidden"; };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("sorya:play", onPlay);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("sorya:play", onPlay);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, []);
  if (!film) return null;
  const src = `https://player.vimeo.com/video/${film.id}?autoplay=1&color=d98b4e&byline=0&title=0&portrait=0&dnt=1`;
  return (
    <div className="lightbox" onClick={close} role="dialog" aria-modal="true" aria-label={film.client + " — " + film.title}>
      <div className="lightbox__bar" onClick={(e) => e.stopPropagation()}>
        <span className="lightbox__meta">
          <span className="lightbox__rec"><b></b>{lang === "fr" ? "Lecture" : "Now playing"}</span>
          <span><b>{film.client}</b> — {film.title}</span>
        </span>
        <button className="lightbox__close" data-cursor onClick={close}>{lang === "fr" ? "Fermer" : "Close"} ✕</button>
      </div>
      <div className="lightbox__stage" onClick={close}>
        <div className="lightbox__frame" onClick={(e) => e.stopPropagation()}>
          <span className="regmark regmark--tr"></span>
          <span className="regmark regmark--bl"></span>
          <iframe
            src={src}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title={film.client + " — " + film.title}
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export function Experience({ lang, intro = true, editbar = true }: { lang: Lang; intro?: boolean; editbar?: boolean }) {
  return (
    <React.Fragment>
      {intro ? <Intro /> : null}
      {editbar ? <ProductionHUD lang={lang} /> : null}
      <Reticle />
      <Lightbox lang={lang} />
    </React.Fragment>
  );
}
