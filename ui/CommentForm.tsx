'use client';

import type { Node } from '#/lib/nodes';
import type { Post } from '#/lib/posts';
import supabase from '#/lib/supabase-browser';
import { commentSchema } from '#/lib/validations/comment';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import type * as z from 'zod';
import EditorInput from './EditorInput';

type FormData = z.infer<typeof commentSchema>;

export default function CommentForm({
  post,
  node,
}: {
  post?: Post;
  node?: Node;
}) {
  const {
    control,
    register,
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
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    clearErrors();
    const { error } = await supabase.from('comments').insert({
      ...data,
      post_id: post?.id,
      node_id: node?.id,
    });
    if (error) {
      setError('body', { message: error.message });
    }
    setIsLoading(false);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid w-full gap-10">
      <div className="flex w-full items-center justify-between">
        {errors.body && (
          <p className="text-xs	text-orange-500">{errors.body.message}</p>
        )}
        <Controller
          name="body"
          control={control}
          render={({ field }) => <EditorInput postId={post!.id} {...field} />}
        />
      </div>
    </form>
  );
}
