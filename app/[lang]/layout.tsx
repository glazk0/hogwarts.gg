import { alternates, languages, loadDictionary } from '#/lib/i18n/settings';
import { cn, getURL } from '#/lib/utils';
import '#/styles/globals.css';
import Footer from '#/ui/Footer';
import GlobalNav from '#/ui/GlobalNav';
import PlausibleTracker from '#/ui/PlausibleTracker';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Work_Sans as WorkSans } from 'next/font/google';
import localFont from 'next/font/local';
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

export const metadata: Metadata = {
  title: {
    default: 'Hogwarts Legacy Map and Tools - Hogwarts.gg',
    template: '%s - Hogwarts Legacy Map and Tools - Hogwarts.gg',
  },
  description:
    'Get all the Hogwarts Legacy locations, secrets, chests, entrances and more.',
  manifest: getURL('/favicon/site.webmanifest'),
  openGraph: {
    title: {
      default: 'Hogwarts Legacy Map and Tools - Hogwarts.gg',
      template: '%s - Hogwarts Legacy Map and Tools - Hogwarts.gg',
    },
    description:
      'Get all the Hogwarts Legacy locations, secrets, chests, entrances and more.',
    url: getURL(),
    siteName: 'Hogwarts Legacy Map and Tools - Hogwarts.gg',
    images: [
      {
        url: getURL('/assets/social.jpg'),
        width: 2160,
        height: 1080,
        alt: 'Hogwarts Legacy Map and Tools - Hogwarts.gg',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: {
      default: 'Hogwarts Legacy Map and Tools - Hogwarts.gg',
      template: '%s - Hogwarts Legacy Map and Tools - Hogwarts.gg',
    },
    description:
      'Get all the Hogwarts Legacy locations, secrets, chests, entrances and more.',
    creator: '@leonmachens',
    creatorId: '837613011917484033',
    images: [getURL('/assets/social.jpg')],
  },
  alternates: {
    canonical: getURL(),
    languages: alternates,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },

  icons: {
    icon: [
      {
        url: getURL('/favicon/favicon-32x32.png'),
        sizes: '32x32',
      },
      {
        url: getURL('/favicon/favicon-16x16.png'),
        sizes: '16x16',
      },
    ],
    shortcut: getURL('/favicon.ico'),
    apple: getURL('/favicon/apple-touch-icon.png'),
  },
};

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
        '[color-scheme:dark] select-none bg-gradient-to-b from-gray-1000 via-gray-1000 to-gray-1100 text-white scroll-smooth',
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
