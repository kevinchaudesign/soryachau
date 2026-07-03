/* ============================================================
   Entry — global CSS (same order as the prototype <head>),
   <image-slot> web component (loaded once), router.
   Pages are lazy so page CSS loads per route, like the MPA did
   (cv.css carries print rules that must not leak elsewhere).
   ============================================================ */
import "./styles/styles.css";
import "./styles/components.css";
import "./styles/experience.css";
import "./lib/image-slot.js";

import { Suspense, lazy, useLayoutEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { LangProvider } from "./lang";
import Home from "./pages/Home";

const WorkPage = lazy(() => import("./pages/Work"));
const JournalPage = lazy(() => import("./pages/Journal"));
const CVPage = lazy(() => import("./pages/CV"));
const AdminPage = lazy(() => import("./pages/Admin"));

/* MPA parity: a fresh page loads at the top (or at the anchor). Runs on
   pathname changes only — same-page anchor clicks keep the native smooth
   scroll. Instant, so CSS smooth-scroll can't turn route changes into glides.
   Journal article hashes have no matching element (the reader is an overlay),
   so they fall back to the top like a fresh page load did. */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useLayoutEffect(() => {
    if (hash) {
      requestAnimationFrame(() => {
        let el: Element | null = null;
        try { el = document.querySelector(hash); } catch (e) { /* invalid selector */ }
        if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
        else window.scrollTo({ top: 0, behavior: "instant" });
      });
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  return null;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <LangProvider>
      <ScrollManager />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/cv" element={<CVPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
    </LangProvider>
  </BrowserRouter>
);
