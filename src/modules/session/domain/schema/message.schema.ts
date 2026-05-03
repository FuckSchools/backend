import * as z from 'zod';
const messageSenderEnum = z.enum(['HUMAN', 'SYSTEM', 'AI', 'TOOL']);

export const messageSchema = z.object({
  role: messageSenderEnum,
  content: z.string(),
  threadId: z.uuidv4(),
});

export type Message = z.infer<typeof messageSchema>;
