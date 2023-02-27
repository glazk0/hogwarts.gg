'use client';

import { insertComment } from '#/lib/comments';
import { useMe } from '#/lib/hooks/use-me';
import type { Translations } from '#/lib/i18n/types';
import type { Post } from '#/lib/posts';
import { commentSchema } from '#/lib/validations/comment';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSWRConfig } from 'swr';
import type * as z from 'zod';
import Button from './Button';
import EditorInput from './EditorInput';

type FormData = z.infer<typeof commentSchema>;

export default function CommentForm({
  translations,
  ...props
}: {
  post: Post;
  translations: Translations;
}) {
  const me = useMe();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<FormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      body: '',
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const { mutate } = useSWRConfig();

  async function onSubmit(data: FormData) {
    setIsSubmitting(true);
    clearErrors();

    const { error } = await insertComment({
      ...data,
      post_id: props.post.group_id ?? props.post.id,
    });
    if (error) {
      setError('body', { message: error.message });
    }
    setIsValid(true);
    setIsSubmitting(false);
    // TODO: This is a hack to make the editor re-render
    setTimeout(() => {
      setIsValid(false);
    }, 200);
    mutate(`comments/posts/${props.post.id}`);
  }

  if (!me.data) {
    return <></>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid w-full gap-10">
      <div className="flex flex-col w-full items-end space-y-2">
        {errors.body && (
          <p className="text-xs	text-orange-500">{errors.body.message}</p>
        )}
        <Controller
          name="body"
          control={control}
          render={({ field }) => (
            <EditorInput
              imageUpload={{
                storage: 'comments',
                folder: me.data!.id,
              }}
              isValid={isValid}
              {...field}
            />
          )}
        />
        <Button type="submit" kind="default" disabled={isSubmitting}>
          {translations.commentSubmit}
        </Button>
      </div>
    </form>
  );
}
