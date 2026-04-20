'use client';

import { useMemo, useState } from 'react';
import { AiPromptAssist } from '@/components/admin/ai-prompt-assist';
import { createClient } from '@/lib/supabase/browser';
import { slugify } from '@/lib/utils';

type State = {
  title: string;
  slug: string;
  summary: string;
  description: string;
  category: string;
  year: string;
  client_name: string;
  featured: boolean;
  cover: File | null;
  asset: File | null;
};

const initialState: State = {
  title: '',
  slug: '',
  summary: '',
  description: '',
  category: '',
  year: '',
  client_name: '',
  featured: false,
  cover: null,
  asset: null
};

export function ProjectForm() {
  const supabase = useMemo(() => createClient(), []);
  const [form, setForm] = useState<State>(initialState);
  const [status, setStatus] = useState('Idle');

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus('Uploading project files...');

    const slug = slugify(form.slug || form.title);
    let coverUrl = '/textures/noir-01.jpg';
    let assetUrl = coverUrl;

    if (form.cover) {
      const ext = form.cover.name.split('.').pop();
      const fileName = `${Date.now()}-${slug}-cover.${ext}`;
      const { error } = await supabase.storage.from('project-images').upload(fileName, form.cover, { upsert: true });
      if (error) return setStatus(error.message);
      coverUrl = supabase.storage.from('project-images').getPublicUrl(fileName).data.publicUrl;
      assetUrl = coverUrl;
    }

    if (form.asset) {
      const ext = form.asset.name.split('.').pop();
      const fileName = `${Date.now()}-${slug}-asset.${ext}`;
      const { error } = await supabase.storage.from('project-assets').upload(fileName, form.asset, { upsert: true });
      if (error) return setStatus(error.message);
      assetUrl = supabase.storage.from('project-assets').getPublicUrl(fileName).data.publicUrl;
    }

    const { error } = await (supabase.from('projects') as any).insert({
      title: form.title,
      slug,
      summary: form.summary,
      description: form.description,
      category: form.category,
      year: form.year,
      client_name: form.client_name,
      cover_url: coverUrl,
      asset_url: assetUrl,
      image_url: coverUrl,
      download_link: assetUrl,
      featured: form.featured
    });

    if (error) return setStatus(error.message);

    setForm(initialState);
    setStatus('Project berhasil disimpan.');
  };

  return (
    <form onSubmit={save} className="space-y-5 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
      <div className="space-y-1">
        <p className="section-label">Project Manager</p>
        <h3 className="text-2xl tracking-tighter text-white">Manual Project Input</h3>
      </div>

      <input className="input-shell" placeholder="Project title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value, slug: slugify(e.target.value) }))} required />
      <input className="input-shell" placeholder="Slug" value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: slugify(e.target.value) }))} required />

      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-white/72">Short summary</p>
          <AiPromptAssist
            kind="project_summary"
            label="Summary"
            context={{ title: form.title, category: form.category, year: form.year, client_name: form.client_name }}
            onApply={(value) => setForm((p) => ({ ...p, summary: value }))}
          />
        </div>
        <input className="input-shell" placeholder="Short summary" value={form.summary} onChange={(e) => setForm((p) => ({ ...p, summary: e.target.value }))} required />
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-white/72">Project description</p>
          <AiPromptAssist
            kind="project_description"
            label="Description"
            context={{
              title: form.title,
              category: form.category,
              year: form.year,
              client_name: form.client_name,
              summary: form.summary
            }}
            onApply={(value) => setForm((p) => ({ ...p, description: value }))}
          />
        </div>
        <textarea className="input-shell min-h-[180px]" placeholder="Project description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} required />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <input className="input-shell" placeholder="Category" value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} required />
        <input className="input-shell" placeholder="Year" value={form.year} onChange={(e) => setForm((p) => ({ ...p, year: e.target.value }))} required />
        <input className="input-shell" placeholder="Client / Project type" value={form.client_name} onChange={(e) => setForm((p) => ({ ...p, client_name: e.target.value }))} required />
      </div>

      <label className="flex items-center gap-3 rounded-2xl border border-white/10 px-4 py-3 text-sm text-white/75">
        <input type="checkbox" checked={form.featured} onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))} />
        Featured project
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <input className="input-shell file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-black" type="file" accept="image/*" onChange={(e) => setForm((p) => ({ ...p, cover: e.target.files?.[0] ?? null }))} required />
        <input className="input-shell file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-black" type="file" onChange={(e) => setForm((p) => ({ ...p, asset: e.target.files?.[0] ?? null }))} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="rounded-full border border-white bg-white px-5 py-3 text-sm font-medium text-black transition hover:opacity-85">
          Save Project
        </button>
        <p className="text-sm text-white/[0.55]">{status}</p>
      </div>
    </form>
  );
}
