import type leaflet from 'leaflet';

export const HOGWARTS_LEVELS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41,
  42, 43, 44,
];

// Phoenix/Content/UI/HUD/MiniMap/MiniMapTiles/UI_DT_MinimapCollection_Data.uasset
export const SCALAR = [0.324, 0.324];
// Phoenix/Content/UI/HUD/MiniMap/UI_DT_MiniMapParametersHogwarts.uasset
export const BOTTOM_LEFT: leaflet.LatLngExpression = [-434700, 333900];
const WIDTH = 44100;
const HEIGHT = 44100;

export const HOGWARTS_BOUNDS: leaflet.LatLngBoundsExpression = [
  [BOTTOM_LEFT[0], BOTTOM_LEFT[1]],
  [BOTTOM_LEFT[0] - HEIGHT, BOTTOM_LEFT[1] + WIDTH],
];

export const getMapTile = (level: number) => {
  return `/assets/map/Hogwarts/UI_T_MapMini_Hogwarts_Level_${pad(level)}_D.png`;
};
const pad = (value: number) => `0${Math.floor(value)}`.slice(-2);
