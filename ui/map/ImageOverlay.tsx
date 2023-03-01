'use client';
import leaflet from 'leaflet';
import { useEffect } from 'react';
import { useMap } from './Map';

export default function ImageOverlay({
  url,
  bounds,
  zIndex,
}: {
  url: string;
  bounds: leaflet.LatLngBoundsExpression;
  zIndex: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) {
      return;
    }
    const imageOverlay = leaflet.imageOverlay(url, bounds, {
      zIndex,
      opacity: zIndex === 1 ? 0.5 : 1,
    });
    imageOverlay.addTo(map);

    return () => {
      imageOverlay.removeFrom(map);
    };
  }, [url, bounds]);

  return <></>;
}
