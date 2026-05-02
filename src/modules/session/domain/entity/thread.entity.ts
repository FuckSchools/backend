import { providerEntity } from '@/shared/domain/entity/entity.js';
import z from 'zod';

export const threadEntity = z.object({
  goals: z.string(),
});

export const threadProviderEntity = z
  .object({
    sessionId: z.uuidv4(),
  })
  .extend(providerEntity.shape);

export type Thread = z.infer<typeof threadEntity>;
export type ThreadProvider = z.infer<typeof threadProviderEntity>;
export const threadFullEntity = threadEntity.extend(threadProviderEntity.shape);

export type ThreadFull = z.infer<typeof threadFullEntity>;
