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

export const getZRange = (level: string) => {
  const bottom = bottomZValues[level] ?? -100000;
  const top = bottomZValues[(+level + 1).toString()] ?? 0;
  return [bottom, top];
};

export const getLevelByZ = (z: number) => {
  const entry = Object.entries(bottomZValues).find(([level, bottomZ]) => {
    if (bottomZ > z) {
      return false;
    }
    const nextLevel = bottomZValues[(+level + 1).toString()];
    if (nextLevel && nextLevel <= z) {
      return false;
    }
    return true;
  });
  if (entry) {
    return +entry[0];
  }
  return 1;
};
// Phoenix/Content/UI/Map/UI_DT_MiniMapNHogwartsLevelData.uasset
export const bottomZValues: {
  [level: string]: number;
} = {
  '1': -91350.66,
  '2': -90550,
  '3': -89749,
  '4': -88975,
  '5': -88547,
  '6': -88047,
  '7': -87654,
  '8': -87398,
  '9': -86895,
  '10': -86420,
  '11': -85995,
  '12': -85450,
  '13': -84970.15,
  '14': -84600.2,
  '15': -84006.945,
  '16': -83810,
  '17': -83400,
  '18': -82889,
  '19': -82600,
  '20': -82200,
  '21': -81850,
  '22': -81500,
  '23': -81170,
  '24': -80860,
  '25': -80600,
  '26': -80350,
  '27': -80000,
  '28': -79051,
  '29': -78615,
  '30': -78350,
  '31': -78050,
  '32': -77440,
  '33': -76967,
  '34': -75885,
  '35': -75485,
  '36': -75390,
  '37': -74923,
  '38': -74500,
  '39': -74055,
  '40': -73690,
  '41': -73310,
  '42': -72885,
  '43': -71850,
  '44': -71000,
};
