import CanvasMarker from '#/lib/canvas-marker';
import type leaflet from 'leaflet';
import { useEffect, useState } from 'react';
import { useMap } from './Map';

export type MarkerProps = {
  latLng: leaflet.LatLngExpression;
  src: string;
  highlight?: boolean;
  draggable?: boolean;
  onLatLngChange?: (latLng: leaflet.LatLngExpression) => void;
};

function Marker({
  latLng,
  src,
  highlight,
  draggable,
  onLatLngChange,
}: MarkerProps) {
  const map = useMap();
  const [marker, setMarker] = useState<CanvasMarker | null>(null);

  useEffect(() => {
    const marker = new CanvasMarker(latLng, {
      radius: 10,
      src,
      highlight,
    });
    marker.addTo(map);
    console.log('memo');

    if (draggable) {
      const handleMapMouseMove = (event: leaflet.LeafletMouseEvent) => {
        onLatLngChange?.([event.latlng.lat, event.latlng.lng]);
      };
      marker.on('mousedown', () => {
        map.dragging.disable();
        map.on('mousemove', handleMapMouseMove);
        map.once('mouseup', () => {
          map.off('mousemove', handleMapMouseMove);
          map.dragging.enable();
        });
      });
    }
    setMarker(marker);

    return () => {
      marker.removeFrom(map);
    };
  }, []);

  useEffect(() => {
    if (marker) {
      marker.setLatLng(latLng);
    }
  }, [latLng, marker]);

  return <></>;
}

export default Marker;
