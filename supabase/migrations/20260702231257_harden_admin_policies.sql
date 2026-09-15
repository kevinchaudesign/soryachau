-- Single-admin hardening: writes require an email present in private.admins,
-- not merely an authenticated session (public sign-ups would otherwise grant write).

create schema if not exists private;

create table private.admins (email text primary key);
alter table private.admins enable row level security; -- defense in depth; no policies: only definer function reads it
insert into private.admins (email) values ('chausorya@gmail.com'), ('valeoaurelien@gmail.com');

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from private.admins a
    where a.email = (select auth.jwt() ->> 'email')
  );
$$;

revoke all on function private.is_admin() from public;
grant usage on schema private to authenticated;
grant execute on function private.is_admin() to authenticated;

-- Replace permissive write policies
drop policy "admin insert translations" on public.translations;
drop policy "admin update translations" on public.translations;
drop policy "admin delete translations" on public.translations;
drop policy "admin insert projects" on public.projects;
drop policy "admin update projects" on public.projects;
drop policy "admin delete projects" on public.projects;
drop policy "admin insert articles" on public.articles;
drop policy "admin update articles" on public.articles;
drop policy "admin delete articles" on public.articles;
drop policy "admin insert image_slots" on public.image_slots;
drop policy "admin update image_slots" on public.image_slots;
drop policy "admin delete image_slots" on public.image_slots;

create policy "admin insert translations" on public.translations for insert to authenticated with check (private.is_admin());
create policy "admin update translations" on public.translations for update to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "admin delete translations" on public.translations for delete to authenticated using (private.is_admin());

create policy "admin insert projects" on public.projects for insert to authenticated with check (private.is_admin());
create policy "admin update projects" on public.projects for update to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "admin delete projects" on public.projects for delete to authenticated using (private.is_admin());

create policy "admin insert articles" on public.articles for insert to authenticated with check (private.is_admin());
create policy "admin update articles" on public.articles for update to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "admin delete articles" on public.articles for delete to authenticated using (private.is_admin());

create policy "admin insert image_slots" on public.image_slots for insert to authenticated with check (private.is_admin());
create policy "admin update image_slots" on public.image_slots for update to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "admin delete image_slots" on public.image_slots for delete to authenticated using (private.is_admin());

-- Storage: same hardening; drop the broad public listing policy
-- (public bucket object URLs don't need a SELECT policy).
drop policy "public read media" on storage.objects;
drop policy "admin insert media" on storage.objects;
drop policy "admin update media" on storage.objects;
drop policy "admin delete media" on storage.objects;

create policy "admin read media" on storage.objects for select to authenticated using (bucket_id = 'media' and private.is_admin());
create policy "admin insert media" on storage.objects for insert to authenticated with check (bucket_id = 'media' and private.is_admin());
create policy "admin update media" on storage.objects for update to authenticated using (bucket_id = 'media' and private.is_admin()) with check (bucket_id = 'media' and private.is_admin());
create policy "admin delete media" on storage.objects for delete to authenticated using (bucket_id = 'media' and private.is_admin());;
