'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  Download,
  Minus,
  Plus,
  RotateCcw,
  Shield,
  X
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { ProjectAsset } from '@/types';

type Props = {
  open: boolean;
  assets: ProjectAsset[];
  initialIndex: number;
  projectSlug: string;
  onClose: () => void;
};

async function logEvent(payload: {
  eventType: string;
  target?: string;
  detail?: string;
  projectSlug?: string;
  assetId?: string;
}) {
  try {
    await fetch('/api/security/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch {}
}

export function AssetPreviewModal({ open, assets, initialIndex, projectSlug, onClose }: Props) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [notice, setNotice] = useState('');

  const activeAsset = assets[activeIndex];

  useEffect(() => {
    if (!open) return;
    setActiveIndex(initialIndex);
    setScale(1);
  }, [open, initialIndex]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === '+') setScale((value) => Math.min(3, value + 0.2));
      if (event.key === '-') setScale((value) => Math.max(0.8, value - 0.2));
      if (event.key === '0') setScale(1);
      if (event.key === 'ArrowRight') {
        setActiveIndex((value) => (value + 1) % assets.length);
      }
      if (event.key === 'ArrowLeft') {
        setActiveIndex((value) => (value - 1 + assets.length) % assets.length);
      }
      if (event.key === 'PrintScreen') {
        setNotice('Preview dilindungi watermark.');
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose, assets.length]);

  const previewUrl = useMemo(() => {
    if (!activeAsset?.id) return '';
    return `/api/project-assets/${activeAsset.id}/preview`;
  }, [activeAsset]);

  if (!open || !activeAsset) return null;

  const handleBlockedAction = (eventType: string, detail: string) => {
    setNotice('Aksi dibatasi untuk melindungi karya.');
    void logEvent({
      eventType,
      detail,
      projectSlug,
      assetId: activeAsset.id,
      target: activeAsset.label || activeAsset.file_url
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-xl"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-4 md:px-6">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">
                Protected Preview
              </p>
              <h3 className="mt-1 text-lg tracking-[-0.04em] text-white">
                {activeAsset.label || `Image ${activeIndex + 1}`}
              </h3>
              {activeAsset.caption ? (
                <p className="mt-1 text-sm text-white/55">{activeAsset.caption}</p>
              ) : null}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setScale((value) => Math.max(0.8, value - 0.2))}
                className="rounded-full border border-white/10 p-3 text-white/75 transition hover:border-white/25 hover:text-white"
              >
                <Minus className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setScale((value) => Math.min(3, value + 0.2))}
                className="rounded-full border border-white/10 p-3 text-white/75 transition hover:border-white/25 hover:text-white"
              >
                <Plus className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setScale(1)}
                className="rounded-full border border-white/10 p-3 text-white/75 transition hover:border-white/25 hover:text-white"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <a
                href={`/api/project-assets/${activeAsset.id}/download`}
                onClick={() =>
                  void logEvent({
                    eventType: 'download',
                    detail: 'download from preview modal',
                    projectSlug,
                    assetId: activeAsset.id,
                    target: activeAsset.label || activeAsset.file_url
                  })
                }
                className="inline-flex items-center gap-2 rounded-full border border-white bg-white px-4 py-3 text-sm font-medium text-black transition hover:opacity-85"
              >
                <Download className="h-4 w-4" />
                Download
              </a>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-white/10 p-3 text-white/75 transition hover:border-white/25 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="relative flex flex-1 overflow-hidden">
            <div className="absolute left-4 top-4 z-20 rounded-full border border-white/10 bg-black/60 px-3 py-2 text-xs text-white/70 backdrop-blur-xl">
              Zoom {(scale * 100).toFixed(0)}%
            </div>

            <div className="absolute bottom-4 left-4 z-20 max-w-[320px] rounded-[1.25rem] border border-white/10 bg-black/60 p-4 backdrop-blur-xl">
              <div className="flex items-start gap-3">
                <Shield className="mt-0.5 h-4 w-4 text-white/75" />
                <div className="text-xs leading-6 text-white/60">
                  Preview diberi watermark. Klik kanan, drag, dan aksi mencurigakan dicatat oleh sistem.
                </div>
              </div>

              {notice ? (
                <div className="mt-3 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-xs text-white/70">
                  <AlertTriangle className="mt-0.5 h-4 w-4" />
                  <p>{notice}</p>
                </div>
              ) : null}
            </div>

            <div className="absolute bottom-4 right-4 z-20 rounded-[1.25rem] border border-white/10 bg-black/50 p-3 backdrop-blur-xl">
              <img
                src="/api/qr?value=https://saweria.co/Fizzx"
                alt="QR Support Developer"
                className="h-20 w-20 opacity-75"
                draggable={false}
              />
            </div>

            <div className="flex w-full items-center justify-center overflow-auto p-6 md:p-10">
              <div
                className="relative max-w-full"
                onContextMenu={(event) => {
                  event.preventDefault();
                  handleBlockedAction('contextmenu', 'blocked inside preview');
                }}
                onDragStart={(event) => {
                  event.preventDefault();
                  handleBlockedAction('dragstart', 'drag blocked inside preview');
                }}
              >
                <div className="pointer-events-none absolute inset-0 z-10 bg-transparent" />
                <img
                  src={previewUrl}
                  alt={activeAsset.label || `Asset ${activeIndex + 1}`}
                  draggable={false}
                  className="max-h-[78vh] w-auto max-w-none select-none rounded-[1.75rem] border border-white/10 shadow-2xl"
                  style={{
                    transform: `scale(${scale})`,
                    transformOrigin: 'center center',
                    transition: 'transform 180ms ease'
                  }}
                />
              </div>
            </div>

            {assets.length > 1 ? (
              <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2 rounded-full border border-white/10 bg-black/55 px-3 py-2 backdrop-blur-xl">
                {assets.map((asset, index) => (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() => {
                      setActiveIndex(index);
                      setScale(1);
                    }}
                    className={`h-2.5 w-2.5 rounded-full transition ${
                      index === activeIndex ? 'bg-white' : 'bg-white/25'
                    }`}
                    aria-label={asset.label || `Image ${index + 1}`}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}