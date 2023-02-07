import { languages } from '#/lib/i18n/settings';
import { getPosts } from '#/lib/posts';
import { getURL } from '#/lib/utils';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const sitemap = await generateSiteMap();

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();
}

async function generateSiteMap() {
  const url = getURL();
  // We expect that the home pages changes always, if we add a feed of latest articles, comments and nodes.
  const homePages = languages
    .map(
      (language) =>
        `
      <url>
        <loc>${url}${language}</loc>
        <changefreq>always</changefreq>
        <priority>1.00</priority>
      </url>`,
    )
    .join('');
  // The blogs will change daily on average
  const blogPages = languages
    .map(
      (language) =>
        `
      <url>
        <loc>${url}${language}/blog</loc>
        <changefreq>daily</changefreq>
        <priority>0.80</priority>
      </url>`,
    )
    .join('');

  // Posts change daily on average (including comments)
  const posts = await getPosts();
  const postPages = posts
    .map(
      (post) =>
        `
      <url>
        <loc>${url}${post.language}/blog/${post.slug}</loc>
        <changefreq>daily</changefreq>
        <priority>0.64</priority>
      </url>`,
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
     ${homePages}
     ${blogPages}
     ${postPages}
   </urlset>
 `;
}
