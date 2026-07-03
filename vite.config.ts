import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  /* @jsquash/avif résout son .wasm via new URL(…, import.meta.url) —
     le pré-bundling de dépendances casse cette résolution en dev.
     Sa variante multithread embarque un worker : format es requis. */
  optimizeDeps: { exclude: ["@jsquash/avif"] },
  worker: { format: "es" },
});
