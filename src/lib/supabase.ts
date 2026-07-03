import { createClient } from "@supabase/supabase-js";

/* Publishable key — safe to ship to the browser (RLS enforces access).
   Overridable via env for another project/environment. */
const url = import.meta.env.VITE_SUPABASE_URL || "https://nlgfcrkmeslbkqqgatzq.supabase.co";
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_OvuMk2Oc2yq_TWan20_Kgg_pApZDcUC";

export const supabase = createClient(url, key);
