'use client';
import CanvasMarker from '#/lib/canvas-marker';
import useDidUpdate from '#/lib/hooks/use-did-update';
import type leaflet from 'leaflet';
import { useEffect, useState } from 'react';
import { useMap } from './Map';

export type MarkerProps = {
  latLng: leaflet.LatLngExpression;
  src: string;
  tooltip?: string;
  highlight?: boolean;
  draggable?: boolean;
  onContextMenu?: false | (() => void);
  onLatLngChange?: (latLng: leaflet.LatLngExpression) => void;
};

function Marker({
  latLng,
  src,
  tooltip,
  highlight,
  draggable,
  onContextMenu,
  onLatLngChange,
}: MarkerProps) {
  const map = useMap();
  const [marker, setMarker] = useState<CanvasMarker | null>(null);

  useEffect(() => {
    if (!map.getPanes().mapPane) {
      return;
    }
    const marker = new CanvasMarker(latLng, {
      radius: 15,
      src,
      highlight,
    });
    marker.addTo(map);
    setMarker(marker);

    return () => {
      setMarker(null);
      marker.removeFrom(map);
    };
  }, [map]);

  useDidUpdate(() => {
    if (!marker) {
      return;
    }
    marker.setLatLng(latLng);
  }, [latLng, marker]);

  useDidUpdate(() => {
    if (!marker) {
      return;
    }
    marker.setSrc(src);
    marker._redraw();
  }, [latLng, src]);

  useDidUpdate(() => {
    if (!marker || !tooltip) {
      return;
    }

    marker.bindTooltip(tooltip, {
      direction: 'top',
      offset: [0, -8],
      permanent: draggable,
    });

    return () => {
      marker.unbindTooltip();
    };
  }, [tooltip, marker]);

  useDidUpdate(() => {
    if (!marker || !onContextMenu) {
      return;
    }
    marker.on('contextmenu', onContextMenu);
    return () => {
      marker.off('contextmenu');
    };
  }, [onContextMenu, marker]);

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

export default Marker;
