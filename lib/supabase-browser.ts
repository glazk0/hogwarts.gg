import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from './database.types';

const supabase = createBrowserSupabaseClient<Database>({
  options: {
    global: {
      // Workaround for 13.2 issue "Page changed from static to dynamic at runtime"
      fetch: (...args) => {
        const [path, options] = args;

        return fetch(path, {
          ...options,
          cache: 'force-cache',
        });
      },
    },
  },
});
export default supabase;
