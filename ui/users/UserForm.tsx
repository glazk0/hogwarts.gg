'use client';

import type { Translations } from '#/lib/i18n/types';
import type { User } from '#/lib/users';
import { updateUser } from '#/lib/users';
import { userSchema } from '#/lib/validations/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSWRConfig } from 'swr';
import type * as z from 'zod';
import Button from '../Button';
import Input from '../Input';
import Textarea from '../Textarea';

type FormData = z.infer<typeof userSchema>;

export default function UserForm({
  translations,
  user,
  onClose,
}: {
  user: User;
  onClose(): void;
  translations: Translations;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutate } = useSWRConfig();

  const {
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    register,
  } = useForm<FormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: user.username,
      description: user.description ?? '',
    },
  });

  async function onSubmit(data: FormData) {
    setIsSubmitting(true);
    clearErrors();

    const { error } = await updateUser(user.id, data);
    if (error) {
      setError('username', { message: error.message });
    }
    setIsSubmitting(false);

    mutate(`users/${user.id}`);
    mutate('me');
    onClose();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 items-center px-6 py-16"
    >
      <Input
        label={translations.username}
        required
        error={errors.username?.message}
        {...register('username')}
      />
      <Textarea
        label={translations.description}
        required
        error={errors.description?.message}
        {...register('description')}
      />
      <div className="flex gap-2">
        <Button type="submit" kind="accept" disabled={isSubmitting}>
          {translations.submit}
        </Button>
        <Button type="button" disabled={isSubmitting} onClick={onClose}>
          {translations.cancel}
        </Button>
      </div>
    </form>
  );
}
