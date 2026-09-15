-- Portfolio Sorya Chau — content schema
-- Public site reads anonymously; the single admin (authenticated) writes.

create table public.translations (
  lang text primary key check (lang in ('fr', 'en')),
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table public.projects (
  id text primary key,
  sort_order integer not null default 0,
  client text not null,
  title text not null,
  year text not null,
  featured boolean not null default false,
  pending boolean not null default false,
  ai boolean not null default false,
  vimeo text,
  still text,
  tag jsonb not null default '{}'::jsonb,   -- {fr, en}
  role jsonb not null default '{}'::jsonb,  -- {fr, en}
  descr jsonb not null default '{}'::jsonb, -- {fr, en}
  updated_at timestamptz not null default now()
);

create table public.articles (
  id text primary key,
  sort_order integer not null default 0,
  fr jsonb not null, -- {cat, date, read, title, dek, body: [{t, c}]}
  en jsonb not null,
  updated_at timestamptz not null default now()
);

create table public.image_slots (
  id text primary key, -- DOM slot id (sorya-portrait, slot-avene, jslot-…, bslot-…, rslot-…)
  url text,
  updated_at timestamptz not null default now()
);

alter table public.translations enable row level security;
alter table public.projects enable row level security;
alter table public.articles enable row level security;
alter table public.image_slots enable row level security;

-- Public read
create policy "public read translations" on public.translations for select to anon, authenticated using (true);
create policy "public read projects" on public.projects for select to anon, authenticated using (true);
create policy "public read articles" on public.articles for select to anon, authenticated using (true);
create policy "public read image_slots" on public.image_slots for select to anon, authenticated using (true);

-- Admin write (any authenticated user — single-admin site)
create policy "admin insert translations" on public.translations for insert to authenticated with check (true);
create policy "admin update translations" on public.translations for update to authenticated using (true) with check (true);
create policy "admin delete translations" on public.translations for delete to authenticated using (true);

create policy "admin insert projects" on public.projects for insert to authenticated with check (true);
create policy "admin update projects" on public.projects for update to authenticated using (true) with check (true);
create policy "admin delete projects" on public.projects for delete to authenticated using (true);

create policy "admin insert articles" on public.articles for insert to authenticated with check (true);
create policy "admin update articles" on public.articles for update to authenticated using (true) with check (true);
create policy "admin delete articles" on public.articles for delete to authenticated using (true);

create policy "admin insert image_slots" on public.image_slots for insert to authenticated with check (true);
create policy "admin update image_slots" on public.image_slots for update to authenticated using (true) with check (true);
create policy "admin delete image_slots" on public.image_slots for delete to authenticated using (true);

-- Storage: public media bucket
insert into storage.buckets (id, name, public) values ('media', 'media', true);

create policy "public read media" on storage.objects for select to anon, authenticated using (bucket_id = 'media');
create policy "admin insert media" on storage.objects for insert to authenticated with check (bucket_id = 'media');
create policy "admin update media" on storage.objects for update to authenticated using (bucket_id = 'media') with check (bucket_id = 'media');
create policy "admin delete media" on storage.objects for delete to authenticated using (bucket_id = 'media');;
