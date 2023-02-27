import { useCallback } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import type { SavefilePlayer } from '../savefiles';

export let cachedSavegamePlayer: SavefilePlayer | null = null;

export function useSetSavegamePlayer() {
  const { mutate } = useSWRConfig();

  return useCallback(
    (savegamePlayer: SavefilePlayer) => {
      cachedSavegamePlayer = savegamePlayer;
      mutate('savegame-player');
    },
    [mutate],
  );
}

export function useSavegamePlayer() {
  return useSWR('savegame-player', () => cachedSavegamePlayer);
}
