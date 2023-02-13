import { type languages } from '../lib/i18n/settings';
import { type Database } from './database.types';
import supabase from '#/lib/supabase-browser';

export const getLocale = async ({
  key,
  language,
}: {
  key: string;
  language: languages;
}): Promise<
  | (Locale & {
      description: string;
    })
  | null
> => {
  const request = supabase
    .from('locales')
    .select('*')
    // TODO: use supabase match ? didn't work for me
    .in('key', [key, `${key}_desc`])
    .eq('language', language);

  const { data, error } = await request;

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  const [locale, description] = data;

  return {
    ...locale,
    description: description?.value ?? '',
  };
};

export type Locale = Database['public']['Tables']['locales']['Row'];
