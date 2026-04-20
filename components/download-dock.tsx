'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Download, Minimize2, Maximize2, LoaderCircle, CheckCircle2, XCircle } from 'lucide-react';
import { useState } from 'react';

export function DownloadDock({ slug, title }: { slug: string; title: string }) {
  const [phase, setPhase] = useState<'idle' | 'downloading' | 'done' | 'error'>('idle');
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [message, setMessage] = useState('Asset siap diunduh.');

  const triggerDownload = async () => {
    try {
      setOpen(true);
      setMinimized(false);
      setPhase('downloading');
      setMessage('Menyiapkan file, watermark, dan metadata...');

      const response = await fetch(`/api/projects/${slug}/download`);
      if (!response.ok) throw new Error('Download gagal disiapkan.');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `${slug}.jpg`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(url);

      setPhase('done');
      setMessage('Download selesai diproses oleh browser.');
    } catch (error) {
      setPhase('error');
      setMessage(error instanceof Error ? error.message : 'Terjadi kesalahan saat download.');
    }
  };

  return (
    <>
      <button
        onClick={triggerDownload}
        className="inline-flex items-center gap-2 rounded-full border border-white bg-white px-6 py-3 text-sm font-medium text-black transition hover:opacity-85"
      >
        Download Project Asset
        <Download className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            className="fixed bottom-24 right-4 z-[70]"
          >
            {minimized ? (
              <button
                onClick={() => setMinimized(false)}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-3 text-sm text-white shadow-glass backdrop-blur-xl"
              >
                <Maximize2 className="h-4 w-4" />
                Downloading...
              </button>
            ) : (
              <div className="w-[320px] rounded-[1.5rem] border border-white/10 bg-black/[0.85] p-5 shadow-glass backdrop-blur-2xl">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="section-label">Download Center</p>
                    <h3 className="mt-2 text-lg tracking-[-0.04em] text-white">{title}</h3>
                  </div>
                  <button
                    onClick={() => setMinimized(true)}
                    className="rounded-full border border-white/10 p-2 text-white/70 transition hover:border-white/20 hover:text-white"
                  >
                    <Minimize2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="flex items-center gap-3">
                    {phase === 'downloading' ? <LoaderCircle className="h-5 w-5 animate-spin" /> : null}
                    {phase === 'done' ? <CheckCircle2 className="h-5 w-5 text-white" /> : null}
                    {phase === 'error' ? <XCircle className="h-5 w-5 text-white" /> : null}
                    {phase === 'idle' ? <Download className="h-5 w-5" /> : null}
                    <div>
                      <p className="text-sm text-white/[0.85]">{message}</p>
                      <p className="mt-1 text-xs leading-5 text-white/[0.45]">
                        File gambar akan diberi watermark sistem. Browser yang menentukan lokasi simpan file.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
