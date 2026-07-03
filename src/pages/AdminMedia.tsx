/* ============================================================
   Médiathèque — dossiers/sous-dossiers, rangement par
   glisser-déposer (avec alternative clavier), conversion AVIF
   côté navigateur (seul l'AVIF est stocké), alt/titre FR/EN
   pour le SEO et l'accessibilité.
   ============================================================ */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../lib/supabase";

type Folder = { id: string; parent_id: string | null; name: string };
type Item = {
  id: string; folder_id: string | null; path: string; url: string;
  alt: { fr: string; en: string }; title: { fr: string; en: string };
  width: number | null; height: number | null; size_bytes: number | null;
  created_at: string;
};

/* ---------- conversion AVIF (navigateur) ----------
   Aucun navigateur n'encode l'AVIF nativement (canvas.toBlob retombe en
   PNG) : on passe par l'encodeur WASM de Squoosh (@jsquash/avif), chargé
   paresseusement à la première conversion. */

const MAX_DIM = 2000;
const AVIF_QUALITY = 75; // 0–100

async function convertToAvif(file: File): Promise<{ blob: Blob; width: number; height: number }> {
  let bmp: ImageBitmap;
  try {
    bmp = await createImageBitmap(file);
  } catch (e) {
    throw new Error(`« ${file.name} » n'est pas une image lisible.`);
  }
  const scale = Math.min(1, MAX_DIM / Math.max(bmp.width, bmp.height));
  const w = Math.max(1, Math.round(bmp.width * scale));
  const h = Math.max(1, Math.round(bmp.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas indisponible.");
  ctx.drawImage(bmp, 0, 0, w, h);
  bmp.close();
  const { encode } = await import("@jsquash/avif");
  const data = ctx.getImageData(0, 0, w, h);
  const buf = await encode(data, { quality: AVIF_QUALITY, speed: 7 });
  if (!buf || !buf.byteLength) throw new Error("Échec de l'encodage AVIF.");
  return { blob: new Blob([buf], { type: "image/avif" }), width: w, height: h };
}

/* Nom de fichier SEO : slug ASCII depuis le nom d'origine */
function slugify(name: string): string {
  return name.replace(/\.[^.]+$/, "")
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
    .slice(0, 60) || "image";
}

const fmtSize = (b: number | null) => (b == null ? "" : b < 1024 * 1024 ? Math.round(b / 1024) + " Ko" : (b / 1048576).toFixed(1) + " Mo");

/* ---------- arbre de dossiers ---------- */

function childrenOf(folders: Folder[], parent: string | null): Folder[] {
  return folders.filter((f) => f.parent_id === parent).sort((a, b) => a.name.localeCompare(b.name, "fr"));
}

function descendants(folders: Folder[], id: string): Set<string> {
  const out = new Set<string>([id]);
  let grew = true;
  while (grew) {
    grew = false;
    for (const f of folders) {
      if (f.parent_id && out.has(f.parent_id) && !out.has(f.id)) { out.add(f.id); grew = true; }
    }
  }
  return out;
}

function breadcrumb(folders: Folder[], id: string | null): Folder[] {
  const path: Folder[] = [];
  let cur = folders.find((f) => f.id === id);
  while (cur) { path.unshift(cur); cur = folders.find((f) => f.id === cur!.parent_id); }
  return path;
}

/* options du menu « Déplacer vers… » : arbre aplati avec indentation */
function flatTree(folders: Folder[], parent: string | null = null, depth = 0): { id: string; label: string }[] {
  return childrenOf(folders, parent).flatMap((f) => [
    { id: f.id, label: " ".repeat(depth * 3) + (depth ? "└ " : "") + f.name },
    ...flatTree(folders, f.id, depth + 1),
  ]);
}

/* ============================================================ */

export default function MediaTab({ setStatus }: { setStatus: (m: string, err?: boolean) => void }) {
  const [folders, setFolders] = useState<Folder[] | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [cwd, setCwd] = useState<string | null>(null); // dossier courant (null = racine)
  const [sel, setSel] = useState<Item | null>(null);
  const [uploading, setUploading] = useState(0);
  const [dropHover, setDropHover] = useState<string | "zone" | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadFolders = () => supabase.from("media_folders").select("*").then(({ data, error }) => {
    if (error) { setStatus("Dossiers illisibles : " + error.message, true); return; }
    setFolders(data as Folder[]);
  });
  const loadItems = (folder: string | null) => {
    let q = supabase.from("media_items").select("*").order("created_at", { ascending: false });
    q = folder === null ? q.is("folder_id", null) : q.eq("folder_id", folder);
    return q.then(({ data, error }) => {
      if (error) { setStatus("Images illisibles : " + error.message, true); return; }
      setItems(data as Item[]);
    });
  };
  // eslint-disable-next-line
  useEffect(() => { loadFolders(); }, []);
  // eslint-disable-next-line
  useEffect(() => { setSel(null); loadItems(cwd); }, [cwd]);

  const subfolders = useMemo(() => (folders ? childrenOf(folders, cwd) : []), [folders, cwd]);
  const crumbs = useMemo(() => (folders ? breadcrumb(folders, cwd) : []), [folders, cwd]);
  const moveTargets = useMemo(() => (folders ? flatTree(folders) : []), [folders]);

  if (!folders) return <p className="adm-note">Chargement…</p>;

  /* ---------- actions ---------- */

  const createFolder = async () => {
    const name = window.prompt("Nom du dossier :");
    if (!name || !name.trim()) return;
    const { error } = await supabase.from("media_folders").insert({ name: name.trim(), parent_id: cwd });
    if (error) { setStatus("Erreur : " + error.message, true); return; }
    setStatus("Dossier créé."); loadFolders();
  };

  const renameFolder = async (f: Folder) => {
    const name = window.prompt("Nouveau nom :", f.name);
    if (!name || !name.trim() || name.trim() === f.name) return;
    const { error } = await supabase.from("media_folders").update({ name: name.trim() }).eq("id", f.id);
    if (error) { setStatus("Erreur : " + error.message, true); return; }
    loadFolders();
  };

  const deleteFolder = async (f: Folder) => {
    const inside = descendants(folders, f.id);
    const { count } = await supabase.from("media_items").select("id", { count: "exact", head: true }).in("folder_id", [...inside]);
    if (!window.confirm(`Supprimer le dossier « ${f.name} »${count ? ` ? Les ${count} image(s) qu'il contient remonteront à la racine` : " ?"}`)) return;
    const { error } = await supabase.from("media_folders").delete().eq("id", f.id);
    if (error) { setStatus("Erreur : " + error.message, true); return; }
    setStatus("Dossier supprimé."); loadFolders(); loadItems(cwd);
  };

  const moveItem = async (id: string, folder: string | null) => {
    const { error } = await supabase.from("media_items").update({ folder_id: folder }).eq("id", id);
    if (error) { setStatus("Erreur : " + error.message, true); return; }
    setStatus("Image déplacée."); loadItems(cwd);
  };

  const moveFolder = async (id: string, parent: string | null) => {
    if (parent !== null && descendants(folders, id).has(parent)) { setStatus("Impossible : un dossier ne peut pas être déplacé dans lui-même.", true); return; }
    if (id === parent) return;
    const { error } = await supabase.from("media_folders").update({ parent_id: parent }).eq("id", id);
    if (error) { setStatus("Erreur : " + error.message, true); return; }
    setStatus("Dossier déplacé."); loadFolders();
  };

  const upload = async (files: FileList | File[]) => {
    const list = [...files];
    if (!list.length) return;
    setUploading(list.length);
    let done = 0, failed = 0;
    for (const file of list) {
      try {
        const { blob, width, height } = await convertToAvif(file);
        const path = `lib/${slugify(file.name)}-${crypto.randomUUID().slice(0, 6)}.avif`;
        const up = await supabase.storage.from("media").upload(path, blob, { contentType: "image/avif", cacheControl: "31536000" });
        if (up.error) throw new Error(up.error.message);
        const url = supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
        const { error } = await supabase.from("media_items").insert({ folder_id: cwd, path, url, width, height, size_bytes: blob.size });
        if (error) throw new Error(error.message);
        done++;
      } catch (e) {
        failed++;
        setStatus(e instanceof Error ? e.message : "Échec de l'import.", true);
      }
      setUploading(list.length - done - failed);
    }
    setUploading(0);
    if (done) setStatus(`${done} image(s) converties en AVIF et importées.${failed ? ` ${failed} échec(s).` : ""}`, failed > 0 && !done);
    loadItems(cwd);
  };

  const saveMeta = async () => {
    if (!sel) return;
    const { error } = await supabase.from("media_items").update({ alt: sel.alt, title: sel.title }).eq("id", sel.id);
    if (error) { setStatus("Erreur : " + error.message, true); return; }
    setStatus("Métadonnées enregistrées."); loadItems(cwd);
  };

  const deleteItem = async () => {
    if (!sel) return;
    if (!window.confirm("Supprimer définitivement cette image ?")) return;
    const rm = await supabase.storage.from("media").remove([sel.path]);
    if (rm.error) { setStatus("Erreur Storage : " + rm.error.message, true); return; }
    const { error } = await supabase.from("media_items").delete().eq("id", sel.id);
    if (error) { setStatus("Erreur : " + error.message, true); return; }
    setStatus("Image supprimée."); setSel(null); loadItems(cwd);
  };

  /* ---------- drag & drop ---------- */

  const onDropTo = (target: string | null) => (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setDropHover(null);
    const item = e.dataTransfer.getData("text/x-media-item");
    const folder = e.dataTransfer.getData("text/x-media-folder");
    if (item) moveItem(item, target);
    else if (folder) moveFolder(folder, target);
    else if (e.dataTransfer.files?.length) upload(e.dataTransfer.files); // fichiers du bureau
  };
  const allowDrop = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); };

  const missingAlt = (it: Item) => !it.alt?.fr?.trim() || !it.alt?.en?.trim();

  return (
    <div>
      <p className="adm-note">
        Les images sont converties en AVIF dans ton navigateur avant l'envoi — seul l'AVIF est stocké.
        Renseigne le texte alternatif FR et EN de chaque image : c'est ce que lisent les lecteurs d'écran et les moteurs de recherche.
      </p>

      {/* fil d'ariane */}
      <nav className="med-crumbs" aria-label="Chemin du dossier">
        <button
          className={"med-crumb" + (cwd === null ? " is-on" : "") + (dropHover === "root" ? " is-drop" : "")}
          onClick={() => setCwd(null)}
          onDragOver={(e) => { allowDrop(e); setDropHover("root"); }}
          onDragLeave={() => setDropHover(null)}
          onDrop={onDropTo(null)}
        >Médiathèque</button>
        {crumbs.map((c) => (
          <React.Fragment key={c.id}>
            <span className="med-crumb-sep" aria-hidden="true">/</span>
            <button
              className={"med-crumb" + (c.id === cwd ? " is-on" : "") + (dropHover === c.id ? " is-drop" : "")}
              onClick={() => setCwd(c.id)}
              onDragOver={(e) => { allowDrop(e); setDropHover(c.id); }}
              onDragLeave={() => setDropHover(null)}
              onDrop={onDropTo(c.id)}
            >{c.name}</button>
          </React.Fragment>
        ))}
      </nav>

      <div className="adm-actions" style={{ marginTop: 0, marginBottom: 16 }}>
        <button className="adm-btn" onClick={createFolder}>+ Nouveau dossier</button>
        <button className="adm-btn adm-btn--primary" onClick={() => fileRef.current?.click()} disabled={uploading > 0}>
          {uploading > 0 ? `Conversion… (${uploading})` : "Importer des images"}
        </button>
        <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/avif,image/gif" multiple style={{ display: "none" }}
               onChange={(e) => { if (e.target.files) upload(e.target.files); e.target.value = ""; }} />
      </div>

      <div className={"med-zone" + (dropHover === "zone" ? " is-drop" : "")}
           onDragOver={(e) => { allowDrop(e); setDropHover("zone"); }}
           onDragLeave={() => setDropHover(null)}
           onDrop={onDropTo(cwd)}>

        {/* dossiers */}
        {subfolders.length ? (
          <ul className="med-folders" aria-label="Sous-dossiers">
            {subfolders.map((f) => (
              <li key={f.id}
                  className={"med-folder" + (dropHover === f.id ? " is-drop" : "")}
                  draggable
                  onDragStart={(e) => { e.dataTransfer.setData("text/x-media-folder", f.id); e.dataTransfer.effectAllowed = "move"; }}
                  onDragOver={(e) => { allowDrop(e); setDropHover(f.id); }}
                  onDragLeave={() => setDropHover(null)}
                  onDrop={onDropTo(f.id)}>
                <button className="med-folder__open" onClick={() => setCwd(f.id)} aria-label={"Ouvrir le dossier " + f.name}>
                  <span className="med-folder__glyph" aria-hidden="true">▤</span>
                  <span className="med-folder__name">{f.name}</span>
                </button>
                <span className="med-folder__tools">
                  <button className="adm-btn adm-btn--sm" onClick={() => renameFolder(f)} aria-label={"Renommer " + f.name}>✎</button>
                  <button className="adm-btn adm-btn--sm adm-btn--danger" onClick={() => deleteFolder(f)} aria-label={"Supprimer " + f.name}>✕</button>
                </span>
                <label className="med-move">
                  <span className="med-move__l">Déplacer vers</span>
                  <select value="" onChange={(e) => { if (e.target.value) moveFolder(f.id, e.target.value === "__root__" ? null : e.target.value); }}
                          aria-label={"Déplacer le dossier " + f.name + " vers"}>
                    <option value="">…</option>
                    <option value="__root__">Médiathèque (racine)</option>
                    {moveTargets.filter((t) => !descendants(folders, f.id).has(t.id)).map((t) => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                  </select>
                </label>
              </li>
            ))}
          </ul>
        ) : null}

        {/* images */}
        {items.length ? (
          <ul className="med-grid" aria-label="Images du dossier">
            {items.map((it) => (
              <li key={it.id}
                  className={"med-card" + (sel?.id === it.id ? " is-on" : "")}
                  draggable
                  onDragStart={(e) => { e.dataTransfer.setData("text/x-media-item", it.id); e.dataTransfer.effectAllowed = "move"; }}>
                <button className="med-card__open" onClick={() => setSel(it)} aria-label={"Éditer " + (it.alt.fr || it.path.split("/").pop())}>
                  <img src={it.url} alt={it.alt.fr || ""} loading="lazy" width={it.width || undefined} height={it.height || undefined} />
                </button>
                <div className="med-card__meta">
                  <span className="med-card__name">{it.path.split("/").pop()}</span>
                  {missingAlt(it) ? <span className="med-badge med-badge--warn">ALT manquant</span> : <span className="med-badge">SEO ✓</span>}
                </div>
                <label className="med-move">
                  <span className="med-move__l">Déplacer vers</span>
                  <select value="" onChange={(e) => { if (e.target.value) moveItem(it.id, e.target.value === "__root__" ? null : e.target.value); }}
                          aria-label="Déplacer l'image vers">
                    <option value="">…</option>
                    <option value="__root__">Médiathèque (racine)</option>
                    {moveTargets.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
                  </select>
                </label>
              </li>
            ))}
          </ul>
        ) : (
          <p className="adm-note med-empty">
            {subfolders.length ? "Aucune image directement dans ce dossier." : "Dossier vide."} Glisse des fichiers ici ou utilise « Importer des images ».
          </p>
        )}
      </div>

      {/* panneau d'édition */}
      {sel ? (
        <div className="med-editor adm-editor" role="region" aria-label="Édition de l'image">
          <div className="med-editor__preview">
            <img src={sel.url} alt={sel.alt.fr || ""} width={sel.width || undefined} height={sel.height || undefined} />
            <p className="adm-note">
              {sel.width}×{sel.height} px · {fmtSize(sel.size_bytes)} · AVIF<br />
              <button className="adm-btn adm-btn--sm" onClick={() => { navigator.clipboard.writeText(sel.url); setStatus("URL copiée."); }}>Copier l'URL</button>
            </p>
          </div>
          <div className="med-editor__form">
            <div className="adm-h">Texte alternatif (description factuelle de l'image)</div>
            <div className="adm-cols">
              <label className="adm-field"><span className="adm-field__l">Alt — Français</span>
                <textarea rows={2} value={sel.alt.fr} onChange={(e) => setSel({ ...sel, alt: { ...sel.alt, fr: e.target.value } })} />
              </label>
              <label className="adm-field"><span className="adm-field__l">Alt — English</span>
                <textarea rows={2} value={sel.alt.en} onChange={(e) => setSel({ ...sel, alt: { ...sel.alt, en: e.target.value } })} />
              </label>
            </div>
            <div className="adm-h">Titre (optionnel — infobulle / légende)</div>
            <div className="adm-cols">
              <label className="adm-field"><span className="adm-field__l">Titre — Français</span>
                <input type="text" value={sel.title.fr} onChange={(e) => setSel({ ...sel, title: { ...sel.title, fr: e.target.value } })} />
              </label>
              <label className="adm-field"><span className="adm-field__l">Titre — English</span>
                <input type="text" value={sel.title.en} onChange={(e) => setSel({ ...sel, title: { ...sel.title, en: e.target.value } })} />
              </label>
            </div>
            <div className="adm-actions">
              <button className="adm-btn adm-btn--primary" onClick={saveMeta}>Enregistrer</button>
              <button className="adm-btn adm-btn--ghost adm-btn--danger" onClick={deleteItem}>Supprimer l'image</button>
              <button className="adm-btn adm-btn--ghost" onClick={() => setSel(null)}>Fermer</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
