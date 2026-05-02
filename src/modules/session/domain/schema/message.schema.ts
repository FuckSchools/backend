import * as z from 'zod';
const messageSenderEnum = z.enum(['HUMAN', 'SYSTEM', 'AI', 'TOOL']);

export const messageSchema = z.object({
  role: messageSenderEnum,
  content: z.string(),
});

export type Message = z.infer<typeof messageSchema>;
