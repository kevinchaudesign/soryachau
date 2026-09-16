/* ============================================================
   Bandeau « à l'image » — une photo de tournage en pleine largeur,
   îlot sombre entre deux sections claires. Le visuel passe par un
   <image-slot> : il reste donc remplaçable depuis la régie, comme
   le portrait.
   ============================================================ */
import { useLang } from "../lang";

export function ShootBand({ id, label, tc }: { id: string; label: string; tc: string }) {
  const { slots } = useLang();
  return (
    /* inert en plus d'aria-hidden : <image-slot> est focusable pour
       son mode dépôt, et un conteneur masqué ne doit rien contenir
       de focusable (même motif que les médias du Journal). */
    <div className="band" aria-hidden="true" {...({ inert: "" } as object)}>
      <image-slot id={id} class="band__img" shape="rect" placeholder={label} src={slots[id] || undefined}></image-slot>
      <span className="band__veil"></span>
      <span className="band__meta band__meta--l">{label}</span>
      <span className="band__meta band__meta--r">TC {tc}</span>
    </div>
  );
}
