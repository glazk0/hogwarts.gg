'use client';

import { BOTTOM_LEFT, getMapTile, HOGWARTS_BOUNDS, SCALAR } from '#/lib/map';
import { useMapStore } from '#/lib/store/map';
import Map from '#/ui/map/Map';
import leaflet from 'leaflet';
import type { ReactNode } from 'react';
import ImageOverlay from './ImageOverlay';

const crs = leaflet.extend({}, leaflet.CRS.Simple, {
  transformation: new leaflet.Transformation(SCALAR[0], 0, SCALAR[1], 0),
});

function HogwartsLegacyLayer() {
  const mapStore = useMapStore();

  return (
    <ImageOverlay
      url={getMapTile(mapStore.hogwartsLevel)}
      bounds={HOGWARTS_BOUNDS}
      zIndex={1}
    />
  );
}

function OverlandLayer() {
  const y = 35000;
  const x = 110000;
  const size = 44100 * 16;
  return (
    <ImageOverlay
      url="/assets/map/T_Map_OverlandPaper_D.png"
      bounds={[
        [y - size, x + size],
        [y, x],
      ]}
      zIndex={0}
    />
  );
}

export default function HogwartsMap({ children }: { children: ReactNode }) {
  return (
    <Map center={BOTTOM_LEFT} bounds={HOGWARTS_BOUNDS} crs={crs}>
      <OverlandLayer />
      <HogwartsLegacyLayer />
      {children}
    </Map>
  );
}
