import { z } from 'zod';
import { nodeEntity } from './node.entity.js';
export const treeEntity = z.object({
  internal: z.object({
    id: z.uuidv4(),
  }),
  external: z.object({
    rootNode: nodeEntity.shape.internal.nullable(),
  }),
});
