'use client';
import CanvasMarker from '#/lib/canvas-marker';
import useLanguage from '#/lib/hooks/use-language';
import { useMe } from '#/lib/hooks/use-me';
import { usePlayers } from '#/lib/hooks/use-players';
import { getLevelByZ } from '#/lib/map';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useMap } from './Map';

export default function Player() {
  const { data: me } = useMe();
  const { data: players = [] } = usePlayers(me?.id);
  const searchParams = useSearchParams();
  const level = +searchParams.get('level')!;
  const player = players.sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt),
  )[0];
  const router = useRouter();
  const lang = useLanguage();

  const map = useMap();
  useEffect(() => {
    if (!map.getPanes().mapPane || !player) {
      return;
    }

    const playerLevel = +getLevelByZ(player.position.z);
    if (level !== playerLevel) {
      router.replace(`/${lang}/map/hogwarts?level=${playerLevel}`);
    } else {
      const marker = new CanvasMarker([player.position.y, player.position.x], {
        radius: 15,
        src: '/assets/icons/player.png',
        rotate: player.position.yaw,
      });
      marker.addTo(map);

      return () => {
        marker.removeFrom(map);
      };
    }
  }, [map, player, level, lang, router]);

  return <></>;
}
