import useSWR from 'swr';
import { getPlayers } from '../players';

export function usePlayers(userId: string) {
  return useSWR(`users/${userId}/players`, () => getPlayers(userId));
}
