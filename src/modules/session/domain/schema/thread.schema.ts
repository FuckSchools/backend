import z from 'zod';

export const threadSchema = z.object({
  goals: z.string(),
});


export type Thread = z.infer<typeof threadSchema>;