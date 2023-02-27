import useSWR from 'swr';
import supabase from '../supabase-browser';
import { getUser } from '../users';

export function useMe() {
  return useSWR('me', () =>
    supabase.auth.getSession().then(({ data: { session } }) => {
      return session ? getUser(session.user.id) : null;
    }),
  );
}
