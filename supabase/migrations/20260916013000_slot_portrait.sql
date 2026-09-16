-- Portrait de Sorya : image de la médiathèque affectée à l'emplacement
-- « sorya-portrait » (accueil · aperçu Profil, et page /profil).
-- Mise à jour de données, réexécutable sans effet de bord.

insert into public.image_slots (id, url, updated_at)
values (
  'sorya-portrait',
  'https://nlgfcrkmeslbkqqgatzq.supabase.co/storage/v1/object/public/media/lib/portrait-sorya-chau-ed7e0a.avif',
  now()
)
on conflict (id) do update
  set url = excluded.url,
      updated_at = now();
