import { ok } from 'assert';
import type { Database } from './database.types';
import supabase from './supabase-browser';

export const getUser = async (userId: string): Promise<User | null> => {
  const { data: user, error } = await supabase
    .from('users')
    .select(
      `
      *,
      user_role:user_roles (
        role
      )
    `,
    )
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!user) {
    return null;
  }

  // It will never be an array because the `user_roles.user_id` is unique
  ok(!Array.isArray(user.user_role));

  const role = user.user_role ? user.user_role.role : 'user';
  return {
    ...user,
    role,
  };
};

export const getUsers = async (): Promise<User[]> => {
  const { data: users, error } = await supabase.from('users').select(
    `
        *, 
        user_role:user_roles (
          role
        )
      `,
  );

  if (error) {
    throw error;
  }

  if (!users) {
    return [];
  }
  return users.map((user) => {
    ok(!Array.isArray(user.user_role));
    const role = user.user_role ? user.user_role.role : 'User';
    return {
      ...user,
      role,
    };
  });
};

export type User = Database['public']['Tables']['users']['Row'] & {
  role: string;
};

export const updateUser = async (
  id: string,
  payload: Partial<Omit<User, 'id' | 'role'>>,
) => {
  return await supabase.from('users').update(payload).eq('id', id);
};
