import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: "Hala's World — Hala Abdul Hakeem Neamah",
  description:
    'An interactive portfolio you can drive through — hop in the rover and visit each stop.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
