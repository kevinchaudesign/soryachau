/* ============================================================
   Fichiers statiques du CV — un PDF par langue, servis depuis
   public/assets. Chemins gardés dans le code, pas dans l'i18n :
   ce sont des ressources, pas de la copie éditable en back-office.
   ============================================================ */
import type { Lang } from "../i18n";

export const CV_PDF: Record<Lang, string> = {
  fr: "/assets/Sorya-Chau-CV.pdf",
  en: "/assets/Sorya-Chau-Resume-EN.pdf",
};
