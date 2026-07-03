/// <reference types="vite/client" />

import * as React from "react";

declare module "react" {
  /* Allow CSS custom properties in style={} — the prototype drives reveal
     delays and layout via --rd / --editbar-h etc. */
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined;
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      /* <image-slot> web component (src/lib/image-slot.js) — custom elements
         take the plain `class` attribute, not className. */
      "image-slot": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        class?: string;
        shape?: "rect" | "rounded" | "circle" | "pill";
        radius?: string | number;
        mask?: string;
        fit?: "cover" | "contain" | "fill";
        position?: string;
        placeholder?: string;
        src?: string;
      };
    }
  }
}
