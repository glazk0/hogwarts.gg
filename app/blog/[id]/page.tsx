import { getComments } from '#/lib/comments';
import { getPost } from '#/lib/posts';
import createClient from '#/lib/supabase-server';
import Avatar from '#/ui/Avatar';
import CommentForm from '#/ui/CommentForm';
import PostHTML from '#/ui/PostHTML';
import { IconArrowNarrowLeft } from '@tabler/icons';
import { format, formatDistance } from 'date-fns';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function Page({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const supabase = createClient();

  const post = await getPost(supabase, params.id);

  if (!post) {
    notFound();
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
            Writed by{' '}
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
        <hr className="border-gray-200/50" />
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
        </Link>
      </div>

      <div className="container mx-auto max-w-4xl px-2 md:px-0 py-8 grid gap-2">
        <div className="flex flex-col">
          <CommentForm post={post} />
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
          )}
        </div>
      </div>
    </>
  );
}
