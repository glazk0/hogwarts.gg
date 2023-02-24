'use client';

import supabase from '#/lib/supabase-browser';
import { useEffect } from 'react';

export default function Page() {
  useEffect(() => {
    supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: location.origin + '/overwolf/exit',
      },
    });
  }, []);

  return <></>;
}
