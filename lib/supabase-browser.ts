import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from './database.types';

const supabase = createBrowserSupabaseClient<Database>();
export default supabase;
