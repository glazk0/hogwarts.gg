const unknown = {
  value: 'unknown',
  title: 'Unknown',
  icon: '/assets/icons/unknown.webp',
};

export const creatableNodeTypes = [
  {
    value: 'stairs_up',
    title: 'Stairs Up',
    icon: '/assets/icons/stairs_up.svg',
  },
  {
    value: 'stairs_down',
    title: 'Stairs Down',
    icon: '/assets/icons/stairs_down.svg',
  },
];

export const nodeTypes = [
  ...creatableNodeTypes,
  {
    value: 'treasureChest',
    title: 'Treasure Chest',
    icon: '/assets/icons/UI_T_MiniMap_TreasureChest.png',
  },
];

export const getNodeType = (value: string) =>
  nodeTypes.find((nodeType) => nodeType.value === value) || unknown;
