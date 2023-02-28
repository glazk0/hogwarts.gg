import { loadDictionary } from '#/lib/i18n/settings';
import { getPostBySlug, getPosts } from '#/lib/posts';
import { getURL, replaceHTML } from '#/lib/utils';
import Post from '#/ui/Post';
import SWRFallback from '#/ui/SWRFallback';
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

export async function generateMetadata({
  params: { slug },
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPostBySlug(slug, { published: true });

  if (!post) {
    notFound();
  }

  return {
    title: post!.title,
    description: replaceHTML(post!.short!),
    openGraph: {
      title: post!.title!,
      description: replaceHTML(post!.short!),
      type: 'article',
      url: getURL(`/${post!.language}/blog/${post!.slug}`),
      images: [
        {
          url: getURL(post!.image!) || getURL('/assets/social.png'),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post!.title!,
      description: replaceHTML(post!.short!),
      images: [getURL(post!.image!) || getURL('/assets/social.png')],
    },
  };
}

export default async function Page({
  params: { slug, lang },
}: {
  params: {
    slug: string;
    lang: string;
  };
}) {
  const { post: translations } = await loadDictionary(lang);

  const post = await getPostBySlug(slug, { published: true });

  if (!post) {
    notFound();
  }

  if (post!.language !== lang) {
    const correctPost = post!.posts.find(
      (post) => post.language === lang && post.published,
    );
    if (correctPost?.slug) {
      redirect(`/${lang}/blog/${correctPost.slug}`);
    }
  }

  return (
    <SWRFallback fallback={{ [`posts/slugs/${slug}`]: post }}>
      <Post slug={slug} translations={translations} />
    </SWRFallback>
  );
}

export async function generateStaticParams() {
  const posts = await getPosts();
  const publishedPosts = posts.filter((post) => post.published && post.slug);
  return publishedPosts.map((post) => ({
    lang: post.language,
    slug: post.slug!,
  }));
}
