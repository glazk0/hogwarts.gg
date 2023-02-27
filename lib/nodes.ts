import type { Database } from './database.types';
import { getLocales } from './locales';
import { getLevelByZ, getZRange } from './map';
import { getNodeType } from './node-types';
import supabase from './supabase-browser';

export const getNodes = async ({
  level,
  language,
}: {
  level?: number;
  language: string;
}): Promise<Node[]> => {
  const request = supabase
    .from('nodes')
    .select('*')
    .eq('world', 'hogwarts')
    .order('created_at', { ascending: false });

  if (level) {
    const [bottomZValue, topZValue] = getZRange(level.toString());
    request.gte('z', bottomZValue);
    request.lt('z', topZValue);
  }

  const { data: nodes, error } = await request;

  if (error) {
    throw error;
  }
  if (!nodes) {
    return [];
  }
  const keys = [
    'LOCK_LEVEL_1',
    'LOCK_LEVEL_2',
    'LOCK_LEVEL_3',
    ...nodes
      .filter((node) => node.title)
      .map((node) => node.title!.toUpperCase()),
  ];
  const terms = await getLocales({
    keys,
    language,
  });

  return nodes.map((node) => {
    const nodeType = getNodeType(node.type);
    const level = getLevelByZ(node.z);

    const titleId = node.title;
    const isChest = node.type === 'mediumGearChest';
    const result = { ...node, nodeType, level };
    if (isChest) {
      const title = terms.find((term) => term.key === 'LOCK_LEVEL_1')!.value;
      return {
        ...result,
        titleId,
        title,
      };
    }
    if (!titleId) {
      return { ...result, titleId };
    }
    const term = terms.find((term) => term.key === titleId.toUpperCase())!;
    return {
      ...result,
      titleId,
      title: term.value,
      description: term.description,
    };
  });
};

export const insertNode = async (
  node: Omit<
    Database['public']['Tables']['nodes']['Insert'],
    'id' | 'created_at'
  >,
) => {
  return await supabase.from('nodes').insert(node);
};

export type Node = Database['public']['Tables']['nodes']['Row'] & {
  titleId: string | null;
  description: string | null;
  level: number;
  nodeType: {
    value: string;
    title: string;
    icon: string;
  };
};
