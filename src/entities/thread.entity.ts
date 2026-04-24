import { z } from 'zod';

const messageSenderEnum = z.enum(['HUMAN', 'SYSTEM', 'AI', 'TOOL']);

export const messageEntity = z.object({
  internal: z.object({
    id: z.uuidv4(),
    sender: messageSenderEnum,
    content: z.string().nonempty(),
    createdAt: z.date(),
  }),
  external: z.object({}),
});

export const threadEntity = z.object({
  internal: z.object({
    id: z.uuidv4(),
    createdAt: z.date(),
  }),
  external: z.object({
    messages: z.array(messageEntity.shape.internal),
  }),
});
