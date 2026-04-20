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
  focus_title: 'Creative Focus',
  focus_items: ['Brand Identity', 'Poster & Editorial', 'UI / UX Visual Direction', 'Motion-ready Presentation'],
  portfolio_drive_url: 'https://example.com/portfolio-drive',
  contact_title: 'Let’s build something visually strong.',
  contact_body:
    'Open for student collaborations, personal branding work, creative direction experiments, and selected digital design projects.'
};

export const fallbackProjects: Project[] = [
  {
    id: '1',
    created_at: new Date().toISOString(),
    title: 'Noir Identity System',
    slug: 'noir-identity-system',
    summary: 'Brand identity study with crisp monochrome balance.',
    description:
      'A premium identity exploration focused on high contrast, editorial spacing, and refined layout systems for a fictional fashion-facing label.',
    cover_url: '/textures/noir-01.jpg',
    asset_url: '/textures/noir-01.jpg',
    category: 'Branding',
    year: '2025',
    client_name: 'Concept Project',
    featured: true
  },
  {
    id: '2',
    created_at: new Date().toISOString(),
    title: 'Frame of Silence',
    slug: 'frame-of-silence',
    summary: 'Poster and photography layout direction.',
    description:
      'A poster-focused project combining cinematic stills, typography rhythm, and white-space-led storytelling for a gallery style visual narrative.',
    cover_url: '/textures/noir-02.jpg',
    asset_url: '/textures/noir-02.jpg',
    category: 'Editorial',
    year: '2025',
    client_name: 'Personal Work',
    featured: true
  },
  {
    id: '3',
    created_at: new Date().toISOString(),
    title: 'Obsidian Interface',
    slug: 'obsidian-interface',
    summary: 'Luxury dashboard concept with motion-first UI.',
    description:
      'A dark luxury digital product concept designed to present interface confidence, hierarchy control, and premium interaction pacing.',
    cover_url: '/textures/noir-03.jpg',
    asset_url: '/textures/noir-03.jpg',
    category: 'UI/UX',
    year: '2025',
    client_name: 'Concept Project',
    featured: false
  },
  {
    id: '4',
    created_at: new Date().toISOString(),
    title: 'Atlas Social Frames',
    slug: 'atlas-social-frames',
    summary: 'Campaign visuals for social media presentation.',
    description:
      'A social campaign visual exploration combining bold type, monochrome photography, and modular layouts for social-first publication.',
    cover_url: '/textures/noir-04.jpg',
    asset_url: '/textures/noir-04.jpg',
    category: 'Campaign',
    year: '2025',
    client_name: 'Personal Work',
    featured: false
  }
];
