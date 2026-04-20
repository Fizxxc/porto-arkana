import Link from 'next/link';
import type { Profile } from '@/types';

export function Footer({ profile }: { profile: Profile }) {
  const socials = [
    { label: 'Instagram', href: profile.social_links?.ig },
    { label: 'TikTok', href: profile.social_links?.tiktok },
    { label: 'YouTube', href: profile.social_links?.youtube },
    { label: 'Behance', href: profile.social_links?.behance }
  ].filter((item) => Boolean(item.href));

  return (
    <footer className="border-t border-white/10 px-6 py-16 md:px-10">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2 md:items-end">
        <div className="space-y-4">
          <p className="section-label">Support Mail</p>
          <a className="text-2xl tracking-tight text-white transition hover:text-white/75" href="mailto:arkanasupport@gmail.com">
            arkanasupport@gmail.com
          </a>
          <p className="text-sm leading-7 text-white/[0.48]">
            Portfolio ini dibangun untuk presentasi karya, identitas personal, dan akses cepat ke project asset.
          </p>
        </div>

        <div className="space-y-4 md:justify-self-end">
          <p className="section-label">Find Me On</p>
          <div className="flex flex-wrap gap-3">
            {socials.map((social) => (
              <Link
                key={social.label}
                href={social.href!}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/75 transition hover:border-white/25 hover:bg-white/[0.05] hover:text-white"
              >
                {social.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
