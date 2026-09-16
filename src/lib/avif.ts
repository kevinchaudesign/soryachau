/* ============================================================
   Conversion AVIF côté navigateur — partagée par les deux points
   d'import du back-office (médiathèque et emplacements d'images).
   Règle : seul l'AVIF produit ici part vers le stockage, jamais
   le fichier d'origine. En cas d'échec, on lève — l'appelant
   n'envoie rien.

   Aucun navigateur n'encode l'AVIF nativement (canvas.toBlob
   retombe en PNG) : on passe par l'encodeur WASM de Squoosh
   (@jsquash/avif), importé paresseusement à la première
   conversion pour ne pas charger le wasm avec la page.
   ============================================================ */

export const MAX_DIM = 2000;
export const AVIF_QUALITY = 75; // 0–100

export async function convertToAvif(file: File): Promise<{ blob: Blob; width: number; height: number }> {
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
export function slugify(name: string): string {
  return name.replace(/\.[^.]+$/, "")
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
    .slice(0, 60) || "image";
}
