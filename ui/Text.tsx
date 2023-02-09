'use client';
import useDidUpdate from '#/lib/hooks/use-did-update';
import leaflet from 'leaflet';
import { useEffect, useState } from 'react';
import { useMap } from './Map';

export default function Text({
  latLng,
  children,
  draggable,
  onLatLngChange,
}: {
  latLng: leaflet.LatLngExpression;
  children: string;
  draggable?: boolean;
  onLatLngChange?: (latLng: leaflet.LatLngExpression) => void;
}) {
  const map = useMap();
  const [marker, setMarker] = useState<leaflet.Marker | null>(null);

  useEffect(() => {
    if (!map.getPanes().mapPane) {
      return;
    }
    const divIcon = leaflet.divIcon({
      className: 'font-mono text-lg drop-shadow-md text-center !w-auto',
      html: children,
    });
    const marker = leaflet.marker(latLng, {
      icon: divIcon,
      interactive: draggable,
    });

    marker.addTo(map);
    setMarker(marker);
    return () => {
      setMarker(null);
      marker.removeFrom(map);
    };
  }, [map, latLng, children, draggable]);

  useDidUpdate(() => {
    if (!draggable || !marker) {
      return;
    }
    const handleMapMouseMove = (event: leaflet.LeafletMouseEvent) => {
      onLatLngChange?.([
        +event.latlng.lat.toFixed(2),
        +event.latlng.lng.toFixed(2),
      ]);
    };
    const handleMouseDown = () => {
      map.dragging.disable();
      map.on('mousemove', handleMapMouseMove);
      map.once('mouseup', () => {
        map.off('mousemove', handleMapMouseMove);
        map.dragging.enable();
      });
    };
    marker.on('mousedown', handleMouseDown);
    return () => {
      marker.off('mousedown', handleMouseDown);
      map.off('mousemove', handleMapMouseMove);
    };
  }, [draggable, marker]);

  return <></>;
}
