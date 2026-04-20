export type SocialLinks = {
  ig?: string;
  tiktok?: string;
  youtube?: string;
  github?: string;
  behance?: string;
};

export type Project = {
  id: string;
  created_at: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  category: string;
  year: string;
  client_name: string;
  cover_url: string;
  asset_url: string;
  featured: boolean;
};

export type Profile = {
  id: string;
  created_at?: string;
  full_name: string;
  headline: string;
  school_info: string;
  bio: string;
  phone: string;
  email: string;
  address: string;
  social_links: SocialLinks;
};

export type SiteContent = {
  id: string;
  created_at?: string;
  hero_badge: string;
  hero_title: string;
  hero_subtitle: string;
  about_title: string;
  about_body: string;
  focus_title: string;
  focus_items: string[];
  portfolio_drive_url: string;
  contact_title: string;
  contact_body: string;
};
