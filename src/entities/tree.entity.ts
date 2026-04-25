import { z } from 'zod';
import { nodeEntity } from './node.entity.js';
export const treeEntity = z.object({
  internal: z.object({
    id: z.uuidv4(),
    createdAt: z.date(),
  }),
  external: z.object({
    projectId: z.uuidv4(),
    rootNode: nodeEntity.shape.internal.nullable(),
  }),
});

export const treeCreationEntity = treeEntity.shape.internal.pick({}).extend({
  projectId: treeEntity.shape.external.shape.projectId,
});
