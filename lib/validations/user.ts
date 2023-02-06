import z from 'zod';

export const userSchema = z.object({
  username: z.string().min(1).max(32),
  description: z.string().min(1).max(2500),
});
