import type { SupabaseClient } from '@supabase/supabase-js';
import { ok } from 'assert';
import type { Database } from './database.types';
import type { User } from './users';

export const getComments = async (
  supabase: SupabaseClient<Database>,
  {
    postId,
    nodeId,
  }: {
    postId?: number | null;
    nodeId?: number | null;
  },
): Promise<Comment[]> => {
  const { data: comments, error } = await supabase
    .from('comments')
    .select('*, user:users(username)')
    .order('created_at', { ascending: false })  
    .match({ post_id: postId, node_id: nodeId });

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

export type Comment = {
  id: number;
  post_id: number | null;
  node_id: number | null;
  user_id: string;
  body: string;
  upvotes: number;
  downvotes: number;
  created_at: string | null;
  user: Pick<User, 'username'>;
};
