import type { Post } from '#/lib/posts';
import { getURL } from '#/lib/utils';
import type { NextApiRequest, NextApiResponse } from 'next';

interface NextApiRequestRecord extends NextApiRequest {
  body: {
    record: Post;
    old_record?: Post;
  };
}

export default async function handler(
  req: NextApiRequestRecord,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const webhook = process.env.DISCORD_WEBHOOK_URL;

  if (!webhook) {
    return res.status(500).json({ error: 'No webhook URL provided' });
  }

  const token = process.env.WEBHOOK_TOKEN;

  if (!token || req.headers.token !== token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!req.body.record && !req.body.old_record) {
    return res.status(400).json({ error: 'No record provided' });
  }

  const {
    record: { title, short, slug, published, published_at, user, language },
    old_record: { published: old_published } = { published: false },
  } = req.body;

  if (!published || old_published) {
    return res.status(400).json({ error: 'Post not published yet' });
  }

  const data = {
    content: null,
    embeds: [
      {
        title: title,
        description: short?.replace(/(<([^>]+)>)/gi, ''),
        url: getURL(`/${language}/blog/${slug}`),
        color: 11377794,
        footer: {
          text: `Published by ${user.username}`,
        },
        timestamp: published_at!,
      },
    ],
    username: 'Hogwarts.gg',
    avatar_url: 'https://www.hogwarts.gg/assets/icon.png',
  };

  const response = await fetch(webhook, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return res.status(200).json({ ok: true });
}
