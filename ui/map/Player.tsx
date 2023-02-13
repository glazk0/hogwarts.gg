'use client';
import CanvasMarker from '#/lib/canvas-marker';
import { useMe } from '#/lib/hooks/use-me';
import { usePlayers } from '#/lib/hooks/use-players';
import { getLevelByZ } from '#/lib/map';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useMap } from './Map';

export default function Player() {
  const { data: me } = useMe();
  const { data: players = [] } = usePlayers(me?.id);
  const searchParams = useSearchParams();
  const level = +searchParams.get('level')!;

  const map = useMap();
  useEffect(() => {
    if (!map.getPanes().mapPane) {
      return;
    }
    const markers = players
      .filter((player) => {
        const playerLevel = +getLevelByZ(player.position.z);
        return level === playerLevel;
      })
      .map((player) => {
        const marker = new CanvasMarker(
          [player.position.y, player.position.x],
          {
            radius: 15,
            src: '/assets/icons/player.png',
            rotate: player.position.yaw,
          },
        );
        marker.addTo(map);
        return marker;
      });

    return () => {
      markers.forEach((marker) => marker.removeFrom(map));
    };
  }, [map, players, level]);

  return <></>;
}
