'use client';
import useEventListener from '#/lib/hooks/use-event-listener';
import { usePlayerPosition } from '#/lib/hooks/use-player-position';
import { getLevelByZ, isInHogwarts } from '#/lib/map';
import { useMapStore } from '#/lib/store/map';
import { useEffect, useState } from 'react';
import { useMap } from './Map';
import PlayerMarker, { createPlayerIcon } from './PlayerMarker';

export default function Player() {
  const { data: playerPosition } = usePlayerPosition();
  const [marker, setMarker] = useState<PlayerMarker | null>(null);
  const map = useMap();

  const playerLevel = playerPosition ? +getLevelByZ(playerPosition.z) : 0;
  const inHogwarts = playerPosition ? isInHogwarts(playerPosition) : false;
  const mapStore = useMapStore();

  useEventListener(
    'show-on-map',
    () => {
      if (!marker) {
        return;
      }
      map.panTo(marker.getLatLng());
      mapStore.setHogwartsLevel(inHogwarts ? playerLevel : 0);
    },
    [marker, inHogwarts, playerLevel],
  );

  useEffect(() => {
    if (!map.getPanes().mapPane || !playerPosition) {
      return;
    }

    const icon = createPlayerIcon();
    const marker = new PlayerMarker([playerPosition.y, playerPosition.x], {
      icon,
      zIndexOffset: 9000,
      interactive: false,
    });
    marker.rotation = playerPosition.yaw;

    setMarker(marker);
    marker.addTo(map);
    map.panTo(marker.getLatLng());

    return () => {
      marker.removeFrom(map);
      setMarker(null);
    };
  }, [map, Boolean(playerPosition)]);

  useEffect(() => {
    mapStore.setHogwartsLevel(inHogwarts ? playerLevel : 0);
  }, [inHogwarts]);

  useEffect(() => {
    if (!marker) {
      return;
    }
    if (mapStore.hogwartsLevel !== playerLevel && inHogwarts) {
      marker.setOpacity(0.5);
    } else {
      marker.setOpacity(1);
    }
  }, [marker, playerLevel, mapStore.hogwartsLevel, inHogwarts]);

  useEffect(() => {
    if (!marker || !playerPosition) {
      return;
    }
    marker.rotation = playerPosition.yaw;
    const position = [playerPosition.y, playerPosition.x] as [number, number];
    marker.setLatLng(position);
    map.panTo(position, {
      animate: true,
      easeLinearity: 1,
      duration: 0.2,
      noMoveStart: true,
    });
  }, [playerPosition?.x, playerPosition?.y]);

  return <></>;
}
