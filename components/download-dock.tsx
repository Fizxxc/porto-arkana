'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, DownloadCloud, Minimize2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export function DownloadDock() {
  const [visible, setVisible] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [phase, setPhase] = useState<'idle' | 'downloading' | 'done'>('idle');

  useEffect(() => {
    const onStart = () => {
      setVisible(true);
      setMinimized(false);
      setPhase('downloading');
      window.setTimeout(() => setPhase('done'), 2800);
      window.setTimeout(() => setMinimized(true), 5200);
    };

    window.addEventListener('arkana-download-start', onStart);
    return () => window.removeEventListener('arkana-download-start', onStart);
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          className={`fixed z-[90] ${minimized ? 'bottom-6 right-6 w-[320px]' : 'bottom-6 left-1/2 w-[min(92vw,560px)] -translate-x-1/2'}`}
        >
          <div className="overflow-hidden rounded-[1.8rem] border border-white/10 bg-black/85 shadow-glass backdrop-blur-2xl">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.05]">
                  <motion.div animate={phase === 'downloading' ? { rotate: 360 } : { rotate: 0 }} transition={phase === 'downloading' ? { duration: 1.2, repeat: Infinity, ease: 'linear' } : { duration: 0.4 }}>
                    {phase === 'done' ? <CheckCircle2 className="h-5 w-5 text-white" /> : <DownloadCloud className="h-5 w-5 text-white" />}
                  </motion.div>
                </div>
                <div>
                  <p className="text-sm tracking-[-0.02em] text-white">
                    {phase === 'downloading' ? 'Preparing protected download' : 'Protected download ready'}
                  </p>
                  <p className="mt-1 text-xs text-white/45">
                    {phase === 'downloading'
                      ? 'Watermark, metadata author, dan file packaging sedang dibuat.'
                      : 'File berhasil diproses. Browser akan melanjutkan download secara otomatis.'}
                  </p>
                </div>
              </div>

              <button type="button" onClick={() => setMinimized((value) => !value)} className="rounded-full border border-white/10 p-2 text-white/70 transition hover:border-white/20 hover:text-white">
                <Minimize2 className="h-4 w-4" />
              </button>
            </div>

            {!minimized ? (
              <div className="space-y-3 px-5 py-4">
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full bg-white"
                    initial={{ width: '8%' }}
                    animate={{ width: phase === 'done' ? '100%' : ['10%', '62%', '84%'] }}
                    transition={phase === 'done' ? { duration: 0.45 } : { duration: 1.6, repeat: Infinity, repeatType: 'reverse' }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.22em] text-white/35">
                  <span>portfolio transfer</span>
                  <span>{phase === 'done' ? '100%' : 'processing'}</span>
                </div>
              </div>
            ) : null}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
