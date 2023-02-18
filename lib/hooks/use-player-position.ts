import { useCallback } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import type { SavefilePlayer } from '../savefiles';

export let cachedPlayerPosition: SavefilePlayer['position'] | null = null;

export function useSetPlayerPosition() {
  const { mutate } = useSWRConfig();

  return useCallback(
    (playerPosition: SavefilePlayer['position']) => {
      cachedPlayerPosition = playerPosition;
      mutate('player-position');
    },
    [mutate],
  );
}

export function usePlayerPosition() {
  return useSWR('player-position', () => cachedPlayerPosition);
}
