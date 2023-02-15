import type { Node } from './nodes';

export const createNodeTooltip = (
  node: Pick<Node, 'title' | 'description' | 'nodeType' | 'type'>,
) => {
  let tooltip = '';
  if (node.title) {
    tooltip += `<p class="font-bold">${node.title}</p>`;
  }
  if (node.description) {
    tooltip += `<p class="">${node.description}</p>`;
  }
  tooltip += `<p class="text-brand-400">${node.nodeType.title}</p>`;
  if (['stairs_up', 'stairs_down'].includes(node.type)) {
    tooltip += `<p class="font-bold">Right-click to transit<p>`;
  }
  return tooltip;
};
