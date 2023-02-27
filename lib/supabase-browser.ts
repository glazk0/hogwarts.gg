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
          cache:
            process.env.NODE_ENV &&
            process.env.NEXT_PHASE !== 'phase-production-build'
              ? 'force-cache'
              : 'default',
        });
      },
    },
  },
});
export default supabase;

// @ts-ignore
window.supabase = supabase;
