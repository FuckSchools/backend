import { providerEntity } from '@/shared/domain/entity/entity.js';
import * as z from 'zod';
const messageSenderEnum = z.enum(['HUMAN', 'SYSTEM', 'AI', 'TOOL']);

export const messageEntity = z.object({
  role: messageSenderEnum,
  content: z.string(),
});

export const messageProviderEntity = z
  .object({
    threadId: z.uuidv4(),
  })
  .extend(providerEntity.shape);

export type Message = z.infer<typeof messageEntity>;
export type MessageProvider = z.infer<typeof messageProviderEntity>;
export const messageFullEntity = messageEntity.extend(
  messageProviderEntity.shape,
);

export type MessageFull = z.infer<typeof messageFullEntity>;
