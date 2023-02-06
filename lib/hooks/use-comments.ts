import useSWR from 'swr';
import { getComments } from '../comments';

export function useNodeComments(nodeId: number) {
  return useSWR(`comments/nodes/${nodeId}`, () => getComments({ nodeId }));
}

export function usePostComments(postId: number) {
  return useSWR(`comments/posts/${postId}`, () => getComments({ postId }));
}
