-- Médiathèque : dossiers imbriqués + images (AVIF uniquement, alt/titre FR/EN)
-- Même modèle de sécurité que le reste : lecture publique, écriture allowlist admin.

create table public.media_folders (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.media_folders(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table public.media_items (
  id uuid primary key default gen_random_uuid(),
  folder_id uuid references public.media_folders(id) on delete set null,
  path text not null,                                   -- chemin dans le bucket media
  url text not null,                                    -- URL publique
  alt jsonb not null default '{"fr":"","en":""}'::jsonb,
  title jsonb not null default '{"fr":"","en":""}'::jsonb,
  width integer,
  height integer,
  size_bytes integer,
  created_at timestamptz not null default now()
);

create index media_items_folder_idx on public.media_items (folder_id);
create index media_folders_parent_idx on public.media_folders (parent_id);

alter table public.media_folders enable row level security;
alter table public.media_items enable row level security;

create policy "public read media_folders" on public.media_folders for select to anon, authenticated using (true);
create policy "public read media_items" on public.media_items for select to anon, authenticated using (true);

create policy "admin insert media_folders" on public.media_folders for insert to authenticated with check (private.is_admin());
create policy "admin update media_folders" on public.media_folders for update to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "admin delete media_folders" on public.media_folders for delete to authenticated using (private.is_admin());

create policy "admin insert media_items" on public.media_items for insert to authenticated with check (private.is_admin());
create policy "admin update media_items" on public.media_items for update to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "admin delete media_items" on public.media_items for delete to authenticated using (private.is_admin());
