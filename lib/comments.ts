import supabase from '#/lib/supabase-browser';
import { ok } from 'assert';
import type { Database } from './database.types';
import type { User } from './users';

export const getComments = async ({
  postId,
  nodeId,
}: {
  postId?: number;
  nodeId?: number;
}): Promise<Comment[]> => {
  const request = supabase
    .from('comments')
    .select('*, user:users(username)')
    .order('created_at', { ascending: false });

  if (postId) {
    request.eq('post_id', postId);
  } else if (nodeId) {
    request.eq('node_id', nodeId);
  }

  const { data: comments, error } = await request;

  if (error) {
    throw error;
  }

  if (!comments) {
    return [];
  }

  return comments.map((comment) => {
    // It will never be an array because the `users.id` is unique
    ok(!Array.isArray(comment.user));
    // The author should exists
    ok(comment.user !== null);

    return {
      ...comment,
      user: comment.user,
    };
  });
};

export type Comment = Database['public']['Tables']['comments']['Row'] & {
  user: Pick<User, 'username'>;
};
