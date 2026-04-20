import type { Metadata } from 'next';
import { CustomCursor } from '@/components/custom-cursor';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'The Arkana Vault',
  description: 'Luxurious minimalist portfolio for Arkana Kafi.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
