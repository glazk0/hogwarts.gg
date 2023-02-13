'use client';

import {
  BOTTOM_LEFT,
  getMapTile,
  HOGWARTS_BOUNDS,
  HOGWARTS_LEVELS,
  SCALAR,
} from '#/lib/map';
import Map from '#/ui/map/Map';
import leaflet from 'leaflet';
import { notFound, useSearchParams } from 'next/navigation';
import type { ReactNode } from 'react';
import ImageOverlay from './ImageOverlay';

const crs = leaflet.extend({}, leaflet.CRS.Simple, {
  transformation: new leaflet.Transformation(SCALAR[0], 0, SCALAR[1], 0),
});

function HogwartsLegacyLayer({ level }: { level: number }) {
  return <ImageOverlay url={getMapTile(level)} bounds={HOGWARTS_BOUNDS} />;
}

export default function HogwartsMap({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const level = searchParams.get('level');

  if (!level) {
    notFound();
  }
  const mapLevel = +level;
  if (!HOGWARTS_LEVELS.includes(mapLevel)) {
    notFound();
  }

  return (
    <Map center={BOTTOM_LEFT} bounds={HOGWARTS_BOUNDS} crs={crs}>
      <HogwartsLegacyLayer level={mapLevel} />
      {children}
    </Map>
  );
}
