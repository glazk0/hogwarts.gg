import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { cookies, headers } from 'next/headers';
import type { Database } from './database.types';

const createClient = () =>
  createServerComponentSupabaseClient<Database>({
    headers,
    cookies,
  });
export default createClient;
