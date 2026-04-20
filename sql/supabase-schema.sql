create extension if not exists "pgcrypto";

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
    select 1 from public.admin_users au where au.user_id = auth.uid()
  );
$$;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  headline text not null,
  school_info text not null,
  bio text not null,
  phone text not null,
  email text not null,
  address text not null,
  social_links jsonb not null default '{}'::jsonb
);
create unique index if not exists profiles_singleton_idx on public.profiles ((true));

create table if not exists public.site_content (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  hero_badge text not null,
  hero_title text not null,
  hero_subtitle text not null,
  about_title text not null,
  about_body text not null,
  focus_title text not null,
  focus_items jsonb not null default '[]'::jsonb,
  portfolio_drive_url text not null default '',
  contact_title text not null,
  contact_body text not null
);
create unique index if not exists site_content_singleton_idx on public.site_content ((true));

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null,
  slug text not null unique,
  summary text not null,
  description text not null,
  category text not null,
  year text not null default '',
  client_name text not null default '',
  cover_url text not null,
  asset_url text not null,
  featured boolean not null default false
);

create index if not exists projects_featured_idx on public.projects (featured desc, created_at desc);

alter table public.admin_users enable row level security;
alter table public.profiles enable row level security;
alter table public.site_content enable row level security;
alter table public.projects enable row level security;

-- Drop existing policies safely
drop policy if exists "Only admins read admin_users" on public.admin_users;
drop policy if exists "Only admins manage admin_users" on public.admin_users;

drop policy if exists "Public can read profiles" on public.profiles;
drop policy if exists "Admins manage profiles" on public.profiles;

drop policy if exists "Public can read site content" on public.site_content;
drop policy if exists "Admins manage site content" on public.site_content;

drop policy if exists "Public can read projects" on public.projects;
drop policy if exists "Admins manage projects" on public.projects;

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

create policy "Public can read profiles"
on public.profiles
for select
to public
using (true);

create policy "Admins manage profiles"
on public.profiles
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Public can read site content"
on public.site_content
for select
to public
using (true);

create policy "Admins manage site content"
on public.site_content
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Public can read projects"
on public.projects
for select
to public
using (true);

create policy "Admins manage projects"
on public.projects
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('project-assets', 'project-assets', true)
on conflict (id) do nothing;

drop policy if exists "Public view project images" on storage.objects;
drop policy if exists "Admins manage project images" on storage.objects;
drop policy if exists "Public view project assets" on storage.objects;
drop policy if exists "Admins manage project assets" on storage.objects;

create policy "Public view project images"
on storage.objects
for select
to public
using (bucket_id = 'project-images');

create policy "Admins manage project images"
on storage.objects
for all
to authenticated
using (bucket_id = 'project-images' and public.is_admin())
with check (bucket_id = 'project-images' and public.is_admin());

create policy "Public view project assets"
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

-- Optional starter content. All of this is editable manually by admin later.
insert into public.profiles (full_name, headline, school_info, bio, phone, email, address, social_links)
values (
  'Arkana Kafi',
  'Visual Designer & Creative Student',
  'DKV Student · Metland School',
  'I build bold monochrome visuals, identity systems, and portfolio-grade digital experiences with a clean and deliberate visual rhythm.',
  '+62 812 3456 7890',
  'arkanasupport@gmail.com',
  'Bekasi, Indonesia',
  jsonb_build_object(
    'ig', 'https://instagram.com/arkana',
    'tiktok', 'https://tiktok.com/@arkana',
    'youtube', 'https://youtube.com/@arkana',
    'behance', 'https://behance.net/arkana'
  )
)
on conflict do nothing;

insert into public.site_content (
  hero_badge,
  hero_title,
  hero_subtitle,
  about_title,
  about_body,
  focus_title,
  focus_items,
  portfolio_drive_url,
  contact_title,
  contact_body
)
values (
  'Portfolio / Visual Design',
  'Arkana Kafi crafts minimalist visuals that feel sharp, personal, and memorable.',
  'A portfolio built to present selected works, personal identity, and downloadable project assets in a premium monochrome experience.',
  'About Me',
  'I am focused on building a portfolio that feels intentional, modern, and useful — not only beautiful. Every project is presented to communicate process, taste, and clarity to viewers, clients, or future collaborators.',
  'Creative Focus',
  '["Brand Identity", "Poster & Editorial", "UI / UX Visual Direction", "Motion-ready Presentation"]'::jsonb,
  'https://example.com/portfolio-drive',
  'Let’s build something visually strong.',
  'Open for student collaborations, personal branding work, creative direction experiments, and selected digital design projects.'
)
on conflict do nothing;
