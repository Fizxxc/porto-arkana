'use client';

import { useMemo, useState } from 'react';
import { AiPromptAssist } from '@/components/admin/ai-prompt-assist';
import { createClient } from '@/lib/supabase/browser';
import type { SiteContent } from '@/types';

export function ContentForm({ content }: { content: SiteContent }) {
  const supabase = useMemo(() => createClient(), []);
  const [form, setForm] = useState(content);
  const [status, setStatus] = useState('Idle');

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus('Saving landing content...');

    const { error } = await (supabase.from('site_content') as any).upsert({
      id: form.id,
      hero_badge: form.hero_badge,
      hero_title: form.hero_title,
      hero_subtitle: form.hero_subtitle,
      about_title: form.about_title,
      about_body: form.about_body,
      focus_title: form.focus_title,
      focus_items: form.focus_items,
      portfolio_drive_url: form.portfolio_drive_url,
      contact_title: form.contact_title,
      contact_body: form.contact_body
    });

    if (error) return setStatus(error.message);
    setStatus('Landing content updated.');
  };

  return (
    <form onSubmit={save} className="space-y-5 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 lg:col-span-2">
      <div className="space-y-1">
        <p className="section-label">Landing Content</p>
        <h3 className="text-2xl tracking-tighter text-white">Manual Hero, About & CTA</h3>
      </div>

      <input className="input-shell" value={form.hero_badge} onChange={(e) => setForm((p) => ({ ...p, hero_badge: e.target.value }))} placeholder="Hero badge" />
      <textarea className="input-shell min-h-[120px]" value={form.hero_title} onChange={(e) => setForm((p) => ({ ...p, hero_title: e.target.value }))} placeholder="Hero title" />
      <textarea className="input-shell min-h-[120px]" value={form.hero_subtitle} onChange={(e) => setForm((p) => ({ ...p, hero_subtitle: e.target.value }))} placeholder="Hero subtitle" />
      <input className="input-shell" value={form.about_title} onChange={(e) => setForm((p) => ({ ...p, about_title: e.target.value }))} placeholder="About title" />

      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-white/72">About body</p>
          <AiPromptAssist
            kind="about"
            label="About"
            context={{
              full_name: 'Arkana Kafi',
              hero_title: form.hero_title,
              hero_subtitle: form.hero_subtitle,
              about_title: form.about_title,
              focus_items: form.focus_items
            }}
            onApply={(value) => setForm((p) => ({ ...p, about_body: value }))}
          />
        </div>
        <textarea className="input-shell min-h-[150px]" value={form.about_body} onChange={(e) => setForm((p) => ({ ...p, about_body: e.target.value }))} placeholder="About body" />
      </div>

      <input className="input-shell" value={form.focus_title} onChange={(e) => setForm((p) => ({ ...p, focus_title: e.target.value }))} placeholder="Focus title" />
      <textarea
        className="input-shell min-h-[120px]"
        value={form.focus_items.join('\n')}
        onChange={(e) =>
          setForm((p) => ({
            ...p,
            focus_items: e.target.value
              .split('\n')
              .map((item) => item.trim())
              .filter(Boolean)
          }))
        }
        placeholder="One focus item per line"
      />
      <input className="input-shell" value={form.portfolio_drive_url} onChange={(e) => setForm((p) => ({ ...p, portfolio_drive_url: e.target.value }))} placeholder="Portfolio / drive URL" />
      <input className="input-shell" value={form.contact_title} onChange={(e) => setForm((p) => ({ ...p, contact_title: e.target.value }))} placeholder="Contact title" />
      <textarea className="input-shell min-h-[120px]" value={form.contact_body} onChange={(e) => setForm((p) => ({ ...p, contact_body: e.target.value }))} placeholder="Contact body" />

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="rounded-full border border-white bg-white px-5 py-3 text-sm font-medium text-black transition hover:opacity-85">
          Save Landing Content
        </button>
        <p className="text-sm text-white/[0.55]">{status}</p>
      </div>
    </form>
  );
}
