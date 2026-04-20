import { fallbackProfile, fallbackProjects, fallbackSiteContent } from '@/lib/seed';
import { createClient } from '@/lib/supabase/server';
import type { Profile, Project, SiteContent } from '@/types';

const hasEnv =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

function toProfile(row: any): Profile {
  return {
    id: row?.id ?? fallbackProfile.id,
    created_at: row?.created_at ?? fallbackProfile.created_at,
    full_name: row?.full_name ?? fallbackProfile.full_name,
    headline: row?.headline ?? fallbackProfile.headline,
    school_info: row?.school_info ?? fallbackProfile.school_info,
    bio: row?.bio ?? fallbackProfile.bio,
    phone: row?.phone ?? fallbackProfile.phone,
    email: row?.email ?? fallbackProfile.email,
    address: row?.address ?? fallbackProfile.address,
    social_links: row?.social_links ?? fallbackProfile.social_links
  };
}

function toSiteContent(row: any): SiteContent {
  return {
    id: row?.id ?? fallbackSiteContent.id,
    created_at: row?.created_at ?? fallbackSiteContent.created_at,
    hero_badge: row?.hero_badge ?? fallbackSiteContent.hero_badge,
    hero_title: row?.hero_title ?? fallbackSiteContent.hero_title,
    hero_subtitle: row?.hero_subtitle ?? fallbackSiteContent.hero_subtitle,
    about_title: row?.about_title ?? fallbackSiteContent.about_title,
    about_body: row?.about_body ?? fallbackSiteContent.about_body,
    focus_title: row?.focus_title ?? fallbackSiteContent.focus_title,
    focus_items: Array.isArray(row?.focus_items) ? row.focus_items : fallbackSiteContent.focus_items,
    portfolio_drive_url: row?.portfolio_drive_url ?? fallbackSiteContent.portfolio_drive_url,
    contact_title: row?.contact_title ?? fallbackSiteContent.contact_title,
    contact_body: row?.contact_body ?? fallbackSiteContent.contact_body
  };
}

function toProject(row: any): Project {
  return {
    id: row?.id ?? crypto.randomUUID(),
    created_at: row?.created_at ?? new Date().toISOString(),
    title: row?.title ?? 'Untitled Project',
    slug: row?.slug ?? 'untitled-project',
    category: row?.category ?? 'Visual Design',
    year: row?.year ?? new Date().getFullYear().toString(),
    client_name: row?.client_name ?? 'Personal Project',
    summary: row?.summary ?? '',
    description: row?.description ?? '',
    cover_url: row?.cover_url ?? row?.image_url ?? '/textures/noir-01.jpg',
    asset_url: row?.asset_url ?? row?.download_link ?? '/textures/noir-01.jpg',
    featured: Boolean(row?.featured)
  };
}

export async function getProfile(): Promise<Profile> {
  try {
    if (!hasEnv) return fallbackProfile;

    const supabase = createClient();
    const { data, error } = await (supabase.from('profiles') as any).select('*').limit(1).single();
    if (error || !data) return fallbackProfile;

    return toProfile(data);
  } catch {
    return fallbackProfile;
  }
}

export async function getSiteContent(): Promise<SiteContent> {
  try {
    if (!hasEnv) return fallbackSiteContent;

    const supabase = createClient();
    const { data, error } = await (supabase.from('site_content') as any).select('*').limit(1).single();
    if (error || !data) return fallbackSiteContent;

    return toSiteContent(data);
  } catch {
    return fallbackSiteContent;
  }
}

export async function getProjects(): Promise<Project[]> {
  try {
    if (!hasEnv) return fallbackProjects;

    const supabase = createClient();
    const { data, error } = await (supabase.from('projects') as any)
      .select('*')
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (error || !Array.isArray(data) || !data.length) return fallbackProjects;
    return data.map(toProject);
  } catch {
    return fallbackProjects;
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    if (!hasEnv) return fallbackProjects.find((item) => item.slug === slug) ?? null;

    const supabase = createClient();
    const { data, error } = await (supabase.from('projects') as any).select('*').eq('slug', slug).single();
    if (error || !data) return fallbackProjects.find((item) => item.slug === slug) ?? null;
    return toProject(data);
  } catch {
    return fallbackProjects.find((item) => item.slug === slug) ?? null;
  }
}