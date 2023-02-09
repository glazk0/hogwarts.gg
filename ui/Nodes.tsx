'use client';

import { useNodes } from '#/lib/hooks/use-nodes';
import { getNodeType } from '#/lib/node-types';
import Marker from './Marker';

export default function Nodes({ level }: { level: number }) {
  const { data: nodes = [] } = useNodes({ level });
  return (
    <>
      {nodes!.map((node) => (
        <Marker
          key={node.id}
          src={getNodeType(node.type).icon}
          title={node.title}
          latLng={[node.y, node.x] as [number, number]}
        />
      ))}
    </>
  );
}
