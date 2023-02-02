'use client';

import useLanguage from '#/lib/hooks/use-language';
import { usePostBySlug } from '#/lib/hooks/use-post';
import type { Translations } from '#/lib/i18n/types';
import { IconArrowNarrowLeft } from '@tabler/icons';
import Avatar from 'boring-avatars';
import { format, formatDistance } from 'date-fns';
import { notFound, redirect } from 'next/navigation';
import AppLink from './AppLink';
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
  const { data: post, isLoading } = usePostBySlug(slug);
  if (!post && isLoading) {
    return <></>;
  }
  if (!post) {
    notFound();
  }
  if (post.language !== language) {
    const correctPost = post.posts.find((post) => post.language === language);
    if (correctPost?.slug) {
      redirect(`/${language}/blog/${correctPost.slug}`);
    } else {
      notFound();
    }
  }

  const comments = [
    {
      id: '1',
      body: '<p className="text-red-500">Hello world</p>',
      user: {
        id: '1',
        username: 'johndoe',
      },
      created_at: '2021-08-01T00:00:00.000Z',
    },
  ] as any;

  // const comments = await getComments(supabase, { postId: post.id })

  return (
    <>
      <div className="container mx-auto px-6 pt-16 pb-8 text-center">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold lg:text-4xl">{post.title}</h1>
          <PostHTML html={post.short!} />
          <p className="text-gray-400 text-sm pt-2">
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

      <div className="container mx-auto max-w-4xl px-2 md:px-0 py-8 grid gap-2">
        <PostHTML html={post.body!} />
        {/* <hr className="border-gray-200/50" />
        <h2 className="text-2xl font-bold">About the author</h2>
        <div className="flex justify-between">
          <div className="flex items-center">
            <Avatar name={post.user.username} size={42} />
            <div className="ml-2">
              <p className="font-semibold">{post.user.username}</p>
              <p className="text-gray-400 text-sm">No bio yet</p>
            </div>
          </div>
        </div>
        <Link href="/blog" className="flex py-4 text-sky-400 hover:underline">
          <IconArrowNarrowLeft /> Back to Blog
        </Link> */}
        <AppLink
          href="/blog"
          className="flex py-4 text-sky-400 hover:underline"
        >
          <IconArrowNarrowLeft /> {translations.backToBlog}
        </AppLink>
      </div>

      <div className="container mx-auto max-w-4xl px-2 md:px-0 py-8 grid gap-2">
        <div className="flex flex-col">
          {/* <CommentForm post={post} />
          {comments.length > 0 && (
            <div className="flex flex-col space-y-2">
              {comments.map((comment) => (
                <div key={comment.id} className="flex flex-col space-y-2">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <Avatar name={comment.user.username} size={42} />
                      <div className="ml-2">
                        <p className="font-semibold">{comment.user.username}</p>
                        <p className="text-gray-400 text-sm">
                          {formatDistance(
                            new Date(comment.created_at),
                            new Date(),
                            {
                              addSuffix: true,
                            },
                          )}
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
          )} */}
        </div>
      </div>
    </>
  );
}
