import useSWR from 'swr';
import { getComments } from '../comments';

export function useComments({
    postId,
    nodeId,
}: { postId?: number | null; nodeId?: number | null }) {

    return useSWR(`comments/${postId || nodeId}`, () => getComments({ postId, nodeId }));
    // return useSWR(['comments', postId, nodeId], () => getComments({ postId, nodeId }));
}
