import { getNodeType } from './node-types';

export const createNodeTooltip = ({
  type,
  title,
}: {
  type: string;
  title?: string | null;
}) => {
  const nodeType = getNodeType(type);
  let tooltip = '';
  if (title) {
    tooltip += `<p>${title}</p>`;
  }
  tooltip += `<p class="text-brand">${nodeType.title}</p>`;
  if (['stairs_up', 'stairs_down'].includes(type)) {
    tooltip += `<p class="font-bold">Right-click to transit<p>`;
  }
  return tooltip;
};
