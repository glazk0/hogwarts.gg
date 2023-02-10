import type { Database } from './database.types';
import { getZRange } from './map';
import supabase from './supabase-browser';

export const getNodes = async ({
  level,
}: {
  level: number;
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
  return nodes;
};

export const insertNode = async (
  node: Omit<
    Database['public']['Tables']['nodes']['Insert'],
    'id' | 'created_at'
  >,
) => {
  return await supabase.from('nodes').insert(node);
};

export type Node = Database['public']['Tables']['nodes']['Row'];
