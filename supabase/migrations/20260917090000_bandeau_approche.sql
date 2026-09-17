-- Page Approche : le bandeau « Preparation » prend un visuel dedie.
-- Image generee avec GPT Image 2.5 (variante Flare) via le CLI
-- Higgsfield, en 21:9 comme le bandeau, convertie en AVIF aux regles
-- du back-office (2000 px, qualite 75) et rangee dans la mediatheque.
-- La photo de tournage qui servait jusqu'ici reste disponible.

insert into public.media_items (folder_id, path, url, alt, title, width, height, size_bytes)
select v.folder_id, v.path, v.url, v.alt, v.title, v.width, v.height, v.size_bytes
from (values
  ('1d720a93-ef80-421b-af7b-ffad14b85648'::uuid, 'lib/approche-preparation-92fdc2.avif', 'https://nlgfcrkmeslbkqqgatzq.supabase.co/storage/v1/object/public/media/lib/approche-preparation-92fdc2.avif', '{"fr": "Une table de production en preparation : storyboards, photos de reperage et plan de lieu", "en": "A production table mid-preparation: storyboards, location photographs and a floor plan"}'::jsonb, '{"fr":"","en":""}'::jsonb, 2000, 857, 198716)
) as v (folder_id, path, url, alt, title, width, height, size_bytes)
where not exists (select 1 from public.media_items m where m.path = v.path);

update public.image_slots
set url = 'https://nlgfcrkmeslbkqqgatzq.supabase.co/storage/v1/object/public/media/lib/approche-preparation-92fdc2.avif', updated_at = now()
where id = 'band-approche';
