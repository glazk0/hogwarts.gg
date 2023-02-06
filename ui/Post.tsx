'use client';

import { usePostComments } from '#/lib/hooks/use-comments';
import useLanguage from '#/lib/hooks/use-language';
import { usePostBySlug } from '#/lib/hooks/use-post';
import { labels } from '#/lib/i18n/settings';
import type { Translations } from '#/lib/i18n/types';
import Comment from '#/ui/Comment';
import { IconArrowNarrowLeft } from '@tabler/icons';
import { format, formatDistance } from 'date-fns';
import { notFound, redirect } from 'next/navigation';
import AppLink from './AppLink';
import Avatar from './Avatar';
import CommentForm from './CommentForm';
import PostHTML from './PostHTML';

export default function Post({
  slug,
  translations,
}: {
  slug: string;
  translations: Translations;
}) {
  const language = useLanguage();
  const { data: post, isLoading: postLoading } = usePostBySlug(slug);
  const { data: comments, isLoading: commentsLoading } = usePostComments(
    post!.group_id || post!.id,
  );

  if (!post && postLoading) {
    return <></>;
  }

  if (!post) {
    notFound();
  }

  if (post.language !== language) {
    const correctPost = post.posts.find(
      (post) => post.language === language && post.published,
    );
    if (correctPost?.slug) {
      redirect(`/${language}/blog/${correctPost.slug}`);
    }
  }

  return (
    <>
      <div className="container mx-auto px-6 pt-16 pb-8">
        <div className="mx-auto max-w-4xl space-y-4">
          <h1 className="text-3xl font-bold lg:text-4xl">{post.title}</h1>
          <PostHTML html={post.short!} />
          <div className="flex gap-2 text-gray-400 text-sm">
            <p>{labels[post.language]}</p>|
            <p>
              {translations.writtenBy}{' '}
              <span className="font-semibold">{post.user.username}</span>
              {' - '}
              {post.published_at && (
                <time dateTime={post.published_at}>
                  {format(new Date(post.published_at), 'MMMM dd, yyyy')} (
                  {formatDistance(new Date(post.published_at), new Date(), {
                    addSuffix: true,
                  })}
                  )
                </time>
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-2 md:px-0 py-4 grid gap-2 space-y-6">
        <PostHTML html={post.body!} />
        <hr className="border-gray-200/50" />
        <div className="flex flex-col space-y-2">
          <h2 className="text-2xl font-bold">{translations.aboutTheAuthor}</h2>
          <AppLink href={`/users/${post.user_id}`}>
            <div className="flex items-center space-x-2">
              <div className="flex-shrink-0">
                <Avatar name={post.user.username} size={42} />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex flex-col item-center">
                  <p className="font-semibold">{post.user.username}</p>
                  <div className="prose prose-sm max-w-none">
                    <p>{post.user.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </AppLink>
        </div>
        <AppLink href="/blog" className="flex py-2 text-brand hover:underline">
          <IconArrowNarrowLeft /> {translations.backToBlog}
        </AppLink>
      </div>

      <div className="container mx-auto max-w-4xl px-2 md:px-0 grid gap-2 pb-16">
        <div className="flex flex-col space-y-6">
          <CommentForm post={post} translations={translations} />
          {!commentsLoading && comments && comments.length > 0 && (
            <div className="flex flex-col space-y-6">
              {comments.map((comment) => (
                <Comment
                  key={comment.id}
                  post={post}
                  comment={comment}
                  translations={translations}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
