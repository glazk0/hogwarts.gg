import useSWR, { useSWRConfig } from 'swr';
import type { SavefilePlayer } from '../savefiles';

export let cachedPlayerPosition: SavefilePlayer['position'] | null = null;

export function useSetPlayerPosition() {
  const { mutate } = useSWRConfig();

  return (playerPosition: SavefilePlayer['position']) => {
    cachedPlayerPosition = playerPosition;
    mutate('player-position');
  };
}

export function usePlayerPosition() {
  return useSWR('player-position', () => cachedPlayerPosition);
}
