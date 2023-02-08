'use client';

import Map from '#/ui/Map';
import leaflet from 'leaflet';
import type { ReactNode } from 'react';
import ImageOverlay from './ImageOverlay';

// Phoenix/Content/UI/HUD/MiniMap/MiniMapTiles/UI_DT_MinimapCollection_Data.uasset
const SCALAR = [0.324, 0.324];
// Phoenix/Content/UI/HUD/MiniMap/UI_DT_MiniMapParametersHogwarts.uasset
const BOTTOM_LEFT: leaflet.LatLngExpression = [-434700, 333900];
const WIDTH = 44100;
const HEIGHT = 44100;

const HOGWARTS_BOUNDS: leaflet.LatLngBoundsExpression = [
  [BOTTOM_LEFT[0], BOTTOM_LEFT[1]],
  [BOTTOM_LEFT[0] - HEIGHT, BOTTOM_LEFT[1] + WIDTH],
];

const crs = leaflet.extend({}, leaflet.CRS.Simple, {
  transformation: new leaflet.Transformation(SCALAR[0], 0, SCALAR[1], 0),
});

function HogwartsLegacyLayer({ level }: { level: number }) {
  return (
    <ImageOverlay
      url={`/assets/map/Hogwarts/UI_T_MapMini_Hogwarts_Level_${pad(
        level,
      )}_D.png`}
      bounds={HOGWARTS_BOUNDS}
    />
  );
}

const pad = (value: number) => `0${Math.floor(value)}`.slice(-2);

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
