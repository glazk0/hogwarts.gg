'use client';

import type { Translations } from '#/lib/i18n/types';
import type { Node } from '#/lib/nodes';
import type { Post } from '#/lib/posts';
import supabase from '#/lib/supabase-browser';
import { commentSchema } from '#/lib/validations/comment';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconWhirl } from '@tabler/icons';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSWRConfig } from 'swr';
import type * as z from 'zod';
import Button from './Button';
import EditorInput from './EditorInput';

type FormData = z.infer<typeof commentSchema>;

export default function CommentForm({
  post,
  node,
  translations,
}: {
  post?: Post;
  node?: Node;
  translations: Translations;
}) {
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
  const { mutate } = useSWRConfig();

  async function onSubmit(data: FormData) {
    setIsSubmitting(true);
    clearErrors();
    const { error } = await supabase.from('comments').insert({
      ...data,
      post_id: post?.group_id || post?.id,
      node_id: node?.id,
    });
    if (error) {
      setError('body', { message: error.message });
    }
    setIsSubmitting(false);
    mutate(`comments/${post?.group_id || post?.id}`);
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
              postId={post!.id}
              isSubmitting={isSubmitting}
              {...field}
            />
          )}
        />
        <Button type="submit" kind="brand" disabled={isSubmitting}>
          {translations.commentSubmit}
        </Button>
      </div>
    </form>
  );
}
