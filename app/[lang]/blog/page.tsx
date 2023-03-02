import { getAlternates, loadDictionary } from '#/lib/i18n/settings';
import { getPosts } from '#/lib/posts';
import { getURL } from '#/lib/utils';
import Hero from '#/ui/Hero';
import Posts from '#/ui/Posts';
import SWRFallback from '#/ui/SWRFallback';
import type { Metadata } from 'next';

export async function generateMetadata({
  params: { lang },
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const { global: globalTranslations } = await loadDictionary(lang);
  return {
    title: globalTranslations.blog,
    alternates: {
      canonical: getURL(`/${lang}/blog`),
      languages: getAlternates('/blog'),
    },
  };
}

export default async function Page({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const posts = await getPosts({ language: lang, published: true });
  const { blog: blogTranslations, posts: postTranslations } =
    await loadDictionary(lang);

  return (
    <>
      <Hero
        title={blogTranslations.title}
        subtitle={blogTranslations.subtitle}
      />
      <SWRFallback fallback={{ [`posts/${lang}`]: posts }}>
        <Posts translations={postTranslations} />
      </SWRFallback>
    </>
  );
}
