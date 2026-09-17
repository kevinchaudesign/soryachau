/* ============================================================
   Home — sommaire du site : le hero puis un aperçu de chaque
   page (profil & workflow, réalisations, journal, parcours, CV),
   chacun renvoyant vers sa page. Le contenu complet vit sur les
   pages ; le footer Contact est commun à toutes.
   ============================================================ */
import { useEffect } from "react";
import "../styles/blog.css"; /* Journal teaser reuses jcard classes */
import { useLang } from "../lang";
import { Experience } from "../components/experience";
import { Nav } from "../components/nav";
import { ShootBand } from "../components/band";
import { Hero } from "../components/hero";
import { AProposTeaser, ApprocheTeaser, CVBand, Contact, Journal, Work } from "../components/sections";

export default function Home() {
  const { lang, t } = useLang();

  useEffect(() => {
    document.title = lang === "fr"
      ? "Sorya Chau — Directrice de production"
      : "Sorya Chau — Production Director";
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
      <main id="main">
        <Hero t={t} lang={lang} />
        <ApprocheTeaser t={t} lang={lang} />
        <ShootBand id="band-accueil" label={lang === "fr" ? "Plan de travail" : "Shooting schedule"} tc="00:04:37:12" />
        <Work t={t} lang={lang} />
        <Journal t={t} />
        <AProposTeaser t={t} lang={lang} />
        <CVBand t={t} lang={lang} />
      </main>
      <Contact t={t} />
    </>
  );
}
