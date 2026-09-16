/* ============================================================
   Logo — lockup de Sorya (SC_Logo/logo-lockup.svg) : monogramme
   au voyant rouge, nom au point final, fonction en mono façon
   timecode. Redessiné en SVG/HTML plutôt qu'importé tel quel :
   les fichiers d'origine appellent Playfair Display et Space Mono,
   absents du site — l'import aurait basculé sur Georgia et Courier.
   Ici, mêmes formes et mêmes proportions, avec les polices et les
   tokens de couleur du site.
   ============================================================ */

/* Carré d'encre, « SC » en serif, voyant rouge en haut à droite.
   `inverse` pour les fonds sombres (hero, pied de page). */
export function Monogram({ size = 34, inverse = false }: { size?: number; inverse?: boolean }) {
  return (
    <svg
      className={"logo-mono" + (inverse ? " logo-mono--inv" : "")}
      width={size}
      height={size}
      viewBox="0 0 200 200"
      role="img"
      aria-label="Sorya Chau"
    >
      <rect width="200" height="200" className="logo-mono__bg" />
      <text x="100" y="128" textAnchor="middle" className="logo-mono__sc">SC</text>
      <circle cx="180" cy="20" r="9" className="logo-mono__dot" />
    </svg>
  );
}

/* Lockup complet : monogramme + nom + fonction. C'est la version
   que Sorya destine à l'en-tête du site. */
export function Logo({ baseline }: { baseline?: string }) {
  return (
    <span className="logo">
      <Monogram />
      <span className="logo__text">
        <span className="logo__name">Sorya Chau<span className="logo__dot">.</span></span>
        {baseline ? <span className="logo__baseline">{baseline}</span> : null}
      </span>
    </span>
  );
}
