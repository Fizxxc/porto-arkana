create extension if not exists pgcrypto;

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

create table if not exists public.site_content (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  hero_badge text not null,
  hero_title text not null,
  hero_subtitle text not null,
  about_title text not null,
  about_body text not null,
  about_highlights jsonb not null default '[]'::jsonb,
  focus_title text not null,
  focus_items jsonb not null default '[]'::jsonb,
  software_stack jsonb not null default '[]'::jsonb,
  portfolio_drive_url text not null default '',
  contact_title text not null,
  contact_body text not null
);

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
  cover_label text not null default 'Image 1 · Cover preview',
  asset_label text not null default 'Image 2 · Downloadable asset',
  gallery jsonb not null default '[]'::jsonb,
  featured boolean not null default false
);

create table if not exists public.admin_users (
  user_id uuid primary key,
  created_at timestamptz not null default now()
);

create table if not exists public.security_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  event_type text not null,
  ip_address text not null default 'unknown',
  user_agent text not null default 'unknown',
  project_slug text,
  metadata jsonb not null default '{}'::jsonb
);

alter table public.site_content add column if not exists about_highlights jsonb not null default '[]'::jsonb;
alter table public.site_content add column if not exists software_stack jsonb not null default '[]'::jsonb;
alter table public.projects add column if not exists cover_label text not null default 'Image 1 · Cover preview';
alter table public.projects add column if not exists asset_label text not null default 'Image 2 · Downloadable asset';
alter table public.projects add column if not exists gallery jsonb not null default '[]'::jsonb;

alter table public.profiles enable row level security;
alter table public.site_content enable row level security;
alter table public.projects enable row level security;
alter table public.admin_users enable row level security;
alter table public.security_events enable row level security;

do $$ begin
  create policy "public read profiles" on public.profiles for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "public read site content" on public.site_content for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "public read projects" on public.projects for select using (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "admins manage profiles" on public.profiles for all using (exists (select 1 from public.admin_users a where a.user_id = auth.uid())) with check (exists (select 1 from public.admin_users a where a.user_id = auth.uid()));
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "admins manage site content" on public.site_content for all using (exists (select 1 from public.admin_users a where a.user_id = auth.uid())) with check (exists (select 1 from public.admin_users a where a.user_id = auth.uid()));
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "admins manage projects" on public.projects for all using (exists (select 1 from public.admin_users a where a.user_id = auth.uid())) with check (exists (select 1 from public.admin_users a where a.user_id = auth.uid()));
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "admins read admin users" on public.admin_users for select using (exists (select 1 from public.admin_users a where a.user_id = auth.uid()));
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "admins manage security events" on public.security_events for select using (exists (select 1 from public.admin_users a where a.user_id = auth.uid()));
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "service insert security events" on public.security_events for insert with check (true);
exception when duplicate_object then null; end $$;

insert into public.profiles (full_name, headline, school_info, bio, phone, email, address, social_links)
select
  'Arkana Kafi',
  'Visual Designer & Creative Student',
  'DKV Student · Metland School',
  'A minimalist monochrome portfolio builder focused on identity, editorial, and premium interface presentation.',
  '+62 812 3456 7890',
  'arkanasupport@gmail.com',
  'Bekasi, Indonesia',
  jsonb_build_object(
    'ig', 'https://instagram.com/arkana',
    'tiktok', 'https://tiktok.com/@arkana',
    'youtube', 'https://youtube.com/@arkana',
    'behance', 'https://behance.net/arkana'
  )
where not exists (select 1 from public.profiles);

insert into public.site_content (
  hero_badge,
  hero_title,
  hero_subtitle,
  about_title,
  about_body,
  about_highlights,
  focus_title,
  focus_items,
  software_stack,
  portfolio_drive_url,
  contact_title,
  contact_body
)
select
  'Portfolio / Visual Design',
  'Arkana Kafi crafts minimalist visuals that feel sharp, personal, and memorable.',
  'A portfolio built to present selected works, personal identity, and downloadable project assets in a premium monochrome experience.',
  'About Me',
  'I am focused on building a portfolio that feels intentional, modern, and useful — not only beautiful. Every project is presented to communicate process, taste, and clarity to viewers, clients, or future collaborators.',
  '["Brand Identity","Poster & Editorial","UI / UX Visual Direction"]'::jsonb,
  'Software I Use',
  '["Figma","Adobe Photoshop","Adobe Lightroom"]'::jsonb,
  '[{"name":"Figma","icon_url":"https://cdn.simpleicons.org/figma/ffffff"},{"name":"Adobe Photoshop","icon_url":"https://cdn.simpleicons.org/adobephotoshop/ffffff"},{"name":"Adobe Lightroom","icon_url":"https://cdn.simpleicons.org/adobelightroomclassic/ffffff"}]'::jsonb,
  'https://example.com/portfolio-drive',
  'Let’s build something visually strong.',
  'Open for student collaborations, personal branding work, creative direction experiments, and selected digital design projects.'
where not exists (select 1 from public.site_content);

insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('project-assets', 'project-assets', true)
on conflict (id) do nothing;


do $$ begin
  create policy "public read project-images" on storage.objects for select using (bucket_id = 'project-images');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "public read project-assets" on storage.objects for select using (bucket_id = 'project-assets');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "admins manage project-images" on storage.objects for all using (bucket_id = 'project-images' and exists (select 1 from public.admin_users a where a.user_id = auth.uid())) with check (bucket_id = 'project-images' and exists (select 1 from public.admin_users a where a.user_id = auth.uid()));
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "admins manage project-assets" on storage.objects for all using (bucket_id = 'project-assets' and exists (select 1 from public.admin_users a where a.user_id = auth.uid())) with check (bucket_id = 'project-assets' and exists (select 1 from public.admin_users a where a.user_id = auth.uid()));
exception when duplicate_object then null; end $$;
