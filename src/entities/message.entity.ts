import * as z from 'zod';
const messageSenderEnum = z.enum(['HUMAN', 'SYSTEM', 'AI', 'TOOL']);

export const messageEntity = z.object({
  internal: z.object({
    id: z.uuidv4(),
    role: messageSenderEnum,
    content: z.string().nonempty(),
    createdAt: z.date(),
  }),
  external: z.object({
    threadId: z.uuidv4(),
  }),
});

export const messageCreationEntity = messageEntity.shape.internal
  .pick({
    role: true,
    content: true,
  })
  .extend({ threadId: messageEntity.shape.external.shape.threadId });
