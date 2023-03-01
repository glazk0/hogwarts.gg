import type { Database } from './database.types';
import { getLocales } from './locales';
import { getLevelByZ } from './map';
import { getNodeType } from './node-types';
import supabase from './supabase-browser';

export const getNodes = async ({
  language,
}: {
  language: string;
}): Promise<Node[]> => {
  const request = supabase
    .from('nodes')
    .select('*')
    .order('created_at', { ascending: false });

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
    const level = node.world === 'hogwarts' ? getLevelByZ(node.z) : null;

    const titleId = node.title;
    const isChest = node.type === 'mediumGearChest';
    const result = { ...node, nodeType, level };
    if (isChest) {
      // Not sure how to find out which lock level is correct
      // const title = terms.find((term) => term.key === 'LOCK_LEVEL_1')!.value;
      // return {
      //   ...result,
      //   title,
      //   titleId,
      // };
    }
    if (!titleId) {
      return { ...result, titleId };
    }
    const term = terms.find((term) => term.key === titleId.toUpperCase())!;
    return {
      ...result,
      title: term.value,
      titleId,
      description: term.description,
    };
  });
};

export const insertNode = async (
  node: Omit<Database['public']['Tables']['nodes']['Insert'], 'created_at'>,
) => {
  return await supabase.from('nodes').insert(node);
};

export type Node = Database['public']['Tables']['nodes']['Row'] & {
  description: string | null;
  level: number | null;
  titleId: string | null;
  nodeType: {
    value: string;
    title: string;
    icon: string;
  };
};
