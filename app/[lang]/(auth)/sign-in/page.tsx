import { loadDictionary } from '#/lib/i18n/settings';
import UserAuthForm from '#/ui/UserAuthForm';

export const metadata = {
  title: 'Sign In',
};

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
