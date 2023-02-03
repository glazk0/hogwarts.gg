'use client';

import { useComments } from '#/lib/hooks/use-comments';
import useLanguage from '#/lib/hooks/use-language';
import { useMe } from '#/lib/hooks/use-me';
import { usePostBySlug } from '#/lib/hooks/use-post';
import { labels } from '#/lib/i18n/settings';
import type { Translations } from '#/lib/i18n/types';
import { IconArrowNarrowLeft, IconEdit, IconTrash } from '@tabler/icons';
import { format, formatDistance } from 'date-fns';
import { notFound, redirect } from 'next/navigation';
import AppLink from './AppLink';
import Avatar from './Avatar';
import Button from './Button';
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
  const { data: comments, isLoading: commentsLoading } = useComments({
    postId: post?.group_id || post?.id,
  });
  const { data: me, isLoading: meLoading } = useMe();

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
        <div className="flex flex-col space-y-4">
          <h2 className="text-2xl font-bold">{translations.aboutTheAuthor}</h2>
          <div className="flex justify-between">
            <div className="flex">
              <Avatar name={post.user.username} size={42} />
              <div className="ml-2 w-full">
                <p className="font-semibold">{post.user.username}</p>
                <p className="text-gray-400 text-sm">
                 No about me yet. (TODO)
                </p>
              </div>
            </div>
          </div>
        </div>
        <AppLink
          href="/blog"
          className="flex py-4 text-sky-400 hover:underline"
        >
          <IconArrowNarrowLeft /> {translations.backToBlog}
        </AppLink>
      </div>

      <div className="container mx-auto max-w-4xl px-2 md:px-0 grid gap-2">
        <div className="flex flex-col space-y-6">
          <CommentForm post={post} translations={translations} />
          {!commentsLoading && comments && comments.length > 0 && (
            <div className="flex flex-col space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="flex flex-col space-y-">
                  <div className="flex justify-between">
                    <div className="flex w-full">
                      <Avatar name={comment.user.username} size={42} />
                      <div className="ml-2 w-full flex flex-col">
                        <div className="flex justify-between">
                          <p className="font-semibold">
                            {comment.user.username}
                          </p>
                          {me?.id === comment.user_id && (
                          <div className="flex space-x-2">
                            <IconEdit className='cursor-pointer' size={20} onClick={() => console.log('salut')} />
                            <IconTrash className='cursor-pointer' size={20} onClick={() => console.log('salut')} />
                          </div>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm">
                          <time dateTime={comment.created_at!}>
                            {format(
                              new Date(comment.created_at!),
                              'MMMM dd, yyyy',
                            )}{' '}
                            (
                            {formatDistance(
                              new Date(comment.created_at!),
                              new Date(),
                              {
                                addSuffix: true,
                              },
                            )}
                            )
                          </time>
                        </p>
                        <div className="text-sm">
                          <PostHTML html={comment.body} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
