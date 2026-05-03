import z from 'zod';

export const threadSchema = z.object({
  goals: z.string(),
  sessionId: z.uuidv4(),
});

export type Thread = z.infer<typeof threadSchema>;
