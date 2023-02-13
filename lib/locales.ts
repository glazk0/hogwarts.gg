import { type languages } from '../lib/i18n/settings';
import { type Database } from './database.types';
import supabase from '#/lib/supabase-browser';

export const getLocale = async ({
  key,
  language,
}: {
  key: string;
  language: languages;
}): Promise<Locale | null> => {
  const request = supabase
    .from('locales')
    .select('*')
    .match({ key, language })
    .maybeSingle();

  const { data: locale, error } = await request;

  if (error) {
    throw error;
  }

  if (!locale) {
    return null;
  }

  return locale;
};

export type Locale = Database['public']['Tables']['locales']['Row'];
