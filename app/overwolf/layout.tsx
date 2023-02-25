import '#/styles/globals.css';

import { cn } from '#/lib/utils';
import { Work_Sans as WorkSans } from '@next/font/google';

const fontSans = WorkSans({
  variable: '--font-sans',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={cn(
        '[color-scheme:dark] select-none bg-gradient-to-b from-gray-1000 via-gray-1000 to-gray-1100 text-white scroll-smooth',
        fontSans.variable,
      )}
    >
      <head />
      <body>{children}</body>
    </html>
  );
}
