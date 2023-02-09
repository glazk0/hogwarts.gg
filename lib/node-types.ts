const unknown = {
  value: 'unknown',
  title: 'unknownLanguageKey',
  icon: '/assets/icons/unknown.webp',
};
export const nodeTypes = [
  {
    value: 'treasureChest',
    title: 'treasureChestLanguageKey',
    icon: '/assets/icons/UI_T_MiniMap_TreasureChest.png',
  },
];

export const getNodeType = (value: string) =>
  nodeTypes.find((nodeType) => nodeType.value === value) || unknown;
