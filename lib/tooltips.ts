import type { Node } from './nodes';

export const createNodeTooltip = (
  node: Pick<
    Node,
    'id' | 'title' | 'titleId' | 'description' | 'nodeType' | 'type'
  >,
  discovered: boolean | null = null,
) => {
  let tooltip = '';
  if (node.type === 'kio') {
    tooltip += `<img class="block mx-auto overflow-hidden" src="/assets/UI_T_CollectionsCard_BackBorder.png" width="256" height="256" style="background-image: url(/assets/lore/UI_T_${node.titleId}.png); background-size: 246px 246px; background-repeat: no-repeat; background-position: center;"/>`;
  }

  if (node.title) {
    tooltip += `<p class="font-bold">${node.title}</p>`;
  }
  if (node.description) {
    tooltip += `<p class="whitespace-normal w-80">${node.description}</p>`;
  }
  tooltip += `<p class="text-brand-400">${node.nodeType.title}</p>`;
  if (discovered) {
    tooltip += `<p class="text-bold text-discovered">Discovered</p>`;
  }
  if (process.env.NODE_ENV === 'development') {
    tooltip += `<p class="text-xs text-gray-400 truncate">${node.id}</p>`;
  }

  return tooltip;
};
