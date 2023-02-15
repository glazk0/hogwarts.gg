const unknown = {
  value: 'unknown',
  title: 'Unknown',
  icon: '/assets/icons/unknown.webp',
};

export const creatableNodeTypes = [
  {
    value: 'text',
    title: 'Text',
    icon: '/assets/icons/unknown.webp',
  },
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
    value: 'disillusionmentChest',
    title: 'Disillusionment Chest',
    icon: '/assets/icons/treasure_chest.png',
  },
  {
    value: 'conjurationsRecipeChest',
    title: 'Conjurations Recipe Chest',
    icon: '/assets/icons/treasure_chest.png',
  },
  {
    value: 'largeGoldSuperChest',
    title: 'Large Gold Super Chest',
    icon: '/assets/icons/treasure_chest.png',
  },
  {
    value: 'mediumGearChest',
    title: 'Medium Gear Chest',
    icon: '/assets/icons/treasure_chest.png',
  },
  {
    value: 'wandskinChest',
    title: 'Wandskin Chest',
    icon: '/assets/icons/treasure_chest.png',
  },
  {
    value: 'houseChest',
    title: 'House Chest',
    icon: '/assets/icons/chest.png',
  },
  {
    value: 'accioPage',
    title: 'Accio Page',
    icon: '/assets/icons/accio_page.png',
  },
  {
    value: 'guardianLeviosa',
    title: 'Winguardian Leviosa',
    icon: '/assets/icons/wingardium.png',
  },
  {
    value: 'mothFrame',
    title: 'Moth Frame',
    icon: '/assets/icons/moth_frame.svg',
  },
  {
    value: 'fastTravelFireplaces',
    title: 'Fast Travel Fireplace',
    icon: '/assets/icons/fast_travel.png',
  },
  {
    value: 'fastTravelSanctuaryHogwarts',
    title: 'Fast Travel Sanctuary',
    icon: '/assets/icons/sanctuary_hogwarts.png',
  },
];

export const getNodeType = (value: string) =>
  nodeTypes.find((nodeType) => nodeType.value === value) || unknown;
