'use client';
import useLanguage from '#/lib/hooks/use-language';
import { usePlayerPosition } from '#/lib/hooks/use-player-position';
import { getLevelByZ } from '#/lib/map';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useMap } from './Map';
import PlayerMarker, { createPlayerIcon } from './PlayerMarker';

export default function Player() {
  const { data: playerPosition } = usePlayerPosition();
  const searchParams = useSearchParams()!;
  const router = useRouter();
  const lang = useLanguage();
  const [marker, setMarker] = useState<PlayerMarker | null>(null);
  const map = useMap();

  const level = +searchParams.get('level')!;

  const playerLevel = playerPosition ? +getLevelByZ(playerPosition.z) : null;

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

    if (level !== playerLevel) {
      const href = `/${lang}/map/hogwarts?level=${playerLevel}`;
      router.prefetch(href);
      router.replace(href);
      map.panTo(marker.getLatLng());
    }

    return () => {
      marker.removeFrom(map);
      setMarker(null);
    };
  }, [map, Boolean(playerPosition)]);

  useEffect(() => {
    if (!marker) {
      return;
    }
    if (level !== playerLevel) {
      const href = `/${lang}/map/hogwarts?level=${playerLevel}`;
      router.prefetch(href);
      router.replace(href);
    }
  }, [playerLevel]);

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
