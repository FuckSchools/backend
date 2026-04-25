import { z } from 'zod';
import { messageEntity } from './message.entity.js';

export const threadEntity = z.object({
  internal: z.object({
    id: z.uuidv4(),
    createdAt: z.date(),
  }),
  external: z.object({
    sessionId: z.uuidv4(),
    messages: z.array(messageEntity.shape.internal),
  }),
});

export const threadCreationEntity = threadEntity.shape.internal
  .pick({})
  .extend({ sessionId: threadEntity.shape.external.shape.sessionId });
