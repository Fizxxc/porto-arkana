-- ========================================
-- THE ARKANA VAULT
-- Migration from initial schema -> v2 schema
-- Safe for projects/profiles that already exist
-- ========================================

create extension if not exists "pgcrypto";

-- 1) ADMIN ROLE
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.admin_users au
    where au.user_id = auth.uid()
  );
$$;

-- 2) UPGRADE PROFILES TABLE
alter table public.profiles
  add column if not exists headline text not null default '',
  add column if not exists email text not null default 'arkanasupport@gmail.com';

update public.profiles
set
  headline = case when headline = '' then 'Visual Designer & Creative Student' else headline end,
  email = case when email = '' then 'arkanasupport@gmail.com' else email end;

-- 3) UPGRADE PROJECTS TABLE
alter table public.projects
  add column if not exists summary text not null default '',
  add column if not exists year text not null default '',
  add column if not exists client_name text not null default '',
  add column if not exists cover_url text not null default '',
  add column if not exists asset_url text not null default '',
  add column if not exists featured boolean not null default false;

update public.projects
set
  summary = case when summary = '' then left(description, 110) else summary end,
  year = case when year = '' then to_char(created_at, 'YYYY') else year end,
  client_name = case when client_name = '' then 'Personal Project' else client_name end,
  cover_url = case when cover_url = '' then image_url else cover_url end,
  asset_url = case when asset_url = '' then download_link else asset_url end;

create index if not exists projects_featured_idx on public.projects (featured desc, created_at desc);

-- 4) SITE CONTENT TABLE FOR HERO / ABOUT / CONTACT
create table if not exists public.site_content (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  hero_badge text not null default 'Portfolio / Visual Design',
  hero_title text not null default 'Arkana Kafi crafts minimalist visuals that feel sharp, personal, and memorable.',
  hero_subtitle text not null default 'A portfolio built to present selected works, personal identity, and downloadable project assets in a premium monochrome experience.',
  about_title text not null default 'About Me',
  about_body text not null default 'This section is editable manually by admin.',
  focus_title text not null default 'Creative Focus',
  focus_items jsonb not null default '["Brand Identity", "Poster & Editorial", "UI / UX Visual Direction"]'::jsonb,
  portfolio_drive_url text not null default '',
  contact_title text not null default 'Let’s build something visually strong.',
  contact_body text not null default 'Open for student collaborations and selected digital design projects.'
);

create unique index if not exists site_content_singleton_idx on public.site_content ((true));

insert into public.site_content default values
on conflict do nothing;

-- 5) RLS FOR NEW TABLES
alter table public.admin_users enable row level security;
alter table public.site_content enable row level security;

-- drop old permissive policies on existing tables
-- profiles
drop policy if exists "Authenticated users can insert profiles" on public.profiles;
drop policy if exists "Authenticated users can update profiles" on public.profiles;
drop policy if exists "Authenticated users can delete profiles" on public.profiles;
drop policy if exists "Admins manage profiles" on public.profiles;

-- projects
drop policy if exists "Authenticated users can insert projects" on public.projects;
drop policy if exists "Authenticated users can update projects" on public.projects;
drop policy if exists "Authenticated users can delete projects" on public.projects;
drop policy if exists "Admins manage projects" on public.projects;

-- admin_users
drop policy if exists "Only admins read admin_users" on public.admin_users;
drop policy if exists "Only admins manage admin_users" on public.admin_users;

-- site_content
drop policy if exists "Public can read site content" on public.site_content;
drop policy if exists "Admins manage site content" on public.site_content;

-- reset read policies safely
drop policy if exists "Public can read profiles" on public.profiles;
drop policy if exists "Public can read projects" on public.projects;
drop policy if exists "Public can read site content" on public.site_content;

create policy "Public can read profiles"
on public.profiles
for select
to public
using (true);

create policy "Public can read projects"
on public.projects
for select
to public
using (true);

create policy "Public can read site content"
on public.site_content
for select
to public
using (true);

create policy "Admins manage profiles"
on public.profiles
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins manage projects"
on public.projects
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Only admins read admin_users"
on public.admin_users
for select
to authenticated
using (public.is_admin());

create policy "Only admins manage admin_users"
on public.admin_users
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins manage site content"
on public.site_content
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- 6) STORAGE BUCKET FOR DOWNLOAD ASSETS
insert into storage.buckets (id, name, public)
values ('project-assets', 'project-assets', true)
on conflict (id) do nothing;

-- replace old storage policies that allowed any authenticated user
-- project-images
drop policy if exists "Authenticated can upload project images" on storage.objects;
drop policy if exists "Authenticated can update project images" on storage.objects;
drop policy if exists "Authenticated can delete project images" on storage.objects;
drop policy if exists "Admins manage project images" on storage.objects;

create policy "Admins manage project images"
on storage.objects
for all
to authenticated
using (bucket_id = 'project-images' and public.is_admin())
with check (bucket_id = 'project-images' and public.is_admin());

-- project-assets
drop policy if exists "Public can view project assets" on storage.objects;
drop policy if exists "Admins manage project assets" on storage.objects;

create policy "Public can view project assets"
on storage.objects
for select
to public
using (bucket_id = 'project-assets');

create policy "Admins manage project assets"
on storage.objects
for all
to authenticated
using (bucket_id = 'project-assets' and public.is_admin())
with check (bucket_id = 'project-assets' and public.is_admin());

-- 7) OPTIONAL: make sure there is at least one usable row
update public.profiles
set email = 'arkanasupport@gmail.com'
where email = '';
