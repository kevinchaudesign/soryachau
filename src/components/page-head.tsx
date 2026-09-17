/* ============================================================
   En-tête commun à toutes les pages sauf l'accueil.
   Même séquence partout : lien de retour, eyebrow numérotée
   comme la barre de montage, titre principal, accroche, puis
   d'éventuels contrôles (les filtres de la page Projets).
   Les pages éditoriales (un article du Journal) n'ont pas de
   titre de section : elles n'en passent pas, et seul le lien
   de retour est rendu.
   ============================================================ */
import React from "react";
import { Link } from "react-router-dom";

export function PageHead({
  idx, eyebrow, title, lead, back, to = "/", children,
}: {
  idx?: string;
  eyebrow?: string;
  title?: string;
  lead?: string;
  back: string;
  to?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="pg-head">
      <div className="container">
        <Link to={to} className="pg-back" data-cursor>
          <span className="pg-back__arrow">←</span>{back}
        </Link>

        {title ? (
          <div className="pg-head__main">
            {eyebrow ? (
              <span className="eyebrow pg-head__eyebrow reveal">
                {idx ? <span className="idx">{idx}</span> : null}{eyebrow}
              </span>
            ) : null}
            <h1 className="pg-head__title section-title reveal" style={{ "--rd": "80ms" }}>{title}</h1>
            {lead ? <p className="pg-head__lead reveal" style={{ "--rd": "140ms" }}>{lead}</p> : null}
            {children}
          </div>
        ) : null}
      </div>
    </header>
  );
}
