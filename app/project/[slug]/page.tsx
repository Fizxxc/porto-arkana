import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, FolderOpenDot } from 'lucide-react';
import { DownloadLink } from '@/components/download-link';
import { ProtectedAssetPreview } from '@/components/protected-asset-preview';
import { getProjectBySlug, getProjects } from '@/lib/data';

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug);
  if (!project) notFound();

  const otherProjects = (await getProjects()).filter((item) => item.slug !== project.slug).slice(0, 6);

  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-12 md:px-10 md:py-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[6%] top-16 h-48 w-48 rounded-full bg-white/[0.04] blur-3xl" />
        <div className="absolute bottom-[14%] right-[10%] h-60 w-60 rounded-full bg-white/[0.03] blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl space-y-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-white/75 transition hover:border-white/20 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/45">
            <span>{project.category}</span>
            <span>·</span>
            <span>{project.year}</span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.06fr_0.94fr] lg:items-start">
          <div className="space-y-6">
            <p className="section-label">Project Detail</p>
            <h1 className="text-5xl tracking-[-0.08em] text-white md:text-7xl">{project.title}</h1>
            <p className="max-w-2xl text-base leading-8 text-white/58">{project.description}</p>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-white/35">Category</p>
                <p className="mt-3 text-sm text-white/72">{project.category}</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-white/35">Year</p>
                <p className="mt-3 text-sm text-white/72">{project.year}</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-white/35">Client</p>
                <p className="mt-3 text-sm text-white/72">{project.client_name}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <DownloadLink href={`/api/projects/${project.slug}/download`} />
              <ProtectedAssetPreview slug={project.slug} title={project.title} items={project.gallery} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="overflow-hidden rounded-[2.2rem] border border-white/10 bg-white/[0.03]">
              <div className="relative aspect-[4/5] overflow-hidden">
                <img src={project.cover_url} alt={project.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.28))]" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {project.gallery.slice(0, 2).map((item, index) => (
                <div key={`${item.url}-${index}`} className="rounded-[1.6rem] border border-white/10 bg-black/20 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/35">Image {index + 1}</p>
                  <p className="mt-3 text-sm leading-7 text-white/72">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {project.gallery.length > 0 ? (
          <section className="space-y-5 rounded-[2.2rem] border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center gap-3">
              <FolderOpenDot className="h-4 w-4 text-white/75" />
              <p className="section-label">Preview Sequence</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {project.gallery.map((item, index) => (
                <div key={`${item.url}-${index}`} className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-black/25">
                  <div className="aspect-[4/3] overflow-hidden border-b border-white/10 bg-black">
                    <img src={item.url} alt={item.label} className="h-full w-full object-cover" />
                  </div>
                  <div className="p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-white/35">Preview {index + 1}</p>
                    <p className="mt-3 text-sm leading-7 text-white/70">{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="space-y-5 pt-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="section-label">Other Creative Works</p>
              <h2 className="mt-3 text-4xl tracking-[-0.07em] text-white">Continue exploring the portfolio loop.</h2>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {otherProjects.map((item) => (
              <Link key={item.id} href={`/project/${item.slug}`} className="rounded-[1.8rem] border border-white/10 bg-white/[0.03] p-5 transition hover:border-white/20 hover:bg-white/[0.05]">
                <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.24em] text-white/35">
                  <span>{item.category}</span>
                  <ArrowUpRight className="h-4 w-4" />
                </div>
                <h3 className="mt-6 text-2xl tracking-[-0.05em] text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/56">{item.summary}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
