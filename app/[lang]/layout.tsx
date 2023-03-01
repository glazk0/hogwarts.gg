import { languages, loadDictionary } from '#/lib/i18n/settings';
import { cn } from '#/lib/utils';
import '#/styles/globals.css';
import Footer from '#/ui/Footer';
import GlobalNav from '#/ui/GlobalNav';
import PlausibleTracker from '#/ui/PlausibleTracker';
import { Work_Sans as WorkSans } from '@next/font/google';
import localFont from '@next/font/local';
import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';

const Overwolf = dynamic(() => import('#/ui/overwolf/Overwolf'), {
  ssr: false,
});

const fontSerif = localFont({
  variable: '--font-serif',
  src: './fonts/animales-fantastic.woff2',
  display: 'block',
});

const fontSans = WorkSans({
  variable: '--font-sans',
  subsets: ['latin'],
});

const RootLayout = async ({
  children,
  params: { lang },
}: {
  children: ReactNode;
  params: { lang: string };
}) => {
  const { global: globalTranslations, overwolf: overwolfTranslations } =
    await loadDictionary(lang);
  return (
    <html
      lang={lang}
      dir="ltr"
      className={cn(
        '[color-scheme:dark] select-none drag-none bg-gradient-to-b from-gray-1000 via-gray-1000 to-gray-1100 text-white scroll-smooth',
        fontSerif.variable,
        fontSans.variable,
      )}
    >
      <head>
        <PlausibleTracker />
      </head>
      <body className="flex h-screen">
        <main className="relative min-h-screen flex-1 overflow-auto">
          <div className="pt-14">{children}</div>
          <Footer translations={globalTranslations} />
        </main>
        <Overwolf translations={overwolfTranslations} />
        <GlobalNav translations={globalTranslations} />
      </body>
    </html>
  );
};

export default RootLayout;

export async function generateStaticParams() {
  return languages.map((lang) => ({ lang }));
}
