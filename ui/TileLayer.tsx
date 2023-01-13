'use client';

import type { Coords, TileLayer as LTileLayer } from 'leaflet';
import leaflet from 'leaflet';
import { useEffect } from 'react';
import { useMap } from './Map';

export const BLANK_TILE =
  'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

export type TileLayerProps = {
  getTileUrl: (coords: Coords) => string;
  getTileSize: () => { x: number; y: number };
};
function TileLayer({ getTileUrl, getTileSize }: TileLayerProps) {
  const map = useMap();

  useEffect(() => {
    const CanvasLayer = createCanvasLayer({ getTileUrl, getTileSize });
    const canvasLayer = new CanvasLayer();
    canvasLayer.addTo(map);

    return () => {
      canvasLayer.removeFrom(map);
    };
  }, [map, getTileUrl, getTileSize]);

  return <></>;
}

export default TileLayer;

type Tile = HTMLCanvasElement & { complete: boolean };

const createCanvasLayer = ({
  getTileUrl,
  getTileSize,
}: {
  getTileUrl: (coords: Coords) => string;
  getTileSize: () => { x: number; y: number };
}): new () => LTileLayer =>
  leaflet.TileLayer.extend({
    _delays: {},
    _delaysForZoom: null,
    options: {
      // minNativeZoom: 0,
      // minZoom: -2,
      // maxNativeZoom: 10,
      // maxZoom: 10 + 2,
    },
    getTileUrl,
    getTileSize,
    createCanvas: function (
      tile: Tile,
      coords: Coords,
      done: (err: unknown, tile: Tile) => void,
    ) {
      let err: unknown;
      const ctx = tile.getContext('2d')!;
      const { doubleSize } = this.options;

      const { x: width, y: height } = this.getTileSize();
      tile.width = doubleSize ? width * 2 : width;
      tile.height = doubleSize ? height * 2 : height;

      const img = new Image();
      img.onload = () => {
        try {
          ctx.drawImage(img, 0, 0);
          tile.complete = true;
        } catch (e) {
          err = e;
        } finally {
          done(err, tile);
        }
      };
      const tileZoom = this._getZoomForUrl();
      img.src = isNaN(tileZoom) ? '' : this.getTileUrl(coords);
      img.crossOrigin = 'anonymous';
    },
    createTile: function (coords: Coords, done: () => void) {
      const { timeout } = this.options;
      const { z: zoom } = coords;
      const tile = document.createElement('canvas');

      if (timeout) {
        if (zoom !== this._delaysForZoom) {
          this._clearDelaysForZoom();
          this._delaysForZoom = zoom;
        }

        if (!this._delays[zoom]) this._delays[zoom] = [];

        this._delays[zoom].push(
          setTimeout(() => {
            this.createCanvas(tile, coords, done);
          }, timeout),
        );
      } else {
        this.createCanvas(tile, coords, done);
      }

      return tile;
    },
    _clearDelaysForZoom: function () {
      const prevZoom = this._delaysForZoom;
      const delays = this._delays[prevZoom];

      if (!delays) return;

      delays.forEach((delay: number, index: number) => {
        clearTimeout(delay);
        delete delays[index];
      });

      delete this._delays[prevZoom];
    },
  });
