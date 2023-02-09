'use client';

import { useNodes } from '#/lib/hooks/use-nodes';
import { getNodeType } from '#/lib/node-types';
import { createNodeTooltip } from '#/lib/tooltips';
import { useRouter, useSearchParams } from 'next/navigation';
import Marker from './Marker';

export default function Nodes({ lang }: { lang: string }) {
  const searchParams = useSearchParams();
  const level = +searchParams.get('level')!;
  const router = useRouter();
  const { data: nodes = [] } = useNodes({ level });

  return (
    <>
      {nodes!.map((node) => (
        <Marker
          key={node.id}
          src={getNodeType(node.type).icon}
          latLng={[node.y, node.x] as [number, number]}
          tooltip={createNodeTooltip(node)}
          onContextMenu={
            ['stairs_up', 'stairs_down'].includes(node.type) &&
            (() => {
              if (node.type === 'stairs_up') {
                router.push(`/${lang}/map/hogwarts?level=${level + 1}`);
              } else if (node.type === 'stairs_down') {
                router.push(`/${lang}/map/hogwarts?level=${level - 1}`);
              }
            })
          }
        />
      ))}
    </>
  );
}
