import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '@/types';

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/project/${project.slug}`}
      className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] transition duration-500 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05]"
    >
      <div className="relative aspect-[5/6] overflow-hidden">
        <Image src={project.cover_url} alt={project.title} fill className="object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" />
        <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-white/75 backdrop-blur-md">
          {project.category}
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <h3 className="text-2xl leading-tight tracking-[-0.05em] text-white">{project.title}</h3>
          <p className="text-sm leading-7 text-white/[0.55]">{project.summary}</p>
        </div>

        <div className="flex items-center justify-between text-white/50">
          <span className="text-xs uppercase tracking-[0.24em]">{project.year}</span>
          <span className="rounded-full border border-white/10 p-3 transition group-hover:border-white/25 group-hover:text-white">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
