import { uuidv4, z } from 'zod';
import { sessionEntity } from './session.entity.js';
import { treeEntity } from './tree.entity.js';

export const projectEntity = z.object({
  internal: z.object({
    id: uuidv4(),
    title: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
  external: z.object({
    userId: z.uuidv4(),
    tree: treeEntity.shape.internal.nullable(),
    sessions: z.array(sessionEntity.shape.internal),
  }),
  special: z.object({
    sandboxExId: z.string().nullish(),
  }),
});

export const projectCreationEntity = projectEntity.shape.internal
  .pick({
    title: true,
  })
  .extend({ userId: projectEntity.shape.external.shape.userId });
