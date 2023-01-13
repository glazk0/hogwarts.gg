import { cn } from '#/lib/utils';
import '#/styles/globals.css';
import { Work_Sans as WorkSans } from '@next/font/google';
import localFont from '@next/font/local';
import type { ReactNode } from 'react';

const fontSerif = localFont({
  variable: '--font-serif',
  src: './fonts/animales-fantastic.woff2',
});

const fontSans = WorkSans({
  variable: '--font-sans',
  subsets: ['latin'],
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={cn(
        '[color-scheme:dark] select-none',
        fontSerif.variable,
        fontSans.variable,
      )}
    >
      <head />
      <body>{children}</body>
    </html>
  );
}
