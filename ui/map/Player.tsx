'use client';
import CanvasMarker from '#/lib/canvas-marker';
import useLanguage from '#/lib/hooks/use-language';
import { useMe } from '#/lib/hooks/use-me';
import { usePlayers } from '#/lib/hooks/use-players';
import { getLevelByZ } from '#/lib/map';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useMap } from './Map';

export default function Player() {
  const { data: me } = useMe();
  const { data: players = [] } = usePlayers(me?.id);
  const searchParams = useSearchParams();
  const router = useRouter();
  const lang = useLanguage();
  const [marker, setMarker] = useState<CanvasMarker | null>(null);
  const map = useMap();

  const level = +searchParams.get('level')!;
  const player = players.sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt),
  )[0];
  const playerLevel = player ? +getLevelByZ(player.position.z) : null;

  useEffect(() => {
    if (!map.getPanes().mapPane || !player) {
      return;
    }

    const marker = new CanvasMarker([player.position.y, player.position.x], {
      radius: 15,
      src: '/assets/icons/player.png',
      rotate: player.position.yaw,
    });
    setMarker(marker);

    if (level !== playerLevel) {
      router.replace(`/${lang}/map/hogwarts?level=${playerLevel}`);
    }

    return () => {
      marker.removeFrom(map);
      setMarker(null);
    };
  }, [map, Boolean(player), playerLevel]);

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
    if (!marker) {
      return;
    }
    marker.options.rotate = player.position.yaw;
    marker.setLatLng([player.position.y, player.position.x]);
  }, [player?.position]);

  return <></>;
}
