-- Work-page filter category, previously hardcoded in the front (WP_CATMAP)
alter table public.projects add column category text not null default 'brand'
  check (category in ('brand', 'doc', 'post', 'vfx', 'ai'));

update public.projects set category = 'brand' where id in ('kinder', 'tagheuer', 'krys');
update public.projects set category = 'post' where id = 'avene';
update public.projects set category = 'doc' where id = 'asics';
update public.projects set category = 'vfx' where id = 'fiat';
update public.projects set category = 'ai' where id = 'pmu';;
