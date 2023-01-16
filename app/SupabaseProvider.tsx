'use client';

import supabase from '#/lib/supabase-browser';
import type { Session } from '@supabase/auth-helpers-react';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import type { ReactNode } from 'react';

type SupabaseProviderProps = {
  children: ReactNode;
  session: Session | null | undefined;
};
const SupabaseProvider = ({ children, session }: SupabaseProviderProps) => {
  return (
    <SessionContextProvider supabaseClient={supabase} initialSession={session}>
      {children}
    </SessionContextProvider>
  );
};

export default SupabaseProvider;
