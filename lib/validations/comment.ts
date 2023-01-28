import z from 'zod';

export const commentSchema = z.object({
  body: z.string().min(3).max(2500),
});
