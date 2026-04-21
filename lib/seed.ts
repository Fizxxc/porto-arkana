import type { Profile, Project, SiteContent } from '@/types';

export const fallbackProfile: Profile = {
  id: '00000000-0000-0000-0000-000000000001',
  full_name: 'Arkana Kafi',
  headline: 'Visual Designer & Creative Student',
  school_info: 'DKV Student · Metland School',
  bio: 'I build bold monochrome visuals, identity systems, and portfolio-grade digital experiences with a clean and deliberate visual rhythm.',
  phone: '+62 812 3456 7890',
  email: 'arkanasupport@gmail.com',
  address: 'Bekasi, Indonesia',
  social_links: {
    ig: 'https://instagram.com/arkana',
    tiktok: 'https://tiktok.com/@arkana',
    youtube: 'https://youtube.com/@arkana',
    behance: 'https://behance.net/arkana'
  }
};

export const fallbackSiteContent: SiteContent = {
  id: '00000000-0000-0000-0000-000000000002',
  hero_badge: 'Portfolio / Visual Design',
  hero_title: 'Arkana Kafi crafts minimalist visuals that feel sharp, personal, and memorable.',
  hero_subtitle:
    'A portfolio built to present selected works, personal identity, and downloadable project assets in a premium monochrome experience.',
  about_title: 'About Me',
  about_body:
    'I am focused on building a portfolio that feels intentional, modern, and useful — not only beautiful. Every project is presented to communicate process, taste, and clarity to viewers, clients, or future collaborators.',
  about_highlights: ['Brand Identity', 'Poster & Editorial', 'UI / UX Visual Direction'],
  focus_title: 'Software I Use',
  focus_items: ['Figma', 'Adobe Photoshop', 'Adobe Lightroom'],
  software_stack: [
    { name: 'Figma', icon_url: 'https://cdn.simpleicons.org/figma/ffffff' },
    { name: 'Adobe Photoshop', icon_url: 'https://cdn.simpleicons.org/adobephotoshop/ffffff' },
    { name: 'Adobe Lightroom', icon_url: 'https://cdn.simpleicons.org/adobelightroomclassic/ffffff' }
  ],
  portfolio_drive_url: 'https://example.com/portfolio-drive',
  contact_title: 'Let’s build something visually strong.',
  contact_body:
    'Open for student collaborations, personal branding work, creative direction experiments, and selected digital design projects.'
};

export const fallbackProjects: Project[] = [];
