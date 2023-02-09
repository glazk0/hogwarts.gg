'use client';

import { BOTTOM_LEFT, getMapTile, HOGWARTS_BOUNDS, SCALAR } from '#/lib/map';
import Map from '#/ui/Map';
import leaflet from 'leaflet';
import type { ReactNode } from 'react';
import ImageOverlay from './ImageOverlay';

const crs = leaflet.extend({}, leaflet.CRS.Simple, {
  transformation: new leaflet.Transformation(SCALAR[0], 0, SCALAR[1], 0),
});

function HogwartsLegacyLayer({ level }: { level: number }) {
  return <ImageOverlay url={getMapTile(level)} bounds={HOGWARTS_BOUNDS} />;
}

export default function HogwartsMap({
  children,
  level,
}: {
  children: ReactNode;
  level: number;
}) {
  return (
    <Map center={BOTTOM_LEFT} bounds={HOGWARTS_BOUNDS} crs={crs}>
      <HogwartsLegacyLayer level={level} />
      {children}
    </Map>
  );
}
