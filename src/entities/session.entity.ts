import { z } from 'zod';
import { threadEntity } from './thread.entity.js';

const sessionOwnerEnum = z.enum([
  'CODING_AGENT',
  'EXTERNAL_AGENT',
  'BACKGROUND_AGENT',
]);

export const sessionEntity = z.object({
  internal: z.object({
    id: z.uuidv4(),
    owner: sessionOwnerEnum,
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
  external: z.object({
    projectId: z.uuidv4(),
    threads: z.array(threadEntity.shape.internal),
  }),
});

export const sessionCreationEntity = sessionEntity.shape.internal
  .pick({
    owner: true,
  })
  .extend({ projectId: sessionEntity.shape.external.shape.projectId });
