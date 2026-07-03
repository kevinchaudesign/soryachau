/* ============================================================
   /admin — espace d'administration (Supabase Auth).
   Tout le contenu du site s'édite ici : textes FR/EN, projets,
   articles du Journal, images (Storage). Lecture publique via
   RLS ; écriture réservée aux utilisateurs authentifiés.
   ============================================================ */
import React, { useEffect, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import "../styles/admin.css";
import { supabase } from "../lib/supabase";
import type { Lang } from "../i18n";

const CACHE_KEY = "sorya-content-v1";
const clearPublicCache = () => { try { localStorage.removeItem(CACHE_KEY); } catch (e) {} };

/* ---------- small helpers ---------- */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="adm-field">
      <span className="adm-field__l">{label}</span>
      {children}
    </label>
  );
}

function Txt({ value, onChange, long }: { value: string; onChange: (v: string) => void; long?: boolean }) {
  if (long || value.length > 90) {
    return <textarea rows={Math.min(8, Math.max(2, Math.ceil(value.length / 90)))} value={value} onChange={(e) => onChange(e.target.value)} />;
  }
  return <input type="text" value={value} onChange={(e) => onChange(e.target.value)} />;
}

function useStatus(): [React.ReactNode, (msg: string, err?: boolean) => void] {
  const [s, setS] = useState<{ msg: string; err: boolean }>({ msg: "", err: false });
  const set = (msg: string, err = false) => {
    setS({ msg, err });
    if (msg && !err) setTimeout(() => setS((c) => (c.msg === msg ? { msg: "", err: false } : c)), 4000);
  };
  return [<p className={"adm-status" + (s.err ? " adm-error" : "")}>{s.msg}</p>, set];
}

/* deep clone + immutable set at path */
const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));
function setAt(obj: unknown, path: (string | number)[], value: unknown) {
  const root = clone(obj) as never;
  let cur: never = root;
  for (let i = 0; i < path.length - 1; i++) cur = cur[path[i]];
  (cur as Record<string | number, unknown>)[path[path.length - 1]] = value;
  return root;
}

/* empty template with the same shape as a sample value */
function emptyLike(v: unknown): unknown {
  if (typeof v === "string") return "";
  if (typeof v === "boolean") return false;
  if (typeof v === "number") return 0;
  if (Array.isArray(v)) return [];
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, emptyLike(x)]));
  return "";
}

/* ---------- login ---------- */

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) setError(error.message === "Invalid login credentials" ? "Identifiants invalides." : error.message);
  };

  return (
    <div className="adm-login">
      <form className="adm-login__box" onSubmit={submit}>
        <div className="adm-login__brand">SC · Régie</div>
        <h1 className="adm-login__title">Administration</h1>
        <Field label="Email">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required />
        </Field>
        <Field label="Mot de passe">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
        </Field>
        <p className={"adm-status" + (error ? " adm-error" : "")}>{error}</p>
        <button className="adm-btn adm-btn--primary" disabled={busy} type="submit">{busy ? "Connexion…" : "Se connecter"}</button>
      </form>
    </div>
  );
}

/* ---------- Textes (translations) ---------- */

function JsonNode({ value, path, onSet }: { value: unknown; path: (string | number)[]; onSet: (path: (string | number)[], v: unknown) => void }) {
  if (typeof value === "string") {
    const key = String(path[path.length - 1]);
    return (
      <Field label={key}>
        <Txt value={value} onChange={(v) => onSet(path, v)} />
      </Field>
    );
  }
  if (typeof value === "boolean") {
    return (
      <label className="adm-check">
        <input type="checkbox" checked={value} onChange={(e) => onSet(path, e.target.checked)} />
        {String(path[path.length - 1])}
      </label>
    );
  }
  if (Array.isArray(value)) {
    const key = String(path[path.length - 1]);
    return (
      <div>
        <div className="adm-tree__key">{key} ({value.length})</div>
        <div className="adm-tree">
          {value.map((item, i) => (
            <div className="adm-tree__row" key={i}>
              <div style={{ flex: 1 }}>
                <JsonNode value={item} path={[...path, i]} onSet={onSet} />
              </div>
              <button className="adm-btn adm-btn--sm adm-btn--danger" type="button" title="Supprimer"
                      onClick={() => onSet(path, value.filter((_, n) => n !== i))}>✕</button>
            </div>
          ))}
          <button className="adm-btn adm-btn--sm" type="button"
                  onClick={() => onSet(path, [...value, emptyLike(value[0] ?? "")])}>+ Ajouter</button>
        </div>
      </div>
    );
  }
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    const isRoot = path.length === 0;
    return (
      <div className={isRoot ? "" : "adm-tree"}>
        {!isRoot && typeof path[path.length - 1] === "string" ? <div className="adm-tree__key">{String(path[path.length - 1])}</div> : null}
        {entries.map(([k, v]) => <JsonNode key={k} value={v} path={[...path, k]} onSet={onSet} />)}
      </div>
    );
  }
  return null;
}

function TextesTab() {
  const [data, setData] = useState<Record<Lang, unknown> | null>(null);
  const [langTab, setLangTab] = useState<Lang>("fr");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useStatus();

  useEffect(() => {
    supabase.from("translations").select("lang,data").then(({ data: rows, error }) => {
      if (error || !rows) { setStatus("Chargement impossible : " + (error?.message || "?"), true); return; }
      const byLang = {} as Record<Lang, unknown>;
      rows.forEach((r) => { byLang[r.lang as Lang] = r.data; });
      setData(byLang);
    });
    // eslint-disable-next-line
  }, []);

  if (!data) return <p className="adm-note">Chargement…</p>;

  const save = async () => {
    setBusy(true);
    const { error } = await supabase.from("translations").upsert([
      { lang: "fr", data: data.fr, updated_at: new Date().toISOString() },
      { lang: "en", data: data.en, updated_at: new Date().toISOString() },
    ]);
    setBusy(false);
    if (error) setStatus("Erreur : " + error.message, true);
    else { clearPublicCache(); setStatus("Textes enregistrés."); }
  };

  return (
    <div>
      <p className="adm-note">Tous les textes du site (navigation, accueil, CV…). Les articles du Journal s'éditent dans l'onglet Journal.</p>
      <div className="adm-tabs" style={{ padding: 0, marginBottom: 18 }}>
        {(["fr", "en"] as Lang[]).map((l) => (
          <button key={l} className={"adm-tab" + (langTab === l ? " is-on" : "")} onClick={() => setLangTab(l)}>{l.toUpperCase()}</button>
        ))}
      </div>
      <div className="adm-editor">
        <JsonNode value={data[langTab]} path={[]} onSet={(path, v) => setData({ ...data, [langTab]: path.length ? setAt(data[langTab], path, v) : v })} />
      </div>
      <div className="adm-actions">
        <button className="adm-btn adm-btn--primary" onClick={save} disabled={busy}>{busy ? "Enregistrement…" : "Enregistrer les textes"}</button>
        {status}
      </div>
    </div>
  );
}

/* ---------- Projets ---------- */

type ProjectRow = {
  id: string; sort_order: number; client: string; title: string; year: string;
  featured: boolean; pending: boolean; ai: boolean;
  vimeo: string | null; still: string | null; category: string;
  tag: Record<Lang, string>; role: Record<Lang, string>; descr: Record<Lang, string>;
};

const CATS: [string, string][] = [["brand", "Film de marque"], ["doc", "Documentaire"], ["post", "Post-production"], ["vfx", "3D & VFX"], ["ai", "IA"]];

const NEW_PROJECT: ProjectRow = {
  id: "", sort_order: 99, client: "", title: "", year: String(new Date().getFullYear()),
  featured: false, pending: true, ai: false, vimeo: null, still: null, category: "brand",
  tag: { fr: "", en: "" }, role: { fr: "", en: "" }, descr: { fr: "", en: "" },
};

function ProjetsTab() {
  const [rows, setRows] = useState<ProjectRow[] | null>(null);
  const [sel, setSel] = useState<ProjectRow | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useStatus();

  const load = () => supabase.from("projects").select("*").order("sort_order").then(({ data, error }) => {
    if (error || !data) { setStatus("Chargement impossible : " + (error?.message || "?"), true); return; }
    setRows(data as ProjectRow[]);
  });
  // eslint-disable-next-line
  useEffect(() => { load(); }, []);

  if (!rows) return <p className="adm-note">Chargement…</p>;

  const edit = (p: ProjectRow) => { setSel(clone(p)); setIsNew(false); };
  const set = (patch: Partial<ProjectRow>) => setSel((s) => (s ? { ...s, ...patch } : s));

  const save = async () => {
    if (!sel || !sel.id.trim()) { setStatus("L'identifiant (slug) est requis.", true); return; }
    setBusy(true);
    const { error } = await supabase.from("projects").upsert({ ...sel, updated_at: new Date().toISOString() });
    setBusy(false);
    if (error) { setStatus("Erreur : " + error.message, true); return; }
    clearPublicCache(); setStatus("Projet enregistré."); setIsNew(false); load();
  };

  const remove = async () => {
    if (!sel || isNew) return;
    if (!window.confirm(`Supprimer le projet « ${sel.client} — ${sel.title} » ?`)) return;
    setBusy(true);
    const { error } = await supabase.from("projects").delete().eq("id", sel.id);
    setBusy(false);
    if (error) { setStatus("Erreur : " + error.message, true); return; }
    clearPublicCache(); setStatus("Projet supprimé."); setSel(null); load();
  };

  return (
    <div className="adm-split">
      <div>
        <div className="adm-list">
          {rows.map((p) => (
            <button key={p.id} className={"adm-list__item" + (sel && !isNew && sel.id === p.id ? " is-on" : "")} onClick={() => edit(p)}>
              <span>{p.client} — {p.title}</span>
              <small>{p.year}</small>
            </button>
          ))}
        </div>
        <div className="adm-actions">
          <button className="adm-btn" onClick={() => { setSel(clone(NEW_PROJECT)); setIsNew(true); }}>+ Nouveau projet</button>
        </div>
      </div>

      {sel ? (
        <div className="adm-editor">
          <div className="adm-h">{isNew ? "Nouveau projet" : sel.client + " — " + sel.title}</div>
          <div className="adm-cols">
            <Field label="Identifiant (slug, unique)"><input type="text" value={sel.id} disabled={!isNew} onChange={(e) => set({ id: e.target.value.trim().toLowerCase() })} /></Field>
            <Field label="Ordre"><input type="number" value={sel.sort_order} onChange={(e) => set({ sort_order: Number(e.target.value) })} /></Field>
            <Field label="Client"><input type="text" value={sel.client} onChange={(e) => set({ client: e.target.value })} /></Field>
            <Field label="Titre"><input type="text" value={sel.title} onChange={(e) => set({ title: e.target.value })} /></Field>
            <Field label="Année"><input type="text" value={sel.year} onChange={(e) => set({ year: e.target.value })} /></Field>
            <Field label="Catégorie (filtre Réalisations)">
              <select value={sel.category} onChange={(e) => set({ category: e.target.value })}>
                {CATS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
              </select>
            </Field>
            <Field label="ID Vimeo (vide = pas de film)"><input type="text" value={sel.vimeo || ""} onChange={(e) => set({ vimeo: e.target.value.trim() || null })} /></Field>
            <Field label="URL du visuel (vide = slot image)"><input type="text" value={sel.still || ""} onChange={(e) => set({ still: e.target.value.trim() || null })} /></Field>
          </div>
          <div>
            <label className="adm-check"><input type="checkbox" checked={sel.featured} onChange={(e) => set({ featured: e.target.checked })} />À la une</label>
            <label className="adm-check"><input type="checkbox" checked={sel.pending} onChange={(e) => set({ pending: e.target.checked })} />En attente (slot visuel)</label>
            <label className="adm-check"><input type="checkbox" checked={sel.ai} onChange={(e) => set({ ai: e.target.checked })} />Projet IA</label>
          </div>
          <div className="adm-h">Français</div>
          <div className="adm-cols">
            <Field label="Tag"><input type="text" value={sel.tag.fr} onChange={(e) => set({ tag: { ...sel.tag, fr: e.target.value } })} /></Field>
            <Field label="Rôle"><input type="text" value={sel.role.fr} onChange={(e) => set({ role: { ...sel.role, fr: e.target.value } })} /></Field>
          </div>
          <Field label="Description"><Txt long value={sel.descr.fr} onChange={(v) => set({ descr: { ...sel.descr, fr: v } })} /></Field>
          <div className="adm-h">English</div>
          <div className="adm-cols">
            <Field label="Tag"><input type="text" value={sel.tag.en} onChange={(e) => set({ tag: { ...sel.tag, en: e.target.value } })} /></Field>
            <Field label="Rôle"><input type="text" value={sel.role.en} onChange={(e) => set({ role: { ...sel.role, en: e.target.value } })} /></Field>
          </div>
          <Field label="Description"><Txt long value={sel.descr.en} onChange={(v) => set({ descr: { ...sel.descr, en: v } })} /></Field>
          <div className="adm-actions">
            <button className="adm-btn adm-btn--primary" onClick={save} disabled={busy}>{busy ? "Enregistrement…" : "Enregistrer"}</button>
            {!isNew ? <button className="adm-btn adm-btn--ghost adm-btn--danger" onClick={remove} disabled={busy}>Supprimer</button> : null}
            {status}
          </div>
        </div>
      ) : (
        <p className="adm-note">Sélectionne un projet à gauche, ou crée-en un nouveau.</p>
      )}
    </div>
  );
}

/* ---------- Journal (articles) ---------- */

type Block = { t: string; c: string };
type ArticleSide = { cat: string; date: string; read: string; title: string; dek: string; body: Block[] };
type ArticleRow = { id: string; sort_order: number; fr: ArticleSide; en: ArticleSide };

const NEW_SIDE: ArticleSide = { cat: "", date: "", read: "4", title: "", dek: "", body: [{ t: "p", c: "" }] };
const NEW_ARTICLE: ArticleRow = { id: "", sort_order: 99, fr: clone(NEW_SIDE), en: clone(NEW_SIDE) };

function BlockEditor({ blocks, onChange }: { blocks: Block[]; onChange: (b: Block[]) => void }) {
  const move = (i: number, d: number) => {
    const n = [...blocks]; const j = i + d;
    if (j < 0 || j >= n.length) return;
    [n[i], n[j]] = [n[j], n[i]];
    onChange(n);
  };
  return (
    <div>
      {blocks.map((b, i) => (
        <div className="adm-block" key={i}>
          <select value={b.t} onChange={(e) => onChange(blocks.map((x, n) => (n === i ? { ...x, t: e.target.value } : x)))}>
            <option value="p">Paragraphe</option>
            <option value="h">Intertitre</option>
            <option value="quote">Citation</option>
          </select>
          <textarea rows={b.t === "p" ? 3 : 2} value={b.c} onChange={(e) => onChange(blocks.map((x, n) => (n === i ? { ...x, c: e.target.value } : x)))} />
          <div className="adm-block__tools">
            <button className="adm-btn adm-btn--sm" type="button" onClick={() => move(i, -1)} title="Monter">↑</button>
            <button className="adm-btn adm-btn--sm" type="button" onClick={() => move(i, 1)} title="Descendre">↓</button>
            <button className="adm-btn adm-btn--sm adm-btn--danger" type="button" onClick={() => onChange(blocks.filter((_, n) => n !== i))} title="Supprimer">✕</button>
          </div>
        </div>
      ))}
      <button className="adm-btn adm-btn--sm" type="button" onClick={() => onChange([...blocks, { t: "p", c: "" }])}>+ Bloc</button>
    </div>
  );
}

function SideEditor({ side, onChange }: { side: ArticleSide; onChange: (s: ArticleSide) => void }) {
  const set = (patch: Partial<ArticleSide>) => onChange({ ...side, ...patch });
  return (
    <div>
      <div className="adm-cols">
        <Field label="Catégorie"><input type="text" value={side.cat} onChange={(e) => set({ cat: e.target.value })} /></Field>
        <Field label="Date (libellé)"><input type="text" value={side.date} onChange={(e) => set({ date: e.target.value })} /></Field>
      </div>
      <div className="adm-cols">
        <Field label="Titre"><Txt value={side.title} onChange={(v) => set({ title: v })} /></Field>
        <Field label="Minutes de lecture"><input type="text" value={side.read} onChange={(e) => set({ read: e.target.value })} /></Field>
      </div>
      <Field label="Chapeau (dek)"><Txt long value={side.dek} onChange={(v) => set({ dek: v })} /></Field>
      <div className="adm-h">Corps</div>
      <BlockEditor blocks={side.body} onChange={(body) => set({ body })} />
    </div>
  );
}

function JournalTab() {
  const [rows, setRows] = useState<ArticleRow[] | null>(null);
  const [sel, setSel] = useState<ArticleRow | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [langTab, setLangTab] = useState<Lang>("fr");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useStatus();

  const load = () => supabase.from("articles").select("*").order("sort_order").then(({ data, error }) => {
    if (error || !data) { setStatus("Chargement impossible : " + (error?.message || "?"), true); return; }
    setRows(data as ArticleRow[]);
  });
  // eslint-disable-next-line
  useEffect(() => { load(); }, []);

  if (!rows) return <p className="adm-note">Chargement…</p>;

  const save = async () => {
    if (!sel || !sel.id.trim()) { setStatus("L'identifiant (slug) est requis.", true); return; }
    setBusy(true);
    const { error } = await supabase.from("articles").upsert({ ...sel, updated_at: new Date().toISOString() });
    setBusy(false);
    if (error) { setStatus("Erreur : " + error.message, true); return; }
    clearPublicCache(); setStatus("Article enregistré."); setIsNew(false); load();
  };

  const remove = async () => {
    if (!sel || isNew) return;
    if (!window.confirm(`Supprimer l'article « ${sel.fr.title} » ?`)) return;
    setBusy(true);
    const { error } = await supabase.from("articles").delete().eq("id", sel.id);
    setBusy(false);
    if (error) { setStatus("Erreur : " + error.message, true); return; }
    clearPublicCache(); setStatus("Article supprimé."); setSel(null); load();
  };

  return (
    <div className="adm-split">
      <div>
        <div className="adm-list">
          {rows.map((a) => (
            <button key={a.id} className={"adm-list__item" + (sel && !isNew && sel.id === a.id ? " is-on" : "")} onClick={() => { setSel(clone(a)); setIsNew(false); }}>
              <span>{a.fr.title || a.id}</span>
              <small>{a.fr.date}</small>
            </button>
          ))}
        </div>
        <div className="adm-actions">
          <button className="adm-btn" onClick={() => { setSel(clone(NEW_ARTICLE)); setIsNew(true); }}>+ Nouvel article</button>
        </div>
        <p className="adm-note" style={{ marginTop: 12 }}>Le premier article (ordre le plus bas) est « À la une ».</p>
      </div>

      {sel ? (
        <div className="adm-editor">
          <div className="adm-cols">
            <Field label="Identifiant (slug, unique)"><input type="text" value={sel.id} disabled={!isNew} onChange={(e) => setSel({ ...sel, id: e.target.value.trim().toLowerCase() })} /></Field>
            <Field label="Ordre"><input type="number" value={sel.sort_order} onChange={(e) => setSel({ ...sel, sort_order: Number(e.target.value) })} /></Field>
          </div>
          <div className="adm-tabs" style={{ padding: 0, marginBottom: 18 }}>
            {(["fr", "en"] as Lang[]).map((l) => (
              <button key={l} className={"adm-tab" + (langTab === l ? " is-on" : "")} onClick={() => setLangTab(l)}>{l.toUpperCase()}</button>
            ))}
          </div>
          <SideEditor side={sel[langTab]} onChange={(s) => setSel({ ...sel, [langTab]: s })} />
          <div className="adm-actions">
            <button className="adm-btn adm-btn--primary" onClick={save} disabled={busy}>{busy ? "Enregistrement…" : "Enregistrer"}</button>
            {!isNew ? <button className="adm-btn adm-btn--ghost adm-btn--danger" onClick={remove} disabled={busy}>Supprimer</button> : null}
            {status}
          </div>
        </div>
      ) : (
        <p className="adm-note">Sélectionne un article à gauche, ou crée-en un nouveau.</p>
      )}
    </div>
  );
}

/* ---------- Images (Storage + image_slots) ---------- */

const SLOT_LABELS: Record<string, string> = {
  "sorya-portrait": "Portrait (accueil · Profil)",
};
const slotLabel = (id: string) => {
  if (SLOT_LABELS[id]) return SLOT_LABELS[id];
  if (id.startsWith("slot-")) return "Projet (grille accueil) — " + id.slice(5);
  if (id.startsWith("wslot-")) return "Projet (page Réalisations) — " + id.slice(6);
  if (id.startsWith("jslot-")) return "Journal (teaser accueil) — " + id.slice(6);
  if (id.startsWith("bslot-")) return "Journal (à la une) — " + id.slice(6);
  if (id.startsWith("bgslot-")) return "Journal (grille) — " + id.slice(7);
  if (id.startsWith("rslot-")) return "Article (lecteur) — " + id.slice(6);
  return id;
};

function SlotCard({ id, url, onChanged, setStatus }: { id: string; url: string | null; onChanged: () => void; setStatus: (m: string, e?: boolean) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const upload = async (file: File) => {
    setBusy(true);
    const ext = (file.name.split(".").pop() || "img").toLowerCase();
    const path = `slots/${id}/${Date.now()}.${ext}`;
    const up = await supabase.storage.from("media").upload(path, file, { cacheControl: "31536000" });
    if (up.error) { setBusy(false); setStatus("Upload impossible : " + up.error.message, true); return; }
    const pub = supabase.storage.from("media").getPublicUrl(path);
    const { error } = await supabase.from("image_slots").upsert({ id, url: pub.data.publicUrl, updated_at: new Date().toISOString() });
    setBusy(false);
    if (error) { setStatus("Erreur : " + error.message, true); return; }
    clearPublicCache(); setStatus("Image publiée."); onChanged();
  };

  const clear = async () => {
    setBusy(true);
    const { error } = await supabase.from("image_slots").upsert({ id, url: null, updated_at: new Date().toISOString() });
    setBusy(false);
    if (error) { setStatus("Erreur : " + error.message, true); return; }
    clearPublicCache(); setStatus("Image retirée (placeholder rétabli)."); onChanged();
  };

  return (
    <div className="adm-slot">
      <div className="adm-slot__id">{slotLabel(id)}</div>
      <div className="adm-slot__preview">
        {url ? <img src={url} alt="" /> : <span className="adm-slot__empty">Placeholder</span>}
      </div>
      <div className="adm-slot__row">
        <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/avif"
               onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ""; }} />
        <button className="adm-btn adm-btn--sm" disabled={busy} onClick={() => fileRef.current?.click()}>{busy ? "…" : url ? "Remplacer" : "Téléverser"}</button>
        {url ? <button className="adm-btn adm-btn--sm adm-btn--ghost adm-btn--danger" disabled={busy} onClick={clear}>Retirer</button> : null}
      </div>
    </div>
  );
}

function ImagesTab() {
  const [rows, setRows] = useState<{ id: string; url: string | null }[] | null>(null);
  const [status, setStatus] = useStatus();

  const load = () => supabase.from("image_slots").select("id,url").order("id").then(({ data, error }) => {
    if (error || !data) { setStatus("Chargement impossible : " + (error?.message || "?"), true); return; }
    setRows(data);
  });
  // eslint-disable-next-line
  useEffect(() => { load(); }, []);

  if (!rows) return <p className="adm-note">Chargement…</p>;

  return (
    <div>
      <p className="adm-note">Chaque emplacement correspond à un visuel du site. Sans image, le site affiche le placeholder d'origine.</p>
      {status}
      <div className="adm-slots">
        {rows.map((s) => <SlotCard key={s.id} id={s.id} url={s.url} onChanged={load} setStatus={setStatus} />)}
      </div>
    </div>
  );
}

/* ---------- shell ---------- */

const TABS: [string, string][] = [["textes", "Textes"], ["projets", "Projets"], ["journal", "Journal"], ["images", "Images"]];

export default function AdminPage() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [tab, setTab] = useState("textes");

  useEffect(() => {
    document.title = "Administration — Sorya Chau";
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => { meta.remove(); };
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (session === undefined) return null;
  if (!session) return <Login />;

  return (
    <div className="adm">
      <div className="adm-bar">
        <span className="adm-bar__mark">SC · Régie</span>
        <span className="adm-bar__title">Administration du portfolio</span>
        <span className="adm-bar__spacer"></span>
        <span className="adm-bar__user">{session.user.email}</span>
        <button className="adm-btn adm-btn--sm adm-btn--ghost" onClick={() => supabase.auth.signOut()}>Déconnexion</button>
      </div>
      <div className="adm-body">
        <nav className="adm-nav" aria-label="Sections">
          {TABS.map(([k, l]) => (
            <button key={k} className={"adm-nav__item" + (tab === k ? " is-on" : "")} onClick={() => setTab(k)} aria-current={tab === k ? "page" : undefined}>{l}</button>
          ))}
        </nav>
        <div className="adm-main">
          {tab === "textes" ? <TextesTab /> : null}
          {tab === "projets" ? <ProjetsTab /> : null}
          {tab === "journal" ? <JournalTab /> : null}
          {tab === "images" ? <ImagesTab /> : null}
        </div>
      </div>
    </div>
  );
}
