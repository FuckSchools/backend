import z from 'zod';

export const providerEntity = z.object({
  id: z.uuidv4(),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
});

export type ProviderEntity = z.infer<typeof providerEntity>;
