'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const items = [
  { href: '#top', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#works', label: 'Works' },
  { href: '#contact', label: 'Contact' }
];

export function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className="fixed inset-x-0 bottom-5 z-50 mx-auto flex w-[calc(100%-2rem)] max-w-lg items-center justify-between rounded-full border border-white/10 bg-white/5 px-2 py-2 shadow-glass backdrop-blur-xl"
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="rounded-full px-4 py-3 text-[11px] uppercase tracking-[0.24em] text-white/[0.62] transition hover:bg-white/5 hover:text-white"
        >
          {item.label}
        </Link>
      ))}
    </motion.nav>
  );
}
