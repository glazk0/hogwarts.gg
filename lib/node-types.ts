export const nodeTypes = [
  {
    value: 'jobberknoll-feather',
    title: 'Jobberknoll Feather',
    icon: 'https://aeternum-map.gg/pois/gold.webp',
  },
  {
    value: 'niffler-fur',
    title: 'Niffler Fur',
    icon: 'https://aeternum-map.gg/pois/silver.webp',
  },
  {
    value: 'toad-warts',
    title: 'Toad Warts',
    icon: 'https://aeternum-map.gg/pois/iron.webp',
  },
];

export const getNodeType = (value: string) =>
  nodeTypes.find((nodeType) => nodeType.value === value);
