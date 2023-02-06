import { languages, loadDictionary } from '#/lib/i18n/settings';
import { getUser, getUsers } from '#/lib/users';
import SWRFallback from '#/ui/SWRFallback';
import User from '#/ui/users/User';
import { notFound } from 'next/navigation';

export default async function Page({
  params: { id, lang },
}: {
  params: {
    id: string;
    lang: string;
  };
}) {
  const user = await getUser(id);
  if (!user) {
    notFound();
  }
  const { user: translations } = await loadDictionary(lang);

  return (
    <SWRFallback fallback={{ [`users/${id}`]: user }}>
      <User id={id} translations={translations} />
    </SWRFallback>
  );
}

export async function generateStaticParams() {
  const users = await getUsers();
  return users.flatMap((user) =>
    languages.map((lang) => ({ lang, id: user.id.toString() })),
  );
}
