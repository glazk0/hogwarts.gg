'use client';

import leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { ReactNode } from 'react';
import {
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

type MapProps = {
  center: leaflet.LatLngExpression;
  crs?: leaflet.CRS;
  children?: ReactNode;
};
export function Map({ center, children, crs = leaflet.CRS.Simple }: MapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<leaflet.Map | null>(null);

  useLayoutEffect(() => {
    const map = leaflet.map(containerRef.current!, {
      attributionControl: false,
      crs,
    });
    map.setView(center, 4);

    setMap(map);

    return () => {
      map.remove();
    };
  }, []);

  return (
    <>
      <div ref={containerRef} className="h-full w-full" />
      {map && <MapContext.Provider value={map}>{children}</MapContext.Provider>}
    </>
  );
}

const MapContext = createContext<leaflet.Map>({} as unknown as leaflet.Map);

export const useMap = () => {
  return useContext(MapContext);
};
