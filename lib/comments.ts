import supabase from '#/lib/supabase-browser';
import { ok } from 'assert';
import type { Database } from './database.types';
import type { User } from './users';

export const getComments = async (props: {
  postId: number;
}): Promise<Comment[]> => {
  const request = supabase
    .from('comments')
    .select('*, user:users(username)')
    .order('created_at', { ascending: false });

  request.eq('post_id', props.postId);

  const { data: comments, error } = await request;

  if (error) {
    throw error;
  }

  if (!comments) {
    return [];
  }

  const result = comments.map(({ post_id, user, ...rest }) => {
    // It will never be an array because the `users.id` is unique
    ok(!Array.isArray(user));
    // The author should exists
    ok(user !== null);
    // Check if it's a comment for nodes or posts
    ok(post_id !== null);
    return {
      ...rest,
      post_id: post_id,
      user: user,
    };
  });
  return result;
};

export type Comment = Omit<
  Database['public']['Tables']['comments']['Row'],
  'node_id' | 'post_id'
> & {
  user: Pick<User, 'username'>;
} & (
    | {
        node_id: number;
      }
    | {
        post_id: number;
      }
  );

export const insertComment = async (
  props: (
    | {
        post_id: number;
      }
    | {
        node_id: number;
      }
  ) & {
    body: string;
  },
) => {
  return await supabase.from('comments').insert(props);
};
