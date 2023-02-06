import z from 'zod';

export const postPatchSchema = z.object({
  title: z.string().min(5).max(128),
  short: z.string().min(10),
  body: z.string().min(16),
  image: z.string().optional(),
  published: z.boolean().optional(),
});
