import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { CustomCursor } from '@/components/custom-cursor';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'Portfolio Arkana Kafi Yaassar',
  description: 'Selamat datang di portfolio online saya, tempat saya memamerkan karya-karya terbaik saya dalam bidang desain visual. Di sini, Anda akan menemukan berbagai proyek yang mencerminkan kreativitas, keahlian, dan dedikasi saya dalam menciptakan solusi desain yang menarik dan efektif. Jelajahi karya-karya saya dan temukan bagaimana saya dapat membantu mewujudkan visi kreatif Anda menjadi kenyataan.'
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="id">
      <body>
        <CustomCursor />
        {children}
        <div className="pointer-events-none fixed bottom-5 right-5 z-[70] hidden rounded-full border border-white/10 bg-black/55 px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-white/38 backdrop-blur-xl md:block">
          <p>© {new Date().getFullYear()} Arkana Kafi</p>
        </div>
      </body>
    </html>
  );
}
