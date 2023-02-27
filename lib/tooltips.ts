import type { Node } from './nodes';

export const createNodeTooltip = (
  node: Pick<Node, 'id' | 'title' | 'description' | 'nodeType' | 'type'>,
  discovered: boolean | null = null,
) => {
  let tooltip = '';
  if (node.title) {
    tooltip += `<p class="font-bold">${node.title}</p>`;
  }
  if (node.description) {
    tooltip += `<p>${node.description}</p>`;
  }
  tooltip += `<p class="text-brand-400">${node.nodeType.title}</p>`;
  if (discovered) {
    tooltip += `<p class="text-bold">Discovered</p>`;
  }
  if (process.env.NODE_ENV === 'development') {
    tooltip += `<p class="text-xs text-gray-400">${node.id}</p>`;
  }
  return tooltip;
};
