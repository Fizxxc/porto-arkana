import Link from 'next/link';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { DownloadDock } from '@/components/download-dock';
import { Navbar } from '@/components/navbar';
import { InternalBrowser } from '@/components/internal-browser';
import { getProfile, getProjects, getSiteContent } from '@/lib/data';

export default async function HomePage() {
  const [profile, content, projects] = await Promise.all([getProfile(), getSiteContent(), getProjects()]);
  const featured = projects.filter((item) => item.featured).slice(0, 3);
  const others = projects.filter((item) => !item.featured).slice(0, 6);

  return (
    <main className="relative overflow-hidden pb-40">
      <Navbar />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[8%] top-20 h-52 w-52 rounded-full bg-white/[0.045] blur-3xl" />
        <div className="absolute right-[10%] top-[26%] h-72 w-72 rounded-full bg-white/[0.035] blur-3xl" />
        <div className="absolute bottom-[14%] left-[18%] h-64 w-64 rounded-full bg-white/[0.03] blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute left-0 right-0 top-0 h-full bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_28%,transparent_72%,rgba(255,255,255,0.02))]" />
      </div>

      <section id="home" className="mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-6 pt-24 md:px-10">
        <div className="max-w-5xl space-y-10">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs uppercase tracking-[0.28em] text-white/58 backdrop-blur-xl">
            <span className="h-2 w-2 rounded-full bg-white" />
            {content.hero_badge}
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div className="space-y-6">
              <h1 className="max-w-4xl text-5xl font-semibold leading-[0.94] tracking-[-0.085em] text-white md:text-7xl lg:text-[5.25rem]">
                {content.hero_title}
              </h1>
              <p className="max-w-2xl text-base leading-8 text-white/58 md:text-lg">{content.hero_subtitle}</p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
              <p className="section-label">Profile Snapshot</p>
              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-2xl tracking-[-0.05em] text-white">{profile.full_name}</p>
                  <p className="mt-2 text-sm text-white/55">{profile.headline}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.3rem] border border-white/10 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.28em] text-white/38">School</p>
                    <p className="mt-3 text-sm leading-6 text-white/72">{profile.school_info}</p>
                  </div>
                  <div className="rounded-[1.3rem] border border-white/10 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.28em] text-white/38">Location</p>
                    <p className="mt-3 text-sm leading-6 text-white/72">{profile.address}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="#works" className="inline-flex items-center gap-2 rounded-full border border-white bg-white px-6 py-3 text-sm font-medium text-black transition hover:opacity-85">
              Explore Works
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <InternalBrowser url={content.portfolio_drive_url} label="Open Portfolio Install" />
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto w-full max-w-7xl px-6 py-8 md:px-10 md:py-16">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2.4rem] border border-white/10 bg-white/[0.03] p-7 backdrop-blur-xl">
            <p className="section-label">{content.about_title}</p>
            <h2 className="mt-4 text-4xl tracking-[-0.07em] text-white md:text-5xl">About And Details Me.</h2>
          </div>

          <div className="rounded-[2.4rem] border border-white/10 bg-black/30 p-7 backdrop-blur-xl">
            <p className="text-base leading-8 text-white/64">{content.about_body}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {content.about_highlights.map((item) => (
                <span key={item} className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/72">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-[2.4rem] border border-white/10 bg-white/[0.03] p-7 backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="section-label">{content.focus_title}</p>
              <h3 className="mt-3 text-3xl tracking-[-0.06em] text-white">Software stack with manual icon support.</h3>
            </div>
            <div className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/56">{content.software_stack.length} tools curated</div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {content.software_stack.map((item) => (
              <div key={item.name} className="group rounded-[1.6rem] border border-white/10 bg-black/30 p-5 transition hover:border-white/20 hover:bg-white/[0.04]">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[1.2rem] border border-white/10 bg-white/[0.04]">
                    {item.icon_url ? <img src={item.icon_url} alt={item.name} className="h-8 w-8 object-contain opacity-90 grayscale" /> : <Sparkles className="h-5 w-5 text-white/76" />}
                  </div>
                  <div>
                    <p className="text-base tracking-[-0.03em] text-white">{item.name}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.24em] text-white/35">software</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="works" className="mx-auto w-full max-w-7xl px-6 py-10 md:px-10 md:py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="section-label">Selected Works</p>
            <h2 className="mt-3 text-4xl tracking-[-0.08em] text-white md:text-5xl">My Personal Project.</h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-white/55">Melalui project ini, saya fokus pada penyajian detail karya yang lebih mendalam. Saya menyertakan fitur proteksi pada pratinjau aset serta penyematan author credit pada setiap hasil unduhan sebagai bentuk perlindungan hak cipta.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {featured.map((project) => (
            <Link key={project.id} href={`/project/${project.slug}`} className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] backdrop-blur-xl transition hover:border-white/20 hover:bg-white/[0.05]">
              <div className="relative aspect-[4/5] overflow-hidden border-b border-white/10">
                <img src={project.cover_url} alt={project.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.34))]" />
              </div>
              <div className="space-y-4 p-6">
                <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.24em] text-white/35">
                  <span>{project.category}</span>
                  <span>{project.year}</span>
                </div>
                <div>
                  <h3 className="text-2xl tracking-[-0.05em] text-white">{project.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/58">{project.summary}</p>
                </div>
                <div className="inline-flex items-center gap-2 text-sm text-white/70">
                  View Project <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {others.map((project) => (
            <Link key={project.id} href={`/project/${project.slug}`} className="rounded-[1.8rem] border border-white/10 bg-black/20 p-5 transition hover:border-white/20 hover:bg-white/[0.04]">
              <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.24em] text-white/35">
                <span>{project.category}</span>
                <span>{project.year}</span>
              </div>
              <h3 className="mt-6 text-xl tracking-[-0.04em] text-white">{project.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/56">{project.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="contact" className="mx-auto w-full max-w-7xl px-6 py-10 md:px-10 md:py-16">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-[2.4rem] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
            <p className="section-label">Contact</p>
            <h2 className="mt-4 text-4xl tracking-[-0.07em] text-white md:text-5xl">{content.contact_title}</h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/58">{content.contact_body}</p>
          </div>

          <div className="rounded-[2.4rem] border border-white/10 bg-black/25 p-8">
            <p className="section-label">Find Me On</p>
            <div className="mt-6 space-y-3 text-sm text-white/70">
              {Object.entries(profile.social_links).map(([label, href]) =>
                href ? (
                  <a key={label} href={href} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-[1.2rem] border border-white/10 px-4 py-4 transition hover:border-white/20 hover:bg-white/[0.04]">
                    <span className="uppercase tracking-[0.22em] text-white/45">{label}</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                ) : null
              )}
            </div>
            <div className="mt-6 rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-4 text-sm text-white/58">
              Support mail: <span className="text-white">arkanasupport@gmail.com</span>
            </div>
          </div>
        </div>
      </section>

      <DownloadDock />
    </main>
  );
}
