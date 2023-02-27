import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    global: {
      // Workaround for 13.2 issue "Page changed from static to dynamic at runtime"
      fetch: (...args: any[]) => {
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
);
export default supabase;
