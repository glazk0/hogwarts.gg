import { getAlternates, loadDictionary } from '#/lib/i18n/settings';
import { getURL } from '#/lib/utils';
import UserAuthForm from '#/ui/UserAuthForm';
import type { Metadata } from 'next';

export async function generateMetadata({
  params: { lang },
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const { auth: authTranslations } = await loadDictionary(lang);
  return {
    title: authTranslations.signIn,
    alternates: {
      canonical: getURL(`/${lang}/sign-in`),
      languages: getAlternates('/sign-in'),
    },
  };
}

export default async function Page({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const { auth: translations } = await loadDictionary(lang);

  return (
    <>
      <h1 className="font-bold text-xl">{translations.signIn}</h1>
      <UserAuthForm translations={translations} />
    </>
  );
}
