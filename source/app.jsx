/* ============================================================
   App root — language state, scroll-reveal observer, mount
   ============================================================ */
function App() {
  const stored = (typeof localStorage !== "undefined" && localStorage.getItem("sorya-lang")) || null;
  const initial = stored || ((navigator.language || "fr").toLowerCase().startsWith("en") ? "en" : "fr");
  const [lang, setLangState] = React.useState(initial);
  const t = window.I18N[lang];

  const setLang = (l) => {
    setLangState(l);
    try { localStorage.setItem("sorya-lang", l); } catch (e) {}
  };

  React.useEffect(() => {
    document.documentElement.lang = lang;
    document.title = lang === "fr"
      ? "Sorya Chau — Directrice de Production augmentée"
      : "Sorya Chau — AI-augmented Production Director";
  }, [lang]);

  // Scroll reveal
  React.useEffect(() => {
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
    const pin = (e) => {
      e.classList.add("in");
      e.style.animation = "none";
      e.style.transition = "none";
      e.style.opacity = "1";
      e.style.transform = "none";
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
    <React.Fragment>
      <Experience lang={lang} />
      <Nav t={t} lang={lang} setLang={setLang} />
      <main>
        <Hero t={t} lang={lang} />
        <Profile t={t} />
        <Workflow t={t} />
        <Work t={t} lang={lang} />
        <Journal t={t} lang={lang} />
        <Parcours t={t} />
        <Clients t={t} />
      </main>
      <Contact t={t} />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
