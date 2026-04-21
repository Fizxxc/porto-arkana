'use client';

import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { Eye, Maximize2, Minus, Plus, Shield, X } from 'lucide-react';
import { type MouseEvent, useEffect, useMemo, useState } from 'react';
import type { GalleryItem } from '@/types';
import { isImageAsset } from '@/lib/utils';

type ProtectedAssetPreviewProps = {
  slug: string;
  title: string;
  items: GalleryItem[];
};

function useSecurityReporter(projectSlug: string) {
  return async (eventType: string, metadata?: Record<string, unknown>) => {
    try {
      await fetch('/api/security/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType, projectSlug, metadata })
      });
    } catch {
      // best effort
    }
  };
}

export function ProtectedAssetPreview({ slug, title, items }: ProtectedAssetPreviewProps) {
  const imageItems = useMemo(() => items.filter((item) => isImageAsset(item.url)), [items]);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [notice, setNotice] = useState('');
  const report = useSecurityReporter(slug);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = async (event: KeyboardEvent) => {
      if (event.key === 'PrintScreen') {
        event.preventDefault();
        setNotice('Protected preview aktif. Screenshot tidak bisa dijamin diblokir di semua device, jadi watermark selalu ditampilkan.');
        await report('printscreen_key', { key: event.key, title });
      }

      if ((event.ctrlKey || event.metaKey) && ['s', 'u', 'p'].includes(event.key.toLowerCase())) {
        event.preventDefault();
        setNotice('Aksi ini dibatasi pada protected preview.');
        await report('shortcut_blocked', { key: event.key.toLowerCase(), title });
      }

      if (event.key === 'F12' || ((event.ctrlKey || event.metaKey) && event.shiftKey && ['i', 'j', 'c'].includes(event.key.toLowerCase()))) {
        event.preventDefault();
        setNotice('Developer tools shortcut terdeteksi dan dilog ke admin.');
        await report('devtools_shortcut', { key: event.key.toLowerCase(), title });
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, report, title]);

  if (!imageItems.length) return null;

  const active = imageItems[index] ?? imageItems[0];
  const previewUrl = `/api/projects/${slug}/preview?src=${encodeURIComponent(active.url)}`;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setIndex(0);
          setZoom(1);
          setNotice('');
        }}
        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-white/80 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
      >
        <Eye className="h-4 w-4" />
        Preview Asset
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[94] bg-black/80 backdrop-blur-xl"
          >
            <div className="flex h-full flex-col px-4 py-4 md:px-8 md:py-6">
              <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 rounded-[1.6rem] border border-white/10 bg-white/[0.04] px-5 py-4 backdrop-blur-xl">
                <div>
                  <p className="section-label">Protected Asset Viewer</p>
                  <h3 className="mt-2 text-xl tracking-[-0.05em] text-white">{title}</h3>
                  <p className="mt-1 text-sm text-white/55">{active.label}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setZoom((value) => Math.max(0.75, Number((value - 0.2).toFixed(2))))} className="rounded-full border border-white/10 p-3 text-white/75 transition hover:border-white/20 hover:text-white">
                    <Minus className="h-4 w-4" />
                  </button>
                  <div className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/70">{Math.round(zoom * 100)}%</div>
                  <button type="button" onClick={() => setZoom((value) => Math.min(3, Number((value + 0.2).toFixed(2))))} className="rounded-full border border-white/10 p-3 text-white/75 transition hover:border-white/20 hover:text-white">
                    <Plus className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => setZoom(1)} className="rounded-full border border-white/10 px-4 py-3 text-sm text-white/75 transition hover:border-white/20 hover:text-white">
                    <Maximize2 className="mr-2 inline h-4 w-4" />Reset
                  </button>
                  <button type="button" onClick={() => setOpen(false)} className="rounded-full border border-white/10 p-3 text-white/75 transition hover:border-white/20 hover:text-white">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mx-auto mt-4 grid w-full max-w-7xl flex-1 gap-4 lg:grid-cols-[1fr_320px]">
                <div
                  onContextMenu={async (event: MouseEvent<HTMLDivElement>) => {
                    event.preventDefault();
                    setNotice('Klik kanan diblokir pada protected preview dan sudah tercatat di admin log.');
                    await report('context_menu_blocked', { label: active.label, url: active.url });
                  }}
                  className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/70"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(0,0,0,0))]" />
                  <div className="h-full w-full overflow-auto p-6">
                    <div className="relative mx-auto flex min-h-full min-w-fit items-center justify-center" style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}>
                      <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/50 shadow-glass">
                        <Image
                          src={previewUrl}
                          alt={active.label}
                          width={1600}
                          height={1200}
                          unoptimized
                          draggable={false}
                          className="h-auto max-w-[min(80vw,1100px)] select-none object-contain"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_28%,transparent_68%,rgba(255,255,255,0.06))]" />
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {notice ? (
                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 16 }}
                        className="absolute bottom-5 left-5 right-5 rounded-[1.4rem] border border-white/10 bg-black/75 p-4 backdrop-blur-xl"
                      >
                        <div className="flex items-start gap-3">
                          <Shield className="mt-0.5 h-4 w-4 text-white/80" />
                          <p className="text-sm leading-6 text-white/76">{notice}</p>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>

                <div className="space-y-4 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
                  <div>
                    <p className="section-label">Asset List</p>
                    <p className="mt-3 text-sm leading-7 text-white/58">
                      Preview memakai watermark generated preview dan QR support yang tertanam agar tampilan tetap aman saat dilihat publik.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {imageItems.map((item: GalleryItem, itemIndex: number) => (
                      <button
                        key={`${item.url}-${itemIndex}`}
                        type="button"
                        onClick={() => {
                          setIndex(itemIndex);
                          setZoom(1);
                          setNotice('');
                        }}
                        className={`w-full rounded-[1.4rem] border px-4 py-4 text-left transition ${
                          itemIndex === index ? 'border-white/30 bg-white/[0.08]' : 'border-white/10 bg-black/30 hover:border-white/20 hover:bg-white/[0.05]'
                        }`}
                      >
                        <p className="text-sm tracking-[-0.02em] text-white">{item.label}</p>
                        <p className="mt-1 text-xs text-white/45">Watermarked preview</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
