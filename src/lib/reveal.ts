/* ============================================================
   Scroll-reveal — observateur partagé par les pages de contenu.
   Même seuil / même failsafe que les pages Work et Journal :
   rien ne doit rester invisible si l'IntersectionObserver
   n'aboutit pas (onglet en arrière-plan, navigation rapide).
   ============================================================ */
import { useEffect } from "react";

export function useReveal(deps: unknown[] = []) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll(".reveal:not(.in)"));
    if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("in")); return; }
    const io = new IntersectionObserver((ents) => {
      ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });
    els.forEach((e) => io.observe(e));
    const fs = setTimeout(() => document.querySelectorAll(".reveal:not(.in)").forEach((e) => e.classList.add("in")), 2400);
    return () => { io.disconnect(); clearTimeout(fs); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
