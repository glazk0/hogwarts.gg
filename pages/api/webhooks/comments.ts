import type { Database } from '#/lib/database.types';
import { getUser } from '#/lib/users';
import { getPostById } from '#/lib/posts';
import { getURL, replaceHTML } from '#/lib/utils';
import type { NextApiRequest, NextApiResponse } from 'next';

interface NextApiRequestRecord extends NextApiRequest {
    body: {
        // Can't grab 'post_id' from the Comments type 
        record: Database['public']['Tables']['comments']['Row'];
    };
}

export default async function handler(
    req: NextApiRequestRecord,
    res: NextApiResponse,
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const webhook = process.env.NEXT_PUBLIC_DISCORD_COMMENTS_WEBHOOK_URL;

    if (!webhook) {
        return res.status(500).json({ error: 'No webhook URL provided' });
    }

    const token = process.env.WEBHOOK_TOKEN;

    if (!token || req.headers.token !== token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!req.body.record) {
        return res.status(400).json({ error: 'No record provided' });
    }

    const {
        record: { user_id, body, created_at, post_id },
    } = req.body;

    const user = await getUser(user_id);
    const post = await getPostById(post_id!.toString());

    const data = {
        content: null,
        embeds: [
            {
                title: `New comment by ${user?.username} on "${post?.title}"`,
                description: replaceHTML(body.length > 2048 ? body.slice(0, 2048) + ' ...' : body),
                url: getURL(`/${post?.language}/blog/${post_id}`),
                color: 11377794,
                timestamp: created_at,
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
