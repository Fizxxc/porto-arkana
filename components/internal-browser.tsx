'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Minimize2, X } from 'lucide-react';
import { useState } from 'react';

type Props = {
  url: string;
  label?: string;
};

export function InternalBrowser({ url, label = 'Open Internal Browser' }: Props) {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setMinimized(false);
        }}
        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-sm text-white/80 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
      >
        {label}
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            className={`fixed z-[92] ${minimized ? 'bottom-5 right-5 h-[72px] w-[320px]' : 'inset-4 md:inset-8'}`}
          >
            <div className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-black/90 shadow-glass backdrop-blur-2xl">
              <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-white/30" />
                  <span className="h-3 w-3 rounded-full bg-white/20" />
                  <span className="h-3 w-3 rounded-full bg-white/10" />
                </div>

                <p className="truncate text-sm text-white/60">Internal Browser</p>

                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setMinimized((value) => !value)} className="rounded-full border border-white/10 p-2 text-white/70 transition hover:border-white/20 hover:text-white">
                    <Minimize2 className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => setOpen(false)} className="rounded-full border border-white/10 p-2 text-white/70 transition hover:border-white/20 hover:text-white">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {!minimized ? (
                <div className="flex-1 bg-black">
                  <iframe src={url} className="h-full w-full" title="Internal Browser" sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-downloads" />
                </div>
              ) : (
                <div className="flex flex-1 items-center justify-between px-4 text-sm text-white/55">
                  <span>Browser minimized · portfolio tetap terbuka</span>
                  <button type="button" onClick={() => setMinimized(false)} className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/75 transition hover:border-white/20 hover:text-white">
                    Restore
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
