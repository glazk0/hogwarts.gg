import supabase from '#/lib/supabase-browser';
import { type Database } from './database.types';

export const getLocales = async ({
  keys,
  language,
}: {
  keys: string[];
  language: string;
}): Promise<Locale[]> => {
  const request = supabase
    .from('locales')
    .select('*')
    .eq('language', language)
    .in('key', keys);

  const { data: locales, error } = await request;

  if (error) {
    throw error;
  }

  if (!locales) {
    return [];
  }

  return locales;
};

export type Locale = Database['public']['Tables']['locales']['Row'];
