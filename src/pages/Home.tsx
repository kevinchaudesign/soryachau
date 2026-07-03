/* ============================================================
   Home — language state, scroll-reveal observer, section order
   ============================================================ */
import { useEffect } from "react";
import "../styles/blog.css"; /* Journal teaser reuses jcard classes */
import { useLang } from "../lang";
import { Experience } from "../components/experience";
import { Nav } from "../components/nav";
import { Hero } from "../components/hero";
import { Clients, Contact, Journal, Parcours, Profile, Work, Workflow } from "../components/sections";

export default function Home() {
  const { lang, t } = useLang();

  useEffect(() => {
    document.title = lang === "fr"
      ? "Sorya Chau — Directrice de Production augmentée"
      : "Sorya Chau — AI-augmented Production Director";
  }, [lang]);

  // Scroll reveal
  useEffect(() => {
    const els = Array.from(document.querySelectorAll(".reveal"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    els.forEach((e) => io.observe(e));

    // Pin an element fully visible, killing any in-flight animation/transition
    // (a stuck transition can otherwise override even !important — so we clear it).
    const pin = (e: Element) => {
      e.classList.add("in");
      const el = e as HTMLElement;
      el.style.animation = "none";
      el.style.transition = "none";
      el.style.opacity = "1";
      el.style.transform = "none";
    };

    // Above-the-fold safety: settle anything already revealed once the entrance
    // window has elapsed, so the hero H1 can never linger at opacity 0.
    const settle = setTimeout(() => {
      document.querySelectorAll(".reveal.in").forEach(pin);
    }, 1500);

    // Failsafe: never leave content hidden — snap any stragglers fully visible.
    const failsafe = setTimeout(() => {
      document.querySelectorAll(".reveal:not(.in)").forEach(pin);
    }, 2600);

    return () => { io.disconnect(); clearTimeout(settle); clearTimeout(failsafe); };
  }, []);

  return (
    <>
      <Experience lang={lang} />
      <Nav page="home" />
      <main>
        <Hero t={t} lang={lang} />
        <Profile t={t} />
        <Workflow t={t} />
        <Work t={t} lang={lang} />
        <Journal t={t} />
        <Parcours t={t} />
        <Clients t={t} />
      </main>
      <Contact t={t} />
    </>
  );
}
