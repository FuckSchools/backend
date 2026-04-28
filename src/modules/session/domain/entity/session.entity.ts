import { providerEntity } from '@/shared/domain/entity/base.entity.js';
import { z } from 'zod';

const sessionOwnerEnum = z.enum([
  'CODING_AGENT',
  'EXTERNAL_AGENT',
  'BACKGROUND_AGENT',
]);

export const sessionEntity = z.object({
  owner: sessionOwnerEnum,
});

export const sessionProviderEntity = z
  .object({
    projectId: z.uuidv4(),
  })
  .extend(providerEntity.shape);

export type Session = z.infer<typeof sessionEntity>;
export type SessionProvider = z.infer<typeof sessionProviderEntity>;
