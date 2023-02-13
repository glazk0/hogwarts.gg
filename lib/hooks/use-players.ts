import useSWR from 'swr';
import { getPlayers } from '../players';

export function usePlayers(userId?: string) {
  return useSWR(userId ? `users/${userId}/players` : null, () =>
    getPlayers(userId!),
  );
}
