'use client';

import { useNodes } from '#/lib/hooks/use-nodes';
import { useSavegamePlayer } from '#/lib/hooks/use-savegame-player';
import { getNodeType } from '#/lib/node-types';
import type { Node } from '#/lib/nodes';
import { createNodeTooltip } from '#/lib/tooltips';
import { useSearchParams } from 'next/navigation';
import Marker from './Marker';
import Text from './Text';

export default function Nodes({ lang }: { lang: string }) {
  const searchParams = useSearchParams()!;
  const level = +searchParams.get('level')!;
  const { data: nodes = [] } = useNodes({ level, language: lang });
  const { data: player } = useSavegamePlayer();

  function isDiscovered(node: Node) {
    if (!player) {
      return null;
    }
    if (
      node.type === 'fastTravelFireplaces' ||
      node.type === 'fastTravelSanctuaryHogwarts'
    ) {
      return player.locations.hogwarts.fastTravels.values.includes(node.id);
    }
    if (node.type === 'guardianLeviosa' || node.type === 'accioPage') {
      return player.locations.hogwarts.collections.values.includes(node.id);
    }
    if (node.type === 'kio') {
      return player.locations.hogwarts.fieldGuidePages.values.includes(node.id);
    }
    return null;
  }
  return (
    <>
      {nodes!.map((node) => {
        if (node.type === 'text') {
          return (
            <Text key={node.id} latLng={[node.y, node.x]}>
              {node.title!}
            </Text>
          );
        }
        const discovered = isDiscovered(node);
        const nodeType = getNodeType(node.type);
        return (
          <Marker
            key={node.id}
            src={(discovered && nodeType.discoveredIcon) || nodeType.icon}
            latLng={[node.y, node.x] as [number, number]}
            tooltip={createNodeTooltip(node, isDiscovered(node))}
          />
        );
      })}
    </>
  );
}
