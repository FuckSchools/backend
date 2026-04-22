import { z } from 'zod';

const messageSenderEnum = z.enum(['HUMAN', 'SYSTEM', 'AI', 'TOOL']);

export const messageEntity = z.object({
  id: z.string().nonempty(),
  sender: messageSenderEnum,
  content: z.string().optional().default(''),
  createdAt: z.date(),
});

export const threadEntity = z.object({
  id: z.string().nonempty(),
  messages: z.array(messageEntity).optional().default([]),
  createdAt: z.date(),
});
