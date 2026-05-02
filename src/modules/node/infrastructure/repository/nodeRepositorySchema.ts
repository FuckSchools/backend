import z from 'zod';
import {
  nodeFullEntity,
  rootNodeFullEntity,
} from '../../domain/entity/node.entity.js';

export const nodeRepositorySchema = nodeFullEntity.extend({
  blocker: z.string().nullish(),
  parentId: z.uuidv4().nullable(),
  projectId: z.uuidv4().nullable(),
});
export const rootNodeRepositorySchema = rootNodeFullEntity.extend({
  blocker: z.string().nullish(),
  parentId: z.uuidv4().nullable(),
  projectId: z.uuidv4().nullable(),
});

export type NodeRepositoryType = z.infer<typeof nodeRepositorySchema>;
export type RootNodeRepositoryType = z.infer<typeof rootNodeRepositorySchema>;
