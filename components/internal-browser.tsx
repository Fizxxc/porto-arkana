'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink, Globe, RefreshCw, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { cn, openableHostname, toEmbeddableUrl } from '@/lib/utils';

type InternalBrowserProps = {
  url: string;
  title: string;
  buttonLabel: string;
  className?: string;
  variant?: 'primary' | 'secondary';
};

export function InternalBrowser({ url, title, buttonLabel, className, variant = 'secondary' }: InternalBrowserProps) {
  const [open, setOpen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const embedUrl = useMemo(() => toEmbeddableUrl(url), [url]);
  const host = useMemo(() => openableHostname(url), [url]);
  const isReady = Boolean(url && url !== '#');

  return (
    <>
      <button
        onClick={() => isReady && setOpen(true)}
        disabled={!isReady}
        className={cn(
          'inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm transition',
          variant === 'primary'
            ? 'border border-white bg-white font-medium text-black hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-45'
            : 'border border-white/10 bg-white/[0.03] text-white/80 hover:border-white/20 hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-45',
          className
        )}
      >
        {buttonLabel}
        <Globe className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[95] bg-black/70 px-4 py-4 backdrop-blur-xl md:px-10 md:py-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              className="mx-auto flex h-full max-w-7xl flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-black/[0.92] shadow-glass"
            >
              <div className="flex flex-wrap items-center gap-3 border-b border-white/10 bg-white/[0.04] px-4 py-4 md:px-6">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-white/30" />
                  <span className="h-3 w-3 rounded-full bg-white/20" />
                  <span className="h-3 w-3 rounded-full bg-white/10" />
                </div>

                <div className="min-w-0 flex-1 rounded-full border border-white/10 bg-black/70 px-4 py-3">
                  <p className="truncate text-sm text-white/78">{title}</p>
                  <p className="truncate text-[11px] uppercase tracking-[0.28em] text-white/35">{host}</p>
                </div>

                <div className="ml-auto flex items-center gap-2">
                  <button
                    onClick={() => setReloadKey((value) => value + 1)}
                    className="rounded-full border border-white/10 p-3 text-white/65 transition hover:border-white/25 hover:text-white"
                    aria-label="Reload embedded browser"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-3 text-sm text-white/72 transition hover:border-white/25 hover:text-white"
                  >
                    Open External
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <button
                    onClick={() => setOpen(false)}
                    className="rounded-full border border-white/10 p-3 text-white/65 transition hover:border-white/25 hover:text-white"
                    aria-label="Close embedded browser"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid flex-1 gap-0 md:grid-cols-[1fr_260px]">
                <div className="relative min-h-[60vh] overflow-hidden bg-black">
                  <iframe
                    key={reloadKey}
                    src={embedUrl}
                    title={title}
                    className="h-full min-h-[60vh] w-full bg-white"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allow="clipboard-read; clipboard-write; fullscreen"
                  />
                </div>

                <div className="border-l border-white/10 bg-white/[0.03] p-5">
                  <div className="space-y-4 rounded-[1.6rem] border border-white/10 bg-black/55 p-5">
                    <p className="section-label">Vault Browser</p>
                    <h3 className="text-xl tracking-[-0.05em] text-white">Buka link tanpa keluar dari portfolio.</h3>
                    <p className="text-sm leading-7 text-white/[0.56]">
                      Cocok untuk share link Drive, preview asset, atau dokumen portfolio. Jika situs memblokir embed, gunakan tombol external sebagai fallback.
                    </p>
                  </div>

                  <div className="mt-4 space-y-3 rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-5 text-sm text-white/[0.62]">
                    <p>• Window ini tetap berada di atas halaman utama.</p>
                    <p>• Cocok untuk link Google Drive / Google Docs yang mendukung preview.</p>
                    <p>• User bisa kembali ke portfolio cukup dengan tombol close.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
