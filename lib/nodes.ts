import type { Database } from './database.types';
import { getLocales } from './locales';
import { getZRange } from './map';
import supabase from './supabase-browser';

export const getNodes = async ({
  level,
  language,
}: {
  level: number;
  language: string;
}): Promise<Node[]> => {
  const [bottomZValue, topZValue] = getZRange(level.toString());
  const { data: nodes, error } = await supabase
    .from('nodes')
    .select('*')
    .gte('z', bottomZValue)
    .lt('z', topZValue)
    .eq('world', 'hogwarts');

  if (error) {
    throw error;
  }
  if (!nodes) {
    return [];
  }
  const keys = nodes.filter((node) => node.title).map((node) => node.title!);
  const terms = await getLocales({
    keys,
    language,
  });

  return nodes.map((node) => {
    if (!node.title) {
      return node;
    }
    const term = terms.find((term) => term.key === node.title)!;
    return {
      ...node,
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
  description: string | null;
};
