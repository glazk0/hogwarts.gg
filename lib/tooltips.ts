import type { Node } from './nodes';

export const createNodeTooltip = (
  node: Pick<Node, 'title' | 'description' | 'nodeType' | 'type'>,
  discovered: boolean | null = null,
) => {
  let tooltip = '';
  if (node.title) {
    tooltip += `<p class="font-bold">${node.title}</p>`;
  }
  if (node.description) {
    tooltip += `<p class="">${node.description}</p>`;
  }
  tooltip += `<p class="text-brand-400">${node.nodeType.title}</p>`;
  if (discovered) {
    tooltip += `<p class="text-bold">Discovered</p>`;
  }
  return tooltip;
};
