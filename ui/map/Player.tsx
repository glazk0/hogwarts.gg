'use client';
import CanvasMarker from '#/lib/canvas-marker';
import useLanguage from '#/lib/hooks/use-language';
import { usePlayerPosition } from '#/lib/hooks/use-player-position';
import { getLevelByZ } from '#/lib/map';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useMap } from './Map';

export default function Player() {
  const { data: playerPosition } = usePlayerPosition();
  const searchParams = useSearchParams();
  const router = useRouter();
  const lang = useLanguage();
  const [marker, setMarker] = useState<CanvasMarker | null>(null);
  const map = useMap();

  const level = +searchParams.get('level')!;

  const playerLevel = playerPosition ? +getLevelByZ(playerPosition.z) : null;

  useEffect(() => {
    if (!map.getPanes().mapPane || !playerPosition) {
      return;
    }

    const marker = new CanvasMarker([playerPosition.y, playerPosition.x], {
      radius: 15,
      src: '/assets/icons/player.png',
      rotate: playerPosition.yaw,
    });
    setMarker(marker);

    if (level !== playerLevel) {
      router.replace(`/${lang}/map/hogwarts?level=${playerLevel}`);
      map.flyTo(marker.getLatLng());
      marker.bringToFront();
    }

    return () => {
      marker.removeFrom(map);
      setMarker(null);
    };
  }, [map, Boolean(playerPosition), playerLevel]);

  useEffect(() => {
    if (!marker) {
      return;
    }
    if (level !== playerLevel) {
      marker.removeFrom(map);
    } else if (!map.hasLayer(marker)) {
      marker.addTo(map);
    }
  }, [marker, level, playerLevel]);

  useEffect(() => {
    if (!marker || !playerPosition) {
      return;
    }
    marker.options.rotate = playerPosition.yaw;
    marker.setLatLng([playerPosition.y, playerPosition.x]);
    map.flyTo(marker.getLatLng());
    marker.bringToFront();
  }, [playerPosition?.x, playerPosition?.y]);

  return <></>;
}
