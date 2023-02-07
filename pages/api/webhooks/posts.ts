import type { Post } from '#/lib/posts';
import { getURL } from '#/lib/utils';
import type { NextApiRequest, NextApiResponse } from 'next';

interface NextApiRequestRecord extends NextApiRequest {
  body: {
    record: Post;
  };
}

export default async function handler(
  req: NextApiRequestRecord,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const webhook = process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL;

  if (!webhook) {
    return res.status(400).json({ error: 'No webhook URL provided' });
  }

  if (!req.body.record) {
    return res.status(400).json({ error: 'No record provided' });
  }

  const {
    record: { title, short, slug, published_at, user, language },
  } = req.body;

  const data = {
    content: null,
    embeds: [
      {
        title: title,
        description: short?.replace(/(<([^>]+)>)/gi, ''),
        url: getURL() + `${language}/blog/${slug}`,
        color: 11377794,
        footer: {
          text: `Published by ${user.username}`,
        },
        timestamp: published_at!,
      },
    ],
    username: 'Hogwarts.gg',
    avatar_url:
      'https://media.discordapp.net/attachments/1064862000150237264/1071114716962902137/icon.png',
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
