/* ============================================================
   Language + content state — shared across routes.
   Language behaves like the prototype (localStorage["sorya-lang"],
   default from navigator.language, <html lang> sync).

   Content is dynamic: the bundled i18n module renders first paint,
   then Supabase hydrates (translations + articles + projects +
   image slots) and the result is cached in localStorage so the
   next visit paints with fresh content immediately. If Supabase
   is unreachable, the site silently keeps the bundled content.
   ============================================================ */
import React, { createContext, useContext, useEffect, useState } from "react";
import { I18N, PROJECTS, type Lang, type Messages, type Project } from "./i18n";
import { supabase } from "./lib/supabase";

export type Slots = Record<string, string | null>;
type Content = { i18n: Record<Lang, Messages>; projects: Project[]; slots: Slots };

type LangCtx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Messages;
  projects: Project[];
  slots: Slots;
};

const Ctx = createContext<LangCtx | null>(null);

const CACHE_KEY = "sorya-content-v1";

function initialLang(): Lang {
  const stored = (typeof localStorage !== "undefined" && localStorage.getItem("sorya-lang")) || null;
  if (stored === "fr" || stored === "en") return stored;
  return (navigator.language || "fr").toLowerCase().startsWith("en") ? "en" : "fr";
}

const bundled: Content = { i18n: I18N, projects: PROJECTS, slots: {} };

function initialContent(): Content {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const c = JSON.parse(raw) as Content;
      if (c && c.i18n && c.i18n.fr && c.i18n.en && Array.isArray(c.projects)) return c;
    }
  } catch (e) {}
  return bundled;
}

type ProjectRow = {
  id: string; sort_order: number; client: string; title: string; year: string;
  featured: boolean; pending: boolean; ai: boolean;
  vimeo: string | null; still: string | null; category: string;
  tag: Record<Lang, string>; role: Record<Lang, string>; descr: Record<Lang, string>;
};
type ArticleRow = { id: string; sort_order: number; fr: Record<string, unknown>; en: Record<string, unknown> };

async function fetchContent(): Promise<Content | null> {
  const [tr, pr, ar, sl] = await Promise.all([
    supabase.from("translations").select("lang,data"),
    supabase.from("projects").select("*").order("sort_order"),
    supabase.from("articles").select("*").order("sort_order"),
    supabase.from("image_slots").select("id,url"),
  ]);
  if (tr.error || pr.error || ar.error || sl.error) return null;
  if (!tr.data?.length || !pr.data) return null;

  const i18n = {} as Record<Lang, Messages>;
  for (const lang of ["fr", "en"] as Lang[]) {
    const row = tr.data.find((r) => r.lang === lang);
    if (!row) return null;
    const data = row.data as Messages;
    data.journal.articles = (ar.data as ArticleRow[]).map((a) => ({ id: a.id, ...(a[lang] as object) })) as Messages["journal"]["articles"];
    i18n[lang] = data;
  }

  const projects: Project[] = (pr.data as ProjectRow[]).map((r) => ({
    id: r.id, client: r.client, title: r.title, year: r.year,
    featured: r.featured, pending: r.pending || undefined, ai: r.ai,
    vimeo: r.vimeo || undefined, still: r.still || undefined,
    category: r.category, tag: r.tag, role: r.role, desc: r.descr,
  }));

  const slots: Slots = Object.fromEntries((sl.data || []).map((s) => [s.id, s.url]));
  return { i18n, projects, slots };
}

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);
  const [content, setContent] = useState<Content>(initialContent);

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("sorya-lang", l); } catch (e) {}
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    let alive = true;
    fetchContent().then((fresh) => {
      if (!fresh || !alive) return;
      setContent(fresh);
      try { localStorage.setItem(CACHE_KEY, JSON.stringify(fresh)); } catch (e) {}
    });
    return () => { alive = false; };
  }, []);

  return (
    <Ctx.Provider value={{ lang, setLang, t: content.i18n[lang], projects: content.projects, slots: content.slots }}>
      {children}
    </Ctx.Provider>
  );
}

export function useLang(): LangCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
