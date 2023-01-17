import { IconArrowNarrowLeft } from '@tabler/icons';
import { format, formatDistance } from 'date-fns';
import Link from 'next/link';

async function fetchData(params: { id: string }) {
  return {
    id: params.id,
    title: 'Hardware Requirements',
    createdAt: new Date('2023-01-17T08:52:14.112Z'),
    content: `Bla blub`,
  };
}

export default async function Page({
  params,
}: {
  params?: any;
  children?: React.ReactNode;
}) {
  const post = await fetchData(params);

  return (
    <>
      <div className="container mx-auto px-6 py-16 text-center">
        <div className="mx-auto max-w-lg">
          <h1 className="text-3xl font-bold lg:text-4xl">{post.title}</h1>
          <time
            dateTime={post.createdAt.toString()}
            className="mt-6 text-gray-300"
          >
            {format(post.createdAt, 'MM/dd/yyyy')} (
            {formatDistance(post.createdAt, new Date(), { addSuffix: true })})
          </time>
        </div>
      </div>

      <div className="container mx-auto py-8 grid gap-2">
        <p>{post.content}</p>
        <Link href="/blog" className="flex text-sky-400 hover:underline">
          <IconArrowNarrowLeft /> Back to Blog
        </Link>
      </div>
    </>
  );
}
