'use client';
import leaflet from 'leaflet';
import { useEffect } from 'react';
import { useMap } from './Map';

export default function ImageOverlay({
  url,
  bounds,
}: {
  url: string;
  bounds: leaflet.LatLngBoundsExpression;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) {
      return;
    }
    const imageOverlay = leaflet.imageOverlay(url, bounds);
    imageOverlay.addTo(map);

    return () => {
      imageOverlay.removeFrom(map);
    };
  }, [map, url, bounds]);

  return <></>;
}
