import Image from 'next/image';
import Link from 'next/link';
import { MoveLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import { DownloadDock } from '@/components/download-dock';
import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { ProjectGrid } from '@/components/project-grid';
import { Reveal } from '@/components/reveal';
import { SectionHeading } from '@/components/section-heading';
import { getProfile, getProjectBySlug, getProjects } from '@/lib/data';

type Props = {
  params: { slug: string };
};

export default async function ProjectPage({ params }: Props) {
  const [profile, project, projects] = await Promise.all([getProfile(), getProjectBySlug(params.slug), getProjects()]);

  if (!project) notFound();

  const others = projects.filter((item) => item.slug !== project.slug).slice(0, 3);

  return (
    <main className="pb-32">
      <section className="section-shell pt-10">
        <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/[0.65] transition hover:border-white/20 hover:bg-white/[0.04] hover:text-white">
          <MoveLeft className="h-4 w-4" />
          Back to Portfolio
        </Link>
      </section>

      <section className="section-shell py-12">
        <div className="grid gap-10 lg:grid-cols-[1.04fr_0.96fr] lg:items-start">
          <Reveal>
            <div className="relative min-h-[540px] overflow-hidden rounded-[2rem] border border-white/10">
              <Image src={project.cover_url} alt={project.title} fill className="object-cover grayscale" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" />
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="section-label">{project.category} / {project.year}</p>
                <h1 className="text-5xl leading-[0.94] tracking-[-0.08em] md:text-6xl">{project.title}</h1>
                <p className="max-w-xl text-sm leading-8 text-white/[0.58] md:text-base">{project.description}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-5">
                  <p className="section-label">Client / Type</p>
                  <p className="mt-3 text-lg text-white/[0.85]">{project.client_name}</p>
                </div>
                <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-5">
                  <p className="section-label">Quick Summary</p>
                  <p className="mt-3 text-sm leading-7 text-white/60">{project.summary}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <DownloadDock slug={project.slug} title={project.title} />
                <a href={project.asset_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-sm text-white/80 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white">
                  Preview Asset
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-shell py-20">
        <Reveal>
          <SectionHeading label="Other Creative Works" title="Continue exploring the portfolio." body="Setelah membuka satu karya, user bisa langsung lanjut ke karya lain tanpa putus alur eksplorasi." />
        </Reveal>
        <div className="mt-10">
          <ProjectGrid projects={others} />
        </div>
      </section>

      <Footer profile={profile} />
      <Navbar />
    </main>
  );
}
