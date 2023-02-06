'use client';

import { useMe } from '#/lib/hooks/use-me';
import useToggle from '#/lib/hooks/use-toggle';
import { useUser } from '#/lib/hooks/use-user';
import type { Translations } from '#/lib/i18n/types';
import { notFound } from 'next/navigation';
import Avatar from '../Avatar';
import Button from '../Button';
import UserForm from './UserForm';

export default function User({
  id,
  translations,
}: {
  id: string;
  translations: Translations;
}) {
  const { data: user } = useUser(id);
  const { data: me } = useMe();
  const [isEditing, toggleIsEditing] = useToggle();

  if (!user) {
    notFound();
  }

  const isMe = me?.id === id;

  return (
    <>
      {!isEditing ? (
        <div className="flex flex-col gap-4 items-center px-6 py-16">
          <Avatar name={user.username} size={72} />
          <h1 className="text-3xl font-bold lg:text-4xl">{user.username}</h1>
          <h2>{user.role}</h2>
          <p>{user.description}</p>
          {isMe && (
            <Button onClick={toggleIsEditing}>
              {translations.editProfile}
            </Button>
          )}
        </div>
      ) : (
        <UserForm
          translations={translations}
          user={user}
          onClose={toggleIsEditing}
        />
      )}
    </>
  );
}
