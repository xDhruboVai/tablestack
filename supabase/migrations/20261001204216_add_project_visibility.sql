create table if not exists public.project_visibility (
  slug text primary key,
  visible boolean not null default true,
  updated_at timestamptz not null default now()
);

insert into public.project_visibility (slug, visible)
values
  ('pinewood', true),
  ('smashed-burgers', true)
on conflict (slug) do update
set visible = excluded.visible,
    updated_at = now();
