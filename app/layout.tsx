import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { CustomCursor } from '@/components/custom-cursor';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'The Arkana Vault',
  description: 'Luxurious minimalist portfolio for Arkana Kafi.'
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
