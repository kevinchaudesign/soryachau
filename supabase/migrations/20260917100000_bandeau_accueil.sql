-- Accueil : le bandeau « Plan de travail » prend son propre visuel.
-- Image generee avec GPT Image 2.5 (variante Flare) via le CLI
-- Higgsfield, en 21:9 comme le bandeau, convertie en AVIF aux regles
-- du back-office (2000 px, qualite 75). La photo de tournage qui
-- servait jusqu'ici reste dans la mediatheque.

insert into public.media_items (folder_id, path, url, alt, title, width, height, size_bytes)
select v.folder_id, v.path, v.url, v.alt, v.title, v.width, v.height, v.size_bytes
from (values
  ('1d720a93-ef80-421b-af7b-ffad14b85648'::uuid, 'lib/accueil-plan-de-travail-877b3f.avif', 'https://nlgfcrkmeslbkqqgatzq.supabase.co/storage/v1/object/public/media/lib/accueil-plan-de-travail-877b3f.avif', '{"fr": "Un plan de travail en bandes de couleur sur son chevalet, l''equipe au travail derriere", "en": "A strip board schedule on its stand, the crew at work behind"}'::jsonb, '{"fr":"","en":""}'::jsonb, 2000, 857, 138275)
) as v (folder_id, path, url, alt, title, width, height, size_bytes)
where not exists (select 1 from public.media_items m where m.path = v.path);

update public.image_slots
set url = 'https://nlgfcrkmeslbkqqgatzq.supabase.co/storage/v1/object/public/media/lib/accueil-plan-de-travail-877b3f.avif', updated_at = now()
where id = 'band-accueil';
