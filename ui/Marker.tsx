import CanvasMarker from '#/lib/canvas-marker';
import type leaflet from 'leaflet';
import { useLayoutEffect } from 'react';
import { useMap } from './Map';

export type MarkerProps = {
  latLng: leaflet.LatLngExpression;
  src: string;
  highlight?: boolean;
};

function Marker({ latLng, src, highlight }: MarkerProps) {
  const map = useMap();

  useLayoutEffect(() => {
    const marker = new CanvasMarker(latLng, {
      radius: 10,
      src,
      highlight,
    });
    marker.addTo(map);

    marker.on('click', () => {
      marker.options.highlight = !marker.options.highlight;
      marker.redraw();
    });

    return () => {
      marker.removeFrom(map);
    };
  }, [map, latLng, src, highlight]);

  return <></>;
}

export default Marker;
