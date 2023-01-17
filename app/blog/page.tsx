import { IconArrowNarrowRight } from '@tabler/icons';
import { format, formatDistance } from 'date-fns';
import Link from 'next/link';

async function fetchData() {
  const posts = [
    {
      id: '1',
      title: 'Hardware Requirements',
      createdAt: new Date('2023-01-17T08:52:14.112Z'),
      content: `Bla blub`,
    },
    {
      id: '2',
      title: 'Release Date',
      createdAt: new Date('2023-01-15T08:52:14.112Z'),
      content: `Bla blub\ndass`,
    },
  ];

  return posts;
}

export default async function Page() {
  const posts = await fetchData();

  return (
    <>
      <div className="container mx-auto px-6 py-16 text-center">
        <div className="mx-auto max-w-lg">
          <h1 className="text-3xl font-bold lg:text-4xl">Blog</h1>
          <h2 className="mt-6 text-gray-300">
            The latest news about Hogwarts Legacy and Hogwarts.gg
          </h2>
        </div>
      </div>
      {posts.map((post) => (
        <div key={post.id} className="hover:bg-gray-800 transition-colors">
          <div className="container mx-auto py-8 grid gap-2">
            <Link href={`/blog/${post.id}`}>
              <h3 className="text-2xl font-semibold">{post.title}</h3>
            </Link>
            <time
              dateTime={post.createdAt.toString()}
              className="text-gray-300"
            >
              {format(post.createdAt, 'MM/dd/yyyy')} (
              {formatDistance(post.createdAt, new Date(), { addSuffix: true })})
            </time>
            <p>{post.content}</p>
            <Link
              href={`/blog/${post.id}`}
              className="flex text-sky-400 hover:underline"
            >
              Read More <IconArrowNarrowRight />
            </Link>
          </div>
        </div>
      ))}
    </>
  );
}
