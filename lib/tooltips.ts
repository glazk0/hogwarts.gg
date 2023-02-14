import { getNodeType } from './node-types';

export const createNodeTooltip = ({
  type,
  title,
  description,
}: {
  type: string;
  title?: string | null;
  description?: string | null;
}) => {
  const nodeType = getNodeType(type);
  let tooltip = '';
  if (title) {
    tooltip += `<p class="font-bold">${title}</p>`;
  }
  if (description) {
    tooltip += `<p class="">${description}</p>`;
  }
  tooltip += `<p class="text-brand-400">${nodeType.title}</p>`;
  if (['stairs_up', 'stairs_down'].includes(type)) {
    tooltip += `<p class="font-bold">Right-click to transit<p>`;
  }
  return tooltip;
};
