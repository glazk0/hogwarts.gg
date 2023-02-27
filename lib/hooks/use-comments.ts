import useSWR from 'swr';
import { getComments } from '../comments';

export function usePostComments(postId: number) {
  return useSWR(`comments/posts/${postId}`, () => getComments({ postId }));
}
