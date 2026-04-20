import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Download, Mail } from 'lucide-react';
import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { ProjectGrid } from '@/components/project-grid';
import { Reveal } from '@/components/reveal';
import { SectionHeading } from '@/components/section-heading';
import { getProfile, getProjects, getSiteContent } from '@/lib/data';

export default async function HomePage() {
  const [profile, content, projects] = await Promise.all([getProfile(), getSiteContent(), getProjects()]);
  const featured = projects.filter((item) => item.featured).length ? projects.filter((item) => item.featured) : projects.slice(0, 3);

  return (
    <main id="top" className="relative overflow-hidden pb-32">
      <div className="pointer-events-none absolute inset-0 noise-mask opacity-[0.06]" />

      <section className="section-shell relative min-h-screen pt-8">
        <div className="grid gap-10 pb-20 pt-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:pt-24">
          <Reveal>
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-ui text-[11px] uppercase tracking-[0.24em] text-white/60">
                {content.hero_badge}
              </div>

              <div className="space-y-6">
                <p className="section-label">{profile.headline}</p>
                <h1 className="max-w-5xl text-balance text-5xl leading-[0.92] tracking-[-0.08em] text-white md:text-7xl xl:text-[7.6rem]">
                  {content.hero_title}
                </h1>
                <p className="max-w-2xl text-balance text-base leading-8 text-white/[0.58] md:text-lg">
                  {content.hero_subtitle}
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link href="#works" className="inline-flex items-center gap-2 rounded-full border border-white bg-white px-6 py-3 text-sm font-medium text-black transition hover:opacity-85">
                  See Projects
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href={content.portfolio_drive_url || '#'} target="_blank" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-sm text-white/80 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white">
                  Download Portfolio
                  <Download className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="glass-panel overflow-hidden rounded-[2rem] p-4 md:translate-y-12">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem]">
                  <Image src={featured[0]?.cover_url ?? '/textures/noir-01.jpg'} alt={featured[0]?.title ?? 'Featured'} fill className="object-cover grayscale" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="glass-panel rounded-[2rem] p-6">
                  <p className="section-label">Identity</p>
                  <h2 className="mt-5 text-3xl tracking-[-0.05em] text-white">{profile.full_name}</h2>
                  <p className="mt-3 text-sm leading-7 text-white/[0.55]">{profile.school_info}</p>
                </div>
                <div className="glass-panel rounded-[2rem] p-6">
                  <p className="section-label">Direct Contact</p>
                  <div className="mt-5 space-y-2 text-white/80">
                    <p>{profile.email}</p>
                    <p className="text-sm text-white/[0.55]">{profile.phone}</p>
                    <p className="text-sm text-white/[0.55]">{profile.address}</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="about" className="section-shell py-24">
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <SectionHeading label="About" title={content.about_title} />
            <div className="space-y-8 rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
              <p className="text-base leading-8 text-white/60 md:text-lg">{content.about_body}</p>
              <div className="grid gap-4 md:grid-cols-2">
                {content.focus_items.map((item) => (
                  <div key={item} className="rounded-[1.25rem] border border-white/10 bg-black/40 px-4 py-4 text-sm text-white/75">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="section-shell py-8">
        <Reveal>
          <div className="rounded-[2.2rem] border border-white/10 bg-white/[0.03] p-8 md:p-10">
            <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-end">
              <SectionHeading label="Focus" title={content.focus_title} />
              <div className="grid gap-4 md:grid-cols-2">
                {content.focus_items.map((item, index) => (
                  <div key={item} className="rounded-[1.5rem] border border-white/10 p-5">
                    <p className="section-label">0{index + 1}</p>
                    <h3 className="mt-3 text-lg tracking-[-0.04em] text-white">{item}</h3>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section id="works" className="section-shell py-24">
        <Reveal>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <SectionHeading label="Selected Works" title="A portfolio that looks and feels like curated work." body="Setiap project diarahkan agar terasa seperti karya portfolio: visual kuat, ringkas, dan mudah dipreview atau diunduh oleh pengunjung." />
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <ProjectGrid projects={projects} />
        </Reveal>
      </section>

      <section id="contact" className="section-shell py-20">
        <Reveal>
          <div className="rounded-[2.2rem] border border-white/10 bg-white/[0.03] p-8 md:p-10">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="space-y-4">
                <SectionHeading label="Contact" title={content.contact_title} body={content.contact_body} />
              </div>
              <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-2 rounded-full border border-white bg-white px-6 py-3 text-sm font-medium text-black transition hover:opacity-85">
                Email Me
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      <Footer profile={profile} />
      <Navbar />
    </main>
  );
}
