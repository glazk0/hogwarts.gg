import z from 'zod';

export const nodeSchema = z.object({
  title: z.string().min(3).max(128).nullable().or(z.literal('')),
  description: z.string().min(3).nullable().or(z.literal('')),
  type: z.string(),
  world: z.string(),
  coordinates: z.number().array().length(2),
});
