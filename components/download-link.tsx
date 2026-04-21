'use client';

import { Download } from 'lucide-react';

type Props = {
  href: string;
};

export function DownloadLink({ href }: Props) {
  return (
    <a
      href={href}
      onClick={() => window.dispatchEvent(new Event('arkana-download-start'))}
      className="inline-flex items-center gap-2 rounded-full border border-white bg-white px-6 py-3 text-sm font-medium text-black transition hover:opacity-85"
    >
      <Download className="h-4 w-4" />
      Download Assets / Sharelink
    </a>
  );
}
