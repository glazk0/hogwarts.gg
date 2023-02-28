import { languages, loadDictionary } from '#/lib/i18n/settings';
import { getPlayers } from '#/lib/players';
import { getUser, getUsers } from '#/lib/users';
import SWRFallback from '#/ui/SWRFallback';
import User from '#/ui/users/User';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateMetadata({
  params: { id },
}: {
  params: { id: string };
}): Promise<Metadata> {
  const user = await getUser(id);

  if (!user) {
    notFound();
  }
  // TODO: Handle OpenGraph and Twitter metadata (it reset if I just change the title)
  return {
    title: user.username,
    description: user.description,
  };
}

export default async function Page({
  params: { id, lang },
}: {
  params: {
    id: string;
    lang: string;
  };
}) {
  const [user, players] = await Promise.all([getUser(id), getPlayers(id)]);
  if (!user) {
    notFound();
  }
  const { user: translations } = await loadDictionary(lang);

  return (
    <SWRFallback
      fallback={{ [`users/${id}`]: user, [`users/${id}/players`]: players }}
    >
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
