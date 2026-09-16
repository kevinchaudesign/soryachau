-- Bandeaux « a l'image » : deux photos du dossier Tournages de la
-- mediatheque, posees sur l'accueil et sur la page Approche.
-- Les emplacements restent remplacables depuis la regie.

insert into public.image_slots (id, url, updated_at) values
  ('band-accueil',  'https://nlgfcrkmeslbkqqgatzq.supabase.co/storage/v1/object/public/media/lib/24-c5a229.avif', now()),
  ('band-approche', 'https://nlgfcrkmeslbkqqgatzq.supabase.co/storage/v1/object/public/media/lib/26-52951b.avif', now())
on conflict (id) do update set url = excluded.url, updated_at = now();

-- Textes alternatifs des photos de tournage, vides jusqu'ici.
update public.media_items
set alt = '{"fr":"Plan de travail annoté à la main sur un tournage","en":"A shooting schedule annotated by hand on set"}'::jsonb
where path like 'lib/1%-%' or path like 'lib/2%-%';
